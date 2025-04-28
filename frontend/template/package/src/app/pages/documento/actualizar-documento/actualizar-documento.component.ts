import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
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
import { DocumentoService } from '../../../services/DocumentoService';
import { PersonaService } from '../../../services/PersonaService';
import { ContratoService } from '../../../services/ContratoService';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import {AuthService} from "../../../services/auth-service.service";

interface DocumentoModel {
  /** id de la entidad */
  id: number;
  /** nombre de la entidad */
  nombre: string;
  /** descripcion de la entidad */
  descripcion: string;
  /** fechaCarga de la entidad */
  fechaCarga: Date;
  /** estado de la entidad */
  estado: boolean;
  /** formato de la entidad */
  formato: string;
  /** etiqueta de la entidad */
  etiqueta: string;
  /** archivoDocumento de la entidad */
  archivoDocumento: string;
  /** creador de la entidad */
  creador: string;
  /** persona de la entidad */
  persona: any;
  /** contrato de la entidad */
  contrato: any;
}

/**
 * Componente para la actualización de Documento
 * @description Maneja el formulario de actualización utilizando Formly
 */
@Component({
  selector: 'app-actualizar-documento',
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
  templateUrl: './actualizar-documento.component.html',
  styleUrls: ['./actualizar-documento.component.scss']
})
export class ActualizarDocumentoComponent implements OnInit {
  /** Lista de todas las entidades */
  documentos: any[] = [];
  /** Lista de persona disponibles */
  personas: any[] = [];
  /** Lista de contrato disponibles */
  contratos: any[] = [];
  /** Entidad seleccionada para actualizar */
  selectedDocumento: any = null;
  form = new FormGroup({});
  model: DocumentoModel = {} as DocumentoModel;
  originalModel: DocumentoModel = {} as DocumentoModel;
  fields: FormlyFieldConfig[] = [];
  /** Indicador de carga de archivos */
  isLoading = false;

  /**
   * Constructor del componente
   * @param documentoService Servicio principal de la entidad
   * @param personaService Servicio para gestionar Persona
   * @param contratoService Servicio para gestionar Contrato
   * @param router Servicio de enrutamiento
   * @param snackBar Servicio para notificaciones
   * @param authService
   * @param data Datos recibidos por el diálogo
   * @param dialogRef Referencia al diálogo
   */
  constructor(
    private documentoService: DocumentoService,
    private personaService: PersonaService,
    private contratoService: ContratoService,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ActualizarDocumentoComponent>
  ) {}

  /** Inicialización del componente */
  ngOnInit() {
    this.loadDocumentos();
    this.loadPersonaOptions();
    this.loadContratoOptions();

    // Verificamos si llega data a través del diálogo (registro para editar)
    if (this.data) {
      try {
        this.selectedDocumento = { ...this.data };
        // Inicializar modelo con los datos recibidos
        this.model = {
          id: this.data.id,
          nombre: this.data.nombre,
          descripcion: this.data.descripcion,
          fechaCarga: this.data.fechaCarga,
          estado: this.data.estado,
          formato: this.data.formato,
          etiqueta: this.data.etiqueta,
          archivoDocumento: this.data.archivoDocumento,
          creador: this.data.creador,
          persona: this.data.persona && this.data.persona.id ? this.data.persona.id : null,
          contrato: this.data.contrato && this.data.contrato.id ? this.data.contrato.id : null
        };

        // Copia del modelo original para detectar cambios
        this.originalModel = {
          id: this.data.id,
          nombre: this.data.nombre,
          descripcion: this.data.descripcion,
          fechaCarga: this.data.fechaCarga,
          estado: this.data.estado,
          formato: this.data.formato,
          etiqueta: this.data.etiqueta,
          archivoDocumento: this.data.archivoDocumento,
          creador: this.data.creador,
          persona: this.data.persona && this.data.persona.id ? this.data.persona.id : null,
          contrato: this.data.contrato && this.data.contrato.id ? this.data.contrato.id : null
        };
      } catch (error) {
        console.error('Error al procesar datos:', error);
      }
    }
    this.generateFormFields();
  }

  /** Carga la lista de entidades disponibles */
  loadDocumentos() {
    this.documentoService.findAll().subscribe(
      data => this.documentos = data,
      error => console.error(error)
    );
  }

  /**
   * Carga las opciones para la relación Persona
   * @private
   */
  private loadPersonaOptions() {
    this.personaService.findAll().subscribe(
      data => {
        const field = this.fields.find(f => f.key === 'persona');
        if (field && field.templateOptions) {
          field.templateOptions.options = data;
        }
      },
      error => console.error('Error al cargar persona:', error)
    );
  }

  /**
   * Carga las opciones para la relación Contrato
   * @private
   */
  private loadContratoOptions() {
    this.contratoService.findAll().subscribe(
      data => {
        const field = this.fields.find(f => f.key === 'contrato');
        if (field && field.templateOptions) {
          field.templateOptions.options = data;
        }
      },
      error => console.error('Error al cargar contrato:', error)
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
  onEdit(documento: any) {
    this.selectedDocumento = { ...documento };
    this.model = { ...this.selectedDocumento };
    // Procesar relación simple: persona
    if (this.model.persona && typeof this.model.persona === 'object') {
      this.model.persona = this.model.persona.id;
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
        key: 'nombre',
        type: 'input',
        className: 'field-container',
        templateOptions: {
          label: 'Nombre',
          placeholder: 'Ingrese nombre',
          required: true,
          appearance: 'outline',
          floatLabel: 'always',
          attributes: {
            'class': 'modern-input'
          },
          pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
          minLength: 4,
          maxLength: 100
        },
        validation: {
          messages: {
            required: 'El nombre es obligatorio.',
            pattern: 'El nombre solo puede contener letras.',
            minlength: 'El nombre debe tener al menos 4 caracteres.',
          }
        }
      },
      {
        key: 'descripcion',
        type: 'textarea',
        className: 'field-container',
        templateOptions: {
          label: 'Descripcion',
          placeholder: 'Ingrese descripcion',
          required: true,
          appearance: 'outline',
          floatLabel: 'always',
          attributes: {
            'class': 'modern-input'
          },
          rows: 5,
          minLength: 4,
          maxLength: 250
        },
        validation: {
          messages: {
            required: 'La descripción es obligatoria.',
            minlength: 'La descripción debe tener al menos 4 caracteres.',
          }
        }
      },
      {
        key: 'fechaCarga',
        type: 'datepicker',
        className: 'field-container',
        templateOptions: {
          label: 'FechaCarga',
          placeholder: 'Ingrese fechaCarga',
          required: true,
          appearance: 'outline',
          floatLabel: 'always',
          attributes: {
            'class': 'modern-input'
          },
          disabled: true
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
          options: [{ value: true, label: 'Activo' }, { value: false, label: 'Inactivo' }]
        }
      },
      {
        key: 'formato',
        type: 'input',
        className: 'field-container',
        templateOptions: {
          label: 'Formato',
          placeholder: 'Ingrese formato',
          required: true,
          appearance: 'outline',
          floatLabel: 'always',
          attributes: {
            'class': 'modern-input'
          }
        },
        validation: {
          messages: {
            required: 'El formato es obligatorio.'
          }
        }
      },
      {
        key: 'etiqueta',
        type: 'input',
        className: 'field-container',
        templateOptions: {
          label: 'Etiqueta',
          placeholder: 'Ingrese etiqueta',
          required: true,
          appearance: 'outline',
          floatLabel: 'always',
          attributes: {
            'class': 'modern-input'
          }
        },
        validation: {
          messages: {
            required: 'La etiqueta es obligatoria.'
          }
        }
      },
      {
        key: 'archivoDocumento',
        type: 'file',
        templateOptions: {
          label: 'Archivo Documento',
          placeholder: 'Ingrese el archivo del documento',
          required: true,
          multiple:true,
          maxFileSize: 5 * 1024 * 1024,
        },
        validation: {
          messages: {
            required: 'El archivo del documento  es obligatorio.',
            maxFileSize: 'El archivo debe tener un tamaño inferior a 5MB'
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
          labelProp: 'nombre'
        },
        validation: {
          messages: {
            required: 'Debe seleccionar una persona.'
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
            required: 'Debe seleccionar un contrato.'
          }
        }
      }
    ];
  }

  onSubmit() {
    // 1. Acciones previas
    this.preUpdate(this.model);

    const modelData = { ...this.model };

    if (modelData.persona) {
      modelData.persona = { id: modelData.persona };
    }

    if (modelData.contrato) {
      modelData.contrato = { id: modelData.contrato };
    }

    const uploadOperations: Observable<void>[] = [];
    const fileFields: (keyof DocumentoModel)[] = ['archivoDocumento'];

    const handleFileUpload = (field: keyof DocumentoModel) => {
      const files = this.model[field];

      if (Array.isArray(files) && files.length > 0) {
        const upload$ = this.documentoService.uploadFiles(files).pipe(
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
        const upload$ = this.documentoService.uploadFile(files).pipe(
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
    this.documentoService.update(modelData.id, modelData).subscribe({
      next: (response) => {
        this.postUpdate(response);
      },
      error: (error) => {
        console.error('Error al actualizar Documento:', error);
        this.snackBar.open('Error al actualizar Documento', 'Cerrar', {
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
  private hasChanges(model: DocumentoModel): boolean {
    for (const key in model) {
      const keyTyped = key as keyof DocumentoModel;
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
   * Método para acciones previas a actualizar Documento.
   */
  preUpdate(model: any) {
    // Verificar si el formulario es válido
    if (!this.form.valid) {
      throw new Error('El formulario no es válido.');
    }

    // Verificar si hubo cambios
    if (!this.hasChanges(model)) {
      this.snackBar.open('No se han realizado cambios en Documento.', 'Cerrar', {
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
   * Método para acciones posteriores al actualizar Documento.
   */
  postUpdate(response: any) {
    this.snackBar.open('Documento actualizado exitosamente', 'Cerrar', {
      duration: 3000,
    });
    this.dialogRef.close(true);
    console.log('Acciones postUpdate completadas.');
  }

}
