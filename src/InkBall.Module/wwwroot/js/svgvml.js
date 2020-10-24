/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "$" }]*/

//////////////////////////////////////////////////////
// SVG-VML mini graphic library 
// ==========================================
// written by Gerard Ferrandez
// initial version - June 28, 2006
// modified - 2020 - Andrzej Pauli dropping vml - obsoleet and no support so why bother
// modified - 2018-2020 - Andrzej Pauli polyline and oval functions & extensions
// modified - July 21 - use object functions
// modified - July 24 - debug
// www.dhteumeuleu.com
//////////////////////////////////////////////////////
"use strict";

let SVG = false;
const svgNS = "http://www.w3.org/2000/svg";
let svgAntialias = false, cont = null;
let $createOval, $createPolyline, $RemovePolyline, $RemoveOval, $createSVGVML, $createLine;

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
		if (iWidth)
			cont.setAttributeNS(null, 'width', iWidth);
		if (iHeight)
			cont.setAttributeNS(null, 'height', iHeight);
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
		o.$AppendPoints = function (x, y, diffX, diffY) {
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
			if (!(Math.abs(last_x - x_diff) <= diffX && Math.abs(last_y - y_diff) <= diffY)) {
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

} else {
	/* ==== no script ==== */
	$createSVGVML = function () {
		alert('SVG is not supported!');
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
class GameStateStore {
	constructor(pointCreationCallbackFn, pathCreationCallbackFn, getGameStateFn) {
		this.DB_NAME = 'InkballGame';
		this.DB_POINT_STORE = 'points';
		this.DB_PATH_STORE = 'paths';
		this.DB_STATE_STORE = 'state';
		this.DB_VERSION = 2; // Use a long long for this value (don't use a float)
		this.g_DB;//main DB object

		//TODO: check compat and create plain store abstraction when indexeddb not supported
		if (!('indexedDB' in window)) {
			console.log("This browser doesn't support IndexedDB");

			this.PointStore = new SimplePointStore();
			this.PathStore = new SimplePathStore();
		}
		else {
			this.PointStore = new IDBPointStore(this.GetPoint.bind(this), this.StorePoint.bind(this), this.GetAllPoints.bind(this),
				this.UpdateState.bind(this), pointCreationCallbackFn, getGameStateFn, this);
			this.PathStore = new IDBPathStore(this.GetAllPaths.bind(this), this.StorePath.bind(this), this.UpdateState.bind(this),
				pathCreationCallbackFn, getGameStateFn, this);
			//this.PointStore = new SimplePointStore();
			//this.PathStore = new SimplePathStore();
		}
	}

	GetPointStore() {
		return this.PointStore;
	}

	GetPathStore() {
		return this.PathStore;
	}

	async OpenDb() {
		console.log("OpenDb ...");
		return new Promise((resolve, reject) => {
			const req = indexedDB.open(this.DB_NAME, this.DB_VERSION);
			req.onsuccess = function (evt) {
				// Equal to: db = req.result;
				this.g_DB = evt.currentTarget.result;

				console.log("OpenDb DONE");
				resolve(evt.currentTarget.result);
			}.bind(this);
			req.onerror = function (evt) {
				console.error("OpenDb:", evt.target.errorCode);
				reject();
			};
			req.onupgradeneeded = function (evt) {
				console.log("OpenDb.onupgradeneeded");

				const store_list = Array.from(evt.currentTarget.result.objectStoreNames);
				if (store_list.includes(this.DB_POINT_STORE))
					evt.currentTarget.result.deleteObjectStore(this.DB_POINT_STORE);
				if (store_list.includes(this.DB_PATH_STORE))
					evt.currentTarget.result.deleteObjectStore(this.DB_PATH_STORE);
				if (store_list.includes(this.DB_STATE_STORE))
					evt.currentTarget.result.deleteObjectStore(this.DB_STATE_STORE);

				const point_store = evt.currentTarget.result.createObjectStore(
					this.DB_POINT_STORE, { /*keyPath: 'pos',*/ autoIncrement: false });
				//point_store.createIndex('Status', 'Status', { unique: false });
				//point_store.createIndex('Color', 'Color', { unique: false });


				const path_store = evt.currentTarget.result.createObjectStore(
					this.DB_PATH_STORE, { /*keyPath: 'iId',*/ autoIncrement: false });
				//path_store.createIndex('Color', 'Color', { unique: false });

				const state_store = evt.currentTarget.result.createObjectStore(
					this.DB_STATE_STORE, { /*keyPath: 'gameId',*/ autoIncrement: false });
			}.bind(this);
		});
	}

	/**
	  * @param {string} storeName is a store name
	  * @param {string} mode either "readonly" or "readwrite"
	  * @returns {object} store
	  */
	GetObjectStore(storeName, mode) {
		if (this.bulkStores && this.bulkStores.has(storeName))
			return this.bulkStores.get(storeName);

		const tx = this.g_DB.transaction(storeName, mode);
		return tx.objectStore(storeName);
	}

	async ClearObjectStore(storeName) {
		return new Promise((resolve, reject) => {
			const store = this.GetObjectStore(storeName, 'readwrite');
			const req = store.clear();
			req.onsuccess = function () {
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
	async GetPoint(key) {
		return new Promise((resolve, reject) => {
			const store = this.GetObjectStore(this.DB_POINT_STORE, 'readonly');
			const req = store.get(key);
			req.onerror = function (event) {
				reject(new Error('GetPoint => ' + event));
			};
			req.onsuccess = function (event) {
				resolve(event.target.result);
			};
		});
	}

	async GetAllPoints() {
		return new Promise((resolve, reject) => {
			const store = this.GetObjectStore(this.DB_POINT_STORE, 'readonly');
			const bucket = [];
			const req = store.openCursor();
			req.onsuccess = function (event) {
				const cursor = event.target.result;
				if (cursor) {
					bucket.push(cursor.value);
					cursor.continue();
				}
				else
					resolve(bucket);
			};
			req.onerror = function (event) {
				reject(new Error('GetAllPoints => ' + event));
			};
		});
	}

	async GetState(key) {
		return new Promise((resolve, reject) => {
			const store = this.GetObjectStore(this.DB_STATE_STORE, 'readonly');
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
	async GetPath(key) {
		return new Promise((resolve, reject) => {
			const store = this.GetObjectStore(this.DB_PATH_STORE, 'readonly');
			const req = store.get(key);
			req.onerror = function (event) {
				reject(new Error('GetPath => ' + event));
			};
			req.onsuccess = function (event) {
				resolve(event.target.result);
			};
		});
	}

	async GetAllPaths() {
		return new Promise((resolve, reject) => {
			const store = this.GetObjectStore(this.DB_PATH_STORE, 'readonly');
			const bucket = [];
			const req = store.openCursor();
			req.onsuccess = function (event) {
				const cursor = event.target.result;
				if (cursor) {
					bucket.push(cursor.value);
					cursor.continue();
				}
				else
					resolve(bucket);
			};
			req.onerror = function (event) {
				reject(new Error('GetAllPaths => ' + event));
			};
		});
	}

	/**
	  * @param {number} key is calculated inxed of point y * width + x, probably not usefull
	  * @param {object} val is serialized, thin circle
	  */
	async StorePoint(key, val) {
		if (this.bulkStores && this.bulkStores.has(this.DB_POINT_STORE)) {
			if (!this.bulkBuffer)
				this.bulkBuffer = new Map();
			this.bulkBuffer.set(key, val);
			return Promise.resolve();
		}

		return new Promise((resolve, reject) => {
			const store = this.GetObjectStore(this.DB_POINT_STORE, 'readwrite');
			let req;
			try {
				req = store.add(val, key);
			} catch (e) {
				if (e.name === 'DataCloneError')
					console.error("This engine doesn't know how to clone a Blob, use Firefox");
				throw e;
			}
			req.onsuccess = function () {
				resolve();
			};
			req.onerror = function () {
				console.error("StorePoint error", this.error);
				reject();
			};
		});
	}

	async StoreAllPoints(values) {
		if (!values)
			values = this.bulkBuffer;

		if (!values || !this.bulkStores)
			return Promise.reject();

		return new Promise((resolve, reject) => {
			const store = this.GetObjectStore(this.DB_POINT_STORE, 'readwrite');
			try {
				values.forEach(function (v, key) {
					store.add(v, key);
				});

				this.bulkBuffer = null;
				resolve();
			} catch (e) {
				console.error("This engine doesn't know how to clone a Blob, use Firefox");
				reject(e);
			}
		});
	}

	/**
	  * @param {number} key is GameID
	  * @param {object} gameState is InkBallGame state object
	  */
	async StoreState(key, gameState) {
		return new Promise((resolve, reject) => {
			const store = this.GetObjectStore(this.DB_STATE_STORE, 'readwrite');
			let req;
			try {
				req = store.add(gameState, key);
			} catch (e) {
				if (e.name === 'DataCloneError')
					console.error("This engine doesn't know how to clone a Blob, use Firefox");
				throw e;
			}
			req.onsuccess = function () {
				resolve();
			};
			req.onerror = function () {
				console.error("StoreState error", this.error);
				reject();
			};
		});
	}

	async UpdateState(key, gameState) {
		return new Promise((resolve, reject) => {
			const store = this.GetObjectStore(this.DB_STATE_STORE, 'readwrite');
			let req;
			try {
				req = store.put(gameState, key);
			} catch (e) {
				if (e.name === 'DataCloneError')
					console.error("This engine doesn't know how to clone a Blob, use Firefox");
				throw e;
			}
			req.onsuccess = function () {
				resolve();
			};
			req.onerror = function () {
				console.error("UpdateState error", this.error);
				reject();
			};
		});
	}

	/**
	  * @param {number} key is path Id
	  * @param {object} val is serialized thin path
	  */
	async StorePath(key, val) {
		return new Promise((resolve, reject) => {
			const store = this.GetObjectStore(this.DB_PATH_STORE, 'readwrite');
			let req;
			try {
				req = store.add(val, key);
			} catch (e) {
				if (e.name === 'DataCloneError')
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

	async PrepareStore() {
		if (!this.PointStore.GetAllPoints) return false;

		if (!this.g_DB)
			await this.OpenDb();
		else
			return false;//all initiated, just exit

		const game_state = this.PointStore.GetGameStateCallback();
		const idb_state = await this.GetState(game_state.iGameID);
		if (!idb_state) {
			//no state entry in db
			await Promise.all([this.ClearObjectStore(this.DB_POINT_STORE),
			this.ClearObjectStore(this.DB_PATH_STORE),
			this.ClearObjectStore(this.DB_STATE_STORE)]);

			await this.StoreState(game_state.iGameID, game_state);

			return false;
		}
		else {
			//Verify date of last move and decide whether to need pull points from signalR
			if (idb_state.sLastMoveGameTimeStamp !== game_state.sLastMoveGameTimeStamp) {

				await Promise.all([this.ClearObjectStore(this.DB_POINT_STORE),
				this.ClearObjectStore(this.DB_PATH_STORE),
				this.ClearObjectStore(this.DB_STATE_STORE)]);

				return false;
			}
			else if (game_state.bPointsAndPathsLoaded === false) {
				//db entry ok and ready for read
				try {
					await this.BeginBulkStorage([this.DB_POINT_STORE, this.DB_PATH_STORE], 'readonly');

					if ((await this.PointStore.PrepareStore()) !== true || (await this.PathStore.PrepareStore()) !== true) {

						await Promise.all([this.ClearObjectStore(this.DB_POINT_STORE),
						this.ClearObjectStore(this.DB_PATH_STORE),
						this.ClearObjectStore(this.DB_STATE_STORE)]);

						return false;
					}

					return true;
				} finally {
					await this.EndBulkStorage([this.DB_POINT_STORE, this.DB_PATH_STORE]);
				}
			}
		}
	}

	async BeginBulkStorage(storeName, mode) {
		if (!this.bulkStores)
			this.bulkStores = new Map();

		const key = storeName;
		if (!this.bulkStores.has(key)) {
			const tx = this.g_DB.transaction(storeName, mode);
			if (Array.isArray(storeName)) {
				this.bulkStores.set(key[0], tx.objectStore(storeName[0]));
				this.bulkStores.set(key[1], tx.objectStore(storeName[1]));
			}
			else
				this.bulkStores.set(key, tx.objectStore(storeName));
		}
	}

	async EndBulkStorage(storeName) {
		if (this.bulkStores) {
			if (Array.isArray(storeName)) {
				this.bulkStores.delete(storeName[0]);
				this.bulkStores.delete(storeName[1]);
			}
			else
				this.bulkStores.delete(storeName);

			if (this.bulkStores.size <= 0)
				this.bulkStores = null;
		}
	}
}

class SimplePointStore {
	constructor() {
		this.store = new Map();
	}

	async PrepareStore() {
		return true;
	}

	async BeginBulkStorage() {
	}

	async EndBulkStorage() {
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
	constructor(getPointFn, storePointFn, getAllPointsFn, updateStateFn, pointCreationCallbackFn, getGameStateFn, mainGameStateStore) {
		super();
		this.GetPoint = getPointFn;
		this.StorePoint = storePointFn;
		this.GetAllPoints = getAllPointsFn;
		this.UpdateState = updateStateFn;
		this.PointCreationCallback = pointCreationCallbackFn;
		this.GetGameStateCallback = getGameStateFn;
		this.MainGameStateStore = mainGameStateStore;
	}

	async PrepareStore() {
		if (this.PointCreationCallback && this.GetGameStateCallback) {
			const points = await this.GetAllPoints();
			const game_state = this.GetGameStateCallback();

			//loading points from indexeddb
			for (const idb_pt of points) {
				const pt = await this.PointCreationCallback(idb_pt.x, idb_pt.y, idb_pt.Status, idb_pt.Color);
				const index = idb_pt.y * game_state.iGridWidth + idb_pt.x;
				this.store.set(index, pt);
			}

			return true;
		}
	}

	async BeginBulkStorage() {
		await this.MainGameStateStore.BeginBulkStorage(this.MainGameStateStore.DB_POINT_STORE, 'readwrite');
	}

	async EndBulkStorage() {
		await this.MainGameStateStore.StoreAllPoints();

		await this.MainGameStateStore.EndBulkStorage(this.MainGameStateStore.DB_POINT_STORE);
	}

	async has(key) {
		//const pt = await GetPoint(key);
		//return pt !== undefined && pt !== null;
		return this.store.has(key);
	}

	async set(key, oval) {
		const game_state = this.GetGameStateCallback();

		const pos = oval.$GetPosition();
		const color = oval.$GetFillColor();
		const idb_pt = {
			x: parseInt(pos.x) / game_state.iGridSizeX,
			y: parseInt(pos.y) / game_state.iGridSizeY,
			Status: oval.$GetStatus(),
			Color: color
			//, pos: key, //`${pos.x}_${pos.y}`
		};

		await this.StorePoint(key, idb_pt);//TODO: possible delay

		if (this.UpdateState) {
			if (game_state.bPointsAndPathsLoaded === true)
				await this.UpdateState(game_state.iGameID, game_state);
		}

		return this.store.set(key, oval);
	}

	async get(key) {
		let val = this.store.get(key);
		if (!val) {
			const idb_pt = await this.GetPoint(key);
			if (idb_pt && this.PointCreationCallback) {
				val = this.PointCreationCallback(idb_pt.x, idb_pt.y, idb_pt.Status, idb_pt.Color);
				this.store.set(key, val);
				return val;
			}
			else
				return undefined;
		}
		return val;
		//return this.store.get(key);
	}

	async values() {
		let values = this.store.values();
		if (values)
			return values;
		values = await this.GetAllPoints();
		return values;
	}
}

class SimplePathStore {
	constructor() {
		this.store = [];
	}

	async PrepareStore() {
		return true;
	}

	async BeginBulkStorage() {
	}

	async EndBulkStorage() {
	}

	async push(obj) {
		return this.store.push(obj);
	}

	async all() {
		return this.store;
	}
}

class IDBPathStore extends SimplePathStore {
	constructor(getAllPaths, storePath, updateStateFn, pathCreationCallbackFn, getGameStateFn, mainGameStateStore) {
		super();
		this.GetAllPaths = getAllPaths;
		this.StorePath = storePath;
		this.UpdateState = updateStateFn;
		this.PathCreationCallback = pathCreationCallbackFn;
		this.GetGameStateCallback = getGameStateFn;
		this.MainGameStateStore = mainGameStateStore;
	}

	async PrepareStore() {
		if (this.PathCreationCallback) {
			const paths = await this.GetAllPaths();
			//loading paths from indexeddb
			for (const idb_pa of paths) {
				const pa = await this.PathCreationCallback(idb_pa.PointsAsString, idb_pa.Color, idb_pa.iId);
				this.store.push(pa);
			}
		}
		return true;
	}

	async BeginBulkStorage() {
		await this.MainGameStateStore.BeginBulkStorage([this.MainGameStateStore.DB_POINT_STORE, this.MainGameStateStore.DB_PATH_STORE], 'readwrite');
	}

	async EndBulkStorage() {
		await this.MainGameStateStore.EndBulkStorage([this.MainGameStateStore.DB_POINT_STORE, this.MainGameStateStore.DB_PATH_STORE]);
	}

	async push(val) {
		const id_key = val.$GetID();
		const idb_path = {
			iId: id_key,
			Color: val.$GetFillColor(),
			PointsAsString: val.$GetPointsString()
		};

		await this.StorePath(id_key, idb_path);//TODO: possible delay

		if (this.UpdateState) {
			const game_state = this.GetGameStateCallback();
			if (game_state.bPointsAndPathsLoaded === true)
				await this.UpdateState(game_state.iGameID, game_state);
		}

		return this.store.push(val);
	}

	async all() {
		let values = this.store;
		if (values)
			return values;
		values = await this.GetAllPaths();
		return values;
	}
}
//////////IndexedDB points and path stores end//////////

export {
	$createOval, $createPolyline, $RemovePolyline, $RemoveOval, $createSVGVML, $createLine, hasDuplicates, sortPointsClockwise,
	GameStateStore
};
