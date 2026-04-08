using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ItamBackend.Api.Models
{
    [Table("equipos")]
    public class Equipo
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id_equipo")]
        public int IdEquipo { get; set; }

        [Column("codigo_itam")]
        public string CodigoItam { get; set; } = string.Empty;

        [Column("tipo")]
        public string Tipo { get; set; } = string.Empty;

        [Column("marca")]
        public string Marca { get; set; } = string.Empty;

        // 🔥 NUEVOS CAMPOS AGREGADOS
        [Column("modelo")]
        public string? Modelo { get; set; }

        [Column("numero_serie")]
        public string? NumeroSerie { get; set; }

        [Column("direccion_mac")]
        public string? DireccionMac { get; set; }

        [Column("fecha_adquisicion")]
        public DateTime? FechaAdquisicion { get; set; }

        [Column("notas")]
        public string? Notas { get; set; }

        [Column("estado")]
        public string Estado { get; set; } = "Disponible";

        [Column("activo")]
        public bool Activo { get; set; } = true;
    }
}