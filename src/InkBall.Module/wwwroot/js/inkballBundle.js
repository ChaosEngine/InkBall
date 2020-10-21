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
/******/ 		1: 0
/******/ 	};
/******/
/******/
/******/
/******/ 	// script path function
/******/ 	function jsonpScriptSrc(chunkId) {
/******/ 		return __webpack_require__.p + "" + ({"0":"concavemanDeps","2":"svgvml","3":"svgvmlMin"}[chunkId]||chunkId) + "Bundle.js"
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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "InkBallGame" }]*/

/*global signalR, gameOptions*/


function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

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

var $createOval, $createPolyline, $RemovePolyline, $createSVGVML, $createLine, hasDuplicates, sortPointsClockwise, GameStateStore, concavemanBundle;
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
  _importAllModulesAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee40(gameOptions) {
    var selfFileName, isMinified, module;
    return regeneratorRuntime.wrap(function _callee40$(_context40) {
      while (1) {
        switch (_context40.prev = _context40.next) {
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
            isMinified = selfFileName.indexOf("min") !== -1; //////SVGVML start/////

            if (!isMinified) {
              _context40.next = 8;
              break;
            }

            _context40.next = 5;
            return __webpack_require__.e(/* import() | svgvmlMin */ 3).then(__webpack_require__.bind(null, 1));

          case 5:
            module = _context40.sent;
            _context40.next = 11;
            break;

          case 8:
            _context40.next = 10;
            return __webpack_require__.e(/* import() | svgvml */ 2).then(__webpack_require__.bind(null, 2));

          case 10:
            module = _context40.sent;

          case 11:
            $createOval = module.$createOval, $createPolyline = module.$createPolyline, $RemovePolyline = module.$RemovePolyline, $createSVGVML = module.$createSVGVML, $createLine = module.$createLine, hasDuplicates = module.hasDuplicates, sortPointsClockwise = module.sortPointsClockwise;
            GameStateStore = module.GameStateStore; //////SVGVML end/////

            if (!(gameOptions.iOtherPlayerID === -1)) {
              _context40.next = 18;
              break;
            }

            _context40.next = 16;
            return __webpack_require__.e(/* import() | concavemanDeps */ 0).then(__webpack_require__.bind(null, 3));

          case 16:
            module = _context40.sent;
            concavemanBundle = module;

          case 18:
          case "end":
            return _context40.stop();
        }
      }
    }, _callee40);
  }));
  return _importAllModulesAsync.apply(this, arguments);
}

function LocalLog(msg) {
  // eslint-disable-next-line no-console
  console.log(msg);
}

function LocalError(msg) {
  // eslint-disable-next-line no-console
  console.error(msg);
}

function RandomColor() {
  return 'var(--orange)'; //return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

function Sleep(_x2) {
  return _Sleep.apply(this, arguments);
}

function _Sleep() {
  _Sleep = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee41(ms) {
    return regeneratorRuntime.wrap(function _callee41$(_context41) {
      while (1) {
        switch (_context41.prev = _context41.next) {
          case 0:
            return _context41.abrupt("return", new Promise(function (resolve) {
              return setTimeout(resolve, ms);
            }));

          case 1:
          case "end":
            return _context41.stop();
        }
      }
    }, _callee41);
  }));
  return _Sleep.apply(this, arguments);
}

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
    var _this9 = this;

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
    this.m_Line = null;
    this.m_Lines = null;
    this.m_Points = null;
    this.m_bViewOnly = bViewOnly;
    this.m_MouseCursorOval = null;
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
                  _this9.m_Screen.style.cursor = "not-allowed";
                  _this9.iConnErrCount++;
                  setTimeout(function () {
                    return _this9.Connect();
                  }, 4000 + _this9.iExponentialBackOffMillis * Math.max(_this9.iConnErrCount, 5) //exponential back-off
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
        var _this10 = this;

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
                  return _this10.Connect();
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
                oval = $createOval(this.m_PointRadius, 'true');
                oval.$move(x, y, this.m_PointRadius);
                _context7.t0 = iStatus;
                _context7.next = _context7.t0 === StatusEnum.POINT_FREE_RED ? 11 : _context7.t0 === StatusEnum.POINT_FREE_BLUE ? 14 : _context7.t0 === StatusEnum.POINT_FREE ? 17 : _context7.t0 === StatusEnum.POINT_STARTING ? 20 : _context7.t0 === StatusEnum.POINT_IN_PATH ? 23 : _context7.t0 === StatusEnum.POINT_OWNED_BY_RED ? 26 : _context7.t0 === StatusEnum.POINT_OWNED_BY_BLUE ? 29 : 32;
                break;

              case 11:
                color = this.COLOR_RED;
                oval.$SetStatus(iStatus
                /*StatusEnum.POINT_FREE*/
                );
                return _context7.abrupt("break", 34);

              case 14:
                color = this.COLOR_BLUE;
                oval.$SetStatus(iStatus
                /*StatusEnum.POINT_FREE*/
                );
                return _context7.abrupt("break", 34);

              case 17:
                color = this.m_sDotColor;
                oval.$SetStatus(iStatus
                /*StatusEnum.POINT_FREE*/
                ); //console.warn('TODO: generic FREE point, really? change it!');

                return _context7.abrupt("break", 34);

              case 20:
                color = this.m_sDotColor;
                oval.$SetStatus(iStatus);
                return _context7.abrupt("break", 34);

              case 23:
                if (this.g_iPlayerID === iPlayerId) //bPlayingWithRed
                  color = this.m_bIsPlayingWithRed === true ? this.COLOR_RED : this.COLOR_BLUE;else color = this.m_bIsPlayingWithRed === true ? this.COLOR_BLUE : this.COLOR_RED;
                oval.$SetStatus(iStatus);
                return _context7.abrupt("break", 34);

              case 26:
                color = this.COLOR_OWNED_RED;
                oval.$SetStatus(iStatus);
                return _context7.abrupt("break", 34);

              case 29:
                color = this.COLOR_OWNED_BLUE;
                oval.$SetStatus(iStatus);
                return _context7.abrupt("break", 34);

              case 32:
                alert('bad point');
                return _context7.abrupt("break", 34);

              case 34:
                oval.$SetFillColor(color);
                oval.$SetStrokeColor(color);
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
      //if (await this.m_Points.has(iY * this.m_iGridWidth + iX))
      //	return;
      var x = iX * this.m_iGridSizeX;
      var y = iY * this.m_iGridSizeY;
      var oval = $createOval(this.m_PointRadius, 'true');
      oval.$move(x, y, this.m_PointRadius);
      var color;

      switch (iStatus) {
        case StatusEnum.POINT_FREE_RED:
          color = this.COLOR_RED;
          oval.$SetStatus(iStatus
          /*StatusEnum.POINT_FREE*/
          );
          break;

        case StatusEnum.POINT_FREE_BLUE:
          color = this.COLOR_BLUE;
          oval.$SetStatus(iStatus
          /*StatusEnum.POINT_FREE*/
          );
          break;

        case StatusEnum.POINT_FREE:
          color = this.m_sDotColor;
          oval.$SetStatus(iStatus
          /*StatusEnum.POINT_FREE*/
          ); //console.warn('TODO: generic FREE point, really? change it!');

          break;

        case StatusEnum.POINT_STARTING:
          color = this.m_sDotColor;
          oval.$SetStatus(iStatus);
          break;

        case StatusEnum.POINT_IN_PATH:
          //if (this.g_iPlayerID === iPlayerId)//bPlayingWithRed
          //	color = this.m_bIsPlayingWithRed === true ? this.COLOR_RED : this.COLOR_BLUE;
          //else
          //	color = this.m_bIsPlayingWithRed === true ? this.COLOR_BLUE : this.COLOR_RED;
          color = sColor;
          oval.$SetStatus(iStatus);
          break;

        case StatusEnum.POINT_OWNED_BY_RED:
          color = this.COLOR_OWNED_RED;
          oval.$SetStatus(iStatus);
          break;

        case StatusEnum.POINT_OWNED_BY_BLUE:
          color = this.COLOR_OWNED_BLUE;
          oval.$SetStatus(iStatus);
          break;

        default:
          alert('bad point');
          break;
      }

      oval.$SetFillColor(color);
      oval.$SetStrokeColor(color); //await this.m_Points.set(iY * this.m_iGridWidth + iX, oval);

      return oval;
    }
  }, {
    key: "SetAllPoints",
    value: function () {
      var _SetAllPoints = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(points) {
        var _iterator, _step, p;

        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                //points.forEach(async function(p) {
                //	await this.SetPoint(p[0]/*x*/, p[1]/*y*/, p[2]/*Status*/, p[3]/*iPlayerId*/);
                //}.bind(this));
                //TODO: implement indexeddb cursor if possible
                _iterator = _createForOfIteratorHelper(points);
                _context8.prev = 1;

                _iterator.s();

              case 3:
                if ((_step = _iterator.n()).done) {
                  _context8.next = 9;
                  break;
                }

                p = _step.value;
                _context8.next = 7;
                return this.SetPoint(p[0]
                /*x*/
                , p[1]
                /*y*/
                , p[2]
                /*Status*/
                , p[3]
                /*iPlayerId*/
                );

              case 7:
                _context8.next = 3;
                break;

              case 9:
                _context8.next = 14;
                break;

              case 11:
                _context8.prev = 11;
                _context8.t0 = _context8["catch"](1);

                _iterator.e(_context8.t0);

              case 14:
                _context8.prev = 14;

                _iterator.f();

                return _context8.finish(14);

              case 17:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this, [[1, 11, 14, 17]]);
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
            _packed,
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

                _packed = _step2.value;
                p = _packed.split(",");
                x = parseInt(p[0]);
                y = parseInt(p[1]);
                _context9.next = 13;
                return this.m_Points.get(y * this.m_iGridWidth + x);

              case 13:
                p = _context9.sent;

                if (p !== null && p !== undefined) {
                  p.$SetStatus(status);
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
                  p.$SetStatus(status);
                } else {//debugger;
                }

                x *= this.m_iGridSizeX;
                y *= this.m_iGridSizeY;
                sPathPoints += "".concat(sDelimiter).concat(x, ",").concat(y);
                line = $createPolyline(3, sPathPoints, bBelong2ThisPlayer ? this.m_sDotColor : bIsRed ? this.COLOR_BLUE : this.COLOR_RED);
                line.$SetID(iPathId);
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
        var sPoints, sDelimiter, sPathPoints, p, x, y, status, _iterator3, _step3, _packed2, line;

        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                //const bIsRed = this.m_bIsPlayingWithRed;
                //const bBelong2ThisPlayer = iPlayerId === this.g_iPlayerID;
                sPoints = packed.split(" ");
                sDelimiter = "", sPathPoints = "", p = null, status = StatusEnum.POINT_STARTING;
                _iterator3 = _createForOfIteratorHelper(sPoints);
                _context10.prev = 3;

                _iterator3.s();

              case 5:
                if ((_step3 = _iterator3.n()).done) {
                  _context10.next = 18;
                  break;
                }

                _packed2 = _step3.value;
                p = _packed2.split(",");
                x = parseInt(p[0]);
                y = parseInt(p[1]);
                _context10.next = 12;
                return this.m_Points.get(y * this.m_iGridWidth + x);

              case 12:
                p = _context10.sent;

                if (p !== null && p !== undefined) {
                  p.$SetStatus(status);
                  status = StatusEnum.POINT_IN_PATH;
                } else {//debugger;
                } //x *= this.m_iGridSizeX; y *= this.m_iGridSizeY;


                sPathPoints += "".concat(sDelimiter).concat(x, ",").concat(y);
                sDelimiter = " ";

              case 16:
                _context10.next = 5;
                break;

              case 18:
                _context10.next = 23;
                break;

              case 20:
                _context10.prev = 20;
                _context10.t0 = _context10["catch"](3);

                _iterator3.e(_context10.t0);

              case 23:
                _context10.prev = 23;

                _iterator3.f();

                return _context10.finish(23);

              case 26:
                p = sPoints[0].split(",");
                x = parseInt(p[0]);
                y = parseInt(p[1]);
                _context10.next = 31;
                return this.m_Points.get(y * this.m_iGridWidth + x);

              case 31:
                p = _context10.sent;

                if (p !== null && p !== undefined) {
                  p.$SetStatus(status);
                } else {//debugger;
                } //x *= this.m_iGridSizeX; y *= this.m_iGridSizeY;


                sPathPoints += "".concat(sDelimiter).concat(x, ",").concat(y);
                line = $createPolyline(3, sPathPoints, //(bBelong2ThisPlayer ? this.m_sDotColor : (bIsRed ? this.COLOR_BLUE : this.COLOR_RED))
                sColor);
                line.$SetID(iPathId); //this.m_Lines.push(line);

                return _context10.abrupt("return", line);

              case 37:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this, [[3, 20, 23, 26]]);
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
                //packedPaths.forEach(unpacked => {
                //	//const unpacked = JSON.parse(packed.Serialized);
                //	if (unpacked.iGameId !== this.g_iGameID)
                //		throw new Error("Bad game from path!");
                //	this.SetPath(unpacked.PointsAsString/*points*/, this.m_bIsPlayingWithRed,
                //		unpacked.iPlayerId === this.g_iPlayerID/*isMainPlayerPoints*/, unpacked.iId/*real DB id*/);
                //});
                _iterator4 = _createForOfIteratorHelper(packedPaths);
                _context11.prev = 1;

                _iterator4.s();

              case 3:
                if ((_step4 = _iterator4.n()).done) {
                  _context11.next = 11;
                  break;
                }

                unpacked = _step4.value;

                if (!(unpacked.iGameId !== this.g_iGameID)) {
                  _context11.next = 7;
                  break;
                }

                throw new Error("Bad game from path!");

              case 7:
                _context11.next = 9;
                return this.SetPath(unpacked.PointsAsString
                /*points*/
                , this.m_bIsPlayingWithRed, unpacked.iPlayerId === this.g_iPlayerID
                /*isMainPlayerPoints*/
                , unpacked.iId
                /*real DB id*/
                );

              case 9:
                _context11.next = 3;
                break;

              case 11:
                _context11.next = 16;
                break;

              case 13:
                _context11.prev = 13;
                _context11.t0 = _context11["catch"](1);

                _iterator4.e(_context11.t0);

              case 16:
                _context11.prev = 16;

                _iterator4.f();

                return _context11.finish(16);

              case 19:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this, [[1, 13, 16, 19]]);
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
        var points, pts_not_unique, sColor, owned_by, sOwnedCol, sPathPoints, sOwnedPoints, sDelimiter, ownedPoints, values, _iterator6, _step6, pt, _pt$$GetPosition, x, y;

        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                points = this.m_Line.$GetPointsArray(); //uniqe point path test (no duplicates except starting-ending point)

                pts_not_unique = hasDuplicates(points.slice(0, -1).map(function (pt) {
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

                _context12.next = 8;
                return this.m_Points.values();

              case 8:
                values = _context12.sent;
                _iterator6 = _createForOfIteratorHelper(values);

                try {
                  for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
                    pt = _step6.value;

                    if (pt !== undefined && pt.$GetFillColor() === sColor && [StatusEnum.POINT_FREE_BLUE, StatusEnum.POINT_FREE_RED].includes(pt.$GetStatus())) {
                      _pt$$GetPosition = pt.$GetPosition(), x = _pt$$GetPosition.x, y = _pt$$GetPosition.y;

                      if (false !== this.pnpoly2(points, x, y)) {
                        x /= this.m_iGridSizeX;
                        y /= this.m_iGridSizeY;
                        sOwnedPoints += "".concat(sDelimiter).concat(x, ",").concat(y);
                        sDelimiter = " ";
                        ownedPoints.push({
                          point: pt,
                          revertStatus: pt.$GetStatus(),
                          revertFillColor: pt.$GetFillColor(),
                          revertStrokeColor: pt.$GetStrokeColor()
                        });
                        pt.$SetStatus(owned_by, true);
                        pt.$SetFillColor(sOwnedCol);
                        pt.$SetStrokeColor(sOwnedCol);
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

              case 13:
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
                _iterator7 = _createForOfIteratorHelper(lines);
                _context13.prev = 5;

                _iterator7.s();

              case 7:
                if ((_step7 = _iterator7.n()).done) {
                  _context13.next = 14;
                  break;
                }

                line = _step7.value;
                points = line.$GetPointsArray();

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
                this.m_sLastMoveGameTimeStamp = (point.TimeStamp !== undefined ? point.TimeStamp : point.timeStamp).toISOString();
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
                this.m_sLastMoveGameTimeStamp = (path.TimeStamp !== undefined ? path.TimeStamp : path.timeStamp).toISOString();

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
                  p.$SetStatus(point_status);
                  p.$SetFillColor(sOwnedCol);
                  p.$SetStrokeColor(sOwnedCol);
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
                _points = this.m_Line.$GetPointsArray();
                _x24 = _points[0].x, _y = _points[0].y;
                _x24 /= this.m_iGridSizeX;
                _y /= this.m_iGridSizeY;
                _context16.next = 44;
                return this.m_Points.get(_y * this.m_iGridWidth + _x24);

              case 44:
                p0 = _context16.sent;
                if (p0 !== undefined) p0.$SetStatus(StatusEnum.POINT_IN_PATH);else {//debugger;
                }
                this.m_Line.$SetWidthAndColor(3, this.m_sDotColor);
                this.m_Line.$SetID(path.iId);
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
            return p.iEnclosingPathId !== null && p.$GetStatus() === owned_status;
          }).length;

          if (count >= 5) {
            if (this.m_bIsPlayingWithRed) return WinStatusEnum.GREEN_WINS;else return WinStatusEnum.RED_WINS;
          }

          owned_status = this.m_bIsPlayingWithRed ? StatusEnum.POINT_OWNED_BY_RED : StatusEnum.POINT_OWNED_BY_BLUE;
          count = playerPoints.filter(function (p) {
            return p.iEnclosingPathId !== null && p.$GetStatus() === owned_status;
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
        var _this11 = this;

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
                this.m_MouseCursorOval.$move(tox, toy, this.m_PointRadius);
                this.m_MouseCursorOval.$Show();
                this.Debug("[".concat(x, ",").concat(y, "]"), 1);

                if (!this.m_bDrawLines) {
                  _context18.next = 69;
                  break;
                }

                if (this.m_Line !== null) this.m_Screen.style.cursor = "move";else this.m_Screen.style.cursor = "crosshair";

                if (!(this.m_bMouseDown === true)) {
                  _context18.next = 67;
                  break;
                }

                if (!((this.m_iLastX !== x || this.m_iLastY !== y) && Math.abs(parseInt(this.m_iLastX - x)) <= 1 && Math.abs(parseInt(this.m_iLastY - y)) <= 1 && this.m_iLastX >= 0 && this.m_iLastY >= 0)) {
                  _context18.next = 67;
                  break;
                }

                if (!(this.m_Line !== null)) {
                  _context18.next = 60;
                  break;
                }

                _context18.next = 19;
                return this.m_Points.get(this.m_iLastY * this.m_iGridWidth + this.m_iLastX);

              case 19:
                p0 = _context18.sent;
                _context18.next = 22;
                return this.m_Points.get(y * this.m_iGridWidth + x);

              case 22:
                p1 = _context18.sent;
                this.m_CancelPath.disabled = this.m_Line.$GetLength() >= 2 ? '' : 'disabled';

                if (!(p0 !== undefined && p1 !== undefined && p0.$GetFillColor() === this.m_sDotColor && p1.$GetFillColor() === this.m_sDotColor)) {
                  _context18.next = 58;
                  break;
                }

                line_contains_point = this.m_Line.$ContainsPoint(tox, toy);

                if (!(line_contains_point < 1 && p1.$GetStatus() !== StatusEnum.POINT_STARTING && true === this.m_Line.$AppendPoints(tox, toy, this.m_iGridSizeX, this.m_iGridSizeY))) {
                  _context18.next = 32;
                  break;
                }

                p1.$SetStatus(StatusEnum.POINT_IN_PATH, true);
                this.m_iLastX = x;
                this.m_iLastY = y;
                _context18.next = 58;
                break;

              case 32:
                if (!(line_contains_point === 1 && p1.$GetStatus() === StatusEnum.POINT_STARTING && true === this.m_Line.$AppendPoints(tox, toy, this.m_iGridSizeX, this.m_iGridSizeY))) {
                  _context18.next = 48;
                  break;
                }

                _context18.next = 35;
                return this.SurroundOponentPoints();

              case 35:
                val = _context18.sent;

                if (!(val.owned.length > 0)) {
                  _context18.next = 43;
                  break;
                }

                this.Debug('Closing path', 0);
                this.rAF_FrameID = null;
                _context18.next = 41;
                return this.SendAsyncData(this.CreateXMLPutPathRequest(val), /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17() {
                  return regeneratorRuntime.wrap(function _callee17$(_context17) {
                    while (1) {
                      switch (_context17.prev = _context17.next) {
                        case 0:
                          _context17.next = 2;
                          return _this11.OnCancelClick();

                        case 2:
                          val.OwnedPoints.forEach(function (revData) {
                            var p = revData.point;
                            var revertFillColor = revData.revertFillColor;
                            var revertStrokeColor = revData.revertStrokeColor;
                            p.$RevertOldStatus();
                            p.$SetFillColor(revertFillColor);
                            p.$SetStrokeColor(revertStrokeColor);
                          });
                          _this11.m_bHandlingEvent = false;

                        case 4:
                        case "end":
                          return _context17.stop();
                      }
                    }
                  }, _callee17);
                })));

              case 41:
                _context18.next = 44;
                break;

              case 43:
                this.Debug("".concat(val.errorDesc ? val.errorDesc : 'Wrong path', ", cancell it or refresh page"), 0);

              case 44:
                this.m_iLastX = x;
                this.m_iLastY = y;
                _context18.next = 58;
                break;

              case 48:
                if (!(line_contains_point >= 1 && p0.$GetStatus() === StatusEnum.POINT_IN_PATH && this.m_Line.$GetPointsString().endsWith("".concat(this.m_iLastX * this.m_iGridSizeX, ",").concat(this.m_iLastY * this.m_iGridSizeY)))) {
                  _context18.next = 58;
                  break;
                }

                if (!(this.m_Line.$GetLength() > 2)) {
                  _context18.next = 56;
                  break;
                }

                p0.$RevertOldStatus();
                this.m_Line.$RemoveLastPoint();
                this.m_iLastX = x;
                this.m_iLastY = y;
                _context18.next = 58;
                break;

              case 56:
                _context18.next = 58;
                return this.OnCancelClick();

              case 58:
                _context18.next = 67;
                break;

              case 60:
                _context18.next = 62;
                return this.m_Points.get(this.m_iLastY * this.m_iGridWidth + this.m_iLastX);

              case 62:
                _p = _context18.sent;
                _context18.next = 65;
                return this.m_Points.get(y * this.m_iGridWidth + x);

              case 65:
                _p2 = _context18.sent;

                if (_p !== undefined && _p2 !== undefined && _p.$GetFillColor() === this.m_sDotColor && _p2.$GetFillColor() === this.m_sDotColor) {
                  fromx = this.m_iLastX * this.m_iGridSizeX;
                  fromy = this.m_iLastY * this.m_iGridSizeY;
                  this.m_Line = $createPolyline(6, fromx + "," + fromy + " " + tox + "," + toy, this.DRAWING_PATH_COLOR);
                  this.m_CancelPath.disabled = '';

                  _p.$SetStatus(StatusEnum.POINT_STARTING, true);

                  _p2.$SetStatus(StatusEnum.POINT_IN_PATH, true);

                  this.m_iLastX = x;
                  this.m_iLastY = y;
                }

              case 67:
                _context18.next = 70;
                break;

              case 69:
                this.m_Screen.style.cursor = "crosshair";

              case 70:
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
        var _this12 = this;

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
                  _this12.m_bMouseDown = false;
                  _this12.m_bHandlingEvent = false;
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
                this.m_CancelPath.disabled = this.m_Line.$GetLength() >= 2 ? '' : 'disabled';

                if (!(p0 !== undefined && p1 !== undefined && p0.$GetFillColor() === this.m_sDotColor && p1.$GetFillColor() === this.m_sDotColor)) {
                  _context20.next = 76;
                  break;
                }

                tox = x * this.m_iGridSizeX;
                toy = y * this.m_iGridSizeY;
                line_contains_point = this.m_Line.$ContainsPoint(tox, toy);

                if (!(line_contains_point < 1 && p1.$GetStatus() !== StatusEnum.POINT_STARTING && true === this.m_Line.$AppendPoints(tox, toy, this.m_iGridSizeX, this.m_iGridSizeY))) {
                  _context20.next = 50;
                  break;
                }

                p1.$SetStatus(StatusEnum.POINT_IN_PATH, true);
                this.m_iLastX = x;
                this.m_iLastY = y;
                _context20.next = 76;
                break;

              case 50:
                if (!(line_contains_point === 1 && p1.$GetStatus() === StatusEnum.POINT_STARTING && true === this.m_Line.$AppendPoints(tox, toy, this.m_iGridSizeX, this.m_iGridSizeY))) {
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
                          return _this12.OnCancelClick();

                        case 2:
                          val.OwnedPoints.forEach(function (revData) {
                            var p = revData.point;
                            var revertFillColor = revData.revertFillColor;
                            var revertStrokeColor = revData.revertStrokeColor;
                            p.$RevertOldStatus();
                            p.$SetFillColor(revertFillColor);
                            p.$SetStrokeColor(revertStrokeColor);
                          });
                          _this12.m_bMouseDown = false;
                          _this12.m_bHandlingEvent = false;

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
                if (!(line_contains_point >= 1 && p0.$GetStatus() === StatusEnum.POINT_IN_PATH && this.m_Line.$GetPointsString().endsWith("".concat(this.m_iLastX * this.m_iGridSizeX, ",").concat(this.m_iLastY * this.m_iGridSizeY)))) {
                  _context20.next = 76;
                  break;
                }

                if (!(this.m_Line.$GetLength() > 2)) {
                  _context20.next = 74;
                  break;
                }

                p0.$RevertOldStatus();
                this.m_Line.$RemoveLastPoint();
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

                if (_p3 !== undefined && _p4 !== undefined && _p3.$GetFillColor() === this.m_sDotColor && _p4.$GetFillColor() === this.m_sDotColor) {
                  fromx = this.m_iLastX * this.m_iGridSizeX;
                  fromy = this.m_iLastY * this.m_iGridSizeY;
                  _tox = x * this.m_iGridSizeX;
                  _toy = y * this.m_iGridSizeY;
                  this.m_Line = $createPolyline(6, fromx + "," + fromy + " " + _tox + "," + _toy, this.DRAWING_PATH_COLOR);
                  this.m_CancelPath.disabled = '';

                  _p3.$SetStatus(StatusEnum.POINT_STARTING, true);

                  _p4.$SetStatus(StatusEnum.POINT_IN_PATH, true);
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

                if (_p5 !== undefined && _p5.$GetFillColor() === this.m_sDotColor) {
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
      this.m_MouseCursorOval.$Hide();
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

                points = this.m_Line.$GetPointsArray();
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
                  p0.$RevertOldStatus();
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
                $RemovePolyline(this.m_Line);
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
      /*//TODO: test code; to be disabled
      const screen = document.querySelector('#screen');
      screen.innerHTML += "<div id='divTooltip' " +
      	"style='position:absolute; top:0; right:0; z-index:33; background-color:#8886; display:none' " +
      	"data-toggle='tooltip' data-html='true'>XXXXXXXXXX</div>";
      const tooltip = $('#divTooltip').tooltip('hide');
      $('polyline').hover(function (event) {
      	const t = event.offsetY, l = event.offsetX;
      			tooltip.text(this.getAttribute("points").split(" ").map(function (pt) {
      		const tab = pt.split(',');
      		return (parseInt(tab[0]) >> 4) + "," + (parseInt(tab[1]) >> 4);
      	}).join(' 	'));
      	
      	tooltip.css({ "top": t + "px", "left": l + "px" }).show();
      }, function () {
      	tooltip.hide();
      });*/
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
        var vertices, convex_hull, mapped_verts, cw_sorted_verts, rand_color, _iterator10, _step10, vert, x, y, view_x, view_y, pt;

        return regeneratorRuntime.wrap(function _callee24$(_context24) {
          while (1) {
            switch (_context24.prev = _context24.next) {
              case 0:
                event.preventDefault(); //LocalLog('OnTestConcaveman');

                _context24.next = 3;
                return this.BuildGraph();

              case 3:
                vertices = _context24.sent.vertices.map(function (pt) {
                  var pos = pt.$GetPosition();
                  return [pos.x / this.m_iGridSizeX, pos.y / this.m_iGridSizeX];
                }.bind(this));

                if (!(vertices && vertices.length > 0)) {
                  _context24.next = 32;
                  break;
                }

                convex_hull = concavemanBundle.concaveman(vertices, 2.0, 0.0);
                $createPolyline(6, convex_hull.map(function (fnd) {
                  return parseInt(fnd[0]) * this.m_iGridSizeX + ',' + parseInt(fnd[1]) * this.m_iGridSizeY;
                }.bind(this)).join(' '), 'green');
                LocalLog("convex_hull = ".concat(convex_hull));
                mapped_verts = convex_hull.map(function (pt) {
                  return {
                    x: pt[0],
                    y: pt[1]
                  };
                }.bind(this));
                cw_sorted_verts = sortPointsClockwise(mapped_verts);
                rand_color = RandomColor();
                _iterator10 = _createForOfIteratorHelper(cw_sorted_verts);
                _context24.prev = 12;

                _iterator10.s();

              case 14:
                if ((_step10 = _iterator10.n()).done) {
                  _context24.next = 24;
                  break;
                }

                vert = _step10.value;
                //const { x: view_x, y: view_y } = vertices[vert].$GetPosition();
                x = vert.x, y = vert.y;
                view_x = x * this.m_iGridSizeX, view_y = y * this.m_iGridSizeY; //const line_pts = Array.from(document.querySelectorAll(`svg > line[x1="${view_x}"][y1="${view_y}"]`))
                //	.concat(Array.from(document.querySelectorAll(`svg > line[x2="${view_x}"][y2="${view_y}"]`)));
                //line_pts.forEach(line => {
                //	line.$SetColor(rand_color);
                //});

                pt = document.querySelector("svg > circle[cx=\"".concat(view_x, "\"][cy=\"").concat(view_y, "\"]"));

                if (pt) {
                  pt.$SetStrokeColor(rand_color);
                  pt.$SetFillColor(rand_color);
                  pt.$SetZIndex(100);
                  pt.setAttribute('r', "6");
                }

                _context24.next = 22;
                return Sleep(50);

              case 22:
                _context24.next = 14;
                break;

              case 24:
                _context24.next = 29;
                break;

              case 26:
                _context24.prev = 26;
                _context24.t0 = _context24["catch"](12);

                _iterator10.e(_context24.t0);

              case 29:
                _context24.prev = 29;

                _iterator10.f();

                return _context24.finish(29);

              case 32:
              case "end":
                return _context24.stop();
            }
          }
        }, _callee24, this, [[12, 26, 29, 32]]);
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

                _context26.t0 = $createPolyline;
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
                  var pt = fnd.$GetPosition();
                  return pt.x + ',' + pt.y;
                }).join(' ');
                (0, _context26.t0)(6, _context26.t4, 'green');
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
        var sHumanColor, rand_color, values, _iterator11, _step11, pt, _pt$$GetPosition2, view_x, view_y, x, y, pt1;

        return regeneratorRuntime.wrap(function _callee27$(_context27) {
          while (1) {
            switch (_context27.prev = _context27.next) {
              case 0:
                event.preventDefault();
                sHumanColor = this.COLOR_RED;
                rand_color = RandomColor();
                _context27.next = 5;
                return this.m_Points.values();

              case 5:
                values = _context27.sent;
                _iterator11 = _createForOfIteratorHelper(values);
                _context27.prev = 7;

                _iterator11.s();

              case 9:
                if ((_step11 = _iterator11.n()).done) {
                  _context27.next = 23;
                  break;
                }

                pt = _step11.value;

                if (!(pt !== undefined && pt.$GetFillColor() === sHumanColor && StatusEnum.POINT_FREE_RED === pt.$GetStatus())) {
                  _context27.next = 21;
                  break;
                }

                _pt$$GetPosition2 = pt.$GetPosition(), view_x = _pt$$GetPosition2.x, view_y = _pt$$GetPosition2.y;
                x = view_x / this.m_iGridSizeX, y = view_y / this.m_iGridSizeY;
                _context27.next = 16;
                return this.IsPointOutsideAllPaths(x, y);

              case 16:
                _context27.t0 = _context27.sent;

                if (!(false === _context27.t0)) {
                  _context27.next = 19;
                  break;
                }

                return _context27.abrupt("continue", 21);

              case 19:
                //const east = this.m_Points.get(y * this.m_iGridWidth + x + 1);
                //const west = this.m_Points.get(y * this.m_iGridWidth + x - 1);
                //const north = this.m_Points.get((y - 1) * this.m_iGridWidth + x);
                //const south = this.m_Points.get((y + 1) * this.m_iGridWidth + x);
                //const north_west = this.m_Points.get((y - 1) * this.m_iGridWidth + x - 1);
                //const north_east = this.m_Points.get((y - 1) * this.m_iGridWidth + x + 1);
                //const south_west = this.m_Points.get((y + 1) * this.m_iGridWidth + x - 1);
                //const south_east = this.m_Points.get((y + 1) * this.m_iGridWidth + x + 1);
                //if (east !== undefined && west !== undefined && north !== undefined && south !== undefined
                //	//&& east.$GetFillColor() === sCPUColor &&
                //	//west.$GetFillColor() === sCPUColor &&
                //	//north.$GetFillColor() === sCPUColor &&
                //	//south.$GetFillColor() === sCPUColor
                //) {
                //visualise
                pt1 = document.querySelector("svg > circle[cx=\"".concat(view_x, "\"][cy=\"").concat(view_y, "\"]"));

                if (pt1) {
                  pt1.$SetStrokeColor(rand_color);
                  pt1.$SetFillColor(rand_color);
                  pt1.setAttribute("r", "6");
                } //}


              case 21:
                _context27.next = 9;
                break;

              case 23:
                _context27.next = 28;
                break;

              case 25:
                _context27.prev = 25;
                _context27.t1 = _context27["catch"](7);

                _iterator11.e(_context27.t1);

              case 28:
                _context27.prev = 28;

                _iterator11.f();

                return _context27.finish(28);

              case 31:
              case "end":
                return _context27.stop();
            }
          }
        }, _callee27, this, [[7, 25, 28, 31]]);
      }));

      function OnTestFindFullSurroundedPoints(_x32) {
        return _OnTestFindFullSurroundedPoints.apply(this, arguments);
      }

      return OnTestFindFullSurroundedPoints;
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
     * @param {Array} ddlTestActions array of test actions button ids
     * @param {number} iTooLong2Duration how long waiting is too long
     */

  }, {
    key: "PrepareDrawing",
    value: function () {
      var _PrepareDrawing = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee28(sScreen, sPlayer2Name, sGameStatus, sSurrenderButton, sCancelPath, sPause, sStopAndDraw, sMsgInputSel, sMsgListSel, sMsgSendButtonSel, sLastMoveGameTimeStamp, ddlTestActions) {
        var iTooLong2Duration,
            boardsize,
            iClientWidth,
            iClientHeight,
            svg_width_x_height,
            stateStore,
            i,
            chatSection,
            _args28 = arguments;
        return regeneratorRuntime.wrap(function _callee28$(_context28) {
          while (1) {
            switch (_context28.prev = _context28.next) {
              case 0:
                iTooLong2Duration = _args28.length > 12 && _args28[12] !== undefined ? _args28[12] : 125;
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
                  _context28.next = 32;
                  break;
                }

                alert("no board");
                return _context28.abrupt("return");

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

                $createSVGVML(this.m_Screen, svg_width_x_height, svg_width_x_height, true);
                this.DisableSelection(this.m_Screen);
                stateStore = new GameStateStore(this.CreateScreenPointFromIndexedDb.bind(this), this.CreateScreenPathFromIndexedDb.bind(this), this.GetGameStateForIndexedDb.bind(this));
                this.m_Lines = stateStore.GetPathStore();
                this.m_Points = stateStore.GetPointStore();
                _context28.next = 55;
                return stateStore.PrepareStore(this);

              case 55:
                this.m_bPointsAndPathsLoaded = _context28.sent;

                if (this.m_bViewOnly === false) {
                  if (this.m_MouseCursorOval === null) {
                    this.m_MouseCursorOval = $createOval(this.m_PointRadius, 'true');
                    this.m_MouseCursorOval.$SetFillColor(this.m_sDotColor);
                    this.m_MouseCursorOval.$SetStrokeColor(this.m_sDotColor);
                    this.m_MouseCursorOval.$SetZIndex(-1);
                    this.m_MouseCursorOval.$Hide();
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
                    if (ddlTestActions.length > i) document.querySelector(ddlTestActions[i++]).onclick = this.OnTestFindFullSurroundedPoints.bind(this); //disable or even delete chat functionality, coz we're not going to chat with CPU bot

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

              case 57:
              case "end":
                return _context28.stop();
            }
          }
        }, _callee28, this);
      }));

      function PrepareDrawing(_x33, _x34, _x35, _x36, _x37, _x38, _x39, _x40, _x41, _x42, _x43, _x44) {
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
      var _FindRandomCPUPoint = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee29() {
        var max_random_pick_amount, x, y, cmd;
        return regeneratorRuntime.wrap(function _callee29$(_context29) {
          while (1) {
            switch (_context29.prev = _context29.next) {
              case 0:
                max_random_pick_amount = 100;

              case 1:
                if (!(--max_random_pick_amount > 0)) {
                  _context29.next = 15;
                  break;
                }

                x = this.GetRandomInt(0, this.m_iGridWidth);
                y = this.GetRandomInt(0, this.m_iGridHeight);
                _context29.next = 6;
                return this.m_Points.has(y * this.m_iGridWidth + x);

              case 6:
                _context29.t0 = !_context29.sent;

                if (!_context29.t0) {
                  _context29.next = 11;
                  break;
                }

                _context29.next = 10;
                return this.IsPointOutsideAllPaths(x, y);

              case 10:
                _context29.t0 = _context29.sent;

              case 11:
                if (!_context29.t0) {
                  _context29.next = 13;
                  break;
                }

                return _context29.abrupt("break", 15);

              case 13:
                _context29.next = 1;
                break;

              case 15:
                cmd = new InkBallPointViewModel(0, this.g_iGameID, -1
                /*player*/
                , x, y, StatusEnum.POINT_FREE_BLUE, 0);
                return _context29.abrupt("return", cmd);

              case 17:
              case "end":
                return _context29.stop();
            }
          }
        }, _callee29, this);
      }));

      function FindRandomCPUPoint() {
        return _FindRandomCPUPoint.apply(this, arguments);
      }

      return FindRandomCPUPoint;
    }()
  }, {
    key: "CalculateCPUCentroid",
    value: function () {
      var _CalculateCPUCentroid = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee30() {
        var centroidX, centroidY, count, x, y, sHumanColor, values, _iterator12, _step12, _pt, pos, tox, toy, max_random_pick_amount, pt;

        return regeneratorRuntime.wrap(function _callee30$(_context30) {
          while (1) {
            switch (_context30.prev = _context30.next) {
              case 0:
                centroidX = 0, centroidY = 0, count = 0;
                sHumanColor = this.COLOR_RED;
                _context30.next = 4;
                return this.m_Points.values();

              case 4:
                values = _context30.sent;
                _iterator12 = _createForOfIteratorHelper(values);

                try {
                  for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
                    _pt = _step12.value;

                    if (_pt !== undefined && _pt.$GetFillColor() === sHumanColor && _pt.$GetStatus() === StatusEnum.POINT_FREE_RED) {
                      pos = _pt.$GetPosition();
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
                  _context30.next = 9;
                  break;
                }

                return _context30.abrupt("return", null);

              case 9:
                x = centroidX / count;
                y = centroidY / count;
                x = x * this.m_iGridSizeX;
                y = y * this.m_iGridSizeY;
                tox = parseInt(x / this.m_iGridSizeX);
                toy = parseInt(y / this.m_iGridSizeY);
                x = tox;
                y = toy;
                max_random_pick_amount = 20;

              case 18:
                if (!(--max_random_pick_amount > 0)) {
                  _context30.next = 30;
                  break;
                }

                _context30.t0 = !this.m_Points.has(y * this.m_iGridWidth + x);

                if (!_context30.t0) {
                  _context30.next = 24;
                  break;
                }

                _context30.next = 23;
                return this.IsPointOutsideAllPaths(x, y);

              case 23:
                _context30.t0 = _context30.sent;

              case 24:
                if (!_context30.t0) {
                  _context30.next = 26;
                  break;
                }

                return _context30.abrupt("break", 30);

              case 26:
                x = this.GetRandomInt(tox - 2, tox + 3);
                y = this.GetRandomInt(toy - 2, toy + 3);
                _context30.next = 18;
                break;

              case 30:
                if (!(max_random_pick_amount <= 0)) {
                  _context30.next = 32;
                  break;
                }

                return _context30.abrupt("return", null);

              case 32:
                pt = new InkBallPointViewModel(0, this.g_iGameID, -1
                /*player*/
                , x, y, StatusEnum.POINT_FREE_BLUE, 0);
                return _context30.abrupt("return", pt);

              case 34:
              case "end":
                return _context30.stop();
            }
          }
        }, _callee30, this);
      }));

      function CalculateCPUCentroid() {
        return _CalculateCPUCentroid.apply(this, arguments);
      }

      return CalculateCPUCentroid;
    }()
  }, {
    key: "BuildGraph",
    value: function () {
      var _BuildGraph = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee32() {
        var _ref8,
            _ref8$freeStat,
            freePointStatus,
            _ref8$fillCol,
            fillColor,
            _ref8$visuals,
            presentVisually,
            graph_points,
            graph_edges,
            isPointOKForPath,
            addPointsAndEdgestoGraph,
            values,
            _iterator13,
            _step13,
            point,
            _point$$GetPosition,
            view_x,
            view_y,
            x,
            y,
            _args32 = arguments;

        return regeneratorRuntime.wrap(function _callee32$(_context32) {
          while (1) {
            switch (_context32.prev = _context32.next) {
              case 0:
                _ref8 = _args32.length > 0 && _args32[0] !== undefined ? _args32[0] : {}, _ref8$freeStat = _ref8.freeStat, freePointStatus = _ref8$freeStat === void 0 ? StatusEnum.POINT_FREE_BLUE : _ref8$freeStat, _ref8$fillCol = _ref8.fillCol, fillColor = _ref8$fillCol === void 0 ? this.COLOR_BLUE : _ref8$fillCol, _ref8$visuals = _ref8.visuals, presentVisually = _ref8$visuals === void 0 ? true : _ref8$visuals;
                graph_points = [], graph_edges = new Map();

                isPointOKForPath = function isPointOKForPath(freePointStatusArr, pt) {
                  var status = pt.$GetStatus();

                  if (freePointStatusArr.includes(status) &&
                  /*(status === StatusEnum.POINT_STARTING || status === StatusEnum.POINT_IN_PATH) && */
                  pt.$GetFillColor() === fillColor //&& graph_points.includes(pt) === false
                  ) {
                      return true;
                    }

                  return false;
                };

                addPointsAndEdgestoGraph = /*#__PURE__*/function () {
                  var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee31(point, to_x, to_y, view_x, view_y, x, y) {
                    var next, next_pos, edge, line, pt, _pt2;

                    return regeneratorRuntime.wrap(function _callee31$(_context31) {
                      while (1) {
                        switch (_context31.prev = _context31.next) {
                          case 0:
                            if (!(to_x >= 0 && to_x < this.m_iGridWidth && to_y >= 0 && to_y < this.m_iGridHeight)) {
                              _context31.next = 5;
                              break;
                            }

                            _context31.next = 3;
                            return this.m_Points.get(to_y * this.m_iGridWidth + to_x);

                          case 3:
                            next = _context31.sent;

                            if (next && isPointOKForPath([freePointStatus], next) === true) {
                              next_pos = next.$GetPosition(); //const to_x = next_pos.x / this.m_iGridSizeX, to_y = next_pos.y / this.m_iGridSizeY;

                              if (graph_edges.has("".concat(x, ",").concat(y, "_").concat(to_x, ",").concat(to_y)) === false && graph_edges.has("".concat(to_x, ",").concat(to_y, "_").concat(x, ",").concat(y)) === false) {
                                edge = {
                                  from: point,
                                  to: next
                                };

                                if (presentVisually === true) {
                                  line = $createLine(3, 'rgba(0, 255, 0, 0.3)');
                                  line.$move(view_x, view_y, next_pos.x, next_pos.y);
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
                            return _context31.stop();
                        }
                      }
                    }, _callee31, this);
                  }));

                  return function (_x45, _x46, _x47, _x48, _x49, _x50, _x51) {
                    return _ref9.apply(this, arguments);
                  };
                }().bind(this);

                _context32.next = 6;
                return this.m_Points.values();

              case 6:
                values = _context32.sent;
                _iterator13 = _createForOfIteratorHelper(values);
                _context32.prev = 8;

                _iterator13.s();

              case 10:
                if ((_step13 = _iterator13.n()).done) {
                  _context32.next = 33;
                  break;
                }

                point = _step13.value;

                if (!(point && isPointOKForPath([freePointStatus, StatusEnum.POINT_STARTING, StatusEnum.POINT_IN_PATH], point) === true)) {
                  _context32.next = 31;
                  break;
                }

                _point$$GetPosition = point.$GetPosition(), view_x = _point$$GetPosition.x, view_y = _point$$GetPosition.y;
                x = view_x / this.m_iGridSizeX, y = view_y / this.m_iGridSizeY; //TODO: await all below promises
                //east

                _context32.next = 17;
                return addPointsAndEdgestoGraph(point, x + 1, y, view_x, view_y, x, y);

              case 17:
                _context32.next = 19;
                return addPointsAndEdgestoGraph(point, x - 1, y, view_x, view_y, x, y);

              case 19:
                _context32.next = 21;
                return addPointsAndEdgestoGraph(point, x, y - 1, view_x, view_y, x, y);

              case 21:
                _context32.next = 23;
                return addPointsAndEdgestoGraph(point, x, y + 1, view_x, view_y, x, y);

              case 23:
                _context32.next = 25;
                return addPointsAndEdgestoGraph(point, x - 1, y - 1, view_x, view_y, x, y);

              case 25:
                _context32.next = 27;
                return addPointsAndEdgestoGraph(point, x + 1, y - 1, view_x, view_y, x, y);

              case 27:
                _context32.next = 29;
                return addPointsAndEdgestoGraph(point, x - 1, y + 1, view_x, view_y, x, y);

              case 29:
                _context32.next = 31;
                return addPointsAndEdgestoGraph(point, x + 1, y + 1, view_x, view_y, x, y);

              case 31:
                _context32.next = 10;
                break;

              case 33:
                _context32.next = 38;
                break;

              case 35:
                _context32.prev = 35;
                _context32.t0 = _context32["catch"](8);

                _iterator13.e(_context32.t0);

              case 38:
                _context32.prev = 38;

                _iterator13.f();

                return _context32.finish(38);

              case 41:
                return _context32.abrupt("return", {
                  vertices: graph_points,
                  edges: Array.from(graph_edges.values())
                });

              case 42:
              case "end":
                return _context32.stop();
            }
          }
        }, _callee32, this, [[8, 35, 38, 41]]);
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
                var _i$$GetPosition = i.$GetPosition(),
                    view_x = _i$$GetPosition.x,
                    view_y = _i$$GetPosition.y;

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
      var _MarkAllCycles = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee35(graph) {
        var vertices, N, cycles, mark, color, par, i, dfs_cycle, printCycles, cyclenumber, edges, vind;
        return regeneratorRuntime.wrap(function _callee35$(_context35) {
          while (1) {
            switch (_context35.prev = _context35.next) {
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
                  var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee33(u, p) {
                    var cur, vertex, _iterator15, _step15, adj, v;

                    return regeneratorRuntime.wrap(function _callee33$(_context33) {
                      while (1) {
                        switch (_context33.prev = _context33.next) {
                          case 0:
                            if (!(color[u] === 2)) {
                              _context33.next = 2;
                              break;
                            }

                            return _context33.abrupt("return");

                          case 2:
                            if (!(color[u] === 1)) {
                              _context33.next = 8;
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

                            return _context33.abrupt("return");

                          case 8:
                            par[u] = p; // partially visited.

                            color[u] = 1;
                            vertex = vertices[u];

                            if (!vertex) {
                              _context33.next = 36;
                              break;
                            }

                            vertex.$SetStrokeColor('black');
                            vertex.$SetFillColor('black'); //vertex.setAttribute("r", "6");

                            _context33.next = 16;
                            return Sleep(10);

                          case 16:
                            // simple dfs on graph
                            _iterator15 = _createForOfIteratorHelper(vertex.adjacents);
                            _context33.prev = 17;

                            _iterator15.s();

                          case 19:
                            if ((_step15 = _iterator15.n()).done) {
                              _context33.next = 28;
                              break;
                            }

                            adj = _step15.value;
                            v = vertices.indexOf(adj); // if it has not been visited previously

                            if (!(v === par[u])) {
                              _context33.next = 24;
                              break;
                            }

                            return _context33.abrupt("continue", 26);

                          case 24:
                            _context33.next = 26;
                            return dfs_cycle(v, u);

                          case 26:
                            _context33.next = 19;
                            break;

                          case 28:
                            _context33.next = 33;
                            break;

                          case 30:
                            _context33.prev = 30;
                            _context33.t0 = _context33["catch"](17);

                            _iterator15.e(_context33.t0);

                          case 33:
                            _context33.prev = 33;

                            _iterator15.f();

                            return _context33.finish(33);

                          case 36:
                            // completely visited. 
                            color[u] = 2;

                          case 37:
                          case "end":
                            return _context33.stop();
                        }
                      }
                    }, _callee33, null, [[17, 30, 33, 36]]);
                  }));

                  return function dfs_cycle(_x53, _x54) {
                    return _ref10.apply(this, arguments);
                  };
                }();

                printCycles = /*#__PURE__*/function () {
                  var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee34(edges, mark) {
                    var _this13 = this;

                    var e, mark_e, m, found_c, free_human_player_points, sHumanColor, values, _iterator16, _step16, _pt3, _pt3$$GetPosition, view_x, view_y, _x57, _y2, _pt4, tab, _i, cycl, str, trailing_points, rand_color, mapped_verts, cw_sorted_verts, _iterator17, _step17, vert, x, y, pt, tmp, comma, _iterator18, _step18, possible_intercept, pt1, pts2reset;

                    return regeneratorRuntime.wrap(function _callee34$(_context34) {
                      while (1) {
                        switch (_context34.prev = _context34.next) {
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
                            _context34.next = 6;
                            return this.m_Points.values();

                          case 6:
                            values = _context34.sent;
                            _iterator16 = _createForOfIteratorHelper(values);
                            _context34.prev = 8;

                            _iterator16.s();

                          case 10:
                            if ((_step16 = _iterator16.n()).done) {
                              _context34.next = 24;
                              break;
                            }

                            _pt3 = _step16.value;

                            if (!(_pt3 !== undefined && _pt3.$GetFillColor() === sHumanColor && StatusEnum.POINT_FREE_RED === _pt3.$GetStatus())) {
                              _context34.next = 22;
                              break;
                            }

                            _pt3$$GetPosition = _pt3.$GetPosition(), view_x = _pt3$$GetPosition.x, view_y = _pt3$$GetPosition.y;
                            _x57 = view_x / this.m_iGridSizeX, _y2 = view_y / this.m_iGridSizeY;
                            _context34.next = 17;
                            return this.IsPointOutsideAllPaths(_x57, _y2);

                          case 17:
                            _context34.t0 = _context34.sent;

                            if (!(false === _context34.t0)) {
                              _context34.next = 20;
                              break;
                            }

                            return _context34.abrupt("continue", 22);

                          case 20:
                            //check if really exists
                            _pt4 = document.querySelector("svg > circle[cx=\"".concat(view_x, "\"][cy=\"").concat(view_y, "\"]"));
                            if (_pt4) free_human_player_points.push({
                              x: _x57,
                              y: _y2
                            });

                          case 22:
                            _context34.next = 10;
                            break;

                          case 24:
                            _context34.next = 29;
                            break;

                          case 26:
                            _context34.prev = 26;
                            _context34.t1 = _context34["catch"](8);

                            _iterator16.e(_context34.t1);

                          case 29:
                            _context34.prev = 29;

                            _iterator16.f();

                            return _context34.finish(29);

                          case 32:
                            tab = []; // traverse through all the vertices with same cycle

                            _i = 0;

                          case 34:
                            if (!(_i <= cyclenumber)) {
                              _context34.next = 72;
                              break;
                            }

                            cycl = cycles[_i]; //get cycle

                            if (!(cycl && cycl.length > 0)) {
                              _context34.next = 69;
                              break;
                            }

                            //somr checks
                            // Print the i-th cycle
                            str = "Cycle Number ".concat(_i, ": "), trailing_points = [];
                            rand_color = 'var(--indigo)'; //convert to logical space

                            mapped_verts = cycl.map(function (c) {
                              var pt = vertices[c].$GetPosition();
                              return {
                                x: pt.x / this.m_iGridSizeX,
                                y: pt.y / this.m_iGridSizeY
                              };
                            }.bind(this)); //sort clockwise (https://stackoverflow.com/questions/45660743/sort-points-in-counter-clockwise-in-javascript)

                            cw_sorted_verts = sortPointsClockwise(mapped_verts); //display which cycle wea are dealing with

                            _iterator17 = _createForOfIteratorHelper(cw_sorted_verts);
                            _context34.prev = 42;

                            _iterator17.s();

                          case 44:
                            if ((_step17 = _iterator17.n()).done) {
                              _context34.next = 53;
                              break;
                            }

                            vert = _step17.value;
                            x = vert.x, y = vert.y;
                            pt = document.querySelector("svg > circle[cx=\"".concat(x * this.m_iGridSizeX, "\"][cy=\"").concat(y * this.m_iGridSizeY, "\"]"));

                            if (pt) {
                              //again some basic checks
                              str += "(".concat(x, ",").concat(y, ")");
                              pt.$SetStrokeColor(rand_color);
                              pt.$SetFillColor(rand_color);
                              pt.setAttribute("r", "6");
                            }

                            _context34.next = 51;
                            return Sleep(50);

                          case 51:
                            _context34.next = 44;
                            break;

                          case 53:
                            _context34.next = 58;
                            break;

                          case 55:
                            _context34.prev = 55;
                            _context34.t2 = _context34["catch"](42);

                            _iterator17.e(_context34.t2);

                          case 58:
                            _context34.prev = 58;

                            _iterator17.f();

                            return _context34.finish(58);

                          case 61:
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
                                    pt1.$SetStrokeColor('var(--yellow)');
                                    pt1.$SetFillColor('var(--yellow)');
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
                              pt.$SetStrokeColor(_this13.COLOR_BLUE);
                              pt.$SetFillColor(_this13.COLOR_BLUE);
                              pt.setAttribute("r", "4");
                            });

                          case 69:
                            _i++;
                            _context34.next = 34;
                            break;

                          case 72:
                            return _context34.abrupt("return", tab);

                          case 73:
                          case "end":
                            return _context34.stop();
                        }
                      }
                    }, _callee34, this, [[8, 26, 29, 32], [42, 55, 58, 61]]);
                  }));

                  return function (_x55, _x56) {
                    return _ref11.apply(this, arguments);
                  };
                }().bind(this); // store the numbers of cycle 


                cyclenumber = 0, edges = N; // call DFS to mark the cycles 

                vind = 0;

              case 10:
                if (!(vind < N)) {
                  _context35.next = 16;
                  break;
                }

                _context35.next = 13;
                return dfs_cycle(vind + 1, vind
                /*, color, mark, par*/
                );

              case 13:
                vind++;
                _context35.next = 10;
                break;

              case 16:
                _context35.next = 18;
                return printCycles(edges, mark);

              case 18:
                return _context35.abrupt("return", _context35.sent);

              case 19:
              case "end":
                return _context35.stop();
            }
          }
        }, _callee35, this);
      }));

      function MarkAllCycles(_x52) {
        return _MarkAllCycles.apply(this, arguments);
      }

      return MarkAllCycles;
    }()
  }, {
    key: "GroupPointsRecurse",
    value: function () {
      var _GroupPointsRecurse = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee36(currPointsArr, point) {
        var _point$$GetPosition2, x, y, last, last_x, last_y, last_pos, first, first_pos, _last_pos, tmp, east, west, north, south, north_west, north_east, south_west, south_east;

        return regeneratorRuntime.wrap(function _callee36$(_context36) {
          while (1) {
            switch (_context36.prev = _context36.next) {
              case 0:
                if (!(point === undefined || currPointsArr.includes(point))) {
                  _context36.next = 2;
                  break;
                }

                return _context36.abrupt("return", currPointsArr);

              case 2:
                if (!([StatusEnum.POINT_FREE_BLUE, StatusEnum.POINT_STARTING, StatusEnum.POINT_IN_PATH].includes(point.$GetStatus()) === false || point.$GetFillColor() !== this.COLOR_BLUE)) {
                  _context36.next = 4;
                  break;
                }

                return _context36.abrupt("return", currPointsArr);

              case 4:
                _point$$GetPosition2 = point.$GetPosition(), x = _point$$GetPosition2.x, y = _point$$GetPosition2.y;
                x /= this.m_iGridSizeX;
                y /= this.m_iGridSizeY;
                last = null;

                if (!(currPointsArr.length > 0)) {
                  _context36.next = 21;
                  break;
                }

                last = currPointsArr[currPointsArr.length - 1];
                last_pos = last.$GetPosition();
                last_x = last_pos.x, last_y = last_pos.y;
                last_x /= this.m_iGridSizeX;
                last_y /= this.m_iGridSizeY;

                if (!(Math.abs(parseInt(last_x - x)) <= 1 && Math.abs(parseInt(last_y - y)) <= 1)) {
                  _context36.next = 18;
                  break;
                }

                currPointsArr.push(point); //nearby point 1 jump away

                _context36.next = 19;
                break;

              case 18:
                return _context36.abrupt("return", currPointsArr);

              case 19:
                _context36.next = 22;
                break;

              case 21:
                currPointsArr.push(point);

              case 22:
                //1st starting point
                if (currPointsArr.length > 2 && last !== null) {
                  first = currPointsArr[0];
                  first_pos = first.$GetPosition();
                  first_pos.x /= this.m_iGridSizeX;
                  first_pos.y /= this.m_iGridSizeY;
                  last = currPointsArr[currPointsArr.length - 1];
                  _last_pos = last.$GetPosition();
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


                _context36.next = 25;
                return this.m_Points.get(y * this.m_iGridWidth + x + 1);

              case 25:
                east = _context36.sent;
                _context36.next = 28;
                return this.m_Points.get(y * this.m_iGridWidth + x - 1);

              case 28:
                west = _context36.sent;
                _context36.next = 31;
                return this.m_Points.get((y - 1) * this.m_iGridWidth + x);

              case 31:
                north = _context36.sent;
                _context36.next = 34;
                return this.m_Points.get((y + 1) * this.m_iGridWidth + x);

              case 34:
                south = _context36.sent;
                _context36.next = 37;
                return this.m_Points.get((y - 1) * this.m_iGridWidth + x - 1);

              case 37:
                north_west = _context36.sent;
                _context36.next = 40;
                return this.m_Points.get((y - 1) * this.m_iGridWidth + x + 1);

              case 40:
                north_east = _context36.sent;
                _context36.next = 43;
                return this.m_Points.get((y + 1) * this.m_iGridWidth + x - 1);

              case 43:
                south_west = _context36.sent;
                _context36.next = 46;
                return this.m_Points.get((y + 1) * this.m_iGridWidth + x + 1);

              case 46:
                south_east = _context36.sent;

                if (!east) {
                  _context36.next = 50;
                  break;
                }

                _context36.next = 50;
                return this.GroupPointsRecurse(currPointsArr, east);

              case 50:
                if (!west) {
                  _context36.next = 53;
                  break;
                }

                _context36.next = 53;
                return this.GroupPointsRecurse(currPointsArr, west);

              case 53:
                if (!north) {
                  _context36.next = 56;
                  break;
                }

                _context36.next = 56;
                return this.GroupPointsRecurse(currPointsArr, north);

              case 56:
                if (!south) {
                  _context36.next = 59;
                  break;
                }

                _context36.next = 59;
                return this.GroupPointsRecurse(currPointsArr, south);

              case 59:
                if (!north_west) {
                  _context36.next = 62;
                  break;
                }

                _context36.next = 62;
                return this.GroupPointsRecurse(currPointsArr, north_west);

              case 62:
                if (!north_east) {
                  _context36.next = 65;
                  break;
                }

                _context36.next = 65;
                return this.GroupPointsRecurse(currPointsArr, north_east);

              case 65:
                if (!south_west) {
                  _context36.next = 68;
                  break;
                }

                _context36.next = 68;
                return this.GroupPointsRecurse(currPointsArr, south_west);

              case 68:
                if (!south_east) {
                  _context36.next = 71;
                  break;
                }

                _context36.next = 71;
                return this.GroupPointsRecurse(currPointsArr, south_east);

              case 71:
                return _context36.abrupt("return", currPointsArr);

              case 72:
              case "end":
                return _context36.stop();
            }
          }
        }, _callee36, this);
      }));

      function GroupPointsRecurse(_x58, _x59) {
        return _GroupPointsRecurse.apply(this, arguments);
      }

      return GroupPointsRecurse;
    }()
  }, {
    key: "GroupPointsIterative",
    value: function () {
      var _GroupPointsIterative = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee37() {
        var _ref12,
            _ref12$g,
            graph,
            vertices,
            cycles,
            point,
            _iterator19,
            _step19,
            start,
            currPointsArr,
            traversed_path,
            _args37 = arguments;

        return regeneratorRuntime.wrap(function _callee37$(_context37) {
          while (1) {
            switch (_context37.prev = _context37.next) {
              case 0:
                _ref12 = _args37.length > 0 && _args37[0] !== undefined ? _args37[0] : {}, _ref12$g = _ref12.g, graph = _ref12$g === void 0 ? null : _ref12$g;

                if (graph) {
                  _context37.next = 3;
                  break;
                }

                return _context37.abrupt("return");

              case 3:
                vertices = graph.vertices, cycles = [];
                _iterator19 = _createForOfIteratorHelper(vertices);
                _context37.prev = 5;

                _iterator19.s();

              case 7:
                if ((_step19 = _iterator19.n()).done) {
                  _context37.next = 17;
                  break;
                }

                start = _step19.value;
                point = start;
                currPointsArr = [];
                _context37.next = 13;
                return this.GroupPointsRecurse(currPointsArr, point);

              case 13:
                traversed_path = _context37.sent;

                if (traversed_path.length > 0 && this.lastCycle.length > 0) {
                  cycles.push(this.lastCycle);
                  this.lastCycle = [];
                }

              case 15:
                _context37.next = 7;
                break;

              case 17:
                _context37.next = 22;
                break;

              case 19:
                _context37.prev = 19;
                _context37.t0 = _context37["catch"](5);

                _iterator19.e(_context37.t0);

              case 22:
                _context37.prev = 22;

                _iterator19.f();

                return _context37.finish(22);

              case 25:
                return _context37.abrupt("return", cycles);

              case 26:
              case "end":
                return _context37.stop();
            }
          }
        }, _callee37, this, [[5, 19, 22, 25]]);
      }));

      function GroupPointsIterative() {
        return _GroupPointsIterative.apply(this, arguments);
      }

      return GroupPointsIterative;
    }()
  }, {
    key: "rAFCallBack",
    value: function () {
      var _rAFCallBack = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee38(timeStamp) {
        var _this14 = this;

        var progress, point, centroid;
        return regeneratorRuntime.wrap(function _callee38$(_context38) {
          while (1) {
            switch (_context38.prev = _context38.next) {
              case 0:
                if (this.rAF_StartTimestamp === null) this.rAF_StartTimestamp = timeStamp;
                progress = timeStamp - this.rAF_StartTimestamp;
                point = null;
                _context38.next = 5;
                return this.CalculateCPUCentroid();

              case 5:
                centroid = _context38.sent;

                if (!(centroid !== null)) {
                  _context38.next = 10;
                  break;
                }

                point = centroid;
                _context38.next = 13;
                break;

              case 10:
                _context38.next = 12;
                return this.FindRandomCPUPoint();

              case 12:
                point = _context38.sent;

              case 13:
                if (!(point === null)) {
                  _context38.next = 17;
                  break;
                }

                if (progress < 2000) this.rAF_FrameID = window.requestAnimationFrame(this.rAFCallBack.bind(this));
                _context38.next = 19;
                break;

              case 17:
                _context38.next = 19;
                return this.SendAsyncData(point, function () {
                  _this14.m_bMouseDown = false;
                  _this14.m_bHandlingEvent = false;
                });

              case 19:
              case "end":
                return _context38.stop();
            }
          }
        }, _callee38, this);
      }));

      function rAFCallBack(_x60) {
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


window.addEventListener('load', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee39() {
  var inkBallHubName, iGameID, iPlayerID, iOtherPlayerID, bPlayingWithRed, bPlayerActive, gameType, protocol, servTimeoutMillis, isReadonly, pathAfterPointDrawAllowanceSecAmount, sLastMoveTimeStampUtcIso, game;
  return regeneratorRuntime.wrap(function _callee39$(_context39) {
    while (1) {
      switch (_context39.prev = _context39.next) {
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
          _context39.next = 17;
          return importAllModulesAsync(gameOptions);

        case 17:
          game = new InkBallGame(iGameID, iPlayerID, iOtherPlayerID, inkBallHubName, signalR.LogLevel.Warning, protocol, signalR.HttpTransportType.None, servTimeoutMillis, gameType, bPlayingWithRed, bPlayerActive, isReadonly, pathAfterPointDrawAllowanceSecAmount);
          _context39.next = 20;
          return game.PrepareDrawing('#screen', '#Player2Name', '#gameStatus', '#SurrenderButton', '#CancelPath', '#Pause', '#StopAndDraw', '#messageInput', '#messagesList', '#sendButton', sLastMoveTimeStampUtcIso, ['#TestBuildGraph', '#TestConcaveman', '#TestMarkAllCycles', '#TestGroupPoints', '#TestFindFullSurroundedPoints']);

        case 20:
          if (!(gameOptions.PointsAsJavaScriptArray !== null)) {
            _context39.next = 30;
            break;
          }

          _context39.next = 23;
          return game.StartSignalRConnection(false);

        case 23:
          if (!(game.m_bPointsAndPathsLoaded === false)) {
            _context39.next = 28;
            break;
          }

          _context39.next = 26;
          return game.SetAllPoints(gameOptions.PointsAsJavaScriptArray);

        case 26:
          _context39.next = 28;
          return game.SetAllPaths(gameOptions.PathsAsJavaScriptArray);

        case 28:
          _context39.next = 32;
          break;

        case 30:
          _context39.next = 32;
          return game.StartSignalRConnection(true);

        case 32:
          //alert('a QQ');
          document.getElementsByClassName('whichColor')[0].style.color = bPlayingWithRed ? "red" : "blue";
          game.CountPointsDebug("#debug2"); //delete window.gameOptions;

          window.game = game;

        case 35:
        case "end":
          return _context39.stop();
      }
    }
  }, _callee39);
})));
window.addEventListener('beforeunload', function () {
  if (window.game) window.game.StopSignalRConnection();
});
/******** /run code and events ********/
//export { InkBallGame };

/***/ })
/******/ ]);