// @ts-nocheck
import { describe, expect, test, afterEach } from "bun:test";
import { Graph as AStarGraph } from "javascript-astar";
import {
	AstarPathFind,
	CalculateClustering,
	CalculateConcavemanAndValidate,
	CalculateWrappingPathFromDividedBoundingBoxes,
	CountInterceptedPoints,
	DeserializePointMap,
	DeserializePolylines,
	FixDuplicatedHullPoints,
	HandleWorkerOperation,
	__resetWorkerGlobalsForTests,
	__setSharedDepsForTests
} from "../../src/InkBall.Module/wwwroot/js/AIWorker.js";

afterEach(() => {
	__resetWorkerGlobalsForTests();
});

describe("AIWorker helpers", () => {
	test("DeserializePointMap and DeserializePolylines use provided svg adapter", () => {
		const svg = {
			DeserializeOval: (val: unknown) => ({ kind: "oval", val }),
			DeserializePolyline: (val: unknown) => ({ kind: "poly", val })
		};

		const points = DeserializePointMap(svg as never, [{ key: 5, value: { x: 1, y: 2 } }]);
		expect(points.get(5)).toEqual({ kind: "oval", val: { x: 1, y: 2 } });

		const lines = DeserializePolylines(svg as never, [{ iId: 1 }]);
		expect(lines).toEqual([{ kind: "poly", val: { iId: 1 } }]);
	});

	test("AstarPathFind finds route on simple grid", () => {
		const grid = [
			[1, 1, 1],
			[1, 0, 1],
			[1, 1, 1]
		];
		const graph = new AStarGraph(grid, { diagonal: true });
		const route = AstarPathFind(graph, [0, 0], [2, 2]);

		expect(route.length).toBeGreaterThan(0);
		expect(route.at(-1)).toEqual([2, 2]);
	});

	test("CalculateClustering supports KMEANS/OPTICS/DBSCAN", () => {
		const dataset = [[0, 0], [0, 1], [10, 10], [11, 10]];

		const kmeans = CalculateClustering("CLUSTERING", "KMEANS", dataset, 2, 1, 2);
		expect(kmeans.method).toBe("KMEANS");
		expect(kmeans.clusters.length).toBe(2);

		const optics = CalculateClustering("CLUSTERING", "OPTICS", dataset, 2, 2, 2);
		expect(optics.method).toBe("OPTICS");
		expect(Array.isArray(optics.plot)).toBe(true);

		const dbscan = CalculateClustering("CLUSTERING", "DBSCAN", dataset, 2, 2, 2);
		expect(dbscan.method).toBe("DBSCAN");
		expect(Array.isArray(dbscan.noise)).toBe(true);
	});

	test("FixDuplicatedHullPoints removes duplicates", () => {
		const input: Array<[number, number]> = [[0, 0], [1, 1], [1, 1], [2, 2]];
		const result = FixDuplicatedHullPoints(input, 10);
		expect(result.numOfDuplicatesFixed).toBeGreaterThan(0);
		expect(result.convex_hull).toEqual([[0, 0], [1, 1], [2, 2]]);
	});

	test("CountInterceptedPoints returns intercepted points when threshold met", () => {
		__setSharedDepsForTests({
			pnpoly: (_poly: unknown, x: number, y: number) => x === 1 && y === 1,
			LocalLog: () => { }
		});

		const hull: Array<[number, number]> = [[0, 0], [2, 0], [2, 2], [0, 2]];
		const intercepting = new Map([
			[1, { x: 1, y: 1 }],
			[2, { x: 3, y: 3 }]
		]);

		const result = CountInterceptedPoints(hull, intercepting, "#f00", 0.5);
		expect(result.surrounded_points).toEqual([{ x: 1, y: 1 }]);
	});

	test("CalculateWrappingPathFromDividedBoundingBoxes supports single and pair point fast paths", () => {
		const emptyMap = new Map();
		const bbox = {
			minX: 0,
			minY: 0,
			maxX: 0,
			maxY: 0,
			expand: () => { }
		};

		const onePoint = new Map([[5, { x: 2, y: 3 }]]);
		const oneRes = CalculateWrappingPathFromDividedBoundingBoxes(emptyMap, 10, 10, onePoint, [1], bbox as never, () => { });
		expect(oneRes).toEqual([[1, 3], [3, 3], [2, 4], [2, 2]]);

		const twoPointsHorizontal = new Map([[11, { x: 1, y: 1 }], [12, { x: 2, y: 1 }]]);
		const twoRes = CalculateWrappingPathFromDividedBoundingBoxes(emptyMap, 10, 10, twoPointsHorizontal, [1], bbox as never, () => { });
		expect(twoRes).toEqual([[1, 0], [2, 0], [2, 2], [0, 1], [3, 1]]);
	});

	test("CalculateConcavemanAndValidate returns structured result for simple vertices", () => {
		__setSharedDepsForTests({ pnpoly: () => true, LocalLog: () => { } });

		const result = CalculateConcavemanAndValidate(
			2.0,
			0.0,
			[[0, 0], [1, 0], [1, 1], [0, 1]],
			[],
			new Map([[0, { x: 0, y: 0 }], [1, { x: 1, y: 1 }]]),
			5,
			5,
			"#abc",
			new Set(),
			10
		);

		expect(Array.isArray(result.convex_hull)).toBe(true);
		expect(Array.isArray(result.interceptedPoints)).toBe(true);
		expect(typeof result.numOfNonContinuous).toBe("number");
		expect(typeof result.numOfDuplicatesFixed).toBe("number");
	});
});

describe("AIWorker operation dispatch", () => {
	const StatusEnumMock = {
		POINT_FREE_RED: -3,
		POINT_FREE_BLUE: -2,
		POINT_FREE: -1,
		POINT_STARTING: 0,
		POINT_IN_PATH: 1,
		POINT_OWNED_BY_RED: 2,
		POINT_OWNED_BY_BLUE: 3
	};

	class MockSvgVml {
		Init(_boardSize: unknown) {
			return;
		}

		DeserializeOval(value: { x: number; y: number; Status: number; Color: string }) {
			return {
				GetPosition: () => ({ x: value.x, y: value.y }),
				GetStatus: () => value.Status,
				GetFillColor: () => value.Color
			};
		}

		DeserializePolyline(value: unknown) {
			return {
				GetPointsArray: () => value
			};
		}
	}

	test("HandleWorkerOperation processes CLUSTERING", async () => {
		const result = await HandleWorkerOperation({
			operation: "CLUSTERING",
			method: "KMEANS",
			dataset: [[0, 0], [0, 1], [10, 10], [11, 10]],
			numberOfClusters: 2,
			neighborhoodRadius: 2,
			minPointsPerCluster: 2
		});

		expect(result?.operation).toBe("CLUSTERING");
		expect(result?.method).toBe("KMEANS");
		expect(result?.clusters.length).toBe(2);
	});

	test("HandleWorkerOperation processes ASTAR", async () => {
		__setSharedDepsForTests({ LocalLog: () => { } });

		const result = await HandleWorkerOperation({
			operation: "ASTAR",
			arr: [
				[1, 1, 1],
				[1, 0, 1],
				[1, 1, 1]
			],
			start: { x: 0, y: 0 },
			end: { x: 2, y: 2 }
		});

		expect(result?.operation).toBe("ASTAR");
		expect(Array.isArray(result?.resultWithDiagonals)).toBe(true);
		expect(result?.resultWithDiagonals.at(-1)).toEqual([2, 2]);
	});

	test("HandleWorkerOperation processes BUILD_GRAPH", async () => {
		__setSharedDepsForTests({
			SvgVml: MockSvgVml,
			StatusEnum: StatusEnumMock,
			LocalLog: () => { }
		});

		const result = await HandleWorkerOperation({
			operation: "BUILD_GRAPH",
			boardSize: { iGridWidth: 3, iGridHeight: 3 },
			paths: [],
			points: [
				{ key: 0, value: { x: 0, y: 0, Status: -2, Color: "#00f" } },
				{ key: 1, value: { x: 1, y: 0, Status: -2, Color: "#00f" } },
				{ key: 4, value: { x: 1, y: 1, Status: 2, Color: "#f00" } }
			]
		});

		expect(result?.operation).toBe("BUILD_GRAPH");
		expect(result?.params.vertices.length).toBe(2);
		expect(result?.params.edges.length).toBe(1);
	});

	test("HandleWorkerOperation processes CONCAVEMAN BY_POINTS", async () => {
		__setSharedDepsForTests({
			SvgVml: MockSvgVml,
			StatusEnum: StatusEnumMock,
			sortPointsClockwise: (pts: Array<{ x: number; y: number }>) => pts,
			LocalLog: () => { }
		});

		const result = await HandleWorkerOperation({
			operation: "CONCAVEMAN",
			subOperation: "BY_POINTS",
			boardSize: { iGridWidth: 4, iGridHeight: 4 },
			clickedPointStatus: -2,
			concavity: 2.0,
			lengthThreshold: 0.0,
			points: [
				{ key: 0, value: { x: 0, y: 0, Status: -2, Color: "#00f" } },
				{ key: 1, value: { x: 1, y: 0, Status: -2, Color: "#00f" } },
				{ key: 4, value: { x: 0, y: 1, Status: -2, Color: "#00f" } },
				{ key: 5, value: { x: 1, y: 1, Status: -2, Color: "#00f" } }
			]
		});

		expect(result?.operation).toBe("CONCAVEMAN");
		expect(Array.isArray(result?.convex_hull)).toBe(true);
		expect(Array.isArray(result?.cw_sorted_verts)).toBe(true);
	});

	test("HandleWorkerOperation processes CONCAVEMAN BY_COORDS", async () => {
		__setSharedDepsForTests({
			SvgVml: MockSvgVml,
			StatusEnum: StatusEnumMock,
			pnpoly: () => true,
			RandomColor: () => "#123456",
			LocalLog: () => { }
		});

		const result = await HandleWorkerOperation({
			operation: "CONCAVEMAN",
			subOperation: "BY_COORDS",
			concavity: 2.0,
			lengthThreshold: 0.0,
			points: [[0, 0], [1, 0], [1, 1], [0, 1]],
			humanPoints: [],
			interceptingPoints: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
			iGridHeight: 5,
			iGridWidth: 5
		});

		expect(result?.operation).toBe("CONCAVEMAN");
		expect(Array.isArray(result?.convex_hull)).toBe(true);
		expect(Array.isArray(result?.interceptedPoints)).toBe(true);
	});

	test("HandleWorkerOperation processes CLUSTERING_AND_CONCAVEMAN with inkball contract shape", async () => {
		__setSharedDepsForTests({
			SvgVml: MockSvgVml,
			StatusEnum: StatusEnumMock,
			pnpoly: () => true,
			RandomColor: () => "#fedcba",
			LocalLog: () => { }
		});

		const result = await HandleWorkerOperation({
			operation: "CLUSTERING_AND_CONCAVEMAN",
			method: "KMEANS",
			numberOfClusters: 2,
			neighborhoodRadius: 2,
			minPointsPerCluster: 2,
			allPoints: [
				{ key: 6, value: { x: 1, y: 1, Status: -3, Color: "#f66" } },
				{ key: 7, value: { x: 2, y: 1, Status: -3, Color: "#f66" } },
				{ key: 16, value: { x: 1, y: 2, Status: -3, Color: "#f66" } },
				{ key: 17, value: { x: 2, y: 2, Status: -3, Color: "#f66" } }
			],
			humanPointStatuses: [-3],
			blockedPointColors: ["#111", "#222"],
			concavity: 2.0,
			lengthThreshold: 0.0,
			boardSize: { iGridWidth: 5, iGridHeight: 5 },
			visuals: true
		});

		expect(result?.operation).toBe("CLUSTERING_AND_CONCAVEMAN");
		expect(Array.isArray(result?.results)).toBe(true);
		expect(result?.results.length).toBeGreaterThan(0);

		const first = result.results[0];
		expect(Array.isArray(first.clustered_point_coords)).toBe(true);
		expect(Array.isArray(first.convex_hull)).toBe(true);
		expect(Array.isArray(first.interceptedPoints)).toBe(true);
		expect(Array.isArray(first.surrounding_path)).toBe(true);
		expect(Array.isArray(first.rects2Draw)).toBe(true);
		expect(typeof first.randomColor).toBe("string");

		if (first.convex_hull.length > 0) {
			expect(typeof first.convex_hull[0].x).toBe("number");
			expect(typeof first.convex_hull[0].y).toBe("number");
		}
	});
});
