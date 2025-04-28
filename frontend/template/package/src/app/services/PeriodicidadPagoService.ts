// Importaciones de Angular core y HTTP
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';

/**
 * Interfaz que define la estructura de la entidad PeriodicidadPago
 */
export interface PeriodicidadPago {
  /** tipoPeriodoPago - Campo de texto */
  tipoPeriodoPago: string;
  /** creador - Campo de texto */
  creador: string;
}

/**
 * Interfaz que define la estructura del DTO para PeriodicidadPago
 * Utilizada para la transferencia de datos entre el frontend y backend
 */
export interface PeriodicidadPagoDTO {
  /** tipoPeriodoPago - Campo de texto */
  tipoPeriodoPago: string;
  /** creador - Campo de texto */
  creador: string;
}

/**
 * Servicio que maneja las operaciones CRUD y otras funcionalidades
 * relacionadas con la entidad PeriodicidadPago
 */
@Injectable({
  providedIn: 'root'  // El servicio está disponible en toda la aplicación
})
export class PeriodicidadPagoService {
  /** URL base para las peticiones al backend */
  private baseUrl = environment.baseUrlApi;

  /**
   * Constructor del servicio
   * @param httpClient Cliente HTTP de Angular para realizar peticiones
   */
  constructor(private httpClient: HttpClient) {}

  // Método para obtener todos los registros
  findAll(): Observable<PeriodicidadPago[]> {
    const headers = new HttpHeaders().set('Accion', 'findAll').set('Objeto', 'PeriodicidadPago');
    const url = `${this.baseUrl}/periodicidadpagos`;
    return this.httpClient.get<PeriodicidadPago[]>(url, {headers});
  }

  // Método para buscar un registro por su ID
  findById(id: number): Observable<PeriodicidadPago> {
    const url = `${this.baseUrl}/periodicidadpagos/${id}`;
    const headers = new HttpHeaders().set('Accion', 'findById').set('Objeto', 'PeriodicidadPago');
    return this.httpClient.get<PeriodicidadPago>(url, {headers});
  }

  // Método para save
  save(dto: PeriodicidadPagoDTO): Observable<PeriodicidadPago> {
    const url = `${this.baseUrl}/periodicidadpagos`;
    const headers = new HttpHeaders().set('Accion', 'save').set('Objeto', 'PeriodicidadPago');
    return this.httpClient.post<PeriodicidadPago>(url, dto, {headers});
  }

  // Método para actualizar un registro existente
  update(id: number, dto: PeriodicidadPagoDTO): Observable<PeriodicidadPago> {
    const url = `${this.baseUrl}/periodicidadpagos/${id}`;
    const headers = new HttpHeaders().set('Accion', 'update').set('Objeto', 'PeriodicidadPago');
    return this.httpClient.put<PeriodicidadPago>(url, dto, {headers});
  }

  // Método para deleteById
  deleteById(id: number): Observable<void> {
    const url = `${this.baseUrl}/periodicidadpagos/${id}`;
    const headers = new HttpHeaders().set('Accion', 'deleteById').set('Objeto', 'PeriodicidadPago');
    return this.httpClient.delete<void>(url, {headers});
  }

}
