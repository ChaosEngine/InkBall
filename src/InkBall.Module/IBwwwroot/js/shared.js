/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "$" }]*/
/*global myAlert*/
"use strict";

/**
 * Point status enum
 * */
const StatusEnum = Object.freeze({
	POINT_FREE_RED: -3,
	POINT_FREE_BLUE: -2,
	POINT_FREE: -1,
	POINT_STARTING: 0,
	POINT_IN_PATH: 1,
	POINT_OWNED_BY_RED: 2,
	POINT_OWNED_BY_BLUE: 3
});

/**
 * Shared log function
 * @param {any} msg - object to log
 */
function LocalLog(msg) {
	// eslint-disable-next-line no-console
	console.log(msg);
}

/**
 * Shared error log function
 * @param {...any} args - objects to log
 */
function LocalError(...args) {
	let msg = '';
	for (let i = 0; i < args.length; i++) {
		const str = args[i];
		if (str)
			msg += str;
	}
	// eslint-disable-next-line no-console
	console.error(msg);
}

const LocalAlert = (typeof myAlert !== "undefined") ?
	myAlert :
	(msg, onCloseCallback = undefined) => {
		window.alert(msg);
		if (onCloseCallback)
			onCloseCallback();
	};

/**
 * Based on http://www.faqs.org/faqs/graphics/algorithms-faq/
 * but mainly on http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
 * returns != 0 if point is inside path
 * @param {array} pathPoints points as array of {x,y}
 * @param {number} x point to check x coordinate
 * @param {number} y point to check y coordinate
 * @returns {boolean} if point lies inside the polygon
 */
function pnpoly(pathPoints, x, y) {
	const size = pathPoints.length;
	let i, j, c = false;

	for (i = 0, j = size - 1; i < size; j = i++) {
		const pi = pathPoints[i], pj = pathPoints[j];

		if ((((pi.y <= y) && (y < pj.y)) ||
			((pj.y <= y) && (y < pi.y))) &&
			(x < (pj.x - pi.x) * (y - pi.y) / (pj.y - pi.y) + pi.x))

			c = !c;
	}
	return c;
}

/**
 * Test for array uniqueness using default object comparator
 * @param {array} array of objects that are tested against uniqueness
 * @returns {boolean} true - has duplicates
 */
function hasDuplicates(array) {
	return (new Set(array)).size !== array.length;
}

async function Sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Sorting point clockwise/anticlockwise
 * @param {array} points array of points to sort
 * @returns {array} of points
 */
function sortPointsClockwise(points) {
	// Get the center (mean value) using reduce
	const center = points.reduce((acc, pt) => {
		acc.x += pt.x;
		acc.y += pt.y;
		return acc;
	}, { x: 0, y: 0 });
	center.x /= points.length;
	center.y /= points.length;

	// Add an angle property to each point using tan(angle) = y/x
	// const one80_div_by_pi = 180 / Math.PI;
	const added_angles = points.map(p => {
		p.angle = Math.atan2(p.y - center.y, p.x - center.x)/*  * one80_div_by_pi */;
		return p;
	});

	// Sort your points by angle
	const pointsSorted = added_angles.sort((a, b) => a.angle - b.angle);
	return pointsSorted;
}

/**
 * Checks if point is outside all created lines
 * @param {number} x point coordinate
 * @param {number} y point coordinate
 * @param {Array} allLines array
 * @returns bool - true if outside, false otherwise
 */
function IsPointOutsideAllPaths(x, y, allLines) {
	for (const line of allLines) {
		const points = line.GetPointsArray();

		if (false !== pnpoly(points, x, y))
			return false;
	}

	return true;
}

/**
 * The function returns an object containing the following properties:
	minX: The minimum x-coordinate.
	minY: The minimum y-coordinate.
	maxX: The maximum x-coordinate.
	maxY: The maximum y-coordinate.
	width: The width of the bounding box (calculated as maxX - minX).
	height: The height of the bounding box (calculated as maxY - minY).
 * @param {Array<InkBallPointViewModel>} points array
 * @returns bounding box object
 */
function getBoundingBox(points) {
	let minX = Infinity;
	let minY = Infinity;
	let maxX = -Infinity;
	let maxY = -Infinity;

	for (const point of points) {
		minX = Math.min(minX, point.x);
		minY = Math.min(minY, point.y);

		maxX = Math.max(maxX, point.x);
		maxY = Math.max(maxY, point.y);
	}

	return {
		minX,
		minY,
		maxX,
		maxY,

		width: maxX - minX,
		height: maxY - minY
	};
}

//////////////////////////////////////////////////////
// SVG-VML mini graphic library 
// ==========================================
// written by Gerard Ferrandez
// initial version - June 28, 2006
// modified - 2020 - Andrzej Pauli dropping vml - obsolete and no support so why bother
// modified - 2018-2020 - Andrzej Pauli polyline and oval functions & extensions
// modified - July 21 - use object functions
// modified - July 24 - debug
// www.dhteumeuleu.com
//////////////////////////////////////////////////////
class SvgVml {
	#mathSVGPoint;
	#cont;

	constructor() {
		const svgNS = "http://www.w3.org/2000/svg";
		let svgAvailable = false, svgAntialias = undefined;
		let documentCreateElementNS_SVG, documentCreateElementNS_Element;
		this.#cont = null;
		// Create an SVGPoint for future math
		this.#mathSVGPoint = null;

		if (self && self.document && self.document.createElementNS) {
			const some_cont = document.createElementNS(svgNS, "svg");
			svgAvailable = (some_cont.x !== null);
		}

		if (svgAvailable) {
			/* ============= displayable SVG ============== */
			documentCreateElementNS_SVG = (contextElement) => contextElement;
			documentCreateElementNS_Element = function (elementName) {
				switch (elementName) {
					case "circle":
					case "line":
					case "polyline":
					case "rect":
						return document.createElementNS(svgNS, elementName);

					default:
						throw new Error(`unknown type ${elementName}`);
				}
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
			/////////////// Pollyfills start ///////////////
			self.SVGCircleElement = function () {
				this.attributes = new Map();
			};
			SVGCircleElement.prototype.setAttribute = function (key, val) {
				this.attributes.set(key, val);
			};
			SVGCircleElement.prototype.getAttribute = function (key) {
				return this.attributes.get(key);
			};
			SVGCircleElement.prototype.removeAttribute = function (key) {
				this.attributes.delete(key);
			};

			self.SVGPolylineElement = function () {
				this.attributes = new Map();
			};
			SVGPolylineElement.prototype.setAttribute = function (key, val) {
				this.attributes.set(key, val);
			};
			SVGPolylineElement.prototype.getAttribute = function (key) {
				return this.attributes.get(key);
			};
			SVGPolylineElement.prototype.removeAttribute = function (key) {
				this.attributes.delete(key);
			};

			self.SVGRectElement = function () {
				this.attributes = new Map();
			};
			/////////////// Pollyfills end ///////////////

			documentCreateElementNS_Element = function (elementName) {
				switch (elementName) {
					case "circle":
						return new SVGCircleElement();
					case "polyline":
						return new SVGPolylineElement();
					case "rect":
						return new SVGRectElement();

					default:
						throw new Error(`unknown type ${elementName}`);
				}
			};
		}

		SVGCircleElement.prototype.move = function (x, y/* , radius = undefined */) {
			this.setAttribute("cx", x);
			this.setAttribute("cy", y);
			// if (radius)
			// 	this.setAttribute("r", radius);
		};
		SVGCircleElement.prototype.GetStrokeColor = function () { return this.getAttribute("stroke"); };
		SVGCircleElement.prototype.SetStrokeColor = function (col) { this.setAttribute("stroke", col); };
		SVGCircleElement.prototype.GetPosition = function () {
			if (typeof (this.cachedPosition) === 'undefined') {
				this.cachedPosition = { x: parseInt(this.getAttribute("cx")), y: parseInt(this.getAttribute("cy")) };
			}
			return this.cachedPosition;
		};
		SVGCircleElement.prototype.GetFillColor = function () {
			if (typeof (this.cachedFillColor) === 'undefined') {
				this.cachedFillColor = this.getAttribute("fill");
			}
			return this.cachedFillColor;
		};
		SVGCircleElement.prototype.SetFillColor = function (col) {
			this.cachedFillColor = col;
			this.setAttribute("fill", col);
		};
		SVGCircleElement.prototype.GetStatus = function () {
			if (typeof (this.cachedStatus) === 'undefined') {
				this.cachedStatus = StringToStatusEnum(this.getAttribute("data-status"));
			}
			return this.cachedStatus;
		};
		SVGCircleElement.prototype.SetStatus = function (iStatus, saveOldPoint = false) {
			if (saveOldPoint) {
				const old_status = StringToStatusEnum(this.getAttribute("data-status"));
				this.cachedStatus = iStatus;
				this.setAttribute("data-status", StatusEnumToString(this.cachedStatus));
				if (old_status !== StatusEnum.POINT_FREE && old_status !== iStatus)
					this.setAttribute("data-old-status", StatusEnumToString(old_status));
			}
			else {
				this.cachedStatus = iStatus;
				this.setAttribute("data-status", StatusEnumToString(iStatus));
			}
		};
		SVGCircleElement.prototype.RevertOldStatus = function () {
			const old_status = this.getAttribute("data-old-status");
			if (old_status) {
				this.removeAttribute("data-old-status");
				this.setAttribute("data-status", old_status);
				this.cachedStatus = StringToStatusEnum(old_status);
				return this.cachedStatus;
			}
			return -1;
		};
		SVGCircleElement.prototype.GetZIndex = function () { return this.getAttribute("z-index"); };
		SVGCircleElement.prototype.SetZIndex = function (val) { this.setAttribute("z-index", val); };
		SVGCircleElement.prototype.Hide = function () { this.setAttribute("visibility", 'hidden'); };
		SVGCircleElement.prototype.Show = function () { this.setAttribute("visibility", 'visible'); };
		SVGCircleElement.prototype.StrokeWeight = function (sw) { this.setAttribute("stroke-width", sw); };
		SVGCircleElement.prototype.Serialize = function () {
			const { x, y } = this.GetPosition();
			const Status = this.GetStatus();
			const Color = this.GetFillColor();
			return { x, y, Status, Color };
		};

		SVGPolylineElement.prototype.AppendPoints = function (x, y, diff = 1) {
			const pts_str = this.getAttribute("points");
			const pts = pts_str.split(" ");

			if (pts.length <= 1 || true === hasDuplicates(pts))
				return false;

			const arr = pts.at(-1).split(",");//obtain last point coords
			if (arr.length !== 2)
				return false;

			const last_x = parseInt(arr[0]), last_y = parseInt(arr[1]);
			x = parseInt(x);
			y = parseInt(y);
			if (!(Math.abs(last_x - x) <= diff && Math.abs(last_y - y) <= diff))
				return false;

			this.setAttribute("points", pts_str + ` ${x},${y}`);
			return true;
		};
		SVGPolylineElement.prototype.RemoveLastPoint = function () {
			const new_points = this.getAttribute("points").replace(/(\s\d+,\d+)$/, "");
			this.setAttribute("points", new_points);
			return new_points;
		};
		SVGPolylineElement.prototype.ContainsPoint = function (x, y) {
			// const regex = new RegExp(`${x},${y}`, 'g');
			// const cnt = (this.getAttribute("points").match(regex) || []).length;
			// return cnt;

			const str_ = this.getAttribute("points");
			const subStr = `${x},${y}`;

			//https://stackoverflow.com/a/74282605/4429828
			let occurrence_count = 0;
			let pos = -subStr.length;
			while ((pos = str_.indexOf(subStr, pos + subStr.length)) > -1) {
				occurrence_count++;
			}
			return occurrence_count;
		};
		SVGPolylineElement.prototype.GetPointsString = function () {
			return this.getAttribute("points");
		};
		SVGPolylineElement.prototype.GetPointsArray = function () {
			//format is:
			//x0,y0 x1,y1 x2,y2
			//
			if (typeof (this.cachedPoints) === 'undefined') {
				this.cachedPoints = this.getAttribute("points").split(" ").map(function (pt) {
					const [x, y] = pt.split(',');
					return { x: parseInt(x), y: parseInt(y) };
				});
			}
			return this.cachedPoints;
		};
		SVGPolylineElement.prototype.SetPoints = function (sPoints) {
			this.setAttribute("points", sPoints);
		};
		SVGPolylineElement.prototype.GetIsClosed = function () {
			const pts = this.getAttribute("points").split(" ");
			return pts[0] === pts.at(-1);
		};
		SVGPolylineElement.prototype.GetLength = function () {
			return this.getAttribute("points").split(" ").length;
		};
		SVGPolylineElement.prototype.SetWidthAndColor = function (sw, col) {
			this.setAttribute("stroke", col);
			this.setAttribute("fill", col);
			this.setAttribute("stroke-width", sw);
		};
		SVGPolylineElement.prototype.GetID = function () { return parseInt(this.getAttribute("data-id")); };
		SVGPolylineElement.prototype.SetID = function (iID) { this.setAttribute("data-id", iID); };
		SVGPolylineElement.prototype.GetFillColor = function () { return this.getAttribute("fill"); };
		SVGPolylineElement.prototype.Serialize = function () {
			const id = this.GetID();
			const color = this.GetFillColor();
			const pts = this.GetPointsString();
			return { iId: id, Color: color, PointsAsString: pts };
		};

		this.Init = function (contextElement, iWidth, iHeight, { iGridWidth, iGridHeight }, antialias) {
			this.#cont = documentCreateElementNS_SVG(contextElement);
			if (iWidth)
				this.#cont.setAttributeNS(null, 'width', iWidth);
			if (iHeight)
				this.#cont.setAttributeNS(null, 'height', iHeight);
			if (contextElement) {
				if (iGridWidth !== undefined && iGridHeight !== undefined)
					this.#cont.setAttribute("viewBox", `0 0 ${iGridWidth} ${iGridHeight}`);

				this.#mathSVGPoint = this.#cont.createSVGPoint();
			}
			svgAntialias = antialias;

			return svgAvailable ? this.#cont : null;
		};
		this.CreatePolyline = function (points, col, width = undefined) {
			const o = documentCreateElementNS_Element("polyline");
			if (svgAntialias !== undefined)
				o.setAttribute("shape-rendering", svgAntialias === true ? "auto" : "optimizeSpeed");
			if (width !== undefined)
				o.setAttribute("stroke-width", width);
			if (col) {
				o.setAttribute("stroke", col);
				o.setAttribute("fill", col);
			}
			// o.setAttribute("fill-opacity", "0.1");
			if (points) o.setAttribute("points", points);
			// o.setAttribute("stroke-linecap", "round");
			// o.setAttribute("stroke-linejoin", "round");
			o.setAttribute("data-id", 0);

			this.#cont.appendChild(o);
			return o;
		};
		this.CreateOval = function (radius = undefined) {
			const o = documentCreateElementNS_Element("circle");
			if (svgAntialias !== undefined)
				o.setAttribute("shape-rendering", svgAntialias === true ? "auto" : "optimizeSpeed");
			// o.setAttribute("stroke-width", 0);
			if (radius !== undefined)
				o.setAttribute("r", radius);
			o.setAttribute("data-status", StatusEnumToString(StatusEnum.POINT_FREE));
			//o.setAttribute("data-old-status", StatusEnumToString(StatusEnum.POINT_FREE));

			this.#cont.appendChild(o);
			return o;
		};
		/**
		 * Creates rectangle
		 * For example: <rect x="15" y="25" width="20" height="20" rx="2" fill="transparent" stroke="green" stroke-width="0.25"></rect>
		 * 
		 * @param {number} x 
		 * @param {number} y 
		 * @param {number} width 
		 * @param {number} height 
		 * @param {string} fill color
		 * @param {string} stroke color
		 * @returns created rectangle
		 */
		this.CreateRect = function (x, y, width, height, stroke = "green", fill = "transparent") {
			const o = documentCreateElementNS_Element("rect");
			if (svgAntialias !== undefined)
				o.setAttribute("shape-rendering", svgAntialias === true ? "auto" : "optimizeSpeed");

			o.setAttribute("x", x);
			o.setAttribute("y", y);

			o.setAttribute("width", width);
			o.setAttribute("height", height);

			o.setAttribute("fill", fill);
			o.setAttribute("stroke", stroke);
			o.setAttribute("stroke-width", 0.1);

			this.#cont.appendChild(o);
			return o;
		};

		/**
		 * Convert numerical StatusEnum to string
		 * @param {number} enumVal to convert
		 * @returns string representation
		 */
		const StatusEnumToString = function (enumVal) {
			switch (enumVal) {
				case StatusEnum.POINT_FREE_RED:
					return Object.keys(StatusEnum)[0];
				case StatusEnum.POINT_FREE_BLUE:
					return Object.keys(StatusEnum)[1];
				case StatusEnum.POINT_FREE:
					return Object.keys(StatusEnum)[2];
				case StatusEnum.POINT_STARTING:
					return Object.keys(StatusEnum)[3];
				case StatusEnum.POINT_IN_PATH:
					return Object.keys(StatusEnum)[4];
				case StatusEnum.POINT_OWNED_BY_RED:
					return Object.keys(StatusEnum)[5];
				case StatusEnum.POINT_OWNED_BY_BLUE:
					return Object.keys(StatusEnum)[6];
				default:
					throw new Error('bad status enum value');
			}
		};
		
		const allStatusesAsString = Object.keys(StatusEnum);
		/**
		 * Convert string representation to numerical StatusEnum
		 * @param {string} enumStr string representation
		 * @returns numeric StatusEnum
		 */
		const StringToStatusEnum = function (enumStr) {
			switch (enumStr.toUpperCase()) {
				case allStatusesAsString[0]:
					return StatusEnum.POINT_FREE_RED;
				case allStatusesAsString[1]:
					return StatusEnum.POINT_FREE_BLUE;
				case allStatusesAsString[2]:
					return StatusEnum.POINT_FREE;
				case allStatusesAsString[3]:
					return StatusEnum.POINT_STARTING;
				case allStatusesAsString[4]:
					return StatusEnum.POINT_IN_PATH;
				case allStatusesAsString[5]:
					return StatusEnum.POINT_OWNED_BY_RED;
				case allStatusesAsString[6]:
					return StatusEnum.POINT_OWNED_BY_BLUE;
				default:
					throw new Error('bad status enum string');
			}
		};
	}

	RemoveOval(oval) {
		this.#cont.removeChild(oval);
	}

	RemovePolyline(polyline) {
		this.#cont.removeChild(polyline);
	}

	RemoveRect(rect) {
		this.#cont.removeChild(rect);
	}

	DeserializeOval(packed, radius = undefined) {
		let { x, y, Status, Color } = packed;
		x = parseInt(x);
		y = parseInt(y);
		const o = this.CreateOval(radius);
		o.move(x, y);
		o.SetFillColor(Color);
		o.SetStatus(Status);
		return o;
	}

	DeserializePolyline(packed, width = undefined) {
		const { iId, Color, PointsAsString } = packed;
		const o = this.CreatePolyline(PointsAsString, Color, width);
		o.SetID(iId);
		return o;
	}

	DeserializeRect(packed) {
		const { x, y, width, height, stroke, fill } = packed;
		const o = this.CreateRect(x, y, width, height, stroke, fill);
		return o;
	}

	/**
	 * Converts coordinates point from screen to scaled SVG as according to
	 * https://docs.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/samples/hh535760(v=vs.85)?redirectedfrom=MSDN
	 * https://stackoverflow.com/questions/22183727/how-do-you-convert-screen-coordinates-to-document-space-in-a-scaled-svg
	 * @param {number} clientX X coordinate
	 * @param {number} clientY Y coordinate
	 * @returns {object} coordinate {x,y} point
	 */
	ToCursorPoint(clientX, clientY) {
		// Get point in global SVG space
		this.#mathSVGPoint.x = clientX; this.#mathSVGPoint.y = clientY;
		const loc = this.#mathSVGPoint.matrixTransform(this.#cont.getScreenCTM().inverse());

		return loc;
	}

	/**
	 * https://stackoverflow.com/a/68078941/4429828
	 * @description Check if a pt is in, on or outside of a circle.
	 * @param {point} pt The point to test. An array of two floats - x and y coordinates.
	 * @param {point} center The circle center. An array of two floats - x and y coordinates.
	 * @param {float} r The circle radius.
	 * @param {float} tolerance +- above below tolerance value
	 * @returns {1 | 0 | -1} 1 if the point is inside, 0 if it is on and -1 if it is outside the circle.
	 */
	IsPointInCircle(pt, center, r, tolerance = 4) {
		const lhs = Math.pow(center.x - pt.x, 2) + Math.pow(center.y - pt.y, 2);
		const rhs = Math.pow(r, 2);

		if (Math.abs(lhs - rhs) < tolerance) {//inside
			// if ((rhs - lhs) < tolerance)
			// 	return 0;
			// LocalLog(`lhs - rhs = ${lhs - rhs}`);
			return 1;
		}
		else if (lhs === rhs)
			return 0;//on circle
		else
			return -1;//outside
	}
}

class GameStateStore {
	#DB;
	#DB_NAME;
	#DB_VERSION;
	#DB_POINT_STORE;
	#DB_PATH_STORE;
	#DB_STATE_STORE;
	#bulkStores;
	#PointStore;
	#PathStore;
	#sMsgThisEngineDoesntKnowHowToCloneABlob;

	constructor(useIndexedDb, pointCreationCallbackFn = null, pathCreationCallbackFn = null, getGameStateFn = null, version = "") {
		if (useIndexedDb) {
			if (!('indexedDB' in self)) {
				LocalLog("This browser doesn't support IndexedDB");
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
			#MainGameStateStore;
			#GetPoint;
			#StorePoint;
			#UpdatePoint;
			// GetAllPoints;
			#UpdateState;
			#PointCreationCallback;
			// GetGameStateCallback;

			constructor(mainGameStateStore, pointCreationCallbackFn, getGameStateFn) {
				super();
				this.#MainGameStateStore = mainGameStateStore;
				this.#GetPoint = mainGameStateStore.GetPoint.bind(this.#MainGameStateStore);
				this.#StorePoint = mainGameStateStore.StorePoint.bind(this.#MainGameStateStore);
				this.#UpdatePoint = mainGameStateStore.UpdatePoint.bind(this.#MainGameStateStore);
				this.GetAllPoints = mainGameStateStore.GetAllPoints.bind(this.#MainGameStateStore);
				this.#UpdateState = mainGameStateStore.UpdateState.bind(this.#MainGameStateStore);
				this.#PointCreationCallback = pointCreationCallbackFn;
				this.GetGameStateCallback = getGameStateFn;
			}

			async PrepareStore() {
				if (this.#PointCreationCallback && this.GetGameStateCallback) {
					const points = await this.GetAllPoints();
					const game_state = this.GetGameStateCallback();

					//loading points from IndexedDB
					for (const idb_pt of points) {
						const pt = await this.#PointCreationCallback(idb_pt.x, idb_pt.y, idb_pt.Status, idb_pt.Color);
						const index = idb_pt.y * game_state.iGridWidth + idb_pt.x;
						this.store.set(index, pt);
					}

				}
				return true;
			}

			async BeginBulkStorage() {
				await this.#MainGameStateStore.BeginPointBulkStorage('readwrite');

				if (this.#MainGameStateStore.pointBulkBuffer === null)
					this.#MainGameStateStore.pointBulkBuffer = new Map();
			}

			async EndBulkStorage() {
				await this.#MainGameStateStore.StoreAllPoints();

				await this.#MainGameStateStore.EndPointBulkStorage();
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
					x: pos.x,
					y: pos.y,
					Status: oval.GetStatus()
				};
				if (color)
					idb_pt.Color = color;

				if (await this.has(key))
					await this.#UpdatePoint(key, idb_pt);
				else
					await this.#StorePoint(key, idb_pt);

				if (this.#UpdateState) {
					if (game_state.bPointsAndPathsLoaded === true)
						await this.#UpdateState(game_state.iGameID, game_state);
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
			#MainGameStateStore;
			#GetAllPaths;
			#StorePath;
			#UpdateState;
			#PathCreationCallback;
			#GetGameStateCallback;

			constructor(mainGameStateStore, pathCreationCallbackFn, getGameStateFn) {
				super();
				this.#MainGameStateStore = mainGameStateStore;
				this.#GetAllPaths = mainGameStateStore.GetAllPaths.bind(this.#MainGameStateStore);
				this.#StorePath = mainGameStateStore.StorePath.bind(this.#MainGameStateStore);
				this.#UpdateState = mainGameStateStore.UpdateState.bind(this.#MainGameStateStore);
				this.#PathCreationCallback = pathCreationCallbackFn;
				this.#GetGameStateCallback = getGameStateFn;
			}

			async PrepareStore() {
				if (this.#PathCreationCallback) {
					const paths = await this.#GetAllPaths();
					//loading paths from IndexedDB
					for (const idb_pa of paths) {
						const pa = await this.#PathCreationCallback(idb_pa.PointsAsString, idb_pa.Color, idb_pa.iId);
						this.store.push(pa);
					}
				}
				return true;
			}

			async BeginBulkStorage() {
				await this.#MainGameStateStore.BeginPathBulkStorage('readwrite');

				if (this.#MainGameStateStore.pathBulkBuffer === null)
					this.#MainGameStateStore.pathBulkBuffer = new Map();
			}

			async EndBulkStorage() {
				await this.#MainGameStateStore.StoreAllPaths();

				await this.#MainGameStateStore.EndPathBulkStorage();
			}

			async push(val) {
				const game_state = this.#GetGameStateCallback();

				const id_key = val.GetID();
				const idb_path = {
					iId: id_key,
					Color: val.GetFillColor(),
					PointsAsString: val.GetPointsString().split(" ").map((pt) => {
						let [x, y] = pt.split(',');
						x = parseInt(x); y = parseInt(y);
						return `${x},${y}`;
					}).join(" ")
				};

				await this.#StorePath(id_key, idb_path);

				if (this.#UpdateState) {
					if (game_state.bPointsAndPathsLoaded === true)
						await this.#UpdateState(game_state.iGameID, game_state);
				}

				return this.store.push(val);
			}

			async all() {
				let values = this.store;
				if (values)
					return values;
				values = await this.#GetAllPaths();
				return values;
			}
		};
		/////////inner class definitions end/////////

		if (useIndexedDb === true) {
			this.#DB_NAME = 'InkballGame';
			this.#DB_POINT_STORE = 'points';
			this.#DB_PATH_STORE = 'paths';
			this.#DB_STATE_STORE = 'state';
			this.#DB = null;//main DB object
			this.#bulkStores = null;
			this.pointBulkBuffer = null;
			this.pathBulkBuffer = null;

			// Use a long long for this value (don't use a float)
			if (!version || version === "" || version.length <= 0)
				this.#DB_VERSION = null;
			else {
				this.#DB_VERSION = parseInt(version.split('.').reduce((acc, val) => {
					val = parseInt(val);
					return acc * 10 + (isNaN(val) ? 0 : val);
				}, 0)) - 1010/*initial module versioning start number*/ + 4/*initial indexDB start number*/;
			}

			this.#PointStore = new IDBPointStoreDefinition(this, pointCreationCallbackFn, getGameStateFn);
			this.#PathStore = new IDBPathStoreDefinition(this, pathCreationCallbackFn, getGameStateFn);
		}
		else {
			this.#PointStore = new SimplePointStoreDefinition();
			this.#PathStore = new SimplePathStoreDefinition();
		}

		this.#sMsgThisEngineDoesntKnowHowToCloneABlob = "This engine doesn't know how to clone a Blob!??!!";
	}

	GetPointStore() {
		return this.#PointStore;
	}

	GetPathStore() {
		return this.#PathStore;
	}

	async #OpenDb() {
		LocalLog("OpenDb ...");
		return new Promise((resolve, reject) => {
			let req;
			if (this.#DB_VERSION !== null)
				req = indexedDB.open(this.#DB_NAME, this.#DB_VERSION);
			else
				req = indexedDB.open(this.#DB_NAME);

			req.onsuccess = (evt) => {
				// Equal to: db = req.result;
				this.#DB = evt.currentTarget.result;

				LocalLog("OpenDb DONE");
				resolve(evt.currentTarget.result);
			};

			req.onerror = (evt) => {
				LocalError("OpenDb:", evt.target.errorCode || evt.target.error);
				reject();
			};

			/**
			 * onupgradeneeded event handler
			 * @param {IDBVersionChangeEvent} evt change event
			 */
			req.onupgradeneeded = (evt) => {
				LocalLog(`OpenDb.onupgradeneeded(version: ${this.#DB_VERSION})`);
				const loc_db = evt.currentTarget.result;

				const store_list = Array.from(loc_db.objectStoreNames);
				if (store_list.includes(this.#DB_POINT_STORE))
					loc_db.deleteObjectStore(this.#DB_POINT_STORE);
				if (store_list.includes(this.#DB_PATH_STORE))
					loc_db.deleteObjectStore(this.#DB_PATH_STORE);
				if (store_list.includes(this.#DB_STATE_STORE))
					loc_db.deleteObjectStore(this.#DB_STATE_STORE);

				const point_store = loc_db.createObjectStore(
					this.#DB_POINT_STORE, { keyPath: /* 'Idx' */['x', 'y'], autoIncrement: false });
				//point_store.createIndex('Status', 'Status', { unique: false });
				//point_store.createIndex('Color', 'Color', { unique: false });
				//point_store.createIndex('Key', 'Key', { unique: true });

				loc_db.createObjectStore(
					this.#DB_PATH_STORE, { keyPath: 'iId', autoIncrement: false });
				//path_store.createIndex('Color', 'Color', { unique: false });

				loc_db.createObjectStore(
					this.#DB_STATE_STORE, { /*keyPath: 'gameId',*/ autoIncrement: false });
			};
		});
	}

	/**
	  * @param {string} storeName is a store name
	  * @param {string} mode either "readonly" or "readwrite"
	  * @returns {object} store
	  */
	#GetObjectStore(storeName, mode) {
		if (this.#bulkStores !== null && this.#bulkStores.has(storeName))
			return this.#bulkStores.get(storeName);

		const tx = this.#DB.transaction(storeName, mode);
		return tx.objectStore(storeName);
	}

	async #ClearAllStores() {
		const clearObjectStore = async (storeName) => {
			return new Promise((resolve, reject) => {
				const store = this.#GetObjectStore(storeName, 'readwrite');
				const req = store.clear();
				req.onsuccess = function () {
					resolve();
				};
				req.onerror = function (evt) {
					LocalError("clearObjectStore:", evt.target.errorCode);
					reject();
				};
			});
		};

		await Promise.all([
			clearObjectStore(this.#DB_POINT_STORE),
			clearObjectStore(this.#DB_PATH_STORE),
			clearObjectStore(this.#DB_STATE_STORE)
		]);
	}

	/**
	  * @param {number} key is calculated index of point y * width + x, probably not useful
	  */
	async GetPoint(key) {
		return new Promise((resolve, reject) => {
			const store = this.#GetObjectStore(this.#DB_POINT_STORE, 'readonly');
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
			const store = this.#GetObjectStore(this.#DB_POINT_STORE, 'readonly');
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
			const store = this.#GetObjectStore(this.#DB_STATE_STORE, 'readonly');
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
			const store = this.#GetObjectStore(this.#DB_PATH_STORE, 'readonly');
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
			const store = this.#GetObjectStore(this.#DB_PATH_STORE, 'readonly');
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
	  * @param {number} key is calculated index of point y * width + x, probably not useful
	  * @param {object} val is serialized, thin circle
	  */
	async StorePoint(key, val) {
		if (this.#bulkStores !== null && this.#bulkStores.has(this.#DB_POINT_STORE)) {
			if (this.pointBulkBuffer === null)
				this.pointBulkBuffer = new Map();
			this.pointBulkBuffer.set(key, val);
			return Promise.resolve();
		}

		return new Promise((resolve, reject) => {
			const store = this.#GetObjectStore(this.#DB_POINT_STORE, 'readwrite');
			let req;
			try {
				// if (typeof (val.Idx) === 'undefined')
				// 	val.Idx = key;
				req = store.add(val/* , key */);//earlier was 'add'
			} catch (e) {
				if (e.name === 'DataCloneError')
					LocalError(this.#sMsgThisEngineDoesntKnowHowToCloneABlob);
				throw e;
			}
			req.onsuccess = function () {
				resolve();
			};
			req.onerror = function () {
				LocalError("StorePoint error", this.error);
				reject();
			};
		});
	}

	/**
	  * @param {number} key is calculated index of point y * width + x, probably not useful
	  * @param {object} val is serialized, thin circle
	  */
	async UpdatePoint(key, val) {
		if (this.#bulkStores !== null && this.#bulkStores.has(this.#DB_POINT_STORE)) {
			if (this.pointBulkBuffer === null)
				this.pointBulkBuffer = new Map();
			this.pointBulkBuffer.set(key, val);
			return Promise.resolve();
		}

		return new Promise((resolve, reject) => {
			const store = this.#GetObjectStore(this.#DB_POINT_STORE, 'readwrite');
			let req;
			try {
				// if (typeof (val.Idx) === 'undefined')
				// 	val.Idx = key;
				req = store.put(val/* , key */);//earlier was 'add'
			} catch (e) {
				if (e.name === 'DataCloneError')
					LocalError(this.#sMsgThisEngineDoesntKnowHowToCloneABlob);
				throw e;
			}
			req.onsuccess = function () {
				resolve();
			};
			req.onerror = function () {
				LocalError("UpdatePoint error", this.error);
				reject();
			};
		});
	}

	/**
	 * Store all points array to IDBStore
	 * @param {Array<object>} values of points
	 * @returns {Promise} resolved promise
	 */
	async StoreAllPoints(values = null) {
		if (!values)
			values = this.pointBulkBuffer;

		if (!values || this.#bulkStores === null)
			return Promise.reject();

		return new Promise((resolve, reject) => {
			const store = this.#GetObjectStore(this.#DB_POINT_STORE, 'readwrite');
			try {
				values.forEach(function (val/* , key */) {
					// if (typeof (val.Idx) === 'undefined')
					// 	val.Idx = key;
					store.add(val/* , key */);
				});

				this.pointBulkBuffer = null;
				resolve();
			} catch (e) {
				LocalError(this.#sMsgThisEngineDoesntKnowHowToCloneABlob);
				reject(e);
			}
		});
	}

	/**
	  * @param {number} key is GameID
	  * @param {object} gameState is InkBallGame state object
	  */
	async #StoreState(key, gameState) {
		return new Promise((resolve, reject) => {
			const store = this.#GetObjectStore(this.#DB_STATE_STORE, 'readwrite');
			let req;
			try {
				req = store.add(gameState, key);
			} catch (e) {
				if (e.name === 'DataCloneError')
					LocalError(this.#sMsgThisEngineDoesntKnowHowToCloneABlob);
				throw e;
			}
			req.onsuccess = function () {
				resolve();
			};
			req.onerror = function () {
				LocalError("StoreState error", this.error);
				reject();
			};
		});
	}

	async UpdateState(key, gameState) {
		return new Promise((resolve, reject) => {
			const store = this.#GetObjectStore(this.#DB_STATE_STORE, 'readwrite');
			let req;
			try {
				req = store.put(gameState, key);
			} catch (e) {
				if (e.name === 'DataCloneError')
					LocalError(this.#sMsgThisEngineDoesntKnowHowToCloneABlob);
				throw e;
			}
			req.onsuccess = function () {
				resolve();
			};
			req.onerror = function () {
				LocalError("UpdateState error", this.error);
				reject();
			};
		});
	}

	/**
	  * @param {number} key is path Id
	  * @param {object} val is serialized thin path
	  */
	async StorePath(key, val) {
		if (this.#bulkStores !== null && this.#bulkStores.has(this.#DB_PATH_STORE)) {
			if (this.pathBulkBuffer === null)
				this.pathBulkBuffer = new Map();
			this.pathBulkBuffer.set(key, val);
			return Promise.resolve();
		}

		return new Promise((resolve, reject) => {
			const store = this.#GetObjectStore(this.#DB_PATH_STORE, 'readwrite');
			let req;
			try {
				req = store.add(val/*, key*/);
			} catch (e) {
				if (e.name === 'DataCloneError')
					LocalError(this.#sMsgThisEngineDoesntKnowHowToCloneABlob);
				throw e;
			}
			req.onsuccess = function () {
				resolve();
			};
			req.onerror = function () {
				LocalError("StorePath error", this.error);
				reject();
			};
		});
	}

	async StoreAllPaths(values = null) {
		if (!values)
			values = this.pathBulkBuffer;

		if (!values || this.#bulkStores === null)
			return Promise.reject();

		return new Promise((resolve, reject) => {
			const store = this.#GetObjectStore(this.#DB_PATH_STORE, 'readwrite');
			try {
				// eslint-disable-next-line no-unused-vars
				values.forEach(function (v, key) {
					store.add(v/*, key*/);
				});

				this.pathBulkBuffer = null;
				resolve();
			} catch (e) {
				LocalError(this.#sMsgThisEngineDoesntKnowHowToCloneABlob);
				reject(e);
			}
		});
	}

	async PrepareStore() {
		//detecting if we have IndexedDb advanced store (only checking point-store); otherwise, there is no point in going further
		if (!this.#PointStore.GetAllPoints) return false;

		if (this.#DB === null)
			await this.#OpenDb();
		else
			return false;//all initiated, just exit

		const game_state = this.#PointStore.GetGameStateCallback();
		const idb_state = await this.GetState(game_state.iGameID);
		if (!idb_state) {
			//no state entry in db
			await this.#ClearAllStores();

			await this.#StoreState(game_state.iGameID, game_state);

			return false;
		}
		else {
			//Verify date of last move and decide whether to need pull points from signalR
			//Both datetimes should be ISO UTC
			if (idb_state.sLastMoveGameTimeStamp !== game_state.sLastMoveGameTimeStamp) {

				await this.#ClearAllStores();
				return false;
			}
			else if (game_state.bPointsAndPathsLoaded === false) {
				//db entry ok and ready for read
				try {
					await this.#BeginBulkStorage([this.#DB_POINT_STORE, this.#DB_PATH_STORE], 'readonly');

					if ((await this.#PointStore.PrepareStore()) !== true || (await this.#PathStore.PrepareStore()) !== true) {

						await this.#ClearAllStores();

						return false;
					}

					return true;
				} finally {
					await this.#EndBulkStorage([this.#DB_POINT_STORE, this.#DB_PATH_STORE]);
				}
			}
		}
	}

	/**
	 * Load all needed stores upfront
	 * @param {any} storeName array or string of store to load
	 * @param {any} mode - readonly/readwrite
	 */
	async #BeginBulkStorage(storeName, mode) {
		if (this.#bulkStores === null)
			this.#bulkStores = new Map();

		const keys = Array.isArray(storeName) ? storeName : [storeName];
		let tx = null;
		for (const key of keys) {
			if (!this.#bulkStores.has(key)) {
				if (tx === null)
					tx = this.#DB.transaction(keys, mode);
				this.#bulkStores.set(key, tx.objectStore(key));
			}
		}
	}

	async BeginPointBulkStorage(mode) {
		return await this.#BeginBulkStorage(this.#DB_POINT_STORE, mode);
	}

	async BeginPathBulkStorage(mode) {
		return await this.#BeginBulkStorage([this.#DB_POINT_STORE, this.#DB_PATH_STORE], mode);
	}

	async #EndBulkStorage(storeName) {
		if (this.#bulkStores !== null) {
			const keys = Array.isArray(storeName) ? storeName : [storeName];
			for (const key of keys) {
				if (this.#bulkStores.has(key)) {
					this.#bulkStores.delete(key);
				}
			}

			if (this.#bulkStores.size <= 0)
				this.#bulkStores = null;
		}
	}

	async EndPointBulkStorage() {
		return await this.#EndBulkStorage(this.#DB_POINT_STORE);
	}

	async EndPathBulkStorage() {
		return await this.#EndBulkStorage([this.#DB_POINT_STORE, this.#DB_PATH_STORE]);
	}
}


export {
	SvgVml, StatusEnum, pnpoly, LocalLog, LocalError, LocalAlert,
	hasDuplicates, sortPointsClockwise, Sleep, IsPointOutsideAllPaths,
	GameStateStore, getBoundingBox
};
