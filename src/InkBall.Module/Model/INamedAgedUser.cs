using MessagePack;
using Microsoft.AspNetCore.Identity;

namespace InkBall.Module.Model
{

	/// <summary>
	// User settings bucket class
	/// </summary>
	public interface IApplicationUserSettings
	{
		[PersonalData]
		bool DesktopNotifications { get; set; }
	}

	[MessagePackObject(true)]
	public sealed class ApplicationUserSettings : IApplicationUserSettings, IDtoMsg
	{
		[PersonalData]
		public bool DesktopNotifications { get; set; }

		public CommandKindEnum GetKind()
		{
			return CommandKindEnum.USER_SETTINGS;
		}
	}

	public interface INamedAgedUser
	{
		/// <summary>
		// User name
		/// </summary>
		string Name { get; }

		/// <summary>
		// User age
		/// </summary>
		int Age { get; }

		/// <summary>
		// Various user settings
		/// </summary>	
		[PersonalData]
		IApplicationUserSettings UserSettings { get; set; }
	}
}
