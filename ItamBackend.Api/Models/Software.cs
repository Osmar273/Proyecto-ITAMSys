using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ItamBackend.Api.Models
{
    [Table("software")]
    public class Software
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)] // 🔥 ESTO CORRIGE EL ERROR DE LA DB
        [Column("id_software")]
        public int IdSoftware { get; set; }

        [Column("nombre")]
        public string Nombre { get; set; } = string.Empty;

        [Column("version")]
        public string Version { get; set; } = string.Empty;

        [Column("licencia_clave")]
        public string LicenciaClave { get; set; } = string.Empty;

        [Column("fecha_vencimiento")]
        public DateTime? FechaVencimiento { get; set; }

        [Column("activo")]
        public bool Activo { get; set; } = true;
    }
}