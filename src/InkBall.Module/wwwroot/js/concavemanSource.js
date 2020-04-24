import concaveman from "concaveman";

const isTest = document.querySelector('title').innerHTML === 'Hello concaveman';
if(isTest) {
	const root = document.createElement("div");
	root.innerHTML = '<p>Hello concaveman.</p>';
	document.body.appendChild(root);
}

const precision_points = [[484.01, 480.14], [676.57, 363.96], [944.68, 342.39],
	[678.41, 41.09], [286.88, 237.09], [758.96, 215.69], [752.92, 117.69], [282.75, 492.97], [609.21, 262.15], [129.41, 252.79]
];
const concavity = 2.0, lengthThreshold = 0.0; 

const output = concaveman(precision_points, concavity, lengthThreshold);

if(isTest) {
	const concaveman_output = document.createElement("div");
	concaveman_output.innerHTML = 'concaveman output points: ' + JSON.stringify(output);
	document.body.appendChild(concaveman_output);
} else
	console.info('Hello concaveman. Simple test output points: \n' + JSON.stringify(output));

/*if(concavemanBundle !== undefined)
	concavemanBundle.prototype.concaveman = concaveman;
else if(this !== undefined)
	this.prototype.concaveman = concaveman;
else if(globalThis !== undefined)
	globalThis.concaveman = concaveman;
export default concaveman;*/

export { concaveman };
