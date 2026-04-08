using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ItamBackend.Api.Data;
using ItamBackend.Api.Models;
using Microsoft.AspNetCore.Authorization;
using System;

namespace ItamBackend.Api.Controllers
{
    [Authorize] // 🔥 PROTECCIÓN ACTIVADA
    [ApiController]
    [Route("api/asignaciones")]
    public class AsignacionController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AsignacionController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Listar()
        {
            var data = await _context.Asignaciones.OrderByDescending(a => a.FechaAsignacion).ToListAsync();
            return Ok(data);
        }

        [HttpPost]
        public async Task<IActionResult> Crear([FromBody] Asignacion asignacion)
        {
            try
            {
                var equipo = await _context.Equipos.FindAsync(asignacion.IdEquipo);
                if (equipo == null) return NotFound(new { mensaje = "El hardware no existe" });

                if (equipo.Estado == "Asignado")
                {
                    return BadRequest(new { mensaje = "Este equipo ya se encuentra asignado a otra persona." });
                }

                asignacion.FechaAsignacion = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Utc);
                asignacion.IdAsignacion = 0;

                _context.Asignaciones.Add(asignacion);

                equipo.Estado = "Asignado";

                await _context.SaveChangesAsync();
                return Ok(new { mensaje = "Asignación registrada exitosamente" });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.InnerException?.Message ?? ex.Message);
                return StatusCode(500, new { mensaje = "Error al procesar la asignación en la DB" });
            }
        }

        [HttpPut("devolver/{idAsignacion}")]
        public async Task<IActionResult> Devolver(int idAsignacion)
        {
            var asignacion = await _context.Asignaciones.FindAsync(idAsignacion);
            if (asignacion == null || asignacion.Estado == "Devuelta") return NotFound();

            var equipo = await _context.Equipos.FindAsync(asignacion.IdEquipo);
            if (equipo == null) return NotFound();

            asignacion.Estado = "Devuelta";
            asignacion.FechaDevolucion = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Utc);

            // El equipo vuelve a estar disponible en la empresa
            equipo.Estado = "Disponible";

            await _context.SaveChangesAsync();
            return Ok(new { mensaje = "Hardware devuelto correctamente" });
        }
    }
}