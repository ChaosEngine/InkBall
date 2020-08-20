(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[2],{

/***/ 2:
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
/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "$" }]*/
//////////////////////////////////////////////////////
// SVG-VML mini graphic library 
// ==========================================
// written by Gerard Ferrandez
// initial version - June 28, 2006
// modified - 2018-2020 - Andrzej Pauli polyline and oval functions & extensions
// modified - July 21 - use object functions
// modified - July 24 - debug
// www.dhteumeuleu.com
//////////////////////////////////////////////////////


var SVG = false;
var svgNS = "http://www.w3.org/2000/svg";
var svgAntialias = false,
    cont = null;
var $createOval, $createPolyline, $RemovePolyline, $createSVGVML, $createLine;

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
} ///////////sortPointsClockwise tests start////////////

/**
 * Sorting point clockwise/anticlockwise
 * @param {array} points array of points to sort
 * @returns {array} of points
 */


function sortPointsClockwise_Old(points) {
  //Old
  // Find min max to get center
  // Sort from top to bottom
  points.sort(function (a, b) {
    return a.y - b.y;
  }); // Get center y

  var cy = (points[0].y + points[points.length - 1].y) / 2; // Sort from right to left

  points.sort(function (a, b) {
    return b.x - a.x;
  }); // Get center x

  var cx = (points[0].x + points[points.length - 1].x) / 2; // Center point

  var center = {
    x: cx,
    y: cy
  }; // Pre calculate the angles as it will be slow in the sort
  // As the points are sorted from right to left the first point
  // is the rightmost
  // Starting angle used to reference other angles

  var startAng = undefined;
  points.forEach(function (point) {
    var ang = Math.atan2(point.y - center.y, point.x - center.x);

    if (startAng === undefined) {
      startAng = ang;
    } else {
      if (ang < startAng) {
        // ensure that all points are clockwise of the start point
        ang += Math.PI * 2;
      }
    }

    point.angle = ang; // add the angle to the point
  }); // first sort clockwise

  points.sort(function (a, b) {
    return a.angle - b.angle;
  }); //// then reverse the order
  //const ccwPoints = points.reverse();
  //// move the last point back to the start
  //ccwPoints.unshift(ccwPoints.pop());
  ////drawPoints();
  //return ccwPoints;

  return points;
}

function sortPointsClockwise(points) {
  //Quadrant
  var get_clockwise_angle = function get_clockwise_angle(p) {
    /* get quadrant from 12 o'clock*/

    /*const get_quadrant = function (p) {
    	let result = 4; //origin
    			if (p.x > 0 && p.y > 0)
    		return 1;
    	else if (p.x < 0 && p.y > 0)
    		return 2;
    	else if (p.x < 0 && p.y < 0)
    		return 3;
    	//else 4th quadrant
    	return result;
    };*/

    /*let angle = 0.0;
    const quadrant = get_quadrant(p);
    		//add the appropriate pi/2 value based on the quadrant. (one of 0, pi/2, pi, 3pi/2)
    switch (quadrant) {
    	case 1:
    		angle = Math.atan2(p.x, p.y) * 180 / Math.PI;
    		break;
    	case 2:
    		angle = Math.atan2(p.y, p.x) * 180 / Math.PI;
    		angle += Math.PI / 2;
    		break;
    	case 3:
    		angle = Math.atan2(p.x, p.y) * 180 / Math.PI;
    		angle += Math.PI;
    		break;
    	case 4:
    		angle = Math.atan2(p.y, p.x) * 180 / Math.PI;
    		angle += 3 * Math.PI / 2;
    		break;
    }
    return angle;*/
    var angle = -Math.atan2(p.x, -p.y);
    return angle;
  };

  points.sort(function (a, b) {
    return get_clockwise_angle(a) < get_clockwise_angle(b);
  });
  return points;
}

function sortPointsClockwise_Modern(points) {
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
} ///////////sortPointsClockwise tests end////////////


if (SVG) {
  /* ============= SVG ============== */
  $createSVGVML = function $createSVGVML(o, iWidth, iHeight, antialias) {
    cont = document.createElementNS(svgNS, "svg"); //ch_added start
    //if (iWidth)
    //	cont.setAttributeNS(null, 'width', iWidth);
    //if (iHeight)
    //	cont.setAttributeNS(null, 'height', iHeight);
    //ch_added end

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

    o.$AppendPoints = function (x, y) {
      var diff = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 16;
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

      if (!(Math.abs(last_x - x_diff) <= diff && Math.abs(last_y - y_diff) <= diff)) {
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
    }; //ch_added end


    return o;
  };

  $createOval = function $createOval(diam) {
    var o = document.createElementNS(svgNS, "circle");
    o.setAttribute("shape-rendering", svgAntialias ? "auto" : "optimizeSpeed");
    o.setAttribute("stroke-width", 0);
    o.setAttribute("r", Math.round(diam > 1)); //ch_commented o.style.cursor = "pointer";
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


  var $RemoveOval = function $RemoveOval(Oval) {
    cont.removeChild(Oval);
  };

  $RemovePolyline = function $RemovePolyline(Polyline) {
    cont.removeChild(Polyline);
  }; //ch_added end

} else if (document.createStyleSheet) {
  /* ============= VML ============== */
  $createSVGVML = function $createSVGVML(o, iWidth, iHeight, antialias) {
    document.namespaces.add("v", "urn:schemas-microsoft-com:vml");
    var style = document.createStyleSheet();
    style.addRule('v\\:*', "behavior: url(#default#VML);");
    style.addRule('v\\:*', "antialias: " + antialias + ";");
    cont = o;
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

    o.$SetColor = function (color) {
      this.strokecolor = color;
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
    cont.appendChild(o); //ch_added start

    o.setAttribute("data-id", 0);

    o.$AppendPoints = function (x, y) {
      var diff = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 16;
      var pts_str = this.points.value;
      var pts = pts_str.split(" ");

      if (true === hasDuplicates(pts)) {
        //debugger;
        return false;
      }

      var arr; //obtain last two point

      if (pts.length <= 1 || (arr = pts[pts.length - 1].split(",")).length !== 2) {
        //debugger;
        return false;
      }

      var last_x = parseInt(arr[0]),
          last_y = parseInt(arr[1]);
      var x_diff = parseInt(x),
          y_diff = parseInt(y);

      if (!(Math.abs(last_x - x_diff) <= diff && Math.abs(last_y - y_diff) <= diff)) {
        //debugger;
        return false;
      }

      this.points.value = pts_str + " ".concat(x, ",").concat(y);
      return true;
    };

    o.$RemoveLastPoint = function () {
      var str = this.points.value.replace(/(\s\d+,\d+)$/, "");
      this.points.value = str;
      return str;
    };

    o.$ContainsPoint = function (x, y) {
      var regexstr = new RegExp("".concat(x, ",").concat(y), 'g');
      var cnt = (this.points.value.match(regexstr) || []).length;
      return cnt;
    };

    o.$GetPointsString = function () {
      return o.points.value;
    };

    o.$GetPointsArray = function () {
      //x0,y0 x1,y1 x2,y2
      return this.points.value.split(" ").map(function (pt) {
        var tab = pt.split(',');
        return {
          x: parseInt(tab[0]),
          y: parseInt(tab[1])
        };
      });
    };

    o.$SetPoints = function (sPoints) {
      this.points.value = sPoints;
    };

    o.$GetIsClosed = function () {
      var pts = this.points.value.split(" ");
      return pts[0] === pts[pts.length - 1];
    };

    o.$GetLength = function () {
      return this.points.value.split(" ").length;
    };

    o.$SetWidthAndColor = function (w, col) {
      this.strokecolor = col;
      this.fill.color = col;
      this.strokeweight = Math.round(w) + "px";
    };

    o.$GetID = function () {
      return parseInt(this.getAttribute("data-id"));
    };

    o.$SetID = function (iID) {
      this.setAttribute("data-id", iID);
    }; //ch_added end


    return o;
  };

  $createOval = function $createOval(diam, filled) {
    var o = document.createElement("v:oval");
    o.style.position = "absolute"; //ch_commented o.style.cursor = "pointer";
    //ch_added

    o.setAttribute("data-status", -1); //o.setAttribute("data-old-status", -1);

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

    o.$GetStrokeColor = function () {
      return this.strokecolor;
    };

    o.$SetStrokeColor = function (col) {
      this.strokecolor = col;
    }; //ch_added/changed start


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
      this.strokeweight = sw;
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
    alert('SVG or VML is not supported!');
    return false;
  };
}



/***/ })

}]);