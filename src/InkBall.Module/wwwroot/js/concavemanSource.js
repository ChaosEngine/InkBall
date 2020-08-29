/*eslint-disable no-console*/
import concaveman from "concaveman";
import decomp from "poly-decomp";

const precision_points = [[484, 480], [676, 363], [944, 342],
[678, 41], [286, 237], [758, 215], [752, 117], [282, 492], [609, 262], [129, 252]
];
const concavity = 2.0, lengthThreshold = 0.0;
const concaveman_output = concaveman(precision_points, concavity, lengthThreshold);
//console.log('Hello concaveman. Simple test output points: \n' + JSON.stringify(output));


// Make sure the polygon has counter-clockwise winding. Skip this step if you know it's already counter-clockwise.
//console.log(`decomp.makeCCW(concavePolygon) => ${decomp.makeCCW(precision_points)}`);
//const convexPolygonsQuick = decomp.quickDecomp(precision_points);
// ==> [  [[1,0],[1,1],[0.5,0.5]],  [[0.5,0.5],[-1,1],[-1,0],[1,0]]  ]
//console.log(`decomp.quickDecomp => ${convexPolygons}`);
// Decompose using the slow (but optimal) algorithm
const convexPolygons = decomp.decomp(precision_points);
// ==> [  [[-1,1],[-1,0],[1,0],[0.5,0.5]],  [[1,0],[1,1],[0.5,0.5]]  ]
//console.log(`decomp.decomp => ${convexPolygons}`);
if (!concaveman_output || concaveman_output.length <= 0 ||
	//!convexPolygonsQuick || convexPolygonsQuick.length <= 0 || 
	!convexPolygons || convexPolygons.length <= 0) {
	console.log('decomp or concaveman error');
}

export { concaveman };
