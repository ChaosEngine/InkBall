import { GraphAI } from "./AISource.js";
import { SvgVml, GameStateStore } from "./svgvml.js";
//self.importScripts('svgvmlBundle.js', 'AIBundle.js');

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

	params.state.bPointsAndPathsLoaded = false;
	//debugger;

	const svgVml = new SvgVml();
	svgVml.CreateSVGVML(null, null, null, true);

	let lines, points;
	const stateStore = new GameStateStore(true,
		function CreateScreenPointFromIndexedDb(iX, iY, iStatus, sColor) {
			const x = iX * params.state.iGridSizeX;
			const y = iY * params.state.iGridSizeY;

			const oval = svgVml.CreateOval(3);
			oval.move(x, y, 3);

			let color;
			switch (iStatus) {
				case StatusEnum.POINT_FREE_RED:
					color = 'red';
					oval.SetStatus(iStatus/*StatusEnum.POINT_FREE*/);
					break;
				case StatusEnum.POINT_FREE_BLUE:
					color = 'blue';
					oval.SetStatus(iStatus/*StatusEnum.POINT_FREE*/);
					break;
				case StatusEnum.POINT_FREE:
					color = 'red';
					oval.SetStatus(iStatus/*StatusEnum.POINT_FREE*/);
					//console.warn('TODO: generic FREE point, really? change it!');
					break;
				case StatusEnum.POINT_STARTING:
					color = 'red';
					oval.SetStatus(iStatus);
					break;
				case StatusEnum.POINT_IN_PATH:
					//if (this.g_iPlayerID === iPlayerId)//bPlayingWithRed
					//	color = this.m_bIsPlayingWithRed === true ? this.COLOR_RED : this.COLOR_BLUE;
					//else
					//	color = this.m_bIsPlayingWithRed === true ? this.COLOR_BLUE : this.COLOR_RED;
					color = sColor;
					oval.SetStatus(iStatus);
					break;
				case StatusEnum.POINT_OWNED_BY_RED:
					color = '#DC143C';
					oval.SetStatus(iStatus);
					break;
				case StatusEnum.POINT_OWNED_BY_BLUE:
					color = '#8A2BE2';
					oval.SetStatus(iStatus);
					break;
				default:
					alert('bad point');
					break;
			}

			oval.SetFillColor(color);
			oval.SetStrokeColor(color);

			return oval;
		},
		async function CreateScreenPathFromIndexedDb(packed, sColor, iPathId) {
			const sPoints = packed.split(" ");
			let sDelimiter = "", sPathPoints = "", p = null, x, y,
				status = StatusEnum.POINT_STARTING;
			for (const pair of sPoints) {
				p = pair.split(",");
				x = parseInt(p[0]); y = parseInt(p[1]);

				p = await points.get(y * params.state.iGridWidth + x);
				if (p !== null && p !== undefined) {
					p.SetStatus(status);
					status = StatusEnum.POINT_IN_PATH;
				}
				else {
					debugger;
				}

				x *= params.state.m_iGridSizeX; y *= params.state.m_iGridSizeY;
				sPathPoints += `${sDelimiter}${x},${y}`;
				sDelimiter = " ";
			}
			p = sPoints[0].split(",");
			x = parseInt(p[0]); y = parseInt(p[1]);

			p = await points.get(y * params.state.iGridWidth + x);
			if (p !== null && p !== undefined) {
				p.SetStatus(status);
			}
			else {
				debugger;
			}

			x *= params.state.m_iGridSizeX; y *= params.state.m_iGridSizeY;
			sPathPoints += `${sDelimiter}${x},${y}`;

			const line = svgVml.CreatePolyline(3, sPathPoints, sColor);
			line.SetID(iPathId);

			return line;
		},
		function GetGameStateForIndexedDb() {
			return params.state;
		},
		LocalLog, LocalError, params.version
	);

	lines = stateStore.GetPathStore();
	points = stateStore.GetPointStore();
	await stateStore.PrepareStore();
	LocalLog(`lines.count = ${await lines.count()}, points.count = ${await points.count()}`);

	const ai = new GraphAI(params.state.iGridWidth, params.state.iGridHeight, params.state.iGridSizeX, params.state.iGridSizeY,
		points, StatusEnum.POINT_STARTING, StatusEnum.POINT_IN_PATH);
	const graph = await ai.BuildGraph({ freePointStatus: StatusEnum.POINT_FREE_BLUE, fillCol: 'blue', visuals: false });
	LocalLog(graph);


	//LocalLog('Worker message data = ' + svgVml);
	//postMessage('Yooo! typeof ' + typeof GraphAI);
});

//debugger;
LocalLog('Worker loaded');
