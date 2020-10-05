/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "$" }]*/

//////////////////////////////////////////////////////
// SVG-VML mini graphic library 
// ==========================================
// written by Gerard Ferrandez
// initial version - June 28, 2006
// modified - 2018-2020 - Andrzej Pauli polyline and oval functions & extensions
// modified - July 21 - use object functions
// modified - July 24 - debug
// www.dhteumeuleu.com
//////////////////////////////////////////////////////
"use strict";

let SVG = false;
const svgNS = "http://www.w3.org/2000/svg";
let svgAntialias = false, cont = null;
let $createOval, $createPolyline, $RemovePolyline, $RemoveOval, $createSVGVML, $createLine, PointStore, PathStore;

if (document.createElementNS) {
	let svg = document.createElementNS(svgNS, "svg");
	SVG = (svg.x !== null);
}
/**
 * Test for array uniquness using default object comparator
 * @param {array} array of objects that are tested againstn uniqenes
 * @returns {boolean} true - has duplicates
 */
function hasDuplicates(array) {
	return (new Set(array)).size !== array.length;
}

if (SVG) {
	/* ============= SVG ============== */
	$createSVGVML = function (o, iWidth, iHeight, antialias) {
		cont = document.createElementNS(svgNS, "svg");
		//ch_added start
		//if (iWidth)
		//	cont.setAttributeNS(null, 'width', iWidth);
		//if (iHeight)
		//	cont.setAttributeNS(null, 'height', iHeight);
		//ch_added end
		o.appendChild(cont);
		svgAntialias = antialias;
		return cont;
	};
	$createLine = function (w, col, linecap) {
		const o = document.createElementNS(svgNS, "line");
		o.setAttribute("shape-rendering", svgAntialias ? "auto" : "optimizeSpeed");
		o.setAttribute("stroke-width", Math.round(w) + "px");
		if (col) o.setAttribute("stroke", col);
		if (linecap) o.setAttribute("stroke-linecap", linecap);
		o.$move = function (x1, y1, x2, y2) {
			this.setAttribute("x1", x1);
			this.setAttribute("y1", y1);
			this.setAttribute("x2", x2);
			this.setAttribute("y2", y2);
		};
		o.$RGBcolor = function (R, G, B) { this.setAttribute("stroke", "rgb(" + Math.round(R) + "," + Math.round(G) + "," + Math.round(B) + ")"); };
		o.$SetColor = function (color) { this.setAttribute("stroke", color); };
		o.$strokeWidth = function (s) { this.setAttribute("stroke-width", Math.round(s) + "px"); };
		cont.appendChild(o);
		return o;
	};
	$createPolyline = function (w, points, col) {
		const o = document.createElementNS(svgNS, "polyline");
		o.setAttribute("shape-rendering", svgAntialias ? "auto" : "optimizeSpeed");
		o.setAttribute("stroke-width", Math.round(w));
		if (col) o.setAttribute("stroke", col);
		o.setAttribute("fill", col);
		o.setAttribute("fill-opacity", "0.1");
		if (points) o.setAttribute("points", points);
		o.setAttribute("stroke-linecap", "round");
		o.setAttribute("stroke-linejoin", "round");
		cont.appendChild(o);
		//ch_added start
		o.setAttribute("data-id", 0);
		o.$AppendPoints = function (x, y, diff = 16) {
			const pts_str = this.getAttribute("points");
			const pts = pts_str.split(" ");

			if (true === hasDuplicates(pts)) {
				// debugger;
				return false;
			}

			let arr;//obtain last point coords
			if (pts.length <= 1 || (arr = pts[pts.length - 1].split(",")).length !== 2) {
				// debugger;
				return false;
			}

			const last_x = parseInt(arr[0]), last_y = parseInt(arr[1]);
			const x_diff = parseInt(x), y_diff = parseInt(y);
			if (!(Math.abs(last_x - x_diff) <= diff && Math.abs(last_y - y_diff) <= diff)) {
				// debugger;
				return false;
			}

			this.setAttribute("points", pts_str + ` ${x},${y}`);
			return true;
		};
		o.$RemoveLastPoint = function () {
			const newpts = this.getAttribute("points").replace(/(\s\d+,\d+)$/, "");
			this.setAttribute("points", newpts);
			return newpts;
		};
		o.$ContainsPoint = function (x, y) {
			const regexstr = new RegExp(`${x},${y}`, 'g');
			const cnt = (this.getAttribute("points").match(regexstr) || []).length;
			return cnt;
		};
		o.$GetPointsString = function () {
			return this.getAttribute("points");
		};
		o.$GetPointsArray = function () {
			//x0,y0 x1,y1 x2,y2
			return this.getAttribute("points").split(" ").map(function (pt) {
				const tab = pt.split(',');
				return { x: parseInt(tab[0]), y: parseInt(tab[1]) };
			});
		};
		o.$SetPoints = function (sPoints) {
			this.setAttribute("points", sPoints);
		};
		o.$GetIsClosed = function () {
			const pts = this.getAttribute("points").split(" ");
			return pts[0] === pts[pts.length - 1];
		};
		o.$GetLength = function () {
			return this.getAttribute("points").split(" ").length;
		};
		o.$SetWidthAndColor = function (w, col) {
			this.setAttribute("stroke", col);
			this.setAttribute("fill", col);
			this.setAttribute("stroke-width", Math.round(w));
		};
		o.$GetID = function () { return parseInt(this.getAttribute("data-id")); };
		o.$SetID = function (iID) { this.setAttribute("data-id", iID); };
		o.$GetFillColor = function () { return this.getAttribute("fill"); };
		//ch_added end
		return o;
	};
	$createOval = function (diam) {
		const o = document.createElementNS(svgNS, "circle");
		o.setAttribute("shape-rendering", svgAntialias ? "auto" : "optimizeSpeed");
		o.setAttribute("stroke-width", 0);
		o.setAttribute("r", Math.round(diam >> 1));
		//ch_commented o.style.cursor = "pointer";
		//ch_added
		o.setAttribute("data-status", -1);
		//o.setAttribute("data-old-status", -1);
		o.$move = function (x1, y1, radius) {
			this.setAttribute("cx", x1);
			this.setAttribute("cy", y1);
			this.setAttribute("r", Math.round(radius));
		};
		o.$GetStrokeColor = function () { return this.getAttribute("stroke"); };
		o.$SetStrokeColor = function (col) { this.setAttribute("stroke", col); };
		//ch_added/changed start
		o.$GetPosition = function () {
			return { x: this.getAttribute("cx"), y: this.getAttribute("cy") };
		};
		o.$GetFillColor = function () { return this.getAttribute("fill"); };
		o.$SetFillColor = function (col) { this.setAttribute("fill", col); };
		o.$GetStatus = function () { return parseInt(this.getAttribute("data-status")); };
		o.$SetStatus = function (iStatus, saveOldPoint = false) {
			if (saveOldPoint) {
				const old_status = parseInt(this.getAttribute("data-status"));
				this.setAttribute("data-status", iStatus);
				if (old_status !== -1 && old_status !== iStatus)
					this.setAttribute("data-old-status", old_status);
			}
			else {
				this.setAttribute("data-status", iStatus);
			}
		};
		o.$RevertOldStatus = function () {
			const old_status = this.getAttribute("data-old-status");
			if (old_status) {
				this.removeAttribute("data-old-status");
				this.setAttribute("data-status", old_status);
				return parseInt(old_status);
			}
			return -1;
		};
		o.$GetZIndex = function () { return this.getAttribute("z-index"); };
		o.$SetZIndex = function (val) { this.setAttribute("z-index", val); };
		o.$Hide = function () { this.setAttribute("visibility", 'hidden'); };
		o.$Show = function () { this.setAttribute("visibility", 'visible'); };
		//ch_added/changed end
		o.$strokeWeight = function (sw) { this.setAttribute("stroke-width", sw); };
		cont.appendChild(o);
		return o;
	};
	//ch_added start
	$RemoveOval = function (Oval) {
		cont.removeChild(Oval);
	};
	$RemovePolyline = function (Polyline) {
		cont.removeChild(Polyline);
	};
	//ch_added end

} else if (document.createStyleSheet) {
	/* ============= VML ============== */
	$createSVGVML = function (o, iWidth, iHeight, antialias) {
		document.namespaces.add("v", "urn:schemas-microsoft-com:vml");
		const style = document.createStyleSheet();
		style.addRule('v\\:*', "behavior: url(#default#VML);");
		style.addRule('v\\:*', "antialias: " + antialias + ";");
		cont = o;
		return o;
	};
	$createLine = function (w, col, linecap) {
		const o = document.createElement("v:line");
		o.strokeweight = Math.round(w) + "px";
		if (col) o.strokecolor = col;
		o.$move = function (x1, y1, x2, y2) {
			this.to = x1 + "," + y1;
			this.from = x2 + "," + y2;
		};
		o.$RGBcolor = function (R, G, B) { this.strokecolor = "rgb(" + Math.round(R) + "," + Math.round(G) + "," + Math.round(B) + ")"; };
		o.$SetColor = function (color) { this.strokecolor = color; };
		o.$strokeWidth = function (s) { this.strokeweight = Math.round(s) + "px"; };
		if (linecap) {
			let s = document.createElement("v:stroke");
			s.endcap = linecap;
			o.appendChild(s);
		}
		cont.appendChild(o);
		return o;
	};
	$createPolyline = function (w, points, col) {
		const o = document.createElement("v:polyline");
		o.strokeweight = Math.round(w) + "px";
		if (col) o.strokecolor = col;
		o.points = points;
		let s = document.createElement("v:fill");
		s.color = col;
		s.opacity = 0.1;
		o.appendChild(s);
		cont.appendChild(o);
		//ch_added start
		o.setAttribute("data-id", 0);
		o.$AppendPoints = function (x, y, diff = 16) {
			const pts_str = this.points.value;
			const pts = pts_str.split(" ");

			if (true === hasDuplicates(pts)) {
				//debugger;
				return false;
			}

			let arr;//obtain last two point
			if (pts.length <= 1 || (arr = pts[pts.length - 1].split(",")).length !== 2) {
				//debugger;
				return false;
			}

			const last_x = parseInt(arr[0]), last_y = parseInt(arr[1]);
			const x_diff = parseInt(x), y_diff = parseInt(y);
			if (!(Math.abs(last_x - x_diff) <= diff && Math.abs(last_y - y_diff) <= diff)) {
				//debugger;
				return false;
			}

			this.points.value = pts_str + ` ${x},${y}`;
			return true;
		};
		o.$RemoveLastPoint = function () {
			const str = this.points.value.replace(/(\s\d+,\d+)$/, "");
			this.points.value = str;
			return str;
		};
		o.$ContainsPoint = function (x, y) {
			const regexstr = new RegExp(`${x},${y}`, 'g');
			const cnt = (this.points.value.match(regexstr) || []).length;
			return cnt;
		};
		o.$GetPointsString = function () {
			return o.points.value;
		};
		o.$GetPointsArray = function () {
			//x0,y0 x1,y1 x2,y2
			return this.points.value.split(" ").map(function (pt) {
				const tab = pt.split(',');
				return { x: parseInt(tab[0]), y: parseInt(tab[1]) };
			});
		};
		o.$SetPoints = function (sPoints) {
			this.points.value = sPoints;
		};
		o.$GetIsClosed = function () {
			const pts = this.points.value.split(" ");
			return pts[0] === pts[pts.length - 1];
		};
		o.$GetLength = function () {
			return this.points.value.split(" ").length;
		};
		o.$SetWidthAndColor = function (w, col) {
			this.strokecolor = col;
			this.fill.color = col;
			this.strokeweight = Math.round(w) + "px";
		};
		o.$GetID = function () { return parseInt(this.getAttribute("data-id")); };
		o.$SetID = function (iID) { this.setAttribute("data-id", iID); };
		o.$GetFillColor = function () { return this.fill.color; };
		//ch_added end
		return o;
	};
	$createOval = function (diam, filled) {
		const o = document.createElement("v:oval");
		o.style.position = "absolute";
		//ch_commented o.style.cursor = "pointer";
		//ch_added
		o.setAttribute("data-status", -1);
		//o.setAttribute("data-old-status", -1);
		o.strokeweight = 1;
		o.filled = filled;
		o.style.width = diam + "px";
		o.style.height = diam + "px";
		o.$move = function (x1, y1, radius) {
			this.style.left = Math.round(x1 - radius) + "px";
			this.style.top = Math.round(y1 - radius) + "px";
			this.style.width = Math.round(radius * 2) + "px";
			this.style.height = Math.round(radius * 2) + "px";
		};
		o.$GetStrokeColor = function () { return this.strokecolor; };
		o.$SetStrokeColor = function (col) { this.strokecolor = col; };
		//ch_added/changed start
		o.$GetPosition = function () {
			return {
				x: parseInt(this.style.left) + parseInt(this.style.width) * 0.5,
				y: parseInt(this.style.top) + parseInt(this.style.height) * 0.5
			};
		};
		o.$GetFillColor = function () { return this.fillcolor; };
		o.$SetFillColor = function (col) { this.fillcolor = col; };
		o.$GetStatus = function () { return parseInt(this.getAttribute("data-status")); };
		o.$SetStatus = function (iStatus, saveOldPoint = false) {
			if (saveOldPoint) {
				const old_status = parseInt(this.getAttribute("data-status"));
				this.setAttribute("data-status", iStatus);
				if (old_status !== -1 && old_status !== iStatus)
					this.setAttribute("data-old-status", old_status);
			}
			else {
				this.setAttribute("data-status", iStatus);
			}
		};
		o.$RevertOldStatus = function () {
			const old_status = this.getAttribute("data-old-status");
			if (old_status) {
				this.removeAttribute("data-old-status");
				this.setAttribute("data-status", old_status);
				return parseInt(old_status);
			}
			return -1;
		};
		o.$GetZIndex = function () { return this.getAttribute("z-index"); };
		o.$SetZIndex = function (val) { this.setAttribute("z-index", val); };
		o.$Hide = function () { this.setAttribute("visibility", 'hidden'); };
		o.$Show = function () { this.setAttribute("visibility", 'visible'); };
		//ch_added/changed end
		o.$strokeWeight = function (sw) { this.strokeweight = sw; };
		cont.appendChild(o);
		return o;
	};
	//ch_added start
	$RemoveOval = function (Oval) {
		cont.removeChild(Oval);
	};
	$RemovePolyline = function (Polyline) {
		cont.removeChild(Polyline);
	};
	//ch_added end
} else {
	/* ==== no script ==== */
	$createSVGVML = function () {
		alert('SVG or VML is not supported!');
		return false;
	};
}

/**
 * Sorting point clockwise/anticlockwise
 * @param {array} points array of points to sort
 * @returns {array} of points
 */
function sortPointsClockwise(points) {
	//Modern

	// Get the center (mean value) using reduce
	const center = points.reduce((acc, { x, y }) => {
		acc.x += x;
		acc.y += y;
		return acc;
	}, { x: 0, y: 0 });
	center.x /= points.length;
	center.y /= points.length;

	// Add an angle property to each point using tan(angle) = y/x
	const angles = points.map(({ x, y }) => {
		return { x, y, angle: Math.atan2(y - center.y, x - center.x) * 180 / Math.PI };
	});

	// Sort your points by angle
	const pointsSorted = angles.sort((a, b) => a.angle - b.angle);
	return pointsSorted;
}

//////////IndexedDB points and path stores start//////////
const DB_NAME = 'InkballGame', DB_POINT_STORE = 'points', DB_PATH_STORE = 'paths', DB_STATE_STORE = 'state';
const DB_VERSION = 1; // Use a long long for this value (don't use a float)

//main DB object
let g_DB;

async function OpenDb() {
	console.log("OpenDb ...");
	return new Promise((resolve, reject) => {
		let req = indexedDB.open(DB_NAME, DB_VERSION);
		req.onsuccess = function () {
			// Equal to: db = req.result;
			g_DB = this.result;

			//TODO: stop clearing all the time store(s)
			//ClearObjectStore();

			console.log("OpenDb DONE");
			resolve(this.result);
		};
		req.onerror = function (evt) {
			console.error("OpenDb:", evt.target.errorCode);
			reject();
		};
		req.onupgradeneeded = function (evt) {
			console.log("OpenDb.onupgradeneeded");

			const store_list = Array.from(evt.currentTarget.result.objectStoreNames);
			if (store_list.includes(DB_POINT_STORE))
				evt.currentTarget.result.deleteObjectStore(DB_POINT_STORE);
			if (store_list.includes(DB_PATH_STORE))
				evt.currentTarget.result.deleteObjectStore(DB_PATH_STORE);
			if (store_list.includes(DB_STATE_STORE))
				evt.currentTarget.result.deleteObjectStore(DB_STATE_STORE);

			const point_store = evt.currentTarget.result.createObjectStore(
				DB_POINT_STORE, { /*keyPath: 'pos',*/ autoIncrement: false });
			point_store.createIndex('Status', 'Status', { unique: false });
			point_store.createIndex('Color', 'Color', { unique: false });


			const path_store = evt.currentTarget.result.createObjectStore(
				DB_PATH_STORE, { /*keyPath: 'iId',*/ autoIncrement: false });
			path_store.createIndex('iPlayerId', 'iPlayerId', { unique: false });

			const state_store = evt.currentTarget.result.createObjectStore(
				DB_STATE_STORE, { /*keyPath: 'gameId',*/ autoIncrement: false });
		};
	});
}

/**
  * @param {string} storeName is a store name
  * @param {string} mode either "readonly" or "readwrite"
  * @returns {object} store
  */
function GetObjectStore(storeName, mode) {
	const tx = g_DB.transaction(storeName, mode);
	return tx.objectStore(storeName);
}

async function ClearObjectStore(storeName) {
	return new Promise((resolve, reject) => {
		let store = GetObjectStore(storeName, 'readwrite');
		let req = store.clear();
		req.onsuccess = function () {
			//console.log("clearObjectStore: DONE");
			resolve();
		};
		req.onerror = function (evt) {
			console.error("clearObjectStore:", evt.target.errorCode);
			reject();
		};
	});
}

/**
  * @param {number} key is calculated inxed of point y * width + x, probably not usefull
  */
async function GetPoint(key) {
	return new Promise((resolve, reject) => {
		const store = GetObjectStore(DB_POINT_STORE, 'readonly');
		const req = store.get(key);
		req.onerror = function (event) {
			reject(new Error('GetPoint => ' + event));
		};
		req.onsuccess = function (event) {
			resolve(event.target.result);
		};
	});
}

async function GetAllPoints() {
	return new Promise((resolve, reject) => {
		const store = GetObjectStore(DB_POINT_STORE, 'readonly');
		const req = store.getAll();
		req.onsuccess = function (evt) {
			//console.log("Got all customers: " + event.target.result);
			resolve(evt.target.result);
		};
		req.onerror = function (event) {
			reject(new Error('GetAllPoints => ' + event));
		};
	});
}

async function GetState(key) {
	return new Promise((resolve, reject) => {
		const store = GetObjectStore(DB_STATE_STORE, 'readonly');
		const req = store.get(key);
		req.onerror = function (event) {
			reject(new Error('GetState => ' + event));
		};
		req.onsuccess = function (event) {
			resolve(event.target.result);
		};
	});
}

/**
  * @param {number} key is path Id
  */
async function GetPath(key) {
	return new Promise((resolve, reject) => {
		const store = GetObjectStore(DB_PATH_STORE, 'readonly');
		const req = store.get(key);
		req.onerror = function (event) {
			reject(new Error('GetPath => ' + event));
		};
		req.onsuccess = function (event) {
			resolve(event.target.result);
		};
	});
}

async function GetAllPaths() {
	return new Promise((resolve, reject) => {
		const store = GetObjectStore(DB_PATH_STORE, 'readonly');
		const req = store.getAll();
		req.onsuccess = function (evt) {
			//console.log("Got all customers: " + event.target.result);
			resolve(evt.target.result);
		};
		req.onerror = function (event) {
			reject(new Error('GetAllPaths => ' + event));
		};
	});
}

/**
  * @param {number} key is calculated inxed of point y * width + x, probably not usefull
  * @param {object} oval is svg circle
  */
async function StorePoint(key, oval) {
	return new Promise((resolve, reject) => {
		//console.log("addPublication arguments:", arguments);
		const pos = oval.$GetPosition();
		const color = oval.$GetFillColor();
		const obj = {
			x: pos.x / 16,
			y: pos.y / 16,
			Status: oval.$GetStatus(),
			Color: color
			//, pos: key, //`${pos.x}_${pos.y}`
		};

		const store = GetObjectStore(DB_POINT_STORE, 'readwrite');
		let req;
		try {
			req = store.add(obj, key);
		} catch (e) {
			if (e.name == 'DataCloneError')
				console.error("This engine doesn't know how to clone a Blob, use Firefox");
			throw e;
		}
		req.onsuccess = function () {
			//console.log("Insertion in DB successful");
			resolve();
		};
		req.onerror = function () {
			console.error("StorePoint error", this.error);
			reject();
		};
	});
}

/**
  * @param {number} key is GameID
  * @param {object} game is InkBallGame object as state
  */
async function StoreState(key, game) {
	return new Promise((resolve, reject) => {
		const state = {
			iGameID: game.g_iGameID,
			iPlayerID: game.g_iPlayerID,
			iOtherPlayerId: game.m_iOtherPlayerId,
			sLastMoveGameTimeStamp: game.m_sLastMoveGameTimeStamp
		};

		const store = GetObjectStore(DB_STATE_STORE, 'readwrite');
		let req;
		try {
			req = store.add(state, key);
		} catch (e) {
			if (e.name == 'DataCloneError')
				console.error("This engine doesn't know how to clone a Blob, use Firefox");
			throw e;
		}
		req.onsuccess = function () {
			//console.log("Insertion in DB successful");
			resolve();
		};
		req.onerror = function () {
			console.error("StoreState error", this.error);
			reject();
		};
	});
}

/**
  * @param {number} key is path Id
  * @param {object} path is svg polyline
  */
async function StorePath(key, path) {
	return new Promise((resolve, reject) => {
		//console.log("addPublication arguments:", arguments);
		const iId = key;
		const Color = path.$GetFillColor();
		const PointsAsString = path.$GetPointsString();
		const obj = {
			//iId: iId,
			Color: Color,
			PointsAsString: PointsAsString
		};

		const store = GetObjectStore(DB_PATH_STORE, 'readwrite');
		let req;
		try {
			req = store.add(obj, key);
		} catch (e) {
			if (e.name == 'DataCloneError')
				console.error("This engine doesn't know how to clone a Blob, use Firefox");
			throw e;
		}
		req.onsuccess = function () {
			resolve();
		};
		req.onerror = function () {
			console.error("StorePath error", this.error);
			reject();
		};
	});
}

/**
 * @param {string} pos is position X_Y of circle/oval
 */
function DeletePublicationFromBib(pos) {
	console.log("deletePublicationFromBib:", arguments);
	let store = GetObjectStore(DB_POINT_STORE, 'readwrite');
	let req = store.index('pos');
	req.get(pos).onsuccess = function (evt) {
		if (typeof evt.target.result == 'undefined') {
			console.error("No matching record found");
			return;
		}
		DeletePublication(evt.target.result.id, store);
	};
	req.onerror = function (evt) {
		console.error("deletePublicationFromBib:", evt.target.errorCode);
	};
}

/**
 * @param {number} key is calculated inxed of point y * width + x, probably not usefull
 * @param {IDBObjectStore=} store from indexeddb
 */
function DeletePublication(key, store) {
	console.log("deletePublication:", arguments);

	if (typeof store == 'undefined')
		store = GetObjectStore(DB_POINT_STORE, 'readwrite');

	// As per spec http://www.w3.org/TR/IndexedDB/#object-store-deletion-operation
	// the result of the Object Store Deletion Operation algorithm is
	// undefined, so it's not possible to know if some records were actually
	// deleted by looking at the request result.
	let req = store.get(key);
	req.onsuccess = function (evt) {
		let record = evt.target.result;
		console.log("record:", record);
		if (typeof record == 'undefined') {
			console.error("No matching record found");
			return;
		}
		// Warning: The exact same key used for creation needs to be passed for
		// the deletion. If the key was a Number for creation, then it needs to
		// be a Number for deletion.
		req = store.delete(key);
		req.onsuccess = function (evt) {
			console.log("evt:", evt);
			console.log("evt.target:", evt.target);
			console.log("evt.target.result:", evt.target.result);
			console.log("delete successful");
			console.log("Deletion successful");
			//displayPubList(store);
		};
		req.onerror = function (evt) {
			console.error("deletePublication:", evt.target.errorCode);
		};
	};
	req.onerror = function (evt) {
		console.error("deletePublication:", evt.target.errorCode);
	};
}




class SimplePointStore {
	constructor() {
	}

	async PrepareStore(/*game*/) {
		this.store = new Map();
	}

	async has(key) {
		return this.store.has(key);
	}

	async set(key, val) {
		return this.store.set(key, val);
	}

	async get(key) {
		return this.store.get(key);
	}

	async values() {
		return this.store.values();
	}
}

class IDBPointStore extends SimplePointStore {
	constructor() {
		super();
	}

	async PrepareStore(game) {
		if (!g_DB)
			await OpenDb();

		if (game.CreateScreenPointFromIndexedDb)
			this.PointCreationCallback = game.CreateScreenPointFromIndexedDb.bind(game);

		const state = await GetState(game.g_iGameID);
		if (!state) {
			await ClearObjectStore(DB_POINT_STORE);
			await ClearObjectStore(DB_PATH_STORE);
			await ClearObjectStore(DB_STATE_STORE);

			await StoreState(game.g_iGameID, game);
		}
		else {
			//TODO: verify date of last move and decide whether to need pull points from signalR
			if (state.sLastMoveGameTimeStamp !== game.m_sLastMoveGameTimeStamp) {
				await ClearObjectStore(DB_POINT_STORE);
				await ClearObjectStore(DB_PATH_STORE);
				await ClearObjectStore(DB_STATE_STORE);
			}
			else {
				game.m_bPointsAndPathsLoaded = true;
				if (this.PointCreationCallback) {
					const points = await this.values();
					//loading points from indexeddb
					for (const idb_pt of points) {
						const pt = this.PointCreationCallback(idb_pt.x, idb_pt.y, idb_pt.Status, idb_pt.Color);
						//return pt;
					}
				}
			}
		}

	}

	async has(key) {
		const pt = await GetPoint(key);
		return pt !== undefined && pt !== null;
		//return this.store.has(key);
	}

	async set(key, val) {
		await StorePoint(key, val);
		//return this.store.set(key, val);
	}

	async get(key) {
		const idb_pt = await GetPoint(key);
		if (idb_pt && this.PointCreationCallback) {
			const pt = this.PointCreationCallback(idb_pt.x, idb_pt.y, idb_pt.Status, idb_pt.Color);
			return pt;
		}
		else
			return null;
		//return this.store.get(key);
	}

	async values() {
		//return this.store.values();
		const values = await GetAllPoints();
		return values;
	}
}

class SimplePathStore {
	constructor() {
		this.store = [];
	}

	push(obj) {
		return this.store.push(obj);
	}

	all() {
		return this.store;
	}
}

class IDBPathStore extends SimplePathStore {
	constructor() {
		super();
	}

	async PrepareStore(game) {
		//if (!g_DB)
		//	await OpenDb();

		if (game.CreateScreenPathFromIndexedDb)
			this.PathCreationCallback = game.CreateScreenPathFromIndexedDb.bind(game);
	}

	async push(val) {
		await StorePath(val.$GetID(), val);
		//return this.store.push(obj);
	}

	async all() {
		const values = await GetAllPaths();
		return values;
		//return this.store;
	}
}

//TODO: check compat and create plain store abstraction when indexeddb not supported
if (!('indexedDB' in window)) {
	console.log("This browser doesn't support IndexedDB");

	PointStore = SimplePointStore;
	PathStore = SimplePathStore;
}
else {
	PointStore = IDBPointStore;
	PathStore = IDBPathStore;
}
//////////IndexedDB points and path stores end//////////

export {
	$createOval, $createPolyline, $RemovePolyline, $RemoveOval, $createSVGVML, $createLine, hasDuplicates, sortPointsClockwise,
	PointStore, PathStore
};
