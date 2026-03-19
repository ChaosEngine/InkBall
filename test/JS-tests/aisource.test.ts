// @ts-nocheck
import { describe, expect, test } from "bun:test";
import { AABB, ArePointsContinuous, FindDuplicatedPoint, GraphAI, LerpMissingPoints, concaveman } from "../../src/InkBall.Module/wwwroot/js/AISource.js";
import { StatusEnum } from "../../src/InkBall.Module/wwwroot/js/shared.js";

describe("AISource.js exports", () => {
	test("ArePointsContinuous works for tuple points", () => {
		expect(ArePointsContinuous([[0, 0], [1, 0], [2, 1]])).toEqual({ result: true });
		expect(ArePointsContinuous([[0, 0], [2, 0]])).toEqual({ result: false, offenderIndex: 1, offender: [2, 0] });
	});

	test("ArePointsContinuous works for object points", () => {
		expect(ArePointsContinuous([{ x: 1, y: 1 }, { x: 2, y: 2 }])).toEqual({ result: true });
	});

	test("FindDuplicatedPoint returns duplicated tuple info", () => {
		const result = FindDuplicatedPoint([[1, 1], [2, 2], [1, 1]], 0);
		expect(result).toEqual({ secondIndex: 2, firstIndex: 0, point: [1, 1] });
	});

	test("FindDuplicatedPoint returns null when no duplicates", () => {
		expect(FindDuplicatedPoint([{ x: 1, y: 1 }, { x: 2, y: 2 }], 0)).toBeNull();
	});

	test("LerpMissingPoints returns interpolated points including destination", () => {
		const result = LerpMissingPoints([0, 0], [2, 0], () => true);
		expect(result).toEqual([[1, 0], [2, 0]]);
	});

	test("AABB updateMinMax and expand maintain bounds", () => {
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

	test("GraphAI BuildGraph creates adjacency graph for free points", async () => {
		const makePoint = (x: number, y: number, status: number) => ({
			GetPosition: () => ({ x, y }),
			GetStatus: () => status,
			adjacents: [] as Array<unknown>
		});

		const p00 = makePoint(0, 0, StatusEnum.POINT_FREE_BLUE);
		const p10 = makePoint(1, 0, StatusEnum.POINT_FREE_BLUE);
		const p11 = makePoint(1, 1, StatusEnum.POINT_OWNED_BY_RED);

		const points = new Map<number, ReturnType<typeof makePoint>>();
		points.set(0, p00);
		points.set(1, p10);
		points.set(3, p11);

		const ai = new GraphAI(StatusEnum, 2, 2, points);
		const graph = await ai.BuildGraph({ freePointStatus: StatusEnum.POINT_FREE_BLUE });

		expect(graph.vertices.length).toBe(2);
		expect(graph.edges.length).toBe(1);
		expect(graph.vertices[0].adjacents.length).toBe(1);
	});

	test("concaveman export is callable", () => {
		const hull = concaveman([[0, 0], [1, 0], [0, 1], [1, 1]], 2.0, 0.0);
		expect(Array.isArray(hull)).toBe(true);
		expect(hull.length).toBeGreaterThan(0);
	});
});
