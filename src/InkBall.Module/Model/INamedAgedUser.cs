using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
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
		//[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
		bool DesktopNotifications { get; set; }

		bool ShowChatNotifications { get; set; }
	}

	[MessagePackObject(true)]
	public sealed class ApplicationUserSettings : IApplicationUserSettings, IDtoMsg
	{
		[PersonalData]
		//[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
		public bool DesktopNotifications { get; set; }

		public bool ShowChatNotifications { get; set; }

		public CommandKindEnum Kind
		{
			get { return CommandKindEnum.USER_SETTINGS; }
		}
	}

	public interface INamedAgedUser
	{
		/// <summary>
		// User name
		/// </summary>
		string Name { get; set; }

		/// <summary>
		// Various user settings
		/// </summary>	
		[PersonalData]
		[NotMapped]
		ApplicationUserSettings UserSettings { get; set; }

		/// <summary>
		// Various user settings as JSON
		/// </summary>	
		string UserSettingsJSON { get; set; }
	}
}
