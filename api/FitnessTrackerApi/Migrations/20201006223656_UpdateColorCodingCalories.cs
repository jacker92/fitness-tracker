using Microsoft.EntityFrameworkCore.Migrations;

namespace FitnessTrackerApi.Migrations
{
    public partial class UpdateColorCodingCalories : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CaloriesGreenEnd",
                table: "DailyTargets",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "CaloriesGreenStart",
                table: "DailyTargets",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "CaloriesYellowEnd",
                table: "DailyTargets",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "CaloriesYellowStart",
                table: "DailyTargets",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CaloriesGreenEnd",
                table: "DailyTargets");

            migrationBuilder.DropColumn(
                name: "CaloriesGreenStart",
                table: "DailyTargets");

            migrationBuilder.DropColumn(
                name: "CaloriesYellowEnd",
                table: "DailyTargets");

            migrationBuilder.DropColumn(
                name: "CaloriesYellowStart",
                table: "DailyTargets");
        }
    }
}
