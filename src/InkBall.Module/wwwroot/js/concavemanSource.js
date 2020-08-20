/*eslint-disable no-console*/
import concaveman from "concaveman";
import decomp from "poly-decomp";

const isTest = document.querySelector('title').innerHTML === 'Hello concaveman';
if (isTest) {
	const root = document.createElement("div");
	root.innerHTML = '<p>Hello concaveman.</p>';
	document.body.appendChild(root);
}

const precision_points = [[484, 480], [676, 363], [944, 342],
[678, 41], [286, 237], [758, 215], [752, 117], [282, 492], [609, 262], [129, 252]
];
const concavity = 2.0, lengthThreshold = 0.0;

const output = concaveman(precision_points, concavity, lengthThreshold);

if (isTest) {
	const concaveman_output = document.createElement("div");
	concaveman_output.innerHTML = 'concaveman output points: ' + JSON.stringify(output);
	document.body.appendChild(concaveman_output);
} else
	console.log('Hello concaveman. Simple test output points: \n' + JSON.stringify(output));


// Make sure the polygon has counter-clockwise winding. Skip this step if you know it's already counter-clockwise.
console.log(`decomp => ${decomp}, decomp.makeCCW(concavePolygon) => ${decomp.makeCCW(precision_points)}`);
let convexPolygons = decomp.quickDecomp(precision_points);
// ==> [  [[1,0],[1,1],[0.5,0.5]],  [[0.5,0.5],[-1,1],[-1,0],[1,0]]  ]
console.log(`decomp.quickDecomp => ${convexPolygons}`);
// Decompose using the slow (but optimal) algorithm
convexPolygons = decomp.decomp(precision_points);
// ==> [  [[-1,1],[-1,0],[1,0],[0.5,0.5]],  [[1,0],[1,1],[0.5,0.5]]  ]
console.log(`decomp.decomp => ${convexPolygons}`);


export { concaveman };
