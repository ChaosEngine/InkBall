if (typeof self.location === "undefined") {
	self.location = { hostname: "localhost" };
}

await import("../../src/InkBall.Module/wwwroot/js/AIWorker.js");
