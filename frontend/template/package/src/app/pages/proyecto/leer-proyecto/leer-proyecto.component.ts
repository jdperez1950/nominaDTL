import {Component, OnInit, ViewChild} from '@angular/core';
import {FormGroup, FormsModule} from '@angular/forms';
import {FormlyFieldConfig} from '@ngx-formly/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginatorIntl} from '@angular/material/paginator';
import {Router, RouterLink, RouterModule} from '@angular/router';
import * as XLSX from 'xlsx';
import {ProyectoService} from '../../../services/ProyectoService';
import {ProyectoComponent} from '../proyecto.component';
import {ActualizarProyectoComponent} from '../actualizar-proyecto/actualizar-proyecto.component';
import {CrearProyectoComponent} from '../crear-proyecto/crear-proyecto.component';
import {environment} from '../../../../environments/environment';

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
import {CommonModule, CurrencyPipe} from '@angular/common';
import {AuthService} from "../../../services/auth-service.service";
import {LOCALE_ID} from '@angular/core';
import {registerLocaleData} from '@angular/common';
import localeEs from '@angular/common/locales/es-CO';
import {ShowFilesListComponent} from "../../../showFiles.component";
import {DownloadFileComponent} from "../../../downloadFile.component";

// Registrar el locale
registerLocaleData(localeEs);

@Component({
  selector: 'app-leer-proyecto',
  templateUrl: './leer-proyecto.component.html',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatPaginator,
    RouterLink,
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
    MatProgressSpinnerModule,
    CurrencyPipe
  ],
  providers: [CurrencyPipe, { provide: LOCALE_ID, useValue: 'es-CO' }],
  styleUrls: ['./leer-proyecto.component.scss']
})
export class LeerProyectoComponent implements OnInit {
  mostrarBotonCrear: boolean;
  mostrarBotonModificar: boolean;
  mostrarBotonEliminar: boolean;

  // Columnas que se mostrarán en la tabla
  displayedColumns: string[] = ['id', 'nombre', 'valorContrato', 'tiempoContractual', 'objetoContractual', 'alcanceContractual', 'estado', 'numeroContrato', 'cliente', 'fechaInicio', 'fechaFin', 'creador', 'persona', 'supervisor','contactoSupervisor', 'observaciones', 'archivosAdicionales', 'acciones'];

  // Array para almacenar los datos de la entidad
  proyectos: ProyectoComponent[] = [];
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
   * @param proyectoService Servicio para gestionar la entidad
   * @param router Servicio de enrutamiento de Angular
   * @param snackBar Servicio para mostrar notificaciones
   * @param paginatorIntl Servicio para internacionalización del paginador
   * @param dialog Servicio para gestionar diálogos
   * @param authService
   * @param currencyPipe
   */
  constructor(
    private proyectoService: ProyectoService,
    private personaService: PersonaService,
    private router: Router,
    private snackBar: MatSnackBar,
    private paginatorIntl: MatPaginatorIntl,
    private dialog: MatDialog,
    private authService: AuthService,
    private currencyPipe: CurrencyPipe
  ) {
    this.mostrarBotonCrear = this.authService.tieneRoles(['ADMINISTRADOR', 'GERENTE']);
    this.mostrarBotonModificar = this.authService.tieneRoles(['ADMINISTRADOR', 'GERENTE']);
    this.mostrarBotonEliminar = this.authService.tieneRoles(['ADMINISTRADOR', 'GERENTE']);
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
      const estadoText = data.estado ? 'en curso' : 'finalizado';
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

  /**
   * Metodo para cargar los datos de las personas
   */
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
    if (this.authService.isGerente()) {
      this.proyectoService.findAll().subscribe({
        next: data => {
          this.dataSource.data = data;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: error => {
          console.error('Error al obtener todos los proyectos:', error);
          this.errorMessage = 'Error al cargar los datos.';
        }
      });
    } else {
      const personaId = this.authService.getPersonaId();
      if (!personaId) {
        console.error('No se pudo obtener el ID de la persona asociada.');
        return;
      }

      this.proyectoService.findVisibles(personaId).subscribe({
        next: data => {
          this.dataSource.data = data;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: error => {
          console.error('Error al obtener proyectos visibles:', error);
          this.errorMessage = 'Error al cargar los datos.';
        }
      });
    }
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

    const dialogRef = this.dialog.open(CrearProyectoComponent, {
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
   * @param {any} proyecto - El registro a editar
   * @description Abre un diálogo modal para editar el registro seleccionado
   */
  onEdit(proyecto: any): void {
      const screenWidth = window.innerWidth;
      const minWidth = screenWidth < 600 ? '90vw' : '800px';
      const dialogRef = this.dialog.open(ActualizarProyectoComponent, {
        minWidth: minWidth,
        data: proyecto,
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }

  /**
   * Método para eliminar un registro
   * @param {number} proyectoId - ID del registro a eliminar
   * @description Ejecuta el proceso de eliminación con validaciones previas y posteriores
   */
  onDelete(proyectoId: number) {
    // Llamada a acciones previas
    const shouldProceed = this.preDelete(proyectoId);
    if (!shouldProceed) {
      return;
    }
    try {

      this.proyectoService.deleteById(proyectoId).subscribe(
        () => {
          // Llamada a acciones posteriores
          this.postDelete(proyectoId);
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
          if (column === 'estado') {
          formattedRow[column] = row[column] ? 'curso' : 'Finalizado';
        } else if (Array.isArray(row[column])) {
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
      XLSX.writeFile(wb, 'proyecto_datos.xlsx');

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

    return keys.slice(1, 2).map(key => `${value[key]}`).join(', ');
  }

  getCollectionSummary(collection: any[] | null, defaultText: string = 'Sin datos'): string {
    if (!collection || collection.length === 0) {
      return defaultText;
    }
    return collection.map(item => this.generateSummary(item)).join('; ');
  }

  onShowArchivosAdicionales(element:any) {
    const rawPaths = element.archivosAdicionales;
    if (!rawPaths) {
      this.showMessage('No hay Archivos Adicionales.', 'error');
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

  onDownload(element: any) {
    this.proyectoService.getFilesByProyectoServiceId(element.id)
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
                this.proyectoService.downloadFile(selectedFile).subscribe(blob => {
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

  obtenerNombreCreador(username: string): string {
    if (!this.personas || this.personas.length === 0) {
      return username; // Devuelve el username si no hay personas cargadas
    }

    const persona = this.personas.find(p => p.correo === username);
    return persona?.nombre || username;
  }

}
