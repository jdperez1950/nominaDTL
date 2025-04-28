// Importaciones de Angular core y HTTP
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';

/**
 * Interfaz que define la estructura de la entidad CuentaCobro
 */
export interface CuentaCobro {
  /** montoCobrar - Campo de tipo long */
  montoCobrar: number;
  /** numeroCuentaCobro - Campo de tipo long */
  numeroCuentaCobro: number;
  /** periodoACobrar - Campo de texto */
  periodoACobrar: string;
  /** fecha - Campo de tipo LocalDate */
  fecha: Date;
  /** estado - Campo de tipo boolean */
  estado: boolean;
  /** numeroCuenta - Campo de texto */
  numeroCuenta: string;
  /** detalle - Campo de texto */
  detalle: string;
  /** pago - Campo de tipo boolean */
  pago: boolean;
  /** notificacionPago - Campo de texto */
  notificacionPago: string;
  /** firmaGerente - Campo de texto */
  firmaGerente?: string;
  /** firmaContratista - Campo de texto */
  firmaContratista: string;
  /** planillaSeguridadSocial - Campo de texto */
  planillaSeguridadSocial: string;
  /** contrato - Campo de texto */
  contrato: any;
  /** observaciones - Campo de texto */
  observaciones?: string;
  /** informe - Campo de tipo Informe */
  informe: any;
  /** creador - Campo de texto */
  creador: string;
}

/**
 * Interfaz que define la estructura del DTO para CuentaCobro
 * Utilizada para la transferencia de datos entre el frontend y backend
 */
export interface CuentaCobroDTO {
  /** montoCobrar - Campo de tipo long */
  montoCobrar: number;
  /** periodoACobrar - Campo de texto */
  periodoACobrar: string;
  /** fecha - Campo de tipo LocalDate */
  fecha: Date;
  /** estado - Campo de tipo boolean */
  estado: boolean;
  /** numeroCuenta - Campo de texto */
  numeroCuenta: string;
  /** detalle - Campo de texto */
  detalle: string;
  /** pago - Campo de tipo boolean */
  pago: boolean;
  /** notificacionPago - Campo de texto */
  notificacionPago: string;
  /** firmaGerente - Campo de texto */
  firmaGerente?: string;
  /** firmaContratista - Campo de texto */
  firmaContratista: string;
  /** planillaSeguridadSocial - Campo de texto */
  planillaSeguridadSocial: string;
  /** contrato - Campo de tipo Contrato */
  contrato: any;
  /** observaciones - Campo de texto */
  observaciones?: string;
  /** informe - Campo de tipo Informe */
  informe: any;
  /** creador - Campo de texto */
  creador: string;
}

/**
 * Servicio que maneja las operaciones CRUD y otras funcionalidades
 * relacionadas con la entidad CuentaCobro
 */
@Injectable({
  providedIn: 'root'  // El servicio está disponible en toda la aplicación
})
export class CuentaCobroService {
  /** URL base para las peticiones al backend */
  private baseUrl = environment.baseUrlApi;

  /**
   * Constructor del servicio
   * @param httpClient Cliente HTTP de Angular para realizar peticiones
   */
  constructor(private httpClient: HttpClient) {}

  // Método para obtener todos los registros
  findAll(): Observable<CuentaCobro[]> {
    const headers = new HttpHeaders().set('Accion', 'findAll').set('Objeto', 'CuentaCobro');
    const url = `${this.baseUrl}/cuentacobros`;
    return this.httpClient.get<CuentaCobro[]>(url, {headers});
  }

  // Método para buscar un registro por su ID
  findById(id: number): Observable<CuentaCobro> {
    const url = `${this.baseUrl}/cuentacobros/${id}`;
    const headers = new HttpHeaders().set('Accion', 'findById').set('Objeto', 'CuentaCobro');
    return this.httpClient.get<CuentaCobro>(url, {headers});
  }

  // Método para save
  save(dto: CuentaCobroDTO): Observable<CuentaCobro> {
    const url = `${this.baseUrl}/cuentacobros`;
    const headers = new HttpHeaders().set('Accion', 'save').set('Objeto', 'CuentaCobro');
    return this.httpClient.post<CuentaCobro>(url, dto, {headers});
  }

  // Método para actualizar un registro existente
  update(id: number, dto: CuentaCobroDTO): Observable<CuentaCobro> {
    const url = `${this.baseUrl}/cuentacobros/${id}`;
    const headers = new HttpHeaders().set('Accion', 'update').set('Objeto', 'CuentaCobro');
    return this.httpClient.put<CuentaCobro>(url, dto, {headers});
  }

  // Método para deleteById
  deleteById(id: number): Observable<void> {
    const url = `${this.baseUrl}/cuentacobros/${id}`;
    const headers = new HttpHeaders().set('Accion', 'deleteById').set('Objeto', 'CuentaCobro');
    return this.httpClient.delete<void>(url, {headers});
  }



  // Método para uploadFiles
  uploadFiles(files: File[]): Observable<string[]> {
    const url = `${this.baseUrl}/cuentacobros/upload`;
    const formData: FormData = new FormData();

    files.forEach((file) => {
      formData.append('files', file);
    });

    // Opcional: puedes ajustar headers
    const headers = new HttpHeaders()
      .set('Accion', 'save')
      .set('Objeto', 'CuentaCobro');

    // Observa que aquí esperamos un array de strings, según lo que el backend devuelve
    return this.httpClient.post<string[]>(url, formData, { headers });
  }

  // Método para uploadFile
  uploadFile(file: File): Observable<string> {
    const url = `${this.baseUrl}/cuentacobros/upload`;
    const formData: FormData = new FormData();
    formData.append('files', file); // 'files' es el nombre del @RequestParam en el backend

    const headers = new HttpHeaders()
      .set('Accion', 'save')
      .set('Objeto', 'CuentaCobro');

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

  getFilesByCuentaCobroId(id: number): Observable<string[]> {
    const url = `${this.baseUrl}/cuentacobros/${id}/files`;
    return this.httpClient.get<string[]>(url);
  }

  downloadFile(fileName: string): Observable<Blob> {
    const url = `${this.baseUrl}/cuentacobros/download?file=${fileName}`;
    return this.httpClient.get(url, { responseType: 'blob' });
  }

  obtenerCuentasCobroPorContrato(username: String, id: number): Observable<CuentaCobro[]> {
    const headers = new HttpHeaders().set('Accion', 'findAll').set('Objeto', 'Contrato');
    const url = `${this.baseUrl}/contratos/${username}/${id}/cuentascobro`;
    return this.httpClient.get<CuentaCobro[]>(url, {headers});
  }
}
