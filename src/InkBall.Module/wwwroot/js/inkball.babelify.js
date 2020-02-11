"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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

var DtoMsg = function () {
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

var InkBallPointViewModel = function (_DtoMsg) {
  _inherits(InkBallPointViewModel, _DtoMsg);

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

    _this = _possibleConstructorReturn(this, _getPrototypeOf(InkBallPointViewModel).call(this));
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

      switch (point.Status) {
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

var InkBallPathViewModel = function (_DtoMsg2) {
  _inherits(InkBallPathViewModel, _DtoMsg2);

  function InkBallPathViewModel() {
    var _this2;

    var iId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var iGameId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var iPlayerId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var PointsAsString = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
    var OwnedPointsAsString = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';

    _classCallCheck(this, InkBallPathViewModel);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(InkBallPathViewModel).call(this));
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
      var msg = "(".concat(path.PointsAsString, ") [").concat(path.OwnedPointsAsString, "]");
      return "".concat(sUser, " places ").concat(msg, " path");
    }
  }]);

  return InkBallPathViewModel;
}(DtoMsg);

var PlayerJoiningCommand = function (_DtoMsg3) {
  _inherits(PlayerJoiningCommand, _DtoMsg3);

  function PlayerJoiningCommand(otherPlayerId, otherPlayerName, message) {
    var _this3;

    _classCallCheck(this, PlayerJoiningCommand);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(PlayerJoiningCommand).call(this));
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
      return join.Message;
    }
  }]);

  return PlayerJoiningCommand;
}(DtoMsg);

var PlayerSurrenderingCommand = function (_DtoMsg4) {
  _inherits(PlayerSurrenderingCommand, _DtoMsg4);

  function PlayerSurrenderingCommand(otherPlayerId, thisOrOtherPlayerSurrenders, message) {
    var _this4;

    _classCallCheck(this, PlayerSurrenderingCommand);

    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(PlayerSurrenderingCommand).call(this));
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
      return surrender.Message;
    }
  }]);

  return PlayerSurrenderingCommand;
}(DtoMsg);

var PingCommand = function (_DtoMsg5) {
  _inherits(PingCommand, _DtoMsg5);

  function PingCommand() {
    var _this5;

    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    _classCallCheck(this, PingCommand);

    _this5 = _possibleConstructorReturn(this, _getPrototypeOf(PingCommand).call(this));
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
      var txt = ping.Message;
      return sUser + " says '" + txt + "'";
    }
  }]);

  return PingCommand;
}(DtoMsg);

var WinCommand = function (_DtoMsg6) {
  _inherits(WinCommand, _DtoMsg6);

  function WinCommand() {
    var _this6;

    var status = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : WinStatusEnum.NO_WIN;
    var winningPlayerId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var message = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'null';

    _classCallCheck(this, WinCommand);

    _this6 = _possibleConstructorReturn(this, _getPrototypeOf(WinCommand).call(this));
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

      switch (win.Status) {
        case WinStatusEnum.RED_WINS:
          msg = 'red.';
          break;

        case WinStatusEnum.GREEN_WINS:
          msg = 'green.';
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

var StopAndDrawCommand = function (_DtoMsg7) {
  _inherits(StopAndDrawCommand, _DtoMsg7);

  function StopAndDrawCommand() {
    _classCallCheck(this, StopAndDrawCommand);

    return _possibleConstructorReturn(this, _getPrototypeOf(StopAndDrawCommand).call(this));
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

var PlayerPointsAndPathsDTO = function (_DtoMsg8) {
  _inherits(PlayerPointsAndPathsDTO, _DtoMsg8);

  function PlayerPointsAndPathsDTO() {
    var _this7;

    var points = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var paths = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    _classCallCheck(this, PlayerPointsAndPathsDTO);

    _this7 = _possibleConstructorReturn(this, _getPrototypeOf(PlayerPointsAndPathsDTO).call(this));
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
      var serialized = '{ "Points": ' + ppDTO.Points + ', "Paths": ' + ppDTO.Paths + ' }';
      var path_and_point = JSON.parse(serialized);
      return path_and_point;
    }
  }]);

  return PlayerPointsAndPathsDTO;
}(DtoMsg);

var ApplicationUserSettings = function (_DtoMsg9) {
  _inherits(ApplicationUserSettings, _DtoMsg9);

  function ApplicationUserSettings() {
    var _this8;

    var desktopNotifications = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    _classCallCheck(this, ApplicationUserSettings);

    _this8 = _possibleConstructorReturn(this, _getPrototypeOf(ApplicationUserSettings).call(this));
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

var CountdownTimer = function () {
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

function CountPointsDebug(sSelector2Set) {
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

function LocalLog(msg) {
  console.log(msg);
}

function LocalError(msg) {
  console.error(msg);
}

var InkBallGame = function () {
  function InkBallGame(sHubName, loggingLevel, hubProtocol, transportType, serverTimeoutInMilliseconds, tokenFactory, gameType) {
    var _this9 = this;

    var bIsPlayingWithRed = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : true;
    var bIsPlayerActive = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : true;
    var BoardSize = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : {
      width: 32,
      height: 32
    };
    var bViewOnly = arguments.length > 10 && arguments[10] !== undefined ? arguments[10] : false;
    var pathAfterPointDrawAllowanceSecAmount = arguments.length > 11 && arguments[11] !== undefined ? arguments[11] : 60;
    var iTooLong2Duration = arguments.length > 12 && arguments[12] !== undefined ? arguments[12] : 125;

    _classCallCheck(this, InkBallGame);

    this.g_iGameID = null;
    this.g_iPlayerID = null;
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
    this.m_iTooLong2Duration = iTooLong2Duration;
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
    this.m_BoardSize = BoardSize;
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
    this.m_Lines = [];
    this.m_Points = new Map();
    this.m_bViewOnly = bViewOnly;
    this.m_MouseCursorOval = null;
    this.m_ApplicationUserSettings = null;
    if (sHubName === null || sHubName === "") return;
    this.g_SignalRConnection = new signalR.HubConnectionBuilder().withUrl(sHubName, {
      transport: transportType,
      accessTokenFactory: tokenFactory
    }).withHubProtocol(hubProtocol).configureLogging(loggingLevel).build();
    this.g_SignalRConnection.serverTimeoutInMilliseconds = serverTimeoutInMilliseconds;
    this.g_SignalRConnection.onclose(function () {
      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(err) {
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
                  }, 4000 + _this9.iExponentialBackOffMillis * Math.max(_this9.iConnErrCount, 5));
                }

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref3.apply(this, arguments);
      };
    }());
  }

  _createClass(InkBallGame, [{
    key: "GetPlayerPointsAndPaths",
    value: function () {
      var _GetPlayerPointsAndPaths = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (this.m_bPointsAndPathsLoaded) {
                  _context2.next = 5;
                  break;
                }

                _context2.next = 3;
                return this.g_SignalRConnection.invoke("GetPlayerPointsAndPaths", this.m_bViewOnly, this.g_iGameID).then(function (ppDTO) {
                  var path_and_point = PlayerPointsAndPathsDTO.Deserialize(ppDTO);
                  if (path_and_point.Points !== undefined) this.SetAllPoints(path_and_point.Points);
                  if (path_and_point.Paths !== undefined) this.SetAllPaths2(path_and_point.Paths);
                  this.m_bPointsAndPathsLoaded = true;
                  return true;
                }.bind(this));

              case 3:
                _context2.next = 6;
                break;

              case 5:
                return _context2.abrupt("return", false);

              case 6:
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
      var _Connect = _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
        var _this10 = this;

        var json, settings;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                _context5.next = 3;
                return this.g_SignalRConnection.start();

              case 3:
                this.iConnErrCount = 0;
                LocalLog('connected; iConnErrCount = ' + this.iConnErrCount);

                if (!(this.m_bViewOnly === false)) {
                  _context5.next = 14;
                  break;
                }

                if (!(sessionStorage.getItem("ApplicationUserSettings") === null)) {
                  _context5.next = 11;
                  break;
                }

                _context5.next = 9;
                return this.g_SignalRConnection.invoke("GetUserSettings").then(function (settings) {
                  LocalLog(settings);

                  if (settings) {
                    settings = ApplicationUserSettings.Deserialize(settings);
                    var to_store = ApplicationUserSettings.Serialize(settings);
                    sessionStorage.setItem("ApplicationUserSettings", to_store);
                  }

                  return settings;
                }.bind(this)).then(function () {
                  var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(settings) {
                    return regeneratorRuntime.wrap(function _callee3$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            this.m_ApplicationUserSettings = new ApplicationUserSettings(settings.DesktopNotifications);
                            _context3.next = 3;
                            return this.GetPlayerPointsAndPaths();

                          case 3:
                            return _context3.abrupt("return", _context3.sent);

                          case 4:
                          case "end":
                            return _context3.stop();
                        }
                      }
                    }, _callee3, this);
                  }));

                  return function (_x2) {
                    return _ref4.apply(this, arguments);
                  };
                }().bind(this)).then(_asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
                  return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                      switch (_context4.prev = _context4.next) {
                        case 0:
                        case "end":
                          return _context4.stop();
                      }
                    }
                  }, _callee4);
                })));

              case 9:
                _context5.next = 14;
                break;

              case 11:
                json = sessionStorage.getItem("ApplicationUserSettings");
                settings = ApplicationUserSettings.Deserialize(json);
                this.m_ApplicationUserSettings = new ApplicationUserSettings(settings.DesktopNotifications);

              case 14:
                if (this.m_bPointsAndPathsLoaded) {
                  _context5.next = 17;
                  break;
                }

                _context5.next = 17;
                return this.GetPlayerPointsAndPaths();

              case 17:
                if (this.m_ApplicationUserSettings !== null && this.m_ApplicationUserSettings.DesktopNotifications === true) {
                  this.SetupNotifications();
                }

                _context5.next = 26;
                break;

              case 20:
                _context5.prev = 20;
                _context5.t0 = _context5["catch"](0);
                LocalError(_context5.t0 + '; iConnErrCount = ' + this.iConnErrCount);
                this.m_Screen.style.cursor = "not-allowed";
                this.iConnErrCount++;
                setTimeout(function () {
                  return _this10.Connect();
                }, 4000 + this.iExponentialBackOffMillis * Math.max(this.iConnErrCount, 5));

              case 26:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this, [[0, 20]]);
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
        if (Notification.permission === 'granted') {
          return true;
        } else {
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
        if (Notification.permission === 'granted') {
          new Notification(title, {
            body: body,
            icon: '../img/homescreen.webp'
          });
          return true;
        } else {
          Notification.requestPermission().then(function (p) {
            if (p === 'granted') {
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
  }, {
    key: "StartSignalRConnection",
    value: function StartSignalRConnection(iGameID, iPlayerID, loadPointsAndPathsFromSignalR, sMsgListSel, sMsgSendButtonSel, sMsgInputSel) {
      if (this.g_SignalRConnection === null) return;
      this.g_iGameID = iGameID;
      this.g_iPlayerID = iPlayerID;
      this.m_sMsgInputSel = sMsgInputSel;
      this.m_sMsgSendButtonSel = sMsgSendButtonSel;
      this.m_bPointsAndPathsLoaded = !loadPointsAndPathsFromSignalR;
      this.g_SignalRConnection.on("ServerToClientPoint", function (point) {
        var user = this.m_Player2Name.innerHTML;
        var encodedMsg = InkBallPointViewModel.Format(user, point);
        var li = document.createElement("li");
        li.textContent = encodedMsg;
        document.querySelector(sMsgListSel).appendChild(li);
        this.ReceivedPointProcessing(point);
        this.NotifyBrowser('New Point', encodedMsg);
      }.bind(this));
      this.g_SignalRConnection.on("ServerToClientPath", function (dto) {
        if (Object.prototype.hasOwnProperty.call(dto, 'PointsAsString')) {
          var path = dto;
          var user = this.m_Player2Name.innerHTML;
          var encodedMsg = InkBallPathViewModel.Format(user, path);
          var li = document.createElement("li");
          li.textContent = encodedMsg;
          document.querySelector(sMsgListSel).appendChild(li);
          this.ReceivedPathProcessing(path);
          this.NotifyBrowser('New Path', encodedMsg);
        } else if (Object.prototype.hasOwnProperty.call(dto, 'WinningPlayerId')) {
          var win = dto;

          var _encodedMsg = WinCommand.Format(win);

          var _li = document.createElement("li");

          _li.textContent = _encodedMsg;
          document.querySelector(sMsgListSel).appendChild(_li);
          this.ReceivedWinProcessing(win);
          this.NotifyBrowser('We have a winner', _encodedMsg);
        } else throw new Error("ServerToClientPath bad GetKind!");
      }.bind(this));
      this.g_SignalRConnection.on("ServerToClientPlayerJoin", function (join) {
        var encodedMsg = PlayerJoiningCommand.Format(join);
        var li = document.createElement("li");
        li.innerHTML = "<strong class=\"text-primary\">".concat(encodedMsg, "</strong>");
        document.querySelector(sMsgListSel).appendChild(li);

        if (this.m_SurrenderButton !== null) {
          if (join.OtherPlayerName !== '') {
            this.m_Player2Name.innerHTML = join.OtherPlayerName;
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
        document.querySelector(sMsgListSel).appendChild(li);
        this.m_bHandlingEvent = false;
        encodedMsg = encodedMsg === '' ? 'Game interrupted!' : encodedMsg;
        this.NotifyBrowser('Game interruption', encodedMsg);
        alert(encodedMsg);
        window.location.href = "Games";
      }.bind(this));
      this.g_SignalRConnection.on("ServerToClientPlayerWin", function (win) {
        var encodedMsg = WinCommand.Format(win);
        var li = document.createElement("li");
        li.innerHTML = "<strong class=\"text-warning\">".concat(encodedMsg, "</strong>");
        document.querySelector(sMsgListSel).appendChild(li);
        this.ReceivedWinProcessing(win);
        this.NotifyBrowser('We have a winner', encodedMsg);
      }.bind(this));
      this.g_SignalRConnection.on("ServerToClientPing", function (ping) {
        var user = this.m_Player2Name.innerHTML;
        var encodedMsg = PingCommand.Format(user, ping);
        var li = document.createElement("li");
        li.textContent = encodedMsg;
        document.querySelector(sMsgListSel).appendChild(li);
        this.NotifyBrowser('User Message', encodedMsg);
      }.bind(this));
      this.g_SignalRConnection.on("ServerToClientOtherPlayerDisconnected", function (sMsg) {
        var opts = {
          countdownSeconds: 5,
          initialStart: true,
          countdownReachedHandler: function () {
            var encodedMsg = sMsg;
            var li = document.createElement("li");
            li.innerHTML = "<strong class=\"text-warning\">".concat(encodedMsg, "</strong>");
            document.querySelector(sMsgListSel).appendChild(li);
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
          document.querySelector(sMsgListSel).appendChild(li);
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
        document.querySelector(sMsgListSel).appendChild(li);
        this.NotifyBrowser('User ' + user + ' started drawing new path', encodedMsg);
      }.bind(this));
      document.querySelector(this.m_sMsgSendButtonSel).addEventListener("click", function (event) {
        event.preventDefault();
        var encodedMsg = document.querySelector(this.m_sMsgInputSel).value.trim();
        if (encodedMsg === '') return;
        var ping = new PingCommand(encodedMsg);
        this.SendAsyncData(ping);
      }.bind(this), false);
      document.querySelector(this.m_sMsgInputSel).addEventListener("keyup", function (event) {
        event.preventDefault();

        if (event.keyCode === 13) {
          document.querySelector(this.m_sMsgSendButtonSel).click();
        }
      }.bind(this), false);
      this.Connect();
    }
  }, {
    key: "StopSignalRConnection",
    value: function StopSignalRConnection() {
      if (this.g_SignalRConnection !== null) {
        this.g_SignalRConnection.stop();
        if (this.m_ReconnectTimer) this.m_ReconnectTimer.Stop();
        if (this.m_Timer) this.m_Timer.Stop();
        LocalLog('Stopped SignalR connection');
      }
    }
  }, {
    key: "Debug",
    value: function Debug() {
      var d;

      switch (arguments.length) {
        case 1:
          this.m_Debug.innerHTML = arguments.length <= 0 ? undefined : arguments[0];
          break;

        case 2:
          d = document.getElementById('debug' + (arguments.length <= 1 ? undefined : arguments[1]));
          d.innerHTML = arguments.length <= 0 ? undefined : arguments[0];
          break;

        default:
          for (var i = 0; i < arguments.length; i++) {
            var msg = i < 0 || arguments.length <= i ? undefined : arguments[i];

            if (msg) {
              d = document.getElementById('debug' + i);
              if (d) d.innerHTML = msg;
            }
          }

          break;
      }
    }
  }, {
    key: "DisableSelection",
    value: function DisableSelection(Target) {
      if (_typeof(Target.onselectstart) !== undefined) Target.onselectstart = function () {
          return false;
        };else if (_typeof(Target.style.MozUserSelect) !== undefined) Target.style.MozUserSelect = "none";else Target.onmousedown = function () {
          return false;
        };
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
    value: function SetPoint(iX, iY, iStatus, iPlayerId) {
      if (this.m_Points.has(iY * this.m_iGridWidth + iX)) return;
      var x = iX * this.m_iGridSizeX;
      var y = iY * this.m_iGridSizeY;
      var oval = $createOval(this.m_PointRadius, 'true');
      oval.$move(x, y, this.m_PointRadius);
      var color;

      switch (iStatus) {
        case StatusEnum.POINT_FREE_RED:
          color = this.COLOR_RED;
          oval.$SetStatus(iStatus);
          break;

        case StatusEnum.POINT_FREE_BLUE:
          color = this.COLOR_BLUE;
          oval.$SetStatus(iStatus);
          break;

        case StatusEnum.POINT_FREE:
          color = this.m_sDotColor;
          oval.$SetStatus(iStatus);
          console.warn('TODO: generic FREE point, really? change it!');
          break;

        case StatusEnum.POINT_STARTING:
          color = this.m_sDotColor;
          oval.$SetStatus(iStatus);
          break;

        case StatusEnum.POINT_IN_PATH:
          if (this.g_iPlayerID === iPlayerId) color = this.m_bIsPlayingWithRed === true ? this.COLOR_RED : this.COLOR_BLUE;else color = this.m_bIsPlayingWithRed === true ? this.COLOR_BLUE : this.COLOR_RED;
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
      oval.$SetStrokeColor(color);
      this.m_Points.set(iY * this.m_iGridWidth + iX, oval);
    }
  }, {
    key: "SetAllPoints",
    value: function SetAllPoints(points) {
      var _this11 = this;

      points.forEach(function (p) {
        _this11.SetPoint(p[0], p[1], p[2], p[3]);
      });
    }
  }, {
    key: "SetPath",
    value: function SetPath(packed, bIsRed, bBelong2ThisPlayer) {
      var iPathId = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      var sPoints = packed.split(" ");
      var sDelimiter = "",
          sPathPoints = "",
          p = null,
          x,
          y,
          status = StatusEnum.POINT_STARTING;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = sPoints[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _packed = _step.value;
          p = _packed.split(",");
          x = parseInt(p[0]);
          y = parseInt(p[1]);
          p = this.m_Points.get(y * this.m_iGridWidth + x);

          if (p !== null && p !== undefined) {
            p.$SetStatus(status);
            status = StatusEnum.POINT_IN_PATH;
          } else {
            debugger;
          }

          x *= this.m_iGridSizeX;
          y *= this.m_iGridSizeY;
          sPathPoints += "".concat(sDelimiter).concat(x, ",").concat(y);
          sDelimiter = " ";
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      p = sPoints[0].split(",");
      x = parseInt(p[0]);
      y = parseInt(p[1]);
      p = this.m_Points.get(y * this.m_iGridWidth + x);

      if (p !== null && p !== undefined) {
        p.$SetStatus(status);
      } else {
        debugger;
      }

      x *= this.m_iGridSizeX;
      y *= this.m_iGridSizeY;
      sPathPoints += "".concat(sDelimiter).concat(x, ",").concat(y);
      var line = $createPolyline(3, sPathPoints, bBelong2ThisPlayer ? this.m_sDotColor : bIsRed ? this.COLOR_BLUE : this.COLOR_RED);
      line.$SetID(iPathId);
      this.m_Lines.push(line);
    }
  }, {
    key: "SetAllPaths2",
    value: function SetAllPaths2(packedPaths) {
      var _this12 = this;

      packedPaths.forEach(function (unpacked) {
        if (unpacked.iGameId !== _this12.g_iGameID) throw new Error("Bad game from path!");

        _this12.SetPath(unpacked.PointsAsString, _this12.m_bIsPlayingWithRed, unpacked.iPlayerId === _this12.g_iPlayerID, unpacked.iId);
      });
    }
  }, {
    key: "IsPointBelongingToLine",
    value: function IsPointBelongingToLine(sPoints, iX, iY) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = sPoints[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var packed = _step2.value;
          var pnt = packed.split(",");
          var x = pnt[0],
              y = pnt[1];
          if (x === iX && y === iY) return true;
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return false;
    }
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
    value: function SurroundOponentPoints() {
      var points = this.m_Line.$GetPointsArray();
      var unique_hashset = new Set();
      var hasDuplicates = points.slice(0, -1).some(function (pt) {
        return unique_hashset.size === unique_hashset.add(pt.x + '_' + pt.y).size;
      });

      if (hasDuplicates || !(points[0].x === points[points.length - 1].x && points[0].y === points[points.length - 1].y)) {
        return {
          OwnedPoints: undefined,
          owned: "",
          path: "",
          revertFillColor: undefined,
          revertStatus: undefined,
          revertStrokeColor: undefined
        };
      }

      var sColor = this.m_sDotColor === this.COLOR_RED ? this.COLOR_BLUE : this.COLOR_RED;
      var owned_by = this.m_sDotColor === this.COLOR_RED ? StatusEnum.POINT_OWNED_BY_RED : StatusEnum.POINT_OWNED_BY_BLUE;
      var sOwnedCol = this.m_sDotColor === this.COLOR_RED ? this.COLOR_OWNED_RED : this.COLOR_OWNED_BLUE;
      var x,
          y,
          sPathPoints = "",
          sOwnedPoints = "",
          sDelimiter = "",
          ownedPoints = [],
          pathPoints = [];
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.m_Points.values()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var pt = _step3.value;

          if (pt !== undefined && pt.$GetFillColor() === sColor && (pt.$GetStatus() === StatusEnum.POINT_FREE_BLUE || pt.$GetStatus() === StatusEnum.POINT_FREE_RED)) {
            var pos = pt.$GetPosition();
            x = pos.x;
            y = pos.y;

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
              pt.$SetStatus(owned_by);
              pt.$SetFillColor(sOwnedCol);
              pt.$SetStrokeColor(sOwnedCol);
            }
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      if (sOwnedPoints !== "") {
        sPathPoints = points.map(function (pt) {
          x = pt.x;
          y = pt.y;
          if (x === null || y === null) return '';
          x /= this.m_iGridSizeX;
          y /= this.m_iGridSizeY;
          return "".concat(x, ",").concat(y);
        }.bind(this)).join(' ');
      }

      return {
        OwnedPoints: ownedPoints,
        owned: sOwnedPoints,
        PathPoints: pathPoints,
        path: sPathPoints
      };
    }
  }, {
    key: "IsPointOutsideAllPaths",
    value: function IsPointOutsideAllPaths(iX, iY) {
      var xmul = iX * this.m_iGridSizeX,
          ymul = iY * this.m_iGridSizeY;
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = this.m_Lines[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var line = _step4.value;
          var points = line.$GetPointsArray();
          if (false !== this.pnpoly2(points, xmul, ymul)) return false;
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
            _iterator4["return"]();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      return true;
    }
  }, {
    key: "CreateXMLWaitForPlayerRequest",
    value: function CreateXMLWaitForPlayerRequest() {}
  }, {
    key: "CreateXMLPutPointRequest",
    value: function CreateXMLPutPointRequest(iX, iY) {
      var cmd = new InkBallPointViewModel(0, this.g_iGameID, this.g_iPlayerID, iX, iY, this.m_bIsPlayingWithRed ? StatusEnum.POINT_FREE_RED : StatusEnum.POINT_FREE_BLUE, 0);
      return cmd;
    }
  }, {
    key: "CreateXMLPutPathRequest",
    value: function CreateXMLPutPathRequest(dto) {
      var cmd = new InkBallPathViewModel(0, this.g_iGameID, this.g_iPlayerID, dto.path, dto.owned);
      return cmd;
    }
  }, {
    key: "SendAsyncData",
    value: function SendAsyncData(payload) {
      var revertFunction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

      switch (payload.GetKind()) {
        case CommandKindEnum.POINT:
          LocalLog(InkBallPointViewModel.Format('some player', payload));
          this.m_bHandlingEvent = true;
          this.g_SignalRConnection.invoke("ClientToServerPoint", payload).then(function (point) {
            this.ReceivedPointProcessing(point);
          }.bind(this))["catch"](function (err) {
            LocalError(err.toString());
            if (revertFunction !== undefined) revertFunction();
          }.bind(this));
          break;

        case CommandKindEnum.PATH:
          LocalLog(InkBallPathViewModel.Format('some player', payload));
          this.m_bHandlingEvent = true;
          this.g_SignalRConnection.invoke("ClientToServerPath", payload).then(function (dto) {
            if (Object.prototype.hasOwnProperty.call(dto, 'WinningPlayerId')) {
              var win = dto;
              this.ReceivedWinProcessing(win);
            } else if (Object.prototype.hasOwnProperty.call(dto, 'PointsAsString')) {
              var path = dto;
              this.ReceivedPathProcessing(path);
            } else throw new Error("ClientToServerPath bad GetKind!");
          }.bind(this))["catch"](function (err) {
            LocalError(err.toString());
            if (revertFunction !== undefined) revertFunction();
          }.bind(this));
          break;

        case CommandKindEnum.PING:
          this.g_SignalRConnection.invoke("ClientToServerPing", payload).then(function () {
            document.querySelector(this.m_sMsgInputSel).value = '';
            document.querySelector(this.m_sMsgSendButtonSel).disabled = 'disabled';
          }.bind(this))["catch"](function (err) {
            LocalError(err.toString());
          });
          break;

        case CommandKindEnum.STOP_AND_DRAW:
          this.g_SignalRConnection.invoke("ClientToServerStopAndDraw", payload).then(function () {
            this.m_bDrawLines = true;
            this.m_iLastX = this.m_iLastY = -1;
            this.m_Line = null;
            this.m_bIsPlayerActive = true;
            this.m_StopAndDraw.disabled = 'disabled';
          }.bind(this))["catch"](function (err) {
            LocalError(err.toString());
          });
          break;

        default:
          LocalError('unknown object');
          break;
      }
    }
  }, {
    key: "CountDownReachedHandler",
    value: function CountDownReachedHandler(label) {
      if (label) label.innerHTML = '';
      this.m_StopAndDraw.disabled = this.m_CancelPath.disabled = 'disabled';
      this.m_Timer = null;
      this.m_bIsPlayerActive = false;
    }
  }, {
    key: "ReceivedPointProcessing",
    value: function ReceivedPointProcessing(point) {
      var x = point.iX,
          y = point.iY,
          iStatus = point.Status;
      this.SetPoint(x, y, iStatus, point.iPlayerId);

      if (this.g_iPlayerID !== point.iPlayerId) {
        this.m_bIsPlayerActive = true;
        this.ShowMobileStatus('Oponent has moved, your turn');
        this.m_Screen.style.cursor = "crosshair";
        if (this.m_Line !== null) this.OnCancelClick();
        this.m_StopAndDraw.disabled = '';
        if (!this.m_bDrawLines) this.m_StopAndDraw.value = 'Draw line';else this.m_StopAndDraw.value = 'Draw dot';

        if (this.m_Timer) {
          this.m_Timer.Stop();
          this.m_Timer = null;
        }
      } else {
        this.m_bIsPlayerActive = false;
        this.ShowMobileStatus('Waiting for oponent move');
        this.m_Screen.style.cursor = "wait";
        this.m_CancelPath.disabled = 'disabled';
        this.m_StopAndDraw.disabled = '';
        this.m_StopAndDraw.value = 'Stop and Draw';
        if (this.m_Timer) this.m_Timer.Reset(this.m_TimerOpts);else this.m_Timer = new CountdownTimer(this.m_TimerOpts);
      }

      this.m_bHandlingEvent = false;
    }
  }, {
    key: "ReceivedPathProcessing",
    value: function ReceivedPathProcessing(path) {
      if (this.g_iPlayerID !== path.iPlayerId) {
        var str_path = path.PointsAsString,
            owned = path.OwnedPointsAsString;
        this.SetPath(str_path, this.m_sDotColor === this.COLOR_RED ? true : false, false, path.iId);
        var points = owned.split(" ");
        var point_status = this.m_sDotColor === this.COLOR_RED ? StatusEnum.POINT_OWNED_BY_RED : StatusEnum.POINT_OWNED_BY_BLUE;
        var sOwnedCol = this.m_sDotColor === this.COLOR_RED ? this.COLOR_OWNED_RED : this.COLOR_OWNED_BLUE;
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = points[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var packed = _step5.value;
            var p = packed.split(",");
            var x = parseInt(p[0]),
                y = parseInt(p[1]);
            p = this.m_Points.get(y * this.m_iGridWidth + x);

            if (p !== undefined) {
              p.$SetStatus(point_status);
              p.$SetFillColor(sOwnedCol);
              p.$SetStrokeColor(sOwnedCol);
            } else {
              debugger;
            }
          }
        } catch (err) {
          _didIteratorError5 = true;
          _iteratorError5 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
              _iterator5["return"]();
            }
          } finally {
            if (_didIteratorError5) {
              throw _iteratorError5;
            }
          }
        }

        this.m_bIsPlayerActive = true;
        this.ShowMobileStatus('Oponent has moved, your turn');
        this.m_Screen.style.cursor = "crosshair";
        if (this.m_Line !== null) this.OnCancelClick();
        this.m_StopAndDraw.disabled = '';
      } else {
        var _points = this.m_Line.$GetPointsArray();

        var _x3 = _points[0].x,
            _y = _points[0].y;
        _x3 /= this.m_iGridSizeX;
        _y /= this.m_iGridSizeY;
        var p0 = this.m_Points.get(_y * this.m_iGridWidth + _x3);
        if (p0 !== undefined) p0.$SetStatus(StatusEnum.POINT_IN_PATH);else {
          debugger;
        }
        this.m_Line.$SetWidthAndColor(3, this.m_sDotColor);
        this.m_Line.$SetID(path.iId);
        this.m_Lines.push(this.m_Line);
        this.m_iLastX = this.m_iLastY = -1;
        this.m_Line = null;
        this.m_bIsPlayerActive = false;
        this.ShowMobileStatus('Waiting for oponent move');
        this.m_Screen.style.cursor = "wait";
        this.m_StopAndDraw.disabled = this.m_CancelPath.disabled = 'disabled';
      }

      if (!this.m_bDrawLines) this.m_StopAndDraw.value = 'Draw line';else this.m_StopAndDraw.value = 'Draw dot';
      this.m_bHandlingEvent = false;

      if (this.m_Timer) {
        this.m_Timer.Stop();
        this.m_Timer = null;
      }
    }
  }, {
    key: "ReceivedWinProcessing",
    value: function ReceivedWinProcessing(win) {
      this.ShowMobileStatus('Win situation');
      this.m_bHandlingEvent = false;
      var encodedMsg = WinCommand.Format(win);

      if ((win.Status === WinStatusEnum.RED_WINS || win.Status === WinStatusEnum.GREEN_WINS) && win.WinningPlayerId > 0 || win.Status === WinStatusEnum.DRAW_WIN) {
        alert(encodedMsg === '' ? 'Game won!' : encodedMsg);
        window.location.href = "Games";
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

        case GameTypeEnum.FIRST_5_PATHS:
          if (otherPlayerPaths.length >= 5) {
            if (this.m_bIsPlayingWithRed) return WinStatusEnum.GREEN_WINS;else return WinStatusEnum.RED_WINS;
          }

          if (playerPaths.length >= 5) {
            if (this.m_bIsPlayingWithRed) return WinStatusEnum.RED_WINS;else return WinStatusEnum.GREEN_WINS;
          }

          return WinStatusEnum.NO_WIN;

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
    value: function OnMouseMove(event) {
      var _this13 = this;

      if (!this.m_bIsPlayerActive || this.m_Player2Name.innerHTML === '???' || this.m_bHandlingEvent === true || this.iConnErrCount > 0) {
        if (this.iConnErrCount <= 0 && !this.m_bIsPlayerActive) {
          this.m_Screen.style.cursor = "wait";
        }

        return;
      }

      var x = (event ? event.clientX : window.event.clientX) - this.m_Screen.offsetLeft + this.f_scrollLeft() + 0.5 * this.m_iGridSizeX;
      var y = (event ? event.clientY : window.event.clientY) - this.m_Screen.offsetTop + this.f_scrollTop() + 0.5 * this.m_iGridSizeY;
      x = parseInt(x / this.m_iGridSizeX);
      y = parseInt(y / this.m_iGridSizeY);
      var tox = x * this.m_iGridSizeX;
      var toy = y * this.m_iGridSizeY;
      this.m_MouseCursorOval.$move(tox, toy, this.m_PointRadius);
      this.m_MouseCursorOval.$Show();
      this.Debug("[".concat(x, ",").concat(y, "]"), 1);

      if (this.m_bDrawLines) {
        if (this.m_Line !== null) this.m_Screen.style.cursor = "move";else this.m_Screen.style.cursor = "crosshair";

        if (this.m_bMouseDown === true) {
          if ((this.m_iLastX !== x || this.m_iLastY !== y) && Math.abs(parseInt(this.m_iLastX - x)) <= 1 && Math.abs(parseInt(this.m_iLastY - y)) <= 1 && this.m_iLastX >= 0 && this.m_iLastY >= 0) {
            if (this.m_Line !== null) {
              var p0 = this.m_Points.get(this.m_iLastY * this.m_iGridWidth + this.m_iLastX);
              var p1 = this.m_Points.get(y * this.m_iGridWidth + x);
              this.m_CancelPath.disabled = this.m_Line.$GetLength() >= 2 ? '' : 'disabled';

              if (p0 !== undefined && p1 !== undefined && p0.$GetFillColor() === this.m_sDotColor && p1.$GetFillColor() === this.m_sDotColor) {
                var line_contains_point = this.m_Line.$ContainsPoint(tox, toy);

                if (line_contains_point < 1 || line_contains_point === 1 && p1.$GetStatus() === StatusEnum.POINT_STARTING) {
                  this.m_Line.$AppendPoints(tox, toy);
                  if (p1.$GetStatus() !== StatusEnum.POINT_STARTING) p1.$SetStatus(StatusEnum.POINT_IN_PATH);else {
                    var val = this.SurroundOponentPoints();

                    if (val.owned.length > 0) {
                      this.Debug('Closing path', 0);
                      this.SendAsyncData(this.CreateXMLPutPathRequest(val), function () {
                        _this13.OnCancelClick();

                        val.OwnedPoints.forEach(function (revData) {
                          var p = revData.point;
                          var revertStatus = revData.revertStatus;
                          var revertFillColor = revData.revertFillColor;
                          var revertStrokeColor = revData.revertStrokeColor;
                          p.$SetStatus(revertStatus);
                          p.$SetFillColor(revertFillColor);
                          p.$SetStrokeColor(revertStrokeColor);
                        });
                        _this13.m_bHandlingEvent = false;
                      });
                    } else this.Debug('Wrong path, cancell it or refresh page', 0);
                  }
                  this.m_iLastX = x;
                  this.m_iLastY = y;
                } else if (line_contains_point >= 1 && p0.$GetStatus() === StatusEnum.POINT_IN_PATH && this.m_Line.$GetPointsString().endsWith("".concat(this.m_iLastX * this.m_iGridSizeX, ",").concat(this.m_iLastY * this.m_iGridSizeY))) {
                  if (this.m_Line.$GetLength() > 2) {
                    p0.$RevertOldStatus();
                    this.m_Line.$RemoveLastPoint();
                    this.m_iLastX = x;
                    this.m_iLastY = y;
                  } else this.OnCancelClick();
                }
              }
            } else {
              var _p = this.m_Points.get(this.m_iLastY * this.m_iGridWidth + this.m_iLastX);

              var _p2 = this.m_Points.get(y * this.m_iGridWidth + x);

              if (_p !== undefined && _p2 !== undefined && _p.$GetStatus() !== StatusEnum.POINT_IN_PATH && _p2.$GetStatus() !== StatusEnum.POINT_IN_PATH && _p.$GetFillColor() === this.m_sDotColor && _p2.$GetFillColor() === this.m_sDotColor) {
                var fromx = this.m_iLastX * this.m_iGridSizeX;
                var fromy = this.m_iLastY * this.m_iGridSizeY;
                this.m_Line = $createPolyline(6, fromx + "," + fromy + " " + tox + "," + toy, this.DRAWING_PATH_COLOR);
                this.m_CancelPath.disabled = '';
                if (_p.$GetStatus() !== StatusEnum.POINT_IN_PATH) _p.$SetStatus(StatusEnum.POINT_STARTING);
                if (_p2.$GetStatus() !== StatusEnum.POINT_IN_PATH) _p2.$SetStatus(StatusEnum.POINT_IN_PATH);
                this.m_iLastX = x;
                this.m_iLastY = y;
              }
            }
          }
        }
      } else {
        this.m_Screen.style.cursor = "crosshair";
      }
    }
  }, {
    key: "OnMouseDown",
    value: function OnMouseDown(event) {
      var _this14 = this;

      if (!this.m_bIsPlayerActive || this.m_Player2Name.innerHTML === '???' || this.m_bHandlingEvent === true || this.iConnErrCount > 0) return;
      var x = (event ? event.clientX : window.event.clientX) - this.m_Screen.offsetLeft + this.f_scrollLeft() + 0.5 * this.m_iGridSizeX;
      var y = (event ? event.clientY : window.event.clientY) - this.m_Screen.offsetTop + this.f_scrollTop() + 0.5 * this.m_iGridSizeY;
      x = this.m_iMouseX = parseInt(x / this.m_iGridSizeX);
      y = this.m_iMouseY = parseInt(y / this.m_iGridSizeY);
      this.m_bMouseDown = true;

      if (!this.m_bDrawLines) {
        this.m_iLastX = x;
        this.m_iLastY = y;
        var loc_x = x;
        var loc_y = y;
        x = loc_x * this.m_iGridSizeX;
        y = loc_y * this.m_iGridSizeY;

        if (this.m_Points.get(loc_y * this.m_iGridWidth + loc_x) !== undefined) {
          this.Debug('Wrong point - already existing', 0);
          return;
        }

        if (!this.IsPointOutsideAllPaths(loc_x, loc_y)) {
          this.Debug('Wrong point, Point is not outside all paths', 0);
          return;
        }

        this.SendAsyncData(this.CreateXMLPutPointRequest(loc_x, loc_y), function () {
          _this14.m_bMouseDown = false;
          _this14.m_bHandlingEvent = false;
        });
      } else {
        if ((this.m_iLastX !== x || this.m_iLastY !== y) && Math.abs(parseInt(this.m_iLastX - x)) <= 1 && Math.abs(parseInt(this.m_iLastY - y)) <= 1 && this.m_iLastX >= 0 && this.m_iLastY >= 0) {
          if (this.m_Line !== null) {
            var p0 = this.m_Points.get(this.m_iLastY * this.m_iGridWidth + this.m_iLastX);
            var p1 = this.m_Points.get(y * this.m_iGridWidth + x);
            this.m_CancelPath.disabled = this.m_Line.$GetLength() >= 2 ? '' : 'disabled';

            if (p0 !== undefined && p1 !== undefined && p0.$GetFillColor() === this.m_sDotColor && p1.$GetFillColor() === this.m_sDotColor) {
              var tox = x * this.m_iGridSizeX;
              var toy = y * this.m_iGridSizeY;
              var line_contains_point = this.m_Line.$ContainsPoint(tox, toy);

              if (line_contains_point < 1 || line_contains_point === 1 && p1.$GetStatus() === StatusEnum.POINT_STARTING) {
                this.m_Line.$AppendPoints(tox, toy);
                if (p1.$GetStatus() !== StatusEnum.POINT_STARTING) p1.$SetStatus(StatusEnum.POINT_IN_PATH);else {
                  var val = this.SurroundOponentPoints();

                  if (val.owned.length > 0) {
                    this.Debug('Closing path', 0);
                    this.SendAsyncData(this.CreateXMLPutPathRequest(val), function () {
                      _this14.Debug('Wrong path', 0);

                      _this14.OnCancelClick();

                      val.OwnedPoints.forEach(function (revData) {
                        var p = revData.point;
                        var revertStatus = revData.revertStatus;
                        var revertFillColor = revData.revertFillColor;
                        var revertStrokeColor = revData.revertStrokeColor;
                        p.$SetStatus(revertStatus);
                        p.$SetFillColor(revertFillColor);
                        p.$SetStrokeColor(revertStrokeColor);
                      });
                      _this14.m_bMouseDown = false;
                      _this14.m_bHandlingEvent = false;
                    });
                  } else this.Debug('Wrong path, cancell it or refresh page', 0);
                }
                this.m_iLastX = x;
                this.m_iLastY = y;
              } else if (line_contains_point >= 1 && p0.$GetStatus() === StatusEnum.POINT_IN_PATH && this.m_Line.$GetPointsString().endsWith("".concat(this.m_iLastX * this.m_iGridSizeX, ",").concat(this.m_iLastY * this.m_iGridSizeY))) {
                if (this.m_Line.$GetLength() > 2) {
                  p0.$RevertOldStatus();
                  this.m_Line.$RemoveLastPoint();
                  this.m_iLastX = x;
                  this.m_iLastY = y;
                } else this.OnCancelClick();
              }
            }
          } else {
            var _p3 = this.m_Points.get(this.m_iLastY * this.m_iGridWidth + this.m_iLastX);

            var _p4 = this.m_Points.get(y * this.m_iGridWidth + x);

            if (_p3 !== undefined && _p4 !== undefined && _p3.$GetStatus() !== StatusEnum.POINT_IN_PATH && _p4.$GetStatus() !== StatusEnum.POINT_IN_PATH && _p3.$GetFillColor() === this.m_sDotColor && _p4.$GetFillColor() === this.m_sDotColor) {
              var fromx = this.m_iLastX * this.m_iGridSizeX;
              var fromy = this.m_iLastY * this.m_iGridSizeY;

              var _tox = x * this.m_iGridSizeX;

              var _toy = y * this.m_iGridSizeY;

              this.m_Line = $createPolyline(6, fromx + "," + fromy + " " + _tox + "," + _toy, this.DRAWING_PATH_COLOR);
              this.m_CancelPath.disabled = '';
              if (_p3.$GetStatus() !== StatusEnum.POINT_IN_PATH) _p3.$SetStatus(StatusEnum.POINT_STARTING);
              if (_p4.$GetStatus() !== StatusEnum.POINT_IN_PATH) _p4.$SetStatus(StatusEnum.POINT_IN_PATH);
            }

            this.m_iLastX = x;
            this.m_iLastY = y;
          }
        } else if (this.m_iLastX < 0 || this.m_iLastY < 0) {
          var _p5 = this.m_Points.get(y * this.m_iGridWidth + x);

          if (_p5 !== undefined && _p5.$GetFillColor() === this.m_sDotColor && (_p5.$GetStatus() === StatusEnum.POINT_FREE_BLUE || _p5.$GetStatus() === StatusEnum.POINT_FREE_RED)) {
            this.m_iLastX = x;
            this.m_iLastY = y;
          }
        }
      }
    }
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
    value: function OnStopAndDraw(event) {
      if (!this.m_Timer) {
        if (this.m_Line !== null) this.OnCancelClick();
        this.m_bDrawLines = !this.m_bDrawLines;
        var btn = event.target;
        if (!this.m_bDrawLines) btn.value = 'Draw line';else btn.value = 'Draw dot';
        this.m_iLastX = this.m_iLastY = -1;
        this.m_Line = null;
      } else if (this.m_Line === null) {
        this.SendAsyncData(new StopAndDrawCommand());
      }
    }
  }, {
    key: "OnCancelClick",
    value: function OnCancelClick() {
      if (this.m_bDrawLines) {
        if (this.m_Line !== null) {
          var points = this.m_Line.$GetPointsArray();
          this.m_CancelPath.disabled = 'disabled';
          var _iteratorNormalCompletion6 = true;
          var _didIteratorError6 = false;
          var _iteratorError6 = undefined;

          try {
            for (var _iterator6 = points[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
              var point = _step6.value;
              var x = point.x,
                  y = point.y;
              if (x === null || y === null) continue;
              x /= this.m_iGridSizeX;
              y /= this.m_iGridSizeY;
              var p0 = this.m_Points.get(y * this.m_iGridWidth + x);

              if (p0 !== undefined) {
                p0.$RevertOldStatus();
              } else {
                debugger;
              }
            }
          } catch (err) {
            _didIteratorError6 = true;
            _iteratorError6 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion6 && _iterator6["return"] != null) {
                _iterator6["return"]();
              }
            } finally {
              if (_didIteratorError6) {
                throw _iteratorError6;
              }
            }
          }

          $RemovePolyline(this.m_Line);
          this.m_Line = null;
        }

        this.m_iLastX = this.m_iLastY = -1;
        if (this.m_Timer) this.m_StopAndDraw.disabled = 'disabled';
      }
    }
  }, {
    key: "PrepareDrawing",
    value: function PrepareDrawing(sScreen, sPlayer2Name, sGameStatus, sSurrenderButton, sCancelPath, sPause, sStopAndDraw) {
      var iTooLong2Duration = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 125;
      this.m_bIsWon = false;
      this.m_iDelayBetweenMultiCaptures = 4000;
      this.m_iTooLong2Duration = iTooLong2Duration;
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
      this.m_Lines = [];
      this.m_Points = new Map();
      this.m_Debug = document.getElementById('debug0');
      this.m_Player2Name = document.querySelector(sPlayer2Name);
      this.m_GameStatus = document.querySelector(sGameStatus);
      this.m_SurrenderButton = document.querySelector(sSurrenderButton);
      this.m_CancelPath = document.querySelector(sCancelPath);
      this.m_StopAndDraw = document.querySelector(sStopAndDraw);
      this.m_Screen = document.querySelector(sScreen);

      if (!this.m_Screen) {
        alert("no board");
        return;
      }

      this.m_iPosX = this.m_Screen.offsetLeft;
      this.m_iPosY = this.m_Screen.offsetTop;
      this.m_Screen.style.width = "calc(1em * ".concat(this.m_BoardSize.width, ")");
      this.m_Screen.style.height = "calc(1em * ".concat(this.m_BoardSize.height, ")");
      var iClientWidth = this.m_Screen.clientWidth;
      var iClientHeight = this.m_Screen.clientHeight;
      this.m_iGridSizeX = parseInt(Math.ceil(iClientWidth / this.m_BoardSize.width));
      this.m_iGridSizeY = parseInt(Math.ceil(iClientHeight / this.m_BoardSize.height));
      this.m_iGridWidth = parseInt(Math.ceil(iClientWidth / this.m_iGridSizeX));
      this.m_iGridHeight = parseInt(Math.ceil(iClientHeight / this.m_iGridSizeY));
      $createSVGVML(this.m_Screen, this.m_Screen.style.width, this.m_Screen.style.height, true);
      this.DisableSelection(this.m_Screen);

      if (!this.m_bViewOnly) {
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
        document.querySelector(this.m_sMsgInputSel).disabled = '';
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
    }
  }]);

  return InkBallGame;
}();