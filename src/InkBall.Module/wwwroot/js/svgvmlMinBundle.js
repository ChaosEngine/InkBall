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
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GameStateStore", function() { return GameStateStore; });


function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

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

var SVG = !1;
var svgNS = "http://www.w3.org/2000/svg";
var $createOval,
    $createPolyline,
    $RemovePolyline,
    $RemoveOval,
    $createSVGVML,
    $createLine,
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
        r = _ref.y;
    return t.x += e, t.y += r, t;
  }, {
    x: 0,
    y: 0
  });
  e.x /= t.length, e.y /= t.length;
  return t.map(function (_ref2) {
    var t = _ref2.x,
        r = _ref2.y;
    return {
      x: t,
      y: r,
      angle: 180 * Math.atan2(r - e.y, t - e.x) / Math.PI
    };
  }).sort(function (t, e) {
    return t.angle - e.angle;
  });
}

SVG ? ($createSVGVML = function $createSVGVML(t, e, r, s) {
  return cont = document.createElementNS(svgNS, "svg"), e && cont.setAttributeNS(null, "width", e), r && cont.setAttributeNS(null, "height", r), t.appendChild(cont), svgAntialias = s, cont;
}, $createLine = function $createLine(t, e, r) {
  var s = document.createElementNS(svgNS, "line");
  return s.setAttribute("shape-rendering", svgAntialias ? "auto" : "optimizeSpeed"), s.setAttribute("stroke-width", Math.round(t) + "px"), e && s.setAttribute("stroke", e), r && s.setAttribute("stroke-linecap", r), s.$move = function (t, e, r, s) {
    this.setAttribute("x1", t), this.setAttribute("y1", e), this.setAttribute("x2", r), this.setAttribute("y2", s);
  }, s.$RGBcolor = function (t, e, r) {
    this.setAttribute("stroke", "rgb(" + Math.round(t) + "," + Math.round(e) + "," + Math.round(r) + ")");
  }, s.$SetColor = function (t) {
    this.setAttribute("stroke", t);
  }, s.$strokeWidth = function (t) {
    this.setAttribute("stroke-width", Math.round(t) + "px");
  }, cont.appendChild(s), s;
}, $createPolyline = function $createPolyline(t, e, r) {
  var s = document.createElementNS(svgNS, "polyline");
  return s.setAttribute("shape-rendering", svgAntialias ? "auto" : "optimizeSpeed"), s.setAttribute("stroke-width", Math.round(t)), r && s.setAttribute("stroke", r), s.setAttribute("fill", r), s.setAttribute("fill-opacity", "0.1"), e && s.setAttribute("points", e), s.setAttribute("stroke-linecap", "round"), s.setAttribute("stroke-linejoin", "round"), cont.appendChild(s), s.setAttribute("data-id", 0), s.$AppendPoints = function (t, e, r, s) {
    var i = this.getAttribute("points"),
        o = i.split(" ");
    if (!0 === hasDuplicates(o)) return !1;
    var n;
    if (o.length <= 1 || 2 !== (n = o[o.length - 1].split(",")).length) return !1;
    var a = parseInt(n[0]),
        u = parseInt(n[1]),
        h = parseInt(t),
        l = parseInt(e);
    return Math.abs(a - h) <= r && Math.abs(u - l) <= s && (this.setAttribute("points", i + " ".concat(t, ",").concat(e)), !0);
  }, s.$RemoveLastPoint = function () {
    var t = this.getAttribute("points").replace(/(\s\d+,\d+)$/, "");
    return this.setAttribute("points", t), t;
  }, s.$ContainsPoint = function (t, e) {
    var r = new RegExp("".concat(t, ",").concat(e), "g");
    return (this.getAttribute("points").match(r) || []).length;
  }, s.$GetPointsString = function () {
    return this.getAttribute("points");
  }, s.$GetPointsArray = function () {
    return this.getAttribute("points").split(" ").map(function (t) {
      var e = t.split(",");
      return {
        x: parseInt(e[0]),
        y: parseInt(e[1])
      };
    });
  }, s.$SetPoints = function (t) {
    this.setAttribute("points", t);
  }, s.$GetIsClosed = function () {
    var t = this.getAttribute("points").split(" ");
    return t[0] === t[t.length - 1];
  }, s.$GetLength = function () {
    return this.getAttribute("points").split(" ").length;
  }, s.$SetWidthAndColor = function (t, e) {
    this.setAttribute("stroke", e), this.setAttribute("fill", e), this.setAttribute("stroke-width", Math.round(t));
  }, s.$GetID = function () {
    return parseInt(this.getAttribute("data-id"));
  }, s.$SetID = function (t) {
    this.setAttribute("data-id", t);
  }, s.$GetFillColor = function () {
    return this.getAttribute("fill");
  }, s;
}, $createOval = function $createOval(t) {
  var e = document.createElementNS(svgNS, "circle");
  return e.setAttribute("shape-rendering", svgAntialias ? "auto" : "optimizeSpeed"), e.setAttribute("stroke-width", 0), e.setAttribute("r", Math.round(t >> 1)), e.setAttribute("data-status", -1), e.$move = function (t, e, r) {
    this.setAttribute("cx", t), this.setAttribute("cy", e), this.setAttribute("r", Math.round(r));
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
}) : $createSVGVML = function $createSVGVML() {
  return alert("SVG is not supported!"), !1;
};

var GameStateStore = /*#__PURE__*/function () {
  function GameStateStore() {
    var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : !0;
    var e = arguments.length > 1 ? arguments[1] : undefined;
    var r = arguments.length > 2 ? arguments[2] : undefined;
    var s = arguments.length > 3 ? arguments[3] : undefined;

    _classCallCheck(this, GameStateStore);

    this.DB_NAME = "InkballGame", this.DB_POINT_STORE = "points", this.DB_PATH_STORE = "paths", this.DB_STATE_STORE = "state", this.DB_VERSION = 2, this.g_DB, t ? "indexedDB" in window ? (this.PointStore = new IDBPointStore(this, e, s), this.PathStore = new IDBPathStore(this, r, s)) : (console.log("This browser doesn't support IndexedDB"), this.PointStore = new SimplePointStore(), this.PathStore = new SimplePathStore()) : (this.PointStore = new SimplePointStore(), this.PathStore = new SimplePathStore());
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
                return _context.abrupt("return", (console.log("OpenDb ..."), new Promise(function (t, e) {
                  var r = indexedDB.open(_this.DB_NAME, _this.DB_VERSION);
                  r.onsuccess = function (e) {
                    this.g_DB = e.currentTarget.result, console.log("OpenDb DONE"), t(e.currentTarget.result);
                  }.bind(_this), r.onerror = function (t) {
                    console.error("OpenDb:", t.target.errorCode), e();
                  }, r.onupgradeneeded = function (t) {
                    console.log("OpenDb.onupgradeneeded");
                    var e = Array.from(t.currentTarget.result.objectStoreNames);
                    e.includes(this.DB_POINT_STORE) && t.currentTarget.result.deleteObjectStore(this.DB_POINT_STORE), e.includes(this.DB_PATH_STORE) && t.currentTarget.result.deleteObjectStore(this.DB_PATH_STORE), e.includes(this.DB_STATE_STORE) && t.currentTarget.result.deleteObjectStore(this.DB_STATE_STORE);
                    t.currentTarget.result.createObjectStore(this.DB_POINT_STORE, {
                      autoIncrement: !1
                    }), t.currentTarget.result.createObjectStore(this.DB_PATH_STORE, {
                      autoIncrement: !1
                    }), t.currentTarget.result.createObjectStore(this.DB_STATE_STORE, {
                      autoIncrement: !1
                    });
                  }.bind(_this);
                })));

              case 1:
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
  }, {
    key: "GetObjectStore",
    value: function GetObjectStore(t, e) {
      if (this.bulkStores && this.bulkStores.has(t)) return this.bulkStores.get(t);
      return this.g_DB.transaction(t, e).objectStore(t);
    }
  }, {
    key: "ClearObjectStore",
    value: function () {
      var _ClearObjectStore = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(t) {
        var _this2 = this;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", new Promise(function (e, r) {
                  var s = _this2.GetObjectStore(t, "readwrite").clear();

                  s.onsuccess = function () {
                    e();
                  }, s.onerror = function (t) {
                    console.error("clearObjectStore:", t.target.errorCode), r();
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
  }, {
    key: "GetPoint",
    value: function () {
      var _GetPoint = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(t) {
        var _this3 = this;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                return _context3.abrupt("return", new Promise(function (e, r) {
                  var s = _this3.GetObjectStore(_this3.DB_POINT_STORE, "readonly").get(t);

                  s.onerror = function (t) {
                    r(new Error("GetPoint => " + t));
                  }, s.onsuccess = function (t) {
                    e(t.target.result);
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
                return _context4.abrupt("return", new Promise(function (t, e) {
                  var r = _this4.GetObjectStore(_this4.DB_POINT_STORE, "readonly"),
                      s = [],
                      i = r.openCursor();

                  i.onsuccess = function (e) {
                    var r = e.target.result;
                    r ? (s.push(r.value), r["continue"]()) : t(s);
                  }, i.onerror = function (t) {
                    e(new Error("GetAllPoints => " + t));
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
      var _GetState = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(t) {
        var _this5 = this;

        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                return _context5.abrupt("return", new Promise(function (e, r) {
                  var s = _this5.GetObjectStore(_this5.DB_STATE_STORE, "readonly").get(t);

                  s.onerror = function (t) {
                    r(new Error("GetState => " + t));
                  }, s.onsuccess = function (t) {
                    e(t.target.result);
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
  }, {
    key: "GetPath",
    value: function () {
      var _GetPath = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(t) {
        var _this6 = this;

        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                return _context6.abrupt("return", new Promise(function (e, r) {
                  var s = _this6.GetObjectStore(_this6.DB_PATH_STORE, "readonly").get(t);

                  s.onerror = function (t) {
                    r(new Error("GetPath => " + t));
                  }, s.onsuccess = function (t) {
                    e(t.target.result);
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
                return _context7.abrupt("return", new Promise(function (t, e) {
                  var r = _this7.GetObjectStore(_this7.DB_PATH_STORE, "readonly"),
                      s = [],
                      i = r.openCursor();

                  i.onsuccess = function (e) {
                    var r = e.target.result;
                    r ? (s.push(r.value), r["continue"]()) : t(s);
                  }, i.onerror = function (t) {
                    e(new Error("GetAllPaths => " + t));
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
  }, {
    key: "StorePoint",
    value: function () {
      var _StorePoint = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(t, e) {
        var _this8 = this;

        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                return _context8.abrupt("return", this.bulkStores && this.bulkStores.has(this.DB_POINT_STORE) ? (this.bulkBuffer || (this.bulkBuffer = new Map()), this.bulkBuffer.set(t, e), Promise.resolve()) : new Promise(function (r, s) {
                  var i = _this8.GetObjectStore(_this8.DB_POINT_STORE, "readwrite");

                  var o;

                  try {
                    o = i.add(e, t);
                  } catch (t) {
                    throw "DataCloneError" === t.name && console.error("This engine doesn't know how to clone a Blob, use Firefox"), t;
                  }

                  o.onsuccess = function () {
                    r();
                  }, o.onerror = function () {
                    console.error("StorePoint error", this.error), s();
                  };
                }));

              case 1:
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
      var _StoreAllPoints = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(t) {
        var _this9 = this;

        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                return _context9.abrupt("return", (t || (t = this.bulkBuffer), t && this.bulkStores ? new Promise(function (e, r) {
                  var s = _this9.GetObjectStore(_this9.DB_POINT_STORE, "readwrite");

                  try {
                    t.forEach(function (t, e) {
                      s.add(t, e);
                    }), _this9.bulkBuffer = null, e();
                  } catch (t) {
                    console.error("This engine doesn't know how to clone a Blob, use Firefox"), r(t);
                  }
                }) : Promise.reject()));

              case 1:
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
  }, {
    key: "StoreState",
    value: function () {
      var _StoreState = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(t, e) {
        var _this10 = this;

        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                return _context10.abrupt("return", new Promise(function (r, s) {
                  var i = _this10.GetObjectStore(_this10.DB_STATE_STORE, "readwrite");

                  var o;

                  try {
                    o = i.add(e, t);
                  } catch (t) {
                    throw "DataCloneError" === t.name && console.error("This engine doesn't know how to clone a Blob, use Firefox"), t;
                  }

                  o.onsuccess = function () {
                    r();
                  }, o.onerror = function () {
                    console.error("StoreState error", this.error), s();
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
      var _UpdateState = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(t, e) {
        var _this11 = this;

        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                return _context11.abrupt("return", new Promise(function (r, s) {
                  var i = _this11.GetObjectStore(_this11.DB_STATE_STORE, "readwrite");

                  var o;

                  try {
                    o = i.put(e, t);
                  } catch (t) {
                    throw "DataCloneError" === t.name && console.error("This engine doesn't know how to clone a Blob, use Firefox"), t;
                  }

                  o.onsuccess = function () {
                    r();
                  }, o.onerror = function () {
                    console.error("UpdateState error", this.error), s();
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
  }, {
    key: "StorePath",
    value: function () {
      var _StorePath = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(t, e) {
        var _this12 = this;

        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                return _context12.abrupt("return", new Promise(function (r, s) {
                  var i = _this12.GetObjectStore(_this12.DB_PATH_STORE, "readwrite");

                  var o;

                  try {
                    o = i.add(e, t);
                  } catch (t) {
                    throw "DataCloneError" === t.name && console.error("This engine doesn't know how to clone a Blob, use Firefox"), t;
                  }

                  o.onsuccess = function () {
                    r();
                  }, o.onerror = function () {
                    console.error("StorePath error", this.error), s();
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
        var t, e;
        return regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                if (this.PointStore.GetAllPoints) {
                  _context13.next = 2;
                  break;
                }

                return _context13.abrupt("return", !1);

              case 2:
                if (!this.g_DB) {
                  _context13.next = 4;
                  break;
                }

                return _context13.abrupt("return", !1);

              case 4:
                _context13.next = 6;
                return this.OpenDb();

              case 6:
                t = this.PointStore.GetGameStateCallback();
                _context13.next = 9;
                return this.GetState(t.iGameID);

              case 9:
                e = _context13.sent;

                if (e) {
                  _context13.next = 16;
                  break;
                }

                _context13.next = 13;
                return Promise.all([this.ClearObjectStore(this.DB_POINT_STORE), this.ClearObjectStore(this.DB_PATH_STORE), this.ClearObjectStore(this.DB_STATE_STORE)]);

              case 13:
                _context13.next = 15;
                return this.StoreState(t.iGameID, t);

              case 15:
                return _context13.abrupt("return", !1);

              case 16:
                if (!(e.sLastMoveGameTimeStamp !== t.sLastMoveGameTimeStamp)) {
                  _context13.next = 20;
                  break;
                }

                _context13.next = 19;
                return Promise.all([this.ClearObjectStore(this.DB_POINT_STORE), this.ClearObjectStore(this.DB_PATH_STORE), this.ClearObjectStore(this.DB_STATE_STORE)]);

              case 19:
                return _context13.abrupt("return", !1);

              case 20:
                if (!(!1 === t.bPointsAndPathsLoaded)) {
                  _context13.next = 45;
                  break;
                }

                _context13.prev = 21;
                _context13.next = 24;
                return this.BeginBulkStorage([this.DB_POINT_STORE, this.DB_PATH_STORE], "readonly");

              case 24:
                _context13.t2 = !0;
                _context13.next = 27;
                return this.PointStore.PrepareStore();

              case 27:
                _context13.t3 = _context13.sent;
                _context13.t1 = _context13.t2 === _context13.t3;

                if (!_context13.t1) {
                  _context13.next = 35;
                  break;
                }

                _context13.t4 = !0;
                _context13.next = 33;
                return this.PathStore.PrepareStore();

              case 33:
                _context13.t5 = _context13.sent;
                _context13.t1 = _context13.t4 === _context13.t5;

              case 35:
                _context13.t0 = _context13.t1;

                if (_context13.t0) {
                  _context13.next = 40;
                  break;
                }

                _context13.next = 39;
                return Promise.all([this.ClearObjectStore(this.DB_POINT_STORE), this.ClearObjectStore(this.DB_PATH_STORE), this.ClearObjectStore(this.DB_STATE_STORE)]);

              case 39:
                _context13.t0 = !1;

              case 40:
                return _context13.abrupt("return", _context13.t0);

              case 41:
                _context13.prev = 41;
                _context13.next = 44;
                return this.EndBulkStorage([this.DB_POINT_STORE, this.DB_PATH_STORE]);

              case 44:
                return _context13.finish(41);

              case 45:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, this, [[21,, 41, 45]]);
      }));

      function PrepareStore() {
        return _PrepareStore.apply(this, arguments);
      }

      return PrepareStore;
    }()
  }, {
    key: "BeginBulkStorage",
    value: function () {
      var _BeginBulkStorage = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(t, e) {
        var r, s;
        return regeneratorRuntime.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                this.bulkStores || (this.bulkStores = new Map());
                r = t;

                if (!this.bulkStores.has(r)) {
                  s = this.g_DB.transaction(t, e);
                  Array.isArray(t) ? (this.bulkStores.set(r[0], s.objectStore(t[0])), this.bulkStores.set(r[1], s.objectStore(t[1]))) : this.bulkStores.set(r, s.objectStore(t));
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
      var _EndBulkStorage = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(t) {
        return regeneratorRuntime.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                this.bulkStores && (Array.isArray(t) ? (this.bulkStores["delete"](t[0]), this.bulkStores["delete"](t[1])) : this.bulkStores["delete"](t), this.bulkStores.size <= 0 && (this.bulkStores = null));

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
                return _context16.abrupt("return", !0);

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
      var _has = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19(t) {
        return regeneratorRuntime.wrap(function _callee19$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                return _context19.abrupt("return", this.store.has(t));

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
      var _set = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee20(t, e) {
        return regeneratorRuntime.wrap(function _callee20$(_context20) {
          while (1) {
            switch (_context20.prev = _context20.next) {
              case 0:
                return _context20.abrupt("return", this.store.set(t, e));

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
      var _get = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee21(t) {
        return regeneratorRuntime.wrap(function _callee21$(_context21) {
          while (1) {
            switch (_context21.prev = _context21.next) {
              case 0:
                return _context21.abrupt("return", this.store.get(t));

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

  function IDBPointStore(t, e, r) {
    var _this13;

    _classCallCheck(this, IDBPointStore);

    _this13 = _super.call(this), _this13.MainGameStateStore = t, _this13.GetPoint = t.GetPoint.bind(_this13.MainGameStateStore), _this13.StorePoint = t.StorePoint.bind(_this13.MainGameStateStore), _this13.GetAllPoints = t.GetAllPoints.bind(_this13.MainGameStateStore), _this13.UpdateState = t.UpdateState.bind(_this13.MainGameStateStore), _this13.PointCreationCallback = e, _this13.GetGameStateCallback = r;
    return _this13;
  }

  _createClass(IDBPointStore, [{
    key: "PrepareStore",
    value: function () {
      var _PrepareStore3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee23() {
        var t, e, _iterator, _step, r, _t, s;

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
                t = _context23.sent;
                e = this.GetGameStateCallback();
                _iterator = _createForOfIteratorHelper(t);
                _context23.prev = 6;

                _iterator.s();

              case 8:
                if ((_step = _iterator.n()).done) {
                  _context23.next = 17;
                  break;
                }

                r = _step.value;
                _context23.next = 12;
                return this.PointCreationCallback(r.x, r.y, r.Status, r.Color);

              case 12:
                _t = _context23.sent;
                s = r.y * e.iGridWidth + r.x;
                this.store.set(s, _t);

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
                return _context23.abrupt("return", !0);

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
                return this.MainGameStateStore.BeginBulkStorage(this.MainGameStateStore.DB_POINT_STORE, "readwrite");

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
      var _has2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee26(t) {
        return regeneratorRuntime.wrap(function _callee26$(_context26) {
          while (1) {
            switch (_context26.prev = _context26.next) {
              case 0:
                return _context26.abrupt("return", this.store.has(t));

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
      var _set2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee27(t, e) {
        var r, s, i, o;
        return regeneratorRuntime.wrap(function _callee27$(_context27) {
          while (1) {
            switch (_context27.prev = _context27.next) {
              case 0:
                r = this.GetGameStateCallback(), s = e.$GetPosition(), i = e.$GetFillColor(), o = {
                  x: parseInt(s.x) / r.iGridSizeX,
                  y: parseInt(s.y) / r.iGridSizeY,
                  Status: e.$GetStatus(),
                  Color: i
                };
                _context27.next = 3;
                return this.StorePoint(t, o);

              case 3:
                _context27.t0 = this.UpdateState && !0 === r.bPointsAndPathsLoaded;

                if (!_context27.t0) {
                  _context27.next = 7;
                  break;
                }

                _context27.next = 7;
                return this.UpdateState(r.iGameID, r);

              case 7:
                return _context27.abrupt("return", this.store.set(t, e));

              case 8:
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
      var _get2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee28(t) {
        var e, r;
        return regeneratorRuntime.wrap(function _callee28$(_context28) {
          while (1) {
            switch (_context28.prev = _context28.next) {
              case 0:
                e = this.store.get(t);

                if (e) {
                  _context28.next = 6;
                  break;
                }

                _context28.next = 4;
                return this.GetPoint(t);

              case 4:
                r = _context28.sent;
                return _context28.abrupt("return", r && this.PointCreationCallback ? (e = this.PointCreationCallback(r.x, r.y, r.Status, r.Color), this.store.set(t, e), e) : void 0);

              case 6:
                return _context28.abrupt("return", e);

              case 7:
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
        var t;
        return regeneratorRuntime.wrap(function _callee29$(_context29) {
          while (1) {
            switch (_context29.prev = _context29.next) {
              case 0:
                t = this.store.values();
                _context29.t0 = t;

                if (_context29.t0) {
                  _context29.next = 7;
                  break;
                }

                _context29.next = 5;
                return this.GetAllPoints();

              case 5:
                t = _context29.sent;
                _context29.t0 = t;

              case 7:
                return _context29.abrupt("return", _context29.t0);

              case 8:
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
                return _context30.abrupt("return", !0);

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
      var _push = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee33(t) {
        return regeneratorRuntime.wrap(function _callee33$(_context33) {
          while (1) {
            switch (_context33.prev = _context33.next) {
              case 0:
                return _context33.abrupt("return", this.store.push(t));

              case 1:
              case "end":
                return _context33.stop();
            }
          }
        }, _callee33, this);
      }));

      function push(_x25) {
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

  function IDBPathStore(t, e, r) {
    var _this14;

    _classCallCheck(this, IDBPathStore);

    _this14 = _super2.call(this), _this14.MainGameStateStore = t, _this14.GetAllPaths = t.GetAllPaths.bind(_this14.MainGameStateStore), _this14.StorePath = t.StorePath.bind(_this14.MainGameStateStore), _this14.UpdateState = t.UpdateState.bind(_this14.MainGameStateStore), _this14.PathCreationCallback = e, _this14.GetGameStateCallback = r;
    return _this14;
  }

  _createClass(IDBPathStore, [{
    key: "PrepareStore",
    value: function () {
      var _PrepareStore5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee35() {
        var t, _iterator2, _step2, e, _t2;

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
                t = _context35.sent;
                _iterator2 = _createForOfIteratorHelper(t);
                _context35.prev = 5;

                _iterator2.s();

              case 7:
                if ((_step2 = _iterator2.n()).done) {
                  _context35.next = 15;
                  break;
                }

                e = _step2.value;
                _context35.next = 11;
                return this.PathCreationCallback(e.PointsAsString, e.Color, e.iId);

              case 11:
                _t2 = _context35.sent;
                this.store.push(_t2);

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
                return _context35.abrupt("return", !0);

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
                return this.MainGameStateStore.BeginBulkStorage([this.MainGameStateStore.DB_POINT_STORE, this.MainGameStateStore.DB_PATH_STORE], "readwrite");

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
      var _push2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee38(t) {
        var e, r, _t3;

        return regeneratorRuntime.wrap(function _callee38$(_context38) {
          while (1) {
            switch (_context38.prev = _context38.next) {
              case 0:
                e = t.$GetID(), r = {
                  iId: e,
                  Color: t.$GetFillColor(),
                  PointsAsString: t.$GetPointsString()
                };
                _context38.next = 3;
                return this.StorePath(e, r);

              case 3:
                if (!this.UpdateState) {
                  _context38.next = 9;
                  break;
                }

                _t3 = this.GetGameStateCallback();
                _context38.t0 = !0 === _t3.bPointsAndPathsLoaded;

                if (!_context38.t0) {
                  _context38.next = 9;
                  break;
                }

                _context38.next = 9;
                return this.UpdateState(_t3.iGameID, _t3);

              case 9:
                return _context38.abrupt("return", this.store.push(t));

              case 10:
              case "end":
                return _context38.stop();
            }
          }
        }, _callee38, this);
      }));

      function push(_x26) {
        return _push2.apply(this, arguments);
      }

      return push;
    }()
  }, {
    key: "all",
    value: function () {
      var _all2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee39() {
        var t;
        return regeneratorRuntime.wrap(function _callee39$(_context39) {
          while (1) {
            switch (_context39.prev = _context39.next) {
              case 0:
                t = this.store;
                _context39.t0 = t;

                if (_context39.t0) {
                  _context39.next = 7;
                  break;
                }

                _context39.next = 5;
                return this.GetAllPaths();

              case 5:
                t = _context39.sent;
                _context39.t0 = t;

              case 7:
                return _context39.abrupt("return", _context39.t0);

              case 8:
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
}(SimplePathStore);



/***/ })
]]);