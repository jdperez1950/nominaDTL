import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Router, RouterLink, RouterModule } from '@angular/router';
import * as XLSX from 'xlsx';
import { InformeService } from '../../../services/InformeService';
import { InformeComponent } from '../../informe/informe.component';
import { ActualizarInformeComponent } from '../../informe/actualizar-informe/actualizar-informe.component';
import { CrearInformeComponent } from '../../informe/crear-informe/crear-informe.component';
import {environment} from '../../../../environments/environment';

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
import { CuentaCobroService } from '../../../services/CuentaCobroService';
import { ContratoService } from '../../../services/ContratoService';
import { CommonModule } from '@angular/common';
import {DownloadFileComponent} from "../../../downloadFile.component";
import {ShowFilesListComponent} from "../../../showFiles.component";
import {PersonaService} from "../../../services/PersonaService";

@Component({
  selector: 'app-leer-informe',
  templateUrl: './leer-informe.component.html',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatPaginator,
    MatSort,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
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
  styleUrls: ['./leer-informe.component.scss']
})
export class LeerInformeComponent implements OnInit {
  // Columnas que se mostrarán en la tabla
  displayedColumns: string[] = ['id', 'fecha', 'cliente', 'cargo', 'informePDF', 'creador', 'cuentaCobro', 'proyecto', 'contrato', 'acciones'];

  // Array para almacenar los datos de la entidad
  informes: InformeComponent[] = [];
  // Array para almacenar los datos de las personas
  personas: any[] = [];
  // Mensaje para mostrar errores al usuario
  errorMessage: string = '';

  // Formulario y configuración de campos
  form = new FormGroup({});
  model = {};
  fields: FormlyFieldConfig[] = [];

  // Fuente de datos para la tabla Material
  dataSource = new MatTableDataSource<any>([]);

  // Referencias a componentes de Material
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  /**
   * Constructor del componente
   * @param informeService Servicio para gestionar la entidad
   * @param router Servicio de enrutamiento de Angular
   * @param snackBar Servicio para mostrar notificaciones
   * @param paginatorIntl Servicio para internacionalización del paginador
   * @param dialog Servicio para gestionar diálogos
   */
  constructor(
    private informeService: InformeService,
    private personaService: PersonaService,
    private router: Router,
    private snackBar: MatSnackBar,
    private paginatorIntl: MatPaginatorIntl,
    private dialog: MatDialog
  ) {
    this.customizePaginator();
  }

  /**
   * Inicializa el componente
   * Carga los datos iniciales y configura el filtrado de la tabla
   */
  ngOnInit(): void {
    this.cargarDatosPersonas();
    this.loadData();
    this.customizePaginator();

    // Configurar la lógica de filtrado personalizada
    this.dataSource.filterPredicate = (data, filter) => {
      const searchText = filter.trim().toLowerCase();
      const combinedValues = this.getCombinedValuesForFilter(data);
      return combinedValues.includes(searchText);
    };
  }

  /**
   * Combina los valores de todas las columnas para el filtrado
   * @param data Objeto con los datos de la fila
   * @returns Cadena combinada de todos los valores para búsqueda
   */
  private getCombinedValuesForFilter(data: any): string {
    let combinedValues = '';

    this.displayedColumns.forEach(column => {
      if (column === 'acciones') {
        return;
      }
      if (Array.isArray(data[column])) {
        combinedValues += this.getCollectionSummary(data[column]) + ' ';
      } else if (typeof data[column] === 'object' && data[column] !== null) {
        combinedValues += this.generateSummary(data[column]) + ' ';
      } else {
        combinedValues += (data[column] || '') + ' ';
      }
    });

    return combinedValues.toLowerCase();
  }

  cargarDatosPersonas(): void {
    this.personaService.findAll().subscribe({
      next: (personas) => {
        this.personas = personas;
      },
      error: (err) => {
        console.error('Error cargando personas:', err);
        this.personas = [];
      }
    });
  }

  /**
   * Carga los datos de la entidad desde el servicio
   * Configura el datasource, paginador y ordenamiento
   */
  loadData(): void {
    this.informeService.findAll().subscribe({
      next: data => {
        this.dataSource.data = data.map(item => Object.assign(new InformeComponent(this.informeService), item));
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    },
       error: error => {
        console.error('Error al obtener informes:', error);
      this.errorMessage = 'Error al cargar los datos.';
      }
    });
  }

  /**
   * Personaliza los textos del paginador a español
   */
  private customizePaginator(): void {
    this.paginatorIntl.itemsPerPageLabel = 'Ítems por página';
    this.paginatorIntl.nextPageLabel = 'Siguiente';
    this.paginatorIntl.previousPageLabel = 'Anterior';
    this.paginatorIntl.firstPageLabel = 'Primera página';
    this.paginatorIntl.lastPageLabel = 'Última página';
  }

  /**
   * Aplica el filtro de búsqueda a la tabla
   * @param filterValue Texto a buscar
   */
  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Método para crear un nuevo registro a través de un diálogo modal
   * @description Abre un diálogo modal para crear un nuevo registro utilizando el componente específico
   */
  onCreate(): void {
    const screenWidth = window.innerWidth;
    const minWidth = screenWidth < 600 ? '90vw' : '800px';

    const dialogRef = this.dialog.open(CrearInformeComponent, {
      minWidth: minWidth,
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData(); // Recargar la tabla si se creó un registro
      }
    });
  }

  /**
   * Método para editar un registro existente
   * @param {any} informe - El registro a editar
   * @description Abre un diálogo modal para editar el registro seleccionado
   */
  onEdit(informe: any): void {
      const screenWidth = window.innerWidth;
      const minWidth = screenWidth < 600 ? '90vw' : '800px';
      const dialogRef = this.dialog.open(ActualizarInformeComponent, {
        minWidth: minWidth,
        data: informe,
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }

  /**
   * Método para eliminar un registro
   * @param {number} informeId - ID del registro a eliminar
   * @description Ejecuta el proceso de eliminación con validaciones previas y posteriores
   */
  onDelete(informeId: number) {
    // Llamada a acciones previas
    const shouldProceed = this.preDelete(informeId);
    if (!shouldProceed) {
      return;
    }
    try {

      this.informeService.deleteById(informeId).subscribe(
        () => {
          // Llamada a acciones posteriores
          this.postDelete(informeId);
        },
        error => {
          console.error('Error al eliminar:', error);
          this.showMessage('Error al eliminar el registro', 'error');
        }
      );
    } catch (error) {
      console.error('Error en preDelete:', error);
      this.showMessage('Acción cancelada o error en preDelete', 'error');
    }
  }

  onDownload(element: any) {
    this.informeService.getFilesByInformeServiceId(element.id)
      .subscribe({
        next: (files) => {
          const dialogRef = this.dialog.open(DownloadFileComponent, {
            maxWidth: 'none',
            width: '500px',
            data: { files: files }
          });
          dialogRef.afterClosed().subscribe((selectedFiles: string[]) => {
            if (selectedFiles && selectedFiles.length > 0) {
              selectedFiles.forEach(selectedFile => {
                this.informeService.downloadFile(selectedFile).subscribe(blob => {
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = selectedFile;
                  a.click();
                  window.URL.revokeObjectURL(url);
                });
              });
            }
          });
        },
        error: (err) => {
          console.error('Error al obtener archivos:', err);
          this.showMessage('Error al obtener archivos del servidor.', 'error');
        }
      });
  }

  /**
   * Método de validación previo a la eliminación
   * @param {number} id - ID del registro a validar
   * @returns {boolean} - true si se puede proceder con la eliminación, false en caso contrario
   * @todo implementar accion para validar si el usuario tiene permisos cuando se implemente la seguridad
   * @todo implementar accion para registrar logs cuando se implemente seguridad para identificar que usuario hace cambios
   * @todo implementar acciones especificas adicionales que se requieran
   */
  private preDelete(id: number): boolean {
    const confirmation = confirm('¿Está seguro de que desea eliminar este registro?');
    if (!confirmation) {
      this.showMessage('Eliminación cancelada, no se alteró ningun registro', 'success');
      return false;
    }
    // Acción previa: Verificar permisos (comentado para implementar después)
    // TODO: Validar si el usuario tiene permisos para eliminar
    // if (!this.userHasPermission('eliminar')) {
    //     throw new Error('No tiene permisos para eliminar este registro.');
    // }

    console.log('Validaciones de preDelete completadas para ID:', id);
    return true;
  }

  /**
   * Método para ejecutar acciones posteriores a la eliminación
   * @param {number} id - ID del registro eliminado
   * @todo implementar accion para registrar logs cuando se implemente seguridad para identificar que usuario hace cambios
   * @todo acciones especificas adicionales que se requieran
   */
  private postDelete(id: number): void {
    // Acción posterior: Registrar auditoría (comentado para implementar después)
    // TODO: Llamar a un servicio de auditoría para registrar la acción
    // this.auditService.logDeleteAction('Entidad', id, usuarioActual);

    //mostrar un mensaje de registro exitoso
    this.showMessage('Registro eliminado con éxito', 'success');

    //Se actualiza la tabla
    this.loadData();
  }

  /**
   * Método para exportar datos a Excel
   * @description Exporta los datos filtrados de la tabla a un archivo Excel
   * @throws {Error} Si no hay datos para exportar o si ocurre un error durante la exportación
   */
  exportToExcel(): void {
    try {
      // Llamada a acciones previas
      this.preExport();

      const displayedColumns = this.displayedColumns.filter(column => column !== 'acciones');
      const exportData = this.dataSource.filteredData.map(row => {
        const formattedRow: any = {};
        displayedColumns.forEach(column => {
          if (Array.isArray(row[column])) {
            // Procesar colecciones con getCollectionSummary
            formattedRow[column] = this.getCollectionSummary(row[column]);
          } else if (typeof row[column] === 'object' && row[column] !== null) {
            // Procesar objetos con generateSummary
            formattedRow[column] = this.generateSummary(row[column]);
          } else {
            // Asignar valor directamente
            formattedRow[column] = row[column];
          }
        });
        return formattedRow;
      });

      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Datos');
      XLSX.writeFile(wb, 'informe_datos.xlsx');

      // Llamada a acciones posteriores
      this.postExport();
    } catch (error) {
      console.error('Error al exportar a Excel:', error);
      this.showMessage('Error al exportar los datos', 'error');
    }
  }

  /**
   * Método para validaciones previas a la exportación
   * @throws {Error} Si no hay datos para exportar o si el usuario no tiene permisos
   * @todo implementar accion para validar si el usuario tiene permisos cuando se implemente la seguridad
   * @todo implementar accion para registrar logs cuando se implemente seguridad para identificar que usuario hace cambios
   * @todo implementar acciones especificas que se requieran
   */
  private preExport(): void {
    // Verificar si hay datos para exportar
    if (!this.dataSource.filteredData || this.dataSource.filteredData.length === 0) {
      this.showMessage('No hay datos para exportar', 'error');
      throw new Error('No hay datos para exportar.');
    }

    // Validar permisos (comentado para implementar después)
    // TODO: Verificar si el usuario tiene permisos para exportar datos
    // if (!this.userHasPermission('exportar_datos')) {
    //     this.showMessage('No tiene permisos para exportar datos', 'error');
    //     throw new Error('Permiso denegado para exportar datos.');
    // }

    console.log('Validaciones de preExport completadas.');
  }

  /**
   * Método para acciones posteriores a la exportación
   * @todo implementar accion para validar si el usuario tiene permisos cuando se implemente la seguridad
   * @todo implementar accion para registrar logs cuando se implemente seguridad para identificar que usuario hace cambios
   * @todo implementar acciones especificas que se requieran
   */
  private postExport(): void {
    // Mostrar mensaje de éxito
    this.showMessage('Datos exportados exitosamente a Excel', 'success');
    console.log('Acciones de postExport completadas.');
  }

  /**
   * Método para mostrar mensajes al usuario
   * @param {string} message - Mensaje a mostrar
   * @param {'success' | 'error'} type - Tipo de mensaje
   */
  private showMessage(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: type === 'error' ? ['error-snackbar'] : ['success-snackbar']
    });
  }
  generateSummary(value: any, defaultText: string = 'Sin datos'): string {
    if (!value || typeof value !== 'object') {
      return defaultText;
    }

    const keys = Object.keys(value);
    if (keys.length === 0) {
      return defaultText;
    }

    return keys.slice(1, 2).map(key => `${key}: ${value[key]}`).join(', ');
  }

  getCollectionSummary(collection: any[] | null, defaultText: string = 'Sin datos'): string {
    if (!collection || collection.length === 0) {
      return defaultText;
    }
    return collection.map(item => this.generateSummary(item)).join('; ');
 }

  onAlerta() {
    // Implementar funcionalidad
    this.showMessage('Funcionalidad no implementada', 'error');
  }

  onShowInformePDF(element: any) {
    const rawPaths = element.informePDF;
    if (!rawPaths) {
      this.showMessage('No hay archivos de InformePDF.', 'error');
      return;
    }
    let files = rawPaths.split(',').map((path: string) => path.trim());
    files = files.map((path: string) => this.extractFileName(path));
    this.dialog.open(ShowFilesListComponent, {
      width: '500px',
      data: { files: files }
    });
  }

  private extractFileName(fullPath: string): string {
    const lastBackslash = fullPath.lastIndexOf('\\');
    const lastSlash = fullPath.lastIndexOf('/');
    const lastSeparator = Math.max(lastBackslash, lastSlash);
    if (lastSeparator === -1) {
      return fullPath;
    }
    return fullPath.substring(lastSeparator + 1);
  }

  obtenerNombreCreador(username: string): string {
    if (!this.personas || this.personas.length === 0) {
      return username; // Devuelve el username si no hay personas cargadas
    }

    const persona = this.personas.find(p => p.correo === username);
    return persona?.nombre || username;
  }

}
