using Microsoft.EntityFrameworkCore.Migrations;

namespace FitnessTrackerApi.Migrations
{
    public partial class UpdateDietTargets : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EnableSugarTarget",
                table: "DailyTargets");

            migrationBuilder.DropColumn(
                name: "SugarTarget",
                table: "DailyTargets");

            migrationBuilder.DropColumn(
                name: "ManuallyCalculateTargets",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<int>(
                name: "DietTargetMode",
                table: "DailyTargets",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DietTargetMode",
                table: "DailyTargets");

            migrationBuilder.AddColumn<bool>(
                name: "EnableSugarTarget",
                table: "DailyTargets",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "SugarTarget",
                table: "DailyTargets",
                type: "decimal(18,4)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<bool>(
                name: "ManuallyCalculateTargets",
                table: "AspNetUsers",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
