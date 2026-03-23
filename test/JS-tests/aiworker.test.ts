// @ts-nocheck
import { describe, expect, test } from "bun:test";
import { StatusEnum } from "../../src/InkBall.Module/wwwroot/js/shared.js";


function createInlineWorkerUrl() {
	const aiWorkerModuleUrl = new URL("../../src/InkBall.Module/wwwroot/js/AIWorker.js", import.meta.url);

	const workerSource = `if (typeof self.location === "undefined") {
	self.location = { hostname: "localhost" };
}

await import(${JSON.stringify(aiWorkerModuleUrl.href)});
`;
	return URL.createObjectURL(new Blob([workerSource], { type: "text/javascript" }));
}


function runWorkerOperation(payload: Record<string, unknown>) {
	return new Promise<Record<string, unknown>>((resolve, reject) => {
		const workerUrl = createInlineWorkerUrl();
		const worker = new Worker(workerUrl, { type: "module" });

		const timer = setTimeout(() => {
			URL.revokeObjectURL(workerUrl);
			worker.terminate();
			reject(new Error("AIWorker test timeout"));
		}, 10_000);

		worker.onmessage = (event) => {
			clearTimeout(timer);
			URL.revokeObjectURL(workerUrl);
			worker.terminate();
			resolve(event.data);
		};

		worker.onerror = (event) => {
			clearTimeout(timer);
			URL.revokeObjectURL(workerUrl);
			worker.terminate();
			reject(new Error(event.message || "Worker error"));
		};

		worker.postMessage(payload);
	});
}

describe("AIWorker black-box operations", () => {

	test("CLUSTERING KMEANS returns clusters", async () => {
		const result = await runWorkerOperation({
			operation: "CLUSTERING",
			method: "KMEANS",
			dataset: [[0, 0], [0, 1], [10, 10], [11, 10]],
			numberOfClusters: 2,
			neighborhoodRadius: 2,
			minPointsPerCluster: 2
		});

		expect(result.operation).toBe("CLUSTERING");
		expect(result.method).toBe("KMEANS");
		expect(Array.isArray(result.clusters)).toBe(true);
		expect(result.clusters.length).toBe(2);
	});

	test("ASTAR returns a path ending at target", async () => {
		const result = await runWorkerOperation({
			operation: "ASTAR",
			arr: [
				[1, 1, 1],
				[1, 0, 1],
				[1, 1, 1]
			],
			start: { x: 0, y: 0 },
			end: { x: 2, y: 2 }
		});

		expect(result.operation).toBe("ASTAR");
		expect(Array.isArray(result.resultWithDiagonals)).toBe(true);
		expect(result.resultWithDiagonals.at(-1)).toEqual([2, 2]);
	});

	test("BUILD_GRAPH returns graph payload", async () => {
		const result = await runWorkerOperation({
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

	test("CONCAVEMAN BY_COORDS returns shape expected by consumer", async () => {
		const result = await runWorkerOperation({
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
		const points = [
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



		const out = await runWorkerOperation({
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

		const third = out.results.find(res => res.interceptedPoints.some(pt => pt.x === 19 && pt.y === 7));
		expect(third).toBeDefined();
		expect(Array.isArray(third.interceptedPoints)).toBe(true);
		expect(third.interceptedPoints).toEqual([{ x: 19, y: 7 }, { x: 20, y: 6 }]);
		expect(third.convex_hull).toEqual([{ x: 20, y: 5 }, { x: 19, y: 6 }, { x: 18, y: 7 }, { x: 19, y: 8 }, { x: 20, y: 7 }, { x: 21, y: 6 }, { x: 20, y: 5 }]);

		const fourth = out.results.find(res => res.interceptedPoints.some(pt => pt.x === 8 && pt.y === 16));
		expect(fourth).toBeDefined();
		expect(Array.isArray(fourth.interceptedPoints)).toBe(true);
		expect(fourth.interceptedPoints).toEqual([{ x: 8, y: 16 }, { x: 9, y: 15 }, { x: 10, y: 14 }]);
		expect(fourth.convex_hull).toEqual([{ x: 10, y: 13 }, { x: 9, y: 14 }, { x: 8, y: 15 }, { x: 7, y: 16 }, { x: 7, y: 17 }, { x: 8, y: 17 }, { x: 9, y: 16 }, { x: 10, y: 15 }, { x: 11, y: 14 }, { x: 11, y: 13 }, { x: 10, y: 13 }]);
	});

});
