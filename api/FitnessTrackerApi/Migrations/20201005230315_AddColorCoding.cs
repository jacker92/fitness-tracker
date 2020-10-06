using Microsoft.EntityFrameworkCore.Migrations;

namespace FitnessTrackerApi.Migrations
{
    public partial class AddColorCoding : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "EnableColorCoding",
                table: "DailyTargets",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "GreenEnd",
                table: "DailyTargets",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "GreenStart",
                table: "DailyTargets",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "YellowEnd",
                table: "DailyTargets",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "YellowStart",
                table: "DailyTargets",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EnableColorCoding",
                table: "DailyTargets");

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
        }
    }
}
