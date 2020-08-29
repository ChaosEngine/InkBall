(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[0],{

/***/ 3:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "concaveman", function() { return _concavemanBundle$concaveman; });
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
  }, r.p = "", r(r.s = 2);
}([function (t, n, r) {
  "use strict";

  var e = r(3),
      i = r(4),
      o = r(5);
  var a = r(6).orient2d;

  function h(t, n, r) {
    n = Math.max(0, void 0 === n ? 2 : n), r = r || 0;

    var i = function (t) {
      for (var n = t[0], r = t[0], e = t[0], i = t[0], a = 0; a < t.length; a++) {
        var h = t[a];
        h[0] < n[0] && (n = h), h[0] > e[0] && (e = h), h[1] < r[1] && (r = h), h[1] > i[1] && (i = h);
      }

      var u = [n, r, e, i],
          f = u.slice();

      for (a = 0; a < t.length; a++) {
        o(t[a], u) || f.push(t[a]);
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
      }(f);
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

    for (var h, f = [], l = 0; l < i.length; l++) {
      var c = i[l];
      a.remove(c), h = v(c, h), f.push(h);
    }

    var s = new e(16);

    for (l = 0; l < f.length; l++) {
      s.insert(m(f[l]));
    }

    for (var x = n * n, g = r * r; f.length;) {
      var X = f.shift(),
          Y = X.p,
          _ = X.next.p,
          y = d(Y, _);

      if (!(y < g)) {
        var B = y / x;
        (c = u(a, X.prev.p, Y, _, X.next.next.p, B, s)) && Math.min(d(c, Y), d(c, _)) <= B && (f.push(X), f.push(v(c, X)), a.remove(c), s.remove(X), s.insert(m(X)), s.insert(m(X.next)));
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
    for (var u = new i([], f), c = t.data; c;) {
      for (var p = 0; p < c.children.length; p++) {
        var m = c.children[p],
            v = c.leaf ? x(m, r, e) : l(r, e, m);
        v > a || u.push({
          node: m,
          dist: v
        });
      }

      for (; u.length && !u.peek().node.children;) {
        var d = u.pop(),
            g = d.node,
            M = x(g, n, r),
            X = x(g, e, o);
        if (d.dist < M && d.dist < X && s(r, g, h) && s(e, g, h)) return g;
      }

      (c = u.pop()) && (c = c.node);
    }

    return null;
  }

  function f(t, n) {
    return t.dist - n.dist;
  }

  function l(t, n, r) {
    if (c(t, r) || c(n, r)) return 0;
    var e = g(t[0], t[1], n[0], n[1], r.minX, r.minY, r.maxX, r.minY);
    if (0 === e) return 0;
    var i = g(t[0], t[1], n[0], n[1], r.minX, r.minY, r.minX, r.maxY);
    if (0 === i) return 0;
    var o = g(t[0], t[1], n[0], n[1], r.maxX, r.minY, r.maxX, r.maxY);
    if (0 === o) return 0;
    var a = g(t[0], t[1], n[0], n[1], r.minX, r.maxY, r.maxX, r.maxY);
    return 0 === a ? 0 : Math.min(e, i, o, a);
  }

  function c(t, n) {
    return t[0] >= n.minX && t[0] <= n.maxX && t[1] >= n.minY && t[1] <= n.maxY;
  }

  function s(t, n, r) {
    for (var e, i, o, a, h = Math.min(t[0], n[0]), u = Math.min(t[1], n[1]), f = Math.max(t[0], n[0]), l = Math.max(t[1], n[1]), c = r.search({
      minX: h,
      minY: u,
      maxX: f,
      maxY: l
    }), s = 0; s < c.length; s++) {
      if (e = c[s].p, i = c[s].next.p, o = t, e !== (a = n) && i !== o && p(e, i, o) > 0 != p(e, i, a) > 0 && p(o, a, e) > 0 != p(o, a, i) > 0) return !1;
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

  function v(t, n) {
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

  function d(t, n) {
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
        f,
        l,
        c,
        s = r - t,
        p = e - n,
        m = a - i,
        v = h - o,
        d = t - i,
        x = n - o,
        g = s * s + p * p,
        M = s * m + p * v,
        X = m * m + v * v,
        Y = s * d + p * x,
        _ = m * d + v * x,
        y = g * X - M * M,
        B = y,
        b = y;

    0 === y ? (f = 0, B = 1, c = _, b = X) : (c = g * _ - M * Y, (f = M * _ - X * Y) < 0 ? (f = 0, c = _, b = X) : f > B && (f = B, c = _ + M, b = X)), c < 0 ? (c = 0, -Y < 0 ? f = 0 : -Y > g ? f = B : (f = -Y, B = g)) : c > b && (c = b, -Y + M < 0 ? f = 0 : -Y + M > g ? f = B : (f = -Y + M, B = g));
    var O = (1 - (l = 0 === c ? 0 : c / b)) * i + l * a - ((1 - (u = 0 === f ? 0 : f / B)) * t + u * r),
        S = (1 - l) * o + l * h - ((1 - u) * n + u * e);
    return O * O + S * S;
  }

  function M(t, n) {
    return t[0] === n[0] ? t[1] - n[1] : t[0] - n[0];
  }

  t.exports = h, t.exports["default"] = h;
}, function (t, n) {
  function r(t, n, r) {
    r = r || 0;
    var e,
        i,
        o,
        a,
        h,
        u,
        f,
        l = [0, 0];
    return e = t[1][1] - t[0][1], i = t[0][0] - t[1][0], o = e * t[0][0] + i * t[0][1], a = n[1][1] - n[0][1], h = n[0][0] - n[1][0], u = a * n[0][0] + h * n[0][1], _(f = e * h - a * i, 0, r) || (l[0] = (h * o - i * u) / f, l[1] = (e * u - a * o) / f), l;
  }

  function e(t, n, r, e) {
    var i = n[0] - t[0],
        o = n[1] - t[1],
        a = e[0] - r[0],
        h = e[1] - r[1];
    if (a * o - h * i == 0) return !1;
    var u = (i * (r[1] - t[1]) + o * (t[0] - r[0])) / (a * o - h * i),
        f = (a * (t[1] - r[1]) + h * (r[0] - t[0])) / (h * i - a * o);
    return u >= 0 && u <= 1 && f >= 0 && f <= 1;
  }

  function i(t, n, r) {
    return (n[0] - t[0]) * (r[1] - t[1]) - (r[0] - t[0]) * (n[1] - t[1]);
  }

  function o(t, n, r) {
    return i(t, n, r) > 0;
  }

  function a(t, n, r) {
    return i(t, n, r) >= 0;
  }

  function h(t, n, r) {
    return i(t, n, r) < 0;
  }

  function u(t, n, r) {
    return i(t, n, r) <= 0;
  }

  t.exports = {
    decomp: function decomp(t) {
      var n = function t(n) {
        for (var r = [], e = [], i = [], o = [], a = Number.MAX_VALUE, h = 0; h < n.length; ++h) {
          if (v(n, h)) for (var u = 0; u < n.length; ++u) {
            if (g(n, h, u)) {
              e = t(X(n, h, u, o)), i = t(X(n, u, h, o));

              for (var f = 0; f < i.length; f++) {
                e.push(i[f]);
              }

              e.length < a && (r = e, a = e.length, r.push([p(n, h), p(n, u)]));
            }
          }
        }

        return r;
      }(t);

      return n.length > 0 ? function t(n, r) {
        if (0 === r.length) return [n];

        if (r instanceof Array && r.length && r[0] instanceof Array && 2 === r[0].length && r[0][0] instanceof Array) {
          for (var e = [n], i = 0; i < r.length; i++) {
            for (var o = r[i], a = 0; a < e.length; a++) {
              var h = e[a],
                  u = t(h, o);

              if (u) {
                e.splice(a, 1), e.push(u[0], u[1]);
                break;
              }
            }
          }

          return e;
        }

        o = r, i = n.indexOf(o[0]), a = n.indexOf(o[1]);
        return -1 !== i && -1 !== a && [X(n, i, a), X(n, a, i)];
      }(t, n) : [t];
    },
    quickDecomp: function t(n, r, e, i, f, l, c) {
      l = l || 100, c = c || 0, f = f || 25, r = void 0 !== r ? r : [], e = e || [], i = i || [];
      var d = [0, 0],
          x = [0, 0],
          g = [0, 0],
          X = 0,
          _ = 0,
          y = 0,
          B = 0,
          b = 0,
          O = 0,
          S = 0,
          A = [],
          w = [],
          j = n,
          E = n;
      if (E.length < 3) return r;
      if (++c > l) return console.warn("quickDecomp: max level (" + l + ") reached."), r;

      for (var P = 0; P < n.length; ++P) {
        if (v(j, P)) {
          e.push(j[P]), X = _ = Number.MAX_VALUE;

          for (var k = 0; k < n.length; ++k) {
            o(p(j, P - 1), p(j, P), p(j, k)) && u(p(j, P - 1), p(j, P), p(j, k - 1)) && (g = Y(p(j, P - 1), p(j, P), p(j, k), p(j, k - 1)), h(p(j, P + 1), p(j, P), g) && (y = s(j[P], g)) < _ && (_ = y, x = g, O = k)), o(p(j, P + 1), p(j, P), p(j, k + 1)) && u(p(j, P + 1), p(j, P), p(j, k)) && (g = Y(p(j, P + 1), p(j, P), p(j, k), p(j, k + 1)), o(p(j, P - 1), p(j, P), g) && (y = s(j[P], g)) < X && (X = y, d = g, b = k));
          }

          if (O === (b + 1) % n.length) g[0] = (x[0] + d[0]) / 2, g[1] = (x[1] + d[1]) / 2, i.push(g), P < b ? (m(A, j, P, b + 1), A.push(g), w.push(g), 0 !== O && m(w, j, O, j.length), m(w, j, 0, P + 1)) : (0 !== P && m(A, j, P, j.length), m(A, j, 0, b + 1), A.push(g), w.push(g), m(w, j, O, P + 1));else {
            if (O > b && (b += n.length), B = Number.MAX_VALUE, b < O) return r;

            for (k = O; k <= b; ++k) {
              a(p(j, P - 1), p(j, P), p(j, k)) && u(p(j, P + 1), p(j, P), p(j, k)) && (y = s(p(j, P), p(j, k))) < B && M(j, P, k) && (B = y, S = k % n.length);
            }

            P < S ? (m(A, j, P, S + 1), 0 !== S && m(w, j, S, E.length), m(w, j, 0, P + 1)) : (0 !== P && m(A, j, P, E.length), m(A, j, 0, S + 1), m(w, j, S, P + 1));
          }
          return A.length < w.length ? (t(A, r, e, i, f, l, c), t(w, r, e, i, f, l, c)) : (t(w, r, e, i, f, l, c), t(A, r, e, i, f, l, c)), r;
        }
      }

      return r.push(n), r;
    },
    isSimple: function isSimple(t) {
      var n,
          r = t;

      for (n = 0; n < r.length - 1; n++) {
        for (var i = 0; i < n - 1; i++) {
          if (e(r[n], r[n + 1], r[i], r[i + 1])) return !1;
        }
      }

      for (n = 1; n < r.length - 2; n++) {
        if (e(r[0], r[r.length - 1], r[n], r[n + 1])) return !1;
      }

      return !0;
    },
    removeCollinearPoints: function removeCollinearPoints(t, n) {
      for (var r = 0, e = t.length - 1; t.length > 3 && e >= 0; --e) {
        c(p(t, e - 1), p(t, e), p(t, e + 1), n) && (t.splice(e % t.length, 1), r++);
      }

      return r;
    },
    removeDuplicatePoints: function removeDuplicatePoints(t, n) {
      for (var r = t.length - 1; r >= 1; --r) {
        for (var e = t[r], i = r - 1; i >= 0; --i) {
          y(e, t[i], n) && t.splice(r, 1);
        }
      }
    },
    makeCCW: function makeCCW(t) {
      for (var n = 0, r = t, e = 1; e < t.length; ++e) {
        (r[e][1] < r[n][1] || r[e][1] === r[n][1] && r[e][0] > r[n][0]) && (n = e);
      }

      return !o(p(t, n - 1), p(t, n), p(t, n + 1)) && (function (t) {
        for (var n = [], r = t.length, e = 0; e !== r; e++) {
          n.push(t.pop());
        }

        for (e = 0; e !== r; e++) {
          t[e] = n[e];
        }
      }(t), !0);
    }
  };
  var f = [],
      l = [];

  function c(t, n, r, e) {
    if (e) {
      var o = f,
          a = l;
      o[0] = n[0] - t[0], o[1] = n[1] - t[1], a[0] = r[0] - n[0], a[1] = r[1] - n[1];
      var h = o[0] * a[0] + o[1] * a[1],
          u = Math.sqrt(o[0] * o[0] + o[1] * o[1]),
          c = Math.sqrt(a[0] * a[0] + a[1] * a[1]);
      return Math.acos(h / (u * c)) < e;
    }

    return 0 === i(t, n, r);
  }

  function s(t, n) {
    var r = n[0] - t[0],
        e = n[1] - t[1];
    return r * r + e * e;
  }

  function p(t, n) {
    var r = t.length;
    return t[n < 0 ? n % r + r : n % r];
  }

  function m(t, n, r, e) {
    for (var i = r; i < e; i++) {
      t.push(n[i]);
    }
  }

  function v(t, n) {
    return h(p(t, n - 1), p(t, n), p(t, n + 1));
  }

  var d = [],
      x = [];

  function g(t, n, e) {
    var i,
        o,
        h = d,
        f = x;
    if (a(p(t, n + 1), p(t, n), p(t, e)) && u(p(t, n - 1), p(t, n), p(t, e))) return !1;
    o = s(p(t, n), p(t, e));

    for (var l = 0; l !== t.length; ++l) {
      if ((l + 1) % t.length !== n && l !== n && a(p(t, n), p(t, e), p(t, l + 1)) && u(p(t, n), p(t, e), p(t, l)) && (h[0] = p(t, n), h[1] = p(t, e), f[0] = p(t, l), f[1] = p(t, l + 1), i = r(h, f), s(p(t, n), i) < o)) return !1;
    }

    return !0;
  }

  function M(t, n, r) {
    for (var i = 0; i !== t.length; ++i) {
      if (i !== n && i !== r && (i + 1) % t.length !== n && (i + 1) % t.length !== r && e(p(t, n), p(t, r), p(t, i), p(t, i + 1))) return !1;
    }

    return !0;
  }

  function X(t, n, r, e) {
    var i = e || [];
    if (function (t) {
      t.length = 0;
    }(i), n < r) for (var o = n; o <= r; o++) {
      i.push(t[o]);
    } else {
      for (o = 0; o <= r; o++) {
        i.push(t[o]);
      }

      for (o = n; o < t.length; o++) {
        i.push(t[o]);
      }
    }
    return i;
  }

  function Y(t, n, r, e, i) {
    i = i || 0;
    var o = n[1] - t[1],
        a = t[0] - n[0],
        h = o * t[0] + a * t[1],
        u = e[1] - r[1],
        f = r[0] - e[0],
        l = u * r[0] + f * r[1],
        c = o * f - u * a;
    return _(c, 0, i) ? [0, 0] : [(f * h - a * l) / c, (o * l - u * h) / c];
  }

  function _(t, n, r) {
    return r = r || 0, Math.abs(t - n) <= r;
  }

  function y(t, n, r) {
    return _(t[0], n[0], r) && _(t[1], n[1], r);
  }
}, function (t, n, r) {
  "use strict";

  r.r(n);
  var e = r(0),
      i = r.n(e);
  r.d(n, "concaveman", function () {
    return i.a;
  });
  var o = r(1),
      a = r.n(o);
  var h = [[484, 480], [676, 363], [944, 342], [678, 41], [286, 237], [758, 215], [752, 117], [282, 492], [609, 262], [129, 252]],
      u = i()(h, 2, 0),
      f = a.a.decomp(h);
  (!u || u.length <= 0 || //!convexPolygonsQuick || convexPolygonsQuick.length <= 0 || 
  !f || f.length <= 0) && console.log("decomp or concaveman error");
}, function (t, n, r) {
  t.exports = function () {
    "use strict";

    function t(t, e, i, o, a) {
      !function t(r, e, i, o, a) {
        for (; o > i;) {
          if (o - i > 600) {
            var h = o - i + 1,
                u = e - i + 1,
                f = Math.log(h),
                l = .5 * Math.exp(2 * f / 3),
                c = .5 * Math.sqrt(f * l * (h - l) / h) * (u - h / 2 < 0 ? -1 : 1);
            t(r, e, Math.max(i, Math.floor(e - u * l / h + c)), Math.min(o, Math.floor(e + (h - u) * l / h + c)), a);
          }

          var s = r[e],
              p = i,
              m = o;

          for (n(r, i, e), a(r[o], s) > 0 && n(r, i, o); p < m;) {
            for (n(r, p, m), p++, m--; a(r[p], s) < 0;) {
              p++;
            }

            for (; a(r[m], s) > 0;) {
              m--;
            }
          }

          0 === a(r[i], s) ? n(r, i, m) : n(r, ++m, o), m <= e && (i = m + 1), e <= m && (o = m - 1);
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

    function f(t, n) {
      return t.minY - n.minY;
    }

    function l(t) {
      return (t.maxX - t.minX) * (t.maxY - t.minY);
    }

    function c(t) {
      return t.maxX - t.minX + (t.maxY - t.minY);
    }

    function s(t, n) {
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

    function v(n, r, e, i, o) {
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
          p(t, h) && (n.leaf ? r.push(a) : s(t, h) ? this._all(a, r) : i.push(a));
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
            if (n.leaf || s(t, o)) return !0;
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

      for (var r, e, o, a = this.data, h = this.toBBox(t), u = [], f = []; a || u.length;) {
        if (a || (a = u.pop(), e = u[u.length - 1], r = f.pop(), o = !0), a.leaf) {
          var l = i(t, a.children, n);
          if (-1 !== l) return a.children.splice(l, 1), u.push(a), this._condense(u), this;
        }

        o || a.leaf || !s(a, h) ? e ? (r++, a = e.children[r], o = !1) : a = null : (u.push(a), f.push(r), r = 0, e = a, a = a.children[0]);
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
          f = u * Math.ceil(Math.sqrt(h));
      v(t, n, r, f, this.compareMinX);

      for (var l = n; l <= r; l += f) {
        var c = Math.min(l + f - 1, r);
        v(t, l, c, u, this.compareMinY);

        for (var s = l; s <= c; s += u) {
          var p = Math.min(s + u - 1, c);
          i.children.push(this._build(t, s, p, e - 1));
        }
      }

      return o(i, this.toBBox), i;
    }, e.prototype._chooseSubtree = function (t, n, r, e) {
      for (; e.push(n), !n.leaf && e.length - 1 !== r;) {
        for (var i = 1 / 0, o = 1 / 0, a = void 0, h = 0; h < n.children.length; h++) {
          var u = n.children[h],
              f = l(u),
              c = (s = t, p = u, (Math.max(p.maxX, s.maxX) - Math.min(p.minX, s.minX)) * (Math.max(p.maxY, s.maxY) - Math.min(p.minY, s.minY)) - f);
          c < o ? (o = c, i = f < i ? f : i, a = u) : c === o && f < i && (i = f, a = u);
        }

        n = a || n.children[0];
      }

      var s, p;
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
      for (var e, i, o, h, u, f, c, s = 1 / 0, p = 1 / 0, m = n; m <= r - n; m++) {
        var v = a(t, 0, m, this.toBBox),
            d = a(t, m, r, this.toBBox),
            x = (i = v, o = d, h = Math.max(i.minX, o.minX), u = Math.max(i.minY, o.minY), f = Math.min(i.maxX, o.maxX), c = Math.min(i.maxY, o.maxY), Math.max(0, f - h) * Math.max(0, c - u)),
            g = l(v) + l(d);
        x < s ? (s = x, e = m, p = g < p ? g : p) : x === s && g < p && (p = g, e = m);
      }

      return e || r - n;
    }, e.prototype._chooseSplitAxis = function (t, n, r) {
      var e = t.leaf ? this.compareMinX : u,
          i = t.leaf ? this.compareMinY : f;
      this._allDistMargin(t, n, r, e) < this._allDistMargin(t, n, r, i) && t.children.sort(e);
    }, e.prototype._allDistMargin = function (t, n, r, e) {
      t.children.sort(e);

      for (var i = this.toBBox, o = a(t, 0, n, i), u = a(t, r - n, r, i), f = c(o) + c(u), l = n; l < r - n; l++) {
        var s = t.children[l];
        h(o, t.leaf ? i(s) : s), f += c(o);
      }

      for (var p = r - n - 1; p >= n; p--) {
        var m = t.children[p];
        h(u, t.leaf ? i(m) : m), f += c(u);
      }

      return f;
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

    var t = function t(_t, r) {
      if (void 0 === _t && (_t = []), void 0 === r && (r = n), this.data = _t, this.length = this.data.length, this.compare = r, this.length > 0) for (var e = (this.length >> 1) - 1; e >= 0; e--) {
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
          f = n[a][0],
          l = n[a][1];
      u > e != l > e && r < (f - h) * (e - u) / (l - u) + h && (i = !i);
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
          f = n[0],
          l = e[0],
          c = 0,
          s = 0;
      l > f == l > -f ? (o = f, f = n[++c]) : (o = l, l = e[++s]);
      var p = 0;
      if (c < t && s < r) for (l > f == l > -f ? (h = o - ((a = f + o) - f), f = n[++c]) : (h = o - ((a = l + o) - l), l = e[++s]), o = a, 0 !== h && (i[p++] = h); c < t && s < r;) {
        l > f == l > -f ? (h = o - ((a = o + f) - (u = a - o)) + (f - u), f = n[++c]) : (h = o - ((a = o + l) - (u = a - o)) + (l - u), l = e[++s]), o = a, 0 !== h && (i[p++] = h);
      }

      for (; c < t;) {
        h = o - ((a = o + f) - (u = a - o)) + (f - u), f = n[++c], o = a, 0 !== h && (i[p++] = h);
      }

      for (; s < r;) {
        h = o - ((a = o + l) - (u = a - o)) + (l - u), l = e[++s], o = a, 0 !== h && (i[p++] = h);
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
    t.orient2d = function (t, e, f, l, c, s) {
      var p = (e - s) * (f - c),
          m = (t - c) * (l - s),
          v = p - m;
      if (0 === p || 0 === m || p > 0 != m > 0) return v;
      var d = Math.abs(p + m);
      return Math.abs(v) >= 33306690738754716e-32 * d ? v : -function (t, e, f, l, c, s, p) {
        var m, v, d, x, g, M, X, Y, _, y, B, b, O, S, A, w, j, E;

        var P = t - c,
            k = f - c,
            q = e - s,
            D = l - s;
        g = (A = (Y = P - (X = (M = n * P) - (M - P))) * (y = D - (_ = (M = n * D) - (M - D))) - ((S = P * D) - X * _ - Y * _ - X * y)) - (B = A - (j = (Y = q - (X = (M = n * q) - (M - q))) * (y = k - (_ = (M = n * k) - (M - k))) - ((w = q * k) - X * _ - Y * _ - X * y))), i[0] = A - (B + g) + (g - j), g = (O = S - ((b = S + B) - (g = b - S)) + (B - g)) - (B = O - w), i[1] = O - (B + g) + (g - w), g = (E = b + B) - b, i[2] = b - (E - g) + (B - g), i[3] = E;

        var N = function (t, n) {
          var r = n[0];

          for (var _t2 = 1; _t2 < 4; _t2++) {
            r += n[_t2];
          }

          return r;
        }(0, i),
            C = 22204460492503146e-32 * p;

        if (N >= C || -N >= C) return N;
        if (m = t - (P + (g = t - P)) + (g - c), d = f - (k + (g = f - k)) + (g - c), v = e - (q + (g = e - q)) + (g - s), x = l - (D + (g = l - D)) + (g - s), 0 === m && 0 === v && 0 === d && 0 === x) return N;
        if (C = 11093356479670487e-47 * p + 33306690738754706e-32 * Math.abs(N), (N += P * x + D * m - (q * d + k * v)) >= C || -N >= C) return N;
        g = (A = (Y = m - (X = (M = n * m) - (M - m))) * (y = D - (_ = (M = n * D) - (M - D))) - ((S = m * D) - X * _ - Y * _ - X * y)) - (B = A - (j = (Y = v - (X = (M = n * v) - (M - v))) * (y = k - (_ = (M = n * k) - (M - k))) - ((w = v * k) - X * _ - Y * _ - X * y))), u[0] = A - (B + g) + (g - j), g = (O = S - ((b = S + B) - (g = b - S)) + (B - g)) - (B = O - w), u[1] = O - (B + g) + (g - w), g = (E = b + B) - b, u[2] = b - (E - g) + (B - g), u[3] = E;
        var L = r(4, i, 4, u, o);
        g = (A = (Y = P - (X = (M = n * P) - (M - P))) * (y = x - (_ = (M = n * x) - (M - x))) - ((S = P * x) - X * _ - Y * _ - X * y)) - (B = A - (j = (Y = q - (X = (M = n * q) - (M - q))) * (y = d - (_ = (M = n * d) - (M - d))) - ((w = q * d) - X * _ - Y * _ - X * y))), u[0] = A - (B + g) + (g - j), g = (O = S - ((b = S + B) - (g = b - S)) + (B - g)) - (B = O - w), u[1] = O - (B + g) + (g - w), g = (E = b + B) - b, u[2] = b - (E - g) + (B - g), u[3] = E;
        var R = r(L, o, 4, u, a);
        g = (A = (Y = m - (X = (M = n * m) - (M - m))) * (y = x - (_ = (M = n * x) - (M - x))) - ((S = m * x) - X * _ - Y * _ - X * y)) - (B = A - (j = (Y = v - (X = (M = n * v) - (M - v))) * (y = d - (_ = (M = n * d) - (M - d))) - ((w = v * d) - X * _ - Y * _ - X * y))), u[0] = A - (B + g) + (g - j), g = (O = S - ((b = S + B) - (g = b - S)) + (B - g)) - (B = O - w), u[1] = O - (B + g) + (g - w), g = (E = b + B) - b, u[2] = b - (E - g) + (B - g), u[3] = E;
        var U = r(R, a, 4, u, h);
        return h[U - 1];
      }(t, e, f, l, c, s, d);
    }, t.orient2dfast = function (t, n, r, e, i, o) {
      return (n - o) * (r - i) - (t - i) * (e - o);
    }, Object.defineProperty(t, "__esModule", {
      value: !0
    });
  }(n);
}]);

var _concavemanBundle$concaveman = concavemanBundle.concaveman;


/***/ })

}]);