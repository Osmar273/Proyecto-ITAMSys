using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ItamBackend.Api.Models
{
    [Table("asignaciones")]
    public class Asignacion
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id_asignacion")]
        public int IdAsignacion { get; set; }

        [Column("id_empleado")]
        public int IdEmpleado { get; set; }

        [Column("id_equipo")]
        public int IdEquipo { get; set; }

        [Column("fecha_asignacion")]
        public DateTime FechaAsignacion { get; set; } = DateTime.UtcNow;

        [Column("fecha_devolucion")]
        public DateTime? FechaDevolucion { get; set; }

        [Column("estado")]
        public string Estado { get; set; } = "Activa"; // Puede ser "Activa" o "Devuelta"

        [Column("condicion_entrega")]
        public string CondicionEntrega { get; set; } = "Óptima";
    }
}