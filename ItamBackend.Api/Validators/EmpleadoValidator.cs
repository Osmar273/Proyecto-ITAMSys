using FluentValidation;
using ItamBackend.Api.Models;

namespace ItamBackend.Api.Validators
{
	// Heredamos de AbstractValidator e indicamos el modelo a validar
	public class EmpleadoValidator : AbstractValidator<Empleado>
	{
		public EmpleadoValidator()
		{
			RuleFor(x => x.NombreCompleto)
				.NotEmpty().WithMessage("El nombre completo es obligatorio.")
				.MinimumLength(3).WithMessage("El nombre debe tener al menos 3 caracteres.");

			RuleFor(x => x.Cargo)
				.NotEmpty().WithMessage("El cargo es obligatorio.");

			RuleFor(x => x.Departamento)
				.NotEmpty().WithMessage("El departamento no puede estar vacío.");

			RuleFor(x => x.Email)
				.NotEmpty().WithMessage("El correo es obligatorio.")
				.EmailAddress().WithMessage("El formato del correo no es válido (ejemplo: usuario@correo.com).");
		}
	}
}