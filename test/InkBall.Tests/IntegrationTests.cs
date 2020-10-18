using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Xunit;

namespace InkBall.Tests
{
	[Collection(nameof(TestingServerCollection))]
	public class IntegrationTests
	{
		private readonly TestServerFixture<TestingStartup> _fixture;
		private readonly HttpClient _client;

		public IntegrationTests(TestServerFixture<TestingStartup> fixture)
		{
			_fixture = fixture;
			_client = fixture.Client;
		}

		#region UnAuthenticated / Anonymous

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
		public async Task Index_Pages_Anonymous(string page, string contentToCheck)
		{
			if (_fixture.DOTNET_RUNNING_IN_CONTAINER) return;//pass on fake DB with no data


			// Arrange
			// Act
			using (HttpResponseMessage response = await _client.GetAsync($"{_client.BaseAddress}{page}"))
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
		[InlineData("InkBall/Index")]
		[InlineData("InkBall/Games")]
		[InlineData("InkBall/Highscores")]
		[InlineData(InkBall.Module.Hubs.GameHub.HubName)]
		public async Task Index_Pages_Unauthorized(string page)
		{
			if (_fixture.DOTNET_RUNNING_IN_CONTAINER) return;//pass on fake DB with no data

			// Arrange
			//Act
			using (var response = await _client.GetAsync($"{_client.BaseAddress}{page}"))
			{
				// Assert
				Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
				//Assert.Equal($"{_client.BaseAddress}Account/Login?ReturnUrl=%2FInkball%2FGames", response.Headers.Location.ToString());
			}
		}

		#endregion UnAuthenticated / Anonymous

		#region Authenticated / Signed-in

		[Theory]
		[InlineData("InkBall/Games", "<div class='container inkgames'>")]
		[InlineData("InkBall/Highscores", "<div class=\"container inkstats\">")]
		public async Task Index_Pages_Authenticated(string page, string contentToCheck)
		{
			if (_fixture.DOTNET_RUNNING_IN_CONTAINER) return;//pass on fake DB with no data


			// Arrange
			using (var request = new HttpRequestMessage(HttpMethod.Get, $"{_client.BaseAddress}{page}"))
			{
				request.Headers.Authorization = new AuthenticationHeaderValue("Test");

				//Act
				using (var response = await _client.SendAsync(request))
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
			string hub_name = InkBall.Module.Hubs.GameHub.HubName;
			using (var request = new HttpRequestMessage(HttpMethod.Get, $"{_client.BaseAddress}{hub_name}"))
			{
				request.Headers.Authorization = new AuthenticationHeaderValue("Test");

				using (var response = await _client.SendAsync(request))
				{
					// Assert
					Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
					var responseString = await response.Content.ReadAsStringAsync();
					Assert.Equal("Connection ID required", responseString);
				}
			}
		}

		#endregion Authenticated / Signed-in
	}
}
