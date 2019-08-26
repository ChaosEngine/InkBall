namespace InkBall.Module.Model
{

	/// <summary>
	// User settings bucket class
	/// </summary>
	public interface IApplicationUserSettings
	{
		bool DesktopNotifications { get; set; }
	}

	public sealed class ApplicationUserSettings : IApplicationUserSettings
	{
		public bool DesktopNotifications { get; set; }
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
		IApplicationUserSettings UserSettings { get; set; }
	}
}
