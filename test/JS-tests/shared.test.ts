/// <reference types="bun-types" />
import { describe, expect, test } from "bun:test";
import {
	StatusEnum,
	hasDuplicates,
	pnpoly,
	sortPointsClockwise,
	IsPointOutsideAllPaths,
	Sleep,
	RandomColor,
	SvgVml,
	GameStateStore
} from "../../src/InkBall.Module/wwwroot/js/shared.js";

type Point2D = { x: number; y: number };
type PointWithAngle = Point2D & { angle?: number };
type LineLike = { GetPointsArray: () => Point2D[] };

interface DeserializedOval {
	GetPosition: () => Point2D;
	GetStatus: () => number;
	GetFillColor: () => string;
}

interface DeserializedPolyline {
	GetID: () => number;
	GetPointsArray: () => Point2D[];
}

interface PointStore {
	set: (key: number, value: Point2D) => Promise<void>;
	has: (key: number) => Promise<boolean>;
	get: (key: number) => Point2D | undefined;
	count: () => Promise<number>;
}

interface PathStore {
	push: (value: { id: number; pts: string }) => Promise<void>;
	count: () => Promise<number>;
}

describe("shared.js exports", () => {
	test("StatusEnum contains expected values", () => {
		expect(StatusEnum.POINT_FREE_RED).toBe(-3);
		expect(StatusEnum.POINT_FREE_BLUE).toBe(-2);
		expect(StatusEnum.POINT_FREE).toBe(-1);
		expect(StatusEnum.POINT_STARTING).toBe(0);
		expect(StatusEnum.POINT_IN_PATH).toBe(1);
		expect(StatusEnum.POINT_OWNED_BY_RED).toBe(2);
		expect(StatusEnum.POINT_OWNED_BY_BLUE).toBe(3);
	});

	test("hasDuplicates supports primitive and reference semantics", () => {
		expect(hasDuplicates([])).toBe(false);
		expect(hasDuplicates([1, 2, 1])).toBe(true);
		expect(hasDuplicates([{ x: 1 }, { x: 1 }])).toBe(false);
		expect(hasDuplicates(["1_2", "2_1", "3_2", "5_6"])).toBe(false);
		expect(hasDuplicates(["1_2", "2_1", "3_2", "2_1"])).toBe(true);
	});

	test("pnpoly detects inside/outside points", () => {
		const triangle: Point2D[] = [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 5, y: 10 }];
		expect(pnpoly(triangle, 5, 5)).toBe(true);
		expect(pnpoly(triangle, -1, -1)).toBe(false);
	});

	test("sortPointsClockwise sorts points and annotates angles", () => {
		const points: Point2D[] = [
			{ x: 0, y: 1 },
			{ x: 1, y: 0 },
			{ x: 0, y: -1 },
			{ x: -1, y: 0 }
		];

		const sorted = sortPointsClockwise(points) as PointWithAngle[];
		expect(sorted).toHaveLength(4);
		expect(sorted.every(p => typeof p.angle === "number")).toBe(true);
	});

	test("IsPointOutsideAllPaths works with line-like objects", () => {
		const line: LineLike = {
			GetPointsArray: () => [
				{ x: 19, y: 18 },//
				{ x: 20, y: 17 },//
				{ x: 20, y: 19 },//       
				{ x: 21, y: 16 },//      X --- X 
				{ x: 21, y: 18 },//    X     X
				{ x: 22, y: 17 },//  X --- X
				{ x: 21, y: 16 },//
			]
		};

		expect(IsPointOutsideAllPaths(21, 17, [line])).toBe(false);
		expect(IsPointOutsideAllPaths(21, 25, [line])).toBe(true);
	});

	test("Sleep resolves asynchronously", async () => {
		const start = Date.now();
		await Sleep(5);
		expect(Date.now() - start).toBeGreaterThanOrEqual(0);
	});

	test("SvgVml can deserialize basic primitives", () => {
		// if (typeof globalThis.self === "undefined")
		// 	(globalThis as typeof globalThis & { self: typeof globalThis }).self = globalThis;
		

		const svg = new SvgVml();
		svg.Init({ iGridWidth: 10, iGridHeight: 10 });

		const oval = svg.DeserializeOval({ x: 2, y: 3, Status: StatusEnum.POINT_FREE_BLUE, Color: "#112233" }) as unknown as DeserializedOval;
		expect(oval.GetPosition()).toEqual({ x: 2, y: 3 });
		expect(oval.GetStatus()).toBe(StatusEnum.POINT_FREE_BLUE);
		expect(oval.GetFillColor()).toBe("#112233");

		const poly = svg.DeserializePolyline({ iId: 7, Color: "#abcdef", PointsAsString: "1,1 2,2" }) as unknown as DeserializedPolyline;
		expect(poly.GetID()).toBe(7);
		expect(poly.GetPointsArray()).toEqual([{ x: 1, y: 1 }, { x: 2, y: 2 }]);
	});

	test("GameStateStore exports in-memory point/path stores", async () => {
		const stateStore = new GameStateStore(false);
		const points = stateStore.GetPointStore() as PointStore;
		const paths = stateStore.GetPathStore() as PathStore;

		await points.set(1, { x: 1, y: 1 });
		expect(await points.has(1)).toBe(true);
		expect(points.get(1)).toEqual({ x: 1, y: 1 });

		await paths.push({ id: 1, pts: "1,1 2,2" });
		expect(await paths.count()).toBe(1);
	});

	test("SvgVml test if IsPointInCircle works correctly", () => {
		const svg = new SvgVml();
		const inside = 1, outside = -1, circleCenter = { x: 15, y: 15 }, radius = 2;

		expect(svg.IsPointInCircle(/*test point*/{ x: 15 + 1, y: 15 + 0 }, circleCenter, radius)).toBe(inside);
		expect(svg.IsPointInCircle(/*test point*/{ x: 15 + 4, y: 15 + 4 }, circleCenter, radius)).toBe(outside);
	});

	test("StatusEnum has all required point statuses", () => {
		expect(StatusEnum.POINT_FREE_RED).toBeDefined();
		expect(StatusEnum.POINT_FREE_BLUE).toBeDefined();
		expect(StatusEnum.POINT_STARTING).toBeDefined();
		expect(StatusEnum.POINT_IN_PATH).toBeDefined();
		expect(StatusEnum.POINT_OWNED_BY_RED).toBeDefined();
		expect(StatusEnum.POINT_OWNED_BY_BLUE).toBeDefined();
		// Verify they're all different
		const values = [
			StatusEnum.POINT_FREE_RED,
			StatusEnum.POINT_FREE_BLUE,
			StatusEnum.POINT_FREE,
			StatusEnum.POINT_STARTING,
			StatusEnum.POINT_IN_PATH,
			StatusEnum.POINT_OWNED_BY_RED,
			StatusEnum.POINT_OWNED_BY_BLUE
		];
		expect(new Set(values).size).toBe(values.length);
	});

	test("hasDuplicates with complex mixed types", () => {
		const mixed: Array<{ id: number } | number[] | string | number | undefined> = [
			{ id: 1 },
			[1, 2],
			"string1",
			42,
			"string1",
			[1, 2],
			undefined
		];
		expect(hasDuplicates(mixed)).toBe(true);
	});

	test("pnpoly with complex concave polygon", () => {
		// Star-like polygon
		const star: Point2D[] = [
			{ x: 50, y: 0 },
			{ x: 61, y: 35 },
			{ x: 98, y: 35 },
			{ x: 68, y: 57 },
			{ x: 79, y: 91 },
			{ x: 50, y: 70 },
			{ x: 21, y: 91 },
			{ x: 32, y: 57 },
			{ x: 2, y: 35 },
			{ x: 39, y: 35 }
		];
		expect(pnpoly(star, 50, 50)).toBe(true); // Center
		expect(pnpoly(star, 50, 0)).toBe(false); // On vertex (boundary edge)
		expect(pnpoly(star, 0, 0)).toBe(false); // Far outside
	});

	test("sortPointsClockwise with large point set", () => {
		const points: Point2D[] = [];
		for (let i = 0; i < 360; i += 10) {
			const rad = (i * Math.PI) / 180;
			points.push({ x: Math.cos(rad) * 100, y: Math.sin(rad) * 100 });
		}
		const sorted = sortPointsClockwise(points) as PointWithAngle[];
		expect(sorted.length).toBe(points.length);
		expect(sorted.every(p => typeof p.angle === "number")).toBe(true);
		// Check angles are sorted
		for (let i = 1; i < sorted.length; i++) {
			const prevAngle = sorted[i - 1].angle || 0;
			const currAngle = sorted[i].angle || 0;
			expect(currAngle).toBeGreaterThanOrEqual(prevAngle);
		}
	});

	test("IsPointOutsideAllPaths with multiple complex paths", () => {
		const lines: LineLike[] = [
			{
				GetPointsArray: () => [
					{ x: 0, y: 0 }, { x: 10, y: 10 },
					{ x: 10, y: 0 }, { x: 0, y: 10 }
				]
			},
			{
				GetPointsArray: () => [
					{ x: 20, y: 20 }, { x: 30, y: 30 },
					{ x: 30, y: 20 }, { x: 20, y: 30 }
				]
			}
		];

		expect(IsPointOutsideAllPaths(50, 50, lines)).toBe(true);
		expect(IsPointOutsideAllPaths(5, 5, lines)).toBe(false);
		expect(IsPointOutsideAllPaths(25, 25, lines)).toBe(false);
	});

	test("RandomColor produces valid hex colors", () => {
		for (let i = 0; i < 10; i++) {
			const col = RandomColor();
			expect(col).toMatch(/^#[0-9a-f]{6}$/i);
			// Ensure no overflow
			expect(col.length).toBe(7);
		}
	});

	test("GameStateStore supports concurrent operations", async () => {
		const stateStore = new GameStateStore(false);
		const points = stateStore.GetPointStore() as PointStore;

		const promises: Array<Promise<void>> = [];
		for (let i = 0; i < 100; i++) {
			promises.push(points.set(i, { x: i, y: i * 2 }));
		}
		await Promise.all(promises);

		expect(await points.count()).toBe(100);
		expect(await points.has(50)).toBe(true);
		expect(points.get(50)).toEqual({ x: 50, y: 100 });
	});

	test("GameStateStore path operations", async () => {
		const stateStore = new GameStateStore(false);
		const paths = stateStore.GetPathStore() as PathStore;

		await paths.push({ id: 1, pts: "1,1 2,2 3,3" });
		await paths.push({ id: 2, pts: "4,4 5,5 6,6" });

		expect(await paths.count()).toBe(2);
	});

	test("SvgVml handles multiple deserialization operations", () => {
		const svg = new SvgVml();
		svg.Init({ iGridWidth: 100, iGridHeight: 100 });

		const ovals: DeserializedOval[] = [];
		for (let i = -2; i <= 2; i++) {
			ovals.push(
				svg.DeserializeOval({
					x: 50 + i * 5,
					y: 50 + i * 5,
					Status: StatusEnum.POINT_FREE_BLUE,
					Color: "#" + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, "0")
				}) as unknown as DeserializedOval
			);
		}

		ovals.forEach(oval => {
			expect(oval.GetPosition()).toBeDefined();
			expect(oval.GetStatus()).toBeDefined();
		});
	});

});
