/// <reference types="bun-types" />
import { describe, expect, test } from "bun:test";
import { StatusEnum } from "../../src/InkBall.Module/wwwroot/js/shared.js";

type CoordTuple = [number, number];
type Point2D = { x: number; y: number };

type GridPoint = {
	x: number;
	y: number;
	Status: number;
	Color: string;
};

type IndexedGridPoint = {
	key: number;
	value: GridPoint;
};

type ClusteringAndConcavemanResultItem = {
	clustered_point_coords: CoordTuple[];
	convex_hull: Point2D[];
	interceptedPoints: Point2D[];
	surrounding_path: Point2D[];
	rects2Draw: unknown[];
	randomColor: string;
};

type WorkerResponseBase = {
	operation: string;
	[key: string]: unknown;
};

type ClusteringResponse = WorkerResponseBase & {
	operation: "CLUSTERING";
	method: "DBSCAN" | "KMEANS";
	clusters: unknown[];
};

type AstarResponse = WorkerResponseBase & {
	operation: "ASTAR";
	resultWithDiagonals: CoordTuple[];
};

type BuildGraphResponse = WorkerResponseBase & {
	operation: "BUILD_GRAPH";
	params: {
		vertices: unknown[];
		edges: unknown[];
	};
};

type ConcavemanResponse = WorkerResponseBase & {
	operation: "CONCAVEMAN";
	convex_hull: Point2D[];
	numOfNonContinuous: number;
	numOfDuplicatesFixed: number;
};

type ClusteringAndConcavemanResponse = WorkerResponseBase & {
	operation: "CLUSTERING_AND_CONCAVEMAN";
	results: ClusteringAndConcavemanResultItem[];
};

type WorkerRequest = Record<string, unknown>;

function randomInt(maxExclusive: number): number {
	return Math.floor(Math.random() * maxExclusive);
}

function clampToBoard(value: number, maxExclusive: number): number {
	if (value < 0) return 0;
	if (value >= maxExclusive) return maxExclusive - 1;
	return value;
}


function createInlineWorkerUrl() {
	const aiWorkerModuleUrl = new URL("../../src/InkBall.Module/wwwroot/js/AIWorker.Bundle.js", import.meta.url);

	const workerSource = `if (typeof self.location === "undefined") {
	self.location = { hostname: "localhost" };
}
console.log = () => {}; // Suppress worker logs during tests
await import(${JSON.stringify(aiWorkerModuleUrl.href)});
`;
	return URL.createObjectURL(new Blob([workerSource], { type: "text/javascript" }));
}


function runWorkerOperation<TResponse extends WorkerResponseBase>(payload: WorkerRequest): Promise<TResponse> {
	return new Promise<TResponse>((resolve, reject) => {
		const workerUrl = createInlineWorkerUrl();
		const worker = new Worker(workerUrl, { type: "module" });

		const timer = setTimeout(() => {
			URL.revokeObjectURL(workerUrl);
			worker.terminate();
			reject(new Error("AIWorker test timeout"));
		}, 20_000);

		worker.onmessage = (event: MessageEvent<TResponse>) => {
			clearTimeout(timer);
			URL.revokeObjectURL(workerUrl);
			worker.terminate();
			resolve(event.data);
		};

		worker.onerror = (event: ErrorEvent) => {
			clearTimeout(timer);
			URL.revokeObjectURL(workerUrl);
			worker.terminate();
			reject(new Error(event.message || "Worker error"));
		};

		worker.postMessage(payload);
	});
}

describe("AI Web Worker", () => {

	test("CLUSTERING DBSCAN returns clusters", async () => {
		const result = await runWorkerOperation<ClusteringResponse>({
			operation: "CLUSTERING",
			method: "DBSCAN",
			dataset: [[0, 0], [0, 1], [10, 10], [11, 10]] as CoordTuple[],
			numberOfClusters: 2,
			neighborhoodRadius: 2,
			minPointsPerCluster: 2
		});

		expect(result.operation).toBe("CLUSTERING");
		expect(result.method).toBe("DBSCAN");
		expect(Array.isArray(result.clusters)).toBe(true);
		expect(result.clusters.length).toBe(2);
	});

	test("CLUSTERING with large dataset and multiple clusters", async () => {
		// Generate 300 points in 5 distinct clusters
		const dataset: Map<string, CoordTuple> = new Map();
		const clusters: CoordTuple[] = [
			[20, 20], [700, 200], [820, 20], [70, 900], [400, 400]
		];
		const twoPI = Math.PI * 2;
		clusters.forEach(([cx, cy]) => {
			let expectedCount = dataset.size + 60;
			for (let chancesLeft = 200; dataset.size < expectedCount && chancesLeft > 0; --chancesLeft) {
				const angle = Math.random() * twoPI;
				const radius = Math.random() * 50;
				const x = Math.round(cx + Math.cos(angle) * radius);
				const y = Math.round(cy + Math.sin(angle) * radius);
				const key = `${x},${y}`;

				if (dataset.has(key)) continue; // Avoid duplicates
				dataset.set(key, [x, y]);
			}
		});

		// console.log(`Generated dataset with ${dataset.size} unique points for clustering test:\n${Array.from(dataset.values()).map(([x, y], i) => `${x};${y}`).join("\n")}`);

		const result = await runWorkerOperation<ClusteringResponse>({
			operation: "CLUSTERING",
			method: "DBSCAN",
			dataset: Array.from(dataset.values()),
			numberOfClusters: 5,
			neighborhoodRadius: 7,
			minPointsPerCluster: 4
		});

		expect(result.operation).toBe("CLUSTERING");
		expect(Array.isArray(result.clusters)).toBe(true);
		expect(result.clusters.length).toBeGreaterThan(4);
	});

	test("CLUSTERING KMEANS with specific cluster count", async () => {
		const dataset: Map<string, CoordTuple> = new Map();
		// Create 3 well-separated clusters
		for (let c = 0; c < 3; c++) {
			for (let i = 0; i < 30; i++) {
				const x = Math.round(c * 30 + Math.random() * 5);
				const y = Math.round(Math.random() * 5);
				const key = `${x},${y}`;

				if (dataset.has(key)) continue; // Avoid duplicates
				dataset.set(key, [x, y]);
			}
		}

		const result = await runWorkerOperation<ClusteringResponse>({
			operation: "CLUSTERING",
			method: "KMEANS",
			dataset: Array.from(dataset.values()),
			numberOfClusters: 3,
			neighborhoodRadius: 0,
			minPointsPerCluster: 1
		});

		expect(result.operation).toBe("CLUSTERING");
		expect(result.clusters.length).toBe(3);
	});

	test("ASTAR returns a path ending at target", async () => {
		const result = await runWorkerOperation<AstarResponse>({
			operation: "ASTAR",
			arr: [
				[1, 1, 1, 1],
				[1, 0, 0, 1],
				[1, 0, 0, 1],
				[1, 1, 1, 1]
			],
			start: { x: 0, y: 0 },
			end: { x: 3, y: 3 }
		});

		expect(result.operation).toBe("ASTAR");
		expect(Array.isArray(result.resultWithDiagonals)).toBe(true);
		expect(result.resultWithDiagonals.at(-1)).toEqual([3, 3]);
		expect(result.resultWithDiagonals.length).toBeGreaterThan(4);
	});

	test("ASTAR navigates complex maze", async () => {
		// Create a complex maze
		const maze: number[][] = Array.from({ length: 20 }, () => Array(20).fill(1));
		// Clear a winding path
		const path: CoordTuple[] = [[1, 1], [1, 2], [1, 3], [2, 3], [3, 3], [3, 2], [4, 2], [5, 2], [5, 3], [5, 4]];
		path.forEach(([x, y]) => {
			maze[y][x] = 0;
		});

		const result = await runWorkerOperation<AstarResponse>({
			operation: "ASTAR",
			arr: maze,
			start: { x: 1, y: 1 },
			end: { x: 5, y: 4 }
		});

		expect(result.operation).toBe("ASTAR");
		expect(Array.isArray(result.resultWithDiagonals)).toBe(true);
		if (result.resultWithDiagonals.length > 0) {
			expect(result.resultWithDiagonals.at(-1)).toEqual([5, 4]);
		}
	});

	test("ASTAR with unreachable target returns empty or error", async () => {
		// Completely blocked maze
		const maze: number[][] = Array.from({ length: 5 }, () => Array(5).fill(1));
		maze[2][2] = 0; // Only target is open

		const result = await runWorkerOperation<AstarResponse>({
			operation: "ASTAR",
			arr: maze,
			start: { x: 0, y: 0 },
			end: { x: 2, y: 2 }
		});

		expect(result.operation).toBe("ASTAR");
		// Result should either have path or be empty
		expect(Array.isArray(result.resultWithDiagonals)).toBe(true);
	});

	test("ASTAR with adjacent start and end", async () => {
		const maze: number[][] = Array.from({ length: 3 }, () => Array(3).fill(1));
		maze[1][1] = 0;
		maze[1][2] = 0;

		const result = await runWorkerOperation<AstarResponse>({
			operation: "ASTAR",
			arr: maze,
			start: { x: 1, y: 1 },
			end: { x: 1, y: 2 }
		});

		expect(result.operation).toBe("ASTAR");
		expect(Array.isArray(result.resultWithDiagonals)).toBe(true);
		expect(result.resultWithDiagonals.length).toBeGreaterThan(0);
	});

	test("BUILD_GRAPH returns graph payload", async () => {
		const result = await runWorkerOperation<BuildGraphResponse>({
			operation: "BUILD_GRAPH",
			boardSize: { iGridWidth: 3, iGridHeight: 3 },
			paths: [],
			points: [
				{ key: 0, value: { x: 0, y: 0, Status: -2, Color: "#00f" } },
				{ key: 1, value: { x: 1, y: 0, Status: -2, Color: "#00f" } },
				{ key: 4, value: { x: 1, y: 1, Status: 2, Color: "#f00" } }
			]
		});

		expect(result.operation).toBe("BUILD_GRAPH");
		expect(Array.isArray(result.params.vertices)).toBe(true);
		expect(Array.isArray(result.params.edges)).toBe(true);
		expect(result.params.vertices.length).toBeGreaterThan(0);
	});

	test("BUILD_GRAPH with larger grid and mixed point types", async () => {
		const points: IndexedGridPoint[] = [];
		let key = 0;

		// Create 10x10 grid with mixed point types
		for (let y = 0; y < 10; y++) {
			for (let x = 0; x < 10; x++) {
				const status = (x + y) % 3 === 0 ? -2 : 2; // Alternate free/owned
				points.push({
					key: key++,
					value: { x, y, Status: status, Color: status === -2 ? "#00f" : "#f00" }
				});
			}
		}

		const result = await runWorkerOperation<BuildGraphResponse>({
			operation: "BUILD_GRAPH",
			boardSize: { iGridWidth: 10, iGridHeight: 10 },
			paths: [],
			points
		});

		expect(result.operation).toBe("BUILD_GRAPH");
		expect(result.params.vertices.length).toBeGreaterThan(30);
		expect(result.params.edges.length).toBeGreaterThan(0);
	});

	test("CLUSTERING_AND_CONCAVEMAN returns inkball contract shape", async () => {
		const iGridWidth = 40, iGridHeight = 52;
		const points: GridPoint[] = [
			{ x: 8, y: 16, Status: StatusEnum.POINT_FREE_RED, Color: "red" },
			{ x: 9, y: 15, Status: StatusEnum.POINT_FREE_RED, Color: "red" },
			{ x: 10, y: 14, Status: StatusEnum.POINT_FREE_RED, Color: "red" },
			{ x: 14, y: 23, Status: StatusEnum.POINT_FREE_RED, Color: "red" },
			{ x: 15, y: 24, Status: StatusEnum.POINT_FREE_RED, Color: "red" },
			{ x: 16, y: 25, Status: StatusEnum.POINT_FREE_RED, Color: "red" },
			{ x: 17, y: 29, Status: StatusEnum.POINT_FREE_RED, Color: "red" },
			{ x: 19, y: 7, Status: StatusEnum.POINT_FREE_RED, Color: "red" },
			{ x: 20, y: 6, Status: StatusEnum.POINT_FREE_RED, Color: "red" },
			{ x: 21, y: 25, Status: StatusEnum.POINT_FREE_RED, Color: "red" },
			{ x: 22, y: 25, Status: StatusEnum.POINT_FREE_RED, Color: "red" },
			{ x: 23, y: 25, Status: StatusEnum.POINT_FREE_RED, Color: "red" },
			{ x: 24, y: 13, Status: StatusEnum.POINT_FREE_RED, Color: "red" },
			{ x: 25, y: 13, Status: StatusEnum.POINT_FREE_RED, Color: "red" },
			{ x: 29, y: 18, Status: StatusEnum.POINT_FREE_RED, Color: "red" },
			{ x: 30, y: 19, Status: StatusEnum.POINT_FREE_RED, Color: "red" },
			{ x: 35, y: 10, Status: StatusEnum.POINT_FREE_RED, Color: "red" },
			{ x: 35, y: 11, Status: StatusEnum.POINT_FREE_RED, Color: "red" },
			{ x: 35, y: 21, Status: StatusEnum.POINT_FREE_RED, Color: "red" },
			{ x: 35, y: 22, Status: StatusEnum.POINT_FREE_RED, Color: "red" },
			{ x: 35, y: 23, Status: StatusEnum.POINT_FREE_RED, Color: "red" },
		];



		const out = await runWorkerOperation<ClusteringAndConcavemanResponse>({
			operation: "CLUSTERING_AND_CONCAVEMAN",
			method: "DBSCAN",
			numberOfClusters: 1,
			neighborhoodRadius: 2,
			minPointsPerCluster: 1,//level: HARD
			allPoints: points.map(pt => ({ key: pt.y * iGridWidth + pt.x, value: pt })),
			allLines: [], // Not needed for this test, but included to match expected payload shape
			humanPointInfo: {
				color: 'red',
				statuses: [StatusEnum.POINT_FREE_RED]
			},
			blockedPointInfo: {
				colors: ["#DC143C", "#8A2BE2"],
				statuses: [StatusEnum.POINT_OWNED_BY_RED, StatusEnum.POINT_OWNED_BY_BLUE, StatusEnum.POINT_IN_PATH]
			},
			concavity: 1,
			lengthThreshold: 0,
			boardSize: { iGridWidth, iGridHeight },
			visuals: true
		});

		expect(out.operation).toBe("CLUSTERING_AND_CONCAVEMAN");
		expect(Array.isArray(out.results)).toBe(true);
		expect(out.results.length).toBeGreaterThan(8);

		const first = out.results[0];
		expect(Array.isArray(first.clustered_point_coords)).toBe(true);
		expect(Array.isArray(first.convex_hull)).toBe(true);
		expect(Array.isArray(first.interceptedPoints)).toBe(true);
		let { x, y } = first.interceptedPoints[0];
		expect(typeof x).toBe("number");
		expect(typeof y).toBe("number");
		expect(x).toBe(17);
		expect(y).toBe(29);

		expect(Array.isArray(first.surrounding_path)).toBe(true);
		expect(Array.isArray(first.rects2Draw)).toBe(true);
		expect(typeof first.randomColor).toBe("string");

		expect(Array.isArray(first.convex_hull)).toBe(true);
		expect(first.convex_hull).toEqual([{ x: 17, y: 28 }, { x: 16, y: 29 }, { x: 17, y: 30 }, { x: 18, y: 29 }, { x: 17, y: 28 }]);

		const third = out.results.find((res: ClusteringAndConcavemanResultItem) => res.interceptedPoints.some((pt: Point2D) => pt.x === 19 && pt.y === 7));
		expect(third).toBeDefined();
		if (!third) throw new Error("Expected third result item");
		expect(Array.isArray(third.interceptedPoints)).toBe(true);
		expect(third.interceptedPoints).toEqual([{ x: 19, y: 7 }, { x: 20, y: 6 }]);
		expect(third.convex_hull).toEqual([{ x: 20, y: 5 }, { x: 19, y: 6 }, { x: 18, y: 7 }, { x: 19, y: 8 }, { x: 20, y: 7 }, { x: 21, y: 6 }, { x: 20, y: 5 }]);

		const fourth = out.results.find((res: ClusteringAndConcavemanResultItem) => res.interceptedPoints.some((pt: Point2D) => pt.x === 8 && pt.y === 16));
		expect(fourth).toBeDefined();
		if (!fourth) throw new Error("Expected fourth result item");
		expect(Array.isArray(fourth.interceptedPoints)).toBe(true);
		expect(fourth.interceptedPoints).toEqual([{ x: 8, y: 16 }, { x: 9, y: 15 }, { x: 10, y: 14 }]);
		expect(fourth.convex_hull).toEqual([{ x: 10, y: 13 }, { x: 9, y: 14 }, { x: 8, y: 15 }, { x: 7, y: 16 }, { x: 7, y: 17 }, { x: 8, y: 17 }, { x: 9, y: 16 }, { x: 10, y: 15 }, { x: 11, y: 14 }, { x: 11, y: 13 }, { x: 10, y: 13 }]);
	});

	test("CLUSTERING_AND_CONCAVEMAN with multiple scattered clusters", async () => {
		const iGridWidth = 500, iGridHeight = 500;
		const points: Map<string, GridPoint> = new Map();

		// Create 5 distinct clusters
		const clusterCenters: CoordTuple[] = [[200, 20], [80, 200], [400, 400], [0, 300], [300, 200]];
		const twoPI = Math.PI * 2;
		clusterCenters.forEach(([cx, cy]) => {
			let expectedCount = points.size + 30;
			for (let chancesLeft = 200; points.size < expectedCount && chancesLeft > 0; --chancesLeft) {
				const angle = Math.random() * twoPI;
				const radius = Math.random() * 5;
				const x = clampToBoard(Math.round(cx + Math.cos(angle) * radius), iGridWidth);
				const y = clampToBoard(Math.round(cy + Math.sin(angle) * radius), iGridHeight);
				const key = `${x},${y}`;

				if (points.has(key)) continue; // Avoid duplicates
				points.set(key, { x, y, Status: StatusEnum.POINT_FREE_RED, Color: "red" });
			}
		});

		// console.log(`Generated dataset with ${points.size} unique points for clustering test:\n${Array.from(points.values()).map(({ x, y }) => `${x};${y}`).join("\n")}`);

		const out = await runWorkerOperation<ClusteringAndConcavemanResponse>({
			operation: "CLUSTERING_AND_CONCAVEMAN",
			method: "DBSCAN",
			numberOfClusters: 5,
			neighborhoodRadius: 2,
			minPointsPerCluster: 2,
			allPoints: Array.from(points.values()).map(pt => ({ key: pt.y * iGridWidth + pt.x, value: pt })),
			allLines: [], // No paths for this test
			humanPointInfo: {
				color: 'red',
				statuses: [StatusEnum.POINT_FREE_RED]
			},
			blockedPointInfo: {
				colors: ["#DC143C", "#8A2BE2"],
				statuses: [StatusEnum.POINT_OWNED_BY_RED, StatusEnum.POINT_OWNED_BY_BLUE, StatusEnum.POINT_IN_PATH]
			},
			concavity: 1,
			lengthThreshold: 0,
			boardSize: { iGridWidth, iGridHeight },
			visuals: true
		});

		expect(out.operation).toBe("CLUSTERING_AND_CONCAVEMAN");
		expect(Array.isArray(out.results)).toBe(true);
		expect(out.results.length).toBeGreaterThan(3);
		out.results.forEach((result: ClusteringAndConcavemanResultItem) => {
			expect(Array.isArray(result.clustered_point_coords)).toBe(true);
			expect(Array.isArray(result.convex_hull)).toBe(true);
			expect(Array.isArray(result.interceptedPoints)).toBe(true);
			expect(Array.isArray(result.surrounding_path)).toBe(true);
		});
	});

	test("CLUSTERING_AND_CONCAVEMAN with dense cluster and sparse points", async () => {
		const iGridWidth = 60, iGridHeight = 60;
		const points: Map<string, GridPoint> = new Map();

		// Dense cluster in center
		let expectedCount = points.size + 40;
		for (let chancesLeft = 100; points.size < expectedCount && chancesLeft > 0; --chancesLeft) {
			const x = clampToBoard(30 + Math.round(Math.random() * 4), iGridWidth);
			const y = clampToBoard(30 + Math.round(Math.random() * 4), iGridHeight);
			const key = `${x},${y}`;

			if (points.has(key)) continue; // Avoid duplicates
			points.set(key, { x, y, Status: StatusEnum.POINT_FREE_RED, Color: "red" });
		}

		// Sparse outer points
		expectedCount = points.size + 8;
		for (let chancesLeft = 50; points.size < expectedCount && chancesLeft > 0; --chancesLeft) {
			const x = randomInt(iGridWidth);
			const y = randomInt(iGridHeight);
			const key = `${x},${y}`;

			if (points.has(key)) continue; // Avoid duplicates
			points.set(key, { x, y, Status: StatusEnum.POINT_FREE_RED, Color: "red" });
		}

		// console.log(`Generated dataset with ${points.size} unique points for clustering test:\n${Array.from(points.values()).map(({ x, y }) => `${x};${y}`).join("\n")}`);

		const out = await runWorkerOperation<ClusteringAndConcavemanResponse>({
			operation: "CLUSTERING_AND_CONCAVEMAN",
			method: "DBSCAN",
			numberOfClusters: 2,
			neighborhoodRadius: 3,
			minPointsPerCluster: 2,
			allPoints: Array.from(points.values()).map(pt => ({ key: pt.y * iGridWidth + pt.x, value: pt })),
			allLines: [], // No paths for this test
			humanPointInfo: {
				color: 'red',
				statuses: [StatusEnum.POINT_FREE_RED]
			},
			blockedPointInfo: {
				colors: ["#DC143C", "#8A2BE2"],
				statuses: [StatusEnum.POINT_OWNED_BY_RED, StatusEnum.POINT_OWNED_BY_BLUE, StatusEnum.POINT_IN_PATH]
			},
			concavity: 1.5,
			lengthThreshold: 0.5,
			boardSize: { iGridWidth, iGridHeight },
			visuals: true
		});

		expect(out.operation).toBe("CLUSTERING_AND_CONCAVEMAN");
		expect(Array.isArray(out.results)).toBe(true);
		out.results.forEach((result: ClusteringAndConcavemanResultItem) => {
			expect(result.randomColor).toMatch(/^#[0-9a-f]{6}$/i);
			expect(Array.isArray(result.rects2Draw)).toBe(true);
		});
	});

	test("CLUSTERING_AND_CONCAVEMAN with single large cluster", async () => {
		const iGridWidth = 50, iGridHeight = 50;
		const points: Map<string, GridPoint> = new Map();

		// Create one large diffuse cluster
		let expectedCount = points.size + 50;
		for (let chancesLeft = 100; points.size < expectedCount && chancesLeft > 0; --chancesLeft) {
			const x = randomInt(iGridWidth);
			const y = randomInt(iGridHeight);
			const key = `${x},${y}`;

			if (points.has(key)) continue;
			points.set(key, { x, y, Status: StatusEnum.POINT_FREE_RED, Color: "red" });
		}

		// console.log(`Generated dataset with ${points.size} unique points for clustering test:\n${Array.from(points.values()).map(({ x, y }) => `${x};${y}`).join("\n")}`);


		const out = await runWorkerOperation<ClusteringAndConcavemanResponse>({
			operation: "CLUSTERING_AND_CONCAVEMAN",
			method: "DBSCAN",
			numberOfClusters: 1,
			neighborhoodRadius: 5,
			minPointsPerCluster: 5,
			allPoints: Array.from(points.values()).map(pt => ({ key: pt.y * iGridWidth + pt.x, value: pt })),
			allLines: [], // No paths for this test
			humanPointInfo: {
				color: 'red',
				statuses: [StatusEnum.POINT_FREE_RED]
			},
			blockedPointInfo: {
				colors: ["#DC143C"],
				statuses: [StatusEnum.POINT_OWNED_BY_RED, StatusEnum.POINT_OWNED_BY_BLUE, StatusEnum.POINT_IN_PATH]
			},
			concavity: 2,
			lengthThreshold: 0,
			boardSize: { iGridWidth, iGridHeight },
			visuals: false
		});

		expect(out.operation).toBe("CLUSTERING_AND_CONCAVEMAN");
		expect(Array.isArray(out.results)).toBe(true);
		// With diffuse points and high radius, likely to get fewer large clusters
		out.results.forEach((result: ClusteringAndConcavemanResultItem) => {
			expect(result.clustered_point_coords.length).toBeGreaterThan(2);
			expect(result.convex_hull.length).toBeGreaterThan(2);
		});
	});

	test("CLUSTERING_AND_CONCAVEMAN handles real board state with existing closed paths", async () => {
		// Points and polylines extracted from an actual game SVG snapshot (boardsize-40x52).
		const iGridWidth = 40, iGridHeight = 52;
		const red = "#ff0000", blue = "#0000ff", ownedByRed = "#DC143C", ownedByBlue = "#8A2BE2";

		// Free red points – the AI (blue) is trying to surround these.
		const freeRedPoints: GridPoint[] = [
			{ x: 14, y: 19, Status: StatusEnum.POINT_FREE_RED, Color: red },
			{ x: 14, y: 20, Status: StatusEnum.POINT_FREE_RED, Color: red },
			{ x: 14, y: 21, Status: StatusEnum.POINT_FREE_RED, Color: red },
			{ x: 15, y: 19, Status: StatusEnum.POINT_FREE_RED, Color: red },
			{ x: 16, y: 19, Status: StatusEnum.POINT_FREE_RED, Color: red },
			{ x: 17, y: 19, Status: StatusEnum.POINT_FREE_RED, Color: red },
			{ x: 17, y: 20, Status: StatusEnum.POINT_FREE_RED, Color: red },
			{ x: 17, y: 21, Status: StatusEnum.POINT_FREE_RED, Color: red },
			{ x: 17, y: 22, Status: StatusEnum.POINT_FREE_RED, Color: red },
			{ x: 17, y: 23, Status: StatusEnum.POINT_FREE_RED, Color: red },
			{ x: 17, y: 24, Status: StatusEnum.POINT_FREE_RED, Color: red },
			{ x: 17, y: 25, Status: StatusEnum.POINT_FREE_RED, Color: red },
			{ x: 17, y: 26, Status: StatusEnum.POINT_FREE_RED, Color: red },
			{ x: 17, y: 27, Status: StatusEnum.POINT_FREE_RED, Color: red },
			{ x: 17, y: 28, Status: StatusEnum.POINT_FREE_RED, Color: red },
			{ x: 18, y: 19, Status: StatusEnum.POINT_FREE_RED, Color: red },
			{ x: 18, y: 28, Status: StatusEnum.POINT_FREE_RED, Color: red },
			{ x: 19, y: 19, Status: StatusEnum.POINT_FREE_RED, Color: red },
			{ x: 19, y: 27, Status: StatusEnum.POINT_FREE_RED, Color: red },
			{ x: 20, y: 18, Status: StatusEnum.POINT_FREE_RED, Color: red },
			{ x: 20, y: 22, Status: StatusEnum.POINT_FREE_RED, Color: red },
			{ x: 20, y: 27, Status: StatusEnum.POINT_FREE_RED, Color: red },
			{ x: 21, y: 18, Status: StatusEnum.POINT_FREE_RED, Color: red },
			{ x: 21, y: 27, Status: StatusEnum.POINT_FREE_RED, Color: red },
			{ x: 22, y: 17, Status: StatusEnum.POINT_FREE_RED, Color: red },
			{ x: 22, y: 24, Status: StatusEnum.POINT_FREE_RED, Color: red },
			{ x: 22, y: 25, Status: StatusEnum.POINT_FREE_RED, Color: red },
			{ x: 22, y: 27, Status: StatusEnum.POINT_FREE_RED, Color: red },
			{ x: 23, y: 17, Status: StatusEnum.POINT_FREE_RED, Color: red },
			{ x: 23, y: 18, Status: StatusEnum.POINT_FREE_RED, Color: red },
			{ x: 23, y: 19, Status: StatusEnum.POINT_FREE_RED, Color: red },
			{ x: 23, y: 25, Status: StatusEnum.POINT_FREE_RED, Color: red },
			{ x: 23, y: 27, Status: StatusEnum.POINT_FREE_RED, Color: red },
			{ x: 24, y: 22, Status: StatusEnum.POINT_FREE_RED, Color: red },
			{ x: 24, y: 26, Status: StatusEnum.POINT_FREE_RED, Color: red },
			{ x: 24, y: 27, Status: StatusEnum.POINT_FREE_RED, Color: red },
		];

		// Free blue points present on the board.
		const freeBluePoints: GridPoint[] = [
			{ x: 13, y: 19, Status: StatusEnum.POINT_FREE_BLUE, Color: blue },
			{ x: 13, y: 20, Status: StatusEnum.POINT_FREE_BLUE, Color: blue },
			{ x: 13, y: 21, Status: StatusEnum.POINT_FREE_BLUE, Color: blue },
			{ x: 13, y: 22, Status: StatusEnum.POINT_FREE_BLUE, Color: blue },
			{ x: 14, y: 18, Status: StatusEnum.POINT_FREE_BLUE, Color: blue },
			{ x: 14, y: 22, Status: StatusEnum.POINT_FREE_BLUE, Color: blue },
			{ x: 15, y: 20, Status: StatusEnum.POINT_FREE_BLUE, Color: blue },
			{ x: 15, y: 21, Status: StatusEnum.POINT_FREE_BLUE, Color: blue },
			{ x: 16, y: 20, Status: StatusEnum.POINT_FREE_BLUE, Color: blue },
			{ x: 16, y: 21, Status: StatusEnum.POINT_FREE_BLUE, Color: blue },
			{ x: 16, y: 22, Status: StatusEnum.POINT_FREE_BLUE, Color: blue },
			{ x: 16, y: 23, Status: StatusEnum.POINT_FREE_BLUE, Color: blue },
			{ x: 16, y: 24, Status: StatusEnum.POINT_FREE_BLUE, Color: blue },
			{ x: 16, y: 25, Status: StatusEnum.POINT_FREE_BLUE, Color: blue },
			{ x: 16, y: 26, Status: StatusEnum.POINT_FREE_BLUE, Color: blue },
			{ x: 16, y: 27, Status: StatusEnum.POINT_FREE_BLUE, Color: blue },
			{ x: 16, y: 28, Status: StatusEnum.POINT_FREE_BLUE, Color: blue },
			{ x: 16, y: 29, Status: StatusEnum.POINT_FREE_BLUE, Color: blue },
			{ x: 17, y: 29, Status: StatusEnum.POINT_FREE_BLUE, Color: blue },
			{ x: 18, y: 29, Status: StatusEnum.POINT_FREE_BLUE, Color: blue },
			{ x: 19, y: 28, Status: StatusEnum.POINT_FREE_BLUE, Color: blue },
			{ x: 20, y: 28, Status: StatusEnum.POINT_FREE_BLUE, Color: blue },
			{ x: 21, y: 21, Status: StatusEnum.POINT_FREE_BLUE, Color: blue },
			{ x: 21, y: 28, Status: StatusEnum.POINT_FREE_BLUE, Color: blue },
			{ x: 22, y: 20, Status: StatusEnum.POINT_FREE_BLUE, Color: blue },
			{ x: 22, y: 28, Status: StatusEnum.POINT_FREE_BLUE, Color: blue },
			{ x: 23, y: 28, Status: StatusEnum.POINT_FREE_BLUE, Color: blue },
			{ x: 24, y: 24, Status: StatusEnum.POINT_FREE_BLUE, Color: blue },
			{ x: 24, y: 25, Status: StatusEnum.POINT_FREE_BLUE, Color: blue },
			{ x: 24, y: 28, Status: StatusEnum.POINT_FREE_BLUE, Color: blue },
			{ x: 25, y: 25, Status: StatusEnum.POINT_FREE_BLUE, Color: blue },
			{ x: 25, y: 26, Status: StatusEnum.POINT_FREE_BLUE, Color: blue },
			{ x: 25, y: 27, Status: StatusEnum.POINT_FREE_BLUE, Color: blue },
		];

		// Blue closed path vertices (polyline id=11989: "18,13 17,14 18,15 19,15 20,14 19,13 18,13").
		const bluePathPoints: GridPoint[] = [
			{ x: 18, y: 13, Status: StatusEnum.POINT_IN_PATH, Color: blue },
			{ x: 17, y: 14, Status: StatusEnum.POINT_IN_PATH, Color: blue },
			{ x: 18, y: 15, Status: StatusEnum.POINT_IN_PATH, Color: blue },
			{ x: 19, y: 15, Status: StatusEnum.POINT_IN_PATH, Color: blue },
			{ x: 20, y: 14, Status: StatusEnum.POINT_IN_PATH, Color: blue },
			{ x: 19, y: 13, Status: StatusEnum.POINT_IN_PATH, Color: blue },
		];

		// Red closed path vertices (polyline id=11990: "22,21 21,22 22,23 23,22 22,21").
		const redPathPoints: GridPoint[] = [
			{ x: 22, y: 21, Status: StatusEnum.POINT_IN_PATH, Color: red },
			{ x: 21, y: 22, Status: StatusEnum.POINT_IN_PATH, Color: red },
			{ x: 22, y: 23, Status: StatusEnum.POINT_IN_PATH, Color: red },
			{ x: 23, y: 22, Status: StatusEnum.POINT_IN_PATH, Color: red },
		];

		// Owned points enclosed by the respective closed paths.
		const ownedBluePoints: GridPoint[] = [
			{ x: 18, y: 14, Status: StatusEnum.POINT_OWNED_BY_BLUE, Color: ownedByBlue },
			{ x: 19, y: 14, Status: StatusEnum.POINT_OWNED_BY_BLUE, Color: ownedByBlue },
		];
		const ownedRedPoints: GridPoint[] = [
			{ x: 22, y: 22, Status: StatusEnum.POINT_OWNED_BY_RED, Color: ownedByRed },
		];

		const allPoints = [
			...freeRedPoints, ...freeBluePoints,
			...bluePathPoints, ...redPathPoints,
			...ownedBluePoints, ...ownedRedPoints,
		];

		// Both polylines from the SVG snapshot.
		const allLines = [
			{ iId: 11989, Color: blue, PointsAsString: "18,13 17,14 18,15 19,15 20,14 19,13 18,13" },
			{ iId: 11990, Color: red, PointsAsString: "22,21 21,22 22,23 23,22 22,21" },
		];

		const out = await runWorkerOperation<ClusteringAndConcavemanResponse>({
			operation: "CLUSTERING_AND_CONCAVEMAN",
			method: "DBSCAN",
			numberOfClusters: 3,
			neighborhoodRadius: 2,
			minPointsPerCluster: 2,
			allPoints: allPoints.map(pt => ({ key: pt.y * iGridWidth + pt.x, value: pt })),
			allLines,
			humanPointInfo: {
				color: red,
				statuses: [StatusEnum.POINT_FREE_RED],
			},
			blockedPointInfo: {
				colors: [blue, ownedByBlue, ownedByRed],
				statuses: [StatusEnum.POINT_OWNED_BY_RED, StatusEnum.POINT_OWNED_BY_BLUE, StatusEnum.POINT_IN_PATH],
			},
			concavity: 1,
			lengthThreshold: 0,
			boardSize: { iGridWidth, iGridHeight },
			visuals: false,
		});

		expect(out.operation).toBe("CLUSTERING_AND_CONCAVEMAN");
		expect(Array.isArray(out.results)).toBe(true);
		expect(out.results.length).toBeGreaterThan(0);

		// Non-free points (owned / in-path) must never appear as interception targets.
		const nonFreeKeys = new Set([
			...bluePathPoints, ...redPathPoints, ...ownedBluePoints, ...ownedRedPoints,
		].map(pt => `${pt.x},${pt.y}`));
		const freeRedKeys = new Set(freeRedPoints.map(pt => `${pt.x},${pt.y}`));

		let totalIntercepted = 0;
		for (const { convex_hull, interceptedPoints } of out.results) {
			expect(Array.isArray(convex_hull)).toBe(true);
			expect(convex_hull.length).toBeGreaterThan(2);
			for (const { x, y } of convex_hull) {
				expect(Number.isFinite(x)).toBe(true);
				expect(Number.isFinite(y)).toBe(true);
				expect(x).toBeGreaterThanOrEqual(0);
				expect(x).toBeLessThan(iGridWidth);
				expect(y).toBeGreaterThanOrEqual(0);
				expect(y).toBeLessThan(iGridHeight);
			}

			for (const { x, y } of interceptedPoints) {
				const key = `${x},${y}`;
				// Owned or in-path points must never be intercepted.
				expect(nonFreeKeys.has(key)).toBe(false);
				if (freeRedKeys.has(key)) totalIntercepted++;
			}
		}

		// The dense red cluster at x=17, y=19–28 guarantees several captured red points.
		expect(totalIntercepted).toBeGreaterThan(3);
	});


	test("CLUSTERING_AND_CONCAVEMAN board edge points: surrounding paths stay within board bounds", async () => {
		const iGridWidth = 20, iGridHeight = 20, pointFreeRedStatus = StatusEnum.POINT_FREE_RED, red = "red";

		// Strategy: place 4-point clusters ONE unit away from each board edge so that
		// CalculateWrappingPathFromDividedBoundingBoxes' wrappingBBox.expand() grows
		// the bbox right up to (but not past) the boundary.  Without the clamping inside
		// expand(), surrounding-path candidates would have negative or >= gridSize coords.
		//
		// Additionally, 2-point pairs sitting ON the exact edge exercise the unclamped
		// "size === 2" early-return code path in CalculateWrappingPathFromDividedBoundingBoxes.
		// Those clusters emit OOB vertices that CountInterceptedPointsAndDoBoundsCheck must
		// detect and discard (surrounded_points = null) so they never appear in results.
		const edgePoints: GridPoint[] = [
			// Near top-left corner - bbox expands to touch x=0 AND y=0
			{ x: 1, y: 1, Status: pointFreeRedStatus, Color: red },
			{ x: 2, y: 1, Status: pointFreeRedStatus, Color: red },
			{ x: 1, y: 2, Status: pointFreeRedStatus, Color: red },
			{ x: 2, y: 2, Status: pointFreeRedStatus, Color: red },
			// Near top-right corner - bbox expands to touch x=W-1 AND y=0
			{ x: 17, y: 1, Status: pointFreeRedStatus, Color: red },
			{ x: 18, y: 1, Status: pointFreeRedStatus, Color: red },
			{ x: 17, y: 2, Status: pointFreeRedStatus, Color: red },
			{ x: 18, y: 2, Status: pointFreeRedStatus, Color: red },
			// Near bottom-left corner - bbox expands to touch x=0 AND y=H-1
			{ x: 1, y: 17, Status: pointFreeRedStatus, Color: red },
			{ x: 2, y: 17, Status: pointFreeRedStatus, Color: red },
			{ x: 1, y: 18, Status: pointFreeRedStatus, Color: red },
			{ x: 2, y: 18, Status: pointFreeRedStatus, Color: red },
			// Near bottom-right corner - bbox expands to touch x=W-1 AND y=H-1
			{ x: 17, y: 17, Status: pointFreeRedStatus, Color: red },
			{ x: 18, y: 17, Status: pointFreeRedStatus, Color: red },
			{ x: 17, y: 18, Status: pointFreeRedStatus, Color: red },
			{ x: 18, y: 18, Status: pointFreeRedStatus, Color: red },
			// Near top edge mid - bbox expands to touch y=0
			{ x: 9, y: 1, Status: pointFreeRedStatus, Color: red },
			{ x: 10, y: 1, Status: pointFreeRedStatus, Color: red },
			{ x: 9, y: 2, Status: pointFreeRedStatus, Color: red },
			{ x: 10, y: 2, Status: pointFreeRedStatus, Color: red },
			// Near left edge mid - bbox expands to touch x=0
			{ x: 1, y: 9, Status: pointFreeRedStatus, Color: red },
			{ x: 2, y: 9, Status: pointFreeRedStatus, Color: red },
			{ x: 1, y: 10, Status: pointFreeRedStatus, Color: red },
			{ x: 2, y: 10, Status: pointFreeRedStatus, Color: red },
			// Near right edge mid - bbox expands to touch x=W-1
			{ x: 17, y: 9, Status: pointFreeRedStatus, Color: red },
			{ x: 18, y: 9, Status: pointFreeRedStatus, Color: red },
			{ x: 17, y: 10, Status: pointFreeRedStatus, Color: red },
			{ x: 18, y: 10, Status: pointFreeRedStatus, Color: red },
			// Near bottom edge mid - bbox expands to touch y=H-1
			{ x: 9, y: 17, Status: pointFreeRedStatus, Color: red },
			{ x: 10, y: 17, Status: pointFreeRedStatus, Color: red },
			{ x: 9, y: 18, Status: pointFreeRedStatus, Color: red },
			{ x: 10, y: 18, Status: pointFreeRedStatus, Color: red },
			// 2-point vertical pair ON the left edge (x=0) - triggers the unclamped
			// size===2 early-return which emits [x-1,y] = [-1,y] (OOB).
			// CountInterceptedPointsAndDoBoundsCheck must catch this and discard the cluster
			// so it does NOT appear in results with negative coordinates.
			{ x: 0, y: 5, Status: pointFreeRedStatus, Color: red },
			{ x: 0, y: 6, Status: pointFreeRedStatus, Color: red },
			// 2-point horizontal pair ON the top edge (y=0) - same OOB-discard scenario
			{ x: 5, y: 0, Status: pointFreeRedStatus, Color: red },
			{ x: 6, y: 0, Status: pointFreeRedStatus, Color: red },
		];

		const { results, operation } = await runWorkerOperation<ClusteringAndConcavemanResponse>({
			operation: "CLUSTERING_AND_CONCAVEMAN",
			method: "DBSCAN",
			numberOfClusters: 8,
			neighborhoodRadius: 2,
			minPointsPerCluster: 2,
			allPoints: edgePoints.map(pt => ({ key: pt.y * iGridWidth + pt.x, value: pt })),
			allLines: [], // No paths for this test
			humanPointInfo: {
				color: red,
				statuses: [pointFreeRedStatus]
			},
			blockedPointInfo: {
				colors: ["#DC143C", "#8A2BE2"],
				statuses: [StatusEnum.POINT_OWNED_BY_RED, StatusEnum.POINT_OWNED_BY_BLUE, StatusEnum.POINT_IN_PATH]
			},
			concavity: 1,
			lengthThreshold: 0,
			boardSize: { iGridWidth, iGridHeight },
			visuals: false
		});

		expect(operation).toBe("CLUSTERING_AND_CONCAVEMAN");
		expect(Array.isArray(results)).toBe(true);
		// The 8 near-edge 4-point clusters must produce at least some valid results;
		// the 2-point OOB pairs must be silently discarded (not crash, not appear here)
		expect(results.length).toBeGreaterThan(0);

		// Core assertion: no coordinate in any returned result may fall outside the board
		for (const { convex_hull, interceptedPoints, surrounding_path, clustered_point_coords } of results) {
			// convex_hull is Point2D[] (objects after CountInterceptedPointsAndDoBoundsCheck)
			for (const { x, y } of convex_hull) {
				expect(x, `convex_hull x=${x} out of [0,${iGridWidth})`).toBeGreaterThanOrEqual(0);
				expect(x, `convex_hull x=${x} out of [0,${iGridWidth})`).toBeLessThan(iGridWidth);
				expect(y, `convex_hull y=${y} out of [0,${iGridHeight})`).toBeGreaterThanOrEqual(0);
				expect(y, `convex_hull y=${y} out of [0,${iGridHeight})`).toBeLessThan(iGridHeight);
			}
			// interceptedPoints is Point2D[] (original cluster points with x/y)
			for (const { x, y } of interceptedPoints) {
				expect(x, `interceptedPoints x=${x} out of [0,${iGridWidth})`).toBeGreaterThanOrEqual(0);
				expect(x, `interceptedPoints x=${x} out of [0,${iGridWidth})`).toBeLessThan(iGridWidth);
				expect(y, `interceptedPoints y=${y} out of [0,${iGridHeight})`).toBeGreaterThanOrEqual(0);
				expect(y, `interceptedPoints y=${y} out of [0,${iGridHeight})`).toBeLessThan(iGridHeight);
			}
			// surrounding_path is [x,y] CoordTuple[] at runtime (despite Point2D[] in TypeScript type)
			for (const [x, y] of surrounding_path as unknown as CoordTuple[]) {
				expect(x, `surrounding_path x=${x} out of [0,${iGridWidth})`).toBeGreaterThanOrEqual(0);
				expect(x, `surrounding_path x=${x} out of [0,${iGridWidth})`).toBeLessThan(iGridWidth);
				expect(y, `surrounding_path y=${y} out of [0,${iGridHeight})`).toBeGreaterThanOrEqual(0);
				expect(y, `surrounding_path y=${y} out of [0,${iGridHeight})`).toBeLessThan(iGridHeight);
			}
			// clustered_point_coords is {x,y}[] at runtime (despite CoordTuple[] in TypeScript type)
			for (const { x, y } of clustered_point_coords as unknown as Point2D[]) {
				expect(x, `clustered_point_coords x=${x} out of [0,${iGridWidth})`).toBeGreaterThanOrEqual(0);
				expect(x, `clustered_point_coords x=${x} out of [0,${iGridWidth})`).toBeLessThan(iGridWidth);
				expect(y, `clustered_point_coords y=${y} out of [0,${iGridHeight})`).toBeGreaterThanOrEqual(0);
				expect(y, `clustered_point_coords y=${y} out of [0,${iGridHeight})`).toBeLessThan(iGridHeight);
			}
		}
	});

});
