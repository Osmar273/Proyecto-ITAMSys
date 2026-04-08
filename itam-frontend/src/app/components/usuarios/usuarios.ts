import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './usuarios.html'
})
export class Usuarios implements OnInit {
  listaUsuarios: any[] = [];
  private readonly URL = 'http://localhost:8000/api/usuarios';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.http.get<any[]>(this.URL).subscribe({
      next: (res) => {
        this.listaUsuarios = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Error de conexión", err)
    });
  }

  editar(usuario: any) {
    // 🔥 EL CAMBIO ESTÁ AQUÍ: Ahora enviamos a la ruta específica de edición
    this.router.navigate(['/usuarios/editar'], { state: { data: usuario } });
  }

  toggleEstado(id: number) {
    // El delete ahora solo cambia el estado en la base de datos
    this.http.delete(`${this.URL}/${id}`).subscribe({
      next: () => this.cargarUsuarios(),
      error: () => alert("Error al procesar la solicitud")
    });
  }
}
