using System.Runtime.Serialization.Formatters;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;

namespace InkBall.Module
{
	public static class SessionExtensions
	{
		static readonly JsonSerializerSettings _jsonSerializerSettings = new JsonSerializerSettings
		{
			TypeNameHandling = TypeNameHandling.All,
		};

		public static void Set<T>(this ISession session, string key, T value)
		{
			string str = JsonConvert.SerializeObject(value, _jsonSerializerSettings);

			session.SetString(key, str);
		}

		public static T Get<T>(this ISession session, string key)
		{
			var value = session.GetString(key);

			if (value == null)
			{
				return default(T);
			}
			else
			{
				var obj = JsonConvert.DeserializeObject<T>(value, _jsonSerializerSettings);
				return obj;
			}
		}
	}
}
