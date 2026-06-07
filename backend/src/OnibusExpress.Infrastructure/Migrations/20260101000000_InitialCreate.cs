using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace OnibusExpress.Infrastructure.Migrations;

[Migration("20260101000000_InitialCreate")]
public partial class InitialCreate : Migration
{
        protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "Passageiros",
            columns: table => new
            {
                Id = table.Column<int>(type: "integer", nullable: false)
                    .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                NomeCompleto = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                Cpf = table.Column<string>(type: "character varying(11)", maxLength: 11, nullable: false),
                Email = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
            },
            constraints: table => table.PrimaryKey("PK_Passageiros", x => x.Id));

        migrationBuilder.CreateTable(
            name: "Rotas",
            columns: table => new
            {
                Id = table.Column<int>(type: "integer", nullable: false)
                    .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                Origem = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                Destino = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                DuracaoEstimada = table.Column<TimeSpan>(type: "interval", nullable: false),
            },
            constraints: table => table.PrimaryKey("PK_Rotas", x => x.Id));

        migrationBuilder.CreateTable(
            name: "Viagens",
            columns: table => new
            {
                Id = table.Column<int>(type: "integer", nullable: false)
                    .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                RotaId = table.Column<int>(type: "integer", nullable: false),
                DataHoraPartida = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                PrecoBase = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                TotalAssentos = table.Column<int>(type: "integer", nullable: false),
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Viagens", x => x.Id);
                table.ForeignKey(
                    name: "FK_Viagens_Rotas_RotaId",
                    column: x => x.RotaId,
                    principalTable: "Rotas",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            name: "Reservas",
            columns: table => new
            {
                Id = table.Column<int>(type: "integer", nullable: false)
                    .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                ViagemId = table.Column<int>(type: "integer", nullable: false),
                PassageiroId = table.Column<int>(type: "integer", nullable: false),
                NumeroAssento = table.Column<int>(type: "integer", nullable: false),
                Status = table.Column<int>(type: "integer", nullable: false),
                CodigoReserva = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                CriadaEm = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Reservas", x => x.Id);
                table.ForeignKey(
                    name: "FK_Reservas_Passageiros_PassageiroId",
                    column: x => x.PassageiroId,
                    principalTable: "Passageiros",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
                table.ForeignKey(
                    name: "FK_Reservas_Viagens_ViagemId",
                    column: x => x.ViagemId,
                    principalTable: "Viagens",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateIndex(name: "IX_Reservas_CodigoReserva", table: "Reservas", column: "CodigoReserva", unique: true);
        migrationBuilder.CreateIndex(name: "IX_Reservas_PassageiroId",  table: "Reservas", column: "PassageiroId");
        migrationBuilder.CreateIndex(name: "IX_Reservas_ViagemId",      table: "Reservas", column: "ViagemId");
        migrationBuilder.CreateIndex(name: "IX_Viagens_RotaId",         table: "Viagens",  column: "RotaId");
    }

        protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(name: "Reservas");
        migrationBuilder.DropTable(name: "Viagens");
        migrationBuilder.DropTable(name: "Rotas");
        migrationBuilder.DropTable(name: "Passageiros");
    }
}
