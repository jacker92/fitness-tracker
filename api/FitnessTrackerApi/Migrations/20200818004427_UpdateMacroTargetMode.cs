using Microsoft.EntityFrameworkCore.Migrations;

namespace FitnessTrackerApi.Migrations
{
    public partial class UpdateMacroTargetMode : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DietTargetMode",
                table: "DailyTargets");

            migrationBuilder.AddColumn<int>(
                name: "MacroTargetMode",
                table: "DailyTargets",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MacroTargetMode",
                table: "DailyTargets");

            migrationBuilder.AddColumn<int>(
                name: "DietTargetMode",
                table: "DailyTargets",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
