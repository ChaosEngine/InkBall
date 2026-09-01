
if (typeof self.location === "undefined") {
	self.location = { hostname: "localhost" };
}
// eslint-disable-next-line no-console
console.log = () => {}; // Suppress worker logs during tests
