/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 273:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var RBush = __webpack_require__(582);
var Queue = __webpack_require__(842);
var pointInPolygon = __webpack_require__(960);
var orient = (__webpack_require__(639).orient2d);

// Fix for require issue in webpack https://github.com/mapbox/concaveman/issues/18
if (Queue.default) {
    Queue = Queue.default;
}

module.exports = concaveman;
module.exports["default"] = concaveman;

function concaveman(points, concavity, lengthThreshold) {
    // a relative measure of concavity; higher value means simpler hull
    concavity = Math.max(0, concavity === undefined ? 2 : concavity);

    // when a segment goes below this length threshold, it won't be drilled down further
    lengthThreshold = lengthThreshold || 0;

    // start with a convex hull of the points
    var hull = fastConvexHull(points);

    // index the points with an R-tree
    var tree = new RBush(16);
    tree.toBBox = function (a) {
        return {
            minX: a[0],
            minY: a[1],
            maxX: a[0],
            maxY: a[1]
        };
    };
    tree.compareMinX = function (a, b) { return a[0] - b[0]; };
    tree.compareMinY = function (a, b) { return a[1] - b[1]; };

    tree.load(points);

    // turn the convex hull into a linked list and populate the initial edge queue with the nodes
    var queue = [];
    for (var i = 0, last; i < hull.length; i++) {
        var p = hull[i];
        tree.remove(p);
        last = insertNode(p, last);
        queue.push(last);
    }

    // index the segments with an R-tree (for intersection checks)
    var segTree = new RBush(16);
    for (i = 0; i < queue.length; i++) segTree.insert(updateBBox(queue[i]));

    var sqConcavity = concavity * concavity;
    var sqLenThreshold = lengthThreshold * lengthThreshold;

    // process edges one by one
    while (queue.length) {
        var node = queue.shift();
        var a = node.p;
        var b = node.next.p;

        // skip the edge if it's already short enough
        var sqLen = getSqDist(a, b);
        if (sqLen < sqLenThreshold) continue;

        var maxSqLen = sqLen / sqConcavity;

        // find the best connection point for the current edge to flex inward to
        p = findCandidate(tree, node.prev.p, a, b, node.next.next.p, maxSqLen, segTree);

        // if we found a connection and it satisfies our concavity measure
        if (p && Math.min(getSqDist(p, a), getSqDist(p, b)) <= maxSqLen) {
            // connect the edge endpoints through this point and add 2 new edges to the queue
            queue.push(node);
            queue.push(insertNode(p, node));

            // update point and segment indexes
            tree.remove(p);
            segTree.remove(node);
            segTree.insert(updateBBox(node));
            segTree.insert(updateBBox(node.next));
        }
    }

    // convert the resulting hull linked list to an array of points
    node = last;
    var concave = [];
    do {
        concave.push(node.p);
        node = node.next;
    } while (node !== last);

    concave.push(node.p);

    return concave;
}

function findCandidate(tree, a, b, c, d, maxDist, segTree) {
    var queue = new Queue([], compareDist);
    var node = tree.data;

    // search through the point R-tree with a depth-first search using a priority queue
    // in the order of distance to the edge (b, c)
    while (node) {
        for (var i = 0; i < node.children.length; i++) {
            var child = node.children[i];

            var dist = node.leaf ? sqSegDist(child, b, c) : sqSegBoxDist(b, c, child);
            if (dist > maxDist) continue; // skip the node if it's farther than we ever need

            queue.push({
                node: child,
                dist: dist
            });
        }

        while (queue.length && !queue.peek().node.children) {
            var item = queue.pop();
            var p = item.node;

            // skip all points that are as close to adjacent edges (a,b) and (c,d),
            // and points that would introduce self-intersections when connected
            var d0 = sqSegDist(p, a, b);
            var d1 = sqSegDist(p, c, d);
            if (item.dist < d0 && item.dist < d1 &&
                noIntersections(b, p, segTree) &&
                noIntersections(c, p, segTree)) return p;
        }

        node = queue.pop();
        if (node) node = node.node;
    }

    return null;
}

function compareDist(a, b) {
    return a.dist - b.dist;
}

// square distance from a segment bounding box to the given one
function sqSegBoxDist(a, b, bbox) {
    if (inside(a, bbox) || inside(b, bbox)) return 0;
    var d1 = sqSegSegDist(a[0], a[1], b[0], b[1], bbox.minX, bbox.minY, bbox.maxX, bbox.minY);
    if (d1 === 0) return 0;
    var d2 = sqSegSegDist(a[0], a[1], b[0], b[1], bbox.minX, bbox.minY, bbox.minX, bbox.maxY);
    if (d2 === 0) return 0;
    var d3 = sqSegSegDist(a[0], a[1], b[0], b[1], bbox.maxX, bbox.minY, bbox.maxX, bbox.maxY);
    if (d3 === 0) return 0;
    var d4 = sqSegSegDist(a[0], a[1], b[0], b[1], bbox.minX, bbox.maxY, bbox.maxX, bbox.maxY);
    if (d4 === 0) return 0;
    return Math.min(d1, d2, d3, d4);
}

function inside(a, bbox) {
    return a[0] >= bbox.minX &&
           a[0] <= bbox.maxX &&
           a[1] >= bbox.minY &&
           a[1] <= bbox.maxY;
}

// check if the edge (a,b) doesn't intersect any other edges
function noIntersections(a, b, segTree) {
    var minX = Math.min(a[0], b[0]);
    var minY = Math.min(a[1], b[1]);
    var maxX = Math.max(a[0], b[0]);
    var maxY = Math.max(a[1], b[1]);

    var edges = segTree.search({minX: minX, minY: minY, maxX: maxX, maxY: maxY});
    for (var i = 0; i < edges.length; i++) {
        if (intersects(edges[i].p, edges[i].next.p, a, b)) return false;
    }
    return true;
}

function cross(p1, p2, p3) {
    return orient(p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]);
}

// check if the edges (p1,q1) and (p2,q2) intersect
function intersects(p1, q1, p2, q2) {
    return p1 !== q2 && q1 !== p2 &&
        cross(p1, q1, p2) > 0 !== cross(p1, q1, q2) > 0 &&
        cross(p2, q2, p1) > 0 !== cross(p2, q2, q1) > 0;
}

// update the bounding box of a node's edge
function updateBBox(node) {
    var p1 = node.p;
    var p2 = node.next.p;
    node.minX = Math.min(p1[0], p2[0]);
    node.minY = Math.min(p1[1], p2[1]);
    node.maxX = Math.max(p1[0], p2[0]);
    node.maxY = Math.max(p1[1], p2[1]);
    return node;
}

// speed up convex hull by filtering out points inside quadrilateral formed by 4 extreme points
function fastConvexHull(points) {
    var left = points[0];
    var top = points[0];
    var right = points[0];
    var bottom = points[0];

    // find the leftmost, rightmost, topmost and bottommost points
    for (var i = 0; i < points.length; i++) {
        var p = points[i];
        if (p[0] < left[0]) left = p;
        if (p[0] > right[0]) right = p;
        if (p[1] < top[1]) top = p;
        if (p[1] > bottom[1]) bottom = p;
    }

    // filter out points that are inside the resulting quadrilateral
    var cull = [left, top, right, bottom];
    var filtered = cull.slice();
    for (i = 0; i < points.length; i++) {
        if (!pointInPolygon(points[i], cull)) filtered.push(points[i]);
    }

    // get convex hull around the filtered points
    return convexHull(filtered);
}

// create a new node in a doubly linked list
function insertNode(p, prev) {
    var node = {
        p: p,
        prev: null,
        next: null,
        minX: 0,
        minY: 0,
        maxX: 0,
        maxY: 0
    };

    if (!prev) {
        node.prev = node;
        node.next = node;

    } else {
        node.next = prev.next;
        node.prev = prev;
        prev.next.prev = node;
        prev.next = node;
    }
    return node;
}

// square distance between 2 points
function getSqDist(p1, p2) {

    var dx = p1[0] - p2[0],
        dy = p1[1] - p2[1];

    return dx * dx + dy * dy;
}

// square distance from a point to a segment
function sqSegDist(p, p1, p2) {

    var x = p1[0],
        y = p1[1],
        dx = p2[0] - x,
        dy = p2[1] - y;

    if (dx !== 0 || dy !== 0) {

        var t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);

        if (t > 1) {
            x = p2[0];
            y = p2[1];

        } else if (t > 0) {
            x += dx * t;
            y += dy * t;
        }
    }

    dx = p[0] - x;
    dy = p[1] - y;

    return dx * dx + dy * dy;
}

// segment to segment distance, ported from http://geomalgorithms.com/a07-_distance.html by Dan Sunday
function sqSegSegDist(x0, y0, x1, y1, x2, y2, x3, y3) {
    var ux = x1 - x0;
    var uy = y1 - y0;
    var vx = x3 - x2;
    var vy = y3 - y2;
    var wx = x0 - x2;
    var wy = y0 - y2;
    var a = ux * ux + uy * uy;
    var b = ux * vx + uy * vy;
    var c = vx * vx + vy * vy;
    var d = ux * wx + uy * wy;
    var e = vx * wx + vy * wy;
    var D = a * c - b * b;

    var sc, sN, tc, tN;
    var sD = D;
    var tD = D;

    if (D === 0) {
        sN = 0;
        sD = 1;
        tN = e;
        tD = c;
    } else {
        sN = b * e - c * d;
        tN = a * e - b * d;
        if (sN < 0) {
            sN = 0;
            tN = e;
            tD = c;
        } else if (sN > sD) {
            sN = sD;
            tN = e + b;
            tD = c;
        }
    }

    if (tN < 0.0) {
        tN = 0.0;
        if (-d < 0.0) sN = 0.0;
        else if (-d > a) sN = sD;
        else {
            sN = -d;
            sD = a;
        }
    } else if (tN > tD) {
        tN = tD;
        if ((-d + b) < 0.0) sN = 0;
        else if (-d + b > a) sN = sD;
        else {
            sN = -d + b;
            sD = a;
        }
    }

    sc = sN === 0 ? 0 : sN / sD;
    tc = tN === 0 ? 0 : tN / tD;

    var cx = (1 - sc) * x0 + sc * x1;
    var cy = (1 - sc) * y0 + sc * y1;
    var cx2 = (1 - tc) * x2 + tc * x3;
    var cy2 = (1 - tc) * y2 + tc * y3;
    var dx = cx2 - cx;
    var dy = cy2 - cy;

    return dx * dx + dy * dy;
}

function compareByX(a, b) {
    return a[0] === b[0] ? a[1] - b[1] : a[0] - b[0];
}

function convexHull(points) {
    points.sort(compareByX);

    var lower = [];
    for (var i = 0; i < points.length; i++) {
        while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], points[i]) <= 0) {
            lower.pop();
        }
        lower.push(points[i]);
    }

    var upper = [];
    for (var ii = points.length - 1; ii >= 0; ii--) {
        while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], points[ii]) <= 0) {
            upper.pop();
        }
        upper.push(points[ii]);
    }

    upper.pop();
    lower.pop();
    return lower.concat(upper);
}


/***/ }),

/***/ 895:
/***/ (function(module) {

module.exports = function pointInPolygonFlat (point, vs, start, end) {
    var x = point[0], y = point[1];
    var inside = false;
    if (start === undefined) start = 0;
    if (end === undefined) end = vs.length;
    var len = (end-start)/2;
    for (var i = 0, j = len - 1; i < len; j = i++) {
        var xi = vs[start+i*2+0], yi = vs[start+i*2+1];
        var xj = vs[start+j*2+0], yj = vs[start+j*2+1];
        var intersect = ((yi > y) !== (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
};


/***/ }),

/***/ 960:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var pointInPolygonFlat = __webpack_require__(895)
var pointInPolygonNested = __webpack_require__(139)

module.exports = function pointInPolygon (point, vs, start, end) {
    if (vs.length > 0 && Array.isArray(vs[0])) {
        return pointInPolygonNested(point, vs, start, end);
    } else {
        return pointInPolygonFlat(point, vs, start, end);
    }
}
module.exports.nested = pointInPolygonNested
module.exports.flat = pointInPolygonFlat


/***/ }),

/***/ 139:
/***/ (function(module) {

// ray-casting algorithm based on
// https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html

module.exports = function pointInPolygonNested (point, vs, start, end) {
    var x = point[0], y = point[1];
    var inside = false;
    if (start === undefined) start = 0;
    if (end === undefined) end = vs.length;
    var len = end - start;
    for (var i = 0, j = len - 1; i < len; j = i++) {
        var xi = vs[i+start][0], yi = vs[i+start][1];
        var xj = vs[j+start][0], yj = vs[j+start][1];
        var intersect = ((yi > y) !== (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
};


/***/ }),

/***/ 513:
/***/ (function(module) {

module.exports = {
    decomp: polygonDecomp,
    quickDecomp: polygonQuickDecomp,
    isSimple: polygonIsSimple,
    removeCollinearPoints: polygonRemoveCollinearPoints,
    removeDuplicatePoints: polygonRemoveDuplicatePoints,
    makeCCW: polygonMakeCCW
};

/**
 * Compute the intersection between two lines.
 * @static
 * @method lineInt
 * @param  {Array}  l1          Line vector 1
 * @param  {Array}  l2          Line vector 2
 * @param  {Number} precision   Precision to use when checking if the lines are parallel
 * @return {Array}              The intersection point.
 */
function lineInt(l1,l2,precision){
    precision = precision || 0;
    var i = [0,0]; // point
    var a1, b1, c1, a2, b2, c2, det; // scalars
    a1 = l1[1][1] - l1[0][1];
    b1 = l1[0][0] - l1[1][0];
    c1 = a1 * l1[0][0] + b1 * l1[0][1];
    a2 = l2[1][1] - l2[0][1];
    b2 = l2[0][0] - l2[1][0];
    c2 = a2 * l2[0][0] + b2 * l2[0][1];
    det = a1 * b2 - a2*b1;
    if (!scalar_eq(det, 0, precision)) { // lines are not parallel
        i[0] = (b2 * c1 - b1 * c2) / det;
        i[1] = (a1 * c2 - a2 * c1) / det;
    }
    return i;
}

/**
 * Checks if two line segments intersects.
 * @method segmentsIntersect
 * @param {Array} p1 The start vertex of the first line segment.
 * @param {Array} p2 The end vertex of the first line segment.
 * @param {Array} q1 The start vertex of the second line segment.
 * @param {Array} q2 The end vertex of the second line segment.
 * @return {Boolean} True if the two line segments intersect
 */
function lineSegmentsIntersect(p1, p2, q1, q2){
	var dx = p2[0] - p1[0];
	var dy = p2[1] - p1[1];
	var da = q2[0] - q1[0];
	var db = q2[1] - q1[1];

	// segments are parallel
	if((da*dy - db*dx) === 0){
		return false;
	}

	var s = (dx * (q1[1] - p1[1]) + dy * (p1[0] - q1[0])) / (da * dy - db * dx);
	var t = (da * (p1[1] - q1[1]) + db * (q1[0] - p1[0])) / (db * dx - da * dy);

	return (s>=0 && s<=1 && t>=0 && t<=1);
}

/**
 * Get the area of a triangle spanned by the three given points. Note that the area will be negative if the points are not given in counter-clockwise order.
 * @static
 * @method area
 * @param  {Array} a
 * @param  {Array} b
 * @param  {Array} c
 * @return {Number}
 */
function triangleArea(a,b,c){
    return (((b[0] - a[0])*(c[1] - a[1]))-((c[0] - a[0])*(b[1] - a[1])));
}

function isLeft(a,b,c){
    return triangleArea(a,b,c) > 0;
}

function isLeftOn(a,b,c) {
    return triangleArea(a, b, c) >= 0;
}

function isRight(a,b,c) {
    return triangleArea(a, b, c) < 0;
}

function isRightOn(a,b,c) {
    return triangleArea(a, b, c) <= 0;
}

var tmpPoint1 = [],
    tmpPoint2 = [];

/**
 * Check if three points are collinear
 * @method collinear
 * @param  {Array} a
 * @param  {Array} b
 * @param  {Array} c
 * @param  {Number} [thresholdAngle=0] Threshold angle to use when comparing the vectors. The function will return true if the angle between the resulting vectors is less than this value. Use zero for max precision.
 * @return {Boolean}
 */
function collinear(a,b,c,thresholdAngle) {
    if(!thresholdAngle){
        return triangleArea(a, b, c) === 0;
    } else {
        var ab = tmpPoint1,
            bc = tmpPoint2;

        ab[0] = b[0]-a[0];
        ab[1] = b[1]-a[1];
        bc[0] = c[0]-b[0];
        bc[1] = c[1]-b[1];

        var dot = ab[0]*bc[0] + ab[1]*bc[1],
            magA = Math.sqrt(ab[0]*ab[0] + ab[1]*ab[1]),
            magB = Math.sqrt(bc[0]*bc[0] + bc[1]*bc[1]),
            angle = Math.acos(dot/(magA*magB));
        return angle < thresholdAngle;
    }
}

function sqdist(a,b){
    var dx = b[0] - a[0];
    var dy = b[1] - a[1];
    return dx * dx + dy * dy;
}

/**
 * Get a vertex at position i. It does not matter if i is out of bounds, this function will just cycle.
 * @method at
 * @param  {Number} i
 * @return {Array}
 */
function polygonAt(polygon, i){
    var s = polygon.length;
    return polygon[i < 0 ? i % s + s : i % s];
}

/**
 * Clear the polygon data
 * @method clear
 * @return {Array}
 */
function polygonClear(polygon){
    polygon.length = 0;
}

/**
 * Append points "from" to "to"-1 from an other polygon "poly" onto this one.
 * @method append
 * @param {Polygon} poly The polygon to get points from.
 * @param {Number}  from The vertex index in "poly".
 * @param {Number}  to The end vertex index in "poly". Note that this vertex is NOT included when appending.
 * @return {Array}
 */
function polygonAppend(polygon, poly, from, to){
    for(var i=from; i<to; i++){
        polygon.push(poly[i]);
    }
}

/**
 * Make sure that the polygon vertices are ordered counter-clockwise.
 * @method makeCCW
 */
function polygonMakeCCW(polygon){
    var br = 0,
        v = polygon;

    // find bottom right point
    for (var i = 1; i < polygon.length; ++i) {
        if (v[i][1] < v[br][1] || (v[i][1] === v[br][1] && v[i][0] > v[br][0])) {
            br = i;
        }
    }

    // reverse poly if clockwise
    if (!isLeft(polygonAt(polygon, br - 1), polygonAt(polygon, br), polygonAt(polygon, br + 1))) {
        polygonReverse(polygon);
        return true;
    } else {
        return false;
    }
}

/**
 * Reverse the vertices in the polygon
 * @method reverse
 */
function polygonReverse(polygon){
    var tmp = [];
    var N = polygon.length;
    for(var i=0; i!==N; i++){
        tmp.push(polygon.pop());
    }
    for(var i=0; i!==N; i++){
		polygon[i] = tmp[i];
    }
}

/**
 * Check if a point in the polygon is a reflex point
 * @method isReflex
 * @param  {Number}  i
 * @return {Boolean}
 */
function polygonIsReflex(polygon, i){
    return isRight(polygonAt(polygon, i - 1), polygonAt(polygon, i), polygonAt(polygon, i + 1));
}

var tmpLine1=[],
    tmpLine2=[];

/**
 * Check if two vertices in the polygon can see each other
 * @method canSee
 * @param  {Number} a Vertex index 1
 * @param  {Number} b Vertex index 2
 * @return {Boolean}
 */
function polygonCanSee(polygon, a,b) {
    var p, dist, l1=tmpLine1, l2=tmpLine2;

    if (isLeftOn(polygonAt(polygon, a + 1), polygonAt(polygon, a), polygonAt(polygon, b)) && isRightOn(polygonAt(polygon, a - 1), polygonAt(polygon, a), polygonAt(polygon, b))) {
        return false;
    }
    dist = sqdist(polygonAt(polygon, a), polygonAt(polygon, b));
    for (var i = 0; i !== polygon.length; ++i) { // for each edge
        if ((i + 1) % polygon.length === a || i === a){ // ignore incident edges
            continue;
        }
        if (isLeftOn(polygonAt(polygon, a), polygonAt(polygon, b), polygonAt(polygon, i + 1)) && isRightOn(polygonAt(polygon, a), polygonAt(polygon, b), polygonAt(polygon, i))) { // if diag intersects an edge
            l1[0] = polygonAt(polygon, a);
            l1[1] = polygonAt(polygon, b);
            l2[0] = polygonAt(polygon, i);
            l2[1] = polygonAt(polygon, i + 1);
            p = lineInt(l1,l2);
            if (sqdist(polygonAt(polygon, a), p) < dist) { // if edge is blocking visibility to b
                return false;
            }
        }
    }

    return true;
}

/**
 * Check if two vertices in the polygon can see each other
 * @method canSee2
 * @param  {Number} a Vertex index 1
 * @param  {Number} b Vertex index 2
 * @return {Boolean}
 */
function polygonCanSee2(polygon, a,b) {
    // for each edge
    for (var i = 0; i !== polygon.length; ++i) {
        // ignore incident edges
        if (i === a || i === b || (i + 1) % polygon.length === a || (i + 1) % polygon.length === b){
            continue;
        }
        if( lineSegmentsIntersect(polygonAt(polygon, a), polygonAt(polygon, b), polygonAt(polygon, i), polygonAt(polygon, i+1)) ){
            return false;
        }
    }
    return true;
}

/**
 * Copy the polygon from vertex i to vertex j.
 * @method copy
 * @param  {Number} i
 * @param  {Number} j
 * @param  {Polygon} [targetPoly]   Optional target polygon to save in.
 * @return {Polygon}                The resulting copy.
 */
function polygonCopy(polygon, i,j,targetPoly){
    var p = targetPoly || [];
    polygonClear(p);
    if (i < j) {
        // Insert all vertices from i to j
        for(var k=i; k<=j; k++){
            p.push(polygon[k]);
        }

    } else {

        // Insert vertices 0 to j
        for(var k=0; k<=j; k++){
            p.push(polygon[k]);
        }

        // Insert vertices i to end
        for(var k=i; k<polygon.length; k++){
            p.push(polygon[k]);
        }
    }

    return p;
}

/**
 * Decomposes the polygon into convex pieces. Returns a list of edges [[p1,p2],[p2,p3],...] that cuts the polygon.
 * Note that this algorithm has complexity O(N^4) and will be very slow for polygons with many vertices.
 * @method getCutEdges
 * @return {Array}
 */
function polygonGetCutEdges(polygon) {
    var min=[], tmp1=[], tmp2=[], tmpPoly = [];
    var nDiags = Number.MAX_VALUE;

    for (var i = 0; i < polygon.length; ++i) {
        if (polygonIsReflex(polygon, i)) {
            for (var j = 0; j < polygon.length; ++j) {
                if (polygonCanSee(polygon, i, j)) {
                    tmp1 = polygonGetCutEdges(polygonCopy(polygon, i, j, tmpPoly));
                    tmp2 = polygonGetCutEdges(polygonCopy(polygon, j, i, tmpPoly));

                    for(var k=0; k<tmp2.length; k++){
                        tmp1.push(tmp2[k]);
                    }

                    if (tmp1.length < nDiags) {
                        min = tmp1;
                        nDiags = tmp1.length;
                        min.push([polygonAt(polygon, i), polygonAt(polygon, j)]);
                    }
                }
            }
        }
    }

    return min;
}

/**
 * Decomposes the polygon into one or more convex sub-Polygons.
 * @method decomp
 * @return {Array} An array or Polygon objects.
 */
function polygonDecomp(polygon){
    var edges = polygonGetCutEdges(polygon);
    if(edges.length > 0){
        return polygonSlice(polygon, edges);
    } else {
        return [polygon];
    }
}

/**
 * Slices the polygon given one or more cut edges. If given one, this function will return two polygons (false on failure). If many, an array of polygons.
 * @method slice
 * @param {Array} cutEdges A list of edges, as returned by .getCutEdges()
 * @return {Array}
 */
function polygonSlice(polygon, cutEdges){
    if(cutEdges.length === 0){
		return [polygon];
    }
    if(cutEdges instanceof Array && cutEdges.length && cutEdges[0] instanceof Array && cutEdges[0].length===2 && cutEdges[0][0] instanceof Array){

        var polys = [polygon];

        for(var i=0; i<cutEdges.length; i++){
            var cutEdge = cutEdges[i];
            // Cut all polys
            for(var j=0; j<polys.length; j++){
                var poly = polys[j];
                var result = polygonSlice(poly, cutEdge);
                if(result){
                    // Found poly! Cut and quit
                    polys.splice(j,1);
                    polys.push(result[0],result[1]);
                    break;
                }
            }
        }

        return polys;
    } else {

        // Was given one edge
        var cutEdge = cutEdges;
        var i = polygon.indexOf(cutEdge[0]);
        var j = polygon.indexOf(cutEdge[1]);

        if(i !== -1 && j !== -1){
            return [polygonCopy(polygon, i,j),
                    polygonCopy(polygon, j,i)];
        } else {
            return false;
        }
    }
}

/**
 * Checks that the line segments of this polygon do not intersect each other.
 * @method isSimple
 * @param  {Array} path An array of vertices e.g. [[0,0],[0,1],...]
 * @return {Boolean}
 * @todo Should it check all segments with all others?
 */
function polygonIsSimple(polygon){
    var path = polygon, i;
    // Check
    for(i=0; i<path.length-1; i++){
        for(var j=0; j<i-1; j++){
            if(lineSegmentsIntersect(path[i], path[i+1], path[j], path[j+1] )){
                return false;
            }
        }
    }

    // Check the segment between the last and the first point to all others
    for(i=1; i<path.length-2; i++){
        if(lineSegmentsIntersect(path[0], path[path.length-1], path[i], path[i+1] )){
            return false;
        }
    }

    return true;
}

function getIntersectionPoint(p1, p2, q1, q2, delta){
	delta = delta || 0;
	var a1 = p2[1] - p1[1];
	var b1 = p1[0] - p2[0];
	var c1 = (a1 * p1[0]) + (b1 * p1[1]);
	var a2 = q2[1] - q1[1];
	var b2 = q1[0] - q2[0];
	var c2 = (a2 * q1[0]) + (b2 * q1[1]);
	var det = (a1 * b2) - (a2 * b1);

	if(!scalar_eq(det,0,delta)){
		return [((b2 * c1) - (b1 * c2)) / det, ((a1 * c2) - (a2 * c1)) / det];
	} else {
		return [0,0];
    }
}

/**
 * Quickly decompose the Polygon into convex sub-polygons.
 * @method quickDecomp
 * @param  {Array} result
 * @param  {Array} [reflexVertices]
 * @param  {Array} [steinerPoints]
 * @param  {Number} [delta]
 * @param  {Number} [maxlevel]
 * @param  {Number} [level]
 * @return {Array}
 */
function polygonQuickDecomp(polygon, result,reflexVertices,steinerPoints,delta,maxlevel,level){
    maxlevel = maxlevel || 100;
    level = level || 0;
    delta = delta || 25;
    result = typeof(result)!=="undefined" ? result : [];
    reflexVertices = reflexVertices || [];
    steinerPoints = steinerPoints || [];

    var upperInt=[0,0], lowerInt=[0,0], p=[0,0]; // Points
    var upperDist=0, lowerDist=0, d=0, closestDist=0; // scalars
    var upperIndex=0, lowerIndex=0, closestIndex=0; // Integers
    var lowerPoly=[], upperPoly=[]; // polygons
    var poly = polygon,
        v = polygon;

    if(v.length < 3){
		return result;
    }

    level++;
    if(level > maxlevel){
        console.warn("quickDecomp: max level ("+maxlevel+") reached.");
        return result;
    }

    for (var i = 0; i < polygon.length; ++i) {
        if (polygonIsReflex(poly, i)) {
            reflexVertices.push(poly[i]);
            upperDist = lowerDist = Number.MAX_VALUE;


            for (var j = 0; j < polygon.length; ++j) {
                if (isLeft(polygonAt(poly, i - 1), polygonAt(poly, i), polygonAt(poly, j)) && isRightOn(polygonAt(poly, i - 1), polygonAt(poly, i), polygonAt(poly, j - 1))) { // if line intersects with an edge
                    p = getIntersectionPoint(polygonAt(poly, i - 1), polygonAt(poly, i), polygonAt(poly, j), polygonAt(poly, j - 1)); // find the point of intersection
                    if (isRight(polygonAt(poly, i + 1), polygonAt(poly, i), p)) { // make sure it's inside the poly
                        d = sqdist(poly[i], p);
                        if (d < lowerDist) { // keep only the closest intersection
                            lowerDist = d;
                            lowerInt = p;
                            lowerIndex = j;
                        }
                    }
                }
                if (isLeft(polygonAt(poly, i + 1), polygonAt(poly, i), polygonAt(poly, j + 1)) && isRightOn(polygonAt(poly, i + 1), polygonAt(poly, i), polygonAt(poly, j))) {
                    p = getIntersectionPoint(polygonAt(poly, i + 1), polygonAt(poly, i), polygonAt(poly, j), polygonAt(poly, j + 1));
                    if (isLeft(polygonAt(poly, i - 1), polygonAt(poly, i), p)) {
                        d = sqdist(poly[i], p);
                        if (d < upperDist) {
                            upperDist = d;
                            upperInt = p;
                            upperIndex = j;
                        }
                    }
                }
            }

            // if there are no vertices to connect to, choose a point in the middle
            if (lowerIndex === (upperIndex + 1) % polygon.length) {
                //console.log("Case 1: Vertex("+i+"), lowerIndex("+lowerIndex+"), upperIndex("+upperIndex+"), poly.size("+polygon.length+")");
                p[0] = (lowerInt[0] + upperInt[0]) / 2;
                p[1] = (lowerInt[1] + upperInt[1]) / 2;
                steinerPoints.push(p);

                if (i < upperIndex) {
                    //lowerPoly.insert(lowerPoly.end(), poly.begin() + i, poly.begin() + upperIndex + 1);
                    polygonAppend(lowerPoly, poly, i, upperIndex+1);
                    lowerPoly.push(p);
                    upperPoly.push(p);
                    if (lowerIndex !== 0){
                        //upperPoly.insert(upperPoly.end(), poly.begin() + lowerIndex, poly.end());
                        polygonAppend(upperPoly, poly,lowerIndex,poly.length);
                    }
                    //upperPoly.insert(upperPoly.end(), poly.begin(), poly.begin() + i + 1);
                    polygonAppend(upperPoly, poly,0,i+1);
                } else {
                    if (i !== 0){
                        //lowerPoly.insert(lowerPoly.end(), poly.begin() + i, poly.end());
                        polygonAppend(lowerPoly, poly,i,poly.length);
                    }
                    //lowerPoly.insert(lowerPoly.end(), poly.begin(), poly.begin() + upperIndex + 1);
                    polygonAppend(lowerPoly, poly,0,upperIndex+1);
                    lowerPoly.push(p);
                    upperPoly.push(p);
                    //upperPoly.insert(upperPoly.end(), poly.begin() + lowerIndex, poly.begin() + i + 1);
                    polygonAppend(upperPoly, poly,lowerIndex,i+1);
                }
            } else {
                // connect to the closest point within the triangle
                //console.log("Case 2: Vertex("+i+"), closestIndex("+closestIndex+"), poly.size("+polygon.length+")\n");

                if (lowerIndex > upperIndex) {
                    upperIndex += polygon.length;
                }
                closestDist = Number.MAX_VALUE;

                if(upperIndex < lowerIndex){
                    return result;
                }

                for (var j = lowerIndex; j <= upperIndex; ++j) {
                    if (
                        isLeftOn(polygonAt(poly, i - 1), polygonAt(poly, i), polygonAt(poly, j)) &&
                        isRightOn(polygonAt(poly, i + 1), polygonAt(poly, i), polygonAt(poly, j))
                    ) {
                        d = sqdist(polygonAt(poly, i), polygonAt(poly, j));
                        if (d < closestDist && polygonCanSee2(poly, i, j)) {
                            closestDist = d;
                            closestIndex = j % polygon.length;
                        }
                    }
                }

                if (i < closestIndex) {
                    polygonAppend(lowerPoly, poly,i,closestIndex+1);
                    if (closestIndex !== 0){
                        polygonAppend(upperPoly, poly,closestIndex,v.length);
                    }
                    polygonAppend(upperPoly, poly,0,i+1);
                } else {
                    if (i !== 0){
                        polygonAppend(lowerPoly, poly,i,v.length);
                    }
                    polygonAppend(lowerPoly, poly,0,closestIndex+1);
                    polygonAppend(upperPoly, poly,closestIndex,i+1);
                }
            }

            // solve smallest poly first
            if (lowerPoly.length < upperPoly.length) {
                polygonQuickDecomp(lowerPoly,result,reflexVertices,steinerPoints,delta,maxlevel,level);
                polygonQuickDecomp(upperPoly,result,reflexVertices,steinerPoints,delta,maxlevel,level);
            } else {
                polygonQuickDecomp(upperPoly,result,reflexVertices,steinerPoints,delta,maxlevel,level);
                polygonQuickDecomp(lowerPoly,result,reflexVertices,steinerPoints,delta,maxlevel,level);
            }

            return result;
        }
    }
    result.push(polygon);

    return result;
}

/**
 * Remove collinear points in the polygon.
 * @method removeCollinearPoints
 * @param  {Number} [precision] The threshold angle to use when determining whether two edges are collinear. Use zero for finest precision.
 * @return {Number}           The number of points removed
 */
function polygonRemoveCollinearPoints(polygon, precision){
    var num = 0;
    for(var i=polygon.length-1; polygon.length>3 && i>=0; --i){
        if(collinear(polygonAt(polygon, i-1),polygonAt(polygon, i),polygonAt(polygon, i+1),precision)){
            // Remove the middle point
            polygon.splice(i%polygon.length,1);
            num++;
        }
    }
    return num;
}

/**
 * Remove duplicate points in the polygon.
 * @method removeDuplicatePoints
 * @param  {Number} [precision] The threshold to use when determining whether two points are the same. Use zero for best precision.
 */
function polygonRemoveDuplicatePoints(polygon, precision){
    for(var i=polygon.length-1; i>=1; --i){
        var pi = polygon[i];
        for(var j=i-1; j>=0; --j){
            if(points_eq(pi, polygon[j], precision)){
                polygon.splice(i,1);
                continue;
            }
        }
    }
}

/**
 * Check if two scalars are equal
 * @static
 * @method eq
 * @param  {Number} a
 * @param  {Number} b
 * @param  {Number} [precision]
 * @return {Boolean}
 */
function scalar_eq(a,b,precision){
    precision = precision || 0;
    return Math.abs(a-b) <= precision;
}

/**
 * Check if two points are equal
 * @static
 * @method points_eq
 * @param  {Array} a
 * @param  {Array} b
 * @param  {Number} [precision]
 * @return {Boolean}
 */
function points_eq(a,b,precision){
    return scalar_eq(a[0],b[0],precision) && scalar_eq(a[1],b[1],precision);
}


/***/ }),

/***/ 582:
/***/ (function(module) {

!function(t,i){ true?module.exports=i():0}(this,function(){"use strict";function t(t,r,e,a,h){!function t(n,r,e,a,h){for(;a>e;){if(a-e>600){var o=a-e+1,s=r-e+1,l=Math.log(o),f=.5*Math.exp(2*l/3),u=.5*Math.sqrt(l*f*(o-f)/o)*(s-o/2<0?-1:1),m=Math.max(e,Math.floor(r-s*f/o+u)),c=Math.min(a,Math.floor(r+(o-s)*f/o+u));t(n,r,m,c,h)}var p=n[r],d=e,x=a;for(i(n,e,r),h(n[a],p)>0&&i(n,e,a);d<x;){for(i(n,d,x),d++,x--;h(n[d],p)<0;)d++;for(;h(n[x],p)>0;)x--}0===h(n[e],p)?i(n,e,x):i(n,++x,a),x<=r&&(e=x+1),r<=x&&(a=x-1)}}(t,r,e||0,a||t.length-1,h||n)}function i(t,i,n){var r=t[i];t[i]=t[n],t[n]=r}function n(t,i){return t<i?-1:t>i?1:0}var r=function(t){void 0===t&&(t=9),this._maxEntries=Math.max(4,t),this._minEntries=Math.max(2,Math.ceil(.4*this._maxEntries)),this.clear()};function e(t,i,n){if(!n)return i.indexOf(t);for(var r=0;r<i.length;r++)if(n(t,i[r]))return r;return-1}function a(t,i){h(t,0,t.children.length,i,t)}function h(t,i,n,r,e){e||(e=p(null)),e.minX=1/0,e.minY=1/0,e.maxX=-1/0,e.maxY=-1/0;for(var a=i;a<n;a++){var h=t.children[a];o(e,t.leaf?r(h):h)}return e}function o(t,i){return t.minX=Math.min(t.minX,i.minX),t.minY=Math.min(t.minY,i.minY),t.maxX=Math.max(t.maxX,i.maxX),t.maxY=Math.max(t.maxY,i.maxY),t}function s(t,i){return t.minX-i.minX}function l(t,i){return t.minY-i.minY}function f(t){return(t.maxX-t.minX)*(t.maxY-t.minY)}function u(t){return t.maxX-t.minX+(t.maxY-t.minY)}function m(t,i){return t.minX<=i.minX&&t.minY<=i.minY&&i.maxX<=t.maxX&&i.maxY<=t.maxY}function c(t,i){return i.minX<=t.maxX&&i.minY<=t.maxY&&i.maxX>=t.minX&&i.maxY>=t.minY}function p(t){return{children:t,height:1,leaf:!0,minX:1/0,minY:1/0,maxX:-1/0,maxY:-1/0}}function d(i,n,r,e,a){for(var h=[n,r];h.length;)if(!((r=h.pop())-(n=h.pop())<=e)){var o=n+Math.ceil((r-n)/e/2)*e;t(i,o,n,r,a),h.push(n,o,o,r)}}return r.prototype.all=function(){return this._all(this.data,[])},r.prototype.search=function(t){var i=this.data,n=[];if(!c(t,i))return n;for(var r=this.toBBox,e=[];i;){for(var a=0;a<i.children.length;a++){var h=i.children[a],o=i.leaf?r(h):h;c(t,o)&&(i.leaf?n.push(h):m(t,o)?this._all(h,n):e.push(h))}i=e.pop()}return n},r.prototype.collides=function(t){var i=this.data;if(!c(t,i))return!1;for(var n=[];i;){for(var r=0;r<i.children.length;r++){var e=i.children[r],a=i.leaf?this.toBBox(e):e;if(c(t,a)){if(i.leaf||m(t,a))return!0;n.push(e)}}i=n.pop()}return!1},r.prototype.load=function(t){if(!t||!t.length)return this;if(t.length<this._minEntries){for(var i=0;i<t.length;i++)this.insert(t[i]);return this}var n=this._build(t.slice(),0,t.length-1,0);if(this.data.children.length)if(this.data.height===n.height)this._splitRoot(this.data,n);else{if(this.data.height<n.height){var r=this.data;this.data=n,n=r}this._insert(n,this.data.height-n.height-1,!0)}else this.data=n;return this},r.prototype.insert=function(t){return t&&this._insert(t,this.data.height-1),this},r.prototype.clear=function(){return this.data=p([]),this},r.prototype.remove=function(t,i){if(!t)return this;for(var n,r,a,h=this.data,o=this.toBBox(t),s=[],l=[];h||s.length;){if(h||(h=s.pop(),r=s[s.length-1],n=l.pop(),a=!0),h.leaf){var f=e(t,h.children,i);if(-1!==f)return h.children.splice(f,1),s.push(h),this._condense(s),this}a||h.leaf||!m(h,o)?r?(n++,h=r.children[n],a=!1):h=null:(s.push(h),l.push(n),n=0,r=h,h=h.children[0])}return this},r.prototype.toBBox=function(t){return t},r.prototype.compareMinX=function(t,i){return t.minX-i.minX},r.prototype.compareMinY=function(t,i){return t.minY-i.minY},r.prototype.toJSON=function(){return this.data},r.prototype.fromJSON=function(t){return this.data=t,this},r.prototype._all=function(t,i){for(var n=[];t;)t.leaf?i.push.apply(i,t.children):n.push.apply(n,t.children),t=n.pop();return i},r.prototype._build=function(t,i,n,r){var e,h=n-i+1,o=this._maxEntries;if(h<=o)return a(e=p(t.slice(i,n+1)),this.toBBox),e;r||(r=Math.ceil(Math.log(h)/Math.log(o)),o=Math.ceil(h/Math.pow(o,r-1))),(e=p([])).leaf=!1,e.height=r;var s=Math.ceil(h/o),l=s*Math.ceil(Math.sqrt(o));d(t,i,n,l,this.compareMinX);for(var f=i;f<=n;f+=l){var u=Math.min(f+l-1,n);d(t,f,u,s,this.compareMinY);for(var m=f;m<=u;m+=s){var c=Math.min(m+s-1,u);e.children.push(this._build(t,m,c,r-1))}}return a(e,this.toBBox),e},r.prototype._chooseSubtree=function(t,i,n,r){for(;r.push(i),!i.leaf&&r.length-1!==n;){for(var e=1/0,a=1/0,h=void 0,o=0;o<i.children.length;o++){var s=i.children[o],l=f(s),u=(m=t,c=s,(Math.max(c.maxX,m.maxX)-Math.min(c.minX,m.minX))*(Math.max(c.maxY,m.maxY)-Math.min(c.minY,m.minY))-l);u<a?(a=u,e=l<e?l:e,h=s):u===a&&l<e&&(e=l,h=s)}i=h||i.children[0]}var m,c;return i},r.prototype._insert=function(t,i,n){var r=n?t:this.toBBox(t),e=[],a=this._chooseSubtree(r,this.data,i,e);for(a.children.push(t),o(a,r);i>=0&&e[i].children.length>this._maxEntries;)this._split(e,i),i--;this._adjustParentBBoxes(r,e,i)},r.prototype._split=function(t,i){var n=t[i],r=n.children.length,e=this._minEntries;this._chooseSplitAxis(n,e,r);var h=this._chooseSplitIndex(n,e,r),o=p(n.children.splice(h,n.children.length-h));o.height=n.height,o.leaf=n.leaf,a(n,this.toBBox),a(o,this.toBBox),i?t[i-1].children.push(o):this._splitRoot(n,o)},r.prototype._splitRoot=function(t,i){this.data=p([t,i]),this.data.height=t.height+1,this.data.leaf=!1,a(this.data,this.toBBox)},r.prototype._chooseSplitIndex=function(t,i,n){for(var r,e,a,o,s,l,u,m=1/0,c=1/0,p=i;p<=n-i;p++){var d=h(t,0,p,this.toBBox),x=h(t,p,n,this.toBBox),v=(e=d,a=x,o=void 0,s=void 0,l=void 0,u=void 0,o=Math.max(e.minX,a.minX),s=Math.max(e.minY,a.minY),l=Math.min(e.maxX,a.maxX),u=Math.min(e.maxY,a.maxY),Math.max(0,l-o)*Math.max(0,u-s)),M=f(d)+f(x);v<m?(m=v,r=p,c=M<c?M:c):v===m&&M<c&&(c=M,r=p)}return r||n-i},r.prototype._chooseSplitAxis=function(t,i,n){var r=t.leaf?this.compareMinX:s,e=t.leaf?this.compareMinY:l;this._allDistMargin(t,i,n,r)<this._allDistMargin(t,i,n,e)&&t.children.sort(r)},r.prototype._allDistMargin=function(t,i,n,r){t.children.sort(r);for(var e=this.toBBox,a=h(t,0,i,e),s=h(t,n-i,n,e),l=u(a)+u(s),f=i;f<n-i;f++){var m=t.children[f];o(a,t.leaf?e(m):m),l+=u(a)}for(var c=n-i-1;c>=i;c--){var p=t.children[c];o(s,t.leaf?e(p):p),l+=u(s)}return l},r.prototype._adjustParentBBoxes=function(t,i,n){for(var r=n;r>=0;r--)o(i[r],t)},r.prototype._condense=function(t){for(var i=t.length-1,n=void 0;i>=0;i--)0===t[i].children.length?i>0?(n=t[i-1].children).splice(n.indexOf(t[i]),1):this.clear():a(t[i],this.toBBox)},r});


/***/ }),

/***/ 639:
/***/ (function(__unused_webpack_module, exports) {

!function(t,e){ true?e(exports):0}(this,function(t){"use strict";const e=134217729,n=33306690738754706e-32;function r(t,e,n,r,o){let f,i,u,c,s=e[0],a=r[0],d=0,l=0;a>s==a>-s?(f=s,s=e[++d]):(f=a,a=r[++l]);let p=0;if(d<t&&l<n)for(a>s==a>-s?(u=f-((i=s+f)-s),s=e[++d]):(u=f-((i=a+f)-a),a=r[++l]),f=i,0!==u&&(o[p++]=u);d<t&&l<n;)a>s==a>-s?(u=f-((i=f+s)-(c=i-f))+(s-c),s=e[++d]):(u=f-((i=f+a)-(c=i-f))+(a-c),a=r[++l]),f=i,0!==u&&(o[p++]=u);for(;d<t;)u=f-((i=f+s)-(c=i-f))+(s-c),s=e[++d],f=i,0!==u&&(o[p++]=u);for(;l<n;)u=f-((i=f+a)-(c=i-f))+(a-c),a=r[++l],f=i,0!==u&&(o[p++]=u);return 0===f&&0!==p||(o[p++]=f),p}function o(t){return new Float64Array(t)}const f=33306690738754716e-32,i=22204460492503146e-32,u=11093356479670487e-47,c=o(4),s=o(8),a=o(12),d=o(16),l=o(4);t.orient2d=function(t,o,p,b,y,h){const M=(o-h)*(p-y),x=(t-y)*(b-h),j=M-x;if(0===M||0===x||M>0!=x>0)return j;const m=Math.abs(M+x);return Math.abs(j)>=f*m?j:-function(t,o,f,p,b,y,h){let M,x,j,m,_,v,w,A,F,O,P,g,k,q,z,B,C,D;const E=t-b,G=f-b,H=o-y,I=p-y;_=(z=(A=E-(w=(v=e*E)-(v-E)))*(O=I-(F=(v=e*I)-(v-I)))-((q=E*I)-w*F-A*F-w*O))-(P=z-(C=(A=H-(w=(v=e*H)-(v-H)))*(O=G-(F=(v=e*G)-(v-G)))-((B=H*G)-w*F-A*F-w*O))),c[0]=z-(P+_)+(_-C),_=(k=q-((g=q+P)-(_=g-q))+(P-_))-(P=k-B),c[1]=k-(P+_)+(_-B),_=(D=g+P)-g,c[2]=g-(D-_)+(P-_),c[3]=D;let J=function(t,e){let n=e[0];for(let r=1;r<t;r++)n+=e[r];return n}(4,c),K=i*h;if(J>=K||-J>=K)return J;if(M=t-(E+(_=t-E))+(_-b),j=f-(G+(_=f-G))+(_-b),x=o-(H+(_=o-H))+(_-y),m=p-(I+(_=p-I))+(_-y),0===M&&0===x&&0===j&&0===m)return J;if(K=u*h+n*Math.abs(J),(J+=E*m+I*M-(H*j+G*x))>=K||-J>=K)return J;_=(z=(A=M-(w=(v=e*M)-(v-M)))*(O=I-(F=(v=e*I)-(v-I)))-((q=M*I)-w*F-A*F-w*O))-(P=z-(C=(A=x-(w=(v=e*x)-(v-x)))*(O=G-(F=(v=e*G)-(v-G)))-((B=x*G)-w*F-A*F-w*O))),l[0]=z-(P+_)+(_-C),_=(k=q-((g=q+P)-(_=g-q))+(P-_))-(P=k-B),l[1]=k-(P+_)+(_-B),_=(D=g+P)-g,l[2]=g-(D-_)+(P-_),l[3]=D;const L=r(4,c,4,l,s);_=(z=(A=E-(w=(v=e*E)-(v-E)))*(O=m-(F=(v=e*m)-(v-m)))-((q=E*m)-w*F-A*F-w*O))-(P=z-(C=(A=H-(w=(v=e*H)-(v-H)))*(O=j-(F=(v=e*j)-(v-j)))-((B=H*j)-w*F-A*F-w*O))),l[0]=z-(P+_)+(_-C),_=(k=q-((g=q+P)-(_=g-q))+(P-_))-(P=k-B),l[1]=k-(P+_)+(_-B),_=(D=g+P)-g,l[2]=g-(D-_)+(P-_),l[3]=D;const N=r(L,s,4,l,a);_=(z=(A=M-(w=(v=e*M)-(v-M)))*(O=m-(F=(v=e*m)-(v-m)))-((q=M*m)-w*F-A*F-w*O))-(P=z-(C=(A=x-(w=(v=e*x)-(v-x)))*(O=j-(F=(v=e*j)-(v-j)))-((B=x*j)-w*F-A*F-w*O))),l[0]=z-(P+_)+(_-C),_=(k=q-((g=q+P)-(_=g-q))+(P-_))-(P=k-B),l[1]=k-(P+_)+(_-B),_=(D=g+P)-g,l[2]=g-(D-_)+(P-_),l[3]=D;const Q=r(N,a,4,l,d);return d[Q-1]}(t,o,p,b,y,h,m)},t.orient2dfast=function(t,e,n,r,o,f){return(e-f)*(n-o)-(t-o)*(r-f)},Object.defineProperty(t,"__esModule",{value:!0})});


/***/ }),

/***/ 842:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ TinyQueue; }
/* harmony export */ });

class TinyQueue {
    constructor(data = [], compare = defaultCompare) {
        this.data = data;
        this.length = this.data.length;
        this.compare = compare;

        if (this.length > 0) {
            for (let i = (this.length >> 1) - 1; i >= 0; i--) this._down(i);
        }
    }

    push(item) {
        this.data.push(item);
        this.length++;
        this._up(this.length - 1);
    }

    pop() {
        if (this.length === 0) return undefined;

        const top = this.data[0];
        const bottom = this.data.pop();
        this.length--;

        if (this.length > 0) {
            this.data[0] = bottom;
            this._down(0);
        }

        return top;
    }

    peek() {
        return this.data[0];
    }

    _up(pos) {
        const {data, compare} = this;
        const item = data[pos];

        while (pos > 0) {
            const parent = (pos - 1) >> 1;
            const current = data[parent];
            if (compare(item, current) >= 0) break;
            data[pos] = current;
            pos = parent;
        }

        data[pos] = item;
    }

    _down(pos) {
        const {data, compare} = this;
        const halfLength = this.length >> 1;
        const item = data[pos];

        while (pos < halfLength) {
            let left = (pos << 1) + 1;
            let best = data[left];
            const right = left + 1;

            if (right < this.length && compare(data[right], best) < 0) {
                left = right;
                best = data[right];
            }
            if (compare(best, item) >= 0) break;

            data[pos] = best;
            pos = left;
        }

        data[pos] = item;
    }
}

function defaultCompare(a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";

// EXTERNAL MODULE: ./node_modules/concaveman/index.js
var node_modules_concaveman = __webpack_require__(273);
var concaveman_default = /*#__PURE__*/__webpack_require__.n(node_modules_concaveman);
// EXTERNAL MODULE: ./node_modules/poly-decomp/src/index.js
var src = __webpack_require__(513);
;// CONCATENATED MODULE: ../InkBall/src/InkBall.Module/wwwroot/js/shared.js
/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "$" }]*/


/**
 * Point status enum
 * */
const StatusEnum = Object.freeze({
	POINT_FREE_RED: -3,
	POINT_FREE_BLUE: -2,
	POINT_FREE: -1,
	POINT_STARTING: 0,
	POINT_IN_PATH: 1,
	POINT_OWNED_BY_RED: 2,
	POINT_OWNED_BY_BLUE: 3
});

function StatusEnumToString(enumVal) {
	switch (enumVal) {
		case StatusEnum.POINT_FREE_RED:
			return Object.keys(StatusEnum)[0];
		case StatusEnum.POINT_FREE_BLUE:
			return Object.keys(StatusEnum)[1];
		case StatusEnum.POINT_FREE:
			return Object.keys(StatusEnum)[2];
		case StatusEnum.POINT_STARTING:
			return Object.keys(StatusEnum)[3];
		case StatusEnum.POINT_IN_PATH:
			return Object.keys(StatusEnum)[4];
		case StatusEnum.POINT_OWNED_BY_RED:
			return Object.keys(StatusEnum)[5];
		case StatusEnum.POINT_OWNED_BY_BLUE:
			return Object.keys(StatusEnum)[6];

		default:
			throw new Error('bad status enum value');
	}
}

function StringToStatusEnum(enumStr) {
	switch (enumStr.toUpperCase()) {
		case Object.keys(StatusEnum)[0]:
			return StatusEnum.POINT_FREE_RED;
		case Object.keys(StatusEnum)[1]:
			return StatusEnum.POINT_FREE_BLUE;
		case Object.keys(StatusEnum)[2]:
			return StatusEnum.POINT_FREE;
		case Object.keys(StatusEnum)[3]:
			return StatusEnum.POINT_STARTING;
		case Object.keys(StatusEnum)[4]:
			return StatusEnum.POINT_IN_PATH;
		case Object.keys(StatusEnum)[5]:
			return StatusEnum.POINT_OWNED_BY_RED;
		case Object.keys(StatusEnum)[6]:
			return StatusEnum.POINT_OWNED_BY_BLUE;

		default:
			throw new Error('bad status enum string');
	}
}

/**
 * Shared log function
 * @param {any} msg - object to log
 */
function shared_LocalLog(msg) {
	// eslint-disable-next-line no-console
	console.log(msg);
}

/**
 * Shared error log functoin
 * @param {...any} args - objects to log
 */
function LocalError(...args) {
	let msg = '';
	for (let i = 0; i < args.length; i++) {
		const str = args[i];
		if (str)
			msg += str;
	}
	// eslint-disable-next-line no-console
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
	let i, j, c = false;
	for (i = 0, j = npol - 1; i < npol; j = i++) {
		if ((((yp[i] <= y) && (y < yp[j])) ||
			((yp[j] <= y) && (y < yp[i]))) &&
			(x < (xp[j] - xp[i]) * (y - yp[i]) / (yp[j] - yp[i]) + xp[i]))

			c = !c;
	}
	return c;
}

function pnpoly2(pathPoints, x, y) {
	const npol = pathPoints.length;
	let i, j, c = false;

	for (i = 0, j = npol - 1; i < npol; j = i++) {
		const pi = pathPoints[i], pj = pathPoints[j];

		if ((((pi.y <= y) && (y < pj.y)) ||
			((pj.y <= y) && (y < pi.y))) &&
			(x < (pj.x - pi.x) * (y - pi.y) / (pj.y - pi.y) + pi.x))

			c = !c;
	}
	return c;
}

/**
 * Test for array uniquness using default object comparator
 * @param {array} array of objects that are tested againstn uniqenes
 * @returns {boolean} true - has duplicates
 */
function hasDuplicates(array) {
	return (new Set(array)).size !== array.length;
}

async function Sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Sorting point clockwise/anticlockwise
 * @param {array} points array of points to sort
 * @returns {array} of points
 */
function sortPointsClockwise(points) {
	//Modern

	// Get the center (mean value) using reduce
	const center = points.reduce((acc, { x, y }) => {
		acc.x += x;
		acc.y += y;
		return acc;
	}, { x: 0, y: 0 });
	center.x /= points.length;
	center.y /= points.length;

	// Add an angle property to each point using tan(angle) = y/x
	const angles = points.map(({ x, y }) => {
		return { x, y, angle: Math.atan2(y - center.y, x - center.x) * 180 / Math.PI };
	});

	// Sort your points by angle
	const pointsSorted = angles.sort((a, b) => a.angle - b.angle);
	return pointsSorted;
}

//////////////////////////////////////////////////////
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
class SvgVml {
	constructor() {
		const svgNS = "http://www.w3.org/2000/svg";
		let svgAvailable = false, svgAntialias = undefined;
		let documentCreateElementNS_SVG, documentCreateElementNS_Element;
		this.cont = null;
		// Create an SVGPoint for future math
		this.mathSVGPoint = null;

		if (self && self.document && self.document.createElementNS) {
			const some_cont = document.createElementNS(svgNS, "svg");
			svgAvailable = (some_cont.x !== null);
		}

		if (svgAvailable) {
			/* ============= displayable SVG ============== */
			documentCreateElementNS_SVG = function (contextElement) {
				return contextElement;
			}.bind(this);
			documentCreateElementNS_Element = function (elemeName) {
				switch (elemeName) {
					case "circle":
					case "line":
					case "polyline":
						{
							const o = document.createElementNS(svgNS, elemeName);
							return o;
						}

					default:
						throw new Error(`unknwn type ${elemeName}`);
				}
			};
		} else {
			/* ============= emulated SVG ============== */
			documentCreateElementNS_SVG = function () {
				return {
					attributes: new Map(),
					children: [],
					setAttributeNS: function (_nullish, key, val) {
						this.attributes.set(key, val);
					},
					appendChild: function (val) {
						this.children.push(val);
					},
					removeChild: function (val) {
						const index = this.children.indexOf(val);
						if (index !== -1)
							this.children.splice(index, 1);
					}
				};
			};
			/////////////// Pollyfills start ///////////////
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
				this.attributes.delete(key);
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
				this.attributes.delete(key);
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
				this.attributes.delete(key);
			};
			/////////////// Pollyfills end ///////////////

			documentCreateElementNS_Element = function (elemeName) {
				switch (elemeName) {
					case "circle":
						return new SVGCircleElement();
					case "line":
						return new SVGLineElement();
					case "polyline":
						return new SVGPolylineElement();

					default:
						throw new Error(`unknwn type ${elemeName}`);
				}
			};
		}

		SVGCircleElement.prototype.move = function (x, y, radius) {
			this.setAttribute("cx", x);
			this.setAttribute("cy", y);
			this.setAttribute("r", radius);
		};
		SVGCircleElement.prototype.GetStrokeColor = function () { return this.getAttribute("stroke"); };
		SVGCircleElement.prototype.SetStrokeColor = function (col) { this.setAttribute("stroke", col); };
		SVGCircleElement.prototype.GetPosition = function () {
			return { x: parseInt(this.getAttribute("cx")), y: parseInt(this.getAttribute("cy")) };
		};
		SVGCircleElement.prototype.GetFillColor = function () { return this.getAttribute("fill"); };
		SVGCircleElement.prototype.SetFillColor = function (col) { this.setAttribute("fill", col); };
		SVGCircleElement.prototype.GetStatus = function () {
			return StringToStatusEnum(this.getAttribute("data-status"));
		};
		SVGCircleElement.prototype.SetStatus = function (iStatus, saveOldPoint = false) {
			if (saveOldPoint) {
				const old_status = StringToStatusEnum(this.getAttribute("data-status"));
				this.setAttribute("data-status", StatusEnumToString(iStatus));
				if (old_status !== StatusEnum.POINT_FREE && old_status !== iStatus)
					this.setAttribute("data-old-status", StatusEnumToString(old_status));
			}
			else {
				this.setAttribute("data-status", StatusEnumToString(iStatus));
			}
		};
		SVGCircleElement.prototype.RevertOldStatus = function () {
			const old_status = this.getAttribute("data-old-status");
			if (old_status) {
				this.removeAttribute("data-old-status");
				this.setAttribute("data-status", old_status);
				return StringToStatusEnum(old_status);
			}
			return -1;
		};
		SVGCircleElement.prototype.GetZIndex = function () { return this.getAttribute("z-index"); };
		SVGCircleElement.prototype.SetZIndex = function (val) { this.setAttribute("z-index", val); };
		SVGCircleElement.prototype.Hide = function () { this.setAttribute("visibility", 'hidden'); };
		SVGCircleElement.prototype.Show = function () { this.setAttribute("visibility", 'visible'); };
		SVGCircleElement.prototype.strokeWeight = function (sw) { this.setAttribute("stroke-width", sw); };
		SVGCircleElement.prototype.Serialize = function () {
			const { x, y } = this.GetPosition();
			const Status = this.GetStatus();
			const Color = this.GetFillColor();
			return { x, y, Status, Color };
		};

		SVGLineElement.prototype.move = function (x1, y1, x2, y2) {
			this.setAttribute("x1", x1);
			this.setAttribute("y1", y1);
			this.setAttribute("x2", x2);
			this.setAttribute("y2", y2);
		};
		SVGLineElement.prototype.RGBcolor = function (r, g, b) {
			this.setAttribute("stroke", `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`);
		};
		SVGLineElement.prototype.SetColor = function (color) { this.setAttribute("stroke", color); };
		SVGLineElement.prototype.strokeWidth = function (sw) { this.setAttribute("stroke-width", sw + "px"); };

		SVGPolylineElement.prototype.AppendPoints = function (x, y, diffX = 1, diffY = 1) {
			const pts_str = this.getAttribute("points");
			const pts = pts_str.split(" ");

			if (true === hasDuplicates(pts))
				return false;

			let arr;//obtain last point coords
			if (pts.length <= 1 || (arr = pts[pts.length - 1].split(",")).length !== 2)
				return false;

			const last_x = parseInt(arr[0]), last_y = parseInt(arr[1]);
			const x_diff = parseInt(x), y_diff = parseInt(y);
			if (!(Math.abs(last_x - x_diff) <= diffX && Math.abs(last_y - y_diff) <= diffY))
				return false;

			this.setAttribute("points", pts_str + ` ${x},${y}`);
			return true;
		};
		SVGPolylineElement.prototype.RemoveLastPoint = function () {
			const newpts = this.getAttribute("points").replace(/(\s\d+,\d+)$/, "");
			this.setAttribute("points", newpts);
			return newpts;
		};
		SVGPolylineElement.prototype.ContainsPoint = function (x, y) {
			const regexstr = new RegExp(`${x},${y}`, 'g');
			const cnt = (this.getAttribute("points").match(regexstr) || []).length;
			return cnt;
		};
		SVGPolylineElement.prototype.GetPointsString = function () {
			return this.getAttribute("points");
		};
		SVGPolylineElement.prototype.GetPointsArray = function () {
			//x0,y0 x1,y1 x2,y2
			return this.getAttribute("points").split(" ").map(function (pt) {
				const [x, y] = pt.split(',');
				return { x: parseInt(x), y: parseInt(y) };
			});
		};
		SVGPolylineElement.prototype.SetPoints = function (sPoints) {
			this.setAttribute("points", sPoints);
		};
		SVGPolylineElement.prototype.GetIsClosed = function () {
			const pts = this.getAttribute("points").split(" ");
			return pts[0] === pts[pts.length - 1];
		};
		SVGPolylineElement.prototype.GetLength = function () {
			return this.getAttribute("points").split(" ").length;
		};
		SVGPolylineElement.prototype.SetWidthAndColor = function (sw, col) {
			this.setAttribute("stroke", col);
			this.setAttribute("fill", col);
			this.setAttribute("stroke-width", sw);
		};
		SVGPolylineElement.prototype.GetID = function () { return parseInt(this.getAttribute("data-id")); };
		SVGPolylineElement.prototype.SetID = function (iID) { this.setAttribute("data-id", iID); };
		SVGPolylineElement.prototype.GetFillColor = function () { return this.getAttribute("fill"); };
		SVGPolylineElement.prototype.Serialize = function () {
			const id = this.GetID();
			const color = this.GetFillColor();
			const pts = this.GetPointsString();
			return { iId: id, Color: color, PointsAsString: pts };
		};

		this.CreateSVGVML = function (contextElement, iWidth, iHeight, { iGridWidth, iGridHeight }, antialias) {
			this.cont = documentCreateElementNS_SVG(contextElement);
			if (iWidth)
				this.cont.setAttributeNS(null, 'width', iWidth);
			if (iHeight)
				this.cont.setAttributeNS(null, 'height', iHeight);
			if (contextElement) {
				if (iGridWidth !== undefined && iGridHeight !== undefined)
					this.cont.setAttribute("viewBox", `0 0 ${iGridWidth} ${iGridHeight}`);

				this.mathSVGPoint = this.cont.createSVGPoint();
			}
			svgAntialias = antialias;

			return svgAvailable ? this.cont : null;
		};
		this.CreateLine = function (w, col, linecap) {
			const o = documentCreateElementNS_Element("line");
			if (svgAntialias !== undefined)
				o.setAttribute("shape-rendering", svgAntialias === true ? "auto" : "optimizeSpeed");
			o.setAttribute("stroke-width", w + "px");
			if (col) o.setAttribute("stroke", col);
			if (linecap) o.setAttribute("stroke-linecap", linecap);

			this.cont.appendChild(o);
			return o;
		};
		this.CreatePolyline = function (width, points, col) {
			const o = documentCreateElementNS_Element("polyline");
			if (svgAntialias !== undefined)
				o.setAttribute("shape-rendering", svgAntialias === true ? "auto" : "optimizeSpeed");
			o.setAttribute("stroke-width", width);
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
			const o = documentCreateElementNS_Element("circle");
			if (svgAntialias !== undefined)
				o.setAttribute("shape-rendering", svgAntialias === true ? "auto" : "optimizeSpeed");
			o.setAttribute("stroke-width", 0);
			o.setAttribute("r", diam / 2);
			//ch_commented o.style.cursor = "pointer";
			o.setAttribute("data-status", StatusEnumToString(StatusEnum.POINT_FREE));
			//o.setAttribute("data-old-status", StatusEnumToString(StatusEnum.POINT_FREE));

			this.cont.appendChild(o);
			return o;
		};
	}

	RemoveOval(oval) {
		this.cont.removeChild(oval);
	}

	RemovePolyline(polyline) {
		this.cont.removeChild(polyline);
	}

	DeserializeOval(packed, radius = 4) {
		let { x, y, Status, Color } = packed;
		x = parseInt(x);
		y = parseInt(y);
		const o = this.CreateOval(radius);
		o.move(x, y, radius);
		o.SetStrokeColor(Color);
		o.SetFillColor(Color);
		o.SetStatus(Status);
		return o;
	}

	DeserializePolyline(packed, width = 3) {
		const { iId, Color, PointsAsString } = packed;
		const o = this.CreatePolyline(width, PointsAsString, Color);
		o.SetID(iId);
		return o;
	}

	/**
	 * Converts coordinates point from screen to scaled SVG as according to
	 * https://docs.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/samples/hh535760(v=vs.85)?redirectedfrom=MSDN
	 * https://stackoverflow.com/questions/22183727/how-do-you-convert-screen-coordinates-to-document-space-in-a-scaled-svg
	 * @param {number} clientX X coordinate
	 * @param {number} clientY Y coordinate
	 * @returns {object} coordinate {x,y} point
	 */
	ToCursorPoint(clientX, clientY) {
		// Get point in global SVG space
		this.mathSVGPoint.x = clientX; this.mathSVGPoint.y = clientY;
		const loc = this.mathSVGPoint.matrixTransform(this.cont.getScreenCTM().inverse());

		return loc;
	}
}

class GameStateStore {
	constructor(useIndexedDb, pointCreationCallbackFn = null, pathCreationCallbackFn = null, getGameStateFn = null, version = "") {
		if (useIndexedDb) {
			if (!('indexedDB' in self)) {
				LocalError("This browser doesn't support IndexedDB");
				useIndexedDb = false;
			}
			else
				useIndexedDb = true;
		}
		else
			useIndexedDb = false;

		/////////inner class definitions start/////////
		/////////https://stackoverflow.com/questions/28784375/nested-es6-classes/////////
		const SimplePointStoreDefinition = class SimplePointStore {
			constructor() {
				this.store = new Map();
			}

			async PrepareStore() {
				return true;//dummy
			}

			async BeginBulkStorage() {
				//dummy
			}

			async EndBulkStorage() {
				//dummy
			}

			async has(key) {
				return this.store.has(key);
			}

			async set(key, val) {
				return this.store.set(key, val);
			}

			async get(key) {
				return this.store.get(key);
			}

			async values() {
				return this.store.values();
			}

			async count() {
				return this.store.size;
			}
		};

		const SimplePathStoreDefinition = class SimplePathStore {
			constructor() {
				this.store = [];
			}

			async PrepareStore() {
				return true;//dummy
			}

			async BeginBulkStorage() {
				//dummy
			}

			async EndBulkStorage() {
				//dummy
			}

			async push(obj) {
				return this.store.push(obj);
			}

			async all() {
				return this.store;
			}

			async count() {
				return this.store.length;
			}
		};

		const IDBPointStoreDefinition = class IDBPointStore extends SimplePointStoreDefinition {
			constructor(mainGameStateStore, pointCreationCallbackFn, getGameStateFn) {
				super();
				this.MainGameStateStore = mainGameStateStore;
				this.GetPoint = mainGameStateStore.GetPoint.bind(this.MainGameStateStore);
				this.StorePoint = mainGameStateStore.StorePoint.bind(this.MainGameStateStore);
				this.GetAllPoints = mainGameStateStore.GetAllPoints.bind(this.MainGameStateStore);
				this.UpdateState = mainGameStateStore.UpdateState.bind(this.MainGameStateStore);
				this.PointCreationCallback = pointCreationCallbackFn;
				this.GetGameStateCallback = getGameStateFn;
			}

			async PrepareStore() {
				if (this.PointCreationCallback && this.GetGameStateCallback) {
					const points = await this.GetAllPoints();
					const game_state = this.GetGameStateCallback();

					//loading points from indexeddb
					for (const idb_pt of points) {
						const pt = await this.PointCreationCallback(idb_pt.x, idb_pt.y, idb_pt.Status, idb_pt.Color);
						const index = idb_pt.y * game_state.iGridWidth + idb_pt.x;
						this.store.set(index, pt);
					}

				}
				return true;
			}

			async BeginBulkStorage() {
				await this.MainGameStateStore.BeginBulkStorage(this.MainGameStateStore.DB_POINT_STORE, 'readwrite');

				if (this.MainGameStateStore.pointBulkBuffer === null)
					this.MainGameStateStore.pointBulkBuffer = new Map();
			}

			async EndBulkStorage() {
				await this.MainGameStateStore.StoreAllPoints();

				await this.MainGameStateStore.EndBulkStorage(this.MainGameStateStore.DB_POINT_STORE);
			}

			async has(key) {
				//const pt = await GetPoint(key);
				//return pt !== undefined && pt !== null;
				return this.store.has(key);
			}

			async set(key, oval) {
				const game_state = this.GetGameStateCallback();

				const pos = oval.GetPosition();
				const color = oval.GetFillColor();
				const idb_pt = {
					x: pos.x,
					y: pos.y,
					Status: oval.GetStatus(),
					Color: color
				};

				await this.StorePoint(key, idb_pt);

				if (this.UpdateState) {
					if (game_state.bPointsAndPathsLoaded === true)
						await this.UpdateState(game_state.iGameID, game_state);
				}

				return this.store.set(key, oval);
			}

			async get(key) {
				let val = this.store.get(key);
				//if (!val) {
				//	const idb_pt = await this.GetPoint(key);
				//	if (idb_pt && this.PointCreationCallback) {
				//		val = this.PointCreationCallback(idb_pt.x, idb_pt.y, idb_pt.Status, idb_pt.Color);
				//		this.store.set(key, val);
				//		return val;
				//	}
				//	else
				//		return undefined;
				//}
				return val;
			}

			async values() {
				let values = this.store.values();
				if (values)
					return values;
				values = await this.GetAllPoints();
				return values;
			}
		};

		const IDBPathStoreDefinition = class IDBPathStore extends SimplePathStoreDefinition {
			constructor(mainGameStateStore, pathCreationCallbackFn, getGameStateFn) {
				super();
				this.MainGameStateStore = mainGameStateStore;
				this.GetAllPaths = mainGameStateStore.GetAllPaths.bind(this.MainGameStateStore);
				this.StorePath = mainGameStateStore.StorePath.bind(this.MainGameStateStore);
				this.UpdateState = mainGameStateStore.UpdateState.bind(this.MainGameStateStore);
				this.PathCreationCallback = pathCreationCallbackFn;
				this.GetGameStateCallback = getGameStateFn;
			}

			async PrepareStore() {
				if (this.PathCreationCallback) {
					const paths = await this.GetAllPaths();
					//loading paths from indexeddb
					for (const idb_pa of paths) {
						const pa = await this.PathCreationCallback(idb_pa.PointsAsString, idb_pa.Color, idb_pa.iId);
						this.store.push(pa);
					}
				}
				return true;
			}

			async BeginBulkStorage() {
				await this.MainGameStateStore.BeginBulkStorage([this.MainGameStateStore.DB_POINT_STORE, this.MainGameStateStore.DB_PATH_STORE], 'readwrite');

				if (this.MainGameStateStore.pathBulkBuffer === null)
					this.MainGameStateStore.pathBulkBuffer = new Map();
			}

			async EndBulkStorage() {
				await this.MainGameStateStore.StoreAllPaths();

				await this.MainGameStateStore.EndBulkStorage([this.MainGameStateStore.DB_POINT_STORE, this.MainGameStateStore.DB_PATH_STORE]);
			}

			async push(val) {
				const game_state = this.GetGameStateCallback();

				const id_key = val.GetID();
				const idb_path = {
					iId: id_key,
					Color: val.GetFillColor(),
					PointsAsString: val.GetPointsString().split(" ").map((pt) => {
						const tab = pt.split(',');
						const x = parseInt(tab[0]), y = parseInt(tab[1]);
						return `${x},${y}`;
					}).join(" ")
				};

				await this.StorePath(id_key, idb_path);

				if (this.UpdateState) {
					if (game_state.bPointsAndPathsLoaded === true)
						await this.UpdateState(game_state.iGameID, game_state);
				}

				return this.store.push(val);
			}

			async all() {
				let values = this.store;
				if (values)
					return values;
				values = await this.GetAllPaths();
				return values;
			}
		};
		/////////inner class definitions end/////////

		if (useIndexedDb === true) {
			this.DB_NAME = 'InkballGame';
			this.DB_POINT_STORE = 'points';
			this.DB_PATH_STORE = 'paths';
			this.DB_STATE_STORE = 'state';
			this.g_DB = null;//main DB object
			this.bulkStores = null;
			this.pointBulkBuffer = null;
			this.pathBulkBuffer = null;

			// Use a long long for this value (don't use a float)
			if (!version || version === "" || version.length <= 0)
				this.DB_VERSION = null;
			else {
				this.DB_VERSION = parseInt(version.split('.').reduce((acc, val) => {
					val = parseInt(val);
					return acc * 10 + (isNaN(val) ? 0 : val);
				}, 0)) - 1010/*initial module versioning start number*/ + 4/*initial indexDB start number*/;
			}

			this.PointStore = new IDBPointStoreDefinition(this, pointCreationCallbackFn, getGameStateFn);
			this.PathStore = new IDBPathStoreDefinition(this, pathCreationCallbackFn, getGameStateFn);
		}
		else {
			this.PointStore = new SimplePointStoreDefinition();
			this.PathStore = new SimplePathStoreDefinition();
		}
	}

	GetPointStore() {
		return this.PointStore;
	}

	GetPathStore() {
		return this.PathStore;
	}

	async OpenDb() {
		shared_LocalLog("OpenDb ...");
		return new Promise((resolve, reject) => {
			let req;
			if (this.DB_VERSION !== null)
				req = indexedDB.open(this.DB_NAME, this.DB_VERSION);
			else
				req = indexedDB.open(this.DB_NAME);

			req.onsuccess = function (evt) {
				// Equal to: db = req.result;
				this.g_DB = evt.currentTarget.result;

				shared_LocalLog("OpenDb DONE");
				resolve(evt.currentTarget.result);
			}.bind(this);
			req.onerror = function (evt) {
				LocalError("OpenDb:", evt.target.errorCode || evt.target.error);
				reject();
			}.bind(this);
			req.onupgradeneeded = function (evt) {
				shared_LocalLog(`OpenDb.onupgradeneeded(version: ${this.DB_VERSION})`);

				const store_list = Array.from(evt.currentTarget.result.objectStoreNames);
				if (store_list.includes(this.DB_POINT_STORE))
					evt.currentTarget.result.deleteObjectStore(this.DB_POINT_STORE);
				if (store_list.includes(this.DB_PATH_STORE))
					evt.currentTarget.result.deleteObjectStore(this.DB_PATH_STORE);
				if (store_list.includes(this.DB_STATE_STORE))
					evt.currentTarget.result.deleteObjectStore(this.DB_STATE_STORE);

				evt.currentTarget.result.createObjectStore(
					this.DB_POINT_STORE, { /*keyPath: 'pos',*/ autoIncrement: false });
				//point_store.createIndex('Status', 'Status', { unique: false });
				//point_store.createIndex('Color', 'Color', { unique: false });


				evt.currentTarget.result.createObjectStore(
					this.DB_PATH_STORE, { /*keyPath: 'iId',*/ autoIncrement: false });
				//path_store.createIndex('Color', 'Color', { unique: false });

				evt.currentTarget.result.createObjectStore(
					this.DB_STATE_STORE, { /*keyPath: 'gameId',*/ autoIncrement: false });
			}.bind(this);
		});
	}

	/**
	  * @param {string} storeName is a store name
	  * @param {string} mode either "readonly" or "readwrite"
	  * @returns {object} store
	  */
	GetObjectStore(storeName, mode) {
		if (this.bulkStores !== null && this.bulkStores.has(storeName))
			return this.bulkStores.get(storeName);

		const tx = this.g_DB.transaction(storeName, mode);
		return tx.objectStore(storeName);
	}

	async ClearAllStores() {
		const clearObjectStore = async function (storeName) {
			return new Promise((resolve, reject) => {
				const store = this.GetObjectStore(storeName, 'readwrite');
				const req = store.clear();
				req.onsuccess = function () {
					resolve();
				};
				req.onerror = function (evt) {
					LocalError("clearObjectStore:", evt.target.errorCode);
					reject();
				};
			});
		}.bind(this);

		await Promise.all([
			clearObjectStore(this.DB_POINT_STORE),
			clearObjectStore(this.DB_PATH_STORE),
			clearObjectStore(this.DB_STATE_STORE)
		]);
	}

	/**
	  * @param {number} key is calculated inxed of point y * width + x, probably not usefull
	  */
	async GetPoint(key) {
		return new Promise((resolve, reject) => {
			const store = this.GetObjectStore(this.DB_POINT_STORE, 'readonly');
			const req = store.get(key);
			req.onerror = function (event) {
				reject(new Error('GetPoint => ' + event));
			};
			req.onsuccess = function (event) {
				resolve(event.target.result);
			};
		});
	}

	async GetAllPoints() {
		return new Promise((resolve, reject) => {
			const store = this.GetObjectStore(this.DB_POINT_STORE, 'readonly');
			const bucket = [];
			const req = store.openCursor();
			req.onsuccess = function (event) {
				const cursor = event.target.result;
				if (cursor) {
					bucket.push(cursor.value);
					cursor.continue();
				}
				else
					resolve(bucket);
			};
			req.onerror = function (event) {
				reject(new Error('GetAllPoints => ' + event));
			};
		});
	}

	async GetState(key) {
		return new Promise((resolve, reject) => {
			const store = this.GetObjectStore(this.DB_STATE_STORE, 'readonly');
			const req = store.get(key);
			req.onerror = function (event) {
				reject(new Error('GetState => ' + event));
			};
			req.onsuccess = function (event) {
				resolve(event.target.result);
			};
		});
	}

	/**
	  * @param {number} key is path Id
	  */
	async GetPath(key) {
		return new Promise((resolve, reject) => {
			const store = this.GetObjectStore(this.DB_PATH_STORE, 'readonly');
			const req = store.get(key);
			req.onerror = function (event) {
				reject(new Error('GetPath => ' + event));
			};
			req.onsuccess = function (event) {
				resolve(event.target.result);
			};
		});
	}

	async GetAllPaths() {
		return new Promise((resolve, reject) => {
			const store = this.GetObjectStore(this.DB_PATH_STORE, 'readonly');
			const bucket = [];
			const req = store.openCursor();
			req.onsuccess = function (event) {
				const cursor = event.target.result;
				if (cursor) {
					bucket.push(cursor.value);
					cursor.continue();
				}
				else
					resolve(bucket);
			};
			req.onerror = function (event) {
				reject(new Error('GetAllPaths => ' + event));
			};
		});
	}

	/**
	  * @param {number} key is calculated inxed of point y * width + x, probably not usefull
	  * @param {object} val is serialized, thin circle
	  */
	async StorePoint(key, val) {
		if (this.bulkStores !== null && this.bulkStores.has(this.DB_POINT_STORE)) {
			if (this.pointBulkBuffer === null)
				this.pointBulkBuffer = new Map();
			this.pointBulkBuffer.set(key, val);
			return Promise.resolve();
		}

		return new Promise((resolve, reject) => {
			const store = this.GetObjectStore(this.DB_POINT_STORE, 'readwrite');
			let req;
			try {
				req = store.put(val, key);//earlier was 'add'
			} catch (e) {
				if (e.name === 'DataCloneError')
					LocalError("This engine doesn't know how to clone a Blob, use Firefox");
				throw e;
			}
			req.onsuccess = function () {
				resolve();
			};
			req.onerror = function () {
				LocalError("StorePoint error", this.error);
				reject();
			};
		});
	}

	async StoreAllPoints(values = null) {
		if (!values)
			values = this.pointBulkBuffer;

		if (!values || this.bulkStores === null)
			return Promise.reject();

		return new Promise((resolve, reject) => {
			const store = this.GetObjectStore(this.DB_POINT_STORE, 'readwrite');
			try {
				values.forEach(function (v, key) {
					store.add(v, key);
				});

				this.pointBulkBuffer = null;
				resolve();
			} catch (e) {
				LocalError("This engine doesn't know how to clone a Blob, use Firefox");
				reject(e);
			}
		});
	}

	/**
	  * @param {number} key is GameID
	  * @param {object} gameState is InkBallGame state object
	  */
	async StoreState(key, gameState) {
		return new Promise((resolve, reject) => {
			const store = this.GetObjectStore(this.DB_STATE_STORE, 'readwrite');
			let req;
			try {
				req = store.add(gameState, key);
			} catch (e) {
				if (e.name === 'DataCloneError')
					LocalError("This engine doesn't know how to clone a Blob, use Firefox");
				throw e;
			}
			req.onsuccess = function () {
				resolve();
			};
			req.onerror = function () {
				LocalError("StoreState error", this.error);
				reject();
			};
		});
	}

	async UpdateState(key, gameState) {
		return new Promise((resolve, reject) => {
			const store = this.GetObjectStore(this.DB_STATE_STORE, 'readwrite');
			let req;
			try {
				req = store.put(gameState, key);
			} catch (e) {
				if (e.name === 'DataCloneError')
					LocalError("This engine doesn't know how to clone a Blob, use Firefox");
				throw e;
			}
			req.onsuccess = function () {
				resolve();
			};
			req.onerror = function () {
				LocalError("UpdateState error", this.error);
				reject();
			};
		});
	}

	/**
	  * @param {number} key is path Id
	  * @param {object} val is serialized thin path
	  */
	async StorePath(key, val) {
		if (this.bulkStores !== null && this.bulkStores.has(this.DB_PATH_STORE)) {
			if (this.pathBulkBuffer === null)
				this.pathBulkBuffer = new Map();
			this.pathBulkBuffer.set(key, val);
			return Promise.resolve();
		}

		return new Promise((resolve, reject) => {
			const store = this.GetObjectStore(this.DB_PATH_STORE, 'readwrite');
			let req;
			try {
				req = store.add(val, key);
			} catch (e) {
				if (e.name === 'DataCloneError')
					LocalError("This engine doesn't know how to clone a Blob, use Firefox");
				throw e;
			}
			req.onsuccess = function () {
				resolve();
			};
			req.onerror = function () {
				LocalError("StorePath error", this.error);
				reject();
			};
		});
	}

	async StoreAllPaths(values = null) {
		if (!values)
			values = this.pathBulkBuffer;

		if (!values || this.bulkStores === null)
			return Promise.reject();

		return new Promise((resolve, reject) => {
			const store = this.GetObjectStore(this.DB_PATH_STORE, 'readwrite');
			try {
				values.forEach(function (v, key) {
					store.add(v, key);
				});

				this.pathBulkBuffer = null;
				resolve();
			} catch (e) {
				LocalError("This engine doesn't know how to clone a Blob, use Firefox");
				reject(e);
			}
		});
	}

	async PrepareStore() {
		//detecting if we have IndexedDb advanced store (only checking point-store); otherwise, there is no point in going further
		if (!this.PointStore.GetAllPoints) return false;

		if (this.g_DB === null)
			await this.OpenDb();
		else
			return false;//all initiated, just exit

		const game_state = this.PointStore.GetGameStateCallback();
		const idb_state = await this.GetState(game_state.iGameID);
		if (!idb_state) {
			//no state entry in db
			await this.ClearAllStores();

			await this.StoreState(game_state.iGameID, game_state);

			return false;
		}
		else {
			//Verify date of last move and decide whether to need pull points from signalR
			//Both datetimes should be ISO UTC
			if (idb_state.sLastMoveGameTimeStamp !== game_state.sLastMoveGameTimeStamp) {

				await this.ClearAllStores();
				return false;
			}
			else if (game_state.bPointsAndPathsLoaded === false) {
				//db entry ok and ready for read
				try {
					await this.BeginBulkStorage([this.DB_POINT_STORE, this.DB_PATH_STORE], 'readonly');

					if ((await this.PointStore.PrepareStore()) !== true || (await this.PathStore.PrepareStore()) !== true) {

						await this.ClearAllStores();

						return false;
					}

					return true;
				} finally {
					await this.EndBulkStorage([this.DB_POINT_STORE, this.DB_PATH_STORE]);
				}
			}
		}
	}

	/**
	 * Load all needed stores upfront
	 * @param {any} storeName array or string of store to load
	 * @param {any} mode - readonly/readwrite
	 */
	async BeginBulkStorage(storeName, mode) {
		if (this.bulkStores === null)
			this.bulkStores = new Map();

		const keys = Array.isArray(storeName) ? storeName : [storeName];
		let tx = null;
		for (const key of keys) {
			if (!this.bulkStores.has(key)) {
				if (tx === null)
					tx = this.g_DB.transaction(keys, mode);
				this.bulkStores.set(key, tx.objectStore(key));
			}
		}
	}

	async EndBulkStorage(storeName) {
		if (this.bulkStores !== null) {
			const keys = Array.isArray(storeName) ? storeName : [storeName];
			for (const key of keys) {
				if (this.bulkStores.has(key)) {
					this.bulkStores.delete(key);
				}
			}

			if (this.bulkStores.size <= 0)
				this.bulkStores = null;
		}
	}
}




;// CONCATENATED MODULE: ../InkBall/src/InkBall.Module/wwwroot/js/AISource.js





/**
 * AI operations class
 * */
class GraphAI {
	constructor(iGridWidth, iGridHeight, pointStore) {
		this.m_iGridWidth = iGridWidth;
		this.m_iGridHeight = iGridHeight;
		this.m_Points = pointStore;
		this.POINT_STARTING = StatusEnum.POINT_STARTING;
		this.POINT_IN_PATH = StatusEnum.POINT_IN_PATH;
	}

	/**
	 * Building graph of connected vertices and edges
	 * @param {any} param0 is a optional object comprised of:
	 *	freePointStatus - status of free point
	 *	cpuFillColor - CPU point color
	 */
	async BuildGraph({
		freePointStatus = StatusEnum.POINT_FREE_BLUE,
		cpufillCol: cpuFillColor = 'blue'
		//, visuals: presentVisually = false
	} = {}) {
		const graph_points = [], graph_edges = new Map();

		const isPointOKForPath = function (freePointStatusArr, pt) {
			const status = pt.GetStatus();

			if (freePointStatusArr.includes(status) && pt.GetFillColor() === cpuFillColor)
				return true;
			return false;
		};

		const addPointsAndEdgestoGraph = async function (point, to_x, to_y, x, y) {
			if (to_x >= 0 && to_x < this.m_iGridWidth && to_y >= 0 && to_y < this.m_iGridHeight) {
				const next = await this.m_Points.get(to_y * this.m_iGridWidth + to_x);
				if (next && isPointOKForPath([freePointStatus], next) === true) {

					if (graph_edges.has(`${x},${y}_${to_x},${to_y}`) === false && graph_edges.has(`${to_x},${to_y}_${x},${y}`) === false) {

						const edge = {
							from: point,
							to: next
						};
						//if (presentVisually === true) {
						//	const line = CreateLine(3, 'rgba(0, 255, 0, 0.3)');
						//	line.move(x, y, next_pos.x, next_pos.y);
						//	edge.line = line;
						//}
						graph_edges.set(`${x},${y}_${to_x},${to_y}`, edge);


						if (graph_points.includes(point) === false) {
							point.adjacents = [next];
							graph_points.push(point);
						} else {
							const pt = graph_points.find(x => x === point);
							pt.adjacents.push(next);
						}
						if (graph_points.includes(next) === false) {
							next.adjacents = [point];
							graph_points.push(next);
						} else {
							const pt = graph_points.find(x => x === next);
							pt.adjacents.push(point);
						}
					}
				}
			}
		}.bind(this);

		for (const point of await this.m_Points.values()) {
			if (point && isPointOKForPath([freePointStatus, this.POINT_STARTING, this.POINT_IN_PATH], point) === true) {
				const { x, y } = point.GetPosition();
				//TODO: await all below promises
				//east
				await addPointsAndEdgestoGraph(point, x + 1, y, x, y);
				//west
				await addPointsAndEdgestoGraph(point, x - 1, y, x, y);
				//north
				await addPointsAndEdgestoGraph(point, x, (y - 1), x, y);
				//south
				await addPointsAndEdgestoGraph(point, x, (y + 1), x, y);
				//north_west
				await addPointsAndEdgestoGraph(point, x - 1, (y - 1), x, y);
				//north_east
				await addPointsAndEdgestoGraph(point, x + 1, (y - 1), x, y);
				//south_west
				await addPointsAndEdgestoGraph(point, x - 1, (y + 1), x, y);
				//south_east
				await addPointsAndEdgestoGraph(point, x + 1, (y + 1), x, y);
			}
		}
		//return graph
		return { vertices: graph_points, edges: Array.from(graph_edges.values()) };
	}

	async IsPointOutsideAllPaths(lines, x, y) {
		for (const line of lines) {
			const points = line.GetPointsArray();

			if (false !== pnpoly2(points, x, y))
				return false;
		}

		return true;
	}

	/**
	 * Based on https://www.geeksforgeeks.org/print-all-the-cycles-in-an-undirected-graph/
	 * @param {any} graph constructed earlier with BuildGraph
	 * @param {string} COLOR_BLUE - cpu blue playing color
	 * @param {string} sHumanColor - human red playing color
	 * @param {object} lines - line array
	 * @returns {array} of cycles
	 */
	async MarkAllCycles(graph, COLOR_BLUE, sHumanColor, lines) {
		const vertices = graph.vertices;
		const N = vertices.length;
		let cycles = new Array(N);
		// mark with unique numbers
		const mark = new Array(N);
		// arrays required to color the 
		// graph, store the parent of node 
		const color = new Array(N), par = new Array(N);

		for (let i = 0; i < N; i++) {
			mark[i] = []; cycles[i] = [];
		}

		const dfs_cycle = async function (u, p) {
			// already (completely) visited vertex. 
			if (color[u] === 2)
				return;

			// seen vertex, but was not completely visited -> cycle detected. 
			// backtrack based on parents to find the complete cycle. 
			if (color[u] === 1) {
				cyclenumber++;
				let cur = p;
				mark[cur].push(cyclenumber);

				// backtrack the vertex which are
				// in the current cycle thats found
				while (cur !== u) {
					cur = par[cur];
					mark[cur].push(cyclenumber);
				}
				return;
			}
			par[u] = p;

			// partially visited.
			color[u] = 1;
			const vertex = vertices[u];
			if (vertex) {
				
				//const x = vertex.attributes.get('cx'), y = vertex.attributes.get('cy');
				//vertex.SetStrokeColor('black');
				//vertex.SetFillColor('black');
				////vertex.setAttribute("r", "6");
				//await Sleep(10);


				// simple dfs on graph
				for (const adj of vertex.adjacents) {
					const v = vertices.indexOf(adj);
					// if it has not been visited previously
					if (v === par[u])
						continue;

					await dfs_cycle(v, u);
				}
			}

			// completely visited. 
			color[u] = 2;
		};

		const printCycles = async function (edges, mark) {
			// push the edges that into the 
			// cycle adjacency list 
			for (let e = 0; e < edges; e++) {
				const mark_e = mark[e];
				if (mark_e !== undefined && mark_e.length > 0) {
					for (let m = 0; m < mark_e.length; m++) {
						const found_c = cycles[mark_e[m]];
						if (found_c !== undefined)
							found_c.push(e);
					}
				}
			}

			//sort by point length(only cycles >= 4): first longest cycles, most points
			cycles = cycles.filter(c => c.length >= 4).sort((b, a) => a.length - b.length);

			//gather free human player points that could be intercepted.
			const free_human_player_points = [];
			for (const pt of await this.m_Points.values()) {
				if (pt !== undefined && pt.GetFillColor() === sHumanColor && StatusEnum.POINT_FREE_RED === pt.GetStatus()) {
					const { x, y } = pt.GetPosition();
					if (false === await this.IsPointOutsideAllPaths(lines, x, y))
						continue;

					//check if really exists
					//const pt1 = document.querySelector(`svg > circle[cx="${x}"][cy="${y}"]`);
					//if (pt1)
					free_human_player_points.push({ x, y });
				}
			}


			//const tab = [];
			// traverse through all the vertices with same cycle
			for (let i = 0; i <= cyclenumber; i++) {
				const cycl = cycles[i];//get cycle
				if (cycl && cycl.length > 0) {	//some checks
					// Print the i-th cycle
					//let str = (`Cycle Number ${i}: `), trailing_points = [];
					//const rand_color = 'var(--indigo)';

					//convert to logical space
					const mapped_verts = cycl.map(function (c) {
						return vertices[c].GetPosition();
					}.bind(this));
					//sort clockwise (https://stackoverflow.com/questions/45660743/sort-points-in-counter-clockwise-in-javascript)
					const cw_sorted_verts = sortPointsClockwise(mapped_verts);
					cycles[i] = { cycl, cw_sorted_verts };
					////display which cycle we are dealing with
					//for (const vert of cw_sorted_verts) {
					//	const { x, y } = vert;
					//	const pt = document.querySelector(`svg > circle[cx="${x}"][cy="${y}"]`);
					//	if (pt) {//again some basic checks
					//		str += (`(${x},${y})`);

					//		pt.SetStrokeColor(rand_color);
					//		pt.SetFillColor(rand_color);
					//		pt.setAttribute("r", "6");
					//	}
					//	await Sleep(50);
					//}

					//find for all free_human_player_points which cycle might interepct it (surrounds)
					//only convex, NOT concave :-(
					//let tmp = '', comma = '';
					//for (const possible_intercept of free_human_player_points) {
					//	if (false !== pnpoly2(cw_sorted_verts, possible_intercept.x, possible_intercept.y)) {
					//		tmp += `${comma}(${possible_intercept.x},${possible_intercept.y})`;

					//		const pt1 = document.querySelector(`svg > circle[cx="${possible_intercept.x}"][cy="${possible_intercept.y}"]`);
					//		if (pt1) {
					//			pt1.SetStrokeColor('var(--yellow)');
					//			pt1.SetFillColor('var(--yellow)');
					//			pt1.setAttribute("r", "6");
					//		}
					//		comma = ',';
					//	}
					//}
					////gaterhing of some data and console printing
					//trailing_points.unshift(str);
					//tab.push(trailing_points);
					////log...
					//LocalLog(str + (tmp !== '' ? ` possible intercepts: ${tmp}` : ''));
					////...and clear
					//const pts2reset = Array.from(document.querySelectorAll(`svg > circle[fill="${rand_color}"][r="6"]`));
					//pts2reset.forEach(pt => {
					//	pt.SetStrokeColor(COLOR_BLUE);
					//	pt.SetFillColor(COLOR_BLUE);
					//	pt.setAttribute("r", "4");
					//});
				}
			}
			/*return tab;*/return { cycles, free_human_player_points, cyclenumber };
		}.bind(this);

		// store the numbers of cycle
		let cyclenumber = 0, edges = N;

		// call DFS to mark the cycles
		for (let vind = 0; vind < N; vind++) {
			await dfs_cycle(vind + 1, vind);//, color, mark, par);
		}

		// function to print the cycles
		return await printCycles(edges, mark);
	}
}

// eslint-disable-next-line no-unused-vars
function concavemanTesting() {
	const precision_points = [[484, 480], [676, 363], [944, 342], [678, 41], [286, 237], [758, 215], [752, 117], [282, 492], [609, 262], [129, 252]];
	const concavity = 2.0, lengthThreshold = 0.0;
	const concaveman_output = concaveman(precision_points, concavity, lengthThreshold);
	//console.log('Hello concaveman. Simple test output points: \n' + JSON.stringify(output));


	// Make sure the polygon has counter-clockwise winding. Skip this step if you know it's already counter-clockwise.
	//console.log(`decomp.makeCCW(concavePolygon) => ${decomp.makeCCW(precision_points)}`);
	//const convexPolygonsQuick = decomp.quickDecomp(precision_points);
	// ==> [  [[1,0],[1,1],[0.5,0.5]],  [[0.5,0.5],[-1,1],[-1,0],[1,0]]  ]
	//console.log(`decomp.quickDecomp => ${convexPolygons}`);
	// Decompose using the slow (but optimal) algorithm
	const convexPolygons = decomp.decomp(precision_points);
	// ==> [  [[-1,1],[-1,0],[1,0],[0.5,0.5]],  [[1,0],[1,1],[0.5,0.5]]  ]
	//console.log(`decomp.decomp => ${convexPolygons}`);
	if (!concaveman_output || concaveman_output.length <= 0 ||
		//!convexPolygonsQuick || convexPolygonsQuick.length <= 0 || 
		!convexPolygons || convexPolygons.length <= 0) {
		LocalLog('decomp or concaveman error');
	}
}



;// CONCATENATED MODULE: ../InkBall/src/InkBall.Module/wwwroot/js/AIWorker.js
﻿



// This is the entry point for our worker
addEventListener('message', async function (e) {
	const params = e.data;

	const svgVml = new SvgVml();
	svgVml.CreateSVGVML(null, null, null, params.boardSize);

	switch (params.operation) {
		case "BUILD_GRAPH":
			{
				//debugger;
				const lines = params.paths.map(pa => svgVml.DeserializePolyline(pa));
				const points = new Map();
				params.points.forEach((pt) => {
					points.set(pt.key, svgVml.DeserializeOval(pt.value));
				});

				shared_LocalLog(`lines.count = ${await lines.length}, points.count = ${await points.size}`);

				const ai = new GraphAI(params.state.iGridWidth, params.state.iGridHeight, points);
				const graph = await ai.BuildGraph({ freePointStatus: StatusEnum.POINT_FREE_BLUE, cpufillCol: 'blue', visuals: false });
				//LocalLog(graph);

				postMessage({ operation: params.operation, params: graph });
			}
			break;

		case "CONCAVEMAN":
			{
				const points = new Map();
				params.points.forEach((pt) => {
					points.set(pt.key, svgVml.DeserializeOval(pt.value));
				});
				const ai = new GraphAI(params.state.iGridWidth, params.state.iGridHeight, points);
				const graph = await ai.BuildGraph({ freePointStatus: StatusEnum.POINT_FREE_BLUE, cpufillCol: 'blue', visuals: false });


				const vertices = graph.vertices.map(function (pt) {
					const { x, y } = pt.GetPosition();
					return [x, y];
				});
				const convex_hull = concaveman_default()(vertices, 2.0, 0.0);

				const mapped_verts = convex_hull.map(([x, y]) => ({ x, y }));
				const cw_sorted_verts = sortPointsClockwise(mapped_verts);

				postMessage({ operation: params.operation, convex_hull: convex_hull, cw_sorted_verts: cw_sorted_verts });
			}
			break;

		case "MARK_ALL_CYCLES":
			{
				const lines = params.paths.map(pa => svgVml.DeserializePolyline(pa));
				const points = new Map();
				params.points.forEach((pt) => {
					points.set(pt.key, svgVml.DeserializeOval(pt.value));
				});
				const ai = new GraphAI(params.state.iGridWidth, params.state.iGridHeight, points);
				const graph = await ai.BuildGraph({ freePointStatus: StatusEnum.POINT_FREE_BLUE, cpufillCol: params.colorBlue, visuals: false });
				const result = await ai.MarkAllCycles(graph, params.colorBlue, params.colorRed, lines);


				postMessage({
					operation: params.operation,
					cycles: result.cycles,
					free_human_player_points: result.free_human_player_points,
					cyclenumber: result.cyclenumber
				});
			}
			break;

		default:
			LocalError(`unknown params.operation = ${params.operation}`);
			break;
	}
});

shared_LocalLog('Worker loaded');

}();
/******/ })()
;
//# sourceMappingURL=AIWorker.Bundle.js.map