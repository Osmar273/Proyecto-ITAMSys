using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ItamBackend.Api.Migrations
{
    /// <inheritdoc />
    public partial class SincronizacionTotal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_equipos_empleados_id_empleado_asignado",
                table: "equipos");

            migrationBuilder.DropIndex(
                name: "IX_equipos_id_empleado_asignado",
                table: "equipos");

            migrationBuilder.DropColumn(
                name: "estado_equipo",
                table: "equipos");

            migrationBuilder.DropColumn(
                name: "id_empleado_asignado",
                table: "equipos");

            migrationBuilder.DropColumn(
                name: "modelo",
                table: "equipos");

            migrationBuilder.RenameColumn(
                name: "tipo_equipo",
                table: "equipos",
                newName: "tipo");

            migrationBuilder.RenameColumn(
                name: "numero_serie",
                table: "equipos",
                newName: "estado");

            migrationBuilder.AddColumn<bool>(
                name: "activo",
                table: "equipos",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "activo",
                table: "equipos");

            migrationBuilder.RenameColumn(
                name: "tipo",
                table: "equipos",
                newName: "tipo_equipo");

            migrationBuilder.RenameColumn(
                name: "estado",
                table: "equipos",
                newName: "numero_serie");

            migrationBuilder.AddColumn<string>(
                name: "estado_equipo",
                table: "equipos",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "id_empleado_asignado",
                table: "equipos",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "modelo",
                table: "equipos",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_equipos_id_empleado_asignado",
                table: "equipos",
                column: "id_empleado_asignado");

            migrationBuilder.AddForeignKey(
                name: "FK_equipos_empleados_id_empleado_asignado",
                table: "equipos",
                column: "id_empleado_asignado",
                principalTable: "empleados",
                principalColumn: "id_empleado");
        }
    }
}
