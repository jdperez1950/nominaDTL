// Importaciones de Angular core y HTTP
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';

/**
 * Interfaz que define la estructura de la entidad Informe
 */
export interface Informe {
  /** fecha - Campo de tipo LocalDate */
  fecha: Date;
  /** cliente - Campo de texto */
  cliente: string;
  /** cargo - Campo de texto */
  cargo: string;
  /** informePDF - Campo de texto */
  informePDF: string;
  /** cuentaCobro - Campo de tipo CuentaCobro */
  cuentaCobro: any;
  /** proyecto - Campo de tipo Proyecto */
  proyecto: any;
  /** contrato - Campo de tipo Contrato */
  contrato: any;
  /** creador - Campo de texto */
  creador: string;
}

/**
 * Interfaz que define la estructura del DTO para Informe
 * Utilizada para la transferencia de datos entre el frontend y backend
 */
export interface InformeDTO {
  /** fecha - Campo de tipo LocalDate */
  fecha: Date;
  /** cliente - Campo de texto */
  cliente: string;
  /** cargo - Campo de texto */
  cargo: string;
  /** informePDF - Campo de texto */
  informePDF: string;
  /** cuentaCobro - Campo de tipo CuentaCobro */
  cuentaCobro: any;
  /** proyecto - Campo de tipo Proyecto */
  proyecto: any;
  /** contrato - Campo de tipo Contrato */
  contrato: any;
  /** creador - Campo de texto */
  creador: string;
}

/**
 * Servicio que maneja las operaciones CRUD y otras funcionalidades
 * relacionadas con la entidad Informe
 */
@Injectable({
  providedIn: 'root'  // El servicio está disponible en toda la aplicación
})
export class InformeService {
  /** URL base para las peticiones al backend */
  private baseUrl = environment.baseUrlApi;

  /**
   * Constructor del servicio
   * @param httpClient Cliente HTTP de Angular para realizar peticiones
   */
  constructor(private httpClient: HttpClient) {}

  // Método para obtener todos los registros
  findAll(): Observable<Informe[]> {
    const headers = new HttpHeaders().set('Accion', 'findAll').set('Objeto', 'Informe');
    const url = `${this.baseUrl}/informes`;
    return this.httpClient.get<Informe[]>(url, {headers});
  }

  // Método para buscar un registro por su ID
  findById(id: number): Observable<Informe> {
    const url = `${this.baseUrl}/informes/${id}`;
    const headers = new HttpHeaders().set('Accion', 'findById').set('Objeto', 'Informe');
    return this.httpClient.get<Informe>(url, {headers});
  }

  // Método para save
  save(dto: InformeDTO): Observable<Informe> {
    const url = `${this.baseUrl}/informes`;
    const headers = new HttpHeaders().set('Accion', 'save').set('Objeto', 'Informe');
    return this.httpClient.post<Informe>(url, dto, {headers});
  }

  // Método para actualizar un registro existente
  update(id: number, dto: InformeDTO): Observable<Informe> {
    const url = `${this.baseUrl}/informes/${id}`;
    const headers = new HttpHeaders().set('Accion', 'update').set('Objeto', 'Informe');
    return this.httpClient.put<Informe>(url, dto, {headers});
  }

  // Método para deleteById
  deleteById(id: number): Observable<void> {
    const url = `${this.baseUrl}/informes/${id}`;
    const headers = new HttpHeaders().set('Accion', 'deleteById').set('Objeto', 'Informe');
    return this.httpClient.delete<void>(url, {headers});
  }


  // Método para uploadFiles
  uploadFiles(files: File[]): Observable<string[]> {
    const url = `${this.baseUrl}/informes/upload`;
    const formData: FormData = new FormData();

    files.forEach((file) => {
      formData.append('files', file);
    });

    // Opcional: puedes ajustar headers
    const headers = new HttpHeaders()
      .set('Accion', 'save')
      .set('Objeto', 'Informe');

    // Observa que aquí esperamos un array de strings, según lo que el backend devuelve
    return this.httpClient.post<string[]>(url, formData, { headers });
  }

  // Método para uploadFile
  uploadFile(file: File): Observable<string> {
    const url = `${this.baseUrl}/informes/upload`;
    const formData: FormData = new FormData();
    formData.append('files', file); // 'files' es el nombre del @RequestParam en el backend

    const headers = new HttpHeaders()
      .set('Accion', 'save')
      .set('Objeto', 'Informe');

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

  getFilesByInformeServiceId(id: number): Observable<string[]> {
    const url = `${this.baseUrl}/informes/${id}/files`;
    return this.httpClient.get<string[]>(url);
  }

  downloadFile(fileName: string): Observable<Blob> {
    const url = `${this.baseUrl}/informes/download?file=${fileName}`;
    return this.httpClient.get(url, { responseType: 'blob' });
  }

}
