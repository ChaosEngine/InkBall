import { GraphAI, concaveman, ArePointsContinuous/* , LerpMissingPoints  */ } from "./AISource.js";
// import { SvgVml, StatusEnum, LocalLog, LocalError, sortPointsClockwise, pnpoly, IsPointOutsideAllPaths } from "./shared.js";
import { astar, Graph as AStarGraph } from "javascript-astar";
import * as clustering from "density-clustering";

//globals loaded only once hopefully
let SvgVml, StatusEnum, LocalLog, LocalError, LocalWarning, sortPointsClockwise, pnpoly, IsPointOutsideAllPaths;

// This is the entry point for our worker
addEventListener('message', async function (e) {

	if (SvgVml === undefined) {
		const isMinified = location.hostname !== "localhost";

		({ SvgVml, StatusEnum, LocalLog, LocalError, LocalWarning, sortPointsClockwise, pnpoly, IsPointOutsideAllPaths } = await import(/* webpackIgnore: true */`./shared${isMinified ? '.min' : ''}.js`));
	}


	const params = e.data;

	switch (params.operation) {
		case "BUILD_GRAPH":
			{
				const svgVml = new SvgVml();
				svgVml.Init(null, null, null, params.boardSize);

				//debugger;
				const lines = params.paths.map(pa => svgVml.DeserializePolyline(pa));
				const points = new Map();
				params.points.forEach((pt) => {
					points.set(pt.key, svgVml.DeserializeOval(pt.value));
				});

				LocalLog(`lines.count = ${lines.length}, points.count = ${points.size}`);

				const ai = new GraphAI(params.state.iGridWidth, params.state.iGridHeight, points);
				const graph = await ai.BuildGraph({
					freePointStatus: StatusEnum.POINT_FREE_BLUE,
					// cpufillCol: 'var(--bluish)', 
					visuals: false
				});
				//LocalLog(graph);

				postMessage({ operation: params.operation, params: graph });
			}
			break;

		case "CONCAVEMAN":
			{
				switch (params.subOperation) {
					case "BY_POINTS":
						{
							const svgVml = new SvgVml();
							svgVml.Init(null, null, null, params.boardSize);

							const points = new Map();
							params.points.forEach((pt) => {
								points.set(pt.key, svgVml.DeserializeOval(pt.value));
							});
							const ai = new GraphAI(params.boardSize.iGridWidth, params.boardSize.iGridHeight, points);
							const clicked_status = params.clickedPointStatus;
							const graph = await ai.BuildGraph({
								freePointStatus: clicked_status,
								// cpufillCol: clicked_status === StatusEnum.POINT_FREE_RED ? 'var(--redish)' : 'var(--bluish)',
								visuals: false
							});
							const vertices = graph.vertices.map(function (pt) {
								const { x, y } = pt.GetPosition();
								return [x, y];
							});

							let convex_hull = null, cw_sorted_verts;
							if (vertices.length > 0) {
								convex_hull = concaveman(vertices, params.concavity ?? 2.0, params.lengthThreshold ?? 0.0);

								const mapped_verts = convex_hull.map(([x, y]) => ({ x, y }));
								cw_sorted_verts = sortPointsClockwise(mapped_verts);
							}

							postMessage({ operation: params.operation, convex_hull, cw_sorted_verts });
						}
						break;
					case "BY_COORDS":
						{
							const { concavity, lengthThreshold, points: vertices, humanPoints, iGridHeight, iGridWidth } = params;

							let convex_hull = null;
							if (vertices.length > 0) {
								convex_hull = concaveman(vertices, concavity ?? 2.0, lengthThreshold ?? 0.0);
								const continuous_result = ArePointsContinuous(convex_hull);
								if (!continuous_result.result) {
									LocalWarning(`Concaveman result is not continuous, please check your input points. offenderIndex: ${continuous_result.offenderIndex}, offender: ${continuous_result.offender}`);


									const prev = convex_hull.at(continuous_result.offenderIndex - 1);
									const curr = convex_hull.at(continuous_result.offenderIndex);

									// Use lerpMissingPoints to interpolate missing points from prev to curr
									// const missing = LerpMissingPoints(prev, curr, (x, y) => {
									// 	return !humanPoints.find(pt => pt[0] === x && pt[1] === y);
									// });

									// Initialize arr with 1s
									const arr = Array.from({ length: iGridHeight + 1 }, () => Array(iGridWidth + 1).fill(1));

									// Mark human points as not accessible, inverted x,y coords -> y,x
									for (const [x, y] of humanPoints) arr[y][x] = 0;
									// Mark convex hull points as ready to travel
									// for (const [x, y] of convex_hull) arr[y][x] = 1;

									//Call ASTAR to find missing points between prev and curr
									const missing = AstarPathFind(arr, prev[1]/*y*/, prev[0]/*x*/, curr[1]/*y*/, curr[0]/*x*/)
										.map(({ x, y }) => [x, y]);

									convex_hull = convex_hull.slice(0, continuous_result.offenderIndex)
										.concat(missing)
										.concat(convex_hull.slice(continuous_result.offenderIndex + 1));

									LocalLog(`Concaveman result fixed by adding ${missing.length} points between ${prev} and ${curr}, missing: ${missing.map(pt => pt.join(",")).join(" ")}`);
								}
							}

							postMessage({ operation: params.operation, convex_hull });
						}
						break;
					default:
						throw new Error(`unknown params.subOperation = ${params.subOperation}`);
				}
			}
			break;

		case "MARK_ALL_CYCLES":
			{
				const svgVml = new SvgVml();
				svgVml.Init(null, null, null, params.boardSize);

				const lines = params.paths.map(pa => svgVml.DeserializePolyline(pa));
				const points = new Map();
				params.points.forEach((pt) => {
					points.set(pt.key, svgVml.DeserializeOval(pt.value));
				});
				const ai = new GraphAI(params.state.iGridWidth, params.state.iGridHeight, points);
				const graph = await ai.BuildGraph({
					freePointStatus: StatusEnum.POINT_FREE_BLUE,
					// cpufillCol: params.colorBlue,
					visuals: false
				});
				const result = await ai.MarkAllCycles(graph, params.colorRed, lines);


				postMessage({
					operation: params.operation,
					cycles: result.cycles,
					free_human_player_points: result.free_human_player_points,
					cyclenumber: result.cyclenumber
				});
			}
			break;

		case "FIND_SURROUNDABLE_POINTS":
			{
				const svgVml = new SvgVml();
				svgVml.Init(null, null, null, params.boardSize);

				const allLines = params.allLines.map(pa => svgVml.DeserializePolyline(pa));
				const all_points = params.allPoints.map(pt => svgVml.DeserializeOval(pt));
				const working_points = params.workingPoints.map(pt => svgVml.DeserializeOval(pt));

				const sHumanColor = params.sHumanColor, sCPUColor = params.sCPUColor;
				const human_point_statuses = [StatusEnum.POINT_FREE_RED, StatusEnum.POINT_IN_PATH];
				const cpu_point_statuses = [StatusEnum.POINT_FREE_BLUE, StatusEnum.POINT_IN_PATH];



				const results = [];
				for (const pt of working_points) {
					if (pt !== undefined && pt.GetFillColor() === sHumanColor
						&& human_point_statuses.includes(pt.GetStatus())) {
						const { x, y } = pt.GetPosition();
						if (false === IsPointOutsideAllPaths(x, y, allLines)) {
							LocalLog("!!!Point inside path!!!");
							continue;
						}
						for (let radius = 1; radius <= 4; radius++) {
							const possible = [];

							//pt,x,y is good "surroundable point"
							//let's find closes CPU points to it lying on circle
							for (const cpu_pt of all_points) {
								if (cpu_pt !== undefined && cpu_pt.GetFillColor() === sCPUColor
									&& cpu_point_statuses.includes(cpu_pt.GetStatus())) {
									const { x: cpu_x, y: cpu_y } = cpu_pt.GetPosition();
									if (false === IsPointOutsideAllPaths(cpu_x, cpu_y, allLines))
										continue;

									if (0 <= svgVml.IsPointInCircle({ x: cpu_x, y: cpu_y }, { x, y }, radius)) {
										cpu_pt.x = cpu_x;
										cpu_pt.y = cpu_y;
										possible.push(cpu_pt);
									}
								}
							}
							if (possible.length > 2) {
								let cw_sorted_verts = sortPointsClockwise(possible);
								//check if points are aligned one-by-one next to each other no more than 1 point apart
								for (let i = cw_sorted_verts.length - 2, last = cw_sorted_verts.at(-1); i > 0; i--) {
									const it = cw_sorted_verts[i];
									if (!(Math.abs(last.x - it.x) <= 1 && Math.abs(last.y - it.y) <= 1)) {
										cw_sorted_verts = null;
										break;
									}
									last = it;
								}

								if (
									//check if above loop exited with not consecutive points
									cw_sorted_verts === null ||

									//check last and first path points that they close up nicely
									!(Math.abs(cw_sorted_verts.at(-1).x - cw_sorted_verts[0].x) <= 1 &&
										Math.abs(cw_sorted_verts.at(-1).y - cw_sorted_verts[0].y) <= 1
									) ||

									//check if "points-created-path" actually contains selected single point inside its boundaries
									false === pnpoly(cw_sorted_verts, x, y)
								) {
									continue;
								}

								results.push({ cw_sorted_verts, radius, x, y });

								LocalLog(`circle sorted possible path points for ${radius} radius: `);
								LocalLog(cw_sorted_verts);
							}
						}
					}
				}

				postMessage({ operation: params.operation, results });
			}
			break;

		case "ASTAR":
			{
				const { arr, start, end } = params;

				const resultWithDiagonals = AstarPathFind(arr, start.y, start.x, end.y, end.x);
				LocalLog(resultWithDiagonals);

				postMessage({ operation: params.operation, resultWithDiagonals });
			}
			break;

		case "CLUSTERING":
			{
				const { dataset, method, numberOfClusters, neighborhoodRadius, minPointsPerCluster } = params;
				switch (method) {
					case "KMEANS":
						{
							const kmeans = new clustering.KMEANS();
							// parameters: 3 - number of clusters
							const clusters = kmeans.run(dataset, numberOfClusters);

							// LocalLog({ method, clusters });
							clusters.sort((a, b) => a.length - b.length);
							postMessage({ operation: params.operation, method, clusters });
						}
						break;

					case "OPTICS":
						{
							const optics = new clustering.OPTICS();
							// parameters: 2 - neighborhood radius, 2 - number of points in neighborhood to form a cluster
							const clusters = optics.run(dataset, neighborhoodRadius, minPointsPerCluster);
							const plot = optics.getReachabilityPlot();

							// LocalLog({ method, clusters, plot });
							clusters.sort((a, b) => a.length - b.length);
							postMessage({ operation: params.operation, method, clusters, plot });
						}
						break;

					case "DBSCAN":
						{
							const dbscan = new clustering.DBSCAN();
							// parameters: 5 - neighborhood radius, 2 - number of points in neighborhood to form a cluster
							const clusters = dbscan.run(dataset, neighborhoodRadius, minPointsPerCluster);
							const noise = dbscan.noise;

							// LocalLog({ method, clusters, noise });
							clusters.sort((a, b) => a.length - b.length);
							postMessage({ operation: params.operation, method, clusters, noise });
						}
						break;

					default:
						throw new Error("bad or no clustering method");
				}
			}
			break;

		default:
			LocalError(`unknown params.operation = ${params.operation}`);
			break;
	}
});

function AstarPathFind(arr, fromY, fromX, toY, toX) {
	const graphDiagonal = new AStarGraph(arr, { diagonal: true });

	const from = graphDiagonal.grid[fromY][fromX];
	const to = graphDiagonal.grid[toY][toX];

	const resultWithDiagonalsInvertedXY = astar.search(graphDiagonal, from, to, { heuristic: astar.heuristics.diagonal });

	const resultWithDiagonals = resultWithDiagonalsInvertedXY.map(obj => ({
		...obj,
		x: obj.y,
		y: obj.x
	}));

	return resultWithDiagonals;
}

// LocalLog('Worker loaded');
