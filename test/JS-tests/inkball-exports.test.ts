// @ts-nocheck
import { describe, expect, test } from "bun:test";
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
});
