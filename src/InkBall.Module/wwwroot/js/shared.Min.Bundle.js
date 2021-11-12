"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([[51],{

/***/ 980:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SvgVml": function() { return /* binding */ u; },
/* harmony export */   "StatusEnum": function() { return /* binding */ t; },
/* harmony export */   "pnpoly": function() { return /* binding */ n; },
/* harmony export */   "pnpoly2": function() { return /* binding */ i; },
/* harmony export */   "LocalLog": function() { return /* binding */ e; },
/* harmony export */   "LocalError": function() { return /* binding */ r; },
/* harmony export */   "hasDuplicates": function() { return /* binding */ s; },
/* harmony export */   "sortPointsClockwise": function() { return /* binding */ l; },
/* harmony export */   "Sleep": function() { return /* binding */ o; },
/* harmony export */   "isESModuleSupport": function() { return /* binding */ a; },
/* harmony export */   "GameStateStore": function() { return /* binding */ h; }
/* harmony export */ });


function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e5) { throw _e5; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e6) { didErr = true; err = _e6; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var t = Object.freeze({
  POINT_FREE_RED: -3,
  POINT_FREE_BLUE: -2,
  POINT_FREE: -1,
  POINT_STARTING: 0,
  POINT_IN_PATH: 1,
  POINT_OWNED_BY_RED: 2,
  POINT_OWNED_BY_BLUE: 3
});

function e(t) {
  console.log(t);
}

function r() {
  var e = "";

  for (var _r = 0; _r < arguments.length; _r++) {
    var _n = _r < 0 || arguments.length <= _r ? undefined : arguments[_r];

    _n && (e += _n);
  }

  console.error(e);
}

function n(t, e, r, n, i) {
  var s,
      o,
      a = !1;

  for (s = 0, o = t - 1; s < t; o = s++) {
    (r[s] <= i && i < r[o] || r[o] <= i && i < r[s]) && n < (e[o] - e[s]) * (i - r[s]) / (r[o] - r[s]) + e[s] && (a = !a);
  }

  return a;
}

function i(t, e, r) {
  var n = t.length;
  var i,
      s,
      o = !1;

  for (i = 0, s = n - 1; i < n; s = i++) {
    var _n2 = t[i],
        _a = t[s];
    (_n2.y <= r && r < _a.y || _a.y <= r && r < _n2.y) && e < (_a.x - _n2.x) * (r - _n2.y) / (_a.y - _n2.y) + _n2.x && (o = !o);
  }

  return o;
}

function s(t) {
  return new Set(t).size !== t.length;
}

function o(_x) {
  return _o.apply(this, arguments);
}

function _o() {
  _o = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee44(t) {
    return regeneratorRuntime.wrap(function _callee44$(_context44) {
      while (1) {
        switch (_context44.prev = _context44.next) {
          case 0:
            return _context44.abrupt("return", new Promise(function (e) {
              return setTimeout(e, t);
            }));

          case 1:
          case "end":
            return _context44.stop();
        }
      }
    }, _callee44);
  }));
  return _o.apply(this, arguments);
}

function a() {
  return "noModule" in HTMLScriptElement.prototype;
}

function l(t) {
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

var u = /*#__PURE__*/function () {
  function u() {
    _classCallCheck(this, u);

    var e = "http://www.w3.org/2000/svg";
    var r,
        n,
        i = !1,
        o = !1;
    this.cont = null, self && self.document && self.document.createElementNS && (this.cont = document.createElementNS(e, "svg"), i = null !== this.cont.x), i ? (r = function () {
      return this.cont;
    }.bind(this), n = function n(t) {
      switch (t) {
        case "circle":
        case "line":
        case "polyline":
          return document.createElementNS(e, t);

        default:
          throw new Error("unknwn type ".concat(t));
      }
    }) : (r = function r() {
      return {
        attributes: new Map(),
        children: [],
        setAttributeNS: function setAttributeNS(t, e, r) {
          this.attributes.set(e, r);
        },
        appendChild: function appendChild(t) {
          this.children.push(t);
        },
        removeChild: function removeChild(t) {
          var e = this.children.indexOf(t);
          -1 !== e && this.children.splice(e, 1);
        }
      };
    }, self.SVGCircleElement = function () {
      this.attributes = new Map();
    }, SVGCircleElement.prototype.setAttribute = function (t, e) {
      this.attributes.set(t, e);
    }, SVGCircleElement.prototype.getAttribute = function (t) {
      return this.attributes.get(t);
    }, SVGCircleElement.prototype.removeAttribute = function (t) {
      this.attributes.delete(t);
    }, self.SVGLineElement = function () {
      this.attributes = new Map();
    }, SVGLineElement.prototype.setAttribute = function (t, e) {
      this.attributes.set(t, e);
    }, SVGLineElement.prototype.getAttribute = function (t) {
      return this.attributes.get(t);
    }, SVGLineElement.prototype.removeAttribute = function (t) {
      this.attributes.delete(t);
    }, self.SVGPolylineElement = function () {
      this.attributes = new Map();
    }, SVGPolylineElement.prototype.setAttribute = function (t, e) {
      this.attributes.set(t, e);
    }, SVGPolylineElement.prototype.getAttribute = function (t) {
      return this.attributes.get(t);
    }, SVGPolylineElement.prototype.removeAttribute = function (t) {
      this.attributes.delete(t);
    }, n = function n(t) {
      switch (t) {
        case "circle":
          return new SVGCircleElement();

        case "line":
          return new SVGLineElement();

        case "polyline":
          return new SVGPolylineElement();

        default:
          throw new Error("unknwn type ".concat(t));
      }
    }), SVGCircleElement.prototype.move = function (t, e, r) {
      this.setAttribute("cx", t), this.setAttribute("cy", e), this.setAttribute("r", Math.round(r));
    }, SVGCircleElement.prototype.GetStrokeColor = function () {
      return this.getAttribute("stroke");
    }, SVGCircleElement.prototype.SetStrokeColor = function (t) {
      this.setAttribute("stroke", t);
    }, SVGCircleElement.prototype.GetPosition = function () {
      return {
        x: this.getAttribute("cx"),
        y: this.getAttribute("cy")
      };
    }, SVGCircleElement.prototype.GetFillColor = function () {
      return this.getAttribute("fill");
    }, SVGCircleElement.prototype.SetFillColor = function (t) {
      this.setAttribute("fill", t);
    }, SVGCircleElement.prototype.GetStatus = function () {
      return parseInt(this.getAttribute("data-status"));
    }, SVGCircleElement.prototype.SetStatus = function (e) {
      var r = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : !1;

      if (r) {
        var _r2 = parseInt(this.getAttribute("data-status"));

        this.setAttribute("data-status", e), _r2 !== t.POINT_FREE && _r2 !== e && this.setAttribute("data-old-status", _r2);
      } else this.setAttribute("data-status", e);
    }, SVGCircleElement.prototype.RevertOldStatus = function () {
      var t = this.getAttribute("data-old-status");
      return t ? (this.removeAttribute("data-old-status"), this.setAttribute("data-status", t), parseInt(t)) : -1;
    }, SVGCircleElement.prototype.GetZIndex = function () {
      return this.getAttribute("z-index");
    }, SVGCircleElement.prototype.SetZIndex = function (t) {
      this.setAttribute("z-index", t);
    }, SVGCircleElement.prototype.Hide = function () {
      this.setAttribute("visibility", "hidden");
    }, SVGCircleElement.prototype.Show = function () {
      this.setAttribute("visibility", "visible");
    }, SVGCircleElement.prototype.strokeWeight = function (t) {
      this.setAttribute("stroke-width", t);
    }, SVGCircleElement.prototype.Serialize = function () {
      var _this$GetPosition = this.GetPosition(),
          t = _this$GetPosition.x,
          e = _this$GetPosition.y;

      return {
        x: t,
        y: e,
        Status: this.GetStatus(),
        Color: this.GetFillColor()
      };
    }, SVGLineElement.prototype.move = function (t, e, r, n) {
      this.setAttribute("x1", t), this.setAttribute("y1", e), this.setAttribute("x2", r), this.setAttribute("y2", n);
    }, SVGLineElement.prototype.RGBcolor = function (t, e, r) {
      this.setAttribute("stroke", "rgb(" + Math.round(t) + "," + Math.round(e) + "," + Math.round(r) + ")");
    }, SVGLineElement.prototype.SetColor = function (t) {
      this.setAttribute("stroke", t);
    }, SVGLineElement.prototype.strokeWidth = function (t) {
      this.setAttribute("stroke-width", Math.round(t) + "px");
    }, SVGPolylineElement.prototype.AppendPoints = function (t, e, r, n) {
      var i = this.getAttribute("points"),
          o = i.split(" ");
      if (!0 === s(o)) return !1;
      var a;
      if (o.length <= 1 || 2 !== (a = o[o.length - 1].split(",")).length) return !1;
      var l = parseInt(a[0]),
          u = parseInt(a[1]),
          h = parseInt(t),
          c = parseInt(e);
      return Math.abs(l - h) <= r && Math.abs(u - c) <= n && (this.setAttribute("points", i + " ".concat(t, ",").concat(e)), !0);
    }, SVGPolylineElement.prototype.RemoveLastPoint = function () {
      var t = this.getAttribute("points").replace(/(\s\d+,\d+)$/, "");
      return this.setAttribute("points", t), t;
    }, SVGPolylineElement.prototype.ContainsPoint = function (t, e) {
      var r = new RegExp("".concat(t, ",").concat(e), "g");
      return (this.getAttribute("points").match(r) || []).length;
    }, SVGPolylineElement.prototype.GetPointsString = function () {
      return this.getAttribute("points");
    }, SVGPolylineElement.prototype.GetPointsArray = function () {
      return this.getAttribute("points").split(" ").map(function (t) {
        var _t$split = t.split(","),
            _t$split2 = _slicedToArray(_t$split, 2),
            e = _t$split2[0],
            r = _t$split2[1];

        return {
          x: parseInt(e),
          y: parseInt(r)
        };
      });
    }, SVGPolylineElement.prototype.SetPoints = function (t) {
      this.setAttribute("points", t);
    }, SVGPolylineElement.prototype.GetIsClosed = function () {
      var t = this.getAttribute("points").split(" ");
      return t[0] === t[t.length - 1];
    }, SVGPolylineElement.prototype.GetLength = function () {
      return this.getAttribute("points").split(" ").length;
    }, SVGPolylineElement.prototype.SetWidthAndColor = function (t, e) {
      this.setAttribute("stroke", e), this.setAttribute("fill", e), this.setAttribute("stroke-width", Math.round(t));
    }, SVGPolylineElement.prototype.GetID = function () {
      return parseInt(this.getAttribute("data-id"));
    }, SVGPolylineElement.prototype.SetID = function (t) {
      this.setAttribute("data-id", t);
    }, SVGPolylineElement.prototype.GetFillColor = function () {
      return this.getAttribute("fill");
    }, SVGPolylineElement.prototype.IsPointInFill = function (t, e) {
      var n = r("svg").createSVGPoint();
      return n.x = t, n.y = e, this.isPointInFill(n);
    }, SVGPolylineElement.prototype.Serialize = function () {
      return {
        iId: this.GetID(),
        Color: this.GetFillColor(),
        PointsAsString: this.GetPointsString()
      };
    }, this.CreateSVGVML = function (t, e, n, s) {
      return this.cont = r("svg"), e && this.cont.setAttributeNS(null, "width", e), n && this.cont.setAttributeNS(null, "height", n), t && t.appendChild(this.cont), o = s, i ? this.cont : null;
    }, this.CreateLine = function (t, e, r) {
      var i = n("line");
      return i.setAttribute("shape-rendering", o ? "auto" : "optimizeSpeed"), i.setAttribute("stroke-width", Math.round(t) + "px"), e && i.setAttribute("stroke", e), r && i.setAttribute("stroke-linecap", r), this.cont.appendChild(i), i;
    }, this.CreatePolyline = function (t, e, r) {
      var i = n("polyline");
      return i.setAttribute("shape-rendering", o ? "auto" : "optimizeSpeed"), i.setAttribute("stroke-width", Math.round(t)), r && i.setAttribute("stroke", r), i.setAttribute("fill", r), i.setAttribute("fill-opacity", "0.1"), e && i.setAttribute("points", e), i.setAttribute("stroke-linecap", "round"), i.setAttribute("stroke-linejoin", "round"), i.setAttribute("data-id", 0), this.cont.appendChild(i), i;
    }, this.CreateOval = function (e) {
      var r = n("circle");
      return r.setAttribute("shape-rendering", o ? "auto" : "optimizeSpeed"), r.setAttribute("stroke-width", 0), r.setAttribute("r", Math.round(e >> 1)), r.setAttribute("data-status", t.POINT_FREE), this.cont.appendChild(r), r;
    };
  }

  _createClass(u, [{
    key: "RemoveOval",
    value: function RemoveOval(t) {
      this.cont.removeChild(t);
    }
  }, {
    key: "RemovePolyline",
    value: function RemovePolyline(t) {
      this.cont.removeChild(t);
    }
  }, {
    key: "DeserializeOval",
    value: function DeserializeOval(t) {
      var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;
      var r = t.x,
          n = t.y,
          i = t.Status,
          s = t.Color,
          o = this.CreateOval(4);
      return o.move(r, n, e), o.SetStrokeColor(s), o.SetFillColor(s), o.SetStatus(i), o;
    }
  }, {
    key: "DeserializePolyline",
    value: function DeserializePolyline(t) {
      var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
      var r = t.iId,
          n = t.Color,
          i = t.PointsAsString,
          s = this.CreatePolyline(e, i, n);
      return s.SetID(r), s;
    }
  }]);

  return u;
}();

var h = /*#__PURE__*/function () {
  function h(t) {
    var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var n = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var i = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    var s = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "";

    _classCallCheck(this, h);

    t ? "indexedDB" in self ? t = !0 : (r("This browser doesn't support IndexedDB"), t = !1) : t = !1;

    var o = /*#__PURE__*/function () {
      function o() {
        _classCallCheck(this, o);

        this.store = new Map();
      }

      _createClass(o, [{
        key: "PrepareStore",
        value: function () {
          var _PrepareStore = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    return _context.abrupt("return", !0);

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
          var _has = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(t) {
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    return _context4.abrupt("return", this.store.has(t));

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
          var _set = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(t, e) {
            return regeneratorRuntime.wrap(function _callee5$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    return _context5.abrupt("return", this.store.set(t, e));

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
          var _get = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(t) {
            return regeneratorRuntime.wrap(function _callee6$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    return _context6.abrupt("return", this.store.get(t));

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

      return o;
    }(),
        a = /*#__PURE__*/function () {
      function a() {
        _classCallCheck(this, a);

        this.store = [];
      }

      _createClass(a, [{
        key: "PrepareStore",
        value: function () {
          var _PrepareStore2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
            return regeneratorRuntime.wrap(function _callee9$(_context9) {
              while (1) {
                switch (_context9.prev = _context9.next) {
                  case 0:
                    return _context9.abrupt("return", !0);

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
          var _push = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(t) {
            return regeneratorRuntime.wrap(function _callee12$(_context12) {
              while (1) {
                switch (_context12.prev = _context12.next) {
                  case 0:
                    return _context12.abrupt("return", this.store.push(t));

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

      return a;
    }(),
        l = /*#__PURE__*/function (_o2) {
      _inherits(l, _o2);

      var _super = _createSuper(l);

      function l(t, e, r) {
        var _this;

        _classCallCheck(this, l);

        _this = _super.call(this), _this.MainGameStateStore = t, _this.GetPoint = t.GetPoint.bind(_this.MainGameStateStore), _this.StorePoint = t.StorePoint.bind(_this.MainGameStateStore), _this.GetAllPoints = t.GetAllPoints.bind(_this.MainGameStateStore), _this.UpdateState = t.UpdateState.bind(_this.MainGameStateStore), _this.PointCreationCallback = e, _this.GetGameStateCallback = r;
        return _this;
      }

      _createClass(l, [{
        key: "PrepareStore",
        value: function () {
          var _PrepareStore3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15() {
            var _t, _e2, _iterator, _step, _r3, _t2, _n3;

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
                    _t = _context15.sent;
                    _e2 = this.GetGameStateCallback();
                    _iterator = _createForOfIteratorHelper(_t);
                    _context15.prev = 6;

                    _iterator.s();

                  case 8:
                    if ((_step = _iterator.n()).done) {
                      _context15.next = 17;
                      break;
                    }

                    _r3 = _step.value;
                    _context15.next = 12;
                    return this.PointCreationCallback(_r3.x, _r3.y, _r3.Status, _r3.Color);

                  case 12:
                    _t2 = _context15.sent;
                    _n3 = _r3.y * _e2.iGridWidth + _r3.x;
                    this.store.set(_n3, _t2);

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
                    return _context15.abrupt("return", !0);

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
                    return this.MainGameStateStore.BeginBulkStorage(this.MainGameStateStore.DB_POINT_STORE, "readwrite");

                  case 2:
                    null === this.MainGameStateStore.pointBulkBuffer && (this.MainGameStateStore.pointBulkBuffer = new Map());

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
          var _has2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18(t) {
            return regeneratorRuntime.wrap(function _callee18$(_context18) {
              while (1) {
                switch (_context18.prev = _context18.next) {
                  case 0:
                    return _context18.abrupt("return", this.store.has(t));

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
          var _set2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19(t, e) {
            var r, n, i, s;
            return regeneratorRuntime.wrap(function _callee19$(_context19) {
              while (1) {
                switch (_context19.prev = _context19.next) {
                  case 0:
                    r = this.GetGameStateCallback(), n = e.GetPosition(), i = e.GetFillColor(), s = {
                      x: parseInt(n.x) / r.iGridSizeX,
                      y: parseInt(n.y) / r.iGridSizeY,
                      Status: e.GetStatus(),
                      Color: i
                    };
                    _context19.next = 3;
                    return this.StorePoint(t, s);

                  case 3:
                    _context19.t0 = this.UpdateState && !0 === r.bPointsAndPathsLoaded;

                    if (!_context19.t0) {
                      _context19.next = 7;
                      break;
                    }

                    _context19.next = 7;
                    return this.UpdateState(r.iGameID, r);

                  case 7:
                    return _context19.abrupt("return", this.store.set(t, e));

                  case 8:
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
          var _get2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee20(t) {
            return regeneratorRuntime.wrap(function _callee20$(_context20) {
              while (1) {
                switch (_context20.prev = _context20.next) {
                  case 0:
                    return _context20.abrupt("return", this.store.get(t));

                  case 1:
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
            var t;
            return regeneratorRuntime.wrap(function _callee21$(_context21) {
              while (1) {
                switch (_context21.prev = _context21.next) {
                  case 0:
                    t = this.store.values();
                    _context21.t0 = t;

                    if (_context21.t0) {
                      _context21.next = 7;
                      break;
                    }

                    _context21.next = 5;
                    return this.GetAllPoints();

                  case 5:
                    t = _context21.sent;
                    _context21.t0 = t;

                  case 7:
                    return _context21.abrupt("return", _context21.t0);

                  case 8:
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

      return l;
    }(o),
        u = /*#__PURE__*/function (_a2) {
      _inherits(u, _a2);

      var _super2 = _createSuper(u);

      function u(t, e, r) {
        var _this2;

        _classCallCheck(this, u);

        _this2 = _super2.call(this), _this2.MainGameStateStore = t, _this2.GetAllPaths = t.GetAllPaths.bind(_this2.MainGameStateStore), _this2.StorePath = t.StorePath.bind(_this2.MainGameStateStore), _this2.UpdateState = t.UpdateState.bind(_this2.MainGameStateStore), _this2.PathCreationCallback = e, _this2.GetGameStateCallback = r;
        return _this2;
      }

      _createClass(u, [{
        key: "PrepareStore",
        value: function () {
          var _PrepareStore4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee22() {
            var _t3, _iterator2, _step2, _e3, _t4;

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
                    _t3 = _context22.sent;
                    _iterator2 = _createForOfIteratorHelper(_t3);
                    _context22.prev = 5;

                    _iterator2.s();

                  case 7:
                    if ((_step2 = _iterator2.n()).done) {
                      _context22.next = 15;
                      break;
                    }

                    _e3 = _step2.value;
                    _context22.next = 11;
                    return this.PathCreationCallback(_e3.PointsAsString, _e3.Color, _e3.iId);

                  case 11:
                    _t4 = _context22.sent;
                    this.store.push(_t4);

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
                    return _context22.abrupt("return", !0);

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
                    return this.MainGameStateStore.BeginBulkStorage([this.MainGameStateStore.DB_POINT_STORE, this.MainGameStateStore.DB_PATH_STORE], "readwrite");

                  case 2:
                    null === this.MainGameStateStore.pathBulkBuffer && (this.MainGameStateStore.pathBulkBuffer = new Map());

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
          var _push2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee25(t) {
            var e, r, n;
            return regeneratorRuntime.wrap(function _callee25$(_context25) {
              while (1) {
                switch (_context25.prev = _context25.next) {
                  case 0:
                    e = this.GetGameStateCallback(), r = t.GetID(), n = {
                      iId: r,
                      Color: t.GetFillColor(),
                      PointsAsString: t.GetPointsString().split(" ").map(function (t) {
                        var r = t.split(","),
                            n = parseInt(r[0]),
                            i = parseInt(r[1]);
                        return "".concat(n / e.iGridSizeX, ",").concat(i / e.iGridSizeY);
                      }).join(" ")
                    };
                    _context25.next = 3;
                    return this.StorePath(r, n);

                  case 3:
                    _context25.t0 = this.UpdateState && !0 === e.bPointsAndPathsLoaded;

                    if (!_context25.t0) {
                      _context25.next = 7;
                      break;
                    }

                    _context25.next = 7;
                    return this.UpdateState(e.iGameID, e);

                  case 7:
                    return _context25.abrupt("return", this.store.push(t));

                  case 8:
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
            var t;
            return regeneratorRuntime.wrap(function _callee26$(_context26) {
              while (1) {
                switch (_context26.prev = _context26.next) {
                  case 0:
                    t = this.store;
                    _context26.t0 = t;

                    if (_context26.t0) {
                      _context26.next = 7;
                      break;
                    }

                    _context26.next = 5;
                    return this.GetAllPaths();

                  case 5:
                    t = _context26.sent;
                    _context26.t0 = t;

                  case 7:
                    return _context26.abrupt("return", _context26.t0);

                  case 8:
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

      return u;
    }(a);

    !0 === t ? (this.DB_NAME = "InkballGame", this.DB_POINT_STORE = "points", this.DB_PATH_STORE = "paths", this.DB_STATE_STORE = "state", this.g_DB = null, this.bulkStores = null, this.pointBulkBuffer = null, this.pathBulkBuffer = null, !s || "" === s || s.length <= 0 ? this.DB_VERSION = null : this.DB_VERSION = parseInt(s.split(".").reduce(function (t, e) {
      return e = parseInt(e), 10 * t + (isNaN(e) ? 0 : e);
    }, 0)) - 1010 + 4, this.PointStore = new l(this, e, i), this.PathStore = new u(this, n, i)) : (this.PointStore = new o(), this.PathStore = new a());
  }

  _createClass(h, [{
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
                return _context27.abrupt("return", (e("OpenDb ..."), new Promise(function (t, n) {
                  var i;
                  i = null !== _this3.DB_VERSION ? indexedDB.open(_this3.DB_NAME, _this3.DB_VERSION) : indexedDB.open(_this3.DB_NAME), i.onsuccess = function (r) {
                    this.g_DB = r.currentTarget.result, e("OpenDb DONE"), t(r.currentTarget.result);
                  }.bind(_this3), i.onerror = function (t) {
                    r("OpenDb:", t.target.errorCode || t.target.error), n();
                  }.bind(_this3), i.onupgradeneeded = function (t) {
                    e("OpenDb.onupgradeneeded(version: ".concat(this.DB_VERSION, ")"));
                    var r = Array.from(t.currentTarget.result.objectStoreNames);
                    r.includes(this.DB_POINT_STORE) && t.currentTarget.result.deleteObjectStore(this.DB_POINT_STORE), r.includes(this.DB_PATH_STORE) && t.currentTarget.result.deleteObjectStore(this.DB_PATH_STORE), r.includes(this.DB_STATE_STORE) && t.currentTarget.result.deleteObjectStore(this.DB_STATE_STORE), t.currentTarget.result.createObjectStore(this.DB_POINT_STORE, {
                      autoIncrement: !1
                    }), t.currentTarget.result.createObjectStore(this.DB_PATH_STORE, {
                      autoIncrement: !1
                    }), t.currentTarget.result.createObjectStore(this.DB_STATE_STORE, {
                      autoIncrement: !1
                    });
                  }.bind(_this3);
                })));

              case 1:
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
  }, {
    key: "GetObjectStore",
    value: function GetObjectStore(t, e) {
      if (null !== this.bulkStores && this.bulkStores.has(t)) return this.bulkStores.get(t);
      return this.g_DB.transaction(t, e).objectStore(t);
    }
  }, {
    key: "ClearAllStores",
    value: function () {
      var _ClearAllStores = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee29() {
        var t;
        return regeneratorRuntime.wrap(function _callee29$(_context29) {
          while (1) {
            switch (_context29.prev = _context29.next) {
              case 0:
                t = /*#__PURE__*/function () {
                  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee28(t) {
                    var _this4 = this;

                    return regeneratorRuntime.wrap(function _callee28$(_context28) {
                      while (1) {
                        switch (_context28.prev = _context28.next) {
                          case 0:
                            return _context28.abrupt("return", new Promise(function (e, n) {
                              var i = _this4.GetObjectStore(t, "readwrite").clear();

                              i.onsuccess = function () {
                                e();
                              }, i.onerror = function (t) {
                                r("clearObjectStore:", t.target.errorCode), n();
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
                return Promise.all([t(this.DB_POINT_STORE), t(this.DB_PATH_STORE), t(this.DB_STATE_STORE)]);

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
  }, {
    key: "GetPoint",
    value: function () {
      var _GetPoint = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee30(t) {
        var _this5 = this;

        return regeneratorRuntime.wrap(function _callee30$(_context30) {
          while (1) {
            switch (_context30.prev = _context30.next) {
              case 0:
                return _context30.abrupt("return", new Promise(function (e, r) {
                  var n = _this5.GetObjectStore(_this5.DB_POINT_STORE, "readonly").get(t);

                  n.onerror = function (t) {
                    r(new Error("GetPoint => " + t));
                  }, n.onsuccess = function (t) {
                    e(t.target.result);
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
                return _context31.abrupt("return", new Promise(function (t, e) {
                  var r = _this6.GetObjectStore(_this6.DB_POINT_STORE, "readonly"),
                      n = [],
                      i = r.openCursor();

                  i.onsuccess = function (e) {
                    var r = e.target.result;
                    r ? (n.push(r.value), r.continue()) : t(n);
                  }, i.onerror = function (t) {
                    e(new Error("GetAllPoints => " + t));
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
      var _GetState = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee32(t) {
        var _this7 = this;

        return regeneratorRuntime.wrap(function _callee32$(_context32) {
          while (1) {
            switch (_context32.prev = _context32.next) {
              case 0:
                return _context32.abrupt("return", new Promise(function (e, r) {
                  var n = _this7.GetObjectStore(_this7.DB_STATE_STORE, "readonly").get(t);

                  n.onerror = function (t) {
                    r(new Error("GetState => " + t));
                  }, n.onsuccess = function (t) {
                    e(t.target.result);
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
  }, {
    key: "GetPath",
    value: function () {
      var _GetPath = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee33(t) {
        var _this8 = this;

        return regeneratorRuntime.wrap(function _callee33$(_context33) {
          while (1) {
            switch (_context33.prev = _context33.next) {
              case 0:
                return _context33.abrupt("return", new Promise(function (e, r) {
                  var n = _this8.GetObjectStore(_this8.DB_PATH_STORE, "readonly").get(t);

                  n.onerror = function (t) {
                    r(new Error("GetPath => " + t));
                  }, n.onsuccess = function (t) {
                    e(t.target.result);
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
                return _context34.abrupt("return", new Promise(function (t, e) {
                  var r = _this9.GetObjectStore(_this9.DB_PATH_STORE, "readonly"),
                      n = [],
                      i = r.openCursor();

                  i.onsuccess = function (e) {
                    var r = e.target.result;
                    r ? (n.push(r.value), r.continue()) : t(n);
                  }, i.onerror = function (t) {
                    e(new Error("GetAllPaths => " + t));
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
  }, {
    key: "StorePoint",
    value: function () {
      var _StorePoint = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee35(t, e) {
        var _this10 = this;

        return regeneratorRuntime.wrap(function _callee35$(_context35) {
          while (1) {
            switch (_context35.prev = _context35.next) {
              case 0:
                return _context35.abrupt("return", null !== this.bulkStores && this.bulkStores.has(this.DB_POINT_STORE) ? (null === this.pointBulkBuffer && (this.pointBulkBuffer = new Map()), this.pointBulkBuffer.set(t, e), Promise.resolve()) : new Promise(function (n, i) {
                  var s = _this10.GetObjectStore(_this10.DB_POINT_STORE, "readwrite");

                  var o;

                  try {
                    o = s.add(e, t);
                  } catch (t) {
                    throw "DataCloneError" === t.name && r("This engine doesn't know how to clone a Blob, use Firefox"), t;
                  }

                  o.onsuccess = function () {
                    n();
                  }, o.onerror = function () {
                    r("StorePoint error", this.error), i();
                  };
                }));

              case 1:
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

        var t,
            _args36 = arguments;
        return regeneratorRuntime.wrap(function _callee36$(_context36) {
          while (1) {
            switch (_context36.prev = _context36.next) {
              case 0:
                t = _args36.length > 0 && _args36[0] !== undefined ? _args36[0] : null;
                return _context36.abrupt("return", (t || (t = this.pointBulkBuffer), t && null !== this.bulkStores ? new Promise(function (e, n) {
                  var i = _this11.GetObjectStore(_this11.DB_POINT_STORE, "readwrite");

                  try {
                    t.forEach(function (t, e) {
                      i.add(t, e);
                    }), _this11.pointBulkBuffer = null, e();
                  } catch (t) {
                    r("This engine doesn't know how to clone a Blob, use Firefox"), n(t);
                  }
                }) : Promise.reject()));

              case 2:
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
  }, {
    key: "StoreState",
    value: function () {
      var _StoreState = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee37(t, e) {
        var _this12 = this;

        return regeneratorRuntime.wrap(function _callee37$(_context37) {
          while (1) {
            switch (_context37.prev = _context37.next) {
              case 0:
                return _context37.abrupt("return", new Promise(function (n, i) {
                  var s = _this12.GetObjectStore(_this12.DB_STATE_STORE, "readwrite");

                  var o;

                  try {
                    o = s.add(e, t);
                  } catch (t) {
                    throw "DataCloneError" === t.name && r("This engine doesn't know how to clone a Blob, use Firefox"), t;
                  }

                  o.onsuccess = function () {
                    n();
                  }, o.onerror = function () {
                    r("StoreState error", this.error), i();
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
      var _UpdateState = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee38(t, e) {
        var _this13 = this;

        return regeneratorRuntime.wrap(function _callee38$(_context38) {
          while (1) {
            switch (_context38.prev = _context38.next) {
              case 0:
                return _context38.abrupt("return", new Promise(function (n, i) {
                  var s = _this13.GetObjectStore(_this13.DB_STATE_STORE, "readwrite");

                  var o;

                  try {
                    o = s.put(e, t);
                  } catch (t) {
                    throw "DataCloneError" === t.name && r("This engine doesn't know how to clone a Blob, use Firefox"), t;
                  }

                  o.onsuccess = function () {
                    n();
                  }, o.onerror = function () {
                    r("UpdateState error", this.error), i();
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
  }, {
    key: "StorePath",
    value: function () {
      var _StorePath = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee39(t, e) {
        var _this14 = this;

        return regeneratorRuntime.wrap(function _callee39$(_context39) {
          while (1) {
            switch (_context39.prev = _context39.next) {
              case 0:
                return _context39.abrupt("return", null !== this.bulkStores && this.bulkStores.has(this.DB_PATH_STORE) ? (null === this.pathBulkBuffer && (this.pathBulkBuffer = new Map()), this.pathBulkBuffer.set(t, e), Promise.resolve()) : new Promise(function (n, i) {
                  var s = _this14.GetObjectStore(_this14.DB_PATH_STORE, "readwrite");

                  var o;

                  try {
                    o = s.add(e, t);
                  } catch (t) {
                    throw "DataCloneError" === t.name && r("This engine doesn't know how to clone a Blob, use Firefox"), t;
                  }

                  o.onsuccess = function () {
                    n();
                  }, o.onerror = function () {
                    r("StorePath error", this.error), i();
                  };
                }));

              case 1:
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

        var t,
            _args40 = arguments;
        return regeneratorRuntime.wrap(function _callee40$(_context40) {
          while (1) {
            switch (_context40.prev = _context40.next) {
              case 0:
                t = _args40.length > 0 && _args40[0] !== undefined ? _args40[0] : null;
                return _context40.abrupt("return", (t || (t = this.pathBulkBuffer), t && null !== this.bulkStores ? new Promise(function (e, n) {
                  var i = _this15.GetObjectStore(_this15.DB_PATH_STORE, "readwrite");

                  try {
                    t.forEach(function (t, e) {
                      i.add(t, e);
                    }), _this15.pathBulkBuffer = null, e();
                  } catch (t) {
                    r("This engine doesn't know how to clone a Blob, use Firefox"), n(t);
                  }
                }) : Promise.reject()));

              case 2:
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
        var t, e;
        return regeneratorRuntime.wrap(function _callee41$(_context41) {
          while (1) {
            switch (_context41.prev = _context41.next) {
              case 0:
                if (this.PointStore.GetAllPoints) {
                  _context41.next = 2;
                  break;
                }

                return _context41.abrupt("return", !1);

              case 2:
                if (!(null !== this.g_DB)) {
                  _context41.next = 4;
                  break;
                }

                return _context41.abrupt("return", !1);

              case 4:
                _context41.next = 6;
                return this.OpenDb();

              case 6:
                t = this.PointStore.GetGameStateCallback();
                _context41.next = 9;
                return this.GetState(t.iGameID);

              case 9:
                e = _context41.sent;

                if (e) {
                  _context41.next = 16;
                  break;
                }

                _context41.next = 13;
                return this.ClearAllStores();

              case 13:
                _context41.next = 15;
                return this.StoreState(t.iGameID, t);

              case 15:
                return _context41.abrupt("return", !1);

              case 16:
                if (!(e.sLastMoveGameTimeStamp !== t.sLastMoveGameTimeStamp)) {
                  _context41.next = 20;
                  break;
                }

                _context41.next = 19;
                return this.ClearAllStores();

              case 19:
                return _context41.abrupt("return", !1);

              case 20:
                if (!(!1 === t.bPointsAndPathsLoaded)) {
                  _context41.next = 45;
                  break;
                }

                _context41.prev = 21;
                _context41.next = 24;
                return this.BeginBulkStorage([this.DB_POINT_STORE, this.DB_PATH_STORE], "readonly");

              case 24:
                _context41.t2 = !0;
                _context41.next = 27;
                return this.PointStore.PrepareStore();

              case 27:
                _context41.t3 = _context41.sent;
                _context41.t1 = _context41.t2 === _context41.t3;

                if (!_context41.t1) {
                  _context41.next = 35;
                  break;
                }

                _context41.t4 = !0;
                _context41.next = 33;
                return this.PathStore.PrepareStore();

              case 33:
                _context41.t5 = _context41.sent;
                _context41.t1 = _context41.t4 === _context41.t5;

              case 35:
                _context41.t0 = _context41.t1;

                if (_context41.t0) {
                  _context41.next = 40;
                  break;
                }

                _context41.next = 39;
                return this.ClearAllStores();

              case 39:
                _context41.t0 = !1;

              case 40:
                return _context41.abrupt("return", _context41.t0);

              case 41:
                _context41.prev = 41;
                _context41.next = 44;
                return this.EndBulkStorage([this.DB_POINT_STORE, this.DB_PATH_STORE]);

              case 44:
                return _context41.finish(41);

              case 45:
              case "end":
                return _context41.stop();
            }
          }
        }, _callee41, this, [[21,, 41, 45]]);
      }));

      function PrepareStore() {
        return _PrepareStore5.apply(this, arguments);
      }

      return PrepareStore;
    }()
  }, {
    key: "BeginBulkStorage",
    value: function () {
      var _BeginBulkStorage5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee42(t, e) {
        var r, n, _iterator3, _step3, _t5;

        return regeneratorRuntime.wrap(function _callee42$(_context42) {
          while (1) {
            switch (_context42.prev = _context42.next) {
              case 0:
                null === this.bulkStores && (this.bulkStores = new Map());
                r = Array.isArray(t) ? t : [t];
                n = null;
                _iterator3 = _createForOfIteratorHelper(r);

                try {
                  for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                    _t5 = _step3.value;
                    this.bulkStores.has(_t5) || (null === n && (n = this.g_DB.transaction(r, e)), this.bulkStores.set(_t5, n.objectStore(_t5)));
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
      var _EndBulkStorage5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee43(t) {
        var _e4, _iterator4, _step4, _t6;

        return regeneratorRuntime.wrap(function _callee43$(_context43) {
          while (1) {
            switch (_context43.prev = _context43.next) {
              case 0:
                if (null !== this.bulkStores) {
                  _e4 = Array.isArray(t) ? t : [t];
                  _iterator4 = _createForOfIteratorHelper(_e4);

                  try {
                    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                      _t6 = _step4.value;
                      this.bulkStores.has(_t6) && this.bulkStores.delete(_t6);
                    }
                  } catch (err) {
                    _iterator4.e(err);
                  } finally {
                    _iterator4.f();
                  }

                  this.bulkStores.size <= 0 && (this.bulkStores = null);
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

  return h;
}();



/***/ })

}]);