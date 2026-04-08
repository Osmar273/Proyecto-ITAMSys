using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ItamBackend.Api.Data;
using ItamBackend.Api.Models;
using Microsoft.AspNetCore.Authorization;
using FluentValidation; // 🔥 NUEVO: Importamos FluentValidation

namespace ItamBackend.Api.Controllers
{
    [Authorize] // 🔥 PROTECCIÓN ACTIVADA
    [ApiController]
    [Route("api/usuarios")]
    public class UsuariosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsuariosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Listar()
        {
            var data = await _context.Empleados.OrderBy(u => u.IdEmpleado).ToListAsync();
            return Ok(data);
        }

        // 🔥 NUEVO: Método modificado para validar antes de guardar
        [HttpPost]
        public async Task<IActionResult> Crear([FromBody] Empleado emp, [FromServices] IValidator<Empleado> validator)
        {
            // 1. Validamos los datos entrantes contra las reglas que creaste
            var validationResult = await validator.ValidateAsync(emp);

            // 2. Si no cumple las reglas, devolvemos un 400 Bad Request con los mensajes
            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors.Select(e => e.ErrorMessage));
            }

            // 3. Si los datos son perfectos, los guardamos en PostgreSQL
            emp.Activo = true;
            _context.Empleados.Add(emp);
            await _context.SaveChangesAsync();
            return Ok(new { mensaje = "Empleado registrado con éxito" });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Actualizar(int id, [FromBody] Empleado emp)
        {
            var existente = await _context.Empleados.FindAsync(id);
            if (existente == null) return NotFound();

            existente.NombreCompleto = emp.NombreCompleto;
            existente.Cargo = emp.Cargo;
            existente.Departamento = emp.Departamento;
            existente.Email = emp.Email;

            await _context.SaveChangesAsync();
            return Ok(new { mensaje = "Datos actualizados correctamente" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> CambiarEstado(int id)
        {
            var emp = await _context.Empleados.FindAsync(id);
            if (emp == null) return NotFound();

            emp.Activo = !emp.Activo; // Toggle de estado para auditoría
            await _context.SaveChangesAsync();

            return Ok(new
            {
                mensaje = emp.Activo ? "Empleado Habilitado" : "Empleado Deshabilitado"
            });
        }
    }
}