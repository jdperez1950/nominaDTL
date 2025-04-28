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
import { PersonaService } from '../../../services/PersonaService';
import { ProyectoService } from '../../../services/ProyectoService';
import { TipoDocumentoService } from '../../../services/TipoDocumentoService';
import {AuthService} from "../../../services/auth-service.service";
import {PermissionService} from "../../authentication/services/PermissionService";
import {forkJoin, Observable, of, throwError} from "rxjs";
import {catchError, switchMap} from "rxjs/operators";

interface PersonaModel {
  id: number;
  nombre: string;
  correo: string;
  numeroDocumento: string;
  tituloProfesional: string;
  direccion: string;
  telefono: string;
  fechaExpedicion: Date;
  fechaNacimiento: Date;
  nacionalidad: string;
  documentosFormacionAcademica: any;
  documentosLegales: any;
  certificacionesLaborales: any;
  creador: string;
  proyecto: any;
  tipoDocumento: any;
  tipoPersona: any;
  necesitaAcceso: boolean;
  roles?: number[];
  experienciaProfesional?: string | null;
  numeroTarjetaProfesional?: string | null;
  telefonoAdicional?: string | null;
}

/**
 * Componente para la actualización de Persona
 * @description Maneja el formulario de actualización utilizando Formly
 */
@Component({
  selector: 'app-actualizar-persona',
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
  templateUrl: './actualizar-persona.component.html',
  styleUrls: ['./actualizar-persona.component.scss']
})
export class ActualizarPersonaComponent implements OnInit {
  /** Lista de todas las entidades */
  personas: any[] = [];
  /** Lista de proyecto disponible */
  proyectos: any[] = [];
  /** Lista de tipoDocumento disponibles */
  tipoDocumentos: any[] = [];
   /** Lista de tipoPersona disponibles */
   tipoPersona: any[] = [];
  /** Entidad seleccionada para actualizar */
  selectedPersona: any = null;
  form = new FormGroup({});
  model: PersonaModel = {} as PersonaModel;
  originalModel: PersonaModel = {} as PersonaModel;
  fields: FormlyFieldConfig[] = [];
  /** Lista de roles disponibles */
  roles: any[] = [];
  rolesMap: { [key: string]: number } = {};

  isLoading: boolean = false;

  /**
   * Constructor del componente
   * @param personaService Servicio principal de la entidad
   * @param proyectoService Servicio para gestionar Proyecto
   * @param tipoDocumentoService Servicio para gestionar TipoDocumento
   * @param router Servicio de enrutamiento
   * @param snackBar Servicio para notificaciones
   * @param authService
   * @param permissionService
   * @param data Datos recibidos por el diálogo
   * @param dialogRef Referencia al diálogo
   */
  constructor(
    private personaService: PersonaService,
    private proyectoService: ProyectoService,
    private tipoDocumentoService: TipoDocumentoService,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private permissionService: PermissionService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ActualizarPersonaComponent>
  ) {}

  /** Inicialización del componente */
  ngOnInit() {
    this.loadPersonas();
    this.loadProyectoOptions();
    this.loadTipoDocumentoOptions();
    this.loadRoles();

    // Verificamos si llega data a través del diálogo (registro para editar)
    if (this.data) {
      try {
        this.selectedPersona = { ...this.data };
        console.log('tipoPersona recibido:', this.data.tipoPersona);
        console.log('Datos completos recibidos:', this.data);


        // Inicializar modelo con los datos recibidos
        this.model = {
          tipoPersona: this.data.tipoPersona,
          id: this.data.id,
          nombre: this.data.nombre,
          correo: this.data.correo,
          numeroDocumento: this.data.numeroDocumento,
          tituloProfesional: this.data.tituloProfesional,
          direccion: this.data.direccion,
          telefono: this.data.telefono,
          fechaExpedicion: this.data.fechaExpedicion,
          fechaNacimiento: this.data.fechaNacimiento,
          nacionalidad: this.data.nacionalidad,
          documentosFormacionAcademica: this.data.documentosFormacionAcademica || '',
          documentosLegales: this.data.documentosLegales || '',
          certificacionesLaborales: this.data.certificacionesLaborales || '',
          creador: this.data.creador,
          proyecto: this.data.proyecto && this.data.proyecto.id ? this.data.proyecto.id : null,
          tipoDocumento: this.data.tipoDocumento && this.data.tipoDocumento.id ? this.data.tipoDocumento.id : null,
          necesitaAcceso: this.data.necesitaAcceso ?? false,
          roles: this.data.roles || [],
          experienciaProfesional: this.data.experienciaProfesional,
          numeroTarjetaProfesional: this.data.numeroTarjetaProfesional,
          telefonoAdicional: this.data.telefonoAdicional,
        };

        // Copia del modelo original para detectar cambios
        this.originalModel = {
          tipoPersona: this.data.tipoPersona,
          id: this.data.id,
          nombre: this.data.nombre,
          correo: this.data.correo,
          numeroDocumento: this.data.numeroDocumento,
          tituloProfesional: this.data.tituloProfesional,
          direccion: this.data.direccion,
          telefono: this.data.telefono,
          fechaExpedicion: this.data.fechaExpedicion,
          fechaNacimiento: this.data.fechaNacimiento,
          nacionalidad: this.data.nacionalidad,
          documentosFormacionAcademica: this.data.documentosFormacionAcademica || '',
          documentosLegales: this.data.documentosLegales || '',
          certificacionesLaborales: this.data.certificacionesLaborales || '',
          creador: this.data.creador,
          proyecto: this.data.proyecto && this.data.proyecto.id ? this.data.proyecto.id : null,
          tipoDocumento: this.data.tipoDocumento && this.data.tipoDocumento.id ? this.data.tipoDocumento.id : null,
          necesitaAcceso: this.data.necesitaAcceso ?? false,
          roles: this.data.roles || [],
          experienciaProfesional: this.data.experienciaProfesional,
          numeroTarjetaProfesional: this.data.numeroTarjetaProfesional,
          telefonoAdicional: this.data.telefonoAdicional,
        };
      } catch (error) {
        console.error('Error al procesar datos:', error);
      }
    }
    this.generateFormFields();
  }

  /** Carga la lista de entidades disponibles */
  loadPersonas() {
    this.personaService.findAll().subscribe(
      data => this.personas = data,
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
        this.proyectos = data;
        this.updateFieldOptions('proyecto', data);
      },
      error => console.error('Error al cargar proyecto:', error)
    );
  }

  /**
   * Carga las opciones para la relación TipoDocumento
   * @private
   */
  private loadTipoDocumentoOptions() {
    this.tipoDocumentoService.findAll().subscribe(
      data => {
        this.tipoDocumentos = data;
        this.updateFieldOptions('tipoDocumento', data);
      },
      error => console.error('Error al cargar tipoDocumento:', error)
    );
  }

  /**
   * Carga los roles disponibles en el sistema
   * @private
   */
  private loadRoles() {
    this.permissionService.getRoles().subscribe(
      data => {
        this.roles = data;
        // Crear mapeo de roles
        this.roles.forEach(rol => {
          // Mapeo según nombre del rol
          if (rol.nombre.includes('GERENTE')) {
            this.rolesMap['GERENTE'] = rol.id;
          } else if (rol.nombre.includes('CONTRATISTA')) {
            this.rolesMap['CONTRATISTA'] = rol.id;
          } else if (rol.nombre.includes('CONTADOR')) {
            this.rolesMap['CONTADOR'] = rol.id;
          }
        });
        // Actualizar el campo de roles si está presente
        this.updateRolesField();
      },
      error => console.error('Error al cargar roles:', error)
    );
  }

  /**
   * Actualiza el campo de roles en el formulario
   */
  private updateRolesField() {
    // Añadir campo para roles si necesitaAcceso está activo
    if (this.model.necesitaAcceso) {
      const roleField = this.fields.find(f => f.key === 'roles');
      if (roleField && roleField.templateOptions) {
        roleField.templateOptions.options = this.roles;
      }
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
  onEdit(persona: any) {
    this.selectedPersona = { ...persona };
    this.model = { ...this.selectedPersona };
    // Procesar relación simple: proyecto
    if (this.model.proyecto && typeof this.model.proyecto === 'object') {
      this.model.proyecto = this.model.proyecto.id;
    }
    // Procesar relación simple: tipoDocumento
    if (this.model.tipoDocumento && typeof this.model.tipoDocumento === 'object') {
      this.model.tipoDocumento = this.model.tipoDocumento.id;
    }
    this.generateFormFields();
  }

  /**
   * Genera la configuración de campos del formulario
   */
  generateFormFields() {
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
          change: (field, event) => {
            // Reiniciar los campos específicos cuando cambia el tipo de persona
            if (field.formControl?.value === 'GERENTE') {
              this.model.experienciaProfesional = this.model.experienciaProfesional || '';
              this.model.numeroTarjetaProfesional = null;
              this.model.telefonoAdicional = null;
            } else if (field.formControl?.value === 'CONTRATISTA') {
              this.model.experienciaProfesional = this.model.experienciaProfesional || '';
              this.model.numeroTarjetaProfesional = this.model.numeroTarjetaProfesional || '';
              this.model.telefonoAdicional = this.model.telefonoAdicional || '';
            } else if (field.formControl?.value === 'CONTADOR') {
              this.model.experienciaProfesional = null;
              this.model.numeroTarjetaProfesional = this.model.numeroTarjetaProfesional || '';
              this.model.telefonoAdicional = null;
            }
          }
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
          maxLength: 20,
        },
        validation: {
          messages: {
            required: 'El teléfono adicional es obligatorio para contratistas.',
            pattern: 'Solo se permiten números en este campo.'
          }
        },
        hideExpression: (model: any) => model.tipoPersona !== 'CONTRATISTA',
        expressionProperties: {
          'templateOptions.required': 'model.tipoPersona === "CONTRATISTA"',
        }
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
          maxFileSize: 5 * 1024 * 1024
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
          maxLength: 250,
        },
        validation: {
          messages: {
            required: 'La experiencia profesional es obligatoria.',
            minlength: 'La experiencia profesional debe tener al menos 5 caracteres.',
          }
        },
        hideExpression: (model: any) => model.tipoPersona !== 'GERENTE' && model.tipoPersona !== 'CONTRATISTA',
        expressionProperties: {
          'templateOptions.required': 'model.tipoPersona === "GERENTE" || model.tipoPersona === "CONTRATISTA"',
        }
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
          maxLength: 50,
        },
        validation: {
          messages: {
            required: 'El número de tarjeta profesional es obligatorio.',
            minlength: 'El número de tarjeta profesional debe tener al menos 5 caracteres.',
          }
        },
        hideExpression: (model: any) => model.tipoPersona !== 'CONTRATISTA' && model.tipoPersona !== 'CONTADOR',
        expressionProperties: {
          'templateOptions.required': 'model.tipoPersona === "CONTRATISTA" || model.tipoPersona === "CONTADOR"',
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
        key: 'necesitaAcceso',
        type: 'checkbox',
        templateOptions: {
          label: '¿Necesita acceso al sistema?',
        },
        hooks: {
          onInit: (field) => {
            if (!field || !field.formControl) return;

            field.formControl.valueChanges.subscribe((value) => {
              if (value) {
                // Si necesita acceso, asignamos el rol dinámico según el tipo de persona
                const tipoPersona = this.model.tipoPersona?.toUpperCase();
                if (tipoPersona && this.rolesMap[tipoPersona]) {
                  this.model.roles = [this.rolesMap[tipoPersona]];
                }
              } else {
                this.model.roles = [];
              }
              // Actualizamos la visibilidad del campo de roles
              const rolesField = this.fields.find(f => f.key === 'roles');
              if (rolesField) {
                rolesField.hide = !value;
              }
            });
          }
        }
      }
    ];
  }

  /**
   * Actualiza los roles asignados según el tipo de persona seleccionado
   */
  actualizarRolSegunTipoPersona() {
    if (this.model.necesitaAcceso) {
      const tipoPersona = this.model.tipoPersona?.toUpperCase();
      if (tipoPersona && this.rolesMap[tipoPersona]) {
        this.model.roles = [this.rolesMap[tipoPersona]];
      }
    }
  }

  onSubmit() {
    // Asegurar que el rol está asignado según el tipo de persona
    this.actualizarRolSegunTipoPersona();

    // Verificar si necesita acceso pero no tiene roles seleccionados
    if (this.model.necesitaAcceso && (!this.model.roles || this.model.roles.length === 0)) {
      this.snackBar.open('Debe seleccionar al menos un rol para el usuario.', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
      return;
    }

    // 1. Acciones previas
    this.preUpdate(this.model);

    const modelData = { ...this.model };

    if (modelData.proyecto) {
      modelData.proyecto = { id: modelData.proyecto };
    }

    if (modelData.tipoDocumento) {
      modelData.tipoDocumento = { id: modelData.tipoDocumento };
    }

    // Manejar campos opcionales según el tipo de persona
    if (modelData.tipoPersona === 'GERENTE') {
      // Asegurar que experienciaProfesional esté presente para gerentes
      modelData.experienciaProfesional = modelData.experienciaProfesional || '';
      // Quitar campos no aplicables
      modelData.numeroTarjetaProfesional = null;
      modelData.telefonoAdicional = null;
    } else if (modelData.tipoPersona === 'CONTRATISTA') {
      // Asegurar que todos los campos de contratista estén presentes
      modelData.experienciaProfesional = modelData.experienciaProfesional || '';
      modelData.numeroTarjetaProfesional = modelData.numeroTarjetaProfesional || '';
      modelData.telefonoAdicional = modelData.telefonoAdicional || '';
    } else if (modelData.tipoPersona === 'CONTADOR') {
      // Asegurar que numeroTarjetaProfesional esté presente para contadores
      modelData.numeroTarjetaProfesional = modelData.numeroTarjetaProfesional || '';
      // Quitar campos no aplicables
      modelData.experienciaProfesional = null;
      modelData.telefonoAdicional = null;
    }

    const uploadOperations: Observable<void>[] = [];
    const fileFields: (keyof PersonaModel)[] = ['documentosFormacionAcademica','documentosLegales', 'certificacionesLaborales'];

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
    this.personaService.update(modelData.id, modelData).subscribe({
      next: (response) => {
        this.postUpdate(response);
      },
      error: (error) => {
        console.error('Error al actualizar Persona:', error);
        this.snackBar.open('Error al actualizar Persona', 'Cerrar', {
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
  private hasChanges(model: PersonaModel): boolean {
    for (const key in model) {
      const keyTyped = key as keyof PersonaModel;
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
   * Método para acciones previas a actualizar Persona.
   */
  preUpdate(model: any) {
    // Verificar si el formulario es válido
    if (!this.form.valid) {
      this.snackBar.open('Por favor complete todos los campos requeridos.', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
      throw new Error('El formulario no es válido.');
    }

    // Verificar si hubo cambios
    if (!this.hasChanges(model)) {
      this.snackBar.open('No se han realizado cambios en Persona.', 'Cerrar', {
        duration: 3000,
      });
      throw new Error('No se han realizado cambios en el registro.');
    }

    // Validar campos según el tipo de persona
    if (model.tipoPersona === 'GERENTE' && (!model.experienciaProfesional || model.experienciaProfesional.trim() === '')) {
      this.snackBar.open('La experiencia profesional es requerida para Gerentes.', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
      throw new Error('Campos específicos de Gerente incompletos.');
    }

    if (model.tipoPersona === 'CONTRATISTA') {
      const camposRequeridos = [];
      if (!model.experienciaProfesional || model.experienciaProfesional.trim() === '') camposRequeridos.push('Experiencia Profesional');
      if (!model.numeroTarjetaProfesional || model.numeroTarjetaProfesional.trim() === '') camposRequeridos.push('Número de Tarjeta Profesional');
      if (!model.telefonoAdicional || model.telefonoAdicional.trim() === '') camposRequeridos.push('Teléfono Adicional');

      if (camposRequeridos.length > 0) {
        this.snackBar.open(`Campos requeridos para Contratista: ${camposRequeridos.join(', ')}`, 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
        throw new Error('Campos específicos de Contratista incompletos.');
      }
    }

    if (model.tipoPersona === 'CONTADOR' && (!model.numeroTarjetaProfesional || model.numeroTarjetaProfesional.trim() === '')) {
      this.snackBar.open('El número de tarjeta profesional es requerido para Contadores.', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
      throw new Error('Campos específicos de Contador incompletos.');
    }

    // Quitar espacios al inicio y final
    for (const key in model) {
      if (typeof model[key] === 'string') {
        model[key] = model[key].trim();
      }
    }

    console.log('Validaciones de preUpdate completadas.');
  }

  /**
   * Método para acciones posteriores al actualizar Persona.
   */
  postUpdate(response: any) {
    this.snackBar.open('Persona actualizado exitosamente', 'Cerrar', {
      duration: 3000,
    });
    this.dialogRef.close(true);
    console.log('Acciones postUpdate completadas.');
  }

}
