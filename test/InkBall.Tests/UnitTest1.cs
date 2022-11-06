using InkBall.Module.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Xunit;

namespace InkBall.Tests
{
	public class UnitTest1
	{
		public class PathValidationTheoryData : TheoryData<ValueTuple<(int, int)[], string, (int, int)[]>>
		{
			public PathValidationTheoryData(IEnumerable<ValueTuple<(int, int)[], string, (int, int)[]>> data)
			{
				foreach (ValueTuple<(int, int)[], string, (int, int)[]> t1 in data)
				{
					Add(t1);
				}
			}
		}

		[Fact]
		public void GameHierarchyCreation()
		{
			//Arrange
			var game = new InkBallGame
			{
				iId = 1,
				CreateTime = DateTime.UtcNow,
				GameState = InkBallGame.GameStateEnum.AWAITING,
				Player1 = new InkBallPlayer
				{
					iId = 1,
					sLastMoveCode = "{}",
					User = new InkBallUser
					{
						iId = 1,
						UserName = "test",
						iPrivileges = 0,
						sExternalId = "xxxxx",
					}
				}
			};
			var point = new InkBallPoint
			{
				iId = 1,
				iX = 1,
				iY = 1,
				iGameId = game.iId,
				Status = InkBallPoint.StatusEnum.POINT_FREE_BLUE,
				iEnclosingPathId = null,
				iPlayerId = 1
			};

			//Act
			var p1 = game.GetPlayer1();

			//Assert
			Assert.NotNull(p1);
		}

		[Theory]
		[InlineData(new[] { 1, 1 }, "1,1")]
		[InlineData(new[] { 2, 2 }, "2,2")]
		[InlineData(new[] { 123, 456 }, "123,456")]
		void PointSerialization(int[] pointsTab, string expectedCoords)
		{
			//Arrange
			var point = new InkBallPoint
			{
				iId = 1,
				iX = pointsTab[0],
				iY = pointsTab[1],
				iGameId = -1,
				Status = InkBallPoint.StatusEnum.POINT_FREE_BLUE,
				iEnclosingPathId = null,
				iPlayerId = 1
			};

			//Act
			var str = point.ToString();

			//Assert
			Assert.Equal($"{pointsTab[0]},{pointsTab[1]}", expectedCoords);
		}

		[Theory]
		[InlineData(typeof(InkBallPoint), new[] { 1, 1 }, "1,1")]
		[InlineData(typeof(InkBallPoint), new[] { 2, 2 }, "2,2")]
		[InlineData(typeof(InkBallPoint), new[] { 123, 456 }, "123,456")]
		[InlineData(typeof(InkBallPath), new[] { 123, 456 }, "123,456")]
		void NoEmptyNullDummyFieldSerialization(Type type, int[] pointsTab, string expectedCoords)
		{
			if (type.IsAssignableFrom(typeof(InkBallPoint)))
			{
				//Arrange
				var db = new InkBallPoint
				{
					iId = 1,
					iX = pointsTab[0],
					iY = pointsTab[1],
					iGameId = -1,
					Status = InkBallPoint.StatusEnum.POINT_FREE_BLUE,
					iEnclosingPathId = null,
					iPlayerId = 1
				};

				//Act
				var str = db.ToString();
				//Assert
				Assert.Equal($"{pointsTab[0]},{pointsTab[1]}", expectedCoords);
				//Act
				string serialized = System.Text.Json.JsonSerializer.Serialize(db, new JsonSerializerOptions { DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull });
				//Assert
				Assert.DoesNotContain(nameof(InkBallPathViewModel.TimeStamp), serialized);
				Assert.DoesNotContain(nameof(InkBallPathViewModel.InkBallPoint), serialized);
				Assert.DoesNotContain(nameof(InkBallPathViewModel.BelongsToCPU), serialized);


				//Arrange
				var view = new InkBallPointViewModel
				{
					iId = 1,
					iX = pointsTab[0],
					iY = pointsTab[1],
					iGameId = -1,
					Status = InkBallPoint.StatusEnum.POINT_FREE_BLUE,
					iEnclosingPathId = null,
					iPlayerId = 1
				};
				//Act
				serialized = System.Text.Json.JsonSerializer.Serialize(db, new JsonSerializerOptions { DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull });
				//Assert
				Assert.DoesNotContain(nameof(InkBallPathViewModel.TimeStamp), serialized);
				Assert.DoesNotContain(nameof(InkBallPathViewModel.InkBallPoint), serialized);
				Assert.DoesNotContain(nameof(InkBallPathViewModel.BelongsToCPU), serialized);
			}
			else if (type.IsAssignableFrom(typeof(InkBallPath)))
			{
				//Arrange
				var db = new InkBallPath
				{
					iId = 1,
					iGameId = -1,
					iPlayerId = 1,
					InkBallPoint = new[] { new InkBallPoint { iX = pointsTab[0], iY = pointsTab[1], iGameId = 1, iPlayerId = 1,
						Status = InkBallPoint.StatusEnum.POINT_FREE_BLUE } },
					PointsAsString = expectedCoords
				};

				//Act
				var str = db.ToString();
				string serialized = System.Text.Json.JsonSerializer.Serialize(db, new JsonSerializerOptions { DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull });
				//Assert
				Assert.NotNull(str);
				Assert.DoesNotContain(nameof(InkBallPathViewModel.TimeStamp), serialized);
				Assert.Contains(nameof(InkBallPathViewModel.InkBallPoint), serialized);
				Assert.DoesNotContain(nameof(InkBallPathViewModel.BelongsToCPU), serialized);



				//Arrange
				var view = new InkBallPathViewModel
				{
					iId = 1,
					iGameId = -1,
					iPlayerId = 1,
					InkBallPoint = new[] { new InkBallPointViewModel { iX = pointsTab[0], iY = pointsTab[1], iGameId = 1, iPlayerId = 1,
						Status = InkBallPoint.StatusEnum.POINT_FREE_BLUE , iEnclosingPathId = null, TimeStamp = null, iId = 1 } },
					PointsAsString = expectedCoords,
				};
				//Act
				serialized = System.Text.Json.JsonSerializer.Serialize(view, new JsonSerializerOptions { DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull });
				//Assert
				Assert.DoesNotContain(nameof(InkBallPathViewModel.BelongsToCPU), serialized);
				Assert.DoesNotContain(nameof(InkBallPathViewModel.TimeStamp), serialized);
				Assert.DoesNotContain(nameof(InkBallPathViewModel.InkBallPoint), serialized);

				view = new InkBallPathViewModel
				{
					iId = 1,
					iGameId = -1,
					iPlayerId = 1,
					InkBallPoint = new[] { new InkBallPointViewModel { iX = pointsTab[0], iY = pointsTab[1], iGameId = 1, iPlayerId = 1,
						Status = InkBallPoint.StatusEnum.POINT_FREE_BLUE , iEnclosingPathId = null,
					} },
					PointsAsString = expectedCoords,
					TimeStamp = DateTime.Now////////NOT NULL!!
				};
				//Act
				serialized = System.Text.Json.JsonSerializer.Serialize(view, new JsonSerializerOptions { DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull });
				//Assert
				Assert.DoesNotContain(nameof(InkBallPathViewModel.BelongsToCPU), serialized);
				Assert.Contains(nameof(InkBallPathViewModel.TimeStamp), serialized);
				Assert.DoesNotContain(nameof(InkBallPathViewModel.InkBallPoint), serialized);
			}
			else
				Assert.True(false, "unknown type");
		}

		/**
		* //path A
		* 0 1 2 3 4 5 6
		* 1 x x x
		* 2 x o x
		* 3 x o x
		* 4 x x x
		* 5
		*
		* //path B
		* 0 1 2 3 4 5 6
		* 1 x x x x
		* 2 x o o x
		* 3 x x x x
		* 4 
		* 5
		 */
		public static PathValidationTheoryData CorrectPathAndOwnedPointsData => new PathValidationTheoryData(new ValueTuple<(int, int)[], string, (int, int)[]>[]
		{
			//path A
			new ValueTuple<(int, int)[], string,(int, int)[]>(new[]{(1,1),(1,2),(1,3),(1,4),(2,4),(3,4),(3,3),(3,2),(3,1),(2,1),(1,1)},"1,1 1,2 1,3 1,4 2,4 3,4 3,3 3,2 3,1 2,1 1,1",new[]{(2,2),(2,3)}),
			//path B
			new ValueTuple<(int, int)[], string,(int, int)[]>(new[]{(1,1),(2,1),(3,1),(4,1),(4,2),(4,3),(3,3),(2,3),(1,3),(1,2),(1,1)},"1,1 2,1 3,1 4,1 4,2 4,3 3,3 2,3 1,3 1,2 1,1",new[]{(2,2),(3,2)}),
			//others
			new ValueTuple<(int, int)[], string,(int, int)[]>(new[]{(10,14),(11,14),(12,15),(11,16),(10,16),(9,15),(10,14)},"10,14 11,14 12,15 11,16 10,16 9,15 10,14",new[]{(10,15),(11,15)}),
			new ValueTuple<(int, int)[], string,(int, int)[]>(new[]{(10,4),(9,5),(9,6),(10,7),(11,6),(11,5),(10,4)},"10,4 9,5 9,6 10,7 11,6 11,5 10,4",new[]{(10,5),(10,6)}),
		});
		public static PathValidationTheoryData IncorrectPathAndOwnedPointsData => new PathValidationTheoryData(new ValueTuple<(int, int)[], string, (int, int)[]>[]
		{
			new ValueTuple<(int, int)[], string,(int, int)[]>(new[]{(1,1),(1,2),(1,5)},"1,1 1,2 1,5",new[]{(1,2)}),
			new ValueTuple<(int, int)[], string,(int, int)[]>(new[]{(1,1),(3,1)},"1,1 3,1",new[]{(1,2)}),
			new ValueTuple<(int, int)[], string,(int, int)[]>(new[]{(1,1),(1,2),(1,3),(1,8)},"1,1 1,2 1,3 1,8",new[]{(1,2)}),
			new ValueTuple<(int, int)[], string,(int, int)[]>(new[]{(1,1),(2,1),(3,1),(4,1)},"1,1 2,1 3,1 4,1",new[]{(1,2)}),
			new ValueTuple<(int, int)[], string,(int, int)[]>(new[]{(-1,13),(332,51),(34,1)},"blablabla",new[]{(1,2)}),
			new ValueTuple<(int, int)[], string,(int, int)[]>(new[]{(-1,13),(332,51),(34,1)},"blablabla 43 ddfg rgfd",new[]{(1,2)}),
			new ValueTuple<(int, int)[], string,(int, int)[]>(new[]{(1,1),(2,1),(3,1),(4,1),(4,2),(4,3),(3,3),(2,3),(1,3),(1,2),(1,1)},"1,1 2,1 3,1 4,1 4,2 4,3 <script>alert(1)</script> 3,3 2,3 1,3 1,2 1,1",new[]{(4,2)}),
			new ValueTuple<(int, int)[], string,(int, int)[]>(new[]{(10,4),(9,5),(9,6),(10,7),(11,6),(11,5),(10,4)},"10,4 9,5 9,6 10,7 11,6 11,5 10,4a",new[]{(10,5),(10,6)}),
		});
		public static PathValidationTheoryData BadOwnedPointsData => new PathValidationTheoryData(new ValueTuple<(int, int)[], string, (int, int)[]>[]
		{
			new ValueTuple<(int, int)[], string,(int, int)[]>(new[]{(1,1),(1,2),(1,3),(1,4),(2,4),(3,4),(3,3),(3,2),(3,1),(2,1),(1,1)},"1,1 1,2 1,3 1,4 2,4 3,4 3,3 3,2 3,1 2,1 1,1",new[]{(26,26)}),
			new ValueTuple<(int, int)[], string,(int, int)[]>(new[]{(1,1),(2,1),(3,1),(4,1),(4,2),(4,3),(3,3),(2,3),(1,3),(1,2),(1,1)},"1,1 2,1 3,1 4,1 4,2 4,3 3,3 2,3 1,3 1,2 1,1",new[]{(8,8)}),
			new ValueTuple<(int, int)[], string,(int, int)[]>(new[]{(1,1),(2,1),(3,1),(4,1),(4,2),(4,3),(3,3),(2,3),(1,3),(1,2),(1,1)},"1,1 2,1 3,1 4,1 4,2 4,3 3,3 2,3 1,3 1,2 1,1",new[]{(1,1)}),
			new ValueTuple<(int, int)[], string,(int, int)[]>(new[]{(1,1),(2,1),(3,1),(4,1),(4,2),(4,3),(3,3),(2,3),(1,3),(1,2),(1,1)},"1,1 2,1 3,1 4,1 4,2 4,3 3,3 2,3 1,3 1,2 1,1",new[]{(4,2)}),
		});

		[Theory]
		[MemberData(nameof(CorrectPathAndOwnedPointsData))]
		void CorrectPathValidation(((int x, int y)[] coords, string expectedCoords, (int x, int y)[] ownedPoints) parameters)
		{
			//Arrange
			string expectedCoords = parameters.expectedCoords;
			var path = new InkBallPathViewModel
			{
				PointsAsString = expectedCoords
			};

			//Act
			int len = parameters.coords.Length;
			for (int i = 0; i < len; i++)
			{
				Assert.IsType<(int x, int y)>(parameters.coords[i]);
				(int x, int y) coords = ((int, int))parameters.coords[i];

				var ponit2verify = path.InkBallPoint.ElementAtOrDefault(i);
				//Assert
				Assert.NotNull(ponit2verify);

				Assert.Equal(ponit2verify.iX, coords.x);
				Assert.Equal(ponit2verify.iY, coords.y);
			}
		}

		[Theory]
		[MemberData(nameof(IncorrectPathAndOwnedPointsData))]
		void IncorrectPathValidation(((int x, int y)[] coords, string expectedCoords, (int x, int y)[] ownedPoints) parameters)
		{
			//Arrange
			string expectedCoords = parameters.expectedCoords;

			//Act
			var path = new InkBallPathViewModel
			{
				PointsAsString = expectedCoords
			};

			//Assert
			Assert.ThrowsAny<Exception>(() =>
			{
				var path_points = path.InkBallPoint;
			});
		}

		[Theory]
		[MemberData(nameof(CorrectPathAndOwnedPointsData))]
		void CorrectPointOwning(((int x, int y)[] coords, string expectedCoords, (int x, int y)[] ownedPoints) parameters)
		{
			//Arrange
			string expectedCoords = parameters.expectedCoords;
			var path = new InkBallPathViewModel
			{
				PointsAsString = expectedCoords
			};

			//Act
			var path_points = path.InkBallPoint;

			//Assert
			foreach (var owned in parameters.ownedPoints)
			{
				var owned_point = new InkBallPointViewModel
				{
					iX = owned.x,
					iY = owned.y
				};
				bool inside = path.IsPointInsidePath(owned_point);
				Assert.True(inside);
			}
		}

		[Theory]
		[MemberData(nameof(BadOwnedPointsData))]
		void IncorrectPointOwning(((int x, int y)[] coords, string expectedCoords, (int x, int y)[] ownedPoints) parameters)
		{
			//Arrange
			string expectedCoords = parameters.expectedCoords;
			var path = new InkBallPathViewModel
			{
				PointsAsString = expectedCoords
			};

			//Act
			var path_points = path.InkBallPoint;

			//Assert
			foreach (var owned in parameters.ownedPoints)
			{
				var owned_point = new InkBallPointViewModel
				{
					iX = owned.x,
					iY = owned.y
				};
				bool inside = path.IsPointInsidePath(owned_point);
				Assert.False(inside);
			}
		}

		[Theory]
		[MemberData(nameof(CorrectPathAndOwnedPointsData))]
		void AllPossibleOwningScenarios(((int x, int y)[] coords, string expectedCoords, (int x, int y)[] ownedPoints) parameters)
		{
			string expectedCoords = parameters.expectedCoords;
			var path = new InkBallPathViewModel
			{
				PointsAsString = expectedCoords
			};

			//for (int y = 0; y < 3000; y++)
			Parallel.For(0, 30, (y) =>
			{
				for (int x = 0; x < 30; x++)
				{
					var point_to_test = new InkBallPointViewModel
					{
						iX = x,
						iY = y,
						Status = InkBallPoint.StatusEnum.POINT_IN_PATH
					};
					if (parameters.ownedPoints.Contains((x, y)))
					{
						Assert.True(path.IsPointInsidePath(point_to_test));
					}
					else
					{
						Assert.False(path.IsPointInsidePath(point_to_test));
					}
				}
			});

		}
	}
}
