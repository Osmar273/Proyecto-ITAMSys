using ItamBackend.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ItamBackend.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Empleado> Empleados { get; set; }
        public DbSet<Equipo> Equipos { get; set; }

        // 🔥 NUEVA TABLA PARA EL MÓDULO DE LICENCIAS
        public DbSet<Software> Software { get; set; }
       
        public DbSet<Asignacion> Asignaciones { get; set; }
    }
}