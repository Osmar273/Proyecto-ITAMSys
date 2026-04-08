using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ItamBackend.Api.Models
{
    [Table("empleados")] // 🔥 Forzamos minúsculas para que coincida con tu DB
    public class Empleado
    {
        [Key]
        [Column("id_empleado")] // Si en tu DB la columna es id_empleado, ponlo así
        public int IdEmpleado { get; set; }

        [Column("nombre_completo")]
        public string NombreCompleto { get; set; } = string.Empty;

        [Column("cargo")]
        public string Cargo { get; set; } = string.Empty;

        [Column("departamento")]
        public string Departamento { get; set; } = string.Empty;

        [Column("email")]
        public string Email { get; set; } = string.Empty;

        [Column("activo")]
        public bool Activo { get; set; } = true;
    }
}