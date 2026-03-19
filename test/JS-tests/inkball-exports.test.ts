// @ts-nocheck
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { HomeOnLoad, InkBallGame, ListOnLoad } from "../../src/InkBall.Module/wwwroot/js/inkball.js";

describe("inkball.js public exports", () => {
	test("InkBallGame is exported as a class-like constructor", () => {
		expect(typeof InkBallGame).toBe("function");
		expect(InkBallGame.prototype).toBeDefined();
	});

	test("HomeOnLoad and ListOnLoad are exported functions", () => {
		expect(typeof HomeOnLoad).toBe("function");
		expect(typeof ListOnLoad).toBe("function");
	});

	test("inkball.js calls CLUSTERING_AND_CONCAVEMAN and consumes operation payload shape", () => {
		const src = readFileSync("InkBall/src/InkBall.Module/wwwroot/js/inkball.js", "utf8");

		expect(src.includes('operation: "CLUSTERING_AND_CONCAVEMAN"')).toBe(true);
		expect(src.includes("found.clustered_point_coords")).toBe(true);
		expect(src.includes("found.convex_hull")).toBe(true);
		expect(src.includes("found?.interceptedPoints")).toBe(true);
		expect(src.includes("found.surrounding_path")).toBe(true);
		expect(src.includes("found.rects2Draw")).toBe(true);
		expect(src.includes("found.randomColor")).toBe(true);
	});
});
