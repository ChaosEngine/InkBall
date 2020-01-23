"use strict";

var SVG = false;
var svgNS = "http://www.w3.org/2000/svg";
var svgAntialias = false;
var cont = null;

if (document.createElementNS) {
  var svg = document.createElementNS(svgNS, "svg");
  SVG = svg.x !== null;
}

if (SVG) {
  var $createSVGVML = function $createSVGVML(o, iWidth, iHeight, antialias) {
    cont = document.createElementNS(svgNS, "svg");
    o.appendChild(cont);
    svgAntialias = antialias;
    return cont;
  };

  var $createLine = function $createLine(w, col, linecap) {
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

    o.$strokeWidth = function (s) {
      this.setAttribute("stroke-width", Math.round(s) + "px");
    };

    cont.appendChild(o);
    return o;
  };

  var $createPolyline = function $createPolyline(w, points, col) {
    var o = document.createElementNS(svgNS, "polyline");
    o.setAttribute("shape-rendering", svgAntialias ? "auto" : "optimizeSpeed");
    o.setAttribute("stroke-width", Math.round(w));
    if (col) o.setAttribute("stroke", col);
    o.setAttribute("fill", col);
    o.setAttribute("fill-opacity", "0.1");
    if (points) o.setAttribute("points", points);
    cont.appendChild(o);

    o.$AppendPoints = function (x, y) {
      this.setAttribute("points", this.getAttribute("points") + " ".concat(x, ",").concat(y));
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
      return this.getAttribute("points").replace(/,/g, " ").split(" ");
    };

    o.$GetPointsArray = function () {
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

    return o;
  };

  var $createOval = function $createOval(diam) {
    var o = document.createElementNS(svgNS, "circle");
    o.setAttribute("shape-rendering", svgAntialias ? "auto" : "optimizeSpeed");
    o.setAttribute("stroke-width", 0);
    o.setAttribute("r", Math.round(diam > 1));
    o.m_iStatus = -1;

    o.$move = function (x1, y1, radius) {
      this.setAttribute("cx", x1);
      this.setAttribute("cy", y1);
      this.setAttribute("r", Math.round(radius));
    };

    o.$strokeColor = function (col) {
      this.setAttribute("stroke", col);
    };

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

    o.$SetStatus = function (iStatus) {
      this.m_iStatus = iStatus;
    };

    o.$GetStatus = function () {
      return this.m_iStatus;
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
    };

    o.$strokeWeight = function (sw) {
      this.setAttribute("stroke-width", sw);
    };

    cont.appendChild(o);
    return o;
  };

  var $RemoveOval = function $RemoveOval(Oval) {
    cont.removeChild(Oval);
  };

  var $RemovePolyline = function $RemovePolyline(Polyline) {
    cont.removeChild(Polyline);
  };
} else if (document.createStyleSheet) {
  $createSVGVML = function $createSVGVML(o, iWidth, iHeight, antialias) {
    document.namespaces.add("v", "urn:schemas-microsoft-com:vml");
    var style = document.createStyleSheet();
    style.addRule('v\\:*', "behavior: url(#default#VML);");
    style.addRule('v\\:*', "antialias: " + antialias + ";");
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
    cont.appendChild(o);
    o.m_sMyPoints = points;

    o.$AppendPoints = function (x, y) {
      this.m_sMyPoints = this.m_sMyPoints + " ".concat(x, ",").concat(y);
      this.points.value = this.m_sMyPoints;
    };

    o.$RemoveLastPoint = function () {
      this.m_sMyPoints = this.m_sMyPoints.replace(/(\s\d+,\d+)$/, "");
      this.points.value = this.m_sMyPoints;
      return this.m_sMyPoints;
    };

    o.$ContainsPoint = function (x, y) {
      var regexstr = new RegExp("".concat(x, ",").concat(y), 'g');
      var cnt = (this.m_sMyPoints.match(regexstr) || []).length;
      return cnt;
    };

    o.$GetPointsString = function () {
      return o.m_sMyPoints.replace(/,/g, " ").split(" ");
    };

    o.$GetPointsArray = function () {
      return this.m_sMyPoints.split(" ").map(function (pt) {
        var tab = pt.split(',');
        return {
          x: parseInt(tab[0]),
          y: parseInt(tab[1])
        };
      });
    };

    o.$SetPoints = function (sPoints) {
      this.m_sMyPoints = sPoints;
      this.points.value = this.m_sMyPoints;
    };

    o.$GetIsClosed = function () {
      var pts = this.m_sMyPoints.split(" ");
      return pts[0] === pts[pts.length - 1];
    };

    o.$GetLength = function () {
      return this.m_sMyPoints.split(" ").length;
    };

    o.$SetWidthAndColor = function (w, col) {
      this.strokecolor = col;
      this.fill.color = col;
      this.strokeweight = Math.round(w) + "px";
    };

    return o;
  };

  $createOval = function $createOval(diam, filled) {
    var o = document.createElement("v:oval");
    o.style.position = "absolute";
    o.m_iStatus = -1;
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

    o.$strokeColor = function (col) {
      this.strokecolor = col;
    };

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

    o.$SetStatus = function (iStatus) {
      this.m_iStatus = iStatus;
    };

    o.$GetStatus = function () {
      return this.m_iStatus;
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
    };

    o.$strokeWeight = function (sw) {
      this.strokeweight = sw;
    };

    cont.appendChild(o);
    return o;
  };

  $RemoveOval = function $RemoveOval(Oval) {
    cont.removeChild(Oval);
  };

  $RemovePolyline = function $RemovePolyline(Polyline) {
    cont.removeChild(Polyline);
  };
} else {
  $createSVGVML = function $createSVGVML() {
    alert('SVG or VML is not supported!');
    return false;
  };
}