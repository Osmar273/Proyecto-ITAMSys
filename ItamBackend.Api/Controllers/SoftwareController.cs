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
    [Route("api/software")]
    public class SoftwareController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SoftwareController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Listar()
        {
            var data = await _context.Software.OrderBy(s => s.IdSoftware).ToListAsync();
            return Ok(data);
        }

        [HttpPost]
        public async Task<IActionResult> Crear([FromBody] Software sw)
        {
            try
            {
                sw.IdSoftware = 0;

                if (sw.FechaVencimiento.HasValue)
                {
                    sw.FechaVencimiento = DateTime.SpecifyKind(sw.FechaVencimiento.Value, DateTimeKind.Utc);
                }

                _context.Software.Add(sw);
                await _context.SaveChangesAsync();
                return Ok(new { mensaje = "Software registrado correctamente" });
            }
            catch (Exception ex)
            {
                Console.WriteLine("---------------- ERROR POSTGRES ----------------");
                Console.WriteLine(ex.InnerException?.Message ?? ex.Message);
                return StatusCode(500, new { mensaje = "Error en la DB", detalle = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Actualizar(int id, [FromBody] Software sw)
        {
            var existente = await _context.Software.FindAsync(id);
            if (existente == null) return NotFound();

            existente.Nombre = sw.Nombre;
            existente.Version = sw.Version;
            existente.LicenciaClave = sw.LicenciaClave;

            if (sw.FechaVencimiento.HasValue)
            {
                existente.FechaVencimiento = DateTime.SpecifyKind(sw.FechaVencimiento.Value, DateTimeKind.Utc);
            }
            else
            {
                existente.FechaVencimiento = null;
            }

            await _context.SaveChangesAsync();
            return Ok(new { mensaje = "Datos actualizados" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> CambiarEstado(int id)
        {
            var sw = await _context.Software.FindAsync(id);
            if (sw == null) return NotFound();

            sw.Activo = !sw.Activo;
            await _context.SaveChangesAsync();
            return Ok(new { mensaje = "Estado actualizado" });
        }
    }
}