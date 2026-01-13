import { GraphAI, concaveman, ArePointsContinuous, FindDuplicatedPoint } from "./AISource.js";
// import { SvgVml, StatusEnum, LocalLog, LocalError, sortPointsClockwise, pnpoly, IsPointOutsideAllPaths } from "./shared.js";
import { astar, Graph as AStarGraph } from "javascript-astar";
import * as clustering from "density-clustering";

//globals loaded only once hopefully
let SvgVml, StatusEnum, LocalLog, LocalError, sortPointsClockwise, pnpoly, IsPointOutsideAllPaths, AABB;

// This is the entry point for our worker
addEventListener('message', async function (e) {

	if (SvgVml === undefined) {
		const isMinified = location.hostname !== "localhost";

		({ SvgVml, StatusEnum, LocalLog, LocalError, sortPointsClockwise, pnpoly, IsPointOutsideAllPaths, AABB } = await import(/* webpackIgnore: true */`./shared${isMinified ? '.min' : ''}.js`));
	}


	const params = e.data;
	const { operation } = params;

	switch (operation) {
		case "BUILD_GRAPH":
			{
				const svgVml = new SvgVml();
				svgVml.Init(null, null, null, params.boardSize);

				//debugger;
				const lines = params.paths.map(pa => svgVml.DeserializePolyline(pa));
				const points = new Map();
				params.points.forEach(({ key, value }) => {
					points.set(key, svgVml.DeserializeOval(value));
				});

				LocalLog(`lines.count = ${lines.length}, points.count = ${points.size}`);

				const ai = new GraphAI(params.boardSize.iGridWidth, params.boardSize.iGridHeight, points);
				const graph = await ai.BuildGraph({
					freePointStatus: StatusEnum.POINT_FREE_BLUE
					//, cpufillCol: 'var(--bluish)', 
				});
				//LocalLog(graph);

				postMessage({ operation, params: graph });
			}
			break;

		case "CONCAVEMAN":
			{
				switch (params.subOperation) {
					case "BY_POINTS":
						{
							const svgVml = new SvgVml();
							svgVml.Init(null, null, null, params.boardSize);

							const points = new Map();
							params.points.forEach((pt) => {
								points.set(pt.key, svgVml.DeserializeOval(pt.value));
							});
							const ai = new GraphAI(params.boardSize.iGridWidth, params.boardSize.iGridHeight, points);
							const clicked_status = params.clickedPointStatus;
							const graph = await ai.BuildGraph({
								freePointStatus: clicked_status
								//, cpufillCol: clicked_status === StatusEnum.POINT_FREE_RED ? 'var(--redish)' : 'var(--bluish)',
							});
							const vertices = graph.vertices.map(function (pt) {
								const { x, y } = pt.GetPosition();
								return [x, y];
							});

							let convex_hull = null, cw_sorted_verts;
							if (vertices.length > 0) {
								convex_hull = concaveman(vertices, params.concavity ?? 2.0, params.lengthThreshold ?? 0.0);

								const mapped_verts = convex_hull.map(([x, y]) => ({ x, y }));
								cw_sorted_verts = sortPointsClockwise(mapped_verts);
							}

							postMessage({ operation, convex_hull, cw_sorted_verts });
						}
						break;
					case "BY_COORDS":
						{
							const { concavity, lengthThreshold,
								points, humanPoints, interceptingPoints,
								iGridHeight, iGridWidth } = params;

							const { convex_hull, interceptedPoints, numOfNonContinuous, numOfDuplicatesFixed } =
								CalculateConcavemanAndValidate(concavity, lengthThreshold,
									points, humanPoints, interceptingPoints,
									iGridHeight, iGridWidth);

							postMessage({
								operation,
								convex_hull,
								interceptedPoints,
								numOfNonContinuous,
								numOfDuplicatesFixed
							});
						}
						break;

					default:
						throw new Error(`unknown params.subOperation = ${params.subOperation}`);
				}
			}
			break;

		case "MARK_ALL_CYCLES":
			{
				const svgVml = new SvgVml();
				svgVml.Init(null, null, null, params.boardSize);

				const lines = params.paths.map(pa => svgVml.DeserializePolyline(pa));
				const points = new Map();
				params.points.forEach((pt) => {
					points.set(pt.key, svgVml.DeserializeOval(pt.value));
				});
				const ai = new GraphAI(params.state.iGridWidth, params.state.iGridHeight, points);
				const graph = await ai.BuildGraph({
					freePointStatus: StatusEnum.POINT_FREE_BLUE
					//, cpufillCol: params.colorBlue,
				});
				const result = await ai.MarkAllCycles(graph, params.colorRed, lines);


				postMessage({
					operation,
					cycles: result.cycles,
					free_human_player_points: result.free_human_player_points,
					cyclenumber: result.cyclenumber
				});
			}
			break;

		case "FIND_SURROUNDABLE_POINTS":
			{
				const svgVml = new SvgVml();
				svgVml.Init(null, null, null, params.boardSize);

				const allLines = params.allLines.map(pa => svgVml.DeserializePolyline(pa));
				const all_points = params.allPoints.map(pt => svgVml.DeserializeOval(pt));
				const working_points = params.workingPoints.map(pt => svgVml.DeserializeOval(pt));

				const sHumanColor = params.sHumanColor, sCPUColor = params.sCPUColor;
				const human_point_statuses = [StatusEnum.POINT_FREE_RED, StatusEnum.POINT_IN_PATH];
				const cpu_point_statuses = [StatusEnum.POINT_FREE_BLUE, StatusEnum.POINT_IN_PATH];



				const results = [];
				for (const pt of working_points) {
					if (pt !== undefined && pt.GetFillColor() === sHumanColor
						&& human_point_statuses.includes(pt.GetStatus())) {
						const { x, y } = pt.GetPosition();
						if (false === IsPointOutsideAllPaths(x, y, allLines)) {
							LocalLog("!!!Point inside path!!!");
							continue;
						}
						for (let radius = 1; radius <= 4; radius++) {
							const possible = [];

							//pt,x,y is good "surroundable point"
							//let's find closes CPU points to it lying on circle
							for (const cpu_pt of all_points) {
								if (cpu_pt !== undefined && cpu_pt.GetFillColor() === sCPUColor
									&& cpu_point_statuses.includes(cpu_pt.GetStatus())) {
									const { x: cpu_x, y: cpu_y } = cpu_pt.GetPosition();
									if (false === IsPointOutsideAllPaths(cpu_x, cpu_y, allLines))
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

				postMessage({ operation, results });
			}
			break;

		case "ASTAR":
			{
				const { arr, start, end } = params;

				const graphDiagonal = new AStarGraph(arr, { diagonal: true });

				const resultWithDiagonals = AstarPathFind(graphDiagonal, start.y, start.x, end.y, end.x);
				LocalLog(resultWithDiagonals);

				postMessage({ operation, resultWithDiagonals });
			}
			break;

		case "CLUSTERING":
			{
				const { method, dataset, numberOfClusters, neighborhoodRadius, minPointsPerCluster } = params;

				const clusteringResult = CalculateClustering(operation, method, dataset,
					numberOfClusters, neighborhoodRadius, minPointsPerCluster);

				postMessage(clusteringResult);
			}
			break;

		case "CLUSTERING_AND_CONCAVEMAN":
			{
				const svgVml = new SvgVml();
				svgVml.Init(null, null, null, params.boardSize);

				//clustering first
				const { method, numberOfClusters, neighborhoodRadius, minPointsPerCluster,
					humanPointStatuses, humanPointColor, COLOR_OWNED_RED, COLOR_OWNED_BLUE,
					visuals
				} = params;

				const allPoints = new Map();
				params.allPoints.forEach(pt => {
					allPoints.set(pt.key, svgVml.DeserializeOval(pt.value));
				});
				const humanPointsArrOfArr = [];

				for (const pt of allPoints.values()) {
					if (pt !== undefined && pt.GetFillColor() === humanPointColor && humanPointStatuses.includes(pt.GetStatus())) {
						const { x, y } = pt.GetPosition();
						//density clustering algorithm needs array of array of points only
						humanPointsArrOfArr.push([x, y]);
					}
				}

				const { clusters } = CalculateClustering(operation, method, humanPointsArrOfArr,
					numberOfClusters, neighborhoodRadius, minPointsPerCluster);


				//for each cluster, process it's point group
				//and create a convex hull around it, then display it
				let results = [];
				g_graphDiagonal = null; //reset grid for Astar usage
				if (clusters?.length > 0) {
					const { concavity, lengthThreshold, boardSize } = params;
					const { iGridHeight, iGridWidth } = boardSize;

					clusterLoop:
					for (const point_indexes of clusters) {
						const clustered_point_coords = []; //array of points and coordinates

						for (const index of point_indexes) {
							//mark those cluster found points visually
							//get x,y coordinates of point from cluster input array of arrays back
							const [x, y] = humanPointsArrOfArr[index];
							const pt = allPoints.get(y * iGridWidth + x); //get point from points store
							if (pt) {
								if (!(x >= 0 && x < iGridWidth && y >= 0 && y < iGridHeight)) {
									LocalLog(`Point (${x},${y}) %cout of bounds;`, "color: orange; font-weight: bold", ' will not try to surround.');
									continue clusterLoop;
								}

								clustered_point_coords.push({ x, y }); //add points and coordinates to array
							}
						}

						let rects2Draw = [];
						const createRectForVisualsFunction = visuals
							? (i, j, width, height) => { rects2Draw.push({ i, j, width, height }); }
							: () => { /* dummy filler func*/ };
						const surrounding_path = CalculateWrappingPathFromDividedBoundingBoxes(
							allPoints, iGridHeight, iGridWidth, clustered_point_coords, createRectForVisualsFunction,
							[humanPointColor, COLOR_OWNED_RED, COLOR_OWNED_BLUE]
						);

						//9. calculate concaveman around those points
						const { convex_hull, interceptedPoints, numOfNonContinuous, numOfDuplicatesFixed } =
							CalculateConcavemanAndValidate(concavity, lengthThreshold, surrounding_path, humanPointsArrOfArr, clustered_point_coords, iGridHeight, iGridWidth);


						//10. get points of convex hull and create a polyline around it
						if (convex_hull?.length > 0) {
							results.push({ convex_hull, interceptedPoints, surrounding_path, numOfNonContinuous, numOfDuplicatesFixed, rects2Draw, clustered_point_coords }); //add points in cluster to array of clusters

							// LocalLog(`Planned path points #${results.length} around bounding box points(${surrounding_path.length}): ${surrounding_path.reduce((acc, [x, y]) => acc + `${x},${y} `, '').trimEnd()}`);

							// const poly_points = convex_hull.reduce((acc, { x, y }) => acc + `${x},${y} `, '').trimEnd();
							// LocalLog(`<polyline points='${poly_points}'></polyline>`);
						}

					}
					LocalLog({ clusteringMethod: method, clustersPoints: results });
				}
				postMessage({ operation, results });
			}
			break;

		default:
			LocalError(`unknown operation = ${operation}`);
			break;
	}
});

function AstarPathFind(graphDiagonal, fromY, fromX, toY, toX) {
	// const graphDiagonal = new AStarGraph(arr, { diagonal: true });

	const from = graphDiagonal.grid[fromY][fromX];
	const to = graphDiagonal.grid[toY][toX];

	const resultWithDiagonalsInvertedXY = astar.search(graphDiagonal, from, to, { heuristic: astar.heuristics.diagonal });

	const resultWithDiagonals = resultWithDiagonalsInvertedXY.map(obj => ({
		...obj,
		x: obj.y,
		y: obj.x
	}));

	return resultWithDiagonals;
}

function CalculateWrappingPathFromDividedBoundingBoxes(allPoints, iGridHeight, iGridWidth, pointCoords, createRectForVisualsFunc, humanPointColors) {

	//0. create bounding box around points wrapping all points in cluster
	const wrapping_bbox = AABB.fromPoints(pointCoords);
	wrapping_bbox.expand(1, 0, 0, iGridHeight - 1, iGridWidth - 1);//expand it a bit by 1 unit in all directions -> enlarge it

	// //draw bounding box for visualization
	// LocalLog(`wrapping_bbox: ${JSON.stringify(wrapping_bbox)}`);

	// createRectForVisualsFunc(wrapping_bbox.minX, wrapping_bbox.minY,
	// 	wrapping_bbox.maxX - wrapping_bbox.minX, wrapping_bbox.maxY - wrapping_bbox.minY);



	//1. Convert candidate_path to a Map to ensure uniqueness by x,y and to avoid duplicates
	//this hold points of prepared surrounding path
	const candidate_path = new Map();
	//2. devide wrapping_bbox into 1x1 unit bbox and gather matching points
	for (let j = wrapping_bbox.minY; j < wrapping_bbox.maxY; j++) {
		for (let i = wrapping_bbox.minX; i < wrapping_bbox.maxX; i++) {

			const current_unit_bbox = [
				// { x: i, y: j, ind: 0 },
				{ x: i + 1, y: j, ind: 1 },
				{ x: i, y: j + 1, ind: 2 },
				{ x: i + 1, y: j + 1, ind: 3 }
			];

			//3. check if any created bbox point contains any of the points in point_coords (cluster points)
			const contains_oponent_cluster_point = current_unit_bbox.filter(({ x, y }) => {
				// if (!(x >= 0 && x < this.#iGridWidth && y >= 0 && y < this.#iGridHeight)) {
				// 	// LocalLog(`Out-of-bounds point (${x},${y}) 1`);
				// 	return false;
				// } else
				return pointCoords.some(pt => pt.x === x && pt.y === y);
			});
			if (contains_oponent_cluster_point.length > 0) {
				//4. if so, create a rectangle around it 1x1 unit fir visualization
				createRectForVisualsFunc(i, j, 1, 1);
				//5. i,j and i+1, j+1 are dimensions of the bounding box
				// 	 find which points of it are NOT included in point_coords
				// 	 3 points of the rectangle
				for (const { x, y, ind } of current_unit_bbox) {
					// if (!(x >= 0 && x < this.#iGridWidth && y >= 0 && y < this.#iGridHeight)) {
					// 	// LocalLog(`Out-of-bounds point (${x},${y}) 2`);
					// 	continue;
					// }

					//6. not included in point_coords (not from cluster points), so they should be around
					// 	 cluster points, or inside
					const point = allPoints.get(y * iGridWidth + x);
					if (point !== undefined && humanPointColors.includes(point.GetFillColor()))
						continue; //skip human points

					if (!contains_oponent_cluster_point.some(q => q.ind !== ind && q.x === x && q.y === y)
						//no duplicates from already added points
						&& !candidate_path.has(`${x},${y}`)) {
						//7. add point to candidate path map
						candidate_path.set(`${x},${y}`, [x, y]);
					}
				}
			}
		}
	}

	//8. convert candidate_path_map to array of points
	const surrounding_path = [...candidate_path.values()];
	return surrounding_path;
}

function CalculateClustering(operation, method, dataset, numberOfClusters, neighborhoodRadius, minPointsPerCluster) {
	switch (method) {
		case "KMEANS":
			{
				const kmeans = new clustering.KMEANS();
				// parameters: 3 - number of clusters
				const clusters = kmeans.run(dataset, numberOfClusters);

				// LocalLog({ method, clusters });
				clusters.sort((a, b) => a.length - b.length);
				return { operation, method, clusters };
			}

		case "OPTICS":
			{
				const optics = new clustering.OPTICS();
				// parameters: 2 - neighborhood radius, 2 - number of points in neighborhood to form a cluster
				const clusters = optics.run(dataset, neighborhoodRadius, minPointsPerCluster);
				const plot = optics.getReachabilityPlot();

				// LocalLog({ method, clusters, plot });
				clusters.sort((a, b) => a.length - b.length);
				return { operation, method, clusters, plot };
			}
		case "DBSCAN":
			{
				const dbscan = new clustering.DBSCAN();
				// parameters: 5 - neighborhood radius, 2 - number of points in neighborhood to form a cluster
				const clusters = dbscan.run(dataset, neighborhoodRadius, minPointsPerCluster);
				const noise = dbscan.noise;

				// LocalLog({ method, clusters, noise });
				clusters.sort((a, b) => a.length - b.length);
				return { operation, method, clusters, noise };
			}

		default:
			throw new Error("bad or no clustering method");
	}
}

let g_graphDiagonal = null;

function CalculateConcavemanAndValidate(concavity, lengthThreshold,
	vertices, humanPoints, interceptingPoints,
	iGridHeight, iGridWidth, maxFixAttempts = 15) {

	let convex_hull = null, real_surrounded_points, numOfNonContinuous = 0, numOfDuplicatesFixed = 0;

	if (vertices.length > 0) {

		convex_hull = concaveman(vertices, concavity ?? 2.0, lengthThreshold ?? 0.0);
		do {
			const continuous_result = ArePointsContinuous(convex_hull);
			if (!continuous_result.result) {
				numOfNonContinuous++;
				LocalLog(`Concaveman result is not continuous, please check your input points. offenderIndex: %c${continuous_result.offenderIndex}, offender: %c${continuous_result.offender}`, 'color:orange;font-weight:bold', 'color:red;font-weight:bold');

				const prev = convex_hull.at(continuous_result.offenderIndex - 1);
				const curr = convex_hull.at(continuous_result.offenderIndex);

				if (g_graphDiagonal === null) {
					// Initialize arr with 1s
					const grid = Array.from({ length: iGridHeight + 1 }, () => Array(iGridWidth + 1).fill(1));

					// Mark human points as not accessible/obstacles, inverted x,y coords -> y,x
					for (const [x, y] of humanPoints) grid[y][x] = 0;

					g_graphDiagonal = new AStarGraph(grid, { diagonal: true });
				}

				// Call ASTAR to find missing points between prev and curr
				const missing = AstarPathFind(g_graphDiagonal, prev[1], prev[0], curr[1], curr[0])
					.map(({ x, y }) => [x, y]);

				convex_hull = convex_hull.slice(0, continuous_result.offenderIndex)
					.concat(missing)
					.concat(convex_hull.slice(continuous_result.offenderIndex + 1));

				LocalLog(`Concaveman result fixed by adding ${missing.length} points between %c${prev} and ${curr}, %cmissing: ${missing.map(pt => pt.join(",")).join(" ")}`, 'color:orange; font-weight:bold', 'color:red;font-weight:bold');
			} else {
				break;
			}
		} while ((--maxFixAttempts) > 0);

		maxFixAttempts = 15;
		do {
			const duplicated_point_result = FindDuplicatedPoint(convex_hull, 1);
			if (duplicated_point_result !== null) {
				convex_hull.splice(
					duplicated_point_result.firstIndex,
					duplicated_point_result.secondIndex - duplicated_point_result.firstIndex
				);
				numOfDuplicatesFixed++;
			} else {
				break;
			}
		} while ((--maxFixAttempts) > 0);

		//now count how many points from original cluster are inside the convex hull polygon...
		real_surrounded_points = [];
		convex_hull = convex_hull.map(([x, y]) => ({ x, y }));
		for (const pt of interceptingPoints) {
			//check if point is inside convex hull polygon
			if (true === pnpoly(convex_hull, pt.x, pt.y))
				real_surrounded_points.push(pt);
		}
		//...if > 10% of points from original cluster are inside convex hull, we have a good candidate
		if (real_surrounded_points.length < Math.ceil(interceptingPoints.length * 0.1)) {
			LocalLog(`Only ${real_surrounded_points.length} points inside convex hull out of ${interceptingPoints.length} in cluster, %cneed more than ${Math.ceil(interceptingPoints.length * 0.1)}!`, "color: orange;font-weight: bold");

			real_surrounded_points = null;
		}
	}

	return { convex_hull, interceptedPoints: real_surrounded_points, numOfNonContinuous, numOfDuplicatesFixed };
}

// LocalLog('Worker loaded');
