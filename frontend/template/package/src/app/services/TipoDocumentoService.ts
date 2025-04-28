// Importaciones de Angular core y HTTP
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';

/**
 * Interfaz que define la estructura de la entidad TipoDocumento
 */
export interface TipoDocumento {
  /** nombreTipoDocumento - Campo de texto */
  nombreTipoDocumento: string;
  /** creador - Campo de texto */
  creador: string;
}

/**
 * Interfaz que define la estructura del DTO para TipoDocumento
 * Utilizada para la transferencia de datos entre el frontend y backend
 */
export interface TipoDocumentoDTO {
  /** nombreTipoDocumento - Campo de texto */
  nombreTipoDocumento: string;
  /** creador - Campo de texto */
  creador: string;
}

/**
 * Servicio que maneja las operaciones CRUD y otras funcionalidades
 * relacionadas con la entidad TipoDocumento
 */
@Injectable({
  providedIn: 'root'  // El servicio está disponible en toda la aplicación
})
export class TipoDocumentoService {
  /** URL base para las peticiones al backend */
  private baseUrl = environment.baseUrlApi;

  /**
   * Constructor del servicio
   * @param httpClient Cliente HTTP de Angular para realizar peticiones
   */
  constructor(private httpClient: HttpClient) {}

  // Método para obtener todos los registros
  findAll(): Observable<TipoDocumento[]> {
    const headers = new HttpHeaders().set('Accion', 'findAll').set('Objeto', 'TipoDocumento');
    const url = `${this.baseUrl}/tipodocumentos`;
    return this.httpClient.get<TipoDocumento[]>(url, {headers});
  }

  // Método para buscar un registro por su ID
  findById(id: number): Observable<TipoDocumento> {
    const url = `${this.baseUrl}/tipodocumentos/${id}`;
    const headers = new HttpHeaders().set('Accion', 'findById').set('Objeto', 'TipoDocumento');
    return this.httpClient.get<TipoDocumento>(url, {headers});
  }

  // Método para save
  save(dto: TipoDocumentoDTO): Observable<TipoDocumento> {
    const url = `${this.baseUrl}/tipodocumentos`;
    const headers = new HttpHeaders().set('Accion', 'save').set('Objeto', 'TipoDocumento');
    return this.httpClient.post<TipoDocumento>(url, dto, {headers});
  }

  // Método para actualizar un registro existente
  update(id: number, dto: TipoDocumentoDTO): Observable<TipoDocumento> {
    const url = `${this.baseUrl}/tipodocumentos/${id}`;
    const headers = new HttpHeaders().set('Accion', 'update').set('Objeto', 'TipoDocumento');
    return this.httpClient.put<TipoDocumento>(url, dto, {headers});
  }

  // Método para deleteById
  deleteById(id: number): Observable<void> {
    const url = `${this.baseUrl}/tipodocumentos/${id}`;
    const headers = new HttpHeaders().set('Accion', 'deleteById').set('Objeto', 'TipoDocumento');
    return this.httpClient.delete<void>(url, {headers});
  }

}
