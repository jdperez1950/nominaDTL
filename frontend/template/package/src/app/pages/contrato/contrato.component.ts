// Importaciones core de Angular
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ContratoService } from '../../services/ContratoService';

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
 * Componente principal para la gestión de la entidad Contrato
 * Proporciona una interfaz para visualizar y manipular los datos de la entidad
 */
@Component({
  selector: 'app-contrato',
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
  templateUrl: './contrato.component.html',
  styleUrls: ['./contrato.component.scss']
})
export class ContratoComponent {
  // Atributos de la entidad con sus tipos correspondientes
  /** id - Campo de tipo number */
  id: number;

  /** numeroContrato - Campo de tipo string */
  numeroContrato: string;

  /** cargo - Campo de tipo string */
  cargo: string;

  /** valorTotalContrato - Campo de tipo number */
  valorTotalContrato: number;

  /** numeroPagos - Campo de tipo number */
  numeroPagos: number;

  /** fechaInicioContrato - Campo de tipo Date */
  fechaInicioContrato: Date;

  /** fechaFinContrato - Campo de tipo Date */
  fechaFinContrato: Date;

  /** estado - Campo de tipo boolean */
  estado: boolean;

  /** contratoPdf - Campo de tipo string */
  contratoPdf: string;

  /** firmado - Campo de tipo boolean */
  firmado: boolean;

  /** creador - Campo de tipo string */
  creador: string;

  /** proyecto - Campo de tipo any */
  proyecto: any;

  /** persona - Campo de tipo any */
  persona: any;

  /** documento - Campo de tipo any[] */
  documento: any[];

  /** cuentaCobro - Campo de tipo any[] */
  cuentaCobro: any[];

  /** tipoContrato - Campo de tipo any */
  tipoContrato: any;

  /** periodicidadPago - Campo de tipo any */
  periodicidadPago: any;

  /** informe - Campo de tipo any[] */
  informe: any[];

  // Configuración de columnas para tablas de atributos y relaciones
  displayedColumnsAttributes: string[] = ['name', 'type'];
  displayedColumnsRelations: string[] = ['entity', 'type'];

  // DataSource para la tabla de atributos
  dataSourceAttributes = new MatTableDataSource([
    { name: 'id', type: 'long' },
    { name: 'numeroContrato', type: 'String' },
    { name: 'cargo', type: 'String' },
    { name: 'valorTotalContrato', type: 'long' },
    { name: 'numeroPagos', type: 'int' },
    { name: 'fechaInicioContrato', type: 'LocalDate' },
    { name: 'fechaFinContrato', type: 'LocalDate' },
    { name: 'estado', type: 'boolean' },
    { name: 'contratoPdf', type: 'String' },
    { name: 'firmado', type: 'boolean' },
    { name: 'creador', type: 'String' },
    { name: 'proyecto', type: 'Proyecto' },
    { name: 'persona', type: 'Persona' },
    { name: 'documento', type: 'Lista de Documentos' },
    { name: 'cuentaCobro', type: 'Lista de CuentaCobros' },
    { name: 'tipoContrato', type: 'TipoContrato' },
    { name: 'periodicidadPago', type: 'PeriodicidadPago' },
    { name: 'informe', type: 'Lista de Informes' },
  ]);

  // DataSource para la tabla de relaciones
  dataSourceRelations = new MatTableDataSource([
    { entity: 'Proyecto', type: 'Many-to-One' },
    { entity: 'Persona', type: 'Many-to-One' },
    { entity: 'Documento', type: 'One-to-Many' },
    { entity: 'CuentaCobro', type: 'One-to-Many' },
    { entity: 'TipoContrato', type: 'Many-to-One' },
    { entity: 'PeriodicidadPago', type: 'Many-to-One' },
    { entity: 'Informe', type: 'One-to-Many' },
  ]);

  /**
   * Constructor del componente
   * @param service Servicio para la gestión de datos de la entidad
   */
  constructor(private service: ContratoService) {
    // Inicialización de atributos con valores por defecto
    this.id = 0;
    this.numeroContrato = '';
    this.cargo = '';
    this.valorTotalContrato = 0;
    this.numeroPagos = 0;
    this.fechaInicioContrato = new Date();
    this.fechaFinContrato = new Date();
    this.estado = false;
    this.contratoPdf = '';
    this.firmado = false;
    this.creador = '';
    this.proyecto = null;
    this.persona = null;
    this.documento = [];
    this.cuentaCobro = [];
    this.tipoContrato = null;
    this.periodicidadPago = null;
    this.informe = [];
  }
}
