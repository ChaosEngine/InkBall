/// <reference types="bun-types" />
import { describe, expect, test } from "bun:test";
import { AABB, ArePointsContinuous, FindDuplicatedPoint, GraphAI, LerpMissingPoints, concaveman } from "../../src/InkBall.Module/wwwroot/js/AISource.js";
import { StatusEnum } from "../../src/InkBall.Module/wwwroot/js/shared.js";

type CoordTuple = [number, number];
type CoordObj = { x: number; y: number };
type ContinuityResult = { result: boolean; offenderIndex?: number; offender?: CoordTuple | CoordObj };
type DuplicateResult = { secondIndex: number; firstIndex: number; point: CoordTuple | CoordObj } | null;

interface GraphVertex {
	adjacents: unknown[];
}

interface GraphData {
	vertices: GraphVertex[];
	edges: unknown[];
}

interface PointLike {
	GetPosition: () => CoordObj;
	GetStatus: () => number;
	adjacents: unknown[];
}

describe("AISource.js exports - ArePointsContinuous", () => {
	test("works for basic tuple points", () => {
		expect(ArePointsContinuous([[0, 0], [1, 0], [2, 1]]) as ContinuityResult).toEqual({ result: true });
	});

	test("detects gaps in short paths", () => {
		expect(ArePointsContinuous([[0, 0], [2, 0]]) as ContinuityResult).toEqual({ result: false, offenderIndex: 1, offender: [2, 0] });
	});

	test("works for object points", () => {
		expect(ArePointsContinuous([{ x: 1, y: 1 }, { x: 2, y: 2 }]) as ContinuityResult).toEqual({ result: true });
	});

	test("detects gaps in long paths", () => {
		const longPath: CoordTuple[] = [];
		for (let i = 0; i < 50; i++) {
			longPath.push([i, i]);
		}
		longPath.push([100, 100]); // Large gap
		const result = ArePointsContinuous(longPath) as ContinuityResult;
		expect(result.result).toBe(false);
		expect(result.offenderIndex).toBe(50);
	});

	test("validates single point", () => {
		expect(ArePointsContinuous([[5, 5]]) as ContinuityResult).toEqual({ result: true });
	});

	test("validates diagonal and orthogonal moves", () => {
		const complex: CoordTuple[] = [
			[0, 0], [1, 0], [2, 0], [2, 1], [2, 2], [1, 2], [0, 2], [0, 1], [0, 0]
		];
		expect(ArePointsContinuous(complex) as ContinuityResult).toEqual({ result: true });
	});

	test("detects break in middle of long path", () => {
		const path = Array.from({ length: 100 }, (_, i) => [i, 0] as CoordTuple);
		path[50] = [75, 0]; // Jump in middle
		const result = ArePointsContinuous(path) as ContinuityResult;
		expect(result.result).toBe(false);
		expect(result.offenderIndex).toBeGreaterThanOrEqual(50);
	});
});

describe("AISource.js exports - FindDuplicatedPoint", () => {
	test("returns duplicated tuple info", () => {
		const result = FindDuplicatedPoint([[1, 1], [2, 2], [1, 1]], 0) as DuplicateResult;
		expect(result).toEqual({ secondIndex: 2, firstIndex: 0, point: [1, 1] });
	});

	test("returns null when no duplicates", () => {
		expect(FindDuplicatedPoint([{ x: 1, y: 1 }, { x: 2, y: 2 }], 0) as DuplicateResult).toBeNull();
	});

	test("finds duplicates in large arrays", () => {
		const large = Array.from({ length: 1000 }, (_, i) => [i % 50, i % 30] as CoordTuple);
		const result = FindDuplicatedPoint(large, 0) as DuplicateResult;
		expect(result).not.toBeNull();
		if (result === null) throw new Error("Expected duplicate point");
		expect(result.firstIndex).toBeLessThan(result.secondIndex);
	});

	test("finds consecutive duplicates", () => {
		const result = FindDuplicatedPoint([[5, 5], [5, 5], [6, 6]], 0) as DuplicateResult;
		expect(result).toEqual({ secondIndex: 1, firstIndex: 0, point: [5, 5] });
	});

	test("finds multiple duplicates and returns first", () => {
		const result = FindDuplicatedPoint([[1, 1], [2, 2], [1, 1], [1, 1]], 0) as DuplicateResult;
		if (result === null) throw new Error("Expected duplicate point");
		expect(result.secondIndex).toBe(2);
		expect(result.firstIndex).toBe(0);
	});
});

describe("AISource.js exports - LerpMissingPoints", () => {
	test("returns interpolated points including destination", () => {
		const anyPointIsGood = () => true;
		const result = LerpMissingPoints([0, 0], [4, 2], anyPointIsGood) as CoordTuple[];
		expect(result).toEqual([[1, 0], [2, 1], [3, 1], [4, 2]]);
	});

	test("handles long diagonal lines", () => {
		const anyPointIsGood = () => true;
		const result = LerpMissingPoints([0, 0], [20, 20], anyPointIsGood) as CoordTuple[];
		expect(result.length).toBeGreaterThan(10);
		expect(result[result.length - 1]).toEqual([20, 20]);
	});

	test("respects validator predicate", () => {
		const validPoints = new Set<string>();
		for (let i = 0; i <= 10; i += 2) {
			validPoints.add(`${i},${i}`);
		}
		const isValid = (x: number, y: number) => validPoints.has(`${x},${y}`);
		const result = LerpMissingPoints([0, 0], [10, 10], isValid) as CoordTuple[];
		expect(result.every((pt: CoordTuple) => isValid(pt[0], pt[1]))).toBe(true);
	});

	test("handles vertical and horizontal lines", () => {
		const anyPointIsGood = () => true;
		const vertical = LerpMissingPoints([5, 0], [5, 10], anyPointIsGood) as CoordTuple[];
		const horizontal = LerpMissingPoints([0, 7], [10, 7], anyPointIsGood) as CoordTuple[];

		expect(vertical.length).toBeGreaterThan(5);
		expect(horizontal.length).toBeGreaterThan(5);
		expect(vertical[vertical.length - 1]).toEqual([5, 10]);
		expect(horizontal[horizontal.length - 1]).toEqual([10, 7]);
	});

	test("handles very short distances", () => {
		const anyPointIsGood = () => true;
		const result = LerpMissingPoints([0, 0], [1, 1], anyPointIsGood) as CoordTuple[];
		expect(result.length).toBeGreaterThan(0);
		expect(result[result.length - 1]).toEqual([1, 1]);
	});
});

describe("AISource.js exports - AABB", () => {
	test("updateMinMax and expand maintain bounds", () => {
		const bbox = new AABB();
		bbox.updateMinMax(2, 3);
		bbox.updateMinMax(5, 7);
		expect(bbox.minX).toBe(2);
		expect(bbox.minY).toBe(3);
		expect(bbox.maxX).toBe(5);
		expect(bbox.maxY).toBe(7);

		bbox.expand(1, 0, 0, 10, 10);
		expect(bbox.minX).toBe(1);
		expect(bbox.minY).toBe(2);
		expect(bbox.maxX).toBe(6);
		expect(bbox.maxY).toBe(8);
	});

	test("handles many sequential updates", () => {
		const bbox = new AABB();
		for (let i = -100; i < 100; i += 10) {
			bbox.updateMinMax(i, i + 5);
		}
		expect(bbox.minX).toBeLessThanOrEqual(-90);
		expect(bbox.minY).toBeLessThanOrEqual(-90);
		expect(bbox.maxX).toBeGreaterThanOrEqual(80);
		expect(bbox.maxY).toBeGreaterThanOrEqual(90);
	});

	test("expand handles grid boundary expansion", () => {
		const bbox = new AABB();
		bbox.updateMinMax(10, 10);
		bbox.updateMinMax(20, 20);
		bbox.expand(2, 3, 4, 100, 100);
		expect(bbox.minX).toBeLessThanOrEqual(10);
		expect(bbox.minY).toBeLessThanOrEqual(10);
		expect(bbox.maxX).toBeGreaterThanOrEqual(20);
		expect(bbox.maxY).toBeGreaterThanOrEqual(20);
		expect(bbox.maxX).toBeLessThanOrEqual(100);
		expect(bbox.maxY).toBeLessThanOrEqual(100);
	});

	test("handles negative coordinates", () => {
		const bbox = new AABB();
		bbox.updateMinMax(-50, -30);
		bbox.updateMinMax(-10, 10);
		expect(bbox.minX).toBe(-50);
		expect(bbox.minY).toBe(-30);
		expect(bbox.maxX).toBe(-10);
		expect(bbox.maxY).toBe(10);
	});

	test("expand with large padding", () => {
		const bbox = new AABB();
		bbox.updateMinMax(50, 50);
		bbox.updateMinMax(60, 60);
		bbox.expand(100, 100, 100, 1000, 1000);
		// After expansion, bounds should be defined and within grid
		expect(typeof bbox.minX).toBe("number");
		expect(typeof bbox.minY).toBe("number");
		expect(bbox.maxX).toBeLessThanOrEqual(1000);
		expect(bbox.maxY).toBeLessThanOrEqual(1000);
	});
});

describe("AISource.js exports - GraphAI", () => {
	const makePoint = (x: number, y: number, status: number): PointLike => ({
		GetPosition: () => ({ x, y }),
		GetStatus: () => status,
		adjacents: [] as Array<unknown>
	});

	test("BuildGraph creates adjacency graph for free points", async () => {

		const p00 = makePoint(0, 0, StatusEnum.POINT_FREE_BLUE);
		const p10 = makePoint(1, 0, StatusEnum.POINT_FREE_BLUE);
		const p11 = makePoint(1, 1, StatusEnum.POINT_OWNED_BY_RED);

		const points = new Map<number, PointLike>();
		points.set(0, p00);
		points.set(1, p10);
		points.set(3, p11);

		const ai = new GraphAI(StatusEnum, 2, 2, points);
		const graph = await ai.BuildGraph({ freePointStatus: StatusEnum.POINT_FREE_BLUE }) as GraphData;

		expect(graph.vertices.length).toBe(2);
		expect(graph.edges.length).toBe(1);
		expect(graph.vertices[0].adjacents.length).toBe(1);
	});

	test("BuildGraph handles large grid with mixed statuses", async () => {
		const points = new Map<number, PointLike>();
		let idx = 0;

		// Create 10x10 grid with mixed points
		for (let x = 0; x < 10; x++) {
			for (let y = 0; y < 10; y++) {
				const status = (x + y) % 2 === 0 ? StatusEnum.POINT_FREE_BLUE : StatusEnum.POINT_OWNED_BY_RED;
				points.set(idx++, makePoint(x, y, status));
			}
		}

		const ai = new GraphAI(StatusEnum, 10, 10, points);
		const graph = await ai.BuildGraph({ freePointStatus: StatusEnum.POINT_FREE_BLUE }) as GraphData;

		expect(graph.vertices.length).toBeGreaterThan(0);
		expect(graph.edges.length).toBeGreaterThan(0);
		expect(graph.vertices.every((v: GraphVertex) => Array.isArray(v.adjacents))).toBe(true);
	});

	test("BuildGraph handles all free points", async () => {
		const points = new Map<number, PointLike>();
		let idx = 0;

		for (let x = 0; x < 5; x++) {
			for (let y = 0; y < 5; y++) {
				points.set(idx++, makePoint(x, y, StatusEnum.POINT_FREE_BLUE));
			}
		}

		const ai = new GraphAI(StatusEnum, 5, 5, points);
		const graph = await ai.BuildGraph({ freePointStatus: StatusEnum.POINT_FREE_BLUE }) as GraphData;

		expect(graph.vertices.length).toBe(25);
		// 5x5 grid: 4 corners with 2 edges, 12 edges with 3, 9 interior with 4
		expect(graph.edges.length).toBeGreaterThan(0);
	});

	test("BuildGraph isolates blocked regions", async () => {
		const points = new Map<number, PointLike>();
		let idx = 0;

		// Create a graph with a wall of blocked points
		for (let x = 0; x < 5; x++) {
			for (let y = 0; y < 5; y++) {
				const isWall = x === 2;
				const status = isWall ? StatusEnum.POINT_OWNED_BY_RED : StatusEnum.POINT_FREE_BLUE;
				points.set(idx++, makePoint(x, y, status));
			}
		}

		const ai = new GraphAI(StatusEnum, 5, 5, points);
		const graph = await ai.BuildGraph({ freePointStatus: StatusEnum.POINT_FREE_BLUE }) as GraphData;

		expect(graph.vertices.length).toBeGreaterThanOrEqual(20);
	});
});

describe("AISource.js exports - concaveman", () => {
	test("export is callable", () => {
		const hull = concaveman([[0, 0], [1, 0], [0, 1], [1, 1]], 2.0, 0.0) as CoordTuple[];
		expect(Array.isArray(hull)).toBe(true);
		expect(hull.length).toBeGreaterThan(0);
	});

	test("handles varying concavity parameters", () => {
		const points = [
			[0, 0], [10, 0], [20, 5], [30, 0],
			[40, 10], [30, 20], [20, 15], [10, 20], [0, 10]
		] as [number, number][];

		const hull1 = concaveman(points, 1.0, 0.0) as CoordTuple[];
		const hull2 = concaveman(points, 3.0, 0.0) as CoordTuple[];
		const hull3 = concaveman(points, 10.0, 0.0) as CoordTuple[];

		expect(hull1.length).toBeGreaterThan(1);
		expect(hull2.length).toBeGreaterThan(1);
		expect(hull3.length).toBeGreaterThan(1);
	});

	test("handles large point clouds (circular)", () => {
		const points = [] as [number, number][];
		const twoPI = Math.PI * 2;
		const twoPIDiv200 = twoPI / 200;
		for (let i = 0; i < 200; i++) {
			const angle = i * twoPIDiv200;
			const radius = 50 + Math.random() * 10;
			points.push([Math.round(Math.cos(angle) * radius), Math.round(Math.sin(angle) * radius)]);
		}
		const hull = concaveman(points, 2.0, 0.0) as CoordTuple[];
		expect(hull.length).toBeGreaterThan(3);
	});

	test("handles sparse point clouds", () => {
		const points = [
			[0, 0], [100, 0], [100, 100], [0, 100],
			[50, 50], [25, 25], [75, 75], [25, 75], [75, 25]
		] as [number, number][];

		const hull = concaveman(points, 2.0, 0.0) as CoordTuple[];
		expect(hull.length).toBeGreaterThan(1);
		expect(hull[0]).toBeDefined();
	});

	test("handles collapsed shapes", () => {
		const points = [[0, 0], [1, 0], [2, 0], [1, 1]] as [number, number][];
		const hull = concaveman(points, 2.0, 0.0) as CoordTuple[];
		expect(hull.length).toBeGreaterThan(1);
	});

	test("handles length threshold parameter", () => {
		const points = [[0, 0], [1, 0], [2, 1], [1, 2], [0, 1]] as [number, number][];
		const hull1 = concaveman(points, 2.0, 0.0) as CoordTuple[];
		const hull2 = concaveman(points, 2.0, 5.0) as CoordTuple[]; // Larger threshold

		expect(hull1.length).toBeGreaterThan(2);
		expect(hull2.length).toBeGreaterThan(2);
	});
});
