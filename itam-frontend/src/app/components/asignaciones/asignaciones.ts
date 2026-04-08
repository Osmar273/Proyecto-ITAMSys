import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router'; // 🔥 Se agregó Router
import jsPDF from 'jspdf';

@Component({
  selector: 'app-asignaciones',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './asignaciones.html'
})
export class Asignaciones implements OnInit {
  listaAsignaciones: any[] = [];
  nombresEmpleados: any = {};
  nombresEquipos: any = {};
  detallesEquipos: any = {};

  private readonly URL = 'http://localhost:8000/api';

  // 🔥 Se agregó Router al constructor
  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private router: Router) { }

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.http.get<any[]>(`${this.URL}/usuarios`).subscribe(emps => {
      emps.forEach(e => this.nombresEmpleados[e.idEmpleado] = e.nombreCompleto);

      this.http.get<any[]>(`${this.URL}/equipos`).subscribe(eqs => {
        eqs.forEach(e => {
          this.nombresEquipos[e.idEquipo] = `${e.codigoItam} - ${e.tipo}`;
          this.detallesEquipos[e.idEquipo] = e;
        });

        this.http.get<any[]>(`${this.URL}/asignaciones`).subscribe(asigs => {
          this.listaAsignaciones = asigs;
          this.cdr.detectChanges();
        });
      });
    });
  }

  // 🔥 Por si acaso tienes o agregas un botón de editar
  editar(asignacion: any) {
    this.router.navigate(['/asignaciones/editar'], { state: { data: asignacion } });
  }

  generarPDF(asig: any) {
    const doc = new jsPDF();
    const empleado = this.nombresEmpleados[asig.idEmpleado];
    const equipo = this.detallesEquipos[asig.idEquipo];
    const fecha = new Date(asig.fechaAsignacion).toLocaleDateString();

    doc.setFontSize(20);
    doc.setTextColor(30, 64, 175);
    doc.text('ACTA DE ENTREGA DE HARDWARE', 105, 25, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('SISTEMA DE GESTIÓN DE ACTIVOS TI', 105, 32, { align: 'center' });
    doc.line(20, 38, 190, 38);

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text(`Nro. Registro: ITAM-ASIG-${asig.idAsignacion}`, 20, 50);
    doc.text(`Fecha: ${fecha}`, 150, 50);

    doc.setFont("helvetica", "normal");
    const cuerpo = `Por la presente, se hace entrega formal del activo tecnológico a ${empleado}, quien asume la responsabilidad del uso y cuidado del hardware descrito a continuación:`;
    doc.text(doc.splitTextToSize(cuerpo, 170), 20, 65);

    doc.setFillColor(249, 250, 251);
    doc.rect(20, 85, 170, 45, 'F');
    doc.setFont("helvetica", "bold");
    doc.text('CARACTERÍSTICAS DEL EQUIPO:', 25, 95);
    doc.setFont("helvetica", "normal");
    doc.text(`Código ITAM: ${equipo.codigoItam}`, 25, 105);
    doc.text(`Tipo de Activo: ${equipo.tipo}`, 25, 112);
    doc.text(`Marca / Modelo: ${equipo.marca}`, 25, 119);
    doc.text(`Estado de Entrega: ${asig.condicionEntrega}`, 25, 126);

    const terminos = "El receptor se compromete a reportar cualquier desperfecto al área de sistemas y a devolver el hardware en las mismas condiciones recibidas al finalizar su relación laboral.";
    doc.setFontSize(10);
    doc.text(doc.splitTextToSize(terminos, 170), 20, 150);

    doc.line(40, 210, 80, 210);
    doc.text('Responsable TI', 48, 215);

    doc.line(130, 210, 170, 210);
    doc.text('Receptor / Empleado', 135, 215);

    doc.save(`Acta_${equipo.codigoItam}.pdf`);
  }

  devolverHardware(idAsignacion: number) {
    if (confirm('¿Confirmar la devolución de este hardware? El equipo volverá a estar "Disponible".')) {
      this.http.put(`${this.URL}/asignaciones/devolver/${idAsignacion}`, {}).subscribe({
        next: () => {
          alert('Devolución registrada con éxito.');
          this.cargarDatos();
        },
        error: () => alert('Error al procesar la devolución.')
      });
    }
  }
}
