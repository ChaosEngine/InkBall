//////////////////////////////////////////////////////
// SVG-VML mini graphic library 
// ==========================================
// written by Gerard Ferrandez
// initial version - June 28, 2006
// modified - July 21 - use object functions
// modified - July 24 - debug
// www.dhteumeuleu.com
//////////////////////////////////////////////////////
"use strict";

var SVG = false;
let svgNS = "http://www.w3.org/2000/svg";
let svgAntialias = false;
let cont = null;
if (document.createElementNS) {
	let svg = document.createElementNS(svgNS, "svg");
	SVG = (svg.x !== null);
}

if (SVG) {
	/* ============= SVG ============== */
	var $createSVGVML = function (o, iWidth, iHeight, antialias) {
		cont = document.createElementNS(svgNS, "svg");
		//ch_added start
		cont.setAttributeNS(null, 'width', iWidth);
		cont.setAttributeNS(null, 'height', iHeight);
		//ch_added end
		o.appendChild(cont);
		svgAntialias = antialias;
		return cont;
	};
	var $createLine = function (w, col, linecap) {
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
		o.$RGBcolor = function (R, G, B) { this.setAttribute("stroke", "rgb(" + Math.round(R) + "," + Math.round(G) + "," + Math.round(B) + ")"); };
		o.$strokeWidth = function (s) { this.setAttribute("stroke-width", Math.round(s) + "px"); };
		cont.appendChild(o);
		return o;
	};
	var $createPolyline = function (w, points, col) {
		var o = document.createElementNS(svgNS, "polyline");
		o.setAttribute("shape-rendering", svgAntialias ? "auto" : "optimizeSpeed");
		o.setAttribute("stroke-width", Math.round(w));
		if (col) o.setAttribute("stroke", col);
		o.setAttribute("fill", "none");
		if (points) o.setAttribute("points", points);
		cont.appendChild(o);
		//ch_added start
		o.$AppendPoints = function (sPoints) {
			this.setAttribute("points", this.getAttribute("points") + " " + sPoints);
		};
		o.$GetPoints = function () {
			return this.getAttribute("points").replace(/,/g, " ").split(" ");
		};
		o.$SetPoints = function (sPoints) {
			this.setAttribute("points", sPoints);
		};
		o.$GetIsClosed = function () {
			let pts = this.getAttribute("points").split(" ");
			return pts[0] === pts[pts.length - 1];
		};
		//ch_added end
		return o;
	};
	var $createOval = function (diam, filled) {
		var o = document.createElementNS(svgNS, "circle");
		o.setAttribute("shape-rendering", svgAntialias ? "auto" : "optimizeSpeed");
		o.setAttribute("stroke-width", 0);
		o.setAttribute("r", Math.round(diam > 1));
		//ch_commented o.style.cursor = "pointer";
		//ch_added
		o.m_iStatus = -1;
		o.$move = function (x1, y1, radius) {
			this.setAttribute("cx", x1);
			this.setAttribute("cy", y1);
			this.setAttribute("r", Math.round(radius));
		};
		o.$strokeColor = function (col) { this.setAttribute("stroke", col); };
		//ch_added/changed start
		o.$GetPosition = function () {
			return { x: this.getAttribute("cx"), y: this.getAttribute("cy") };
		};
		o.$GetFillColor = function () { return this.getAttribute("fill"); };
		o.$SetFillColor = function (col) { this.setAttribute("fill", col); };
		o.$SetStatus = function (iStatus) { this.m_iStatus = iStatus; };
		o.$GetStatus = function () { return this.m_iStatus; };
		o.$GetZIndex = function () { return this.getAttribute("z-index"); };
		o.$SetZIndex = function (val) { this.setAttribute("z-index", val); };
		o.$Hide = function () { this.setAttribute("visibility", 'hidden'); };
		o.$Show = function () { this.setAttribute("visibility", 'visible'); };
		//ch_added/changed end
		o.$strokeWeight = function (sw) { this.setAttribute("stroke-width", sw); };
		cont.appendChild(o);
		return o;
	};
	//ch_added start
	var $RemoveOval = function (Oval) {
		cont.removeChild(Oval);
	};
	var $RemovePolyline = function (Polyline) {
		cont.removeChild(Polyline);
	};
	//ch_added end
	
} else if (document.createStyleSheet) {

	/* ============= VML ============== */
	var $createSVGVML = function (o, iWidth, iHeight, antialias) {
		document.namespaces.add("v", "urn:schemas-microsoft-com:vml");
		var style = document.createStyleSheet();
		style.addRule('v\\:*', "behavior: url(#default#VML);");
		style.addRule('v\\:*', "antialias: " + antialias + ";");
		return o;
	};
	var $createLine = function (w, col, linecap) {
		var o = document.createElement("v:line");
		o.strokeweight = Math.round(w) + "px";
		if (col) o.strokecolor = col;
		o.$move = function (x1, y1, x2, y2) {
			this.to = x1 + "," + y1;
			this.from = x2 + "," + y2;
		};
		o.$RGBcolor = function (R, G, B) { this.strokecolor = "rgb(" + Math.round(R) + "," + Math.round(G) + "," + Math.round(B) + ")"; };
		o.$strokeWidth = function (s) { this.strokeweight = Math.round(s) + "px"; };
		if (linecap) {
			s = document.createElement("v:stroke");
			s.endcap = linecap;
			o.appendChild(s);
		}
		cont.appendChild(o);
		return o;
	};
	var $createPolyline = function (w, points, col) {
		var o = document.createElement("v:polyline");
		o.strokeweight = Math.round(w) + "px";
		if (col) o.strokecolor = col;
		o.points = points;
		s = document.createElement("v:fill");
		s.on = "false";
		o.appendChild(s);
		cont.appendChild(o);
		//ch_added start
		o.m_sMyPoints = points;
		o.$AppendPoints = function (sPoints) {
			this.m_sMyPoints = this.m_sMyPoints + " " + sPoints;
			this.points.value = this.m_sMyPoints;
		};
		o.$GetPoints = function () {
			return o.m_sMyPoints.replace(/,/g, " ").split(" ");
		};
		o.$SetPoints = function (sPoints) {
			this.m_sMyPoints = sPoints;
			this.points.value = this.m_sMyPoints;
		};
		o.$GetIsClosed = function () {
			let pts = this.m_sMyPoints.split(" ");
			return pts[0] === pts[pts.length - 1];
		};
		//ch_added end
		return o;
	};
	var $createOval = function (diam, filled) {
		var o = document.createElement("v:oval");
		o.style.position = "absolute";
		//ch_commented o.style.cursor = "pointer";
		//ch_added
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
		o.$strokeColor = function (col) { this.strokecolor = col; };
		//ch_added/changed start
		o.$GetPosition = function () {
			return {
				x: parseInt(this.style.left) + parseInt(this.style.width) * 0.5,
				y: parseInt(this.style.top) + parseInt(this.style.height) * 0.5
			};
		};
		o.$GetFillColor = function () { return this.fillcolor; };
		o.$SetFillColor = function (col) { this.fillcolor = col; };
		o.$SetStatus = function (iStatus) { this.m_iStatus = iStatus; };
		o.$GetStatus = function () { return this.m_iStatus; };
		o.$GetZIndex = function () { return this.getAttribute("z-index"); };
		o.$SetZIndex = function (val) { this.setAttribute("z-index", val); };
		o.$Hide = function () { this.setAttribute("visibility", 'hidden'); };
		o.$Show = function () { this.setAttribute("visibility", 'visible'); };
		//ch_added/changed end
		o.$strokeWeight = function (sw) { this.strokeweight = sw; };
		cont.appendChild(o);
		return o;
	};
	//ch_added start
	var $RemoveOval = function (Oval) {
		cont.removeChild(Oval);
	};
	var $RemovePolyline = function (Polyline) {
		cont.removeChild(Polyline);
	};
	//ch_added end
} else {
	/* ==== no script ==== */
	var createSVG = function (o) {
		alert('SVG or VML is not supported!');
		return false;
	};
}
