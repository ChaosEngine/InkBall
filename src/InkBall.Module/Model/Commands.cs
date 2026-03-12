using System.Collections.Generic;
using System;
using System.Text;
using System.Text.Json.Serialization;
using MessagePack;

namespace InkBall.Module.Model
{
	public enum CommandKindEnum
	{
		UNKNOWN = -1,
		PING = 0,
		POINT = 1,
		PATH = 2,
		PLAYER_JOINING = 3,
		PLAYER_SURRENDER = 4,
		WIN = 5,
		POINTS_AND_PATHS = 6,
		USER_SETTINGS = 7,
		STOP_AND_DRAW = 8
	}

	public interface IDtoMsg
	{
		CommandKindEnum Kind { get; }
	}

	[MessagePackObject(true)]
	public sealed class PingCommand : IDtoMsg
	{
		public string Message { get; set; }

		PingCommand()
		{ }

		public PingCommand(string message)
		{
			Message = message;
		}

		public PingCommand(PingCommand parent)
		{
			this.Message = parent.Message;
		}

		public CommandKindEnum Kind
		{
			get { return CommandKindEnum.PING; }
		}
	}

	[MessagePackObject(true)]
	public sealed partial class PlayerJoiningCommand : IDtoMsg
	{
		public int OtherPlayerId { get; private set; }

		public string OtherPlayerName { get; set; }

		public string Message { get; set; }

		public PlayerJoiningCommand(int otherPlayerId, string otherPlayerName, string message)
		{
			OtherPlayerId = otherPlayerId;
			OtherPlayerName = otherPlayerName;
			Message = message;
		}

		public CommandKindEnum Kind
		{
			get { return CommandKindEnum.PLAYER_JOINING; }
		}
	}

	[MessagePackObject(true)]
	public sealed partial class PlayerSurrenderingCommand : IDtoMsg
	{
		public int? OtherPlayerId { get; private set; }

		public bool ThisOrOtherPlayerSurrenders { get; private set; }

		public string Message { get; set; }

		public PlayerSurrenderingCommand(int? otherPlayerId, bool thisOrOtherPlayerSurrenders, string message)
		{
			OtherPlayerId = otherPlayerId;
			ThisOrOtherPlayerSurrenders = thisOrOtherPlayerSurrenders;
			Message = message;
		}

		public CommandKindEnum Kind
		{
			get { return CommandKindEnum.PLAYER_SURRENDER; }
		}
	}

	[MessagePackObject(true)]
	public sealed class WinCommand : IDtoMsg
	{
		public int WinningPlayerId { get; }

		public InkBallGame.WinStatusEnum Status { get; }

		public string Message { get; }

		public InkBallPathViewModel Path { get; set; }

		public WinCommand(InkBallGame.WinStatusEnum status, int winningPlayerId, string message)
		{
			this.Status = status;
			this.WinningPlayerId = winningPlayerId;
			this.Message = message;
		}

		public CommandKindEnum Kind
		{
			get { return CommandKindEnum.WIN; }
		}
	}

	[MessagePackObject(true)]
	public sealed class StopAndDrawCommand : IDtoMsg
	{
		public StopAndDrawCommand()
		{
		}

		public CommandKindEnum Kind
		{
			get { return CommandKindEnum.STOP_AND_DRAW; }
		}
	}

	[MessagePackObject(true)]
	public sealed class PlayerPointsAndPathsDTO : IDtoMsg
	{
		public string Points { get; }

		public string Paths { get; }

		public PlayerPointsAndPathsDTO()
		{
		}

		public PlayerPointsAndPathsDTO(IEnumerable<InkBallPoint> points, IEnumerable<InkBallPath> paths,
			InkBallPlayer thisPlayer)
		{
			this.Points = GetPointsAsJavaScriptArrayForSignalR(points, thisPlayer);
			this.Paths = GetPathsAsJavaScriptArrayForSignalR(paths);
		}

		[JsonIgnore]
		[IgnoreMember]
		public CommandKindEnum Kind
		{
			get { return CommandKindEnum.POINTS_AND_PATHS; }
		}


		/// <summary>
		/// Minimize amount of data transported on the wire through SignalR or on the page: status field
		/// </summary>
		/// <param name="status">int value of status</param>
		/// <returns>minimized integer</returns>
		internal static int DataMinimizerStatus(int status) => status + 3;

		/// <summary>
		/// Minimize amount of data transported on the wire through SignalR or on the page: player id field
		/// </summary>
		/// <param name="playerId"></param>
		/// <returns>minimized int status</returns>
		internal static int DataMinimizerPlayerId(int playerId, InkBallPlayer thisPlayer) =>
			playerId == thisPlayer.iId ? 1 : 0;

		internal static string GetPointsAsJavaScriptArrayForPage(
			IEnumerable<InkBallPoint> points, InkBallPlayer thisPlayer)
		{
			StringBuilder builder = new StringBuilder("[", 300);

			string comma = string.Empty;
			foreach (var p in points)
			{
#if DEBUG
				builder.AppendFormat("{4}[{0}/*x*/,{1}/*y*/,{2}/*val*/,{3}/*playerID*/]",
					p.iX, p.iY, DataMinimizerStatus((int)p.Status), DataMinimizerPlayerId(p.iPlayerId, thisPlayer), comma);
#else
				builder.AppendFormat("{4}[{0},{1},{2},{3}]",
					p.iX, p.iY, DataMinimizerStatus((int)p.Status), DataMinimizerPlayerId(p.iPlayerId, thisPlayer), comma);
#endif
				comma = ",\r";
			}
			builder.Append(']');

			return builder.ToString();
		}

		static string GetPointsAsJavaScriptArrayForSignalR(IEnumerable<CommonPoint> points, InkBallPlayer thisPlayer)
		{
			StringBuilder builder = new StringBuilder("[", 300);
			string comma = string.Empty;
			foreach (var p in points)
			{
				builder.AppendFormat("{4}[{0},{1},{2},{3}]",
					p.iX,
					p.iY,
					DataMinimizerStatus((int)p.Status),
					DataMinimizerPlayerId(p.iPlayerId, thisPlayer),
					comma);
				comma = ",";
			}
			builder.Append(']');

			return builder.ToString();
		}

		internal static string GetPathsAsJavaScriptArrayForPage(IEnumerable<InkBallPath> paths)
		{
			StringBuilder builder = new StringBuilder("[", 300);
			string comma = "";
			foreach (var path in paths)
			{
				builder.Append(comma).Append(path.PointsAsString);

				comma = ",\r";
			}
			builder.Append(']');

			return builder.ToString();
		}

		static string GetPathsAsJavaScriptArrayForSignalR(IEnumerable<InkBallPath> paths)
		{
			StringBuilder builder = new StringBuilder("[", 300);
			string comma = "";
			foreach (var path in paths)
			{
				builder.Append(comma).Append(path.PointsAsString);

				comma = ",";
			}
			builder.Append(']');

			return builder.ToString();
		}

	}

	[MessagePackObject(true)]
	public sealed class CpuMoveBatchRequest
	{
		public InkBallPointViewModel HumanPoint { get; set; }

		public InkBallPointViewModel CpuPoint { get; set; }

		public InkBallPathViewModel CpuPath { get; set; }
	}

	[MessagePackObject(true)]
	public sealed class CpuMoveBatchResponse
	{
		public DateTime? HumanPointTimeStamp { get; set; }

		public InkBallPointViewModel CpuPoint { get; set; }

		public InkBallPathViewModel CpuPath { get; set; }

		public WinCommand CpuWin { get; set; }

		public string CpuMoveError { get; set; } = null;
	}
}
