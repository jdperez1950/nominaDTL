// Importaciones de Angular core y HTTP
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';

/**
 * Interfaz que define la estructura de la entidad Contrato
 */
export interface Contrato {
  /** cargo - Campo de texto */
  cargo: string;
  /** valorTotalContrato - Campo de tipo long */
  valorTotalContrato: number;
  /** numeroPagos - Campo de tipo int */
  numeroPagos: number;
  /** fechaInicioContrato - Campo de tipo LocalDate */
  fechaInicioContrato: Date;
  /** fechaFinContrato - Campo de tipo LocalDate */
  fechaFinContrato: Date;
  /** estado - Campo de tipo boolean */
  estado: boolean;
  /** contratoPdf - Campo de texto */
  contratoPdf: string;
  /** firmado - Campo de tipo boolean */
  firmado: boolean;
  /** proyecto - Campo de tipo Proyecto */
  proyecto: any;
  /** persona - Campo de tipo Persona */
  persona: any;
  /** tipoContrato - Campo de tipo TipoContrato */
  tipoContrato: any;
  /** periodicidadPago - Campo de tipo PeriodicidadPago */
  periodicidadPago: any;
  /** creador - Campo de texto */
  creador: string;
  /**Campo que representa las observaciones del contrato*/
  observaciones?: string;
  /**Campo que representa los archivos adicionales del contrato*/
  archivosAdicionales?: string;
}
/**
 * Interfaz que define la estructura del DTO para Contrato
 * Utilizada para la transferencia de datos entre el frontend y backend
 */
export interface ContratoDTO {
  /** cargo - Campo de texto */
  cargo: string;
  /** valorTotalContrato - Campo de tipo long */
  valorTotalContrato: number;
  /** numeroPagos - Campo de tipo int */
  numeroPagos: number;
  /** fechaInicioContrato - Campo de tipo LocalDate */
  fechaInicioContrato: Date;
  /** fechaFinContrato - Campo de tipo LocalDate */
  fechaFinContrato: Date;
  /** estado - Campo de tipo boolean */
  estado: boolean;
  /** contratoPdf - Campo de texto */
  contratoPdf: String;
  /** firmado - Campo de tipo boolean */
  firmado: boolean;
  /** proyecto - Campo de tipo Proyecto */
  proyecto: any;
  /** persona - Campo de tipo Persona */
  persona: any;
  /** tipoContrato - Campo de tipo TipoContrato */
  tipoContrato: any;
  /** periodicidadPago - Campo de tipo PeriodicidadPago */
  periodicidadPago: any;
  /** creador - Campo de texto */
  creador: string;
  /**Campo que representa las observaciones del contrato*/
  observaciones?: string;
  /**Campo que representa los archivos adicionales del contrato*/
  archivosAdicionales?: string;
}

/**
 * Servicio que maneja las operaciones CRUD y otras funcionalidades
 * relacionadas con la entidad Contrato
 */
@Injectable({
  providedIn: 'root'  // El servicio está disponible en toda la aplicación
})
export class ContratoService {
  /** URL base para las peticiones al backend */
  private baseUrl = environment.baseUrlApi;

  /**
   * Constructor del servicio
   * @param httpClient Cliente HTTP de Angular para realizar peticiones
   */
  constructor(private httpClient: HttpClient) {}

  // Método para obtener todos los registros
  findAll(): Observable<Contrato[]> {
    const headers = new HttpHeaders().set('Accion', 'findAll').set('Objeto', 'Contrato');
    const url = `${this.baseUrl}/contratos`;
    return this.httpClient.get<Contrato[]>(url, {headers});
  }

  // Método para buscar un registro por su ID
  findById(id: number): Observable<Contrato> {
    const url = `${this.baseUrl}/contratos/${id}`;
    const headers = new HttpHeaders().set('Accion', 'findById').set('Objeto', 'Contrato');
    return this.httpClient.get<Contrato>(url, {headers});
  }

  // Método para save
  save(dto: ContratoDTO): Observable<Contrato> {
    const url = `${this.baseUrl}/contratos`;
    const headers = new HttpHeaders().set('Accion', 'save').set('Objeto', 'Contrato');
    return this.httpClient.post<Contrato>(url, dto, {headers});
  }

  // Método para actualizar un registro existente
  update(id: number, dto: ContratoDTO): Observable<Contrato> {
    const url = `${this.baseUrl}/contratos/${id}`;
    const headers = new HttpHeaders().set('Accion', 'update').set('Objeto', 'Contrato');
    return this.httpClient.put<Contrato>(url, dto, {headers});
  }

  // Método para deleteById
  deleteById(id: number): Observable<void> {
    const url = `${this.baseUrl}/contratos/${id}`;
    const headers = new HttpHeaders().set('Accion', 'deleteById').set('Objeto', 'Contrato');
    return this.httpClient.delete<void>(url, {headers});
  }

  // Método para obtener los contratos visibles para el usuario autenticado
  findVisibles(usuarioId: number): Observable<Contrato[]> {
    const url = `${this.baseUrl}/contratos/visibles?usuarioId=${usuarioId}`;
    const headers = new HttpHeaders().set('Accion', 'findAll').set('Objeto', 'Contrato');
    return this.httpClient.get<Contrato[]>(url, { headers });
  }

  // Método para obtener contratos por proyecto
  obtenerContratosPorProyecto(personaId: number, proyectoId: number): Observable<Contrato[]> {
    const headers = new HttpHeaders().set('Accion', 'findAll').set('Objeto', 'Contrato');
    const url = `${this.baseUrl}/proyectos/${personaId}/${proyectoId}/contratos`;
    return this.httpClient.get<Contrato[]>(url, {headers});
  }

  /**
   * metodo para obtener el detalle del contrato con el número de cuentas de cobro asociadas
   * y el número máximo de pagos permitidos para asi validar que no se creen mas cuentas de las pactadass
   * @param contratoId
   * @return Observable con los detalles del contrato y la cuenta de cobro asociada
   */
  getDetalleContrato(contratoId: number): Observable<any> {
    const url = `${this.baseUrl}/contratos/${contratoId}/detalle`;
    const headers = new HttpHeaders().set('Accion', 'findAll').set('Objeto', 'Contrato');
    return this.httpClient.get<any>(url, { headers });
  }

  // Método para uploadFiles
  uploadFiles(files: File[]): Observable<string[]> {
    const url = `${this.baseUrl}/contratos/upload`;
    const formData: FormData = new FormData();

    files.forEach((file) => {
      formData.append('files', file);
    });

    // Opcional: puedes ajustar headers
    const headers = new HttpHeaders()
      .set('Accion', 'save')
      .set('Objeto', 'Contrato');

    // Observa que aquí esperamos un array de strings, según lo que el backend devuelve
    return this.httpClient.post<string[]>(url, formData, { headers });
  }

  // Método para uploadFile
  uploadFile(file: File): Observable<string> {
    const url = `${this.baseUrl}/contratos/upload`;
    const formData: FormData = new FormData();
    formData.append('files', file); // 'files' es el nombre del @RequestParam en el backend

    const headers = new HttpHeaders()
      .set('Accion', 'save')
      .set('Objeto', 'Contrato');

    // Esperamos un array de rutas y tomamos la primera.
    // Si el backend solo devuelve una ruta, ajusta en consecuencia.
    return new Observable((observer) => {
      this.httpClient.post<string[]>(url, formData, { headers })
        .subscribe({
          next: (paths: string[]) => {
            observer.next(paths[0]);  // Tomamos la primera ruta
            observer.complete();
          },
          error: (err) => observer.error(err)
        });
    });
  }

  getFilesByContratoServiceId(id: number): Observable<string[]> {
    const url = `${this.baseUrl}/contratos/${id}/files`;
    return this.httpClient.get<string[]>(url);
  }

  downloadFile(fileName: string): Observable<Blob> {
    const url = `${this.baseUrl}/contratos/download?file=${fileName}`;
    return this.httpClient.get(url, { responseType: 'blob' });
  }

  //para buscar una forma diferente de ver el nombre del creador de un registro
  obtenerUsuarios(): Observable<any> {
    const headers = new HttpHeaders().set('Accion', 'findAll').set('Objeto', 'Contrato');
    const url = `${this.baseUrl}/auth/getUsers`;
    return this.httpClient.get<any>(url, {headers});
  }

  // Método para obtener contratos por persona
  findByPersonaId(personaId: number): Observable<Contrato[]> {
    const url = `${this.baseUrl}/contratos/persona/${personaId}`;
    const headers = new HttpHeaders().set('Accion', 'findAll').set('Objeto', 'Contrato');
    return this.httpClient.get<Contrato[]>(url, {headers});
  }

}
