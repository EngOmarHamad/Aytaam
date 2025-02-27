using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Aytaam.Data.Migrations
{
    /// <inheritdoc />
    public partial class v2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TblSponsorships_TblOrphans_OrphanId",
                table: "TblSponsorships");

            migrationBuilder.RenameColumn(
                name: "OrphanId",
                table: "TblSponsorships",
                newName: "OrphanCode");

            migrationBuilder.RenameIndex(
                name: "IX_TblSponsorships_OrphanId",
                table: "TblSponsorships",
                newName: "IX_TblSponsorships_OrphanCode");

            migrationBuilder.AddForeignKey(
                name: "FK_TblSponsorships_TblOrphans_OrphanCode",
                table: "TblSponsorships",
                column: "OrphanCode",
                principalTable: "TblOrphans",
                principalColumn: "Code");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TblSponsorships_TblOrphans_OrphanCode",
                table: "TblSponsorships");

            migrationBuilder.RenameColumn(
                name: "OrphanCode",
                table: "TblSponsorships",
                newName: "OrphanId");

            migrationBuilder.RenameIndex(
                name: "IX_TblSponsorships_OrphanCode",
                table: "TblSponsorships",
                newName: "IX_TblSponsorships_OrphanId");

            migrationBuilder.AddForeignKey(
                name: "FK_TblSponsorships_TblOrphans_OrphanId",
                table: "TblSponsorships",
                column: "OrphanId",
                principalTable: "TblOrphans",
                principalColumn: "Code");
        }
    }
}
