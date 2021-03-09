/*eslint-disable no-console*/
import concaveman from "concaveman";
import decomp from "poly-decomp";
import { StatusEnum, /*LocalLog,*/ sortPointsClockwise, /*Sleep,*/ pnpoly2 } from "./shared.js";


/**
 * AI operations class
 * */
class GraphAI {
	constructor(iGridWidth, iGridHeight, iGridSizeX, iGridSizeY, pointStore, POINT_STARTING, POINT_IN_PATH) {
		this.m_iGridWidth = iGridWidth;
		this.m_iGridHeight = iGridHeight;
		this.m_iGridSizeX = iGridSizeX;
		this.m_iGridSizeY = iGridSizeY;
		this.m_Points = pointStore;
		this.POINT_STARTING = POINT_STARTING;
		this.POINT_IN_PATH = POINT_IN_PATH;
	}

	/**
	 * Building graph of connected vertices and edges
	 * @param {any} param0 is a optional object comprised of:
	 *	freePointStatus - status of free point
	 *	cpuFillColor - CPU point color
	 */
	async BuildGraph({
		freePointStatus = StatusEnum.POINT_FREE_BLUE,
		cpufillCol: cpuFillColor = 'blue'
		//, visuals: presentVisually = false
	} = {}) {
		const graph_points = [], graph_edges = new Map();

		const isPointOKForPath = function (freePointStatusArr, pt) {
			const status = pt.GetStatus();

			if (freePointStatusArr.includes(status) && pt.GetFillColor() === cpuFillColor)
				return true;
			return false;
		};

		const addPointsAndEdgestoGraph = async function (point, to_x, to_y, view_x, view_y, x, y) {
			if (to_x >= 0 && to_x < this.m_iGridWidth && to_y >= 0 && to_y < this.m_iGridHeight) {
				const next = await this.m_Points.get(to_y * this.m_iGridWidth + to_x);
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

		for (const point of await this.m_Points.values()) {
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

	async IsPointOutsideAllPaths(lines, x, y) {
		const xmul = x * this.m_iGridSizeX, ymul = y * this.m_iGridSizeY;

		//const lines = await linesStore.all();//TODO: async for
		for (const line of lines) {
			const points = line.GetPointsArray();

			if (false !== pnpoly2(points, xmul, ymul))
				return false;
		}

		return true;
	}

	/**
	 * Based on https://www.geeksforgeeks.org/print-all-the-cycles-in-an-undirected-graph/
	 * @param {any} graph constructed earlier with BuildGraph
	 * @param {string} COLOR_BLUE - cpu blue playing color
	 * @param {string} COLOR_RED - human red playing color
	 * @param {object} lines - line array
	 * @returns {array} of cycles
	 */
	async MarkAllCycles(graph, COLOR_BLUE, COLOR_RED, lines) {
		const vertices = graph.vertices;
		const N = vertices.length;
		let cycles = new Array(N);
		// mark with unique numbers
		const mark = new Array(N);
		// arrays required to color the 
		// graph, store the parent of node 
		const color = new Array(N), par = new Array(N);

		for (let i = 0; i < N; i++) {
			mark[i] = []; cycles[i] = [];
		}

		const dfs_cycle = async function (u, p) {
			// already (completely) visited vertex. 
			if (color[u] === 2)
				return;

			// seen vertex, but was not completely visited -> cycle detected. 
			// backtrack based on parents to find the complete cycle. 
			if (color[u] === 1) {
				cyclenumber++;
				let cur = p;
				mark[cur].push(cyclenumber);

				// backtrack the vertex which are
				// in the current cycle thats found
				while (cur !== u) {
					cur = par[cur];
					mark[cur].push(cyclenumber);
				}
				return;
			}
			par[u] = p;

			// partially visited.
			color[u] = 1;
			const vertex = vertices[u];
			if (vertex) {


				//vertex.SetStrokeColor('black');
				//vertex.SetFillColor('black');
				////vertex.setAttribute("r", "6");
				//await Sleep(10);


				// simple dfs on graph
				for (const adj of vertex.adjacents) {
					const v = vertices.indexOf(adj);
					// if it has not been visited previously
					if (v === par[u])
						continue;

					await dfs_cycle(v, u);
				}
			}

			// completely visited. 
			color[u] = 2;
		};

		const printCycles = async function (edges, mark) {
			// push the edges that into the 
			// cycle adjacency list 
			for (let e = 0; e < edges; e++) {
				const mark_e = mark[e];
				if (mark_e !== undefined && mark_e.length > 0) {
					for (let m = 0; m < mark_e.length; m++) {
						const found_c = cycles[mark_e[m]];
						if (found_c !== undefined)
							found_c.push(e);
					}
				}
			}

			//sort by point length(only cycles >= 4): first longest cycles, most points
			cycles = cycles.filter(c => c.length >= 4).sort((b, a) => a.length - b.length);

			//gather free human player points that could be intercepted.
			const free_human_player_points = [];
			const sHumanColor = COLOR_RED;
			for (const pt of await this.m_Points.values()) {
				if (pt !== undefined && pt.GetFillColor() === sHumanColor && StatusEnum.POINT_FREE_RED === pt.GetStatus()) {
					const { x: view_x, y: view_y } = pt.GetPosition();
					const x = view_x / this.m_iGridSizeX, y = view_y / this.m_iGridSizeY;
					if (false === await this.IsPointOutsideAllPaths(lines, x, y))
						continue;

					//check if really exists
					//const pt1 = document.querySelector(`svg > circle[cx="${view_x}"][cy="${view_y}"]`);
					//if (pt1)
					free_human_player_points.push({ x, y });
				}
			}


			//const tab = [];
			// traverse through all the vertices with same cycle
			for (let i = 0; i <= cyclenumber; i++) {
				const cycl = cycles[i];//get cycle
				if (cycl && cycl.length > 0) {	//some checks
					// Print the i-th cycle
					//let str = (`Cycle Number ${i}: `), trailing_points = [];
					//const rand_color = 'var(--indigo)';

					//convert to logical space
					const mapped_verts = cycl.map(function (c) {
						const pt = vertices[c].GetPosition();
						return { x: pt.x / this.m_iGridSizeX, y: pt.y / this.m_iGridSizeY };
					}.bind(this));
					//sort clockwise (https://stackoverflow.com/questions/45660743/sort-points-in-counter-clockwise-in-javascript)
					const cw_sorted_verts = sortPointsClockwise(mapped_verts);
					cycles[i] = { cycl, cw_sorted_verts };
					////display which cycle we are dealing with
					//for (const vert of cw_sorted_verts) {
					//	const { x, y } = vert;
					//	const pt = document.querySelector(`svg > circle[cx="${x * this.m_iGridSizeX}"][cy="${y * this.m_iGridSizeY}"]`);
					//	if (pt) {//again some basic checks
					//		str += (`(${x},${y})`);

					//		pt.SetStrokeColor(rand_color);
					//		pt.SetFillColor(rand_color);
					//		pt.setAttribute("r", "6");
					//	}
					//	await Sleep(50);
					//}

					//find for all free_human_player_points which cycle might interepct it (surrounds)
					//only convex, NOT concave :-(
					//let tmp = '', comma = '';
					//for (const possible_intercept of free_human_player_points) {
					//	if (false !== pnpoly2(cw_sorted_verts, possible_intercept.x, possible_intercept.y)) {
					//		tmp += `${comma}(${possible_intercept.x},${possible_intercept.y})`;

					//		const pt1 = document.querySelector(`svg > circle[cx="${possible_intercept.x * this.m_iGridSizeX}"][cy="${possible_intercept.y * this.m_iGridSizeY}"]`);
					//		if (pt1) {
					//			pt1.SetStrokeColor('var(--yellow)');
					//			pt1.SetFillColor('var(--yellow)');
					//			pt1.setAttribute("r", "6");
					//		}
					//		comma = ',';
					//	}
					//}
					////gaterhing of some data and console printing
					//trailing_points.unshift(str);
					//tab.push(trailing_points);
					////log...
					//LocalLog(str + (tmp !== '' ? ` possible intercepts: ${tmp}` : ''));
					////...and clear
					//const pts2reset = Array.from(document.querySelectorAll(`svg > circle[fill="${rand_color}"][r="6"]`));
					//pts2reset.forEach(pt => {
					//	pt.SetStrokeColor(COLOR_BLUE);
					//	pt.SetFillColor(COLOR_BLUE);
					//	pt.setAttribute("r", "4");
					//});
				}
			}
			/*return tab;*/return { cycles, free_human_player_points, cyclenumber };
		}.bind(this);

		// store the numbers of cycle 
		let cyclenumber = 0, edges = N;

		// call DFS to mark the cycles 
		for (let vind = 0; vind < N; vind++) {
			await dfs_cycle(vind + 1, vind);//, color, mark, par);
		}

		// function to print the cycles 
		return await printCycles(edges, mark);
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
