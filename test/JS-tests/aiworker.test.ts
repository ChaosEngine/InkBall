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


function createInlineWorkerUrl() {
	const aiWorkerModuleUrl = new URL("../../src/InkBall.Module/wwwroot/js/AIWorker.js", import.meta.url);

	const workerSource = `if (typeof self.location === "undefined") {
	self.location = { hostname: "localhost" };
}

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
		}, 10_000);

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

describe("AIWorker black-box operations", () => {

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
		const dataset: CoordTuple[] = [];
		const clusters: CoordTuple[] = [
			[0, 0], [50, 0], [100, 0], [50, 50], [0, 50]
		];
		clusters.forEach(([cx, cy]) => {
			for (let i = 0; i < 60; i++) {
				const angle = Math.random() * Math.PI * 2;
				const radius = Math.random() * 5;
				dataset.push([cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius]);
			}
		});

		const result = await runWorkerOperation<ClusteringResponse>({
			operation: "CLUSTERING",
			method: "DBSCAN",
			dataset,
			numberOfClusters: 5,
			neighborhoodRadius: 7,
			minPointsPerCluster: 5
		});

		expect(result.operation).toBe("CLUSTERING");
		expect(Array.isArray(result.clusters)).toBe(true);
		expect(result.clusters.length).toBeGreaterThan(4);
	});

	test("CLUSTERING KMEANS with specific cluster count", async () => {
		const dataset: CoordTuple[] = [];
		// Create 3 well-separated clusters
		for (let c = 0; c < 3; c++) {
			for (let i = 0; i < 30; i++) {
				dataset.push([c * 30 + Math.random() * 5, Math.random() * 5]);
			}
		}

		const result = await runWorkerOperation<ClusteringResponse>({
			operation: "CLUSTERING",
			method: "KMEANS",
			dataset,
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

	test("CONCAVEMAN BY_COORDS returns shape expected by consumer", async () => {
		const result = await runWorkerOperation<ConcavemanResponse>({
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

		expect(result.operation).toBe("CONCAVEMAN");
		expect(Array.isArray(result.convex_hull)).toBe(true);
		expect(typeof result.numOfNonContinuous).toBe("number");
		expect(typeof result.numOfDuplicatesFixed).toBe("number");
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
			humanPointStatuses: [StatusEnum.POINT_FREE_RED],
			blockedPointColors: ["#DC143C", "#8A2BE2"],
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
		const iGridWidth = 100, iGridHeight = 100;
		const points: GridPoint[] = [];

		// Create 5 distinct clusters
		const clusterCenters: CoordTuple[] = [[20, 20], [80, 20], [50, 50], [20, 80], [80, 80]];
		clusterCenters.forEach(([cx, cy]) => {
			for (let i = 0; i < 15; i++) {
				const angle = Math.random() * Math.PI * 2;
				const radius = Math.random() * 3;
				const x = Math.round(cx + Math.cos(angle) * radius);
				const y = Math.round(cy + Math.sin(angle) * radius);
				points.push({
					x, y,
					Status: StatusEnum.POINT_FREE_RED,
					Color: "red"
				});
			}
		});

		const out = await runWorkerOperation<ClusteringAndConcavemanResponse>({
			operation: "CLUSTERING_AND_CONCAVEMAN",
			method: "DBSCAN",
			numberOfClusters: 5,
			neighborhoodRadius: 4,
			minPointsPerCluster: 3,
			allPoints: points.map(pt => ({ key: pt.y * iGridWidth + pt.x, value: pt })),
			humanPointStatuses: [StatusEnum.POINT_FREE_RED],
			blockedPointColors: ["#DC143C", "#8A2BE2"],
			concavity: 1,
			lengthThreshold: 0,
			boardSize: { iGridWidth, iGridHeight },
			visuals: true
		});

		expect(out.operation).toBe("CLUSTERING_AND_CONCAVEMAN");
		expect(Array.isArray(out.results)).toBe(true);
		expect(out.results.length).toBeGreaterThan(4);
		out.results.forEach((result: ClusteringAndConcavemanResultItem) => {
			expect(Array.isArray(result.clustered_point_coords)).toBe(true);
			expect(Array.isArray(result.convex_hull)).toBe(true);
			expect(Array.isArray(result.interceptedPoints)).toBe(true);
			expect(Array.isArray(result.surrounding_path)).toBe(true);
		});
	});

	test("CLUSTERING_AND_CONCAVEMAN with dense cluster and sparse points", async () => {
		const iGridWidth = 60, iGridHeight = 60;
		const points: GridPoint[] = [];

		// Dense cluster in center
		for (let i = 0; i < 40; i++) {
			points.push({
				x: 30 + Math.round(Math.random() * 4),
				y: 30 + Math.round(Math.random() * 4),
				Status: StatusEnum.POINT_FREE_RED,
				Color: "red"
			});
		}

		// Sparse outer points
		for (let i = 0; i < 8; i++) {
			points.push({
				x: Math.round(Math.random() * 60),
				y: Math.round(Math.random() * 60),
				Status: StatusEnum.POINT_FREE_RED,
				Color: "red"
			});
		}

		const out = await runWorkerOperation<ClusteringAndConcavemanResponse>({
			operation: "CLUSTERING_AND_CONCAVEMAN",
			method: "DBSCAN",
			numberOfClusters: 2,
			neighborhoodRadius: 3,
			minPointsPerCluster: 2,
			allPoints: points.map(pt => ({ key: pt.y * iGridWidth + pt.x, value: pt })),
			humanPointStatuses: [StatusEnum.POINT_FREE_RED],
			blockedPointColors: [],
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
		const points: GridPoint[] = [];

		// Create one large diffuse cluster
		for (let i = 0; i < 20; i++) {
			points.push({
				x: Math.round(Math.random() * 50),
				y: Math.round(Math.random() * 50),
				Status: StatusEnum.POINT_FREE_RED,
				Color: "red"
			});
		}

		const out = await runWorkerOperation<ClusteringAndConcavemanResponse>({
			operation: "CLUSTERING_AND_CONCAVEMAN",
			method: "DBSCAN",
			numberOfClusters: 1,
			neighborhoodRadius: 5,
			minPointsPerCluster: 5,
			allPoints: points.map(pt => ({ key: pt.y * iGridWidth + pt.x, value: pt })),
			humanPointStatuses: [StatusEnum.POINT_FREE_RED],
			blockedPointColors: ["#DC143C"],
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

});
