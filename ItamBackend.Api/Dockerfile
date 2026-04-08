# Etapa 1: Compilación usando el SDK de .NET
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copiar el archivo de proyecto y restaurar dependencias
COPY ["ItamBackend.Api.csproj", "./"]
RUN dotnet restore "ItamBackend.Api.csproj"

# Copiar el resto del código y compilar la aplicación
COPY . .
RUN dotnet publish "ItamBackend.Api.csproj" -c Release -o /out /p:UseAppHost=false

# Etapa 2: Imagen ligera para producción
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /out .

# Configurar el puerto interno del contenedor
ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "ItamBackend.Api.dll"]