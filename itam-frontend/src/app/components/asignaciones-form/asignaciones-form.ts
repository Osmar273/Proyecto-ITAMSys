import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-asignaciones-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './asignaciones-form.html'
})
export class AsignacionesForm implements OnInit {
  asignacion: any = { idEmpleado: '', idEquipo: '', condicionEntrega: 'Óptima' };
  esEdicion: boolean = false;

  listaPersonal: any[] = [];
  equiposDisponibles: any[] = [];

  constructor(private http: HttpClient, private router: Router) {
    // 🔥 Capturamos datos en caso de edición
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras.state?.['data']) {
      this.asignacion = { ...nav.extras.state['data'] };
      this.esEdicion = true;
    }
  }

  ngOnInit() {
    // El OnInit mantiene las llamadas HTTP para llenar los selectores (dropdowns)
    this.http.get<any[]>('http://localhost:8000/api/usuarios').subscribe({
      next: (data) => this.listaPersonal = data.filter(p => p.activo)
    });

    this.http.get<any[]>('http://localhost:8000/api/equipos').subscribe({
      next: (data) => {
        this.equiposDisponibles = data.filter(e => e.estado === 'Disponible' && e.activo);
      }
    });
  }

  guardar() {
    this.asignacion.idEmpleado = Number(this.asignacion.idEmpleado);
    this.asignacion.idEquipo = Number(this.asignacion.idEquipo);

    // Nota: El backend de asignaciones suele ser solo de creación (POST).
    this.http.post('http://localhost:8000/api/asignaciones', this.asignacion).subscribe({
      next: () => {
        alert("¡Asignación exitosa! El hardware cambió su estado a 'Asignado' automáticamente.");
        this.router.navigate(['/asignaciones']);
      },
      error: (err) => {
        console.error(err);
        alert(err.error?.mensaje || "Error al registrar la asignación.");
      }
    });
  }
}
