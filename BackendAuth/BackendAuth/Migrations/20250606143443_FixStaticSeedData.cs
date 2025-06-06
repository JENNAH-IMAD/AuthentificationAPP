using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendAuth.Migrations
{
    /// <inheritdoc />
    public partial class FixStaticSeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 6, 6, 14, 34, 42, 749, DateTimeKind.Utc).AddTicks(3393));

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 6, 6, 14, 34, 42, 749, DateTimeKind.Utc).AddTicks(3807));

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 6, 6, 14, 34, 42, 749, DateTimeKind.Utc).AddTicks(3808));

            migrationBuilder.UpdateData(
                table: "UserRoles",
                keyColumn: "Id",
                keyValue: 1,
                column: "AssignedAt",
                value: new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "$2a$11$8SgF7hJF6iWBL.eZvY5YH.QiD6xZqN7KH5/wXJ9F5lBQdj8gF3Y0y" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 6, 6, 14, 28, 0, 527, DateTimeKind.Utc).AddTicks(8584));

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 6, 6, 14, 28, 0, 527, DateTimeKind.Utc).AddTicks(8951));

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 6, 6, 14, 28, 0, 527, DateTimeKind.Utc).AddTicks(8953));

            migrationBuilder.UpdateData(
                table: "UserRoles",
                keyColumn: "Id",
                keyValue: 1,
                column: "AssignedAt",
                value: new DateTime(2025, 6, 6, 14, 28, 0, 762, DateTimeKind.Utc).AddTicks(9761));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2025, 6, 6, 14, 28, 0, 762, DateTimeKind.Utc).AddTicks(8485), "$2a$11$6EsO1WEhDvXb7uIUXUMFF.u9yopS/9t/N4Gd025b8DM4WJQmXgUdK" });
        }
    }
}
