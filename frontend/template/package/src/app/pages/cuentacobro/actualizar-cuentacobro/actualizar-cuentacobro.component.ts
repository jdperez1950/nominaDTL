import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {AbstractControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormlyMatDatepickerModule } from '@ngx-formly/material/datepicker';
import {Observable, forkJoin, of, throwError, distinctUntilChanged, map} from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
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
import { CuentaCobroService } from '../../../services/CuentaCobroService';
import { ContratoService } from '../../../services/ContratoService';
import { InformeService } from '../../../services/InformeService';
import {AuthService} from "../../../services/auth-service.service";

interface CuentaCobroModel {
  /** id de la entidad */
  id: number;
  /** montoCobrar de la entidad */
  montoCobrar: number;
  /** numeroCuentaCobro de la entidad */
  numeroCuentaCobro: number;
  /** periodoACobrar de la entidad */
  periodoACobrar: string;
  /** fecha de la entidad */
  fecha: Date;
  /** estado de la entidad */
  estado: boolean;
  /** numeroCuenta de la entidad */
  numeroCuenta: string;
  /** detalle de la entidad */
  detalle: string;
  /** pago de la entidad */
  pago: boolean;
  /** notificacionPago de la entidad */
  notificacionPago: string;
  /** firmaGerente de la entidad */
  firmaGerente: any;
  /** firmaContratista de la entidad */
  firmaContratista: any;
  /** creador de la entidad */
  planillaSeguridadSocial?: any;
  /** creador de la entidad */
  creador: string;
  /** contrato de la entidad */
  contrato: any;
  /** informe de la entidad */
  informe: any;
  /** observaciones de la entidad */
  observaciones?: string;
}

/**
 * Componente para la actualización de CuentaCobro
 * @description Maneja el formulario de actualización utilizando Formly
 */
@Component({
  selector: 'app-actualizar-cuentacobro',
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
  templateUrl: './actualizar-cuentacobro.component.html',
  styleUrls: ['./actualizar-cuentacobro.component.scss']
})
export class ActualizarCuentaCobroComponent implements OnInit {
  /** Lista de todas las entidades */
  cuentacobros: any[] = [];
  /** Lista de contrato disponibles */
  contratos: any[] = [];
  /** Lista de informe disponibles */
  informes: any[] = [];
  /** Entidad seleccionada para actualizar */
  selectedCuentaCobro: any = null;
  form = new FormGroup({});
  model: CuentaCobroModel = {} as CuentaCobroModel;
  originalModel: CuentaCobroModel = {} as CuentaCobroModel;
  fields: FormlyFieldConfig[] = [];
  /** Indicador de carga de archivos */
  isLoading = false;

  /**
   * Constructor del componente
   * @param cuentacobroService Servicio principal de la entidad
   * @param contratoService Servicio para gestionar Contrato
   * @param informeService Servicio para gestionar Informe
   * @param router Servicio de enrutamiento
   * @param snackBar Servicio para notificaciones
   * @param authService
   * @param data Datos recibidos por el diálogo
   * @param dialogRef Referencia al diálogo
   */
  constructor(
    private cuentacobroService: CuentaCobroService,
    private contratoService: ContratoService,
    private informeService: InformeService,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ActualizarCuentaCobroComponent>
  ) {}

  /** Inicialización del componente */
  ngOnInit() {
    this.loadCuentaCobros();
    this.loadContratoOptions();
    this.loadInformeOptions();

    // Verificamos si llega data a través del diálogo (registro para editar)
    if (this.data) {
      try {
        this.selectedCuentaCobro = { ...this.data };
        // Inicializar modelo con los datos recibidos
        this.model = {
          id: this.data.id,
          montoCobrar: this.data.montoCobrar,
          numeroCuentaCobro: this.data.numeroCuentaCobro,
          periodoACobrar: this.data.periodoACobrar,
          fecha: this.data.fecha,
          estado: this.data.estado,
          numeroCuenta: this.data.numeroCuenta,
          detalle: this.data.detalle,
          pago: this.data.pago,
          notificacionPago: this.data.notificacionPago,
          firmaGerente: this.data.firmaGerente,
          firmaContratista: this.data.firmaContratista,
          planillaSeguridadSocial: this.data.planillaSeguridadSocial,
          creador: this.data.creador,
          contrato: this.data.contrato && this.data.contrato.id ? this.data.contrato.id : null,
          informe: this.data.informe && this.data.informe.id ? this.data.informe.id : null,
          observaciones: this.data.observaciones || '',
        };

        // Copia del modelo original para detectar cambios
        this.originalModel = {
          id: this.data.id,
          montoCobrar: this.data.montoCobrar,
          numeroCuentaCobro: this.data.numeroCuentaCobro,
          periodoACobrar: this.data.periodoACobrar,
          fecha: this.data.fecha,
          estado: this.data.estado,
          numeroCuenta: this.data.numeroCuenta,
          detalle: this.data.detalle,
          pago: this.data.pago,
          notificacionPago: this.data.notificacionPago,
          firmaGerente: this.data.firmaGerente,
          firmaContratista: this.data.firmaContratista,
          planillaSeguridadSocial: this.data.planillaSeguridadSocial,
          creador: this.data.creador,
          contrato: this.data.contrato && this.data.contrato.id ? this.data.contrato.id : null,
          informe: this.data.informe && this.data.informe.id ? this.data.informe.id : null,
          observaciones: this.data.observaciones || '',
        };
      } catch (error) {
        console.error('Error al procesar datos:', error);
      }
    }
    this.generateFormFields();
  }

  /** Carga la lista de entidades disponibles */
  loadCuentaCobros() {
    this.cuentacobroService.findAll().subscribe(
      data => this.cuentacobros = data,
      error => console.error(error)
    );
  }

  /**
   * Carga las opciones para la relación Contrato
   * @private
   */
  private loadContratoOptions() {
    this.contratoService.findAll().subscribe(
      data => {
        this.contratos = data.filter(contrato => contrato.estado);
        this.updateFieldOptions('contrato', data);
      },
      error => console.error('Error al cargar contrato:', error)
    );
  }

  /**
   * Carga las opciones para la relación Informe
   * @private
   */
  private loadInformeOptions() {
    this.informeService.findAll().subscribe(
      data => {
        this.informes = data;
        this.updateFieldOptions('informe', data);
      },
      error => console.error('Error al cargar informe:', error)
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
  onEdit(cuentacobro: any) {
    this.selectedCuentaCobro = { ...cuentacobro };
    this.model = { ...this.selectedCuentaCobro };
    // Procesar relación simple: contrato
    if (this.model.contrato && typeof this.model.contrato === 'object') {
      this.model.contrato = this.model.contrato.id;
    }
    // Procesar relación simple: informe
    if (this.model.informe && typeof this.model.informe === 'object') {
      this.model.informe = this.model.informe.id;
    }
    this.generateFormFields();
  }

  /**
   * Genera la configuración de campos del formulario
   */
  generateFormFields() {
    this.fields = [
      {
        key: 'montoCobrar',
        type: 'input',
        className: 'field-container',
        templateOptions: {
          label: 'Monto a Cobrar',
          placeholder: 'Ingrese monto a cobrar',
          required: true,
          appearance: 'outline',
          floatLabel: 'always',
          attributes: {
            'class': 'modern-input'
          },
          min:1000,
          max:1000000000
        },
        validation: {
          messages: {
            required: 'El monto a cobrar es obligatorio.',
            min: 'El monto mínimo debe ser de $1,000.',
          }
        },
        hooks: {
          onInit: (field: FormlyFieldConfig) => {
            field.formControl?.valueChanges
              .pipe(
                distinctUntilChanged()
              )
              .subscribe(value => {
                // Formatear como moneda colombiana
                const cleanedValue = String(value)
                  .replace(/[^\d]/g, '');  // Eliminar caracteres no numéricos

                if (cleanedValue) {
                  const formattedValue = new Intl.NumberFormat('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  }).format(Number(cleanedValue));

                  field.formControl?.setValue(formattedValue, { emitEvent: false });
                }
              });
          }
        }
      },
      {
        key: 'numeroCuentaCobro',
        type: 'input',
        className: 'field-container',
        templateOptions: {
          label: 'Número de Cuenta de Cobro',
          placeholder: 'Número de la cuenta de cobro actual',
          required: true,
          appearance: 'outline',
          floatLabel: 'always',
          disabled: true,
          attributes: {
            'class': 'modern-input'
          }
        }
      },
      {
        key: 'periodoACobrar',
        type: 'input',
        className: 'field-container',
        templateOptions: {
          label: 'Período a Cobrar',
          placeholder: 'Ingrese el período a cobrar (escriba mes y año)',
          required: true,
          appearance: 'outline',
          floatLabel: 'always',
          attributes: {
            'class': 'modern-input'
          }
        },
        validation: {
          messages: {
            required: 'El período a cobrar es obligatorio.'
          }
        }
      },
      {
        key: 'fecha',
        type: 'datepicker',
        className: 'field-container',
        templateOptions: {
          label: 'Fecha',
          placeholder: 'Ingrese fecha',
          required: true,
          appearance: 'outline',
          floatLabel: 'always',
          attributes: {
            'class': 'modern-input'
          }
        },
        validation: {
          messages: {
            required: 'La fecha es obligatoria.'
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
          disabled: !this.authService.tieneRoles(['ADMINISTRADOR', 'GERENTE']),
          attributes: {
            'class': 'modern-input'
          },
          options: [{ value: true, label: 'Aprobada' }, { value: false, label: 'No aprobada' }]
        }
      },
      {
        key: 'numeroCuenta',
        type: 'input',
        className: 'field-container',
        templateOptions: {
          label: 'Número de Cuenta',
          placeholder: 'Ingrese número de cuenta',
          required: true,
          appearance: 'outline',
          floatLabel: 'always',
          attributes: {
            'class': 'modern-input'
          },
          minLength:3,
          maxLength:20,
          pattern:/^[a-zA-Z0-9-]+$/
        },
        validation: {
          messages: {
            required: 'El número de cuenta es obligatorio.',
            minLength: 'El número de cuenta debe tener al menos 3 caracteres.',
            pattern: 'El número de cuenta solo puede contener letras, números y guiones.'
          }
        }
      },
      {
        key: 'detalle',
        type: 'textarea',
        className: 'field-container',
        templateOptions: {
          label: 'Detalle',
          placeholder: 'Ingrese detalle',
          required: true,
          appearance: 'outline',
          floatLabel: 'always',
          attributes: {
            'class': 'modern-input'
          },
          rows: 5,
          minLength:10,
          maxLength: 500
        },
        validation: {
          messages: {
            required: 'El detalle es obligatorio.',
            minLength: 'El detalle debe tener al menos 10 caracteres.',
          }
        }
      },
      {
        key: 'pago',
        type: 'select',
        className: 'field-container',
        templateOptions: {
          label: 'Pago',
          placeholder: 'Ingrese pago',
          required: true,
          appearance: 'outline',
          floatLabel: 'always',
          disabled: !this.authService.tieneRoles(['ADMINISTRADOR', 'CONTADOR']),
          attributes: {
            'class': 'modern-input'
          },
          options: [{ value: true, label: 'Realizado' }, { value: false, label: 'Pendiente' }]
        },
        expressionProperties: {
          'model.pago': (model: any) => {
            console.log('Valor actual de pago:', model.pago);
            return model.pago;
          }
        }
      },
      {
        key: 'firmaGerente',
        type: 'file',
        templateOptions: {
          label: 'Firma Gerente',
          placeholder: 'Seleccione la firma del Gerente',
          multiple: false,
          required: false,
          accept: 'image/*',
          maxFileSize: 5 * 1024 * 1024
        },
        validation: {
          messages: {
            maxFileSize: 'El tamaño del archivo no puede exceder 5MB'
          }
        },
        hideExpression: () => !this.authService.tieneRoles(['ADMINISTRADOR', 'GERENTE']),
      },
      {
        key: 'firmaContratista',
        type: 'file',
        templateOptions: {
          label: 'Firma Contratista',
          placeholder: 'Seleccione la firma del Contratista',
          multiple: false,
          required: true,
          accept: 'image/*',
          maxFileSize: 5 * 1024 * 1024
        },
        validation: {
          messages: {
            required: 'La firma del contratista es obligatoria.',
            maxFileSize: 'El tamaño del archivo no puede exceder 5MB'
          }
        }
      },
      {
        key: 'planillaSeguridadSocial',
        type: 'file',
        templateOptions: {
          label: 'Planilla Seguridad Social',
          placeholder: 'Seleccione la planilla de seguridad social',
          multiple: true,
          required: false,
          accept: '.pdf, .doc, .xls',
          maxFileSize: 5 * 1024 * 1024
        },
        validation: {
          messages: {
            maxFileSize: 'El tamaño del archivo no puede exceder 5MB'
          }
        },
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
        key: 'contrato',
        type: 'select',
        className: 'field-container',
        templateOptions: {
          label: 'Contrato',
          placeholder: 'Seleccione contrato',
          required: true,
          appearance: 'outline',
          floatLabel: 'always',
          attributes: {
            'class': 'modern-input'
          },
          options: [],
          valueProp: 'id',
          labelProp: 'numeroContrato'
        },
        validation: {
          messages: {
            required: 'El contrato es obligatorio.'
          }
        },
        asyncValidators: {
          validarNumeroCuentasCobro: {
            expression: (control: AbstractControl, field: FormlyFieldConfig): Observable<boolean> => {
              if (!control.value || !this.data?.id) {
                return of(true);
              }
              return this.contratoService.getDetalleContrato(control.value).pipe(
                map(response => {
                  const cuentaActual = this.data?.contrato?.id === control.value ? 1 : 0;
                  return (response.numeroCuentasCobro - cuentaActual) < response.numeroPagosPermitidos;
                }),
                catchError(() => of(false))
              );
            },
            message: 'No se pueden crear más cuentas de cobro para el contrato seleccionado.',
          }
        }
      },
      {
        key: 'observaciones',
        type: 'textarea',
        className: 'field-container',
        templateOptions: {
          label: 'Observaciones',
          placeholder: 'Ingrese observaciones adicionales',
          required: false,
          appearance: 'outline',
          floatLabel: 'always',
          attributes: {
            'class': 'modern-input'
          },
          rows: 3,
          maxLength: 500
        },
        validation: {
          messages: {
            maxlength: 'Las observaciones no pueden contener mas de 500 caracteres.'
          }
        },
        hideExpression: () => !this.authService.tieneRoles(['ADMINISTRADOR', 'GERENTE', 'CONTADOR']),
      }
    ];
  }

  onSubmit() {
    // 1. Acciones previas
    try {
      this.preUpdate(this.model);
    } catch (error) {
      console.error('Error en preUpdate:', error);
      this.isLoading = false;
      return;
    }

    const modelData = {...this.model,};
    this.isLoading = true;

    // Convertir ID a objetos para las relaciones
    if (modelData.contrato) {
      modelData.contrato = {id: modelData.contrato};
    }

    if (modelData.informe) {
      modelData.informe = {id: modelData.informe};
    }

    // Limpiar valor de monto a cobrar si es necesario (convertir de formato moneda a número)
    if (typeof modelData.montoCobrar === 'string') {
      const cleanedValue = (modelData.montoCobrar as string).replace(/[^\d]/g, '');
      modelData.montoCobrar = cleanedValue ? Number(cleanedValue) : 0;
    }
    console.log("datos de model: \n" + modelData)


    const uploadOperations: Observable<void>[] = [];
    const fileFields: (keyof CuentaCobroModel)[] = ['firmaGerente','firmaContratista', 'planillaSeguridadSocial'];

    const handleFileUpload = (field: keyof CuentaCobroModel) => {
      const files = this.model[field];

      if (Array.isArray(files) && files.length > 0) {
        const upload$ = this.cuentacobroService.uploadFiles(files).pipe(
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
        const upload$ = this.cuentacobroService.uploadFile(files).pipe(
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
      console.log(modelData)
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

    this.cuentacobroService.update(modelData.id, modelData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.postUpdate(response);
      },
      error: (error) => {
        console.error('Error completo al actualizar CuentaCobro:', error);
        this.isLoading = false;
        this.snackBar.open('Error al actualizar CuentaCobro: ' + (error.message || 'Error desconocido'), 'Cerrar', {
          duration: 5000,
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
  private hasChanges(model: CuentaCobroModel): boolean {

    for (const key in model) {
      const keyTyped = key as keyof CuentaCobroModel;
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
   * Método para acciones previas a actualizar CuentaCobro.
   */
  preUpdate(model: any) {
    // Verificar si el formulario es válido
    if (!this.form.valid) {
      throw new Error('El formulario no es válido.');
    }

    // Verificar si hubo cambios
    if (!this.hasChanges(model)) {
      this.snackBar.open('No se han realizado cambios en CuentaCobro.', 'Cerrar', {
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
   * Método para acciones posteriores al actualizar CuentaCobro.
   */
  postUpdate(response: any) {
    this.snackBar.open('CuentaCobro actualizado exitosamente', 'Cerrar', {
      duration: 3000,
    });
    this.dialogRef.close(true);
    console.log('Acciones postUpdate completadas.');
  }

  handleImageChange(field: FormlyFieldConfig, event: Event, fieldName: 'firmaGerente' | 'firmaContratista') {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    // Validación de tipo de imagen
    if (!file.type.match('image.*')) {
      this.snackBar.open('Solo se permiten archivos de imagen', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    // Validación de tamaño (2MB máximo)
    if (file.size > 2 * 1024 * 1024) {
      this.snackBar.open('La imagen no debe exceder 2MB', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target?.result) {
        const base64 = e.target.result as string;

        // 1. Actualizar el modelo
        this.model[fieldName] = base64;

        // 2. Actualizar previsualización
        if (field.templateOptions) {
          (field.templateOptions as any).preview = base64;
        }

        // 3. Actualizar vista
        setTimeout(() => {
          this.fields = [...this.fields];
        }, 0);
      }
    };

    reader.onerror = () => {
      this.snackBar.open('Error al leer la imagen', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });

      // Limpiar el input en caso de error
      input.value = '';
    };

    reader.readAsDataURL(file);
  }

}
