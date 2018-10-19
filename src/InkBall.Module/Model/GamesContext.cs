using System;
using System.IO;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.Extensions.Configuration;

namespace InkBall.Module
{
	public interface IGamesContext
	{
		DbSet<InkBallGame> InkBallGame { get; set; }
		DbSet<InkBallPath> InkBallPath { get; set; }
		DbSet<InkBallPlayer> InkBallPlayer { get; set; }
		DbSet<InkBallPoint> InkBallPoint { get; set; }
		DbSet<InkBallPointsInPath> InkBallPointsInPath { get; set; }
		DbSet<InkBallUser> InkBallUsers { get; set; }
	}

	public partial class GamesContext : DbContext, IGamesContext
	{
		public virtual DbSet<InkBallGame> InkBallGame { get; set; }
		public virtual DbSet<InkBallPath> InkBallPath { get; set; }
		public virtual DbSet<InkBallPlayer> InkBallPlayer { get; set; }
		public virtual DbSet<InkBallPoint> InkBallPoint { get; set; }
		public virtual DbSet<InkBallPointsInPath> InkBallPointsInPath { get; set; }
		public virtual DbSet<InkBallUser> InkBallUsers { get; set; }

		public GamesContext(DbContextOptions<GamesContext> options) : base(options)
		{
		}

		/*protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseMySql("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
            }
        }*/

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			modelBuilder.Entity<InkBallGame>(entity =>
			{
				entity.HasKey(e => e.iId);

				entity.HasIndex(e => e.iPlayer1Id)
					.HasName("ByPlayer1");

				entity.HasIndex(e => e.iPlayer2Id)
					.HasName("ByPlayer2");

				entity.Property(e => e.iId).HasColumnName("iID");

				entity.Property(e => e.bIsPlayer1Active)
					.HasColumnName("bIsPlayer1Active")
					.HasDefaultValueSql("'1'");

				entity.Property(e => e.CreateTime).HasColumnType("datetime");

				entity.Property(e => e.iBoardHeight)
					.HasColumnName("iBoardHeight")
					.HasDefaultValueSql("'800'");

				entity.Property(e => e.iBoardWidth)
					.HasColumnName("iBoardWidth")
					.HasDefaultValueSql("'600'");

				entity.Property(e => e.GameType)
					//.HasMaxLength(50)
					//.IsUnicode(false)
					.HasConversion(
						v => v.ToString(),
						v => (InkBallGame.GameTypeEnum)Enum.Parse(typeof(InkBallGame.GameTypeEnum), v));

				entity.Property(e => e.GameState)
					//.HasMaxLength(50)
					//.IsUnicode(false)
					.HasConversion(
						v => v.ToString(),
						v => (InkBallGame.GameStateEnum)Enum.Parse(typeof(InkBallGame.GameStateEnum), v));

				entity.Property(e => e.iGridSize)
					.HasColumnName("iGridSize")
					.HasDefaultValueSql("'15'");

				entity.Property(e => e.iPlayer1Id).HasColumnName("iPlayer1ID");

				entity.Property(e => e.iPlayer2Id).HasColumnName("iPlayer2ID");

				entity.Property(e => e.TimeStamp)
					.HasColumnType("timestamp")
					.HasDefaultValueSql("'CURRENT_TIMESTAMP'")
					.ValueGeneratedOnAddOrUpdate();

				entity.HasOne(d => d.Player1)
					.WithMany(p => p.InkBallGameIPlayer1)
					.HasForeignKey(d => d.iPlayer1Id)
					.OnDelete(DeleteBehavior.ClientSetNull)
					.HasConstraintName("InkBallGame_ibfk_1");

				entity.HasOne(d => d.Player2)
					.WithMany(p => p.InkBallGameIPlayer2)
					.HasForeignKey(d => d.iPlayer2Id)
					.HasConstraintName("InkBallGame_ibfk_2");
			});

			modelBuilder.Entity<InkBallPath>(entity =>
			{
				entity.HasKey(e => e.iId);

				entity.HasIndex(e => e.iGameId)
					.HasName("ByGame");

				entity.HasIndex(e => e.iPlayerId)
					.HasName("ByPlayer");

				entity.Property(e => e.iId).HasColumnName("iID");

				entity.Property(e => e.iGameId).HasColumnName("iGameID");

				entity.Property(e => e.iPlayerId).HasColumnName("iPlayerID");

				entity.HasOne(d => d.Game)
					.WithMany(p => p.InkBallPath)
					.HasForeignKey(d => d.iGameId)
					.OnDelete(DeleteBehavior.ClientSetNull)
					.HasConstraintName("InkBallPath_ibfk_1");

				entity.HasOne(d => d.Player)
					.WithMany(p => p.InkBallPath)
					.HasForeignKey(d => d.iPlayerId)
					.OnDelete(DeleteBehavior.ClientSetNull)
					.HasConstraintName("InkBallPath_ibfk_2");
			});

			modelBuilder.Entity<InkBallPlayer>(entity =>
			{
				entity.HasKey(e => e.iId);

				entity.HasIndex(e => e.iUserId)
					.HasName("ByUser");

				entity.Property(e => e.iId).HasColumnName("iID");

				entity.Property(e => e.iDrawCount)
					.HasColumnName("iDrawCount")
					.HasColumnType("int(11)")
					.HasDefaultValueSql("'0'");

				entity.Property(e => e.iLossCount)
					.HasColumnName("iLossCount")
					.HasColumnType("int(11)")
					.HasDefaultValueSql("'0'");

				entity.Property(e => e.iUserId)
					.HasColumnName("iUserID")
					.HasColumnType("bigint(10)");

				entity.Property(e => e.iWinCount)
					.HasColumnName("iWinCount")
					.HasColumnType("int(11)")
					.HasDefaultValueSql("'0'");

				entity.Property(e => e.sLastMoveCode)
					.HasColumnName("sLastMoveCode")
					.HasColumnType("varchar(1000)");

				entity.Property(e => e.TimeStamp)
					.HasColumnType("timestamp")
					.HasDefaultValueSql("'CURRENT_TIMESTAMP'")
					.ValueGeneratedOnAddOrUpdate();

				entity.HasOne(d => d.User)
					.WithMany(p => p.InkBallPlayer)
					.HasPrincipalKey(u => u.iId)
					.HasForeignKey(pd => pd.iUserId)
					.HasConstraintName("InkBallPlayer_ibfk_1");
			});

			modelBuilder.Entity<InkBallPoint>(entity =>
			{
				entity.HasKey(e => e.iId);

				entity.HasIndex(e => e.iEnclosingPathId)
					.HasName("ByEnclosingPath");

				entity.HasIndex(e => e.iGameId)
					.HasName("ByGame");

				entity.HasIndex(e => e.iPlayerId)
					.HasName("ByPlayer");

				entity.Property(e => e.iId).HasColumnName("iID");

				entity.Property(e => e.iEnclosingPathId).HasColumnName("iEnclosingPathID");

				entity.Property(e => e.iGameId).HasColumnName("iGameID");

				entity.Property(e => e.iPlayerId).HasColumnName("iPlayerID");

				entity.Property(e => e.iX).HasColumnName("iX");

				entity.Property(e => e.iY).HasColumnName("iY");

				entity.Property(e => e.Status)
					//.HasMaxLength(50)
					//.IsUnicode(false)
					.HasConversion(
						v => v.ToString(),
						v => (InkBallPoint.StatusEnum)Enum.Parse(typeof(InkBallPoint.StatusEnum), v));

				entity.HasOne(d => d.EnclosingPath)
					.WithMany(p => p.InkBallPoint)
					.HasForeignKey(d => d.iEnclosingPathId)
					.HasConstraintName("InkBallPoint_ibfk_5");

				entity.HasOne(d => d.Game)
					.WithMany(p => p.InkBallPoint)
					.HasForeignKey(d => d.iGameId)
					.OnDelete(DeleteBehavior.ClientSetNull)
					.HasConstraintName("InkBallPoint_ibfk_3");

				entity.HasOne(d => d.Player)
					.WithMany(p => p.InkBallPoint)
					.HasForeignKey(d => d.iPlayerId)
					.OnDelete(DeleteBehavior.ClientSetNull)
					.HasConstraintName("InkBallPoint_ibfk_4");
			});

			modelBuilder.Entity<InkBallPointsInPath>(entity =>
			{
				entity.HasKey(e => e.iId);

				entity.HasIndex(e => e.iPathId)
					.HasName("ByPath");

				entity.HasIndex(e => e.iPointId)
					.HasName("ByPoint");

				entity.Property(e => e.iId).HasColumnName("iID");

				entity.Property(e => e.iPathId).HasColumnName("iPathID");

				entity.Property(e => e.iPointId).HasColumnName("iPointID");

				entity.HasOne(d => d.Path)
					.WithMany(p => p.InkBallPointsInPath)
					.HasForeignKey(d => d.iPathId)
					.OnDelete(DeleteBehavior.ClientSetNull)
					.HasConstraintName("InkBallPointsInPath_ibfk_1");

				entity.HasOne(d => d.Point)
					.WithMany(p => p.InkBallPointsInPath)
					.HasForeignKey(d => d.iPointId)
					.OnDelete(DeleteBehavior.ClientSetNull)
					.HasConstraintName("InkBallPointsInPath_ibfk_2");
			});

			modelBuilder.Entity<InkBallUser>(entity =>
			{
				entity.HasKey(e => e.iId);

				entity.HasIndex(e => e.sExternalId)
					.HasName("sExternalId")
					.IsUnique();

				entity.HasIndex(e => new { e.poczta, e.haslo, e.potwierdzenie })
					.HasName("ByCheckersLoginFields");

				entity.Property(e => e.iId).HasColumnName("iID");

				entity.Property(e => e.haslo)
					.IsRequired()
					.HasColumnName("haslo")
					.HasColumnType("varchar(20)");

				entity.Property(e => e.iPrivileges)
					.HasColumnName("iPrivileges")
					.HasColumnType("tinyint(4)")
					.HasDefaultValueSql("'0'");

				entity.Property(e => e.iId)
					.HasColumnName("iId")
					.HasColumnType("bigint(4)");

				entity.Property(e => e.ksywa)
					.IsRequired()
					.HasColumnName("ksywa")
					.HasColumnType("char(15)");

				entity.Property(e => e.poczta)
					.IsRequired()
					.HasColumnName("poczta")
					.HasColumnType("varchar(40)");

				entity.Property(e => e.potwierdzenie)
					.HasColumnName("potwierdzenie")
					.HasColumnType("int(11)")
					.HasDefaultValueSql("'0'");

				entity.Property(e => e.sName)
					.HasColumnName("sName")
					.HasColumnType("varchar(255)");

				entity.Property(e => e.sPassword)
					.IsRequired()
					.HasColumnName("sPassword")
					.HasColumnType("varchar(255)");

				entity.Property(e => e.sPasswordSalt)
					.IsRequired()
					.HasColumnName("sPasswordSalt")
					.HasColumnType("varchar(10)");

				entity.Property(e => e.sSurname)
					.HasColumnName("sSurname")
					.HasColumnType("varchar(255)");

				entity.Property(e => e.sUserName)
					.IsRequired()
					.HasColumnName("sUserName")
					.HasColumnType("varchar(50)");
			});
		}
	}
}
