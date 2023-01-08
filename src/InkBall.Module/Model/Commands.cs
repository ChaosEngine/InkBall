using System.Collections.Generic;
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
	public sealed class PlayerJoiningCommand : IDtoMsg
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
	public sealed class PlayerSurrenderingCommand : IDtoMsg
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

		public PlayerPointsAndPathsDTO(string points, string paths)
		{
			this.Points = points;
			this.Paths = paths;
		}

		public CommandKindEnum Kind
		{
			get { return CommandKindEnum.POINTS_AND_PATHS; }
		}
	}
}
