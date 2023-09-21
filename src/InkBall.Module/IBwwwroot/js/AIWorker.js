import { GraphAI, concaveman } from "./AISource.js";
import { SvgVml, StatusEnum, LocalLog, LocalError, sortPointsClockwise } from "./shared.js";
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
				const convex_hull = concaveman(vertices, 2.0, 0.0);

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

							LocalLog({ method, clusters });
							postMessage({ operation: params.operation, clusters });
						}
						break;
					case "OPTICS":
						{
							const optics = new clustering.OPTICS();
							// parameters: 2 - neighborhood radius, 2 - number of points in neighborhood to form a cluster
							const clusters = optics.run(dataset, neighborhoodRadius, minPointsPerCluster);
							const plot = optics.getReachabilityPlot();

							LocalLog({ method, clusters, plot });
							postMessage({ operation: params.operation, clusters, plot });
						}
						break;
					case "DBSCAN":
						{
							const dbscan = new clustering.DBSCAN();
							// parameters: 5 - neighborhood radius, 2 - number of points in neighborhood to form a cluster
							const clusters = dbscan.run(dataset, neighborhoodRadius, minPointsPerCluster);
							const noise = dbscan.noise;

							LocalLog({ method, clusters, noise });
							postMessage({ operation: params.operation, clusters, noise });
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
