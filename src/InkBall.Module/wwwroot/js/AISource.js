import concaveman from "concaveman";
// import decomp from "poly-decomp";
// import { StatusEnum, sortPointsClockwise, IsPointOutsideAllPaths, /*LocalLog, Sleep, pnpoly*/ } from "./shared.js";

//globals loaded only once hopefully
let StatusEnum, sortPointsClockwise, IsPointOutsideAllPaths/*, LocalLog, Sleep, pnpoly*/;

/**
 * AI operations class
 */
class GraphAI {
	#iGridWidth;
	#iGridHeight;
	#Points;
	#POINT_STARTING;
	#POINT_IN_PATH;

	constructor(iGridWidth, iGridHeight, pointStore) {
		this.#iGridWidth = iGridWidth;
		this.#iGridHeight = iGridHeight;
		this.#Points = pointStore;
	}

	async #Init() {
		if (StatusEnum === undefined) {

			({ StatusEnum, sortPointsClockwise, IsPointOutsideAllPaths } = await import(/* webpackIgnore: true */`./shared${location.hostname !== "localhost" ? '.min' : ''}.js`));

			this.#POINT_STARTING = StatusEnum.POINT_STARTING;
			this.#POINT_IN_PATH = StatusEnum.POINT_IN_PATH;
		}
	}

	/**
	 * Building graph of connected vertices and edges
	 * @param {object} [param0] Optional object:
	 *   @param {number} param0.freePointStatus - status of free point
	 * @returns {object} with vertices and edges
	 */
	async BuildGraph({
		freePointStatus = StatusEnum.POINT_FREE_BLUE
		//, cpuFillColor = 'var(--bluish)'
		//, visuals = false
	} = {}) {
		await this.#Init();



		const graph_points = new Map(), graph_edges = new Map();

		const isPointOKForPath = function (allowedPoints, pt) {
			const status = pt.GetStatus();

			if (allowedPoints.includes(status)/* && pt.GetFillColor() === cpuFillColor */)
				return true;
			return false;
		};

		const freePointStatusArr = [freePointStatus];
		const addPointsAndEdgesToGraph = (point, to_x, to_y, x, y) => {
			if (to_x >= 0 && to_x < this.#iGridWidth && to_y >= 0 && to_y < this.#iGridHeight) {
				const next = this.#Points.get(to_y * this.#iGridWidth + to_x);
				if (next && isPointOKForPath(freePointStatusArr, next) === true) {

					const point_hash = `${x},${y}`;
					const next_hash = `${to_x},${to_y}`;
					if (graph_edges.has(`${point_hash}_${next_hash}`) === false && graph_edges.has(`${next_hash}_${point_hash}`) === false) {
						//if (presentVisually === true) {
						//	const line = CreateLine(3, 'rgba(0, 255, 0, 0.3)');
						//	line.move(x, y, next_pos.x, next_pos.y);
						//	edge.line = line;
						//}
						graph_edges.set(`${point_hash}_${next_hash}`, { from: point, to: next });


						if (!graph_points.has(point_hash)) {
							point.adjacents = [next];
							graph_points.set(point_hash, point);
						} else {
							const pt = graph_points.get(point_hash);
							pt.adjacents.push(next);
						}
						if (!graph_points.has(next_hash)) {
							next.adjacents = [point];
							graph_points.set(next_hash, next);
						} else {
							const pt = graph_points.get(next_hash);
							pt.adjacents.push(point);
						}
					}
				}
			}
		};

		const all_points = await this.#Points.values();
		const good_point_status_arr = [freePointStatus, this.#POINT_STARTING, this.#POINT_IN_PATH];
		for (const point of all_points) {
			if (point && isPointOKForPath(good_point_status_arr, point) === true) {
				const { x, y } = point.GetPosition();
				//TODO: await all below promises
				//east
				addPointsAndEdgesToGraph(point, x + 1, y, x, y);
				//west
				addPointsAndEdgesToGraph(point, x - 1, y, x, y);
				//north
				addPointsAndEdgesToGraph(point, x, (y - 1), x, y);
				//south
				addPointsAndEdgesToGraph(point, x, (y + 1), x, y);
				//north_west
				addPointsAndEdgesToGraph(point, x - 1, (y - 1), x, y);
				//north_east
				addPointsAndEdgesToGraph(point, x + 1, (y - 1), x, y);
				//south_west
				addPointsAndEdgesToGraph(point, x - 1, (y + 1), x, y);
				//south_east
				addPointsAndEdgesToGraph(point, x + 1, (y + 1), x, y);
			}
		}
		//return graph
		return {
			vertices: Array.from(graph_points.values()),
			edges: Array.from(graph_edges.values())
		};
	}

	/**
	 * Based on https://www.geeksforgeeks.org/print-all-the-cycles-in-an-undirected-graph/
	 * @param {object} graph constructed earlier with BuildGraph
	 * @param {string} sHumanColor - human red playing color
	 * @param {object} lines - line array
	 * @returns {Array} of cycles
	 */
	async MarkAllCycles(graph, sHumanColor, lines) {
		await this.#Init();



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

				//const x = vertex.attributes.get('cx'), y = vertex.attributes.get('cy');
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

		const printCycles = async (edges, mark) => {
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
			for (const pt of await this.#Points.values()) {
				if (pt !== undefined && pt.GetFillColor() === sHumanColor && StatusEnum.POINT_FREE_RED === pt.GetStatus()) {
					const { x, y } = pt.GetPosition();
					if (false === IsPointOutsideAllPaths(x, y, lines))
						continue;

					//check if really exists
					//const pt1 = document.querySelector(`svg > circle[cx="${x}"][cy="${y}"]`);
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
					const mapped_verts = cycl.map(c => vertices[c].GetPosition());
					//sort clockwise (https://stackoverflow.com/questions/45660743/sort-points-in-counter-clockwise-in-javascript)
					const cw_sorted_verts = sortPointsClockwise(mapped_verts);
					cycles[i] = { cycl, cw_sorted_verts };
					////display which cycle we are dealing with
					//for (const vert of cw_sorted_verts) {
					//	const { x, y } = vert;
					//	const pt = document.querySelector(`svg > circle[cx="${x}"][cy="${y}"]`);
					//	if (pt) {//again some basic checks
					//		str += (`(${x},${y})`);

					//		pt.SetStrokeColor(rand_color);
					//		pt.SetFillColor(rand_color);
					//		pt.setAttribute("r", "6");
					//	}
					//	await Sleep(50);
					//}

					//find for all free_human_player_points which cycle might intercept it (surrounds)
					//only convex, NOT concave :-(
					//let tmp = '', comma = '';
					//for (const possible_intercept of free_human_player_points) {
					//	if (false !== pnpoly(cw_sorted_verts, possible_intercept.x, possible_intercept.y)) {
					//		tmp += `${comma}(${possible_intercept.x},${possible_intercept.y})`;

					//		const pt1 = document.querySelector(`svg > circle[cx="${possible_intercept.x}"][cy="${possible_intercept.y}"]`);
					//		if (pt1) {
					//			pt1.SetStrokeColor('var(--yellow)');
					//			pt1.SetFillColor('var(--yellow)');
					//			pt1.setAttribute("r", "6");
					//		}
					//		comma = ',';
					//	}
					//}
					////gathering of some data and console printing
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
		};

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


/**
 * Checks if points are continuous
 * @param {Array<{x,y}>|Array<Array>} pointsArr array of objects with x and y properties, or array of arrays with two elements
 * @returns {boolean} true if all points are continuous, false otherwise
 */
function ArePointsContinuous(pointsArr) {
	const length = pointsArr.length;
	//check if points is array of {x, y} objects or array of arrays with two elements
	//checking only first element
	if (!Array.isArray(pointsArr) || length < 1)
		throw new Error("Invalid points array. Expected an array of objects with x and y properties.");

	let calcDX, calcDY;
	// Check if points are in {x, y} format or [x, y] format
	if (Array.isArray(pointsArr[0]) || !('x' in pointsArr[0]) || !('y' in pointsArr[0])) {
		calcDX = (prev, curr) => prev[0] - curr[0];
		calcDY = (prev, curr) => prev[1] - curr[1];
	} else {
		calcDX = (prev, curr) => prev.x - curr.x;
		calcDY = (prev, curr) => prev.y - curr.y;
	}

	// Check if all points are continuous
	for (let i = 1; i < length; i++) {
		const curr = pointsArr[i];
		const prev = pointsArr[i - 1];
		const dx = Math.abs(calcDX(curr, prev));
		const dy = Math.abs(calcDY(curr, prev));

		if (Math.max(dx, dy) > 1)
			return { result: false, offenderIndex: i, offender: curr }; // Not continuous
	}

	return { result: true }; // All points are continuous
}

/**
 * Finds duplicated point in an array of points, starting from a given index.
 * @param {Array<{x,y}>|Array<Array>} pointsArr array of objects with x and y properties, or array of arrays with two elements
 * @param {number} [startIndex] - Index to start searching from
 * @returns {{secondIndex: number, point: {x,y}|Array, firstIndex: number}|null} object with index, point, and firstIndex if duplicate found, null otherwise
 */
function FindDuplicatedPoint(pointsArr, startIndex = 0) {
	const getPointKeyFn = Array.isArray(pointsArr[0])
		? (point) => `${point[0]},${point[1]}`
		: (point) => `${point.x},${point.y}`;

	for (const pointMap = new Map(), length = pointsArr.length; startIndex < length; startIndex++) {
		const point = pointsArr[startIndex];
		const key = getPointKeyFn(point);
		const val = pointMap.get(key);
		if (val !== undefined)
			return { secondIndex: startIndex, firstIndex: val, point };

		pointMap.set(key, startIndex);
	}

	return null; // No duplicates found
}

/**
 * Linearly interpolates missing points between two coordinates (prev and curr).
 * Usage:
 * 		const test_missing = LerpMissingPoints([27, 29], [25, 32]);
 *		LocalLog(`test_missing: [27, 29] -> [25, 32]: ${test_missing.map(pt => pt.join(",")).join(" ")}`);
 * @param {[number,number]} prev - The starting point [x, y].
 * @param {[number,number]} curr - The ending point [x, y].
 * @param {function(number,number): boolean} isPointOk - A function that checks if a point is valid (e.g., not occupied by another point).
 * @returns {Array<[number,number]>} Array of interpolated points, including curr.
 */
function LerpMissingPoints(prev, curr, isPointOk) {
	const
		dx = curr[0] - prev[0],
		dy = curr[1] - prev[1];
	const step = Math.max(Math.abs(dx), Math.abs(dy));
	const
		stepX = dx / step,
		stepY = dy / step;

	const missing = [];
	for (let i = 1, stepXIncr = stepX, stepYIncr = stepY;
		i < step;
		i++, stepXIncr += stepX, stepYIncr += stepY) {

		let x, y, trying = 3, plus = 0;
		do {
			x = Math.floor(prev[0] + stepXIncr + (plus !== 0 && stepXIncr !== 0 ? 0 : plus));
			y = Math.floor(prev[1] + stepYIncr + (plus !== 0 && stepYIncr !== 0 ? 0 : plus));

			if (isPointOk(x, y)) {
				missing.push([x, y]);
				break; // Found a missing point, break the loop
			}
			plus = 1;
		}
		while (trying-- > 0);

	}
	missing.push(curr);

	return missing;
}

/*
// eslint-disable-next-line no-unused-vars
 function concavemanTesting() {
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
		LocalLog('decomp or concaveman error');
	}
}
*/

export { concaveman, GraphAI, ArePointsContinuous, LerpMissingPoints, FindDuplicatedPoint };
