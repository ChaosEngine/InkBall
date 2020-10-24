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
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GameStateStore", function() { return GameStateStore; });
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


function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function (_e) { function e(_x25) { return _e.apply(this, arguments); } e.toString = function () { return _e.toString(); }; return e; }(function (e) { throw e; }), f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function (_e2) { function e(_x26) { return _e2.apply(this, arguments); } e.toString = function () { return _e2.toString(); }; return e; }(function (e) { didErr = true; err = e; }), f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var SVG = false;
var svgNS = "http://www.w3.org/2000/svg";
var svgAntialias = false,
    cont = null;
var $createOval, $createPolyline, $RemovePolyline, $RemoveOval, $createSVGVML, $createLine;

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

    if (iWidth) cont.setAttributeNS(null, 'width', iWidth);
    if (iHeight) cont.setAttributeNS(null, 'height', iHeight); //ch_added end

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

    o.$AppendPoints = function (x, y, diffX, diffY) {
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

      if (!(Math.abs(last_x - x_diff) <= diffX && Math.abs(last_y - y_diff) <= diffY)) {
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

} else {
  /* ==== no script ==== */
  $createSVGVML = function $createSVGVML() {
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


var GameStateStore = /*#__PURE__*/function () {
  function GameStateStore(pointCreationCallbackFn, pathCreationCallbackFn, getGameStateFn) {
    _classCallCheck(this, GameStateStore);

    this.DB_NAME = 'InkballGame';
    this.DB_POINT_STORE = 'points';
    this.DB_PATH_STORE = 'paths';
    this.DB_STATE_STORE = 'state';
    this.DB_VERSION = 2; // Use a long long for this value (don't use a float)

    this.g_DB; //main DB object
    //TODO: check compat and create plain store abstraction when indexeddb not supported

    if (!('indexedDB' in window)) {
      console.log("This browser doesn't support IndexedDB");
      this.PointStore = new SimplePointStore();
      this.PathStore = new SimplePathStore();
    } else {
      this.PointStore = new IDBPointStore(this.GetPoint.bind(this), this.StorePoint.bind(this), this.GetAllPoints.bind(this), this.UpdateState.bind(this), pointCreationCallbackFn, getGameStateFn, this);
      this.PathStore = new IDBPathStore(this.GetAllPaths.bind(this), this.StorePath.bind(this), this.UpdateState.bind(this), pathCreationCallbackFn, getGameStateFn, this); //this.PointStore = new SimplePointStore();
      //this.PathStore = new SimplePathStore();
    }
  }

  _createClass(GameStateStore, [{
    key: "GetPointStore",
    value: function GetPointStore() {
      return this.PointStore;
    }
  }, {
    key: "GetPathStore",
    value: function GetPathStore() {
      return this.PathStore;
    }
  }, {
    key: "OpenDb",
    value: function () {
      var _OpenDb = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var _this = this;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                console.log("OpenDb ...");
                return _context.abrupt("return", new Promise(function (resolve, reject) {
                  var req = indexedDB.open(_this.DB_NAME, _this.DB_VERSION);

                  req.onsuccess = function (evt) {
                    // Equal to: db = req.result;
                    this.g_DB = evt.currentTarget.result;
                    console.log("OpenDb DONE");
                    resolve(evt.currentTarget.result);
                  }.bind(_this);

                  req.onerror = function (evt) {
                    console.error("OpenDb:", evt.target.errorCode);
                    reject();
                  };

                  req.onupgradeneeded = function (evt) {
                    console.log("OpenDb.onupgradeneeded");
                    var store_list = Array.from(evt.currentTarget.result.objectStoreNames);
                    if (store_list.includes(this.DB_POINT_STORE)) evt.currentTarget.result.deleteObjectStore(this.DB_POINT_STORE);
                    if (store_list.includes(this.DB_PATH_STORE)) evt.currentTarget.result.deleteObjectStore(this.DB_PATH_STORE);
                    if (store_list.includes(this.DB_STATE_STORE)) evt.currentTarget.result.deleteObjectStore(this.DB_STATE_STORE);
                    var point_store = evt.currentTarget.result.createObjectStore(this.DB_POINT_STORE, {
                      /*keyPath: 'pos',*/
                      autoIncrement: false
                    }); //point_store.createIndex('Status', 'Status', { unique: false });
                    //point_store.createIndex('Color', 'Color', { unique: false });

                    var path_store = evt.currentTarget.result.createObjectStore(this.DB_PATH_STORE, {
                      /*keyPath: 'iId',*/
                      autoIncrement: false
                    }); //path_store.createIndex('Color', 'Color', { unique: false });

                    var state_store = evt.currentTarget.result.createObjectStore(this.DB_STATE_STORE, {
                      /*keyPath: 'gameId',*/
                      autoIncrement: false
                    });
                  }.bind(_this);
                }));

              case 2:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function OpenDb() {
        return _OpenDb.apply(this, arguments);
      }

      return OpenDb;
    }()
    /**
      * @param {string} storeName is a store name
      * @param {string} mode either "readonly" or "readwrite"
      * @returns {object} store
      */

  }, {
    key: "GetObjectStore",
    value: function GetObjectStore(storeName, mode) {
      if (this.bulkStores && this.bulkStores.has(storeName)) return this.bulkStores.get(storeName);
      var tx = this.g_DB.transaction(storeName, mode);
      return tx.objectStore(storeName);
    }
  }, {
    key: "ClearObjectStore",
    value: function () {
      var _ClearObjectStore = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(storeName) {
        var _this2 = this;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", new Promise(function (resolve, reject) {
                  var store = _this2.GetObjectStore(storeName, 'readwrite');

                  var req = store.clear();

                  req.onsuccess = function () {
                    resolve();
                  };

                  req.onerror = function (evt) {
                    console.error("clearObjectStore:", evt.target.errorCode);
                    reject();
                  };
                }));

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function ClearObjectStore(_x) {
        return _ClearObjectStore.apply(this, arguments);
      }

      return ClearObjectStore;
    }()
    /**
      * @param {number} key is calculated inxed of point y * width + x, probably not usefull
      */

  }, {
    key: "GetPoint",
    value: function () {
      var _GetPoint = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(key) {
        var _this3 = this;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                return _context3.abrupt("return", new Promise(function (resolve, reject) {
                  var store = _this3.GetObjectStore(_this3.DB_POINT_STORE, 'readonly');

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
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function GetPoint(_x2) {
        return _GetPoint.apply(this, arguments);
      }

      return GetPoint;
    }()
  }, {
    key: "GetAllPoints",
    value: function () {
      var _GetAllPoints = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var _this4 = this;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                return _context4.abrupt("return", new Promise(function (resolve, reject) {
                  var store = _this4.GetObjectStore(_this4.DB_POINT_STORE, 'readonly');

                  var bucket = [];
                  var req = store.openCursor();

                  req.onsuccess = function (event) {
                    var cursor = event.target.result;

                    if (cursor) {
                      bucket.push(cursor.value);
                      cursor["continue"]();
                    } else resolve(bucket);
                  };

                  req.onerror = function (event) {
                    reject(new Error('GetAllPoints => ' + event));
                  };
                }));

              case 1:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function GetAllPoints() {
        return _GetAllPoints.apply(this, arguments);
      }

      return GetAllPoints;
    }()
  }, {
    key: "GetState",
    value: function () {
      var _GetState = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(key) {
        var _this5 = this;

        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                return _context5.abrupt("return", new Promise(function (resolve, reject) {
                  var store = _this5.GetObjectStore(_this5.DB_STATE_STORE, 'readonly');

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
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      function GetState(_x3) {
        return _GetState.apply(this, arguments);
      }

      return GetState;
    }()
    /**
      * @param {number} key is path Id
      */

  }, {
    key: "GetPath",
    value: function () {
      var _GetPath = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(key) {
        var _this6 = this;

        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                return _context6.abrupt("return", new Promise(function (resolve, reject) {
                  var store = _this6.GetObjectStore(_this6.DB_PATH_STORE, 'readonly');

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
                return _context6.stop();
            }
          }
        }, _callee6);
      }));

      function GetPath(_x4) {
        return _GetPath.apply(this, arguments);
      }

      return GetPath;
    }()
  }, {
    key: "GetAllPaths",
    value: function () {
      var _GetAllPaths = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
        var _this7 = this;

        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                return _context7.abrupt("return", new Promise(function (resolve, reject) {
                  var store = _this7.GetObjectStore(_this7.DB_PATH_STORE, 'readonly');

                  var bucket = [];
                  var req = store.openCursor();

                  req.onsuccess = function (event) {
                    var cursor = event.target.result;

                    if (cursor) {
                      bucket.push(cursor.value);
                      cursor["continue"]();
                    } else resolve(bucket);
                  };

                  req.onerror = function (event) {
                    reject(new Error('GetAllPaths => ' + event));
                  };
                }));

              case 1:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7);
      }));

      function GetAllPaths() {
        return _GetAllPaths.apply(this, arguments);
      }

      return GetAllPaths;
    }()
    /**
      * @param {number} key is calculated inxed of point y * width + x, probably not usefull
      * @param {object} val is serialized, thin circle
      */

  }, {
    key: "StorePoint",
    value: function () {
      var _StorePoint = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(key, val) {
        var _this8 = this;

        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                if (!(this.bulkStores && this.bulkStores.has(this.DB_POINT_STORE))) {
                  _context8.next = 4;
                  break;
                }

                if (!this.bulkBuffer) this.bulkBuffer = new Map();
                this.bulkBuffer.set(key, val);
                return _context8.abrupt("return", Promise.resolve());

              case 4:
                return _context8.abrupt("return", new Promise(function (resolve, reject) {
                  var store = _this8.GetObjectStore(_this8.DB_POINT_STORE, 'readwrite');

                  var req;

                  try {
                    req = store.add(val, key);
                  } catch (e) {
                    if (e.name === 'DataCloneError') console.error("This engine doesn't know how to clone a Blob, use Firefox");
                    throw e;
                  }

                  req.onsuccess = function () {
                    resolve();
                  };

                  req.onerror = function () {
                    console.error("StorePoint error", this.error);
                    reject();
                  };
                }));

              case 5:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function StorePoint(_x5, _x6) {
        return _StorePoint.apply(this, arguments);
      }

      return StorePoint;
    }()
  }, {
    key: "StoreAllPoints",
    value: function () {
      var _StoreAllPoints = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(values) {
        var _this9 = this;

        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                if (!values) values = this.bulkBuffer;

                if (!(!values || !this.bulkStores)) {
                  _context9.next = 3;
                  break;
                }

                return _context9.abrupt("return", Promise.reject());

              case 3:
                return _context9.abrupt("return", new Promise(function (resolve, reject) {
                  var store = _this9.GetObjectStore(_this9.DB_POINT_STORE, 'readwrite');

                  try {
                    values.forEach(function (v, key) {
                      store.add(v, key);
                    });
                    _this9.bulkBuffer = null;
                    resolve();
                  } catch (e) {
                    console.error("This engine doesn't know how to clone a Blob, use Firefox");
                    reject(e);
                  }
                }));

              case 4:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function StoreAllPoints(_x7) {
        return _StoreAllPoints.apply(this, arguments);
      }

      return StoreAllPoints;
    }()
    /**
      * @param {number} key is GameID
      * @param {object} gameState is InkBallGame state object
      */

  }, {
    key: "StoreState",
    value: function () {
      var _StoreState = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(key, gameState) {
        var _this10 = this;

        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                return _context10.abrupt("return", new Promise(function (resolve, reject) {
                  var store = _this10.GetObjectStore(_this10.DB_STATE_STORE, 'readwrite');

                  var req;

                  try {
                    req = store.add(gameState, key);
                  } catch (e) {
                    if (e.name === 'DataCloneError') console.error("This engine doesn't know how to clone a Blob, use Firefox");
                    throw e;
                  }

                  req.onsuccess = function () {
                    resolve();
                  };

                  req.onerror = function () {
                    console.error("StoreState error", this.error);
                    reject();
                  };
                }));

              case 1:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10);
      }));

      function StoreState(_x8, _x9) {
        return _StoreState.apply(this, arguments);
      }

      return StoreState;
    }()
  }, {
    key: "UpdateState",
    value: function () {
      var _UpdateState = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(key, gameState) {
        var _this11 = this;

        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                return _context11.abrupt("return", new Promise(function (resolve, reject) {
                  var store = _this11.GetObjectStore(_this11.DB_STATE_STORE, 'readwrite');

                  var req;

                  try {
                    req = store.put(gameState, key);
                  } catch (e) {
                    if (e.name === 'DataCloneError') console.error("This engine doesn't know how to clone a Blob, use Firefox");
                    throw e;
                  }

                  req.onsuccess = function () {
                    resolve();
                  };

                  req.onerror = function () {
                    console.error("UpdateState error", this.error);
                    reject();
                  };
                }));

              case 1:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11);
      }));

      function UpdateState(_x10, _x11) {
        return _UpdateState.apply(this, arguments);
      }

      return UpdateState;
    }()
    /**
      * @param {number} key is path Id
      * @param {object} val is serialized thin path
      */

  }, {
    key: "StorePath",
    value: function () {
      var _StorePath = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(key, val) {
        var _this12 = this;

        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                return _context12.abrupt("return", new Promise(function (resolve, reject) {
                  var store = _this12.GetObjectStore(_this12.DB_PATH_STORE, 'readwrite');

                  var req;

                  try {
                    req = store.add(val, key);
                  } catch (e) {
                    if (e.name === 'DataCloneError') console.error("This engine doesn't know how to clone a Blob, use Firefox");
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
                return _context12.stop();
            }
          }
        }, _callee12);
      }));

      function StorePath(_x12, _x13) {
        return _StorePath.apply(this, arguments);
      }

      return StorePath;
    }()
  }, {
    key: "PrepareStore",
    value: function () {
      var _PrepareStore = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13() {
        var game_state, idb_state;
        return regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                if (this.PointStore.GetAllPoints) {
                  _context13.next = 2;
                  break;
                }

                return _context13.abrupt("return", false);

              case 2:
                if (this.g_DB) {
                  _context13.next = 7;
                  break;
                }

                _context13.next = 5;
                return this.OpenDb();

              case 5:
                _context13.next = 8;
                break;

              case 7:
                return _context13.abrupt("return", false);

              case 8:
                //all initiated, just exit
                game_state = this.PointStore.GetGameStateCallback();
                _context13.next = 11;
                return this.GetState(game_state.iGameID);

              case 11:
                idb_state = _context13.sent;

                if (idb_state) {
                  _context13.next = 20;
                  break;
                }

                _context13.next = 15;
                return Promise.all([this.ClearObjectStore(this.DB_POINT_STORE), this.ClearObjectStore(this.DB_PATH_STORE), this.ClearObjectStore(this.DB_STATE_STORE)]);

              case 15:
                _context13.next = 17;
                return this.StoreState(game_state.iGameID, game_state);

              case 17:
                return _context13.abrupt("return", false);

              case 20:
                if (!(idb_state.sLastMoveGameTimeStamp !== game_state.sLastMoveGameTimeStamp)) {
                  _context13.next = 26;
                  break;
                }

                _context13.next = 23;
                return Promise.all([this.ClearObjectStore(this.DB_POINT_STORE), this.ClearObjectStore(this.DB_PATH_STORE), this.ClearObjectStore(this.DB_STATE_STORE)]);

              case 23:
                return _context13.abrupt("return", false);

              case 26:
                if (!(game_state.bPointsAndPathsLoaded === false)) {
                  _context13.next = 48;
                  break;
                }

                _context13.prev = 27;
                _context13.next = 30;
                return this.BeginBulkStorage([this.DB_POINT_STORE, this.DB_PATH_STORE], 'readonly');

              case 30:
                _context13.next = 32;
                return this.PointStore.PrepareStore();

              case 32:
                _context13.t1 = _context13.sent;
                _context13.t0 = _context13.t1 !== true;

                if (_context13.t0) {
                  _context13.next = 39;
                  break;
                }

                _context13.next = 37;
                return this.PathStore.PrepareStore();

              case 37:
                _context13.t2 = _context13.sent;
                _context13.t0 = _context13.t2 !== true;

              case 39:
                if (!_context13.t0) {
                  _context13.next = 43;
                  break;
                }

                _context13.next = 42;
                return Promise.all([this.ClearObjectStore(this.DB_POINT_STORE), this.ClearObjectStore(this.DB_PATH_STORE), this.ClearObjectStore(this.DB_STATE_STORE)]);

              case 42:
                return _context13.abrupt("return", false);

              case 43:
                return _context13.abrupt("return", true);

              case 44:
                _context13.prev = 44;
                _context13.next = 47;
                return this.EndBulkStorage([this.DB_POINT_STORE, this.DB_PATH_STORE]);

              case 47:
                return _context13.finish(44);

              case 48:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, this, [[27,, 44, 48]]);
      }));

      function PrepareStore() {
        return _PrepareStore.apply(this, arguments);
      }

      return PrepareStore;
    }()
  }, {
    key: "BeginBulkStorage",
    value: function () {
      var _BeginBulkStorage = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(storeName, mode) {
        var key, tx;
        return regeneratorRuntime.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                if (!this.bulkStores) this.bulkStores = new Map();
                key = storeName;

                if (!this.bulkStores.has(key)) {
                  tx = this.g_DB.transaction(storeName, mode);

                  if (Array.isArray(storeName)) {
                    this.bulkStores.set(key[0], tx.objectStore(storeName[0]));
                    this.bulkStores.set(key[1], tx.objectStore(storeName[1]));
                  } else this.bulkStores.set(key, tx.objectStore(storeName));
                }

              case 3:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14, this);
      }));

      function BeginBulkStorage(_x14, _x15) {
        return _BeginBulkStorage.apply(this, arguments);
      }

      return BeginBulkStorage;
    }()
  }, {
    key: "EndBulkStorage",
    value: function () {
      var _EndBulkStorage = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(storeName) {
        return regeneratorRuntime.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                if (this.bulkStores) {
                  if (Array.isArray(storeName)) {
                    this.bulkStores["delete"](storeName[0]);
                    this.bulkStores["delete"](storeName[1]);
                  } else this.bulkStores["delete"](storeName);

                  if (this.bulkStores.size <= 0) this.bulkStores = null;
                }

              case 1:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15, this);
      }));

      function EndBulkStorage(_x16) {
        return _EndBulkStorage.apply(this, arguments);
      }

      return EndBulkStorage;
    }()
  }]);

  return GameStateStore;
}();

var SimplePointStore = /*#__PURE__*/function () {
  function SimplePointStore() {
    _classCallCheck(this, SimplePointStore);

    this.store = new Map();
  }

  _createClass(SimplePointStore, [{
    key: "PrepareStore",
    value: function () {
      var _PrepareStore2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16() {
        return regeneratorRuntime.wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                return _context16.abrupt("return", true);

              case 1:
              case "end":
                return _context16.stop();
            }
          }
        }, _callee16);
      }));

      function PrepareStore() {
        return _PrepareStore2.apply(this, arguments);
      }

      return PrepareStore;
    }()
  }, {
    key: "BeginBulkStorage",
    value: function () {
      var _BeginBulkStorage2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17() {
        return regeneratorRuntime.wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
              case "end":
                return _context17.stop();
            }
          }
        }, _callee17);
      }));

      function BeginBulkStorage() {
        return _BeginBulkStorage2.apply(this, arguments);
      }

      return BeginBulkStorage;
    }()
  }, {
    key: "EndBulkStorage",
    value: function () {
      var _EndBulkStorage2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18() {
        return regeneratorRuntime.wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
              case "end":
                return _context18.stop();
            }
          }
        }, _callee18);
      }));

      function EndBulkStorage() {
        return _EndBulkStorage2.apply(this, arguments);
      }

      return EndBulkStorage;
    }()
  }, {
    key: "has",
    value: function () {
      var _has = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19(key) {
        return regeneratorRuntime.wrap(function _callee19$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                return _context19.abrupt("return", this.store.has(key));

              case 1:
              case "end":
                return _context19.stop();
            }
          }
        }, _callee19, this);
      }));

      function has(_x17) {
        return _has.apply(this, arguments);
      }

      return has;
    }()
  }, {
    key: "set",
    value: function () {
      var _set = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee20(key, val) {
        return regeneratorRuntime.wrap(function _callee20$(_context20) {
          while (1) {
            switch (_context20.prev = _context20.next) {
              case 0:
                return _context20.abrupt("return", this.store.set(key, val));

              case 1:
              case "end":
                return _context20.stop();
            }
          }
        }, _callee20, this);
      }));

      function set(_x18, _x19) {
        return _set.apply(this, arguments);
      }

      return set;
    }()
  }, {
    key: "get",
    value: function () {
      var _get = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee21(key) {
        return regeneratorRuntime.wrap(function _callee21$(_context21) {
          while (1) {
            switch (_context21.prev = _context21.next) {
              case 0:
                return _context21.abrupt("return", this.store.get(key));

              case 1:
              case "end":
                return _context21.stop();
            }
          }
        }, _callee21, this);
      }));

      function get(_x20) {
        return _get.apply(this, arguments);
      }

      return get;
    }()
  }, {
    key: "values",
    value: function () {
      var _values = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee22() {
        return regeneratorRuntime.wrap(function _callee22$(_context22) {
          while (1) {
            switch (_context22.prev = _context22.next) {
              case 0:
                return _context22.abrupt("return", this.store.values());

              case 1:
              case "end":
                return _context22.stop();
            }
          }
        }, _callee22, this);
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

  function IDBPointStore(getPointFn, storePointFn, getAllPointsFn, updateStateFn, pointCreationCallbackFn, getGameStateFn, mainGameStateStore) {
    var _this13;

    _classCallCheck(this, IDBPointStore);

    _this13 = _super.call(this);
    _this13.GetPoint = getPointFn;
    _this13.StorePoint = storePointFn;
    _this13.GetAllPoints = getAllPointsFn;
    _this13.UpdateState = updateStateFn;
    _this13.PointCreationCallback = pointCreationCallbackFn;
    _this13.GetGameStateCallback = getGameStateFn;
    _this13.MainGameStateStore = mainGameStateStore;
    return _this13;
  }

  _createClass(IDBPointStore, [{
    key: "PrepareStore",
    value: function () {
      var _PrepareStore3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee23() {
        var points, game_state, _iterator, _step, idb_pt, pt, index;

        return regeneratorRuntime.wrap(function _callee23$(_context23) {
          while (1) {
            switch (_context23.prev = _context23.next) {
              case 0:
                if (!(this.PointCreationCallback && this.GetGameStateCallback)) {
                  _context23.next = 26;
                  break;
                }

                _context23.next = 3;
                return this.GetAllPoints();

              case 3:
                points = _context23.sent;
                game_state = this.GetGameStateCallback(); //loading points from indexeddb

                _iterator = _createForOfIteratorHelper(points);
                _context23.prev = 6;

                _iterator.s();

              case 8:
                if ((_step = _iterator.n()).done) {
                  _context23.next = 17;
                  break;
                }

                idb_pt = _step.value;
                _context23.next = 12;
                return this.PointCreationCallback(idb_pt.x, idb_pt.y, idb_pt.Status, idb_pt.Color);

              case 12:
                pt = _context23.sent;
                index = idb_pt.y * game_state.iGridWidth + idb_pt.x;
                this.store.set(index, pt);

              case 15:
                _context23.next = 8;
                break;

              case 17:
                _context23.next = 22;
                break;

              case 19:
                _context23.prev = 19;
                _context23.t0 = _context23["catch"](6);

                _iterator.e(_context23.t0);

              case 22:
                _context23.prev = 22;

                _iterator.f();

                return _context23.finish(22);

              case 25:
                return _context23.abrupt("return", true);

              case 26:
              case "end":
                return _context23.stop();
            }
          }
        }, _callee23, this, [[6, 19, 22, 25]]);
      }));

      function PrepareStore() {
        return _PrepareStore3.apply(this, arguments);
      }

      return PrepareStore;
    }()
  }, {
    key: "BeginBulkStorage",
    value: function () {
      var _BeginBulkStorage3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee24() {
        return regeneratorRuntime.wrap(function _callee24$(_context24) {
          while (1) {
            switch (_context24.prev = _context24.next) {
              case 0:
                _context24.next = 2;
                return this.MainGameStateStore.BeginBulkStorage(this.MainGameStateStore.DB_POINT_STORE, 'readwrite');

              case 2:
              case "end":
                return _context24.stop();
            }
          }
        }, _callee24, this);
      }));

      function BeginBulkStorage() {
        return _BeginBulkStorage3.apply(this, arguments);
      }

      return BeginBulkStorage;
    }()
  }, {
    key: "EndBulkStorage",
    value: function () {
      var _EndBulkStorage3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee25() {
        return regeneratorRuntime.wrap(function _callee25$(_context25) {
          while (1) {
            switch (_context25.prev = _context25.next) {
              case 0:
                _context25.next = 2;
                return this.MainGameStateStore.StoreAllPoints();

              case 2:
                _context25.next = 4;
                return this.MainGameStateStore.EndBulkStorage(this.MainGameStateStore.DB_POINT_STORE);

              case 4:
              case "end":
                return _context25.stop();
            }
          }
        }, _callee25, this);
      }));

      function EndBulkStorage() {
        return _EndBulkStorage3.apply(this, arguments);
      }

      return EndBulkStorage;
    }()
  }, {
    key: "has",
    value: function () {
      var _has2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee26(key) {
        return regeneratorRuntime.wrap(function _callee26$(_context26) {
          while (1) {
            switch (_context26.prev = _context26.next) {
              case 0:
                return _context26.abrupt("return", this.store.has(key));

              case 1:
              case "end":
                return _context26.stop();
            }
          }
        }, _callee26, this);
      }));

      function has(_x21) {
        return _has2.apply(this, arguments);
      }

      return has;
    }()
  }, {
    key: "set",
    value: function () {
      var _set2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee27(key, oval) {
        var game_state, pos, color, idb_pt;
        return regeneratorRuntime.wrap(function _callee27$(_context27) {
          while (1) {
            switch (_context27.prev = _context27.next) {
              case 0:
                game_state = this.GetGameStateCallback();
                pos = oval.$GetPosition();
                color = oval.$GetFillColor();
                idb_pt = {
                  x: parseInt(pos.x) / game_state.iGridSizeX,
                  y: parseInt(pos.y) / game_state.iGridSizeY,
                  Status: oval.$GetStatus(),
                  Color: color //, pos: key, //`${pos.x}_${pos.y}`

                };
                _context27.next = 6;
                return this.StorePoint(key, idb_pt);

              case 6:
                if (!this.UpdateState) {
                  _context27.next = 10;
                  break;
                }

                if (!(game_state.bPointsAndPathsLoaded === true)) {
                  _context27.next = 10;
                  break;
                }

                _context27.next = 10;
                return this.UpdateState(game_state.iGameID, game_state);

              case 10:
                return _context27.abrupt("return", this.store.set(key, oval));

              case 11:
              case "end":
                return _context27.stop();
            }
          }
        }, _callee27, this);
      }));

      function set(_x22, _x23) {
        return _set2.apply(this, arguments);
      }

      return set;
    }()
  }, {
    key: "get",
    value: function () {
      var _get2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee28(key) {
        var val, idb_pt;
        return regeneratorRuntime.wrap(function _callee28$(_context28) {
          while (1) {
            switch (_context28.prev = _context28.next) {
              case 0:
                val = this.store.get(key);

                if (val) {
                  _context28.next = 12;
                  break;
                }

                _context28.next = 4;
                return this.GetPoint(key);

              case 4:
                idb_pt = _context28.sent;

                if (!(idb_pt && this.PointCreationCallback)) {
                  _context28.next = 11;
                  break;
                }

                val = this.PointCreationCallback(idb_pt.x, idb_pt.y, idb_pt.Status, idb_pt.Color);
                this.store.set(key, val);
                return _context28.abrupt("return", val);

              case 11:
                return _context28.abrupt("return", undefined);

              case 12:
                return _context28.abrupt("return", val);

              case 13:
              case "end":
                return _context28.stop();
            }
          }
        }, _callee28, this);
      }));

      function get(_x24) {
        return _get2.apply(this, arguments);
      }

      return get;
    }()
  }, {
    key: "values",
    value: function () {
      var _values2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee29() {
        var values;
        return regeneratorRuntime.wrap(function _callee29$(_context29) {
          while (1) {
            switch (_context29.prev = _context29.next) {
              case 0:
                values = this.store.values();

                if (!values) {
                  _context29.next = 3;
                  break;
                }

                return _context29.abrupt("return", values);

              case 3:
                _context29.next = 5;
                return this.GetAllPoints();

              case 5:
                values = _context29.sent;
                return _context29.abrupt("return", values);

              case 7:
              case "end":
                return _context29.stop();
            }
          }
        }, _callee29, this);
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
    key: "PrepareStore",
    value: function () {
      var _PrepareStore4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee30() {
        return regeneratorRuntime.wrap(function _callee30$(_context30) {
          while (1) {
            switch (_context30.prev = _context30.next) {
              case 0:
                return _context30.abrupt("return", true);

              case 1:
              case "end":
                return _context30.stop();
            }
          }
        }, _callee30);
      }));

      function PrepareStore() {
        return _PrepareStore4.apply(this, arguments);
      }

      return PrepareStore;
    }()
  }, {
    key: "BeginBulkStorage",
    value: function () {
      var _BeginBulkStorage4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee31() {
        return regeneratorRuntime.wrap(function _callee31$(_context31) {
          while (1) {
            switch (_context31.prev = _context31.next) {
              case 0:
              case "end":
                return _context31.stop();
            }
          }
        }, _callee31);
      }));

      function BeginBulkStorage() {
        return _BeginBulkStorage4.apply(this, arguments);
      }

      return BeginBulkStorage;
    }()
  }, {
    key: "EndBulkStorage",
    value: function () {
      var _EndBulkStorage4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee32() {
        return regeneratorRuntime.wrap(function _callee32$(_context32) {
          while (1) {
            switch (_context32.prev = _context32.next) {
              case 0:
              case "end":
                return _context32.stop();
            }
          }
        }, _callee32);
      }));

      function EndBulkStorage() {
        return _EndBulkStorage4.apply(this, arguments);
      }

      return EndBulkStorage;
    }()
  }, {
    key: "push",
    value: function () {
      var _push = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee33(obj) {
        return regeneratorRuntime.wrap(function _callee33$(_context33) {
          while (1) {
            switch (_context33.prev = _context33.next) {
              case 0:
                return _context33.abrupt("return", this.store.push(obj));

              case 1:
              case "end":
                return _context33.stop();
            }
          }
        }, _callee33, this);
      }));

      function push(_x27) {
        return _push.apply(this, arguments);
      }

      return push;
    }()
  }, {
    key: "all",
    value: function () {
      var _all = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee34() {
        return regeneratorRuntime.wrap(function _callee34$(_context34) {
          while (1) {
            switch (_context34.prev = _context34.next) {
              case 0:
                return _context34.abrupt("return", this.store);

              case 1:
              case "end":
                return _context34.stop();
            }
          }
        }, _callee34, this);
      }));

      function all() {
        return _all.apply(this, arguments);
      }

      return all;
    }()
  }]);

  return SimplePathStore;
}();

var IDBPathStore = /*#__PURE__*/function (_SimplePathStore) {
  _inherits(IDBPathStore, _SimplePathStore);

  var _super2 = _createSuper(IDBPathStore);

  function IDBPathStore(getAllPaths, storePath, updateStateFn, pathCreationCallbackFn, getGameStateFn, mainGameStateStore) {
    var _this14;

    _classCallCheck(this, IDBPathStore);

    _this14 = _super2.call(this);
    _this14.GetAllPaths = getAllPaths;
    _this14.StorePath = storePath;
    _this14.UpdateState = updateStateFn;
    _this14.PathCreationCallback = pathCreationCallbackFn;
    _this14.GetGameStateCallback = getGameStateFn;
    _this14.MainGameStateStore = mainGameStateStore;
    return _this14;
  }

  _createClass(IDBPathStore, [{
    key: "PrepareStore",
    value: function () {
      var _PrepareStore5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee35() {
        var paths, _iterator2, _step2, idb_pa, pa;

        return regeneratorRuntime.wrap(function _callee35$(_context35) {
          while (1) {
            switch (_context35.prev = _context35.next) {
              case 0:
                if (!this.PathCreationCallback) {
                  _context35.next = 23;
                  break;
                }

                _context35.next = 3;
                return this.GetAllPaths();

              case 3:
                paths = _context35.sent;
                //loading paths from indexeddb
                _iterator2 = _createForOfIteratorHelper(paths);
                _context35.prev = 5;

                _iterator2.s();

              case 7:
                if ((_step2 = _iterator2.n()).done) {
                  _context35.next = 15;
                  break;
                }

                idb_pa = _step2.value;
                _context35.next = 11;
                return this.PathCreationCallback(idb_pa.PointsAsString, idb_pa.Color, idb_pa.iId);

              case 11:
                pa = _context35.sent;
                this.store.push(pa);

              case 13:
                _context35.next = 7;
                break;

              case 15:
                _context35.next = 20;
                break;

              case 17:
                _context35.prev = 17;
                _context35.t0 = _context35["catch"](5);

                _iterator2.e(_context35.t0);

              case 20:
                _context35.prev = 20;

                _iterator2.f();

                return _context35.finish(20);

              case 23:
                return _context35.abrupt("return", true);

              case 24:
              case "end":
                return _context35.stop();
            }
          }
        }, _callee35, this, [[5, 17, 20, 23]]);
      }));

      function PrepareStore() {
        return _PrepareStore5.apply(this, arguments);
      }

      return PrepareStore;
    }()
  }, {
    key: "BeginBulkStorage",
    value: function () {
      var _BeginBulkStorage5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee36() {
        return regeneratorRuntime.wrap(function _callee36$(_context36) {
          while (1) {
            switch (_context36.prev = _context36.next) {
              case 0:
                _context36.next = 2;
                return this.MainGameStateStore.BeginBulkStorage([this.MainGameStateStore.DB_POINT_STORE, this.MainGameStateStore.DB_PATH_STORE], 'readwrite');

              case 2:
              case "end":
                return _context36.stop();
            }
          }
        }, _callee36, this);
      }));

      function BeginBulkStorage() {
        return _BeginBulkStorage5.apply(this, arguments);
      }

      return BeginBulkStorage;
    }()
  }, {
    key: "EndBulkStorage",
    value: function () {
      var _EndBulkStorage5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee37() {
        return regeneratorRuntime.wrap(function _callee37$(_context37) {
          while (1) {
            switch (_context37.prev = _context37.next) {
              case 0:
                _context37.next = 2;
                return this.MainGameStateStore.EndBulkStorage([this.MainGameStateStore.DB_POINT_STORE, this.MainGameStateStore.DB_PATH_STORE]);

              case 2:
              case "end":
                return _context37.stop();
            }
          }
        }, _callee37, this);
      }));

      function EndBulkStorage() {
        return _EndBulkStorage5.apply(this, arguments);
      }

      return EndBulkStorage;
    }()
  }, {
    key: "push",
    value: function () {
      var _push2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee38(val) {
        var id_key, idb_path, game_state;
        return regeneratorRuntime.wrap(function _callee38$(_context38) {
          while (1) {
            switch (_context38.prev = _context38.next) {
              case 0:
                id_key = val.$GetID();
                idb_path = {
                  iId: id_key,
                  Color: val.$GetFillColor(),
                  PointsAsString: val.$GetPointsString()
                };
                _context38.next = 4;
                return this.StorePath(id_key, idb_path);

              case 4:
                if (!this.UpdateState) {
                  _context38.next = 9;
                  break;
                }

                game_state = this.GetGameStateCallback();

                if (!(game_state.bPointsAndPathsLoaded === true)) {
                  _context38.next = 9;
                  break;
                }

                _context38.next = 9;
                return this.UpdateState(game_state.iGameID, game_state);

              case 9:
                return _context38.abrupt("return", this.store.push(val));

              case 10:
              case "end":
                return _context38.stop();
            }
          }
        }, _callee38, this);
      }));

      function push(_x28) {
        return _push2.apply(this, arguments);
      }

      return push;
    }()
  }, {
    key: "all",
    value: function () {
      var _all2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee39() {
        var values;
        return regeneratorRuntime.wrap(function _callee39$(_context39) {
          while (1) {
            switch (_context39.prev = _context39.next) {
              case 0:
                values = this.store;

                if (!values) {
                  _context39.next = 3;
                  break;
                }

                return _context39.abrupt("return", values);

              case 3:
                _context39.next = 5;
                return this.GetAllPaths();

              case 5:
                values = _context39.sent;
                return _context39.abrupt("return", values);

              case 7:
              case "end":
                return _context39.stop();
            }
          }
        }, _callee39, this);
      }));

      function all() {
        return _all2.apply(this, arguments);
      }

      return all;
    }()
  }]);

  return IDBPathStore;
}(SimplePathStore); //////////IndexedDB points and path stores end//////////




/***/ })

}]);