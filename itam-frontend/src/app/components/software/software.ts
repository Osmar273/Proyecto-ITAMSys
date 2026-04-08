import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-software',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './software.html'
})
export class Software implements OnInit {
  listaSoftware: any[] = [];
  private readonly URL = 'http://localhost:8000/api/software';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.cargarSoftware();
  }

  cargarSoftware() {
    this.http.get<any[]>(this.URL).subscribe({
      next: (data) => {
        const hoy = new Date();

        this.listaSoftware = data.map(sw => {
          if (sw.fechaVencimiento) {
            const fechaVenc = new Date(sw.fechaVencimiento);
            if (fechaVenc < hoy) {
              sw.activo = false;
            }
          }
          return sw;
        });

        this.cdr.detectChanges();
      },
      error: (err) => console.error("Error al cargar software:", err)
    });
  }

  editar(sw: any) {
    // 🔥 RUTA CORREGIDA
    this.router.navigate(['/software/editar'], { state: { data: sw } });
  }

  toggleEstado(id: number) {
    if (confirm('¿Desea cambiar el estado de esta licencia?')) {
      this.http.delete(`${this.URL}/${id}`).subscribe(() => this.cargarSoftware());
    }
  }
}
