import { Component, OnInit,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {AbstractControl, FormGroup,Validators, ReactiveFormsModule} from '@angular/forms';
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
import {CuentaCobroDTO, CuentaCobroService} from '../../../services/CuentaCobroService';
import {Observable, forkJoin, of, throwError, map, distinctUntilChanged} from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { ContratoService } from '../../../services/ContratoService';
import { InformeService } from '../../../services/InformeService';

interface CuentaCobroModel {
  montoCobrar: number;
  numeroCuentaCobro: number;
  periodoACobrar: string;
  fecha: Date;
  estado: boolean;
  numeroCuenta: string;
  detalle: string;
  pago: boolean;
  notificacionPago: string;
  firmaGerente: any;
  firmaContratista: any;
  planillaSeguridadSocial?: any;
  creador: string;
  contrato: any;
  informe: any;
  observaciones?: string;
}

@Component({
  selector: 'app-crear-cuentacobro',
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
  templateUrl: './crear-cuentacobro.component.html',
  styleUrls: ['./crear-cuentacobro.component.scss']
})
export class CrearCuentaCobroComponent implements OnInit {

  previews: { [key: string]: string | null } = {
    firmaGerente: null,
    firmaContratista: null
  };

  form = new FormGroup({});
  model: CuentaCobroModel = {
    montoCobrar: 0,
    numeroCuentaCobro: 0,
    periodoACobrar: '',
    fecha: new Date(),
    estado: false,
    numeroCuenta: '',
    detalle: '',
    pago: false,
    notificacionPago: '',
    firmaGerente: '',
    firmaContratista: '',
    planillaSeguridadSocial: '',
    creador: '',
    contrato: null,
    informe: null,
    observaciones: '',
  };
  fields: FormlyFieldConfig[] = [];

  isLoading = false;

  constructor(
    private dialogRef: MatDialogRef<CrearCuentaCobroComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cuentaCobroService: CuentaCobroService,
    private contratoService: ContratoService,
    private informeService: InformeService,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const username = this.authService.getUsername();
    this.model.creador = username;
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
          required: false,
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
        },
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
        hooks: {
          onInit: (field) => {
            field.formControl?.valueChanges.pipe(
              distinctUntilChanged(),
              switchMap(contratoId => {
                if (!contratoId) return of(null);
                return this.cuentaCobroService.obtenerCuentasCobroPorContrato(
                  this.authService.getUsername(),
                  contratoId
                );
              })
            ).subscribe(cuentas => {
              if (cuentas) {
                // Calcular el próximo número
                const siguienteNumero = cuentas.length + 1;
                this.model.numeroCuentaCobro = siguienteNumero;

                // Actualizar el campo en el formulario si es necesario
                const numeroField = this.fields.find(f => f.key === 'numeroCuentaCobro');
                if (numeroField) {
                  numeroField.formControl?.setValue(siguienteNumero);
                }
              }
            });
          }
        },
        asyncValidators: {
          validarNumeroCuentasCobro: {
            expression: (control: AbstractControl): Observable<boolean> | Promise<boolean> => {
              if (!control.value) {
                return of(true); // Si no hay contrato seleccionado, no es necesario validar
              }
              return this.contratoService.getDetalleContrato(control.value).pipe(
                map(response => {
                  return response.numeroCuentasCobro < response.numeroPagosPermitidos;
                }),
                catchError(() => of(false)) // En caso de error en la llamada, supongamos que no es válido
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

    this.loadContratoOptions();
  }

  private loadContratoOptions() {
    const personaId = this.authService.getPersonaId();

    if (personaId) {
      this.contratoService.findVisibles(personaId).subscribe(
        data => {
          const field = this.fields.find(f => f.key === 'contrato');
          if (field && field.templateOptions) {
            field.templateOptions.options = data.filter(contrato => contrato.estado);
          }
        },
        error => console.error('Error al cargar contratos de la persona:', error)
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
    const modelData = {
      ...this.model,
      contrato: { id: this.model.contrato },
      informe: this.model.informe ? { id: this.model.informe } : null
    };

    this.isLoading = true;

    // Limpiar valor de monto a cobrar para guardar solo el número
    if (modelData.montoCobrar) {
      const cleanedValue = String(modelData.montoCobrar)
        .replace(/[^\d]/g, '')  // Elimina todo excepto dígitos
        .replace(/^0+/, '');    // Elimina ceros a la izquierda

      modelData.montoCobrar = cleanedValue ? Number(cleanedValue) : 0;
    }

    const uploadOperations: Observable<void>[] = [];
    const fileFields: (keyof CuentaCobroModel)[] = [ 'firmaGerente','firmaContratista', "planillaSeguridadSocial"];

    const handleFileUpload = (field: keyof CuentaCobroModel) => {
      const files = this.model[field];

      if (Array.isArray(files) && files.length > 0) {
        const upload$ = this.cuentaCobroService.uploadFiles(files).pipe(
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
        const upload$ = this.cuentaCobroService.uploadFile(files).pipe(
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
     this.cuentaCobroService.save(modelData).subscribe({
       next: (response) => {
         this.isLoading = false;
         this.postCreate(response);
       },
       error: (error) => {
         this.isLoading = false;
         console.error('Error al crear CuentaCobro:', error);
         this.snackBar.open('Error al crear CuentaCobro', 'Cerrar', {
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
    this.snackBar.open('CuentaCobro creado exitosamente', 'Cerrar', {
      duration: 3000,
    });
    this.dialogRef.close(true);
    console.log('Acciones postCreate completadas.');
  }

  handleImageChange(field: FormlyFieldConfig, event: Event, fieldName: 'firmaGerente' | 'firmaContratista') {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    // Validación de tipo de imagen (manteniendo tu lógica)
    if (!file.type.match('image.*')) {
      this.snackBar.open('Solo se permiten archivos de imagen', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    // Validación de tamaño (puedes ajustar el límite)
    if (file.size > 2 * 1024 * 1024) { // 2MB
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

        // 1. Actualizar el modelo (seguro en tipos)
        this.model[fieldName] = base64;

        // 2. Actualizar previsualización (forma segura)
        if (field.templateOptions) {
          (field.templateOptions as any).preview = base64;
        }

        // 3. Actualizar vista (forma optimizada)
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
