using ItamBackend.Api.Models;
using System.Linq;

namespace ItamBackend.Api.Data
{
    public static class DbInitializer
    {
        public static void Seed(AppDbContext context)
        {
            context.Database.EnsureCreated();

            if (context.Empleados.Any()) return; // Si ya hay datos, no hace nada

            var empleados = new Empleado[]
            {
                new Empleado { NombreCompleto = "Osmar Administrador", Cargo = "Jefe de TI", Departamento = "Sistemas", Email = "osmar@itam.com", Activo = true },
                new Empleado { NombreCompleto = "Juan Perez", Cargo = "Contador", Departamento = "Finanzas", Email = "juan@itam.com", Activo = true },
                new Empleado { NombreCompleto = "Maria Garcia", Cargo = "Analista", Departamento = "RRHH", Email = "maria@itam.com", Activo = true }
                // Puedes agregar hasta completar los 10 aquí...
            };
            context.Empleados.AddRange(empleados);

            var equipos = new Equipo[]
            {
                new Equipo { CodigoItam = "LAP-001", Tipo = "Laptop", Marca = "Dell", Modelo = "Latitude 5420", Estado = "Disponible", Activo = true },
                new Equipo { CodigoItam = "MON-001", Tipo = "Monitor", Marca = "HP", Modelo = "V24i", Estado = "Disponible", Activo = true }
                // Agrega más equipos aquí...
            };
            context.Equipos.AddRange(equipos);

            context.SaveChanges();
        }
    }
}