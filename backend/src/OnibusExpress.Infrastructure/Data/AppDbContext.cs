using Microsoft.EntityFrameworkCore;
using OnibusExpress.Domain.Entities;

namespace OnibusExpress.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Rota> Rotas => Set<Rota>();
    public DbSet<Viagem> Viagens => Set<Viagem>();
    public DbSet<Passageiro> Passageiros => Set<Passageiro>();
    public DbSet<Reserva> Reservas => Set<Reserva>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Rota>(e =>
        {
            e.HasKey(r => r.Id);
            e.Property(r => r.Origem).IsRequired().HasMaxLength(100);
            e.Property(r => r.Destino).IsRequired().HasMaxLength(100);
        });

        modelBuilder.Entity<Viagem>(e =>
        {
            e.HasKey(v => v.Id);
            e.Property(v => v.PrecoBase).HasColumnType("numeric(10,2)");
            e.HasOne(v => v.Rota).WithMany(r => r.Viagens).HasForeignKey(v => v.RotaId);
        });

        modelBuilder.Entity<Passageiro>(e =>
        {
            e.HasKey(p => p.Id);
            e.Property(p => p.NomeCompleto).IsRequired().HasMaxLength(200);
            e.Property(p => p.Cpf).IsRequired().HasMaxLength(11);
            e.Property(p => p.Email).IsRequired().HasMaxLength(200);
        });

        modelBuilder.Entity<Reserva>(e =>
        {
            e.HasKey(r => r.Id);
            e.Property(r => r.CodigoReserva).IsRequired().HasMaxLength(10);
            e.HasIndex(r => r.CodigoReserva).IsUnique();
            e.HasOne(r => r.Viagem).WithMany(v => v.Reservas).HasForeignKey(r => r.ViagemId);
            e.HasOne(r => r.Passageiro).WithMany().HasForeignKey(r => r.PassageiroId);
        });
    }
}
