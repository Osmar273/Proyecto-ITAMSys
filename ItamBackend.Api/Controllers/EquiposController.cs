using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ItamBackend.Api.Data;
using ItamBackend.Api.Models;
using Microsoft.AspNetCore.Authorization;

namespace ItamBackend.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/equipos")]
    public class EquiposController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EquiposController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Listar()
        {
            var data = await _context.Equipos.OrderBy(e => e.IdEquipo).ToListAsync();
            return Ok(data);
        }

        [HttpPost]
        public async Task<IActionResult> Crear([FromBody] Equipo eq)
        {
            try
            {
                if (eq == null) return BadRequest("Datos inválidos");

                eq.Activo = true;
                if (string.IsNullOrEmpty(eq.Estado)) eq.Estado = "Disponible";

                _context.Equipos.Add(eq);
                await _context.SaveChangesAsync();
                return Ok(new { mensaje = "Equipo registrado con éxito" });
            }
            catch (Exception ex)
            {
                // 🔥 Esto nos dirá el error real (ej. si falta una columna en DB)
                var msg = ex.InnerException?.Message ?? ex.Message;
                return StatusCode(500, new { mensaje = "Error en Base de Datos: " + msg });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Actualizar(int id, [FromBody] Equipo eq)
        {
            try
            {
                var existente = await _context.Equipos.FindAsync(id);
                if (existente == null) return NotFound();

                existente.CodigoItam = eq.CodigoItam;
                existente.Tipo = eq.Tipo;
                existente.Marca = eq.Marca;
                existente.Modelo = eq.Modelo;
                existente.NumeroSerie = eq.NumeroSerie;
                existente.DireccionMac = eq.DireccionMac;
                existente.FechaAdquisicion = eq.FechaAdquisicion;
                existente.Notas = eq.Notas;
                existente.Estado = eq.Estado;

                await _context.SaveChangesAsync();
                return Ok(new { mensaje = "Equipo actualizado correctamente" });
            }
            catch (Exception ex)
            {
                var msg = ex.InnerException?.Message ?? ex.Message;
                return StatusCode(500, new { mensaje = "Error al actualizar: " + msg });
            }
        }

        [HttpPut("mantenimiento/{id}")]
        public async Task<IActionResult> IrAMantenimiento(int id)
        {
            var eq = await _context.Equipos.FindAsync(id);
            if (eq == null) return NotFound();

            if (eq.Estado == "Asignado")
                return BadRequest(new { mensaje = "No se puede enviar a mantenimiento un equipo asignado." });

            eq.Estado = "En Mantenimiento";
            await _context.SaveChangesAsync();
            return Ok(new { mensaje = "Equipo enviado a servicio técnico" });
        }

        [HttpPut("baja/{id}")]
        public async Task<IActionResult> DarDeBaja(int id)
        {
            var eq = await _context.Equipos.FindAsync(id);
            if (eq == null) return NotFound();

            eq.Estado = "Baja Definitiva";
            eq.Activo = false;
            await _context.SaveChangesAsync();
            return Ok(new { mensaje = "Activo retirado permanentemente" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> CambiarEstado(int id)
        {
            var eq = await _context.Equipos.FindAsync(id);
            if (eq == null) return NotFound();

            eq.Activo = !eq.Activo;
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = eq.Activo ? "Equipo Habilitado" : "Equipo Deshabilitado" });
        }
    }
}