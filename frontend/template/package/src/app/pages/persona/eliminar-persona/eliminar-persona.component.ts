/**
 * @fileoverview Componente de eliminación para la entidad Persona
 */

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Router, RouterModule } from '@angular/router';
import { PersonaService } from '../../../services/PersonaService';
import { PersonaComponent } from '../persona.component';
import { CommonModule, DatePipe  } from '@angular/common';
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
import { ProyectoService } from '../../../services/ProyectoService';

/**
 * Componente para la eliminación de registros de Persona
 */
@Component({
  selector: 'app-eliminar-persona',
  templateUrl: './eliminar-persona.component.html',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
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
  styleUrls: ['./eliminar-persona.component.css']
})
export class EliminarPersonaComponent implements OnInit {
  /** Lista de registros de Persona */
  personas: PersonaComponent[] = [];
  /** Formulario del componente */
  form = new FormGroup({});
  /** Modelo de datos */
  model = {};
  /** Configuración de campos */
  fields: FormlyFieldConfig[] = [];
  /** Columnas a mostrar en la tabla */
  displayedColumns: string[] = ['fechaNacimiento', 'direccion', 'proyecto', 'nombre', 'nacionalidad', 'tituloProfesional', 'fechaExpedicion', 'tipoDocumento', 'creador', 'correo', 'id', 'numeroDocumento', 'telefono', 'actions'];

  /**
   * Constructor del componente
   */
  constructor(
    private personaService: PersonaService,
    private proyectoservice: ProyectoService,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe
  ) {}

  /**
   * Inicializa el componente
   */
  ngOnInit() {
    this.initializeFields();
  }

  /**
   * Inicializa los campos y carga los datos
   */
  private initializeFields() {
    this.personaService.findAll().subscribe(
      data => {
        // @ts-ignore
        this.personas = data.map(item => Object.assign(new PersonaComponent(), item));
      },
      error => {
        console.error('Error al obtener personas:', error);
        this.showMessage('Error al cargar los datos', 'error');
      }
    );
  }

  /**
   * Formatea un valor según su tipo
   */
  formatValue(value: any, type: string): string {
    if (value === null || value === undefined) return 'N/A';
    switch (type) {
      case 'Date':
        return this.datePipe.transform(value, 'dd/MM/yyyy HH:mm') || 'N/A';
      case 'Double':
      case 'Float':
        return value.toFixed(2);
      default:
        return value.toString();
    }
  }

  /**
   * Elimina un registro
   */
  onDelete(personaId: number) {
    if (confirm('¿Está seguro de eliminar este registro?')) {
      this.personaService.deleteById(personaId).subscribe(
        () => {
          this.showMessage('Registro eliminado con éxito', 'success');
          this.initializeFields();
        },
        error => {
          console.error('Error al eliminar:', error);
          this.showMessage('Error al eliminar el registro', 'error');
        }
      );
    }
  }

  /**
   * Muestra un mensaje al usuario
   */
  private showMessage(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: type === 'error' ? ['error-snackbar'] : ['success-snackbar']
    });
  }
}
