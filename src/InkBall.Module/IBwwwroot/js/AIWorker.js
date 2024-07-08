import { GraphAI, concaveman } from "./AISource.js";
import { SvgVml, StatusEnum, LocalLog, LocalError, sortPointsClockwise, pnpoly, IsPointOutsideAllPaths } from "./shared.js";
import { astar, Graph } from "javascript-astar";
import * as clustering from "density-clustering";

// This is the entry point for our worker
addEventListener('message', async function (e) {
	const params = e.data;

	switch (params.operation) {
		case "BUILD_GRAPH":
			{
				const svgVml = new SvgVml();
				svgVml.CreateSVGVML(null, null, null, params.boardSize);

				//debugger;
				const lines = params.paths.map(pa => svgVml.DeserializePolyline(pa));
				const points = new Map();
				params.points.forEach((pt) => {
					points.set(pt.key, svgVml.DeserializeOval(pt.value));
				});

				LocalLog(`lines.count = ${await lines.length}, points.count = ${await points.size}`);

				const ai = new GraphAI(params.state.iGridWidth, params.state.iGridHeight, points);
				const graph = await ai.BuildGraph({ freePointStatus: StatusEnum.POINT_FREE_BLUE, cpufillCol: 'var(--bluish)', visuals: false });
				//LocalLog(graph);

				postMessage({ operation: params.operation, params: graph });
			}
			break;

		case "CONCAVEMAN":
			{
				const svgVml = new SvgVml();
				svgVml.CreateSVGVML(null, null, null, params.boardSize);

				const points = new Map();
				params.points.forEach((pt) => {
					points.set(pt.key, svgVml.DeserializeOval(pt.value));
				});
				const ai = new GraphAI(params.state.iGridWidth, params.state.iGridHeight, points);
				const graph = await ai.BuildGraph({ freePointStatus: StatusEnum.POINT_FREE_BLUE, cpufillCol: 'var(--bluish)', visuals: false });


				const vertices = graph.vertices.map(function (pt) {
					const { x, y } = pt.GetPosition();
					return [x, y];
				});
				const convex_hull = concaveman(vertices, params.concavity ?? 2.0, params.lengthThreshold ?? 0.0);

				const mapped_verts = convex_hull.map(([x, y]) => ({ x, y }));
				const cw_sorted_verts = sortPointsClockwise(mapped_verts);

				postMessage({ operation: params.operation, convex_hull: convex_hull, cw_sorted_verts: cw_sorted_verts });
			}
			break;

		case "MARK_ALL_CYCLES":
			{
				const svgVml = new SvgVml();
				svgVml.CreateSVGVML(null, null, null, params.boardSize);

				const lines = params.paths.map(pa => svgVml.DeserializePolyline(pa));
				const points = new Map();
				params.points.forEach((pt) => {
					points.set(pt.key, svgVml.DeserializeOval(pt.value));
				});
				const ai = new GraphAI(params.state.iGridWidth, params.state.iGridHeight, points);
				const graph = await ai.BuildGraph({ freePointStatus: StatusEnum.POINT_FREE_BLUE, cpufillCol: params.colorBlue, visuals: false });
				const result = await ai.MarkAllCycles(graph, params.colorBlue, params.colorRed, lines);


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
				svgVml.CreateSVGVML(null, null, null, params.boardSize);

				const allLines = params.allLines.map(pa => svgVml.DeserializePolyline(pa));
				const all_points = params.allPoints.map(pt => svgVml.DeserializeOval(pt));
				const working_points = params.workingPoints.map(pt => svgVml.DeserializeOval(pt));

				const sHumanColor = params.sHumanColor;
				const sCPUColor = params.sCPUColor;


				const results = [];
				for (const pt of working_points) {
					if (pt !== undefined && pt.GetFillColor() === sHumanColor
						&& [StatusEnum.POINT_FREE_RED, StatusEnum.POINT_IN_PATH].includes(pt.GetStatus())) {
						const { x, y } = pt.GetPosition();
						if (false === await IsPointOutsideAllPaths(x, y, allLines)) {
							LocalLog("!!!Point inside path!!!");
							continue;
						}
						for (let radius = 1; radius <= 4; radius++) {
							const possible = [];

							//pt,x,y is good "surroundable point"
							//let's find closes CPU points to it lying on circle
							for (const cpu_pt of all_points) {
								if (cpu_pt !== undefined && cpu_pt.GetFillColor() === sCPUColor
									&& [StatusEnum.POINT_FREE_BLUE, StatusEnum.POINT_IN_PATH].includes(cpu_pt.GetStatus())) {
									const { x: cpu_x, y: cpu_y } = cpu_pt.GetPosition();
									if (false === await IsPointOutsideAllPaths(cpu_x, cpu_y, allLines))
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
				const graphDiagonal = new Graph(arr, { diagonal: true });
				const from = graphDiagonal.grid[start.y][start.x];
				const to = graphDiagonal.grid[end.y][end.x];
				const resultWithDiagonals = astar.search(graphDiagonal, from, to, { heuristic: astar.heuristics.diagonal });

				LocalLog(resultWithDiagonals);

				postMessage({ operation: params.operation, resultWithDiagonals });
			}
			break;

		case "CLUSTERING":
			{
				const { dataset, method, numberOfClusters, neighborhoodRadius, minPointsPerCluster } = params;
				// LocalLog(dataset);
				switch (method) {
					case "KMEANS":
						{
							const kmeans = new clustering.KMEANS();
							// parameters: 3 - number of clusters
							const clusters = kmeans.run(dataset, numberOfClusters);

							// LocalLog({ method, clusters });
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

LocalLog('Worker loaded');
