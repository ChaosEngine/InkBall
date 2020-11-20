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

/**
 * Test for array uniquness using default object comparator
 * @param {array} array of objects that are tested againstn uniqenes
 * @returns {boolean} true - has duplicates
 */
function hasDuplicates(array) {
	return (new Set(array)).size !== array.length;
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

class SvgVml {
	constructor() {
		const svgNS = "http://www.w3.org/2000/svg";
		let svgAvailable = false, svgAntialias = false;
		let documentCreateElementNS_SVG, documentCreateElementNS_Element;
		this.cont = null;

		if (self && self.document && self.document.createElementNS) {
			this.cont = document.createElementNS(svgNS, "svg");
			svgAvailable = (this.cont.x !== null);
		}

		if (svgAvailable) {
			/* ============= displayable SVG ============== */
			documentCreateElementNS_SVG = function () {
				return this.cont;
			}.bind(this);
			documentCreateElementNS_Element = function (elemeName) {
				return document.createElementNS(svgNS, elemeName);
			};
		} else {
			/* ============= emulated SVG ============== */
			documentCreateElementNS_SVG = function () {
				return {
					attributes: new Map(),
					children: [],
					setAttributeNS: function (_nullish, key, val) {
						this.attributes.set(key, val);
					},
					appendChild: function (val) {
						this.children.push(val);
					},
					removeChild: function (val) {
						const index = this.children.indexOf(val);
						if (index !== -1)
							this.children.splice(index, 1);
					}
				};
			};
			documentCreateElementNS_Element = function () {
				return {
					attributes: new Map(),
					setAttribute: function (key, val) {
						this.attributes.set(key, val);
					},
					getAttribute: function (key) {
						return this.attributes.get(key);
					},
					removeAttribute: function (key) {
						this.attributes.delete(key);
					}
				};
			};
		}
		this.CreateSVGVML = function (contextParent, iWidth, iHeight, antialias) {
			this.cont = documentCreateElementNS_SVG("svg");
			if (iWidth)
				this.cont.setAttributeNS(null, 'width', iWidth);
			if (iHeight)
				this.cont.setAttributeNS(null, 'height', iHeight);
			if (contextParent)
				contextParent.appendChild(this.cont);
			svgAntialias = antialias;

			return svgAvailable ? this.cont : null;
		};
		this.CreateLine = function (w, col, linecap) {
			const o = documentCreateElementNS_Element("line");
			o.setAttribute("shape-rendering", svgAntialias ? "auto" : "optimizeSpeed");
			o.setAttribute("stroke-width", Math.round(w) + "px");
			if (col) o.setAttribute("stroke", col);
			if (linecap) o.setAttribute("stroke-linecap", linecap);
			o.move = function (x1, y1, x2, y2) {
				this.setAttribute("x1", x1);
				this.setAttribute("y1", y1);
				this.setAttribute("x2", x2);
				this.setAttribute("y2", y2);
			};
			o.RGBcolor = function (R, G, B) { this.setAttribute("stroke", "rgb(" + Math.round(R) + "," + Math.round(G) + "," + Math.round(B) + ")"); };
			o.SetColor = function (color) { this.setAttribute("stroke", color); };
			o.strokeWidth = function (s) { this.setAttribute("stroke-width", Math.round(s) + "px"); };
			this.cont.appendChild(o);
			return o;
		};
		this.CreatePolyline = function (width, points, col) {
			const o = documentCreateElementNS_Element("polyline");
			o.setAttribute("shape-rendering", svgAntialias ? "auto" : "optimizeSpeed");
			o.setAttribute("stroke-width", Math.round(width));
			if (col) o.setAttribute("stroke", col);
			o.setAttribute("fill", col);
			o.setAttribute("fill-opacity", "0.1");
			if (points) o.setAttribute("points", points);
			o.setAttribute("stroke-linecap", "round");
			o.setAttribute("stroke-linejoin", "round");
			this.cont.appendChild(o);
			o.setAttribute("data-id", 0);
			o.AppendPoints = function (x, y, diffX, diffY) {
				const pts_str = this.getAttribute("points");
				const pts = pts_str.split(" ");

				if (true === hasDuplicates(pts)) {
					return false;
				}

				let arr;//obtain last point coords
				if (pts.length <= 1 || (arr = pts[pts.length - 1].split(",")).length !== 2) {
					return false;
				}

				const last_x = parseInt(arr[0]), last_y = parseInt(arr[1]);
				const x_diff = parseInt(x), y_diff = parseInt(y);
				if (!(Math.abs(last_x - x_diff) <= diffX && Math.abs(last_y - y_diff) <= diffY)) {
					return false;
				}

				this.setAttribute("points", pts_str + ` ${x},${y}`);
				return true;
			};
			o.RemoveLastPoint = function () {
				const newpts = this.getAttribute("points").replace(/(\s\d+,\d+)$/, "");
				this.setAttribute("points", newpts);
				return newpts;
			};
			o.ContainsPoint = function (x, y) {
				const regexstr = new RegExp(`${x},${y}`, 'g');
				const cnt = (this.getAttribute("points").match(regexstr) || []).length;
				return cnt;
			};
			o.GetPointsString = function () {
				return this.getAttribute("points");
			};
			o.GetPointsArray = function () {
				//x0,y0 x1,y1 x2,y2
				return this.getAttribute("points").split(" ").map(function (pt) {
					const tab = pt.split(',');
					return { x: parseInt(tab[0]), y: parseInt(tab[1]) };
				});
			};
			o.SetPoints = function (sPoints) {
				this.setAttribute("points", sPoints);
			};
			o.GetIsClosed = function () {
				const pts = this.getAttribute("points").split(" ");
				return pts[0] === pts[pts.length - 1];
			};
			o.GetLength = function () {
				return this.getAttribute("points").split(" ").length;
			};
			o.SetWidthAndColor = function (w, col) {
				this.setAttribute("stroke", col);
				this.setAttribute("fill", col);
				this.setAttribute("stroke-width", Math.round(w));
			};
			o.GetID = function () { return parseInt(this.getAttribute("data-id")); };
			o.SetID = function (iID) { this.setAttribute("data-id", iID); };
			o.GetFillColor = function () { return this.getAttribute("fill"); };
			o.Serialize = function () {
				const id = this.GetID();
				const color = this.GetFillColor();
				const pts = this.GetPointsString();
				return { iId: id, Color: color, PointsAsString: pts };
			};
			return o;
		};
		this.CreateOval = function (diam) {
			const o = documentCreateElementNS_Element("circle");
			o.setAttribute("shape-rendering", svgAntialias ? "auto" : "optimizeSpeed");
			o.setAttribute("stroke-width", 0);
			o.setAttribute("r", Math.round(diam >> 1));
			//ch_commented o.style.cursor = "pointer";
			o.setAttribute("data-status", -1);
			//o.setAttribute("data-old-status", -1);
			o.move = function (x1, y1, radius) {
				this.setAttribute("cx", x1);
				this.setAttribute("cy", y1);
				this.setAttribute("r", Math.round(radius));
			};
			o.GetStrokeColor = function () { return this.getAttribute("stroke"); };
			o.SetStrokeColor = function (col) { this.setAttribute("stroke", col); };
			o.GetPosition = function () {
				return { x: this.getAttribute("cx"), y: this.getAttribute("cy") };
			};
			o.GetFillColor = function () { return this.getAttribute("fill"); };
			o.SetFillColor = function (col) { this.setAttribute("fill", col); };
			o.GetStatus = function () { return parseInt(this.getAttribute("data-status")); };
			o.SetStatus = function (iStatus, saveOldPoint = false) {
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
			o.RevertOldStatus = function () {
				const old_status = this.getAttribute("data-old-status");
				if (old_status) {
					this.removeAttribute("data-old-status");
					this.setAttribute("data-status", old_status);
					return parseInt(old_status);
				}
				return -1;
			};
			o.GetZIndex = function () { return this.getAttribute("z-index"); };
			o.SetZIndex = function (val) { this.setAttribute("z-index", val); };
			o.Hide = function () { this.setAttribute("visibility", 'hidden'); };
			o.Show = function () { this.setAttribute("visibility", 'visible'); };
			o.strokeWeight = function (sw) { this.setAttribute("stroke-width", sw); };
			o.Serialize = function () {
				const { x, y } = this.GetPosition();
				const status = this.GetStatus();
				const color = this.GetFillColor();
				return { x: x, y: y, Status: status, Color: color };
			};

			this.cont.appendChild(o);
			return o;
		};
	}

	RemoveOval(oval) {
		this.cont.removeChild(oval);
	}

	RemovePolyline(polyline) {
		this.cont.removeChild(polyline);
	}

	DeserializeOval(packed, radius = 4) {
		const { x, y, Status, Color } = packed;
		const o = this.CreateOval(4);
		o.move(x, y, radius);
		o.SetStrokeColor(Color);
		o.SetFillColor(Color);
		o.SetStatus(Status);
		return o;
	}

	DeserializePolyline(packed, width = 3) {
		const { iId, Color, PointsAsString } = packed;
		const o = this.CreatePolyline(width, PointsAsString, Color);
		o.SetID(iId);
		return o;
	}
}

class GameStateStore {
	constructor(useIndexedDb, pointCreationCallbackFn = null, pathCreationCallbackFn = null, getGameStateFn = null,
		localLogFn, localErrorFn, version = "") {
		this.LocalLog = localLogFn;
		this.LocalError = localErrorFn;
		if (useIndexedDb) {
			if (!('indexedDB' in self)) {
				this.LocalError("This browser doesn't support IndexedDB");
				useIndexedDb = false;
			}
			else
				useIndexedDb = true;
		}
		else
			useIndexedDb = false;

		/////////inner class definitions start/////////
		/////////https://stackoverflow.com/questions/28784375/nested-es6-classes/////////
		const SimplePointStoreDefinition = class SimplePointStore {
			constructor() {
				this.store = new Map();
			}

			async PrepareStore() {
				return true;//dummy
			}

			async BeginBulkStorage() {
				//dummy
			}

			async EndBulkStorage() {
				//dummy
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

			async count() {
				return this.store.size;
			}
		};

		const SimplePathStoreDefinition = class SimplePathStore {
			constructor() {
				this.store = [];
			}

			async PrepareStore() {
				return true;//dummy
			}

			async BeginBulkStorage() {
				//dummy
			}

			async EndBulkStorage() {
				//dummy
			}

			async push(obj) {
				return this.store.push(obj);
			}

			async all() {
				return this.store;
			}

			async count() {
				return this.store.length;
			}
		};

		const IDBPointStoreDefinition = class IDBPointStore extends SimplePointStoreDefinition {
			constructor(mainGameStateStore, pointCreationCallbackFn, getGameStateFn) {
				super();
				this.MainGameStateStore = mainGameStateStore;
				this.GetPoint = mainGameStateStore.GetPoint.bind(this.MainGameStateStore);
				this.StorePoint = mainGameStateStore.StorePoint.bind(this.MainGameStateStore);
				this.GetAllPoints = mainGameStateStore.GetAllPoints.bind(this.MainGameStateStore);
				this.UpdateState = mainGameStateStore.UpdateState.bind(this.MainGameStateStore);
				this.PointCreationCallback = pointCreationCallbackFn;
				this.GetGameStateCallback = getGameStateFn;
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

				}
				return true;
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

				const pos = oval.GetPosition();
				const color = oval.GetFillColor();
				const idb_pt = {
					x: parseInt(pos.x) / game_state.iGridSizeX,
					y: parseInt(pos.y) / game_state.iGridSizeY,
					Status: oval.GetStatus(),
					Color: color
				};

				await this.StorePoint(key, idb_pt);

				if (this.UpdateState) {
					if (game_state.bPointsAndPathsLoaded === true)
						await this.UpdateState(game_state.iGameID, game_state);
				}

				return this.store.set(key, oval);
			}

			async get(key) {
				let val = this.store.get(key);
				//if (!val) {
				//	const idb_pt = await this.GetPoint(key);
				//	if (idb_pt && this.PointCreationCallback) {
				//		val = this.PointCreationCallback(idb_pt.x, idb_pt.y, idb_pt.Status, idb_pt.Color);
				//		this.store.set(key, val);
				//		return val;
				//	}
				//	else
				//		return undefined;
				//}
				return val;
			}

			async values() {
				let values = this.store.values();
				if (values)
					return values;
				values = await this.GetAllPoints();
				return values;
			}
		};

		const IDBPathStoreDefinition = class IDBPathStore extends SimplePathStoreDefinition {
			constructor(mainGameStateStore, pathCreationCallbackFn, getGameStateFn) {
				super();
				this.MainGameStateStore = mainGameStateStore;
				this.GetAllPaths = mainGameStateStore.GetAllPaths.bind(this.MainGameStateStore);
				this.StorePath = mainGameStateStore.StorePath.bind(this.MainGameStateStore);
				this.UpdateState = mainGameStateStore.UpdateState.bind(this.MainGameStateStore);
				this.PathCreationCallback = pathCreationCallbackFn;
				this.GetGameStateCallback = getGameStateFn;
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
				await this.MainGameStateStore.StoreAllPaths();

				await this.MainGameStateStore.EndBulkStorage([this.MainGameStateStore.DB_POINT_STORE, this.MainGameStateStore.DB_PATH_STORE]);
			}

			async push(val) {
				const game_state = this.GetGameStateCallback();

				const id_key = val.GetID();
				const idb_path = {
					iId: id_key,
					Color: val.GetFillColor(),
					PointsAsString: val.GetPointsString().split(" ").map((pt) => {
						const tab = pt.split(',');
						const x = parseInt(tab[0]), y = parseInt(tab[1]);
						return `${x / game_state.iGridSizeX},${y / game_state.iGridSizeY}`;
					}).join(" ")
				};

				await this.StorePath(id_key, idb_path);

				if (this.UpdateState) {
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
		};
		/////////inner class definitions end/////////

		if (useIndexedDb === true) {
			this.DB_NAME = 'InkballGame';
			this.DB_POINT_STORE = 'points';
			this.DB_PATH_STORE = 'paths';
			this.DB_STATE_STORE = 'state';
			this.g_DB = null;//main DB object
			this.bulkStores = null;
			this.pointBulkBuffer = null;
			this.pathBulkBuffer = null;

			// Use a long long for this value (don't use a float)
			if (!version || version === "" || version.length <= 0)
				this.DB_VERSION = null;
			else {
				this.DB_VERSION = parseInt(version.split('.').reduce((acc, val) => {
					val = parseInt(val);
					return acc * 10 + (isNaN(val) ? 0 : val);
				}, 0)) - 1010/*initial module versioning start number*/ + 4/*initial indexDB start number*/;
			}

			this.PointStore = new IDBPointStoreDefinition(this, pointCreationCallbackFn, getGameStateFn);
			this.PathStore = new IDBPathStoreDefinition(this, pathCreationCallbackFn, getGameStateFn);
		}
		else {
			this.PointStore = new SimplePointStoreDefinition();
			this.PathStore = new SimplePathStoreDefinition();
		}
	}

	GetPointStore() {
		return this.PointStore;
	}

	GetPathStore() {
		return this.PathStore;
	}

	async OpenDb() {
		this.LocalLog("OpenDb ...");
		return new Promise((resolve, reject) => {
			let req;
			if (this.DB_VERSION !== null)
				req = indexedDB.open(this.DB_NAME, this.DB_VERSION);
			else
				req = indexedDB.open(this.DB_NAME);

			req.onsuccess = function (evt) {
				// Equal to: db = req.result;
				this.g_DB = evt.currentTarget.result;

				this.LocalLog("OpenDb DONE");
				resolve(evt.currentTarget.result);
			}.bind(this);
			req.onerror = function (evt) {
				this.LocalError("OpenDb:", evt.target.errorCode || evt.target.error);
				reject();
			}.bind(this);
			req.onupgradeneeded = function (evt) {
				this.LocalLog(`OpenDb.onupgradeneeded(version: ${this.DB_VERSION})`);

				const store_list = Array.from(evt.currentTarget.result.objectStoreNames);
				if (store_list.includes(this.DB_POINT_STORE))
					evt.currentTarget.result.deleteObjectStore(this.DB_POINT_STORE);
				if (store_list.includes(this.DB_PATH_STORE))
					evt.currentTarget.result.deleteObjectStore(this.DB_PATH_STORE);
				if (store_list.includes(this.DB_STATE_STORE))
					evt.currentTarget.result.deleteObjectStore(this.DB_STATE_STORE);

				evt.currentTarget.result.createObjectStore(
					this.DB_POINT_STORE, { /*keyPath: 'pos',*/ autoIncrement: false });
				//point_store.createIndex('Status', 'Status', { unique: false });
				//point_store.createIndex('Color', 'Color', { unique: false });


				evt.currentTarget.result.createObjectStore(
					this.DB_PATH_STORE, { /*keyPath: 'iId',*/ autoIncrement: false });
				//path_store.createIndex('Color', 'Color', { unique: false });

				evt.currentTarget.result.createObjectStore(
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
		if (this.bulkStores !== null && this.bulkStores.has(storeName))
			return this.bulkStores.get(storeName);

		const tx = this.g_DB.transaction(storeName, mode);
		return tx.objectStore(storeName);
	}

	async ClearAllStores() {
		const clearObjectStore = async function (storeName) {
			return new Promise((resolve, reject) => {
				const store = this.GetObjectStore(storeName, 'readwrite');
				const req = store.clear();
				req.onsuccess = function () {
					resolve();
				};
				req.onerror = function (evt) {
					this.LocalError("clearObjectStore:", evt.target.errorCode);
					reject();
				};
			});
		}.bind(this);

		await Promise.all([
			clearObjectStore(this.DB_POINT_STORE),
			clearObjectStore(this.DB_PATH_STORE),
			clearObjectStore(this.DB_STATE_STORE)
		]);
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
		if (this.bulkStores !== null && this.bulkStores.has(this.DB_POINT_STORE)) {
			if (this.pointBulkBuffer === null)
				this.pointBulkBuffer = new Map();
			this.pointBulkBuffer.set(key, val);
			return Promise.resolve();
		}

		return new Promise((resolve, reject) => {
			const store = this.GetObjectStore(this.DB_POINT_STORE, 'readwrite');
			let req;
			try {
				req = store.add(val, key);
			} catch (e) {
				if (e.name === 'DataCloneError')
					this.LocalError("This engine doesn't know how to clone a Blob, use Firefox");
				throw e;
			}
			req.onsuccess = function () {
				resolve();
			};
			req.onerror = function () {
				this.LocalError("StorePoint error", this.error);
				reject();
			};
		});
	}

	async StoreAllPoints(values = null) {
		if (!values)
			values = this.pointBulkBuffer;

		if (!values || this.bulkStores === null)
			return Promise.reject();

		return new Promise((resolve, reject) => {
			const store = this.GetObjectStore(this.DB_POINT_STORE, 'readwrite');
			try {
				values.forEach(function (v, key) {
					store.add(v, key);
				});

				this.pointBulkBuffer = null;
				resolve();
			} catch (e) {
				this.LocalError("This engine doesn't know how to clone a Blob, use Firefox");
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
					this.LocalError("This engine doesn't know how to clone a Blob, use Firefox");
				throw e;
			}
			req.onsuccess = function () {
				resolve();
			};
			req.onerror = function () {
				this.LocalError("StoreState error", this.error);
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
					this.LocalError("This engine doesn't know how to clone a Blob, use Firefox");
				throw e;
			}
			req.onsuccess = function () {
				resolve();
			};
			req.onerror = function () {
				this.LocalError("UpdateState error", this.error);
				reject();
			};
		});
	}

	/**
	  * @param {number} key is path Id
	  * @param {object} val is serialized thin path
	  */
	async StorePath(key, val) {
		if (this.bulkStores !== null && this.bulkStores.has(this.DB_PATH_STORE)) {
			if (this.pathBulkBuffer === null)
				this.pathBulkBuffer = new Map();
			this.pathBulkBuffer.set(key, val);
			return Promise.resolve();
		}

		return new Promise((resolve, reject) => {
			const store = this.GetObjectStore(this.DB_PATH_STORE, 'readwrite');
			let req;
			try {
				req = store.add(val, key);
			} catch (e) {
				if (e.name === 'DataCloneError')
					this.LocalError("This engine doesn't know how to clone a Blob, use Firefox");
				throw e;
			}
			req.onsuccess = function () {
				resolve();
			};
			req.onerror = function () {
				this.LocalError("StorePath error", this.error);
				reject();
			};
		});
	}

	async StoreAllPaths(values = null) {
		if (!values)
			values = this.pathBulkBuffer;

		if (!values || this.bulkStores === null)
			return Promise.reject();

		return new Promise((resolve, reject) => {
			const store = this.GetObjectStore(this.DB_PATH_STORE, 'readwrite');
			try {
				values.forEach(function (v, key) {
					store.add(v, key);
				});

				this.pathBulkBuffer = null;
				resolve();
			} catch (e) {
				this.LocalError("This engine doesn't know how to clone a Blob, use Firefox");
				reject(e);
			}
		});
	}

	async PrepareStore() {
		//detecting if we have IndexedDb advanced store (only checking point-store); otherwise, there is no point in going further
		if (!this.PointStore.GetAllPoints) return false;

		if (this.g_DB === null)
			await this.OpenDb();
		else
			return false;//all initiated, just exit

		const game_state = this.PointStore.GetGameStateCallback();
		const idb_state = await this.GetState(game_state.iGameID);
		if (!idb_state) {
			//no state entry in db
			await this.ClearAllStores();

			await this.StoreState(game_state.iGameID, game_state);

			return false;
		}
		else {
			//Verify date of last move and decide whether to need pull points from signalR
			if (idb_state.sLastMoveGameTimeStamp !== game_state.sLastMoveGameTimeStamp) {

				await this.ClearAllStores();
				return false;
			}
			else if (game_state.bPointsAndPathsLoaded === false) {
				//db entry ok and ready for read
				try {
					await this.BeginBulkStorage([this.DB_POINT_STORE, this.DB_PATH_STORE], 'readonly');

					if ((await this.PointStore.PrepareStore()) !== true || (await this.PathStore.PrepareStore()) !== true) {

						await this.ClearAllStores();

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
		if (this.bulkStores === null)
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
		if (this.bulkStores !== null) {
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


export {
	//CreateOval, CreatePolyline, RemovePolyline, CreateSVGVML, CreateLine,
	SvgVml,
	hasDuplicates, sortPointsClockwise,
	GameStateStore
};
