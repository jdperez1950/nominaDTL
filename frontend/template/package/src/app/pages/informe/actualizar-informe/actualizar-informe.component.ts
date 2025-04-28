import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormlyMatDatepickerModule } from '@ngx-formly/material/datepicker';
import { Observable, forkJoin, of, throwError } from 'rxjs';
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
import { InformeService } from '../../../services/InformeService';
import { CuentaCobroService } from '../../../services/CuentaCobroService';
import { ProyectoService } from '../../../services/ProyectoService';
import { ContratoService } from '../../../services/ContratoService';
import {AuthService} from "../../../services/auth-service.service";

interface InformeModel {
  /** id de la entidad */
  id: number;
  /** fecha de la entidad */
  fecha: Date;
  /** cliente de la entidad */
  cliente: string;
  /** cargo de la entidad */
  cargo: string;
  /** informePDF de la entidad */
  informePDF: any;
  /** creador de la entidad */
  creador: string;
  /** cuentaCobro de la entidad */
  cuentaCobro: any;
  /** proyecto de la entidad */
  proyecto: any;
  /** contrato de la entidad */
  contrato: any;
}

/**
 * Componente para la actualización de Informe
 * @description Maneja el formulario de actualización utilizando Formly
 */
@Component({
  selector: 'app-actualizar-informe',
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
  templateUrl: './actualizar-informe.component.html',
  styleUrls: ['./actualizar-informe.component.scss']
})
export class ActualizarInformeComponent implements OnInit {
  /** Lista de todas las entidades */
  informes: any[] = [];
  /** Lista de cuentaCobro disponibles */
  cuentaCobros: any[] = [];
  /** Lista de proyecto disponibles */
  proyectos: any[] = [];
  /** Lista de contrato disponibles */
  contratos: any[] = [];
  /** Entidad seleccionada para actualizar */
  selectedInforme: any = null;
  form = new FormGroup({});
  model: InformeModel = {} as InformeModel;
  originalModel: InformeModel = {} as InformeModel;
  fields: FormlyFieldConfig[] = [];
  /** Indicador de carga de archivos */
  isLoading = false;

  /**
   * Constructor del componente
   * @param informeService Servicio principal de la entidad
   * @param cuentaCobroService Servicio para gestionar CuentaCobro
   * @param proyectoService Servicio para gestionar Proyecto
   * @param contratoService Servicio para gestionar Contrato
   * @param router Servicio de enrutamiento
   * @param snackBar Servicio para notificaciones
   * @param authService
   * @param data Datos recibidos por el diálogo
   * @param dialogRef Referencia al diálogo
   */
  constructor(
    private informeService: InformeService,
    private cuentaCobroService: CuentaCobroService,
    private proyectoService: ProyectoService,
    private contratoService: ContratoService,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ActualizarInformeComponent>
  ) {}

  /** Inicialización del componente */
  ngOnInit() {
    this.loadInformes();
    this.loadProyectoOptions();

    // Verificamos si llega data a través del diálogo (registro para editar)
    if (this.data) {
      try {
        this.selectedInforme = { ...this.data };
        // Inicializar modelo con los datos recibidos
        this.model = {
          id: this.data.id,
          fecha: this.data.fecha,
          cliente: this.data.cliente,
          cargo: this.data.cargo,
          informePDF: this.data.informePDF,
          creador: this.data.creador,
          cuentaCobro: this.data.cuentaCobro && this.data.cuentaCobro.id ? this.data.cuentaCobro.id : null,
          proyecto: this.data.proyecto && this.data.proyecto.id ? this.data.proyecto.id : null,
          contrato: this.data.contrato && this.data.contrato.id ? this.data.contrato.id : null
        };

        // Copia del modelo original para detectar cambios
        this.originalModel = {
          id: this.data.id,
          fecha: this.data.fecha,
          cliente: this.data.cliente,
          cargo: this.data.cargo,
          informePDF: this.data.informePDF,
          creador: this.data.creador,
          cuentaCobro: this.data.cuentaCobro && this.data.cuentaCobro.id ? this.data.cuentaCobro.id : null,
          proyecto: this.data.proyecto && this.data.proyecto.id ? this.data.proyecto.id : null,
          contrato: this.data.contrato && this.data.contrato.id ? this.data.contrato.id : null
        };
      } catch (error) {
        console.error('Error al procesar datos:', error);
      }
    }
    this.generateFormFields();
  }

  /** Carga la lista de entidades disponibles */
  loadInformes() {
    this.informeService.findAll().subscribe(
      data => this.informes = data,
      error => console.error(error)
    );
  }

  /**
   * Carga las opciones para la relación CuentaCobro
   * @private
   */
  private loadCuentaCobroOptions(id:number) {
    let username: String = this.authService.getUsername();
    if (username) {
      // Usar un método específico en el servicio de contratos para obtener contratos por persona
      this.cuentaCobroService.obtenerCuentasCobroPorContrato(username,id).subscribe(
        data => {
          const field = this.fields.find(f => f.key === 'cuentaCobro');
          if (field && field.templateOptions) {
            field.templateOptions.options = data;
          }
        },
        error => console.error('Error al cargar proyectos de la persona:', error)
      );
    } else {
      console.error('No se pudo obtener el ID de la persona');
    }
  }

  /**
   * Carga las opciones para la relación Proyecto
   * @private
   */
  private loadProyectoOptions() {
// Obtener el ID de la persona desde el token
    const personaId = this.authService.getPersonaId();

    if (personaId) {
      // Usar un método específico en el servicio de contratos para obtener contratos por persona
      this.proyectoService.findVisibles(personaId).subscribe(
        data => {
          const field = this.fields.find(f => f.key === 'proyecto');
          if (field && field.templateOptions) {
            field.templateOptions.options = data;
          }
        },
        error => console.error('Error al cargar proyectos de la persona:', error)
      );
    } else {
      console.error('No se pudo obtener el ID de la persona');
    }
  }

  /**
   * Carga las opciones para la relación Contrato
   * @private
   */
  private loadContratoOptions(proyectoId: number) {
    // Obtener el ID de la persona desde el token
    const personaId = this.authService.getPersonaId();

    if (personaId) {
      // Llamamos al servicio con personaId y proyectoId
      this.contratoService.obtenerContratosPorProyecto(personaId, proyectoId).subscribe(
        data => {
          const field = this.fields.find(f => f.key === 'contrato');
          if (field && field.templateOptions) {
            field.templateOptions.options = data;
          }
        },
        error => console.error('Error al cargar contratos de la persona y proyecto:', error)
      );
    } else {
      console.error('No se pudo obtener el ID de la persona');
    }
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
  onEdit(informe: any) {
    this.selectedInforme = { ...informe };
    this.model = { ...this.selectedInforme };
    // Procesar relación simple: cuentaCobro
    if (this.model.cuentaCobro && typeof this.model.cuentaCobro === 'object') {
      this.model.cuentaCobro = this.model.cuentaCobro.id;
    }
    // Procesar relación simple: proyecto
    if (this.model.proyecto && typeof this.model.proyecto === 'object') {
      this.model.proyecto = this.model.proyecto.id;
    }
    // Procesar relación simple: contrato
    if (this.model.contrato && typeof this.model.contrato === 'object') {
      this.model.contrato = this.model.contrato.id;
    }
    this.generateFormFields();
  }

  /**
   * Genera la configuración de campos del formulario
   */
  generateFormFields() {
    this.fields = [
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
            required: 'La fecha del informe es obligatoria.'
          }
        }
      },
      {
        key: 'cliente',
        type: 'input',
        className: 'field-container',
        templateOptions: {
          label: 'Cliente',
          placeholder: 'Ingrese cliente',
          required: true,
          appearance: 'outline',
          floatLabel: 'always',
          attributes: {
            'class': 'modern-input'
          },
          minLength:3,
          maxLength: 100
        },
        validation: {
          messages: {
            required: 'El nombre del cliente es obligatorio.',
            minLength: 'El nombre del cliente debe tener al menos 3 caracteres.'
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
          minLength:3,
          maxLength:50,
          pattern:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
        },
        validation: {
          messages: {
            required: 'El cargo es obligatorio.',
            minLength: 'El cargo debe tener al menos 3 caracteres.',
            pattern: 'El cargo solo puede contener letras y espacios.'
          }
        }
      },
      {
        key: 'informePDF',
        type: 'file',
        templateOptions: {
          label: 'InformePDF',
          placeholder: 'Seleccione informePDF',
          multiple: true,
          required: true,
          accept: '.pdf,.doc,.xls,.ppt',
          maxFileSize: 5 * 1024 * 1024
        },
        validation: {
          messages: {
            maxFileSize: 'El tamaño de los archivos no puede exceder 5MB'
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
        key: 'proyecto',
        type: 'select',
        className: 'field-container',
        templateOptions: {
          label: 'Proyecto',
          change: (field, event) => {
            // Obtener el valor del proyecto seleccionado
            const value: number = field.formControl?.value;
            this.loadContratoOptions(value);
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
            required: 'Debe seleccionar un proyecto.'
          }
        }
      },
      {
        key: 'contrato',
        type: 'select',
        className: 'field-container',
        templateOptions: {
          label: 'Contrato',
          change: (field, event) => {
            // Obtener el valor del contrato seleccionado
            const value: number = field.formControl?.value;
            this.loadCuentaCobroOptions(value);
            console.log('contrato seleccionado:', value);
          },
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
            required: 'Debe seleccionar un contrato.'
          }
        }
      },
      {
        key: 'cuentaCobro',
        type: 'select',
        className: 'field-container',
        templateOptions: {
          label: 'CuentaCobro',
          placeholder: 'Seleccione cuentaCobro',
          required: true,
          appearance: 'outline',
          floatLabel: 'always',
          attributes: {
            'class': 'modern-input'
          },
          options: [],
          valueProp: 'id',
          labelProp: 'numeroCuenta'
        },
        validation: {
          messages: {
            required: 'Debe seleccionar una cuenta de cobro.'
          }
        }
      }
    ];
  }

  onSubmit() {
    // 1. Acciones previas
    this.preUpdate(this.model);

    const modelData = { ...this.model };

    this.isLoading = true;

    if (modelData.cuentaCobro) {
      modelData.cuentaCobro = { id: modelData.cuentaCobro };
    }

    if (modelData.proyecto) {
      modelData.proyecto = { id: modelData.proyecto };
    }

    if (modelData.contrato) {
      modelData.contrato = { id: modelData.contrato };
    }


    const uploadOperations: Observable<void>[] = [];
    const fileFields: (keyof InformeModel)[] = ['informePDF'];

    const handleFileUpload = (field: keyof InformeModel) => {
      const files = this.model[field];

      if (Array.isArray(files) && files.length > 0) {
        const upload$ = this.informeService.uploadFiles(files).pipe(
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
        const upload$ = this.informeService.uploadFile(files).pipe(
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
    this.informeService.update(modelData.id, modelData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.postUpdate(response);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al actualizar Informe:', error);
        this.snackBar.open('Error al actualizar Informe', 'Cerrar', {
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
  private hasChanges(model: InformeModel): boolean {
    for (const key in model) {
      const keyTyped = key as keyof InformeModel;
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
   * Método para acciones previas a actualizar Informe.
   */
  preUpdate(model: any) {
    // Verificar si el formulario es válido
    if (!this.form.valid) {
      throw new Error('El formulario no es válido.');
    }

    // Verificar si hubo cambios
    if (!this.hasChanges(model)) {
      this.snackBar.open('No se han realizado cambios en Informe.', 'Cerrar', {
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
   * Método para acciones posteriores al actualizar Informe.
   */
  postUpdate(response: any) {
    this.snackBar.open('Informe actualizado exitosamente', 'Cerrar', {
      duration: 3000,
    });
    this.dialogRef.close(true);
    console.log('Acciones postUpdate completadas.');
  }

}
