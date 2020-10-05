(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[3],[
/* 0 */,
/* 1 */
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


function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e4) { throw _e4; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e5) { didErr = true; err = _e5; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

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

var SVG = !1;
var svgNS = "http://www.w3.org/2000/svg";
var $createOval,
    $createPolyline,
    $RemovePolyline,
    $RemoveOval,
    $createSVGVML,
    $createLine,
    PointStore,
    PathStore,
    svgAntialias = !1,
    cont = null;

if (document.createElementNS) {
  SVG = null !== document.createElementNS(svgNS, "svg").x;
}

function hasDuplicates(t) {
  return new Set(t).size !== t.length;
}

function sortPointsClockwise(t) {
  var e = t.reduce(function (t, _ref) {
    var e = _ref.x,
        n = _ref.y;
    return t.x += e, t.y += n, t;
  }, {
    x: 0,
    y: 0
  });
  e.x /= t.length, e.y /= t.length;
  return t.map(function (_ref2) {
    var t = _ref2.x,
        n = _ref2.y;
    return {
      x: t,
      y: n,
      angle: 180 * Math.atan2(n - e.y, t - e.x) / Math.PI
    };
  }).sort(function (t, e) {
    return t.angle - e.angle;
  });
}

SVG ? ($createSVGVML = function $createSVGVML(t, e, n, r) {
  return cont = document.createElementNS(svgNS, "svg"), t.appendChild(cont), svgAntialias = r, cont;
}, $createLine = function $createLine(t, e, n) {
  var r = document.createElementNS(svgNS, "line");
  return r.setAttribute("shape-rendering", svgAntialias ? "auto" : "optimizeSpeed"), r.setAttribute("stroke-width", Math.round(t) + "px"), e && r.setAttribute("stroke", e), n && r.setAttribute("stroke-linecap", n), r.$move = function (t, e, n, r) {
    this.setAttribute("x1", t), this.setAttribute("y1", e), this.setAttribute("x2", n), this.setAttribute("y2", r);
  }, r.$RGBcolor = function (t, e, n) {
    this.setAttribute("stroke", "rgb(" + Math.round(t) + "," + Math.round(e) + "," + Math.round(n) + ")");
  }, r.$SetColor = function (t) {
    this.setAttribute("stroke", t);
  }, r.$strokeWidth = function (t) {
    this.setAttribute("stroke-width", Math.round(t) + "px");
  }, cont.appendChild(r), r;
}, $createPolyline = function $createPolyline(t, e, n) {
  var r = document.createElementNS(svgNS, "polyline");
  return r.setAttribute("shape-rendering", svgAntialias ? "auto" : "optimizeSpeed"), r.setAttribute("stroke-width", Math.round(t)), n && r.setAttribute("stroke", n), r.setAttribute("fill", n), r.setAttribute("fill-opacity", "0.1"), e && r.setAttribute("points", e), r.setAttribute("stroke-linecap", "round"), r.setAttribute("stroke-linejoin", "round"), cont.appendChild(r), r.setAttribute("data-id", 0), r.$AppendPoints = function (t, e) {
    var n = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 16;
    var r = this.getAttribute("points"),
        o = r.split(" ");
    if (!0 === hasDuplicates(o)) return !1;
    var i;
    if (o.length <= 1 || 2 !== (i = o[o.length - 1].split(",")).length) return !1;
    var s = parseInt(i[0]),
        a = parseInt(i[1]),
        u = parseInt(t),
        c = parseInt(e);
    return Math.abs(s - u) <= n && Math.abs(a - c) <= n && (this.setAttribute("points", r + " ".concat(t, ",").concat(e)), !0);
  }, r.$RemoveLastPoint = function () {
    var t = this.getAttribute("points").replace(/(\s\d+,\d+)$/, "");
    return this.setAttribute("points", t), t;
  }, r.$ContainsPoint = function (t, e) {
    var n = new RegExp("".concat(t, ",").concat(e), "g");
    return (this.getAttribute("points").match(n) || []).length;
  }, r.$GetPointsString = function () {
    return this.getAttribute("points");
  }, r.$GetPointsArray = function () {
    return this.getAttribute("points").split(" ").map(function (t) {
      var e = t.split(",");
      return {
        x: parseInt(e[0]),
        y: parseInt(e[1])
      };
    });
  }, r.$SetPoints = function (t) {
    this.setAttribute("points", t);
  }, r.$GetIsClosed = function () {
    var t = this.getAttribute("points").split(" ");
    return t[0] === t[t.length - 1];
  }, r.$GetLength = function () {
    return this.getAttribute("points").split(" ").length;
  }, r.$SetWidthAndColor = function (t, e) {
    this.setAttribute("stroke", e), this.setAttribute("fill", e), this.setAttribute("stroke-width", Math.round(t));
  }, r.$GetID = function () {
    return parseInt(this.getAttribute("data-id"));
  }, r.$SetID = function (t) {
    this.setAttribute("data-id", t);
  }, r.$GetFillColor = function () {
    return this.getAttribute("fill");
  }, r;
}, $createOval = function $createOval(t) {
  var e = document.createElementNS(svgNS, "circle");
  return e.setAttribute("shape-rendering", svgAntialias ? "auto" : "optimizeSpeed"), e.setAttribute("stroke-width", 0), e.setAttribute("r", Math.round(t >> 1)), e.setAttribute("data-status", -1), e.$move = function (t, e, n) {
    this.setAttribute("cx", t), this.setAttribute("cy", e), this.setAttribute("r", Math.round(n));
  }, e.$GetStrokeColor = function () {
    return this.getAttribute("stroke");
  }, e.$SetStrokeColor = function (t) {
    this.setAttribute("stroke", t);
  }, e.$GetPosition = function () {
    return {
      x: this.getAttribute("cx"),
      y: this.getAttribute("cy")
    };
  }, e.$GetFillColor = function () {
    return this.getAttribute("fill");
  }, e.$SetFillColor = function (t) {
    this.setAttribute("fill", t);
  }, e.$GetStatus = function () {
    return parseInt(this.getAttribute("data-status"));
  }, e.$SetStatus = function (t) {
    var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : !1;

    if (e) {
      var _e = parseInt(this.getAttribute("data-status"));

      this.setAttribute("data-status", t), -1 !== _e && _e !== t && this.setAttribute("data-old-status", _e);
    } else this.setAttribute("data-status", t);
  }, e.$RevertOldStatus = function () {
    var t = this.getAttribute("data-old-status");
    return t ? (this.removeAttribute("data-old-status"), this.setAttribute("data-status", t), parseInt(t)) : -1;
  }, e.$GetZIndex = function () {
    return this.getAttribute("z-index");
  }, e.$SetZIndex = function (t) {
    this.setAttribute("z-index", t);
  }, e.$Hide = function () {
    this.setAttribute("visibility", "hidden");
  }, e.$Show = function () {
    this.setAttribute("visibility", "visible");
  }, e.$strokeWeight = function (t) {
    this.setAttribute("stroke-width", t);
  }, cont.appendChild(e), e;
}, $RemoveOval = function $RemoveOval(t) {
  cont.removeChild(t);
}, $RemovePolyline = function $RemovePolyline(t) {
  cont.removeChild(t);
}) : document.createStyleSheet ? ($createSVGVML = function $createSVGVML(t, e, n, r) {
  document.namespaces.add("v", "urn:schemas-microsoft-com:vml");
  var o = document.createStyleSheet();
  return o.addRule("v\\:*", "behavior: url(#default#VML);"), o.addRule("v\\:*", "antialias: " + r + ";"), cont = t, t;
}, $createLine = function $createLine(t, e, n) {
  var r = document.createElement("v:line");

  if (r.strokeweight = Math.round(t) + "px", e && (r.strokecolor = e), r.$move = function (t, e, n, r) {
    this.to = t + "," + e, this.from = n + "," + r;
  }, r.$RGBcolor = function (t, e, n) {
    this.strokecolor = "rgb(" + Math.round(t) + "," + Math.round(e) + "," + Math.round(n) + ")";
  }, r.$SetColor = function (t) {
    this.strokecolor = t;
  }, r.$strokeWidth = function (t) {
    this.strokeweight = Math.round(t) + "px";
  }, n) {
    var _t = document.createElement("v:stroke");

    _t.endcap = n, r.appendChild(_t);
  }

  return cont.appendChild(r), r;
}, $createPolyline = function $createPolyline(t, e, n) {
  var r = document.createElement("v:polyline");
  r.strokeweight = Math.round(t) + "px", n && (r.strokecolor = n), r.points = e;
  var o = document.createElement("v:fill");
  return o.color = n, o.opacity = .1, r.appendChild(o), cont.appendChild(r), r.setAttribute("data-id", 0), r.$AppendPoints = function (t, e) {
    var n = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 16;
    var r = this.points.value,
        o = r.split(" ");
    if (!0 === hasDuplicates(o)) return !1;
    var i;
    if (o.length <= 1 || 2 !== (i = o[o.length - 1].split(",")).length) return !1;
    var s = parseInt(i[0]),
        a = parseInt(i[1]),
        u = parseInt(t),
        c = parseInt(e);
    return Math.abs(s - u) <= n && Math.abs(a - c) <= n && (this.points.value = r + " ".concat(t, ",").concat(e), !0);
  }, r.$RemoveLastPoint = function () {
    var t = this.points.value.replace(/(\s\d+,\d+)$/, "");
    return this.points.value = t, t;
  }, r.$ContainsPoint = function (t, e) {
    var n = new RegExp("".concat(t, ",").concat(e), "g");
    return (this.points.value.match(n) || []).length;
  }, r.$GetPointsString = function () {
    return r.points.value;
  }, r.$GetPointsArray = function () {
    return this.points.value.split(" ").map(function (t) {
      var e = t.split(",");
      return {
        x: parseInt(e[0]),
        y: parseInt(e[1])
      };
    });
  }, r.$SetPoints = function (t) {
    this.points.value = t;
  }, r.$GetIsClosed = function () {
    var t = this.points.value.split(" ");
    return t[0] === t[t.length - 1];
  }, r.$GetLength = function () {
    return this.points.value.split(" ").length;
  }, r.$SetWidthAndColor = function (t, e) {
    this.strokecolor = e, this.fill.color = e, this.strokeweight = Math.round(t) + "px";
  }, r.$GetID = function () {
    return parseInt(this.getAttribute("data-id"));
  }, r.$SetID = function (t) {
    this.setAttribute("data-id", t);
  }, r.$GetFillColor = function () {
    return this.fill.color;
  }, r;
}, $createOval = function $createOval(t, e) {
  var n = document.createElement("v:oval");
  return n.style.position = "absolute", n.setAttribute("data-status", -1), n.strokeweight = 1, n.filled = e, n.style.width = t + "px", n.style.height = t + "px", n.$move = function (t, e, n) {
    this.style.left = Math.round(t - n) + "px", this.style.top = Math.round(e - n) + "px", this.style.width = Math.round(2 * n) + "px", this.style.height = Math.round(2 * n) + "px";
  }, n.$GetStrokeColor = function () {
    return this.strokecolor;
  }, n.$SetStrokeColor = function (t) {
    this.strokecolor = t;
  }, n.$GetPosition = function () {
    return {
      x: parseInt(this.style.left) + .5 * parseInt(this.style.width),
      y: parseInt(this.style.top) + .5 * parseInt(this.style.height)
    };
  }, n.$GetFillColor = function () {
    return this.fillcolor;
  }, n.$SetFillColor = function (t) {
    this.fillcolor = t;
  }, n.$GetStatus = function () {
    return parseInt(this.getAttribute("data-status"));
  }, n.$SetStatus = function (t) {
    var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : !1;

    if (e) {
      var _e2 = parseInt(this.getAttribute("data-status"));

      this.setAttribute("data-status", t), -1 !== _e2 && _e2 !== t && this.setAttribute("data-old-status", _e2);
    } else this.setAttribute("data-status", t);
  }, n.$RevertOldStatus = function () {
    var t = this.getAttribute("data-old-status");
    return t ? (this.removeAttribute("data-old-status"), this.setAttribute("data-status", t), parseInt(t)) : -1;
  }, n.$GetZIndex = function () {
    return this.getAttribute("z-index");
  }, n.$SetZIndex = function (t) {
    this.setAttribute("z-index", t);
  }, n.$Hide = function () {
    this.setAttribute("visibility", "hidden");
  }, n.$Show = function () {
    this.setAttribute("visibility", "visible");
  }, n.$strokeWeight = function (t) {
    this.strokeweight = t;
  }, cont.appendChild(n), n;
}, $RemoveOval = function $RemoveOval(t) {
  cont.removeChild(t);
}, $RemovePolyline = function $RemovePolyline(t) {
  cont.removeChild(t);
}) : $createSVGVML = function $createSVGVML() {
  return alert("SVG or VML is not supported!"), !1;
};
var DB_NAME = "InkballGame",
    DB_POINT_STORE = "points",
    DB_PATH_STORE = "paths",
    DB_STATE_STORE = "state",
    DB_VERSION = 1;
var g_DB;

function OpenDb() {
  return _OpenDb.apply(this, arguments);
}

function _OpenDb() {
  _OpenDb = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14() {
    return regeneratorRuntime.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            return _context14.abrupt("return", (console.log("OpenDb ..."), new Promise(function (t, e) {
              var n = indexedDB.open(DB_NAME, 1);
              n.onsuccess = function () {
                g_DB = this.result, console.log("OpenDb DONE"), t(this.result);
              }, n.onerror = function (t) {
                console.error("OpenDb:", t.target.errorCode), e();
              }, n.onupgradeneeded = function (t) {
                console.log("OpenDb.onupgradeneeded");
                var e = Array.from(t.currentTarget.result.objectStoreNames);
                e.includes("points") && t.currentTarget.result.deleteObjectStore("points"), e.includes("paths") && t.currentTarget.result.deleteObjectStore("paths"), e.includes("state") && t.currentTarget.result.deleteObjectStore("state");
                var n = t.currentTarget.result.createObjectStore("points", {
                  autoIncrement: !1
                });
                n.createIndex("Status", "Status", {
                  unique: !1
                }), n.createIndex("Color", "Color", {
                  unique: !1
                });
                t.currentTarget.result.createObjectStore("paths", {
                  autoIncrement: !1
                }).createIndex("iPlayerId", "iPlayerId", {
                  unique: !1
                });
                t.currentTarget.result.createObjectStore("state", {
                  autoIncrement: !1
                });
              };
            })));

          case 1:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14);
  }));
  return _OpenDb.apply(this, arguments);
}

function GetObjectStore(t, e) {
  return g_DB.transaction(t, e).objectStore(t);
}

function ClearObjectStore(_x) {
  return _ClearObjectStore.apply(this, arguments);
}

function _ClearObjectStore() {
  _ClearObjectStore = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(t) {
    return regeneratorRuntime.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            return _context15.abrupt("return", new Promise(function (e, n) {
              var r = GetObjectStore(t, "readwrite").clear();
              r.onsuccess = function () {
                e();
              }, r.onerror = function (t) {
                console.error("clearObjectStore:", t.target.errorCode), n();
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
  _GetPoint = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16(t) {
    return regeneratorRuntime.wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            return _context16.abrupt("return", new Promise(function (e, n) {
              var r = GetObjectStore("points", "readonly").get(t);
              r.onerror = function (t) {
                n(new Error("GetPoint => " + t));
              }, r.onsuccess = function (t) {
                e(t.target.result);
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
            return _context17.abrupt("return", new Promise(function (t, e) {
              var n = GetObjectStore("points", "readonly").getAll();
              n.onsuccess = function (e) {
                t(e.target.result);
              }, n.onerror = function (t) {
                e(new Error("GetAllPoints => " + t));
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

function _GetState() {
  _GetState = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18(t) {
    return regeneratorRuntime.wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            return _context18.abrupt("return", new Promise(function (e, n) {
              var r = GetObjectStore("state", "readonly").get(t);
              r.onerror = function (t) {
                n(new Error("GetState => " + t));
              }, r.onsuccess = function (t) {
                e(t.target.result);
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
  _GetPath = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19(t) {
    return regeneratorRuntime.wrap(function _callee19$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            return _context19.abrupt("return", new Promise(function (e, n) {
              var r = GetObjectStore("paths", "readonly").get(t);
              r.onerror = function (t) {
                n(new Error("GetPath => " + t));
              }, r.onsuccess = function (t) {
                e(t.target.result);
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

function _GetAllPaths() {
  _GetAllPaths = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee20() {
    return regeneratorRuntime.wrap(function _callee20$(_context20) {
      while (1) {
        switch (_context20.prev = _context20.next) {
          case 0:
            return _context20.abrupt("return", new Promise(function (t, e) {
              var n = GetObjectStore("paths", "readonly").getAll();
              n.onsuccess = function (e) {
                t(e.target.result);
              }, n.onerror = function (t) {
                e(new Error("GetAllPaths => " + t));
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

function _StorePoint() {
  _StorePoint = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee21(t, e) {
    return regeneratorRuntime.wrap(function _callee21$(_context21) {
      while (1) {
        switch (_context21.prev = _context21.next) {
          case 0:
            return _context21.abrupt("return", new Promise(function (n, r) {
              var o = e.$GetPosition(),
                  i = e.$GetFillColor(),
                  s = {
                x: o.x / 16,
                y: o.y / 16,
                Status: e.$GetStatus(),
                Color: i
              },
                  a = GetObjectStore("points", "readwrite");
              var u;

              try {
                u = a.add(s, t);
              } catch (t) {
                throw "DataCloneError" == t.name && console.error("This engine doesn't know how to clone a Blob, use Firefox"), t;
              }

              u.onsuccess = function () {
                n();
              }, u.onerror = function () {
                console.error("StorePoint error", this.error), r();
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

function _StoreState() {
  _StoreState = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee22(t, e) {
    return regeneratorRuntime.wrap(function _callee22$(_context22) {
      while (1) {
        switch (_context22.prev = _context22.next) {
          case 0:
            return _context22.abrupt("return", new Promise(function (n, r) {
              var o = {
                iGameID: e.g_iGameID,
                iPlayerID: e.g_iPlayerID,
                iOtherPlayerId: e.m_iOtherPlayerId,
                sLastMoveGameTimeStamp: e.m_sLastMoveGameTimeStamp
              },
                  i = GetObjectStore("state", "readwrite");
              var s;

              try {
                s = i.add(o, t);
              } catch (t) {
                throw "DataCloneError" == t.name && console.error("This engine doesn't know how to clone a Blob, use Firefox"), t;
              }

              s.onsuccess = function () {
                n();
              }, s.onerror = function () {
                console.error("StoreState error", this.error), r();
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

function _StorePath() {
  _StorePath = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee23(t, e) {
    return regeneratorRuntime.wrap(function _callee23$(_context23) {
      while (1) {
        switch (_context23.prev = _context23.next) {
          case 0:
            return _context23.abrupt("return", new Promise(function (n, r) {
              var o = {
                Color: e.$GetFillColor(),
                PointsAsString: e.$GetPointsString()
              },
                  i = GetObjectStore("paths", "readwrite");
              var s;

              try {
                s = i.add(o, t);
              } catch (t) {
                throw "DataCloneError" == t.name && console.error("This engine doesn't know how to clone a Blob, use Firefox"), t;
              }

              s.onsuccess = function () {
                n();
              }, s.onerror = function () {
                console.error("StorePath error", this.error), r();
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

function DeletePublicationFromBib(t) {
  console.log("deletePublicationFromBib:", arguments);
  var e = GetObjectStore("points", "readwrite"),
      n = e.index("pos");
  n.get(t).onsuccess = function (t) {
    void 0 !== t.target.result ? DeletePublication(t.target.result.id, e) : console.error("No matching record found");
  }, n.onerror = function (t) {
    console.error("deletePublicationFromBib:", t.target.errorCode);
  };
}

function DeletePublication(t, e) {
  console.log("deletePublication:", arguments), void 0 === e && (e = GetObjectStore("points", "readwrite"));
  var n = e.get(t);
  n.onsuccess = function (r) {
    var o = r.target.result;
    console.log("record:", o), void 0 !== o ? (n = e["delete"](t), n.onsuccess = function (t) {
      console.log("evt:", t), console.log("evt.target:", t.target), console.log("evt.target.result:", t.target.result), console.log("delete successful"), console.log("Deletion successful");
    }, n.onerror = function (t) {
      console.error("deletePublication:", t.target.errorCode);
    }) : console.error("No matching record found");
  }, n.onerror = function (t) {
    console.error("deletePublication:", t.target.errorCode);
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
      var _has = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(t) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", this.store.has(t));

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
      var _set = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(t, e) {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                return _context3.abrupt("return", this.store.set(t, e));

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
      var _get = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(t) {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                return _context4.abrupt("return", this.store.get(t));

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
      var _PrepareStore2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(t) {
        var e, _t2, _iterator, _step, _e3;

        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.t0 = g_DB;

                if (_context6.t0) {
                  _context6.next = 4;
                  break;
                }

                _context6.next = 4;
                return OpenDb();

              case 4:
                t.CreateScreenPointFromIndexedDb && (this.PointCreationCallback = t.CreateScreenPointFromIndexedDb.bind(t));
                _context6.next = 7;
                return GetState(t.g_iGameID);

              case 7:
                e = _context6.sent;

                if (!e) {
                  _context6.next = 26;
                  break;
                }

                if (!(e.sLastMoveGameTimeStamp !== t.m_sLastMoveGameTimeStamp)) {
                  _context6.next = 18;
                  break;
                }

                _context6.next = 12;
                return ClearObjectStore("points");

              case 12:
                _context6.next = 14;
                return ClearObjectStore("paths");

              case 14:
                _context6.next = 16;
                return ClearObjectStore("state");

              case 16:
                _context6.next = 24;
                break;

              case 18:
                if (!(t.m_bPointsAndPathsLoaded = !0, this.PointCreationCallback)) {
                  _context6.next = 24;
                  break;
                }

                _context6.next = 21;
                return this.values();

              case 21:
                _t2 = _context6.sent;
                _iterator = _createForOfIteratorHelper(_t2);

                try {
                  for (_iterator.s(); !(_step = _iterator.n()).done;) {
                    _e3 = _step.value;
                    this.PointCreationCallback(_e3.x, _e3.y, _e3.Status, _e3.Color);
                  }
                } catch (err) {
                  _iterator.e(err);
                } finally {
                  _iterator.f();
                }

              case 24:
                _context6.next = 34;
                break;

              case 26:
                _context6.next = 28;
                return ClearObjectStore("points");

              case 28:
                _context6.next = 30;
                return ClearObjectStore("paths");

              case 30:
                _context6.next = 32;
                return ClearObjectStore("state");

              case 32:
                _context6.next = 34;
                return StoreState(t.g_iGameID, t);

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
      var _has2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(t) {
        var e;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return GetPoint(t);

              case 2:
                e = _context7.sent;
                return _context7.abrupt("return", null != e);

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
      var _set2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(t, e) {
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return StorePoint(t, e);

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
      var _get2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(t) {
        var e;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.next = 2;
                return GetPoint(t);

              case 2:
                e = _context9.sent;

                if (!(e && this.PointCreationCallback)) {
                  _context9.next = 5;
                  break;
                }

                return _context9.abrupt("return", this.PointCreationCallback(e.x, e.y, e.Status, e.Color));

              case 5:
                return _context9.abrupt("return", null);

              case 6:
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
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.next = 2;
                return GetAllPoints();

              case 2:
                return _context10.abrupt("return", _context10.sent);

              case 3:
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
    value: function push(t) {
      return this.store.push(t);
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
      var _PrepareStore3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(t) {
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                t.CreateScreenPathFromIndexedDb && (this.PathCreationCallback = t.CreateScreenPathFromIndexedDb.bind(t));

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
      var _push = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(t) {
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                _context12.next = 2;
                return StorePath(t.$GetID(), t);

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
        return regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                _context13.next = 2;
                return GetAllPaths();

              case 2:
                return _context13.abrupt("return", _context13.sent);

              case 3:
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
}(SimplePathStore);

"indexedDB" in window ? (PointStore = IDBPointStore, PathStore = IDBPathStore) : (console.log("This browser doesn't support IndexedDB"), PointStore = SimplePointStore, PathStore = SimplePathStore);


/***/ })
]]);