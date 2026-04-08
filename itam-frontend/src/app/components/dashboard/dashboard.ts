import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html'
})
export class Dashboard implements OnInit {
  totalEquipos: number = 0;
  enMantenimiento: number = 0;
  activosAsignados: number = 0;
  licenciasActivas: number = 0; // Inicializado en 0 en lugar de 87

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.cargarEstadisticas();
  }

  cargarEstadisticas() {
    // 1. Estadísticas de Equipos
    this.http.get<any[]>('http://localhost:8000/api/equipos').subscribe({
      next: (data) => {
        this.totalEquipos = data.length;
        this.enMantenimiento = data.filter(e => e.estado === 'Mantenimiento').length;
        this.activosAsignados = data.filter(e => e.estado === 'Asignado').length;
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Error al cargar estadísticas de equipos", err)
    });

    // 2. Estadísticas de Software
    this.http.get<any[]>('http://localhost:8000/api/software').subscribe({
      next: (data) => {
        const hoy = new Date();

        this.licenciasActivas = data.filter(sw => {
          if (!sw.activo) return false; // Descartamos si está inactiva en la base de datos
          if (sw.fechaVencimiento) {
            return new Date(sw.fechaVencimiento) >= hoy; // Descartamos si ya pasó la fecha
          }
          return true; // Si es activa y no tiene fecha, la contamos
        }).length;

        this.cdr.detectChanges();
      },
      error: (err) => console.error("Error al cargar estadísticas de software", err)
    });
  }
}
