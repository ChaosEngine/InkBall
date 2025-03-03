//
// Taken from https://github.com/trekhleb/javascript-algorithms/blob/master/src/algorithms/graph/depth-first-search/__test__/depthFirstSearch.test.js
//

/**
 * Initializes the callbacks for depth-first search traversal.
 * @param {object} [callbacks] - An object containing optional callback functions.
 * @param {Function} [callbacks.allowTraversal] - A function to determine if traversal to the next vertex is allowed.
 * @param {Function} [callbacks.enterVertex] - A function to be called when entering a vertex.
 * @param {Function} [callbacks.leaveVertex] - A function to be called when leaving a vertex.
 * @param {Function} [callbacks.showCycle] - A function to be called when a cycle is detected.
 * @returns {object} An object containing the initialized callback functions.
 */
function initCallbacks(callbacks = {}) {
	const initiatedCallback = callbacks;

	const stubCallback = () => { };

	initiatedCallback.lastSeen = null;
	const allowTraversalCallback = (
		() => {
			const seen = {};
			return ({ nextVertex }) => {
				const { x, y } = nextVertex.GetPosition();
				if (!seen[`${x}_${y}`]) {
					seen[`${x}_${y}`] = nextVertex;
					return true;
				}
				initiatedCallback.lastSeen = seen;
				return false;
			};
		}
	)();

	initiatedCallback.allowTraversal = callbacks.allowTraversal || allowTraversalCallback;
	initiatedCallback.enterVertex = callbacks.enterVertex || stubCallback;
	initiatedCallback.leaveVertex = callbacks.leaveVertex || stubCallback;
	initiatedCallback.showCycle = callbacks.showCycle || stubCallback;

	return initiatedCallback;
}

/**
 * @param {object} graph representation
 * @param {object} currentVertex obj
 * @param {object} previousVertex obj
 * @param {Function} callbacks obj
 */
async function depthFirstSearchRecursive(graph, currentVertex, previousVertex, callbacks) {
	callbacks.enterVertex({ currentVertex, previousVertex });

	for (const nextVertex of graph.getNeighbors(currentVertex)) {
		if (callbacks.allowTraversal({ previousVertex, currentVertex, nextVertex })) {
			await depthFirstSearchRecursive(graph, nextVertex, currentVertex, callbacks);
		} else {
			await callbacks.showCycle(callbacks.lastSeen, nextVertex);
		}
	}

	callbacks.leaveVertex({ currentVertex, previousVertex });
}

/**
 * @param {object} graph representation
 * @param {object} startVertex obj
 * @param {Function} [callbacks] obj
 */
export default async function depthFirstSearch(graph, startVertex, callbacks) {
	const previousVertex = null;
	await depthFirstSearchRecursive(graph, startVertex, previousVertex, initCallbacks(callbacks));
}
