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
		PLAYER_SURRENDER = 4
	}

	[MessagePackObject(true)]
	public sealed class PingCommand
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
	}

	/*[MessagePackObject(true)]
	public sealed class WaitForPlayerCommand
	{
		public bool ShowP2Name { get; private set; }

		public WaitForPlayerCommand() : this(false)
		{ }

		public WaitForPlayerCommand(bool showP2Name)
		{
			ShowP2Name = showP2Name;
		}
	}*/

	[MessagePackObject(true)]
	public sealed class PlayerJoiningCommand
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
	}

	[MessagePackObject(true)]
	public sealed class PlayerSurrenderingCommand
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
	}
}
