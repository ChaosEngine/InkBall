//
// Taken from https://github.com/trekhleb/javascript-algorithms/blob/master/src/algorithms/graph/depth-first-search/__test__/depthFirstSearch.test.js
//

/**
 * @typedef {Object} Callbacks
 *
 * @property {function(vertices: Object): boolean} [allowTraversal] -
 *  Determines whether DFS should traverse from the vertex to its neighbor
 *  (along the edge). By default prohibits visiting the same vertex again.
 *
 * @property {function(vertices: Object)} [enterVertex] - Called when DFS enters the vertex.
 *
 * @property {function(vertices: Object)} [leaveVertex] - Called when DFS leaves the vertex.
 */

/**
 * @param {Callbacks} [callbacks] callbacks
 * @returns {Callbacks} callbacks
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
 * @param {Graph} graph representation
 * @param {GraphVertex} currentVertex obj
 * @param {GraphVertex} previousVertex obj
 * @param {Callbacks} callbacks obj
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
 * @param {Graph} graph representation
 * @param {GraphVertex} startVertex obj
 * @param {Callbacks} [callbacks] obj
 */
export default async function depthFirstSearch(graph, startVertex, callbacks) {
	const previousVertex = null;
	await depthFirstSearchRecursive(graph, startVertex, previousVertex, initCallbacks(callbacks));
}
