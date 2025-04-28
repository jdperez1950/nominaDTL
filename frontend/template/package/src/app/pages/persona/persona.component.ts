// Importaciones core de Angular
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PersonaService } from '../../services/PersonaService';

// Importaciones de Angular Material para UI components
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Importaciones específicas para tipos de datos especiales
import { DatePipe } from '@angular/common';

/**
 * Componente principal para la gestión de la entidad Persona
 * Proporciona una interfaz para visualizar y manipular los datos de la entidad
 */
@Component({
  selector: 'app-persona',
  standalone: true,
  imports: [
    // Módulos básicos de Angular
    CommonModule,
    RouterModule,
    // Módulos de Angular Material
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
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.scss']
})
export class PersonaComponent {
  // Atributos de la entidad con sus tipos correspondientes
  /** id - Campo de tipo number */
  id: number;

  /** nombre - Campo de tipo string */
  nombre: string;

  /** correo - Campo de tipo string */
  correo: string;

  /** numeroDocumento - Campo de tipo number */
  numeroDocumento: string;

  /** tituloProfesional - Campo de tipo string */
  tituloProfesional: string;

  /** direccion - Campo de tipo string */
  direccion: string;

  /** telefono - Campo de tipo number */
  telefono: string;

  /** fechaExpedicion - Campo de tipo Date */
  fechaExpedicion: Date;

  /** fechaNacimiento - Campo de tipo Date */
  fechaNacimiento: Date;

  /** nacionalidad - Campo de tipo string */
  nacionalidad: string;

  /** creador - Campo de tipo string */
  creador: string;

  /** proyecto - Campo de tipo any[] */
  proyecto: any[];

  /** contrato - Campo de tipo any[] */
  contrato: any[];

  /** documento - Campo de tipo any[] */
  documento: any[];

  /** tipoDocumento - Campo de tipo any */
  tipoDocumento: any;

  // Configuración de columnas para tablas de atributos y relaciones
  displayedColumnsAttributes: string[] = ['name', 'type'];
  displayedColumnsRelations: string[] = ['entity', 'type'];

  // DataSource para la tabla de atributos
  dataSourceAttributes = new MatTableDataSource([
    { name: 'id', type: 'long' },
    { name: 'nombre', type: 'String' },
    { name: 'correo', type: 'String' },
    { name: 'numeroDocumento', type: 'String' },
    { name: 'tituloProfesional', type: 'String' },
    { name: 'direccion', type: 'String' },
    { name: 'telefono', type: 'String' },
    { name: 'fechaExpedicion', type: 'LocalDate' },
    { name: 'fechaNacimiento', type: 'LocalDate' },
    { name: 'nacionalidad', type: 'String' },
    { name: 'creador', type: 'String' },
    { name: 'proyecto', type: 'Lista de Proyectos' },
    { name: 'contrato', type: 'Lista de Contratos' },
    { name: 'documento', type: 'Lista de Documentos' },
    { name: 'tipoDocumento', type: 'TipoDocumento' },
  ]);

  // DataSource para la tabla de relaciones
  dataSourceRelations = new MatTableDataSource([
    { entity: 'Proyecto', type: 'Many-to-One' },
    { entity: 'Contrato', type: 'One-to-Many' },
    { entity: 'Documento', type: 'One-to-Many' },
    { entity: 'TipoDocumento', type: 'Many-to-One' },
  ]);

  /**
   * Constructor del componente
   * @param service Servicio para la gestión de datos de la entidad
   */
  constructor(private service: PersonaService) {
    // Inicialización de atributos con valores por defecto
    this.id = 0;
    this.nombre = '';
    this.correo = '';
    this.numeroDocumento = '';
    this.tituloProfesional = '';
    this.direccion = '';
    this.telefono = '';
    this.fechaExpedicion = new Date();
    this.fechaNacimiento = new Date();
    this.nacionalidad = '';
    this.creador = '';
    this.proyecto = [];
    this.contrato = [];
    this.documento = [];
    this.tipoDocumento = null;
  }
}
