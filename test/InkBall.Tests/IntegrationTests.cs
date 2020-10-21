using InkBall.Module.Model;
using Microsoft.Net.Http.Headers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Xunit;

namespace IntegrationTests
{
	static class PostRequestHelper
	{
		public static string ExtractAntiForgeryToken(string htmlResponseText)
		{
			if (htmlResponseText == null) throw new ArgumentNullException("htmlResponseText");

			Match match = Regex.Match(htmlResponseText, @"\<input name=""__RequestVerificationToken"" type=""hidden"" value=""([^""]+)"" \/\>");
			return match.Success ? match.Groups[1].Captures[0].Value : null;
		}

		public static async Task<string> ExtractAntiForgeryToken(HttpResponseMessage response)
		{
			string responseAsString = await response.Content.ReadAsStringAsync();
			return await Task.FromResult(ExtractAntiForgeryToken(responseAsString));
		}

		/// <summary>
		/// Inspired from:
		/// https://github.com/aspnet/Mvc/blob/538cd9c19121f8d3171cbfddd5d842cbb756df3e/test/Microsoft.AspNet.Mvc.FunctionalTests/TempDataTest.cs#L201-L202
		/// </summary>
		/// <param name="response"></param>
		/// <returns></returns>
		public static IEnumerable<KeyValuePair<string, string>> ExtractCookiesFromResponse(HttpResponseMessage response)
		{
			if (response.Headers.TryGetValues("Set-Cookie", out IEnumerable<string> values))
			{
				var result = new KeyValuePair<string, string>[values.Count()];
				var cookie_jar = SetCookieHeaderValue.ParseList(values.ToList());
				int i = 0;
				foreach (var cookie in cookie_jar)
				{
					result[i] = new KeyValuePair<string, string>(cookie.Name.Value, cookie.Value.Value);
					i++;
				}
				return result;
			}
			else
				return new KeyValuePair<string, string>[0];
		}

		public static HttpRequestMessage PutCookiesOnRequest(HttpRequestMessage newHttpRequestMessage, IEnumerable<KeyValuePair<string, string>> cookies)
		{
			foreach (var kvp in cookies)
			{
				newHttpRequestMessage.Headers.Add("Cookie", new Microsoft.Net.Http.Headers.CookieHeaderValue(kvp.Key, kvp.Value).ToString());
			}

			return newHttpRequestMessage;
		}

		public static HttpRequestMessage CopyCookiesFromResponse(HttpRequestMessage newHttpRequestMessage, HttpResponseMessage getResponse)
		{
			return PutCookiesOnRequest(newHttpRequestMessage, ExtractCookiesFromResponse(getResponse));
		}

		public static HttpRequestMessage Create(string routePath, IEnumerable<KeyValuePair<string, string>> formPostBodyData)
		{
			var newHttpRequestMessage = new HttpRequestMessage(HttpMethod.Post, routePath)
			{
				Content = new FormUrlEncodedContent(formPostBodyData)
			};
			return newHttpRequestMessage;
		}

		public static HttpRequestMessage CreateHttpRequestMessageWithCookiesFromResponse(string routePath,
			IEnumerable<KeyValuePair<string, string>> formPostBodyData, HttpResponseMessage getResponse)
		{
			var newHttpRequestMessage = Create(routePath, formPostBodyData);
			return CopyCookiesFromResponse(newHttpRequestMessage, getResponse);
		}

		public static void CreateFormUrlEncodedContentWithCookiesFromResponse(HttpHeaders headers, HttpResponseMessage getResponse)
		{
			var cookies = ExtractCookiesFromResponse(getResponse);

			foreach (var kvp in cookies)
			{
				headers.Add("Cookie", new Microsoft.Net.Http.Headers.CookieHeaderValue(kvp.Key, kvp.Value).ToString());
			}
		}
	}

	[Collection(nameof(TestingServerCollection))]
	public class UnAuthenticated
	{
		private readonly TestServerFixture<TestingStartup> _fixture;
		private readonly HttpClient _client;

		public UnAuthenticated(TestServerFixture<TestingStartup> fixture)
		{
			_fixture = fixture;
			_client = fixture.Client;
		}

		[Theory]
		[InlineData("js/inkball.js")]
		[InlineData("js/inkballBundle.js")]
		[InlineData("js/svgvml.js")]
		[InlineData("js/svgvmlBundle.js")]
		[InlineData("js/concavemanBundle.js")]
		[InlineData("css/inkball.css")]
		[InlineData("img/homescreen.webp")]
		[InlineData("img/homescreen.jpg")]
		public async Task StaticAssets(string asset)
		{
			if (_fixture.DOTNET_RUNNING_IN_CONTAINER) return;//pass on fake DB with no data


			// Arrange
			// Act
			using (HttpResponseMessage response = await _client.GetAsync($"{_client.BaseAddress}{asset}"))
			{
				// Assert
				response.EnsureSuccessStatusCode();

				var responseString = await response.Content.ReadAsStringAsync();
				Assert.NotEmpty(responseString);
			}
		}

		[Theory]
		[InlineData("InkBall/Home", "<picture alt=\"home screen\" aria-label=\"home screen image\">")]
		[InlineData("InkBall/Rules", "<li>Player put dots on the grid one after another</li>")]
		public async Task Pages_Anonymous(string page, string contentToCheck)
		{
			if (_fixture.DOTNET_RUNNING_IN_CONTAINER) return;//pass on fake DB with no data


			// Arrange
			// Act
			using (HttpResponseMessage response = await _client.GetAsync($"/{page}"))
			{
				// Assert
				response.EnsureSuccessStatusCode();

				var responseString = await response.Content.ReadAsStringAsync();
				Assert.NotEmpty(responseString);
				Assert.Contains("<title>Inkball tests</title>", responseString);
				Assert.Contains(contentToCheck, responseString);
			}
		}

		[Theory]
		[InlineData("InkBall/Game")]
		[InlineData("InkBall/GamesList")]
		[InlineData("InkBall/Highscores")]
		[InlineData(InkBall.Module.Hubs.GameHub.HubName)]
		public async Task Pages_Unauthorized(string page)
		{
			if (_fixture.DOTNET_RUNNING_IN_CONTAINER) return;//pass on fake DB with no data

			// Arrange
			//Act
			using (var response = await _client.GetAsync($"{_client.BaseAddress}{page}"))
			{
				// Assert
				//Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
				Assert.Equal(HttpStatusCode.Redirect, response.StatusCode);
				Assert.Equal($"{_client.BaseAddress}Identity/Account/Login?ReturnUrl=%2F{UrlEncoder.Default.Encode(page)}",
					response.Headers.Location.ToString());
			}
		}
	}

	[Collection(nameof(TestingServerCollection))]
	public class Authenticated
	{
		private readonly TestServerFixture<TestingStartup> _fixture;
		private readonly HttpClient _client;

		public Authenticated(TestServerFixture<TestingStartup> fixture)
		{
			_fixture = fixture;
			_client = fixture.Client;
		}

		[Theory]
		[InlineData("InkBall/GamesList", "<div class='container inkgames'>")]
		[InlineData("InkBall/Highscores", "<div class=\"container inkstats\">")]
		[InlineData("InkBall/Home", "Alice Testing")]
		public async Task Pages_Authenticated(string page, string contentToCheck)
		{
			if (_fixture.DOTNET_RUNNING_IN_CONTAINER) return;//pass on fake DB with no data


			// Arrange
			var client = await _fixture.CreateAuthenticatedClientAsync();

			using (var request = new HttpRequestMessage(HttpMethod.Get, $"{client.BaseAddress}{page}"))
			{
				//request.Headers.Authorization = new AuthenticationHeaderValue("Test",
				//	JsonSerializer.Serialize(new InkBallUser { iId = 1, UserName = "Test user1", sExternalId = "1" })
				//);

				//Act
				using (var response = await client.SendAsync(request))
				{
					// Assert
					Assert.Equal(HttpStatusCode.OK, response.StatusCode);
					var responseString = await response.Content.ReadAsStringAsync();
					Assert.Contains(contentToCheck, responseString, StringComparison.InvariantCultureIgnoreCase);
				}
			}
		}

		[Fact]
		public async Task SignalR_Hub_GET_Authenticated()
		{
			if (_fixture.DOTNET_RUNNING_IN_CONTAINER) return;//pass on fake DB with no data


			// Arrange
			var client = await _fixture.CreateAuthenticatedClientAsync();


			string hub_name = InkBall.Module.Hubs.GameHub.HubName;
			using (var request = new HttpRequestMessage(HttpMethod.Get, $"{_client.BaseAddress}{hub_name}"))
			{
				//request.Headers.Authorization = new AuthenticationHeaderValue("Test");

				//Act
				using (var response = await client.SendAsync(request))
				{
					// Assert
					Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
					var responseString = await response.Content.ReadAsStringAsync();
					Assert.Equal("Connection ID required", responseString);
				}
			}
		}

		[Fact]
		public async Task Index_Authenticated_NoGame()
		{
			if (_fixture.DOTNET_RUNNING_IN_CONTAINER) return;//pass on fake DB with no data


			// Arrange
			var client = await _fixture.CreateAuthenticatedClientAsync();

			using (var request = new HttpRequestMessage(HttpMethod.Get, $"{_client.BaseAddress}InkBall/Game"))
			{
				//request.Headers.Authorization = new AuthenticationHeaderValue("Test",
				//	JsonSerializer.Serialize(new InkBallUser { iId = 1, UserName = "Test user1", sExternalId = "1" })
				//);

				//Act
				using (var response = await client.SendAsync(request))
				{
					// Assert
					Assert.Equal(HttpStatusCode.OK, response.StatusCode);
					Assert.Equal($"{_client.BaseAddress}InkBall/Home", response.RequestMessage.RequestUri.ToString());
					var responseString = await response.Content.ReadAsStringAsync();
					Assert.Contains("No active game for you", responseString);
				}
			}
		}

		[Fact]
		public async Task Home_Authenticated_CreateGame()
		{
			if (_fixture.DOTNET_RUNNING_IN_CONTAINER) return;//pass on fake DB with no data



			//not logged in
			// Arrange
			using (var get_response = await _client.GetAsync($"{_fixture.AppRootPath}InkBall/Home", HttpCompletionOption.ResponseContentRead))
			{
				// Assert
				get_response.EnsureSuccessStatusCode();
				var antiforgery_token = await PostRequestHelper.ExtractAntiForgeryToken(get_response);

				// Arrange
				var data = new Dictionary<string, string> {
					{ "action", "New game" }, { "gameType", "FIRST_CAPTURE"}, { "boardSize", "20" }, { "cpuOponent", "off" },
					{ "__RequestVerificationToken", antiforgery_token }
				}.ToList();

				using (var formPostBodyData = new FormUrlEncodedContent(data))
				{
					PostRequestHelper.CreateFormUrlEncodedContentWithCookiesFromResponse(formPostBodyData.Headers, get_response);
					using (var response = await _client.PostAsync($"{_fixture.AppRootPath}InkBall/Home", formPostBodyData))
					{
						Assert.NotNull(response);
						response.EnsureSuccessStatusCode();

						var responseString = await response.Content.ReadAsStringAsync();
						Assert.Contains("You are not logged in", responseString);
					}
				}
			}//end using get_response


			//logged in
			// Arrange
			var client = await _fixture.CreateAuthenticatedClientAsync();

			using (var request = new HttpRequestMessage(HttpMethod.Get, $"{client.BaseAddress}InkBall/Home"))
			{
				//request.Headers.Authorization = new AuthenticationHeaderValue("Test",
				//	JsonSerializer.Serialize(new InkBallUser { iId = 1, UserName = "Test user1", sExternalId = "1" })
				//);

				// Act
				using (var get_response = await client.SendAsync(request, HttpCompletionOption.ResponseContentRead))
				{
					//Assert
					get_response.EnsureSuccessStatusCode();
					var antiforgery_token = await PostRequestHelper.ExtractAntiForgeryToken(get_response);

					// Arrange
					var data = new Dictionary<string, string> {
						{ "__RequestVerificationToken", antiforgery_token },
						{ "action", "New game" }, { "gameType", "FIRST_CAPTURE"}, { "boardSize", "20" }, { "cpuOponent", "off" },
					}.ToList();

					//data.Add(new KeyValuePair<string, string>(nameof(HttpRequestHeader.Authorization),
					//	request.Headers.Authorization.ToString()));
					using (var formPostBodyData = new FormUrlEncodedContent(data))
					{
						PostRequestHelper.CreateFormUrlEncodedContentWithCookiesFromResponse(formPostBodyData.Headers, get_response);
						// Act
						using (var response = await client.PostAsync($"{client.BaseAddress}InkBall/Home", formPostBodyData))
						{
							// Assert
							Assert.NotNull(response);
							response.EnsureSuccessStatusCode();

							var responseString = await response.Content.ReadAsStringAsync();
							Assert.DoesNotContain("You are not logged in", responseString);
							Assert.Contains("This is Inball Game page", responseString);
						}
					}
				}//end using (var get_response
			}//end using request
		}

		[Theory]
		[InlineData("alice.testing@example.org", "#SecurePassword123")]
		public async Task NewAuth(string email, string password)
		{
			if (_fixture.DOTNET_RUNNING_IN_CONTAINER) return;//pass on fake DB with no data


			// Arrange
			var client = await _fixture.CreateAuthenticatedClientAsync(email, password);

			// Act
			HttpResponseMessage response = await client.GetAsync($"{client.BaseAddress}InkBall/Home");

			// Assert
			Assert.Equal(HttpStatusCode.OK, response.StatusCode);
			var responseString = await response.Content.ReadAsStringAsync();
			Assert.Contains("Alice Testing", responseString);
		}
	}
}
