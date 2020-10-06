using Microsoft.EntityFrameworkCore.Migrations;

namespace FitnessTrackerApi.Migrations
{
    public partial class UpdateColorCoding : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GreenEnd",
                table: "DailyTargets");

            migrationBuilder.DropColumn(
                name: "GreenStart",
                table: "DailyTargets");

            migrationBuilder.DropColumn(
                name: "YellowEnd",
                table: "DailyTargets");

            migrationBuilder.DropColumn(
                name: "YellowStart",
                table: "DailyTargets");

            migrationBuilder.AddColumn<int>(
                name: "CarbohydratesGreenEnd",
                table: "DailyTargets",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "CarbohydratesGreenStart",
                table: "DailyTargets",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "CarbohydratesYellowEnd",
                table: "DailyTargets",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "CarbohydratesYellowStart",
                table: "DailyTargets",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "FatGreenEnd",
                table: "DailyTargets",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "FatGreenStart",
                table: "DailyTargets",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "FatYellowEnd",
                table: "DailyTargets",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "FatYellowStart",
                table: "DailyTargets",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ProteinGreenEnd",
                table: "DailyTargets",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ProteinGreenStart",
                table: "DailyTargets",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ProteinYellowEnd",
                table: "DailyTargets",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ProteinYellowStart",
                table: "DailyTargets",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CarbohydratesGreenEnd",
                table: "DailyTargets");

            migrationBuilder.DropColumn(
                name: "CarbohydratesGreenStart",
                table: "DailyTargets");

            migrationBuilder.DropColumn(
                name: "CarbohydratesYellowEnd",
                table: "DailyTargets");

            migrationBuilder.DropColumn(
                name: "CarbohydratesYellowStart",
                table: "DailyTargets");

            migrationBuilder.DropColumn(
                name: "FatGreenEnd",
                table: "DailyTargets");

            migrationBuilder.DropColumn(
                name: "FatGreenStart",
                table: "DailyTargets");

            migrationBuilder.DropColumn(
                name: "FatYellowEnd",
                table: "DailyTargets");

            migrationBuilder.DropColumn(
                name: "FatYellowStart",
                table: "DailyTargets");

            migrationBuilder.DropColumn(
                name: "ProteinGreenEnd",
                table: "DailyTargets");

            migrationBuilder.DropColumn(
                name: "ProteinGreenStart",
                table: "DailyTargets");

            migrationBuilder.DropColumn(
                name: "ProteinYellowEnd",
                table: "DailyTargets");

            migrationBuilder.DropColumn(
                name: "ProteinYellowStart",
                table: "DailyTargets");

            migrationBuilder.AddColumn<int>(
                name: "GreenEnd",
                table: "DailyTargets",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "GreenStart",
                table: "DailyTargets",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "YellowEnd",
                table: "DailyTargets",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "YellowStart",
                table: "DailyTargets",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
