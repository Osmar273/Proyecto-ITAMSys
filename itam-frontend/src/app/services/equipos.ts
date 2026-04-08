import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Equipo {
  id?: string;
  codigoItam: string;
  tipo: string;
  marca: string;
  modelo: string;
  numeroSerie: string;
  estado: string;
  asignadoA?: string;
  descripcion?: string; // Agregamos el campo de descripción
}

@Injectable({
  providedIn: 'root'
})
export class EquiposService {
  private apiUrl = 'http://localhost:8000/equipos';

  constructor(private http: HttpClient) { }

  obtenerEquipos(): Observable<Equipo[]> {
    return this.http.get<Equipo[]>(this.apiUrl);
  }

  agregarEquipo(nuevoEquipo: Equipo): Observable<any> {
    return this.http.post(this.apiUrl, nuevoEquipo);
  }

  actualizarEquipo(equipo: Equipo): Observable<any> {
    return this.http.put(`${this.apiUrl}/${equipo.id}`, equipo);
  }

  eliminarEquipo(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
