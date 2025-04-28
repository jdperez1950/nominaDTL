import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {AbstractControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormlyMatDatepickerModule } from '@ngx-formly/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardModule } from '@angular/material/card';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { DateTime } from 'luxon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ContratoService } from '../../../services/ContratoService';
import { ProyectoService } from '../../../services/ProyectoService';
import { PersonaService } from '../../../services/PersonaService';
import { TipoContratoService } from '../../../services/TipoContratoService';
import { PeriodicidadPagoService } from '../../../services/PeriodicidadPagoService';
import {AuthService} from "../../../services/auth-service.service";
import {distinctUntilChanged, forkJoin, map, Observable, of, throwError} from "rxjs";
import {catchError, switchMap} from "rxjs/operators";

interface ContratoModel {
  /** id de la entidad */
  id: number;
  /** numeroContrato de la entidad */
  numeroContrato: string;
  /** cargo de la entidad */
  cargo: string;
  /** valorTotalContrato de la entidad */
  valorTotalContrato: number;
  /** numeroPagos de la entidad */
  numeroPagos: number;
  /** fechaInicioContrato de la entidad */
  fechaInicioContrato: Date;
  /** fechaFinContrato de la entidad */
  fechaFinContrato: Date;
  /** estado de la entidad */
  estado: boolean;
  /** contrato de la entidad */
  contratoPdf: any;
  /** firmado de la entidad */
  firmado: boolean;
  /** creador de la entidad */
  creador: string;
  /** proyecto de la entidad */
  proyecto: any;
  /** persona de la entidad */
  persona: any;
  /** tipoContrato de la entidad */
  tipoContrato: any;
  /** periodicidadPago de la entidad */
  periodicidadPago: any;
  /** observaciones de la entidad */
  observaciones?: string;
  /** archivosAdicionales de la entidad */
  archivosAdicionales?: any;
}

/**
 * Componente para la actualización de Contrato
 * @description Maneja el formulario de actualización utilizando Formly
 */
@Component({
  selector: 'app-actualizar-contrato',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormlyModule,
    FormlyMaterialModule,
    FormlyMatDatepickerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatTabsModule,
    MatProgressBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './actualizar-contrato.component.html',
  styleUrls: ['./actualizar-contrato.component.scss']
})
export class ActualizarContratoComponent implements OnInit {
  /** Lista de todas las entidades */
  contratos: any[] = [];
  /** Lista de proyecto disponibles */
  proyectos: any[] = [];
  /** Lista de persona disponibles */
  personas: any[] = [];
  /** Lista de tipoContrato disponibles */
  tipoContratos: any[] = [];
  /** Lista de periodicidadPago disponibles */
  periodicidadPagos: any[] = [];
  /** Entidad seleccionada para actualizar */
  selectedContrato: any = null;
  form = new FormGroup({});
  model: ContratoModel = {} as ContratoModel;
  originalModel: ContratoModel = {} as ContratoModel;
  fields: FormlyFieldConfig[] = [];
  isLoading: boolean = false;

  /**
   * Constructor del componente
   * @param contratoService Servicio principal de la entidad
   * @param proyectoService Servicio para gestionar Proyecto
   * @param personaService Servicio para gestionar Persona
   * @param tipoContratoService Servicio para gestionar TipoContrato
   * @param periodicidadPagoService Servicio para gestionar PeriodicidadPago
   * @param router Servicio de enrutamiento
   * @param snackBar Servicio para notificaciones
   * @param authService
   * @param data Datos recibidos por el diálogo
   * @param dialogRef Referencia al diálogo
   */
  constructor(
    private contratoService: ContratoService,
    private proyectoService: ProyectoService,
    private personaService: PersonaService,
    private tipoContratoService: TipoContratoService,
    private periodicidadPagoService: PeriodicidadPagoService,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService,
  @Inject(MAT_DIALOG_DATA) public data: any,
  private dialogRef: MatDialogRef<ActualizarContratoComponent>
) {}

  /** Inicialización del componente */
  ngOnInit() {
    this.loadContratos();
    this.loadProyectoOptions();
    this.loadTipoContratoOptions();
    this.loadPeriodicidadPagoOptions();

    // Verificamos si llega data a través del diálogo (registro para editar)
    if (this.data) {
      try {
        this.selectedContrato = { ...this.data };
        // Inicializar modelo con los datos recibidos
        this.model = {
          id: this.data.id,
          numeroContrato: this.data.numeroContrato,
          cargo: this.data.cargo,
          valorTotalContrato: this.data.valorTotalContrato,
          numeroPagos: this.data.numeroPagos,
          fechaInicioContrato: this.data.fechaInicioContrato,
          fechaFinContrato: this.data.fechaFinContrato,
          estado: this.data.estado,
          contratoPdf: this.data.contratoPdf,
          firmado: this.data.firmado,
          creador: this.data.creador,
          proyecto: this.data.proyecto && this.data.proyecto.id ? this.data.proyecto.id : null,
          persona: this.data.persona && this.data.persona.id ? this.data.persona.id : null,
          tipoContrato: this.data.tipoContrato && this.data.tipoContrato.id ? this.data.tipoContrato.id : null,
          periodicidadPago: this.data.periodicidadPago && this.data.periodicidadPago.id ? this.data.periodicidadPago.id : null,
          observaciones: this.data.observaciones || '',
          archivosAdicionales: this.data.archivosAdicionales || ''
        };

        // Copia del modelo original para detectar cambios
        this.originalModel = {
          id: this.data.id,
          numeroContrato: this.data.numeroContrato,
          cargo: this.data.cargo,
          valorTotalContrato: this.data.valorTotalContrato,
          numeroPagos: this.data.numeroPagos,
          fechaInicioContrato: this.data.fechaInicioContrato,
          fechaFinContrato: this.data.fechaFinContrato,
          estado: this.data.estado,
          contratoPdf: this.data.contratoPdf,
          firmado: this.data.firmado,
          creador: this.data.creador,
          proyecto: this.data.proyecto && this.data.proyecto.id ? this.data.proyecto.id : null,
          persona: this.data.persona && this.data.persona.id ? this.data.persona.id : null,
          tipoContrato: this.data.tipoContrato && this.data.tipoContrato.id ? this.data.tipoContrato.id : null,
          periodicidadPago: this.data.periodicidadPago && this.data.periodicidadPago.id ? this.data.periodicidadPago.id : null,
          observaciones: this.data.observaciones || '',
          archivosAdicionales: this.data.archivosAdicionales || ''
        };
      } catch (error) {
        console.error('Error al procesar datos:', error);
      }
    }
    this.generateFormFields();
  }

  /** Carga la lista de entidades disponibles */
  loadContratos() {
    this.contratoService.findAll().subscribe(
      data => this.contratos = data,
      error => console.error(error)
    );
  }

  /**
   * Carga las opciones para la relación Proyecto
   * @private
   */
  private loadProyectoOptions() {
    this.proyectoService.findAll().subscribe(
      data => {
        const field = this.fields.find(f => f.key === 'proyecto');
        if (field && field.templateOptions) {
          field.templateOptions.options = data;
        }
      },
      error => console.error('Error al cargar proyecto:', error)
    );
  }

  /**
   * Carga las opciones para la relación Persona
   * @private
   */
  private loadPersonaOptions(id:number) {
    this.personaService.obtenerPersonasPorProyecto(id).subscribe(
      data => {
        // Ordenar alfabéticamente por nombre
        data.sort((a: any, b: any) => a.nombre.localeCompare(b.nombre));
        const field = this.fields.find(f => f.key === 'persona');
        if (field && field.templateOptions) {
          field.templateOptions.options = data;
        }
      },
      error => console.error('Error al cargar persona:', error)
    );
  }

  /**
   * Carga las opciones para la relación TipoContrato
   * @private
   */
  private loadTipoContratoOptions() {
    this.tipoContratoService.findAll().subscribe(
      data => {
        const field = this.fields.find(f => f.key === 'tipoContrato');
        if (field && field.templateOptions) {
          field.templateOptions.options = data;
        }
      },
      error => console.error('Error al cargar tipoContrato:', error)
    );
  }

  /**
   * Carga las opciones para la relación PeriodicidadPago
   * @private
   */
  private loadPeriodicidadPagoOptions() {
    this.periodicidadPagoService.findAll().subscribe(
      data => {
        const field = this.fields.find(f => f.key === 'periodicidadPago');
        if (field && field.templateOptions) {
          field.templateOptions.options = data;
        }
      },
      error => console.error('Error al cargar periodicidadPago:', error)
    );
  }

  /**
   * Actualiza las opciones de un campo tipo select en el formulario
   */
  private updateFieldOptions(key: string, options: any[]) {
    const field = this.fields.find(f => f.key === key);
    if (field && field.templateOptions) {
      field.templateOptions.options = options;
    }
  }

  /**
   * Maneja la edición de un registro existente
   */
  onEdit(contrato: any) {
    this.selectedContrato = { ...contrato };
    this.model = { ...this.selectedContrato };
    // Procesar relación simple: proyecto
    if (this.model.proyecto && typeof this.model.proyecto === 'object') {
      this.model.proyecto = this.model.proyecto.id;
    }
    // Procesar relación simple: persona
    if (this.model.persona && typeof this.model.persona === 'object') {
      this.model.persona = this.model.persona.id;
    }
    // Procesar relación simple: tipoContrato
    if (this.model.tipoContrato && typeof this.model.tipoContrato === 'object') {
      this.model.tipoContrato = this.model.tipoContrato.id;
    }
    // Procesar relación simple: periodicidadPago
    if (this.model.periodicidadPago && typeof this.model.periodicidadPago === 'object') {
      this.model.periodicidadPago = this.model.periodicidadPago.id;
    }
    this.generateFormFields();
  }

  /**
   * Genera la configuración de campos del formulario
   */
  generateFormFields() {
    this.fields = [
      {
        key: 'numeroContrato',
        type: 'input',
        className: 'field-container',
        templateOptions: {
          label: 'Número de Contrato',
          placeholder: 'Ingrese número de contrato',
          required: true,
          appearance: 'outline',
          floatLabel: 'always',
          attributes: {
            'class': 'modern-input'
          }
        },
        validation: {
          messages: {
            required: 'El número de contrato es obligatorio.'
          }
        }
      },
      {
        key: 'cargo',
        type: 'input',
        className: 'field-container',
        templateOptions: {
          label: 'Cargo',
          placeholder: 'Ingrese cargo',
          required: true,
          appearance: 'outline',
          floatLabel: 'always',
          attributes: {
            'class': 'modern-input'
          },
          pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
          minLength:3,
          maxLength:50
        },
        validation: {
          messages: {
            required: 'El cargo es obligatorio.',
            minlength: 'El cargo debe tener al menos 3 caracteres.',
            pattern: 'El cargo solo puede contener letras.'
          }
        }
      },
      {
        key: 'valorTotalContrato',
        type: 'input',
        className: 'field-container',
        templateOptions: {
          label: 'Valor Total Contrato',
          placeholder: 'Ingrese valor total contrato',
          required: true,
          appearance: 'outline',
          floatLabel: 'always',
          attributes: {
            'class': 'modern-input'
          },
          min: 0,
          max: 9007199254740991
        },
        validators: {
          validation: [Validators.required, Validators.min(0)]
        },
        validation: {
          messages: {
            required: 'El valor total del contrato es obligatorio.',
            min: 'El valor del contrato debe ser mayor o igual a 0.'
          }
        },
        hooks: {
          onInit: (field: FormlyFieldConfig) => {
            field.formControl?.valueChanges
              .pipe(
                distinctUntilChanged(),
                map(value => {
                  // Ensure value is a string
                  const stringValue = String(value);

                  // Eliminar caracteres no numéricos
                  const numericValue = stringValue.replace(/[^\d]/g, '');

                  // Formatear como moneda colombiana si hay valor
                  return numericValue
                    ? new Intl.NumberFormat('es-CO', {
                      style: 'currency',
                      currency: 'COP',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }).format(Number(numericValue))
                    : '';
                })
              )
              .subscribe(formattedValue => {
                field.formControl?.setValue(formattedValue, { emitEvent: false });
              });
          }
        }
      },
      {
        key: 'numeroPagos',
        type: 'number',
        className: 'field-container',
        templateOptions: {
          label: 'NumeroPagos',
          placeholder: 'Ingrese numeroPagos',
          required: true,
          appearance: 'outline',
          floatLabel: 'always',
          attributes: {
            'class': 'modern-input'
          },
          min: 0,
          max: 2147483647,
          step: 1
        },
        validation: {
          messages: {
            required: 'El número de pagos es obligatorio.',
            min: 'El número de pagos debe ser mayor o igual a 0.',
            max: 'El número de pagos es demasiado grande.'
          }
        }
      },
      {
        key: 'fechaInicioContrato',
        type: 'datepicker',
        className: 'field-container',
        templateOptions: {
          label: 'Fecha de inicio del contrato',
          placeholder: 'Ingrese la fecha de inicio del contrato',
          required: true,
          appearance: 'outline',
          floatLabel: 'always',
          attributes: {
            'class': 'modern-input'
          }
        },
        validators: {
          dateValidation: {
            expression: (control: AbstractControl): boolean => {
              const fechaInicio = control.value;
              const fechaFin = this.model.fechaFinContrato;
              return !fechaFin || !fechaInicio || new Date(fechaInicio) <= new Date(fechaFin);
            },
            message: 'La fecha de inicio del contrato debe ser anterior o igual a la fecha de finalización.'
          }
        },
        validation: {
          messages: {
            required: 'La fecha de inicio del contrato es obligatoria.'
          }
        }
      },
      {
        key: 'fechaFinContrato',
        type: 'datepicker',
        className: 'field-container',
        templateOptions: {
          label: 'Fecha de finalizacion del contrato',
          placeholder: 'Ingrese la fecha de finalizacion del contrato',
          required: true,
          appearance: 'outline',
          floatLabel: 'always',
          attributes: {
            'class': 'modern-input'
          }
        },
        validators: {
          dateValidation: {
            expression: (control: AbstractControl): boolean => {
              const fechaInicio = this.model.fechaInicioContrato;
              const fechaFin = control.value;
              return !fechaFin || !fechaInicio || new Date(fechaFin) >= new Date(fechaInicio);
            },
            message: 'La fecha de finalización del contrato debe ser posterior o igual a la fecha de inicio.'
          }
        },
        validation: {
          messages: {
            required: 'La fecha de finalización del contrato es obligatoria.'
          }
        }
      },
      {
        key: 'estado',
        type: 'select',
        className: 'field-container',
        templateOptions: {
          label: 'Estado',
          placeholder: 'Ingrese estado',
          required: true,
          appearance: 'outline',
          floatLabel: 'always',
          attributes: {
            'class': 'modern-input'
          },
          options: [{ value: true, label: 'En curso' }, { value: false, label: 'Finalizado' }]
        },
        validation: {
          messages: {
            required: 'El estado es obligatorio.'
          }
        }
      },
      {
        key: 'contratoPdf',
        type: 'file',
        templateOptions: {
          label: 'Contrato PDF',
          placeholder: 'Ingrese el contrato en PDF',
          required: true,
          multiple: true,
          accept: '.pdf,.doc,.xls',
          maxFileSize: 5 * 1024 * 1024
        },
        validation: {
          messages: {
            required: 'El archivo del contrato es obligatorio.',
            maxFileSize: 'El tamaño del archivo no puede exceder 5MB'
          }
        }
      },
      {
        key: 'firmado',
        type: 'select',
        className: 'field-container',
        templateOptions: {
          label: 'Firmado',
          placeholder: 'Ingrese firmado',
          required: true,
          appearance: 'outline',
          floatLabel: 'always',
          attributes: {
            'class': 'modern-input'
          },
          options: [{ value: true, label: 'Aprobado' }, { value: false, label: 'Pendiente' }]
        },
        validation: {
          messages: {
            required: 'El estado de firma es obligatorio.'
          }
        }
      },
      {
        key: 'creador',
        type: 'input',
        className: 'field-container',
        templateOptions: {
          label: 'Creador',
          placeholder: 'Ingrese creador',
          required: false,
          appearance: 'outline',
          floatLabel: 'always',
          disabled: true,
          attributes: {
            'class': 'modern-input'
          }
        }
      },
      {
        key: 'proyecto',
        type: 'select',
        className: 'field-container',
        templateOptions: {
          label: 'Proyecto',
          change: (field, event) => {
            // Obtener el valor del proyecto seleccionado
            const value: number = field.formControl?.value;
            this.loadPersonaOptions(value);
            console.log('Proyecto seleccionado:', value);
          },
          placeholder: 'Seleccione proyecto',
          required: true,
          appearance: 'outline',
          floatLabel: 'always',
          attributes: {
            'class': 'modern-input'
          },
          options: [],
          valueProp: 'id',
          labelProp: 'nombre'
        },
        validation: {
          messages: {
            required: 'El proyecto es obligatorio.'
          }
        }
      },
      {
        key: 'persona',
        type: 'select',
        className: 'field-container',
        templateOptions: {
          label: 'Persona',
          placeholder: 'Seleccione persona',
          required: true,
          appearance: 'outline',
          floatLabel: 'always',
          attributes: {
            'class': 'modern-input'
          },
          options: [],
          valueProp: 'id',
          labelProp: 'nombre',
          filter: true
        },
        validation: {
          messages: {
            required: 'La persona es obligatoria.'
          }
        }
      },
      {
        key: 'tipoContrato',
        type: 'select',
        className: 'field-container',
        templateOptions: {
          label: 'TipoContrato',
          placeholder: 'Seleccione tipoContrato',
          required: true,
          appearance: 'outline',
          floatLabel: 'always',
          attributes: {
            'class': 'modern-input'
          },
          options: [],
          valueProp: 'id',
          labelProp: 'nombreTipoContrato'
        },
        validation: {
          messages: {
            required: 'El tipo de contrato es obligatorio.'
          }
        }
      },
      {
        key: 'periodicidadPago',
        type: 'select',
        className: 'field-container',
        templateOptions: {
          label: 'PeriodicidadPago',
          placeholder: 'Seleccione periodicidadPago',
          required: true,
          appearance: 'outline',
          floatLabel: 'always',
          attributes: {
            'class': 'modern-input'
          },
          options: [],
          valueProp: 'id',
          labelProp: 'tipoPeriodoPago'
        },
        validation: {
          messages: {
            required: 'La periodicidad de pago es obligatoria.'
          }
        }
      },
      {
        key: 'observaciones',
        type: 'textarea',
        className: 'field-container',
        templateOptions: {
          label: 'Observaciones',
          placeholder: 'Ingrese observaciones',
          required: false,
          appearance: 'outline',
          floatLabel: 'always',
          attributes: {
            'class': 'modern-input'
          }
        }
      },
      {
        key: 'archivosAdicionales',
        type: 'file',
        templateOptions: {
          label: 'Archivos Adicionales',
          placeholder: 'Ingrese los archivos adicionales',
          required: false,
          multiple: true,
          accept: '.pdf,.doc,.xls',
          maxFileSize: 5 * 1024 * 1024
        },
        validation: {
          messages: {
            maxFileSize: 'El tamaño del archivo no puede exceder 5MB'
          }
        },
      }
    ];
  }

  onSubmit() {
    // 1. Acciones previas
    this.preUpdate(this.model);

    const modelData = { ...this.model };

    if (modelData.proyecto) {
      modelData.proyecto = { id: modelData.proyecto };
    }

    if (modelData.persona) {
      modelData.persona = { id: modelData.persona };
    }

    if (modelData.tipoContrato) {
      modelData.tipoContrato = { id: modelData.tipoContrato };
    }

    if (modelData.periodicidadPago) {
      modelData.periodicidadPago = { id: modelData.periodicidadPago };
    }

    const uploadOperations: Observable<void>[] = [];
    const fileFields: (keyof ContratoModel)[] = ['contratoPdf','archivosAdicionales'];

    const handleFileUpload = (field: keyof ContratoModel) => {
      const files = this.model[field];

      if (Array.isArray(files) && files.length > 0) {
        const upload$ = this.contratoService.uploadFiles(files).pipe(
          switchMap(rutas => {
            // @ts-ignore
            modelData[field] = rutas.join(',');
            return of(undefined);
          }),
          catchError(error => {
            this.handleUploadError(field as string, error);
            return throwError(error);
          })
        );
        uploadOperations.push(upload$);
      } else if (files instanceof File) {
        const upload$ = this.contratoService.uploadFile(files).pipe(
          switchMap(ruta => {
            // @ts-ignore
            modelData[field] = ruta;
            return of(undefined);
          }),
          catchError(error => {
            this.handleUploadError(field as string, error);
            return throwError(error);
          })
        );
        uploadOperations.push(upload$);
      }
    };

    fileFields.forEach(field => handleFileUpload(field));

    if (uploadOperations.length > 0) {
      forkJoin(uploadOperations).subscribe({
        next: () => this.updateEntity(modelData),
        error: () => this.isLoading = false
      });
    } else {
      this.updateEntity(modelData);
    }
  }

  private handleUploadError(field: string, error: any) {
    console.error(`Error subiendo archivos en ${field}:`, error);
    this.snackBar.open(`Error subiendo ${field}`, 'Cerrar', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
    this.isLoading = false;
  }

  private updateEntity(modelData: any) {
    // Asumimos que modelData.id existe en tu modelo para saber cuál actualizar.
    this.contratoService.update(modelData.id, modelData).subscribe({
      next: (response) => {
        this.postUpdate(response);
      },
      error: (error) => {
        console.error('Error al actualizar Contrato:', error);
        this.snackBar.open('Error al actualizar Contrato', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  cancelEdit() {
    this.dialogRef.close();
  }

  /**
   * Verifica si hay cambios entre el model actual y el original.
   */
  private hasChanges(model: ContratoModel): boolean {
    for (const key in model) {
      const keyTyped = key as keyof ContratoModel;
      const newValue = typeof model[keyTyped] === 'string' ? (model[keyTyped] as string).trim() : model[keyTyped];
      const originalValue = typeof this.originalModel[keyTyped] === 'string' ? (this.originalModel[keyTyped] as string).trim() : this.originalModel[keyTyped];

      if (Array.isArray(newValue) && Array.isArray(originalValue)) {
        if (newValue.length !== originalValue.length ||
            newValue.some((item, index) => item.id !== originalValue[index]?.id)) {
          return true; // Cambios en arrays
        }
      } else if (newValue !== originalValue) {
        return true; // Cambio en valor simple
      }
    }
    return false; // No hay cambios
  }

  /**
   * Método para acciones previas a actualizar Contrato.
   */
  preUpdate(model: any) {
    // Verificar si el formulario es válido
    if (!this.form.valid) {
      throw new Error('El formulario no es válido.');
    }

    // Verificar si hubo cambios
    if (!this.hasChanges(model)) {
      this.snackBar.open('No se han realizado cambios en Contrato.', 'Cerrar', {
        duration: 3000,
      });
      throw new Error('No se han realizado cambios en el registro.');
    }

    // Quitar espacios al inicio y final
    for (const key in model) {
      if (typeof model[key] === 'string') {
        model[key] = model[key].trim();
      }
    }

    // TODO: Verificar permisos si se requiere
    console.log('Validaciones de preUpdate completadas.');
  }

  /**
   * Método para acciones posteriores al actualizar Contrato.
   */
  postUpdate(response: any) {
    this.snackBar.open('Contrato actualizado exitosamente', 'Cerrar', {
      duration: 3000,
    });
    this.dialogRef.close(true);
    console.log('Acciones postUpdate completadas.');
  }

}
