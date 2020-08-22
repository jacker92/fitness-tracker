using Microsoft.EntityFrameworkCore.Migrations;

namespace FitnessTrackerApi.Migrations
{
    public partial class AddDietPercentage : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "DietPercentage",
                table: "AspNetUsers",
                type: "decimal(18,4)",
                nullable: false,
                defaultValue: 0m);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DietPercentage",
                table: "AspNetUsers");
        }
    }
}
