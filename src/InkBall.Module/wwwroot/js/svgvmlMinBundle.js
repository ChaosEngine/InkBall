(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[3],[
/* 0 */,
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "$createOval", function() { return $createOval; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "$createPolyline", function() { return $createPolyline; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "$RemovePolyline", function() { return $RemovePolyline; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "$createSVGVML", function() { return $createSVGVML; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "$createLine", function() { return $createLine; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hasDuplicates", function() { return hasDuplicates; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sortPointsClockwise", function() { return sortPointsClockwise; });


var SVG = !1;
var svgNS = "http://www.w3.org/2000/svg";
var $createOval,
    $createPolyline,
    $RemovePolyline,
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

function sortPointsClockwise_Old(t) {
  t.sort(function (t, e) {
    return t.y - e.y;
  });
  var e = (t[0].y + t[t.length - 1].y) / 2;
  t.sort(function (t, e) {
    return e.x - t.x;
  });
  var i = (t[0].x + t[t.length - 1].x) / 2,
      n = e;
  var s = void 0;
  return t.forEach(function (t) {
    var e = Math.atan2(t.y - n, t.x - i);
    void 0 === s ? s = e : e < s && (e += 2 * Math.PI), t.angle = e;
  }), t.sort(function (t, e) {
    return t.angle - e.angle;
  }), t;
}

function sortPointsClockwise(t) {
  var e = function e(t) {
    return -Math.atan2(t.x, -t.y);
  };

  return t.sort(function (t, i) {
    return e(t) < e(i);
  }), t;
}

function sortPointsClockwise_Modern(t) {
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

if (SVG) {
  $createSVGVML = function $createSVGVML(t, e, i, n) {
    return cont = document.createElementNS(svgNS, "svg"), t.appendChild(cont), svgAntialias = n, cont;
  }, $createLine = function $createLine(t, e, i) {
    var n = document.createElementNS(svgNS, "line");
    return n.setAttribute("shape-rendering", svgAntialias ? "auto" : "optimizeSpeed"), n.setAttribute("stroke-width", Math.round(t) + "px"), e && n.setAttribute("stroke", e), i && n.setAttribute("stroke-linecap", i), n.$move = function (t, e, i, n) {
      this.setAttribute("x1", t), this.setAttribute("y1", e), this.setAttribute("x2", i), this.setAttribute("y2", n);
    }, n.$RGBcolor = function (t, e, i) {
      this.setAttribute("stroke", "rgb(" + Math.round(t) + "," + Math.round(e) + "," + Math.round(i) + ")");
    }, n.$SetColor = function (t) {
      this.setAttribute("stroke", t);
    }, n.$strokeWidth = function (t) {
      this.setAttribute("stroke-width", Math.round(t) + "px");
    }, cont.appendChild(n), n;
  }, $createPolyline = function $createPolyline(t, e, i) {
    var n = document.createElementNS(svgNS, "polyline");
    return n.setAttribute("shape-rendering", svgAntialias ? "auto" : "optimizeSpeed"), n.setAttribute("stroke-width", Math.round(t)), i && n.setAttribute("stroke", i), n.setAttribute("fill", i), n.setAttribute("fill-opacity", "0.1"), e && n.setAttribute("points", e), n.setAttribute("stroke-linecap", "round"), n.setAttribute("stroke-linejoin", "round"), cont.appendChild(n), n.setAttribute("data-id", 0), n.$AppendPoints = function (t, e) {
      var i = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 16;
      var n = this.getAttribute("points"),
          s = n.split(" ");
      if (!0 === hasDuplicates(s)) return !1;
      var r;
      if (s.length <= 1 || 2 !== (r = s[s.length - 1].split(",")).length) return !1;
      var o = parseInt(r[0]),
          u = parseInt(r[1]),
          a = parseInt(t),
          l = parseInt(e);
      return Math.abs(o - a) <= i && Math.abs(u - l) <= i && (this.setAttribute("points", n + " ".concat(t, ",").concat(e)), !0);
    }, n.$RemoveLastPoint = function () {
      var t = this.getAttribute("points").replace(/(\s\d+,\d+)$/, "");
      return this.setAttribute("points", t), t;
    }, n.$ContainsPoint = function (t, e) {
      var i = new RegExp("".concat(t, ",").concat(e), "g");
      return (this.getAttribute("points").match(i) || []).length;
    }, n.$GetPointsString = function () {
      return this.getAttribute("points");
    }, n.$GetPointsArray = function () {
      return this.getAttribute("points").split(" ").map(function (t) {
        var e = t.split(",");
        return {
          x: parseInt(e[0]),
          y: parseInt(e[1])
        };
      });
    }, n.$SetPoints = function (t) {
      this.setAttribute("points", t);
    }, n.$GetIsClosed = function () {
      var t = this.getAttribute("points").split(" ");
      return t[0] === t[t.length - 1];
    }, n.$GetLength = function () {
      return this.getAttribute("points").split(" ").length;
    }, n.$SetWidthAndColor = function (t, e) {
      this.setAttribute("stroke", e), this.setAttribute("fill", e), this.setAttribute("stroke-width", Math.round(t));
    }, n.$GetID = function () {
      return parseInt(this.getAttribute("data-id"));
    }, n.$SetID = function (t) {
      this.setAttribute("data-id", t);
    }, n;
  }, $createOval = function $createOval(t) {
    var e = document.createElementNS(svgNS, "circle");
    return e.setAttribute("shape-rendering", svgAntialias ? "auto" : "optimizeSpeed"), e.setAttribute("stroke-width", 0), e.setAttribute("r", Math.round(t > 1)), e.setAttribute("data-status", -1), e.$move = function (t, e, i) {
      this.setAttribute("cx", t), this.setAttribute("cy", e), this.setAttribute("r", Math.round(i));
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
  };

  var $RemoveOval = function $RemoveOval(t) {
    cont.removeChild(t);
  };

  $RemovePolyline = function $RemovePolyline(t) {
    cont.removeChild(t);
  };
} else document.createStyleSheet ? ($createSVGVML = function $createSVGVML(t, e, i, n) {
  document.namespaces.add("v", "urn:schemas-microsoft-com:vml");
  var s = document.createStyleSheet();
  return s.addRule("v\\:*", "behavior: url(#default#VML);"), s.addRule("v\\:*", "antialias: " + n + ";"), cont = t, t;
}, $createLine = function $createLine(t, e, i) {
  var n = document.createElement("v:line");

  if (n.strokeweight = Math.round(t) + "px", e && (n.strokecolor = e), n.$move = function (t, e, i, n) {
    this.to = t + "," + e, this.from = i + "," + n;
  }, n.$RGBcolor = function (t, e, i) {
    this.strokecolor = "rgb(" + Math.round(t) + "," + Math.round(e) + "," + Math.round(i) + ")";
  }, n.$SetColor = function (t) {
    this.strokecolor = t;
  }, n.$strokeWidth = function (t) {
    this.strokeweight = Math.round(t) + "px";
  }, i) {
    var _t = document.createElement("v:stroke");

    _t.endcap = i, n.appendChild(_t);
  }

  return cont.appendChild(n), n;
}, $createPolyline = function $createPolyline(t, e, i) {
  var n = document.createElement("v:polyline");
  n.strokeweight = Math.round(t) + "px", i && (n.strokecolor = i), n.points = e;
  var s = document.createElement("v:fill");
  return s.color = i, s.opacity = .1, n.appendChild(s), cont.appendChild(n), n.setAttribute("data-id", 0), n.$AppendPoints = function (t, e) {
    var i = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 16;
    var n = this.points.value,
        s = n.split(" ");
    if (!0 === hasDuplicates(s)) return !1;
    var r;
    if (s.length <= 1 || 2 !== (r = s[s.length - 1].split(",")).length) return !1;
    var o = parseInt(r[0]),
        u = parseInt(r[1]),
        a = parseInt(t),
        l = parseInt(e);
    return Math.abs(o - a) <= i && Math.abs(u - l) <= i && (this.points.value = n + " ".concat(t, ",").concat(e), !0);
  }, n.$RemoveLastPoint = function () {
    var t = this.points.value.replace(/(\s\d+,\d+)$/, "");
    return this.points.value = t, t;
  }, n.$ContainsPoint = function (t, e) {
    var i = new RegExp("".concat(t, ",").concat(e), "g");
    return (this.points.value.match(i) || []).length;
  }, n.$GetPointsString = function () {
    return n.points.value;
  }, n.$GetPointsArray = function () {
    return this.points.value.split(" ").map(function (t) {
      var e = t.split(",");
      return {
        x: parseInt(e[0]),
        y: parseInt(e[1])
      };
    });
  }, n.$SetPoints = function (t) {
    this.points.value = t;
  }, n.$GetIsClosed = function () {
    var t = this.points.value.split(" ");
    return t[0] === t[t.length - 1];
  }, n.$GetLength = function () {
    return this.points.value.split(" ").length;
  }, n.$SetWidthAndColor = function (t, e) {
    this.strokecolor = e, this.fill.color = e, this.strokeweight = Math.round(t) + "px";
  }, n.$GetID = function () {
    return parseInt(this.getAttribute("data-id"));
  }, n.$SetID = function (t) {
    this.setAttribute("data-id", t);
  }, n;
}, $createOval = function $createOval(t, e) {
  var i = document.createElement("v:oval");
  return i.style.position = "absolute", i.setAttribute("data-status", -1), i.strokeweight = 1, i.filled = e, i.style.width = t + "px", i.style.height = t + "px", i.$move = function (t, e, i) {
    this.style.left = Math.round(t - i) + "px", this.style.top = Math.round(e - i) + "px", this.style.width = Math.round(2 * i) + "px", this.style.height = Math.round(2 * i) + "px";
  }, i.$GetStrokeColor = function () {
    return this.strokecolor;
  }, i.$SetStrokeColor = function (t) {
    this.strokecolor = t;
  }, i.$GetPosition = function () {
    return {
      x: parseInt(this.style.left) + .5 * parseInt(this.style.width),
      y: parseInt(this.style.top) + .5 * parseInt(this.style.height)
    };
  }, i.$GetFillColor = function () {
    return this.fillcolor;
  }, i.$SetFillColor = function (t) {
    this.fillcolor = t;
  }, i.$GetStatus = function () {
    return parseInt(this.getAttribute("data-status"));
  }, i.$SetStatus = function (t) {
    var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : !1;

    if (e) {
      var _e2 = parseInt(this.getAttribute("data-status"));

      this.setAttribute("data-status", t), -1 !== _e2 && _e2 !== t && this.setAttribute("data-old-status", _e2);
    } else this.setAttribute("data-status", t);
  }, i.$RevertOldStatus = function () {
    var t = this.getAttribute("data-old-status");
    return t ? (this.removeAttribute("data-old-status"), this.setAttribute("data-status", t), parseInt(t)) : -1;
  }, i.$GetZIndex = function () {
    return this.getAttribute("z-index");
  }, i.$SetZIndex = function (t) {
    this.setAttribute("z-index", t);
  }, i.$Hide = function () {
    this.setAttribute("visibility", "hidden");
  }, i.$Show = function () {
    this.setAttribute("visibility", "visible");
  }, i.$strokeWeight = function (t) {
    this.strokeweight = t;
  }, cont.appendChild(i), i;
}, $RemoveOval = function $RemoveOval(t) {
  cont.removeChild(t);
}, $RemovePolyline = function $RemovePolyline(t) {
  cont.removeChild(t);
}) : $createSVGVML = function $createSVGVML() {
  return alert("SVG or VML is not supported!"), !1;
};



/***/ })
]]);