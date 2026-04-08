import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-usuarios-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './usuarios-form.html'
})
export class UsuariosForm implements OnInit {
  usuario: any = { nombreCompleto: '', cargo: '', departamento: '', email: '', activo: true };
  esEdicion: boolean = false;
  private readonly URL = 'http://localhost:8000/api/usuarios';

  constructor(private http: HttpClient, private router: Router) {
    // 🔥 EL SECRETO: Capturar los datos de navegación AQUÍ, en el constructor
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras.state?.['data']) {
      this.usuario = { ...nav.extras.state['data'] };
      this.esEdicion = true;
    }
  }

  ngOnInit() {
    // El ngOnInit queda limpio porque ya tenemos los datos
  }

  guardar() {
    if (this.esEdicion) {
      // Utilizamos idEmpleado (basado en el modelo de tu backend C#)
      this.http.put(`${this.URL}/${this.usuario.idEmpleado}`, this.usuario).subscribe({
        next: () => this.finalizar("Actualizado correctamente"),
        error: () => alert("Error al actualizar")
      });
    } else {
      this.http.post(this.URL, this.usuario).subscribe({
        next: () => this.finalizar("Empleado creado"),
        error: (err) => {
          // Extraemos el error del FluentValidation
          if (err.status === 400) alert("Error de validación: Revise los campos (ej. correo válido)");
          else alert("Error al crear");
        }
      });
    }
  }

  private finalizar(msg: string) {
    alert(msg);
    this.router.navigate(['/usuarios']);
  }
}
