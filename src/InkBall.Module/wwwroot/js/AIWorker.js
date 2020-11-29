import { GraphAI } from "./AISource.js";
import { SvgVml } from "./svgvml.js";
//self.importScripts('https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/7.12.1/polyfill.min.js');

//TODO: make shareable, no duplication
const StatusEnum = Object.freeze({
	POINT_FREE_RED: -3,
	POINT_FREE_BLUE: -2,
	POINT_FREE: -1,
	POINT_STARTING: 0,
	POINT_IN_PATH: 1,
	POINT_OWNED_BY_RED: 2,
	POINT_OWNED_BY_BLUE: 3
});

//TODO: make shareable, no duplication
function LocalLog(msg) {
	// eslint-disable-next-line no-console
	console.log(msg);
}

//TODO: make shareable, no duplication
function LocalError(...args) {
	let msg = '';
	for (let i = 0; i < args.length; i++) {
		const str = args[i];
		if (str)
			msg += str;
	}
	// eslint-disable-next-line no-console
	console.error(msg);
}

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
