// Importaciones de Angular core y HTTP
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';

/**
 * Interfaz que define la estructura de la entidad Documento
 */
export interface Documento {
  /** nombre - Campo de texto */
  nombre: string;
  /** descripcion - Campo de texto */
  descripcion: string;
  /** fechaCarga - Campo de tipo LocalDate */
  fechaCarga: Date;
  /** estado - Campo de tipo boolean */
  estado: boolean;
  /** formato - Campo de texto */
  formato: string;
  /** etiqueta - Campo de texto */
  etiqueta: string;
  /** archivoDocumento - Campo de texto */
  archivoDocumento: string;
  /** persona - Campo de tipo Persona */
  persona: any;
  /** contrato - Campo de tipo Contrato */
  contrato: any;
  /** creador - Campo de texto */
  creador: string;
}

/**
 * Interfaz que define la estructura del DTO para Documento
 * Utilizada para la transferencia de datos entre el frontend y backend
 */
export interface DocumentoDTO {
  /** nombre - Campo de texto */
  nombre: string;
  /** descripcion - Campo de texto */
  descripcion: string;
  /** fechaCarga - Campo de tipo LocalDate */
  fechaCarga: Date;
  /** estado - Campo de tipo boolean */
  estado: boolean;
  /** formato - Campo de texto */
  formato: string;
  /** etiqueta - Campo de texto */
  etiqueta: string;
  /** archivoDocumento - Campo de texto */
  archivoDocumento: string;
  /** persona - Campo de tipo Persona */
  persona: any;
  /** contrato - Campo de tipo Contrato */
  contrato: any;
  /** creador - Campo de texto */
  creador: string;
}

/**
 * Servicio que maneja las operaciones CRUD y otras funcionalidades
 * relacionadas con la entidad Documento
 */
@Injectable({
  providedIn: 'root'  // El servicio está disponible en toda la aplicación
})
export class DocumentoService {
  /** URL base para las peticiones al backend */
  private baseUrl = environment.baseUrlApi;

  /**
   * Constructor del servicio
   * @param httpClient Cliente HTTP de Angular para realizar peticiones
   */
  constructor(private httpClient: HttpClient) {}

  // Método para obtener todos los registros
  findAll(): Observable<Documento[]> {
    const headers = new HttpHeaders().set('Accion', 'findAll').set('Objeto', 'Documento');
    const url = `${this.baseUrl}/documentos`;
    return this.httpClient.get<Documento[]>(url, {headers});
  }

  // Método para buscar un registro por su ID
  findById(id: number): Observable<Documento> {
    const url = `${this.baseUrl}/documentos/${id}`;
    const headers = new HttpHeaders().set('Accion', 'findById').set('Objeto', 'Documento');
    return this.httpClient.get<Documento>(url, {headers});
  }

  // Método para save
  save(dto: DocumentoDTO): Observable<Documento> {
    const url = `${this.baseUrl}/documentos`;
    const headers = new HttpHeaders().set('Accion', 'save').set('Objeto', 'Documento');
    return this.httpClient.post<Documento>(url, dto, {headers});
  }

  // Método para actualizar un registro existente
  update(id: number, dto: DocumentoDTO): Observable<Documento> {
    const url = `${this.baseUrl}/documentos/${id}`;
    const headers = new HttpHeaders().set('Accion', 'update').set('Objeto', 'Documento');
    return this.httpClient.put<Documento>(url, dto, {headers});
  }

  // Método para deleteById
  deleteById(id: number): Observable<void> {
    const url = `${this.baseUrl}/documentos/${id}`;
    const headers = new HttpHeaders().set('Accion', 'deleteById').set('Objeto', 'Documento');
    return this.httpClient.delete<void>(url, {headers});
  }
// Método para uploadFiles
  uploadFiles(files: File[]): Observable<string[]> {
    const url = `${this.baseUrl}/documentos/upload`;
    const formData: FormData = new FormData();

    files.forEach((file) => {
      formData.append('files', file);
    });

    // Opcional: puedes ajustar headers
    const headers = new HttpHeaders()
      .set('Accion', 'save')
      .set('Objeto', 'Documento');

    // Observa que aquí esperamos un array de strings, según lo que el backend devuelve
    return this.httpClient.post<string[]>(url, formData, { headers });
  }

  // Método para uploadFile
  uploadFile(file: File): Observable<string> {
    const url = `${this.baseUrl}/documentos/upload`;
    const formData: FormData = new FormData();
    formData.append('files', file); // 'files' es el nombre del @RequestParam en el backend

    const headers = new HttpHeaders()
      .set('Accion', 'save')
      .set('Objeto', 'Documento');

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

  getFilesByDocumentoServiceId(id: number): Observable<string[]> {
    const url = `${this.baseUrl}/documentos/${id}/files`;
    return this.httpClient.get<string[]>(url);
  }

  downloadFile(fileName: string): Observable<Blob> {
    const url = `${this.baseUrl}/documentos/download?file=${fileName}`;
    return this.httpClient.get(url, { responseType: 'blob' });
  }
}
