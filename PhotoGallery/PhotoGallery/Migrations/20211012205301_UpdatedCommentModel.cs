using Microsoft.EntityFrameworkCore.Migrations;

namespace PhotoGallery.Migrations
{
    public partial class UpdatedCommentModel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comment_Photo_PhotoId",
                table: "Comment");

            migrationBuilder.AlterColumn<int>(
                name: "PhotoId",
                table: "Comment",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Comment_Photo_PhotoId",
                table: "Comment",
                column: "PhotoId",
                principalTable: "Photo",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comment_Photo_PhotoId",
                table: "Comment");

            migrationBuilder.AlterColumn<int>(
                name: "PhotoId",
                table: "Comment",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Comment_Photo_PhotoId",
                table: "Comment",
                column: "PhotoId",
                principalTable: "Photo",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
