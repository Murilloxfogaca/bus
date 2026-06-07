using Microsoft.AspNetCore.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using OnibusExpress.Application.Interfaces;
using OnibusExpress.Application.Services;
using OnibusExpress.Domain.Exceptions;
using OnibusExpress.Infrastructure.Data;
using OnibusExpress.Infrastructure.Repositories;

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
    c.SwaggerDoc("v1", new() { Title = "OniBus Express API", Version = "v1" }));

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        x => x.MigrationsAssembly(typeof(AppDbContext).Assembly.GetName().Name)));

builder.Services.AddScoped<IRotaRepository,   RotaRepository>();
builder.Services.AddScoped<IViagemRepository, ViagemRepository>();
builder.Services.AddScoped<IReservaRepository, ReservaRepository>();
builder.Services.AddScoped<RotaService>();
builder.Services.AddScoped<ViagemService>();
builder.Services.AddScoped<ReservaService>();

builder.Services.AddCors(opt =>
    opt.AddDefaultPolicy(p => p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();

app.UseExceptionHandler(ex => ex.Run(async context =>
{
    var feature = context.Features.Get<IExceptionHandlerFeature>();
    if (feature?.Error is DomainException de)
    {
        context.Response.StatusCode  = 400;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new { error = de.Message });
    }
    else if (feature?.Error is ArgumentException ae)
    {
        context.Response.StatusCode  = 400;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new { error = ae.Message });
    }
    else
    {
        context.Response.StatusCode  = 500;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new { error = "Erro interno do servidor." });
    }
}));

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors();
app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var creator = db.Database.GetInfrastructure().GetRequiredService<IRelationalDatabaseCreator>() as RelationalDatabaseCreator;
    if (creator != null && !await creator.HasTablesAsync())
        await creator.CreateTablesAsync();
    await DatabaseSeeder.SeedAsync(db);
}

app.Run();
