using Microsoft.EntityFrameworkCore.Migrations;

namespace FitnessTrackerApi.Migrations
{
    public partial class CorrectCarbsMisspelling : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CarbohydratePercentage",
                table: "DailyTargets",
                newName: "CarbohydratesPercentage");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CarbohydratesPercentage",
                table: "DailyTargets",
                newName: "CarbohydratePercentage");
        }
    }
}
