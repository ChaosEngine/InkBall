(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[3],[
/* 0 */,
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CreateOval", function() { return CreateOval; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CreatePolyline", function() { return CreatePolyline; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RemovePolyline", function() { return RemovePolyline; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RemoveOval", function() { return RemoveOval; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CreateSVGVML", function() { return CreateSVGVML; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CreateLine", function() { return CreateLine; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hasDuplicates", function() { return hasDuplicates; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SortPointsClockwise", function() { return SortPointsClockwise; });


var SVG = !1;
var svgNS = "http://www.w3.org/2000/svg";
var CreateOval,
    CreatePolyline,
    RemovePolyline,
    RemoveOval,
    CreateSVGVML,
    CreateLine,
    svgAntialias = !1,
    cont = null;

if (document.createElementNS) {
  SVG = null !== document.createElementNS(svgNS, "svg").x;
}

function hasDuplicates(t) {
  return new Set(t).size !== t.length;
}

function SortPointsClockwise(t) {
  var e = t.reduce(function (t, _ref) {
    var e = _ref.x,
        i = _ref.y;
    return t.x += e, t.y += i, t;
  }, {
    x: 0,
    y: 0
  });
  e.x /= t.length, e.y /= t.length;
  return t.map(function (_ref2) {
    var t = _ref2.x,
        i = _ref2.y;
    return {
      x: t,
      y: i,
      angle: 180 * Math.atan2(i - e.y, t - e.x) / Math.PI
    };
  }).sort(function (t, e) {
    return t.angle - e.angle;
  });
}

SVG ? (CreateSVGVML = function CreateSVGVML(t, e, i, n) {
  return cont = document.createElementNS(svgNS, "svg"), e && cont.setAttributeNS(null, "width", e), i && cont.setAttributeNS(null, "height", i), t.appendChild(cont), svgAntialias = n, cont;
}, CreateLine = function CreateLine(t, e, i) {
  var n = document.createElementNS(svgNS, "line");
  return n.setAttribute("shape-rendering", svgAntialias ? "auto" : "optimizeSpeed"), n.setAttribute("stroke-width", Math.round(t) + "px"), e && n.setAttribute("stroke", e), i && n.setAttribute("stroke-linecap", i), n.move = function (t, e, i, n) {
    this.setAttribute("x1", t), this.setAttribute("y1", e), this.setAttribute("x2", i), this.setAttribute("y2", n);
  }, n.RGBcolor = function (t, e, i) {
    this.setAttribute("stroke", "rgb(" + Math.round(t) + "," + Math.round(e) + "," + Math.round(i) + ")");
  }, n.SetColor = function (t) {
    this.setAttribute("stroke", t);
  }, n.strokeWidth = function (t) {
    this.setAttribute("stroke-width", Math.round(t) + "px");
  }, cont.appendChild(n), n;
}, CreatePolyline = function CreatePolyline(t, e, i) {
  var n = document.createElementNS(svgNS, "polyline");
  return n.setAttribute("shape-rendering", svgAntialias ? "auto" : "optimizeSpeed"), n.setAttribute("stroke-width", Math.round(t)), i && n.setAttribute("stroke", i), n.setAttribute("fill", i), n.setAttribute("fill-opacity", "0.1"), e && n.setAttribute("points", e), n.setAttribute("stroke-linecap", "round"), n.setAttribute("stroke-linejoin", "round"), cont.appendChild(n), n.setAttribute("data-id", 0), n.AppendPoints = function (t, e, i, n) {
    var s = this.getAttribute("points"),
        r = s.split(" ");
    if (!0 === hasDuplicates(r)) return !1;
    var o;
    if (r.length <= 1 || 2 !== (o = r[r.length - 1].split(",")).length) return !1;
    var u = parseInt(o[0]),
        a = parseInt(o[1]),
        l = parseInt(t),
        h = parseInt(e);
    return Math.abs(u - l) <= i && Math.abs(a - h) <= n && (this.setAttribute("points", s + " ".concat(t, ",").concat(e)), !0);
  }, n.RemoveLastPoint = function () {
    var t = this.getAttribute("points").replace(/(\s\d+,\d+)$/, "");
    return this.setAttribute("points", t), t;
  }, n.ContainsPoint = function (t, e) {
    var i = new RegExp("".concat(t, ",").concat(e), "g");
    return (this.getAttribute("points").match(i) || []).length;
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
  }, n;
}, CreateOval = function CreateOval(t) {
  var e = document.createElementNS(svgNS, "circle");
  return e.setAttribute("shape-rendering", svgAntialias ? "auto" : "optimizeSpeed"), e.setAttribute("stroke-width", 0), e.setAttribute("r", Math.round(t >> 1)), e.setAttribute("data-status", -1), e.move = function (t, e, i) {
    this.setAttribute("cx", t), this.setAttribute("cy", e), this.setAttribute("r", Math.round(i));
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
  }, cont.appendChild(e), e;
}, RemoveOval = function RemoveOval(t) {
  cont.removeChild(t);
}, RemovePolyline = function RemovePolyline(t) {
  cont.removeChild(t);
}) : CreateSVGVML = function CreateSVGVML() {
  return alert("SVG is not supported!"), !1;
};


/***/ })
]]);