import {Component, OnInit, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormGroup, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import {FormlyFieldConfig, FormlyModule} from '@ngx-formly/core';
import {FormlyMaterialModule} from '@ngx-formly/material';
import {Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {AuthService} from '../../../services/auth-service.service';
import {FormlyMatDatepickerModule} from '@ngx-formly/material/datepicker';
import {MatButtonModule} from '@angular/material/button';
import {MatCard, MatCardContent, MatCardModule} from '@angular/material/card';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatFormField, MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSnackBarModule, MatSnackBar} from '@angular/material/snack-bar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatTabsModule} from '@angular/material/tabs';
import {DateTime} from 'luxon';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {PersonaService} from '../../../services/PersonaService';
import {ProyectoService} from '../../../services/ProyectoService';
import {TipoDocumentoService} from '../../../services/TipoDocumentoService';
import {PermissionService} from "../../authentication/services/PermissionService";
import {forkJoin, Observable, of, throwError} from "rxjs";
import {catchError, switchMap} from "rxjs/operators";


interface PersonaModel {
  nombre: string;
  correo: string;
  numeroDocumento: string;
  tituloProfesional: string;
  direccion: string;
  telefono: string;
  fechaExpedicion: Date;
  fechaNacimiento: Date;
  nacionalidad: string;
  documentosFormacionAcademica?: any;
  documentosLegales?: any;
  certificacionesLaborales?: any;
  creador: string;
  proyecto: any;
  tipoDocumento: any;
  necesitaAcceso: boolean;
  tipoPersona: any;
  roles?: any[];
}

@Component({
  selector: 'app-crear-persona',
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
  templateUrl: './crear-persona.component.html',
  styleUrls: ['./crear-persona.component.scss']
})
export class CrearPersonaComponent implements OnInit {
  form = new FormGroup({});
  model: PersonaModel = {
    nombre: '',
    correo: '',
    numeroDocumento: '',
    tituloProfesional: '',
    direccion: '',
    telefono: '',
    fechaExpedicion: new Date(),
    fechaNacimiento: new Date(),
    nacionalidad: '',
    documentosFormacionAcademica: '',
    documentosLegales: '',
    certificacionesLaborales: '',
    creador: '',
    proyecto: null,
    tipoDocumento: null,
    necesitaAcceso: false,
    tipoPersona: null,
    roles: [],
  };
  fields: FormlyFieldConfig[] = [];
  isLoading: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<CrearPersonaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private personaService: PersonaService,
    private proyectoService: ProyectoService,
    private tipoDocumentoService: TipoDocumentoService,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private permissionService: PermissionService
  ) {
  }

  rolesMap: { [key: string]: number } = {};

  ngOnInit() {
    const username = this.authService.getUsername();
    this.model.creador = username;

    // Obtener y almacenar los roles dinámicamente con tipado explícito
    this.permissionService.getRoles().subscribe(
      (roles: { id: number; nombre: string; rolesHijos: any[] }[]) => {
        roles.forEach((role) => {
          this.rolesMap[role.nombre.toUpperCase()] = role.id; // Guardamos los roles en un mapa
        });

        // Asignar las opciones de roles al formulario si es necesario
        const field = this.fields.find(f => f.key === 'roles');
        if (field && field.templateOptions) {
          field.templateOptions.options = roles.map(role => ({
            value: role.id,
            label: role.nombre
          }));
        }
      },
      (error) => console.error('Error al cargar roles:', error)
    );

    this.fields = [
      {
        key: 'tipoPersona',
        type: 'select',
        className: 'field-container',
        templateOptions: {
          label: 'Tipo de Persona',
          placeholder: 'Seleccione el tipo',
          required: true,
          options: [
            {value: 'GERENTE', label: 'Gerente'},
            {value: 'CONTRATISTA', label: 'Contratista'},
            {value: 'CONTADOR', label: 'Contador'},
          ],
        },
        validation: {
          messages: {
            required: 'El tipo de persona es obligatorio.'
          }
        }
      },
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
        key: 'correo',
        type: 'input',
        className: 'field-container',
        templateOptions: {
          label: 'Correo',
          placeholder: 'Ingrese correo',
          required: true,
          appearance: 'outline',
          floatLabel: 'always',
          attributes: {
            'class': 'modern-input'
          },
          pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
          patternError: 'El correo debe tener un formato válido (ejemplo: usuario@dominio.com)'
        },
        validation: {
          messages: {
            required: 'El correo es obligatorio.',
            pattern: 'El correo debe tener un formato válido (ejemplo: usuario@dominio.com)'
          }
        }
      },
      {
        key: 'tipoDocumento',
        type: 'select',
        className: 'field-container',
        templateOptions: {
          label: 'TipoDocumento',
          placeholder: 'Seleccione tipoDocumento',
          required: true,
          appearance: 'outline',
          floatLabel: 'always',
          attributes: {
            'class': 'modern-input'
          },
          options: [],
          valueProp: 'id',
          labelProp: 'nombreTipoDocumento'
        },
        validation: {
          messages: {
            required: 'El tipo de documento es obligatorio.'
          }
        }
      },
      {
        key: 'numeroDocumento',
        type: 'input',
        className: 'field-container',
        templateOptions: {
          label: 'Numero de Documento',
          placeholder: 'Ingrese el número de documento',
          required: true,
          appearance: 'outline',
          floatLabel: 'always',
          attributes: {
            class: 'modern-input'
          },
          pattern: /^[0-9]*$/,
          maxLength: 20,
          minLength: 5
        },
        validation: {
          messages: {
            required: 'El número de documento es obligatorio.',
            pattern: 'Solo se permiten números en este campo.',
            minlength: 'El número de documento debe tener al menos 5 caracteres.',
          }
        }
      },
      {
        key: 'fechaExpedicion',
        type: 'datepicker',
        className: 'field-container',
        templateOptions: {
          label: 'Fecha Expedicion',
          placeholder: 'Ingrese fecha de expedición',
          required: true,
          appearance: 'outline',
          floatLabel: 'always',
          attributes: {
            'class': 'modern-input'
          }
        },
        validators: {
          validation: [
            (control: { value: any; }) => {
              const value = control.value;
              if (!value) return null;

              const selectedDate = new Date(value);
              const today = new Date();
              const minValidDate = new Date(1900, 0, 1);
              const maxValidDate = today;

              // Verifica si la fecha es válida y está dentro de un rango razonable
              if (isNaN(selectedDate.getTime())) {
                return { invalidDate: true };
              }

              if (selectedDate < minValidDate || selectedDate > maxValidDate) {
                return { dateOutOfRange: true };
              }

              return null;
            }
          ]
        },
        validation: {
          messages: {
            required: 'La fecha de expedición es obligatoria.',
            invalidDate: 'La fecha de expedición no es válida.',
            dateOutOfRange: 'La fecha de expedición debe estar entre 1900 y la fecha actual.'
          }
        }
      },
      {
        key: 'fechaNacimiento',
        type: 'datepicker',
        className: 'field-container',
        templateOptions: {
          label: 'Fecha Nacimiento',
          placeholder: 'Ingrese fecha de nacimiento',
          required: true,
          appearance: 'outline',
          floatLabel: 'always',
          attributes: {
            'class': 'modern-input'
          }
        },
        validators: {
          validation: [
            (control: { value: any; }) => {
              const value = control.value;
              if (!value) return null;

              const birthDate = new Date(value);
              const today = new Date();
              const minValidDate = new Date(1900, 0, 1);
              const eighteenYearsAgo = new Date(
                today.getFullYear() - 18,
                today.getMonth(),
                today.getDate()
              );

              //Comprobar si la fecha es válida
              if (isNaN(birthDate.getTime())) {
                return { invalidDate: true };
              }

              //Consultar rango de fechas
              if (birthDate < minValidDate || birthDate > today) {
                return { dateOutOfRange: true };
              }

              // Verificar edad (debe tener 18 años o más)
              if (birthDate > eighteenYearsAgo) {
                return { underAge: true };
              }

              return null;
            }
          ]
        },
        validation: {
          messages: {
            required: 'La fecha de nacimiento es obligatoria.',
            invalidDate: 'La fecha de nacimiento no es válida.',
            dateOutOfRange: 'La fecha de nacimiento debe estar entre 1900 y la fecha actual.',
            underAge: 'Debe ser mayor de 18 años para registrarse.'
          }
        }
      },
      {
        key: 'direccion',
        type: 'input',
        className: 'field-container',
        templateOptions: {
          label: 'Direccion',
          placeholder: 'Ingrese direccion',
          required: true,
          appearance: 'outline',
          floatLabel: 'always',
          attributes: {
            'class': 'modern-input'
          },
          minLength: 5,
          maxLength: 200
        },
        validation: {
          messages: {
            required: 'La dirección es obligatoria.',
            minlength: 'La dirección debe tener al menos 5 caracteres.',
          }
        }
      },
      {
        key: 'telefono',
        type: 'input',
        className: 'field-container',
        templateOptions: {
          label: 'Teléfono',
          placeholder: 'Ingrese teléfono',
          required: true,
          appearance: 'outline',
          floatLabel: 'always',
          attributes: {
            class: 'modern-input'
          },
          pattern: /^[0-9]*$/,
          minLength: 5,
          maxLength: 20
        },
        validation: {
          messages: {
            required: 'El teléfono es obligatorio.',
            pattern: 'Solo se permiten números en este campo.',
            minlength: 'El teléfono debe tener al menos 5 dígitos.',
          }
        }
      },
      {
        key: 'telefonoAdicional',
        type: 'input',
        className: 'field-container',
        templateOptions: {
          label: 'Teléfono Adicional',
          placeholder: 'Ingrese teléfono adicional',
          appearance: 'outline',
          floatLabel: 'always',
          attributes: {
            'class': 'modern-input'
          },
          pattern: /^[0-9]*$/,
          maxLength: 20
        },
        validation: {
          messages: {
            pattern: 'Solo se permiten números en este campo.'
          }
        },
        hideExpression: (model) => model.tipoPersona !== 'CONTRATISTA'
      },
      {
        key: 'nacionalidad',
        type: 'input',
        className: 'field-container',
        templateOptions: {
          label: 'Nacionalidad',
          placeholder: 'Ingrese nacionalidad',
          required: true,
          appearance: 'outline',
          floatLabel: 'always',
          attributes: {
            'class': 'modern-input'
          },
          pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
          minLength: 3,
          maxLength: 50
        },
        validation: {
          messages: {
            required: 'La nacionalidad es obligatoria.',
            pattern: 'La nacionalidad solo puede contener letras.',
            minlength: 'La nacionalidad debe tener al menos 3 caracteres.',
          }
        }
      },
      {
        key: 'documentosFormacionAcademica',
        type: 'file',
        templateOptions: {
          label: 'Documentos de formación académica',
          placeholder: 'Seleccione los documentos de formación académica',
          multiple: true,
          required: false,
          accept: '.pdf, .doc, .xls, image/*',
          maxFileSize: 100 * 1024 * 1024
        },
        validation: {
          messages: {
            maxFileSize: 'El tamaño de cada archivo no puede exceder 5MB'
          }
        },
      },
      {
        key: 'documentosLegales',
        type: 'file',
        templateOptions: {
          label: 'Documentos Legales',
          placeholder: 'Seleccione los documentos legales',
          multiple: true,
          required: false,
          accept: '.pdf, .doc, .xls, image/*',
          maxFileSize: 5 * 1024 * 1024
        },
        validation: {
          messages: {
            maxFileSize: 'El tamaño de cada archivo no puede exceder 5MB'
          }
        },
      },
      {
        key: 'certificacionesLaborales',
        type: 'file',
        templateOptions: {
          label: 'Certificaciones laborales',
          placeholder: 'Seleccione las certificaciones laborales',
          multiple: true,
          required: false,
          accept: '.pdf, .doc, .xls, image/*',
          maxFileSize: 5 * 1024 * 1024
        },
        validation: {
          messages: {
            maxFileSize: 'El tamaño de cada archivo no puede exceder 5MB'
          }
        },
      },
      {
        key: 'tituloProfesional',
        type: 'input',
        className: 'field-container',
        templateOptions: {
          label: 'Título Profesional',
          placeholder: 'Ingrese título profesional',
          required: true,
          appearance: 'outline',
          floatLabel: 'always',
          attributes: {
            'class': 'modern-input'
          },
          pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
          minLength: 5,
          maxLength: 100
        },
        validation: {
          messages: {
            required: 'El título profesional es obligatorio.',
            pattern: 'El título profesional solo puede contener letras.',
            minlength: 'El título profesional debe tener al menos 5 caracteres.',
          }
        }
      },
      {
        key: 'experienciaProfesional',
        type: 'textarea',
        className: 'field-container',
        templateOptions: {
          label: 'Experiencia Profesional',
          placeholder: 'Ingrese experiencia profesional',
          appearance: 'outline',
          floatLabel: 'always',
          attributes: {
            'class': 'modern-input'
          },
          rows: 5,
          minLength: 5,
          maxLength: 250
        },
        validation: {
          messages: {
            minlength: 'La experiencia profesional debe tener al menos 5 caracteres.',
          }
        },
        hideExpression: (model) => model.tipoPersona !== 'GERENTE' && model.tipoPersona !== 'CONTRATISTA'
      },
      {
        key: 'numeroTarjetaProfesional',
        type: 'input',
        className: 'field-container',
        templateOptions: {
          label: 'Número de Tarjeta Profesional',
          placeholder: 'Ingrese número de tarjeta',
          appearance: 'outline',
          floatLabel: 'always',
          minLength: 5,
          maxLength: 50
        },
        validation: {
          messages: {
            minlength: 'El número de tarjeta profesional debe tener al menos 5 caracteres.',
          }
        },
        hideExpression: (model) => model.tipoPersona !== 'CONTRATISTA' && model.tipoPersona !== 'CONTADOR'
      },
      {
        key: 'necesitaAcceso',
        type: 'checkbox',
        templateOptions: {
          label: '¿Necesita acceso al sistema?',
        },
        hooks: {
          onInit: (field) => {
            if (!field || !field.formControl) return; // Verificamos que formControl exista

            field.formControl.valueChanges.subscribe((value) => {
              if (value) {
                // Si necesita acceso, asignamos el rol dinámico
                const tipoPersona = this.model.tipoPersona?.toUpperCase();
                if (tipoPersona && this.rolesMap[tipoPersona]) {
                  this.model.roles = [this.rolesMap[tipoPersona]];
                }
              } else {
                this.model.roles = [];
              }
            });
          }
        }
      },
    ];

    this.loadTipoDocumentoOptions();
  }

  private loadTipoDocumentoOptions() {
    this.tipoDocumentoService.findAll().subscribe(
      data => {
        const field = this.fields.find(f => f.key === 'tipoDocumento');
        if (field && field.templateOptions) {
          field.templateOptions.options = data;
        }
      },
      error => console.error('Error al cargar tipoDocumento:', error)
    );
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    // 1. Validaciones previas
    this.preCreate(this.model);

    // 2. Copiamos el modelo para no mutarlo directamente
    const modelData = {...this.model};
    modelData.tipoDocumento = {id: this.model.tipoDocumento};

    // Si necesita acceso, asignamos el rol dinámicamente
    if (this.model.necesitaAcceso) {
      const roleId = this.rolesMap[this.model.tipoPersona.toUpperCase()];

      if (roleId) {
        modelData.roles = [roleId]; // Asignamos el ID del rol correspondiente
      } else {
        console.error('Rol no encontrado para tipoPersona:', this.model.tipoPersona);
        return;
      }
    } else {
      delete modelData.roles;
    }
    const uploadOperations: Observable<void>[] = [];
    const fileFields: (keyof PersonaModel)[] = [ 'documentosFormacionAcademica','documentosLegales', 'certificacionesLaborales'];

    const handleFileUpload = (field: keyof PersonaModel) => {
      const files = this.model[field];

      if (Array.isArray(files) && files.length > 0) {
        const upload$ = this.personaService.uploadFiles(files).pipe(
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
        const upload$ = this.personaService.uploadFile(files).pipe(
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
    this.personaService.save(modelData).subscribe({
      next: (response) => {
        this.postCreate(response);
      },
      error: (error) => {
        console.error('Error al crear Persona:', error);
        this.snackBar.open('Error al crear Persona', 'Cerrar', {
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
    this.snackBar.open('Persona creado exitosamente', 'Cerrar', {
      duration: 3000,
    });
    this.dialogRef.close(true);
    console.log('Acciones postCreate completadas.');
  }

  /**
   * para calcular la edad de una persona, con el fin de validar en el campo
   * de fecha de nacimiento que sea mayor de edad
   * @param {Date} fechaNacimiento - fecha de nacimiento ingresada.
   * @returns {number} edad calculada basada en la fecha actual.
   */
  calcularEdad(fechaNacimiento: Date): number {
    // Obtener la fecha actual
    const fechaActual = new Date();

   //con esto calculamos la diferencia solo de los añps
    let edad = fechaActual.getFullYear() - fechaNacimiento.getFullYear();

    // aqui comparamos los meses tambien
    const diferenciaMeses = fechaActual.getMonth() - fechaNacimiento.getMonth();

    // se ajusta la edad si el mes actual es menor que el mes de nacimiento
    // o si es el mismo mes pero el día actual es anterior al día de nacimiento
    if (diferenciaMeses < 0 || (diferenciaMeses === 0 && fechaActual.getDate() < fechaNacimiento.getDate())) {
      edad--;
    }
    return edad;
  }
}
