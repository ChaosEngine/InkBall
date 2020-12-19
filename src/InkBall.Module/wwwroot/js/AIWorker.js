import { GraphAI, concaveman } from "./AISource.js";
import { SvgVml, StatusEnum, LocalLog, LocalError, sortPointsClockwise } from "./svgvml.js";


// This is the entry point for our worker
addEventListener('message', async function (e) {
	const params = e.data;

	switch (params.operation) {
		case "BUILD_GRAPH":
			{
				params.state.bPointsAndPathsLoaded = false;
				//debugger;

				const svgVml = new SvgVml();
				svgVml.CreateSVGVML(null, null, null, true);

				const points = new Map(), lines = params.paths.map(pa => svgVml.DeserializePolyline(pa));
				params.points.forEach((pt) => {
					points.set(pt.key, svgVml.DeserializeOval(pt.value));
				});

				LocalLog(`lines.count = ${await lines.length}, points.count = ${await points.size}`);

				const ai = new GraphAI(params.state.iGridWidth, params.state.iGridHeight, params.state.iGridSizeX, params.state.iGridSizeY,
					points, StatusEnum.POINT_STARTING, StatusEnum.POINT_IN_PATH);
				const graph = await ai.BuildGraph({ freePointStatus: StatusEnum.POINT_FREE_BLUE, fillCol: 'blue', visuals: false });
				LocalLog(graph);
				postMessage({ operation: "BUILD_GRAPH", params: graph });
			}
			break;

		default:
			break;
	}
});

LocalLog('Worker loaded');
