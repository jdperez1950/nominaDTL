// Importaciones de Angular core y HTTP
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';

/**
 * Interfaz que define la estructura de la entidad TipoContrato
 */
export interface TipoContrato {
  /** nombreTipoContrato - Campo de texto */
  nombreTipoContrato: string;
  /** creador - Campo de texto */
  creador: string;
}

/**
 * Interfaz que define la estructura del DTO para TipoContrato
 * Utilizada para la transferencia de datos entre el frontend y backend
 */
export interface TipoContratoDTO {
  /** nombreTipoContrato - Campo de texto */
  nombreTipoContrato: string;
  /** creador - Campo de texto */
  creador: string;
}

/**
 * Servicio que maneja las operaciones CRUD y otras funcionalidades
 * relacionadas con la entidad TipoContrato
 */
@Injectable({
  providedIn: 'root'  // El servicio está disponible en toda la aplicación
})
export class TipoContratoService {
  /** URL base para las peticiones al backend */
  private baseUrl = environment.baseUrlApi;

  /**
   * Constructor del servicio
   * @param httpClient Cliente HTTP de Angular para realizar peticiones
   */
  constructor(private httpClient: HttpClient) {}

  // Método para obtener todos los registros
  findAll(): Observable<TipoContrato[]> {
    const headers = new HttpHeaders().set('Accion', 'findAll').set('Objeto', 'TipoContrato');
    const url = `${this.baseUrl}/tipocontratos`;
    return this.httpClient.get<TipoContrato[]>(url, {headers});
  }

  // Método para buscar un registro por su ID
  findById(id: number): Observable<TipoContrato> {
    const url = `${this.baseUrl}/tipocontratos/${id}`;
    const headers = new HttpHeaders().set('Accion', 'findById').set('Objeto', 'TipoContrato');
    return this.httpClient.get<TipoContrato>(url, {headers});
  }

  // Método para save
  save(dto: TipoContratoDTO): Observable<TipoContrato> {
    const url = `${this.baseUrl}/tipocontratos`;
    const headers = new HttpHeaders().set('Accion', 'save').set('Objeto', 'TipoContrato');
    return this.httpClient.post<TipoContrato>(url, dto, {headers});
  }

  // Método para actualizar un registro existente
  update(id: number, dto: TipoContratoDTO): Observable<TipoContrato> {
    const url = `${this.baseUrl}/tipocontratos/${id}`;
    const headers = new HttpHeaders().set('Accion', 'update').set('Objeto', 'TipoContrato');
    return this.httpClient.put<TipoContrato>(url, dto, {headers});
  }

  // Método para deleteById
  deleteById(id: number): Observable<void> {
    const url = `${this.baseUrl}/tipocontratos/${id}`;
    const headers = new HttpHeaders().set('Accion', 'deleteById').set('Objeto', 'TipoContrato');
    return this.httpClient.delete<void>(url, {headers});
  }

}
