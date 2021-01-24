import { GraphAI, concaveman } from "./AISource.js";
import { SvgVml, StatusEnum, LocalLog, LocalError, sortPointsClockwise } from "./shared.js";


// This is the entry point for our worker
addEventListener('message', async function (e) {
	const params = e.data;

	switch (params.operation) {
		case "BUILD_GRAPH":
			{
				//debugger;
				const svgVml = new SvgVml();
				svgVml.CreateSVGVML(null, null, null, true);

				const lines = params.paths.map(pa => svgVml.DeserializePolyline(pa));
				const points = new Map();
				params.points.forEach((pt) => {
					points.set(pt.key, svgVml.DeserializeOval(pt.value));
				});

				LocalLog(`lines.count = ${await lines.length}, points.count = ${await points.size}`);

				const ai = new GraphAI(params.state.iGridWidth, params.state.iGridHeight, params.state.iGridSizeX, params.state.iGridSizeY,
					points, StatusEnum.POINT_STARTING, StatusEnum.POINT_IN_PATH);
				const graph = await ai.BuildGraph({ freePointStatus: StatusEnum.POINT_FREE_BLUE, cpufillCol: 'blue', visuals: false });
				//LocalLog(graph);

				postMessage({ operation: params.operation, params: graph });
			}
			break;

		case "CONCAVEMAN":
			{
				const svgVml = new SvgVml();
				svgVml.CreateSVGVML(null, null, null, true);

				const points = new Map();
				params.points.forEach((pt) => {
					points.set(pt.key, svgVml.DeserializeOval(pt.value));
				});
				const ai = new GraphAI(params.state.iGridWidth, params.state.iGridHeight, params.state.iGridSizeX, params.state.iGridSizeY,
					points, StatusEnum.POINT_STARTING, StatusEnum.POINT_IN_PATH);
				const graph = await ai.BuildGraph({ freePointStatus: StatusEnum.POINT_FREE_BLUE, cpufillCol: 'blue', visuals: false });


				const vertices = graph.vertices.map(function (pt) {
					const pos = pt.GetPosition(); return [pos.x / params.state.iGridSizeX, pos.y / params.state.iGridSizeX];
				});
				const convex_hull = concaveman(vertices, 2.0, 0.0);

				const mapped_verts = convex_hull.map(function (pt) {
					return { x: pt[0], y: pt[1] };
				}.bind(this));
				const cw_sorted_verts = sortPointsClockwise(mapped_verts);

				postMessage({ operation: params.operation, convex_hull: convex_hull, cw_sorted_verts: cw_sorted_verts });
			}
			break;

		case "MARK_ALL_CYCLES":
			{
				const svgVml = new SvgVml();
				svgVml.CreateSVGVML(null, null, null, true);

				const lines = params.paths.map(pa => svgVml.DeserializePolyline(pa));
				const points = new Map();
				params.points.forEach((pt) => {
					points.set(pt.key, svgVml.DeserializeOval(pt.value));
				});
				const ai = new GraphAI(params.state.iGridWidth, params.state.iGridHeight, params.state.iGridSizeX, params.state.iGridSizeY,
					points, StatusEnum.POINT_STARTING, StatusEnum.POINT_IN_PATH);
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

		default:
			LocalError(`unknown params.operation = ${params.operation}`);
			break;
	}
});

LocalLog('Worker loaded');
