// @ts-nocheck
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
	});

	test("pnpoly detects inside/outside points", () => {
		const triangle = [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 5, y: 10 }];
		expect(pnpoly(triangle, 5, 5)).toBe(true);
		expect(pnpoly(triangle, -1, -1)).toBe(false);
	});

	test("sortPointsClockwise sorts points and annotates angles", () => {
		const points = [
			{ x: 0, y: 1 },
			{ x: 1, y: 0 },
			{ x: 0, y: -1 },
			{ x: -1, y: 0 }
		];

		const sorted = sortPointsClockwise(points);
		expect(sorted).toHaveLength(4);
		expect(sorted.every(p => typeof p.angle === "number")).toBe(true);
	});

	test("IsPointOutsideAllPaths works with line-like objects", () => {
		const line = {
			GetPointsArray: () => [
				{ x: 0, y: 0 },
				{ x: 4, y: 0 },
				{ x: 4, y: 4 },
				{ x: 0, y: 4 }
			]
		};

		expect(IsPointOutsideAllPaths(2, 2, [line])).toBe(false);
		expect(IsPointOutsideAllPaths(9, 9, [line])).toBe(true);
	});

	test("Sleep resolves asynchronously", async () => {
		const start = Date.now();
		await Sleep(5);
		expect(Date.now() - start).toBeGreaterThanOrEqual(0);
	});

	test("RandomColor returns hex string", () => {
		const col = RandomColor();
		expect(col).toMatch(/^#[0-9a-f]{6}$/i);
	});

	test("SvgVml can deserialize basic primitives", () => {
		if (typeof globalThis.self === "undefined") {
			(globalThis as typeof globalThis & { self: typeof globalThis }).self = globalThis;
		}

		const svg = new SvgVml();
		svg.Init({ iGridWidth: 10, iGridHeight: 10 });

		const oval = svg.DeserializeOval({ x: 2, y: 3, Status: StatusEnum.POINT_FREE_BLUE, Color: "#112233" });
		expect(oval.GetPosition()).toEqual({ x: 2, y: 3 });
		expect(oval.GetStatus()).toBe(StatusEnum.POINT_FREE_BLUE);
		expect(oval.GetFillColor()).toBe("#112233");

		const poly = svg.DeserializePolyline({ iId: 7, Color: "#abcdef", PointsAsString: "1,1 2,2" });
		expect(poly.GetID()).toBe(7);
		expect(poly.GetPointsArray()).toEqual([{ x: 1, y: 1 }, { x: 2, y: 2 }]);
	});

	test("GameStateStore exports in-memory point/path stores", async () => {
		const stateStore = new GameStateStore(false);
		const points = stateStore.GetPointStore();
		const paths = stateStore.GetPathStore();

		await points.set(1, { x: 1, y: 1 });
		expect(await points.has(1)).toBe(true);
		expect(points.get(1)).toEqual({ x: 1, y: 1 });

		await paths.push({ id: 1, pts: "1,1 2,2" });
		expect(await paths.count()).toBe(1);
	});
});
