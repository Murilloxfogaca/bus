using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using OnibusExpress.Infrastructure.Data;

#nullable disable

namespace OnibusExpress.Infrastructure.Migrations;

[DbContext(typeof(AppDbContext))]
partial class AppDbContextModelSnapshot : ModelSnapshot
{
    protected override void BuildModel(ModelBuilder modelBuilder)
    {
#pragma warning disable 612, 618
        modelBuilder
            .HasAnnotation("ProductVersion", "8.0.0")
            .HasAnnotation("Relational:MaxIdentifierLength", 63);

        NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

        modelBuilder.Entity("OnibusExpress.Domain.Entities.Passageiro", b =>
        {
            b.Property<int>("Id").ValueGeneratedOnAdd().HasColumnType("integer");
            NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));
            b.Property<string>("Cpf").IsRequired().HasMaxLength(11).HasColumnType("character varying(11)");
            b.Property<string>("Email").IsRequired().HasMaxLength(200).HasColumnType("character varying(200)");
            b.Property<string>("NomeCompleto").IsRequired().HasMaxLength(200).HasColumnType("character varying(200)");
            b.HasKey("Id");
            b.ToTable("Passageiros");
        });

        modelBuilder.Entity("OnibusExpress.Domain.Entities.Reserva", b =>
        {
            b.Property<int>("Id").ValueGeneratedOnAdd().HasColumnType("integer");
            NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));
            b.Property<string>("CodigoReserva").IsRequired().HasMaxLength(10).HasColumnType("character varying(10)");
            b.Property<DateTime>("CriadaEm").HasColumnType("timestamp without time zone");
            b.Property<int>("NumeroAssento").HasColumnType("integer");
            b.Property<int>("PassageiroId").HasColumnType("integer");
            b.Property<int>("Status").HasColumnType("integer");
            b.Property<int>("ViagemId").HasColumnType("integer");
            b.HasKey("Id");
            b.HasIndex("CodigoReserva").IsUnique();
            b.HasIndex("PassageiroId");
            b.HasIndex("ViagemId");
            b.ToTable("Reservas");
        });

        modelBuilder.Entity("OnibusExpress.Domain.Entities.Rota", b =>
        {
            b.Property<int>("Id").ValueGeneratedOnAdd().HasColumnType("integer");
            NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));
            b.Property<string>("Destino").IsRequired().HasMaxLength(100).HasColumnType("character varying(100)");
            b.Property<TimeSpan>("DuracaoEstimada").HasColumnType("interval");
            b.Property<string>("Origem").IsRequired().HasMaxLength(100).HasColumnType("character varying(100)");
            b.HasKey("Id");
            b.ToTable("Rotas");
        });

        modelBuilder.Entity("OnibusExpress.Domain.Entities.Viagem", b =>
        {
            b.Property<int>("Id").ValueGeneratedOnAdd().HasColumnType("integer");
            NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));
            b.Property<DateTime>("DataHoraPartida").HasColumnType("timestamp without time zone");
            b.Property<decimal>("PrecoBase").HasColumnType("numeric(10,2)");
            b.Property<int>("RotaId").HasColumnType("integer");
            b.Property<int>("TotalAssentos").HasColumnType("integer");
            b.HasKey("Id");
            b.HasIndex("RotaId");
            b.ToTable("Viagens");
        });

        modelBuilder.Entity("OnibusExpress.Domain.Entities.Reserva", b =>
        {
            b.HasOne("OnibusExpress.Domain.Entities.Passageiro", "Passageiro")
                .WithMany().HasForeignKey("PassageiroId")
                .OnDelete(DeleteBehavior.Cascade).IsRequired();
            b.HasOne("OnibusExpress.Domain.Entities.Viagem", "Viagem")
                .WithMany("Reservas").HasForeignKey("ViagemId")
                .OnDelete(DeleteBehavior.Cascade).IsRequired();
            b.Navigation("Passageiro");
            b.Navigation("Viagem");
        });

        modelBuilder.Entity("OnibusExpress.Domain.Entities.Viagem", b =>
        {
            b.HasOne("OnibusExpress.Domain.Entities.Rota", "Rota")
                .WithMany("Viagens").HasForeignKey("RotaId")
                .OnDelete(DeleteBehavior.Cascade).IsRequired();
            b.Navigation("Rota");
        });

        modelBuilder.Entity("OnibusExpress.Domain.Entities.Rota", b => b.Navigation("Viagens"));
        modelBuilder.Entity("OnibusExpress.Domain.Entities.Viagem", b => b.Navigation("Reservas"));
#pragma warning restore 612, 618
    }
}
