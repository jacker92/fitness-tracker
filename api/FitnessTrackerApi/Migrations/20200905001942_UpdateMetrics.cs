using Microsoft.EntityFrameworkCore.Migrations;

namespace FitnessTrackerApi.Migrations
{
    public partial class UpdateMetrics : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UserID",
                table: "Metrics",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Metrics_UserID",
                table: "Metrics",
                column: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_Metrics_AspNetUsers_UserID",
                table: "Metrics",
                column: "UserID",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Metrics_AspNetUsers_UserID",
                table: "Metrics");

            migrationBuilder.DropIndex(
                name: "IX_Metrics_UserID",
                table: "Metrics");

            migrationBuilder.DropColumn(
                name: "UserID",
                table: "Metrics");
        }
    }
}
