(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[0],{

/***/ 3:
/***/ (function(module, exports) {

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var concavemanBundle = function (t) {
  var n = {};

  function r(e) {
    if (n[e]) return n[e].exports;
    var i = n[e] = {
      i: e,
      l: !1,
      exports: {}
    };
    return t[e].call(i.exports, i, i.exports, r), i.l = !0, i.exports;
  }

  return r.m = t, r.c = n, r.d = function (t, n, e) {
    r.o(t, n) || Object.defineProperty(t, n, {
      enumerable: !0,
      get: e
    });
  }, r.r = function (t) {
    "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
      value: "Module"
    }), Object.defineProperty(t, "__esModule", {
      value: !0
    });
  }, r.t = function (t, n) {
    if (1 & n && (t = r(t)), 8 & n) return t;
    if (4 & n && "object" == _typeof(t) && t && t.__esModule) return t;
    var e = Object.create(null);
    if (r.r(e), Object.defineProperty(e, "default", {
      enumerable: !0,
      value: t
    }), 2 & n && "string" != typeof t) for (var i in t) {
      r.d(e, i, function (n) {
        return t[n];
      }.bind(null, i));
    }
    return e;
  }, r.n = function (t) {
    var n = t && t.__esModule ? function () {
      return t["default"];
    } : function () {
      return t;
    };
    return r.d(n, "a", n), n;
  }, r.o = function (t, n) {
    return Object.prototype.hasOwnProperty.call(t, n);
  }, r.p = "", r(r.s = 1);
}([function (t, n, r) {
  "use strict";

  var e = r(2),
      i = r(3),
      o = r(4);
  var a = r(5).orient2d;

  function h(t, n, r) {
    n = Math.max(0, void 0 === n ? 2 : n), r = r || 0;

    var i = function (t) {
      for (var n = t[0], r = t[0], e = t[0], i = t[0], a = 0; a < t.length; a++) {
        var h = t[a];
        h[0] < n[0] && (n = h), h[0] > e[0] && (e = h), h[1] < r[1] && (r = h), h[1] > i[1] && (i = h);
      }

      var u = [n, r, e, i],
          s = u.slice();

      for (a = 0; a < t.length; a++) {
        o(t[a], u) || s.push(t[a]);
      }

      return function (t) {
        t.sort(M);

        for (var n = [], r = 0; r < t.length; r++) {
          for (; n.length >= 2 && p(n[n.length - 2], n[n.length - 1], t[r]) <= 0;) {
            n.pop();
          }

          n.push(t[r]);
        }

        for (var e = [], i = t.length - 1; i >= 0; i--) {
          for (; e.length >= 2 && p(e[e.length - 2], e[e.length - 1], t[i]) <= 0;) {
            e.pop();
          }

          e.push(t[i]);
        }

        return e.pop(), n.pop(), n.concat(e);
      }(s);
    }(t),
        a = new e(16);

    a.toBBox = function (t) {
      return {
        minX: t[0],
        minY: t[1],
        maxX: t[0],
        maxY: t[1]
      };
    }, a.compareMinX = function (t, n) {
      return t[0] - n[0];
    }, a.compareMinY = function (t, n) {
      return t[1] - n[1];
    }, a.load(t);

    for (var h, s = [], f = 0; f < i.length; f++) {
      var l = i[f];
      a.remove(l), h = d(l, h), s.push(h);
    }

    var c = new e(16);

    for (f = 0; f < s.length; f++) {
      c.insert(m(s[f]));
    }

    for (var x = n * n, g = r * r; s.length;) {
      var X = s.shift(),
          Y = X.p,
          y = X.next.p,
          _ = v(Y, y);

      if (!(_ < g)) {
        var B = _ / x;
        (l = u(a, X.prev.p, Y, y, X.next.next.p, B, c)) && Math.min(v(l, Y), v(l, y)) <= B && (s.push(X), s.push(d(l, X)), a.remove(l), c.remove(X), c.insert(m(X)), c.insert(m(X.next)));
      }
    }

    X = h;
    var b = [];

    do {
      b.push(X.p), X = X.next;
    } while (X !== h);

    return b.push(X.p), b;
  }

  function u(t, n, r, e, o, a, h) {
    for (var u = new i([], s), l = t.data; l;) {
      for (var p = 0; p < l.children.length; p++) {
        var m = l.children[p],
            d = l.leaf ? x(m, r, e) : f(r, e, m);
        d > a || u.push({
          node: m,
          dist: d
        });
      }

      for (; u.length && !u.peek().node.children;) {
        var v = u.pop(),
            g = v.node,
            M = x(g, n, r),
            X = x(g, e, o);
        if (v.dist < M && v.dist < X && c(r, g, h) && c(e, g, h)) return g;
      }

      (l = u.pop()) && (l = l.node);
    }

    return null;
  }

  function s(t, n) {
    return t.dist - n.dist;
  }

  function f(t, n, r) {
    if (l(t, r) || l(n, r)) return 0;
    var e = g(t[0], t[1], n[0], n[1], r.minX, r.minY, r.maxX, r.minY);
    if (0 === e) return 0;
    var i = g(t[0], t[1], n[0], n[1], r.minX, r.minY, r.minX, r.maxY);
    if (0 === i) return 0;
    var o = g(t[0], t[1], n[0], n[1], r.maxX, r.minY, r.maxX, r.maxY);
    if (0 === o) return 0;
    var a = g(t[0], t[1], n[0], n[1], r.minX, r.maxY, r.maxX, r.maxY);
    return 0 === a ? 0 : Math.min(e, i, o, a);
  }

  function l(t, n) {
    return t[0] >= n.minX && t[0] <= n.maxX && t[1] >= n.minY && t[1] <= n.maxY;
  }

  function c(t, n, r) {
    for (var e, i, o, a, h = Math.min(t[0], n[0]), u = Math.min(t[1], n[1]), s = Math.max(t[0], n[0]), f = Math.max(t[1], n[1]), l = r.search({
      minX: h,
      minY: u,
      maxX: s,
      maxY: f
    }), c = 0; c < l.length; c++) {
      if (e = l[c].p, i = l[c].next.p, o = t, e !== (a = n) && i !== o && p(e, i, o) > 0 != p(e, i, a) > 0 && p(o, a, e) > 0 != p(o, a, i) > 0) return !1;
    }

    return !0;
  }

  function p(t, n, r) {
    return a(t[0], t[1], n[0], n[1], r[0], r[1]);
  }

  function m(t) {
    var n = t.p,
        r = t.next.p;
    return t.minX = Math.min(n[0], r[0]), t.minY = Math.min(n[1], r[1]), t.maxX = Math.max(n[0], r[0]), t.maxY = Math.max(n[1], r[1]), t;
  }

  function d(t, n) {
    var r = {
      p: t,
      prev: null,
      next: null,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0
    };
    return n ? (r.next = n.next, r.prev = n, n.next.prev = r, n.next = r) : (r.prev = r, r.next = r), r;
  }

  function v(t, n) {
    var r = t[0] - n[0],
        e = t[1] - n[1];
    return r * r + e * e;
  }

  function x(t, n, r) {
    var e = n[0],
        i = n[1],
        o = r[0] - e,
        a = r[1] - i;

    if (0 !== o || 0 !== a) {
      var h = ((t[0] - e) * o + (t[1] - i) * a) / (o * o + a * a);
      h > 1 ? (e = r[0], i = r[1]) : h > 0 && (e += o * h, i += a * h);
    }

    return (o = t[0] - e) * o + (a = t[1] - i) * a;
  }

  function g(t, n, r, e, i, o, a, h) {
    var u,
        s,
        f,
        l,
        c = r - t,
        p = e - n,
        m = a - i,
        d = h - o,
        v = t - i,
        x = n - o,
        g = c * c + p * p,
        M = c * m + p * d,
        X = m * m + d * d,
        Y = c * v + p * x,
        y = m * v + d * x,
        _ = g * X - M * M,
        B = _,
        b = _;

    0 === _ ? (s = 0, B = 1, l = y, b = X) : (l = g * y - M * Y, (s = M * y - X * Y) < 0 ? (s = 0, l = y, b = X) : s > B && (s = B, l = y + M, b = X)), l < 0 ? (l = 0, -Y < 0 ? s = 0 : -Y > g ? s = B : (s = -Y, B = g)) : l > b && (l = b, -Y + M < 0 ? s = 0 : -Y + M > g ? s = B : (s = -Y + M, B = g));
    var S = (1 - (f = 0 === l ? 0 : l / b)) * i + f * a - ((1 - (u = 0 === s ? 0 : s / B)) * t + u * r),
        O = (1 - f) * o + f * h - ((1 - u) * n + u * e);
    return S * S + O * O;
  }

  function M(t, n) {
    return t[0] === n[0] ? t[1] - n[1] : t[0] - n[0];
  }

  t.exports = h, t.exports["default"] = h;
}, function (t, n, r) {
  "use strict";

  r.r(n);
  var e = r(0),
      i = r.n(e);
  r.d(n, "concaveman", function () {
    return i.a;
  });
  var o = "Hello concaveman" === document.querySelector("title").innerHTML;

  if (o) {
    var _t = document.createElement("div");

    _t.innerHTML = "<p>Hello concaveman.</p>", document.body.appendChild(_t);
  }

  var a = i()([[484, 480], [676, 363], [944, 342], [678, 41], [286, 237], [758, 215], [752, 117], [282, 492], [609, 262], [129, 252]], 2, 0);

  if (o) {
    var _t2 = document.createElement("div");

    _t2.innerHTML = "concaveman output points: " + JSON.stringify(a), document.body.appendChild(_t2);
  } else console.log("Hello concaveman. Simple test output points: \n" + JSON.stringify(a));
}, function (t, n, r) {
  t.exports = function () {
    "use strict";

    function t(t, e, i, o, a) {
      !function t(r, e, i, o, a) {
        for (; o > i;) {
          if (o - i > 600) {
            var h = o - i + 1,
                u = e - i + 1,
                s = Math.log(h),
                f = .5 * Math.exp(2 * s / 3),
                l = .5 * Math.sqrt(s * f * (h - f) / h) * (u - h / 2 < 0 ? -1 : 1);
            t(r, e, Math.max(i, Math.floor(e - u * f / h + l)), Math.min(o, Math.floor(e + (h - u) * f / h + l)), a);
          }

          var c = r[e],
              p = i,
              m = o;

          for (n(r, i, e), a(r[o], c) > 0 && n(r, i, o); p < m;) {
            for (n(r, p, m), p++, m--; a(r[p], c) < 0;) {
              p++;
            }

            for (; a(r[m], c) > 0;) {
              m--;
            }
          }

          0 === a(r[i], c) ? n(r, i, m) : n(r, ++m, o), m <= e && (i = m + 1), e <= m && (o = m - 1);
        }
      }(t, e, i || 0, o || t.length - 1, a || r);
    }

    function n(t, n, r) {
      var e = t[n];
      t[n] = t[r], t[r] = e;
    }

    function r(t, n) {
      return t < n ? -1 : t > n ? 1 : 0;
    }

    var e = function e(t) {
      void 0 === t && (t = 9), this._maxEntries = Math.max(4, t), this._minEntries = Math.max(2, Math.ceil(.4 * this._maxEntries)), this.clear();
    };

    function i(t, n, r) {
      if (!r) return n.indexOf(t);

      for (var e = 0; e < n.length; e++) {
        if (r(t, n[e])) return e;
      }

      return -1;
    }

    function o(t, n) {
      a(t, 0, t.children.length, n, t);
    }

    function a(t, n, r, e, i) {
      i || (i = m(null)), i.minX = 1 / 0, i.minY = 1 / 0, i.maxX = -1 / 0, i.maxY = -1 / 0;

      for (var o = n; o < r; o++) {
        var a = t.children[o];
        h(i, t.leaf ? e(a) : a);
      }

      return i;
    }

    function h(t, n) {
      return t.minX = Math.min(t.minX, n.minX), t.minY = Math.min(t.minY, n.minY), t.maxX = Math.max(t.maxX, n.maxX), t.maxY = Math.max(t.maxY, n.maxY), t;
    }

    function u(t, n) {
      return t.minX - n.minX;
    }

    function s(t, n) {
      return t.minY - n.minY;
    }

    function f(t) {
      return (t.maxX - t.minX) * (t.maxY - t.minY);
    }

    function l(t) {
      return t.maxX - t.minX + (t.maxY - t.minY);
    }

    function c(t, n) {
      return t.minX <= n.minX && t.minY <= n.minY && n.maxX <= t.maxX && n.maxY <= t.maxY;
    }

    function p(t, n) {
      return n.minX <= t.maxX && n.minY <= t.maxY && n.maxX >= t.minX && n.maxY >= t.minY;
    }

    function m(t) {
      return {
        children: t,
        height: 1,
        leaf: !0,
        minX: 1 / 0,
        minY: 1 / 0,
        maxX: -1 / 0,
        maxY: -1 / 0
      };
    }

    function d(n, r, e, i, o) {
      for (var a = [r, e]; a.length;) {
        if (!((e = a.pop()) - (r = a.pop()) <= i)) {
          var h = r + Math.ceil((e - r) / i / 2) * i;
          t(n, h, r, e, o), a.push(r, h, h, e);
        }
      }
    }

    return e.prototype.all = function () {
      return this._all(this.data, []);
    }, e.prototype.search = function (t) {
      var n = this.data,
          r = [];
      if (!p(t, n)) return r;

      for (var e = this.toBBox, i = []; n;) {
        for (var o = 0; o < n.children.length; o++) {
          var a = n.children[o],
              h = n.leaf ? e(a) : a;
          p(t, h) && (n.leaf ? r.push(a) : c(t, h) ? this._all(a, r) : i.push(a));
        }

        n = i.pop();
      }

      return r;
    }, e.prototype.collides = function (t) {
      var n = this.data;
      if (!p(t, n)) return !1;

      for (var r = []; n;) {
        for (var e = 0; e < n.children.length; e++) {
          var i = n.children[e],
              o = n.leaf ? this.toBBox(i) : i;

          if (p(t, o)) {
            if (n.leaf || c(t, o)) return !0;
            r.push(i);
          }
        }

        n = r.pop();
      }

      return !1;
    }, e.prototype.load = function (t) {
      if (!t || !t.length) return this;

      if (t.length < this._minEntries) {
        for (var n = 0; n < t.length; n++) {
          this.insert(t[n]);
        }

        return this;
      }

      var r = this._build(t.slice(), 0, t.length - 1, 0);

      if (this.data.children.length) {
        if (this.data.height === r.height) this._splitRoot(this.data, r);else {
          if (this.data.height < r.height) {
            var e = this.data;
            this.data = r, r = e;
          }

          this._insert(r, this.data.height - r.height - 1, !0);
        }
      } else this.data = r;
      return this;
    }, e.prototype.insert = function (t) {
      return t && this._insert(t, this.data.height - 1), this;
    }, e.prototype.clear = function () {
      return this.data = m([]), this;
    }, e.prototype.remove = function (t, n) {
      if (!t) return this;

      for (var r, e, o, a = this.data, h = this.toBBox(t), u = [], s = []; a || u.length;) {
        if (a || (a = u.pop(), e = u[u.length - 1], r = s.pop(), o = !0), a.leaf) {
          var f = i(t, a.children, n);
          if (-1 !== f) return a.children.splice(f, 1), u.push(a), this._condense(u), this;
        }

        o || a.leaf || !c(a, h) ? e ? (r++, a = e.children[r], o = !1) : a = null : (u.push(a), s.push(r), r = 0, e = a, a = a.children[0]);
      }

      return this;
    }, e.prototype.toBBox = function (t) {
      return t;
    }, e.prototype.compareMinX = function (t, n) {
      return t.minX - n.minX;
    }, e.prototype.compareMinY = function (t, n) {
      return t.minY - n.minY;
    }, e.prototype.toJSON = function () {
      return this.data;
    }, e.prototype.fromJSON = function (t) {
      return this.data = t, this;
    }, e.prototype._all = function (t, n) {
      for (var r = []; t;) {
        t.leaf ? n.push.apply(n, t.children) : r.push.apply(r, t.children), t = r.pop();
      }

      return n;
    }, e.prototype._build = function (t, n, r, e) {
      var i,
          a = r - n + 1,
          h = this._maxEntries;
      if (a <= h) return o(i = m(t.slice(n, r + 1)), this.toBBox), i;
      e || (e = Math.ceil(Math.log(a) / Math.log(h)), h = Math.ceil(a / Math.pow(h, e - 1))), (i = m([])).leaf = !1, i.height = e;
      var u = Math.ceil(a / h),
          s = u * Math.ceil(Math.sqrt(h));
      d(t, n, r, s, this.compareMinX);

      for (var f = n; f <= r; f += s) {
        var l = Math.min(f + s - 1, r);
        d(t, f, l, u, this.compareMinY);

        for (var c = f; c <= l; c += u) {
          var p = Math.min(c + u - 1, l);
          i.children.push(this._build(t, c, p, e - 1));
        }
      }

      return o(i, this.toBBox), i;
    }, e.prototype._chooseSubtree = function (t, n, r, e) {
      for (; e.push(n), !n.leaf && e.length - 1 !== r;) {
        for (var i = 1 / 0, o = 1 / 0, a = void 0, h = 0; h < n.children.length; h++) {
          var u = n.children[h],
              s = f(u),
              l = (c = t, p = u, (Math.max(p.maxX, c.maxX) - Math.min(p.minX, c.minX)) * (Math.max(p.maxY, c.maxY) - Math.min(p.minY, c.minY)) - s);
          l < o ? (o = l, i = s < i ? s : i, a = u) : l === o && s < i && (i = s, a = u);
        }

        n = a || n.children[0];
      }

      var c, p;
      return n;
    }, e.prototype._insert = function (t, n, r) {
      var e = r ? t : this.toBBox(t),
          i = [],
          o = this._chooseSubtree(e, this.data, n, i);

      for (o.children.push(t), h(o, e); n >= 0 && i[n].children.length > this._maxEntries;) {
        this._split(i, n), n--;
      }

      this._adjustParentBBoxes(e, i, n);
    }, e.prototype._split = function (t, n) {
      var r = t[n],
          e = r.children.length,
          i = this._minEntries;

      this._chooseSplitAxis(r, i, e);

      var a = this._chooseSplitIndex(r, i, e),
          h = m(r.children.splice(a, r.children.length - a));

      h.height = r.height, h.leaf = r.leaf, o(r, this.toBBox), o(h, this.toBBox), n ? t[n - 1].children.push(h) : this._splitRoot(r, h);
    }, e.prototype._splitRoot = function (t, n) {
      this.data = m([t, n]), this.data.height = t.height + 1, this.data.leaf = !1, o(this.data, this.toBBox);
    }, e.prototype._chooseSplitIndex = function (t, n, r) {
      for (var e, i, o, h, u, s, l, c = 1 / 0, p = 1 / 0, m = n; m <= r - n; m++) {
        var d = a(t, 0, m, this.toBBox),
            v = a(t, m, r, this.toBBox),
            x = (i = d, o = v, h = Math.max(i.minX, o.minX), u = Math.max(i.minY, o.minY), s = Math.min(i.maxX, o.maxX), l = Math.min(i.maxY, o.maxY), Math.max(0, s - h) * Math.max(0, l - u)),
            g = f(d) + f(v);
        x < c ? (c = x, e = m, p = g < p ? g : p) : x === c && g < p && (p = g, e = m);
      }

      return e || r - n;
    }, e.prototype._chooseSplitAxis = function (t, n, r) {
      var e = t.leaf ? this.compareMinX : u,
          i = t.leaf ? this.compareMinY : s;
      this._allDistMargin(t, n, r, e) < this._allDistMargin(t, n, r, i) && t.children.sort(e);
    }, e.prototype._allDistMargin = function (t, n, r, e) {
      t.children.sort(e);

      for (var i = this.toBBox, o = a(t, 0, n, i), u = a(t, r - n, r, i), s = l(o) + l(u), f = n; f < r - n; f++) {
        var c = t.children[f];
        h(o, t.leaf ? i(c) : c), s += l(o);
      }

      for (var p = r - n - 1; p >= n; p--) {
        var m = t.children[p];
        h(u, t.leaf ? i(m) : m), s += l(u);
      }

      return s;
    }, e.prototype._adjustParentBBoxes = function (t, n, r) {
      for (var e = r; e >= 0; e--) {
        h(n[e], t);
      }
    }, e.prototype._condense = function (t) {
      for (var n = t.length - 1, r = void 0; n >= 0; n--) {
        0 === t[n].children.length ? n > 0 ? (r = t[n - 1].children).splice(r.indexOf(t[n]), 1) : this.clear() : o(t[n], this.toBBox);
      }
    }, e;
  }();
}, function (t, n, r) {
  t.exports = function () {
    "use strict";

    var t = function t(_t3, r) {
      if (void 0 === _t3 && (_t3 = []), void 0 === r && (r = n), this.data = _t3, this.length = this.data.length, this.compare = r, this.length > 0) for (var e = (this.length >> 1) - 1; e >= 0; e--) {
        this._down(e);
      }
    };

    function n(t, n) {
      return t < n ? -1 : t > n ? 1 : 0;
    }

    return t.prototype.push = function (t) {
      this.data.push(t), this.length++, this._up(this.length - 1);
    }, t.prototype.pop = function () {
      if (0 !== this.length) {
        var t = this.data[0],
            n = this.data.pop();
        return this.length--, this.length > 0 && (this.data[0] = n, this._down(0)), t;
      }
    }, t.prototype.peek = function () {
      return this.data[0];
    }, t.prototype._up = function (t) {
      for (var n = this.data, r = this.compare, e = n[t]; t > 0;) {
        var i = t - 1 >> 1,
            o = n[i];
        if (r(e, o) >= 0) break;
        n[t] = o, t = i;
      }

      n[t] = e;
    }, t.prototype._down = function (t) {
      for (var n = this.data, r = this.compare, e = this.length >> 1, i = n[t]; t < e;) {
        var o = 1 + (t << 1),
            a = n[o],
            h = o + 1;
        if (h < this.length && r(n[h], a) < 0 && (o = h, a = n[h]), r(a, i) >= 0) break;
        n[t] = a, t = o;
      }

      n[t] = i;
    }, t;
  }();
}, function (t, n) {
  t.exports = function (t, n) {
    for (var r = t[0], e = t[1], i = !1, o = 0, a = n.length - 1; o < n.length; a = o++) {
      var h = n[o][0],
          u = n[o][1],
          s = n[a][0],
          f = n[a][1];
      u > e != f > e && r < (s - h) * (e - u) / (f - u) + h && (i = !i);
    }

    return i;
  };
}, function (t, n, r) {
  !function (t) {
    "use strict";

    var n = 134217729;

    function r(t, n, r, e, i) {
      var o,
          a,
          h,
          u,
          s = n[0],
          f = e[0],
          l = 0,
          c = 0;
      f > s == f > -s ? (o = s, s = n[++l]) : (o = f, f = e[++c]);
      var p = 0;
      if (l < t && c < r) for (f > s == f > -s ? (h = o - ((a = s + o) - s), s = n[++l]) : (h = o - ((a = f + o) - f), f = e[++c]), o = a, 0 !== h && (i[p++] = h); l < t && c < r;) {
        f > s == f > -s ? (h = o - ((a = o + s) - (u = a - o)) + (s - u), s = n[++l]) : (h = o - ((a = o + f) - (u = a - o)) + (f - u), f = e[++c]), o = a, 0 !== h && (i[p++] = h);
      }

      for (; l < t;) {
        h = o - ((a = o + s) - (u = a - o)) + (s - u), s = n[++l], o = a, 0 !== h && (i[p++] = h);
      }

      for (; c < r;) {
        h = o - ((a = o + f) - (u = a - o)) + (f - u), f = e[++c], o = a, 0 !== h && (i[p++] = h);
      }

      return 0 === o && 0 !== p || (i[p++] = o), p;
    }

    function e(t) {
      return new Float64Array(t);
    }

    var i = e(4),
        o = e(8),
        a = e(12),
        h = e(16),
        u = e(4);
    t.orient2d = function (t, e, s, f, l, c) {
      var p = (e - c) * (s - l),
          m = (t - l) * (f - c),
          d = p - m;
      if (0 === p || 0 === m || p > 0 != m > 0) return d;
      var v = Math.abs(p + m);
      return Math.abs(d) >= 33306690738754716e-32 * v ? d : -function (t, e, s, f, l, c, p) {
        var m, d, v, x, g, M, X, Y, y, _, B, b, S, O, j, w, E, P;

        var H = t - l,
            T = s - l,
            k = e - c,
            J = f - c;
        g = (j = (Y = H - (X = (M = n * H) - (M - H))) * (_ = J - (y = (M = n * J) - (M - J))) - ((O = H * J) - X * y - Y * y - X * _)) - (B = j - (E = (Y = k - (X = (M = n * k) - (M - k))) * (_ = T - (y = (M = n * T) - (M - T))) - ((w = k * T) - X * y - Y * y - X * _))), i[0] = j - (B + g) + (g - E), g = (S = O - ((b = O + B) - (g = b - O)) + (B - g)) - (B = S - w), i[1] = S - (B + g) + (g - w), g = (P = b + B) - b, i[2] = b - (P - g) + (B - g), i[3] = P;

        var N = function (t, n) {
          var r = n[0];

          for (var _t4 = 1; _t4 < 4; _t4++) {
            r += n[_t4];
          }

          return r;
        }(0, i),
            q = 22204460492503146e-32 * p;

        if (N >= q || -N >= q) return N;
        if (m = t - (H + (g = t - H)) + (g - l), v = s - (T + (g = s - T)) + (g - l), d = e - (k + (g = e - k)) + (g - c), x = f - (J + (g = f - J)) + (g - c), 0 === m && 0 === d && 0 === v && 0 === x) return N;
        if (q = 11093356479670487e-47 * p + 33306690738754706e-32 * Math.abs(N), (N += H * x + J * m - (k * v + T * d)) >= q || -N >= q) return N;
        g = (j = (Y = m - (X = (M = n * m) - (M - m))) * (_ = J - (y = (M = n * J) - (M - J))) - ((O = m * J) - X * y - Y * y - X * _)) - (B = j - (E = (Y = d - (X = (M = n * d) - (M - d))) * (_ = T - (y = (M = n * T) - (M - T))) - ((w = d * T) - X * y - Y * y - X * _))), u[0] = j - (B + g) + (g - E), g = (S = O - ((b = O + B) - (g = b - O)) + (B - g)) - (B = S - w), u[1] = S - (B + g) + (g - w), g = (P = b + B) - b, u[2] = b - (P - g) + (B - g), u[3] = P;
        var A = r(4, i, 4, u, o);
        g = (j = (Y = H - (X = (M = n * H) - (M - H))) * (_ = x - (y = (M = n * x) - (M - x))) - ((O = H * x) - X * y - Y * y - X * _)) - (B = j - (E = (Y = k - (X = (M = n * k) - (M - k))) * (_ = v - (y = (M = n * v) - (M - v))) - ((w = k * v) - X * y - Y * y - X * _))), u[0] = j - (B + g) + (g - E), g = (S = O - ((b = O + B) - (g = b - O)) + (B - g)) - (B = S - w), u[1] = S - (B + g) + (g - w), g = (P = b + B) - b, u[2] = b - (P - g) + (B - g), u[3] = P;
        var D = r(A, o, 4, u, a);
        g = (j = (Y = m - (X = (M = n * m) - (M - m))) * (_ = x - (y = (M = n * x) - (M - x))) - ((O = m * x) - X * y - Y * y - X * _)) - (B = j - (E = (Y = d - (X = (M = n * d) - (M - d))) * (_ = v - (y = (M = n * v) - (M - v))) - ((w = d * v) - X * y - Y * y - X * _))), u[0] = j - (B + g) + (g - E), g = (S = O - ((b = O + B) - (g = b - O)) + (B - g)) - (B = S - w), u[1] = S - (B + g) + (g - w), g = (P = b + B) - b, u[2] = b - (P - g) + (B - g), u[3] = P;
        var L = r(D, a, 4, u, h);
        return h[L - 1];
      }(t, e, s, f, l, c, v);
    }, t.orient2dfast = function (t, n, r, e, i, o) {
      return (n - o) * (r - i) - (t - i) * (e - o);
    }, Object.defineProperty(t, "__esModule", {
      value: !0
    });
  }(n);
}]);

/***/ })

}]);