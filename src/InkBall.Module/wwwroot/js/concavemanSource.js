"use strict";
import concaveman from "concaveman";

const isTest = document.querySelector('title').innerHTML === 'Hello concaveman';
if(isTest) {
	const root = document.createElement("div");
	root.innerHTML = '<p>Hello concaveman.</p>';
	document.body.appendChild(root);
}

const precision_points = [[484, 480], [676, 363], [944, 342],
	[678, 41], [286, 237], [758, 215], [752, 117], [282, 492], [609, 262], [129, 252]
];
const concavity = 2.0, lengthThreshold = 0.0; 

const output = concaveman(precision_points, concavity, lengthThreshold);

if(isTest) {
	const concaveman_output = document.createElement("div");
	concaveman_output.innerHTML = 'concaveman output points: ' + JSON.stringify(output);
	document.body.appendChild(concaveman_output);
} else
	console.log('Hello concaveman. Simple test output points: \n' + JSON.stringify(output));

/*if(concavemanBundle !== undefined)
	concavemanBundle.prototype.concaveman = concaveman;
else if(this !== undefined)
	this.prototype.concaveman = concaveman;
else if(globalThis !== undefined)
	globalThis.concaveman = concaveman;
export default concaveman;*/

export { concaveman };
