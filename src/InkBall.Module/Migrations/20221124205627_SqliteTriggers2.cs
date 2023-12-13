using System;
using InkBall.Module.Model;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InkBall.Module.Migrations
{
    public partial class SqliteTriggers2 : Migration
    {
		protected override void Up(MigrationBuilder migrationBuilder)
		{
			//sadly Sqlite can drop already created trigger, 'coz when changing primary keys it WILL recreate NEW TABLES
			//from scratch with data copying BUT forgets (or not implemented yet) copying triggers from old tables.
			//so here we are doing this manually ... taken from earlier migration
			var is_sqlite = migrationBuilder.ActiveProvider == "Microsoft.EntityFrameworkCore.Sqlite";
			if (is_sqlite)
			{
				var player_ent = TargetModel.FindEntityType(typeof(InkBallPlayer));
				if (player_ent != null && player_ent.Name == typeof(InkBallPlayer).FullName)
				{
					migrationBuilder.CreateTimestampTrigger(player_ent, nameof(InkBallPlayer.TimeStamp), nameof(InkBallPlayer.iId));
				}
			}
		}

		protected override void Down(MigrationBuilder migrationBuilder)
		{
            //no-op 'coz this trigger-sqlite-thing should already be applied earlier
            //this is just a dummy-fix migration
		}
    }
}
