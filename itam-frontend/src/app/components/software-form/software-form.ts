import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-software-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './software-form.html'
})
export class SoftwareForm implements OnInit {
  software: any = {
    nombre: '',
    version: '',
    licenciaClave: '',
    fechaVencimiento: null,
    activo: true
  };

  esEdicion: boolean = false;
  private readonly URL = 'http://localhost:8000/api/software';

  constructor(private http: HttpClient, private router: Router) {
    // 🔥 EL SECRETO: Capturamos los datos en el constructor
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras.state?.['data']) {
      this.software = { ...nav.extras.state['data'] };
      if (this.software.fechaVencimiento) {
        this.software.fechaVencimiento = this.software.fechaVencimiento.split('T')[0];
      }
      this.esEdicion = true;
    }
  }

  ngOnInit() {
    // Queda vacío
  }

  guardar() {
    if (!this.software.fechaVencimiento) {
      this.software.fechaVencimiento = null;
    }

    if (this.esEdicion) {
      this.http.put(`${this.URL}/${this.software.idSoftware}`, this.software).subscribe({
        next: () => this.finalizar("Actualizado con éxito"),
        error: () => alert("Error al actualizar")
      });
    } else {
      const nuevoSoftware = { ...this.software };
      delete nuevoSoftware.idSoftware;

      this.http.post(this.URL, nuevoSoftware).subscribe({
        next: () => this.finalizar("Software registrado correctamente"),
        error: (err) => {
          console.error(err);
          alert("Error al registrar: " + (err.error?.mensaje || "Error en la DB"));
        }
      });
    }
  }

  private finalizar(msg: string) {
    alert(msg);
    this.router.navigate(['/software']);
  }
}
