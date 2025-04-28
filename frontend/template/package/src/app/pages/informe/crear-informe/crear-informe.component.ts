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
import { InformeService } from '../../../services/InformeService';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { CuentaCobroService } from '../../../services/CuentaCobroService';
import { ProyectoService } from '../../../services/ProyectoService';
import { ContratoService } from '../../../services/ContratoService';

interface InformeModel {
  fecha: Date;
  cliente: string;
  cargo: string;
  informePDF: any;
  creador: string;
  cuentaCobro: any;
  proyecto: any;
  contrato: any;
}

@Component({
  selector: 'app-crear-informe',
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
  templateUrl: './crear-informe.component.html',
  styleUrls: ['./crear-informe.component.scss']
})
export class CrearInformeComponent implements OnInit {
  form = new FormGroup({});
  model: InformeModel = {
    fecha: new Date(),
    cliente: '',
    cargo: '',
    informePDF: '',
    creador: '',
    cuentaCobro: null,
    proyecto: null,
    contrato: null
  };
  fields: FormlyFieldConfig[] = [];

  isLoading = false;

  constructor(
    private dialogRef: MatDialogRef<CrearInformeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private informeService: InformeService,
    private cuentaCobroService: CuentaCobroService,
    private proyectoService: ProyectoService,
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
        key: 'proyecto',
        type: 'select',
        className: 'field-container',
        templateOptions: {
          label: 'Proyecto',
          change: (field, event) => {
            // Obtener el valor del proyecto seleccionado
            const value: number = field.formControl?.value;
            if (value !== -1) { // Solo cargar contratos si no es "No aplica"
              this.loadContratoOptions(value);
            } else {
              // Cargar contratos con "No aplica"
              this.loadContratosNoAplica();
            }
            console.log('Proyecto seleccionado:', value);
          },
          placeholder: 'Seleccione proyecto',
          required: false,
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

    this.loadProyectoOptions();
  }

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

  private loadProyectoOptions() {
    // Obtener el ID de la persona desde el token
    const personaId = this.authService.getPersonaId();

    if (personaId) {
      // Usar un método específico en el servicio de contratos para obtener contratos por persona
      this.proyectoService.findVisibles(personaId).subscribe(
        data => {
          const field = this.fields.find(f => f.key === 'proyecto');
          if (field && field.templateOptions) {
            // Agregar la opción "No aplica" al inicio de la lista
            field.templateOptions.options = [
              { id: -1, nombre: 'No aplica' },
              ...data
            ];
          }
        },
        error => console.error('Error al cargar proyectos de la persona:', error)
      );
    } else {
      console.error('No se pudo obtener el ID de la persona');
    }
  }

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

  private loadContratosNoAplica() {
    // Obtener el ID de la persona desde el token
    const personaId = this.authService.getPersonaId();

    if (personaId) {
      // Llamamos al servicio para obtener contratos sin proyecto
      this.contratoService.findVisibles(personaId).subscribe(
        (data: any[]) => {
          // Filtrar solo los contratos que no tienen proyecto
          const contratosSinProyecto = data.filter((contrato: any) => !contrato.proyecto);
          const field = this.fields.find(f => f.key === 'contrato');
          if (field && field.templateOptions) {
            field.templateOptions.options = contratosSinProyecto;
          }
        },
        (error: any) => console.error('Error al cargar contratos sin proyecto:', error)
      );
    } else {
      console.error('No se pudo obtener el ID de la persona');
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    // 1. Validaciones previas
    this.preCreate(this.model);

    // 2. Copiamos el modelo para no mutarlo directamente
    const modelData = { ...this.model };
    this.isLoading = true;

    // Solo asignar proyecto si no es "No aplica"
    if (this.model.proyecto !== -1) {
      modelData.proyecto = { id: this.model.proyecto };
    } else {
      modelData.proyecto = null;
    }

    modelData.cuentaCobro = { id: this.model.cuentaCobro };
    modelData.contrato = { id: this.model.contrato };

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
     this.informeService.save(modelData).subscribe({
       next: (response) => {
         this.isLoading = false;
         this.postCreate(response);
       },
       error: (error) => {
         this.isLoading = false;
         console.error('Error al crear Informe:', error);
         this.snackBar.open('Error al crear Informe', 'Cerrar', {
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
    this.snackBar.open('Informe creado exitosamente', 'Cerrar', {
      duration: 3000,
    });
    this.dialogRef.close(true);
    console.log('Acciones postCreate completadas.');
  }
}
