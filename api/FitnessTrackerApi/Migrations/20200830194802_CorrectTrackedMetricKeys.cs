using Microsoft.EntityFrameworkCore.Migrations;

namespace FitnessTrackerApi.Migrations
{
    public partial class CorrectTrackedMetricKeys : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_UserTrackedMetrics_MetricID",
                table: "UserTrackedMetrics");

            migrationBuilder.DropIndex(
                name: "IX_UserTrackedMetrics_UserID",
                table: "UserTrackedMetrics");

            migrationBuilder.CreateIndex(
                name: "IX_UserTrackedMetrics_MetricID",
                table: "UserTrackedMetrics",
                column: "MetricID");

            migrationBuilder.CreateIndex(
                name: "IX_UserTrackedMetrics_UserID",
                table: "UserTrackedMetrics",
                column: "UserID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_UserTrackedMetrics_MetricID",
                table: "UserTrackedMetrics");

            migrationBuilder.DropIndex(
                name: "IX_UserTrackedMetrics_UserID",
                table: "UserTrackedMetrics");

            migrationBuilder.CreateIndex(
                name: "IX_UserTrackedMetrics_MetricID",
                table: "UserTrackedMetrics",
                column: "MetricID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserTrackedMetrics_UserID",
                table: "UserTrackedMetrics",
                column: "UserID",
                unique: true,
                filter: "[UserID] IS NOT NULL");
        }
    }
}
