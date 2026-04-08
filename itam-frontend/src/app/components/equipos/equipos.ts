import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-equipos',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './equipos.html'
})
export class Equipos implements OnInit {
  listaEquipos: any[] = [];
  equiposFiltrados: any[] = [];
  textoBusqueda: string = '';
  cargando: boolean = true;
  private readonly URL = 'http://localhost:8000/api/equipos';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit() {
    this.cargarEquipos();
  }

  cargarEquipos() {
    this.cargando = true;
    this.http.get<any[]>(this.URL).subscribe({
      next: (res) => {
        this.listaEquipos = res;
        this.equiposFiltrados = res;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error al cargar equipos:", err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  filtrar() {
    const busqueda = this.textoBusqueda.toLowerCase().trim();
    if (!busqueda) {
      this.equiposFiltrados = [...this.listaEquipos];
    } else {
      this.equiposFiltrados = this.listaEquipos.filter(eq =>
        eq.codigoItam.toLowerCase().includes(busqueda) ||
        eq.tipo.toLowerCase().includes(busqueda) ||
        eq.marca.toLowerCase().includes(busqueda)
      );
    }
    this.cdr.detectChanges();
  }

  editar(equipo: any) {
    // 🔥 RUTA CORREGIDA
    this.router.navigate(['/equipos/editar'], { state: { data: equipo } });
  }

  enviarAMantenimiento(id: number) {
    if (confirm('¿Mandar este hardware a reparación/mantenimiento?')) {
      this.http.put(`${this.URL}/mantenimiento/${id}`, {}).subscribe({
        next: () => this.cargarEquipos(),
        error: (err) => alert(err.error?.mensaje || "Error al mover equipo")
      });
    }
  }

  retirarActivo(id: number) {
    if (confirm('¿ESTÁ SEGURO? Esto marcará el equipo como inservible y lo dará de baja definitiva.')) {
      this.http.put(`${this.URL}/baja/${id}`, {}).subscribe({
        next: () => this.cargarEquipos(),
        error: () => alert("Error al procesar la baja")
      });
    }
  }

  toggleEstado(id: number) {
    this.http.delete(`${this.URL}/${id}`).subscribe({
      next: () => this.cargarEquipos(),
      error: () => alert("Error al cambiar estado del equipo")
    });
  }
}
