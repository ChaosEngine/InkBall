// @ts-nocheck
import { describe, expect, test, afterEach } from "bun:test";
import { Graph as AStarGraph } from "javascript-astar";
import {
	AstarPathFind,
	CalculateClustering,
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
});

describe("AIWorker operation dispatch", () => {
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
});
