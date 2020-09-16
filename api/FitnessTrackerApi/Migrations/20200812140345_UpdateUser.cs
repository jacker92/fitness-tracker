using Microsoft.EntityFrameworkCore.Migrations;

namespace FitnessTrackerApi.Migrations
{
    public partial class UpdateUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Metrics_AspNetUsers_UserId",
                table: "Metrics");

            migrationBuilder.DropIndex(
                name: "IX_Metrics_UserId",
                table: "Metrics");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Metrics");

            migrationBuilder.AddColumn<string>(
                name: "Avatar",
                table: "AspNetUsers",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CaloriesBurnedSetting",
                table: "AspNetUsers",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "UserTrackedMetrics",
                columns: table => new
                {
                    ID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserID = table.Column<string>(nullable: true),
                    MetricID = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserTrackedMetrics", x => x.ID);
                    table.ForeignKey(
                        name: "FK_UserTrackedMetrics_Metrics_MetricID",
                        column: x => x.MetricID,
                        principalTable: "Metrics",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserTrackedMetrics_AspNetUsers_UserID",
                        column: x => x.UserID,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

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

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserTrackedMetrics");

            migrationBuilder.DropColumn(
                name: "Avatar",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "CaloriesBurnedSetting",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "Metrics",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Metrics_UserId",
                table: "Metrics",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Metrics_AspNetUsers_UserId",
                table: "Metrics",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
