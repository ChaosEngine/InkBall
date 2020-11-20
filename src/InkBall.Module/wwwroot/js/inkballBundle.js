/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 	};
/******/
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		0: 0
/******/ 	};
/******/
/******/
/******/
/******/ 	// script path function
/******/ 	function jsonpScriptSrc(chunkId) {
/******/ 		return __webpack_require__.p + "" + ({"1":"svgvml","2":"svgvmlMin"}[chunkId]||chunkId) + "Bundle.js"
/******/ 	}
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId) {
/******/ 		var promises = [];
/******/
/******/
/******/ 		// JSONP chunk loading for javascript
/******/
/******/ 		var installedChunkData = installedChunks[chunkId];
/******/ 		if(installedChunkData !== 0) { // 0 means "already installed".
/******/
/******/ 			// a Promise means "currently loading".
/******/ 			if(installedChunkData) {
/******/ 				promises.push(installedChunkData[2]);
/******/ 			} else {
/******/ 				// setup Promise in chunk cache
/******/ 				var promise = new Promise(function(resolve, reject) {
/******/ 					installedChunkData = installedChunks[chunkId] = [resolve, reject];
/******/ 				});
/******/ 				promises.push(installedChunkData[2] = promise);
/******/
/******/ 				// start chunk loading
/******/ 				var script = document.createElement('script');
/******/ 				var onScriptComplete;
/******/
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.src = jsonpScriptSrc(chunkId);
/******/
/******/ 				// create error before stack unwound to get useful stacktrace later
/******/ 				var error = new Error();
/******/ 				onScriptComplete = function (event) {
/******/ 					// avoid mem leaks in IE.
/******/ 					script.onerror = script.onload = null;
/******/ 					clearTimeout(timeout);
/******/ 					var chunk = installedChunks[chunkId];
/******/ 					if(chunk !== 0) {
/******/ 						if(chunk) {
/******/ 							var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 							var realSrc = event && event.target && event.target.src;
/******/ 							error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 							error.name = 'ChunkLoadError';
/******/ 							error.type = errorType;
/******/ 							error.request = realSrc;
/******/ 							chunk[1](error);
/******/ 						}
/******/ 						installedChunks[chunkId] = undefined;
/******/ 					}
/******/ 				};
/******/ 				var timeout = setTimeout(function(){
/******/ 					onScriptComplete({ type: 'timeout', target: script });
/******/ 				}, 120000);
/******/ 				script.onerror = script.onload = onScriptComplete;
/******/ 				document.head.appendChild(script);
/******/ 			}
/******/ 		}
/******/ 		return Promise.all(promises);
/******/ 	};
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "../js/";
/******/
/******/ 	// on error function for async loading
/******/ 	__webpack_require__.oe = function(err) { console.error(err); throw err; };
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 182);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(4);

var core = __webpack_require__(9);

var hide = __webpack_require__(19);

var redefine = __webpack_require__(16);

var ctx = __webpack_require__(21);

var PROTOTYPE = 'prototype';

var $export = function $export(type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;

  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined; // export native or passed

    out = (own ? target : source)[key]; // bind timers to global for call from export context

    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out; // extend global

    if (target) redefine(target, key, out, type & $export.U); // export

    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};

global.core = core; // type bitmap

$export.F = 1; // forced

$export.G = 2; // global

$export.S = 4; // static

$export.P = 8; // proto

$export.B = 16; // bind

$export.W = 32; // wrap

$export.U = 64; // safe

$export.R = 128; // real proto method for `library`

module.exports = $export;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(3);

module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

/***/ }),
/* 3 */
/***/ (function(module, exports) {

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

module.exports = function (it) {
  return _typeof(it) === 'object' ? it !== null : typeof it === 'function';
};

/***/ }),
/* 4 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math ? window : typeof self != 'undefined' && self.Math == Math ? self // eslint-disable-next-line no-new-func
: Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__(69)('wks');

var uid = __webpack_require__(38);

var _Symbol = __webpack_require__(4).Symbol;

var USE_SYMBOL = typeof _Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] = USE_SYMBOL && _Symbol[name] || (USE_SYMBOL ? _Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(23);

var min = Math.min;

module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var check = function check(it) {
  return it && it.Math == Math && it;
}; // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028


module.exports = // eslint-disable-next-line no-undef
check((typeof globalThis === "undefined" ? "undefined" : _typeof(globalThis)) == 'object' && globalThis) || check((typeof window === "undefined" ? "undefined" : _typeof(window)) == 'object' && window) || check((typeof self === "undefined" ? "undefined" : _typeof(self)) == 'object' && self) || check((typeof global === "undefined" ? "undefined" : _typeof(global)) == 'object' && global) || // eslint-disable-next-line no-new-func
function () {
  return this;
}() || Function('return this')();
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(186)))

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(1)(function () {
  return Object.defineProperty({}, 'a', {
    get: function get() {
      return 7;
    }
  }).a != 7;
});

/***/ }),
/* 9 */
/***/ (function(module, exports) {

var core = module.exports = {
  version: '2.6.11'
};
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(2);

var IE8_DOM_DEFINE = __webpack_require__(147);

var toPrimitive = __webpack_require__(33);

var dP = Object.defineProperty;
exports.f = __webpack_require__(8) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) {
    /* empty */
  }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(29);

module.exports = function (it) {
  return Object(defined(it));
};

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);

var fails = __webpack_require__(1);

var defined = __webpack_require__(29);

var quot = /"/g; // B.2.3.2.1 CreateHTML(string, tag, attribute, value)

var createHTML = function createHTML(string, tag, attribute, value) {
  var S = String(defined(string));
  var p1 = '<' + tag;
  if (attribute !== '') p1 += ' ' + attribute + '="' + String(value).replace(quot, '&quot;') + '"';
  return p1 + '>' + S + '</' + tag + '>';
};

module.exports = function (NAME, exec) {
  var O = {};
  O[NAME] = exec(createHTML);
  $export($export.P + $export.F * fails(function () {
    var test = ''[NAME]('"');
    return test !== test.toLowerCase() || test.split('"').length > 3;
  }), 'String', O);
};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(7);

var shared = __webpack_require__(123);

var has = __webpack_require__(14);

var uid = __webpack_require__(125);

var NATIVE_SYMBOL = __webpack_require__(126);

var USE_SYMBOL_AS_UID = __webpack_require__(192);

var WellKnownSymbolsStore = shared('wks');
var _Symbol = global.Symbol;
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? _Symbol : _Symbol && _Symbol.withoutSetter || uid;

module.exports = function (name) {
  if (!has(WellKnownSymbolsStore, name)) {
    if (NATIVE_SYMBOL && has(_Symbol, name)) WellKnownSymbolsStore[name] = _Symbol[name];else WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
  }

  return WellKnownSymbolsStore[name];
};

/***/ }),
/* 14 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;

module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

/***/ }),
/* 15 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;

module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(4);

var hide = __webpack_require__(19);

var has = __webpack_require__(15);

var SRC = __webpack_require__(38)('src');

var $toString = __webpack_require__(227);

var TO_STRING = 'toString';
var TPL = ('' + $toString).split(TO_STRING);

__webpack_require__(9).inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));

  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  } // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative

})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(57);

var defined = __webpack_require__(29);

module.exports = function (it) {
  return IObject(defined(it));
};

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(10);

var createDesc = __webpack_require__(37);

module.exports = __webpack_require__(8) ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var fails = __webpack_require__(1);

module.exports = function (method, arg) {
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call
    arg ? method.call(null, function () {
      /* empty */
    }, 1) : method.call(null);
  });
};

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(22);

module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;

  switch (length) {
    case 1:
      return function (a) {
        return fn.call(that, a);
      };

    case 2:
      return function (a, b) {
        return fn.call(that, a, b);
      };

    case 3:
      return function (a, b, c) {
        return fn.call(that, a, b, c);
      };
  }

  return function ()
  /* ...args */
  {
    return fn.apply(that, arguments);
  };
};

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

/***/ }),
/* 23 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;

module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

var pIE = __webpack_require__(58);

var createDesc = __webpack_require__(37);

var toIObject = __webpack_require__(17);

var toPrimitive = __webpack_require__(33);

var has = __webpack_require__(15);

var IE8_DOM_DEFINE = __webpack_require__(147);

var gOPD = Object.getOwnPropertyDescriptor;
exports.f = __webpack_require__(8) ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) {
    /* empty */
  }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__(0);

var core = __webpack_require__(9);

var fails = __webpack_require__(1);

module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () {
    fn(1);
  }), 'Object', exp);
};

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx = __webpack_require__(21);

var IObject = __webpack_require__(57);

var toObject = __webpack_require__(11);

var toLength = __webpack_require__(6);

var asc = __webpack_require__(163);

module.exports = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || asc;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IObject(O);
    var f = ctx(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;

    for (; length > index; index++) {
      if (NO_HOLES || index in self) {
        val = self[index];
        res = f(val, index, O);

        if (TYPE) {
          if (IS_MAP) result[index] = res; // map
          else if (res) switch (TYPE) {
              case 3:
                return true;
              // some

              case 5:
                return val;
              // find

              case 6:
                return index;
              // findIndex

              case 2:
                result.push(val);
              // filter
            } else if (IS_EVERY) return false; // every
        }
      }
    }

    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(35);

module.exports = function (it) {
  if (!isObject(it)) {
    throw TypeError(String(it) + ' is not an object');
  }

  return it;
};

/***/ }),
/* 28 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

/***/ }),
/* 29 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

if (__webpack_require__(8)) {
  var LIBRARY = __webpack_require__(39);

  var global = __webpack_require__(4);

  var fails = __webpack_require__(1);

  var $export = __webpack_require__(0);

  var $typed = __webpack_require__(79);

  var $buffer = __webpack_require__(118);

  var ctx = __webpack_require__(21);

  var anInstance = __webpack_require__(51);

  var propertyDesc = __webpack_require__(37);

  var hide = __webpack_require__(19);

  var redefineAll = __webpack_require__(52);

  var toInteger = __webpack_require__(23);

  var toLength = __webpack_require__(6);

  var toIndex = __webpack_require__(176);

  var toAbsoluteIndex = __webpack_require__(40);

  var toPrimitive = __webpack_require__(33);

  var has = __webpack_require__(15);

  var classof = __webpack_require__(59);

  var isObject = __webpack_require__(3);

  var toObject = __webpack_require__(11);

  var isArrayIter = __webpack_require__(111);

  var create = __webpack_require__(41);

  var getPrototypeOf = __webpack_require__(43);

  var gOPN = __webpack_require__(42).f;

  var getIterFn = __webpack_require__(113);

  var uid = __webpack_require__(38);

  var wks = __webpack_require__(5);

  var createArrayMethod = __webpack_require__(26);

  var createArrayIncludes = __webpack_require__(70);

  var speciesConstructor = __webpack_require__(61);

  var ArrayIterators = __webpack_require__(166);

  var Iterators = __webpack_require__(60);

  var $iterDetect = __webpack_require__(73);

  var setSpecies = __webpack_require__(50);

  var arrayFill = __webpack_require__(114);

  var arrayCopyWithin = __webpack_require__(165);

  var $DP = __webpack_require__(10);

  var $GOPD = __webpack_require__(24);

  var dP = $DP.f;
  var gOPD = $GOPD.f;
  var RangeError = global.RangeError;
  var TypeError = global.TypeError;
  var Uint8Array = global.Uint8Array;
  var ARRAY_BUFFER = 'ArrayBuffer';
  var SHARED_BUFFER = 'Shared' + ARRAY_BUFFER;
  var BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
  var PROTOTYPE = 'prototype';
  var ArrayProto = Array[PROTOTYPE];
  var $ArrayBuffer = $buffer.ArrayBuffer;
  var $DataView = $buffer.DataView;
  var arrayForEach = createArrayMethod(0);
  var arrayFilter = createArrayMethod(2);
  var arraySome = createArrayMethod(3);
  var arrayEvery = createArrayMethod(4);
  var arrayFind = createArrayMethod(5);
  var arrayFindIndex = createArrayMethod(6);
  var arrayIncludes = createArrayIncludes(true);
  var arrayIndexOf = createArrayIncludes(false);
  var arrayValues = ArrayIterators.values;
  var arrayKeys = ArrayIterators.keys;
  var arrayEntries = ArrayIterators.entries;
  var arrayLastIndexOf = ArrayProto.lastIndexOf;
  var arrayReduce = ArrayProto.reduce;
  var arrayReduceRight = ArrayProto.reduceRight;
  var arrayJoin = ArrayProto.join;
  var arraySort = ArrayProto.sort;
  var arraySlice = ArrayProto.slice;
  var arrayToString = ArrayProto.toString;
  var arrayToLocaleString = ArrayProto.toLocaleString;
  var ITERATOR = wks('iterator');
  var TAG = wks('toStringTag');
  var TYPED_CONSTRUCTOR = uid('typed_constructor');
  var DEF_CONSTRUCTOR = uid('def_constructor');
  var ALL_CONSTRUCTORS = $typed.CONSTR;
  var TYPED_ARRAY = $typed.TYPED;
  var VIEW = $typed.VIEW;
  var WRONG_LENGTH = 'Wrong length!';
  var $map = createArrayMethod(1, function (O, length) {
    return allocate(speciesConstructor(O, O[DEF_CONSTRUCTOR]), length);
  });
  var LITTLE_ENDIAN = fails(function () {
    // eslint-disable-next-line no-undef
    return new Uint8Array(new Uint16Array([1]).buffer)[0] === 1;
  });
  var FORCED_SET = !!Uint8Array && !!Uint8Array[PROTOTYPE].set && fails(function () {
    new Uint8Array(1).set({});
  });

  var toOffset = function toOffset(it, BYTES) {
    var offset = toInteger(it);
    if (offset < 0 || offset % BYTES) throw RangeError('Wrong offset!');
    return offset;
  };

  var validate = function validate(it) {
    if (isObject(it) && TYPED_ARRAY in it) return it;
    throw TypeError(it + ' is not a typed array!');
  };

  var allocate = function allocate(C, length) {
    if (!(isObject(C) && TYPED_CONSTRUCTOR in C)) {
      throw TypeError('It is not a typed array constructor!');
    }

    return new C(length);
  };

  var speciesFromList = function speciesFromList(O, list) {
    return fromList(speciesConstructor(O, O[DEF_CONSTRUCTOR]), list);
  };

  var fromList = function fromList(C, list) {
    var index = 0;
    var length = list.length;
    var result = allocate(C, length);

    while (length > index) {
      result[index] = list[index++];
    }

    return result;
  };

  var addGetter = function addGetter(it, key, internal) {
    dP(it, key, {
      get: function get() {
        return this._d[internal];
      }
    });
  };

  var $from = function from(source
  /* , mapfn, thisArg */
  ) {
    var O = toObject(source);
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var iterFn = getIterFn(O);
    var i, length, values, result, step, iterator;

    if (iterFn != undefined && !isArrayIter(iterFn)) {
      for (iterator = iterFn.call(O), values = [], i = 0; !(step = iterator.next()).done; i++) {
        values.push(step.value);
      }

      O = values;
    }

    if (mapping && aLen > 2) mapfn = ctx(mapfn, arguments[2], 2);

    for (i = 0, length = toLength(O.length), result = allocate(this, length); length > i; i++) {
      result[i] = mapping ? mapfn(O[i], i) : O[i];
    }

    return result;
  };

  var $of = function of()
  /* ...items */
  {
    var index = 0;
    var length = arguments.length;
    var result = allocate(this, length);

    while (length > index) {
      result[index] = arguments[index++];
    }

    return result;
  }; // iOS Safari 6.x fails here


  var TO_LOCALE_BUG = !!Uint8Array && fails(function () {
    arrayToLocaleString.call(new Uint8Array(1));
  });

  var $toLocaleString = function toLocaleString() {
    return arrayToLocaleString.apply(TO_LOCALE_BUG ? arraySlice.call(validate(this)) : validate(this), arguments);
  };

  var proto = {
    copyWithin: function copyWithin(target, start
    /* , end */
    ) {
      return arrayCopyWithin.call(validate(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
    },
    every: function every(callbackfn
    /* , thisArg */
    ) {
      return arrayEvery(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    fill: function fill(value
    /* , start, end */
    ) {
      // eslint-disable-line no-unused-vars
      return arrayFill.apply(validate(this), arguments);
    },
    filter: function filter(callbackfn
    /* , thisArg */
    ) {
      return speciesFromList(this, arrayFilter(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined));
    },
    find: function find(predicate
    /* , thisArg */
    ) {
      return arrayFind(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    findIndex: function findIndex(predicate
    /* , thisArg */
    ) {
      return arrayFindIndex(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    forEach: function forEach(callbackfn
    /* , thisArg */
    ) {
      arrayForEach(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    indexOf: function indexOf(searchElement
    /* , fromIndex */
    ) {
      return arrayIndexOf(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    includes: function includes(searchElement
    /* , fromIndex */
    ) {
      return arrayIncludes(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    join: function join(separator) {
      // eslint-disable-line no-unused-vars
      return arrayJoin.apply(validate(this), arguments);
    },
    lastIndexOf: function lastIndexOf(searchElement
    /* , fromIndex */
    ) {
      // eslint-disable-line no-unused-vars
      return arrayLastIndexOf.apply(validate(this), arguments);
    },
    map: function map(mapfn
    /* , thisArg */
    ) {
      return $map(validate(this), mapfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    reduce: function reduce(callbackfn
    /* , initialValue */
    ) {
      // eslint-disable-line no-unused-vars
      return arrayReduce.apply(validate(this), arguments);
    },
    reduceRight: function reduceRight(callbackfn
    /* , initialValue */
    ) {
      // eslint-disable-line no-unused-vars
      return arrayReduceRight.apply(validate(this), arguments);
    },
    reverse: function reverse() {
      var that = this;
      var length = validate(that).length;
      var middle = Math.floor(length / 2);
      var index = 0;
      var value;

      while (index < middle) {
        value = that[index];
        that[index++] = that[--length];
        that[length] = value;
      }

      return that;
    },
    some: function some(callbackfn
    /* , thisArg */
    ) {
      return arraySome(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    sort: function sort(comparefn) {
      return arraySort.call(validate(this), comparefn);
    },
    subarray: function subarray(begin, end) {
      var O = validate(this);
      var length = O.length;
      var $begin = toAbsoluteIndex(begin, length);
      return new (speciesConstructor(O, O[DEF_CONSTRUCTOR]))(O.buffer, O.byteOffset + $begin * O.BYTES_PER_ELEMENT, toLength((end === undefined ? length : toAbsoluteIndex(end, length)) - $begin));
    }
  };

  var $slice = function slice(start, end) {
    return speciesFromList(this, arraySlice.call(validate(this), start, end));
  };

  var $set = function set(arrayLike
  /* , offset */
  ) {
    validate(this);
    var offset = toOffset(arguments[1], 1);
    var length = this.length;
    var src = toObject(arrayLike);
    var len = toLength(src.length);
    var index = 0;
    if (len + offset > length) throw RangeError(WRONG_LENGTH);

    while (index < len) {
      this[offset + index] = src[index++];
    }
  };

  var $iterators = {
    entries: function entries() {
      return arrayEntries.call(validate(this));
    },
    keys: function keys() {
      return arrayKeys.call(validate(this));
    },
    values: function values() {
      return arrayValues.call(validate(this));
    }
  };

  var isTAIndex = function isTAIndex(target, key) {
    return isObject(target) && target[TYPED_ARRAY] && _typeof(key) != 'symbol' && key in target && String(+key) == String(key);
  };

  var $getDesc = function getOwnPropertyDescriptor(target, key) {
    return isTAIndex(target, key = toPrimitive(key, true)) ? propertyDesc(2, target[key]) : gOPD(target, key);
  };

  var $setDesc = function defineProperty(target, key, desc) {
    if (isTAIndex(target, key = toPrimitive(key, true)) && isObject(desc) && has(desc, 'value') && !has(desc, 'get') && !has(desc, 'set') // TODO: add validation descriptor w/o calling accessors
    && !desc.configurable && (!has(desc, 'writable') || desc.writable) && (!has(desc, 'enumerable') || desc.enumerable)) {
      target[key] = desc.value;
      return target;
    }

    return dP(target, key, desc);
  };

  if (!ALL_CONSTRUCTORS) {
    $GOPD.f = $getDesc;
    $DP.f = $setDesc;
  }

  $export($export.S + $export.F * !ALL_CONSTRUCTORS, 'Object', {
    getOwnPropertyDescriptor: $getDesc,
    defineProperty: $setDesc
  });

  if (fails(function () {
    arrayToString.call({});
  })) {
    arrayToString = arrayToLocaleString = function toString() {
      return arrayJoin.call(this);
    };
  }

  var $TypedArrayPrototype$ = redefineAll({}, proto);
  redefineAll($TypedArrayPrototype$, $iterators);
  hide($TypedArrayPrototype$, ITERATOR, $iterators.values);
  redefineAll($TypedArrayPrototype$, {
    slice: $slice,
    set: $set,
    constructor: function constructor() {
      /* noop */
    },
    toString: arrayToString,
    toLocaleString: $toLocaleString
  });
  addGetter($TypedArrayPrototype$, 'buffer', 'b');
  addGetter($TypedArrayPrototype$, 'byteOffset', 'o');
  addGetter($TypedArrayPrototype$, 'byteLength', 'l');
  addGetter($TypedArrayPrototype$, 'length', 'e');
  dP($TypedArrayPrototype$, TAG, {
    get: function get() {
      return this[TYPED_ARRAY];
    }
  }); // eslint-disable-next-line max-statements

  module.exports = function (KEY, BYTES, wrapper, CLAMPED) {
    CLAMPED = !!CLAMPED;
    var NAME = KEY + (CLAMPED ? 'Clamped' : '') + 'Array';
    var GETTER = 'get' + KEY;
    var SETTER = 'set' + KEY;
    var TypedArray = global[NAME];
    var Base = TypedArray || {};
    var TAC = TypedArray && getPrototypeOf(TypedArray);
    var FORCED = !TypedArray || !$typed.ABV;
    var O = {};
    var TypedArrayPrototype = TypedArray && TypedArray[PROTOTYPE];

    var getter = function getter(that, index) {
      var data = that._d;
      return data.v[GETTER](index * BYTES + data.o, LITTLE_ENDIAN);
    };

    var setter = function setter(that, index, value) {
      var data = that._d;
      if (CLAMPED) value = (value = Math.round(value)) < 0 ? 0 : value > 0xff ? 0xff : value & 0xff;
      data.v[SETTER](index * BYTES + data.o, value, LITTLE_ENDIAN);
    };

    var addElement = function addElement(that, index) {
      dP(that, index, {
        get: function get() {
          return getter(this, index);
        },
        set: function set(value) {
          return setter(this, index, value);
        },
        enumerable: true
      });
    };

    if (FORCED) {
      TypedArray = wrapper(function (that, data, $offset, $length) {
        anInstance(that, TypedArray, NAME, '_d');
        var index = 0;
        var offset = 0;
        var buffer, byteLength, length, klass;

        if (!isObject(data)) {
          length = toIndex(data);
          byteLength = length * BYTES;
          buffer = new $ArrayBuffer(byteLength);
        } else if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
          buffer = data;
          offset = toOffset($offset, BYTES);
          var $len = data.byteLength;

          if ($length === undefined) {
            if ($len % BYTES) throw RangeError(WRONG_LENGTH);
            byteLength = $len - offset;
            if (byteLength < 0) throw RangeError(WRONG_LENGTH);
          } else {
            byteLength = toLength($length) * BYTES;
            if (byteLength + offset > $len) throw RangeError(WRONG_LENGTH);
          }

          length = byteLength / BYTES;
        } else if (TYPED_ARRAY in data) {
          return fromList(TypedArray, data);
        } else {
          return $from.call(TypedArray, data);
        }

        hide(that, '_d', {
          b: buffer,
          o: offset,
          l: byteLength,
          e: length,
          v: new $DataView(buffer)
        });

        while (index < length) {
          addElement(that, index++);
        }
      });
      TypedArrayPrototype = TypedArray[PROTOTYPE] = create($TypedArrayPrototype$);
      hide(TypedArrayPrototype, 'constructor', TypedArray);
    } else if (!fails(function () {
      TypedArray(1);
    }) || !fails(function () {
      new TypedArray(-1); // eslint-disable-line no-new
    }) || !$iterDetect(function (iter) {
      new TypedArray(); // eslint-disable-line no-new

      new TypedArray(null); // eslint-disable-line no-new

      new TypedArray(1.5); // eslint-disable-line no-new

      new TypedArray(iter); // eslint-disable-line no-new
    }, true)) {
      TypedArray = wrapper(function (that, data, $offset, $length) {
        anInstance(that, TypedArray, NAME);
        var klass; // `ws` module bug, temporarily remove validation length for Uint8Array
        // https://github.com/websockets/ws/pull/645

        if (!isObject(data)) return new Base(toIndex(data));

        if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
          return $length !== undefined ? new Base(data, toOffset($offset, BYTES), $length) : $offset !== undefined ? new Base(data, toOffset($offset, BYTES)) : new Base(data);
        }

        if (TYPED_ARRAY in data) return fromList(TypedArray, data);
        return $from.call(TypedArray, data);
      });
      arrayForEach(TAC !== Function.prototype ? gOPN(Base).concat(gOPN(TAC)) : gOPN(Base), function (key) {
        if (!(key in TypedArray)) hide(TypedArray, key, Base[key]);
      });
      TypedArray[PROTOTYPE] = TypedArrayPrototype;
      if (!LIBRARY) TypedArrayPrototype.constructor = TypedArray;
    }

    var $nativeIterator = TypedArrayPrototype[ITERATOR];
    var CORRECT_ITER_NAME = !!$nativeIterator && ($nativeIterator.name == 'values' || $nativeIterator.name == undefined);
    var $iterator = $iterators.values;
    hide(TypedArray, TYPED_CONSTRUCTOR, true);
    hide(TypedArrayPrototype, TYPED_ARRAY, NAME);
    hide(TypedArrayPrototype, VIEW, true);
    hide(TypedArrayPrototype, DEF_CONSTRUCTOR, TypedArray);

    if (CLAMPED ? new TypedArray(1)[TAG] != NAME : !(TAG in TypedArrayPrototype)) {
      dP(TypedArrayPrototype, TAG, {
        get: function get() {
          return NAME;
        }
      });
    }

    O[NAME] = TypedArray;
    $export($export.G + $export.W + $export.F * (TypedArray != Base), O);
    $export($export.S, NAME, {
      BYTES_PER_ELEMENT: BYTES
    });
    $export($export.S + $export.F * fails(function () {
      Base.of.call(TypedArray, 1);
    }), NAME, {
      from: $from,
      of: $of
    });
    if (!(BYTES_PER_ELEMENT in TypedArrayPrototype)) hide(TypedArrayPrototype, BYTES_PER_ELEMENT, BYTES);
    $export($export.P, NAME, proto);
    setSpecies(NAME);
    $export($export.P + $export.F * FORCED_SET, NAME, {
      set: $set
    });
    $export($export.P + $export.F * !CORRECT_ITER_NAME, NAME, $iterators);
    if (!LIBRARY && TypedArrayPrototype.toString != arrayToString) TypedArrayPrototype.toString = arrayToString;
    $export($export.P + $export.F * fails(function () {
      new TypedArray(1).slice();
    }), NAME, {
      slice: $slice
    });
    $export($export.P + $export.F * (fails(function () {
      return [1, 2].toLocaleString() != new TypedArray([1, 2]).toLocaleString();
    }) || !fails(function () {
      TypedArrayPrototype.toLocaleString.call([1, 2]);
    })), NAME, {
      toLocaleString: $toLocaleString
    });
    Iterators[NAME] = CORRECT_ITER_NAME ? $nativeIterator : $iterator;
    if (!LIBRARY && !CORRECT_ITER_NAME) hide(TypedArrayPrototype, ITERATOR, $iterator);
  };
} else module.exports = function () {
  /* empty */
};

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(32);

var definePropertyModule = __webpack_require__(46);

var createPropertyDescriptor = __webpack_require__(53);

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(18); // Thank's IE8 for his funny defineProperty


module.exports = !fails(function () {
  return Object.defineProperty({}, 1, {
    get: function get() {
      return 7;
    }
  })[1] != 7;
});

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(3); // instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string


module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var META = __webpack_require__(38)('meta');

var isObject = __webpack_require__(3);

var has = __webpack_require__(15);

var setDesc = __webpack_require__(10).f;

var id = 0;

var isExtensible = Object.isExtensible || function () {
  return true;
};

var FREEZE = !__webpack_require__(1)(function () {
  return isExtensible(Object.preventExtensions({}));
});

var setMeta = function setMeta(it) {
  setDesc(it, META, {
    value: {
      i: 'O' + ++id,
      // object ID
      w: {} // weak collections IDs

    }
  });
};

var fastKey = function fastKey(it, create) {
  // return primitive with prefix
  if (!isObject(it)) return _typeof(it) == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;

  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F'; // not necessary to add metadata

    if (!create) return 'E'; // add missing metadata

    setMeta(it); // return object ID
  }

  return it[META].i;
};

var getWeak = function getWeak(it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true; // not necessary to add metadata

    if (!create) return false; // add missing metadata

    setMeta(it); // return hash weak collections IDs
  }

  return it[META].w;
}; // add metadata on freeze-family methods calling


var onFreeze = function onFreeze(it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};

var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};

/***/ }),
/* 35 */
/***/ (function(module, exports) {

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

module.exports = function (it) {
  return _typeof(it) === 'object' ? it !== null : typeof it === 'function';
};

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var global = __webpack_require__(7);

var getOwnPropertyDescriptor = __webpack_require__(92).f;

var createNonEnumerableProperty = __webpack_require__(31);

var redefine = __webpack_require__(56);

var setGlobal = __webpack_require__(85);

var copyConstructorProperties = __webpack_require__(201);

var isForced = __webpack_require__(204);
/*
  options.target      - name of the target object
  options.global      - target is the global object
  options.stat        - export as static methods of target
  options.proto       - export as prototype methods of target
  options.real        - real prototype method for the `pure` version
  options.forced      - export even if the native feature is available
  options.bind        - bind methods to the target, required for the `pure` version
  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
  options.sham        - add a flag to not completely full polyfills
  options.enumerable  - export as enumerable property
  options.noTargetGet - prevent calling a getter on target
*/


module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;

  if (GLOBAL) {
    target = global;
  } else if (STATIC) {
    target = global[TARGET] || setGlobal(TARGET, {});
  } else {
    target = (global[TARGET] || {}).prototype;
  }

  if (target) for (key in source) {
    sourceProperty = source[key];

    if (options.noTargetGet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];

    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced); // contained in target

    if (!FORCED && targetProperty !== undefined) {
      if (_typeof(sourceProperty) === _typeof(targetProperty)) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    } // add a flag to not completely full polyfills


    if (options.sham || targetProperty && targetProperty.sham) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    } // extend global


    redefine(target, key, sourceProperty, options);
  }
};

/***/ }),
/* 37 */
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

/***/ }),
/* 38 */
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();

module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

/***/ }),
/* 39 */
/***/ (function(module, exports) {

module.exports = false;

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(23);

var max = Math.max;
var min = Math.min;

module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__(2);

var dPs = __webpack_require__(150);

var enumBugKeys = __webpack_require__(98);

var IE_PROTO = __webpack_require__(97)('IE_PROTO');

var Empty = function Empty() {
  /* empty */
};

var PROTOTYPE = 'prototype'; // Create object with fake `null` prototype: use iframe Object with cleared prototype

var _createDict = function createDict() {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(95)('iframe');

  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';

  __webpack_require__(99).appendChild(iframe);

  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);

  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  _createDict = iframeDocument.F;

  while (i--) {
    delete _createDict[PROTOTYPE][enumBugKeys[i]];
  }

  return _createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;

  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null; // add "__proto__" for Object.getPrototypeOf polyfill

    result[IE_PROTO] = O;
  } else result = _createDict();

  return Properties === undefined ? result : dPs(result, Properties);
};

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = __webpack_require__(149);

var hiddenKeys = __webpack_require__(98).concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__(15);

var toObject = __webpack_require__(11);

var IE_PROTO = __webpack_require__(97)('IE_PROTO');

var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];

  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  }

  return O instanceof Object ? ObjectProto : null;
};

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = __webpack_require__(5)('unscopables');

var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) __webpack_require__(19)(ArrayProto, UNSCOPABLES, {});

module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(3);

module.exports = function (it, TYPE) {
  if (!isObject(it) || it._t !== TYPE) throw TypeError('Incompatible receiver, ' + TYPE + ' required!');
  return it;
};

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(32);

var IE8_DOM_DEFINE = __webpack_require__(124);

var anObject = __webpack_require__(27);

var toPrimitive = __webpack_require__(87);

var nativeDefineProperty = Object.defineProperty; // `Object.defineProperty` method
// https://tc39.github.io/ecma262/#sec-object.defineproperty

exports.f = DESCRIPTORS ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return nativeDefineProperty(O, P, Attributes);
  } catch (error) {
    /* empty */
  }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(10).f;

var has = __webpack_require__(15);

var TAG = __webpack_require__(5)('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, {
    configurable: true,
    value: tag
  });
};

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__(149);

var enumBugKeys = __webpack_require__(98);

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);

var defined = __webpack_require__(29);

var fails = __webpack_require__(1);

var spaces = __webpack_require__(101);

var space = '[' + spaces + ']';
var non = "\u200B\x85";
var ltrim = RegExp('^' + space + space + '*');
var rtrim = RegExp(space + space + '*$');

var exporter = function exporter(KEY, exec, ALIAS) {
  var exp = {};
  var FORCE = fails(function () {
    return !!spaces[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
  if (ALIAS) exp[ALIAS] = fn;
  $export($export.P + $export.F * FORCE, 'String', exp);
}; // 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim


var trim = exporter.trim = function (string, TYPE) {
  string = String(defined(string));
  if (TYPE & 1) string = string.replace(ltrim, '');
  if (TYPE & 2) string = string.replace(rtrim, '');
  return string;
};

module.exports = exporter;

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var global = __webpack_require__(4);

var dP = __webpack_require__(10);

var DESCRIPTORS = __webpack_require__(8);

var SPECIES = __webpack_require__(5)('species');

module.exports = function (KEY) {
  var C = global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function get() {
      return this;
    }
  });
};

/***/ }),
/* 51 */
/***/ (function(module, exports) {

module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || forbiddenField !== undefined && forbiddenField in it) {
    throw TypeError(name + ': incorrect invocation!');
  }

  return it;
};

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

var redefine = __webpack_require__(16);

module.exports = function (target, src, safe) {
  for (var key in src) {
    redefine(target, key, src[key], safe);
  }

  return target;
};

/***/ }),
/* 53 */
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

/***/ }),
/* 54 */
/***/ (function(module, exports) {

module.exports = {};

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

var NATIVE_WEAK_MAP = __webpack_require__(200);

var global = __webpack_require__(7);

var isObject = __webpack_require__(35);

var createNonEnumerableProperty = __webpack_require__(31);

var objectHas = __webpack_require__(14);

var shared = __webpack_require__(84);

var sharedKey = __webpack_require__(91);

var hiddenKeys = __webpack_require__(89);

var WeakMap = global.WeakMap;
var set, get, has;

var enforce = function enforce(it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function getterFor(TYPE) {
  return function (it) {
    var state;

    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    }

    return state;
  };
};

if (NATIVE_WEAK_MAP) {
  var store = shared.state || (shared.state = new WeakMap());
  var wmget = store.get;
  var wmhas = store.has;
  var wmset = store.set;

  set = function set(it, metadata) {
    metadata.facade = it;
    wmset.call(store, it, metadata);
    return metadata;
  };

  get = function get(it) {
    return wmget.call(store, it) || {};
  };

  has = function has(it) {
    return wmhas.call(store, it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;

  set = function set(it, metadata) {
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };

  get = function get(it) {
    return objectHas(it, STATE) ? it[STATE] : {};
  };

  has = function has(it) {
    return objectHas(it, STATE);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(7);

var createNonEnumerableProperty = __webpack_require__(31);

var has = __webpack_require__(14);

var setGlobal = __webpack_require__(85);

var inspectSource = __webpack_require__(132);

var InternalStateModule = __webpack_require__(55);

var getInternalState = InternalStateModule.get;
var enforceInternalState = InternalStateModule.enforce;
var TEMPLATE = String(String).split('String');
(module.exports = function (O, key, value, options) {
  var unsafe = options ? !!options.unsafe : false;
  var simple = options ? !!options.enumerable : false;
  var noTargetGet = options ? !!options.noTargetGet : false;
  var state;

  if (typeof value == 'function') {
    if (typeof key == 'string' && !has(value, 'name')) {
      createNonEnumerableProperty(value, 'name', key);
    }

    state = enforceInternalState(value);

    if (!state.source) {
      state.source = TEMPLATE.join(typeof key == 'string' ? key : '');
    }
  }

  if (O === global) {
    if (simple) O[key] = value;else setGlobal(key, value);
    return;
  } else if (!unsafe) {
    delete O[key];
  } else if (!noTargetGet && O[key]) {
    simple = true;
  }

  if (simple) O[key] = value;else createNonEnumerableProperty(O, key, value); // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, 'toString', function toString() {
  return typeof this == 'function' && getInternalState(this).source || inspectSource(this);
});

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(28); // eslint-disable-next-line no-prototype-builtins


module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};

/***/ }),
/* 58 */
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(28);

var TAG = __webpack_require__(5)('toStringTag'); // ES3 wrong here


var ARG = cof(function () {
  return arguments;
}()) == 'Arguments'; // fallback for IE11 Script Access Denied error

var tryGet = function tryGet(it, key) {
  try {
    return it[key];
  } catch (e) {
    /* empty */
  }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null' // @@toStringTag case
  : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T // builtinTag case
  : ARG ? cof(O) // ES3 arguments fallback
  : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

/***/ }),
/* 60 */
/***/ (function(module, exports) {

module.exports = {};

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = __webpack_require__(2);

var aFunction = __webpack_require__(22);

var SPECIES = __webpack_require__(5)('species');

module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

var aFunction = __webpack_require__(189); // optional / simple context binding


module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;

  switch (length) {
    case 0:
      return function () {
        return fn.call(that);
      };

    case 1:
      return function (a) {
        return fn.call(that, a);
      };

    case 2:
      return function (a, b) {
        return fn.call(that, a, b);
      };

    case 3:
      return function (a, b, c) {
        return fn.call(that, a, b, c);
      };
  }

  return function ()
  /* ...args */
  {
    return fn.apply(that, arguments);
  };
};

/***/ }),
/* 63 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

var requireObjectCoercible = __webpack_require__(81); // `ToObject` abstract operation
// https://tc39.github.io/ecma262/#sec-toobject


module.exports = function (argument) {
  return Object(requireObjectCoercible(argument));
};

/***/ }),
/* 65 */
/***/ (function(module, exports) {

module.exports = false;

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

// toObject with fallback for non-array-like ES3 strings
var IndexedObject = __webpack_require__(80);

var requireObjectCoercible = __webpack_require__(81);

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

var path = __webpack_require__(199);

var global = __webpack_require__(7);

var aFunction = function aFunction(variable) {
  return typeof variable == 'function' ? variable : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global[namespace]) : path[namespace] && path[namespace][method] || global[namespace] && global[namespace][method];
};

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

var defineProperty = __webpack_require__(46).f;

var has = __webpack_require__(14);

var wellKnownSymbol = __webpack_require__(13);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');

module.exports = function (it, TAG, STATIC) {
  if (it && !has(it = STATIC ? it : it.prototype, TO_STRING_TAG)) {
    defineProperty(it, TO_STRING_TAG, {
      configurable: true,
      value: TAG
    });
  }
};

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__(9);

var global = __webpack_require__(4);

var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});
(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__(39) ? 'pure' : 'global',
  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
});

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(17);

var toLength = __webpack_require__(6);

var toAbsoluteIndex = __webpack_require__(40);

module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value; // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare

    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++]; // eslint-disable-next-line no-self-compare

      if (value != value) return true; // Array#indexOf ignores holes, Array#includes - not
    } else for (; length > index; index++) {
      if (IS_INCLUDES || index in O) {
        if (O[index] === el) return IS_INCLUDES || index || 0;
      }
    }
    return !IS_INCLUDES && -1;
  };
};

/***/ }),
/* 71 */
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__(28);

module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR = __webpack_require__(5)('iterator');

var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();

  riter['return'] = function () {
    SAFE_CLOSING = true;
  }; // eslint-disable-next-line no-throw-literal


  Array.from(riter, function () {
    throw 2;
  });
} catch (e) {
  /* empty */
}

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;

  try {
    var arr = [7];
    var iter = arr[ITERATOR]();

    iter.next = function () {
      return {
        done: safe = true
      };
    };

    arr[ITERATOR] = function () {
      return iter;
    };

    exec(arr);
  } catch (e) {
    /* empty */
  }

  return safe;
};

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 // 21.2.5.3 get RegExp.prototype.flags

var anObject = __webpack_require__(2);

module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var classof = __webpack_require__(59);

var builtinExec = RegExp.prototype.exec; // `RegExpExec` abstract operation
// https://tc39.github.io/ecma262/#sec-regexpexec

module.exports = function (R, S) {
  var exec = R.exec;

  if (typeof exec === 'function') {
    var result = exec.call(R, S);

    if (_typeof(result) !== 'object') {
      throw new TypeError('RegExp exec method returned something other than an Object or null');
    }

    return result;
  }

  if (classof(R) !== 'RegExp') {
    throw new TypeError('RegExp#exec called on incompatible receiver');
  }

  return builtinExec.call(R, S);
};

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(168);

var redefine = __webpack_require__(16);

var hide = __webpack_require__(19);

var fails = __webpack_require__(1);

var defined = __webpack_require__(29);

var wks = __webpack_require__(5);

var regexpExec = __webpack_require__(115);

var SPECIES = wks('species');
var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  // #replace needs built-in support for named groups.
  // #match works fine because it just return the exec results, even if it has
  // a "grops" property.
  var re = /./;

  re.exec = function () {
    var result = [];
    result.groups = {
      a: '7'
    };
    return result;
  };

  return ''.replace(re, '$<a>') !== '7';
});

var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = function () {
  // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
  var re = /(?:)/;
  var originalExec = re.exec;

  re.exec = function () {
    return originalExec.apply(this, arguments);
  };

  var result = 'ab'.split(re);
  return result.length === 2 && result[0] === 'a' && result[1] === 'b';
}();

module.exports = function (KEY, length, exec) {
  var SYMBOL = wks(KEY);
  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};

    O[SYMBOL] = function () {
      return 7;
    };

    return ''[KEY](O) != 7;
  });
  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL ? !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;

    re.exec = function () {
      execCalled = true;
      return null;
    };

    if (KEY === 'split') {
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};

      re.constructor[SPECIES] = function () {
        return re;
      };
    }

    re[SYMBOL]('');
    return !execCalled;
  }) : undefined;

  if (!DELEGATES_TO_SYMBOL || !DELEGATES_TO_EXEC || KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS || KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC) {
    var nativeRegExpMethod = /./[SYMBOL];
    var fns = exec(defined, SYMBOL, ''[KEY], function maybeCallNative(nativeMethod, regexp, str, arg2, forceStringMethod) {
      if (regexp.exec === regexpExec) {
        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
          // The native String method already delegates to @@method (this
          // polyfilled function), leasing to infinite recursion.
          // We avoid it by directly calling the native @@method method.
          return {
            done: true,
            value: nativeRegExpMethod.call(regexp, str, arg2)
          };
        }

        return {
          done: true,
          value: nativeMethod.call(str, regexp, arg2)
        };
      }

      return {
        done: false
      };
    });
    var strfn = fns[0];
    var rxfn = fns[1];
    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2 // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
    // 21.2.5.11 RegExp.prototype[@@split](string, limit)
    ? function (string, arg) {
      return rxfn.call(string, this, arg);
    } // 21.2.5.6 RegExp.prototype[@@match](string)
    // 21.2.5.9 RegExp.prototype[@@search](string)
    : function (string) {
      return rxfn.call(string, this);
    });
  }
};

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__(21);

var call = __webpack_require__(162);

var isArrayIter = __webpack_require__(111);

var anObject = __webpack_require__(2);

var toLength = __webpack_require__(6);

var getIterFn = __webpack_require__(113);

var BREAK = {};
var RETURN = {};

var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () {
    return iterable;
  } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!'); // fast case for arrays with default iterator

  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};

exports.BREAK = BREAK;
exports.RETURN = RETURN;

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var global = __webpack_require__(4);

var $export = __webpack_require__(0);

var redefine = __webpack_require__(16);

var redefineAll = __webpack_require__(52);

var meta = __webpack_require__(34);

var forOf = __webpack_require__(77);

var anInstance = __webpack_require__(51);

var isObject = __webpack_require__(3);

var fails = __webpack_require__(1);

var $iterDetect = __webpack_require__(73);

var setToStringTag = __webpack_require__(47);

var inheritIfRequired = __webpack_require__(102);

module.exports = function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
  var Base = global[NAME];
  var C = Base;
  var ADDER = IS_MAP ? 'set' : 'add';
  var proto = C && C.prototype;
  var O = {};

  var fixMethod = function fixMethod(KEY) {
    var fn = proto[KEY];
    redefine(proto, KEY, KEY == 'delete' ? function (a) {
      return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
    } : KEY == 'has' ? function has(a) {
      return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
    } : KEY == 'get' ? function get(a) {
      return IS_WEAK && !isObject(a) ? undefined : fn.call(this, a === 0 ? 0 : a);
    } : KEY == 'add' ? function add(a) {
      fn.call(this, a === 0 ? 0 : a);
      return this;
    } : function set(a, b) {
      fn.call(this, a === 0 ? 0 : a, b);
      return this;
    });
  };

  if (typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function () {
    new C().entries().next();
  }))) {
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
    meta.NEED = true;
  } else {
    var instance = new C(); // early implementations not supports chaining

    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance; // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false

    var THROWS_ON_PRIMITIVES = fails(function () {
      instance.has(1);
    }); // most early implementations doesn't supports iterables, most modern - not close it correctly

    var ACCEPT_ITERABLES = $iterDetect(function (iter) {
      new C(iter);
    }); // eslint-disable-line no-new
    // for early implementations -0 and +0 not the same

    var BUGGY_ZERO = !IS_WEAK && fails(function () {
      // V8 ~ Chromium 42- fails only with 5+ elements
      var $instance = new C();
      var index = 5;

      while (index--) {
        $instance[ADDER](index, index);
      }

      return !$instance.has(-0);
    });

    if (!ACCEPT_ITERABLES) {
      C = wrapper(function (target, iterable) {
        anInstance(target, C, NAME);
        var that = inheritIfRequired(new Base(), target, C);
        if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
        return that;
      });
      C.prototype = proto;
      proto.constructor = C;
    }

    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }

    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER); // weak collections should not contains .clear method

    if (IS_WEAK && proto.clear) delete proto.clear;
  }

  setToStringTag(C, NAME);
  O[NAME] = C;
  $export($export.G + $export.W + $export.F * (C != Base), O);
  if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);
  return C;
};

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(4);

var hide = __webpack_require__(19);

var uid = __webpack_require__(38);

var TYPED = uid('typed_array');
var VIEW = uid('view');
var ABV = !!(global.ArrayBuffer && global.DataView);
var CONSTR = ABV;
var i = 0;
var l = 9;
var Typed;
var TypedArrayConstructors = 'Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array'.split(',');

while (i < l) {
  if (Typed = global[TypedArrayConstructors[i++]]) {
    hide(Typed.prototype, TYPED, true);
    hide(Typed.prototype, VIEW, true);
  } else CONSTR = false;
}

module.exports = {
  ABV: ABV,
  CONSTR: CONSTR,
  TYPED: TYPED,
  VIEW: VIEW
};

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(18);

var classof = __webpack_require__(63);

var split = ''.split; // fallback for non-array-like ES3 and non-enumerable old V8 strings

module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins
  return !Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) == 'String' ? split.call(it, '') : Object(it);
} : Object;

/***/ }),
/* 81 */
/***/ (function(module, exports) {

// `RequireObjectCoercible` abstract operation
// https://tc39.github.io/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on " + it);
  return it;
};

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(83);

var min = Math.min; // `ToLength` abstract operation
// https://tc39.github.io/ecma262/#sec-tolength

module.exports = function (argument) {
  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};

/***/ }),
/* 83 */
/***/ (function(module, exports) {

var ceil = Math.ceil;
var floor = Math.floor; // `ToInteger` abstract operation
// https://tc39.github.io/ecma262/#sec-tointeger

module.exports = function (argument) {
  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
};

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(7);

var setGlobal = __webpack_require__(85);

var SHARED = '__core-js_shared__';
var store = global[SHARED] || setGlobal(SHARED, {});
module.exports = store;

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(7);

var createNonEnumerableProperty = __webpack_require__(31);

module.exports = function (key, value) {
  try {
    createNonEnumerableProperty(global, key, value);
  } catch (error) {
    global[key] = value;
  }

  return value;
};

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(7);

var isObject = __webpack_require__(35);

var document = global.document; // typeof document.createElement is 'object' in old IE

var EXISTS = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(35); // `ToPrimitive` abstract operation
// https://tc39.github.io/ecma262/#sec-toprimitive
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string


module.exports = function (input, PREFERRED_STRING) {
  if (!isObject(input)) return input;
  var fn, val;
  if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
  if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
  throw TypeError("Can't convert object to primitive value");
};

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(27);

var defineProperties = __webpack_require__(128);

var enumBugKeys = __webpack_require__(90);

var hiddenKeys = __webpack_require__(89);

var html = __webpack_require__(131);

var documentCreateElement = __webpack_require__(86);

var sharedKey = __webpack_require__(91);

var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO = sharedKey('IE_PROTO');

var EmptyConstructor = function EmptyConstructor() {
  /* empty */
};

var scriptTag = function scriptTag(content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
}; // Create object with fake `null` prototype: use ActiveX Object with cleared prototype


var NullProtoObjectViaActiveX = function NullProtoObjectViaActiveX(activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  activeXDocument = null; // avoid memory leak

  return temp;
}; // Create object with fake `null` prototype: use iframe Object with cleared prototype


var NullProtoObjectViaIFrame = function NullProtoObjectViaIFrame() {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe); // https://github.com/zloirock/core-js/issues/475

  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
}; // Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug


var activeXDocument;

var _NullProtoObject = function NullProtoObject() {
  try {
    /* global ActiveXObject */
    activeXDocument = document.domain && new ActiveXObject('htmlfile');
  } catch (error) {
    /* ignore */
  }

  _NullProtoObject = activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame();
  var length = enumBugKeys.length;

  while (length--) {
    delete _NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  }

  return _NullProtoObject();
};

hiddenKeys[IE_PROTO] = true; // `Object.create` method
// https://tc39.github.io/ecma262/#sec-object.create

module.exports = Object.create || function create(O, Properties) {
  var result;

  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null; // add "__proto__" for Object.getPrototypeOf polyfill

    result[IE_PROTO] = O;
  } else result = _NullProtoObject();

  return Properties === undefined ? result : defineProperties(result, Properties);
};

/***/ }),
/* 89 */
/***/ (function(module, exports) {

module.exports = {};

/***/ }),
/* 90 */
/***/ (function(module, exports) {

// IE8- don't enum bug keys
module.exports = ['constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf'];

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(123);

var uid = __webpack_require__(125);

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(32);

var propertyIsEnumerableModule = __webpack_require__(134);

var createPropertyDescriptor = __webpack_require__(53);

var toIndexedObject = __webpack_require__(66);

var toPrimitive = __webpack_require__(87);

var has = __webpack_require__(14);

var IE8_DOM_DEFINE = __webpack_require__(124);

var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor; // `Object.getOwnPropertyDescriptor` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor

exports.f = DESCRIPTORS ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return nativeGetOwnPropertyDescriptor(O, P);
  } catch (error) {
    /* empty */
  }
  if (has(O, P)) return createPropertyDescriptor(!propertyIsEnumerableModule.f.call(O, P), O[P]);
};

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(63);

var global = __webpack_require__(7);

module.exports = classof(global.process) == 'process';

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(145);

var Iterators = __webpack_require__(54);

var wellKnownSymbol = __webpack_require__(13);

var ITERATOR = wellKnownSymbol('iterator');

module.exports = function (it) {
  if (it != undefined) return it[ITERATOR] || it['@@iterator'] || Iterators[classof(it)];
};

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(3);

var document = __webpack_require__(4).document; // typeof document.createElement is 'object' in old IE


var is = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

exports.f = __webpack_require__(5);

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(69)('keys');

var uid = __webpack_require__(38);

module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};

/***/ }),
/* 98 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = 'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'.split(',');

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__(4).document;

module.exports = document && document.documentElement;

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

// Works with __proto__ only. Old v8 can't work with null proto objects.

/* eslint-disable no-proto */
var isObject = __webpack_require__(3);

var anObject = __webpack_require__(2);

var check = function check(O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};

module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
  function (test, buggy, set) {
    try {
      set = __webpack_require__(21)(Function.call, __webpack_require__(24).f(Object.prototype, '__proto__').set, 2);
      set(test, []);
      buggy = !(test instanceof Array);
    } catch (e) {
      buggy = true;
    }

    return function setPrototypeOf(O, proto) {
      check(O, proto);
      if (buggy) O.__proto__ = proto;else set(O, proto);
      return O;
    };
  }({}, false) : undefined),
  check: check
};

/***/ }),
/* 101 */
/***/ (function(module, exports) {

module.exports = "\t\n\x0B\f\r \xA0\u1680\u180E\u2000\u2001\u2002\u2003" + "\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF";

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(3);

var setPrototypeOf = __webpack_require__(100).set;

module.exports = function (that, target, C) {
  var S = target.constructor;
  var P;

  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {
    setPrototypeOf(that, P);
  }

  return that;
};

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var toInteger = __webpack_require__(23);

var defined = __webpack_require__(29);

module.exports = function repeat(count) {
  var str = String(defined(this));
  var res = '';
  var n = toInteger(count);
  if (n < 0 || n == Infinity) throw RangeError("Count can't be negative");

  for (; n > 0; (n >>>= 1) && (str += str)) {
    if (n & 1) res += str;
  }

  return res;
};

/***/ }),
/* 104 */
/***/ (function(module, exports) {

// 20.2.2.28 Math.sign(x)
module.exports = Math.sign || function sign(x) {
  // eslint-disable-next-line no-self-compare
  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
};

/***/ }),
/* 105 */
/***/ (function(module, exports) {

// 20.2.2.14 Math.expm1(x)
var $expm1 = Math.expm1;
module.exports = !$expm1 // Old FF bug
|| $expm1(10) > 22025.465794806719 || $expm1(10) < 22025.4657948067165168 // Tor Browser bug
|| $expm1(-2e-17) != -2e-17 ? function expm1(x) {
  return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : Math.exp(x) - 1;
} : $expm1;

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(23);

var defined = __webpack_require__(29); // true  -> String#at
// false -> String#codePointAt


module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff ? TO_STRING ? s.charAt(i) : a : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var LIBRARY = __webpack_require__(39);

var $export = __webpack_require__(0);

var redefine = __webpack_require__(16);

var hide = __webpack_require__(19);

var Iterators = __webpack_require__(60);

var $iterCreate = __webpack_require__(161);

var setToStringTag = __webpack_require__(47);

var getPrototypeOf = __webpack_require__(43);

var ITERATOR = __webpack_require__(5)('iterator');

var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`

var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function returnThis() {
  return this;
};

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);

  var getMethod = function getMethod(kind) {
    if (!BUGGY && kind in proto) return proto[kind];

    switch (kind) {
      case KEYS:
        return function keys() {
          return new Constructor(this, kind);
        };

      case VALUES:
        return function values() {
          return new Constructor(this, kind);
        };
    }

    return function entries() {
      return new Constructor(this, kind);
    };
  };

  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype; // Fix native

  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));

    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true); // fix for some old engines

      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  } // fix Array#{values, @@iterator}.name in V8 / FF


  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;

    $default = function values() {
      return $native.call(this);
    };
  } // Define iterator


  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  } // Plug for library


  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;

  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }

  return methods;
};

/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

// helper for String#{startsWith, endsWith, includes}
var isRegExp = __webpack_require__(109);

var defined = __webpack_require__(29);

module.exports = function (that, searchString, NAME) {
  if (isRegExp(searchString)) throw TypeError('String#' + NAME + " doesn't accept regex!");
  return String(defined(that));
};

/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.8 IsRegExp(argument)
var isObject = __webpack_require__(3);

var cof = __webpack_require__(28);

var MATCH = __webpack_require__(5)('match');

module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

var MATCH = __webpack_require__(5)('match');

module.exports = function (KEY) {
  var re = /./;

  try {
    '/./'[KEY](re);
  } catch (e) {
    try {
      re[MATCH] = false;
      return !'/./'[KEY](re);
    } catch (f) {
      /* empty */
    }
  }

  return true;
};

/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators = __webpack_require__(60);

var ITERATOR = __webpack_require__(5)('iterator');

var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $defineProperty = __webpack_require__(10);

var createDesc = __webpack_require__(37);

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));else object[index] = value;
};

/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(59);

var ITERATOR = __webpack_require__(5)('iterator');

var Iterators = __webpack_require__(60);

module.exports = __webpack_require__(9).getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR] || it['@@iterator'] || Iterators[classof(it)];
};

/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)


var toObject = __webpack_require__(11);

var toAbsoluteIndex = __webpack_require__(40);

var toLength = __webpack_require__(6);

module.exports = function fill(value
/* , start = 0, end = @length */
) {
  var O = toObject(this);
  var length = toLength(O.length);
  var aLen = arguments.length;
  var index = toAbsoluteIndex(aLen > 1 ? arguments[1] : undefined, length);
  var end = aLen > 2 ? arguments[2] : undefined;
  var endPos = end === undefined ? length : toAbsoluteIndex(end, length);

  while (endPos > index) {
    O[index++] = value;
  }

  return O;
};

/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var regexpFlags = __webpack_require__(74);

var nativeExec = RegExp.prototype.exec; // This always refers to the native implementation, because the
// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
// which loads this file before patching the method.

var nativeReplace = String.prototype.replace;
var patchedExec = nativeExec;
var LAST_INDEX = 'lastIndex';

var UPDATES_LAST_INDEX_WRONG = function () {
  var re1 = /a/,
      re2 = /b*/g;
  nativeExec.call(re1, 'a');
  nativeExec.call(re2, 'a');
  return re1[LAST_INDEX] !== 0 || re2[LAST_INDEX] !== 0;
}(); // nonparticipating capturing group, copied from es5-shim's String#split patch.


var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;
var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;

if (PATCH) {
  patchedExec = function exec(str) {
    var re = this;
    var lastIndex, reCopy, match, i;

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + re.source + '$(?!\\s)', regexpFlags.call(re));
    }

    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re[LAST_INDEX];
    match = nativeExec.call(re, str);

    if (UPDATES_LAST_INDEX_WRONG && match) {
      re[LAST_INDEX] = re.global ? match.index + match[0].length : lastIndex;
    }

    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      // eslint-disable-next-line no-loop-func
      nativeReplace.call(match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    return match;
  };
}

module.exports = patchedExec;

/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var at = __webpack_require__(106)(true); // `AdvanceStringIndex` abstract operation
// https://tc39.github.io/ecma262/#sec-advancestringindex


module.exports = function (S, index, unicode) {
  return index + (unicode ? at(S, index).length : 1);
};

/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(4);

var navigator = global.navigator;
module.exports = navigator && navigator.userAgent || '';

/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var global = __webpack_require__(4);

var DESCRIPTORS = __webpack_require__(8);

var LIBRARY = __webpack_require__(39);

var $typed = __webpack_require__(79);

var hide = __webpack_require__(19);

var redefineAll = __webpack_require__(52);

var fails = __webpack_require__(1);

var anInstance = __webpack_require__(51);

var toInteger = __webpack_require__(23);

var toLength = __webpack_require__(6);

var toIndex = __webpack_require__(176);

var gOPN = __webpack_require__(42).f;

var dP = __webpack_require__(10).f;

var arrayFill = __webpack_require__(114);

var setToStringTag = __webpack_require__(47);

var ARRAY_BUFFER = 'ArrayBuffer';
var DATA_VIEW = 'DataView';
var PROTOTYPE = 'prototype';
var WRONG_LENGTH = 'Wrong length!';
var WRONG_INDEX = 'Wrong index!';
var $ArrayBuffer = global[ARRAY_BUFFER];
var $DataView = global[DATA_VIEW];
var Math = global.Math;
var RangeError = global.RangeError; // eslint-disable-next-line no-shadow-restricted-names

var Infinity = global.Infinity;
var BaseBuffer = $ArrayBuffer;
var abs = Math.abs;
var pow = Math.pow;
var floor = Math.floor;
var log = Math.log;
var LN2 = Math.LN2;
var BUFFER = 'buffer';
var BYTE_LENGTH = 'byteLength';
var BYTE_OFFSET = 'byteOffset';
var $BUFFER = DESCRIPTORS ? '_b' : BUFFER;
var $LENGTH = DESCRIPTORS ? '_l' : BYTE_LENGTH;
var $OFFSET = DESCRIPTORS ? '_o' : BYTE_OFFSET; // IEEE754 conversions based on https://github.com/feross/ieee754

function packIEEE754(value, mLen, nBytes) {
  var buffer = new Array(nBytes);
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = mLen === 23 ? pow(2, -24) - pow(2, -77) : 0;
  var i = 0;
  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
  var e, m, c;
  value = abs(value); // eslint-disable-next-line no-self-compare

  if (value != value || value === Infinity) {
    // eslint-disable-next-line no-self-compare
    m = value != value ? 1 : 0;
    e = eMax;
  } else {
    e = floor(log(value) / LN2);

    if (value * (c = pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }

    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * pow(2, 1 - eBias);
    }

    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * pow(2, eBias - 1) * pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[i++] = m & 255, m /= 256, mLen -= 8) {
    ;
  }

  e = e << mLen | m;
  eLen += mLen;

  for (; eLen > 0; buffer[i++] = e & 255, e /= 256, eLen -= 8) {
    ;
  }

  buffer[--i] |= s * 128;
  return buffer;
}

function unpackIEEE754(buffer, mLen, nBytes) {
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = eLen - 7;
  var i = nBytes - 1;
  var s = buffer[i--];
  var e = s & 127;
  var m;
  s >>= 7;

  for (; nBits > 0; e = e * 256 + buffer[i], i--, nBits -= 8) {
    ;
  }

  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;

  for (; nBits > 0; m = m * 256 + buffer[i], i--, nBits -= 8) {
    ;
  }

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : s ? -Infinity : Infinity;
  } else {
    m = m + pow(2, mLen);
    e = e - eBias;
  }

  return (s ? -1 : 1) * m * pow(2, e - mLen);
}

function unpackI32(bytes) {
  return bytes[3] << 24 | bytes[2] << 16 | bytes[1] << 8 | bytes[0];
}

function packI8(it) {
  return [it & 0xff];
}

function packI16(it) {
  return [it & 0xff, it >> 8 & 0xff];
}

function packI32(it) {
  return [it & 0xff, it >> 8 & 0xff, it >> 16 & 0xff, it >> 24 & 0xff];
}

function packF64(it) {
  return packIEEE754(it, 52, 8);
}

function packF32(it) {
  return packIEEE754(it, 23, 4);
}

function addGetter(C, key, internal) {
  dP(C[PROTOTYPE], key, {
    get: function get() {
      return this[internal];
    }
  });
}

function get(view, bytes, index, isLittleEndian) {
  var numIndex = +index;
  var intIndex = toIndex(numIndex);
  if (intIndex + bytes > view[$LENGTH]) throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b;
  var start = intIndex + view[$OFFSET];
  var pack = store.slice(start, start + bytes);
  return isLittleEndian ? pack : pack.reverse();
}

function set(view, bytes, index, conversion, value, isLittleEndian) {
  var numIndex = +index;
  var intIndex = toIndex(numIndex);
  if (intIndex + bytes > view[$LENGTH]) throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b;
  var start = intIndex + view[$OFFSET];
  var pack = conversion(+value);

  for (var i = 0; i < bytes; i++) {
    store[start + i] = pack[isLittleEndian ? i : bytes - i - 1];
  }
}

if (!$typed.ABV) {
  $ArrayBuffer = function ArrayBuffer(length) {
    anInstance(this, $ArrayBuffer, ARRAY_BUFFER);
    var byteLength = toIndex(length);
    this._b = arrayFill.call(new Array(byteLength), 0);
    this[$LENGTH] = byteLength;
  };

  $DataView = function DataView(buffer, byteOffset, byteLength) {
    anInstance(this, $DataView, DATA_VIEW);
    anInstance(buffer, $ArrayBuffer, DATA_VIEW);
    var bufferLength = buffer[$LENGTH];
    var offset = toInteger(byteOffset);
    if (offset < 0 || offset > bufferLength) throw RangeError('Wrong offset!');
    byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
    if (offset + byteLength > bufferLength) throw RangeError(WRONG_LENGTH);
    this[$BUFFER] = buffer;
    this[$OFFSET] = offset;
    this[$LENGTH] = byteLength;
  };

  if (DESCRIPTORS) {
    addGetter($ArrayBuffer, BYTE_LENGTH, '_l');
    addGetter($DataView, BUFFER, '_b');
    addGetter($DataView, BYTE_LENGTH, '_l');
    addGetter($DataView, BYTE_OFFSET, '_o');
  }

  redefineAll($DataView[PROTOTYPE], {
    getInt8: function getInt8(byteOffset) {
      return get(this, 1, byteOffset)[0] << 24 >> 24;
    },
    getUint8: function getUint8(byteOffset) {
      return get(this, 1, byteOffset)[0];
    },
    getInt16: function getInt16(byteOffset
    /* , littleEndian */
    ) {
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
    },
    getUint16: function getUint16(byteOffset
    /* , littleEndian */
    ) {
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return bytes[1] << 8 | bytes[0];
    },
    getInt32: function getInt32(byteOffset
    /* , littleEndian */
    ) {
      return unpackI32(get(this, 4, byteOffset, arguments[1]));
    },
    getUint32: function getUint32(byteOffset
    /* , littleEndian */
    ) {
      return unpackI32(get(this, 4, byteOffset, arguments[1])) >>> 0;
    },
    getFloat32: function getFloat32(byteOffset
    /* , littleEndian */
    ) {
      return unpackIEEE754(get(this, 4, byteOffset, arguments[1]), 23, 4);
    },
    getFloat64: function getFloat64(byteOffset
    /* , littleEndian */
    ) {
      return unpackIEEE754(get(this, 8, byteOffset, arguments[1]), 52, 8);
    },
    setInt8: function setInt8(byteOffset, value) {
      set(this, 1, byteOffset, packI8, value);
    },
    setUint8: function setUint8(byteOffset, value) {
      set(this, 1, byteOffset, packI8, value);
    },
    setInt16: function setInt16(byteOffset, value
    /* , littleEndian */
    ) {
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setUint16: function setUint16(byteOffset, value
    /* , littleEndian */
    ) {
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setInt32: function setInt32(byteOffset, value
    /* , littleEndian */
    ) {
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setUint32: function setUint32(byteOffset, value
    /* , littleEndian */
    ) {
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setFloat32: function setFloat32(byteOffset, value
    /* , littleEndian */
    ) {
      set(this, 4, byteOffset, packF32, value, arguments[2]);
    },
    setFloat64: function setFloat64(byteOffset, value
    /* , littleEndian */
    ) {
      set(this, 8, byteOffset, packF64, value, arguments[2]);
    }
  });
} else {
  if (!fails(function () {
    $ArrayBuffer(1);
  }) || !fails(function () {
    new $ArrayBuffer(-1); // eslint-disable-line no-new
  }) || fails(function () {
    new $ArrayBuffer(); // eslint-disable-line no-new

    new $ArrayBuffer(1.5); // eslint-disable-line no-new

    new $ArrayBuffer(NaN); // eslint-disable-line no-new

    return $ArrayBuffer.name != ARRAY_BUFFER;
  })) {
    $ArrayBuffer = function ArrayBuffer(length) {
      anInstance(this, $ArrayBuffer);
      return new BaseBuffer(toIndex(length));
    };

    var ArrayBufferProto = $ArrayBuffer[PROTOTYPE] = BaseBuffer[PROTOTYPE];

    for (var keys = gOPN(BaseBuffer), j = 0, key; keys.length > j;) {
      if (!((key = keys[j++]) in $ArrayBuffer)) hide($ArrayBuffer, key, BaseBuffer[key]);
    }

    if (!LIBRARY) ArrayBufferProto.constructor = $ArrayBuffer;
  } // iOS Safari 7.x bug


  var view = new $DataView(new $ArrayBuffer(2));
  var $setInt8 = $DataView[PROTOTYPE].setInt8;
  view.setInt8(0, 2147483648);
  view.setInt8(1, 2147483649);
  if (view.getInt8(0) || !view.getInt8(1)) redefineAll($DataView[PROTOTYPE], {
    setInt8: function setInt8(byteOffset, value) {
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    },
    setUint8: function setUint8(byteOffset, value) {
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    }
  }, true);
}

setToStringTag($ArrayBuffer, ARRAY_BUFFER);
setToStringTag($DataView, DATA_VIEW);
hide($DataView[PROTOTYPE], $typed.VIEW, true);
exports[ARRAY_BUFFER] = $ArrayBuffer;
exports[DATA_VIEW] = $DataView;

/***/ }),
/* 119 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math ? window : typeof self != 'undefined' && self.Math == Math ? self // eslint-disable-next-line no-new-func
: Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

/***/ }),
/* 120 */
/***/ (function(module, exports) {

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

module.exports = function (it) {
  return _typeof(it) === 'object' ? it !== null : typeof it === 'function';
};

/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(181)(function () {
  return Object.defineProperty({}, 'a', {
    get: function get() {
      return 7;
    }
  }).a != 7;
});

/***/ }),
/* 122 */
/***/ (function(module, exports) {

// iterable DOM collections
// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
module.exports = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  MimeTypeArray: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0
};

/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

var IS_PURE = __webpack_require__(65);

var store = __webpack_require__(84);

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.7.0',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
});

/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(32);

var fails = __webpack_require__(18);

var createElement = __webpack_require__(86); // Thank's IE8 for his funny defineProperty


module.exports = !DESCRIPTORS && !fails(function () {
  return Object.defineProperty(createElement('div'), 'a', {
    get: function get() {
      return 7;
    }
  }).a != 7;
});

/***/ }),
/* 125 */
/***/ (function(module, exports) {

var id = 0;
var postfix = Math.random();

module.exports = function (key) {
  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
};

/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(18);

module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  // Chrome 38 Symbol has incorrect toString conversion
  // eslint-disable-next-line no-undef
  return !String(Symbol());
});

/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var toIndexedObject = __webpack_require__(66);

var addToUnscopables = __webpack_require__(196);

var Iterators = __webpack_require__(54);

var InternalStateModule = __webpack_require__(55);

var defineIterator = __webpack_require__(133);

var ARRAY_ITERATOR = 'Array Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(ARRAY_ITERATOR); // `Array.prototype.entries` method
// https://tc39.github.io/ecma262/#sec-array.prototype.entries
// `Array.prototype.keys` method
// https://tc39.github.io/ecma262/#sec-array.prototype.keys
// `Array.prototype.values` method
// https://tc39.github.io/ecma262/#sec-array.prototype.values
// `Array.prototype[@@iterator]` method
// https://tc39.github.io/ecma262/#sec-array.prototype-@@iterator
// `CreateArrayIterator` internal method
// https://tc39.github.io/ecma262/#sec-createarrayiterator

module.exports = defineIterator(Array, 'Array', function (iterated, kind) {
  setInternalState(this, {
    type: ARRAY_ITERATOR,
    target: toIndexedObject(iterated),
    // target
    index: 0,
    // next index
    kind: kind // kind

  }); // `%ArrayIteratorPrototype%.next` method
  // https://tc39.github.io/ecma262/#sec-%arrayiteratorprototype%.next
}, function () {
  var state = getInternalState(this);
  var target = state.target;
  var kind = state.kind;
  var index = state.index++;

  if (!target || index >= target.length) {
    state.target = undefined;
    return {
      value: undefined,
      done: true
    };
  }

  if (kind == 'keys') return {
    value: index,
    done: false
  };
  if (kind == 'values') return {
    value: target[index],
    done: false
  };
  return {
    value: [index, target[index]],
    done: false
  };
}, 'values'); // argumentsList[@@iterator] is %ArrayProto_values%
// https://tc39.github.io/ecma262/#sec-createunmappedargumentsobject
// https://tc39.github.io/ecma262/#sec-createmappedargumentsobject

Iterators.Arguments = Iterators.Array; // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(32);

var definePropertyModule = __webpack_require__(46);

var anObject = __webpack_require__(27);

var objectKeys = __webpack_require__(129); // `Object.defineProperties` method
// https://tc39.github.io/ecma262/#sec-object.defineproperties


module.exports = DESCRIPTORS ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;

  while (length > index) {
    definePropertyModule.f(O, key = keys[index++], Properties[key]);
  }

  return O;
};

/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

var internalObjectKeys = __webpack_require__(130);

var enumBugKeys = __webpack_require__(90); // `Object.keys` method
// https://tc39.github.io/ecma262/#sec-object.keys


module.exports = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys);
};

/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(14);

var toIndexedObject = __webpack_require__(66);

var indexOf = __webpack_require__(197).indexOf;

var hiddenKeys = __webpack_require__(89);

module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;

  for (key in O) {
    !has(hiddenKeys, key) && has(O, key) && result.push(key);
  } // Don't enum bug & hidden keys


  while (names.length > i) {
    if (has(O, key = names[i++])) {
      ~indexOf(result, key) || result.push(key);
    }
  }

  return result;
};

/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(67);

module.exports = getBuiltIn('document', 'documentElement');

/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__(84);

var functionToString = Function.toString; // this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper

if (typeof store.inspectSource != 'function') {
  store.inspectSource = function (it) {
    return functionToString.call(it);
  };
}

module.exports = store.inspectSource;

/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $ = __webpack_require__(36);

var createIteratorConstructor = __webpack_require__(136);

var getPrototypeOf = __webpack_require__(138);

var setPrototypeOf = __webpack_require__(206);

var setToStringTag = __webpack_require__(68);

var createNonEnumerableProperty = __webpack_require__(31);

var redefine = __webpack_require__(56);

var wellKnownSymbol = __webpack_require__(13);

var IS_PURE = __webpack_require__(65);

var Iterators = __webpack_require__(54);

var IteratorsCore = __webpack_require__(137);

var IteratorPrototype = IteratorsCore.IteratorPrototype;
var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
var ITERATOR = wellKnownSymbol('iterator');
var KEYS = 'keys';
var VALUES = 'values';
var ENTRIES = 'entries';

var returnThis = function returnThis() {
  return this;
};

module.exports = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
  createIteratorConstructor(IteratorConstructor, NAME, next);

  var getIterationMethod = function getIterationMethod(KIND) {
    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
    if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];

    switch (KIND) {
      case KEYS:
        return function keys() {
          return new IteratorConstructor(this, KIND);
        };

      case VALUES:
        return function values() {
          return new IteratorConstructor(this, KIND);
        };

      case ENTRIES:
        return function entries() {
          return new IteratorConstructor(this, KIND);
        };
    }

    return function () {
      return new IteratorConstructor(this);
    };
  };

  var TO_STRING_TAG = NAME + ' Iterator';
  var INCORRECT_VALUES_NAME = false;
  var IterablePrototype = Iterable.prototype;
  var nativeIterator = IterablePrototype[ITERATOR] || IterablePrototype['@@iterator'] || DEFAULT && IterablePrototype[DEFAULT];
  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
  var CurrentIteratorPrototype, methods, KEY; // fix native

  if (anyNativeIterator) {
    CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));

    if (IteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
      if (!IS_PURE && getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
        if (setPrototypeOf) {
          setPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
        } else if (typeof CurrentIteratorPrototype[ITERATOR] != 'function') {
          createNonEnumerableProperty(CurrentIteratorPrototype, ITERATOR, returnThis);
        }
      } // Set @@toStringTag to native iterators


      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
      if (IS_PURE) Iterators[TO_STRING_TAG] = returnThis;
    }
  } // fix Array#{values, @@iterator}.name in V8 / FF


  if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
    INCORRECT_VALUES_NAME = true;

    defaultIterator = function values() {
      return nativeIterator.call(this);
    };
  } // define iterator


  if ((!IS_PURE || FORCED) && IterablePrototype[ITERATOR] !== defaultIterator) {
    createNonEnumerableProperty(IterablePrototype, ITERATOR, defaultIterator);
  }

  Iterators[NAME] = defaultIterator; // export additional methods

  if (DEFAULT) {
    methods = {
      values: getIterationMethod(VALUES),
      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
      entries: getIterationMethod(ENTRIES)
    };
    if (FORCED) for (KEY in methods) {
      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
        redefine(IterablePrototype, KEY, methods[KEY]);
      }
    } else $({
      target: NAME,
      proto: true,
      forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME
    }, methods);
  }

  return methods;
};

/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor; // Nashorn ~ JDK8 bug

var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({
  1: 2
}, 1); // `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable

exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : nativePropertyIsEnumerable;

/***/ }),
/* 135 */
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;

/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var IteratorPrototype = __webpack_require__(137).IteratorPrototype;

var create = __webpack_require__(88);

var createPropertyDescriptor = __webpack_require__(53);

var setToStringTag = __webpack_require__(68);

var Iterators = __webpack_require__(54);

var returnThis = function returnThis() {
  return this;
};

module.exports = function (IteratorConstructor, NAME, next) {
  var TO_STRING_TAG = NAME + ' Iterator';
  IteratorConstructor.prototype = create(IteratorPrototype, {
    next: createPropertyDescriptor(1, next)
  });
  setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
  Iterators[TO_STRING_TAG] = returnThis;
  return IteratorConstructor;
};

/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var getPrototypeOf = __webpack_require__(138);

var createNonEnumerableProperty = __webpack_require__(31);

var has = __webpack_require__(14);

var wellKnownSymbol = __webpack_require__(13);

var IS_PURE = __webpack_require__(65);

var ITERATOR = wellKnownSymbol('iterator');
var BUGGY_SAFARI_ITERATORS = false;

var returnThis = function returnThis() {
  return this;
}; // `%IteratorPrototype%` object
// https://tc39.github.io/ecma262/#sec-%iteratorprototype%-object


var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

if ([].keys) {
  arrayIterator = [].keys(); // Safari 8 has buggy iterators w/o `next`

  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;else {
    PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
  }
}

if (IteratorPrototype == undefined) IteratorPrototype = {}; // 25.1.2.1.1 %IteratorPrototype%[@@iterator]()

if (!IS_PURE && !has(IteratorPrototype, ITERATOR)) {
  createNonEnumerableProperty(IteratorPrototype, ITERATOR, returnThis);
}

module.exports = {
  IteratorPrototype: IteratorPrototype,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
};

/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(14);

var toObject = __webpack_require__(64);

var sharedKey = __webpack_require__(91);

var CORRECT_PROTOTYPE_GETTER = __webpack_require__(205);

var IE_PROTO = sharedKey('IE_PROTO');
var ObjectPrototype = Object.prototype; // `Object.getPrototypeOf` method
// https://tc39.github.io/ecma262/#sec-object.getprototypeof

module.exports = CORRECT_PROTOTYPE_GETTER ? Object.getPrototypeOf : function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];

  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  }

  return O instanceof Object ? ObjectPrototype : null;
};

/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(7);

var fails = __webpack_require__(18);

var bind = __webpack_require__(62);

var html = __webpack_require__(131);

var createElement = __webpack_require__(86);

var IS_IOS = __webpack_require__(140);

var IS_NODE = __webpack_require__(93);

var location = global.location;
var set = global.setImmediate;
var clear = global.clearImmediate;
var process = global.process;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;

var run = function run(id) {
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};

var runner = function runner(id) {
  return function () {
    run(id);
  };
};

var listener = function listener(event) {
  run(event.data);
};

var post = function post(id) {
  // old engines have not location.origin
  global.postMessage(id + '', location.protocol + '//' + location.host);
}; // Node.js 0.9+ & IE10+ has setImmediate, otherwise:


if (!set || !clear) {
  set = function setImmediate(fn) {
    var args = [];
    var i = 1;

    while (arguments.length > i) {
      args.push(arguments[i++]);
    }

    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      (typeof fn == 'function' ? fn : Function(fn)).apply(undefined, args);
    };

    defer(counter);
    return counter;
  };

  clear = function clearImmediate(id) {
    delete queue[id];
  }; // Node.js 0.8-


  if (IS_NODE) {
    defer = function defer(id) {
      process.nextTick(runner(id));
    }; // Sphere (JS game engine) Dispatch API

  } else if (Dispatch && Dispatch.now) {
    defer = function defer(id) {
      Dispatch.now(runner(id));
    }; // Browsers with MessageChannel, includes WebWorkers
    // except iOS - https://github.com/zloirock/core-js/issues/624

  } else if (MessageChannel && !IS_IOS) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = bind(port.postMessage, port, 1); // Browsers with postMessage, skip WebWorkers
    // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts && location && location.protocol !== 'file:' && !fails(post)) {
    defer = post;
    global.addEventListener('message', listener, false); // IE8-
  } else if (ONREADYSTATECHANGE in createElement('script')) {
    defer = function defer(id) {
      html.appendChild(createElement('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run(id);
      };
    }; // Rest old browsers

  } else {
    defer = function defer(id) {
      setTimeout(runner(id), 0);
    };
  }
}

module.exports = {
  set: set,
  clear: clear
};

/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

var userAgent = __webpack_require__(141);

module.exports = /(iphone|ipod|ipad).*applewebkit/i.test(userAgent);

/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(67);

module.exports = getBuiltIn('navigator', 'userAgent') || '';

/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(83);

var requireObjectCoercible = __webpack_require__(81); // `String.prototype.{ codePointAt, at }` methods implementation


var createMethod = function createMethod(CONVERT_TO_STRING) {
  return function ($this, pos) {
    var S = String(requireObjectCoercible($this));
    var position = toInteger(pos);
    var size = S.length;
    var first, second;
    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
    first = S.charCodeAt(position);
    return first < 0xD800 || first > 0xDBFF || position + 1 === size || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF ? CONVERT_TO_STRING ? S.charAt(position) : first : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
  };
};

module.exports = {
  // `String.prototype.codePointAt` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
  codeAt: createMethod(false),
  // `String.prototype.at` method
  // https://github.com/mathiasbynens/String.prototype.at
  charAt: createMethod(true)
};

/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(18);

var wellKnownSymbol = __webpack_require__(13);

var IS_PURE = __webpack_require__(65);

var ITERATOR = wellKnownSymbol('iterator');
module.exports = !fails(function () {
  var url = new URL('b?a=1&b=2&c=3', 'http://a');
  var searchParams = url.searchParams;
  var result = '';
  url.pathname = 'c%20d';
  searchParams.forEach(function (value, key) {
    searchParams['delete']('b');
    result += key + value;
  });
  return IS_PURE && !url.toJSON || !searchParams.sort || url.href !== 'http://a/c%20d?a=1&c=3' || searchParams.get('c') !== '3' || String(new URLSearchParams('?a=1')) !== 'a=1' || !searchParams[ITERATOR] // throws in Edge
  || new URL('https://a@b').username !== 'a' || new URLSearchParams(new URLSearchParams('a=b')).get('a') !== 'b' // not punycoded in Edge
  || new URL('http://тест').host !== 'xn--e1aybc' // not escaped in Chrome 62-
  || new URL('http://a#б').hash !== '#%D0%B1' // fails in Chrome 66-
  || result !== 'a1c3' // throws in Safari
  || new URL('http://x', undefined).host !== 'x';
});

/***/ }),
/* 144 */
/***/ (function(module, exports) {

module.exports = function (it, Constructor, name) {
  if (!(it instanceof Constructor)) {
    throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
  }

  return it;
};

/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

var TO_STRING_TAG_SUPPORT = __webpack_require__(220);

var classofRaw = __webpack_require__(63);

var wellKnownSymbol = __webpack_require__(13);

var TO_STRING_TAG = wellKnownSymbol('toStringTag'); // ES3 wrong here

var CORRECT_ARGUMENTS = classofRaw(function () {
  return arguments;
}()) == 'Arguments'; // fallback for IE11 Script Access Denied error

var tryGet = function tryGet(it, key) {
  try {
    return it[key];
  } catch (error) {
    /* empty */
  }
}; // getting tag from ES6+ `Object.prototype.toString`


module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null' // @@toStringTag case
  : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG)) == 'string' ? tag // builtinTag case
  : CORRECT_ARGUMENTS ? classofRaw(O) // ES3 arguments fallback
  : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
};

/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 // TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`

__webpack_require__(127);

var $ = __webpack_require__(36);

var getBuiltIn = __webpack_require__(67);

var USE_NATIVE_URL = __webpack_require__(143);

var redefine = __webpack_require__(56);

var redefineAll = __webpack_require__(222);

var setToStringTag = __webpack_require__(68);

var createIteratorConstructor = __webpack_require__(136);

var InternalStateModule = __webpack_require__(55);

var anInstance = __webpack_require__(144);

var hasOwn = __webpack_require__(14);

var bind = __webpack_require__(62);

var classof = __webpack_require__(145);

var anObject = __webpack_require__(27);

var isObject = __webpack_require__(35);

var create = __webpack_require__(88);

var createPropertyDescriptor = __webpack_require__(53);

var getIterator = __webpack_require__(223);

var getIteratorMethod = __webpack_require__(94);

var wellKnownSymbol = __webpack_require__(13);

var $fetch = getBuiltIn('fetch');
var Headers = getBuiltIn('Headers');
var ITERATOR = wellKnownSymbol('iterator');
var URL_SEARCH_PARAMS = 'URLSearchParams';
var URL_SEARCH_PARAMS_ITERATOR = URL_SEARCH_PARAMS + 'Iterator';
var setInternalState = InternalStateModule.set;
var getInternalParamsState = InternalStateModule.getterFor(URL_SEARCH_PARAMS);
var getInternalIteratorState = InternalStateModule.getterFor(URL_SEARCH_PARAMS_ITERATOR);
var plus = /\+/g;
var sequences = Array(4);

var percentSequence = function percentSequence(bytes) {
  return sequences[bytes - 1] || (sequences[bytes - 1] = RegExp('((?:%[\\da-f]{2}){' + bytes + '})', 'gi'));
};

var percentDecode = function percentDecode(sequence) {
  try {
    return decodeURIComponent(sequence);
  } catch (error) {
    return sequence;
  }
};

var deserialize = function deserialize(it) {
  var result = it.replace(plus, ' ');
  var bytes = 4;

  try {
    return decodeURIComponent(result);
  } catch (error) {
    while (bytes) {
      result = result.replace(percentSequence(bytes--), percentDecode);
    }

    return result;
  }
};

var find = /[!'()~]|%20/g;
var replace = {
  '!': '%21',
  "'": '%27',
  '(': '%28',
  ')': '%29',
  '~': '%7E',
  '%20': '+'
};

var replacer = function replacer(match) {
  return replace[match];
};

var serialize = function serialize(it) {
  return encodeURIComponent(it).replace(find, replacer);
};

var parseSearchParams = function parseSearchParams(result, query) {
  if (query) {
    var attributes = query.split('&');
    var index = 0;
    var attribute, entry;

    while (index < attributes.length) {
      attribute = attributes[index++];

      if (attribute.length) {
        entry = attribute.split('=');
        result.push({
          key: deserialize(entry.shift()),
          value: deserialize(entry.join('='))
        });
      }
    }
  }
};

var updateSearchParams = function updateSearchParams(query) {
  this.entries.length = 0;
  parseSearchParams(this.entries, query);
};

var validateArgumentsLength = function validateArgumentsLength(passed, required) {
  if (passed < required) throw TypeError('Not enough arguments');
};

var URLSearchParamsIterator = createIteratorConstructor(function Iterator(params, kind) {
  setInternalState(this, {
    type: URL_SEARCH_PARAMS_ITERATOR,
    iterator: getIterator(getInternalParamsState(params).entries),
    kind: kind
  });
}, 'Iterator', function next() {
  var state = getInternalIteratorState(this);
  var kind = state.kind;
  var step = state.iterator.next();
  var entry = step.value;

  if (!step.done) {
    step.value = kind === 'keys' ? entry.key : kind === 'values' ? entry.value : [entry.key, entry.value];
  }

  return step;
}); // `URLSearchParams` constructor
// https://url.spec.whatwg.org/#interface-urlsearchparams

var URLSearchParamsConstructor = function URLSearchParams()
/* init */
{
  anInstance(this, URLSearchParamsConstructor, URL_SEARCH_PARAMS);
  var init = arguments.length > 0 ? arguments[0] : undefined;
  var that = this;
  var entries = [];
  var iteratorMethod, iterator, next, step, entryIterator, entryNext, first, second, key;
  setInternalState(that, {
    type: URL_SEARCH_PARAMS,
    entries: entries,
    updateURL: function updateURL() {
      /* empty */
    },
    updateSearchParams: updateSearchParams
  });

  if (init !== undefined) {
    if (isObject(init)) {
      iteratorMethod = getIteratorMethod(init);

      if (typeof iteratorMethod === 'function') {
        iterator = iteratorMethod.call(init);
        next = iterator.next;

        while (!(step = next.call(iterator)).done) {
          entryIterator = getIterator(anObject(step.value));
          entryNext = entryIterator.next;
          if ((first = entryNext.call(entryIterator)).done || (second = entryNext.call(entryIterator)).done || !entryNext.call(entryIterator).done) throw TypeError('Expected sequence with length 2');
          entries.push({
            key: first.value + '',
            value: second.value + ''
          });
        }
      } else for (key in init) {
        if (hasOwn(init, key)) entries.push({
          key: key,
          value: init[key] + ''
        });
      }
    } else {
      parseSearchParams(entries, typeof init === 'string' ? init.charAt(0) === '?' ? init.slice(1) : init : init + '');
    }
  }
};

var URLSearchParamsPrototype = URLSearchParamsConstructor.prototype;
redefineAll(URLSearchParamsPrototype, {
  // `URLSearchParams.prototype.append` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-append
  append: function append(name, value) {
    validateArgumentsLength(arguments.length, 2);
    var state = getInternalParamsState(this);
    state.entries.push({
      key: name + '',
      value: value + ''
    });
    state.updateURL();
  },
  // `URLSearchParams.prototype.delete` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-delete
  'delete': function _delete(name) {
    validateArgumentsLength(arguments.length, 1);
    var state = getInternalParamsState(this);
    var entries = state.entries;
    var key = name + '';
    var index = 0;

    while (index < entries.length) {
      if (entries[index].key === key) entries.splice(index, 1);else index++;
    }

    state.updateURL();
  },
  // `URLSearchParams.prototype.get` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-get
  get: function get(name) {
    validateArgumentsLength(arguments.length, 1);
    var entries = getInternalParamsState(this).entries;
    var key = name + '';
    var index = 0;

    for (; index < entries.length; index++) {
      if (entries[index].key === key) return entries[index].value;
    }

    return null;
  },
  // `URLSearchParams.prototype.getAll` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-getall
  getAll: function getAll(name) {
    validateArgumentsLength(arguments.length, 1);
    var entries = getInternalParamsState(this).entries;
    var key = name + '';
    var result = [];
    var index = 0;

    for (; index < entries.length; index++) {
      if (entries[index].key === key) result.push(entries[index].value);
    }

    return result;
  },
  // `URLSearchParams.prototype.has` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-has
  has: function has(name) {
    validateArgumentsLength(arguments.length, 1);
    var entries = getInternalParamsState(this).entries;
    var key = name + '';
    var index = 0;

    while (index < entries.length) {
      if (entries[index++].key === key) return true;
    }

    return false;
  },
  // `URLSearchParams.prototype.set` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-set
  set: function set(name, value) {
    validateArgumentsLength(arguments.length, 1);
    var state = getInternalParamsState(this);
    var entries = state.entries;
    var found = false;
    var key = name + '';
    var val = value + '';
    var index = 0;
    var entry;

    for (; index < entries.length; index++) {
      entry = entries[index];

      if (entry.key === key) {
        if (found) entries.splice(index--, 1);else {
          found = true;
          entry.value = val;
        }
      }
    }

    if (!found) entries.push({
      key: key,
      value: val
    });
    state.updateURL();
  },
  // `URLSearchParams.prototype.sort` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-sort
  sort: function sort() {
    var state = getInternalParamsState(this);
    var entries = state.entries; // Array#sort is not stable in some engines

    var slice = entries.slice();
    var entry, entriesIndex, sliceIndex;
    entries.length = 0;

    for (sliceIndex = 0; sliceIndex < slice.length; sliceIndex++) {
      entry = slice[sliceIndex];

      for (entriesIndex = 0; entriesIndex < sliceIndex; entriesIndex++) {
        if (entries[entriesIndex].key > entry.key) {
          entries.splice(entriesIndex, 0, entry);
          break;
        }
      }

      if (entriesIndex === sliceIndex) entries.push(entry);
    }

    state.updateURL();
  },
  // `URLSearchParams.prototype.forEach` method
  forEach: function forEach(callback
  /* , thisArg */
  ) {
    var entries = getInternalParamsState(this).entries;
    var boundFunction = bind(callback, arguments.length > 1 ? arguments[1] : undefined, 3);
    var index = 0;
    var entry;

    while (index < entries.length) {
      entry = entries[index++];
      boundFunction(entry.value, entry.key, this);
    }
  },
  // `URLSearchParams.prototype.keys` method
  keys: function keys() {
    return new URLSearchParamsIterator(this, 'keys');
  },
  // `URLSearchParams.prototype.values` method
  values: function values() {
    return new URLSearchParamsIterator(this, 'values');
  },
  // `URLSearchParams.prototype.entries` method
  entries: function entries() {
    return new URLSearchParamsIterator(this, 'entries');
  }
}, {
  enumerable: true
}); // `URLSearchParams.prototype[@@iterator]` method

redefine(URLSearchParamsPrototype, ITERATOR, URLSearchParamsPrototype.entries); // `URLSearchParams.prototype.toString` method
// https://url.spec.whatwg.org/#urlsearchparams-stringification-behavior

redefine(URLSearchParamsPrototype, 'toString', function toString() {
  var entries = getInternalParamsState(this).entries;
  var result = [];
  var index = 0;
  var entry;

  while (index < entries.length) {
    entry = entries[index++];
    result.push(serialize(entry.key) + '=' + serialize(entry.value));
  }

  return result.join('&');
}, {
  enumerable: true
});
setToStringTag(URLSearchParamsConstructor, URL_SEARCH_PARAMS);
$({
  global: true,
  forced: !USE_NATIVE_URL
}, {
  URLSearchParams: URLSearchParamsConstructor
}); // Wrap `fetch` for correct work with polyfilled `URLSearchParams`
// https://github.com/zloirock/core-js/issues/674

if (!USE_NATIVE_URL && typeof $fetch == 'function' && typeof Headers == 'function') {
  $({
    global: true,
    enumerable: true,
    forced: true
  }, {
    fetch: function fetch(input
    /* , init */
    ) {
      var args = [input];
      var init, body, headers;

      if (arguments.length > 1) {
        init = arguments[1];

        if (isObject(init)) {
          body = init.body;

          if (classof(body) === URL_SEARCH_PARAMS) {
            headers = init.headers ? new Headers(init.headers) : new Headers();

            if (!headers.has('content-type')) {
              headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
            }

            init = create(init, {
              body: createPropertyDescriptor(0, String(body)),
              headers: createPropertyDescriptor(0, headers)
            });
          }
        }

        args.push(init);
      }

      return $fetch.apply(this, args);
    }
  });
}

module.exports = {
  URLSearchParams: URLSearchParamsConstructor,
  getState: getInternalParamsState
};

/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(8) && !__webpack_require__(1)(function () {
  return Object.defineProperty(__webpack_require__(95)('div'), 'a', {
    get: function get() {
      return 7;
    }
  }).a != 7;
});

/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(4);

var core = __webpack_require__(9);

var LIBRARY = __webpack_require__(39);

var wksExt = __webpack_require__(96);

var defineProperty = __webpack_require__(10).f;

module.exports = function (name) {
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, {
    value: wksExt.f(name)
  });
};

/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(15);

var toIObject = __webpack_require__(17);

var arrayIndexOf = __webpack_require__(70)(false);

var IE_PROTO = __webpack_require__(97)('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;

  for (key in O) {
    if (key != IE_PROTO) has(O, key) && result.push(key);
  } // Don't enum bug & hidden keys


  while (names.length > i) {
    if (has(O, key = names[i++])) {
      ~arrayIndexOf(result, key) || result.push(key);
    }
  }

  return result;
};

/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(10);

var anObject = __webpack_require__(2);

var getKeys = __webpack_require__(48);

module.exports = __webpack_require__(8) ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;

  while (length > i) {
    dP.f(O, P = keys[i++], Properties[P]);
  }

  return O;
};

/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = __webpack_require__(17);

var gOPN = __webpack_require__(42).f;

var toString = {}.toString;
var windowNames = (typeof window === "undefined" ? "undefined" : _typeof(window)) == 'object' && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function getWindowNames(it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};

/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 // 19.1.2.1 Object.assign(target, source, ...)

var DESCRIPTORS = __webpack_require__(8);

var getKeys = __webpack_require__(48);

var gOPS = __webpack_require__(71);

var pIE = __webpack_require__(58);

var toObject = __webpack_require__(11);

var IObject = __webpack_require__(57);

var $assign = Object.assign; // should work with symbols and should have deterministic property order (V8 bug)

module.exports = !$assign || __webpack_require__(1)(function () {
  var A = {};
  var B = {}; // eslint-disable-next-line no-undef

  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) {
    B[k] = k;
  });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) {
  // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;

  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;

    while (length > j) {
      key = keys[j++];
      if (!DESCRIPTORS || isEnum.call(S, key)) T[key] = S[key];
    }
  }

  return T;
} : $assign;

/***/ }),
/* 153 */
/***/ (function(module, exports) {

// 7.2.9 SameValue(x, y)
module.exports = Object.is || function is(x, y) {
  // eslint-disable-next-line no-self-compare
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};

/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var aFunction = __webpack_require__(22);

var isObject = __webpack_require__(3);

var invoke = __webpack_require__(155);

var arraySlice = [].slice;
var factories = {};

var construct = function construct(F, len, args) {
  if (!(len in factories)) {
    for (var n = [], i = 0; i < len; i++) {
      n[i] = 'a[' + i + ']';
    } // eslint-disable-next-line no-new-func


    factories[len] = Function('F,a', 'return new F(' + n.join(',') + ')');
  }

  return factories[len](F, args);
};

module.exports = Function.bind || function bind(that
/* , ...args */
) {
  var fn = aFunction(this);
  var partArgs = arraySlice.call(arguments, 1);

  var bound = function bound()
  /* args... */
  {
    var args = partArgs.concat(arraySlice.call(arguments));
    return this instanceof bound ? construct(fn, args.length, args) : invoke(fn, args, that);
  };

  if (isObject(fn.prototype)) bound.prototype = fn.prototype;
  return bound;
};

/***/ }),
/* 155 */
/***/ (function(module, exports) {

// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
  var un = that === undefined;

  switch (args.length) {
    case 0:
      return un ? fn() : fn.call(that);

    case 1:
      return un ? fn(args[0]) : fn.call(that, args[0]);

    case 2:
      return un ? fn(args[0], args[1]) : fn.call(that, args[0], args[1]);

    case 3:
      return un ? fn(args[0], args[1], args[2]) : fn.call(that, args[0], args[1], args[2]);

    case 4:
      return un ? fn(args[0], args[1], args[2], args[3]) : fn.call(that, args[0], args[1], args[2], args[3]);
  }

  return fn.apply(that, args);
};

/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

var $parseInt = __webpack_require__(4).parseInt;

var $trim = __webpack_require__(49).trim;

var ws = __webpack_require__(101);

var hex = /^[-+]?0[xX]/;
module.exports = $parseInt(ws + '08') !== 8 || $parseInt(ws + '0x16') !== 22 ? function parseInt(str, radix) {
  var string = $trim(String(str), 3);
  return $parseInt(string, radix >>> 0 || (hex.test(string) ? 16 : 10));
} : $parseInt;

/***/ }),
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

var $parseFloat = __webpack_require__(4).parseFloat;

var $trim = __webpack_require__(49).trim;

module.exports = 1 / $parseFloat(__webpack_require__(101) + '-0') !== -Infinity ? function parseFloat(str) {
  var string = $trim(String(str), 3);
  var result = $parseFloat(string);
  return result === 0 && string.charAt(0) == '-' ? -0 : result;
} : $parseFloat;

/***/ }),
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

var cof = __webpack_require__(28);

module.exports = function (it, msg) {
  if (typeof it != 'number' && cof(it) != 'Number') throw TypeError(msg);
  return +it;
};

/***/ }),
/* 159 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.3 Number.isInteger(number)
var isObject = __webpack_require__(3);

var floor = Math.floor;

module.exports = function isInteger(it) {
  return !isObject(it) && isFinite(it) && floor(it) === it;
};

/***/ }),
/* 160 */
/***/ (function(module, exports) {

// 20.2.2.20 Math.log1p(x)
module.exports = Math.log1p || function log1p(x) {
  return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : Math.log(1 + x);
};

/***/ }),
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var create = __webpack_require__(41);

var descriptor = __webpack_require__(37);

var setToStringTag = __webpack_require__(47);

var IteratorPrototype = {}; // 25.1.2.1.1 %IteratorPrototype%[@@iterator]()

__webpack_require__(19)(IteratorPrototype, __webpack_require__(5)('iterator'), function () {
  return this;
});

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, {
    next: descriptor(1, next)
  });
  setToStringTag(Constructor, NAME + ' Iterator');
};

/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__(2);

module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value); // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};

/***/ }),
/* 163 */
/***/ (function(module, exports, __webpack_require__) {

// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = __webpack_require__(317);

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};

/***/ }),
/* 164 */
/***/ (function(module, exports, __webpack_require__) {

var aFunction = __webpack_require__(22);

var toObject = __webpack_require__(11);

var IObject = __webpack_require__(57);

var toLength = __webpack_require__(6);

module.exports = function (that, callbackfn, aLen, memo, isRight) {
  aFunction(callbackfn);
  var O = toObject(that);
  var self = IObject(O);
  var length = toLength(O.length);
  var index = isRight ? length - 1 : 0;
  var i = isRight ? -1 : 1;
  if (aLen < 2) for (;;) {
    if (index in self) {
      memo = self[index];
      index += i;
      break;
    }

    index += i;

    if (isRight ? index < 0 : length <= index) {
      throw TypeError('Reduce of empty array with no initial value');
    }
  }

  for (; isRight ? index >= 0 : length > index; index += i) {
    if (index in self) {
      memo = callbackfn(memo, self[index], index, O);
    }
  }

  return memo;
};

/***/ }),
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)


var toObject = __webpack_require__(11);

var toAbsoluteIndex = __webpack_require__(40);

var toLength = __webpack_require__(6);

module.exports = [].copyWithin || function copyWithin(target
/* = 0 */
, start
/* = 0, end = @length */
) {
  var O = toObject(this);
  var len = toLength(O.length);
  var to = toAbsoluteIndex(target, len);
  var from = toAbsoluteIndex(start, len);
  var end = arguments.length > 2 ? arguments[2] : undefined;
  var count = Math.min((end === undefined ? len : toAbsoluteIndex(end, len)) - from, len - to);
  var inc = 1;

  if (from < to && to < from + count) {
    inc = -1;
    from += count - 1;
    to += count - 1;
  }

  while (count-- > 0) {
    if (from in O) O[to] = O[from];else delete O[to];
    to += inc;
    from += inc;
  }

  return O;
};

/***/ }),
/* 166 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var addToUnscopables = __webpack_require__(44);

var step = __webpack_require__(167);

var Iterators = __webpack_require__(60);

var toIObject = __webpack_require__(17); // 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()


module.exports = __webpack_require__(107)(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target

  this._i = 0; // next index

  this._k = kind; // kind
  // 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;

  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }

  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values'); // argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)

Iterators.Arguments = Iterators.Array;
addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

/***/ }),
/* 167 */
/***/ (function(module, exports) {

module.exports = function (done, value) {
  return {
    value: value,
    done: !!done
  };
};

/***/ }),
/* 168 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var regexpExec = __webpack_require__(115);

__webpack_require__(0)({
  target: 'RegExp',
  proto: true,
  forced: regexpExec !== /./.exec
}, {
  exec: regexpExec
});

/***/ }),
/* 169 */
/***/ (function(module, exports, __webpack_require__) {

// 21.2.5.3 get RegExp.prototype.flags()
if (__webpack_require__(8) && /./g.flags != 'g') __webpack_require__(10).f(RegExp.prototype, 'flags', {
  configurable: true,
  get: __webpack_require__(74)
});

/***/ }),
/* 170 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var LIBRARY = __webpack_require__(39);

var global = __webpack_require__(4);

var ctx = __webpack_require__(21);

var classof = __webpack_require__(59);

var $export = __webpack_require__(0);

var isObject = __webpack_require__(3);

var aFunction = __webpack_require__(22);

var anInstance = __webpack_require__(51);

var forOf = __webpack_require__(77);

var speciesConstructor = __webpack_require__(61);

var task = __webpack_require__(171).set;

var microtask = __webpack_require__(337)();

var newPromiseCapabilityModule = __webpack_require__(172);

var perform = __webpack_require__(338);

var userAgent = __webpack_require__(117);

var promiseResolve = __webpack_require__(173);

var PROMISE = 'Promise';
var TypeError = global.TypeError;
var process = global.process;
var versions = process && process.versions;
var v8 = versions && versions.v8 || '';
var $Promise = global[PROMISE];
var isNode = classof(process) == 'process';

var empty = function empty() {
  /* empty */
};

var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;
var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);

    var FakePromise = (promise.constructor = {})[__webpack_require__(5)('species')] = function (exec) {
      exec(empty, empty);
    }; // unhandled rejections tracking support, NodeJS Promise without it fails @@species test


    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
    // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
    // we can't detect it synchronously, so just check versions
    && v8.indexOf('6.6') !== 0 && userAgent.indexOf('Chrome/66') === -1;
  } catch (e) {
    /* empty */
  }
}(); // helpers

var isThenable = function isThenable(it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};

var notify = function notify(promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;

    var run = function run(reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then, exited;

      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }

          if (handler === true) result = value;else {
            if (domain) domain.enter();
            result = handler(value); // may throw

            if (domain) {
              domain.exit();
              exited = true;
            }
          }

          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        if (domain && !exited) domain.exit();
        reject(e);
      }
    };

    while (chain.length > i) {
      run(chain[i++]);
    } // variable length - can't use forEach


    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};

var onUnhandled = function onUnhandled(promise) {
  task.call(global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;

    if (unhandled) {
      result = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global.onunhandledrejection) {
          handler({
            promise: promise,
            reason: value
          });
        } else if ((console = global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      }); // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should

      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    }

    promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};

var isUnhandled = function isUnhandled(promise) {
  return promise._h !== 1 && (promise._a || promise._c).length === 0;
};

var onHandleUnhandled = function onHandleUnhandled(promise) {
  task.call(global, function () {
    var handler;

    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({
        promise: promise,
        reason: promise._v
      });
    }
  });
};

var $reject = function $reject(value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap

  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};

var $resolve = function $resolve(value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap

  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");

    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = {
          _w: promise,
          _d: false
        }; // wrap

        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({
      _w: promise,
      _d: false
    }, e); // wrap
  }
}; // constructor polyfill


if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);

    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  }; // eslint-disable-next-line no-unused-vars


  Internal = function Promise(executor) {
    this._c = []; // <- awaiting reactions

    this._a = undefined; // <- checked in isUnhandled reactions

    this._s = 0; // <- state

    this._d = false; // <- done

    this._v = undefined; // <- value

    this._h = 0; // <- rejection state, 0 - default, 1 - handled, 2 - unhandled

    this._n = false; // <- notify
  };

  Internal.prototype = __webpack_require__(52)($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;

      this._c.push(reaction);

      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function _catch(onRejected) {
      return this.then(undefined, onRejected);
    }
  });

  OwnPromiseCapability = function OwnPromiseCapability() {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };

  newPromiseCapabilityModule.f = newPromiseCapability = function newPromiseCapability(C) {
    return C === $Promise || C === Wrapper ? new OwnPromiseCapability(C) : newGenericPromiseCapability(C);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {
  Promise: $Promise
});

__webpack_require__(47)($Promise, PROMISE);

__webpack_require__(50)(PROMISE);

Wrapper = __webpack_require__(9)[PROMISE]; // statics

$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
  }
});
$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(73)(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});

/***/ }),
/* 171 */
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__(21);

var invoke = __webpack_require__(155);

var html = __webpack_require__(99);

var cel = __webpack_require__(95);

var global = __webpack_require__(4);

var process = global.process;
var setTask = global.setImmediate;
var clearTask = global.clearImmediate;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;

var run = function run() {
  var id = +this; // eslint-disable-next-line no-prototype-builtins

  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};

var listener = function listener(event) {
  run.call(event.data);
}; // Node.js 0.9+ & IE10+ has setImmediate, otherwise:


if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;

    while (arguments.length > i) {
      args.push(arguments[i++]);
    }

    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };

    defer(counter);
    return counter;
  };

  clearTask = function clearImmediate(id) {
    delete queue[id];
  }; // Node.js 0.8-


  if (__webpack_require__(28)(process) == 'process') {
    defer = function defer(id) {
      process.nextTick(ctx(run, id, 1));
    }; // Sphere (JS game engine) Dispatch API

  } else if (Dispatch && Dispatch.now) {
    defer = function defer(id) {
      Dispatch.now(ctx(run, id, 1));
    }; // Browsers with MessageChannel, includes WebWorkers

  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1); // Browsers with postMessage, skip WebWorkers
    // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function defer(id) {
      global.postMessage(id + '', '*');
    };

    global.addEventListener('message', listener, false); // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function defer(id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    }; // Rest old browsers

  } else {
    defer = function defer(id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}

module.exports = {
  set: setTask,
  clear: clearTask
};

/***/ }),
/* 172 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 // 25.4.1.5 NewPromiseCapability(C)

var aFunction = __webpack_require__(22);

function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
}

module.exports.f = function (C) {
  return new PromiseCapability(C);
};

/***/ }),
/* 173 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(2);

var isObject = __webpack_require__(3);

var newPromiseCapability = __webpack_require__(172);

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};

/***/ }),
/* 174 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var dP = __webpack_require__(10).f;

var create = __webpack_require__(41);

var redefineAll = __webpack_require__(52);

var ctx = __webpack_require__(21);

var anInstance = __webpack_require__(51);

var forOf = __webpack_require__(77);

var $iterDefine = __webpack_require__(107);

var step = __webpack_require__(167);

var setSpecies = __webpack_require__(50);

var DESCRIPTORS = __webpack_require__(8);

var fastKey = __webpack_require__(34).fastKey;

var validate = __webpack_require__(45);

var SIZE = DESCRIPTORS ? '_s' : 'size';

var getEntry = function getEntry(that, key) {
  // fast case
  var index = fastKey(key);
  var entry;
  if (index !== 'F') return that._i[index]; // frozen object case

  for (entry = that._f; entry; entry = entry.n) {
    if (entry.k == key) return entry;
  }
};

module.exports = {
  getConstructor: function getConstructor(wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, NAME, '_i');
      that._t = NAME; // collection type

      that._i = create(null); // index

      that._f = undefined; // first entry

      that._l = undefined; // last entry

      that[SIZE] = 0; // size

      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear() {
        for (var that = validate(this, NAME), data = that._i, entry = that._f; entry; entry = entry.n) {
          entry.r = true;
          if (entry.p) entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }

        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function _delete(key) {
        var that = validate(this, NAME);
        var entry = getEntry(that, key);

        if (entry) {
          var next = entry.n;
          var prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if (prev) prev.n = next;
          if (next) next.p = prev;
          if (that._f == entry) that._f = next;
          if (that._l == entry) that._l = prev;
          that[SIZE]--;
        }

        return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn
      /* , that = undefined */
      ) {
        validate(this, NAME);
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
        var entry;

        while (entry = entry ? entry.n : this._f) {
          f(entry.v, entry.k, this); // revert to the last existing entry

          while (entry && entry.r) {
            entry = entry.p;
          }
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key) {
        return !!getEntry(validate(this, NAME), key);
      }
    });
    if (DESCRIPTORS) dP(C.prototype, 'size', {
      get: function get() {
        return validate(this, NAME)[SIZE];
      }
    });
    return C;
  },
  def: function def(that, key, value) {
    var entry = getEntry(that, key);
    var prev, index; // change existing entry

    if (entry) {
      entry.v = value; // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true),
        // <- index
        k: key,
        // <- key
        v: value,
        // <- value
        p: prev = that._l,
        // <- previous entry
        n: undefined,
        // <- next entry
        r: false // <- removed

      };
      if (!that._f) that._f = entry;
      if (prev) prev.n = entry;
      that[SIZE]++; // add to index

      if (index !== 'F') that._i[index] = entry;
    }

    return that;
  },
  getEntry: getEntry,
  setStrong: function setStrong(C, NAME, IS_MAP) {
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function (iterated, kind) {
      this._t = validate(iterated, NAME); // target

      this._k = kind; // kind

      this._l = undefined; // previous
    }, function () {
      var that = this;
      var kind = that._k;
      var entry = that._l; // revert to the last existing entry

      while (entry && entry.r) {
        entry = entry.p;
      } // get next entry


      if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
        // or finish the iteration
        that._t = undefined;
        return step(1);
      } // return step by kind


      if (kind == 'keys') return step(0, entry.k);
      if (kind == 'values') return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true); // add [@@species], 23.1.2.2, 23.2.2.2

    setSpecies(NAME);
  }
};

/***/ }),
/* 175 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var redefineAll = __webpack_require__(52);

var getWeak = __webpack_require__(34).getWeak;

var anObject = __webpack_require__(2);

var isObject = __webpack_require__(3);

var anInstance = __webpack_require__(51);

var forOf = __webpack_require__(77);

var createArrayMethod = __webpack_require__(26);

var $has = __webpack_require__(15);

var validate = __webpack_require__(45);

var arrayFind = createArrayMethod(5);
var arrayFindIndex = createArrayMethod(6);
var id = 0; // fallback for uncaught frozen keys

var uncaughtFrozenStore = function uncaughtFrozenStore(that) {
  return that._l || (that._l = new UncaughtFrozenStore());
};

var UncaughtFrozenStore = function UncaughtFrozenStore() {
  this.a = [];
};

var findUncaughtFrozen = function findUncaughtFrozen(store, key) {
  return arrayFind(store.a, function (it) {
    return it[0] === key;
  });
};

UncaughtFrozenStore.prototype = {
  get: function get(key) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) return entry[1];
  },
  has: function has(key) {
    return !!findUncaughtFrozen(this, key);
  },
  set: function set(key, value) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) entry[1] = value;else this.a.push([key, value]);
  },
  'delete': function _delete(key) {
    var index = arrayFindIndex(this.a, function (it) {
      return it[0] === key;
    });
    if (~index) this.a.splice(index, 1);
    return !!~index;
  }
};
module.exports = {
  getConstructor: function getConstructor(wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, NAME, '_i');
      that._t = NAME; // collection type

      that._i = id++; // collection id

      that._l = undefined; // leak store for uncaught frozen objects

      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.3.3.2 WeakMap.prototype.delete(key)
      // 23.4.3.3 WeakSet.prototype.delete(value)
      'delete': function _delete(key) {
        if (!isObject(key)) return false;
        var data = getWeak(key);
        if (data === true) return uncaughtFrozenStore(validate(this, NAME))['delete'](key);
        return data && $has(data, this._i) && delete data[this._i];
      },
      // 23.3.3.4 WeakMap.prototype.has(key)
      // 23.4.3.4 WeakSet.prototype.has(value)
      has: function has(key) {
        if (!isObject(key)) return false;
        var data = getWeak(key);
        if (data === true) return uncaughtFrozenStore(validate(this, NAME)).has(key);
        return data && $has(data, this._i);
      }
    });
    return C;
  },
  def: function def(that, key, value) {
    var data = getWeak(anObject(key), true);
    if (data === true) uncaughtFrozenStore(that).set(key, value);else data[that._i] = value;
    return that;
  },
  ufstore: uncaughtFrozenStore
};

/***/ }),
/* 176 */
/***/ (function(module, exports, __webpack_require__) {

// https://tc39.github.io/ecma262/#sec-toindex
var toInteger = __webpack_require__(23);

var toLength = __webpack_require__(6);

module.exports = function (it) {
  if (it === undefined) return 0;
  var number = toInteger(it);
  var length = toLength(number);
  if (number !== length) throw RangeError('Wrong length!');
  return length;
};

/***/ }),
/* 177 */
/***/ (function(module, exports, __webpack_require__) {

// all object keys, includes non-enumerable and symbols
var gOPN = __webpack_require__(42);

var gOPS = __webpack_require__(71);

var anObject = __webpack_require__(2);

var Reflect = __webpack_require__(4).Reflect;

module.exports = Reflect && Reflect.ownKeys || function ownKeys(it) {
  var keys = gOPN.f(anObject(it));
  var getSymbols = gOPS.f;
  return getSymbols ? keys.concat(getSymbols(it)) : keys;
};

/***/ }),
/* 178 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-string-pad-start-end
var toLength = __webpack_require__(6);

var repeat = __webpack_require__(103);

var defined = __webpack_require__(29);

module.exports = function (that, maxLength, fillString, left) {
  var S = String(defined(that));
  var stringLength = S.length;
  var fillStr = fillString === undefined ? ' ' : String(fillString);
  var intMaxLength = toLength(maxLength);
  if (intMaxLength <= stringLength || fillStr == '') return S;
  var fillLen = intMaxLength - stringLength;
  var stringFiller = repeat.call(fillStr, Math.ceil(fillLen / fillStr.length));
  if (stringFiller.length > fillLen) stringFiller = stringFiller.slice(0, fillLen);
  return left ? stringFiller + S : S + stringFiller;
};

/***/ }),
/* 179 */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(8);

var getKeys = __webpack_require__(48);

var toIObject = __webpack_require__(17);

var isEnum = __webpack_require__(58).f;

module.exports = function (isEntries) {
  return function (it) {
    var O = toIObject(it);
    var keys = getKeys(O);
    var length = keys.length;
    var i = 0;
    var result = [];
    var key;

    while (length > i) {
      key = keys[i++];

      if (!DESCRIPTORS || isEnum.call(O, key)) {
        result.push(isEntries ? [key, O[key]] : O[key]);
      }
    }

    return result;
  };
};

/***/ }),
/* 180 */
/***/ (function(module, exports) {

var core = module.exports = {
  version: '2.6.11'
};
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

/***/ }),
/* 181 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

/***/ }),
/* 182 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(183);
module.exports = __webpack_require__(406);


/***/ }),
/* 183 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(184);

var _global = _interopRequireDefault(__webpack_require__(393));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

if (_global["default"]._babelPolyfill && typeof console !== "undefined" && console.warn) {
  console.warn("@babel/polyfill is loaded more than once on this page. This is probably not desirable/intended " + "and may have consequences if different versions of the polyfills are applied sequentially. " + "If you do need to load the polyfill more than once, use @babel/polyfill/noConflict " + "instead to bypass the warning.");
}

_global["default"]._babelPolyfill = true;

/***/ }),
/* 184 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_for_each__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(185);
/* harmony import */ var core_js_modules_web_dom_collections_for_each__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_for_each__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(195);
/* harmony import */ var core_js_modules_web_dom_collections_iterator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_web_immediate__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(208);
/* harmony import */ var core_js_modules_web_immediate__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_immediate__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_web_queue_microtask__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(209);
/* harmony import */ var core_js_modules_web_queue_microtask__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_queue_microtask__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var core_js_modules_web_timers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(211);
/* harmony import */ var core_js_modules_web_timers__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_timers__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var core_js_modules_web_url__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(212);
/* harmony import */ var core_js_modules_web_url__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_url__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var core_js_modules_web_url_to_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(224);
/* harmony import */ var core_js_modules_web_url_to_json__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_url_to_json__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var core_js_modules_web_url_search_params__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(146);
/* harmony import */ var core_js_modules_web_url_search_params__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_url_search_params__WEBPACK_IMPORTED_MODULE_7__);











__webpack_require__(225);

__webpack_require__(368);

__webpack_require__(370);

__webpack_require__(373);

__webpack_require__(375);

__webpack_require__(377);

__webpack_require__(379);

__webpack_require__(381);

__webpack_require__(383);

__webpack_require__(385);

__webpack_require__(387);

__webpack_require__(389);

__webpack_require__(391);

/***/ }),
/* 185 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(7);

var DOMIterables = __webpack_require__(122);

var forEach = __webpack_require__(187);

var createNonEnumerableProperty = __webpack_require__(31);

for (var COLLECTION_NAME in DOMIterables) {
  var Collection = global[COLLECTION_NAME];
  var CollectionPrototype = Collection && Collection.prototype; // some Chrome versions have non-configurable methods on DOMTokenList

  if (CollectionPrototype && CollectionPrototype.forEach !== forEach) try {
    createNonEnumerableProperty(CollectionPrototype, 'forEach', forEach);
  } catch (error) {
    CollectionPrototype.forEach = forEach;
  }
}

/***/ }),
/* 186 */
/***/ (function(module, exports) {

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var g; // This works in non-strict mode

g = function () {
  return this;
}();

try {
  // This works if eval is allowed (see CSP)
  g = g || new Function("return this")();
} catch (e) {
  // This works if the window reference is available
  if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
} // g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}


module.exports = g;

/***/ }),
/* 187 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $forEach = __webpack_require__(188).forEach;

var arrayMethodIsStrict = __webpack_require__(193);

var arrayMethodUsesToLength = __webpack_require__(194);

var STRICT_METHOD = arrayMethodIsStrict('forEach');
var USES_TO_LENGTH = arrayMethodUsesToLength('forEach'); // `Array.prototype.forEach` method implementation
// https://tc39.github.io/ecma262/#sec-array.prototype.foreach

module.exports = !STRICT_METHOD || !USES_TO_LENGTH ? function forEach(callbackfn
/* , thisArg */
) {
  return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
} : [].forEach;

/***/ }),
/* 188 */
/***/ (function(module, exports, __webpack_require__) {

var bind = __webpack_require__(62);

var IndexedObject = __webpack_require__(80);

var toObject = __webpack_require__(64);

var toLength = __webpack_require__(82);

var arraySpeciesCreate = __webpack_require__(190);

var push = [].push; // `Array.prototype.{ forEach, map, filter, some, every, find, findIndex }` methods implementation

var createMethod = function createMethod(TYPE) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  return function ($this, callbackfn, that, specificCreate) {
    var O = toObject($this);
    var self = IndexedObject(O);
    var boundFunction = bind(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var create = specificCreate || arraySpeciesCreate;
    var target = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var value, result;

    for (; length > index; index++) {
      if (NO_HOLES || index in self) {
        value = self[index];
        result = boundFunction(value, index, O);

        if (TYPE) {
          if (IS_MAP) target[index] = result; // map
          else if (result) switch (TYPE) {
              case 3:
                return true;
              // some

              case 5:
                return value;
              // find

              case 6:
                return index;
              // findIndex

              case 2:
                push.call(target, value);
              // filter
            } else if (IS_EVERY) return false; // every
        }
      }
    }

    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
  };
};

module.exports = {
  // `Array.prototype.forEach` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
  forEach: createMethod(0),
  // `Array.prototype.map` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.map
  map: createMethod(1),
  // `Array.prototype.filter` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.filter
  filter: createMethod(2),
  // `Array.prototype.some` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.some
  some: createMethod(3),
  // `Array.prototype.every` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.every
  every: createMethod(4),
  // `Array.prototype.find` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.find
  find: createMethod(5),
  // `Array.prototype.findIndex` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
  findIndex: createMethod(6)
};

/***/ }),
/* 189 */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') {
    throw TypeError(String(it) + ' is not a function');
  }

  return it;
};

/***/ }),
/* 190 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(35);

var isArray = __webpack_require__(191);

var wellKnownSymbol = __webpack_require__(13);

var SPECIES = wellKnownSymbol('species'); // `ArraySpeciesCreate` abstract operation
// https://tc39.github.io/ecma262/#sec-arrayspeciescreate

module.exports = function (originalArray, length) {
  var C;

  if (isArray(originalArray)) {
    C = originalArray.constructor; // cross-realm fallback

    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;else if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  }

  return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
};

/***/ }),
/* 191 */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(63); // `IsArray` abstract operation
// https://tc39.github.io/ecma262/#sec-isarray


module.exports = Array.isArray || function isArray(arg) {
  return classof(arg) == 'Array';
};

/***/ }),
/* 192 */
/***/ (function(module, exports, __webpack_require__) {

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var NATIVE_SYMBOL = __webpack_require__(126);

module.exports = NATIVE_SYMBOL // eslint-disable-next-line no-undef
&& !Symbol.sham // eslint-disable-next-line no-undef
&& _typeof(Symbol.iterator) == 'symbol';

/***/ }),
/* 193 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var fails = __webpack_require__(18);

module.exports = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call,no-throw-literal
    method.call(null, argument || function () {
      throw 1;
    }, 1);
  });
};

/***/ }),
/* 194 */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(32);

var fails = __webpack_require__(18);

var has = __webpack_require__(14);

var defineProperty = Object.defineProperty;
var cache = {};

var thrower = function thrower(it) {
  throw it;
};

module.exports = function (METHOD_NAME, options) {
  if (has(cache, METHOD_NAME)) return cache[METHOD_NAME];
  if (!options) options = {};
  var method = [][METHOD_NAME];
  var ACCESSORS = has(options, 'ACCESSORS') ? options.ACCESSORS : false;
  var argument0 = has(options, 0) ? options[0] : thrower;
  var argument1 = has(options, 1) ? options[1] : undefined;
  return cache[METHOD_NAME] = !!method && !fails(function () {
    if (ACCESSORS && !DESCRIPTORS) return true;
    var O = {
      length: -1
    };
    if (ACCESSORS) defineProperty(O, 1, {
      enumerable: true,
      get: thrower
    });else O[1] = 1;
    method.call(O, argument0, argument1);
  });
};

/***/ }),
/* 195 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(7);

var DOMIterables = __webpack_require__(122);

var ArrayIteratorMethods = __webpack_require__(127);

var createNonEnumerableProperty = __webpack_require__(31);

var wellKnownSymbol = __webpack_require__(13);

var ITERATOR = wellKnownSymbol('iterator');
var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var ArrayValues = ArrayIteratorMethods.values;

for (var COLLECTION_NAME in DOMIterables) {
  var Collection = global[COLLECTION_NAME];
  var CollectionPrototype = Collection && Collection.prototype;

  if (CollectionPrototype) {
    // some Chrome versions have non-configurable methods on DOMTokenList
    if (CollectionPrototype[ITERATOR] !== ArrayValues) try {
      createNonEnumerableProperty(CollectionPrototype, ITERATOR, ArrayValues);
    } catch (error) {
      CollectionPrototype[ITERATOR] = ArrayValues;
    }

    if (!CollectionPrototype[TO_STRING_TAG]) {
      createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG, COLLECTION_NAME);
    }

    if (DOMIterables[COLLECTION_NAME]) for (var METHOD_NAME in ArrayIteratorMethods) {
      // some Chrome versions have non-configurable methods on DOMTokenList
      if (CollectionPrototype[METHOD_NAME] !== ArrayIteratorMethods[METHOD_NAME]) try {
        createNonEnumerableProperty(CollectionPrototype, METHOD_NAME, ArrayIteratorMethods[METHOD_NAME]);
      } catch (error) {
        CollectionPrototype[METHOD_NAME] = ArrayIteratorMethods[METHOD_NAME];
      }
    }
  }
}

/***/ }),
/* 196 */
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(13);

var create = __webpack_require__(88);

var definePropertyModule = __webpack_require__(46);

var UNSCOPABLES = wellKnownSymbol('unscopables');
var ArrayPrototype = Array.prototype; // Array.prototype[@@unscopables]
// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables

if (ArrayPrototype[UNSCOPABLES] == undefined) {
  definePropertyModule.f(ArrayPrototype, UNSCOPABLES, {
    configurable: true,
    value: create(null)
  });
} // add a key to Array.prototype[@@unscopables]


module.exports = function (key) {
  ArrayPrototype[UNSCOPABLES][key] = true;
};

/***/ }),
/* 197 */
/***/ (function(module, exports, __webpack_require__) {

var toIndexedObject = __webpack_require__(66);

var toLength = __webpack_require__(82);

var toAbsoluteIndex = __webpack_require__(198); // `Array.prototype.{ indexOf, includes }` methods implementation


var createMethod = function createMethod(IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value; // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare

    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++]; // eslint-disable-next-line no-self-compare

      if (value != value) return true; // Array#indexOf ignores holes, Array#includes - not
    } else for (; length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    }
    return !IS_INCLUDES && -1;
  };
};

module.exports = {
  // `Array.prototype.includes` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};

/***/ }),
/* 198 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(83);

var max = Math.max;
var min = Math.min; // Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).

module.exports = function (index, length) {
  var integer = toInteger(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};

/***/ }),
/* 199 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(7);

module.exports = global;

/***/ }),
/* 200 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(7);

var inspectSource = __webpack_require__(132);

var WeakMap = global.WeakMap;
module.exports = typeof WeakMap === 'function' && /native code/.test(inspectSource(WeakMap));

/***/ }),
/* 201 */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(14);

var ownKeys = __webpack_require__(202);

var getOwnPropertyDescriptorModule = __webpack_require__(92);

var definePropertyModule = __webpack_require__(46);

module.exports = function (target, source) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
  }
};

/***/ }),
/* 202 */
/***/ (function(module, exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(67);

var getOwnPropertyNamesModule = __webpack_require__(203);

var getOwnPropertySymbolsModule = __webpack_require__(135);

var anObject = __webpack_require__(27); // all object keys, includes non-enumerable and symbols


module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
};

/***/ }),
/* 203 */
/***/ (function(module, exports, __webpack_require__) {

var internalObjectKeys = __webpack_require__(130);

var enumBugKeys = __webpack_require__(90);

var hiddenKeys = enumBugKeys.concat('length', 'prototype'); // `Object.getOwnPropertyNames` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertynames

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};

/***/ }),
/* 204 */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(18);

var replacement = /#|\.prototype\./;

var isForced = function isForced(feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true : value == NATIVE ? false : typeof detection == 'function' ? fails(detection) : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';
module.exports = isForced;

/***/ }),
/* 205 */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(18);

module.exports = !fails(function () {
  function F() {
    /* empty */
  }

  F.prototype.constructor = null;
  return Object.getPrototypeOf(new F()) !== F.prototype;
});

/***/ }),
/* 206 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(27);

var aPossiblePrototype = __webpack_require__(207); // `Object.setPrototypeOf` method
// https://tc39.github.io/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.

/* eslint-disable no-proto */


module.exports = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;

  try {
    setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
    setter.call(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) {
    /* empty */
  }

  return function setPrototypeOf(O, proto) {
    anObject(O);
    aPossiblePrototype(proto);
    if (CORRECT_SETTER) setter.call(O, proto);else O.__proto__ = proto;
    return O;
  };
}() : undefined);

/***/ }),
/* 207 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(35);

module.exports = function (it) {
  if (!isObject(it) && it !== null) {
    throw TypeError("Can't set " + String(it) + ' as a prototype');
  }

  return it;
};

/***/ }),
/* 208 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(36);

var global = __webpack_require__(7);

var task = __webpack_require__(139);

var FORCED = !global.setImmediate || !global.clearImmediate; // http://w3c.github.io/setImmediate/

$({
  global: true,
  bind: true,
  enumerable: true,
  forced: FORCED
}, {
  // `setImmediate` method
  // http://w3c.github.io/setImmediate/#si-setImmediate
  setImmediate: task.set,
  // `clearImmediate` method
  // http://w3c.github.io/setImmediate/#si-clearImmediate
  clearImmediate: task.clear
});

/***/ }),
/* 209 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(36);

var global = __webpack_require__(7);

var microtask = __webpack_require__(210);

var IS_NODE = __webpack_require__(93);

var process = global.process; // `queueMicrotask` method
// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-queuemicrotask

$({
  global: true,
  enumerable: true,
  noTargetGet: true
}, {
  queueMicrotask: function queueMicrotask(fn) {
    var domain = IS_NODE && process.domain;
    microtask(domain ? domain.bind(fn) : fn);
  }
});

/***/ }),
/* 210 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(7);

var getOwnPropertyDescriptor = __webpack_require__(92).f;

var macrotask = __webpack_require__(139).set;

var IS_IOS = __webpack_require__(140);

var IS_NODE = __webpack_require__(93);

var MutationObserver = global.MutationObserver || global.WebKitMutationObserver;
var document = global.document;
var process = global.process;
var Promise = global.Promise; // Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`

var queueMicrotaskDescriptor = getOwnPropertyDescriptor(global, 'queueMicrotask');
var queueMicrotask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;
var flush, head, last, notify, toggle, node, promise, then; // modern engines have queueMicrotask method

if (!queueMicrotask) {
  flush = function flush() {
    var parent, fn;
    if (IS_NODE && (parent = process.domain)) parent.exit();

    while (head) {
      fn = head.fn;
      head = head.next;

      try {
        fn();
      } catch (error) {
        if (head) notify();else last = undefined;
        throw error;
      }
    }

    last = undefined;
    if (parent) parent.enter();
  }; // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339


  if (!IS_IOS && !IS_NODE && MutationObserver && document) {
    toggle = true;
    node = document.createTextNode('');
    new MutationObserver(flush).observe(node, {
      characterData: true
    });

    notify = function notify() {
      node.data = toggle = !toggle;
    }; // environments with maybe non-completely correct, but existent Promise

  } else if (Promise && Promise.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    promise = Promise.resolve(undefined);
    then = promise.then;

    notify = function notify() {
      then.call(promise, flush);
    }; // Node.js without promises

  } else if (IS_NODE) {
    notify = function notify() {
      process.nextTick(flush);
    }; // for other environments - macrotask based on:
    // - setImmediate
    // - MessageChannel
    // - window.postMessag
    // - onreadystatechange
    // - setTimeout

  } else {
    notify = function notify() {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }
}

module.exports = queueMicrotask || function (fn) {
  var task = {
    fn: fn,
    next: undefined
  };
  if (last) last.next = task;

  if (!head) {
    head = task;
    notify();
  }

  last = task;
};

/***/ }),
/* 211 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(36);

var global = __webpack_require__(7);

var userAgent = __webpack_require__(141);

var slice = [].slice;
var MSIE = /MSIE .\./.test(userAgent); // <- dirty ie9- check

var wrap = function wrap(scheduler) {
  return function (handler, timeout
  /* , ...arguments */
  ) {
    var boundArgs = arguments.length > 2;
    var args = boundArgs ? slice.call(arguments, 2) : undefined;
    return scheduler(boundArgs ? function () {
      // eslint-disable-next-line no-new-func
      (typeof handler == 'function' ? handler : Function(handler)).apply(this, args);
    } : handler, timeout);
  };
}; // ie9- setTimeout & setInterval additional parameters fix
// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers


$({
  global: true,
  bind: true,
  forced: MSIE
}, {
  // `setTimeout` method
  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-settimeout
  setTimeout: wrap(global.setTimeout),
  // `setInterval` method
  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-setinterval
  setInterval: wrap(global.setInterval)
});

/***/ }),
/* 212 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 // TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

__webpack_require__(213);

var $ = __webpack_require__(36);

var DESCRIPTORS = __webpack_require__(32);

var USE_NATIVE_URL = __webpack_require__(143);

var global = __webpack_require__(7);

var defineProperties = __webpack_require__(128);

var redefine = __webpack_require__(56);

var anInstance = __webpack_require__(144);

var has = __webpack_require__(14);

var assign = __webpack_require__(214);

var arrayFrom = __webpack_require__(215);

var codeAt = __webpack_require__(142).codeAt;

var toASCII = __webpack_require__(221);

var setToStringTag = __webpack_require__(68);

var URLSearchParamsModule = __webpack_require__(146);

var InternalStateModule = __webpack_require__(55);

var NativeURL = global.URL;
var URLSearchParams = URLSearchParamsModule.URLSearchParams;
var getInternalSearchParamsState = URLSearchParamsModule.getState;
var setInternalState = InternalStateModule.set;
var getInternalURLState = InternalStateModule.getterFor('URL');
var floor = Math.floor;
var pow = Math.pow;
var INVALID_AUTHORITY = 'Invalid authority';
var INVALID_SCHEME = 'Invalid scheme';
var INVALID_HOST = 'Invalid host';
var INVALID_PORT = 'Invalid port';
var ALPHA = /[A-Za-z]/;
var ALPHANUMERIC = /[\d+-.A-Za-z]/;
var DIGIT = /\d/;
var HEX_START = /^(0x|0X)/;
var OCT = /^[0-7]+$/;
var DEC = /^\d+$/;
var HEX = /^[\dA-Fa-f]+$/; // eslint-disable-next-line no-control-regex

var FORBIDDEN_HOST_CODE_POINT = /[\u0000\u0009\u000A\u000D #%/:?@[\\]]/; // eslint-disable-next-line no-control-regex

var FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT = /[\u0000\u0009\u000A\u000D #/:?@[\\]]/; // eslint-disable-next-line no-control-regex

var LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE = /^[\u0000-\u001F ]+|[\u0000-\u001F ]+$/g; // eslint-disable-next-line no-control-regex

var TAB_AND_NEW_LINE = /[\u0009\u000A\u000D]/g;
var EOF;

var parseHost = function parseHost(url, input) {
  var result, codePoints, index;

  if (input.charAt(0) == '[') {
    if (input.charAt(input.length - 1) != ']') return INVALID_HOST;
    result = parseIPv6(input.slice(1, -1));
    if (!result) return INVALID_HOST;
    url.host = result; // opaque host
  } else if (!isSpecial(url)) {
    if (FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT.test(input)) return INVALID_HOST;
    result = '';
    codePoints = arrayFrom(input);

    for (index = 0; index < codePoints.length; index++) {
      result += percentEncode(codePoints[index], C0ControlPercentEncodeSet);
    }

    url.host = result;
  } else {
    input = toASCII(input);
    if (FORBIDDEN_HOST_CODE_POINT.test(input)) return INVALID_HOST;
    result = parseIPv4(input);
    if (result === null) return INVALID_HOST;
    url.host = result;
  }
};

var parseIPv4 = function parseIPv4(input) {
  var parts = input.split('.');
  var partsLength, numbers, index, part, radix, number, ipv4;

  if (parts.length && parts[parts.length - 1] == '') {
    parts.pop();
  }

  partsLength = parts.length;
  if (partsLength > 4) return input;
  numbers = [];

  for (index = 0; index < partsLength; index++) {
    part = parts[index];
    if (part == '') return input;
    radix = 10;

    if (part.length > 1 && part.charAt(0) == '0') {
      radix = HEX_START.test(part) ? 16 : 8;
      part = part.slice(radix == 8 ? 1 : 2);
    }

    if (part === '') {
      number = 0;
    } else {
      if (!(radix == 10 ? DEC : radix == 8 ? OCT : HEX).test(part)) return input;
      number = parseInt(part, radix);
    }

    numbers.push(number);
  }

  for (index = 0; index < partsLength; index++) {
    number = numbers[index];

    if (index == partsLength - 1) {
      if (number >= pow(256, 5 - partsLength)) return null;
    } else if (number > 255) return null;
  }

  ipv4 = numbers.pop();

  for (index = 0; index < numbers.length; index++) {
    ipv4 += numbers[index] * pow(256, 3 - index);
  }

  return ipv4;
}; // eslint-disable-next-line max-statements


var parseIPv6 = function parseIPv6(input) {
  var address = [0, 0, 0, 0, 0, 0, 0, 0];
  var pieceIndex = 0;
  var compress = null;
  var pointer = 0;
  var value, length, numbersSeen, ipv4Piece, number, swaps, swap;

  var _char = function _char() {
    return input.charAt(pointer);
  };

  if (_char() == ':') {
    if (input.charAt(1) != ':') return;
    pointer += 2;
    pieceIndex++;
    compress = pieceIndex;
  }

  while (_char()) {
    if (pieceIndex == 8) return;

    if (_char() == ':') {
      if (compress !== null) return;
      pointer++;
      pieceIndex++;
      compress = pieceIndex;
      continue;
    }

    value = length = 0;

    while (length < 4 && HEX.test(_char())) {
      value = value * 16 + parseInt(_char(), 16);
      pointer++;
      length++;
    }

    if (_char() == '.') {
      if (length == 0) return;
      pointer -= length;
      if (pieceIndex > 6) return;
      numbersSeen = 0;

      while (_char()) {
        ipv4Piece = null;

        if (numbersSeen > 0) {
          if (_char() == '.' && numbersSeen < 4) pointer++;else return;
        }

        if (!DIGIT.test(_char())) return;

        while (DIGIT.test(_char())) {
          number = parseInt(_char(), 10);
          if (ipv4Piece === null) ipv4Piece = number;else if (ipv4Piece == 0) return;else ipv4Piece = ipv4Piece * 10 + number;
          if (ipv4Piece > 255) return;
          pointer++;
        }

        address[pieceIndex] = address[pieceIndex] * 256 + ipv4Piece;
        numbersSeen++;
        if (numbersSeen == 2 || numbersSeen == 4) pieceIndex++;
      }

      if (numbersSeen != 4) return;
      break;
    } else if (_char() == ':') {
      pointer++;
      if (!_char()) return;
    } else if (_char()) return;

    address[pieceIndex++] = value;
  }

  if (compress !== null) {
    swaps = pieceIndex - compress;
    pieceIndex = 7;

    while (pieceIndex != 0 && swaps > 0) {
      swap = address[pieceIndex];
      address[pieceIndex--] = address[compress + swaps - 1];
      address[compress + --swaps] = swap;
    }
  } else if (pieceIndex != 8) return;

  return address;
};

var findLongestZeroSequence = function findLongestZeroSequence(ipv6) {
  var maxIndex = null;
  var maxLength = 1;
  var currStart = null;
  var currLength = 0;
  var index = 0;

  for (; index < 8; index++) {
    if (ipv6[index] !== 0) {
      if (currLength > maxLength) {
        maxIndex = currStart;
        maxLength = currLength;
      }

      currStart = null;
      currLength = 0;
    } else {
      if (currStart === null) currStart = index;
      ++currLength;
    }
  }

  if (currLength > maxLength) {
    maxIndex = currStart;
    maxLength = currLength;
  }

  return maxIndex;
};

var serializeHost = function serializeHost(host) {
  var result, index, compress, ignore0; // ipv4

  if (typeof host == 'number') {
    result = [];

    for (index = 0; index < 4; index++) {
      result.unshift(host % 256);
      host = floor(host / 256);
    }

    return result.join('.'); // ipv6
  } else if (_typeof(host) == 'object') {
    result = '';
    compress = findLongestZeroSequence(host);

    for (index = 0; index < 8; index++) {
      if (ignore0 && host[index] === 0) continue;
      if (ignore0) ignore0 = false;

      if (compress === index) {
        result += index ? ':' : '::';
        ignore0 = true;
      } else {
        result += host[index].toString(16);
        if (index < 7) result += ':';
      }
    }

    return '[' + result + ']';
  }

  return host;
};

var C0ControlPercentEncodeSet = {};
var fragmentPercentEncodeSet = assign({}, C0ControlPercentEncodeSet, {
  ' ': 1,
  '"': 1,
  '<': 1,
  '>': 1,
  '`': 1
});
var pathPercentEncodeSet = assign({}, fragmentPercentEncodeSet, {
  '#': 1,
  '?': 1,
  '{': 1,
  '}': 1
});
var userinfoPercentEncodeSet = assign({}, pathPercentEncodeSet, {
  '/': 1,
  ':': 1,
  ';': 1,
  '=': 1,
  '@': 1,
  '[': 1,
  '\\': 1,
  ']': 1,
  '^': 1,
  '|': 1
});

var percentEncode = function percentEncode(_char2, set) {
  var code = codeAt(_char2, 0);
  return code > 0x20 && code < 0x7F && !has(set, _char2) ? _char2 : encodeURIComponent(_char2);
};

var specialSchemes = {
  ftp: 21,
  file: null,
  http: 80,
  https: 443,
  ws: 80,
  wss: 443
};

var isSpecial = function isSpecial(url) {
  return has(specialSchemes, url.scheme);
};

var includesCredentials = function includesCredentials(url) {
  return url.username != '' || url.password != '';
};

var cannotHaveUsernamePasswordPort = function cannotHaveUsernamePasswordPort(url) {
  return !url.host || url.cannotBeABaseURL || url.scheme == 'file';
};

var isWindowsDriveLetter = function isWindowsDriveLetter(string, normalized) {
  var second;
  return string.length == 2 && ALPHA.test(string.charAt(0)) && ((second = string.charAt(1)) == ':' || !normalized && second == '|');
};

var startsWithWindowsDriveLetter = function startsWithWindowsDriveLetter(string) {
  var third;
  return string.length > 1 && isWindowsDriveLetter(string.slice(0, 2)) && (string.length == 2 || (third = string.charAt(2)) === '/' || third === '\\' || third === '?' || third === '#');
};

var shortenURLsPath = function shortenURLsPath(url) {
  var path = url.path;
  var pathSize = path.length;

  if (pathSize && (url.scheme != 'file' || pathSize != 1 || !isWindowsDriveLetter(path[0], true))) {
    path.pop();
  }
};

var isSingleDot = function isSingleDot(segment) {
  return segment === '.' || segment.toLowerCase() === '%2e';
};

var isDoubleDot = function isDoubleDot(segment) {
  segment = segment.toLowerCase();
  return segment === '..' || segment === '%2e.' || segment === '.%2e' || segment === '%2e%2e';
}; // States:


var SCHEME_START = {};
var SCHEME = {};
var NO_SCHEME = {};
var SPECIAL_RELATIVE_OR_AUTHORITY = {};
var PATH_OR_AUTHORITY = {};
var RELATIVE = {};
var RELATIVE_SLASH = {};
var SPECIAL_AUTHORITY_SLASHES = {};
var SPECIAL_AUTHORITY_IGNORE_SLASHES = {};
var AUTHORITY = {};
var HOST = {};
var HOSTNAME = {};
var PORT = {};
var FILE = {};
var FILE_SLASH = {};
var FILE_HOST = {};
var PATH_START = {};
var PATH = {};
var CANNOT_BE_A_BASE_URL_PATH = {};
var QUERY = {};
var FRAGMENT = {}; // eslint-disable-next-line max-statements

var parseURL = function parseURL(url, input, stateOverride, base) {
  var state = stateOverride || SCHEME_START;
  var pointer = 0;
  var buffer = '';
  var seenAt = false;
  var seenBracket = false;
  var seenPasswordToken = false;

  var codePoints, _char3, bufferCodePoints, failure;

  if (!stateOverride) {
    url.scheme = '';
    url.username = '';
    url.password = '';
    url.host = null;
    url.port = null;
    url.path = [];
    url.query = null;
    url.fragment = null;
    url.cannotBeABaseURL = false;
    input = input.replace(LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE, '');
  }

  input = input.replace(TAB_AND_NEW_LINE, '');
  codePoints = arrayFrom(input);

  while (pointer <= codePoints.length) {
    _char3 = codePoints[pointer];

    switch (state) {
      case SCHEME_START:
        if (_char3 && ALPHA.test(_char3)) {
          buffer += _char3.toLowerCase();
          state = SCHEME;
        } else if (!stateOverride) {
          state = NO_SCHEME;
          continue;
        } else return INVALID_SCHEME;

        break;

      case SCHEME:
        if (_char3 && (ALPHANUMERIC.test(_char3) || _char3 == '+' || _char3 == '-' || _char3 == '.')) {
          buffer += _char3.toLowerCase();
        } else if (_char3 == ':') {
          if (stateOverride && (isSpecial(url) != has(specialSchemes, buffer) || buffer == 'file' && (includesCredentials(url) || url.port !== null) || url.scheme == 'file' && !url.host)) return;
          url.scheme = buffer;

          if (stateOverride) {
            if (isSpecial(url) && specialSchemes[url.scheme] == url.port) url.port = null;
            return;
          }

          buffer = '';

          if (url.scheme == 'file') {
            state = FILE;
          } else if (isSpecial(url) && base && base.scheme == url.scheme) {
            state = SPECIAL_RELATIVE_OR_AUTHORITY;
          } else if (isSpecial(url)) {
            state = SPECIAL_AUTHORITY_SLASHES;
          } else if (codePoints[pointer + 1] == '/') {
            state = PATH_OR_AUTHORITY;
            pointer++;
          } else {
            url.cannotBeABaseURL = true;
            url.path.push('');
            state = CANNOT_BE_A_BASE_URL_PATH;
          }
        } else if (!stateOverride) {
          buffer = '';
          state = NO_SCHEME;
          pointer = 0;
          continue;
        } else return INVALID_SCHEME;

        break;

      case NO_SCHEME:
        if (!base || base.cannotBeABaseURL && _char3 != '#') return INVALID_SCHEME;

        if (base.cannotBeABaseURL && _char3 == '#') {
          url.scheme = base.scheme;
          url.path = base.path.slice();
          url.query = base.query;
          url.fragment = '';
          url.cannotBeABaseURL = true;
          state = FRAGMENT;
          break;
        }

        state = base.scheme == 'file' ? FILE : RELATIVE;
        continue;

      case SPECIAL_RELATIVE_OR_AUTHORITY:
        if (_char3 == '/' && codePoints[pointer + 1] == '/') {
          state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
          pointer++;
        } else {
          state = RELATIVE;
          continue;
        }

        break;

      case PATH_OR_AUTHORITY:
        if (_char3 == '/') {
          state = AUTHORITY;
          break;
        } else {
          state = PATH;
          continue;
        }

      case RELATIVE:
        url.scheme = base.scheme;

        if (_char3 == EOF) {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.query = base.query;
        } else if (_char3 == '/' || _char3 == '\\' && isSpecial(url)) {
          state = RELATIVE_SLASH;
        } else if (_char3 == '?') {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.query = '';
          state = QUERY;
        } else if (_char3 == '#') {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.query = base.query;
          url.fragment = '';
          state = FRAGMENT;
        } else {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.path.pop();
          state = PATH;
          continue;
        }

        break;

      case RELATIVE_SLASH:
        if (isSpecial(url) && (_char3 == '/' || _char3 == '\\')) {
          state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
        } else if (_char3 == '/') {
          state = AUTHORITY;
        } else {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          state = PATH;
          continue;
        }

        break;

      case SPECIAL_AUTHORITY_SLASHES:
        state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
        if (_char3 != '/' || buffer.charAt(pointer + 1) != '/') continue;
        pointer++;
        break;

      case SPECIAL_AUTHORITY_IGNORE_SLASHES:
        if (_char3 != '/' && _char3 != '\\') {
          state = AUTHORITY;
          continue;
        }

        break;

      case AUTHORITY:
        if (_char3 == '@') {
          if (seenAt) buffer = '%40' + buffer;
          seenAt = true;
          bufferCodePoints = arrayFrom(buffer);

          for (var i = 0; i < bufferCodePoints.length; i++) {
            var codePoint = bufferCodePoints[i];

            if (codePoint == ':' && !seenPasswordToken) {
              seenPasswordToken = true;
              continue;
            }

            var encodedCodePoints = percentEncode(codePoint, userinfoPercentEncodeSet);
            if (seenPasswordToken) url.password += encodedCodePoints;else url.username += encodedCodePoints;
          }

          buffer = '';
        } else if (_char3 == EOF || _char3 == '/' || _char3 == '?' || _char3 == '#' || _char3 == '\\' && isSpecial(url)) {
          if (seenAt && buffer == '') return INVALID_AUTHORITY;
          pointer -= arrayFrom(buffer).length + 1;
          buffer = '';
          state = HOST;
        } else buffer += _char3;

        break;

      case HOST:
      case HOSTNAME:
        if (stateOverride && url.scheme == 'file') {
          state = FILE_HOST;
          continue;
        } else if (_char3 == ':' && !seenBracket) {
          if (buffer == '') return INVALID_HOST;
          failure = parseHost(url, buffer);
          if (failure) return failure;
          buffer = '';
          state = PORT;
          if (stateOverride == HOSTNAME) return;
        } else if (_char3 == EOF || _char3 == '/' || _char3 == '?' || _char3 == '#' || _char3 == '\\' && isSpecial(url)) {
          if (isSpecial(url) && buffer == '') return INVALID_HOST;
          if (stateOverride && buffer == '' && (includesCredentials(url) || url.port !== null)) return;
          failure = parseHost(url, buffer);
          if (failure) return failure;
          buffer = '';
          state = PATH_START;
          if (stateOverride) return;
          continue;
        } else {
          if (_char3 == '[') seenBracket = true;else if (_char3 == ']') seenBracket = false;
          buffer += _char3;
        }

        break;

      case PORT:
        if (DIGIT.test(_char3)) {
          buffer += _char3;
        } else if (_char3 == EOF || _char3 == '/' || _char3 == '?' || _char3 == '#' || _char3 == '\\' && isSpecial(url) || stateOverride) {
          if (buffer != '') {
            var port = parseInt(buffer, 10);
            if (port > 0xFFFF) return INVALID_PORT;
            url.port = isSpecial(url) && port === specialSchemes[url.scheme] ? null : port;
            buffer = '';
          }

          if (stateOverride) return;
          state = PATH_START;
          continue;
        } else return INVALID_PORT;

        break;

      case FILE:
        url.scheme = 'file';
        if (_char3 == '/' || _char3 == '\\') state = FILE_SLASH;else if (base && base.scheme == 'file') {
          if (_char3 == EOF) {
            url.host = base.host;
            url.path = base.path.slice();
            url.query = base.query;
          } else if (_char3 == '?') {
            url.host = base.host;
            url.path = base.path.slice();
            url.query = '';
            state = QUERY;
          } else if (_char3 == '#') {
            url.host = base.host;
            url.path = base.path.slice();
            url.query = base.query;
            url.fragment = '';
            state = FRAGMENT;
          } else {
            if (!startsWithWindowsDriveLetter(codePoints.slice(pointer).join(''))) {
              url.host = base.host;
              url.path = base.path.slice();
              shortenURLsPath(url);
            }

            state = PATH;
            continue;
          }
        } else {
          state = PATH;
          continue;
        }
        break;

      case FILE_SLASH:
        if (_char3 == '/' || _char3 == '\\') {
          state = FILE_HOST;
          break;
        }

        if (base && base.scheme == 'file' && !startsWithWindowsDriveLetter(codePoints.slice(pointer).join(''))) {
          if (isWindowsDriveLetter(base.path[0], true)) url.path.push(base.path[0]);else url.host = base.host;
        }

        state = PATH;
        continue;

      case FILE_HOST:
        if (_char3 == EOF || _char3 == '/' || _char3 == '\\' || _char3 == '?' || _char3 == '#') {
          if (!stateOverride && isWindowsDriveLetter(buffer)) {
            state = PATH;
          } else if (buffer == '') {
            url.host = '';
            if (stateOverride) return;
            state = PATH_START;
          } else {
            failure = parseHost(url, buffer);
            if (failure) return failure;
            if (url.host == 'localhost') url.host = '';
            if (stateOverride) return;
            buffer = '';
            state = PATH_START;
          }

          continue;
        } else buffer += _char3;

        break;

      case PATH_START:
        if (isSpecial(url)) {
          state = PATH;
          if (_char3 != '/' && _char3 != '\\') continue;
        } else if (!stateOverride && _char3 == '?') {
          url.query = '';
          state = QUERY;
        } else if (!stateOverride && _char3 == '#') {
          url.fragment = '';
          state = FRAGMENT;
        } else if (_char3 != EOF) {
          state = PATH;
          if (_char3 != '/') continue;
        }

        break;

      case PATH:
        if (_char3 == EOF || _char3 == '/' || _char3 == '\\' && isSpecial(url) || !stateOverride && (_char3 == '?' || _char3 == '#')) {
          if (isDoubleDot(buffer)) {
            shortenURLsPath(url);

            if (_char3 != '/' && !(_char3 == '\\' && isSpecial(url))) {
              url.path.push('');
            }
          } else if (isSingleDot(buffer)) {
            if (_char3 != '/' && !(_char3 == '\\' && isSpecial(url))) {
              url.path.push('');
            }
          } else {
            if (url.scheme == 'file' && !url.path.length && isWindowsDriveLetter(buffer)) {
              if (url.host) url.host = '';
              buffer = buffer.charAt(0) + ':'; // normalize windows drive letter
            }

            url.path.push(buffer);
          }

          buffer = '';

          if (url.scheme == 'file' && (_char3 == EOF || _char3 == '?' || _char3 == '#')) {
            while (url.path.length > 1 && url.path[0] === '') {
              url.path.shift();
            }
          }

          if (_char3 == '?') {
            url.query = '';
            state = QUERY;
          } else if (_char3 == '#') {
            url.fragment = '';
            state = FRAGMENT;
          }
        } else {
          buffer += percentEncode(_char3, pathPercentEncodeSet);
        }

        break;

      case CANNOT_BE_A_BASE_URL_PATH:
        if (_char3 == '?') {
          url.query = '';
          state = QUERY;
        } else if (_char3 == '#') {
          url.fragment = '';
          state = FRAGMENT;
        } else if (_char3 != EOF) {
          url.path[0] += percentEncode(_char3, C0ControlPercentEncodeSet);
        }

        break;

      case QUERY:
        if (!stateOverride && _char3 == '#') {
          url.fragment = '';
          state = FRAGMENT;
        } else if (_char3 != EOF) {
          if (_char3 == "'" && isSpecial(url)) url.query += '%27';else if (_char3 == '#') url.query += '%23';else url.query += percentEncode(_char3, C0ControlPercentEncodeSet);
        }

        break;

      case FRAGMENT:
        if (_char3 != EOF) url.fragment += percentEncode(_char3, fragmentPercentEncodeSet);
        break;
    }

    pointer++;
  }
}; // `URL` constructor
// https://url.spec.whatwg.org/#url-class


var URLConstructor = function URL(url
/* , base */
) {
  var that = anInstance(this, URLConstructor, 'URL');
  var base = arguments.length > 1 ? arguments[1] : undefined;
  var urlString = String(url);
  var state = setInternalState(that, {
    type: 'URL'
  });
  var baseState, failure;

  if (base !== undefined) {
    if (base instanceof URLConstructor) baseState = getInternalURLState(base);else {
      failure = parseURL(baseState = {}, String(base));
      if (failure) throw TypeError(failure);
    }
  }

  failure = parseURL(state, urlString, null, baseState);
  if (failure) throw TypeError(failure);
  var searchParams = state.searchParams = new URLSearchParams();
  var searchParamsState = getInternalSearchParamsState(searchParams);
  searchParamsState.updateSearchParams(state.query);

  searchParamsState.updateURL = function () {
    state.query = String(searchParams) || null;
  };

  if (!DESCRIPTORS) {
    that.href = serializeURL.call(that);
    that.origin = getOrigin.call(that);
    that.protocol = getProtocol.call(that);
    that.username = getUsername.call(that);
    that.password = getPassword.call(that);
    that.host = getHost.call(that);
    that.hostname = getHostname.call(that);
    that.port = getPort.call(that);
    that.pathname = getPathname.call(that);
    that.search = getSearch.call(that);
    that.searchParams = getSearchParams.call(that);
    that.hash = getHash.call(that);
  }
};

var URLPrototype = URLConstructor.prototype;

var serializeURL = function serializeURL() {
  var url = getInternalURLState(this);
  var scheme = url.scheme;
  var username = url.username;
  var password = url.password;
  var host = url.host;
  var port = url.port;
  var path = url.path;
  var query = url.query;
  var fragment = url.fragment;
  var output = scheme + ':';

  if (host !== null) {
    output += '//';

    if (includesCredentials(url)) {
      output += username + (password ? ':' + password : '') + '@';
    }

    output += serializeHost(host);
    if (port !== null) output += ':' + port;
  } else if (scheme == 'file') output += '//';

  output += url.cannotBeABaseURL ? path[0] : path.length ? '/' + path.join('/') : '';
  if (query !== null) output += '?' + query;
  if (fragment !== null) output += '#' + fragment;
  return output;
};

var getOrigin = function getOrigin() {
  var url = getInternalURLState(this);
  var scheme = url.scheme;
  var port = url.port;
  if (scheme == 'blob') try {
    return new URL(scheme.path[0]).origin;
  } catch (error) {
    return 'null';
  }
  if (scheme == 'file' || !isSpecial(url)) return 'null';
  return scheme + '://' + serializeHost(url.host) + (port !== null ? ':' + port : '');
};

var getProtocol = function getProtocol() {
  return getInternalURLState(this).scheme + ':';
};

var getUsername = function getUsername() {
  return getInternalURLState(this).username;
};

var getPassword = function getPassword() {
  return getInternalURLState(this).password;
};

var getHost = function getHost() {
  var url = getInternalURLState(this);
  var host = url.host;
  var port = url.port;
  return host === null ? '' : port === null ? serializeHost(host) : serializeHost(host) + ':' + port;
};

var getHostname = function getHostname() {
  var host = getInternalURLState(this).host;
  return host === null ? '' : serializeHost(host);
};

var getPort = function getPort() {
  var port = getInternalURLState(this).port;
  return port === null ? '' : String(port);
};

var getPathname = function getPathname() {
  var url = getInternalURLState(this);
  var path = url.path;
  return url.cannotBeABaseURL ? path[0] : path.length ? '/' + path.join('/') : '';
};

var getSearch = function getSearch() {
  var query = getInternalURLState(this).query;
  return query ? '?' + query : '';
};

var getSearchParams = function getSearchParams() {
  return getInternalURLState(this).searchParams;
};

var getHash = function getHash() {
  var fragment = getInternalURLState(this).fragment;
  return fragment ? '#' + fragment : '';
};

var accessorDescriptor = function accessorDescriptor(getter, setter) {
  return {
    get: getter,
    set: setter,
    configurable: true,
    enumerable: true
  };
};

if (DESCRIPTORS) {
  defineProperties(URLPrototype, {
    // `URL.prototype.href` accessors pair
    // https://url.spec.whatwg.org/#dom-url-href
    href: accessorDescriptor(serializeURL, function (href) {
      var url = getInternalURLState(this);
      var urlString = String(href);
      var failure = parseURL(url, urlString);
      if (failure) throw TypeError(failure);
      getInternalSearchParamsState(url.searchParams).updateSearchParams(url.query);
    }),
    // `URL.prototype.origin` getter
    // https://url.spec.whatwg.org/#dom-url-origin
    origin: accessorDescriptor(getOrigin),
    // `URL.prototype.protocol` accessors pair
    // https://url.spec.whatwg.org/#dom-url-protocol
    protocol: accessorDescriptor(getProtocol, function (protocol) {
      var url = getInternalURLState(this);
      parseURL(url, String(protocol) + ':', SCHEME_START);
    }),
    // `URL.prototype.username` accessors pair
    // https://url.spec.whatwg.org/#dom-url-username
    username: accessorDescriptor(getUsername, function (username) {
      var url = getInternalURLState(this);
      var codePoints = arrayFrom(String(username));
      if (cannotHaveUsernamePasswordPort(url)) return;
      url.username = '';

      for (var i = 0; i < codePoints.length; i++) {
        url.username += percentEncode(codePoints[i], userinfoPercentEncodeSet);
      }
    }),
    // `URL.prototype.password` accessors pair
    // https://url.spec.whatwg.org/#dom-url-password
    password: accessorDescriptor(getPassword, function (password) {
      var url = getInternalURLState(this);
      var codePoints = arrayFrom(String(password));
      if (cannotHaveUsernamePasswordPort(url)) return;
      url.password = '';

      for (var i = 0; i < codePoints.length; i++) {
        url.password += percentEncode(codePoints[i], userinfoPercentEncodeSet);
      }
    }),
    // `URL.prototype.host` accessors pair
    // https://url.spec.whatwg.org/#dom-url-host
    host: accessorDescriptor(getHost, function (host) {
      var url = getInternalURLState(this);
      if (url.cannotBeABaseURL) return;
      parseURL(url, String(host), HOST);
    }),
    // `URL.prototype.hostname` accessors pair
    // https://url.spec.whatwg.org/#dom-url-hostname
    hostname: accessorDescriptor(getHostname, function (hostname) {
      var url = getInternalURLState(this);
      if (url.cannotBeABaseURL) return;
      parseURL(url, String(hostname), HOSTNAME);
    }),
    // `URL.prototype.port` accessors pair
    // https://url.spec.whatwg.org/#dom-url-port
    port: accessorDescriptor(getPort, function (port) {
      var url = getInternalURLState(this);
      if (cannotHaveUsernamePasswordPort(url)) return;
      port = String(port);
      if (port == '') url.port = null;else parseURL(url, port, PORT);
    }),
    // `URL.prototype.pathname` accessors pair
    // https://url.spec.whatwg.org/#dom-url-pathname
    pathname: accessorDescriptor(getPathname, function (pathname) {
      var url = getInternalURLState(this);
      if (url.cannotBeABaseURL) return;
      url.path = [];
      parseURL(url, pathname + '', PATH_START);
    }),
    // `URL.prototype.search` accessors pair
    // https://url.spec.whatwg.org/#dom-url-search
    search: accessorDescriptor(getSearch, function (search) {
      var url = getInternalURLState(this);
      search = String(search);

      if (search == '') {
        url.query = null;
      } else {
        if ('?' == search.charAt(0)) search = search.slice(1);
        url.query = '';
        parseURL(url, search, QUERY);
      }

      getInternalSearchParamsState(url.searchParams).updateSearchParams(url.query);
    }),
    // `URL.prototype.searchParams` getter
    // https://url.spec.whatwg.org/#dom-url-searchparams
    searchParams: accessorDescriptor(getSearchParams),
    // `URL.prototype.hash` accessors pair
    // https://url.spec.whatwg.org/#dom-url-hash
    hash: accessorDescriptor(getHash, function (hash) {
      var url = getInternalURLState(this);
      hash = String(hash);

      if (hash == '') {
        url.fragment = null;
        return;
      }

      if ('#' == hash.charAt(0)) hash = hash.slice(1);
      url.fragment = '';
      parseURL(url, hash, FRAGMENT);
    })
  });
} // `URL.prototype.toJSON` method
// https://url.spec.whatwg.org/#dom-url-tojson


redefine(URLPrototype, 'toJSON', function toJSON() {
  return serializeURL.call(this);
}, {
  enumerable: true
}); // `URL.prototype.toString` method
// https://url.spec.whatwg.org/#URL-stringification-behavior

redefine(URLPrototype, 'toString', function toString() {
  return serializeURL.call(this);
}, {
  enumerable: true
});

if (NativeURL) {
  var nativeCreateObjectURL = NativeURL.createObjectURL;
  var nativeRevokeObjectURL = NativeURL.revokeObjectURL; // `URL.createObjectURL` method
  // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
  // eslint-disable-next-line no-unused-vars

  if (nativeCreateObjectURL) redefine(URLConstructor, 'createObjectURL', function createObjectURL(blob) {
    return nativeCreateObjectURL.apply(NativeURL, arguments);
  }); // `URL.revokeObjectURL` method
  // https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL
  // eslint-disable-next-line no-unused-vars

  if (nativeRevokeObjectURL) redefine(URLConstructor, 'revokeObjectURL', function revokeObjectURL(url) {
    return nativeRevokeObjectURL.apply(NativeURL, arguments);
  });
}

setToStringTag(URLConstructor, 'URL');
$({
  global: true,
  forced: !USE_NATIVE_URL,
  sham: !DESCRIPTORS
}, {
  URL: URLConstructor
});

/***/ }),
/* 213 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var charAt = __webpack_require__(142).charAt;

var InternalStateModule = __webpack_require__(55);

var defineIterator = __webpack_require__(133);

var STRING_ITERATOR = 'String Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(STRING_ITERATOR); // `String.prototype[@@iterator]` method
// https://tc39.github.io/ecma262/#sec-string.prototype-@@iterator

defineIterator(String, 'String', function (iterated) {
  setInternalState(this, {
    type: STRING_ITERATOR,
    string: String(iterated),
    index: 0
  }); // `%StringIteratorPrototype%.next` method
  // https://tc39.github.io/ecma262/#sec-%stringiteratorprototype%.next
}, function next() {
  var state = getInternalState(this);
  var string = state.string;
  var index = state.index;
  var point;
  if (index >= string.length) return {
    value: undefined,
    done: true
  };
  point = charAt(string, index);
  state.index += point.length;
  return {
    value: point,
    done: false
  };
});

/***/ }),
/* 214 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var DESCRIPTORS = __webpack_require__(32);

var fails = __webpack_require__(18);

var objectKeys = __webpack_require__(129);

var getOwnPropertySymbolsModule = __webpack_require__(135);

var propertyIsEnumerableModule = __webpack_require__(134);

var toObject = __webpack_require__(64);

var IndexedObject = __webpack_require__(80);

var nativeAssign = Object.assign;
var defineProperty = Object.defineProperty; // `Object.assign` method
// https://tc39.github.io/ecma262/#sec-object.assign

module.exports = !nativeAssign || fails(function () {
  // should have correct order of operations (Edge bug)
  if (DESCRIPTORS && nativeAssign({
    b: 1
  }, nativeAssign(defineProperty({}, 'a', {
    enumerable: true,
    get: function get() {
      defineProperty(this, 'b', {
        value: 3,
        enumerable: false
      });
    }
  }), {
    b: 2
  })).b !== 1) return true; // should work with symbols and should have deterministic property order (V8 bug)

  var A = {};
  var B = {}; // eslint-disable-next-line no-undef

  var symbol = Symbol();
  var alphabet = 'abcdefghijklmnopqrst';
  A[symbol] = 7;
  alphabet.split('').forEach(function (chr) {
    B[chr] = chr;
  });
  return nativeAssign({}, A)[symbol] != 7 || objectKeys(nativeAssign({}, B)).join('') != alphabet;
}) ? function assign(target, source) {
  // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var argumentsLength = arguments.length;
  var index = 1;
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  var propertyIsEnumerable = propertyIsEnumerableModule.f;

  while (argumentsLength > index) {
    var S = IndexedObject(arguments[index++]);
    var keys = getOwnPropertySymbols ? objectKeys(S).concat(getOwnPropertySymbols(S)) : objectKeys(S);
    var length = keys.length;
    var j = 0;
    var key;

    while (length > j) {
      key = keys[j++];
      if (!DESCRIPTORS || propertyIsEnumerable.call(S, key)) T[key] = S[key];
    }
  }

  return T;
} : nativeAssign;

/***/ }),
/* 215 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(62);

var toObject = __webpack_require__(64);

var callWithSafeIterationClosing = __webpack_require__(216);

var isArrayIteratorMethod = __webpack_require__(218);

var toLength = __webpack_require__(82);

var createProperty = __webpack_require__(219);

var getIteratorMethod = __webpack_require__(94); // `Array.from` method implementation
// https://tc39.github.io/ecma262/#sec-array.from


module.exports = function from(arrayLike
/* , mapfn = undefined, thisArg = undefined */
) {
  var O = toObject(arrayLike);
  var C = typeof this == 'function' ? this : Array;
  var argumentsLength = arguments.length;
  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
  var mapping = mapfn !== undefined;
  var iteratorMethod = getIteratorMethod(O);
  var index = 0;
  var length, result, step, iterator, next, value;
  if (mapping) mapfn = bind(mapfn, argumentsLength > 2 ? arguments[2] : undefined, 2); // if the target is not iterable or it's an array with the default iterator - use a simple case

  if (iteratorMethod != undefined && !(C == Array && isArrayIteratorMethod(iteratorMethod))) {
    iterator = iteratorMethod.call(O);
    next = iterator.next;
    result = new C();

    for (; !(step = next.call(iterator)).done; index++) {
      value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
      createProperty(result, index, value);
    }
  } else {
    length = toLength(O.length);
    result = new C(length);

    for (; length > index; index++) {
      value = mapping ? mapfn(O[index], index) : O[index];
      createProperty(result, index, value);
    }
  }

  result.length = index;
  return result;
};

/***/ }),
/* 216 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(27);

var iteratorClose = __webpack_require__(217); // call something on iterator step with safe closing on error


module.exports = function (iterator, fn, value, ENTRIES) {
  try {
    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value); // 7.4.6 IteratorClose(iterator, completion)
  } catch (error) {
    iteratorClose(iterator);
    throw error;
  }
};

/***/ }),
/* 217 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(27);

module.exports = function (iterator) {
  var returnMethod = iterator['return'];

  if (returnMethod !== undefined) {
    return anObject(returnMethod.call(iterator)).value;
  }
};

/***/ }),
/* 218 */
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(13);

var Iterators = __webpack_require__(54);

var ITERATOR = wellKnownSymbol('iterator');
var ArrayPrototype = Array.prototype; // check on default Array iterator

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it);
};

/***/ }),
/* 219 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var toPrimitive = __webpack_require__(87);

var definePropertyModule = __webpack_require__(46);

var createPropertyDescriptor = __webpack_require__(53);

module.exports = function (object, key, value) {
  var propertyKey = toPrimitive(key);
  if (propertyKey in object) definePropertyModule.f(object, propertyKey, createPropertyDescriptor(0, value));else object[propertyKey] = value;
};

/***/ }),
/* 220 */
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(13);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};
test[TO_STRING_TAG] = 'z';
module.exports = String(test) === '[object z]';

/***/ }),
/* 221 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 // based on https://github.com/bestiejs/punycode.js/blob/master/punycode.js

var maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1

var base = 36;
var tMin = 1;
var tMax = 26;
var skew = 38;
var damp = 700;
var initialBias = 72;
var initialN = 128; // 0x80

var delimiter = '-'; // '\x2D'

var regexNonASCII = /[^\0-\u007E]/; // non-ASCII chars

var regexSeparators = /[.\u3002\uFF0E\uFF61]/g; // RFC 3490 separators

var OVERFLOW_ERROR = 'Overflow: input needs wider integers to process';
var baseMinusTMin = base - tMin;
var floor = Math.floor;
var stringFromCharCode = String.fromCharCode;
/**
 * Creates an array containing the numeric code points of each Unicode
 * character in the string. While JavaScript uses UCS-2 internally,
 * this function will convert a pair of surrogate halves (each of which
 * UCS-2 exposes as separate characters) into a single code point,
 * matching UTF-16.
 */

var ucs2decode = function ucs2decode(string) {
  var output = [];
  var counter = 0;
  var length = string.length;

  while (counter < length) {
    var value = string.charCodeAt(counter++);

    if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
      // It's a high surrogate, and there is a next character.
      var extra = string.charCodeAt(counter++);

      if ((extra & 0xFC00) == 0xDC00) {
        // Low surrogate.
        output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
      } else {
        // It's an unmatched surrogate; only append this code unit, in case the
        // next code unit is the high surrogate of a surrogate pair.
        output.push(value);
        counter--;
      }
    } else {
      output.push(value);
    }
  }

  return output;
};
/**
 * Converts a digit/integer into a basic code point.
 */


var digitToBasic = function digitToBasic(digit) {
  //  0..25 map to ASCII a..z or A..Z
  // 26..35 map to ASCII 0..9
  return digit + 22 + 75 * (digit < 26);
};
/**
 * Bias adaptation function as per section 3.4 of RFC 3492.
 * https://tools.ietf.org/html/rfc3492#section-3.4
 */


var adapt = function adapt(delta, numPoints, firstTime) {
  var k = 0;
  delta = firstTime ? floor(delta / damp) : delta >> 1;
  delta += floor(delta / numPoints);

  for (; delta > baseMinusTMin * tMax >> 1; k += base) {
    delta = floor(delta / baseMinusTMin);
  }

  return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
};
/**
 * Converts a string of Unicode symbols (e.g. a domain name label) to a
 * Punycode string of ASCII-only symbols.
 */
// eslint-disable-next-line  max-statements


var encode = function encode(input) {
  var output = []; // Convert the input in UCS-2 to an array of Unicode code points.

  input = ucs2decode(input); // Cache the length.

  var inputLength = input.length; // Initialize the state.

  var n = initialN;
  var delta = 0;
  var bias = initialBias;
  var i, currentValue; // Handle the basic code points.

  for (i = 0; i < input.length; i++) {
    currentValue = input[i];

    if (currentValue < 0x80) {
      output.push(stringFromCharCode(currentValue));
    }
  }

  var basicLength = output.length; // number of basic code points.

  var handledCPCount = basicLength; // number of code points that have been handled;
  // Finish the basic string with a delimiter unless it's empty.

  if (basicLength) {
    output.push(delimiter);
  } // Main encoding loop:


  while (handledCPCount < inputLength) {
    // All non-basic code points < n have been handled already. Find the next larger one:
    var m = maxInt;

    for (i = 0; i < input.length; i++) {
      currentValue = input[i];

      if (currentValue >= n && currentValue < m) {
        m = currentValue;
      }
    } // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>, but guard against overflow.


    var handledCPCountPlusOne = handledCPCount + 1;

    if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
      throw RangeError(OVERFLOW_ERROR);
    }

    delta += (m - n) * handledCPCountPlusOne;
    n = m;

    for (i = 0; i < input.length; i++) {
      currentValue = input[i];

      if (currentValue < n && ++delta > maxInt) {
        throw RangeError(OVERFLOW_ERROR);
      }

      if (currentValue == n) {
        // Represent delta as a generalized variable-length integer.
        var q = delta;

        for (var k = base;;
        /* no condition */
        k += base) {
          var t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
          if (q < t) break;
          var qMinusT = q - t;
          var baseMinusT = base - t;
          output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT)));
          q = floor(qMinusT / baseMinusT);
        }

        output.push(stringFromCharCode(digitToBasic(q)));
        bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
        delta = 0;
        ++handledCPCount;
      }
    }

    ++delta;
    ++n;
  }

  return output.join('');
};

module.exports = function (input) {
  var encoded = [];
  var labels = input.toLowerCase().replace(regexSeparators, ".").split('.');
  var i, label;

  for (i = 0; i < labels.length; i++) {
    label = labels[i];
    encoded.push(regexNonASCII.test(label) ? 'xn--' + encode(label) : label);
  }

  return encoded.join('.');
};

/***/ }),
/* 222 */
/***/ (function(module, exports, __webpack_require__) {

var redefine = __webpack_require__(56);

module.exports = function (target, src, options) {
  for (var key in src) {
    redefine(target, key, src[key], options);
  }

  return target;
};

/***/ }),
/* 223 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(27);

var getIteratorMethod = __webpack_require__(94);

module.exports = function (it) {
  var iteratorMethod = getIteratorMethod(it);

  if (typeof iteratorMethod != 'function') {
    throw TypeError(String(it) + ' is not iterable');
  }

  return anObject(iteratorMethod.call(it));
};

/***/ }),
/* 224 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $ = __webpack_require__(36); // `URL.prototype.toJSON` method
// https://url.spec.whatwg.org/#dom-url-tojson


$({
  target: 'URL',
  proto: true,
  enumerable: true
}, {
  toJSON: function toJSON() {
    return URL.prototype.toString.call(this);
  }
});

/***/ }),
/* 225 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(226);

__webpack_require__(229);

__webpack_require__(230);

__webpack_require__(231);

__webpack_require__(232);

__webpack_require__(233);

__webpack_require__(234);

__webpack_require__(235);

__webpack_require__(236);

__webpack_require__(237);

__webpack_require__(238);

__webpack_require__(239);

__webpack_require__(240);

__webpack_require__(241);

__webpack_require__(242);

__webpack_require__(243);

__webpack_require__(244);

__webpack_require__(245);

__webpack_require__(246);

__webpack_require__(247);

__webpack_require__(248);

__webpack_require__(249);

__webpack_require__(250);

__webpack_require__(251);

__webpack_require__(252);

__webpack_require__(253);

__webpack_require__(254);

__webpack_require__(255);

__webpack_require__(256);

__webpack_require__(257);

__webpack_require__(258);

__webpack_require__(259);

__webpack_require__(260);

__webpack_require__(261);

__webpack_require__(262);

__webpack_require__(263);

__webpack_require__(264);

__webpack_require__(265);

__webpack_require__(266);

__webpack_require__(267);

__webpack_require__(268);

__webpack_require__(269);

__webpack_require__(270);

__webpack_require__(272);

__webpack_require__(273);

__webpack_require__(274);

__webpack_require__(275);

__webpack_require__(276);

__webpack_require__(277);

__webpack_require__(278);

__webpack_require__(279);

__webpack_require__(280);

__webpack_require__(281);

__webpack_require__(282);

__webpack_require__(283);

__webpack_require__(284);

__webpack_require__(285);

__webpack_require__(286);

__webpack_require__(287);

__webpack_require__(288);

__webpack_require__(289);

__webpack_require__(290);

__webpack_require__(291);

__webpack_require__(292);

__webpack_require__(293);

__webpack_require__(294);

__webpack_require__(295);

__webpack_require__(296);

__webpack_require__(297);

__webpack_require__(298);

__webpack_require__(299);

__webpack_require__(300);

__webpack_require__(301);

__webpack_require__(302);

__webpack_require__(303);

__webpack_require__(304);

__webpack_require__(305);

__webpack_require__(307);

__webpack_require__(308);

__webpack_require__(310);

__webpack_require__(311);

__webpack_require__(312);

__webpack_require__(313);

__webpack_require__(314);

__webpack_require__(315);

__webpack_require__(316);

__webpack_require__(318);

__webpack_require__(319);

__webpack_require__(320);

__webpack_require__(321);

__webpack_require__(322);

__webpack_require__(323);

__webpack_require__(324);

__webpack_require__(325);

__webpack_require__(326);

__webpack_require__(327);

__webpack_require__(328);

__webpack_require__(329);

__webpack_require__(330);

__webpack_require__(166);

__webpack_require__(331);

__webpack_require__(168);

__webpack_require__(332);

__webpack_require__(169);

__webpack_require__(333);

__webpack_require__(334);

__webpack_require__(335);

__webpack_require__(336);

__webpack_require__(170);

__webpack_require__(339);

__webpack_require__(340);

__webpack_require__(341);

__webpack_require__(342);

__webpack_require__(343);

__webpack_require__(344);

__webpack_require__(345);

__webpack_require__(346);

__webpack_require__(347);

__webpack_require__(348);

__webpack_require__(349);

__webpack_require__(350);

__webpack_require__(351);

__webpack_require__(352);

__webpack_require__(353);

__webpack_require__(354);

__webpack_require__(355);

__webpack_require__(356);

__webpack_require__(357);

__webpack_require__(358);

__webpack_require__(359);

__webpack_require__(360);

__webpack_require__(361);

__webpack_require__(362);

__webpack_require__(363);

__webpack_require__(364);

__webpack_require__(365);

__webpack_require__(366);

__webpack_require__(367);

module.exports = __webpack_require__(9);

/***/ }),
/* 226 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 // ECMAScript 6 symbols shim

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var global = __webpack_require__(4);

var has = __webpack_require__(15);

var DESCRIPTORS = __webpack_require__(8);

var $export = __webpack_require__(0);

var redefine = __webpack_require__(16);

var META = __webpack_require__(34).KEY;

var $fails = __webpack_require__(1);

var shared = __webpack_require__(69);

var setToStringTag = __webpack_require__(47);

var uid = __webpack_require__(38);

var wks = __webpack_require__(5);

var wksExt = __webpack_require__(96);

var wksDefine = __webpack_require__(148);

var enumKeys = __webpack_require__(228);

var isArray = __webpack_require__(72);

var anObject = __webpack_require__(2);

var isObject = __webpack_require__(3);

var toObject = __webpack_require__(11);

var toIObject = __webpack_require__(17);

var toPrimitive = __webpack_require__(33);

var createDesc = __webpack_require__(37);

var _create = __webpack_require__(41);

var gOPNExt = __webpack_require__(151);

var $GOPD = __webpack_require__(24);

var $GOPS = __webpack_require__(71);

var $DP = __webpack_require__(10);

var $keys = __webpack_require__(48);

var gOPD = $GOPD.f;
var dP = $DP.f;
var gOPN = gOPNExt.f;
var $Symbol = global.Symbol;
var $JSON = global.JSON;

var _stringify = $JSON && $JSON.stringify;

var PROTOTYPE = 'prototype';
var HIDDEN = wks('_hidden');
var TO_PRIMITIVE = wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = shared('symbol-registry');
var AllSymbols = shared('symbols');
var OPSymbols = shared('op-symbols');
var ObjectProto = Object[PROTOTYPE];
var USE_NATIVE = typeof $Symbol == 'function' && !!$GOPS.f;
var QObject = global.QObject; // Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173

var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild; // fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687

var setSymbolDesc = DESCRIPTORS && $fails(function () {
  return _create(dP({}, 'a', {
    get: function get() {
      return dP(this, 'a', {
        value: 7
      }).a;
    }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto, key);
  if (protoDesc) delete ObjectProto[key];
  dP(it, key, D);
  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function wrap(tag) {
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);

  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && _typeof($Symbol.iterator) == 'symbol' ? function (it) {
  return _typeof(it) == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);

  if (has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _create(D, {
        enumerable: createDesc(0, false)
      });
    }

    return setSymbolDesc(it, key, D);
  }

  return dP(it, key, D);
};

var $defineProperties = function defineProperties(it, P) {
  anObject(it);
  var keys = enumKeys(P = toIObject(P));
  var i = 0;
  var l = keys.length;
  var key;

  while (l > i) {
    $defineProperty(it, key = keys[i++], P[key]);
  }

  return it;
};

var $create = function create(it, P) {
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};

var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};

var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = toIObject(it);
  key = toPrimitive(key, true);
  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};

var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(toIObject(it));
  var result = [];
  var i = 0;
  var key;

  while (names.length > i) {
    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  }

  return result;
};

var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto;
  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
  var result = [];
  var i = 0;
  var key;

  while (names.length > i) {
    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
  }

  return result;
}; // 19.4.1.1 Symbol([description])


if (!USE_NATIVE) {
  $Symbol = function _Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);

    var $set = function $set(value) {
      if (this === ObjectProto) $set.call(OPSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };

    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, {
      configurable: true,
      set: $set
    });
    return wrap(tag);
  };

  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return this._k;
  });
  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f = $defineProperty;
  __webpack_require__(42).f = gOPNExt.f = $getOwnPropertyNames;
  __webpack_require__(58).f = $propertyIsEnumerable;
  $GOPS.f = $getOwnPropertySymbols;

  if (DESCRIPTORS && !__webpack_require__(39)) {
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function (name) {
    return wrap(wks(name));
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {
  Symbol: $Symbol
});

for (var es6Symbols = // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'.split(','), j = 0; es6Symbols.length > j;) {
  wks(es6Symbols[j++]);
}

for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) {
  wksDefine(wellKnownSymbols[k++]);
}

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function _for(key) {
    return has(SymbolRegistry, key += '') ? SymbolRegistry[key] : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');

    for (var key in SymbolRegistry) {
      if (SymbolRegistry[key] === sym) return key;
    }
  },
  useSetter: function useSetter() {
    setter = true;
  },
  useSimple: function useSimple() {
    setter = false;
  }
});
$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
}); // Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
// https://bugs.chromium.org/p/v8/issues/detail?id=3443

var FAILS_ON_PRIMITIVES = $fails(function () {
  $GOPS.f(1);
});
$export($export.S + $export.F * FAILS_ON_PRIMITIVES, 'Object', {
  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
    return $GOPS.f(toObject(it));
  }
}); // 24.3.2 JSON.stringify(value [, replacer [, space]])

$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
  var S = $Symbol(); // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols

  return _stringify([S]) != '[null]' || _stringify({
    a: S
  }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    var args = [it];
    var i = 1;
    var replacer, $replacer;

    while (arguments.length > i) {
      args.push(arguments[i++]);
    }

    $replacer = replacer = args[1];
    if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined

    if (!isArray(replacer)) replacer = function replacer(key, value) {
      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
}); // 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)

$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(19)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf); // 19.4.3.5 Symbol.prototype[@@toStringTag]

setToStringTag($Symbol, 'Symbol'); // 20.2.1.9 Math[@@toStringTag]

setToStringTag(Math, 'Math', true); // 24.3.3 JSON[@@toStringTag]

setToStringTag(global.JSON, 'JSON', true);

/***/ }),
/* 227 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(69)('native-function-to-string', Function.toString);

/***/ }),
/* 228 */
/***/ (function(module, exports, __webpack_require__) {

// all enumerable object keys, includes symbols
var getKeys = __webpack_require__(48);

var gOPS = __webpack_require__(71);

var pIE = __webpack_require__(58);

module.exports = function (it) {
  var result = getKeys(it);
  var getSymbols = gOPS.f;

  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = pIE.f;
    var i = 0;
    var key;

    while (symbols.length > i) {
      if (isEnum.call(it, key = symbols[i++])) result.push(key);
    }
  }

  return result;
};

/***/ }),
/* 229 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0); // 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])


$export($export.S, 'Object', {
  create: __webpack_require__(41)
});

/***/ }),
/* 230 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0); // 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)


$export($export.S + $export.F * !__webpack_require__(8), 'Object', {
  defineProperty: __webpack_require__(10).f
});

/***/ }),
/* 231 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0); // 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)


$export($export.S + $export.F * !__webpack_require__(8), 'Object', {
  defineProperties: __webpack_require__(150)
});

/***/ }),
/* 232 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject = __webpack_require__(17);

var $getOwnPropertyDescriptor = __webpack_require__(24).f;

__webpack_require__(25)('getOwnPropertyDescriptor', function () {
  return function getOwnPropertyDescriptor(it, key) {
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});

/***/ }),
/* 233 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 Object.getPrototypeOf(O)
var toObject = __webpack_require__(11);

var $getPrototypeOf = __webpack_require__(43);

__webpack_require__(25)('getPrototypeOf', function () {
  return function getPrototypeOf(it) {
    return $getPrototypeOf(toObject(it));
  };
});

/***/ }),
/* 234 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 Object.keys(O)
var toObject = __webpack_require__(11);

var $keys = __webpack_require__(48);

__webpack_require__(25)('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});

/***/ }),
/* 235 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 Object.getOwnPropertyNames(O)
__webpack_require__(25)('getOwnPropertyNames', function () {
  return __webpack_require__(151).f;
});

/***/ }),
/* 236 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.5 Object.freeze(O)
var isObject = __webpack_require__(3);

var meta = __webpack_require__(34).onFreeze;

__webpack_require__(25)('freeze', function ($freeze) {
  return function freeze(it) {
    return $freeze && isObject(it) ? $freeze(meta(it)) : it;
  };
});

/***/ }),
/* 237 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.17 Object.seal(O)
var isObject = __webpack_require__(3);

var meta = __webpack_require__(34).onFreeze;

__webpack_require__(25)('seal', function ($seal) {
  return function seal(it) {
    return $seal && isObject(it) ? $seal(meta(it)) : it;
  };
});

/***/ }),
/* 238 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.15 Object.preventExtensions(O)
var isObject = __webpack_require__(3);

var meta = __webpack_require__(34).onFreeze;

__webpack_require__(25)('preventExtensions', function ($preventExtensions) {
  return function preventExtensions(it) {
    return $preventExtensions && isObject(it) ? $preventExtensions(meta(it)) : it;
  };
});

/***/ }),
/* 239 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.12 Object.isFrozen(O)
var isObject = __webpack_require__(3);

__webpack_require__(25)('isFrozen', function ($isFrozen) {
  return function isFrozen(it) {
    return isObject(it) ? $isFrozen ? $isFrozen(it) : false : true;
  };
});

/***/ }),
/* 240 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.13 Object.isSealed(O)
var isObject = __webpack_require__(3);

__webpack_require__(25)('isSealed', function ($isSealed) {
  return function isSealed(it) {
    return isObject(it) ? $isSealed ? $isSealed(it) : false : true;
  };
});

/***/ }),
/* 241 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.11 Object.isExtensible(O)
var isObject = __webpack_require__(3);

__webpack_require__(25)('isExtensible', function ($isExtensible) {
  return function isExtensible(it) {
    return isObject(it) ? $isExtensible ? $isExtensible(it) : true : false;
  };
});

/***/ }),
/* 242 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__(0);

$export($export.S + $export.F, 'Object', {
  assign: __webpack_require__(152)
});

/***/ }),
/* 243 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.10 Object.is(value1, value2)
var $export = __webpack_require__(0);

$export($export.S, 'Object', {
  is: __webpack_require__(153)
});

/***/ }),
/* 244 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = __webpack_require__(0);

$export($export.S, 'Object', {
  setPrototypeOf: __webpack_require__(100).set
});

/***/ }),
/* 245 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 // 19.1.3.6 Object.prototype.toString()

var classof = __webpack_require__(59);

var test = {};
test[__webpack_require__(5)('toStringTag')] = 'z';

if (test + '' != '[object z]') {
  __webpack_require__(16)(Object.prototype, 'toString', function toString() {
    return '[object ' + classof(this) + ']';
  }, true);
}

/***/ }),
/* 246 */
/***/ (function(module, exports, __webpack_require__) {

// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)
var $export = __webpack_require__(0);

$export($export.P, 'Function', {
  bind: __webpack_require__(154)
});

/***/ }),
/* 247 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(10).f;

var FProto = Function.prototype;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name'; // 19.2.4.2 name

NAME in FProto || __webpack_require__(8) && dP(FProto, NAME, {
  configurable: true,
  get: function get() {
    try {
      return ('' + this).match(nameRE)[1];
    } catch (e) {
      return '';
    }
  }
});

/***/ }),
/* 248 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isObject = __webpack_require__(3);

var getPrototypeOf = __webpack_require__(43);

var HAS_INSTANCE = __webpack_require__(5)('hasInstance');

var FunctionProto = Function.prototype; // 19.2.3.6 Function.prototype[@@hasInstance](V)

if (!(HAS_INSTANCE in FunctionProto)) __webpack_require__(10).f(FunctionProto, HAS_INSTANCE, {
  value: function value(O) {
    if (typeof this != 'function' || !isObject(O)) return false;
    if (!isObject(this.prototype)) return O instanceof this; // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:

    while (O = getPrototypeOf(O)) {
      if (this.prototype === O) return true;
    }

    return false;
  }
});

/***/ }),
/* 249 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);

var $parseInt = __webpack_require__(156); // 18.2.5 parseInt(string, radix)


$export($export.G + $export.F * (parseInt != $parseInt), {
  parseInt: $parseInt
});

/***/ }),
/* 250 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);

var $parseFloat = __webpack_require__(157); // 18.2.4 parseFloat(string)


$export($export.G + $export.F * (parseFloat != $parseFloat), {
  parseFloat: $parseFloat
});

/***/ }),
/* 251 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var global = __webpack_require__(4);

var has = __webpack_require__(15);

var cof = __webpack_require__(28);

var inheritIfRequired = __webpack_require__(102);

var toPrimitive = __webpack_require__(33);

var fails = __webpack_require__(1);

var gOPN = __webpack_require__(42).f;

var gOPD = __webpack_require__(24).f;

var dP = __webpack_require__(10).f;

var $trim = __webpack_require__(49).trim;

var NUMBER = 'Number';
var $Number = global[NUMBER];
var Base = $Number;
var proto = $Number.prototype; // Opera ~12 has broken Object#toString

var BROKEN_COF = cof(__webpack_require__(41)(proto)) == NUMBER;
var TRIM = ('trim' in String.prototype); // 7.1.3 ToNumber(argument)

var toNumber = function toNumber(argument) {
  var it = toPrimitive(argument, false);

  if (typeof it == 'string' && it.length > 2) {
    it = TRIM ? it.trim() : $trim(it, 3);
    var first = it.charCodeAt(0);
    var third, radix, maxCode;

    if (first === 43 || first === 45) {
      third = it.charCodeAt(2);
      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if (first === 48) {
      switch (it.charCodeAt(1)) {
        case 66:
        case 98:
          radix = 2;
          maxCode = 49;
          break;
        // fast equal /^0b[01]+$/i

        case 79:
        case 111:
          radix = 8;
          maxCode = 55;
          break;
        // fast equal /^0o[0-7]+$/i

        default:
          return +it;
      }

      for (var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++) {
        code = digits.charCodeAt(i); // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols

        if (code < 48 || code > maxCode) return NaN;
      }

      return parseInt(digits, radix);
    }
  }

  return +it;
};

if (!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')) {
  $Number = function Number(value) {
    var it = arguments.length < 1 ? 0 : value;
    var that = this;
    return that instanceof $Number // check on 1..constructor(foo) case
    && (BROKEN_COF ? fails(function () {
      proto.valueOf.call(that);
    }) : cof(that) != NUMBER) ? inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
  };

  for (var keys = __webpack_require__(8) ? gOPN(Base) : ( // ES3:
  'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' + // ES6 (in case, if modules with ES6 Number statics required before):
  'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' + 'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger').split(','), j = 0, key; keys.length > j; j++) {
    if (has(Base, key = keys[j]) && !has($Number, key)) {
      dP($Number, key, gOPD(Base, key));
    }
  }

  $Number.prototype = proto;
  proto.constructor = $Number;

  __webpack_require__(16)(global, NUMBER, $Number);
}

/***/ }),
/* 252 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $export = __webpack_require__(0);

var toInteger = __webpack_require__(23);

var aNumberValue = __webpack_require__(158);

var repeat = __webpack_require__(103);

var $toFixed = 1.0.toFixed;
var floor = Math.floor;
var data = [0, 0, 0, 0, 0, 0];
var ERROR = 'Number.toFixed: incorrect invocation!';
var ZERO = '0';

var multiply = function multiply(n, c) {
  var i = -1;
  var c2 = c;

  while (++i < 6) {
    c2 += n * data[i];
    data[i] = c2 % 1e7;
    c2 = floor(c2 / 1e7);
  }
};

var divide = function divide(n) {
  var i = 6;
  var c = 0;

  while (--i >= 0) {
    c += data[i];
    data[i] = floor(c / n);
    c = c % n * 1e7;
  }
};

var numToString = function numToString() {
  var i = 6;
  var s = '';

  while (--i >= 0) {
    if (s !== '' || i === 0 || data[i] !== 0) {
      var t = String(data[i]);
      s = s === '' ? t : s + repeat.call(ZERO, 7 - t.length) + t;
    }
  }

  return s;
};

var pow = function pow(x, n, acc) {
  return n === 0 ? acc : n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc);
};

var log = function log(x) {
  var n = 0;
  var x2 = x;

  while (x2 >= 4096) {
    n += 12;
    x2 /= 4096;
  }

  while (x2 >= 2) {
    n += 1;
    x2 /= 2;
  }

  return n;
};

$export($export.P + $export.F * (!!$toFixed && (0.00008.toFixed(3) !== '0.000' || 0.9.toFixed(0) !== '1' || 1.255.toFixed(2) !== '1.25' || 1000000000000000128.0.toFixed(0) !== '1000000000000000128') || !__webpack_require__(1)(function () {
  // V8 ~ Android 4.3-
  $toFixed.call({});
})), 'Number', {
  toFixed: function toFixed(fractionDigits) {
    var x = aNumberValue(this, ERROR);
    var f = toInteger(fractionDigits);
    var s = '';
    var m = ZERO;
    var e, z, j, k;
    if (f < 0 || f > 20) throw RangeError(ERROR); // eslint-disable-next-line no-self-compare

    if (x != x) return 'NaN';
    if (x <= -1e21 || x >= 1e21) return String(x);

    if (x < 0) {
      s = '-';
      x = -x;
    }

    if (x > 1e-21) {
      e = log(x * pow(2, 69, 1)) - 69;
      z = e < 0 ? x * pow(2, -e, 1) : x / pow(2, e, 1);
      z *= 0x10000000000000;
      e = 52 - e;

      if (e > 0) {
        multiply(0, z);
        j = f;

        while (j >= 7) {
          multiply(1e7, 0);
          j -= 7;
        }

        multiply(pow(10, j, 1), 0);
        j = e - 1;

        while (j >= 23) {
          divide(1 << 23);
          j -= 23;
        }

        divide(1 << j);
        multiply(1, 1);
        divide(2);
        m = numToString();
      } else {
        multiply(0, z);
        multiply(1 << -e, 0);
        m = numToString() + repeat.call(ZERO, f);
      }
    }

    if (f > 0) {
      k = m.length;
      m = s + (k <= f ? '0.' + repeat.call(ZERO, f - k) + m : m.slice(0, k - f) + '.' + m.slice(k - f));
    } else {
      m = s + m;
    }

    return m;
  }
});

/***/ }),
/* 253 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $export = __webpack_require__(0);

var $fails = __webpack_require__(1);

var aNumberValue = __webpack_require__(158);

var $toPrecision = 1.0.toPrecision;
$export($export.P + $export.F * ($fails(function () {
  // IE7-
  return $toPrecision.call(1, undefined) !== '1';
}) || !$fails(function () {
  // V8 ~ Android 4.3-
  $toPrecision.call({});
})), 'Number', {
  toPrecision: function toPrecision(precision) {
    var that = aNumberValue(this, 'Number#toPrecision: incorrect invocation!');
    return precision === undefined ? $toPrecision.call(that) : $toPrecision.call(that, precision);
  }
});

/***/ }),
/* 254 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.1 Number.EPSILON
var $export = __webpack_require__(0);

$export($export.S, 'Number', {
  EPSILON: Math.pow(2, -52)
});

/***/ }),
/* 255 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.2 Number.isFinite(number)
var $export = __webpack_require__(0);

var _isFinite = __webpack_require__(4).isFinite;

$export($export.S, 'Number', {
  isFinite: function isFinite(it) {
    return typeof it == 'number' && _isFinite(it);
  }
});

/***/ }),
/* 256 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.3 Number.isInteger(number)
var $export = __webpack_require__(0);

$export($export.S, 'Number', {
  isInteger: __webpack_require__(159)
});

/***/ }),
/* 257 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.4 Number.isNaN(number)
var $export = __webpack_require__(0);

$export($export.S, 'Number', {
  isNaN: function isNaN(number) {
    // eslint-disable-next-line no-self-compare
    return number != number;
  }
});

/***/ }),
/* 258 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.5 Number.isSafeInteger(number)
var $export = __webpack_require__(0);

var isInteger = __webpack_require__(159);

var abs = Math.abs;
$export($export.S, 'Number', {
  isSafeInteger: function isSafeInteger(number) {
    return isInteger(number) && abs(number) <= 0x1fffffffffffff;
  }
});

/***/ }),
/* 259 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.6 Number.MAX_SAFE_INTEGER
var $export = __webpack_require__(0);

$export($export.S, 'Number', {
  MAX_SAFE_INTEGER: 0x1fffffffffffff
});

/***/ }),
/* 260 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.10 Number.MIN_SAFE_INTEGER
var $export = __webpack_require__(0);

$export($export.S, 'Number', {
  MIN_SAFE_INTEGER: -0x1fffffffffffff
});

/***/ }),
/* 261 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);

var $parseFloat = __webpack_require__(157); // 20.1.2.12 Number.parseFloat(string)


$export($export.S + $export.F * (Number.parseFloat != $parseFloat), 'Number', {
  parseFloat: $parseFloat
});

/***/ }),
/* 262 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);

var $parseInt = __webpack_require__(156); // 20.1.2.13 Number.parseInt(string, radix)


$export($export.S + $export.F * (Number.parseInt != $parseInt), 'Number', {
  parseInt: $parseInt
});

/***/ }),
/* 263 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.3 Math.acosh(x)
var $export = __webpack_require__(0);

var log1p = __webpack_require__(160);

var sqrt = Math.sqrt;
var $acosh = Math.acosh;
$export($export.S + $export.F * !($acosh // V8 bug: https://code.google.com/p/v8/issues/detail?id=3509
&& Math.floor($acosh(Number.MAX_VALUE)) == 710 // Tor Browser bug: Math.acosh(Infinity) -> NaN
&& $acosh(Infinity) == Infinity), 'Math', {
  acosh: function acosh(x) {
    return (x = +x) < 1 ? NaN : x > 94906265.62425156 ? Math.log(x) + Math.LN2 : log1p(x - 1 + sqrt(x - 1) * sqrt(x + 1));
  }
});

/***/ }),
/* 264 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.5 Math.asinh(x)
var $export = __webpack_require__(0);

var $asinh = Math.asinh;

function asinh(x) {
  return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : Math.log(x + Math.sqrt(x * x + 1));
} // Tor Browser bug: Math.asinh(0) -> -0


$export($export.S + $export.F * !($asinh && 1 / $asinh(0) > 0), 'Math', {
  asinh: asinh
});

/***/ }),
/* 265 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.7 Math.atanh(x)
var $export = __webpack_require__(0);

var $atanh = Math.atanh; // Tor Browser bug: Math.atanh(-0) -> 0

$export($export.S + $export.F * !($atanh && 1 / $atanh(-0) < 0), 'Math', {
  atanh: function atanh(x) {
    return (x = +x) == 0 ? x : Math.log((1 + x) / (1 - x)) / 2;
  }
});

/***/ }),
/* 266 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.9 Math.cbrt(x)
var $export = __webpack_require__(0);

var sign = __webpack_require__(104);

$export($export.S, 'Math', {
  cbrt: function cbrt(x) {
    return sign(x = +x) * Math.pow(Math.abs(x), 1 / 3);
  }
});

/***/ }),
/* 267 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.11 Math.clz32(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  clz32: function clz32(x) {
    return (x >>>= 0) ? 31 - Math.floor(Math.log(x + 0.5) * Math.LOG2E) : 32;
  }
});

/***/ }),
/* 268 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.12 Math.cosh(x)
var $export = __webpack_require__(0);

var exp = Math.exp;
$export($export.S, 'Math', {
  cosh: function cosh(x) {
    return (exp(x = +x) + exp(-x)) / 2;
  }
});

/***/ }),
/* 269 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.14 Math.expm1(x)
var $export = __webpack_require__(0);

var $expm1 = __webpack_require__(105);

$export($export.S + $export.F * ($expm1 != Math.expm1), 'Math', {
  expm1: $expm1
});

/***/ }),
/* 270 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.16 Math.fround(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  fround: __webpack_require__(271)
});

/***/ }),
/* 271 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.16 Math.fround(x)
var sign = __webpack_require__(104);

var pow = Math.pow;
var EPSILON = pow(2, -52);
var EPSILON32 = pow(2, -23);
var MAX32 = pow(2, 127) * (2 - EPSILON32);
var MIN32 = pow(2, -126);

var roundTiesToEven = function roundTiesToEven(n) {
  return n + 1 / EPSILON - 1 / EPSILON;
};

module.exports = Math.fround || function fround(x) {
  var $abs = Math.abs(x);
  var $sign = sign(x);
  var a, result;
  if ($abs < MIN32) return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
  a = (1 + EPSILON32 / EPSILON) * $abs;
  result = a - (a - $abs); // eslint-disable-next-line no-self-compare

  if (result > MAX32 || result != result) return $sign * Infinity;
  return $sign * result;
};

/***/ }),
/* 272 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.17 Math.hypot([value1[, value2[, … ]]])
var $export = __webpack_require__(0);

var abs = Math.abs;
$export($export.S, 'Math', {
  hypot: function hypot(value1, value2) {
    // eslint-disable-line no-unused-vars
    var sum = 0;
    var i = 0;
    var aLen = arguments.length;
    var larg = 0;
    var arg, div;

    while (i < aLen) {
      arg = abs(arguments[i++]);

      if (larg < arg) {
        div = larg / arg;
        sum = sum * div * div + 1;
        larg = arg;
      } else if (arg > 0) {
        div = arg / larg;
        sum += div * div;
      } else sum += arg;
    }

    return larg === Infinity ? Infinity : larg * Math.sqrt(sum);
  }
});

/***/ }),
/* 273 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.18 Math.imul(x, y)
var $export = __webpack_require__(0);

var $imul = Math.imul; // some WebKit versions fails with big numbers, some has wrong arity

$export($export.S + $export.F * __webpack_require__(1)(function () {
  return $imul(0xffffffff, 5) != -5 || $imul.length != 2;
}), 'Math', {
  imul: function imul(x, y) {
    var UINT16 = 0xffff;
    var xn = +x;
    var yn = +y;
    var xl = UINT16 & xn;
    var yl = UINT16 & yn;
    return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
  }
});

/***/ }),
/* 274 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.21 Math.log10(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  log10: function log10(x) {
    return Math.log(x) * Math.LOG10E;
  }
});

/***/ }),
/* 275 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.20 Math.log1p(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  log1p: __webpack_require__(160)
});

/***/ }),
/* 276 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.22 Math.log2(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  log2: function log2(x) {
    return Math.log(x) / Math.LN2;
  }
});

/***/ }),
/* 277 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.28 Math.sign(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  sign: __webpack_require__(104)
});

/***/ }),
/* 278 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.30 Math.sinh(x)
var $export = __webpack_require__(0);

var expm1 = __webpack_require__(105);

var exp = Math.exp; // V8 near Chromium 38 has a problem with very small numbers

$export($export.S + $export.F * __webpack_require__(1)(function () {
  return !Math.sinh(-2e-17) != -2e-17;
}), 'Math', {
  sinh: function sinh(x) {
    return Math.abs(x = +x) < 1 ? (expm1(x) - expm1(-x)) / 2 : (exp(x - 1) - exp(-x - 1)) * (Math.E / 2);
  }
});

/***/ }),
/* 279 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.33 Math.tanh(x)
var $export = __webpack_require__(0);

var expm1 = __webpack_require__(105);

var exp = Math.exp;
$export($export.S, 'Math', {
  tanh: function tanh(x) {
    var a = expm1(x = +x);
    var b = expm1(-x);
    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
  }
});

/***/ }),
/* 280 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.34 Math.trunc(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  trunc: function trunc(it) {
    return (it > 0 ? Math.floor : Math.ceil)(it);
  }
});

/***/ }),
/* 281 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);

var toAbsoluteIndex = __webpack_require__(40);

var fromCharCode = String.fromCharCode;
var $fromCodePoint = String.fromCodePoint; // length should be 1, old FF problem

$export($export.S + $export.F * (!!$fromCodePoint && $fromCodePoint.length != 1), 'String', {
  // 21.1.2.2 String.fromCodePoint(...codePoints)
  fromCodePoint: function fromCodePoint(x) {
    // eslint-disable-line no-unused-vars
    var res = [];
    var aLen = arguments.length;
    var i = 0;
    var code;

    while (aLen > i) {
      code = +arguments[i++];
      if (toAbsoluteIndex(code, 0x10ffff) !== code) throw RangeError(code + ' is not a valid code point');
      res.push(code < 0x10000 ? fromCharCode(code) : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00));
    }

    return res.join('');
  }
});

/***/ }),
/* 282 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);

var toIObject = __webpack_require__(17);

var toLength = __webpack_require__(6);

$export($export.S, 'String', {
  // 21.1.2.4 String.raw(callSite, ...substitutions)
  raw: function raw(callSite) {
    var tpl = toIObject(callSite.raw);
    var len = toLength(tpl.length);
    var aLen = arguments.length;
    var res = [];
    var i = 0;

    while (len > i) {
      res.push(String(tpl[i++]));
      if (i < aLen) res.push(String(arguments[i]));
    }

    return res.join('');
  }
});

/***/ }),
/* 283 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 // 21.1.3.25 String.prototype.trim()

__webpack_require__(49)('trim', function ($trim) {
  return function trim() {
    return $trim(this, 3);
  };
});

/***/ }),
/* 284 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $at = __webpack_require__(106)(true); // 21.1.3.27 String.prototype[@@iterator]()


__webpack_require__(107)(String, 'String', function (iterated) {
  this._t = String(iterated); // target

  this._i = 0; // next index
  // 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return {
    value: undefined,
    done: true
  };
  point = $at(O, index);
  this._i += point.length;
  return {
    value: point,
    done: false
  };
});

/***/ }),
/* 285 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $export = __webpack_require__(0);

var $at = __webpack_require__(106)(false);

$export($export.P, 'String', {
  // 21.1.3.3 String.prototype.codePointAt(pos)
  codePointAt: function codePointAt(pos) {
    return $at(this, pos);
  }
});

/***/ }),
/* 286 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])


var $export = __webpack_require__(0);

var toLength = __webpack_require__(6);

var context = __webpack_require__(108);

var ENDS_WITH = 'endsWith';
var $endsWith = ''[ENDS_WITH];
$export($export.P + $export.F * __webpack_require__(110)(ENDS_WITH), 'String', {
  endsWith: function endsWith(searchString
  /* , endPosition = @length */
  ) {
    var that = context(this, searchString, ENDS_WITH);
    var endPosition = arguments.length > 1 ? arguments[1] : undefined;
    var len = toLength(that.length);
    var end = endPosition === undefined ? len : Math.min(toLength(endPosition), len);
    var search = String(searchString);
    return $endsWith ? $endsWith.call(that, search, end) : that.slice(end - search.length, end) === search;
  }
});

/***/ }),
/* 287 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 21.1.3.7 String.prototype.includes(searchString, position = 0)


var $export = __webpack_require__(0);

var context = __webpack_require__(108);

var INCLUDES = 'includes';
$export($export.P + $export.F * __webpack_require__(110)(INCLUDES), 'String', {
  includes: function includes(searchString
  /* , position = 0 */
  ) {
    return !!~context(this, searchString, INCLUDES).indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
  }
});

/***/ }),
/* 288 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);

$export($export.P, 'String', {
  // 21.1.3.13 String.prototype.repeat(count)
  repeat: __webpack_require__(103)
});

/***/ }),
/* 289 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 21.1.3.18 String.prototype.startsWith(searchString [, position ])


var $export = __webpack_require__(0);

var toLength = __webpack_require__(6);

var context = __webpack_require__(108);

var STARTS_WITH = 'startsWith';
var $startsWith = ''[STARTS_WITH];
$export($export.P + $export.F * __webpack_require__(110)(STARTS_WITH), 'String', {
  startsWith: function startsWith(searchString
  /* , position = 0 */
  ) {
    var that = context(this, searchString, STARTS_WITH);
    var index = toLength(Math.min(arguments.length > 1 ? arguments[1] : undefined, that.length));
    var search = String(searchString);
    return $startsWith ? $startsWith.call(that, search, index) : that.slice(index, index + search.length) === search;
  }
});

/***/ }),
/* 290 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 // B.2.3.2 String.prototype.anchor(name)

__webpack_require__(12)('anchor', function (createHTML) {
  return function anchor(name) {
    return createHTML(this, 'a', 'name', name);
  };
});

/***/ }),
/* 291 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 // B.2.3.3 String.prototype.big()

__webpack_require__(12)('big', function (createHTML) {
  return function big() {
    return createHTML(this, 'big', '', '');
  };
});

/***/ }),
/* 292 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 // B.2.3.4 String.prototype.blink()

__webpack_require__(12)('blink', function (createHTML) {
  return function blink() {
    return createHTML(this, 'blink', '', '');
  };
});

/***/ }),
/* 293 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 // B.2.3.5 String.prototype.bold()

__webpack_require__(12)('bold', function (createHTML) {
  return function bold() {
    return createHTML(this, 'b', '', '');
  };
});

/***/ }),
/* 294 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 // B.2.3.6 String.prototype.fixed()

__webpack_require__(12)('fixed', function (createHTML) {
  return function fixed() {
    return createHTML(this, 'tt', '', '');
  };
});

/***/ }),
/* 295 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 // B.2.3.7 String.prototype.fontcolor(color)

__webpack_require__(12)('fontcolor', function (createHTML) {
  return function fontcolor(color) {
    return createHTML(this, 'font', 'color', color);
  };
});

/***/ }),
/* 296 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 // B.2.3.8 String.prototype.fontsize(size)

__webpack_require__(12)('fontsize', function (createHTML) {
  return function fontsize(size) {
    return createHTML(this, 'font', 'size', size);
  };
});

/***/ }),
/* 297 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 // B.2.3.9 String.prototype.italics()

__webpack_require__(12)('italics', function (createHTML) {
  return function italics() {
    return createHTML(this, 'i', '', '');
  };
});

/***/ }),
/* 298 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 // B.2.3.10 String.prototype.link(url)

__webpack_require__(12)('link', function (createHTML) {
  return function link(url) {
    return createHTML(this, 'a', 'href', url);
  };
});

/***/ }),
/* 299 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 // B.2.3.11 String.prototype.small()

__webpack_require__(12)('small', function (createHTML) {
  return function small() {
    return createHTML(this, 'small', '', '');
  };
});

/***/ }),
/* 300 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 // B.2.3.12 String.prototype.strike()

__webpack_require__(12)('strike', function (createHTML) {
  return function strike() {
    return createHTML(this, 'strike', '', '');
  };
});

/***/ }),
/* 301 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 // B.2.3.13 String.prototype.sub()

__webpack_require__(12)('sub', function (createHTML) {
  return function sub() {
    return createHTML(this, 'sub', '', '');
  };
});

/***/ }),
/* 302 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 // B.2.3.14 String.prototype.sup()

__webpack_require__(12)('sup', function (createHTML) {
  return function sup() {
    return createHTML(this, 'sup', '', '');
  };
});

/***/ }),
/* 303 */
/***/ (function(module, exports, __webpack_require__) {

// 20.3.3.1 / 15.9.4.4 Date.now()
var $export = __webpack_require__(0);

$export($export.S, 'Date', {
  now: function now() {
    return new Date().getTime();
  }
});

/***/ }),
/* 304 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $export = __webpack_require__(0);

var toObject = __webpack_require__(11);

var toPrimitive = __webpack_require__(33);

$export($export.P + $export.F * __webpack_require__(1)(function () {
  return new Date(NaN).toJSON() !== null || Date.prototype.toJSON.call({
    toISOString: function toISOString() {
      return 1;
    }
  }) !== 1;
}), 'Date', {
  // eslint-disable-next-line no-unused-vars
  toJSON: function toJSON(key) {
    var O = toObject(this);
    var pv = toPrimitive(O);
    return typeof pv == 'number' && !isFinite(pv) ? null : O.toISOString();
  }
});

/***/ }),
/* 305 */
/***/ (function(module, exports, __webpack_require__) {

// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
var $export = __webpack_require__(0);

var toISOString = __webpack_require__(306); // PhantomJS / old WebKit has a broken implementations


$export($export.P + $export.F * (Date.prototype.toISOString !== toISOString), 'Date', {
  toISOString: toISOString
});

/***/ }),
/* 306 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 // 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()

var fails = __webpack_require__(1);

var getTime = Date.prototype.getTime;
var $toISOString = Date.prototype.toISOString;

var lz = function lz(num) {
  return num > 9 ? num : '0' + num;
}; // PhantomJS / old WebKit has a broken implementations


module.exports = fails(function () {
  return $toISOString.call(new Date(-5e13 - 1)) != '0385-07-25T07:06:39.999Z';
}) || !fails(function () {
  $toISOString.call(new Date(NaN));
}) ? function toISOString() {
  if (!isFinite(getTime.call(this))) throw RangeError('Invalid time value');
  var d = this;
  var y = d.getUTCFullYear();
  var m = d.getUTCMilliseconds();
  var s = y < 0 ? '-' : y > 9999 ? '+' : '';
  return s + ('00000' + Math.abs(y)).slice(s ? -6 : -4) + '-' + lz(d.getUTCMonth() + 1) + '-' + lz(d.getUTCDate()) + 'T' + lz(d.getUTCHours()) + ':' + lz(d.getUTCMinutes()) + ':' + lz(d.getUTCSeconds()) + '.' + (m > 99 ? m : '0' + lz(m)) + 'Z';
} : $toISOString;

/***/ }),
/* 307 */
/***/ (function(module, exports, __webpack_require__) {

var DateProto = Date.prototype;
var INVALID_DATE = 'Invalid Date';
var TO_STRING = 'toString';
var $toString = DateProto[TO_STRING];
var getTime = DateProto.getTime;

if (new Date(NaN) + '' != INVALID_DATE) {
  __webpack_require__(16)(DateProto, TO_STRING, function toString() {
    var value = getTime.call(this); // eslint-disable-next-line no-self-compare

    return value === value ? $toString.call(this) : INVALID_DATE;
  });
}

/***/ }),
/* 308 */
/***/ (function(module, exports, __webpack_require__) {

var TO_PRIMITIVE = __webpack_require__(5)('toPrimitive');

var proto = Date.prototype;
if (!(TO_PRIMITIVE in proto)) __webpack_require__(19)(proto, TO_PRIMITIVE, __webpack_require__(309));

/***/ }),
/* 309 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var anObject = __webpack_require__(2);

var toPrimitive = __webpack_require__(33);

var NUMBER = 'number';

module.exports = function (hint) {
  if (hint !== 'string' && hint !== NUMBER && hint !== 'default') throw TypeError('Incorrect hint');
  return toPrimitive(anObject(this), hint != NUMBER);
};

/***/ }),
/* 310 */
/***/ (function(module, exports, __webpack_require__) {

// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
var $export = __webpack_require__(0);

$export($export.S, 'Array', {
  isArray: __webpack_require__(72)
});

/***/ }),
/* 311 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ctx = __webpack_require__(21);

var $export = __webpack_require__(0);

var toObject = __webpack_require__(11);

var call = __webpack_require__(162);

var isArrayIter = __webpack_require__(111);

var toLength = __webpack_require__(6);

var createProperty = __webpack_require__(112);

var getIterFn = __webpack_require__(113);

$export($export.S + $export.F * !__webpack_require__(73)(function (iter) {
  Array.from(iter);
}), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike
  /* , mapfn = undefined, thisArg = undefined */
  ) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = getIterFn(O);
    var length, result, step, iterator;
    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2); // if object isn't iterable or it's array with default iterator - use simple case

    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);

      for (result = new C(length); length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }

    result.length = index;
    return result;
  }
});

/***/ }),
/* 312 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $export = __webpack_require__(0);

var createProperty = __webpack_require__(112); // WebKit Array.of isn't generic


$export($export.S + $export.F * __webpack_require__(1)(function () {
  function F() {
    /* empty */
  }

  return !(Array.of.call(F) instanceof F);
}), 'Array', {
  // 22.1.2.3 Array.of( ...items)
  of: function of()
  /* ...args */
  {
    var index = 0;
    var aLen = arguments.length;
    var result = new (typeof this == 'function' ? this : Array)(aLen);

    while (aLen > index) {
      createProperty(result, index, arguments[index++]);
    }

    result.length = aLen;
    return result;
  }
});

/***/ }),
/* 313 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 // 22.1.3.13 Array.prototype.join(separator)

var $export = __webpack_require__(0);

var toIObject = __webpack_require__(17);

var arrayJoin = [].join; // fallback for not array-like strings

$export($export.P + $export.F * (__webpack_require__(57) != Object || !__webpack_require__(20)(arrayJoin)), 'Array', {
  join: function join(separator) {
    return arrayJoin.call(toIObject(this), separator === undefined ? ',' : separator);
  }
});

/***/ }),
/* 314 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $export = __webpack_require__(0);

var html = __webpack_require__(99);

var cof = __webpack_require__(28);

var toAbsoluteIndex = __webpack_require__(40);

var toLength = __webpack_require__(6);

var arraySlice = [].slice; // fallback for not array-like ES3 strings and DOM objects

$export($export.P + $export.F * __webpack_require__(1)(function () {
  if (html) arraySlice.call(html);
}), 'Array', {
  slice: function slice(begin, end) {
    var len = toLength(this.length);
    var klass = cof(this);
    end = end === undefined ? len : end;
    if (klass == 'Array') return arraySlice.call(this, begin, end);
    var start = toAbsoluteIndex(begin, len);
    var upTo = toAbsoluteIndex(end, len);
    var size = toLength(upTo - start);
    var cloned = new Array(size);
    var i = 0;

    for (; i < size; i++) {
      cloned[i] = klass == 'String' ? this.charAt(start + i) : this[start + i];
    }

    return cloned;
  }
});

/***/ }),
/* 315 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $export = __webpack_require__(0);

var aFunction = __webpack_require__(22);

var toObject = __webpack_require__(11);

var fails = __webpack_require__(1);

var $sort = [].sort;
var test = [1, 2, 3];
$export($export.P + $export.F * (fails(function () {
  // IE8-
  test.sort(undefined);
}) || !fails(function () {
  // V8 bug
  test.sort(null); // Old WebKit
}) || !__webpack_require__(20)($sort)), 'Array', {
  // 22.1.3.25 Array.prototype.sort(comparefn)
  sort: function sort(comparefn) {
    return comparefn === undefined ? $sort.call(toObject(this)) : $sort.call(toObject(this), aFunction(comparefn));
  }
});

/***/ }),
/* 316 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $export = __webpack_require__(0);

var $forEach = __webpack_require__(26)(0);

var STRICT = __webpack_require__(20)([].forEach, true);

$export($export.P + $export.F * !STRICT, 'Array', {
  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
  forEach: function forEach(callbackfn
  /* , thisArg */
  ) {
    return $forEach(this, callbackfn, arguments[1]);
  }
});

/***/ }),
/* 317 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(3);

var isArray = __webpack_require__(72);

var SPECIES = __webpack_require__(5)('species');

module.exports = function (original) {
  var C;

  if (isArray(original)) {
    C = original.constructor; // cross-realm fallback

    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;

    if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  }

  return C === undefined ? Array : C;
};

/***/ }),
/* 318 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $export = __webpack_require__(0);

var $map = __webpack_require__(26)(1);

$export($export.P + $export.F * !__webpack_require__(20)([].map, true), 'Array', {
  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
  map: function map(callbackfn
  /* , thisArg */
  ) {
    return $map(this, callbackfn, arguments[1]);
  }
});

/***/ }),
/* 319 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $export = __webpack_require__(0);

var $filter = __webpack_require__(26)(2);

$export($export.P + $export.F * !__webpack_require__(20)([].filter, true), 'Array', {
  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
  filter: function filter(callbackfn
  /* , thisArg */
  ) {
    return $filter(this, callbackfn, arguments[1]);
  }
});

/***/ }),
/* 320 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $export = __webpack_require__(0);

var $some = __webpack_require__(26)(3);

$export($export.P + $export.F * !__webpack_require__(20)([].some, true), 'Array', {
  // 22.1.3.23 / 15.4.4.17 Array.prototype.some(callbackfn [, thisArg])
  some: function some(callbackfn
  /* , thisArg */
  ) {
    return $some(this, callbackfn, arguments[1]);
  }
});

/***/ }),
/* 321 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $export = __webpack_require__(0);

var $every = __webpack_require__(26)(4);

$export($export.P + $export.F * !__webpack_require__(20)([].every, true), 'Array', {
  // 22.1.3.5 / 15.4.4.16 Array.prototype.every(callbackfn [, thisArg])
  every: function every(callbackfn
  /* , thisArg */
  ) {
    return $every(this, callbackfn, arguments[1]);
  }
});

/***/ }),
/* 322 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $export = __webpack_require__(0);

var $reduce = __webpack_require__(164);

$export($export.P + $export.F * !__webpack_require__(20)([].reduce, true), 'Array', {
  // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
  reduce: function reduce(callbackfn
  /* , initialValue */
  ) {
    return $reduce(this, callbackfn, arguments.length, arguments[1], false);
  }
});

/***/ }),
/* 323 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $export = __webpack_require__(0);

var $reduce = __webpack_require__(164);

$export($export.P + $export.F * !__webpack_require__(20)([].reduceRight, true), 'Array', {
  // 22.1.3.19 / 15.4.4.22 Array.prototype.reduceRight(callbackfn [, initialValue])
  reduceRight: function reduceRight(callbackfn
  /* , initialValue */
  ) {
    return $reduce(this, callbackfn, arguments.length, arguments[1], true);
  }
});

/***/ }),
/* 324 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $export = __webpack_require__(0);

var $indexOf = __webpack_require__(70)(false);

var $native = [].indexOf;
var NEGATIVE_ZERO = !!$native && 1 / [1].indexOf(1, -0) < 0;
$export($export.P + $export.F * (NEGATIVE_ZERO || !__webpack_require__(20)($native)), 'Array', {
  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
  indexOf: function indexOf(searchElement
  /* , fromIndex = 0 */
  ) {
    return NEGATIVE_ZERO // convert -0 to +0
    ? $native.apply(this, arguments) || 0 : $indexOf(this, searchElement, arguments[1]);
  }
});

/***/ }),
/* 325 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $export = __webpack_require__(0);

var toIObject = __webpack_require__(17);

var toInteger = __webpack_require__(23);

var toLength = __webpack_require__(6);

var $native = [].lastIndexOf;
var NEGATIVE_ZERO = !!$native && 1 / [1].lastIndexOf(1, -0) < 0;
$export($export.P + $export.F * (NEGATIVE_ZERO || !__webpack_require__(20)($native)), 'Array', {
  // 22.1.3.14 / 15.4.4.15 Array.prototype.lastIndexOf(searchElement [, fromIndex])
  lastIndexOf: function lastIndexOf(searchElement
  /* , fromIndex = @[*-1] */
  ) {
    // convert -0 to +0
    if (NEGATIVE_ZERO) return $native.apply(this, arguments) || 0;
    var O = toIObject(this);
    var length = toLength(O.length);
    var index = length - 1;
    if (arguments.length > 1) index = Math.min(index, toInteger(arguments[1]));
    if (index < 0) index = length + index;

    for (; index >= 0; index--) {
      if (index in O) if (O[index] === searchElement) return index || 0;
    }

    return -1;
  }
});

/***/ }),
/* 326 */
/***/ (function(module, exports, __webpack_require__) {

// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
var $export = __webpack_require__(0);

$export($export.P, 'Array', {
  copyWithin: __webpack_require__(165)
});

__webpack_require__(44)('copyWithin');

/***/ }),
/* 327 */
/***/ (function(module, exports, __webpack_require__) {

// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
var $export = __webpack_require__(0);

$export($export.P, 'Array', {
  fill: __webpack_require__(114)
});

__webpack_require__(44)('fill');

/***/ }),
/* 328 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 // 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)

var $export = __webpack_require__(0);

var $find = __webpack_require__(26)(5);

var KEY = 'find';
var forced = true; // Shouldn't skip holes

if (KEY in []) Array(1)[KEY](function () {
  forced = false;
});
$export($export.P + $export.F * forced, 'Array', {
  find: function find(callbackfn
  /* , that = undefined */
  ) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

__webpack_require__(44)(KEY);

/***/ }),
/* 329 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 // 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)

var $export = __webpack_require__(0);

var $find = __webpack_require__(26)(6);

var KEY = 'findIndex';
var forced = true; // Shouldn't skip holes

if (KEY in []) Array(1)[KEY](function () {
  forced = false;
});
$export($export.P + $export.F * forced, 'Array', {
  findIndex: function findIndex(callbackfn
  /* , that = undefined */
  ) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

__webpack_require__(44)(KEY);

/***/ }),
/* 330 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(50)('Array');

/***/ }),
/* 331 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(4);

var inheritIfRequired = __webpack_require__(102);

var dP = __webpack_require__(10).f;

var gOPN = __webpack_require__(42).f;

var isRegExp = __webpack_require__(109);

var $flags = __webpack_require__(74);

var $RegExp = global.RegExp;
var Base = $RegExp;
var proto = $RegExp.prototype;
var re1 = /a/g;
var re2 = /a/g; // "new" creates a new object, old webkit buggy here

var CORRECT_NEW = new $RegExp(re1) !== re1;

if (__webpack_require__(8) && (!CORRECT_NEW || __webpack_require__(1)(function () {
  re2[__webpack_require__(5)('match')] = false; // RegExp constructor can alter flags and IsRegExp works correct with @@match

  return $RegExp(re1) != re1 || $RegExp(re2) == re2 || $RegExp(re1, 'i') != '/a/i';
}))) {
  $RegExp = function RegExp(p, f) {
    var tiRE = this instanceof $RegExp;
    var piRE = isRegExp(p);
    var fiU = f === undefined;
    return !tiRE && piRE && p.constructor === $RegExp && fiU ? p : inheritIfRequired(CORRECT_NEW ? new Base(piRE && !fiU ? p.source : p, f) : Base((piRE = p instanceof $RegExp) ? p.source : p, piRE && fiU ? $flags.call(p) : f), tiRE ? this : proto, $RegExp);
  };

  var proxy = function proxy(key) {
    key in $RegExp || dP($RegExp, key, {
      configurable: true,
      get: function get() {
        return Base[key];
      },
      set: function set(it) {
        Base[key] = it;
      }
    });
  };

  for (var keys = gOPN(Base), i = 0; keys.length > i;) {
    proxy(keys[i++]);
  }

  proto.constructor = $RegExp;
  $RegExp.prototype = proto;

  __webpack_require__(16)(global, 'RegExp', $RegExp);
}

__webpack_require__(50)('RegExp');

/***/ }),
/* 332 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(169);

var anObject = __webpack_require__(2);

var $flags = __webpack_require__(74);

var DESCRIPTORS = __webpack_require__(8);

var TO_STRING = 'toString';
var $toString = /./[TO_STRING];

var define = function define(fn) {
  __webpack_require__(16)(RegExp.prototype, TO_STRING, fn, true);
}; // 21.2.5.14 RegExp.prototype.toString()


if (__webpack_require__(1)(function () {
  return $toString.call({
    source: 'a',
    flags: 'b'
  }) != '/a/b';
})) {
  define(function toString() {
    var R = anObject(this);
    return '/'.concat(R.source, '/', 'flags' in R ? R.flags : !DESCRIPTORS && R instanceof RegExp ? $flags.call(R) : undefined);
  }); // FF44- RegExp#toString has a wrong name
} else if ($toString.name != TO_STRING) {
  define(function toString() {
    return $toString.call(this);
  });
}

/***/ }),
/* 333 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var anObject = __webpack_require__(2);

var toLength = __webpack_require__(6);

var advanceStringIndex = __webpack_require__(116);

var regExpExec = __webpack_require__(75); // @@match logic


__webpack_require__(76)('match', 1, function (defined, MATCH, $match, maybeCallNative) {
  return [// `String.prototype.match` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.match
  function match(regexp) {
    var O = defined(this);
    var fn = regexp == undefined ? undefined : regexp[MATCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
  }, // `RegExp.prototype[@@match]` method
  // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@match
  function (regexp) {
    var res = maybeCallNative($match, regexp, this);
    if (res.done) return res.value;
    var rx = anObject(regexp);
    var S = String(this);
    if (!rx.global) return regExpExec(rx, S);
    var fullUnicode = rx.unicode;
    rx.lastIndex = 0;
    var A = [];
    var n = 0;
    var result;

    while ((result = regExpExec(rx, S)) !== null) {
      var matchStr = String(result[0]);
      A[n] = matchStr;
      if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
      n++;
    }

    return n === 0 ? null : A;
  }];
});

/***/ }),
/* 334 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var anObject = __webpack_require__(2);

var toObject = __webpack_require__(11);

var toLength = __webpack_require__(6);

var toInteger = __webpack_require__(23);

var advanceStringIndex = __webpack_require__(116);

var regExpExec = __webpack_require__(75);

var max = Math.max;
var min = Math.min;
var floor = Math.floor;
var SUBSTITUTION_SYMBOLS = /\$([$&`']|\d\d?|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&`']|\d\d?)/g;

var maybeToString = function maybeToString(it) {
  return it === undefined ? it : String(it);
}; // @@replace logic


__webpack_require__(76)('replace', 2, function (defined, REPLACE, $replace, maybeCallNative) {
  return [// `String.prototype.replace` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.replace
  function replace(searchValue, replaceValue) {
    var O = defined(this);
    var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
    return fn !== undefined ? fn.call(searchValue, O, replaceValue) : $replace.call(String(O), searchValue, replaceValue);
  }, // `RegExp.prototype[@@replace]` method
  // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
  function (regexp, replaceValue) {
    var res = maybeCallNative($replace, regexp, this, replaceValue);
    if (res.done) return res.value;
    var rx = anObject(regexp);
    var S = String(this);
    var functionalReplace = typeof replaceValue === 'function';
    if (!functionalReplace) replaceValue = String(replaceValue);
    var global = rx.global;

    if (global) {
      var fullUnicode = rx.unicode;
      rx.lastIndex = 0;
    }

    var results = [];

    while (true) {
      var result = regExpExec(rx, S);
      if (result === null) break;
      results.push(result);
      if (!global) break;
      var matchStr = String(result[0]);
      if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
    }

    var accumulatedResult = '';
    var nextSourcePosition = 0;

    for (var i = 0; i < results.length; i++) {
      result = results[i];
      var matched = String(result[0]);
      var position = max(min(toInteger(result.index), S.length), 0);
      var captures = []; // NOTE: This is equivalent to
      //   captures = result.slice(1).map(maybeToString)
      // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
      // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
      // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.

      for (var j = 1; j < result.length; j++) {
        captures.push(maybeToString(result[j]));
      }

      var namedCaptures = result.groups;

      if (functionalReplace) {
        var replacerArgs = [matched].concat(captures, position, S);
        if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
        var replacement = String(replaceValue.apply(undefined, replacerArgs));
      } else {
        replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
      }

      if (position >= nextSourcePosition) {
        accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
        nextSourcePosition = position + matched.length;
      }
    }

    return accumulatedResult + S.slice(nextSourcePosition);
  }]; // https://tc39.github.io/ecma262/#sec-getsubstitution

  function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
    var tailPos = position + matched.length;
    var m = captures.length;
    var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;

    if (namedCaptures !== undefined) {
      namedCaptures = toObject(namedCaptures);
      symbols = SUBSTITUTION_SYMBOLS;
    }

    return $replace.call(replacement, symbols, function (match, ch) {
      var capture;

      switch (ch.charAt(0)) {
        case '$':
          return '$';

        case '&':
          return matched;

        case '`':
          return str.slice(0, position);

        case "'":
          return str.slice(tailPos);

        case '<':
          capture = namedCaptures[ch.slice(1, -1)];
          break;

        default:
          // \d\d?
          var n = +ch;
          if (n === 0) return match;

          if (n > m) {
            var f = floor(n / 10);
            if (f === 0) return match;
            if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
            return match;
          }

          capture = captures[n - 1];
      }

      return capture === undefined ? '' : capture;
    });
  }
});

/***/ }),
/* 335 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var anObject = __webpack_require__(2);

var sameValue = __webpack_require__(153);

var regExpExec = __webpack_require__(75); // @@search logic


__webpack_require__(76)('search', 1, function (defined, SEARCH, $search, maybeCallNative) {
  return [// `String.prototype.search` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.search
  function search(regexp) {
    var O = defined(this);
    var fn = regexp == undefined ? undefined : regexp[SEARCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
  }, // `RegExp.prototype[@@search]` method
  // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@search
  function (regexp) {
    var res = maybeCallNative($search, regexp, this);
    if (res.done) return res.value;
    var rx = anObject(regexp);
    var S = String(this);
    var previousLastIndex = rx.lastIndex;
    if (!sameValue(previousLastIndex, 0)) rx.lastIndex = 0;
    var result = regExpExec(rx, S);
    if (!sameValue(rx.lastIndex, previousLastIndex)) rx.lastIndex = previousLastIndex;
    return result === null ? -1 : result.index;
  }];
});

/***/ }),
/* 336 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isRegExp = __webpack_require__(109);

var anObject = __webpack_require__(2);

var speciesConstructor = __webpack_require__(61);

var advanceStringIndex = __webpack_require__(116);

var toLength = __webpack_require__(6);

var callRegExpExec = __webpack_require__(75);

var regexpExec = __webpack_require__(115);

var fails = __webpack_require__(1);

var $min = Math.min;
var $push = [].push;
var $SPLIT = 'split';
var LENGTH = 'length';
var LAST_INDEX = 'lastIndex';
var MAX_UINT32 = 0xffffffff; // babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError

var SUPPORTS_Y = !fails(function () {
  RegExp(MAX_UINT32, 'y');
}); // @@split logic

__webpack_require__(76)('split', 2, function (defined, SPLIT, $split, maybeCallNative) {
  var internalSplit;

  if ('abbc'[$SPLIT](/(b)*/)[1] == 'c' || 'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 || 'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 || '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 || '.'[$SPLIT](/()()/)[LENGTH] > 1 || ''[$SPLIT](/.?/)[LENGTH]) {
    // based on es5-shim implementation, need to rework it
    internalSplit = function internalSplit(separator, limit) {
      var string = String(this);
      if (separator === undefined && limit === 0) return []; // If `separator` is not a regex, use native split

      if (!isRegExp(separator)) return $split.call(string, separator, limit);
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') + (separator.multiline ? 'm' : '') + (separator.unicode ? 'u' : '') + (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      var splitLimit = limit === undefined ? MAX_UINT32 : limit >>> 0; // Make `global` and avoid `lastIndex` issues by working with a copy

      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var match, lastIndex, lastLength;

      while (match = regexpExec.call(separatorCopy, string)) {
        lastIndex = separatorCopy[LAST_INDEX];

        if (lastIndex > lastLastIndex) {
          output.push(string.slice(lastLastIndex, match.index));
          if (match[LENGTH] > 1 && match.index < string[LENGTH]) $push.apply(output, match.slice(1));
          lastLength = match[0][LENGTH];
          lastLastIndex = lastIndex;
          if (output[LENGTH] >= splitLimit) break;
        }

        if (separatorCopy[LAST_INDEX] === match.index) separatorCopy[LAST_INDEX]++; // Avoid an infinite loop
      }

      if (lastLastIndex === string[LENGTH]) {
        if (lastLength || !separatorCopy.test('')) output.push('');
      } else output.push(string.slice(lastLastIndex));

      return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
    }; // Chakra, V8

  } else if ('0'[$SPLIT](undefined, 0)[LENGTH]) {
    internalSplit = function internalSplit(separator, limit) {
      return separator === undefined && limit === 0 ? [] : $split.call(this, separator, limit);
    };
  } else {
    internalSplit = $split;
  }

  return [// `String.prototype.split` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.split
  function split(separator, limit) {
    var O = defined(this);
    var splitter = separator == undefined ? undefined : separator[SPLIT];
    return splitter !== undefined ? splitter.call(separator, O, limit) : internalSplit.call(String(O), separator, limit);
  }, // `RegExp.prototype[@@split]` method
  // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
  //
  // NOTE: This cannot be properly polyfilled in engines that don't support
  // the 'y' flag.
  function (regexp, limit) {
    var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== $split);
    if (res.done) return res.value;
    var rx = anObject(regexp);
    var S = String(this);
    var C = speciesConstructor(rx, RegExp);
    var unicodeMatching = rx.unicode;
    var flags = (rx.ignoreCase ? 'i' : '') + (rx.multiline ? 'm' : '') + (rx.unicode ? 'u' : '') + (SUPPORTS_Y ? 'y' : 'g'); // ^(? + rx + ) is needed, in combination with some S slicing, to
    // simulate the 'y' flag.

    var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
    var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
    if (lim === 0) return [];
    if (S.length === 0) return callRegExpExec(splitter, S) === null ? [S] : [];
    var p = 0;
    var q = 0;
    var A = [];

    while (q < S.length) {
      splitter.lastIndex = SUPPORTS_Y ? q : 0;
      var z = callRegExpExec(splitter, SUPPORTS_Y ? S : S.slice(q));
      var e;

      if (z === null || (e = $min(toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p) {
        q = advanceStringIndex(S, q, unicodeMatching);
      } else {
        A.push(S.slice(p, q));
        if (A.length === lim) return A;

        for (var i = 1; i <= z.length - 1; i++) {
          A.push(z[i]);
          if (A.length === lim) return A;
        }

        q = p = e;
      }
    }

    A.push(S.slice(p));
    return A;
  }];
});

/***/ }),
/* 337 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(4);

var macrotask = __webpack_require__(171).set;

var Observer = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var isNode = __webpack_require__(28)(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function flush() {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();

    while (head) {
      fn = head.fn;
      head = head.next;

      try {
        fn();
      } catch (e) {
        if (head) notify();else last = undefined;
        throw e;
      }
    }

    last = undefined;
    if (parent) parent.enter();
  }; // Node.js


  if (isNode) {
    notify = function notify() {
      process.nextTick(flush);
    }; // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339

  } else if (Observer && !(global.navigator && global.navigator.standalone)) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, {
      characterData: true
    }); // eslint-disable-line no-new

    notify = function notify() {
      node.data = toggle = !toggle;
    }; // environments with maybe non-completely correct, but existent Promise

  } else if (Promise && Promise.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    var promise = Promise.resolve(undefined);

    notify = function notify() {
      promise.then(flush);
    }; // for other environments - macrotask based on:
    // - setImmediate
    // - MessageChannel
    // - window.postMessag
    // - onreadystatechange
    // - setTimeout

  } else {
    notify = function notify() {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function (fn) {
    var task = {
      fn: fn,
      next: undefined
    };
    if (last) last.next = task;

    if (!head) {
      head = task;
      notify();
    }

    last = task;
  };
};

/***/ }),
/* 338 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return {
      e: false,
      v: exec()
    };
  } catch (e) {
    return {
      e: true,
      v: e
    };
  }
};

/***/ }),
/* 339 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var strong = __webpack_require__(174);

var validate = __webpack_require__(45);

var MAP = 'Map'; // 23.1 Map Objects

module.exports = __webpack_require__(78)(MAP, function (get) {
  return function Map() {
    return get(this, arguments.length > 0 ? arguments[0] : undefined);
  };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key) {
    var entry = strong.getEntry(validate(this, MAP), key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value) {
    return strong.def(validate(this, MAP), key === 0 ? 0 : key, value);
  }
}, strong, true);

/***/ }),
/* 340 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var strong = __webpack_require__(174);

var validate = __webpack_require__(45);

var SET = 'Set'; // 23.2 Set Objects

module.exports = __webpack_require__(78)(SET, function (get) {
  return function Set() {
    return get(this, arguments.length > 0 ? arguments[0] : undefined);
  };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value) {
    return strong.def(validate(this, SET), value = value === 0 ? 0 : value, value);
  }
}, strong);

/***/ }),
/* 341 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var global = __webpack_require__(4);

var each = __webpack_require__(26)(0);

var redefine = __webpack_require__(16);

var meta = __webpack_require__(34);

var assign = __webpack_require__(152);

var weak = __webpack_require__(175);

var isObject = __webpack_require__(3);

var validate = __webpack_require__(45);

var NATIVE_WEAK_MAP = __webpack_require__(45);

var IS_IE11 = !global.ActiveXObject && 'ActiveXObject' in global;
var WEAK_MAP = 'WeakMap';
var getWeak = meta.getWeak;
var isExtensible = Object.isExtensible;
var uncaughtFrozenStore = weak.ufstore;
var InternalMap;

var wrapper = function wrapper(get) {
  return function WeakMap() {
    return get(this, arguments.length > 0 ? arguments[0] : undefined);
  };
};

var methods = {
  // 23.3.3.3 WeakMap.prototype.get(key)
  get: function get(key) {
    if (isObject(key)) {
      var data = getWeak(key);
      if (data === true) return uncaughtFrozenStore(validate(this, WEAK_MAP)).get(key);
      return data ? data[this._i] : undefined;
    }
  },
  // 23.3.3.5 WeakMap.prototype.set(key, value)
  set: function set(key, value) {
    return weak.def(validate(this, WEAK_MAP), key, value);
  }
}; // 23.3 WeakMap Objects

var $WeakMap = module.exports = __webpack_require__(78)(WEAK_MAP, wrapper, methods, weak, true, true); // IE11 WeakMap frozen keys fix


if (NATIVE_WEAK_MAP && IS_IE11) {
  InternalMap = weak.getConstructor(wrapper, WEAK_MAP);
  assign(InternalMap.prototype, methods);
  meta.NEED = true;
  each(['delete', 'has', 'get', 'set'], function (key) {
    var proto = $WeakMap.prototype;
    var method = proto[key];
    redefine(proto, key, function (a, b) {
      // store frozen objects on internal weakmap shim
      if (isObject(a) && !isExtensible(a)) {
        if (!this._f) this._f = new InternalMap();

        var result = this._f[key](a, b);

        return key == 'set' ? this : result; // store all the rest on native weakmap
      }

      return method.call(this, a, b);
    });
  });
}

/***/ }),
/* 342 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var weak = __webpack_require__(175);

var validate = __webpack_require__(45);

var WEAK_SET = 'WeakSet'; // 23.4 WeakSet Objects

__webpack_require__(78)(WEAK_SET, function (get) {
  return function WeakSet() {
    return get(this, arguments.length > 0 ? arguments[0] : undefined);
  };
}, {
  // 23.4.3.1 WeakSet.prototype.add(value)
  add: function add(value) {
    return weak.def(validate(this, WEAK_SET), value, true);
  }
}, weak, false, true);

/***/ }),
/* 343 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $export = __webpack_require__(0);

var $typed = __webpack_require__(79);

var buffer = __webpack_require__(118);

var anObject = __webpack_require__(2);

var toAbsoluteIndex = __webpack_require__(40);

var toLength = __webpack_require__(6);

var isObject = __webpack_require__(3);

var ArrayBuffer = __webpack_require__(4).ArrayBuffer;

var speciesConstructor = __webpack_require__(61);

var $ArrayBuffer = buffer.ArrayBuffer;
var $DataView = buffer.DataView;
var $isView = $typed.ABV && ArrayBuffer.isView;
var $slice = $ArrayBuffer.prototype.slice;
var VIEW = $typed.VIEW;
var ARRAY_BUFFER = 'ArrayBuffer';
$export($export.G + $export.W + $export.F * (ArrayBuffer !== $ArrayBuffer), {
  ArrayBuffer: $ArrayBuffer
});
$export($export.S + $export.F * !$typed.CONSTR, ARRAY_BUFFER, {
  // 24.1.3.1 ArrayBuffer.isView(arg)
  isView: function isView(it) {
    return $isView && $isView(it) || isObject(it) && VIEW in it;
  }
});
$export($export.P + $export.U + $export.F * __webpack_require__(1)(function () {
  return !new $ArrayBuffer(2).slice(1, undefined).byteLength;
}), ARRAY_BUFFER, {
  // 24.1.4.3 ArrayBuffer.prototype.slice(start, end)
  slice: function slice(start, end) {
    if ($slice !== undefined && end === undefined) return $slice.call(anObject(this), start); // FF fix

    var len = anObject(this).byteLength;
    var first = toAbsoluteIndex(start, len);
    var fin = toAbsoluteIndex(end === undefined ? len : end, len);
    var result = new (speciesConstructor(this, $ArrayBuffer))(toLength(fin - first));
    var viewS = new $DataView(this);
    var viewT = new $DataView(result);
    var index = 0;

    while (first < fin) {
      viewT.setUint8(index++, viewS.getUint8(first++));
    }

    return result;
  }
});

__webpack_require__(50)(ARRAY_BUFFER);

/***/ }),
/* 344 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);

$export($export.G + $export.W + $export.F * !__webpack_require__(79).ABV, {
  DataView: __webpack_require__(118).DataView
});

/***/ }),
/* 345 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(30)('Int8', 1, function (init) {
  return function Int8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

/***/ }),
/* 346 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(30)('Uint8', 1, function (init) {
  return function Uint8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

/***/ }),
/* 347 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(30)('Uint8', 1, function (init) {
  return function Uint8ClampedArray(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
}, true);

/***/ }),
/* 348 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(30)('Int16', 2, function (init) {
  return function Int16Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

/***/ }),
/* 349 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(30)('Uint16', 2, function (init) {
  return function Uint16Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

/***/ }),
/* 350 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(30)('Int32', 4, function (init) {
  return function Int32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

/***/ }),
/* 351 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(30)('Uint32', 4, function (init) {
  return function Uint32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

/***/ }),
/* 352 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(30)('Float32', 4, function (init) {
  return function Float32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

/***/ }),
/* 353 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(30)('Float64', 8, function (init) {
  return function Float64Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

/***/ }),
/* 354 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.1 Reflect.apply(target, thisArgument, argumentsList)
var $export = __webpack_require__(0);

var aFunction = __webpack_require__(22);

var anObject = __webpack_require__(2);

var rApply = (__webpack_require__(4).Reflect || {}).apply;
var fApply = Function.apply; // MS Edge argumentsList argument is optional

$export($export.S + $export.F * !__webpack_require__(1)(function () {
  rApply(function () {
    /* empty */
  });
}), 'Reflect', {
  apply: function apply(target, thisArgument, argumentsList) {
    var T = aFunction(target);
    var L = anObject(argumentsList);
    return rApply ? rApply(T, thisArgument, L) : fApply.call(T, thisArgument, L);
  }
});

/***/ }),
/* 355 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.2 Reflect.construct(target, argumentsList [, newTarget])
var $export = __webpack_require__(0);

var create = __webpack_require__(41);

var aFunction = __webpack_require__(22);

var anObject = __webpack_require__(2);

var isObject = __webpack_require__(3);

var fails = __webpack_require__(1);

var bind = __webpack_require__(154);

var rConstruct = (__webpack_require__(4).Reflect || {}).construct; // MS Edge supports only 2 arguments and argumentsList argument is optional
// FF Nightly sets third argument as `new.target`, but does not create `this` from it

var NEW_TARGET_BUG = fails(function () {
  function F() {
    /* empty */
  }

  return !(rConstruct(function () {
    /* empty */
  }, [], F) instanceof F);
});
var ARGS_BUG = !fails(function () {
  rConstruct(function () {
    /* empty */
  });
});
$export($export.S + $export.F * (NEW_TARGET_BUG || ARGS_BUG), 'Reflect', {
  construct: function construct(Target, args
  /* , newTarget */
  ) {
    aFunction(Target);
    anObject(args);
    var newTarget = arguments.length < 3 ? Target : aFunction(arguments[2]);
    if (ARGS_BUG && !NEW_TARGET_BUG) return rConstruct(Target, args, newTarget);

    if (Target == newTarget) {
      // w/o altered newTarget, optimization for 0-4 arguments
      switch (args.length) {
        case 0:
          return new Target();

        case 1:
          return new Target(args[0]);

        case 2:
          return new Target(args[0], args[1]);

        case 3:
          return new Target(args[0], args[1], args[2]);

        case 4:
          return new Target(args[0], args[1], args[2], args[3]);
      } // w/o altered newTarget, lot of arguments case


      var $args = [null];
      $args.push.apply($args, args);
      return new (bind.apply(Target, $args))();
    } // with altered newTarget, not support built-in constructors


    var proto = newTarget.prototype;
    var instance = create(isObject(proto) ? proto : Object.prototype);
    var result = Function.apply.call(Target, instance, args);
    return isObject(result) ? result : instance;
  }
});

/***/ }),
/* 356 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
var dP = __webpack_require__(10);

var $export = __webpack_require__(0);

var anObject = __webpack_require__(2);

var toPrimitive = __webpack_require__(33); // MS Edge has broken Reflect.defineProperty - throwing instead of returning false


$export($export.S + $export.F * __webpack_require__(1)(function () {
  // eslint-disable-next-line no-undef
  Reflect.defineProperty(dP.f({}, 1, {
    value: 1
  }), 1, {
    value: 2
  });
}), 'Reflect', {
  defineProperty: function defineProperty(target, propertyKey, attributes) {
    anObject(target);
    propertyKey = toPrimitive(propertyKey, true);
    anObject(attributes);

    try {
      dP.f(target, propertyKey, attributes);
      return true;
    } catch (e) {
      return false;
    }
  }
});

/***/ }),
/* 357 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.4 Reflect.deleteProperty(target, propertyKey)
var $export = __webpack_require__(0);

var gOPD = __webpack_require__(24).f;

var anObject = __webpack_require__(2);

$export($export.S, 'Reflect', {
  deleteProperty: function deleteProperty(target, propertyKey) {
    var desc = gOPD(anObject(target), propertyKey);
    return desc && !desc.configurable ? false : delete target[propertyKey];
  }
});

/***/ }),
/* 358 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 // 26.1.5 Reflect.enumerate(target)

var $export = __webpack_require__(0);

var anObject = __webpack_require__(2);

var Enumerate = function Enumerate(iterated) {
  this._t = anObject(iterated); // target

  this._i = 0; // next index

  var keys = this._k = []; // keys

  var key;

  for (key in iterated) {
    keys.push(key);
  }
};

__webpack_require__(161)(Enumerate, 'Object', function () {
  var that = this;
  var keys = that._k;
  var key;

  do {
    if (that._i >= keys.length) return {
      value: undefined,
      done: true
    };
  } while (!((key = keys[that._i++]) in that._t));

  return {
    value: key,
    done: false
  };
});

$export($export.S, 'Reflect', {
  enumerate: function enumerate(target) {
    return new Enumerate(target);
  }
});

/***/ }),
/* 359 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.6 Reflect.get(target, propertyKey [, receiver])
var gOPD = __webpack_require__(24);

var getPrototypeOf = __webpack_require__(43);

var has = __webpack_require__(15);

var $export = __webpack_require__(0);

var isObject = __webpack_require__(3);

var anObject = __webpack_require__(2);

function get(target, propertyKey
/* , receiver */
) {
  var receiver = arguments.length < 3 ? target : arguments[2];
  var desc, proto;
  if (anObject(target) === receiver) return target[propertyKey];
  if (desc = gOPD.f(target, propertyKey)) return has(desc, 'value') ? desc.value : desc.get !== undefined ? desc.get.call(receiver) : undefined;
  if (isObject(proto = getPrototypeOf(target))) return get(proto, propertyKey, receiver);
}

$export($export.S, 'Reflect', {
  get: get
});

/***/ }),
/* 360 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)
var gOPD = __webpack_require__(24);

var $export = __webpack_require__(0);

var anObject = __webpack_require__(2);

$export($export.S, 'Reflect', {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey) {
    return gOPD.f(anObject(target), propertyKey);
  }
});

/***/ }),
/* 361 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.8 Reflect.getPrototypeOf(target)
var $export = __webpack_require__(0);

var getProto = __webpack_require__(43);

var anObject = __webpack_require__(2);

$export($export.S, 'Reflect', {
  getPrototypeOf: function getPrototypeOf(target) {
    return getProto(anObject(target));
  }
});

/***/ }),
/* 362 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.9 Reflect.has(target, propertyKey)
var $export = __webpack_require__(0);

$export($export.S, 'Reflect', {
  has: function has(target, propertyKey) {
    return propertyKey in target;
  }
});

/***/ }),
/* 363 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.10 Reflect.isExtensible(target)
var $export = __webpack_require__(0);

var anObject = __webpack_require__(2);

var $isExtensible = Object.isExtensible;
$export($export.S, 'Reflect', {
  isExtensible: function isExtensible(target) {
    anObject(target);
    return $isExtensible ? $isExtensible(target) : true;
  }
});

/***/ }),
/* 364 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.11 Reflect.ownKeys(target)
var $export = __webpack_require__(0);

$export($export.S, 'Reflect', {
  ownKeys: __webpack_require__(177)
});

/***/ }),
/* 365 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.12 Reflect.preventExtensions(target)
var $export = __webpack_require__(0);

var anObject = __webpack_require__(2);

var $preventExtensions = Object.preventExtensions;
$export($export.S, 'Reflect', {
  preventExtensions: function preventExtensions(target) {
    anObject(target);

    try {
      if ($preventExtensions) $preventExtensions(target);
      return true;
    } catch (e) {
      return false;
    }
  }
});

/***/ }),
/* 366 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.13 Reflect.set(target, propertyKey, V [, receiver])
var dP = __webpack_require__(10);

var gOPD = __webpack_require__(24);

var getPrototypeOf = __webpack_require__(43);

var has = __webpack_require__(15);

var $export = __webpack_require__(0);

var createDesc = __webpack_require__(37);

var anObject = __webpack_require__(2);

var isObject = __webpack_require__(3);

function set(target, propertyKey, V
/* , receiver */
) {
  var receiver = arguments.length < 4 ? target : arguments[3];
  var ownDesc = gOPD.f(anObject(target), propertyKey);
  var existingDescriptor, proto;

  if (!ownDesc) {
    if (isObject(proto = getPrototypeOf(target))) {
      return set(proto, propertyKey, V, receiver);
    }

    ownDesc = createDesc(0);
  }

  if (has(ownDesc, 'value')) {
    if (ownDesc.writable === false || !isObject(receiver)) return false;

    if (existingDescriptor = gOPD.f(receiver, propertyKey)) {
      if (existingDescriptor.get || existingDescriptor.set || existingDescriptor.writable === false) return false;
      existingDescriptor.value = V;
      dP.f(receiver, propertyKey, existingDescriptor);
    } else dP.f(receiver, propertyKey, createDesc(0, V));

    return true;
  }

  return ownDesc.set === undefined ? false : (ownDesc.set.call(receiver, V), true);
}

$export($export.S, 'Reflect', {
  set: set
});

/***/ }),
/* 367 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.14 Reflect.setPrototypeOf(target, proto)
var $export = __webpack_require__(0);

var setProto = __webpack_require__(100);

if (setProto) $export($export.S, 'Reflect', {
  setPrototypeOf: function setPrototypeOf(target, proto) {
    setProto.check(target, proto);

    try {
      setProto.set(target, proto);
      return true;
    } catch (e) {
      return false;
    }
  }
});

/***/ }),
/* 368 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(369);

module.exports = __webpack_require__(9).Array.includes;

/***/ }),
/* 369 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 // https://github.com/tc39/Array.prototype.includes

var $export = __webpack_require__(0);

var $includes = __webpack_require__(70)(true);

$export($export.P, 'Array', {
  includes: function includes(el
  /* , fromIndex = 0 */
  ) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

__webpack_require__(44)('includes');

/***/ }),
/* 370 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(371);

module.exports = __webpack_require__(9).Array.flatMap;

/***/ }),
/* 371 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 // https://tc39.github.io/proposal-flatMap/#sec-Array.prototype.flatMap

var $export = __webpack_require__(0);

var flattenIntoArray = __webpack_require__(372);

var toObject = __webpack_require__(11);

var toLength = __webpack_require__(6);

var aFunction = __webpack_require__(22);

var arraySpeciesCreate = __webpack_require__(163);

$export($export.P, 'Array', {
  flatMap: function flatMap(callbackfn
  /* , thisArg */
  ) {
    var O = toObject(this);
    var sourceLen, A;
    aFunction(callbackfn);
    sourceLen = toLength(O.length);
    A = arraySpeciesCreate(O, 0);
    flattenIntoArray(A, O, O, sourceLen, 0, 1, callbackfn, arguments[1]);
    return A;
  }
});

__webpack_require__(44)('flatMap');

/***/ }),
/* 372 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 // https://tc39.github.io/proposal-flatMap/#sec-FlattenIntoArray

var isArray = __webpack_require__(72);

var isObject = __webpack_require__(3);

var toLength = __webpack_require__(6);

var ctx = __webpack_require__(21);

var IS_CONCAT_SPREADABLE = __webpack_require__(5)('isConcatSpreadable');

function flattenIntoArray(target, original, source, sourceLen, start, depth, mapper, thisArg) {
  var targetIndex = start;
  var sourceIndex = 0;
  var mapFn = mapper ? ctx(mapper, thisArg, 3) : false;
  var element, spreadable;

  while (sourceIndex < sourceLen) {
    if (sourceIndex in source) {
      element = mapFn ? mapFn(source[sourceIndex], sourceIndex, original) : source[sourceIndex];
      spreadable = false;

      if (isObject(element)) {
        spreadable = element[IS_CONCAT_SPREADABLE];
        spreadable = spreadable !== undefined ? !!spreadable : isArray(element);
      }

      if (spreadable && depth > 0) {
        targetIndex = flattenIntoArray(target, original, element, toLength(element.length), targetIndex, depth - 1) - 1;
      } else {
        if (targetIndex >= 0x1fffffffffffff) throw TypeError();
        target[targetIndex] = element;
      }

      targetIndex++;
    }

    sourceIndex++;
  }

  return targetIndex;
}

module.exports = flattenIntoArray;

/***/ }),
/* 373 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(374);

module.exports = __webpack_require__(9).String.padStart;

/***/ }),
/* 374 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 // https://github.com/tc39/proposal-string-pad-start-end

var $export = __webpack_require__(0);

var $pad = __webpack_require__(178);

var userAgent = __webpack_require__(117); // https://github.com/zloirock/core-js/issues/280


var WEBKIT_BUG = /Version\/10\.\d+(\.\d+)?( Mobile\/\w+)? Safari\//.test(userAgent);
$export($export.P + $export.F * WEBKIT_BUG, 'String', {
  padStart: function padStart(maxLength
  /* , fillString = ' ' */
  ) {
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, true);
  }
});

/***/ }),
/* 375 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(376);

module.exports = __webpack_require__(9).String.padEnd;

/***/ }),
/* 376 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 // https://github.com/tc39/proposal-string-pad-start-end

var $export = __webpack_require__(0);

var $pad = __webpack_require__(178);

var userAgent = __webpack_require__(117); // https://github.com/zloirock/core-js/issues/280


var WEBKIT_BUG = /Version\/10\.\d+(\.\d+)?( Mobile\/\w+)? Safari\//.test(userAgent);
$export($export.P + $export.F * WEBKIT_BUG, 'String', {
  padEnd: function padEnd(maxLength
  /* , fillString = ' ' */
  ) {
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, false);
  }
});

/***/ }),
/* 377 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(378);

module.exports = __webpack_require__(9).String.trimLeft;

/***/ }),
/* 378 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 // https://github.com/sebmarkbage/ecmascript-string-left-right-trim

__webpack_require__(49)('trimLeft', function ($trim) {
  return function trimLeft() {
    return $trim(this, 1);
  };
}, 'trimStart');

/***/ }),
/* 379 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(380);

module.exports = __webpack_require__(9).String.trimRight;

/***/ }),
/* 380 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 // https://github.com/sebmarkbage/ecmascript-string-left-right-trim

__webpack_require__(49)('trimRight', function ($trim) {
  return function trimRight() {
    return $trim(this, 2);
  };
}, 'trimEnd');

/***/ }),
/* 381 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(382);

module.exports = __webpack_require__(96).f('asyncIterator');

/***/ }),
/* 382 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(148)('asyncIterator');

/***/ }),
/* 383 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(384);

module.exports = __webpack_require__(9).Object.getOwnPropertyDescriptors;

/***/ }),
/* 384 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-object-getownpropertydescriptors
var $export = __webpack_require__(0);

var ownKeys = __webpack_require__(177);

var toIObject = __webpack_require__(17);

var gOPD = __webpack_require__(24);

var createProperty = __webpack_require__(112);

$export($export.S, 'Object', {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
    var O = toIObject(object);
    var getDesc = gOPD.f;
    var keys = ownKeys(O);
    var result = {};
    var i = 0;
    var key, desc;

    while (keys.length > i) {
      desc = getDesc(O, key = keys[i++]);
      if (desc !== undefined) createProperty(result, key, desc);
    }

    return result;
  }
});

/***/ }),
/* 385 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(386);

module.exports = __webpack_require__(9).Object.values;

/***/ }),
/* 386 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-object-values-entries
var $export = __webpack_require__(0);

var $values = __webpack_require__(179)(false);

$export($export.S, 'Object', {
  values: function values(it) {
    return $values(it);
  }
});

/***/ }),
/* 387 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(388);

module.exports = __webpack_require__(9).Object.entries;

/***/ }),
/* 388 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-object-values-entries
var $export = __webpack_require__(0);

var $entries = __webpack_require__(179)(true);

$export($export.S, 'Object', {
  entries: function entries(it) {
    return $entries(it);
  }
});

/***/ }),
/* 389 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(170);

__webpack_require__(390);

module.exports = __webpack_require__(9).Promise['finally'];

/***/ }),
/* 390 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// https://github.com/tc39/proposal-promise-finally


var $export = __webpack_require__(0);

var core = __webpack_require__(9);

var global = __webpack_require__(4);

var speciesConstructor = __webpack_require__(61);

var promiseResolve = __webpack_require__(173);

$export($export.P + $export.R, 'Promise', {
  'finally': function _finally(onFinally) {
    var C = speciesConstructor(this, core.Promise || global.Promise);
    var isFunction = typeof onFinally == 'function';
    return this.then(isFunction ? function (x) {
      return promiseResolve(C, onFinally()).then(function () {
        return x;
      });
    } : onFinally, isFunction ? function (e) {
      return promiseResolve(C, onFinally()).then(function () {
        throw e;
      });
    } : onFinally);
  }
});

/***/ }),
/* 391 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var runtime = function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.

  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }

  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function define(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []); // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.

    generator._invoke = makeInvokeMethod(innerFn, self, context);
    return generator;
  }

  exports.wrap = wrap; // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.

  function tryCatch(fn, obj, arg) {
    try {
      return {
        type: "normal",
        arg: fn.call(obj, arg)
      };
    } catch (err) {
      return {
        type: "throw",
        arg: err
      };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed"; // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.

  var ContinueSentinel = {}; // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.

  function Generator() {}

  function GeneratorFunction() {}

  function GeneratorFunctionPrototype() {} // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.


  var IteratorPrototype = {};

  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));

  if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"); // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.

  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      define(prototype, method, function (arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function (genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor ? ctor === GeneratorFunction || // For the native GeneratorFunction constructor, the best we can
    // do is to check its .name property.
    (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
  };

  exports.mark = function (genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }

    genFun.prototype = Object.create(Gp);
    return genFun;
  }; // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.


  exports.awrap = function (arg) {
    return {
      __await: arg
    };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);

      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;

        if (value && _typeof(value) === "object" && hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function (value) {
            invoke("next", value, resolve, reject);
          }, function (err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function (unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function (error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function (resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise = // If enqueue has been called before, then we want to wait until
      // all previous Promises have been resolved before calling invoke,
      // so that results are always delivered in the correct order. If
      // enqueue has not been called before, then it is important to
      // call invoke immediately, without waiting on a callback to fire,
      // so that the async generator function has the opportunity to do
      // any necessary setup in a predictable way. This predictability
      // is why the Promise constructor synchronously invokes its
      // executor callback, and why async functions synchronously
      // execute code before the first await. Since we implement simple
      // async functions in terms of async generators, it is especially
      // important to get this right, even though it requires care.
      previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, // Avoid propagating failures to Promises returned by later
      // invocations of the iterator.
      callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
    } // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).


    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);

  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };

  exports.AsyncIterator = AsyncIterator; // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.

  exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
    return exports.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
    : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;
    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        } // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume


        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;

        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);

          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;
        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);
        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;
        var record = tryCatch(innerFn, self, context);

        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done ? GenStateCompleted : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };
        } else if (record.type === "throw") {
          state = GenStateCompleted; // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.

          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  } // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.


  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];

    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError("The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (!info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value; // Resume execution at the desired location (see delegateYield).

      context.next = delegate.nextLoc; // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.

      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }
    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    } // The delegate iterator is finished, so forget it and continue with
    // the outer generator.


    context.delegate = null;
    return ContinueSentinel;
  } // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.


  defineIteratorMethods(Gp);
  define(Gp, toStringTagSymbol, "Generator"); // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.

  Gp[iteratorSymbol] = function () {
    return this;
  };

  Gp.toString = function () {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = {
      tryLoc: locs[0]
    };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{
      tryLoc: "root"
    }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function (object) {
    var keys = [];

    for (var key in object) {
      keys.push(key);
    }

    keys.reverse(); // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.

    return function next() {
      while (keys.length) {
        var key = keys.pop();

        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      } // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.


      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];

      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1,
            next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;
          return next;
        };

        return next.next = next;
      }
    } // Return an iterator with no values.


    return {
      next: doneResult
    };
  }

  exports.values = values;

  function doneResult() {
    return {
      value: undefined,
      done: true
    };
  }

  Context.prototype = {
    constructor: Context,
    reset: function reset(skipTempReset) {
      this.prev = 0;
      this.next = 0; // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.

      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;
      this.method = "next";
      this.arg = undefined;
      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },
    stop: function stop() {
      this.done = true;
      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;

      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },
    dispatchException: function dispatchException(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;

      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }
          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },
    abrupt: function abrupt(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },
    complete: function complete(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" || record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },
    finish: function finish(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },
    "catch": function _catch(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;

          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }

          return thrown;
        }
      } // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.


      throw new Error("illegal catch attempt");
    },
    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  }; // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.

  return exports;
}( // If this script is executing as a CommonJS module, use module.exports
// as the regeneratorRuntime namespace. Otherwise create a new empty
// object. Either way, the resulting object will be used to initialize
// the regeneratorRuntime variable at the top of this file.
( false ? undefined : _typeof(module)) === "object" ? module.exports : {});

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(392)(module)))

/***/ }),
/* 392 */
/***/ (function(module, exports) {

module.exports = function (module) {
  if (!module.webpackPolyfill) {
    module.deprecate = function () {};

    module.paths = []; // module.parent = undefined by default

    if (!module.children) module.children = [];
    Object.defineProperty(module, "loaded", {
      enumerable: true,
      get: function get() {
        return module.l;
      }
    });
    Object.defineProperty(module, "id", {
      enumerable: true,
      get: function get() {
        return module.i;
      }
    });
    module.webpackPolyfill = 1;
  }

  return module;
};

/***/ }),
/* 393 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(394);

module.exports = __webpack_require__(180).global;

/***/ }),
/* 394 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-global
var $export = __webpack_require__(395);

$export($export.G, {
  global: __webpack_require__(119)
});

/***/ }),
/* 395 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(119);

var core = __webpack_require__(180);

var ctx = __webpack_require__(396);

var hide = __webpack_require__(398);

var has = __webpack_require__(405);

var PROTOTYPE = 'prototype';

var $export = function $export(type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;

  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && has(exports, key)) continue; // export native or passed

    out = own ? target[key] : source[key]; // prevent global pollution for namespaces

    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key] // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global) // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? function (C) {
      var F = function F(a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0:
              return new C();

            case 1:
              return new C(a);

            case 2:
              return new C(a, b);
          }

          return new C(a, b, c);
        }

        return C.apply(this, arguments);
      };

      F[PROTOTYPE] = C[PROTOTYPE];
      return F; // make static versions for prototype methods
    }(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out; // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%

    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out; // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%

      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
}; // type bitmap


$export.F = 1; // forced

$export.G = 2; // global

$export.S = 4; // static

$export.P = 8; // proto

$export.B = 16; // bind

$export.W = 32; // wrap

$export.U = 64; // safe

$export.R = 128; // real proto method for `library`

module.exports = $export;

/***/ }),
/* 396 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(397);

module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;

  switch (length) {
    case 1:
      return function (a) {
        return fn.call(that, a);
      };

    case 2:
      return function (a, b) {
        return fn.call(that, a, b);
      };

    case 3:
      return function (a, b, c) {
        return fn.call(that, a, b, c);
      };
  }

  return function ()
  /* ...args */
  {
    return fn.apply(that, arguments);
  };
};

/***/ }),
/* 397 */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

/***/ }),
/* 398 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(399);

var createDesc = __webpack_require__(404);

module.exports = __webpack_require__(121) ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

/***/ }),
/* 399 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(400);

var IE8_DOM_DEFINE = __webpack_require__(401);

var toPrimitive = __webpack_require__(403);

var dP = Object.defineProperty;
exports.f = __webpack_require__(121) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) {
    /* empty */
  }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

/***/ }),
/* 400 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(120);

module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

/***/ }),
/* 401 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(121) && !__webpack_require__(181)(function () {
  return Object.defineProperty(__webpack_require__(402)('div'), 'a', {
    get: function get() {
      return 7;
    }
  }).a != 7;
});

/***/ }),
/* 402 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(120);

var document = __webpack_require__(119).document; // typeof document.createElement is 'object' in old IE


var is = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

/***/ }),
/* 403 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(120); // instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string


module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

/***/ }),
/* 404 */
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

/***/ }),
/* 405 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;

module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

/***/ }),
/* 406 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "InkBallGame" }]*/

/*global signalR, gameOptions*/


function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var SVG, AIBundle;
/******** funcs-n-classes ********/

var StatusEnum = Object.freeze({
  POINT_FREE_RED: -3,
  POINT_FREE_BLUE: -2,
  POINT_FREE: -1,
  POINT_STARTING: 0,
  POINT_IN_PATH: 1,
  POINT_OWNED_BY_RED: 2,
  POINT_OWNED_BY_BLUE: 3
});
var CommandKindEnum = Object.freeze({
  UNKNOWN: -1,
  PING: 0,
  POINT: 1,
  PATH: 2,
  PLAYER_JOINING: 3,
  PLAYER_SURRENDER: 4,
  WIN: 5,
  POINTS_AND_PATHS: 6,
  USER_SETTINGS: 7,
  STOP_AND_DRAW: 8
});
var GameTypeEnum = Object.freeze({
  FIRST_CAPTURE: 0,
  FIRST_5_CAPTURES: 1,
  FIRST_5_PATHS: 2,
  FIRST_5_ADVANTAGE_PATHS: 3
});
var WinStatusEnum = Object.freeze({
  RED_WINS: 0,
  GREEN_WINS: 1,
  NO_WIN: 2,
  DRAW_WIN: 3
});

var DtoMsg = /*#__PURE__*/function () {
  function DtoMsg() {
    _classCallCheck(this, DtoMsg);
  }

  _createClass(DtoMsg, [{
    key: "GetKind",
    value: function GetKind() {
      throw new Error("missing GetKind implementation!");
    }
  }]);

  return DtoMsg;
}();

var InkBallPointViewModel = /*#__PURE__*/function (_DtoMsg) {
  _inherits(InkBallPointViewModel, _DtoMsg);

  var _super = _createSuper(InkBallPointViewModel);

  function InkBallPointViewModel() {
    var _this;

    var iId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var iGameId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var iPlayerId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var iX = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var iY = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
    var Status = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : StatusEnum.POINT_FREE;
    var iEnclosingPathId = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;

    _classCallCheck(this, InkBallPointViewModel);

    _this = _super.call(this);
    _this.iId = iId;
    _this.iGameId = iGameId;
    _this.iPlayerId = iPlayerId;
    _this.iX = iX;
    _this.iY = iY;
    _this.Status = Status;
    _this.iEnclosingPathId = iEnclosingPathId;
    return _this;
  }

  _createClass(InkBallPointViewModel, [{
    key: "GetKind",
    value: function GetKind() {
      return CommandKindEnum.POINT;
    }
  }], [{
    key: "Format",
    value: function Format(sUser, point) {
      var msg = '(' + point.iX + ',' + point.iY + ' - ';
      var status = point.Status !== undefined ? point.Status : point.status;

      switch (status) {
        case StatusEnum.POINT_FREE_RED:
          msg += 'red';
          break;

        case StatusEnum.POINT_FREE_BLUE:
          msg += 'blue';
          break;

        case StatusEnum.POINT_FREE:
          msg += '';
          break;

        case StatusEnum.POINT_STARTING:
          msg += 'starting';
          break;

        case StatusEnum.POINT_IN_PATH:
          msg += 'path';
          break;

        case StatusEnum.POINT_OWNED_BY_RED:
          msg += 'owned by red';
          break;

        case StatusEnum.POINT_OWNED_BY_BLUE:
          msg += 'owned by blue';
          break;

        default:
          throw new Error("Bad point type!");
      }

      return sUser + ' places ' + msg + ')' + ' point';
    }
  }]);

  return InkBallPointViewModel;
}(DtoMsg);

var InkBallPathViewModel = /*#__PURE__*/function (_DtoMsg2) {
  _inherits(InkBallPathViewModel, _DtoMsg2);

  var _super2 = _createSuper(InkBallPathViewModel);

  function InkBallPathViewModel() {
    var _this2;

    var iId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var iGameId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var iPlayerId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var PointsAsString = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
    var OwnedPointsAsString = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';

    _classCallCheck(this, InkBallPathViewModel);

    _this2 = _super2.call(this);
    _this2.iId = iId;
    _this2.iGameId = iGameId;
    _this2.iPlayerId = iPlayerId;
    _this2.PointsAsString = PointsAsString;
    _this2.OwnedPointsAsString = OwnedPointsAsString;
    return _this2;
  }

  _createClass(InkBallPathViewModel, [{
    key: "GetKind",
    value: function GetKind() {
      return CommandKindEnum.PATH;
    }
  }], [{
    key: "Format",
    value: function Format(sUser, path) {
      var msg = "(".concat(path.PointsAsString || path.pointsAsString, ") [").concat(path.OwnedPointsAsString || path.ownedPointsAsString, "]");
      return "".concat(sUser, " places ").concat(msg, " path");
    }
  }]);

  return InkBallPathViewModel;
}(DtoMsg);

var PlayerJoiningCommand = /*#__PURE__*/function (_DtoMsg3) {
  _inherits(PlayerJoiningCommand, _DtoMsg3);

  var _super3 = _createSuper(PlayerJoiningCommand);

  function PlayerJoiningCommand(otherPlayerId, otherPlayerName, message) {
    var _this3;

    _classCallCheck(this, PlayerJoiningCommand);

    _this3 = _super3.call(this);
    _this3.OtherPlayerId = otherPlayerId;
    _this3.OtherPlayerName = otherPlayerName;
    _this3.Message = message;
    return _this3;
  }

  _createClass(PlayerJoiningCommand, [{
    key: "GetKind",
    value: function GetKind() {
      return CommandKindEnum.PLAYER_JOINING;
    }
  }], [{
    key: "Format",
    value: function Format(join) {
      return join.Message || join.message;
    }
  }]);

  return PlayerJoiningCommand;
}(DtoMsg);

var PlayerSurrenderingCommand = /*#__PURE__*/function (_DtoMsg4) {
  _inherits(PlayerSurrenderingCommand, _DtoMsg4);

  var _super4 = _createSuper(PlayerSurrenderingCommand);

  function PlayerSurrenderingCommand(otherPlayerId, thisOrOtherPlayerSurrenders, message) {
    var _this4;

    _classCallCheck(this, PlayerSurrenderingCommand);

    _this4 = _super4.call(this);
    _this4.OtherPlayerId = otherPlayerId;
    _this4.thisOrOtherPlayerSurrenders = thisOrOtherPlayerSurrenders;
    _this4.Message = message;
    return _this4;
  }

  _createClass(PlayerSurrenderingCommand, [{
    key: "GetKind",
    value: function GetKind() {
      return CommandKindEnum.PLAYER_SURRENDER;
    }
  }], [{
    key: "Format",
    value: function Format(surrender) {
      return surrender.Message || surrender.message;
    }
  }]);

  return PlayerSurrenderingCommand;
}(DtoMsg);

var PingCommand = /*#__PURE__*/function (_DtoMsg5) {
  _inherits(PingCommand, _DtoMsg5);

  var _super5 = _createSuper(PingCommand);

  function PingCommand() {
    var _this5;

    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    _classCallCheck(this, PingCommand);

    _this5 = _super5.call(this);
    _this5.Message = message;
    return _this5;
  }

  _createClass(PingCommand, [{
    key: "GetKind",
    value: function GetKind() {
      return CommandKindEnum.PING;
    }
  }], [{
    key: "Format",
    value: function Format(sUser, ping) {
      var txt = ping.Message || ping.message;
      return sUser + " says '" + txt + "'";
    }
  }]);

  return PingCommand;
}(DtoMsg);

var WinCommand = /*#__PURE__*/function (_DtoMsg6) {
  _inherits(WinCommand, _DtoMsg6);

  var _super6 = _createSuper(WinCommand);

  function WinCommand() {
    var _this6;

    var status = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : WinStatusEnum.NO_WIN;
    var winningPlayerId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var message = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'null';

    _classCallCheck(this, WinCommand);

    _this6 = _super6.call(this);
    _this6.Status = status;
    _this6.WinningPlayerId = winningPlayerId;
    _this6.Message = message;
    return _this6;
  }

  _createClass(WinCommand, [{
    key: "GetKind",
    value: function GetKind() {
      return CommandKindEnum.WIN;
    }
  }], [{
    key: "Format",
    value: function Format(win) {
      var msg = '';
      var status = win.Status !== undefined ? win.Status : win.status;

      switch (status) {
        case WinStatusEnum.RED_WINS:
          msg = 'red.';
          break;

        case WinStatusEnum.GREEN_WINS:
          msg = 'blue.';
          break;

        case WinStatusEnum.NO_WIN:
          msg = 'no one!';
          break;

        case WinStatusEnum.DRAW_WIN:
          msg = 'draw!';
          break;
      }

      return 'And the winner is... ' + msg;
    }
  }]);

  return WinCommand;
}(DtoMsg);

var StopAndDrawCommand = /*#__PURE__*/function (_DtoMsg7) {
  _inherits(StopAndDrawCommand, _DtoMsg7);

  var _super7 = _createSuper(StopAndDrawCommand);

  function StopAndDrawCommand() {
    _classCallCheck(this, StopAndDrawCommand);

    return _super7.call(this);
  }

  _createClass(StopAndDrawCommand, [{
    key: "GetKind",
    value: function GetKind() {
      return CommandKindEnum.STOP_AND_DRAW;
    }
  }], [{
    key: "Format",
    value: function Format(otherUser) {
      return 'User ' + otherUser + ' started to draw path';
    }
  }]);

  return StopAndDrawCommand;
}(DtoMsg);

var PlayerPointsAndPathsDTO = /*#__PURE__*/function (_DtoMsg8) {
  _inherits(PlayerPointsAndPathsDTO, _DtoMsg8);

  var _super8 = _createSuper(PlayerPointsAndPathsDTO);

  function PlayerPointsAndPathsDTO() {
    var _this7;

    var points = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var paths = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    _classCallCheck(this, PlayerPointsAndPathsDTO);

    _this7 = _super8.call(this);
    _this7.Points = points;
    _this7.Paths = paths;
    return _this7;
  }

  _createClass(PlayerPointsAndPathsDTO, [{
    key: "GetKind",
    value: function GetKind() {
      return CommandKindEnum.POINTS_AND_PATHS;
    }
  }], [{
    key: "Deserialize",
    value: function Deserialize(ppDTO) {
      var serialized = "{ \"Points\": ".concat(ppDTO.Points || ppDTO.points, ", \"Paths\": ").concat(ppDTO.Paths || ppDTO.paths, " }");
      var path_and_point = JSON.parse(serialized);
      return path_and_point;
    }
  }]);

  return PlayerPointsAndPathsDTO;
}(DtoMsg);

var ApplicationUserSettings = /*#__PURE__*/function (_DtoMsg9) {
  _inherits(ApplicationUserSettings, _DtoMsg9);

  var _super9 = _createSuper(ApplicationUserSettings);

  function ApplicationUserSettings() {
    var _this8;

    var desktopNotifications = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    _classCallCheck(this, ApplicationUserSettings);

    _this8 = _super9.call(this);
    _this8.DesktopNotifications = desktopNotifications;
    return _this8;
  }

  _createClass(ApplicationUserSettings, [{
    key: "GetKind",
    value: function GetKind() {
      return CommandKindEnum.USER_SETTINGS;
    }
  }], [{
    key: "Serialize",
    value: function Serialize(settings) {
      var jsonStr = JSON.stringify(settings);
      return jsonStr;
    }
  }, {
    key: "Deserialize",
    value: function Deserialize(jsonStr) {
      var settings = JSON.parse(jsonStr);
      return settings;
    }
  }]);

  return ApplicationUserSettings;
}(DtoMsg);

var CountdownTimer = /*#__PURE__*/function () {
  function CountdownTimer() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$countdownSeconds = _ref.countdownSeconds,
        countdownSeconds = _ref$countdownSeconds === void 0 ? 60 : _ref$countdownSeconds,
        _ref$labelSelector = _ref.labelSelector,
        labelSelector = _ref$labelSelector === void 0 ? null : _ref$labelSelector,
        _ref$initialStart = _ref.initialStart,
        initialStart = _ref$initialStart === void 0 ? false : _ref$initialStart,
        _ref$countdownReached = _ref.countdownReachedHandler,
        countdownReachedHandler = _ref$countdownReached === void 0 ? undefined : _ref$countdownReached;

    _classCallCheck(this, CountdownTimer);

    this.countdownSeconds = countdownSeconds;
    this.totalSeconds = this.countdownSeconds;
    this.timerID = -1;
    this.label = null;
    this.countdownReachedHandler = countdownReachedHandler;
    if (labelSelector) this.label = document.querySelector(labelSelector);
    if (initialStart) this.Start();
  }

  _createClass(CountdownTimer, [{
    key: "setTimeFunc",
    value: function setTimeFunc() {
      if (--this.totalSeconds <= 0) {
        this.Stop();
        if (this.countdownReachedHandler) this.countdownReachedHandler(this.label);
      } else if (this.label) {
        this.label.innerHTML = this.pad(parseInt(this.totalSeconds / 60)) + ':' + this.pad(this.totalSeconds % 60);
      }
    }
  }, {
    key: "pad",
    value: function pad(val) {
      var valString = val + "";

      if (valString.length < 2) {
        return "0" + valString;
      } else {
        return valString;
      }
    }
  }, {
    key: "Start",
    value: function Start() {
      this.Stop();
      this.timerID = setInterval(this.setTimeFunc.bind(this), 1000);
    }
  }, {
    key: "Stop",
    value: function Stop() {
      if (this.timerID > 0) clearInterval(this.timerID);
      if (this.label) this.label.innerHTML = '';
    }
  }, {
    key: "Reset",
    value: function Reset() {
      var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref2$countdownSecond = _ref2.countdownSeconds,
          countdownSeconds = _ref2$countdownSecond === void 0 ? 60 : _ref2$countdownSecond,
          _ref2$labelSelector = _ref2.labelSelector,
          labelSelector = _ref2$labelSelector === void 0 ? null : _ref2$labelSelector,
          _ref2$initialStart = _ref2.initialStart,
          initialStart = _ref2$initialStart === void 0 ? false : _ref2$initialStart,
          _ref2$countdownReache = _ref2.countdownReachedHandler,
          countdownReachedHandler = _ref2$countdownReache === void 0 ? undefined : _ref2$countdownReache;

      this.countdownSeconds = countdownSeconds;
      this.totalSeconds = this.countdownSeconds;
      this.label = null;
      this.countdownReachedHandler = countdownReachedHandler;
      if (labelSelector) this.label = document.querySelector(labelSelector);
      if (initialStart) this.Start();
    }
  }]);

  return CountdownTimer;
}();
/**
 * Loads modules dynamically
 * don't break webpack logic here! https://webpack.js.org/guides/code-splitting/
 * @param {object} gameOptions is an entry starter object definint game parameters
 */


function importAllModulesAsync(_x) {
  return _importAllModulesAsync.apply(this, arguments);
}

function _importAllModulesAsync() {
  _importAllModulesAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee43(gameOptions) {
    var selfFileName, isMinified;
    return regeneratorRuntime.wrap(function _callee43$(_context43) {
      while (1) {
        switch (_context43.prev = _context43.next) {
          case 0:
            /*const IE11 = navigator.userAgent.indexOf('Trident') >= 0;
            if (IE11) {
            	await import('@babel/polyfill');
            	//await import('core-js');
            	//await import('regenerator-runtime/runtime');
            }*/
            selfFileName = Array.prototype.slice.call(document.getElementsByTagName('script')).map(function (x) {
              return x.src;
            }).find(function (s) {
              return s.indexOf('inkball') !== -1;
            }).split('/').pop();
            isMinified = selfFileName.indexOf("min") !== -1;

            if (!isMinified) {
              _context43.next = 8;
              break;
            }

            _context43.next = 5;
            return __webpack_require__.e(/* import() | svgvmlMin */ 2).then(__webpack_require__.bind(null, 407));

          case 5:
            SVG = _context43.sent;
            _context43.next = 11;
            break;

          case 8:
            _context43.next = 10;
            return __webpack_require__.e(/* import() | svgvml */ 1).then(__webpack_require__.bind(null, 408));

          case 10:
            SVG = _context43.sent;

          case 11:
            if (gameOptions.iOtherPlayerID === -1) {//AIBundle = await import(/* webpackChunkName: "AIDeps" */'./AIBundle.js');
            }

          case 12:
          case "end":
            return _context43.stop();
        }
      }
    }, _callee43);
  }));
  return _importAllModulesAsync.apply(this, arguments);
}

function LocalLog(msg) {
  // eslint-disable-next-line no-console
  console.log(msg);
}

function LocalError() {
  var msg = '';

  for (var i = 0; i < arguments.length; i++) {
    var str = i < 0 || arguments.length <= i ? undefined : arguments[i];
    if (str) msg += str;
  } // eslint-disable-next-line no-console


  console.error(msg);
}

function RandomColor() {
  return 'var(--orange)'; //return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

function Sleep(_x2) {
  return _Sleep.apply(this, arguments);
}

function _Sleep() {
  _Sleep = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee44(ms) {
    return regeneratorRuntime.wrap(function _callee44$(_context44) {
      while (1) {
        switch (_context44.prev = _context44.next) {
          case 0:
            return _context44.abrupt("return", new Promise(function (resolve) {
              return setTimeout(resolve, ms);
            }));

          case 1:
          case "end":
            return _context44.stop();
        }
      }
    }, _callee44);
  }));
  return _Sleep.apply(this, arguments);
}

Function.prototype.callAsWorker = function (context, args) {
  var _this9 = this;

  return new Promise(function (resolve, reject) {
    var code = "\n".concat(context ? _toConsumableArray(context).reduce(function (acc, cur) {
      return acc + cur.toString() + '\n';
    }) : '', "\n\nself.onmessage = async function (e) { \n\tconst result = await ( ").concat(_this9.toString(), ".call(null, e.data) );\n\n\tself.postMessage( result ); \n}"),
        blob = new Blob([code], {
      type: "text/javascript"
    }),
        worker = new Worker(window.URL.createObjectURL(blob));

    worker.onmessage = function (e) {
      return resolve(e.data), worker.terminate(), window.URL.revokeObjectURL(blob);
    };

    worker.onerror = function (e) {
      return reject(e.message), worker.terminate(), window.URL.revokeObjectURL(blob);
    };

    worker.postMessage(args);
  });
};

var InkBallGame = /*#__PURE__*/function () {
  /**
   * InkBallGame contructor
   * @param {number} iGameID ID of a game
   * @param {number} iPlayerID player ID
   * @param {number} iOtherPlayerID player ID
   * @param {string} sHubName SignalR hub name
   * @param {enum} loggingLevel log level for SignalR
   * @param {enum} hubProtocol Json or messagePack
   * @param {enum} transportType websocket, server events or long polling
   * @param {number} serverTimeoutInMilliseconds If the server hasn't sent a message in this interval, the client considers the server disconnected
   * @param {enum} gameType of game enum as string
   * @param {boolean} bIsPlayingWithRed true - red, false - blue
   * @param {boolean} bIsPlayerActive is this player acive now
   * @param {boolean} bViewOnly only viewing the game no interaction
   * @param {number} pathAfterPointDrawAllowanceSecAmount is number of seconds, a player is allowed to start drawing path after putting point
   * @param {number} iTooLong2Duration too long wait duration
   */
  function InkBallGame(iGameID, iPlayerID, iOtherPlayerID, sHubName, loggingLevel, hubProtocol, transportType, serverTimeoutInMilliseconds, gameType) {
    var _this10 = this;

    var bIsPlayingWithRed = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : true;
    var bIsPlayerActive = arguments.length > 10 && arguments[10] !== undefined ? arguments[10] : true;
    var bViewOnly = arguments.length > 11 && arguments[11] !== undefined ? arguments[11] : false;
    var pathAfterPointDrawAllowanceSecAmount = arguments.length > 12 && arguments[12] !== undefined ? arguments[12] : 60;
    var iTooLong2Duration = arguments.length > 13 && arguments[13] !== undefined ? arguments[13] : 125;

    _classCallCheck(this, InkBallGame);

    this.g_iGameID = iGameID;
    this.g_iPlayerID = iPlayerID;
    this.m_iOtherPlayerId = iOtherPlayerID;
    this.m_bIsCPUGame = this.m_iOtherPlayerId === -1;
    this.GameType = GameTypeEnum[gameType];
    this.iConnErrCount = 0;
    this.iExponentialBackOffMillis = 2000;
    this.COLOR_RED = 'red';
    this.COLOR_BLUE = 'blue';
    this.COLOR_OWNED_RED = '#DC143C';
    this.COLOR_OWNED_BLUE = '#8A2BE2';
    this.DRAWING_PATH_COLOR = "black";
    this.m_bIsWon = false;
    this.m_bPointsAndPathsLoaded = false;
    this.m_iDelayBetweenMultiCaptures = 4000;
    this.m_iTooLong2Duration = iTooLong2Duration
    /*125*/
    ;
    this.m_Timer = null;
    this.m_ReconnectTimer = null;
    this.m_WaitStartTime = null;
    this.m_TimerOpts = {
      countdownSeconds: pathAfterPointDrawAllowanceSecAmount,
      labelSelector: "#debug2",
      initialStart: true,
      countdownReachedHandler: this.CountDownReachedHandler.bind(this)
    };
    this.m_iSlowdownLevel = 0;
    this.m_iGridSizeX = 0;
    this.m_iGridSizeY = 0;
    this.m_iGridWidth = 0;
    this.m_iGridHeight = 0;
    this.m_BoardSize = null;
    this.m_iLastX = -1;
    this.m_iLastY = -1;
    this.m_iMouseX = 0;
    this.m_iMouseY = 0;
    this.m_iPosX = 0;
    this.m_iPosY = 0;
    this.m_Screen = null;
    this.m_Debug = null;
    this.m_Player2Name = null;
    this.m_SurrenderButton = null;
    this.m_sMsgInputSel = null;
    this.m_sMsgSendButtonSel = null;
    this.m_sMsgListSel = null;
    this.m_CancelPath = null;
    this.m_StopAndDraw = null;
    this.m_bMouseDown = false;
    this.m_bHandlingEvent = false;
    this.m_bDrawLines = !true;
    this.m_sMessage = '';
    this.m_bIsPlayingWithRed = bIsPlayingWithRed;
    this.m_bIsPlayerActive = bIsPlayerActive;
    this.m_sDotColor = this.m_bIsPlayingWithRed ? this.COLOR_RED : this.COLOR_BLUE;
    this.m_PointRadius = 4;
    this.SvgVml = null;
    this.m_Line = null;
    this.m_Lines = null;
    this.m_Points = null;
    this.m_bViewOnly = bViewOnly;
    this.m_MouseCursorOval = null;
    this.CursorPos = {
      x: -1,
      y: -1
    };
    this.m_ApplicationUserSettings = null;
    this.m_sLastMoveGameTimeStamp = null;
    if (sHubName === null || sHubName === "") return;
    this.g_SignalRConnection = new signalR.HubConnectionBuilder().withUrl(sHubName, {
      transport: transportType,
      accessTokenFactory: function () {
        return "iGameID=".concat(this.g_iGameID, "&iPlayerID=").concat(this.g_iPlayerID);
      }.bind(this)
    }).withHubProtocol(hubProtocol).configureLogging(loggingLevel).build();
    this.g_SignalRConnection.serverTimeoutInMilliseconds = serverTimeoutInMilliseconds;
    this.g_SignalRConnection.onclose( /*#__PURE__*/function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(err) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (err !== null && err !== undefined) {
                  LocalError(err);
                  _this10.m_Screen.style.cursor = "not-allowed";
                  _this10.iConnErrCount++;
                  setTimeout(function () {
                    return _this10.Connect();
                  }, 4000 + _this10.iExponentialBackOffMillis * Math.max(_this10.iConnErrCount, 5) //exponential back-off
                  );
                }

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x3) {
        return _ref3.apply(this, arguments);
      };
    }());
  }

  _createClass(InkBallGame, [{
    key: "GetPlayerPointsAndPaths",
    value: function () {
      var _GetPlayerPointsAndPaths = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var ppDTO, path_and_point;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!(this.m_bPointsAndPathsLoaded === false)) {
                  _context2.next = 15;
                  break;
                }

                _context2.next = 3;
                return this.g_SignalRConnection.invoke("GetPlayerPointsAndPaths", this.m_bViewOnly, this.g_iGameID);

              case 3:
                ppDTO = _context2.sent;
                //LocalLog(ppDTO);
                path_and_point = PlayerPointsAndPathsDTO.Deserialize(ppDTO);

                if (!(path_and_point.Points !== undefined)) {
                  _context2.next = 8;
                  break;
                }

                _context2.next = 8;
                return this.SetAllPoints(path_and_point.Points);

              case 8:
                if (!(path_and_point.Paths !== undefined)) {
                  _context2.next = 11;
                  break;
                }

                _context2.next = 11;
                return this.SetAllPaths(path_and_point.Paths);

              case 11:
                this.m_bPointsAndPathsLoaded = true;
                return _context2.abrupt("return", true);

              case 15:
                return _context2.abrupt("return", false);

              case 16:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function GetPlayerPointsAndPaths() {
        return _GetPlayerPointsAndPaths.apply(this, arguments);
      }

      return GetPlayerPointsAndPaths;
    }()
  }, {
    key: "Connect",
    value: function () {
      var _Connect = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var _this11 = this;

        var settings, to_store, json, _settings;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _context3.next = 3;
                return this.g_SignalRConnection.start();

              case 3:
                this.iConnErrCount = 0;
                LocalLog('connected; iConnErrCount = ' + this.iConnErrCount);

                if (!(this.m_bViewOnly === false)) {
                  _context3.next = 19;
                  break;
                }

                if (!(sessionStorage.getItem("ApplicationUserSettings") === null)) {
                  _context3.next = 16;
                  break;
                }

                _context3.next = 9;
                return this.g_SignalRConnection.invoke("GetUserSettings");

              case 9:
                settings = _context3.sent;

                if (settings) {
                  LocalLog(settings);
                  settings = ApplicationUserSettings.Deserialize(settings);
                  to_store = ApplicationUserSettings.Serialize(settings);
                  sessionStorage.setItem("ApplicationUserSettings", to_store);
                }

                this.m_ApplicationUserSettings = new ApplicationUserSettings(settings.DesktopNotifications);
                _context3.next = 14;
                return this.GetPlayerPointsAndPaths();

              case 14:
                _context3.next = 19;
                break;

              case 16:
                json = sessionStorage.getItem("ApplicationUserSettings");
                _settings = ApplicationUserSettings.Deserialize(json);
                this.m_ApplicationUserSettings = new ApplicationUserSettings(_settings.DesktopNotifications);

              case 19:
                if (!(this.m_bPointsAndPathsLoaded === false)) {
                  _context3.next = 22;
                  break;
                }

                _context3.next = 22;
                return this.GetPlayerPointsAndPaths();

              case 22:
                if (this.m_ApplicationUserSettings !== null && this.m_ApplicationUserSettings.DesktopNotifications === true) {
                  this.SetupNotifications();
                }

                if (true === this.m_bIsCPUGame && !this.m_bIsPlayerActive) this.StartCPUCalculation();
                _context3.next = 32;
                break;

              case 26:
                _context3.prev = 26;
                _context3.t0 = _context3["catch"](0);
                LocalError(_context3.t0 + '; iConnErrCount = ' + this.iConnErrCount);
                this.m_Screen.style.cursor = "not-allowed";
                this.iConnErrCount++;
                setTimeout(function () {
                  return _this11.Connect();
                }, 4000 + this.iExponentialBackOffMillis * Math.max(this.iConnErrCount, 5) //exponential back-off
                );

              case 32:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[0, 26]]);
      }));

      function Connect() {
        return _Connect.apply(this, arguments);
      }

      return Connect;
    }()
  }, {
    key: "SetupNotifications",
    value: function SetupNotifications() {
      if (!window.Notification) {
        LocalLog('Browser does not support notifications.');
        return false;
      } else {
        // check if permission is already granted
        if (Notification.permission === 'granted') {
          return true;
        } else {
          // request permission from user
          Notification.requestPermission().then(function (p) {
            if (p === 'granted') {
              return true;
            } else {
              LocalLog('User blocked notifications.');
              return false;
            }
          })["catch"](function (err) {
            LocalError(err);
            return false;
          });
        }
      }
    }
  }, {
    key: "NotifyBrowser",
    value: function NotifyBrowser() {
      var title = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Hi there!';
      var body = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'How are you doing?';
      if (!document.hidden) return false;

      if (!window.Notification) {
        LocalLog('Browser does not support notifications.');
        return false;
      } else {
        // check if permission is already granted
        if (Notification.permission === 'granted') {
          // show notification here
          new Notification(title, {
            body: body,
            icon: '../img/homescreen.webp'
          });
          return true;
        } else {
          // request permission from user
          Notification.requestPermission().then(function (p) {
            if (p === 'granted') {
              // show notification here
              new Notification(title, {
                body: body,
                icon: '../img/homescreen.webp'
              });
              return true;
            } else {
              LocalLog('User blocked notifications.');
              return false;
            }
          })["catch"](function (err) {
            LocalError(err);
            return false;
          });
        }
      }
    }
    /**
     * Start connection to SignalR
     * @param {boolean} loadPointsAndPathsFromSignalR load points and path thriugh SignalR
     */

  }, {
    key: "StartSignalRConnection",
    value: function () {
      var _StartSignalRConnection = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(loadPointsAndPathsFromSignalR) {
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (!(this.g_SignalRConnection === null)) {
                  _context6.next = 2;
                  break;
                }

                return _context6.abrupt("return", Promise.reject(new Error("signalr conn is null")));

              case 2:
                //this.m_bIsCPUGame = this.m_iOtherPlayerId === -1;
                if (false === this.m_bPointsAndPathsLoaded) this.m_bPointsAndPathsLoaded = !loadPointsAndPathsFromSignalR;
                this.g_SignalRConnection.on("ServerToClientPoint", /*#__PURE__*/function () {
                  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(point) {
                    var user, encodedMsg, li;
                    return regeneratorRuntime.wrap(function _callee4$(_context4) {
                      while (1) {
                        switch (_context4.prev = _context4.next) {
                          case 0:
                            if (this.g_iPlayerID !== point.iPlayerId) {
                              user = this.m_Player2Name.innerHTML;
                              encodedMsg = InkBallPointViewModel.Format(user, point);
                              li = document.createElement("li");
                              li.textContent = encodedMsg;
                              document.querySelector(this.m_sMsgListSel).appendChild(li);
                              this.NotifyBrowser('New Point', encodedMsg);
                            }

                            _context4.next = 3;
                            return this.ReceivedPointProcessing(point);

                          case 3:
                          case "end":
                            return _context4.stop();
                        }
                      }
                    }, _callee4, this);
                  }));

                  return function (_x5) {
                    return _ref4.apply(this, arguments);
                  };
                }().bind(this));
                this.g_SignalRConnection.on("ServerToClientPath", function (dto) {
                  if (Object.prototype.hasOwnProperty.call(dto, 'PointsAsString') || Object.prototype.hasOwnProperty.call(dto, 'pointsAsString')) {
                    var path = dto;

                    if (this.g_iPlayerID !== path.iPlayerId) {
                      var user = this.m_Player2Name.innerHTML;
                      var encodedMsg = InkBallPathViewModel.Format(user, path);
                      var li = document.createElement("li");
                      li.textContent = encodedMsg;
                      document.querySelector(this.m_sMsgListSel).appendChild(li);
                      this.NotifyBrowser('New Path', encodedMsg);
                    }

                    this.ReceivedPathProcessing(path);
                  } else if (Object.prototype.hasOwnProperty.call(dto, 'WinningPlayerId') || Object.prototype.hasOwnProperty.call(dto, 'winningPlayerId')) {
                    var win = dto;

                    var _encodedMsg = WinCommand.Format(win);

                    var _li = document.createElement("li");

                    _li.textContent = _encodedMsg;
                    document.querySelector(this.m_sMsgListSel).appendChild(_li);
                    this.ReceivedWinProcessing(win);
                    this.NotifyBrowser('We have a winner', _encodedMsg);
                  } else throw new Error("ServerToClientPath bad GetKind!");
                }.bind(this));
                this.g_SignalRConnection.on("ServerToClientPlayerJoin", function (join) {
                  var iOtherPlayerId = join.OtherPlayerId || join.otherPlayerId;
                  this.m_iOtherPlayerId = iOtherPlayerId;
                  var encodedMsg = PlayerJoiningCommand.Format(join);
                  var li = document.createElement("li");
                  li.innerHTML = "<strong class=\"text-primary\">".concat(encodedMsg, "</strong>");
                  document.querySelector(this.m_sMsgListSel).appendChild(li);

                  if (this.m_SurrenderButton !== null) {
                    if (join.OtherPlayerName !== '') {
                      this.m_Player2Name.innerHTML = join.OtherPlayerName || join.otherPlayerName;
                      this.m_SurrenderButton.value = 'surrender';
                      this.ShowMobileStatus('Your move');
                    }
                  }

                  this.NotifyBrowser('Player joininig', encodedMsg);
                  this.m_bHandlingEvent = false;
                }.bind(this));
                this.g_SignalRConnection.on("ServerToClientPlayerSurrender", function (surrender) {
                  var encodedMsg = PlayerSurrenderingCommand.Format(surrender);
                  var li = document.createElement("li");
                  li.innerHTML = "<strong class=\"text-warning\">".concat(encodedMsg, "</strong>");
                  document.querySelector(this.m_sMsgListSel).appendChild(li);
                  this.m_bHandlingEvent = false;
                  encodedMsg = encodedMsg === '' ? 'Game interrupted!' : encodedMsg;
                  this.NotifyBrowser('Game interruption', encodedMsg);
                  alert(encodedMsg);
                  window.location.href = "GamesList";
                }.bind(this));
                this.g_SignalRConnection.on("ServerToClientPlayerWin", function (win) {
                  var encodedMsg = WinCommand.Format(win);
                  var li = document.createElement("li");
                  li.innerHTML = "<strong class=\"text-warning\">".concat(encodedMsg, "</strong>");
                  document.querySelector(this.m_sMsgListSel).appendChild(li);
                  this.ReceivedWinProcessing(win);
                  this.NotifyBrowser('We have a winner', encodedMsg);
                }.bind(this));
                this.g_SignalRConnection.on("ServerToClientPing", function (ping) {
                  var user = this.m_Player2Name.innerHTML;
                  var encodedMsg = PingCommand.Format(user, ping);
                  var li = document.createElement("li");
                  li.textContent = encodedMsg;
                  document.querySelector(this.m_sMsgListSel).appendChild(li);
                  this.NotifyBrowser('User Message', encodedMsg);
                }.bind(this));
                this.g_SignalRConnection.on("ServerToClientOtherPlayerDisconnected", function (sMsg) {
                  var opts = {
                    countdownSeconds: 5,
                    //labelSelector: "#debug2",
                    initialStart: true,
                    countdownReachedHandler: function () {
                      var encodedMsg = sMsg;
                      var li = document.createElement("li");
                      li.innerHTML = "<strong class=\"text-warning\">".concat(encodedMsg, "</strong>");
                      document.querySelector(this.m_sMsgListSel).appendChild(li);
                      this.NotifyBrowser('User disconnected', encodedMsg);
                      this.m_ReconnectTimer = null;
                    }.bind(this)
                  };
                  if (this.m_ReconnectTimer) this.m_ReconnectTimer.Reset(opts);else this.m_ReconnectTimer = new CountdownTimer(opts);
                }.bind(this));
                this.g_SignalRConnection.on("ServerToClientOtherPlayerConnected", function (sMsg) {
                  if (this.m_ReconnectTimer) {
                    this.m_ReconnectTimer.Stop();
                    this.m_ReconnectTimer = null;
                  } else {
                    var encodedMsg = sMsg;
                    var li = document.createElement("li");
                    li.innerHTML = "<strong class=\"text-primary\">".concat(encodedMsg, "</strong>");
                    document.querySelector(this.m_sMsgListSel).appendChild(li);
                    this.NotifyBrowser('User disconnected', encodedMsg);
                    this.m_ReconnectTimer = null;
                  }
                }.bind(this));
                this.g_SignalRConnection.on("ServerToClientStopAndDraw", function (cmd) {
                  if (!cmd) return;
                  var user = this.m_Player2Name.innerHTML;
                  var encodedMsg = StopAndDrawCommand.Format(user);
                  var li = document.createElement("li");
                  li.innerHTML = "<strong class=\"text-info\">".concat(encodedMsg, "</strong>");
                  document.querySelector(this.m_sMsgListSel).appendChild(li);
                  this.NotifyBrowser('User ' + user + ' started drawing new path', encodedMsg);
                }.bind(this));

                if (false === this.m_bIsCPUGame) {
                  document.querySelector(this.m_sMsgSendButtonSel).addEventListener("click", /*#__PURE__*/function () {
                    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(event) {
                      var encodedMsg, ping;
                      return regeneratorRuntime.wrap(function _callee5$(_context5) {
                        while (1) {
                          switch (_context5.prev = _context5.next) {
                            case 0:
                              event.preventDefault();
                              encodedMsg = document.querySelector(this.m_sMsgInputSel).value.trim();

                              if (!(encodedMsg === '')) {
                                _context5.next = 4;
                                break;
                              }

                              return _context5.abrupt("return");

                            case 4:
                              ping = new PingCommand(encodedMsg);
                              _context5.next = 7;
                              return this.SendAsyncData(ping);

                            case 7:
                            case "end":
                              return _context5.stop();
                          }
                        }
                      }, _callee5, this);
                    }));

                    return function (_x6) {
                      return _ref5.apply(this, arguments);
                    };
                  }().bind(this), false); // Execute a function when the user releases a key on the keyboard

                  document.querySelector(this.m_sMsgInputSel).addEventListener("keyup", function (event) {
                    event.preventDefault(); // Cancel the default action, if needed

                    if (event.keyCode === 13) {
                      // Number 13 is the "Enter" key on the keyboard
                      // Trigger the button element with a click
                      document.querySelector(this.m_sMsgSendButtonSel).click();
                    }
                  }.bind(this), false);
                }

                return _context6.abrupt("return", this.Connect());

              case 14:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function StartSignalRConnection(_x4) {
        return _StartSignalRConnection.apply(this, arguments);
      }

      return StartSignalRConnection;
    }()
  }, {
    key: "StopSignalRConnection",
    value: function StopSignalRConnection() {
      if (this.g_SignalRConnection !== null) {
        this.g_SignalRConnection.stop(); //cleanup

        if (this.m_ReconnectTimer) this.m_ReconnectTimer.Stop();
        if (this.m_Timer) this.m_Timer.Stop();
        LocalLog('Stopped SignalR connection');
      }
    }
  }, {
    key: "Debug",
    value: function Debug() {
      switch (arguments.length) {
        case 1:
          this.m_Debug.innerHTML = arguments.length <= 0 ? undefined : arguments[0];
          break;

        case 2:
          {
            var d = document.getElementById('debug' + (arguments.length <= 1 ? undefined : arguments[1]));
            d.innerHTML = arguments.length <= 0 ? undefined : arguments[0];
          }
          break;

        default:
          for (var i = 0; i < arguments.length; i++) {
            var msg = i < 0 || arguments.length <= i ? undefined : arguments[i];

            if (msg) {
              var _d = document.getElementById('debug' + i);

              if (_d) _d.innerHTML = msg;
            }
          }

          break;
      }
    }
    /**
     * Disable Text Selection script- © Dynamic Drive DHTML code library (www.dynamicdrive.com)
     * This notice MUST stay intact for legal use
     * Visit Dynamic Drive at http://www.dynamicdrive.com/ for full source code
     *
     * @param {element} Target is the element with disabled selection of text
     */

  }, {
    key: "DisableSelection",
    value: function DisableSelection(Target) {
      if (_typeof(Target.onselectstart) !== undefined) //IE route
        Target.onselectstart = function () {
          return false;
        };else if (_typeof(Target.style.MozUserSelect) !== undefined) //Firefox route
        Target.style.MozUserSelect = "none";else //All other route (ie: Opera)
        Target.onmousedown = function () {
          return false;
        }; //Target.style.cursor = "default";
    }
  }, {
    key: "f_clientWidth",
    value: function f_clientWidth() {
      return this.f_filterResults(window.innerWidth ? window.innerWidth : 0, document.documentElement ? document.documentElement.clientWidth : 0, document.body ? document.body.clientWidth : 0);
    }
  }, {
    key: "f_clientHeight",
    value: function f_clientHeight() {
      return this.f_filterResults(window.innerHeight ? window.innerHeight : 0, document.documentElement ? document.documentElement.clientHeight : 0, document.body ? document.body.clientHeight : 0);
    }
  }, {
    key: "f_scrollLeft",
    value: function f_scrollLeft() {
      return this.f_filterResults(window.pageXOffset ? window.pageXOffset : 0, document.documentElement ? document.documentElement.scrollLeft : 0, document.body ? document.body.scrollLeft : 0);
    }
  }, {
    key: "f_scrollTop",
    value: function f_scrollTop() {
      return this.f_filterResults(window.pageYOffset ? window.pageYOffset : 0, document.documentElement ? document.documentElement.scrollTop : 0, document.body ? document.body.scrollTop : 0);
    }
  }, {
    key: "f_filterResults",
    value: function f_filterResults(n_win, n_docel, n_body) {
      var n_result = n_win ? n_win : 0;
      if (n_docel && (!n_result || n_result > n_docel)) n_result = n_docel;
      return n_body && (!n_result || n_result > n_body) ? n_body : n_result;
    }
  }, {
    key: "SetPoint",
    value: function () {
      var _SetPoint = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(iX, iY, iStatus, iPlayerId) {
        var x, y, oval, color;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return this.m_Points.has(iY * this.m_iGridWidth + iX);

              case 2:
                if (!_context7.sent) {
                  _context7.next = 4;
                  break;
                }

                return _context7.abrupt("return");

              case 4:
                x = iX * this.m_iGridSizeX;
                y = iY * this.m_iGridSizeY;
                oval = this.SvgVml.CreateOval(this.m_PointRadius);
                oval.move(x, y, this.m_PointRadius);
                _context7.t0 = iStatus;
                _context7.next = _context7.t0 === StatusEnum.POINT_FREE_RED ? 11 : _context7.t0 === StatusEnum.POINT_FREE_BLUE ? 14 : _context7.t0 === StatusEnum.POINT_FREE ? 17 : _context7.t0 === StatusEnum.POINT_STARTING ? 20 : _context7.t0 === StatusEnum.POINT_IN_PATH ? 23 : _context7.t0 === StatusEnum.POINT_OWNED_BY_RED ? 26 : _context7.t0 === StatusEnum.POINT_OWNED_BY_BLUE ? 29 : 32;
                break;

              case 11:
                color = this.COLOR_RED;
                oval.SetStatus(iStatus
                /*StatusEnum.POINT_FREE*/
                );
                return _context7.abrupt("break", 34);

              case 14:
                color = this.COLOR_BLUE;
                oval.SetStatus(iStatus
                /*StatusEnum.POINT_FREE*/
                );
                return _context7.abrupt("break", 34);

              case 17:
                color = this.m_sDotColor;
                oval.SetStatus(iStatus
                /*StatusEnum.POINT_FREE*/
                ); //console.warn('TODO: generic FREE point, really? change it!');

                return _context7.abrupt("break", 34);

              case 20:
                color = this.m_sDotColor;
                oval.SetStatus(iStatus);
                return _context7.abrupt("break", 34);

              case 23:
                if (this.g_iPlayerID === iPlayerId) //bPlayingWithRed
                  color = this.m_bIsPlayingWithRed === true ? this.COLOR_RED : this.COLOR_BLUE;else color = this.m_bIsPlayingWithRed === true ? this.COLOR_BLUE : this.COLOR_RED;
                oval.SetStatus(iStatus);
                return _context7.abrupt("break", 34);

              case 26:
                color = this.COLOR_OWNED_RED;
                oval.SetStatus(iStatus);
                return _context7.abrupt("break", 34);

              case 29:
                color = this.COLOR_OWNED_BLUE;
                oval.SetStatus(iStatus);
                return _context7.abrupt("break", 34);

              case 32:
                alert('bad point');
                return _context7.abrupt("break", 34);

              case 34:
                oval.SetFillColor(color);
                oval.SetStrokeColor(color);
                _context7.next = 38;
                return this.m_Points.set(iY * this.m_iGridWidth + iX, oval);

              case 38:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function SetPoint(_x7, _x8, _x9, _x10) {
        return _SetPoint.apply(this, arguments);
      }

      return SetPoint;
    }()
  }, {
    key: "GetGameStateForIndexedDb",
    value: function GetGameStateForIndexedDb() {
      return {
        iGameID: this.g_iGameID,
        iPlayerID: this.g_iPlayerID,
        iOtherPlayerId: this.m_iOtherPlayerId,
        sLastMoveGameTimeStamp: this.m_sLastMoveGameTimeStamp,
        bPointsAndPathsLoaded: this.m_bPointsAndPathsLoaded,
        iGridWidth: this.m_iGridWidth,
        iGridHeight: this.m_iGridHeight,
        iGridSizeX: this.m_iGridSizeX,
        iGridSizeY: this.m_iGridSizeY
      };
    }
    /**
     * Callback method invoked by IndexedDb abstraction store
     * @param {any} iX point x taken from IndexedDb
     * @param {any} iY point y taken from IndexedDb
     * @param {any} iStatus status taken from IndexedDb
     * @param {any} sColor color taken from IndexedDb
     * @returns {object} created oval/cirle
     */

  }, {
    key: "CreateScreenPointFromIndexedDb",
    value: function CreateScreenPointFromIndexedDb(iX, iY, iStatus, sColor) {
      var x = iX * this.m_iGridSizeX;
      var y = iY * this.m_iGridSizeY;
      var oval = this.SvgVml.CreateOval(this.m_PointRadius);
      oval.move(x, y, this.m_PointRadius);
      var color;

      switch (iStatus) {
        case StatusEnum.POINT_FREE_RED:
          color = this.COLOR_RED;
          oval.SetStatus(iStatus
          /*StatusEnum.POINT_FREE*/
          );
          break;

        case StatusEnum.POINT_FREE_BLUE:
          color = this.COLOR_BLUE;
          oval.SetStatus(iStatus
          /*StatusEnum.POINT_FREE*/
          );
          break;

        case StatusEnum.POINT_FREE:
          color = this.m_sDotColor;
          oval.SetStatus(iStatus
          /*StatusEnum.POINT_FREE*/
          ); //console.warn('TODO: generic FREE point, really? change it!');

          break;

        case StatusEnum.POINT_STARTING:
          color = this.m_sDotColor;
          oval.SetStatus(iStatus);
          break;

        case StatusEnum.POINT_IN_PATH:
          //if (this.g_iPlayerID === iPlayerId)//bPlayingWithRed
          //	color = this.m_bIsPlayingWithRed === true ? this.COLOR_RED : this.COLOR_BLUE;
          //else
          //	color = this.m_bIsPlayingWithRed === true ? this.COLOR_BLUE : this.COLOR_RED;
          color = sColor;
          oval.SetStatus(iStatus);
          break;

        case StatusEnum.POINT_OWNED_BY_RED:
          color = this.COLOR_OWNED_RED;
          oval.SetStatus(iStatus);
          break;

        case StatusEnum.POINT_OWNED_BY_BLUE:
          color = this.COLOR_OWNED_BLUE;
          oval.SetStatus(iStatus);
          break;

        default:
          alert('bad point');
          break;
      }

      oval.SetFillColor(color);
      oval.SetStrokeColor(color);
      return oval;
    }
  }, {
    key: "SetAllPoints",
    value: function () {
      var _SetAllPoints = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(points) {
        var DataUnMinimizerStatus, DataUnMinimizerPlayerId, _iterator, _step, p;

        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                DataUnMinimizerPlayerId = function _DataUnMinimizerPlaye(playerId) {
                  return playerId - 1;
                };

                DataUnMinimizerStatus = function _DataUnMinimizerStatu(status) {
                  return status - 3;
                };

                _context8.prev = 2;
                _context8.next = 5;
                return this.m_Points.BeginBulkStorage();

              case 5:
                _iterator = _createForOfIteratorHelper(points);
                _context8.prev = 6;

                _iterator.s();

              case 8:
                if ((_step = _iterator.n()).done) {
                  _context8.next = 14;
                  break;
                }

                p = _step.value;
                _context8.next = 12;
                return this.SetPoint(p[0]
                /*x*/
                , p[1]
                /*y*/
                , DataUnMinimizerStatus(p[2]
                /*Status*/
                ), DataUnMinimizerPlayerId(p[3]
                /*iPlayerId*/
                ));

              case 12:
                _context8.next = 8;
                break;

              case 14:
                _context8.next = 19;
                break;

              case 16:
                _context8.prev = 16;
                _context8.t0 = _context8["catch"](6);

                _iterator.e(_context8.t0);

              case 19:
                _context8.prev = 19;

                _iterator.f();

                return _context8.finish(19);

              case 22:
                _context8.prev = 22;
                _context8.next = 25;
                return this.m_Points.EndBulkStorage();

              case 25:
                return _context8.finish(22);

              case 26:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this, [[2,, 22, 26], [6, 16, 19, 22]]);
      }));

      function SetAllPoints(_x11) {
        return _SetAllPoints.apply(this, arguments);
      }

      return SetAllPoints;
    }()
  }, {
    key: "SetPath",
    value: function () {
      var _SetPath = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(packed, bIsRed, bBelong2ThisPlayer) {
        var iPathId,
            sPoints,
            sDelimiter,
            sPathPoints,
            p,
            x,
            y,
            status,
            _iterator2,
            _step2,
            pair,
            line,
            _args9 = arguments;

        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                iPathId = _args9.length > 3 && _args9[3] !== undefined ? _args9[3] : 0;
                sPoints = packed.split(" ");
                sDelimiter = "", sPathPoints = "", p = null, status = StatusEnum.POINT_STARTING;
                _iterator2 = _createForOfIteratorHelper(sPoints);
                _context9.prev = 4;

                _iterator2.s();

              case 6:
                if ((_step2 = _iterator2.n()).done) {
                  _context9.next = 21;
                  break;
                }

                pair = _step2.value;
                p = pair.split(",");
                x = parseInt(p[0]);
                y = parseInt(p[1]);
                _context9.next = 13;
                return this.m_Points.get(y * this.m_iGridWidth + x);

              case 13:
                p = _context9.sent;

                if (p !== null && p !== undefined) {
                  p.SetStatus(status);
                  status = StatusEnum.POINT_IN_PATH;
                } else {//debugger;
                }

                x *= this.m_iGridSizeX;
                y *= this.m_iGridSizeY;
                sPathPoints += "".concat(sDelimiter).concat(x, ",").concat(y);
                sDelimiter = " ";

              case 19:
                _context9.next = 6;
                break;

              case 21:
                _context9.next = 26;
                break;

              case 23:
                _context9.prev = 23;
                _context9.t0 = _context9["catch"](4);

                _iterator2.e(_context9.t0);

              case 26:
                _context9.prev = 26;

                _iterator2.f();

                return _context9.finish(26);

              case 29:
                p = sPoints[0].split(",");
                x = parseInt(p[0]);
                y = parseInt(p[1]);
                _context9.next = 34;
                return this.m_Points.get(y * this.m_iGridWidth + x);

              case 34:
                p = _context9.sent;

                if (p !== null && p !== undefined) {
                  p.SetStatus(status);
                } else {//debugger;
                }

                x *= this.m_iGridSizeX;
                y *= this.m_iGridSizeY;
                sPathPoints += "".concat(sDelimiter).concat(x, ",").concat(y);
                line = this.SvgVml.CreatePolyline(3, sPathPoints, bBelong2ThisPlayer ? this.m_sDotColor : bIsRed ? this.COLOR_BLUE : this.COLOR_RED);
                line.SetID(iPathId);
                _context9.next = 43;
                return this.m_Lines.push(line);

              case 43:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this, [[4, 23, 26, 29]]);
      }));

      function SetPath(_x12, _x13, _x14) {
        return _SetPath.apply(this, arguments);
      }

      return SetPath;
    }()
  }, {
    key: "CreateScreenPathFromIndexedDb",
    value: function () {
      var _CreateScreenPathFromIndexedDb = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(packed, sColor, iPathId) {
        var sPoints, sDelimiter, sPathPoints, p, x, y, status, _iterator3, _step3, pair, line;

        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                sPoints = packed.split(" ");
                sDelimiter = "", sPathPoints = "", p = null, status = StatusEnum.POINT_STARTING;
                _iterator3 = _createForOfIteratorHelper(sPoints);
                _context10.prev = 3;

                _iterator3.s();

              case 5:
                if ((_step3 = _iterator3.n()).done) {
                  _context10.next = 20;
                  break;
                }

                pair = _step3.value;
                p = pair.split(",");
                x = parseInt(p[0]);
                y = parseInt(p[1]);
                _context10.next = 12;
                return this.m_Points.get(y * this.m_iGridWidth + x);

              case 12:
                p = _context10.sent;

                if (p !== null && p !== undefined) {
                  p.SetStatus(status);
                  status = StatusEnum.POINT_IN_PATH;
                } else {//debugger;
                }

                x *= this.m_iGridSizeX;
                y *= this.m_iGridSizeY;
                sPathPoints += "".concat(sDelimiter).concat(x, ",").concat(y);
                sDelimiter = " ";

              case 18:
                _context10.next = 5;
                break;

              case 20:
                _context10.next = 25;
                break;

              case 22:
                _context10.prev = 22;
                _context10.t0 = _context10["catch"](3);

                _iterator3.e(_context10.t0);

              case 25:
                _context10.prev = 25;

                _iterator3.f();

                return _context10.finish(25);

              case 28:
                p = sPoints[0].split(",");
                x = parseInt(p[0]);
                y = parseInt(p[1]);
                _context10.next = 33;
                return this.m_Points.get(y * this.m_iGridWidth + x);

              case 33:
                p = _context10.sent;

                if (p !== null && p !== undefined) {
                  p.SetStatus(status);
                } else {//debugger;
                }

                x *= this.m_iGridSizeX;
                y *= this.m_iGridSizeY;
                sPathPoints += "".concat(sDelimiter).concat(x, ",").concat(y);
                line = this.SvgVml.CreatePolyline(3, sPathPoints, sColor);
                line.SetID(iPathId);
                return _context10.abrupt("return", line);

              case 41:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this, [[3, 22, 25, 28]]);
      }));

      function CreateScreenPathFromIndexedDb(_x15, _x16, _x17) {
        return _CreateScreenPathFromIndexedDb.apply(this, arguments);
      }

      return CreateScreenPathFromIndexedDb;
    }()
  }, {
    key: "SetAllPaths",
    value: function () {
      var _SetAllPaths = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(packedPaths) {
        var _iterator4, _step4, unpacked;

        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.prev = 0;
                _context11.next = 3;
                return this.m_Lines.BeginBulkStorage();

              case 3:
                _iterator4 = _createForOfIteratorHelper(packedPaths);
                _context11.prev = 4;

                _iterator4.s();

              case 6:
                if ((_step4 = _iterator4.n()).done) {
                  _context11.next = 14;
                  break;
                }

                unpacked = _step4.value;

                if (!(unpacked.iGameId !== this.g_iGameID)) {
                  _context11.next = 10;
                  break;
                }

                throw new Error("Bad game from path!");

              case 10:
                _context11.next = 12;
                return this.SetPath(unpacked.PointsAsString
                /*points*/
                , this.m_bIsPlayingWithRed, unpacked.iPlayerId === this.g_iPlayerID
                /*isMainPlayerPoints*/
                , unpacked.iId
                /*real DB id*/
                );

              case 12:
                _context11.next = 6;
                break;

              case 14:
                _context11.next = 19;
                break;

              case 16:
                _context11.prev = 16;
                _context11.t0 = _context11["catch"](4);

                _iterator4.e(_context11.t0);

              case 19:
                _context11.prev = 19;

                _iterator4.f();

                return _context11.finish(19);

              case 22:
                _context11.prev = 22;
                _context11.next = 25;
                return this.m_Lines.EndBulkStorage();

              case 25:
                return _context11.finish(22);

              case 26:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this, [[0,, 22, 26], [4, 16, 19, 22]]);
      }));

      function SetAllPaths(_x18) {
        return _SetAllPaths.apply(this, arguments);
      }

      return SetAllPaths;
    }()
  }, {
    key: "IsPointBelongingToLine",
    value: function IsPointBelongingToLine(sPoints, iX, iY) {
      var _iterator5 = _createForOfIteratorHelper(sPoints),
          _step5;

      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var packed = _step5.value;
          var pnt = packed.split(",");
          var x = pnt[0],
              y = pnt[1];
          if (x === iX && y === iY) return true;
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }

      return false;
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

  }, {
    key: "pnpoly",
    value: function pnpoly(npol, xp, yp, x, y) {
      var i,
          j,
          c = false;

      for (i = 0, j = npol - 1; i < npol; j = i++) {
        if ((yp[i] <= y && y < yp[j] || yp[j] <= y && y < yp[i]) && x < (xp[j] - xp[i]) * (y - yp[i]) / (yp[j] - yp[i]) + xp[i]) c = !c;
      }

      return c;
    }
  }, {
    key: "pnpoly2",
    value: function pnpoly2(pathPoints, x, y) {
      var npol = pathPoints.length;
      var i,
          j,
          c = false;

      for (i = 0, j = npol - 1; i < npol; j = i++) {
        var pi = pathPoints[i],
            pj = pathPoints[j];
        if ((pi.y <= y && y < pj.y || pj.y <= y && y < pi.y) && x < (pj.x - pi.x) * (y - pi.y) / (pj.y - pi.y) + pi.x) c = !c;
      }

      return c;
    }
  }, {
    key: "SurroundOponentPoints",
    value: function () {
      var _SurroundOponentPoints = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12() {
        var points, pts_not_unique, sColor, owned_by, sOwnedCol, sPathPoints, sOwnedPoints, sDelimiter, ownedPoints, _iterator6, _step6, pt, _pt$GetPosition, x, y;

        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                points = this.m_Line.GetPointsArray(); //uniqe point path test (no duplicates except starting-ending point)

                pts_not_unique = SVG.hasDuplicates(points.slice(0, -1).map(function (pt) {
                  return pt.x + '_' + pt.y;
                }));

                if (!(pts_not_unique || !(points[0].x === points[points.length - 1].x && points[0].y === points[points.length - 1].y))) {
                  _context12.next = 4;
                  break;
                }

                return _context12.abrupt("return", {
                  OwnedPoints: undefined,
                  owned: "",
                  path: "",
                  errorDesc: "Points not unique"
                });

              case 4:
                //pick right color, status and owned by status
                if (this.m_sDotColor === this.COLOR_RED) {
                  sColor = this.COLOR_BLUE;
                  owned_by = StatusEnum.POINT_OWNED_BY_RED;
                  sOwnedCol = this.COLOR_OWNED_RED;
                } else {
                  sColor = this.COLOR_RED;
                  owned_by = StatusEnum.POINT_OWNED_BY_BLUE;
                  sOwnedCol = this.COLOR_OWNED_BLUE;
                }

                sPathPoints = "", sOwnedPoints = "", sDelimiter = "", ownedPoints = []; //make the test!

                _context12.t0 = _createForOfIteratorHelper;
                _context12.next = 9;
                return this.m_Points.values();

              case 9:
                _context12.t1 = _context12.sent;
                _iterator6 = (0, _context12.t0)(_context12.t1);

                try {
                  for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
                    pt = _step6.value;

                    if (pt !== undefined && pt.GetFillColor() === sColor && [StatusEnum.POINT_FREE_BLUE, StatusEnum.POINT_FREE_RED].includes(pt.GetStatus())) {
                      _pt$GetPosition = pt.GetPosition(), x = _pt$GetPosition.x, y = _pt$GetPosition.y;

                      if (false !== this.pnpoly2(points, x, y)) {
                        x /= this.m_iGridSizeX;
                        y /= this.m_iGridSizeY;
                        sOwnedPoints += "".concat(sDelimiter).concat(x, ",").concat(y);
                        sDelimiter = " ";
                        ownedPoints.push({
                          point: pt,
                          revertStatus: pt.GetStatus(),
                          revertFillColor: pt.GetFillColor(),
                          revertStrokeColor: pt.GetStrokeColor()
                        });
                        pt.SetStatus(owned_by, true);
                        pt.SetFillColor(sOwnedCol);
                        pt.SetStrokeColor(sOwnedCol);
                      }
                    }
                  }
                } catch (err) {
                  _iterator6.e(err);
                } finally {
                  _iterator6.f();
                }

                if (sOwnedPoints !== "") {
                  sPathPoints = points.map(function (pt) {
                    var x = pt.x,
                        y = pt.y;
                    if (x === null || y === null) return '';
                    x /= this.m_iGridSizeX;
                    y /= this.m_iGridSizeY;
                    return "".concat(x, ",").concat(y);
                  }.bind(this)).join(' ');
                }

                return _context12.abrupt("return", {
                  OwnedPoints: ownedPoints,
                  owned: sOwnedPoints,
                  PathPoints: [],
                  path: sPathPoints,
                  errorDesc: "No surrounded points"
                });

              case 14:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function SurroundOponentPoints() {
        return _SurroundOponentPoints.apply(this, arguments);
      }

      return SurroundOponentPoints;
    }()
  }, {
    key: "IsPointOutsideAllPaths",
    value: function () {
      var _IsPointOutsideAllPaths = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(x, y) {
        var xmul, ymul, lines, _iterator7, _step7, line, points;

        return regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                xmul = x * this.m_iGridSizeX, ymul = y * this.m_iGridSizeY;
                _context13.next = 3;
                return this.m_Lines.all();

              case 3:
                lines = _context13.sent;
                //TODO: async for
                _iterator7 = _createForOfIteratorHelper(lines);
                _context13.prev = 5;

                _iterator7.s();

              case 7:
                if ((_step7 = _iterator7.n()).done) {
                  _context13.next = 14;
                  break;
                }

                line = _step7.value;
                points = line.GetPointsArray();

                if (!(false !== this.pnpoly2(points, xmul, ymul))) {
                  _context13.next = 12;
                  break;
                }

                return _context13.abrupt("return", false);

              case 12:
                _context13.next = 7;
                break;

              case 14:
                _context13.next = 19;
                break;

              case 16:
                _context13.prev = 16;
                _context13.t0 = _context13["catch"](5);

                _iterator7.e(_context13.t0);

              case 19:
                _context13.prev = 19;

                _iterator7.f();

                return _context13.finish(19);

              case 22:
                return _context13.abrupt("return", true);

              case 23:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, this, [[5, 16, 19, 22]]);
      }));

      function IsPointOutsideAllPaths(_x19, _x20) {
        return _IsPointOutsideAllPaths.apply(this, arguments);
      }

      return IsPointOutsideAllPaths;
    }()
  }, {
    key: "CreateXMLWaitForPlayerRequest",
    value: function CreateXMLWaitForPlayerRequest()
    /*...args*/
    {//let cmd = new WaitForPlayerCommand((args.length > 0 && args[0] === true) ? true : false);
      //return cmd;
    }
  }, {
    key: "CreateXMLPutPointRequest",
    value: function CreateXMLPutPointRequest(iX, iY) {
      var cmd = new InkBallPointViewModel(0, this.g_iGameID, this.g_iPlayerID, iX, iY, this.m_bIsPlayingWithRed ? StatusEnum.POINT_FREE_RED : StatusEnum.POINT_FREE_BLUE, 0);
      return cmd;
    }
    /**
     * Create transferable object holding path points creating it as well as owned points by it
     * @param {object} dto with path, owned
     * @returns {object} command
     */

  }, {
    key: "CreateXMLPutPathRequest",
    value: function CreateXMLPutPathRequest(dto) {
      var cmd = new InkBallPathViewModel(0, this.g_iGameID, this.g_iPlayerID, dto.path, dto.owned
      /*, this.m_Timer !== null*/
      );
      return cmd;
    }
    /**
     * Send data through signalR
     * @param {object} payload transferrableObject (DTO)
     * @param {function} revertFunction on-error revert/rollback function
     */

  }, {
    key: "SendAsyncData",
    value: function () {
      var _SendAsyncData = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(payload) {
        var revertFunction,
            point,
            dto,
            win,
            path,
            _args14 = arguments;
        return regeneratorRuntime.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                revertFunction = _args14.length > 1 && _args14[1] !== undefined ? _args14[1] : undefined;
                _context14.t0 = payload.GetKind();
                _context14.next = _context14.t0 === CommandKindEnum.POINT ? 4 : _context14.t0 === CommandKindEnum.PATH ? 19 : _context14.t0 === CommandKindEnum.PING ? 44 : _context14.t0 === CommandKindEnum.STOP_AND_DRAW ? 55 : 69;
                break;

              case 4:
                LocalLog(InkBallPointViewModel.Format('some player', payload));
                this.m_bHandlingEvent = true;
                _context14.prev = 6;
                _context14.next = 9;
                return this.g_SignalRConnection.invoke("ClientToServerPoint", payload);

              case 9:
                point = _context14.sent;
                _context14.next = 12;
                return this.ReceivedPointProcessing(point);

              case 12:
                _context14.next = 18;
                break;

              case 14:
                _context14.prev = 14;
                _context14.t1 = _context14["catch"](6);
                LocalError(_context14.t1.toString());
                if (revertFunction !== undefined) revertFunction();

              case 18:
                return _context14.abrupt("break", 71);

              case 19:
                LocalLog(InkBallPathViewModel.Format('some player', payload));
                this.m_bHandlingEvent = true;
                _context14.prev = 21;
                _context14.next = 24;
                return this.g_SignalRConnection.invoke("ClientToServerPath", payload);

              case 24:
                dto = _context14.sent;

                if (!(Object.prototype.hasOwnProperty.call(dto, 'WinningPlayerId') || Object.prototype.hasOwnProperty.call(dto, 'winningPlayerId'))) {
                  _context14.next = 30;
                  break;
                }

                win = dto;
                this.ReceivedWinProcessing(win);
                _context14.next = 37;
                break;

              case 30:
                if (!(Object.prototype.hasOwnProperty.call(dto, 'PointsAsString') || Object.prototype.hasOwnProperty.call(dto, 'pointsAsString'))) {
                  _context14.next = 36;
                  break;
                }

                path = dto;
                _context14.next = 34;
                return this.ReceivedPathProcessing(path);

              case 34:
                _context14.next = 37;
                break;

              case 36:
                throw new Error("ClientToServerPath bad GetKind!");

              case 37:
                _context14.next = 43;
                break;

              case 39:
                _context14.prev = 39;
                _context14.t2 = _context14["catch"](21);
                LocalError(_context14.t2.toString());
                if (revertFunction !== undefined) revertFunction();

              case 43:
                return _context14.abrupt("break", 71);

              case 44:
                _context14.prev = 44;
                _context14.next = 47;
                return this.g_SignalRConnection.invoke("ClientToServerPing", payload);

              case 47:
                document.querySelector(this.m_sMsgInputSel).value = '';
                document.querySelector(this.m_sMsgSendButtonSel).disabled = 'disabled';
                _context14.next = 54;
                break;

              case 51:
                _context14.prev = 51;
                _context14.t3 = _context14["catch"](44);
                LocalError(_context14.t3.toString());

              case 54:
                return _context14.abrupt("break", 71);

              case 55:
                _context14.prev = 55;
                _context14.next = 58;
                return this.g_SignalRConnection.invoke("ClientToServerStopAndDraw", payload);

              case 58:
                this.m_bDrawLines = true;
                this.m_iLastX = this.m_iLastY = -1;
                this.m_Line = null;
                this.m_bIsPlayerActive = true;
                this.m_StopAndDraw.disabled = 'disabled';
                _context14.next = 68;
                break;

              case 65:
                _context14.prev = 65;
                _context14.t4 = _context14["catch"](55);
                LocalError(_context14.t4.toString());

              case 68:
                return _context14.abrupt("break", 71);

              case 69:
                LocalError('unknown object');
                return _context14.abrupt("break", 71);

              case 71:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14, this, [[6, 14], [21, 39], [44, 51], [55, 65]]);
      }));

      function SendAsyncData(_x21) {
        return _SendAsyncData.apply(this, arguments);
      }

      return SendAsyncData;
    }()
  }, {
    key: "CountDownReachedHandler",
    value: function CountDownReachedHandler(label) {
      if (label) label.innerHTML = ''; //this.NotifyBrowser('Time is running out', 'make a move');

      this.m_StopAndDraw.disabled = this.m_CancelPath.disabled = 'disabled';
      this.m_Timer = null;
      this.m_bIsPlayerActive = false;
    }
  }, {
    key: "ReceivedPointProcessing",
    value: function () {
      var _ReceivedPointProcessing = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(point) {
        var x, y, iStatus;
        return regeneratorRuntime.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                x = point.iX, y = point.iY, iStatus = point.Status !== undefined ? point.Status : point.status;
                this.m_sLastMoveGameTimeStamp = (point.TimeStamp !== undefined ? point.TimeStamp : new Date(point.timeStamp)).toISOString();
                _context15.next = 4;
                return this.SetPoint(x, y, iStatus, point.iPlayerId);

              case 4:
                if (!(this.g_iPlayerID !== point.iPlayerId)) {
                  _context15.next = 16;
                  break;
                }

                this.m_bIsPlayerActive = true;
                this.ShowMobileStatus('Oponent has moved, your turn');
                this.m_Screen.style.cursor = "crosshair";

                if (!(this.m_Line !== null)) {
                  _context15.next = 11;
                  break;
                }

                _context15.next = 11;
                return this.OnCancelClick();

              case 11:
                this.m_StopAndDraw.disabled = '';
                if (!this.m_bDrawLines) this.m_StopAndDraw.value = 'Draw line';else this.m_StopAndDraw.value = 'Draw dot';

                if (this.m_Timer) {
                  this.m_Timer.Stop();
                  this.m_Timer = null;
                }

                _context15.next = 24;
                break;

              case 16:
                this.m_bIsPlayerActive = false;
                this.ShowMobileStatus('Waiting for oponent move');
                this.m_Screen.style.cursor = "wait";
                this.m_CancelPath.disabled = 'disabled';
                this.m_StopAndDraw.disabled = '';
                this.m_StopAndDraw.value = 'Stop and Draw';
                if (this.m_Timer) this.m_Timer.Reset(this.m_TimerOpts);else this.m_Timer = new CountdownTimer(this.m_TimerOpts);
                if (true === this.m_bIsCPUGame && !this.m_bIsPlayerActive) this.StartCPUCalculation();

              case 24:
                this.m_bHandlingEvent = false;

              case 25:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15, this);
      }));

      function ReceivedPointProcessing(_x22) {
        return _ReceivedPointProcessing.apply(this, arguments);
      }

      return ReceivedPointProcessing;
    }()
  }, {
    key: "ReceivedPathProcessing",
    value: function () {
      var _ReceivedPathProcessing = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16(path) {
        var str_path, owned, points, point_status, sOwnedCol, _iterator8, _step8, packed, p, x, y, _points, _x24, _y, p0;

        return regeneratorRuntime.wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                this.m_sLastMoveGameTimeStamp = (path.TimeStamp !== undefined ? path.TimeStamp : new Date(path.timeStamp)).toISOString();

                if (!(this.g_iPlayerID !== path.iPlayerId)) {
                  _context16.next = 38;
                  break;
                }

                str_path = path.PointsAsString || path.pointsAsString, owned = path.OwnedPointsAsString || path.ownedPointsAsString;
                _context16.next = 5;
                return this.SetPath(str_path, this.m_sDotColor === this.COLOR_RED ? true : false, false, path.iId
                /*real DB id*/
                );

              case 5:
                points = owned.split(" ");
                point_status = this.m_sDotColor === this.COLOR_RED ? StatusEnum.POINT_OWNED_BY_RED : StatusEnum.POINT_OWNED_BY_BLUE;
                sOwnedCol = this.m_sDotColor === this.COLOR_RED ? this.COLOR_OWNED_RED : this.COLOR_OWNED_BLUE;
                _iterator8 = _createForOfIteratorHelper(points);
                _context16.prev = 9;

                _iterator8.s();

              case 11:
                if ((_step8 = _iterator8.n()).done) {
                  _context16.next = 21;
                  break;
                }

                packed = _step8.value;
                p = packed.split(",");
                x = parseInt(p[0]), y = parseInt(p[1]);
                _context16.next = 17;
                return this.m_Points.get(y * this.m_iGridWidth + x);

              case 17:
                p = _context16.sent;

                if (p !== undefined) {
                  p.SetStatus(point_status);
                  p.SetFillColor(sOwnedCol);
                  p.SetStrokeColor(sOwnedCol);
                } else {//debugger;
                }

              case 19:
                _context16.next = 11;
                break;

              case 21:
                _context16.next = 26;
                break;

              case 23:
                _context16.prev = 23;
                _context16.t0 = _context16["catch"](9);

                _iterator8.e(_context16.t0);

              case 26:
                _context16.prev = 26;

                _iterator8.f();

                return _context16.finish(26);

              case 29:
                this.m_bIsPlayerActive = true;
                this.ShowMobileStatus('Oponent has moved, your turn');
                this.m_Screen.style.cursor = "crosshair";

                if (!(this.m_Line !== null)) {
                  _context16.next = 35;
                  break;
                }

                _context16.next = 35;
                return this.OnCancelClick();

              case 35:
                this.m_StopAndDraw.disabled = '';
                _context16.next = 57;
                break;

              case 38:
                //set starting point to POINT_IN_PATH to block further path closing with it
                _points = this.m_Line.GetPointsArray();
                _x24 = _points[0].x, _y = _points[0].y;
                _x24 /= this.m_iGridSizeX;
                _y /= this.m_iGridSizeY;
                _context16.next = 44;
                return this.m_Points.get(_y * this.m_iGridWidth + _x24);

              case 44:
                p0 = _context16.sent;
                if (p0 !== undefined) p0.SetStatus(StatusEnum.POINT_IN_PATH);else {//debugger;
                }
                this.m_Line.SetWidthAndColor(3, this.m_sDotColor);
                this.m_Line.SetID(path.iId);
                _context16.next = 50;
                return this.m_Lines.push(this.m_Line);

              case 50:
                this.m_iLastX = this.m_iLastY = -1;
                this.m_Line = null;
                this.m_bIsPlayerActive = false;
                this.ShowMobileStatus('Waiting for oponent move');
                this.m_Screen.style.cursor = "wait";
                this.m_StopAndDraw.disabled = this.m_CancelPath.disabled = 'disabled';
                if (true === this.m_bIsCPUGame && !this.m_bIsPlayerActive) this.StartCPUCalculation();

              case 57:
                if (!this.m_bDrawLines) this.m_StopAndDraw.value = 'Draw line';else this.m_StopAndDraw.value = 'Draw dot';
                this.m_bHandlingEvent = false;

                if (this.m_Timer) {
                  this.m_Timer.Stop();
                  this.m_Timer = null;
                }

              case 60:
              case "end":
                return _context16.stop();
            }
          }
        }, _callee16, this, [[9, 23, 26, 29]]);
      }));

      function ReceivedPathProcessing(_x23) {
        return _ReceivedPathProcessing.apply(this, arguments);
      }

      return ReceivedPathProcessing;
    }()
  }, {
    key: "ReceivedWinProcessing",
    value: function ReceivedWinProcessing(win) {
      this.ShowMobileStatus('Win situation');
      this.m_bHandlingEvent = false;
      var encodedMsg = WinCommand.Format(win);
      var status = win.Status !== undefined ? win.Status : win.status;
      var winningPlayerId = win.WinningPlayerId || win.winningPlayerId;

      if ((status === WinStatusEnum.RED_WINS || status === WinStatusEnum.GREEN_WINS) && winningPlayerId > 0 || status === WinStatusEnum.DRAW_WIN) {
        alert(encodedMsg === '' ? 'Game won!' : encodedMsg);
        window.location.href = "GamesList";
      }
    }
  }, {
    key: "Check4Win",
    value: function Check4Win(playerPaths, otherPlayerPaths, playerPoints, otherPlayerPoints) {
      var owned_status, count;

      switch (this.GameType) {
        case GameTypeEnum.FIRST_CAPTURE:
          if (playerPaths.length > 0) {
            if (this.m_bIsPlayingWithRed) return WinStatusEnum.RED_WINS;else return WinStatusEnum.GREEN_WINS;
          }

          if (otherPlayerPaths.length > 0) {
            if (this.m_bIsPlayingWithRed) return WinStatusEnum.GREEN_WINS;else return WinStatusEnum.RED_WINS;
          }

          return WinStatusEnum.NO_WIN;
        //continue game

        case GameTypeEnum.FIRST_5_CAPTURES:
          owned_status = this.m_bIsPlayingWithRed ? StatusEnum.POINT_OWNED_BY_BLUE : StatusEnum.POINT_OWNED_BY_RED;
          count = otherPlayerPoints.filter(function (p) {
            return p.iEnclosingPathId !== null && p.GetStatus() === owned_status;
          }).length;

          if (count >= 5) {
            if (this.m_bIsPlayingWithRed) return WinStatusEnum.GREEN_WINS;else return WinStatusEnum.RED_WINS;
          }

          owned_status = this.m_bIsPlayingWithRed ? StatusEnum.POINT_OWNED_BY_RED : StatusEnum.POINT_OWNED_BY_BLUE;
          count = playerPoints.filter(function (p) {
            return p.iEnclosingPathId !== null && p.GetStatus() === owned_status;
          }).length;

          if (count >= 5) {
            if (this.m_bIsPlayingWithRed) return WinStatusEnum.RED_WINS;else return WinStatusEnum.GREEN_WINS;
          }

          return WinStatusEnum.NO_WIN;
        //continue game

        case GameTypeEnum.FIRST_5_PATHS:
          if (otherPlayerPaths.length >= 5) {
            if (this.m_bIsPlayingWithRed) return WinStatusEnum.GREEN_WINS;else return WinStatusEnum.RED_WINS;
          }

          if (playerPaths.length >= 5) {
            if (this.m_bIsPlayingWithRed) return WinStatusEnum.RED_WINS;else return WinStatusEnum.GREEN_WINS;
          }

          return WinStatusEnum.NO_WIN;
        //continue game

        case GameTypeEnum.FIRST_5_ADVANTAGE_PATHS:
          {
            var diff = playerPaths.length - otherPlayerPaths.length;

            if (diff >= 5) {
              if (this.m_bIsPlayingWithRed) return WinStatusEnum.RED_WINS;else return WinStatusEnum.GREEN_WINS;
            } else if (diff <= -5) {
              if (this.m_bIsPlayingWithRed) return WinStatusEnum.GREEN_WINS;else return WinStatusEnum.RED_WINS;
            }
          }
          return WinStatusEnum.NO_WIN;
        //continue game

        default:
          throw new Error("Wrong game type");
      }
    }
  }, {
    key: "ShowMobileStatus",
    value: function ShowMobileStatus() {
      var sMessage = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      if (this.m_Player2Name.innerHTML === '???') {
        if (this.m_bIsPlayerActive) this.m_GameStatus.style.color = this.COLOR_RED;else this.m_GameStatus.style.color = this.COLOR_BLUE;
      } else if (this.m_bIsPlayerActive) {
        if (this.m_bIsPlayingWithRed) this.m_GameStatus.style.color = this.COLOR_RED;else this.m_GameStatus.style.color = this.COLOR_BLUE;
      } else {
        if (this.m_bIsPlayingWithRed) this.m_GameStatus.style.color = this.COLOR_BLUE;else this.m_GameStatus.style.color = this.COLOR_RED;
      }

      if (sMessage !== null && sMessage !== '') this.Debug(sMessage, 0);else this.Debug('', 0);
    }
  }, {
    key: "OnMouseMove",
    value: function () {
      var _OnMouseMove = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18(event) {
        var _this12 = this;

        var x, y, tox, toy, p0, p1, line_contains_point, val, _p, _p2, fromx, fromy;

        return regeneratorRuntime.wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                if (!(!this.m_bIsPlayerActive || this.m_Player2Name.innerHTML === '???' || this.m_bHandlingEvent === true || this.iConnErrCount > 0)) {
                  _context18.next = 3;
                  break;
                }

                if (this.iConnErrCount <= 0 && !this.m_bIsPlayerActive) {
                  this.m_Screen.style.cursor = "wait";
                }

                return _context18.abrupt("return");

              case 3:
                x = (event ? event.clientX : window.event.clientX) - this.m_Screen.offsetLeft + this.f_scrollLeft() + 0.5 * this.m_iGridSizeX;
                y = (event ? event.clientY : window.event.clientY) - this.m_Screen.offsetTop + this.f_scrollTop() + 0.5 * this.m_iGridSizeY;
                x = parseInt(x / this.m_iGridSizeX);
                y = parseInt(y / this.m_iGridSizeY);
                tox = x * this.m_iGridSizeX;
                toy = y * this.m_iGridSizeY;

                if (this.CursorPos.x !== tox || this.CursorPos.y !== toy) {
                  this.m_MouseCursorOval.move(tox, toy, this.m_PointRadius);
                  this.m_MouseCursorOval.Show();
                  this.Debug("[".concat(x, ",").concat(y, "]"), 1);
                  this.CursorPos.x = tox;
                  this.CursorPos.y = toy;
                }

                if (!this.m_bDrawLines) {
                  _context18.next = 67;
                  break;
                }

                if (this.m_Line !== null) this.m_Screen.style.cursor = "move";else this.m_Screen.style.cursor = "crosshair";

                if (!(this.m_bMouseDown === true)) {
                  _context18.next = 65;
                  break;
                }

                if (!((this.m_iLastX !== x || this.m_iLastY !== y) && Math.abs(parseInt(this.m_iLastX - x)) <= 1 && Math.abs(parseInt(this.m_iLastY - y)) <= 1 && this.m_iLastX >= 0 && this.m_iLastY >= 0)) {
                  _context18.next = 65;
                  break;
                }

                if (!(this.m_Line !== null)) {
                  _context18.next = 58;
                  break;
                }

                _context18.next = 17;
                return this.m_Points.get(this.m_iLastY * this.m_iGridWidth + this.m_iLastX);

              case 17:
                p0 = _context18.sent;
                _context18.next = 20;
                return this.m_Points.get(y * this.m_iGridWidth + x);

              case 20:
                p1 = _context18.sent;
                this.m_CancelPath.disabled = this.m_Line.GetLength() >= 2 ? '' : 'disabled';

                if (!(p0 !== undefined && p1 !== undefined && p0.GetFillColor() === this.m_sDotColor && p1.GetFillColor() === this.m_sDotColor)) {
                  _context18.next = 56;
                  break;
                }

                line_contains_point = this.m_Line.ContainsPoint(tox, toy);

                if (!(line_contains_point < 1 && p1.GetStatus() !== StatusEnum.POINT_STARTING && true === this.m_Line.AppendPoints(tox, toy, this.m_iGridSizeX, this.m_iGridSizeY))) {
                  _context18.next = 30;
                  break;
                }

                p1.SetStatus(StatusEnum.POINT_IN_PATH, true);
                this.m_iLastX = x;
                this.m_iLastY = y;
                _context18.next = 56;
                break;

              case 30:
                if (!(line_contains_point === 1 && p1.GetStatus() === StatusEnum.POINT_STARTING && true === this.m_Line.AppendPoints(tox, toy, this.m_iGridSizeX, this.m_iGridSizeY))) {
                  _context18.next = 46;
                  break;
                }

                _context18.next = 33;
                return this.SurroundOponentPoints();

              case 33:
                val = _context18.sent;

                if (!(val.owned.length > 0)) {
                  _context18.next = 41;
                  break;
                }

                this.Debug('Closing path', 0);
                this.rAF_FrameID = null;
                _context18.next = 39;
                return this.SendAsyncData(this.CreateXMLPutPathRequest(val), /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17() {
                  return regeneratorRuntime.wrap(function _callee17$(_context17) {
                    while (1) {
                      switch (_context17.prev = _context17.next) {
                        case 0:
                          _context17.next = 2;
                          return _this12.OnCancelClick();

                        case 2:
                          val.OwnedPoints.forEach(function (revData) {
                            var p = revData.point;
                            var revertFillColor = revData.revertFillColor;
                            var revertStrokeColor = revData.revertStrokeColor;
                            p.RevertOldStatus();
                            p.SetFillColor(revertFillColor);
                            p.SetStrokeColor(revertStrokeColor);
                          });
                          _this12.m_bHandlingEvent = false;

                        case 4:
                        case "end":
                          return _context17.stop();
                      }
                    }
                  }, _callee17);
                })));

              case 39:
                _context18.next = 42;
                break;

              case 41:
                this.Debug("".concat(val.errorDesc ? val.errorDesc : 'Wrong path', ", cancell it or refresh page"), 0);

              case 42:
                this.m_iLastX = x;
                this.m_iLastY = y;
                _context18.next = 56;
                break;

              case 46:
                if (!(line_contains_point >= 1 && p0.GetStatus() === StatusEnum.POINT_IN_PATH && this.m_Line.GetPointsString().endsWith("".concat(this.m_iLastX * this.m_iGridSizeX, ",").concat(this.m_iLastY * this.m_iGridSizeY)))) {
                  _context18.next = 56;
                  break;
                }

                if (!(this.m_Line.GetLength() > 2)) {
                  _context18.next = 54;
                  break;
                }

                p0.RevertOldStatus();
                this.m_Line.RemoveLastPoint();
                this.m_iLastX = x;
                this.m_iLastY = y;
                _context18.next = 56;
                break;

              case 54:
                _context18.next = 56;
                return this.OnCancelClick();

              case 56:
                _context18.next = 65;
                break;

              case 58:
                _context18.next = 60;
                return this.m_Points.get(this.m_iLastY * this.m_iGridWidth + this.m_iLastX);

              case 60:
                _p = _context18.sent;
                _context18.next = 63;
                return this.m_Points.get(y * this.m_iGridWidth + x);

              case 63:
                _p2 = _context18.sent;

                if (_p !== undefined && _p2 !== undefined && _p.GetFillColor() === this.m_sDotColor && _p2.GetFillColor() === this.m_sDotColor) {
                  fromx = this.m_iLastX * this.m_iGridSizeX;
                  fromy = this.m_iLastY * this.m_iGridSizeY;
                  this.m_Line = this.SvgVml.CreatePolyline(6, fromx + "," + fromy + " " + tox + "," + toy, this.DRAWING_PATH_COLOR);
                  this.m_CancelPath.disabled = '';

                  _p.SetStatus(StatusEnum.POINT_STARTING, true);

                  _p2.SetStatus(StatusEnum.POINT_IN_PATH, true);

                  this.m_iLastX = x;
                  this.m_iLastY = y;
                }

              case 65:
                _context18.next = 68;
                break;

              case 67:
                this.m_Screen.style.cursor = "crosshair";

              case 68:
              case "end":
                return _context18.stop();
            }
          }
        }, _callee18, this);
      }));

      function OnMouseMove(_x25) {
        return _OnMouseMove.apply(this, arguments);
      }

      return OnMouseMove;
    }()
  }, {
    key: "OnMouseDown",
    value: function () {
      var _OnMouseDown = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee20(event) {
        var _this13 = this;

        var x, y, loc_x, loc_y, p0, p1, tox, toy, line_contains_point, val, _p3, _p4, fromx, fromy, _tox, _toy, _p5;

        return regeneratorRuntime.wrap(function _callee20$(_context20) {
          while (1) {
            switch (_context20.prev = _context20.next) {
              case 0:
                if (!(!this.m_bIsPlayerActive || this.m_Player2Name.innerHTML === '???' || this.m_bHandlingEvent === true || this.iConnErrCount > 0)) {
                  _context20.next = 2;
                  break;
                }

                return _context20.abrupt("return");

              case 2:
                x = (event ? event.clientX : window.event.clientX) - this.m_Screen.offsetLeft + this.f_scrollLeft() + 0.5 * this.m_iGridSizeX;
                y = (event ? event.clientY : window.event.clientY) - this.m_Screen.offsetTop + this.f_scrollTop() + 0.5 * this.m_iGridSizeY;
                x = this.m_iMouseX = parseInt(x / this.m_iGridSizeX);
                y = this.m_iMouseY = parseInt(y / this.m_iGridSizeY);
                this.m_bMouseDown = true;

                if (this.m_bDrawLines) {
                  _context20.next = 31;
                  break;
                }

                //points
                this.m_iLastX = x;
                this.m_iLastY = y;
                loc_x = x;
                loc_y = y;
                x = loc_x * this.m_iGridSizeX;
                y = loc_y * this.m_iGridSizeY;
                _context20.next = 16;
                return this.m_Points.get(loc_y * this.m_iGridWidth + loc_x);

              case 16:
                _context20.t0 = _context20.sent;
                _context20.t1 = undefined;

                if (!(_context20.t0 !== _context20.t1)) {
                  _context20.next = 21;
                  break;
                }

                this.Debug('Wrong point - already existing', 0);
                return _context20.abrupt("return");

              case 21:
                _context20.next = 23;
                return this.IsPointOutsideAllPaths(loc_x, loc_y);

              case 23:
                if (_context20.sent) {
                  _context20.next = 26;
                  break;
                }

                this.Debug('Wrong point, Point is not outside all paths', 0);
                return _context20.abrupt("return");

              case 26:
                this.rAF_FrameID = null;
                _context20.next = 29;
                return this.SendAsyncData(this.CreateXMLPutPointRequest(loc_x, loc_y), function () {
                  _this13.m_bMouseDown = false;
                  _this13.m_bHandlingEvent = false;
                });

              case 29:
                _context20.next = 94;
                break;

              case 31:
                if (!(
                /*this.m_bMouseDown === true && */
                (this.m_iLastX !== x || this.m_iLastY !== y) && Math.abs(parseInt(this.m_iLastX - x)) <= 1 && Math.abs(parseInt(this.m_iLastY - y)) <= 1 && this.m_iLastX >= 0 && this.m_iLastY >= 0)) {
                  _context20.next = 89;
                  break;
                }

                if (!(this.m_Line !== null)) {
                  _context20.next = 78;
                  break;
                }

                _context20.next = 35;
                return this.m_Points.get(this.m_iLastY * this.m_iGridWidth + this.m_iLastX);

              case 35:
                p0 = _context20.sent;
                _context20.next = 38;
                return this.m_Points.get(y * this.m_iGridWidth + x);

              case 38:
                p1 = _context20.sent;
                this.m_CancelPath.disabled = this.m_Line.GetLength() >= 2 ? '' : 'disabled';

                if (!(p0 !== undefined && p1 !== undefined && p0.GetFillColor() === this.m_sDotColor && p1.GetFillColor() === this.m_sDotColor)) {
                  _context20.next = 76;
                  break;
                }

                tox = x * this.m_iGridSizeX;
                toy = y * this.m_iGridSizeY;
                line_contains_point = this.m_Line.ContainsPoint(tox, toy);

                if (!(line_contains_point < 1 && p1.GetStatus() !== StatusEnum.POINT_STARTING && true === this.m_Line.AppendPoints(tox, toy, this.m_iGridSizeX, this.m_iGridSizeY))) {
                  _context20.next = 50;
                  break;
                }

                p1.SetStatus(StatusEnum.POINT_IN_PATH, true);
                this.m_iLastX = x;
                this.m_iLastY = y;
                _context20.next = 76;
                break;

              case 50:
                if (!(line_contains_point === 1 && p1.GetStatus() === StatusEnum.POINT_STARTING && true === this.m_Line.AppendPoints(tox, toy, this.m_iGridSizeX, this.m_iGridSizeY))) {
                  _context20.next = 66;
                  break;
                }

                _context20.next = 53;
                return this.SurroundOponentPoints();

              case 53:
                val = _context20.sent;

                if (!(val.owned.length > 0)) {
                  _context20.next = 61;
                  break;
                }

                this.Debug('Closing path', 0);
                this.rAF_FrameID = null;
                _context20.next = 59;
                return this.SendAsyncData(this.CreateXMLPutPathRequest(val), /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19() {
                  return regeneratorRuntime.wrap(function _callee19$(_context19) {
                    while (1) {
                      switch (_context19.prev = _context19.next) {
                        case 0:
                          _context19.next = 2;
                          return _this13.OnCancelClick();

                        case 2:
                          val.OwnedPoints.forEach(function (revData) {
                            var p = revData.point;
                            var revertFillColor = revData.revertFillColor;
                            var revertStrokeColor = revData.revertStrokeColor;
                            p.RevertOldStatus();
                            p.SetFillColor(revertFillColor);
                            p.SetStrokeColor(revertStrokeColor);
                          });
                          _this13.m_bMouseDown = false;
                          _this13.m_bHandlingEvent = false;

                        case 5:
                        case "end":
                          return _context19.stop();
                      }
                    }
                  }, _callee19);
                })));

              case 59:
                _context20.next = 62;
                break;

              case 61:
                this.Debug("".concat(val.errorDesc ? val.errorDesc : 'Wrong path', ", cancell it or refresh page"), 0);

              case 62:
                this.m_iLastX = x;
                this.m_iLastY = y;
                _context20.next = 76;
                break;

              case 66:
                if (!(line_contains_point >= 1 && p0.GetStatus() === StatusEnum.POINT_IN_PATH && this.m_Line.GetPointsString().endsWith("".concat(this.m_iLastX * this.m_iGridSizeX, ",").concat(this.m_iLastY * this.m_iGridSizeY)))) {
                  _context20.next = 76;
                  break;
                }

                if (!(this.m_Line.GetLength() > 2)) {
                  _context20.next = 74;
                  break;
                }

                p0.RevertOldStatus();
                this.m_Line.RemoveLastPoint();
                this.m_iLastX = x;
                this.m_iLastY = y;
                _context20.next = 76;
                break;

              case 74:
                _context20.next = 76;
                return this.OnCancelClick();

              case 76:
                _context20.next = 87;
                break;

              case 78:
                _context20.next = 80;
                return this.m_Points.get(this.m_iLastY * this.m_iGridWidth + this.m_iLastX);

              case 80:
                _p3 = _context20.sent;
                _context20.next = 83;
                return this.m_Points.get(y * this.m_iGridWidth + x);

              case 83:
                _p4 = _context20.sent;

                if (_p3 !== undefined && _p4 !== undefined && _p3.GetFillColor() === this.m_sDotColor && _p4.GetFillColor() === this.m_sDotColor) {
                  fromx = this.m_iLastX * this.m_iGridSizeX;
                  fromy = this.m_iLastY * this.m_iGridSizeY;
                  _tox = x * this.m_iGridSizeX;
                  _toy = y * this.m_iGridSizeY;
                  this.m_Line = this.SvgVml.CreatePolyline(6, fromx + "," + fromy + " " + _tox + "," + _toy, this.DRAWING_PATH_COLOR);
                  this.m_CancelPath.disabled = '';

                  _p3.SetStatus(StatusEnum.POINT_STARTING, true);

                  _p4.SetStatus(StatusEnum.POINT_IN_PATH, true);
                }

                this.m_iLastX = x;
                this.m_iLastY = y;

              case 87:
                _context20.next = 94;
                break;

              case 89:
                if (!(this.m_iLastX < 0 || this.m_iLastY < 0)) {
                  _context20.next = 94;
                  break;
                }

                _context20.next = 92;
                return this.m_Points.get(y * this.m_iGridWidth + x);

              case 92:
                _p5 = _context20.sent;

                if (_p5 !== undefined && _p5.GetFillColor() === this.m_sDotColor) {
                  this.m_iLastX = x;
                  this.m_iLastY = y;
                }

              case 94:
              case "end":
                return _context20.stop();
            }
          }
        }, _callee20, this);
      }));

      function OnMouseDown(_x26) {
        return _OnMouseDown.apply(this, arguments);
      }

      return OnMouseDown;
    }()
  }, {
    key: "OnMouseUp",
    value: function OnMouseUp() {
      this.m_bMouseDown = false;
    }
  }, {
    key: "OnMouseLeave",
    value: function OnMouseLeave() {
      this.m_MouseCursorOval.Hide();
    }
  }, {
    key: "OnStopAndDraw",
    value: function () {
      var _OnStopAndDraw = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee21(event) {
        var btn;
        return regeneratorRuntime.wrap(function _callee21$(_context21) {
          while (1) {
            switch (_context21.prev = _context21.next) {
              case 0:
                if (this.m_Timer) {
                  _context21.next = 11;
                  break;
                }

                if (!(this.m_Line !== null)) {
                  _context21.next = 4;
                  break;
                }

                _context21.next = 4;
                return this.OnCancelClick();

              case 4:
                this.m_bDrawLines = !this.m_bDrawLines;
                btn = event.target;
                if (!this.m_bDrawLines) btn.value = 'Draw line';else btn.value = 'Draw dot';
                this.m_iLastX = this.m_iLastY = -1;
                this.m_Line = null;
                _context21.next = 14;
                break;

              case 11:
                if (!(this.m_Line === null)) {
                  _context21.next = 14;
                  break;
                }

                _context21.next = 14;
                return this.SendAsyncData(new StopAndDrawCommand());

              case 14:
              case "end":
                return _context21.stop();
            }
          }
        }, _callee21, this);
      }));

      function OnStopAndDraw(_x27) {
        return _OnStopAndDraw.apply(this, arguments);
      }

      return OnStopAndDraw;
    }()
  }, {
    key: "OnCancelClick",
    value: function () {
      var _OnCancelClick = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee22() {
        var points, _iterator9, _step9, point, x, y, p0;

        return regeneratorRuntime.wrap(function _callee22$(_context22) {
          while (1) {
            switch (_context22.prev = _context22.next) {
              case 0:
                if (!this.m_bDrawLines) {
                  _context22.next = 33;
                  break;
                }

                if (!(this.m_Line !== null)) {
                  _context22.next = 30;
                  break;
                }

                points = this.m_Line.GetPointsArray();
                this.m_CancelPath.disabled = 'disabled';
                _iterator9 = _createForOfIteratorHelper(points);
                _context22.prev = 5;

                _iterator9.s();

              case 7:
                if ((_step9 = _iterator9.n()).done) {
                  _context22.next = 20;
                  break;
                }

                point = _step9.value;
                x = point.x, y = point.y;

                if (!(x === null || y === null)) {
                  _context22.next = 12;
                  break;
                }

                return _context22.abrupt("continue", 18);

              case 12:
                x /= this.m_iGridSizeX;
                y /= this.m_iGridSizeY;
                _context22.next = 16;
                return this.m_Points.get(y * this.m_iGridWidth + x);

              case 16:
                p0 = _context22.sent;

                if (p0 !== undefined) {
                  p0.RevertOldStatus();
                } else {//debugger;
                }

              case 18:
                _context22.next = 7;
                break;

              case 20:
                _context22.next = 25;
                break;

              case 22:
                _context22.prev = 22;
                _context22.t0 = _context22["catch"](5);

                _iterator9.e(_context22.t0);

              case 25:
                _context22.prev = 25;

                _iterator9.f();

                return _context22.finish(25);

              case 28:
                this.SvgVml.RemovePolyline(this.m_Line);
                this.m_Line = null;

              case 30:
                this.m_iLastX = this.m_iLastY = -1;
                if (this.m_Timer) this.m_StopAndDraw.disabled = 'disabled';
                this.Debug('', 0);

              case 33:
              case "end":
                return _context22.stop();
            }
          }
        }, _callee22, this, [[5, 22, 25, 28]]);
      }));

      function OnCancelClick() {
        return _OnCancelClick.apply(this, arguments);
      }

      return OnCancelClick;
    }()
    /**
     * Debug function
     * @param {string} sSelector2Set selector where to display output
     */

  }, {
    key: "CountPointsDebug",
    value: function CountPointsDebug(sSelector2Set) {
      //document.querySelector("div.user-panel.main input[z-index='-1']");
      var tags = [{
        query: "circle:not([z-index])",
        display: "circles: %s, "
      }, {
        query: "polyline",
        display: "lines: %s, "
      }, {
        query: "circle[data-status='2']",
        display: "intercepted(P1:%s, "
      }, {
        query: "circle[data-status='3']",
        display: "P2:%s)"
      }];
      var aggregated = "";
      tags.forEach(function (tag) {
        var cnt = document.querySelectorAll(tag.query);
        aggregated += tag.display.replace('%s', cnt.length);
      });
      document.querySelector(sSelector2Set).innerHTML = 'SVGs by tags: ' + aggregated;
    }
  }, {
    key: "OnTestBuildCurrentGraph",
    value: function () {
      var _OnTestBuildCurrentGraph = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee23(event) {
        return regeneratorRuntime.wrap(function _callee23$(_context23) {
          while (1) {
            switch (_context23.prev = _context23.next) {
              case 0:
                event.preventDefault();
                _context23.t0 = LocalLog;
                _context23.next = 4;
                return this.BuildGraph();

              case 4:
                _context23.t1 = _context23.sent;
                (0, _context23.t0)(_context23.t1);

              case 6:
              case "end":
                return _context23.stop();
            }
          }
        }, _callee23, this);
      }));

      function OnTestBuildCurrentGraph(_x28) {
        return _OnTestBuildCurrentGraph.apply(this, arguments);
      }

      return OnTestBuildCurrentGraph;
    }()
  }, {
    key: "OnTestConcaveman",
    value: function () {
      var _OnTestConcaveman = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee24(event) {
        var vertices;
        return regeneratorRuntime.wrap(function _callee24$(_context24) {
          while (1) {
            switch (_context24.prev = _context24.next) {
              case 0:
                event.preventDefault(); //LocalLog('OnTestConcaveman');

                _context24.next = 3;
                return this.BuildGraph();

              case 3:
                vertices = _context24.sent.vertices.map(function (pt) {
                  var pos = pt.GetPosition();
                  return [pos.x / this.m_iGridSizeX, pos.y / this.m_iGridSizeX];
                }.bind(this));

              case 4:
              case "end":
                return _context24.stop();
            }
          }
        }, _callee24, this);
      }));

      function OnTestConcaveman(_x29) {
        return _OnTestConcaveman.apply(this, arguments);
      }

      return OnTestConcaveman;
    }()
  }, {
    key: "OnTestMarkAllCycles",
    value: function () {
      var _OnTestMarkAllCycles = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee25(event) {
        return regeneratorRuntime.wrap(function _callee25$(_context25) {
          while (1) {
            switch (_context25.prev = _context25.next) {
              case 0:
                event.preventDefault(); //LocalLog('OnTestMarkAllCycles');

                _context25.t0 = LocalLog;
                _context25.t1 = this;
                _context25.next = 5;
                return this.BuildGraph({
                  visuals: true
                });

              case 5:
                _context25.t2 = _context25.sent;
                _context25.next = 8;
                return _context25.t1.MarkAllCycles.call(_context25.t1, _context25.t2);

              case 8:
                _context25.t3 = _context25.sent;
                (0, _context25.t0)(_context25.t3);

              case 10:
              case "end":
                return _context25.stop();
            }
          }
        }, _callee25, this);
      }));

      function OnTestMarkAllCycles(_x30) {
        return _OnTestMarkAllCycles.apply(this, arguments);
      }

      return OnTestMarkAllCycles;
    }()
  }, {
    key: "OnTestGroupPoints",
    value: function () {
      var _OnTestGroupPoints = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee26(event) {
        return regeneratorRuntime.wrap(function _callee26$(_context26) {
          while (1) {
            switch (_context26.prev = _context26.next) {
              case 0:
                event.preventDefault(); //LocalLog('OnTestGroupPoints');

                _context26.t0 = this.SvgVml;
                _context26.t1 = this;
                _context26.t2 = [];
                _context26.next = 6;
                return this.m_Points.get(9 * this.m_iGridWidth + 26);

              case 6:
                _context26.t3 = _context26.sent;
                _context26.next = 9;
                return _context26.t1.GroupPointsRecurse.call(_context26.t1, _context26.t2, _context26.t3);

              case 9:
                _context26.t4 = _context26.sent.map(function (fnd) {
                  var pt = fnd.GetPosition();
                  return pt.x + ',' + pt.y;
                }).join(' ');

                _context26.t0.CreatePolyline.call(_context26.t0, 6, _context26.t4, 'green');

                LocalLog("game.lastCycle = ".concat(this.lastCycle));

              case 12:
              case "end":
                return _context26.stop();
            }
          }
        }, _callee26, this);
      }));

      function OnTestGroupPoints(_x31) {
        return _OnTestGroupPoints.apply(this, arguments);
      }

      return OnTestGroupPoints;
    }()
  }, {
    key: "OnTestFindFullSurroundedPoints",
    value: function () {
      var _OnTestFindFullSurroundedPoints = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee27(event) {
        var sHumanColor, rand_color, _iterator10, _step10, pt, _pt$GetPosition2, view_x, view_y, x, y, pt1;

        return regeneratorRuntime.wrap(function _callee27$(_context27) {
          while (1) {
            switch (_context27.prev = _context27.next) {
              case 0:
                event.preventDefault();
                sHumanColor = this.COLOR_RED;
                rand_color = RandomColor();
                _context27.t0 = _createForOfIteratorHelper;
                _context27.next = 6;
                return this.m_Points.values();

              case 6:
                _context27.t1 = _context27.sent;
                _iterator10 = (0, _context27.t0)(_context27.t1);
                _context27.prev = 8;

                _iterator10.s();

              case 10:
                if ((_step10 = _iterator10.n()).done) {
                  _context27.next = 24;
                  break;
                }

                pt = _step10.value;

                if (!(pt !== undefined && pt.GetFillColor() === sHumanColor && StatusEnum.POINT_FREE_RED === pt.GetStatus())) {
                  _context27.next = 22;
                  break;
                }

                _pt$GetPosition2 = pt.GetPosition(), view_x = _pt$GetPosition2.x, view_y = _pt$GetPosition2.y;
                x = view_x / this.m_iGridSizeX, y = view_y / this.m_iGridSizeY;
                _context27.next = 17;
                return this.IsPointOutsideAllPaths(x, y);

              case 17:
                _context27.t2 = _context27.sent;

                if (!(false === _context27.t2)) {
                  _context27.next = 20;
                  break;
                }

                return _context27.abrupt("continue", 22);

              case 20:
                //const east = this.m_Points.get(y * this.m_iGridWidth + x + 1);
                //const west = this.m_Points.get(y * this.m_iGridWidth + x - 1);
                //const north = this.m_Points.get((y - 1) * this.m_iGridWidth + x);
                //const south = this.m_Points.get((y + 1) * this.m_iGridWidth + x);
                //const north_west = this.m_Points.get((y - 1) * this.m_iGridWidth + x - 1);
                //const north_east = this.m_Points.get((y - 1) * this.m_iGridWidth + x + 1);
                //const south_west = this.m_Points.get((y + 1) * this.m_iGridWidth + x - 1);
                //const south_east = this.m_Points.get((y + 1) * this.m_iGridWidth + x + 1);
                //if (east !== undefined && west !== undefined && north !== undefined && south !== undefined
                //	//&& east.GetFillColor() === sCPUColor &&
                //	//west.GetFillColor() === sCPUColor &&
                //	//north.GetFillColor() === sCPUColor &&
                //	//south.GetFillColor() === sCPUColor
                //) {
                //visualise
                pt1 = document.querySelector("svg > circle[cx=\"".concat(view_x, "\"][cy=\"").concat(view_y, "\"]"));

                if (pt1) {
                  pt1.SetStrokeColor(rand_color);
                  pt1.SetFillColor(rand_color);
                  pt1.setAttribute("r", "6");
                } //}


              case 22:
                _context27.next = 10;
                break;

              case 24:
                _context27.next = 29;
                break;

              case 26:
                _context27.prev = 26;
                _context27.t3 = _context27["catch"](8);

                _iterator10.e(_context27.t3);

              case 29:
                _context27.prev = 29;

                _iterator10.f();

                return _context27.finish(29);

              case 32:
              case "end":
                return _context27.stop();
            }
          }
        }, _callee27, this, [[8, 26, 29, 32]]);
      }));

      function OnTestFindFullSurroundedPoints(_x32) {
        return _OnTestFindFullSurroundedPoints.apply(this, arguments);
      }

      return OnTestFindFullSurroundedPoints;
    }()
  }, {
    key: "OnTestWorkerify",
    value: function () {
      var _OnTestWorkerify = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee30(event) {
        var addNums;
        return regeneratorRuntime.wrap(function _callee30$(_context30) {
          while (1) {
            switch (_context30.prev = _context30.next) {
              case 0:
                event.preventDefault();

                addNums = /*#__PURE__*/function () {
                  var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee29(params) {
                    var svgVml, lines, points, stateStore, ai, graph;
                    return regeneratorRuntime.wrap(function _callee29$(_context29) {
                      while (1) {
                        switch (_context29.prev = _context29.next) {
                          case 0:
                            params.state.bPointsAndPathsLoaded = false; // eslint-disable-next-line no-undef

                            svgVml = new SvgVml();
                            svgVml.CreateSVGVML(null, null, null, true);
                            // eslint-disable-next-line no-undef
                            stateStore = new GameStateStore(true, function CreateScreenPointFromIndexedDb(iX, iY, iStatus, sColor) {
                              var x = iX * params.state.iGridSizeX;
                              var y = iY * params.state.iGridSizeY;
                              var oval = svgVml.CreateOval(3);
                              oval.move(x, y, 3);
                              var color;

                              switch (iStatus) {
                                case StatusEnum.POINT_FREE_RED:
                                  color = 'red';
                                  oval.SetStatus(iStatus
                                  /*StatusEnum.POINT_FREE*/
                                  );
                                  break;

                                case StatusEnum.POINT_FREE_BLUE:
                                  color = 'blue';
                                  oval.SetStatus(iStatus
                                  /*StatusEnum.POINT_FREE*/
                                  );
                                  break;

                                case StatusEnum.POINT_FREE:
                                  color = 'red';
                                  oval.SetStatus(iStatus
                                  /*StatusEnum.POINT_FREE*/
                                  ); //console.warn('TODO: generic FREE point, really? change it!');

                                  break;

                                case StatusEnum.POINT_STARTING:
                                  color = 'red';
                                  oval.SetStatus(iStatus);
                                  break;

                                case StatusEnum.POINT_IN_PATH:
                                  //if (this.g_iPlayerID === iPlayerId)//bPlayingWithRed
                                  //	color = this.m_bIsPlayingWithRed === true ? this.COLOR_RED : this.COLOR_BLUE;
                                  //else
                                  //	color = this.m_bIsPlayingWithRed === true ? this.COLOR_BLUE : this.COLOR_RED;
                                  color = sColor;
                                  oval.SetStatus(iStatus);
                                  break;

                                case StatusEnum.POINT_OWNED_BY_RED:
                                  color = '#DC143C';
                                  oval.SetStatus(iStatus);
                                  break;

                                case StatusEnum.POINT_OWNED_BY_BLUE:
                                  color = '#8A2BE2';
                                  oval.SetStatus(iStatus);
                                  break;

                                default:
                                  alert('bad point');
                                  break;
                              }

                              oval.SetFillColor(color);
                              oval.SetStrokeColor(color);
                              return oval;
                            }, /*#__PURE__*/function () {
                              var _CreateScreenPathFromIndexedDb2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee28(packed, sColor, iPathId) {
                                var sPoints, sDelimiter, sPathPoints, p, x, y, status, _iterator11, _step11, pair, line;

                                return regeneratorRuntime.wrap(function _callee28$(_context28) {
                                  while (1) {
                                    switch (_context28.prev = _context28.next) {
                                      case 0:
                                        sPoints = packed.split(" ");
                                        sDelimiter = "", sPathPoints = "", p = null, status = StatusEnum.POINT_STARTING;
                                        _iterator11 = _createForOfIteratorHelper(sPoints);
                                        _context28.prev = 3;

                                        _iterator11.s();

                                      case 5:
                                        if ((_step11 = _iterator11.n()).done) {
                                          _context28.next = 20;
                                          break;
                                        }

                                        pair = _step11.value;
                                        p = pair.split(",");
                                        x = parseInt(p[0]);
                                        y = parseInt(p[1]);
                                        _context28.next = 12;
                                        return points.get(y * params.state.iGridWidth + x);

                                      case 12:
                                        p = _context28.sent;

                                        if (p !== null && p !== undefined) {
                                          p.SetStatus(status);
                                          status = StatusEnum.POINT_IN_PATH;
                                        }

                                        x *= params.state.m_iGridSizeX;
                                        y *= params.state.m_iGridSizeY;
                                        sPathPoints += "".concat(sDelimiter).concat(x, ",").concat(y);
                                        sDelimiter = " ";

                                      case 18:
                                        _context28.next = 5;
                                        break;

                                      case 20:
                                        _context28.next = 25;
                                        break;

                                      case 22:
                                        _context28.prev = 22;
                                        _context28.t0 = _context28["catch"](3);

                                        _iterator11.e(_context28.t0);

                                      case 25:
                                        _context28.prev = 25;

                                        _iterator11.f();

                                        return _context28.finish(25);

                                      case 28:
                                        p = sPoints[0].split(",");
                                        x = parseInt(p[0]);
                                        y = parseInt(p[1]);
                                        _context28.next = 33;
                                        return points.get(y * params.state.iGridWidth + x);

                                      case 33:
                                        p = _context28.sent;

                                        if (p !== null && p !== undefined) {
                                          p.SetStatus(status);
                                        }

                                        x *= params.state.m_iGridSizeX;
                                        y *= params.state.m_iGridSizeY;
                                        sPathPoints += "".concat(sDelimiter).concat(x, ",").concat(y);
                                        line = svgVml.CreatePolyline(3, sPathPoints, sColor);
                                        line.SetID(iPathId);
                                        return _context28.abrupt("return", line);

                                      case 41:
                                      case "end":
                                        return _context28.stop();
                                    }
                                  }
                                }, _callee28, null, [[3, 22, 25, 28]]);
                              }));

                              function CreateScreenPathFromIndexedDb(_x35, _x36, _x37) {
                                return _CreateScreenPathFromIndexedDb2.apply(this, arguments);
                              }

                              return CreateScreenPathFromIndexedDb;
                            }(), function GetGameStateForIndexedDb() {
                              return params.state;
                            }, LocalLog, LocalError);
                            lines = stateStore.GetPathStore();
                            points = stateStore.GetPointStore();
                            _context29.next = 8;
                            return stateStore.PrepareStore();

                          case 8:
                            _context29.t0 = LocalLog;
                            _context29.t2 = "lines.count = ";
                            _context29.next = 12;
                            return lines.count();

                          case 12:
                            _context29.t3 = _context29.sent;
                            _context29.t1 = _context29.t2.concat.call(_context29.t2, _context29.t3, ", points.count = ");
                            _context29.next = 16;
                            return points.count();

                          case 16:
                            _context29.t4 = _context29.sent;
                            _context29.t5 = _context29.t1.concat.call(_context29.t1, _context29.t4);
                            (0, _context29.t0)(_context29.t5);
                            debugger; // eslint-disable-next-line no-undef

                            ai = new h(params.state.iGridWidth, params.state.iGridHeight, params.state.iGridSizeX, params.state.iGridSizeY, points, StatusEnum.POINT_STARTING, StatusEnum.POINT_IN_PATH);
                            _context29.next = 23;
                            return ai.BuildGraph({
                              freePointStatus: StatusEnum.POINT_FREE_BLUE,
                              fillCol: 'blue',
                              visuals: false
                            });

                          case 23:
                            graph = _context29.sent;
                            LocalLog(graph);
                            return _context29.abrupt("return", "blah");

                          case 26:
                          case "end":
                            return _context29.stop();
                        }
                      }
                    }, _callee29);
                  }));

                  return function addNums(_x34) {
                    return _ref8.apply(this, arguments);
                  };
                }(); // Let the worker execute the above function, with the specified arguments and context

                /*const result = await addNums.callAsWorker(
                	//context
                	[LocalLog, LocalError, `const StatusEnum = Object.freeze({
                POINT_FREE_RED: -3,
                POINT_FREE_BLUE: -2,
                POINT_FREE: -1,
                POINT_STARTING: 0,
                POINT_IN_PATH: 1,
                POINT_OWNED_BY_RED: 2,
                POINT_OWNED_BY_BLUE: 3
                });`,
                		//SVG.CreateOval, SVG.CreatePolyline, SVG.RemovePolyline, SVG.CreateSVGVML, SVG.CreateLine, SVG.hasDuplicates, SVG.sortPointsClockwise,
                		SVG.SvgVml, SVG.GameStateStore,
                		AIBundle.GraphAI
                	],
                	//parameters
                	{
                		state: this.GetGameStateForIndexedDb()
                	}
                );
                LocalLog('result: ' + result);*/


                if (!this.wrk) this.wrk = new Worker('../js/AIWorkerBundle.js' //, { type: 'module' }
                );

                this.wrk.onmessage = function (e) {
                  var data = e.data;
                  LocalLog('Message received from worker ' + data); //this.wrk.terminate();
                };

                this.wrk.postMessage({
                  state: this.GetGameStateForIndexedDb()
                });

              case 5:
              case "end":
                return _context30.stop();
            }
          }
        }, _callee30, this);
      }));

      function OnTestWorkerify(_x33) {
        return _OnTestWorkerify.apply(this, arguments);
      }

      return OnTestWorkerify;
    }()
    /**
     * Start drawing routines
     * @param {HTMLElement} sScreen screen dontainer selector
     * @param {HTMLElement} sPlayer2Name displaying element selector
     * @param {HTMLElement} sGameStatus game stat element selector
     * @param {HTMLElement} sSurrenderButton surrender button element selector
     * @param {HTMLElement} sCancelPath cancel path button element selector
     * @param {HTMLElement} sPause pause button element selector
     * @param {HTMLElement} sStopAndDraw stop-and-draw action button element selector
     * @param {string} sMsgInputSel input textbox html element selector
     * @param {string} sMsgListSel ul html element selector
     * @param {string} sMsgSendButtonSel input button html element selector
     * @param {string} sLastMoveGameTimeStamp is last game move timestamp date (in UTC and ISO-8601 format)
     * @param {boolean} useIndexedDbStore indicates whether to use IndexedDb point and path Store
     * @param {string} version is semVer string of main module (for IndexedDb DB version)
     * @param {Array} ddlTestActions array of test actions button ids
     * @param {number} iTooLong2Duration how long waiting is too long
     */

  }, {
    key: "PrepareDrawing",
    value: function () {
      var _PrepareDrawing = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee31(sScreen, sPlayer2Name, sGameStatus, sSurrenderButton, sCancelPath, sPause, sStopAndDraw, sMsgInputSel, sMsgListSel, sMsgSendButtonSel, sLastMoveGameTimeStamp, useIndexedDbStore, version, ddlTestActions) {
        var iTooLong2Duration,
            boardsize,
            iClientWidth,
            iClientHeight,
            svg_width_x_height,
            stateStore,
            i,
            chatSection,
            _args31 = arguments;
        return regeneratorRuntime.wrap(function _callee31$(_context31) {
          while (1) {
            switch (_context31.prev = _context31.next) {
              case 0:
                iTooLong2Duration = _args31.length > 14 && _args31[14] !== undefined ? _args31[14] : 125;
                this.m_bIsWon = false;
                this.m_iDelayBetweenMultiCaptures = 4000;
                this.m_iTooLong2Duration = iTooLong2Duration
                /*125*/
                ;
                this.m_Timer = null;
                this.m_WaitStartTime = null;
                this.m_iSlowdownLevel = 0;
                this.m_iLastX = -1;
                this.m_iLastY = -1;
                this.m_iMouseX = 0;
                this.m_iMouseY = 0;
                this.m_iPosX = 0;
                this.m_iPosY = 0;
                this.m_bMouseDown = false;
                this.m_bHandlingEvent = false;
                this.m_bDrawLines = !true;
                this.m_sMessage = '';
                this.m_sDotColor = this.m_bIsPlayingWithRed ? this.COLOR_RED : this.COLOR_BLUE;
                this.m_Line = null;
                this.m_Debug = document.getElementById('debug0');
                this.m_Player2Name = document.querySelector(sPlayer2Name);
                this.m_GameStatus = document.querySelector(sGameStatus);
                this.m_SurrenderButton = document.querySelector(sSurrenderButton);
                this.m_CancelPath = document.querySelector(sCancelPath);
                this.m_StopAndDraw = document.querySelector(sStopAndDraw);
                this.m_sMsgInputSel = sMsgInputSel;
                this.m_sMsgListSel = sMsgListSel;
                this.m_sMsgSendButtonSel = sMsgSendButtonSel;
                this.m_Screen = document.querySelector(sScreen);

                if (this.m_Screen) {
                  _context31.next = 32;
                  break;
                }

                alert("no board");
                return _context31.abrupt("return");

              case 32:
                this.m_iPosX = this.m_Screen.offsetLeft;
                this.m_iPosY = this.m_Screen.offsetTop;
                boardsize = Array.from(this.m_Screen.classList).find(function (x) {
                  return x.startsWith('boardsize');
                }).split('-')[1].split('x');
                this.m_BoardSize = {
                  width: parseInt(boardsize[0]),
                  height: parseInt(boardsize[1])
                };
                iClientWidth = this.m_Screen.clientWidth;
                iClientHeight = this.m_Screen.clientHeight;
                svg_width_x_height = null;

                if (iClientHeight <= 0) {
                  //no styles loaded case, emulating calculation with 16px font size
                  iClientHeight = 16 * this.m_BoardSize.height;
                  this.m_Screen.style.height = iClientHeight + 'px';
                  svg_width_x_height = "100%";
                }

                this.m_iGridSizeX = parseInt(Math.ceil(iClientWidth / this.m_BoardSize.width));
                this.m_iGridSizeY = parseInt(Math.ceil(iClientHeight / this.m_BoardSize.height));
                this.m_iGridWidth = parseInt(Math.ceil(iClientWidth / this.m_iGridSizeX));
                this.m_iGridHeight = parseInt(Math.ceil(iClientHeight / this.m_iGridSizeY));
                this.m_sLastMoveGameTimeStamp = sLastMoveGameTimeStamp; ///////CpuGame variables start//////

                this.rAF_StartTimestamp = null;
                this.rAF_FrameID = null;
                this.lastCycle = []; ///////CpuGame variables end//////

                this.SvgVml = new SVG.SvgVml();
                if (this.SvgVml.CreateSVGVML(this.m_Screen, svg_width_x_height, svg_width_x_height, true) === null) alert('SVG is not supported!');
                this.DisableSelection(this.m_Screen);
                stateStore = new SVG.GameStateStore(useIndexedDbStore, this.CreateScreenPointFromIndexedDb.bind(this), this.CreateScreenPathFromIndexedDb.bind(this), this.GetGameStateForIndexedDb.bind(this), LocalLog, LocalError, version);
                this.m_Lines = stateStore.GetPathStore();
                this.m_Points = stateStore.GetPointStore();
                _context31.next = 56;
                return stateStore.PrepareStore();

              case 56:
                this.m_bPointsAndPathsLoaded = _context31.sent;

                if (this.m_bViewOnly === false) {
                  if (this.m_MouseCursorOval === null) {
                    this.m_MouseCursorOval = this.SvgVml.CreateOval(this.m_PointRadius);
                    this.m_MouseCursorOval.SetFillColor(this.m_sDotColor);
                    this.m_MouseCursorOval.SetStrokeColor(this.m_sDotColor);
                    this.m_MouseCursorOval.SetZIndex(-1);
                    this.m_MouseCursorOval.Hide();
                  }

                  this.m_Screen.onmousedown = this.OnMouseDown.bind(this);
                  this.m_Screen.onmousemove = this.OnMouseMove.bind(this);
                  this.m_Screen.onmouseup = this.OnMouseUp.bind(this);
                  this.m_Screen.onmouseleave = this.OnMouseLeave.bind(this);
                  this.m_CancelPath.onclick = this.OnCancelClick.bind(this);
                  this.m_StopAndDraw.onclick = this.OnStopAndDraw.bind(this);

                  if (false === this.m_bIsCPUGame) {
                    document.querySelector(this.m_sMsgInputSel).disabled = '';
                    document.getElementById('testArea').textContent = '';
                  } else {
                    i = 0;
                    if (ddlTestActions.length > i) document.querySelector(ddlTestActions[i++]).onclick = this.OnTestBuildCurrentGraph.bind(this);
                    if (ddlTestActions.length > i) document.querySelector(ddlTestActions[i++]).onclick = this.OnTestConcaveman.bind(this);
                    if (ddlTestActions.length > i) document.querySelector(ddlTestActions[i++]).onclick = this.OnTestMarkAllCycles.bind(this);
                    if (ddlTestActions.length > i) document.querySelector(ddlTestActions[i++]).onclick = this.OnTestGroupPoints.bind(this);
                    if (ddlTestActions.length > i) document.querySelector(ddlTestActions[i++]).onclick = this.OnTestFindFullSurroundedPoints.bind(this);
                    if (ddlTestActions.length > i) document.querySelector(ddlTestActions[i++]).onclick = this.OnTestWorkerify.bind(this); //disable or even delete chat functionality, coz we're not going to chat with CPU bot

                    chatSection = document.getElementById('chatSection');

                    while (chatSection.lastElementChild) {
                      chatSection.removeChild(chatSection.lastElementChild);
                    } //if (!this.m_bIsPlayerActive)
                    //	this.StartCPUCalculation();

                  }

                  this.m_SurrenderButton.disabled = '';

                  if (this.m_Player2Name.innerHTML === '???') {
                    this.ShowMobileStatus('Waiting for other player to connect');
                    this.m_Screen.style.cursor = "wait";
                  } else {
                    this.m_SurrenderButton.value = 'surrender';

                    if (this.m_bIsPlayerActive) {
                      this.ShowMobileStatus('Your move');
                      this.m_Screen.style.cursor = "crosshair";
                      this.m_StopAndDraw.disabled = '';
                    } else {
                      this.ShowMobileStatus('Waiting for oponent move');
                      this.m_Screen.style.cursor = "wait";
                    }

                    if (!this.m_bDrawLines) this.m_StopAndDraw.value = 'Draw line';else this.m_StopAndDraw.value = 'Draw dot';
                  }
                } else {
                  document.querySelector(sPause).innerHTML = 'back to Game List';
                }

              case 58:
              case "end":
                return _context31.stop();
            }
          }
        }, _callee31, this);
      }));

      function PrepareDrawing(_x38, _x39, _x40, _x41, _x42, _x43, _x44, _x45, _x46, _x47, _x48, _x49, _x50, _x51) {
        return _PrepareDrawing.apply(this, arguments);
      }

      return PrepareDrawing;
    }() ///////CpuGame variables methods start//////

    /**
     * Gets random number in range: min(inclusive) - max (exclusive)
     * @param {any} min - from(inclusive)
     * @param {any} max - to (exclusive)
     * @returns {integer} random numba
     */

  }, {
    key: "GetRandomInt",
    value: function GetRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    }
  }, {
    key: "FindRandomCPUPoint",
    value: function () {
      var _FindRandomCPUPoint = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee32() {
        var max_random_pick_amount, x, y, cmd;
        return regeneratorRuntime.wrap(function _callee32$(_context32) {
          while (1) {
            switch (_context32.prev = _context32.next) {
              case 0:
                max_random_pick_amount = 100;

              case 1:
                if (!(--max_random_pick_amount > 0)) {
                  _context32.next = 15;
                  break;
                }

                x = this.GetRandomInt(0, this.m_iGridWidth);
                y = this.GetRandomInt(0, this.m_iGridHeight);
                _context32.next = 6;
                return this.m_Points.has(y * this.m_iGridWidth + x);

              case 6:
                _context32.t0 = !_context32.sent;

                if (!_context32.t0) {
                  _context32.next = 11;
                  break;
                }

                _context32.next = 10;
                return this.IsPointOutsideAllPaths(x, y);

              case 10:
                _context32.t0 = _context32.sent;

              case 11:
                if (!_context32.t0) {
                  _context32.next = 13;
                  break;
                }

                return _context32.abrupt("break", 15);

              case 13:
                _context32.next = 1;
                break;

              case 15:
                cmd = new InkBallPointViewModel(0, this.g_iGameID, -1
                /*player*/
                , x, y, StatusEnum.POINT_FREE_BLUE, 0);
                return _context32.abrupt("return", cmd);

              case 17:
              case "end":
                return _context32.stop();
            }
          }
        }, _callee32, this);
      }));

      function FindRandomCPUPoint() {
        return _FindRandomCPUPoint.apply(this, arguments);
      }

      return FindRandomCPUPoint;
    }()
  }, {
    key: "CalculateCPUCentroid",
    value: function () {
      var _CalculateCPUCentroid = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee33() {
        var centroidX, centroidY, count, x, y, sHumanColor, _iterator12, _step12, _pt, pos, tox, toy, max_random_pick_amount, pt;

        return regeneratorRuntime.wrap(function _callee33$(_context33) {
          while (1) {
            switch (_context33.prev = _context33.next) {
              case 0:
                centroidX = 0, centroidY = 0, count = 0;
                sHumanColor = this.COLOR_RED;
                _context33.t0 = _createForOfIteratorHelper;
                _context33.next = 5;
                return this.m_Points.values();

              case 5:
                _context33.t1 = _context33.sent;
                _iterator12 = (0, _context33.t0)(_context33.t1);

                try {
                  for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
                    _pt = _step12.value;

                    if (_pt !== undefined && _pt.GetFillColor() === sHumanColor && _pt.GetStatus() === StatusEnum.POINT_FREE_RED) {
                      pos = _pt.GetPosition();
                      x = pos.x;
                      y = pos.y;
                      x /= this.m_iGridSizeX;
                      y /= this.m_iGridSizeY;
                      centroidX += x;
                      centroidY += y;
                      count++;
                    }
                  }
                } catch (err) {
                  _iterator12.e(err);
                } finally {
                  _iterator12.f();
                }

                if (!(count <= 0)) {
                  _context33.next = 10;
                  break;
                }

                return _context33.abrupt("return", null);

              case 10:
                x = centroidX / count;
                y = centroidY / count;
                x = x * this.m_iGridSizeX;
                y = y * this.m_iGridSizeY;
                tox = parseInt(x / this.m_iGridSizeX);
                toy = parseInt(y / this.m_iGridSizeY);
                x = tox;
                y = toy;
                max_random_pick_amount = 20;

              case 19:
                if (!(--max_random_pick_amount > 0)) {
                  _context33.next = 31;
                  break;
                }

                _context33.t2 = !this.m_Points.has(y * this.m_iGridWidth + x);

                if (!_context33.t2) {
                  _context33.next = 25;
                  break;
                }

                _context33.next = 24;
                return this.IsPointOutsideAllPaths(x, y);

              case 24:
                _context33.t2 = _context33.sent;

              case 25:
                if (!_context33.t2) {
                  _context33.next = 27;
                  break;
                }

                return _context33.abrupt("break", 31);

              case 27:
                x = this.GetRandomInt(tox - 2, tox + 3);
                y = this.GetRandomInt(toy - 2, toy + 3);
                _context33.next = 19;
                break;

              case 31:
                if (!(max_random_pick_amount <= 0)) {
                  _context33.next = 33;
                  break;
                }

                return _context33.abrupt("return", null);

              case 33:
                pt = new InkBallPointViewModel(0, this.g_iGameID, -1
                /*player*/
                , x, y, StatusEnum.POINT_FREE_BLUE, 0);
                return _context33.abrupt("return", pt);

              case 35:
              case "end":
                return _context33.stop();
            }
          }
        }, _callee33, this);
      }));

      function CalculateCPUCentroid() {
        return _CalculateCPUCentroid.apply(this, arguments);
      }

      return CalculateCPUCentroid;
    }()
  }, {
    key: "BuildGraph",
    value: function () {
      var _BuildGraph = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee35() {
        var _ref9,
            _ref9$freeStat,
            freePointStatus,
            _ref9$fillCol,
            fillColor,
            _ref9$visuals,
            presentVisually,
            graph_points,
            graph_edges,
            isPointOKForPath,
            addPointsAndEdgestoGraph,
            _iterator13,
            _step13,
            point,
            _point$GetPosition,
            view_x,
            view_y,
            x,
            y,
            _args35 = arguments;

        return regeneratorRuntime.wrap(function _callee35$(_context35) {
          while (1) {
            switch (_context35.prev = _context35.next) {
              case 0:
                _ref9 = _args35.length > 0 && _args35[0] !== undefined ? _args35[0] : {}, _ref9$freeStat = _ref9.freeStat, freePointStatus = _ref9$freeStat === void 0 ? StatusEnum.POINT_FREE_BLUE : _ref9$freeStat, _ref9$fillCol = _ref9.fillCol, fillColor = _ref9$fillCol === void 0 ? this.COLOR_BLUE : _ref9$fillCol, _ref9$visuals = _ref9.visuals, presentVisually = _ref9$visuals === void 0 ? true : _ref9$visuals;
                graph_points = [], graph_edges = new Map();

                isPointOKForPath = function isPointOKForPath(freePointStatusArr, pt) {
                  var status = pt.GetStatus();
                  if (freePointStatusArr.includes(status) && pt.GetFillColor() === fillColor) return true;
                  return false;
                };

                addPointsAndEdgestoGraph = /*#__PURE__*/function () {
                  var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee34(point, to_x, to_y, view_x, view_y, x, y) {
                    var next, next_pos, edge, line, pt, _pt2;

                    return regeneratorRuntime.wrap(function _callee34$(_context34) {
                      while (1) {
                        switch (_context34.prev = _context34.next) {
                          case 0:
                            if (!(to_x >= 0 && to_x < this.m_iGridWidth && to_y >= 0 && to_y < this.m_iGridHeight)) {
                              _context34.next = 5;
                              break;
                            }

                            _context34.next = 3;
                            return this.m_Points.get(to_y * this.m_iGridWidth + to_x);

                          case 3:
                            next = _context34.sent;

                            if (next && isPointOKForPath([freePointStatus], next) === true) {
                              next_pos = next.GetPosition(); //const to_x = next_pos.x / this.m_iGridSizeX, to_y = next_pos.y / this.m_iGridSizeY;

                              if (graph_edges.has("".concat(x, ",").concat(y, "_").concat(to_x, ",").concat(to_y)) === false && graph_edges.has("".concat(to_x, ",").concat(to_y, "_").concat(x, ",").concat(y)) === false) {
                                edge = {
                                  from: point,
                                  to: next
                                };

                                if (presentVisually === true) {
                                  line = this.SvgVml.CreateLine(3, 'rgba(0, 255, 0, 0.3)');
                                  line.move(view_x, view_y, next_pos.x, next_pos.y);
                                  edge.line = line;
                                }

                                graph_edges.set("".concat(x, ",").concat(y, "_").concat(to_x, ",").concat(to_y), edge);

                                if (graph_points.includes(point) === false) {
                                  point.adjacents = [next];
                                  graph_points.push(point);
                                } else {
                                  pt = graph_points.find(function (x) {
                                    return x === point;
                                  });
                                  pt.adjacents.push(next);
                                }

                                if (graph_points.includes(next) === false) {
                                  next.adjacents = [point];
                                  graph_points.push(next);
                                } else {
                                  _pt2 = graph_points.find(function (x) {
                                    return x === next;
                                  });

                                  _pt2.adjacents.push(point);
                                }
                              }
                            }

                          case 5:
                          case "end":
                            return _context34.stop();
                        }
                      }
                    }, _callee34, this);
                  }));

                  return function (_x52, _x53, _x54, _x55, _x56, _x57, _x58) {
                    return _ref10.apply(this, arguments);
                  };
                }().bind(this);

                _context35.t0 = _createForOfIteratorHelper;
                _context35.next = 7;
                return this.m_Points.values();

              case 7:
                _context35.t1 = _context35.sent;
                _iterator13 = (0, _context35.t0)(_context35.t1);
                _context35.prev = 9;

                _iterator13.s();

              case 11:
                if ((_step13 = _iterator13.n()).done) {
                  _context35.next = 34;
                  break;
                }

                point = _step13.value;

                if (!(point && isPointOKForPath([freePointStatus, StatusEnum.POINT_STARTING, StatusEnum.POINT_IN_PATH], point) === true)) {
                  _context35.next = 32;
                  break;
                }

                _point$GetPosition = point.GetPosition(), view_x = _point$GetPosition.x, view_y = _point$GetPosition.y;
                x = view_x / this.m_iGridSizeX, y = view_y / this.m_iGridSizeY; //TODO: await all below promises
                //east

                _context35.next = 18;
                return addPointsAndEdgestoGraph(point, x + 1, y, view_x, view_y, x, y);

              case 18:
                _context35.next = 20;
                return addPointsAndEdgestoGraph(point, x - 1, y, view_x, view_y, x, y);

              case 20:
                _context35.next = 22;
                return addPointsAndEdgestoGraph(point, x, y - 1, view_x, view_y, x, y);

              case 22:
                _context35.next = 24;
                return addPointsAndEdgestoGraph(point, x, y + 1, view_x, view_y, x, y);

              case 24:
                _context35.next = 26;
                return addPointsAndEdgestoGraph(point, x - 1, y - 1, view_x, view_y, x, y);

              case 26:
                _context35.next = 28;
                return addPointsAndEdgestoGraph(point, x + 1, y - 1, view_x, view_y, x, y);

              case 28:
                _context35.next = 30;
                return addPointsAndEdgestoGraph(point, x - 1, y + 1, view_x, view_y, x, y);

              case 30:
                _context35.next = 32;
                return addPointsAndEdgestoGraph(point, x + 1, y + 1, view_x, view_y, x, y);

              case 32:
                _context35.next = 11;
                break;

              case 34:
                _context35.next = 39;
                break;

              case 36:
                _context35.prev = 36;
                _context35.t2 = _context35["catch"](9);

                _iterator13.e(_context35.t2);

              case 39:
                _context35.prev = 39;

                _iterator13.f();

                return _context35.finish(39);

              case 42:
                return _context35.abrupt("return", {
                  vertices: graph_points,
                  edges: Array.from(graph_edges.values())
                });

              case 43:
              case "end":
                return _context35.stop();
            }
          }
        }, _callee35, this, [[9, 36, 39, 42]]);
      }));

      function BuildGraph() {
        return _BuildGraph.apply(this, arguments);
      }

      return BuildGraph;
    }() // Returns true if the graph contains a cycle, else false. 

  }, {
    key: "IsGraphCyclic",
    value: function IsGraphCyclic(graph) {
      var vertices = graph.vertices;

      var isCyclicUtil = function (v, parent) {
        // Mark the current node as visited 
        v.visited = true; // Recur for all the vertices  
        // adjacent to this vertex

        var _iterator14 = _createForOfIteratorHelper(v.adjacents),
            _step14;

        try {
          for (_iterator14.s(); !(_step14 = _iterator14.n()).done;) {
            var i = _step14.value;

            // If an adjacent is not visited,  
            // then recur for that adjacent 
            if (!i.visited) {
              if (isCyclicUtil(i, v)) return true;
            } // If an adjacent is visited and  
            // not parent of current vertex, 
            // then there is a cycle. 
            else if (i !== parent) {
                var _i$GetPosition = i.GetPosition(),
                    view_x = _i$GetPosition.x,
                    view_y = _i$GetPosition.y;

                var x = view_x / this.m_iGridSizeX,
                    y = view_y / this.m_iGridSizeY;
                LocalLog("cycle found at ".concat(x, ",").concat(y));
                return true;
              }
          }
        } catch (err) {
          _iterator14.e(err);
        } finally {
          _iterator14.f();
        }

        return false;
      }.bind(this); // Mark all the vertices as not visited  
      // and not part of recursion stack 


      for (var i = 0; i < vertices.length; i++) {
        vertices[i].visited = false;
      } // Call the recursive helper function  
      // to detect cycle in different DFS trees 


      for (var u = 0; u < vertices.length; u++) {
        // Don't recur for u if already visited 
        if (!vertices[u].visited) if (isCyclicUtil(vertices[u], -1)) return true;
      }

      return false;
    }
    /**
     * Based on https://www.geeksforgeeks.org/print-all-the-cycles-in-an-undirected-graph/
     * @param {any} graph constructed earlier with BuildGraph
     * @returns {array} of cycles
     */

  }, {
    key: "MarkAllCycles",
    value: function () {
      var _MarkAllCycles = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee38(graph) {
        var vertices, N, cycles, mark, color, par, i, dfs_cycle, printCycles, cyclenumber, edges, vind;
        return regeneratorRuntime.wrap(function _callee38$(_context38) {
          while (1) {
            switch (_context38.prev = _context38.next) {
              case 0:
                vertices = graph.vertices;
                N = vertices.length;
                cycles = new Array(N); // mark with unique numbers

                mark = new Array(N); // arrays required to color the 
                // graph, store the parent of node 

                color = new Array(N), par = new Array(N);

                for (i = 0; i < N; i++) {
                  mark[i] = [];
                  cycles[i] = [];
                }

                dfs_cycle = /*#__PURE__*/function () {
                  var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee36(u, p) {
                    var cur, vertex, _iterator15, _step15, adj, v;

                    return regeneratorRuntime.wrap(function _callee36$(_context36) {
                      while (1) {
                        switch (_context36.prev = _context36.next) {
                          case 0:
                            if (!(color[u] === 2)) {
                              _context36.next = 2;
                              break;
                            }

                            return _context36.abrupt("return");

                          case 2:
                            if (!(color[u] === 1)) {
                              _context36.next = 8;
                              break;
                            }

                            cyclenumber++;
                            cur = p;
                            mark[cur].push(cyclenumber); // backtrack the vertex which are
                            // in the current cycle thats found

                            while (cur !== u) {
                              cur = par[cur];
                              mark[cur].push(cyclenumber);
                            }

                            return _context36.abrupt("return");

                          case 8:
                            par[u] = p; // partially visited.

                            color[u] = 1;
                            vertex = vertices[u];

                            if (!vertex) {
                              _context36.next = 36;
                              break;
                            }

                            vertex.SetStrokeColor('black');
                            vertex.SetFillColor('black'); //vertex.setAttribute("r", "6");

                            _context36.next = 16;
                            return Sleep(10);

                          case 16:
                            // simple dfs on graph
                            _iterator15 = _createForOfIteratorHelper(vertex.adjacents);
                            _context36.prev = 17;

                            _iterator15.s();

                          case 19:
                            if ((_step15 = _iterator15.n()).done) {
                              _context36.next = 28;
                              break;
                            }

                            adj = _step15.value;
                            v = vertices.indexOf(adj); // if it has not been visited previously

                            if (!(v === par[u])) {
                              _context36.next = 24;
                              break;
                            }

                            return _context36.abrupt("continue", 26);

                          case 24:
                            _context36.next = 26;
                            return dfs_cycle(v, u);

                          case 26:
                            _context36.next = 19;
                            break;

                          case 28:
                            _context36.next = 33;
                            break;

                          case 30:
                            _context36.prev = 30;
                            _context36.t0 = _context36["catch"](17);

                            _iterator15.e(_context36.t0);

                          case 33:
                            _context36.prev = 33;

                            _iterator15.f();

                            return _context36.finish(33);

                          case 36:
                            // completely visited. 
                            color[u] = 2;

                          case 37:
                          case "end":
                            return _context36.stop();
                        }
                      }
                    }, _callee36, null, [[17, 30, 33, 36]]);
                  }));

                  return function dfs_cycle(_x60, _x61) {
                    return _ref11.apply(this, arguments);
                  };
                }();

                printCycles = /*#__PURE__*/function () {
                  var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee37(edges, mark) {
                    var _this14 = this;

                    var e, mark_e, m, found_c, free_human_player_points, sHumanColor, _iterator16, _step16, _pt3, _pt3$GetPosition, view_x, view_y, _x64, _y2, _pt4, tab, _i, cycl, str, trailing_points, rand_color, mapped_verts, cw_sorted_verts, _iterator17, _step17, vert, x, y, pt, tmp, comma, _iterator18, _step18, possible_intercept, pt1, pts2reset;

                    return regeneratorRuntime.wrap(function _callee37$(_context37) {
                      while (1) {
                        switch (_context37.prev = _context37.next) {
                          case 0:
                            // push the edges that into the 
                            // cycle adjacency list 
                            for (e = 0; e < edges; e++) {
                              mark_e = mark[e];

                              if (mark_e !== undefined && mark_e.length > 0) {
                                for (m = 0; m < mark_e.length; m++) {
                                  found_c = cycles[mark_e[m]];
                                  if (found_c !== undefined) found_c.push(e);
                                }
                              }
                            } //sort by point length(only cycles >= 4): first longest cycles, most points


                            cycles = cycles.filter(function (c) {
                              return c.length >= 4;
                            }).sort(function (b, a) {
                              return a.length - b.length;
                            }); //gather free human player points that could be intercepted.

                            free_human_player_points = [];
                            sHumanColor = this.COLOR_RED;
                            _context37.t0 = _createForOfIteratorHelper;
                            _context37.next = 7;
                            return this.m_Points.values();

                          case 7:
                            _context37.t1 = _context37.sent;
                            _iterator16 = (0, _context37.t0)(_context37.t1);
                            _context37.prev = 9;

                            _iterator16.s();

                          case 11:
                            if ((_step16 = _iterator16.n()).done) {
                              _context37.next = 25;
                              break;
                            }

                            _pt3 = _step16.value;

                            if (!(_pt3 !== undefined && _pt3.GetFillColor() === sHumanColor && StatusEnum.POINT_FREE_RED === _pt3.GetStatus())) {
                              _context37.next = 23;
                              break;
                            }

                            _pt3$GetPosition = _pt3.GetPosition(), view_x = _pt3$GetPosition.x, view_y = _pt3$GetPosition.y;
                            _x64 = view_x / this.m_iGridSizeX, _y2 = view_y / this.m_iGridSizeY;
                            _context37.next = 18;
                            return this.IsPointOutsideAllPaths(_x64, _y2);

                          case 18:
                            _context37.t2 = _context37.sent;

                            if (!(false === _context37.t2)) {
                              _context37.next = 21;
                              break;
                            }

                            return _context37.abrupt("continue", 23);

                          case 21:
                            //check if really exists
                            _pt4 = document.querySelector("svg > circle[cx=\"".concat(view_x, "\"][cy=\"").concat(view_y, "\"]"));
                            if (_pt4) free_human_player_points.push({
                              x: _x64,
                              y: _y2
                            });

                          case 23:
                            _context37.next = 11;
                            break;

                          case 25:
                            _context37.next = 30;
                            break;

                          case 27:
                            _context37.prev = 27;
                            _context37.t3 = _context37["catch"](9);

                            _iterator16.e(_context37.t3);

                          case 30:
                            _context37.prev = 30;

                            _iterator16.f();

                            return _context37.finish(30);

                          case 33:
                            tab = []; // traverse through all the vertices with same cycle

                            _i = 0;

                          case 35:
                            if (!(_i <= cyclenumber)) {
                              _context37.next = 73;
                              break;
                            }

                            cycl = cycles[_i]; //get cycle

                            if (!(cycl && cycl.length > 0)) {
                              _context37.next = 70;
                              break;
                            }

                            //somr checks
                            // Print the i-th cycle
                            str = "Cycle Number ".concat(_i, ": "), trailing_points = [];
                            rand_color = 'var(--indigo)'; //convert to logical space

                            mapped_verts = cycl.map(function (c) {
                              var pt = vertices[c].GetPosition();
                              return {
                                x: pt.x / this.m_iGridSizeX,
                                y: pt.y / this.m_iGridSizeY
                              };
                            }.bind(this)); //sort clockwise (https://stackoverflow.com/questions/45660743/sort-points-in-counter-clockwise-in-javascript)

                            cw_sorted_verts = SVG.sortPointsClockwise(mapped_verts); //display which cycle we are dealing with

                            _iterator17 = _createForOfIteratorHelper(cw_sorted_verts);
                            _context37.prev = 43;

                            _iterator17.s();

                          case 45:
                            if ((_step17 = _iterator17.n()).done) {
                              _context37.next = 54;
                              break;
                            }

                            vert = _step17.value;
                            x = vert.x, y = vert.y;
                            pt = document.querySelector("svg > circle[cx=\"".concat(x * this.m_iGridSizeX, "\"][cy=\"").concat(y * this.m_iGridSizeY, "\"]"));

                            if (pt) {
                              //again some basic checks
                              str += "(".concat(x, ",").concat(y, ")");
                              pt.SetStrokeColor(rand_color);
                              pt.SetFillColor(rand_color);
                              pt.setAttribute("r", "6");
                            }

                            _context37.next = 52;
                            return Sleep(50);

                          case 52:
                            _context37.next = 45;
                            break;

                          case 54:
                            _context37.next = 59;
                            break;

                          case 56:
                            _context37.prev = 56;
                            _context37.t4 = _context37["catch"](43);

                            _iterator17.e(_context37.t4);

                          case 59:
                            _context37.prev = 59;

                            _iterator17.f();

                            return _context37.finish(59);

                          case 62:
                            //find for all free_human_player_points which cycle might interepct it (surrounds)
                            //only convex, NOT concave :-(
                            tmp = '', comma = '';
                            _iterator18 = _createForOfIteratorHelper(free_human_player_points);

                            try {
                              for (_iterator18.s(); !(_step18 = _iterator18.n()).done;) {
                                possible_intercept = _step18.value;

                                if (false !== this.pnpoly2(cw_sorted_verts, possible_intercept.x, possible_intercept.y)) {
                                  tmp += "".concat(comma, "(").concat(possible_intercept.x, ",").concat(possible_intercept.y, ")");
                                  pt1 = document.querySelector("svg > circle[cx=\"".concat(possible_intercept.x * this.m_iGridSizeX, "\"][cy=\"").concat(possible_intercept.y * this.m_iGridSizeY, "\"]"));

                                  if (pt1) {
                                    pt1.SetStrokeColor('var(--yellow)');
                                    pt1.SetFillColor('var(--yellow)');
                                    pt1.setAttribute("r", "6");
                                  }

                                  comma = ',';
                                }
                              } //gaterhing of some data and console printing

                            } catch (err) {
                              _iterator18.e(err);
                            } finally {
                              _iterator18.f();
                            }

                            trailing_points.unshift(str);
                            tab.push(trailing_points); //log...

                            LocalLog(str + (tmp !== '' ? " possible intercepts: ".concat(tmp) : '')); //...and clear

                            pts2reset = Array.from(document.querySelectorAll("svg > circle[fill=\"".concat(rand_color, "\"][r=\"6\"]")));
                            pts2reset.forEach(function (pt) {
                              pt.SetStrokeColor(_this14.COLOR_BLUE);
                              pt.SetFillColor(_this14.COLOR_BLUE);
                              pt.setAttribute("r", "4");
                            });

                          case 70:
                            _i++;
                            _context37.next = 35;
                            break;

                          case 73:
                            return _context37.abrupt("return", tab);

                          case 74:
                          case "end":
                            return _context37.stop();
                        }
                      }
                    }, _callee37, this, [[9, 27, 30, 33], [43, 56, 59, 62]]);
                  }));

                  return function (_x62, _x63) {
                    return _ref12.apply(this, arguments);
                  };
                }().bind(this); // store the numbers of cycle 


                cyclenumber = 0, edges = N; // call DFS to mark the cycles 

                vind = 0;

              case 10:
                if (!(vind < N)) {
                  _context38.next = 16;
                  break;
                }

                _context38.next = 13;
                return dfs_cycle(vind + 1, vind
                /*, color, mark, par*/
                );

              case 13:
                vind++;
                _context38.next = 10;
                break;

              case 16:
                _context38.next = 18;
                return printCycles(edges, mark);

              case 18:
                return _context38.abrupt("return", _context38.sent);

              case 19:
              case "end":
                return _context38.stop();
            }
          }
        }, _callee38, this);
      }));

      function MarkAllCycles(_x59) {
        return _MarkAllCycles.apply(this, arguments);
      }

      return MarkAllCycles;
    }()
  }, {
    key: "GroupPointsRecurse",
    value: function () {
      var _GroupPointsRecurse = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee39(currPointsArr, point) {
        var _point$GetPosition2, x, y, last, last_x, last_y, last_pos, first, first_pos, _last_pos, tmp, east, west, north, south, north_west, north_east, south_west, south_east;

        return regeneratorRuntime.wrap(function _callee39$(_context39) {
          while (1) {
            switch (_context39.prev = _context39.next) {
              case 0:
                if (!(point === undefined || currPointsArr.includes(point))) {
                  _context39.next = 2;
                  break;
                }

                return _context39.abrupt("return", currPointsArr);

              case 2:
                if (!([StatusEnum.POINT_FREE_BLUE, StatusEnum.POINT_STARTING, StatusEnum.POINT_IN_PATH].includes(point.GetStatus()) === false || point.GetFillColor() !== this.COLOR_BLUE)) {
                  _context39.next = 4;
                  break;
                }

                return _context39.abrupt("return", currPointsArr);

              case 4:
                _point$GetPosition2 = point.GetPosition(), x = _point$GetPosition2.x, y = _point$GetPosition2.y;
                x /= this.m_iGridSizeX;
                y /= this.m_iGridSizeY;
                last = null;

                if (!(currPointsArr.length > 0)) {
                  _context39.next = 21;
                  break;
                }

                last = currPointsArr[currPointsArr.length - 1];
                last_pos = last.GetPosition();
                last_x = last_pos.x, last_y = last_pos.y;
                last_x /= this.m_iGridSizeX;
                last_y /= this.m_iGridSizeY;

                if (!(Math.abs(parseInt(last_x - x)) <= 1 && Math.abs(parseInt(last_y - y)) <= 1)) {
                  _context39.next = 18;
                  break;
                }

                currPointsArr.push(point); //nearby point 1 jump away

                _context39.next = 19;
                break;

              case 18:
                return _context39.abrupt("return", currPointsArr);

              case 19:
                _context39.next = 22;
                break;

              case 21:
                currPointsArr.push(point);

              case 22:
                //1st starting point
                if (currPointsArr.length > 2 && last !== null) {
                  first = currPointsArr[0];
                  first_pos = first.GetPosition();
                  first_pos.x /= this.m_iGridSizeX;
                  first_pos.y /= this.m_iGridSizeY;
                  last = currPointsArr[currPointsArr.length - 1];
                  _last_pos = last.GetPosition();
                  last_x = _last_pos.x, last_y = _last_pos.y;
                  last_x /= this.m_iGridSizeX;
                  last_y /= this.m_iGridSizeY;

                  if (Math.abs(parseInt(last_x - first_pos.x)) <= 1 && Math.abs(parseInt(last_y - first_pos.y)) <= 1) {
                    tmp = [];
                    currPointsArr.forEach(function (value) {
                      return tmp.push(value);
                    });
                    this.lastCycle.push(tmp);
                  }
                } //TODO: awawit all together promises


                _context39.next = 25;
                return this.m_Points.get(y * this.m_iGridWidth + x + 1);

              case 25:
                east = _context39.sent;
                _context39.next = 28;
                return this.m_Points.get(y * this.m_iGridWidth + x - 1);

              case 28:
                west = _context39.sent;
                _context39.next = 31;
                return this.m_Points.get((y - 1) * this.m_iGridWidth + x);

              case 31:
                north = _context39.sent;
                _context39.next = 34;
                return this.m_Points.get((y + 1) * this.m_iGridWidth + x);

              case 34:
                south = _context39.sent;
                _context39.next = 37;
                return this.m_Points.get((y - 1) * this.m_iGridWidth + x - 1);

              case 37:
                north_west = _context39.sent;
                _context39.next = 40;
                return this.m_Points.get((y - 1) * this.m_iGridWidth + x + 1);

              case 40:
                north_east = _context39.sent;
                _context39.next = 43;
                return this.m_Points.get((y + 1) * this.m_iGridWidth + x - 1);

              case 43:
                south_west = _context39.sent;
                _context39.next = 46;
                return this.m_Points.get((y + 1) * this.m_iGridWidth + x + 1);

              case 46:
                south_east = _context39.sent;

                if (!east) {
                  _context39.next = 50;
                  break;
                }

                _context39.next = 50;
                return this.GroupPointsRecurse(currPointsArr, east);

              case 50:
                if (!west) {
                  _context39.next = 53;
                  break;
                }

                _context39.next = 53;
                return this.GroupPointsRecurse(currPointsArr, west);

              case 53:
                if (!north) {
                  _context39.next = 56;
                  break;
                }

                _context39.next = 56;
                return this.GroupPointsRecurse(currPointsArr, north);

              case 56:
                if (!south) {
                  _context39.next = 59;
                  break;
                }

                _context39.next = 59;
                return this.GroupPointsRecurse(currPointsArr, south);

              case 59:
                if (!north_west) {
                  _context39.next = 62;
                  break;
                }

                _context39.next = 62;
                return this.GroupPointsRecurse(currPointsArr, north_west);

              case 62:
                if (!north_east) {
                  _context39.next = 65;
                  break;
                }

                _context39.next = 65;
                return this.GroupPointsRecurse(currPointsArr, north_east);

              case 65:
                if (!south_west) {
                  _context39.next = 68;
                  break;
                }

                _context39.next = 68;
                return this.GroupPointsRecurse(currPointsArr, south_west);

              case 68:
                if (!south_east) {
                  _context39.next = 71;
                  break;
                }

                _context39.next = 71;
                return this.GroupPointsRecurse(currPointsArr, south_east);

              case 71:
                return _context39.abrupt("return", currPointsArr);

              case 72:
              case "end":
                return _context39.stop();
            }
          }
        }, _callee39, this);
      }));

      function GroupPointsRecurse(_x65, _x66) {
        return _GroupPointsRecurse.apply(this, arguments);
      }

      return GroupPointsRecurse;
    }()
  }, {
    key: "GroupPointsIterative",
    value: function () {
      var _GroupPointsIterative = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee40() {
        var _ref13,
            _ref13$g,
            graph,
            vertices,
            cycles,
            point,
            _iterator19,
            _step19,
            start,
            currPointsArr,
            traversed_path,
            _args40 = arguments;

        return regeneratorRuntime.wrap(function _callee40$(_context40) {
          while (1) {
            switch (_context40.prev = _context40.next) {
              case 0:
                _ref13 = _args40.length > 0 && _args40[0] !== undefined ? _args40[0] : {}, _ref13$g = _ref13.g, graph = _ref13$g === void 0 ? null : _ref13$g;

                if (graph) {
                  _context40.next = 3;
                  break;
                }

                return _context40.abrupt("return");

              case 3:
                vertices = graph.vertices, cycles = [];
                _iterator19 = _createForOfIteratorHelper(vertices);
                _context40.prev = 5;

                _iterator19.s();

              case 7:
                if ((_step19 = _iterator19.n()).done) {
                  _context40.next = 17;
                  break;
                }

                start = _step19.value;
                point = start;
                currPointsArr = [];
                _context40.next = 13;
                return this.GroupPointsRecurse(currPointsArr, point);

              case 13:
                traversed_path = _context40.sent;

                if (traversed_path.length > 0 && this.lastCycle.length > 0) {
                  cycles.push(this.lastCycle);
                  this.lastCycle = [];
                }

              case 15:
                _context40.next = 7;
                break;

              case 17:
                _context40.next = 22;
                break;

              case 19:
                _context40.prev = 19;
                _context40.t0 = _context40["catch"](5);

                _iterator19.e(_context40.t0);

              case 22:
                _context40.prev = 22;

                _iterator19.f();

                return _context40.finish(22);

              case 25:
                return _context40.abrupt("return", cycles);

              case 26:
              case "end":
                return _context40.stop();
            }
          }
        }, _callee40, this, [[5, 19, 22, 25]]);
      }));

      function GroupPointsIterative() {
        return _GroupPointsIterative.apply(this, arguments);
      }

      return GroupPointsIterative;
    }()
  }, {
    key: "rAFCallBack",
    value: function () {
      var _rAFCallBack = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee41(timeStamp) {
        var _this15 = this;

        var progress, point, centroid;
        return regeneratorRuntime.wrap(function _callee41$(_context41) {
          while (1) {
            switch (_context41.prev = _context41.next) {
              case 0:
                if (this.rAF_StartTimestamp === null) this.rAF_StartTimestamp = timeStamp;
                progress = timeStamp - this.rAF_StartTimestamp;
                point = null;
                _context41.next = 5;
                return this.CalculateCPUCentroid();

              case 5:
                centroid = _context41.sent;

                if (!(centroid !== null)) {
                  _context41.next = 10;
                  break;
                }

                point = centroid;
                _context41.next = 13;
                break;

              case 10:
                _context41.next = 12;
                return this.FindRandomCPUPoint();

              case 12:
                point = _context41.sent;

              case 13:
                if (!(point === null)) {
                  _context41.next = 17;
                  break;
                }

                if (progress < 2000) this.rAF_FrameID = window.requestAnimationFrame(this.rAFCallBack.bind(this));
                _context41.next = 19;
                break;

              case 17:
                _context41.next = 19;
                return this.SendAsyncData(point, function () {
                  _this15.m_bMouseDown = false;
                  _this15.m_bHandlingEvent = false;
                });

              case 19:
              case "end":
                return _context41.stop();
            }
          }
        }, _callee41, this);
      }));

      function rAFCallBack(_x67) {
        return _rAFCallBack.apply(this, arguments);
      }

      return rAFCallBack;
    }()
  }, {
    key: "StartCPUCalculation",
    value: function StartCPUCalculation() {
      if (this.rAF_FrameID === null) this.rAF_FrameID = window.requestAnimationFrame(this.rAFCallBack.bind(this));
    } ///////CpuGame variables methods end//////

  }]);

  return InkBallGame;
}();
/******** /funcs-n-classes ********/

/******** run code and events ********/


window.addEventListener('load', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee42() {
  var inkBallHubName, iGameID, iPlayerID, iOtherPlayerID, bPlayingWithRed, bPlayerActive, gameType, protocol, servTimeoutMillis, isReadonly, pathAfterPointDrawAllowanceSecAmount, sLastMoveTimeStampUtcIso, version, game;
  return regeneratorRuntime.wrap(function _callee42$(_context42) {
    while (1) {
      switch (_context42.prev = _context42.next) {
        case 0:
          //const gameOptions = this.window.gameOptions;
          inkBallHubName = gameOptions.inkBallHubName;
          iGameID = gameOptions.iGameID;
          document.getElementById('gameID').innerHTML = iGameID;
          document.querySelector(".container.inkgame form > input[type='hidden'][name='GameID']").value = iGameID;
          iPlayerID = gameOptions.iPlayerID;
          iOtherPlayerID = gameOptions.iOtherPlayerID;
          document.getElementById('playerID').innerHTML = iPlayerID;
          bPlayingWithRed = gameOptions.bPlayingWithRed;
          bPlayerActive = gameOptions.bPlayerActive;
          gameType = gameOptions.gameType;
          protocol = gameOptions.protocol;
          servTimeoutMillis = gameOptions.servTimeoutMillis;
          isReadonly = gameOptions.isReadonly;
          pathAfterPointDrawAllowanceSecAmount = gameOptions.pathAfterPointDrawAllowanceSecAmount;
          sLastMoveTimeStampUtcIso = new Date(gameOptions.sLastMoveGameTimeStamp).toISOString();
          version = gameOptions.version;
          _context42.next = 18;
          return importAllModulesAsync(gameOptions);

        case 18:
          game = new InkBallGame(iGameID, iPlayerID, iOtherPlayerID, inkBallHubName, signalR.LogLevel.Warning, protocol, signalR.HttpTransportType.None, servTimeoutMillis, gameType, bPlayingWithRed, bPlayerActive, isReadonly, pathAfterPointDrawAllowanceSecAmount);
          _context42.next = 21;
          return game.PrepareDrawing('#screen', '#Player2Name', '#gameStatus', '#SurrenderButton', '#CancelPath', '#Pause', '#StopAndDraw', '#messageInput', '#messagesList', '#sendButton', sLastMoveTimeStampUtcIso, gameOptions.PointsAsJavaScriptArray === null, version, ['#TestBuildGraph', '#TestConcaveman', '#TestMarkAllCycles', '#TestGroupPoints', '#TestFindFullSurroundedPoints', '#TestWorkerify']);

        case 21:
          if (!(gameOptions.PointsAsJavaScriptArray !== null)) {
            _context42.next = 30;
            break;
          }

          _context42.next = 24;
          return game.StartSignalRConnection(false);

        case 24:
          _context42.next = 26;
          return game.SetAllPoints(gameOptions.PointsAsJavaScriptArray);

        case 26:
          _context42.next = 28;
          return game.SetAllPaths(gameOptions.PathsAsJavaScriptArray);

        case 28:
          _context42.next = 32;
          break;

        case 30:
          _context42.next = 32;
          return game.StartSignalRConnection(true);

        case 32:
          //alert('a QQ');
          document.getElementsByClassName('whichColor')[0].style.color = bPlayingWithRed ? "red" : "blue";
          game.CountPointsDebug("#debug2");
          delete window.gameOptions;
          window.game = game;

        case 36:
        case "end":
          return _context42.stop();
      }
    }
  }, _callee42);
})));
window.addEventListener('beforeunload', function () {
  if (window.game) window.game.StopSignalRConnection();
});
/******** /run code and events ********/
//export { InkBallGame };

/***/ })
/******/ ]);