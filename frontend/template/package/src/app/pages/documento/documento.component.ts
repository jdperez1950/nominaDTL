// Importaciones core de Angular
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DocumentoService } from '../../services/DocumentoService';

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
 * Componente principal para la gestión de la entidad Documento
 * Proporciona una interfaz para visualizar y manipular los datos de la entidad
 */
@Component({
  selector: 'app-documento',
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
  templateUrl: './documento.component.html',
  styleUrls: ['./documento.component.scss']
})
export class DocumentoComponent {
  // Atributos de la entidad con sus tipos correspondientes
  /** id - Campo de tipo number */
  id: number;

  /** nombre - Campo de tipo string */
  nombre: string;

  /** descripcion - Campo de tipo string */
  descripcion: string;

  /** fechaCarga - Campo de tipo Date */
  fechaCarga: Date;

  /** estado - Campo de tipo boolean */
  estado: boolean;

  /** formato - Campo de tipo string */
  formato: string;

  /** etiqueta - Campo de tipo string */
  etiqueta: string;

  /** archivoDocumento - Campo de tipo string */
  archivoDocumento: string;

  /** creador - Campo de tipo string */
  creador: string;

  /** persona - Campo de tipo any */
  persona: any;

  /** contrato - Campo de tipo any */
  contrato: any;

  // Configuración de columnas para tablas de atributos y relaciones
  displayedColumnsAttributes: string[] = ['name', 'type'];
  displayedColumnsRelations: string[] = ['entity', 'type'];

  // DataSource para la tabla de atributos
  dataSourceAttributes = new MatTableDataSource([
    { name: 'id', type: 'long' },
    { name: 'nombre', type: 'String' },
    { name: 'descripcion', type: 'String' },
    { name: 'fechaCarga', type: 'LocalDate' },
    { name: 'estado', type: 'boolean' },
    { name: 'formato', type: 'String' },
    { name: 'etiqueta', type: 'String' },
    { name: 'archivoDocumento', type: 'String' },
    { name: 'creador', type: 'String' },
    { name: 'persona', type: 'Persona' },
    { name: 'contrato', type: 'Contrato' },
  ]);

  // DataSource para la tabla de relaciones
  dataSourceRelations = new MatTableDataSource([
    { entity: 'Persona', type: 'Many-to-One' },
    { entity: 'Contrato', type: 'Many-to-One' },
  ]);

  /**
   * Constructor del componente
   * @param service Servicio para la gestión de datos de la entidad
   */
  constructor(private service: DocumentoService) {
    // Inicialización de atributos con valores por defecto
    this.id = 0;
    this.nombre = '';
    this.descripcion = '';
    this.fechaCarga = new Date();
    this.estado = false;
    this.formato = '';
    this.etiqueta = '';
    this.archivoDocumento = '';
    this.creador = '';
    this.persona = null;
    this.contrato = null;
  }
}
