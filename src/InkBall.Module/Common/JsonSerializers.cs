using InkBall.Module.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace InkBall.Module
{
	[JsonSerializable(typeof(IApplicationUserSettings))]
	public partial class IApplicationUserSettingsContext : JsonSerializerContext
	{
	}
}
