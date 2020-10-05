(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[2],{

/***/ 2:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "$createOval", function() { return $createOval; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "$createPolyline", function() { return $createPolyline; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "$RemovePolyline", function() { return $RemovePolyline; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "$RemoveOval", function() { return $RemoveOval; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "$createSVGVML", function() { return $createSVGVML; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "$createLine", function() { return $createLine; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hasDuplicates", function() { return hasDuplicates; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sortPointsClockwise", function() { return sortPointsClockwise; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PointStore", function() { return PointStore; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PathStore", function() { return PathStore; });
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


function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var SVG = false;
var svgNS = "http://www.w3.org/2000/svg";
var svgAntialias = false,
    cont = null;
var $createOval, $createPolyline, $RemovePolyline, $RemoveOval, $createSVGVML, $createLine, PointStore, PathStore;

if (document.createElementNS) {
  var svg = document.createElementNS(svgNS, "svg");
  SVG = svg.x !== null;
}
/**
 * Test for array uniquness using default object comparator
 * @param {array} array of objects that are tested againstn uniqenes
 * @returns {boolean} true - has duplicates
 */


function hasDuplicates(array) {
  return new Set(array).size !== array.length;
}

if (SVG) {
  /* ============= SVG ============== */
  $createSVGVML = function $createSVGVML(o, iWidth, iHeight, antialias) {
    cont = document.createElementNS(svgNS, "svg"); //ch_added start
    //if (iWidth)
    //	cont.setAttributeNS(null, 'width', iWidth);
    //if (iHeight)
    //	cont.setAttributeNS(null, 'height', iHeight);
    //ch_added end

    o.appendChild(cont);
    svgAntialias = antialias;
    return cont;
  };

  $createLine = function $createLine(w, col, linecap) {
    var o = document.createElementNS(svgNS, "line");
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

    o.$RGBcolor = function (R, G, B) {
      this.setAttribute("stroke", "rgb(" + Math.round(R) + "," + Math.round(G) + "," + Math.round(B) + ")");
    };

    o.$SetColor = function (color) {
      this.setAttribute("stroke", color);
    };

    o.$strokeWidth = function (s) {
      this.setAttribute("stroke-width", Math.round(s) + "px");
    };

    cont.appendChild(o);
    return o;
  };

  $createPolyline = function $createPolyline(w, points, col) {
    var o = document.createElementNS(svgNS, "polyline");
    o.setAttribute("shape-rendering", svgAntialias ? "auto" : "optimizeSpeed");
    o.setAttribute("stroke-width", Math.round(w));
    if (col) o.setAttribute("stroke", col);
    o.setAttribute("fill", col);
    o.setAttribute("fill-opacity", "0.1");
    if (points) o.setAttribute("points", points);
    o.setAttribute("stroke-linecap", "round");
    o.setAttribute("stroke-linejoin", "round");
    cont.appendChild(o); //ch_added start

    o.setAttribute("data-id", 0);

    o.$AppendPoints = function (x, y) {
      var diff = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 16;
      var pts_str = this.getAttribute("points");
      var pts = pts_str.split(" ");

      if (true === hasDuplicates(pts)) {
        // debugger;
        return false;
      }

      var arr; //obtain last point coords

      if (pts.length <= 1 || (arr = pts[pts.length - 1].split(",")).length !== 2) {
        // debugger;
        return false;
      }

      var last_x = parseInt(arr[0]),
          last_y = parseInt(arr[1]);
      var x_diff = parseInt(x),
          y_diff = parseInt(y);

      if (!(Math.abs(last_x - x_diff) <= diff && Math.abs(last_y - y_diff) <= diff)) {
        // debugger;
        return false;
      }

      this.setAttribute("points", pts_str + " ".concat(x, ",").concat(y));
      return true;
    };

    o.$RemoveLastPoint = function () {
      var newpts = this.getAttribute("points").replace(/(\s\d+,\d+)$/, "");
      this.setAttribute("points", newpts);
      return newpts;
    };

    o.$ContainsPoint = function (x, y) {
      var regexstr = new RegExp("".concat(x, ",").concat(y), 'g');
      var cnt = (this.getAttribute("points").match(regexstr) || []).length;
      return cnt;
    };

    o.$GetPointsString = function () {
      return this.getAttribute("points");
    };

    o.$GetPointsArray = function () {
      //x0,y0 x1,y1 x2,y2
      return this.getAttribute("points").split(" ").map(function (pt) {
        var tab = pt.split(',');
        return {
          x: parseInt(tab[0]),
          y: parseInt(tab[1])
        };
      });
    };

    o.$SetPoints = function (sPoints) {
      this.setAttribute("points", sPoints);
    };

    o.$GetIsClosed = function () {
      var pts = this.getAttribute("points").split(" ");
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

    o.$GetID = function () {
      return parseInt(this.getAttribute("data-id"));
    };

    o.$SetID = function (iID) {
      this.setAttribute("data-id", iID);
    };

    o.$GetFillColor = function () {
      return this.getAttribute("fill");
    }; //ch_added end


    return o;
  };

  $createOval = function $createOval(diam) {
    var o = document.createElementNS(svgNS, "circle");
    o.setAttribute("shape-rendering", svgAntialias ? "auto" : "optimizeSpeed");
    o.setAttribute("stroke-width", 0);
    o.setAttribute("r", Math.round(diam >> 1)); //ch_commented o.style.cursor = "pointer";
    //ch_added

    o.setAttribute("data-status", -1); //o.setAttribute("data-old-status", -1);

    o.$move = function (x1, y1, radius) {
      this.setAttribute("cx", x1);
      this.setAttribute("cy", y1);
      this.setAttribute("r", Math.round(radius));
    };

    o.$GetStrokeColor = function () {
      return this.getAttribute("stroke");
    };

    o.$SetStrokeColor = function (col) {
      this.setAttribute("stroke", col);
    }; //ch_added/changed start


    o.$GetPosition = function () {
      return {
        x: this.getAttribute("cx"),
        y: this.getAttribute("cy")
      };
    };

    o.$GetFillColor = function () {
      return this.getAttribute("fill");
    };

    o.$SetFillColor = function (col) {
      this.setAttribute("fill", col);
    };

    o.$GetStatus = function () {
      return parseInt(this.getAttribute("data-status"));
    };

    o.$SetStatus = function (iStatus) {
      var saveOldPoint = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (saveOldPoint) {
        var old_status = parseInt(this.getAttribute("data-status"));
        this.setAttribute("data-status", iStatus);
        if (old_status !== -1 && old_status !== iStatus) this.setAttribute("data-old-status", old_status);
      } else {
        this.setAttribute("data-status", iStatus);
      }
    };

    o.$RevertOldStatus = function () {
      var old_status = this.getAttribute("data-old-status");

      if (old_status) {
        this.removeAttribute("data-old-status");
        this.setAttribute("data-status", old_status);
        return parseInt(old_status);
      }

      return -1;
    };

    o.$GetZIndex = function () {
      return this.getAttribute("z-index");
    };

    o.$SetZIndex = function (val) {
      this.setAttribute("z-index", val);
    };

    o.$Hide = function () {
      this.setAttribute("visibility", 'hidden');
    };

    o.$Show = function () {
      this.setAttribute("visibility", 'visible');
    }; //ch_added/changed end


    o.$strokeWeight = function (sw) {
      this.setAttribute("stroke-width", sw);
    };

    cont.appendChild(o);
    return o;
  }; //ch_added start


  $RemoveOval = function $RemoveOval(Oval) {
    cont.removeChild(Oval);
  };

  $RemovePolyline = function $RemovePolyline(Polyline) {
    cont.removeChild(Polyline);
  }; //ch_added end

} else if (document.createStyleSheet) {
  /* ============= VML ============== */
  $createSVGVML = function $createSVGVML(o, iWidth, iHeight, antialias) {
    document.namespaces.add("v", "urn:schemas-microsoft-com:vml");
    var style = document.createStyleSheet();
    style.addRule('v\\:*', "behavior: url(#default#VML);");
    style.addRule('v\\:*', "antialias: " + antialias + ";");
    cont = o;
    return o;
  };

  $createLine = function $createLine(w, col, linecap) {
    var o = document.createElement("v:line");
    o.strokeweight = Math.round(w) + "px";
    if (col) o.strokecolor = col;

    o.$move = function (x1, y1, x2, y2) {
      this.to = x1 + "," + y1;
      this.from = x2 + "," + y2;
    };

    o.$RGBcolor = function (R, G, B) {
      this.strokecolor = "rgb(" + Math.round(R) + "," + Math.round(G) + "," + Math.round(B) + ")";
    };

    o.$SetColor = function (color) {
      this.strokecolor = color;
    };

    o.$strokeWidth = function (s) {
      this.strokeweight = Math.round(s) + "px";
    };

    if (linecap) {
      var s = document.createElement("v:stroke");
      s.endcap = linecap;
      o.appendChild(s);
    }

    cont.appendChild(o);
    return o;
  };

  $createPolyline = function $createPolyline(w, points, col) {
    var o = document.createElement("v:polyline");
    o.strokeweight = Math.round(w) + "px";
    if (col) o.strokecolor = col;
    o.points = points;
    var s = document.createElement("v:fill");
    s.color = col;
    s.opacity = 0.1;
    o.appendChild(s);
    cont.appendChild(o); //ch_added start

    o.setAttribute("data-id", 0);

    o.$AppendPoints = function (x, y) {
      var diff = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 16;
      var pts_str = this.points.value;
      var pts = pts_str.split(" ");

      if (true === hasDuplicates(pts)) {
        //debugger;
        return false;
      }

      var arr; //obtain last two point

      if (pts.length <= 1 || (arr = pts[pts.length - 1].split(",")).length !== 2) {
        //debugger;
        return false;
      }

      var last_x = parseInt(arr[0]),
          last_y = parseInt(arr[1]);
      var x_diff = parseInt(x),
          y_diff = parseInt(y);

      if (!(Math.abs(last_x - x_diff) <= diff && Math.abs(last_y - y_diff) <= diff)) {
        //debugger;
        return false;
      }

      this.points.value = pts_str + " ".concat(x, ",").concat(y);
      return true;
    };

    o.$RemoveLastPoint = function () {
      var str = this.points.value.replace(/(\s\d+,\d+)$/, "");
      this.points.value = str;
      return str;
    };

    o.$ContainsPoint = function (x, y) {
      var regexstr = new RegExp("".concat(x, ",").concat(y), 'g');
      var cnt = (this.points.value.match(regexstr) || []).length;
      return cnt;
    };

    o.$GetPointsString = function () {
      return o.points.value;
    };

    o.$GetPointsArray = function () {
      //x0,y0 x1,y1 x2,y2
      return this.points.value.split(" ").map(function (pt) {
        var tab = pt.split(',');
        return {
          x: parseInt(tab[0]),
          y: parseInt(tab[1])
        };
      });
    };

    o.$SetPoints = function (sPoints) {
      this.points.value = sPoints;
    };

    o.$GetIsClosed = function () {
      var pts = this.points.value.split(" ");
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

    o.$GetID = function () {
      return parseInt(this.getAttribute("data-id"));
    };

    o.$SetID = function (iID) {
      this.setAttribute("data-id", iID);
    };

    o.$GetFillColor = function () {
      return this.fill.color;
    }; //ch_added end


    return o;
  };

  $createOval = function $createOval(diam, filled) {
    var o = document.createElement("v:oval");
    o.style.position = "absolute"; //ch_commented o.style.cursor = "pointer";
    //ch_added

    o.setAttribute("data-status", -1); //o.setAttribute("data-old-status", -1);

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

    o.$GetStrokeColor = function () {
      return this.strokecolor;
    };

    o.$SetStrokeColor = function (col) {
      this.strokecolor = col;
    }; //ch_added/changed start


    o.$GetPosition = function () {
      return {
        x: parseInt(this.style.left) + parseInt(this.style.width) * 0.5,
        y: parseInt(this.style.top) + parseInt(this.style.height) * 0.5
      };
    };

    o.$GetFillColor = function () {
      return this.fillcolor;
    };

    o.$SetFillColor = function (col) {
      this.fillcolor = col;
    };

    o.$GetStatus = function () {
      return parseInt(this.getAttribute("data-status"));
    };

    o.$SetStatus = function (iStatus) {
      var saveOldPoint = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (saveOldPoint) {
        var old_status = parseInt(this.getAttribute("data-status"));
        this.setAttribute("data-status", iStatus);
        if (old_status !== -1 && old_status !== iStatus) this.setAttribute("data-old-status", old_status);
      } else {
        this.setAttribute("data-status", iStatus);
      }
    };

    o.$RevertOldStatus = function () {
      var old_status = this.getAttribute("data-old-status");

      if (old_status) {
        this.removeAttribute("data-old-status");
        this.setAttribute("data-status", old_status);
        return parseInt(old_status);
      }

      return -1;
    };

    o.$GetZIndex = function () {
      return this.getAttribute("z-index");
    };

    o.$SetZIndex = function (val) {
      this.setAttribute("z-index", val);
    };

    o.$Hide = function () {
      this.setAttribute("visibility", 'hidden');
    };

    o.$Show = function () {
      this.setAttribute("visibility", 'visible');
    }; //ch_added/changed end


    o.$strokeWeight = function (sw) {
      this.strokeweight = sw;
    };

    cont.appendChild(o);
    return o;
  }; //ch_added start


  $RemoveOval = function $RemoveOval(Oval) {
    cont.removeChild(Oval);
  };

  $RemovePolyline = function $RemovePolyline(Polyline) {
    cont.removeChild(Polyline);
  }; //ch_added end

} else {
  /* ==== no script ==== */
  $createSVGVML = function $createSVGVML() {
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
  var center = points.reduce(function (acc, _ref) {
    var x = _ref.x,
        y = _ref.y;
    acc.x += x;
    acc.y += y;
    return acc;
  }, {
    x: 0,
    y: 0
  });
  center.x /= points.length;
  center.y /= points.length; // Add an angle property to each point using tan(angle) = y/x

  var angles = points.map(function (_ref2) {
    var x = _ref2.x,
        y = _ref2.y;
    return {
      x: x,
      y: y,
      angle: Math.atan2(y - center.y, x - center.x) * 180 / Math.PI
    };
  }); // Sort your points by angle

  var pointsSorted = angles.sort(function (a, b) {
    return a.angle - b.angle;
  });
  return pointsSorted;
} //////////IndexedDB points and path stores start//////////


var DB_NAME = 'InkballGame',
    DB_POINT_STORE = 'points',
    DB_PATH_STORE = 'paths',
    DB_STATE_STORE = 'state';
var DB_VERSION = 1; // Use a long long for this value (don't use a float)
//main DB object

var g_DB;

function OpenDb() {
  return _OpenDb.apply(this, arguments);
}
/**
  * @param {string} storeName is a store name
  * @param {string} mode either "readonly" or "readwrite"
  * @returns {object} store
  */


function _OpenDb() {
  _OpenDb = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14() {
    return regeneratorRuntime.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            console.log("OpenDb ...");
            return _context14.abrupt("return", new Promise(function (resolve, reject) {
              var req = indexedDB.open(DB_NAME, DB_VERSION);

              req.onsuccess = function () {
                // Equal to: db = req.result;
                g_DB = this.result; //TODO: stop clearing all the time store(s)
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
                var store_list = Array.from(evt.currentTarget.result.objectStoreNames);
                if (store_list.includes(DB_POINT_STORE)) evt.currentTarget.result.deleteObjectStore(DB_POINT_STORE);
                if (store_list.includes(DB_PATH_STORE)) evt.currentTarget.result.deleteObjectStore(DB_PATH_STORE);
                if (store_list.includes(DB_STATE_STORE)) evt.currentTarget.result.deleteObjectStore(DB_STATE_STORE);
                var point_store = evt.currentTarget.result.createObjectStore(DB_POINT_STORE, {
                  /*keyPath: 'pos',*/
                  autoIncrement: false
                });
                point_store.createIndex('Status', 'Status', {
                  unique: false
                });
                point_store.createIndex('Color', 'Color', {
                  unique: false
                });
                var path_store = evt.currentTarget.result.createObjectStore(DB_PATH_STORE, {
                  /*keyPath: 'iId',*/
                  autoIncrement: false
                });
                path_store.createIndex('iPlayerId', 'iPlayerId', {
                  unique: false
                });
                var state_store = evt.currentTarget.result.createObjectStore(DB_STATE_STORE, {
                  /*keyPath: 'gameId',*/
                  autoIncrement: false
                });
              };
            }));

          case 2:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14);
  }));
  return _OpenDb.apply(this, arguments);
}

function GetObjectStore(storeName, mode) {
  var tx = g_DB.transaction(storeName, mode);
  return tx.objectStore(storeName);
}

function ClearObjectStore(_x) {
  return _ClearObjectStore.apply(this, arguments);
}
/**
  * @param {number} key is calculated inxed of point y * width + x, probably not usefull
  */


function _ClearObjectStore() {
  _ClearObjectStore = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(storeName) {
    return regeneratorRuntime.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            return _context15.abrupt("return", new Promise(function (resolve, reject) {
              var store = GetObjectStore(storeName, 'readwrite');
              var req = store.clear();

              req.onsuccess = function () {
                //console.log("clearObjectStore: DONE");
                resolve();
              };

              req.onerror = function (evt) {
                console.error("clearObjectStore:", evt.target.errorCode);
                reject();
              };
            }));

          case 1:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15);
  }));
  return _ClearObjectStore.apply(this, arguments);
}

function GetPoint(_x2) {
  return _GetPoint.apply(this, arguments);
}

function _GetPoint() {
  _GetPoint = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16(key) {
    return regeneratorRuntime.wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            return _context16.abrupt("return", new Promise(function (resolve, reject) {
              var store = GetObjectStore(DB_POINT_STORE, 'readonly');
              var req = store.get(key);

              req.onerror = function (event) {
                reject(new Error('GetPoint => ' + event));
              };

              req.onsuccess = function (event) {
                resolve(event.target.result);
              };
            }));

          case 1:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16);
  }));
  return _GetPoint.apply(this, arguments);
}

function GetAllPoints() {
  return _GetAllPoints.apply(this, arguments);
}

function _GetAllPoints() {
  _GetAllPoints = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17() {
    return regeneratorRuntime.wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            return _context17.abrupt("return", new Promise(function (resolve, reject) {
              var store = GetObjectStore(DB_POINT_STORE, 'readonly');
              var req = store.getAll();

              req.onsuccess = function (evt) {
                //console.log("Got all customers: " + event.target.result);
                resolve(evt.target.result);
              };

              req.onerror = function (event) {
                reject(new Error('GetAllPoints => ' + event));
              };
            }));

          case 1:
          case "end":
            return _context17.stop();
        }
      }
    }, _callee17);
  }));
  return _GetAllPoints.apply(this, arguments);
}

function GetState(_x3) {
  return _GetState.apply(this, arguments);
}
/**
  * @param {number} key is path Id
  */


function _GetState() {
  _GetState = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18(key) {
    return regeneratorRuntime.wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            return _context18.abrupt("return", new Promise(function (resolve, reject) {
              var store = GetObjectStore(DB_STATE_STORE, 'readonly');
              var req = store.get(key);

              req.onerror = function (event) {
                reject(new Error('GetState => ' + event));
              };

              req.onsuccess = function (event) {
                resolve(event.target.result);
              };
            }));

          case 1:
          case "end":
            return _context18.stop();
        }
      }
    }, _callee18);
  }));
  return _GetState.apply(this, arguments);
}

function GetPath(_x4) {
  return _GetPath.apply(this, arguments);
}

function _GetPath() {
  _GetPath = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19(key) {
    return regeneratorRuntime.wrap(function _callee19$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            return _context19.abrupt("return", new Promise(function (resolve, reject) {
              var store = GetObjectStore(DB_PATH_STORE, 'readonly');
              var req = store.get(key);

              req.onerror = function (event) {
                reject(new Error('GetPath => ' + event));
              };

              req.onsuccess = function (event) {
                resolve(event.target.result);
              };
            }));

          case 1:
          case "end":
            return _context19.stop();
        }
      }
    }, _callee19);
  }));
  return _GetPath.apply(this, arguments);
}

function GetAllPaths() {
  return _GetAllPaths.apply(this, arguments);
}
/**
  * @param {number} key is calculated inxed of point y * width + x, probably not usefull
  * @param {object} oval is svg circle
  */


function _GetAllPaths() {
  _GetAllPaths = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee20() {
    return regeneratorRuntime.wrap(function _callee20$(_context20) {
      while (1) {
        switch (_context20.prev = _context20.next) {
          case 0:
            return _context20.abrupt("return", new Promise(function (resolve, reject) {
              var store = GetObjectStore(DB_PATH_STORE, 'readonly');
              var req = store.getAll();

              req.onsuccess = function (evt) {
                //console.log("Got all customers: " + event.target.result);
                resolve(evt.target.result);
              };

              req.onerror = function (event) {
                reject(new Error('GetAllPaths => ' + event));
              };
            }));

          case 1:
          case "end":
            return _context20.stop();
        }
      }
    }, _callee20);
  }));
  return _GetAllPaths.apply(this, arguments);
}

function StorePoint(_x5, _x6) {
  return _StorePoint.apply(this, arguments);
}
/**
  * @param {number} key is GameID
  * @param {object} game is InkBallGame object as state
  */


function _StorePoint() {
  _StorePoint = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee21(key, oval) {
    return regeneratorRuntime.wrap(function _callee21$(_context21) {
      while (1) {
        switch (_context21.prev = _context21.next) {
          case 0:
            return _context21.abrupt("return", new Promise(function (resolve, reject) {
              //console.log("addPublication arguments:", arguments);
              var pos = oval.$GetPosition();
              var color = oval.$GetFillColor();
              var obj = {
                x: pos.x / 16,
                y: pos.y / 16,
                Status: oval.$GetStatus(),
                Color: color //, pos: key, //`${pos.x}_${pos.y}`

              };
              var store = GetObjectStore(DB_POINT_STORE, 'readwrite');
              var req;

              try {
                req = store.add(obj, key);
              } catch (e) {
                if (e.name == 'DataCloneError') console.error("This engine doesn't know how to clone a Blob, use Firefox");
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
            }));

          case 1:
          case "end":
            return _context21.stop();
        }
      }
    }, _callee21);
  }));
  return _StorePoint.apply(this, arguments);
}

function StoreState(_x7, _x8) {
  return _StoreState.apply(this, arguments);
}
/**
  * @param {number} key is path Id
  * @param {object} path is svg polyline
  */


function _StoreState() {
  _StoreState = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee22(key, game) {
    return regeneratorRuntime.wrap(function _callee22$(_context22) {
      while (1) {
        switch (_context22.prev = _context22.next) {
          case 0:
            return _context22.abrupt("return", new Promise(function (resolve, reject) {
              var state = {
                iGameID: game.g_iGameID,
                iPlayerID: game.g_iPlayerID,
                iOtherPlayerId: game.m_iOtherPlayerId,
                sLastMoveGameTimeStamp: game.m_sLastMoveGameTimeStamp
              };
              var store = GetObjectStore(DB_STATE_STORE, 'readwrite');
              var req;

              try {
                req = store.add(state, key);
              } catch (e) {
                if (e.name == 'DataCloneError') console.error("This engine doesn't know how to clone a Blob, use Firefox");
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
            }));

          case 1:
          case "end":
            return _context22.stop();
        }
      }
    }, _callee22);
  }));
  return _StoreState.apply(this, arguments);
}

function StorePath(_x9, _x10) {
  return _StorePath.apply(this, arguments);
}
/**
 * @param {string} pos is position X_Y of circle/oval
 */


function _StorePath() {
  _StorePath = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee23(key, path) {
    return regeneratorRuntime.wrap(function _callee23$(_context23) {
      while (1) {
        switch (_context23.prev = _context23.next) {
          case 0:
            return _context23.abrupt("return", new Promise(function (resolve, reject) {
              //console.log("addPublication arguments:", arguments);
              var iId = key;
              var Color = path.$GetFillColor();
              var PointsAsString = path.$GetPointsString();
              var obj = {
                //iId: iId,
                Color: Color,
                PointsAsString: PointsAsString
              };
              var store = GetObjectStore(DB_PATH_STORE, 'readwrite');
              var req;

              try {
                req = store.add(obj, key);
              } catch (e) {
                if (e.name == 'DataCloneError') console.error("This engine doesn't know how to clone a Blob, use Firefox");
                throw e;
              }

              req.onsuccess = function () {
                resolve();
              };

              req.onerror = function () {
                console.error("StorePath error", this.error);
                reject();
              };
            }));

          case 1:
          case "end":
            return _context23.stop();
        }
      }
    }, _callee23);
  }));
  return _StorePath.apply(this, arguments);
}

function DeletePublicationFromBib(pos) {
  console.log("deletePublicationFromBib:", arguments);
  var store = GetObjectStore(DB_POINT_STORE, 'readwrite');
  var req = store.index('pos');

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
  if (typeof store == 'undefined') store = GetObjectStore(DB_POINT_STORE, 'readwrite'); // As per spec http://www.w3.org/TR/IndexedDB/#object-store-deletion-operation
  // the result of the Object Store Deletion Operation algorithm is
  // undefined, so it's not possible to know if some records were actually
  // deleted by looking at the request result.

  var req = store.get(key);

  req.onsuccess = function (evt) {
    var record = evt.target.result;
    console.log("record:", record);

    if (typeof record == 'undefined') {
      console.error("No matching record found");
      return;
    } // Warning: The exact same key used for creation needs to be passed for
    // the deletion. If the key was a Number for creation, then it needs to
    // be a Number for deletion.


    req = store["delete"](key);

    req.onsuccess = function (evt) {
      console.log("evt:", evt);
      console.log("evt.target:", evt.target);
      console.log("evt.target.result:", evt.target.result);
      console.log("delete successful");
      console.log("Deletion successful"); //displayPubList(store);
    };

    req.onerror = function (evt) {
      console.error("deletePublication:", evt.target.errorCode);
    };
  };

  req.onerror = function (evt) {
    console.error("deletePublication:", evt.target.errorCode);
  };
}

var SimplePointStore = /*#__PURE__*/function () {
  function SimplePointStore() {
    _classCallCheck(this, SimplePointStore);
  }

  _createClass(SimplePointStore, [{
    key: "PrepareStore",
    value: function () {
      var _PrepareStore = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.store = new Map();

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function PrepareStore() {
        return _PrepareStore.apply(this, arguments);
      }

      return PrepareStore;
    }()
  }, {
    key: "has",
    value: function () {
      var _has = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(key) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", this.store.has(key));

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function has(_x11) {
        return _has.apply(this, arguments);
      }

      return has;
    }()
  }, {
    key: "set",
    value: function () {
      var _set = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(key, val) {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                return _context3.abrupt("return", this.store.set(key, val));

              case 1:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function set(_x12, _x13) {
        return _set.apply(this, arguments);
      }

      return set;
    }()
  }, {
    key: "get",
    value: function () {
      var _get = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(key) {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                return _context4.abrupt("return", this.store.get(key));

              case 1:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function get(_x14) {
        return _get.apply(this, arguments);
      }

      return get;
    }()
  }, {
    key: "values",
    value: function () {
      var _values = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                return _context5.abrupt("return", this.store.values());

              case 1:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function values() {
        return _values.apply(this, arguments);
      }

      return values;
    }()
  }]);

  return SimplePointStore;
}();

var IDBPointStore = /*#__PURE__*/function (_SimplePointStore) {
  _inherits(IDBPointStore, _SimplePointStore);

  var _super = _createSuper(IDBPointStore);

  function IDBPointStore() {
    _classCallCheck(this, IDBPointStore);

    return _super.call(this);
  }

  _createClass(IDBPointStore, [{
    key: "PrepareStore",
    value: function () {
      var _PrepareStore2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(game) {
        var state, points, _iterator, _step, idb_pt, pt;

        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (g_DB) {
                  _context6.next = 3;
                  break;
                }

                _context6.next = 3;
                return OpenDb();

              case 3:
                if (game.CreateScreenPointFromIndexedDb) this.PointCreationCallback = game.CreateScreenPointFromIndexedDb.bind(game);
                _context6.next = 6;
                return GetState(game.g_iGameID);

              case 6:
                state = _context6.sent;

                if (state) {
                  _context6.next = 18;
                  break;
                }

                _context6.next = 10;
                return ClearObjectStore(DB_POINT_STORE);

              case 10:
                _context6.next = 12;
                return ClearObjectStore(DB_PATH_STORE);

              case 12:
                _context6.next = 14;
                return ClearObjectStore(DB_STATE_STORE);

              case 14:
                _context6.next = 16;
                return StoreState(game.g_iGameID, game);

              case 16:
                _context6.next = 34;
                break;

              case 18:
                if (!(state.sLastMoveGameTimeStamp !== game.m_sLastMoveGameTimeStamp)) {
                  _context6.next = 27;
                  break;
                }

                _context6.next = 21;
                return ClearObjectStore(DB_POINT_STORE);

              case 21:
                _context6.next = 23;
                return ClearObjectStore(DB_PATH_STORE);

              case 23:
                _context6.next = 25;
                return ClearObjectStore(DB_STATE_STORE);

              case 25:
                _context6.next = 34;
                break;

              case 27:
                game.m_bPointsAndPathsLoaded = true;

                if (!this.PointCreationCallback) {
                  _context6.next = 34;
                  break;
                }

                _context6.next = 31;
                return this.values();

              case 31:
                points = _context6.sent;
                //loading points from indexeddb
                _iterator = _createForOfIteratorHelper(points);

                try {
                  for (_iterator.s(); !(_step = _iterator.n()).done;) {
                    idb_pt = _step.value;
                    pt = this.PointCreationCallback(idb_pt.x, idb_pt.y, idb_pt.Status, idb_pt.Color); //return pt;
                  }
                } catch (err) {
                  _iterator.e(err);
                } finally {
                  _iterator.f();
                }

              case 34:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function PrepareStore(_x15) {
        return _PrepareStore2.apply(this, arguments);
      }

      return PrepareStore;
    }()
  }, {
    key: "has",
    value: function () {
      var _has2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(key) {
        var pt;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return GetPoint(key);

              case 2:
                pt = _context7.sent;
                return _context7.abrupt("return", pt !== undefined && pt !== null);

              case 4:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7);
      }));

      function has(_x16) {
        return _has2.apply(this, arguments);
      }

      return has;
    }()
  }, {
    key: "set",
    value: function () {
      var _set2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(key, val) {
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return StorePoint(key, val);

              case 2:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8);
      }));

      function set(_x17, _x18) {
        return _set2.apply(this, arguments);
      }

      return set;
    }()
  }, {
    key: "get",
    value: function () {
      var _get2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(key) {
        var idb_pt, pt;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.next = 2;
                return GetPoint(key);

              case 2:
                idb_pt = _context9.sent;

                if (!(idb_pt && this.PointCreationCallback)) {
                  _context9.next = 8;
                  break;
                }

                pt = this.PointCreationCallback(idb_pt.x, idb_pt.y, idb_pt.Status, idb_pt.Color);
                return _context9.abrupt("return", pt);

              case 8:
                return _context9.abrupt("return", null);

              case 9:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function get(_x19) {
        return _get2.apply(this, arguments);
      }

      return get;
    }()
  }, {
    key: "values",
    value: function () {
      var _values2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
        var values;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.next = 2;
                return GetAllPoints();

              case 2:
                values = _context10.sent;
                return _context10.abrupt("return", values);

              case 4:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10);
      }));

      function values() {
        return _values2.apply(this, arguments);
      }

      return values;
    }()
  }]);

  return IDBPointStore;
}(SimplePointStore);

var SimplePathStore = /*#__PURE__*/function () {
  function SimplePathStore() {
    _classCallCheck(this, SimplePathStore);

    this.store = [];
  }

  _createClass(SimplePathStore, [{
    key: "push",
    value: function push(obj) {
      return this.store.push(obj);
    }
  }, {
    key: "all",
    value: function all() {
      return this.store;
    }
  }]);

  return SimplePathStore;
}();

var IDBPathStore = /*#__PURE__*/function (_SimplePathStore) {
  _inherits(IDBPathStore, _SimplePathStore);

  var _super2 = _createSuper(IDBPathStore);

  function IDBPathStore() {
    _classCallCheck(this, IDBPathStore);

    return _super2.call(this);
  }

  _createClass(IDBPathStore, [{
    key: "PrepareStore",
    value: function () {
      var _PrepareStore3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(game) {
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                //if (!g_DB)
                //	await OpenDb();
                if (game.CreateScreenPathFromIndexedDb) this.PathCreationCallback = game.CreateScreenPathFromIndexedDb.bind(game);

              case 1:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function PrepareStore(_x20) {
        return _PrepareStore3.apply(this, arguments);
      }

      return PrepareStore;
    }()
  }, {
    key: "push",
    value: function () {
      var _push = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(val) {
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                _context12.next = 2;
                return StorePath(val.$GetID(), val);

              case 2:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12);
      }));

      function push(_x21) {
        return _push.apply(this, arguments);
      }

      return push;
    }()
  }, {
    key: "all",
    value: function () {
      var _all = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13() {
        var values;
        return regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                _context13.next = 2;
                return GetAllPaths();

              case 2:
                values = _context13.sent;
                return _context13.abrupt("return", values);

              case 4:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13);
      }));

      function all() {
        return _all.apply(this, arguments);
      }

      return all;
    }()
  }]);

  return IDBPathStore;
}(SimplePathStore); //TODO: check compat and create plain store abstraction when indexeddb not supported


if (!('indexedDB' in window)) {
  console.log("This browser doesn't support IndexedDB");
  PointStore = SimplePointStore;
  PathStore = SimplePathStore;
} else {
  PointStore = IDBPointStore;
  PathStore = IDBPathStore;
} //////////IndexedDB points and path stores end//////////




/***/ })

}]);