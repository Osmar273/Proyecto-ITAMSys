using ItamBackend.Api.Data;
using ItamBackend.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text.Json;

// 🔥 1. PARCHE PARA FECHAS (PostgreSQL DateTime fix)
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// 🔥 2. CORS CORREGIDO (Sin choque de AllowAnyOrigin y AllowCredentials)
builder.Services.AddCors(options => {
    options.AddPolicy("AllowAngular", policy => {
        policy.WithOrigins("http://localhost:4200") // 👈 OBLIGATORIO especificar la URL si usas credenciales
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// 3. SEGURIDAD KEYCLOAK (Mapeo de roles para que no salgan ceros)
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => {
        options.Authority = "http://localhost:8080/realms/itam-realm";
        options.MetadataAddress = "http://keycloak:8080/realms/itam-realm/.well-known/openid-configuration";
        options.RequireHttpsMetadata = false;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            RoleClaimType = ClaimTypes.Role
        };
        options.Events = new JwtBearerEvents
        {
            OnTokenValidated = context => {
                var claimsIdentity = context.Principal?.Identity as ClaimsIdentity;
                var realmAccess = context.Principal?.FindFirst("realm_access")?.Value;
                if (realmAccess != null && claimsIdentity != null)
                {
                    var roles = JsonDocument.Parse(realmAccess).RootElement.GetProperty("roles");
                    foreach (var role in roles.EnumerateArray())
                        claimsIdentity.AddClaim(new Claim(ClaimTypes.Role, role.GetString()!));
                }
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowAngular"); // Primero CORS

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// 🔥 4. MOTOR DE ARRANQUE (Crea tablas y mete los 10 registros)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        Console.WriteLine("🚀 Sincronizando Base de Datos...");
        db.Database.EnsureCreated(); // 👈 ESTO CREA LA TABLA 'EQUIPOS' SI NO EXISTE
        DbInitializer.Seed(db);      // 👈 METE LOS DATOS DE PRUEBA
        Console.WriteLine("✅ Sistema cargado y tablas listas.");
    }
    catch (Exception ex)
    {
        Console.WriteLine("❌ ERROR CRÍTICO EN DB: " + ex.Message);
    }
}

app.Run();