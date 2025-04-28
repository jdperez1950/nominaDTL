// Importaciones core de Angular
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CuentaCobroService } from '../../services/CuentaCobroService';

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
 * Componente principal para la gestión de la entidad CuentaCobro
 * Proporciona una interfaz para visualizar y manipular los datos de la entidad
 */
@Component({
  selector: 'app-cuentacobro',
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
  templateUrl: './cuentacobro.component.html',
  styleUrls: ['./cuentacobro.component.scss']
})
export class CuentaCobroComponent {
  // Atributos de la entidad con sus tipos correspondientes
  /** id - Campo de tipo number */
  id: number;

  /** montoCobrar - Campo de tipo number */
  montoCobrar: number;

  /** periodoACobrar - Campo de tipo string */
  periodoACobrar: string;

  /** fecha - Campo de tipo Date */
  fecha: Date;

  /** estado - Campo de tipo boolean */
  estado: boolean;

  /** numeroCuenta - Campo de tipo string */
  numeroCuenta: string;

  /** detalle - Campo de tipo string */
  detalle: string;

  /** pago - Campo de tipo boolean */
  pago: boolean;

  /** fecha - Campo de tipo Date */
  fechaAprobacion: string;

  /** notificacionPago - Campo de tipo string */
  notificacionPago: string;

  /** firmaGerente - Campo de tipo string */
  firmaGerente: string;

  /** firmaContratista - Campo de tipo string */
  firmaContratista: string;

  /** creador - Campo de tipo string */
  creador: string;

  /** contrato - Campo de tipo any */
  contrato: any;

  /** informe - Campo de tipo any */
  informe: any;

  // Configuración de columnas para tablas de atributos y relaciones
  displayedColumnsAttributes: string[] = ['name', 'type'];
  displayedColumnsRelations: string[] = ['entity', 'type'];

  // DataSource para la tabla de atributos
  dataSourceAttributes = new MatTableDataSource([
    { name: 'id', type: 'long' },
    { name: 'montoCobrar', type: 'long' },
    { name: 'fecha', type: 'LocalDate' },
    { name: 'estado', type: 'boolean' },
    { name: 'numeroCuenta', type: 'String' },
    { name: 'detalle', type: 'String' },
    { name: 'pago', type: 'boolean' },
    {name: 'fechaAprobacion', type: 'String'},
    { name: 'notificacionPago', type: 'String' },
    { name: 'firmaGerente', type: 'String' },
    { name: 'firmaContratista', type: 'String' },
    { name: 'creador', type: 'String' },
    { name: 'contrato', type: 'Contrato' },
    { name: 'informe', type: 'Informe' },
  ]);

  // DataSource para la tabla de relaciones
  dataSourceRelations = new MatTableDataSource([
    { entity: 'Contrato', type: 'Many-to-One' },
    { entity: 'Informe', type: 'Many-to-One' },
  ]);

  /**
   * Constructor del componente
   * @param service Servicio para la gestión de datos de la entidad
   */
  constructor(private service: CuentaCobroService) {
    // Inicialización de atributos con valores por defecto
    this.id = 0;
    this.montoCobrar = 0;
    this.periodoACobrar = '';
    this.fecha = new Date();
    this.estado = false;
    this.numeroCuenta = '';
    this.detalle = '';
    this.pago = false;
    this.fechaAprobacion = '';
    this.notificacionPago = '';
    this.firmaGerente = '';
    this.firmaContratista = '';
    this.creador = '';
    this.contrato = null;
    this.informe = null;
  }
}
