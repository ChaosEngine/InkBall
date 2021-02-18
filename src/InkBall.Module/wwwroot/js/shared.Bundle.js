(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[1],{

/***/ 3:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SvgVml", function() { return SvgVml; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StatusEnum", function() { return StatusEnum; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pnpoly", function() { return pnpoly; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pnpoly2", function() { return pnpoly2; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LocalLog", function() { return LocalLog; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LocalError", function() { return LocalError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hasDuplicates", function() { return hasDuplicates; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sortPointsClockwise", function() { return sortPointsClockwise; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Sleep", function() { return Sleep; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isESModuleSupport", function() { return isESModuleSupport; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GameStateStore", function() { return GameStateStore; });
/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "$" }]*/

/**
 * Point status enum
 * */

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

var StatusEnum = Object.freeze({
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
 * Shared error log functoin
 * @param {...any} args - objects to log
 */


function LocalError() {
  var msg = '';

  for (var i = 0; i < arguments.length; i++) {
    var str = i < 0 || arguments.length <= i ? undefined : arguments[i];
    if (str) msg += str;
  } // eslint-disable-next-line no-console


  console.error(msg);
}
/**
 * Based on http://www.faqs.org/faqs/graphics/algorithms-faq/
 * but mainly on http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
 * returns != 0 if point is inside path
 * @param {number} npol points count
 * @param {number} xp x point coordinates
 * @param {number} yp y point coordinates
 * @param {number} x point to check x coordinate
 * @param {number} y point to check y coordinate
 * @returns {boolean} if point lies inside the polygon
 */


function pnpoly(npol, xp, yp, x, y) {
  var i,
      j,
      c = false;

  for (i = 0, j = npol - 1; i < npol; j = i++) {
    if ((yp[i] <= y && y < yp[j] || yp[j] <= y && y < yp[i]) && x < (xp[j] - xp[i]) * (y - yp[i]) / (yp[j] - yp[i]) + xp[i]) c = !c;
  }

  return c;
}

function pnpoly2(pathPoints, x, y) {
  var npol = pathPoints.length;
  var i,
      j,
      c = false;

  for (i = 0, j = npol - 1; i < npol; j = i++) {
    var pi = pathPoints[i],
        pj = pathPoints[j];
    if ((pi.y <= y && y < pj.y || pj.y <= y && y < pi.y) && x < (pj.x - pi.x) * (y - pi.y) / (pj.y - pi.y) + pi.x) c = !c;
  }

  return c;
}
/**
 * Test for array uniquness using default object comparator
 * @param {array} array of objects that are tested againstn uniqenes
 * @returns {boolean} true - has duplicates
 */


function hasDuplicates(array) {
  return new Set(array).size !== array.length;
}

function Sleep(_x) {
  return _Sleep.apply(this, arguments);
}

function _Sleep() {
  _Sleep = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee44(ms) {
    return regeneratorRuntime.wrap(function _callee44$(_context44) {
      while (1) {
        switch (_context44.prev = _context44.next) {
          case 0:
            return _context44.abrupt("return", new Promise(function (resolve) {
              return setTimeout(resolve, ms);
            }));

          case 1:
          case "end":
            return _context44.stop();
        }
      }
    }, _callee44);
  }));
  return _Sleep.apply(this, arguments);
}

function isESModuleSupport() {
  var esModuleSupport = ('noModule' in HTMLScriptElement.prototype);
  return esModuleSupport;
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
} //////////////////////////////////////////////////////
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


var SvgVml = /*#__PURE__*/function () {
  function SvgVml() {
    _classCallCheck(this, SvgVml);

    var svgNS = "http://www.w3.org/2000/svg";
    var svgAvailable = false,
        svgAntialias = false;
    var documentCreateElementNS_SVG, documentCreateElementNS_Element;
    this.cont = null;

    if (self && self.document && self.document.createElementNS) {
      this.cont = document.createElementNS(svgNS, "svg");
      svgAvailable = this.cont.x !== null;
    }

    if (svgAvailable) {
      /* ============= displayable SVG ============== */
      documentCreateElementNS_SVG = function () {
        return this.cont;
      }.bind(this);

      documentCreateElementNS_Element = function documentCreateElementNS_Element(elemeName) {
        switch (elemeName) {
          case "circle":
          case "line":
          case "polyline":
            {
              var o = document.createElementNS(svgNS, elemeName);
              return o;
            }

          default:
            throw new Error("unknwn type ".concat(elemeName));
        }
      };
    } else {
      /* ============= emulated SVG ============== */
      documentCreateElementNS_SVG = function documentCreateElementNS_SVG() {
        return {
          attributes: new Map(),
          children: [],
          setAttributeNS: function setAttributeNS(_nullish, key, val) {
            this.attributes.set(key, val);
          },
          appendChild: function appendChild(val) {
            this.children.push(val);
          },
          removeChild: function removeChild(val) {
            var index = this.children.indexOf(val);
            if (index !== -1) this.children.splice(index, 1);
          }
        };
      }; /////////////// Pollyfills start ///////////////


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
        this.attributes["delete"](key);
      };

      self.SVGLineElement = function () {
        this.attributes = new Map();
      };

      SVGLineElement.prototype.setAttribute = function (key, val) {
        this.attributes.set(key, val);
      };

      SVGLineElement.prototype.getAttribute = function (key) {
        return this.attributes.get(key);
      };

      SVGLineElement.prototype.removeAttribute = function (key) {
        this.attributes["delete"](key);
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
        this.attributes["delete"](key);
      }; /////////////// Pollyfills end ///////////////


      documentCreateElementNS_Element = function documentCreateElementNS_Element(elemeName) {
        switch (elemeName) {
          case "circle":
            return new SVGCircleElement();

          case "line":
            return new SVGLineElement();

          case "polyline":
            return new SVGPolylineElement();

          default:
            throw new Error("unknwn type ".concat(elemeName));
        }
      };
    }

    SVGCircleElement.prototype.move = function (x1, y1, radius) {
      this.setAttribute("cx", x1);
      this.setAttribute("cy", y1);
      this.setAttribute("r", Math.round(radius));
    };

    SVGCircleElement.prototype.GetStrokeColor = function () {
      return this.getAttribute("stroke");
    };

    SVGCircleElement.prototype.SetStrokeColor = function (col) {
      this.setAttribute("stroke", col);
    };

    SVGCircleElement.prototype.GetPosition = function () {
      return {
        x: this.getAttribute("cx"),
        y: this.getAttribute("cy")
      };
    };

    SVGCircleElement.prototype.GetFillColor = function () {
      return this.getAttribute("fill");
    };

    SVGCircleElement.prototype.SetFillColor = function (col) {
      this.setAttribute("fill", col);
    };

    SVGCircleElement.prototype.GetStatus = function () {
      return parseInt(this.getAttribute("data-status"));
    };

    SVGCircleElement.prototype.SetStatus = function (iStatus) {
      var saveOldPoint = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (saveOldPoint) {
        var old_status = parseInt(this.getAttribute("data-status"));
        this.setAttribute("data-status", iStatus);
        if (old_status !== StatusEnum.POINT_FREE && old_status !== iStatus) this.setAttribute("data-old-status", old_status);
      } else {
        this.setAttribute("data-status", iStatus);
      }
    };

    SVGCircleElement.prototype.RevertOldStatus = function () {
      var old_status = this.getAttribute("data-old-status");

      if (old_status) {
        this.removeAttribute("data-old-status");
        this.setAttribute("data-status", old_status);
        return parseInt(old_status);
      }

      return -1;
    };

    SVGCircleElement.prototype.GetZIndex = function () {
      return this.getAttribute("z-index");
    };

    SVGCircleElement.prototype.SetZIndex = function (val) {
      this.setAttribute("z-index", val);
    };

    SVGCircleElement.prototype.Hide = function () {
      this.setAttribute("visibility", 'hidden');
    };

    SVGCircleElement.prototype.Show = function () {
      this.setAttribute("visibility", 'visible');
    };

    SVGCircleElement.prototype.strokeWeight = function (sw) {
      this.setAttribute("stroke-width", sw);
    };

    SVGCircleElement.prototype.Serialize = function () {
      var _this$GetPosition = this.GetPosition(),
          x = _this$GetPosition.x,
          y = _this$GetPosition.y;

      var status = this.GetStatus();
      var color = this.GetFillColor();
      return {
        x: x,
        y: y,
        Status: status,
        Color: color
      };
    };

    SVGLineElement.prototype.move = function (x1, y1, x2, y2) {
      this.setAttribute("x1", x1);
      this.setAttribute("y1", y1);
      this.setAttribute("x2", x2);
      this.setAttribute("y2", y2);
    };

    SVGLineElement.prototype.RGBcolor = function (R, G, B) {
      this.setAttribute("stroke", "rgb(" + Math.round(R) + "," + Math.round(G) + "," + Math.round(B) + ")");
    };

    SVGLineElement.prototype.SetColor = function (color) {
      this.setAttribute("stroke", color);
    };

    SVGLineElement.prototype.strokeWidth = function (s) {
      this.setAttribute("stroke-width", Math.round(s) + "px");
    };

    SVGPolylineElement.prototype.AppendPoints = function (x, y, diffX, diffY) {
      var pts_str = this.getAttribute("points");
      var pts = pts_str.split(" ");
      if (true === hasDuplicates(pts)) return false;
      var arr; //obtain last point coords

      if (pts.length <= 1 || (arr = pts[pts.length - 1].split(",")).length !== 2) return false;
      var last_x = parseInt(arr[0]),
          last_y = parseInt(arr[1]);
      var x_diff = parseInt(x),
          y_diff = parseInt(y);
      if (!(Math.abs(last_x - x_diff) <= diffX && Math.abs(last_y - y_diff) <= diffY)) return false;
      this.setAttribute("points", pts_str + " ".concat(x, ",").concat(y));
      return true;
    };

    SVGPolylineElement.prototype.RemoveLastPoint = function () {
      var newpts = this.getAttribute("points").replace(/(\s\d+,\d+)$/, "");
      this.setAttribute("points", newpts);
      return newpts;
    };

    SVGPolylineElement.prototype.ContainsPoint = function (x, y) {
      var regexstr = new RegExp("".concat(x, ",").concat(y), 'g');
      var cnt = (this.getAttribute("points").match(regexstr) || []).length;
      return cnt;
    };

    SVGPolylineElement.prototype.GetPointsString = function () {
      return this.getAttribute("points");
    };

    SVGPolylineElement.prototype.GetPointsArray = function () {
      //x0,y0 x1,y1 x2,y2
      return this.getAttribute("points").split(" ").map(function (pt) {
        var tab = pt.split(',');
        return {
          x: parseInt(tab[0]),
          y: parseInt(tab[1])
        };
      });
    };

    SVGPolylineElement.prototype.SetPoints = function (sPoints) {
      this.setAttribute("points", sPoints);
    };

    SVGPolylineElement.prototype.GetIsClosed = function () {
      var pts = this.getAttribute("points").split(" ");
      return pts[0] === pts[pts.length - 1];
    };

    SVGPolylineElement.prototype.GetLength = function () {
      return this.getAttribute("points").split(" ").length;
    };

    SVGPolylineElement.prototype.SetWidthAndColor = function (w, col) {
      this.setAttribute("stroke", col);
      this.setAttribute("fill", col);
      this.setAttribute("stroke-width", Math.round(w));
    };

    SVGPolylineElement.prototype.GetID = function () {
      return parseInt(this.getAttribute("data-id"));
    };

    SVGPolylineElement.prototype.SetID = function (iID) {
      this.setAttribute("data-id", iID);
    };

    SVGPolylineElement.prototype.GetFillColor = function () {
      return this.getAttribute("fill");
    };

    SVGPolylineElement.prototype.IsPointInFill = function (x, y) {
      var point = documentCreateElementNS_SVG("svg").createSVGPoint();
      point.x = x;
      point.y = y;
      return this.isPointInFill(point); //not in IE11
    };

    SVGPolylineElement.prototype.Serialize = function () {
      var id = this.GetID();
      var color = this.GetFillColor();
      var pts = this.GetPointsString();
      return {
        iId: id,
        Color: color,
        PointsAsString: pts
      };
    };

    this.CreateSVGVML = function (contextParent, iWidth, iHeight, antialias) {
      this.cont = documentCreateElementNS_SVG("svg");
      if (iWidth) this.cont.setAttributeNS(null, 'width', iWidth);
      if (iHeight) this.cont.setAttributeNS(null, 'height', iHeight);
      if (contextParent) contextParent.appendChild(this.cont);
      svgAntialias = antialias;
      return svgAvailable ? this.cont : null;
    };

    this.CreateLine = function (w, col, linecap) {
      var o = documentCreateElementNS_Element("line");
      o.setAttribute("shape-rendering", svgAntialias ? "auto" : "optimizeSpeed");
      o.setAttribute("stroke-width", Math.round(w) + "px");
      if (col) o.setAttribute("stroke", col);
      if (linecap) o.setAttribute("stroke-linecap", linecap);
      this.cont.appendChild(o);
      return o;
    };

    this.CreatePolyline = function (width, points, col) {
      var o = documentCreateElementNS_Element("polyline");
      o.setAttribute("shape-rendering", svgAntialias ? "auto" : "optimizeSpeed");
      o.setAttribute("stroke-width", Math.round(width));
      if (col) o.setAttribute("stroke", col);
      o.setAttribute("fill", col);
      o.setAttribute("fill-opacity", "0.1");
      if (points) o.setAttribute("points", points);
      o.setAttribute("stroke-linecap", "round");
      o.setAttribute("stroke-linejoin", "round");
      o.setAttribute("data-id", 0);
      this.cont.appendChild(o);
      return o;
    };

    this.CreateOval = function (diam) {
      var o = documentCreateElementNS_Element("circle");
      o.setAttribute("shape-rendering", svgAntialias ? "auto" : "optimizeSpeed");
      o.setAttribute("stroke-width", 0);
      o.setAttribute("r", Math.round(diam >> 1)); //ch_commented o.style.cursor = "pointer";

      o.setAttribute("data-status", StatusEnum.POINT_FREE); //o.setAttribute("data-old-status", StatusEnum.POINT_FREE);

      this.cont.appendChild(o);
      return o;
    };
  }

  _createClass(SvgVml, [{
    key: "RemoveOval",
    value: function RemoveOval(oval) {
      this.cont.removeChild(oval);
    }
  }, {
    key: "RemovePolyline",
    value: function RemovePolyline(polyline) {
      this.cont.removeChild(polyline);
    }
  }, {
    key: "DeserializeOval",
    value: function DeserializeOval(packed) {
      var radius = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;
      var x = packed.x,
          y = packed.y,
          Status = packed.Status,
          Color = packed.Color;
      var o = this.CreateOval(4);
      o.move(x, y, radius);
      o.SetStrokeColor(Color);
      o.SetFillColor(Color);
      o.SetStatus(Status);
      return o;
    }
  }, {
    key: "DeserializePolyline",
    value: function DeserializePolyline(packed) {
      var width = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
      var iId = packed.iId,
          Color = packed.Color,
          PointsAsString = packed.PointsAsString;
      var o = this.CreatePolyline(width, PointsAsString, Color);
      o.SetID(iId);
      return o;
    }
  }]);

  return SvgVml;
}();

var GameStateStore = /*#__PURE__*/function () {
  function GameStateStore(useIndexedDb) {
    var pointCreationCallbackFn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var pathCreationCallbackFn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var getGameStateFn = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    var version = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "";

    _classCallCheck(this, GameStateStore);

    if (useIndexedDb) {
      if (!('indexedDB' in self)) {
        LocalError("This browser doesn't support IndexedDB");
        useIndexedDb = false;
      } else useIndexedDb = true;
    } else useIndexedDb = false; /////////inner class definitions start/////////
    /////////https://stackoverflow.com/questions/28784375/nested-es6-classes/////////


    var SimplePointStoreDefinition = /*#__PURE__*/function () {
      function SimplePointStore() {
        _classCallCheck(this, SimplePointStore);

        this.store = new Map();
      }

      _createClass(SimplePointStore, [{
        key: "PrepareStore",
        value: function () {
          var _PrepareStore = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    return _context.abrupt("return", true);

                  case 1:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee);
          }));

          function PrepareStore() {
            return _PrepareStore.apply(this, arguments);
          }

          return PrepareStore;
        }()
      }, {
        key: "BeginBulkStorage",
        value: function () {
          var _BeginBulkStorage = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2);
          }));

          function BeginBulkStorage() {
            return _BeginBulkStorage.apply(this, arguments);
          }

          return BeginBulkStorage;
        }()
      }, {
        key: "EndBulkStorage",
        value: function () {
          var _EndBulkStorage = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                  case "end":
                    return _context3.stop();
                }
              }
            }, _callee3);
          }));

          function EndBulkStorage() {
            return _EndBulkStorage.apply(this, arguments);
          }

          return EndBulkStorage;
        }()
      }, {
        key: "has",
        value: function () {
          var _has = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(key) {
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    return _context4.abrupt("return", this.store.has(key));

                  case 1:
                  case "end":
                    return _context4.stop();
                }
              }
            }, _callee4, this);
          }));

          function has(_x2) {
            return _has.apply(this, arguments);
          }

          return has;
        }()
      }, {
        key: "set",
        value: function () {
          var _set = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(key, val) {
            return regeneratorRuntime.wrap(function _callee5$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    return _context5.abrupt("return", this.store.set(key, val));

                  case 1:
                  case "end":
                    return _context5.stop();
                }
              }
            }, _callee5, this);
          }));

          function set(_x3, _x4) {
            return _set.apply(this, arguments);
          }

          return set;
        }()
      }, {
        key: "get",
        value: function () {
          var _get = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(key) {
            return regeneratorRuntime.wrap(function _callee6$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    return _context6.abrupt("return", this.store.get(key));

                  case 1:
                  case "end":
                    return _context6.stop();
                }
              }
            }, _callee6, this);
          }));

          function get(_x5) {
            return _get.apply(this, arguments);
          }

          return get;
        }()
      }, {
        key: "values",
        value: function () {
          var _values = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
            return regeneratorRuntime.wrap(function _callee7$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    return _context7.abrupt("return", this.store.values());

                  case 1:
                  case "end":
                    return _context7.stop();
                }
              }
            }, _callee7, this);
          }));

          function values() {
            return _values.apply(this, arguments);
          }

          return values;
        }()
      }, {
        key: "count",
        value: function () {
          var _count = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
            return regeneratorRuntime.wrap(function _callee8$(_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    return _context8.abrupt("return", this.store.size);

                  case 1:
                  case "end":
                    return _context8.stop();
                }
              }
            }, _callee8, this);
          }));

          function count() {
            return _count.apply(this, arguments);
          }

          return count;
        }()
      }]);

      return SimplePointStore;
    }();

    var SimplePathStoreDefinition = /*#__PURE__*/function () {
      function SimplePathStore() {
        _classCallCheck(this, SimplePathStore);

        this.store = [];
      }

      _createClass(SimplePathStore, [{
        key: "PrepareStore",
        value: function () {
          var _PrepareStore2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
            return regeneratorRuntime.wrap(function _callee9$(_context9) {
              while (1) {
                switch (_context9.prev = _context9.next) {
                  case 0:
                    return _context9.abrupt("return", true);

                  case 1:
                  case "end":
                    return _context9.stop();
                }
              }
            }, _callee9);
          }));

          function PrepareStore() {
            return _PrepareStore2.apply(this, arguments);
          }

          return PrepareStore;
        }()
      }, {
        key: "BeginBulkStorage",
        value: function () {
          var _BeginBulkStorage2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
            return regeneratorRuntime.wrap(function _callee10$(_context10) {
              while (1) {
                switch (_context10.prev = _context10.next) {
                  case 0:
                  case "end":
                    return _context10.stop();
                }
              }
            }, _callee10);
          }));

          function BeginBulkStorage() {
            return _BeginBulkStorage2.apply(this, arguments);
          }

          return BeginBulkStorage;
        }()
      }, {
        key: "EndBulkStorage",
        value: function () {
          var _EndBulkStorage2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
            return regeneratorRuntime.wrap(function _callee11$(_context11) {
              while (1) {
                switch (_context11.prev = _context11.next) {
                  case 0:
                  case "end":
                    return _context11.stop();
                }
              }
            }, _callee11);
          }));

          function EndBulkStorage() {
            return _EndBulkStorage2.apply(this, arguments);
          }

          return EndBulkStorage;
        }()
      }, {
        key: "push",
        value: function () {
          var _push = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(obj) {
            return regeneratorRuntime.wrap(function _callee12$(_context12) {
              while (1) {
                switch (_context12.prev = _context12.next) {
                  case 0:
                    return _context12.abrupt("return", this.store.push(obj));

                  case 1:
                  case "end":
                    return _context12.stop();
                }
              }
            }, _callee12, this);
          }));

          function push(_x6) {
            return _push.apply(this, arguments);
          }

          return push;
        }()
      }, {
        key: "all",
        value: function () {
          var _all = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13() {
            return regeneratorRuntime.wrap(function _callee13$(_context13) {
              while (1) {
                switch (_context13.prev = _context13.next) {
                  case 0:
                    return _context13.abrupt("return", this.store);

                  case 1:
                  case "end":
                    return _context13.stop();
                }
              }
            }, _callee13, this);
          }));

          function all() {
            return _all.apply(this, arguments);
          }

          return all;
        }()
      }, {
        key: "count",
        value: function () {
          var _count2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14() {
            return regeneratorRuntime.wrap(function _callee14$(_context14) {
              while (1) {
                switch (_context14.prev = _context14.next) {
                  case 0:
                    return _context14.abrupt("return", this.store.length);

                  case 1:
                  case "end":
                    return _context14.stop();
                }
              }
            }, _callee14, this);
          }));

          function count() {
            return _count2.apply(this, arguments);
          }

          return count;
        }()
      }]);

      return SimplePathStore;
    }();

    var IDBPointStoreDefinition = /*#__PURE__*/function (_SimplePointStoreDefi) {
      _inherits(IDBPointStore, _SimplePointStoreDefi);

      var _super = _createSuper(IDBPointStore);

      function IDBPointStore(mainGameStateStore, pointCreationCallbackFn, getGameStateFn) {
        var _this;

        _classCallCheck(this, IDBPointStore);

        _this = _super.call(this);
        _this.MainGameStateStore = mainGameStateStore;
        _this.GetPoint = mainGameStateStore.GetPoint.bind(_this.MainGameStateStore);
        _this.StorePoint = mainGameStateStore.StorePoint.bind(_this.MainGameStateStore);
        _this.GetAllPoints = mainGameStateStore.GetAllPoints.bind(_this.MainGameStateStore);
        _this.UpdateState = mainGameStateStore.UpdateState.bind(_this.MainGameStateStore);
        _this.PointCreationCallback = pointCreationCallbackFn;
        _this.GetGameStateCallback = getGameStateFn;
        return _this;
      }

      _createClass(IDBPointStore, [{
        key: "PrepareStore",
        value: function () {
          var _PrepareStore3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15() {
            var points, game_state, _iterator, _step, idb_pt, pt, index;

            return regeneratorRuntime.wrap(function _callee15$(_context15) {
              while (1) {
                switch (_context15.prev = _context15.next) {
                  case 0:
                    if (!(this.PointCreationCallback && this.GetGameStateCallback)) {
                      _context15.next = 25;
                      break;
                    }

                    _context15.next = 3;
                    return this.GetAllPoints();

                  case 3:
                    points = _context15.sent;
                    game_state = this.GetGameStateCallback(); //loading points from indexeddb

                    _iterator = _createForOfIteratorHelper(points);
                    _context15.prev = 6;

                    _iterator.s();

                  case 8:
                    if ((_step = _iterator.n()).done) {
                      _context15.next = 17;
                      break;
                    }

                    idb_pt = _step.value;
                    _context15.next = 12;
                    return this.PointCreationCallback(idb_pt.x, idb_pt.y, idb_pt.Status, idb_pt.Color);

                  case 12:
                    pt = _context15.sent;
                    index = idb_pt.y * game_state.iGridWidth + idb_pt.x;
                    this.store.set(index, pt);

                  case 15:
                    _context15.next = 8;
                    break;

                  case 17:
                    _context15.next = 22;
                    break;

                  case 19:
                    _context15.prev = 19;
                    _context15.t0 = _context15["catch"](6);

                    _iterator.e(_context15.t0);

                  case 22:
                    _context15.prev = 22;

                    _iterator.f();

                    return _context15.finish(22);

                  case 25:
                    return _context15.abrupt("return", true);

                  case 26:
                  case "end":
                    return _context15.stop();
                }
              }
            }, _callee15, this, [[6, 19, 22, 25]]);
          }));

          function PrepareStore() {
            return _PrepareStore3.apply(this, arguments);
          }

          return PrepareStore;
        }()
      }, {
        key: "BeginBulkStorage",
        value: function () {
          var _BeginBulkStorage3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16() {
            return regeneratorRuntime.wrap(function _callee16$(_context16) {
              while (1) {
                switch (_context16.prev = _context16.next) {
                  case 0:
                    _context16.next = 2;
                    return this.MainGameStateStore.BeginBulkStorage(this.MainGameStateStore.DB_POINT_STORE, 'readwrite');

                  case 2:
                    if (this.MainGameStateStore.pointBulkBuffer === null) this.MainGameStateStore.pointBulkBuffer = new Map();

                  case 3:
                  case "end":
                    return _context16.stop();
                }
              }
            }, _callee16, this);
          }));

          function BeginBulkStorage() {
            return _BeginBulkStorage3.apply(this, arguments);
          }

          return BeginBulkStorage;
        }()
      }, {
        key: "EndBulkStorage",
        value: function () {
          var _EndBulkStorage3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17() {
            return regeneratorRuntime.wrap(function _callee17$(_context17) {
              while (1) {
                switch (_context17.prev = _context17.next) {
                  case 0:
                    _context17.next = 2;
                    return this.MainGameStateStore.StoreAllPoints();

                  case 2:
                    _context17.next = 4;
                    return this.MainGameStateStore.EndBulkStorage(this.MainGameStateStore.DB_POINT_STORE);

                  case 4:
                  case "end":
                    return _context17.stop();
                }
              }
            }, _callee17, this);
          }));

          function EndBulkStorage() {
            return _EndBulkStorage3.apply(this, arguments);
          }

          return EndBulkStorage;
        }()
      }, {
        key: "has",
        value: function () {
          var _has2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18(key) {
            return regeneratorRuntime.wrap(function _callee18$(_context18) {
              while (1) {
                switch (_context18.prev = _context18.next) {
                  case 0:
                    return _context18.abrupt("return", this.store.has(key));

                  case 1:
                  case "end":
                    return _context18.stop();
                }
              }
            }, _callee18, this);
          }));

          function has(_x7) {
            return _has2.apply(this, arguments);
          }

          return has;
        }()
      }, {
        key: "set",
        value: function () {
          var _set2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19(key, oval) {
            var game_state, pos, color, idb_pt;
            return regeneratorRuntime.wrap(function _callee19$(_context19) {
              while (1) {
                switch (_context19.prev = _context19.next) {
                  case 0:
                    game_state = this.GetGameStateCallback();
                    pos = oval.GetPosition();
                    color = oval.GetFillColor();
                    idb_pt = {
                      x: parseInt(pos.x) / game_state.iGridSizeX,
                      y: parseInt(pos.y) / game_state.iGridSizeY,
                      Status: oval.GetStatus(),
                      Color: color
                    };
                    _context19.next = 6;
                    return this.StorePoint(key, idb_pt);

                  case 6:
                    if (!this.UpdateState) {
                      _context19.next = 10;
                      break;
                    }

                    if (!(game_state.bPointsAndPathsLoaded === true)) {
                      _context19.next = 10;
                      break;
                    }

                    _context19.next = 10;
                    return this.UpdateState(game_state.iGameID, game_state);

                  case 10:
                    return _context19.abrupt("return", this.store.set(key, oval));

                  case 11:
                  case "end":
                    return _context19.stop();
                }
              }
            }, _callee19, this);
          }));

          function set(_x8, _x9) {
            return _set2.apply(this, arguments);
          }

          return set;
        }()
      }, {
        key: "get",
        value: function () {
          var _get2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee20(key) {
            var val;
            return regeneratorRuntime.wrap(function _callee20$(_context20) {
              while (1) {
                switch (_context20.prev = _context20.next) {
                  case 0:
                    val = this.store.get(key); //if (!val) {
                    //	const idb_pt = await this.GetPoint(key);
                    //	if (idb_pt && this.PointCreationCallback) {
                    //		val = this.PointCreationCallback(idb_pt.x, idb_pt.y, idb_pt.Status, idb_pt.Color);
                    //		this.store.set(key, val);
                    //		return val;
                    //	}
                    //	else
                    //		return undefined;
                    //}

                    return _context20.abrupt("return", val);

                  case 2:
                  case "end":
                    return _context20.stop();
                }
              }
            }, _callee20, this);
          }));

          function get(_x10) {
            return _get2.apply(this, arguments);
          }

          return get;
        }()
      }, {
        key: "values",
        value: function () {
          var _values2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee21() {
            var values;
            return regeneratorRuntime.wrap(function _callee21$(_context21) {
              while (1) {
                switch (_context21.prev = _context21.next) {
                  case 0:
                    values = this.store.values();

                    if (!values) {
                      _context21.next = 3;
                      break;
                    }

                    return _context21.abrupt("return", values);

                  case 3:
                    _context21.next = 5;
                    return this.GetAllPoints();

                  case 5:
                    values = _context21.sent;
                    return _context21.abrupt("return", values);

                  case 7:
                  case "end":
                    return _context21.stop();
                }
              }
            }, _callee21, this);
          }));

          function values() {
            return _values2.apply(this, arguments);
          }

          return values;
        }()
      }]);

      return IDBPointStore;
    }(SimplePointStoreDefinition);

    var IDBPathStoreDefinition = /*#__PURE__*/function (_SimplePathStoreDefin) {
      _inherits(IDBPathStore, _SimplePathStoreDefin);

      var _super2 = _createSuper(IDBPathStore);

      function IDBPathStore(mainGameStateStore, pathCreationCallbackFn, getGameStateFn) {
        var _this2;

        _classCallCheck(this, IDBPathStore);

        _this2 = _super2.call(this);
        _this2.MainGameStateStore = mainGameStateStore;
        _this2.GetAllPaths = mainGameStateStore.GetAllPaths.bind(_this2.MainGameStateStore);
        _this2.StorePath = mainGameStateStore.StorePath.bind(_this2.MainGameStateStore);
        _this2.UpdateState = mainGameStateStore.UpdateState.bind(_this2.MainGameStateStore);
        _this2.PathCreationCallback = pathCreationCallbackFn;
        _this2.GetGameStateCallback = getGameStateFn;
        return _this2;
      }

      _createClass(IDBPathStore, [{
        key: "PrepareStore",
        value: function () {
          var _PrepareStore4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee22() {
            var paths, _iterator2, _step2, idb_pa, pa;

            return regeneratorRuntime.wrap(function _callee22$(_context22) {
              while (1) {
                switch (_context22.prev = _context22.next) {
                  case 0:
                    if (!this.PathCreationCallback) {
                      _context22.next = 23;
                      break;
                    }

                    _context22.next = 3;
                    return this.GetAllPaths();

                  case 3:
                    paths = _context22.sent;
                    //loading paths from indexeddb
                    _iterator2 = _createForOfIteratorHelper(paths);
                    _context22.prev = 5;

                    _iterator2.s();

                  case 7:
                    if ((_step2 = _iterator2.n()).done) {
                      _context22.next = 15;
                      break;
                    }

                    idb_pa = _step2.value;
                    _context22.next = 11;
                    return this.PathCreationCallback(idb_pa.PointsAsString, idb_pa.Color, idb_pa.iId);

                  case 11:
                    pa = _context22.sent;
                    this.store.push(pa);

                  case 13:
                    _context22.next = 7;
                    break;

                  case 15:
                    _context22.next = 20;
                    break;

                  case 17:
                    _context22.prev = 17;
                    _context22.t0 = _context22["catch"](5);

                    _iterator2.e(_context22.t0);

                  case 20:
                    _context22.prev = 20;

                    _iterator2.f();

                    return _context22.finish(20);

                  case 23:
                    return _context22.abrupt("return", true);

                  case 24:
                  case "end":
                    return _context22.stop();
                }
              }
            }, _callee22, this, [[5, 17, 20, 23]]);
          }));

          function PrepareStore() {
            return _PrepareStore4.apply(this, arguments);
          }

          return PrepareStore;
        }()
      }, {
        key: "BeginBulkStorage",
        value: function () {
          var _BeginBulkStorage4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee23() {
            return regeneratorRuntime.wrap(function _callee23$(_context23) {
              while (1) {
                switch (_context23.prev = _context23.next) {
                  case 0:
                    _context23.next = 2;
                    return this.MainGameStateStore.BeginBulkStorage([this.MainGameStateStore.DB_POINT_STORE, this.MainGameStateStore.DB_PATH_STORE], 'readwrite');

                  case 2:
                    if (this.MainGameStateStore.pathBulkBuffer === null) this.MainGameStateStore.pathBulkBuffer = new Map();

                  case 3:
                  case "end":
                    return _context23.stop();
                }
              }
            }, _callee23, this);
          }));

          function BeginBulkStorage() {
            return _BeginBulkStorage4.apply(this, arguments);
          }

          return BeginBulkStorage;
        }()
      }, {
        key: "EndBulkStorage",
        value: function () {
          var _EndBulkStorage4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee24() {
            return regeneratorRuntime.wrap(function _callee24$(_context24) {
              while (1) {
                switch (_context24.prev = _context24.next) {
                  case 0:
                    _context24.next = 2;
                    return this.MainGameStateStore.StoreAllPaths();

                  case 2:
                    _context24.next = 4;
                    return this.MainGameStateStore.EndBulkStorage([this.MainGameStateStore.DB_POINT_STORE, this.MainGameStateStore.DB_PATH_STORE]);

                  case 4:
                  case "end":
                    return _context24.stop();
                }
              }
            }, _callee24, this);
          }));

          function EndBulkStorage() {
            return _EndBulkStorage4.apply(this, arguments);
          }

          return EndBulkStorage;
        }()
      }, {
        key: "push",
        value: function () {
          var _push2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee25(val) {
            var game_state, id_key, idb_path;
            return regeneratorRuntime.wrap(function _callee25$(_context25) {
              while (1) {
                switch (_context25.prev = _context25.next) {
                  case 0:
                    game_state = this.GetGameStateCallback();
                    id_key = val.GetID();
                    idb_path = {
                      iId: id_key,
                      Color: val.GetFillColor(),
                      PointsAsString: val.GetPointsString().split(" ").map(function (pt) {
                        var tab = pt.split(',');
                        var x = parseInt(tab[0]),
                            y = parseInt(tab[1]);
                        return "".concat(x / game_state.iGridSizeX, ",").concat(y / game_state.iGridSizeY);
                      }).join(" ")
                    };
                    _context25.next = 5;
                    return this.StorePath(id_key, idb_path);

                  case 5:
                    if (!this.UpdateState) {
                      _context25.next = 9;
                      break;
                    }

                    if (!(game_state.bPointsAndPathsLoaded === true)) {
                      _context25.next = 9;
                      break;
                    }

                    _context25.next = 9;
                    return this.UpdateState(game_state.iGameID, game_state);

                  case 9:
                    return _context25.abrupt("return", this.store.push(val));

                  case 10:
                  case "end":
                    return _context25.stop();
                }
              }
            }, _callee25, this);
          }));

          function push(_x11) {
            return _push2.apply(this, arguments);
          }

          return push;
        }()
      }, {
        key: "all",
        value: function () {
          var _all2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee26() {
            var values;
            return regeneratorRuntime.wrap(function _callee26$(_context26) {
              while (1) {
                switch (_context26.prev = _context26.next) {
                  case 0:
                    values = this.store;

                    if (!values) {
                      _context26.next = 3;
                      break;
                    }

                    return _context26.abrupt("return", values);

                  case 3:
                    _context26.next = 5;
                    return this.GetAllPaths();

                  case 5:
                    values = _context26.sent;
                    return _context26.abrupt("return", values);

                  case 7:
                  case "end":
                    return _context26.stop();
                }
              }
            }, _callee26, this);
          }));

          function all() {
            return _all2.apply(this, arguments);
          }

          return all;
        }()
      }]);

      return IDBPathStore;
    }(SimplePathStoreDefinition); /////////inner class definitions end/////////


    if (useIndexedDb === true) {
      this.DB_NAME = 'InkballGame';
      this.DB_POINT_STORE = 'points';
      this.DB_PATH_STORE = 'paths';
      this.DB_STATE_STORE = 'state';
      this.g_DB = null; //main DB object

      this.bulkStores = null;
      this.pointBulkBuffer = null;
      this.pathBulkBuffer = null; // Use a long long for this value (don't use a float)

      if (!version || version === "" || version.length <= 0) this.DB_VERSION = null;else {
        this.DB_VERSION = parseInt(version.split('.').reduce(function (acc, val) {
          val = parseInt(val);
          return acc * 10 + (isNaN(val) ? 0 : val);
        }, 0)) - 1010
        /*initial module versioning start number*/
        + 4
        /*initial indexDB start number*/
        ;
      }
      this.PointStore = new IDBPointStoreDefinition(this, pointCreationCallbackFn, getGameStateFn);
      this.PathStore = new IDBPathStoreDefinition(this, pathCreationCallbackFn, getGameStateFn);
    } else {
      this.PointStore = new SimplePointStoreDefinition();
      this.PathStore = new SimplePathStoreDefinition();
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
      var _OpenDb = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee27() {
        var _this3 = this;

        return regeneratorRuntime.wrap(function _callee27$(_context27) {
          while (1) {
            switch (_context27.prev = _context27.next) {
              case 0:
                LocalLog("OpenDb ...");
                return _context27.abrupt("return", new Promise(function (resolve, reject) {
                  var req;
                  if (_this3.DB_VERSION !== null) req = indexedDB.open(_this3.DB_NAME, _this3.DB_VERSION);else req = indexedDB.open(_this3.DB_NAME);

                  req.onsuccess = function (evt) {
                    // Equal to: db = req.result;
                    this.g_DB = evt.currentTarget.result;
                    LocalLog("OpenDb DONE");
                    resolve(evt.currentTarget.result);
                  }.bind(_this3);

                  req.onerror = function (evt) {
                    LocalError("OpenDb:", evt.target.errorCode || evt.target.error);
                    reject();
                  }.bind(_this3);

                  req.onupgradeneeded = function (evt) {
                    LocalLog("OpenDb.onupgradeneeded(version: ".concat(this.DB_VERSION, ")"));
                    var store_list = Array.from(evt.currentTarget.result.objectStoreNames);
                    if (store_list.includes(this.DB_POINT_STORE)) evt.currentTarget.result.deleteObjectStore(this.DB_POINT_STORE);
                    if (store_list.includes(this.DB_PATH_STORE)) evt.currentTarget.result.deleteObjectStore(this.DB_PATH_STORE);
                    if (store_list.includes(this.DB_STATE_STORE)) evt.currentTarget.result.deleteObjectStore(this.DB_STATE_STORE);
                    evt.currentTarget.result.createObjectStore(this.DB_POINT_STORE, {
                      /*keyPath: 'pos',*/
                      autoIncrement: false
                    }); //point_store.createIndex('Status', 'Status', { unique: false });
                    //point_store.createIndex('Color', 'Color', { unique: false });

                    evt.currentTarget.result.createObjectStore(this.DB_PATH_STORE, {
                      /*keyPath: 'iId',*/
                      autoIncrement: false
                    }); //path_store.createIndex('Color', 'Color', { unique: false });

                    evt.currentTarget.result.createObjectStore(this.DB_STATE_STORE, {
                      /*keyPath: 'gameId',*/
                      autoIncrement: false
                    });
                  }.bind(_this3);
                }));

              case 2:
              case "end":
                return _context27.stop();
            }
          }
        }, _callee27);
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
      if (this.bulkStores !== null && this.bulkStores.has(storeName)) return this.bulkStores.get(storeName);
      var tx = this.g_DB.transaction(storeName, mode);
      return tx.objectStore(storeName);
    }
  }, {
    key: "ClearAllStores",
    value: function () {
      var _ClearAllStores = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee29() {
        var clearObjectStore;
        return regeneratorRuntime.wrap(function _callee29$(_context29) {
          while (1) {
            switch (_context29.prev = _context29.next) {
              case 0:
                clearObjectStore = /*#__PURE__*/function () {
                  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee28(storeName) {
                    var _this4 = this;

                    return regeneratorRuntime.wrap(function _callee28$(_context28) {
                      while (1) {
                        switch (_context28.prev = _context28.next) {
                          case 0:
                            return _context28.abrupt("return", new Promise(function (resolve, reject) {
                              var store = _this4.GetObjectStore(storeName, 'readwrite');

                              var req = store.clear();

                              req.onsuccess = function () {
                                resolve();
                              };

                              req.onerror = function (evt) {
                                LocalError("clearObjectStore:", evt.target.errorCode);
                                reject();
                              };
                            }));

                          case 1:
                          case "end":
                            return _context28.stop();
                        }
                      }
                    }, _callee28);
                  }));

                  return function (_x12) {
                    return _ref3.apply(this, arguments);
                  };
                }().bind(this);

                _context29.next = 3;
                return Promise.all([clearObjectStore(this.DB_POINT_STORE), clearObjectStore(this.DB_PATH_STORE), clearObjectStore(this.DB_STATE_STORE)]);

              case 3:
              case "end":
                return _context29.stop();
            }
          }
        }, _callee29, this);
      }));

      function ClearAllStores() {
        return _ClearAllStores.apply(this, arguments);
      }

      return ClearAllStores;
    }()
    /**
      * @param {number} key is calculated inxed of point y * width + x, probably not usefull
      */

  }, {
    key: "GetPoint",
    value: function () {
      var _GetPoint = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee30(key) {
        var _this5 = this;

        return regeneratorRuntime.wrap(function _callee30$(_context30) {
          while (1) {
            switch (_context30.prev = _context30.next) {
              case 0:
                return _context30.abrupt("return", new Promise(function (resolve, reject) {
                  var store = _this5.GetObjectStore(_this5.DB_POINT_STORE, 'readonly');

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
                return _context30.stop();
            }
          }
        }, _callee30);
      }));

      function GetPoint(_x13) {
        return _GetPoint.apply(this, arguments);
      }

      return GetPoint;
    }()
  }, {
    key: "GetAllPoints",
    value: function () {
      var _GetAllPoints = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee31() {
        var _this6 = this;

        return regeneratorRuntime.wrap(function _callee31$(_context31) {
          while (1) {
            switch (_context31.prev = _context31.next) {
              case 0:
                return _context31.abrupt("return", new Promise(function (resolve, reject) {
                  var store = _this6.GetObjectStore(_this6.DB_POINT_STORE, 'readonly');

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
                return _context31.stop();
            }
          }
        }, _callee31);
      }));

      function GetAllPoints() {
        return _GetAllPoints.apply(this, arguments);
      }

      return GetAllPoints;
    }()
  }, {
    key: "GetState",
    value: function () {
      var _GetState = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee32(key) {
        var _this7 = this;

        return regeneratorRuntime.wrap(function _callee32$(_context32) {
          while (1) {
            switch (_context32.prev = _context32.next) {
              case 0:
                return _context32.abrupt("return", new Promise(function (resolve, reject) {
                  var store = _this7.GetObjectStore(_this7.DB_STATE_STORE, 'readonly');

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
                return _context32.stop();
            }
          }
        }, _callee32);
      }));

      function GetState(_x14) {
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
      var _GetPath = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee33(key) {
        var _this8 = this;

        return regeneratorRuntime.wrap(function _callee33$(_context33) {
          while (1) {
            switch (_context33.prev = _context33.next) {
              case 0:
                return _context33.abrupt("return", new Promise(function (resolve, reject) {
                  var store = _this8.GetObjectStore(_this8.DB_PATH_STORE, 'readonly');

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
                return _context33.stop();
            }
          }
        }, _callee33);
      }));

      function GetPath(_x15) {
        return _GetPath.apply(this, arguments);
      }

      return GetPath;
    }()
  }, {
    key: "GetAllPaths",
    value: function () {
      var _GetAllPaths = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee34() {
        var _this9 = this;

        return regeneratorRuntime.wrap(function _callee34$(_context34) {
          while (1) {
            switch (_context34.prev = _context34.next) {
              case 0:
                return _context34.abrupt("return", new Promise(function (resolve, reject) {
                  var store = _this9.GetObjectStore(_this9.DB_PATH_STORE, 'readonly');

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
                return _context34.stop();
            }
          }
        }, _callee34);
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
      var _StorePoint = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee35(key, val) {
        var _this10 = this;

        return regeneratorRuntime.wrap(function _callee35$(_context35) {
          while (1) {
            switch (_context35.prev = _context35.next) {
              case 0:
                if (!(this.bulkStores !== null && this.bulkStores.has(this.DB_POINT_STORE))) {
                  _context35.next = 4;
                  break;
                }

                if (this.pointBulkBuffer === null) this.pointBulkBuffer = new Map();
                this.pointBulkBuffer.set(key, val);
                return _context35.abrupt("return", Promise.resolve());

              case 4:
                return _context35.abrupt("return", new Promise(function (resolve, reject) {
                  var store = _this10.GetObjectStore(_this10.DB_POINT_STORE, 'readwrite');

                  var req;

                  try {
                    req = store.add(val, key);
                  } catch (e) {
                    if (e.name === 'DataCloneError') LocalError("This engine doesn't know how to clone a Blob, use Firefox");
                    throw e;
                  }

                  req.onsuccess = function () {
                    resolve();
                  };

                  req.onerror = function () {
                    LocalError("StorePoint error", this.error);
                    reject();
                  };
                }));

              case 5:
              case "end":
                return _context35.stop();
            }
          }
        }, _callee35, this);
      }));

      function StorePoint(_x16, _x17) {
        return _StorePoint.apply(this, arguments);
      }

      return StorePoint;
    }()
  }, {
    key: "StoreAllPoints",
    value: function () {
      var _StoreAllPoints = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee36() {
        var _this11 = this;

        var values,
            _args36 = arguments;
        return regeneratorRuntime.wrap(function _callee36$(_context36) {
          while (1) {
            switch (_context36.prev = _context36.next) {
              case 0:
                values = _args36.length > 0 && _args36[0] !== undefined ? _args36[0] : null;
                if (!values) values = this.pointBulkBuffer;

                if (!(!values || this.bulkStores === null)) {
                  _context36.next = 4;
                  break;
                }

                return _context36.abrupt("return", Promise.reject());

              case 4:
                return _context36.abrupt("return", new Promise(function (resolve, reject) {
                  var store = _this11.GetObjectStore(_this11.DB_POINT_STORE, 'readwrite');

                  try {
                    values.forEach(function (v, key) {
                      store.add(v, key);
                    });
                    _this11.pointBulkBuffer = null;
                    resolve();
                  } catch (e) {
                    LocalError("This engine doesn't know how to clone a Blob, use Firefox");
                    reject(e);
                  }
                }));

              case 5:
              case "end":
                return _context36.stop();
            }
          }
        }, _callee36, this);
      }));

      function StoreAllPoints() {
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
      var _StoreState = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee37(key, gameState) {
        var _this12 = this;

        return regeneratorRuntime.wrap(function _callee37$(_context37) {
          while (1) {
            switch (_context37.prev = _context37.next) {
              case 0:
                return _context37.abrupt("return", new Promise(function (resolve, reject) {
                  var store = _this12.GetObjectStore(_this12.DB_STATE_STORE, 'readwrite');

                  var req;

                  try {
                    req = store.add(gameState, key);
                  } catch (e) {
                    if (e.name === 'DataCloneError') LocalError("This engine doesn't know how to clone a Blob, use Firefox");
                    throw e;
                  }

                  req.onsuccess = function () {
                    resolve();
                  };

                  req.onerror = function () {
                    LocalError("StoreState error", this.error);
                    reject();
                  };
                }));

              case 1:
              case "end":
                return _context37.stop();
            }
          }
        }, _callee37);
      }));

      function StoreState(_x18, _x19) {
        return _StoreState.apply(this, arguments);
      }

      return StoreState;
    }()
  }, {
    key: "UpdateState",
    value: function () {
      var _UpdateState = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee38(key, gameState) {
        var _this13 = this;

        return regeneratorRuntime.wrap(function _callee38$(_context38) {
          while (1) {
            switch (_context38.prev = _context38.next) {
              case 0:
                return _context38.abrupt("return", new Promise(function (resolve, reject) {
                  var store = _this13.GetObjectStore(_this13.DB_STATE_STORE, 'readwrite');

                  var req;

                  try {
                    req = store.put(gameState, key);
                  } catch (e) {
                    if (e.name === 'DataCloneError') LocalError("This engine doesn't know how to clone a Blob, use Firefox");
                    throw e;
                  }

                  req.onsuccess = function () {
                    resolve();
                  };

                  req.onerror = function () {
                    LocalError("UpdateState error", this.error);
                    reject();
                  };
                }));

              case 1:
              case "end":
                return _context38.stop();
            }
          }
        }, _callee38);
      }));

      function UpdateState(_x20, _x21) {
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
      var _StorePath = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee39(key, val) {
        var _this14 = this;

        return regeneratorRuntime.wrap(function _callee39$(_context39) {
          while (1) {
            switch (_context39.prev = _context39.next) {
              case 0:
                if (!(this.bulkStores !== null && this.bulkStores.has(this.DB_PATH_STORE))) {
                  _context39.next = 4;
                  break;
                }

                if (this.pathBulkBuffer === null) this.pathBulkBuffer = new Map();
                this.pathBulkBuffer.set(key, val);
                return _context39.abrupt("return", Promise.resolve());

              case 4:
                return _context39.abrupt("return", new Promise(function (resolve, reject) {
                  var store = _this14.GetObjectStore(_this14.DB_PATH_STORE, 'readwrite');

                  var req;

                  try {
                    req = store.add(val, key);
                  } catch (e) {
                    if (e.name === 'DataCloneError') LocalError("This engine doesn't know how to clone a Blob, use Firefox");
                    throw e;
                  }

                  req.onsuccess = function () {
                    resolve();
                  };

                  req.onerror = function () {
                    LocalError("StorePath error", this.error);
                    reject();
                  };
                }));

              case 5:
              case "end":
                return _context39.stop();
            }
          }
        }, _callee39, this);
      }));

      function StorePath(_x22, _x23) {
        return _StorePath.apply(this, arguments);
      }

      return StorePath;
    }()
  }, {
    key: "StoreAllPaths",
    value: function () {
      var _StoreAllPaths = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee40() {
        var _this15 = this;

        var values,
            _args40 = arguments;
        return regeneratorRuntime.wrap(function _callee40$(_context40) {
          while (1) {
            switch (_context40.prev = _context40.next) {
              case 0:
                values = _args40.length > 0 && _args40[0] !== undefined ? _args40[0] : null;
                if (!values) values = this.pathBulkBuffer;

                if (!(!values || this.bulkStores === null)) {
                  _context40.next = 4;
                  break;
                }

                return _context40.abrupt("return", Promise.reject());

              case 4:
                return _context40.abrupt("return", new Promise(function (resolve, reject) {
                  var store = _this15.GetObjectStore(_this15.DB_PATH_STORE, 'readwrite');

                  try {
                    values.forEach(function (v, key) {
                      store.add(v, key);
                    });
                    _this15.pathBulkBuffer = null;
                    resolve();
                  } catch (e) {
                    LocalError("This engine doesn't know how to clone a Blob, use Firefox");
                    reject(e);
                  }
                }));

              case 5:
              case "end":
                return _context40.stop();
            }
          }
        }, _callee40, this);
      }));

      function StoreAllPaths() {
        return _StoreAllPaths.apply(this, arguments);
      }

      return StoreAllPaths;
    }()
  }, {
    key: "PrepareStore",
    value: function () {
      var _PrepareStore5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee41() {
        var game_state, idb_state;
        return regeneratorRuntime.wrap(function _callee41$(_context41) {
          while (1) {
            switch (_context41.prev = _context41.next) {
              case 0:
                if (this.PointStore.GetAllPoints) {
                  _context41.next = 2;
                  break;
                }

                return _context41.abrupt("return", false);

              case 2:
                if (!(this.g_DB === null)) {
                  _context41.next = 7;
                  break;
                }

                _context41.next = 5;
                return this.OpenDb();

              case 5:
                _context41.next = 8;
                break;

              case 7:
                return _context41.abrupt("return", false);

              case 8:
                //all initiated, just exit
                game_state = this.PointStore.GetGameStateCallback();
                _context41.next = 11;
                return this.GetState(game_state.iGameID);

              case 11:
                idb_state = _context41.sent;

                if (idb_state) {
                  _context41.next = 20;
                  break;
                }

                _context41.next = 15;
                return this.ClearAllStores();

              case 15:
                _context41.next = 17;
                return this.StoreState(game_state.iGameID, game_state);

              case 17:
                return _context41.abrupt("return", false);

              case 20:
                if (!(idb_state.sLastMoveGameTimeStamp !== game_state.sLastMoveGameTimeStamp)) {
                  _context41.next = 26;
                  break;
                }

                _context41.next = 23;
                return this.ClearAllStores();

              case 23:
                return _context41.abrupt("return", false);

              case 26:
                if (!(game_state.bPointsAndPathsLoaded === false)) {
                  _context41.next = 48;
                  break;
                }

                _context41.prev = 27;
                _context41.next = 30;
                return this.BeginBulkStorage([this.DB_POINT_STORE, this.DB_PATH_STORE], 'readonly');

              case 30:
                _context41.next = 32;
                return this.PointStore.PrepareStore();

              case 32:
                _context41.t1 = _context41.sent;
                _context41.t0 = _context41.t1 !== true;

                if (_context41.t0) {
                  _context41.next = 39;
                  break;
                }

                _context41.next = 37;
                return this.PathStore.PrepareStore();

              case 37:
                _context41.t2 = _context41.sent;
                _context41.t0 = _context41.t2 !== true;

              case 39:
                if (!_context41.t0) {
                  _context41.next = 43;
                  break;
                }

                _context41.next = 42;
                return this.ClearAllStores();

              case 42:
                return _context41.abrupt("return", false);

              case 43:
                return _context41.abrupt("return", true);

              case 44:
                _context41.prev = 44;
                _context41.next = 47;
                return this.EndBulkStorage([this.DB_POINT_STORE, this.DB_PATH_STORE]);

              case 47:
                return _context41.finish(44);

              case 48:
              case "end":
                return _context41.stop();
            }
          }
        }, _callee41, this, [[27,, 44, 48]]);
      }));

      function PrepareStore() {
        return _PrepareStore5.apply(this, arguments);
      }

      return PrepareStore;
    }()
    /**
     * Load all needed stores upfront
     * @param {any} storeName array or string of store to load
     * @param {any} mode - readonly/readwrite
     */

  }, {
    key: "BeginBulkStorage",
    value: function () {
      var _BeginBulkStorage5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee42(storeName, mode) {
        var keys, tx, _iterator3, _step3, key;

        return regeneratorRuntime.wrap(function _callee42$(_context42) {
          while (1) {
            switch (_context42.prev = _context42.next) {
              case 0:
                if (this.bulkStores === null) this.bulkStores = new Map();
                keys = Array.isArray(storeName) ? storeName : [storeName];
                tx = null;
                _iterator3 = _createForOfIteratorHelper(keys);

                try {
                  for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                    key = _step3.value;

                    if (!this.bulkStores.has(key)) {
                      if (tx === null) tx = this.g_DB.transaction(keys, mode);
                      this.bulkStores.set(key, tx.objectStore(key));
                    }
                  }
                } catch (err) {
                  _iterator3.e(err);
                } finally {
                  _iterator3.f();
                }

              case 5:
              case "end":
                return _context42.stop();
            }
          }
        }, _callee42, this);
      }));

      function BeginBulkStorage(_x24, _x25) {
        return _BeginBulkStorage5.apply(this, arguments);
      }

      return BeginBulkStorage;
    }()
  }, {
    key: "EndBulkStorage",
    value: function () {
      var _EndBulkStorage5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee43(storeName) {
        var keys, _iterator4, _step4, key;

        return regeneratorRuntime.wrap(function _callee43$(_context43) {
          while (1) {
            switch (_context43.prev = _context43.next) {
              case 0:
                if (this.bulkStores !== null) {
                  keys = Array.isArray(storeName) ? storeName : [storeName];
                  _iterator4 = _createForOfIteratorHelper(keys);

                  try {
                    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                      key = _step4.value;

                      if (this.bulkStores.has(key)) {
                        this.bulkStores["delete"](key);
                      }
                    }
                  } catch (err) {
                    _iterator4.e(err);
                  } finally {
                    _iterator4.f();
                  }

                  if (this.bulkStores.size <= 0) this.bulkStores = null;
                }

              case 1:
              case "end":
                return _context43.stop();
            }
          }
        }, _callee43, this);
      }));

      function EndBulkStorage(_x26) {
        return _EndBulkStorage5.apply(this, arguments);
      }

      return EndBulkStorage;
    }()
  }]);

  return GameStateStore;
}();



/***/ })

}]);