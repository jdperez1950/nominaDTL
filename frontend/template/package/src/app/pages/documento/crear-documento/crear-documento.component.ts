import { Component, OnInit,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth-service.service';
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

interface DocumentoModel {
  nombre: string;
  descripcion: string;
  fechaCarga: Date;
  estado: boolean;
  formato: string;
  etiqueta: string;
  archivoDocumento: any;
  creador: string;
  persona: any;
  contrato: any;
}

@Component({
  selector: 'app-crear-documento',
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
  templateUrl: './crear-documento.component.html',
  styleUrls: ['./crear-documento.component.scss']
})
export class CrearDocumentoComponent implements OnInit {
  form = new FormGroup({});
  model: DocumentoModel = {
    nombre: '',
    descripcion: '',
    fechaCarga: new Date(),
    estado: false,
    formato: '',
    etiqueta: '',
    archivoDocumento: '',
    creador: '',
    persona: null,
    contrato: null
  };
  fields: FormlyFieldConfig[] = [];
  isLoading = false;

  constructor(
    private dialogRef: MatDialogRef<CrearDocumentoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private documentoService: DocumentoService,
    private personaService: PersonaService,
    private contratoService: ContratoService,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const username = this.authService.getUsername();
    this.model.creador = username;
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
            maxFileSize: 'El tamaño del archivo no puede exceder 5MB'
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
          change: (field, event) => {
            if (event.value) {
              this.loadContratosByPersona(event.value);
            }
          }
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

    this.loadPersonaOptions();
  }

  private loadContratosByPersona(personaId: number) {
    this.contratoService.findByPersonaId(personaId).subscribe(
      data => {
        const field = this.fields.find(f => f.key === 'contrato');
        if (field && field.templateOptions) {
          field.templateOptions.options = data;
          // Resetear el valor del contrato cuando cambia la persona
          this.model.contrato = null;
        }
      },
      error => console.error('Error al cargar contratos por persona:', error)
    );
  }

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

  closeDialog(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    // 1. Validaciones previas
    this.preCreate(this.model);

    // 2. Copiamos el modelo para no mutarlo directamente
    const modelData = { ...this.model };
    modelData.persona = { id: this.model.persona };
    modelData.contrato = { id: this.model.contrato };

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
        next: () => this.saveEntity(modelData),
        error: () => this.isLoading = false
      });
    } else {
      this.saveEntity(modelData);
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

  private saveEntity(modelData: any) {
    this.documentoService.save(modelData).subscribe({
      next: (response) => {
        this.postCreate(response);
      },
      error: (error) => {
        console.error('Error al crear Documento:', error);
        this.snackBar.open('Error al crear Documento', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  /**
   * Método para las acciones previas a crear
   */
  preCreate(model: any) {
    if (!this.form.valid) {
      throw new Error('El formulario no es válido.');
    }

    // Quitar espacios al inicio y fin de cadenas
    for (const key in model) {
      if (typeof model[key] === 'string') {
        model[key] = model[key].trim();
      }
    }
    console.log('Validaciones de preCreate completadas.');
  }

  /**
   * Acciones que se ejecutan después de la creación
   */
  postCreate(response: any) {
    this.snackBar.open('Documento creado exitosamente', 'Cerrar', {
      duration: 3000,
    });
    this.dialogRef.close(true);
    console.log('Acciones postCreate completadas.');
  }
}
