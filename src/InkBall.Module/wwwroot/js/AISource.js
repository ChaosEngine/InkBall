import concaveman from "concaveman";

//globals loaded only once hopefully
let StatusEnum/*, sortPointsClockwise, IsPointOutsideAllPaths, LocalLog, sleep, pnpoly*/;

/**
 * AI operations class
 */
class GraphAI {
	#iGridWidth;
	#iGridHeight;
	#Points;
	#POINT_STARTING;
	#POINT_IN_PATH;

	constructor(parentStatusEnum, iGridWidth, iGridHeight, pointStore) {
		StatusEnum = parentStatusEnum;
		this.#iGridWidth = iGridWidth;
		this.#iGridHeight = iGridHeight;
		this.#Points = pointStore;
		this.#POINT_STARTING = StatusEnum.POINT_STARTING;
		this.#POINT_IN_PATH = StatusEnum.POINT_IN_PATH;
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
	/* async MarkAllCycles(graph, sHumanColor, lines) {



		const vertices = graph.vertices;
		const N = vertices.length;
		const vertexIndexMap = new Map(vertices.map((v, i) => [v, i])); // avoid O(N) indexOf in DFS
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
				//await sleep(10);


				// simple dfs on graph
				for (const adj of vertex.adjacents) {
					const v = vertexIndexMap.get(adj);
					// if it has not been visited previously
					if (v === undefined || v === par[u])
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
					//	await sleep(50);
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
			//return tab;
			return { cycles, free_human_player_points, cyclenumber };
		};

		// store the numbers of cycle
		let cyclenumber = 0, edges = N;

		// call DFS to mark the cycles
		for (let vind = 0; vind < N; vind++) {
			await dfs_cycle(vind + 1, vind);//, color, mark, par);
		}

		// function to print the cycles
		return await printCycles(edges, mark);
	} */
}

/**
 * Axis-Aligned Bounding Box (AABB) class.
 * Represents a rectangle defined by its minimum and maximum x and y coordinates.
 */
class AABB {
	/**
	 * Creates an Axis-Aligned Bounding Box.
	 * @param {number} minX - The minimum x-coordinate. defaults to Infinity for easy expansion.
	 * @param {number} minY - The minimum y-coordinate. defaults to Infinity for easy expansion.
	 * @param {number} maxX - The maximum x-coordinate. defaults to -Infinity for easy expansion.
	 * @param {number} maxY - The maximum y-coordinate. defaults to -Infinity for easy expansion.
	 */
	constructor(minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity) {
		this.minX = minX;
		this.minY = minY;
		this.maxX = maxX;
		this.maxY = maxY;
	}

	// /**
	//  * Creates an AABB that encloses all given points.
	//  * Points should be objects with 'x' and 'y' properties (e.g., {x: number, y: number}).
	//  * @param {Array<{x: number, y: number}>} points - An array of points.
	//  * @returns {AABB} A new AABB instance, or null if no points are provided.
	//  */
	// static fromPoints(points) {
	// 	if (!points || points.length === 0) {
	// 		return null; // Or throw an error, or return a default AABB
	// 	}

	// 	let minX = points[0].x;
	// 	let minY = points[0].y;
	// 	let maxX = minX;
	// 	let maxY = minY;

	// 	for (let i = 1; i < points.length; i++) {
	// 		const p = points[i];
	// 		if (p.x < minX) minX = p.x;
	// 		if (p.y < minY) minY = p.y;
	// 		if (p.x > maxX) maxX = p.x;
	// 		if (p.y > maxY) maxY = p.y;
	// 	}
	// 	return new AABB(minX, minY, maxX, maxY);
	// }

	/**
	 * Expands the AABB by a given delta in x and y directions.
	 * This method does modify the original AABB.
	 * @param {number} delta - The amount to expand in the x and y direction.
	 * @param {number} minHeight - Minimum height constraint.
	 * @param {number} minWidth - Minimum width constraint.
	 * @param {number} maxHeight - Maximum height constraint.
	 * @param {number} maxWidth - Maximum width constraint.
	 */
	expand(delta, minHeight, minWidth, maxHeight, maxWidth) {

		this.minX = Math.min(Math.max(this.minX - delta, minWidth), maxWidth);
		this.minY = Math.min(Math.max(this.minY - delta, minHeight), maxHeight);

		this.maxX = Math.max(Math.min(this.maxX + delta, maxWidth), minWidth);
		this.maxY = Math.max(Math.min(this.maxY + delta, maxHeight), minHeight);
	}

	/**
	 * Updates the AABB min/max coordinates to include a new point (x, y).
	 * This method modifies the original AABB.
	 * @param {number} x - The x-coordinate of the point to include.
	 * @param {number} y - The y-coordinate of the point to include.
	 */
	updateMinMax(x, y) {
		if (x < this.minX) this.minX = x;
		if (y < this.minY) this.minY = y;
		if (x > this.maxX) this.maxX = x;
		if (y > this.maxY) this.maxY = y;
	}

	// /**
	//  * Returns a new AABB that is expanded to include the given point.
	//  * @param {number} x - The x-coordinate of the point.
	//  * @param {number} y - The y-coordinate of the point.
	//  * @returns {AABB} A new, expanded AABB instance.
	//  */
	// expandToIncludePoint(x, y) {
	// 	return new AABB(
	// 		Math.min(this.minX, x),
	// 		Math.min(this.minY, y),
	// 		Math.max(this.maxX, x),
	// 		Math.max(this.maxY, y)
	// 	);
	// }

	// /**
	//  * Creates an AABB from a top-left corner (x, y), width, and height.
	//  * @param {number} x - The x-coordinate of the top-left corner.
	//  * @param {number} y - The y-coordinate of the top-left corner.
	//  * @param {number} width - The width of the AABB.
	//  * @param {number} height - The height of the AABB.
	//  * @returns {AABB} A new AABB instance.
	//  */
	// static fromXYWidthHeight(x, y, width, height) {
	// 	if (width < 0 || height < 0) {
	// 		LocalError("AABB.fromXYWidthHeight: Width and height should be non-negative.");
	// 		return new AABB(x, y, x, y); // Degenerate AABB
	// 	}
	// 	return new AABB(x, y, x + width, y + height);
	// }

	// /**
	//  * Creates an AABB from a center point and dimensions (width, height).
	//  * @param {number} centerX - The x-coordinate of the center.
	//  * @param {number} centerY - The y-coordinate of the center.
	//  * @param {number} width - The width of the AABB.
	//  * @param {number} height - The height of the AABB.
	//  * @returns {AABB} A new AABB instance.
	//  */
	// static fromCenterSize(centerX, centerY, width, height) {
	// 	if (width < 0 || height < 0) {
	// 		LocalError("AABB.fromCenterSize: Width and height should be non-negative.");
	// 		return new AABB(centerX, centerY, centerX, centerY); // Degenerate AABB
	// 	}
	// 	const halfWidth = width / 2;
	// 	const halfHeight = height / 2;
	// 	return new AABB(
	// 		centerX - halfWidth,
	// 		centerY - halfHeight,
	// 		centerX + halfWidth,
	// 		centerY + halfHeight
	// 	);
	// }

	// /**
	//  * Gets the width of the AABB.
	//  * @returns {number} The width of the AABB.
	//  */
	// get width() {
	// 	return this.maxX - this.minX;
	// }

	// /**
	//  * Gets the height of the AABB.
	//  * @returns {number} The height of the AABB.
	//  */
	// get height() {
	// 	return this.maxY - this.minY;
	// }

	// /**
	//  * Gets the x-coordinate of the center of the AABB.
	//  * @returns {number} The x-coordinate of the center.
	//  */
	// get centerX() {
	// 	return this.minX + this.width / 2;
	// }

	// /**
	//  * Gets the y-coordinate of the center of the AABB.
	//  * @returns {number} The y-coordinate of the center.
	//  */
	// get centerY() {
	// 	return this.minY + this.height / 2;
	// }

	// /**
	//  * Checks if this AABB is valid (min coordinates are less than or equal to max coordinates).
	//  * @returns {boolean} True if valid, false otherwise.
	//  */
	// isValid() {
	// 	return this.minX <= this.maxX && this.minY <= this.maxY;
	// }

	// /**
	//  * Checks if this AABB intersects with another AABB.
	//  * @param {AABB} other - The other AABB to check against.
	//  * @returns {boolean} True if they intersect, false otherwise.
	//  */
	// intersects(other) {
	// 	if (!other || !(other instanceof AABB)) return false;
	// 	return (
	// 		this.minX < other.maxX &&
	// 		this.maxX > other.minX &&
	// 		this.minY < other.maxY &&
	// 		this.maxY > other.minY
	// 	);
	// }

	// /**
	//  * Checks if a point (x, y) is contained within this AABB (inclusive of edges).
	//  * @param {number} x - The x-coordinate of the point.
	//  * @param {number} y - The y-coordinate of the point.
	//  * @returns {boolean} True if the point is contained, false otherwise.
	//  */
	// containsPoint(x, y) {
	// 	return (
	// 		x >= this.minX &&
	// 		x <= this.maxX &&
	// 		y >= this.minY &&
	// 		y <= this.maxY
	// 	);
	// }

	// /**
	//  * Checks if another AABB is fully contained within this AABB.
	//  * @param {AABB} other - The other AABB.
	//  * @returns {boolean} True if the other AABB is fully contained, false otherwise.
	//  */
	// containsAABB(other) {
	// 	if (!other || !(other instanceof AABB)) return false;
	// 	return (
	// 		this.minX <= other.minX &&
	// 		this.minY <= other.minY &&
	// 		this.maxX >= other.maxX &&
	// 		this.maxY >= other.maxY
	// 	);
	// }

	// /**
	//  * Returns a new AABB that is the union of this AABB and another AABB.
	//  * The union is the smallest AABB that contains both.
	//  * @param {AABB} other - The other AABB.
	//  * @returns {AABB} A new AABB instance representing the union.
	//  */
	// union(other) {
	// 	if (!other || !(other instanceof AABB)) return this.clone(); // Or throw error
	// 	return new AABB(
	// 		Math.min(this.minX, other.minX),
	// 		Math.min(this.minY, other.minY),
	// 		Math.max(this.maxX, other.maxX),
	// 		Math.max(this.maxY, other.maxY)
	// 	);
	// }

	// /**
	//  * Returns a new AABB that is the intersection of this AABB and another AABB.
	//  * If they do not intersect, returns null.
	//  * @param {AABB} other - The other AABB.
	//  * @returns {AABB|null} A new AABB instance representing the intersection, or null.
	//  */
	// intersection(other) {
	// 	if (!other || !(other instanceof AABB) || !this.intersects(other)) {
	// 		return null;
	// 	}
	// 	return new AABB(
	// 		Math.max(this.minX, other.minX),
	// 		Math.max(this.minY, other.minY),
	// 		Math.min(this.maxX, other.maxX),
	// 		Math.min(this.maxY, other.maxY)
	// 	);
	// }
	//
	// /**
	//  * Returns a new AABB that is expanded to include another AABB (same as union).
	//  * @param {AABB} other - The other AABB.
	//  * @returns {AABB} A new, expanded AABB instance.
	//  */
	// expandToIncludeAABB(other) {
	// 	return this.union(other);
	// }

	// /**
	//  * Creates a new AABB instance with the same dimensions and position.
	//  * @returns {AABB} A new AABB instance.
	//  */
	// clone() {
	// 	return new AABB(this.minX, this.minY, this.maxX, this.maxY);
	// }

	// /**
	//  * Moves the AABB by a given delta x and delta y.
	//  * Returns a new, moved AABB instance.
	//  * @param {number} dx - The change in x.
	//  * @param {number} dy - The change in y.
	//  * @returns {AABB} A new AABB instance at the new position.
	//  */
	// translate(dx, dy) {
	// 	return new AABB(
	// 		this.minX + dx,
	// 		this.minY + dy,
	// 		this.maxX + dx,
	// 		this.maxY + dy
	// 	);
	// }

	// /**
	//  * Returns a string representation of the AABB.
	//  * @returns {string} String representation of the AABB.
	//  */
	// toString() {
	// 	return `AABB(minX: ${this.minX}, minY: ${this.minY}, maxX: ${this.maxX}, maxY: ${this.maxY}, width: ${this.width}, height: ${this.height})`;
	// }
}


/**
 * Checks if points are continuous
 * @param {Array<{x,y}>|Array<Array>} pointsArr array of objects with x and y properties, or array of arrays with two elements
 * @returns {{result:boolean, offenderIndex?:number, offender?:object|Array}} continuity status with optional offending point details
 */
function ArePointsContinuous(pointsArr) {
	const length = pointsArr?.length ?? 0;
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
		const chebyshevDistance = Math.max(dx, dy);

		// 8-neighborhood continuity: each next point must be at most one cell away.
		if (chebyshevDistance > 1)
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
		? ([x, y]) => `${x},${y}`
		: ({ x, y }) => `${x},${y}`;

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

export { concaveman, GraphAI, ArePointsContinuous, LerpMissingPoints, FindDuplicatedPoint, AABB };
