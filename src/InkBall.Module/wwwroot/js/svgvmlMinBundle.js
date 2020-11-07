(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[3],[
/* 0 */,
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SvgVml", function() { return SvgVml; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hasDuplicates", function() { return hasDuplicates; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sortPointsClockwise", function() { return sortPointsClockwise; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GameStateStore", function() { return GameStateStore; });


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

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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

var SvgVml = /*#__PURE__*/function () {
  function SvgVml() {
    _classCallCheck(this, SvgVml);

    var t = "http://www.w3.org/2000/svg";
    var e,
        r,
        s = !1,
        i = !1;
    this.cont = null, self && self.document && self.document.createElementNS && (this.cont = document.createElementNS(t, "svg"), s = null !== this.cont.x), s ? (e = function () {
      return this.cont;
    }.bind(this), r = function r(e) {
      return document.createElementNS(t, e);
    }) : (e = function e() {
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
    }, r = function r() {
      return {
        attributes: new Map(),
        setAttribute: function setAttribute(t, e) {
          this.attributes.set(t, e);
        },
        getAttribute: function getAttribute(t) {
          return this.attributes.get(t);
        },
        removeAttribute: function removeAttribute(t) {
          this.attributes["delete"](t);
        }
      };
    }), this.CreateSVGVML = function (t, r, n, o) {
      return this.cont = e("svg"), r && this.cont.setAttributeNS(null, "width", r), n && this.cont.setAttributeNS(null, "height", n), t && t.appendChild(this.cont), i = o, s ? this.cont : null;
    }, this.CreateLine = function (t, e, s) {
      var n = r("line");
      return n.setAttribute("shape-rendering", i ? "auto" : "optimizeSpeed"), n.setAttribute("stroke-width", Math.round(t) + "px"), e && n.setAttribute("stroke", e), s && n.setAttribute("stroke-linecap", s), n.move = function (t, e, r, s) {
        this.setAttribute("x1", t), this.setAttribute("y1", e), this.setAttribute("x2", r), this.setAttribute("y2", s);
      }, n.RGBcolor = function (t, e, r) {
        this.setAttribute("stroke", "rgb(" + Math.round(t) + "," + Math.round(e) + "," + Math.round(r) + ")");
      }, n.SetColor = function (t) {
        this.setAttribute("stroke", t);
      }, n.strokeWidth = function (t) {
        this.setAttribute("stroke-width", Math.round(t) + "px");
      }, this.cont.appendChild(n), n;
    }, this.CreatePolyline = function (t, e, s) {
      var n = r("polyline");
      return n.setAttribute("shape-rendering", i ? "auto" : "optimizeSpeed"), n.setAttribute("stroke-width", Math.round(t)), s && n.setAttribute("stroke", s), n.setAttribute("fill", s), n.setAttribute("fill-opacity", "0.1"), e && n.setAttribute("points", e), n.setAttribute("stroke-linecap", "round"), n.setAttribute("stroke-linejoin", "round"), this.cont.appendChild(n), n.setAttribute("data-id", 0), n.AppendPoints = function (t, e, r, s) {
        var i = this.getAttribute("points"),
            n = i.split(" ");
        if (!0 === hasDuplicates(n)) return !1;
        var o;
        if (n.length <= 1 || 2 !== (o = n[n.length - 1].split(",")).length) return !1;
        var a = parseInt(o[0]),
            h = parseInt(o[1]),
            u = parseInt(t),
            l = parseInt(e);
        return Math.abs(a - u) <= r && Math.abs(h - l) <= s && (this.setAttribute("points", i + " ".concat(t, ",").concat(e)), !0);
      }, n.RemoveLastPoint = function () {
        var t = this.getAttribute("points").replace(/(\s\d+,\d+)$/, "");
        return this.setAttribute("points", t), t;
      }, n.ContainsPoint = function (t, e) {
        var r = new RegExp("".concat(t, ",").concat(e), "g");
        return (this.getAttribute("points").match(r) || []).length;
      }, n.GetPointsString = function () {
        return this.getAttribute("points");
      }, n.GetPointsArray = function () {
        return this.getAttribute("points").split(" ").map(function (t) {
          var e = t.split(",");
          return {
            x: parseInt(e[0]),
            y: parseInt(e[1])
          };
        });
      }, n.SetPoints = function (t) {
        this.setAttribute("points", t);
      }, n.GetIsClosed = function () {
        var t = this.getAttribute("points").split(" ");
        return t[0] === t[t.length - 1];
      }, n.GetLength = function () {
        return this.getAttribute("points").split(" ").length;
      }, n.SetWidthAndColor = function (t, e) {
        this.setAttribute("stroke", e), this.setAttribute("fill", e), this.setAttribute("stroke-width", Math.round(t));
      }, n.GetID = function () {
        return parseInt(this.getAttribute("data-id"));
      }, n.SetID = function (t) {
        this.setAttribute("data-id", t);
      }, n.GetFillColor = function () {
        return this.getAttribute("fill");
      }, n.Serialize = function () {
        return {
          iId: this.GetID(),
          Color: this.GetFillColor(),
          PointsAsString: this.GetPointsString()
        };
      }, n;
    }, this.CreateOval = function (t) {
      var e = r("circle");
      return e.setAttribute("shape-rendering", i ? "auto" : "optimizeSpeed"), e.setAttribute("stroke-width", 0), e.setAttribute("r", Math.round(t >> 1)), e.setAttribute("data-status", -1), e.move = function (t, e, r) {
        this.setAttribute("cx", t), this.setAttribute("cy", e), this.setAttribute("r", Math.round(r));
      }, e.GetStrokeColor = function () {
        return this.getAttribute("stroke");
      }, e.SetStrokeColor = function (t) {
        this.setAttribute("stroke", t);
      }, e.GetPosition = function () {
        return {
          x: this.getAttribute("cx"),
          y: this.getAttribute("cy")
        };
      }, e.GetFillColor = function () {
        return this.getAttribute("fill");
      }, e.SetFillColor = function (t) {
        this.setAttribute("fill", t);
      }, e.GetStatus = function () {
        return parseInt(this.getAttribute("data-status"));
      }, e.SetStatus = function (t) {
        var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : !1;

        if (e) {
          var _e = parseInt(this.getAttribute("data-status"));

          this.setAttribute("data-status", t), -1 !== _e && _e !== t && this.setAttribute("data-old-status", _e);
        } else this.setAttribute("data-status", t);
      }, e.RevertOldStatus = function () {
        var t = this.getAttribute("data-old-status");
        return t ? (this.removeAttribute("data-old-status"), this.setAttribute("data-status", t), parseInt(t)) : -1;
      }, e.GetZIndex = function () {
        return this.getAttribute("z-index");
      }, e.SetZIndex = function (t) {
        this.setAttribute("z-index", t);
      }, e.Hide = function () {
        this.setAttribute("visibility", "hidden");
      }, e.Show = function () {
        this.setAttribute("visibility", "visible");
      }, e.strokeWeight = function (t) {
        this.setAttribute("stroke-width", t);
      }, e.Serialize = function () {
        var _this$GetPosition = this.GetPosition(),
            t = _this$GetPosition.x,
            e = _this$GetPosition.y;

        return {
          x: t,
          y: e,
          Status: this.GetStatus(),
          Color: this.GetFillColor()
        };
      }, this.cont.appendChild(e), e;
    };
  }

  _createClass(SvgVml, [{
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
          s = t.y,
          i = t.Status,
          n = t.Color,
          o = this.CreateOval(4);
      return o.move(r, s, e), o.SetStrokeColor(n), o.SetFillColor(n), o.SetStatus(i), o;
    }
  }, {
    key: "DeserializePolyline",
    value: function DeserializePolyline(t) {
      var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
      var r = t.iId,
          s = t.Color,
          i = t.PointsAsString,
          n = this.CreatePolyline(e, i, s);
      return n.SetID(r), n;
    }
  }]);

  return SvgVml;
}();

var GameStateStore = /*#__PURE__*/function () {
  function GameStateStore(t) {
    var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var r = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var s = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    var i = arguments.length > 4 ? arguments[4] : undefined;
    var n = arguments.length > 5 ? arguments[5] : undefined;
    var o = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : "";

    _classCallCheck(this, GameStateStore);

    this.LocalLog = i, this.LocalError = n, t ? "indexedDB" in self ? t = !0 : (this.LocalError("This browser doesn't support IndexedDB"), t = !1) : t = !1;

    var a = /*#__PURE__*/function () {
      function a() {
        _classCallCheck(this, a);

        this.store = new Map();
      }

      _createClass(a, [{
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

          function has(_x) {
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

          function set(_x2, _x3) {
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

          function get(_x4) {
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

      return a;
    }(),
        h = /*#__PURE__*/function () {
      function h() {
        _classCallCheck(this, h);

        this.store = [];
      }

      _createClass(h, [{
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

          function push(_x5) {
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

      return h;
    }(),
        u = /*#__PURE__*/function (_a) {
      _inherits(u, _a);

      var _super = _createSuper(u);

      function u(t, e, r) {
        var _this;

        _classCallCheck(this, u);

        _this = _super.call(this), _this.MainGameStateStore = t, _this.GetPoint = t.GetPoint.bind(_this.MainGameStateStore), _this.StorePoint = t.StorePoint.bind(_this.MainGameStateStore), _this.GetAllPoints = t.GetAllPoints.bind(_this.MainGameStateStore), _this.UpdateState = t.UpdateState.bind(_this.MainGameStateStore), _this.PointCreationCallback = e, _this.GetGameStateCallback = r;
        return _this;
      }

      _createClass(u, [{
        key: "PrepareStore",
        value: function () {
          var _PrepareStore3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15() {
            var _t, _e2, _iterator, _step, _r, _t2, _s;

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

                    _r = _step.value;
                    _context15.next = 12;
                    return this.PointCreationCallback(_r.x, _r.y, _r.Status, _r.Color);

                  case 12:
                    _t2 = _context15.sent;
                    _s = _r.y * _e2.iGridWidth + _r.x;
                    this.store.set(_s, _t2);

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

          function has(_x6) {
            return _has2.apply(this, arguments);
          }

          return has;
        }()
      }, {
        key: "set",
        value: function () {
          var _set2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19(t, e) {
            var r, s, i, n;
            return regeneratorRuntime.wrap(function _callee19$(_context19) {
              while (1) {
                switch (_context19.prev = _context19.next) {
                  case 0:
                    r = this.GetGameStateCallback(), s = e.GetPosition(), i = e.GetFillColor(), n = {
                      x: parseInt(s.x) / r.iGridSizeX,
                      y: parseInt(s.y) / r.iGridSizeY,
                      Status: e.GetStatus(),
                      Color: i
                    };
                    _context19.next = 3;
                    return this.StorePoint(t, n);

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

          function set(_x7, _x8) {
            return _set2.apply(this, arguments);
          }

          return set;
        }()
      }, {
        key: "get",
        value: function () {
          var _get2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee20(t) {
            var e, _r2;

            return regeneratorRuntime.wrap(function _callee20$(_context20) {
              while (1) {
                switch (_context20.prev = _context20.next) {
                  case 0:
                    e = this.store.get(t);

                    if (e) {
                      _context20.next = 6;
                      break;
                    }

                    _context20.next = 4;
                    return this.GetPoint(t);

                  case 4:
                    _r2 = _context20.sent;
                    return _context20.abrupt("return", _r2 && this.PointCreationCallback ? (e = this.PointCreationCallback(_r2.x, _r2.y, _r2.Status, _r2.Color), this.store.set(t, e), e) : void 0);

                  case 6:
                    return _context20.abrupt("return", e);

                  case 7:
                  case "end":
                    return _context20.stop();
                }
              }
            }, _callee20, this);
          }));

          function get(_x9) {
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

      return u;
    }(a),
        l = /*#__PURE__*/function (_h) {
      _inherits(l, _h);

      var _super2 = _createSuper(l);

      function l(t, e, r) {
        var _this2;

        _classCallCheck(this, l);

        _this2 = _super2.call(this), _this2.MainGameStateStore = t, _this2.GetAllPaths = t.GetAllPaths.bind(_this2.MainGameStateStore), _this2.StorePath = t.StorePath.bind(_this2.MainGameStateStore), _this2.UpdateState = t.UpdateState.bind(_this2.MainGameStateStore), _this2.PathCreationCallback = e, _this2.GetGameStateCallback = r;
        return _this2;
      }

      _createClass(l, [{
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
                    return this.MainGameStateStore.EndBulkStorage([this.MainGameStateStore.DB_POINT_STORE, this.MainGameStateStore.DB_PATH_STORE]);

                  case 2:
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
            var e, r, _t5;

            return regeneratorRuntime.wrap(function _callee25$(_context25) {
              while (1) {
                switch (_context25.prev = _context25.next) {
                  case 0:
                    e = t.GetID(), r = {
                      iId: e,
                      Color: t.GetFillColor(),
                      PointsAsString: t.GetPointsString()
                    };
                    _context25.next = 3;
                    return this.StorePath(e, r);

                  case 3:
                    if (!this.UpdateState) {
                      _context25.next = 9;
                      break;
                    }

                    _t5 = this.GetGameStateCallback();
                    _context25.t0 = !0 === _t5.bPointsAndPathsLoaded;

                    if (!_context25.t0) {
                      _context25.next = 9;
                      break;
                    }

                    _context25.next = 9;
                    return this.UpdateState(_t5.iGameID, _t5);

                  case 9:
                    return _context25.abrupt("return", this.store.push(t));

                  case 10:
                  case "end":
                    return _context25.stop();
                }
              }
            }, _callee25, this);
          }));

          function push(_x10) {
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

      return l;
    }(h);

    !0 === t ? (this.DB_NAME = "InkballGame", this.DB_POINT_STORE = "points", this.DB_PATH_STORE = "paths", this.DB_STATE_STORE = "state", !o || "" === o || o.length <= 0 ? this.DB_VERSION = null : this.DB_VERSION = parseInt(o.split(".").reduce(function (t, e) {
      return e = parseInt(e), 10 * t + (isNaN(e) ? 0 : e);
    }, 0)) - 1010 + 4, this.g_DB, this.PointStore = new u(this, e, s), this.PathStore = new l(this, r, s)) : (this.PointStore = new a(), this.PathStore = new h());
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
                return _context27.abrupt("return", (this.LocalLog("OpenDb ..."), new Promise(function (t, e) {
                  var r;
                  r = null !== _this3.DB_VERSION ? indexedDB.open(_this3.DB_NAME, _this3.DB_VERSION) : indexedDB.open(_this3.DB_NAME), r.onsuccess = function (e) {
                    this.g_DB = e.currentTarget.result, this.LocalLog("OpenDb DONE"), t(e.currentTarget.result);
                  }.bind(_this3), r.onerror = function (t) {
                    this.LocalError("OpenDb:", t.target.errorCode || t.target.error), e();
                  }, r.onupgradeneeded = function (t) {
                    this.LocalLog("OpenDb.onupgradeneeded(version: ".concat(this.DB_VERSION, ")"));
                    var e = Array.from(t.currentTarget.result.objectStoreNames);
                    e.includes(this.DB_POINT_STORE) && t.currentTarget.result.deleteObjectStore(this.DB_POINT_STORE), e.includes(this.DB_PATH_STORE) && t.currentTarget.result.deleteObjectStore(this.DB_PATH_STORE), e.includes(this.DB_STATE_STORE) && t.currentTarget.result.deleteObjectStore(this.DB_STATE_STORE), t.currentTarget.result.createObjectStore(this.DB_POINT_STORE, {
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
        }, _callee27, this);
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
      var _ClearObjectStore = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee28(t) {
        var _this4 = this;

        return regeneratorRuntime.wrap(function _callee28$(_context28) {
          while (1) {
            switch (_context28.prev = _context28.next) {
              case 0:
                return _context28.abrupt("return", new Promise(function (e, r) {
                  var s = _this4.GetObjectStore(t, "readwrite").clear();

                  s.onsuccess = function () {
                    e();
                  }, s.onerror = function (t) {
                    this.LocalError("clearObjectStore:", t.target.errorCode), r();
                  };
                }));

              case 1:
              case "end":
                return _context28.stop();
            }
          }
        }, _callee28);
      }));

      function ClearObjectStore(_x11) {
        return _ClearObjectStore.apply(this, arguments);
      }

      return ClearObjectStore;
    }()
  }, {
    key: "GetPoint",
    value: function () {
      var _GetPoint = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee29(t) {
        var _this5 = this;

        return regeneratorRuntime.wrap(function _callee29$(_context29) {
          while (1) {
            switch (_context29.prev = _context29.next) {
              case 0:
                return _context29.abrupt("return", new Promise(function (e, r) {
                  var s = _this5.GetObjectStore(_this5.DB_POINT_STORE, "readonly").get(t);

                  s.onerror = function (t) {
                    r(new Error("GetPoint => " + t));
                  }, s.onsuccess = function (t) {
                    e(t.target.result);
                  };
                }));

              case 1:
              case "end":
                return _context29.stop();
            }
          }
        }, _callee29);
      }));

      function GetPoint(_x12) {
        return _GetPoint.apply(this, arguments);
      }

      return GetPoint;
    }()
  }, {
    key: "GetAllPoints",
    value: function () {
      var _GetAllPoints = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee30() {
        var _this6 = this;

        return regeneratorRuntime.wrap(function _callee30$(_context30) {
          while (1) {
            switch (_context30.prev = _context30.next) {
              case 0:
                return _context30.abrupt("return", new Promise(function (t, e) {
                  var r = _this6.GetObjectStore(_this6.DB_POINT_STORE, "readonly"),
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
                return _context30.stop();
            }
          }
        }, _callee30);
      }));

      function GetAllPoints() {
        return _GetAllPoints.apply(this, arguments);
      }

      return GetAllPoints;
    }()
  }, {
    key: "GetState",
    value: function () {
      var _GetState = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee31(t) {
        var _this7 = this;

        return regeneratorRuntime.wrap(function _callee31$(_context31) {
          while (1) {
            switch (_context31.prev = _context31.next) {
              case 0:
                return _context31.abrupt("return", new Promise(function (e, r) {
                  var s = _this7.GetObjectStore(_this7.DB_STATE_STORE, "readonly").get(t);

                  s.onerror = function (t) {
                    r(new Error("GetState => " + t));
                  }, s.onsuccess = function (t) {
                    e(t.target.result);
                  };
                }));

              case 1:
              case "end":
                return _context31.stop();
            }
          }
        }, _callee31);
      }));

      function GetState(_x13) {
        return _GetState.apply(this, arguments);
      }

      return GetState;
    }()
  }, {
    key: "GetPath",
    value: function () {
      var _GetPath = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee32(t) {
        var _this8 = this;

        return regeneratorRuntime.wrap(function _callee32$(_context32) {
          while (1) {
            switch (_context32.prev = _context32.next) {
              case 0:
                return _context32.abrupt("return", new Promise(function (e, r) {
                  var s = _this8.GetObjectStore(_this8.DB_PATH_STORE, "readonly").get(t);

                  s.onerror = function (t) {
                    r(new Error("GetPath => " + t));
                  }, s.onsuccess = function (t) {
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

      function GetPath(_x14) {
        return _GetPath.apply(this, arguments);
      }

      return GetPath;
    }()
  }, {
    key: "GetAllPaths",
    value: function () {
      var _GetAllPaths = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee33() {
        var _this9 = this;

        return regeneratorRuntime.wrap(function _callee33$(_context33) {
          while (1) {
            switch (_context33.prev = _context33.next) {
              case 0:
                return _context33.abrupt("return", new Promise(function (t, e) {
                  var r = _this9.GetObjectStore(_this9.DB_PATH_STORE, "readonly"),
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
                return _context33.stop();
            }
          }
        }, _callee33);
      }));

      function GetAllPaths() {
        return _GetAllPaths.apply(this, arguments);
      }

      return GetAllPaths;
    }()
  }, {
    key: "StorePoint",
    value: function () {
      var _StorePoint = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee34(t, e) {
        var _this10 = this;

        return regeneratorRuntime.wrap(function _callee34$(_context34) {
          while (1) {
            switch (_context34.prev = _context34.next) {
              case 0:
                return _context34.abrupt("return", this.bulkStores && this.bulkStores.has(this.DB_POINT_STORE) ? (this.bulkBuffer || (this.bulkBuffer = new Map()), this.bulkBuffer.set(t, e), Promise.resolve()) : new Promise(function (r, s) {
                  var i = _this10.GetObjectStore(_this10.DB_POINT_STORE, "readwrite");

                  var n;

                  try {
                    n = i.add(e, t);
                  } catch (t) {
                    throw "DataCloneError" === t.name && _this10.LocalError("This engine doesn't know how to clone a Blob, use Firefox"), t;
                  }

                  n.onsuccess = function () {
                    r();
                  }, n.onerror = function () {
                    this.LocalError("StorePoint error", this.error), s();
                  };
                }));

              case 1:
              case "end":
                return _context34.stop();
            }
          }
        }, _callee34, this);
      }));

      function StorePoint(_x15, _x16) {
        return _StorePoint.apply(this, arguments);
      }

      return StorePoint;
    }()
  }, {
    key: "StoreAllPoints",
    value: function () {
      var _StoreAllPoints = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee35(t) {
        var _this11 = this;

        return regeneratorRuntime.wrap(function _callee35$(_context35) {
          while (1) {
            switch (_context35.prev = _context35.next) {
              case 0:
                return _context35.abrupt("return", (t || (t = this.bulkBuffer), t && this.bulkStores ? new Promise(function (e, r) {
                  var s = _this11.GetObjectStore(_this11.DB_POINT_STORE, "readwrite");

                  try {
                    t.forEach(function (t, e) {
                      s.add(t, e);
                    }), _this11.bulkBuffer = null, e();
                  } catch (t) {
                    _this11.LocalError("This engine doesn't know how to clone a Blob, use Firefox"), r(t);
                  }
                }) : Promise.reject()));

              case 1:
              case "end":
                return _context35.stop();
            }
          }
        }, _callee35, this);
      }));

      function StoreAllPoints(_x17) {
        return _StoreAllPoints.apply(this, arguments);
      }

      return StoreAllPoints;
    }()
  }, {
    key: "StoreState",
    value: function () {
      var _StoreState = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee36(t, e) {
        var _this12 = this;

        return regeneratorRuntime.wrap(function _callee36$(_context36) {
          while (1) {
            switch (_context36.prev = _context36.next) {
              case 0:
                return _context36.abrupt("return", new Promise(function (r, s) {
                  var i = _this12.GetObjectStore(_this12.DB_STATE_STORE, "readwrite");

                  var n;

                  try {
                    n = i.add(e, t);
                  } catch (t) {
                    throw "DataCloneError" === t.name && _this12.LocalError("This engine doesn't know how to clone a Blob, use Firefox"), t;
                  }

                  n.onsuccess = function () {
                    r();
                  }, n.onerror = function () {
                    this.LocalError("StoreState error", this.error), s();
                  };
                }));

              case 1:
              case "end":
                return _context36.stop();
            }
          }
        }, _callee36);
      }));

      function StoreState(_x18, _x19) {
        return _StoreState.apply(this, arguments);
      }

      return StoreState;
    }()
  }, {
    key: "UpdateState",
    value: function () {
      var _UpdateState = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee37(t, e) {
        var _this13 = this;

        return regeneratorRuntime.wrap(function _callee37$(_context37) {
          while (1) {
            switch (_context37.prev = _context37.next) {
              case 0:
                return _context37.abrupt("return", new Promise(function (r, s) {
                  var i = _this13.GetObjectStore(_this13.DB_STATE_STORE, "readwrite");

                  var n;

                  try {
                    n = i.put(e, t);
                  } catch (t) {
                    throw "DataCloneError" === t.name && _this13.LocalError("This engine doesn't know how to clone a Blob, use Firefox"), t;
                  }

                  n.onsuccess = function () {
                    r();
                  }, n.onerror = function () {
                    this.LocalError("UpdateState error", this.error), s();
                  };
                }));

              case 1:
              case "end":
                return _context37.stop();
            }
          }
        }, _callee37);
      }));

      function UpdateState(_x20, _x21) {
        return _UpdateState.apply(this, arguments);
      }

      return UpdateState;
    }()
  }, {
    key: "StorePath",
    value: function () {
      var _StorePath = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee38(t, e) {
        var _this14 = this;

        return regeneratorRuntime.wrap(function _callee38$(_context38) {
          while (1) {
            switch (_context38.prev = _context38.next) {
              case 0:
                return _context38.abrupt("return", new Promise(function (r, s) {
                  var i = _this14.GetObjectStore(_this14.DB_PATH_STORE, "readwrite");

                  var n;

                  try {
                    n = i.add(e, t);
                  } catch (t) {
                    throw "DataCloneError" === t.name && _this14.LocalError("This engine doesn't know how to clone a Blob, use Firefox"), t;
                  }

                  n.onsuccess = function () {
                    r();
                  }, n.onerror = function () {
                    this.LocalError("StorePath error", this.error), s();
                  };
                }));

              case 1:
              case "end":
                return _context38.stop();
            }
          }
        }, _callee38);
      }));

      function StorePath(_x22, _x23) {
        return _StorePath.apply(this, arguments);
      }

      return StorePath;
    }()
  }, {
    key: "PrepareStore",
    value: function () {
      var _PrepareStore5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee39() {
        var t, e;
        return regeneratorRuntime.wrap(function _callee39$(_context39) {
          while (1) {
            switch (_context39.prev = _context39.next) {
              case 0:
                if (this.PointStore.GetAllPoints) {
                  _context39.next = 2;
                  break;
                }

                return _context39.abrupt("return", !1);

              case 2:
                if (!this.g_DB) {
                  _context39.next = 4;
                  break;
                }

                return _context39.abrupt("return", !1);

              case 4:
                _context39.next = 6;
                return this.OpenDb();

              case 6:
                t = this.PointStore.GetGameStateCallback();
                _context39.next = 9;
                return this.GetState(t.iGameID);

              case 9:
                e = _context39.sent;

                if (e) {
                  _context39.next = 16;
                  break;
                }

                _context39.next = 13;
                return Promise.all([this.ClearObjectStore(this.DB_POINT_STORE), this.ClearObjectStore(this.DB_PATH_STORE), this.ClearObjectStore(this.DB_STATE_STORE)]);

              case 13:
                _context39.next = 15;
                return this.StoreState(t.iGameID, t);

              case 15:
                return _context39.abrupt("return", !1);

              case 16:
                if (!(e.sLastMoveGameTimeStamp !== t.sLastMoveGameTimeStamp)) {
                  _context39.next = 20;
                  break;
                }

                _context39.next = 19;
                return Promise.all([this.ClearObjectStore(this.DB_POINT_STORE), this.ClearObjectStore(this.DB_PATH_STORE), this.ClearObjectStore(this.DB_STATE_STORE)]);

              case 19:
                return _context39.abrupt("return", !1);

              case 20:
                if (!(!1 === t.bPointsAndPathsLoaded)) {
                  _context39.next = 45;
                  break;
                }

                _context39.prev = 21;
                _context39.next = 24;
                return this.BeginBulkStorage([this.DB_POINT_STORE, this.DB_PATH_STORE], "readonly");

              case 24:
                _context39.t2 = !0;
                _context39.next = 27;
                return this.PointStore.PrepareStore();

              case 27:
                _context39.t3 = _context39.sent;
                _context39.t1 = _context39.t2 === _context39.t3;

                if (!_context39.t1) {
                  _context39.next = 35;
                  break;
                }

                _context39.t4 = !0;
                _context39.next = 33;
                return this.PathStore.PrepareStore();

              case 33:
                _context39.t5 = _context39.sent;
                _context39.t1 = _context39.t4 === _context39.t5;

              case 35:
                _context39.t0 = _context39.t1;

                if (_context39.t0) {
                  _context39.next = 40;
                  break;
                }

                _context39.next = 39;
                return Promise.all([this.ClearObjectStore(this.DB_POINT_STORE), this.ClearObjectStore(this.DB_PATH_STORE), this.ClearObjectStore(this.DB_STATE_STORE)]);

              case 39:
                _context39.t0 = !1;

              case 40:
                return _context39.abrupt("return", _context39.t0);

              case 41:
                _context39.prev = 41;
                _context39.next = 44;
                return this.EndBulkStorage([this.DB_POINT_STORE, this.DB_PATH_STORE]);

              case 44:
                return _context39.finish(41);

              case 45:
              case "end":
                return _context39.stop();
            }
          }
        }, _callee39, this, [[21,, 41, 45]]);
      }));

      function PrepareStore() {
        return _PrepareStore5.apply(this, arguments);
      }

      return PrepareStore;
    }()
  }, {
    key: "BeginBulkStorage",
    value: function () {
      var _BeginBulkStorage5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee40(t, e) {
        var r, s;
        return regeneratorRuntime.wrap(function _callee40$(_context40) {
          while (1) {
            switch (_context40.prev = _context40.next) {
              case 0:
                this.bulkStores || (this.bulkStores = new Map());
                r = t;

                if (!this.bulkStores.has(r)) {
                  s = this.g_DB.transaction(t, e);
                  Array.isArray(t) ? (this.bulkStores.set(r[0], s.objectStore(t[0])), this.bulkStores.set(r[1], s.objectStore(t[1]))) : this.bulkStores.set(r, s.objectStore(t));
                }

              case 3:
              case "end":
                return _context40.stop();
            }
          }
        }, _callee40, this);
      }));

      function BeginBulkStorage(_x24, _x25) {
        return _BeginBulkStorage5.apply(this, arguments);
      }

      return BeginBulkStorage;
    }()
  }, {
    key: "EndBulkStorage",
    value: function () {
      var _EndBulkStorage5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee41(t) {
        return regeneratorRuntime.wrap(function _callee41$(_context41) {
          while (1) {
            switch (_context41.prev = _context41.next) {
              case 0:
                this.bulkStores && (Array.isArray(t) ? (this.bulkStores["delete"](t[0]), this.bulkStores["delete"](t[1])) : this.bulkStores["delete"](t), this.bulkStores.size <= 0 && (this.bulkStores = null));

              case 1:
              case "end":
                return _context41.stop();
            }
          }
        }, _callee41, this);
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
]]);