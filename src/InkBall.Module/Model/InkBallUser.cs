using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;

namespace InkBall.Module
{
	public interface IUser<P> where P : IPlayer
	{
		int iId { get; set; }
		int iPrivileges { get; set; }
		string sExternalId { get; set; }

		ICollection<P> InkBallPlayer { get; set; }
	}

	public partial class InkBallUser : IUser<InkBallPlayer>
	{
		public InkBallUser()
		{
			InkBallPlayer = new HashSet<InkBallPlayer>();
		}

		public int iId { get; set; }
		public int iPrivileges { get; set; }
		public string sExternalId { get; set; }

		public ICollection<InkBallPlayer> InkBallPlayer { get; set; }
	}

	[Serializable]
	public sealed class InkBallUserViewModel : IUser<InkBallPlayerViewModel>
	{
		public int iId { get; set; }
		public int iPrivileges { get; set; }
		public string sExternalId { get; set; }
		public ICollection<InkBallPlayerViewModel> InkBallPlayer { get; set; }

		public InkBallUserViewModel()
		{
		}

		public InkBallUserViewModel(InkBallUser user)
		{
			iId = user.iId;
			iPrivileges = user.iPrivileges;
			sExternalId = user.sExternalId;

			if (user.InkBallPlayer != null && user.InkBallPlayer.Count > 0)
			{
				InkBallPlayer = user.InkBallPlayer.Select(p => new InkBallPlayerViewModel(p)).ToArray();
			}
		}

		// [JsonConstructor]
		public InkBallUserViewModel(InkBallUserViewModel user)
		{
			iId = user.iId;
			iPrivileges = user.iPrivileges;
			sExternalId = user.sExternalId;

			if (user.InkBallPlayer != null && user.InkBallPlayer.Count > 0)
			{
				InkBallPlayer = user.InkBallPlayer;
			}
		}
	}
}
