/*eslint-disable no-console*/
import concaveman from "concaveman";
import decomp from "poly-decomp";

class GraphAI {
	constructor(iGridWidth, iGridHeight, iGridSizeX, iGridSizeY, pointStore, POINT_STARTING, POINT_IN_PATH) {
		this.m_iGridWidth = iGridWidth;
		this.m_iGridHeight = iGridHeight;
		this.m_iGridSizeX = iGridSizeX;
		this.m_iGridSizeY = iGridSizeY;
		this.PointStore = pointStore;
		this.POINT_STARTING = POINT_STARTING;
		this.POINT_IN_PATH = POINT_IN_PATH;
	}

	async BuildGraph({
		freePointStatus /*= StatusEnum.POINT_FREE_BLUE*/,
		fillCol: fillColor = 'blue'
		//, visuals: presentVisually = false
	} = {}) {
		const graph_points = [], graph_edges = new Map();

		const isPointOKForPath = function (freePointStatusArr, pt) {
			const status = pt.GetStatus();

			if (freePointStatusArr.includes(status) && pt.GetFillColor() === fillColor)
				return true;
			return false;
		};

		const addPointsAndEdgestoGraph = async function (point, to_x, to_y, view_x, view_y, x, y) {
			if (to_x >= 0 && to_x < this.m_iGridWidth && to_y >= 0 && to_y < this.m_iGridHeight) {
				const next = await this.PointStore.get(to_y * this.m_iGridWidth + to_x);
				if (next && isPointOKForPath([freePointStatus], next) === true) {
					//const next_pos = next.GetPosition();

					//const to_x = next_pos.x / this.m_iGridSizeX, to_y = next_pos.y / this.m_iGridSizeY;
					if (graph_edges.has(`${x},${y}_${to_x},${to_y}`) === false && graph_edges.has(`${to_x},${to_y}_${x},${y}`) === false) {

						const edge = {
							from: point,
							to: next
						};
						//if (presentVisually === true) {
						//	const line = CreateLine(3, 'rgba(0, 255, 0, 0.3)');
						//	line.move(view_x, view_y, next_pos.x, next_pos.y);
						//	edge.line = line;
						//}
						graph_edges.set(`${x},${y}_${to_x},${to_y}`, edge);


						if (graph_points.includes(point) === false) {
							point.adjacents = [next];
							graph_points.push(point);
						} else {
							const pt = graph_points.find(x => x === point);
							pt.adjacents.push(next);
						}
						if (graph_points.includes(next) === false) {
							next.adjacents = [point];
							graph_points.push(next);
						} else {
							const pt = graph_points.find(x => x === next);
							pt.adjacents.push(point);
						}
					}
				}
			}
		}.bind(this);

		for (const point of await this.PointStore.values()) {
			if (point && isPointOKForPath([freePointStatus, this.POINT_STARTING, this.POINT_IN_PATH], point) === true) {
				const { x: view_x, y: view_y } = point.GetPosition();
				const x = view_x / this.m_iGridSizeX, y = view_y / this.m_iGridSizeY;
				//TODO: await all below promises
				//east
				await addPointsAndEdgestoGraph(point, x + 1, y, view_x, view_y, x, y);
				//west
				await addPointsAndEdgestoGraph(point, x - 1, y, view_x, view_y, x, y);
				//north
				await addPointsAndEdgestoGraph(point, x, (y - 1), view_x, view_y, x, y);
				//south
				await addPointsAndEdgestoGraph(point, x, (y + 1), view_x, view_y, x, y);
				//north_west
				await addPointsAndEdgestoGraph(point, x - 1, (y - 1), view_x, view_y, x, y);
				//north_east
				await addPointsAndEdgestoGraph(point, x + 1, (y - 1), view_x, view_y, x, y);
				//south_west
				await addPointsAndEdgestoGraph(point, x - 1, (y + 1), view_x, view_y, x, y);
				//south_east
				await addPointsAndEdgestoGraph(point, x + 1, (y + 1), view_x, view_y, x, y);
			}
		}
		//return graph
		return { vertices: graph_points, edges: Array.from(graph_edges.values()) };
	}
}

const precision_points = [[484, 480], [676, 363], [944, 342], [678, 41], [286, 237], [758, 215], [752, 117], [282, 492], [609, 262], [129, 252]];
const concavity = 2.0, lengthThreshold = 0.0;
const concaveman_output = concaveman(precision_points, concavity, lengthThreshold);
//console.log('Hello concaveman. Simple test output points: \n' + JSON.stringify(output));


// Make sure the polygon has counter-clockwise winding. Skip this step if you know it's already counter-clockwise.
//console.log(`decomp.makeCCW(concavePolygon) => ${decomp.makeCCW(precision_points)}`);
//const convexPolygonsQuick = decomp.quickDecomp(precision_points);
// ==> [  [[1,0],[1,1],[0.5,0.5]],  [[0.5,0.5],[-1,1],[-1,0],[1,0]]  ]
//console.log(`decomp.quickDecomp => ${convexPolygons}`);
// Decompose using the slow (but optimal) algorithm
const convexPolygons = decomp.decomp(precision_points);
// ==> [  [[-1,1],[-1,0],[1,0],[0.5,0.5]],  [[1,0],[1,1],[0.5,0.5]]  ]
//console.log(`decomp.decomp => ${convexPolygons}`);
if (!concaveman_output || concaveman_output.length <= 0 ||
	//!convexPolygonsQuick || convexPolygonsQuick.length <= 0 || 
	!convexPolygons || convexPolygons.length <= 0) {
	console.log('decomp or concaveman error');
}

export { concaveman, GraphAI };
