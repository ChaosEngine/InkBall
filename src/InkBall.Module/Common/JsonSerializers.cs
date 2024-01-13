using InkBall.Module.Model;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace InkBall.Module
{
	[JsonSerializable(typeof(ApplicationUserSettings))]
	public partial class ApplicationUserSettings_Context : JsonSerializerContext { }

	[JsonSerializable(typeof(InkBallPointViewModel.ThinSerializedPoint))]
	internal partial class ThinSerializedPoint_Context : JsonSerializerContext { }

	[JsonSerializable(typeof(InkBallPathViewModel.ThinSerializedPath))]
    internal partial class ThinSerializedPath_Context : JsonSerializerContext { }

	[JsonSourceGenerationOptions(DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingDefault)]
	[JsonSerializable(typeof(InkBallPathViewModel))]
	public partial class InkBallPathViewModel_Context : JsonSerializerContext { }
}
