import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-equipos-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './equipos-form.html'
})
export class EquiposForm implements OnInit {
  equipo: any = { codigoItam: '', tipo: '', marca: '', estado: 'Disponible', activo: true };
  esEdicion: boolean = false;
  private readonly URL = 'http://localhost:8000/api/equipos';

  constructor(private http: HttpClient, private router: Router) {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras.state?.['data']) {
      this.equipo = { ...nav.extras.state['data'] };
      this.esEdicion = true;
    }
  }

  ngOnInit() { }

  guardar() {
    if (this.esEdicion) {
      this.http.put(`${this.URL}/${this.equipo.idEquipo}`, this.equipo).subscribe({
        next: () => this.finalizar("Equipo actualizado correctamente"),
        error: (err) => {
          const msg = err.error?.mensaje || "Error al actualizar";
          alert("⚠️ " + msg);
        }
      });
    } else {
      this.http.post(this.URL, this.equipo).subscribe({
        next: () => this.finalizar("Hardware registrado con éxito"),
        error: (err) => {
          // 🔥 Ahora nos dirá la razón real (ej: si el token expiró o falta una columna)
          const msg = err.error?.mensaje || "Error al registrar el equipo";
          alert("⚠️ " + msg);
        }
      });
    }
  }

  private finalizar(msg: string) {
    alert(msg);
    this.router.navigate(['/equipos']);
  }
}
