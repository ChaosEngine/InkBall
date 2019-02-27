"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
  WIN: 5
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
      var msg = point.iX + ' ' + point.iY + ' ' + point.Status;
      return sUser + " places [" + msg + "] point";
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
      var msg = "".concat(path.iPlayerId, "  [").concat(path.PointsAsString, "] [").concat(path.OwnedPointsAsString, "]");
      return "".concat(sUser, " places [").concat(msg, "] path");
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
      return sUser + " says " + txt;
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

function CountPointsDebug(sSelector2Set) {
  var sSvgSelector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'svg';
  var svgs = document.getElementsByTagName(sSvgSelector),
      totalChildren = 0,
      childCounts = [];

  for (var i = 0; i < svgs.length; i++) {
    var svg = svgs[i];
    totalChildren += svg.childElementCount;
    childCounts.push(svg.childElementCount);
  }

  var tags = ["circle", "polyline"],
      tagMessage = "";
  tags.forEach(function (tagName) {
    tagMessage += tagName + ": " + document.getElementsByTagName(tagName).length + " ";
  });
  document.querySelector(sSelector2Set).innerHTML = "SVG: ".concat(totalChildren, " by tag: ").concat(tagMessage);
}

var InkBallGame = function () {
  function InkBallGame(sHubName, loggingLevel, hubProtocol, transportType, serverTimeoutInMilliseconds, tokenFactory, gameType) {
    var _this7 = this;

    var bIsPlayingWithRed = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : true;
    var bIsPlayerActive = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : true;
    var BoardSize = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : {
      width: 32,
      height: 32
    };
    var iTooLong2Duration = arguments.length > 10 && arguments[10] !== undefined ? arguments[10] : 125;
    var bViewOnly = arguments.length > 11 && arguments[11] !== undefined ? arguments[11] : false;

    _classCallCheck(this, InkBallGame);

    this.g_iGameID = null;
    this.g_iPlayerID = null;
    this.GameType = gameType;
    this.iConnErrCount = 0;
    this.iExponentialBackOffMillis = 2000;
    this.COLOR_RED = 'red';
    this.COLOR_BLUE = 'blue';
    this.COLOR_OWNED_RED = 'pink';
    this.COLOR_OWNED_BLUE = '#8A2BE2';
    this.m_bIsWon = false;
    this.m_iDelayBetweenMultiCaptures = 4000;
    this.m_iTimerInterval = 2000;
    this.m_iTooLong2Duration = iTooLong2Duration;
    this.m_iTimerID = null;
    this.m_bIsTimerRunning = false;
    this.m_WaitStartTime = null;
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
    this.m_DrawMode = null;
    this.m_CancelPath = null;
    this.m_bMouseDown = false;
    this.m_bHandlingEvent = false;
    this.m_bDrawLines = !true;
    this.m_sMessage = '';
    this.m_bIsPlayingWithRed = bIsPlayingWithRed;
    this.m_bIsPlayerActive = bIsPlayerActive;
    this.m_sDotColor = this.m_bIsPlayingWithRed ? this.COLOR_RED : this.COLOR_BLUE;
    this.m_PointRadius = 4;
    this.m_Line = null;
    this.m_Lines = new Array();
    this.m_Points = new Array();
    this.m_bViewOnly = bViewOnly;
    this.m_MouseCursorOval = null;
    if (sHubName === null || sHubName === "") return;
    this.g_SignalRConnection = new signalR.HubConnectionBuilder().withUrl(sHubName, {
      transport: transportType,
      accessTokenFactory: tokenFactory
    }).withHubProtocol(hubProtocol).configureLogging(loggingLevel).build();
    this.g_SignalRConnection.serverTimeoutInMilliseconds = serverTimeoutInMilliseconds;
    this.g_SignalRConnection.onclose(function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(err) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (err !== null && err !== undefined) {
                  console.error(err);
                  _this7.m_Screen.style.cursor = "not-allowed";
                  if (_this7.iConnErrCount < 5) _this7.iConnErrCount++;
                  setTimeout(function () {
                    return _this7.start();
                  }, 4000 + _this7.iExponentialBackOffMillis * _this7.iConnErrCount);
                }

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());
  }

  _createClass(InkBallGame, [{
    key: "start",
    value: function () {
      var _start = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        var _this8 = this;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return this.g_SignalRConnection.start();

              case 3:
                this.iConnErrCount = 0;
                console.log('connected; iConnErrCount = ' + this.iConnErrCount);
                _context2.next = 13;
                break;

              case 7:
                _context2.prev = 7;
                _context2.t0 = _context2["catch"](0);
                console.error(_context2.t0 + '; iConnErrCount = ' + this.iConnErrCount);
                this.m_Screen.style.cursor = "not-allowed";
                if (this.iConnErrCount < 5) this.iConnErrCount++;
                setTimeout(function () {
                  return _this8.start();
                }, 4000 + this.iExponentialBackOffMillis * this.iConnErrCount);

              case 13:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 7]]);
      }));

      function start() {
        return _start.apply(this, arguments);
      }

      return start;
    }()
  }, {
    key: "StartSignalRConnection",
    value: function StartSignalRConnection(iGameID, iPlayerID, sMsgListSel, sMsgSendButtonSel, sMsgInputSel) {
      if (this.g_SignalRConnection === null) return;
      this.g_iGameID = iGameID;
      this.g_iPlayerID = iPlayerID;
      this.m_sMsgInputSel = sMsgInputSel;
      this.m_sMsgSendButtonSel = sMsgSendButtonSel;
      this.g_SignalRConnection.on("ServerToClientPoint", function (point, user) {
        var encodedMsg = InkBallPointViewModel.Format(user, point);
        var li = document.createElement("li");
        li.textContent = encodedMsg;
        document.querySelector(sMsgListSel).appendChild(li);
        this.ReceivedPointProcessing(point);
      }.bind(this));
      this.g_SignalRConnection.on("ServerToClientPath", function (dto, user) {
        if (dto.hasOwnProperty('PointsAsString')) {
          var path = dto;
          var encodedMsg = InkBallPathViewModel.Format(user, path);
          var li = document.createElement("li");
          li.textContent = encodedMsg;
          document.querySelector(sMsgListSel).appendChild(li);
          this.ReceivedPathProcessing(path);
        } else if (dto.hasOwnProperty('WinningPlayerId')) {
          var win = dto;

          var _encodedMsg = WinCommand.Format(win);

          var _li = document.createElement("li");

          _li.textContent = _encodedMsg;
          document.querySelector(sMsgListSel).appendChild(_li);
          this.ReceivedWinProcessing(win);
        } else throw new Error("ServerToClientPath bad GetKind!");
      }.bind(this));
      this.g_SignalRConnection.on("ServerToClientPlayerJoin", function (join) {
        var encodedMsg = PlayerJoiningCommand.Format(join);
        var li = document.createElement("li");
        li.textContent = encodedMsg;
        document.querySelector(sMsgListSel).appendChild(li);

        if (this.m_SurrenderButton !== null) {
          if (join.OtherPlayerName !== '') {
            this.m_Player2Name.innerHTML = join.OtherPlayerName;
            this.m_SurrenderButton.value = 'surrender';
            this.ShowMobileStatus('Your move');
          }
        }

        if (this.m_DrawMode !== null) {
          this.m_DrawMode.disabled = '';
        }

        if (this.m_CancelPath !== null) {
          this.m_CancelPath.disabled = '';
        }

        this.m_bHandlingEvent = false;
      }.bind(this));
      this.g_SignalRConnection.on("ServerToClientPlayerSurrender", function (surrender) {
        var encodedMsg = PlayerSurrenderingCommand.Format(surrender);
        var li = document.createElement("li");
        li.textContent = encodedMsg;
        document.querySelector(sMsgListSel).appendChild(li);
        this.m_bHandlingEvent = false;
        alert(encodedMsg === '' ? 'Game interrupted!' : encodedMsg);
        window.location.href = "Games";
      }.bind(this));
      this.g_SignalRConnection.on("ServerToClientPlayerWin", function (win) {
        var encodedMsg = WinCommand.Format(win);
        var li = document.createElement("li");
        li.textContent = encodedMsg;
        document.querySelector(sMsgListSel).appendChild(li);
        this.ReceivedWinProcessing(win);
      }.bind(this));
      this.g_SignalRConnection.on("ServerToClientPing", function (ping, user) {
        var encodedMsg = PingCommand.Format(user, ping);
        var li = document.createElement("li");
        li.textContent = encodedMsg;
        document.querySelector(sMsgListSel).appendChild(li);
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
      this.start();
    }
  }, {
    key: "StopSignalRConnection",
    value: function StopSignalRConnection() {
      if (this.g_SignalRConnection !== null) {
        this.g_SignalRConnection.stop();
        console.log('Stopped SignalR connection');
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
            break;
          }

        default:
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
    value: function SetPoint(iX, iY, iStatus) {
      var x = iX * this.m_iGridSizeX;
      var y = iY * this.m_iGridSizeY;
      var oval = $createOval(this.m_PointRadius, 'true');
      oval.$move(x, y, this.m_PointRadius);
      var color;

      switch (iStatus) {
        case StatusEnum.POINT_FREE_RED:
          color = this.COLOR_RED;
          oval.$SetStatus(StatusEnum.POINT_FREE);
          break;

        case StatusEnum.POINT_FREE_BLUE:
          color = this.COLOR_BLUE;
          oval.$SetStatus(StatusEnum.POINT_FREE);
          break;

        case StatusEnum.POINT_FREE:
          color = this.m_sDotColor;
          oval.$SetStatus(StatusEnum.POINT_FREE);
          break;

        case StatusEnum.POINT_STARTING:
          color = this.m_sDotColor;
          oval.$SetStatus(StatusEnum.POINT_STARTING);
          break;

        case StatusEnum.POINT_IN_PATH:
          color = this.m_sDotColor;
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
      oval.$strokeColor(color);
      this.m_Points[iY * this.m_iGridWidth + iX] = oval;
    }
  }, {
    key: "SetAllPoints",
    value: function SetAllPoints(points) {
      var _this9 = this;

      points.forEach(function (p) {
        if (p[3] === _this9.g_iPlayerID) {} else {
          switch (p[2]) {
            case StatusEnum.POINT_FREE:
            case StatusEnum.POINT_FREE_RED:
            case StatusEnum.POINT_FREE_BLUE:
            case StatusEnum.POINT_STARTING:
            case StatusEnum.POINT_OWNED_BY_RED:
            case StatusEnum.POINT_OWNED_BY_BLUE:
              break;

            case StatusEnum.POINT_IN_PATH:
              if (_this9.m_bIsPlayingWithRed === true) {
                p[2] = StatusEnum.POINT_FREE_BLUE;
              } else {
                p[2] = StatusEnum.POINT_FREE_RED;
              }

              break;
          }
        }

        _this9.SetPoint(p[0], p[1], p[2]);
      });
    }
  }, {
    key: "SetPath",
    value: function SetPath(packed, bIsRed, bBelong2ThisPlayer) {
      var sPoints = packed.split(" ");
      var count = sPoints.length,
          sDelimiter = "",
          sPathPoints = "",
          p = null,
          x,
          y,
          status = StatusEnum.POINT_STARTING;

      for (var i = 0; i < count; ++i) {
        p = sPoints[i].split(",");
        x = parseInt(p[0]);
        y = parseInt(p[1]);
        x *= this.m_iGridSizeX;
        y *= this.m_iGridSizeY;
        sPathPoints = sPathPoints + sDelimiter + x + "," + y;
        sDelimiter = " ";
        p = this.m_Points[y * this.m_iGridWidth + x];

        if (p !== null && p !== undefined) {
          p.$SetStatus(status);
          status = StatusEnum.POINT_IN_PATH;
        }
      }

      p = sPoints[0].split(",");
      x = parseInt(p[0]);
      y = parseInt(p[1]);
      x *= this.m_iGridSizeX;
      y *= this.m_iGridSizeY;
      sPathPoints = sPathPoints + sDelimiter + x + "," + y;
      p = this.m_Points[y * this.m_iGridWidth + x];
      if (p !== null && p !== undefined) p.$SetStatus(status);
      var line = $createPolyline(3, sPathPoints, bBelong2ThisPlayer ? this.m_sDotColor : bIsRed ? this.COLOR_BLUE : this.COLOR_RED);
      this.m_Lines[this.m_Lines.length] = line;
    }
  }, {
    key: "SetAllPaths",
    value: function SetAllPaths(paths) {
      var _this10 = this;

      paths.forEach(function (p) {
        _this10.SetPath(p[0], _this10.m_bIsPlayingWithRed, p[1] === _this10.g_iPlayerID);
      });
    }
  }, {
    key: "IsPointBelongingToLine",
    value: function IsPointBelongingToLine(sPoints, iX, iY) {
      var count = sPoints.length,
          x,
          y,
          pnt;

      for (var i = 0; i < count; ++i) {
        pnt = sPoints[i].split(",");
        x = pnt[0];
        y = pnt[1];
        if (x === iX && y === iY) return true;
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
      var i,
          j,
          npol = pathPoints.length,
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

      var count = points.length,
          x,
          y,
          sPathPoints = "",
          sDelimiter = "";

      for (var i = 0; i < count; i++) {
        x = points[i].x;
        y = points[i].y;
        if (x === null || y === null) continue;
        x /= this.m_iGridSizeX;
        y /= this.m_iGridSizeY;
        sPathPoints = sPathPoints + sDelimiter + x + "," + y;
        sDelimiter = " ";
      }

      var sColor = this.m_sDotColor === this.COLOR_RED ? this.COLOR_BLUE : this.COLOR_RED;
      var owned_by = this.m_sDotColor === this.COLOR_RED ? StatusEnum.POINT_OWNED_BY_RED : StatusEnum.POINT_OWNED_BY_BLUE;
      var sOwnedCol = this.m_sDotColor === this.COLOR_RED ? this.COLOR_OWNED_RED : this.COLOR_OWNED_BLUE;
      var sOwnedPoints = "";
      var ownedPoints = [];
      sDelimiter = "";
      count = this.m_Points.length;

      for (var _i = 0; _i < count; ++_i) {
        var p0 = this.m_Points[_i];

        if (p0 !== undefined && p0.$GetStatus() === StatusEnum.POINT_FREE && p0.$GetFillColor() === sColor) {
          var pos = p0.$GetPosition();
          x = pos.x;
          y = pos.y;

          if (false !== this.pnpoly2(points, x, y)) {
            p0.$SetStatus(owned_by);
            p0.$SetFillColor(sOwnedCol);
            p0.$strokeColor(sOwnedCol);
            x /= this.m_iGridSizeX;
            y /= this.m_iGridSizeY;
            sOwnedPoints = sOwnedPoints + sDelimiter + x + "," + y;
            ownedPoints.push(p0);
            sDelimiter = " ";
          }
        }
      }

      return {
        OwnedPoints: ownedPoints,
        owned: sOwnedPoints,
        path: sPathPoints,
        revertFillColor: sColor,
        revertStatus: StatusEnum.POINT_FREE,
        revertStrokeColor: this.m_sDotColor === this.COLOR_RED ? this.COLOR_OWNED_BLUE : this.COLOR_OWNED_RED
      };
    }
  }, {
    key: "IsPointOutsideAllPaths",
    value: function IsPointOutsideAllPaths(iX, iY) {
      var count1 = this.m_Lines.length;

      for (var j = 0; j < count1; ++j) {
        var points = this.m_Lines[j].$GetPointsArray();
        if (false !== this.pnpoly2(points, iX, iY)) return false;
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
          console.log(InkBallPointViewModel.Format('some player', payload));
          this.m_bHandlingEvent = true;
          this.g_SignalRConnection.invoke("ClientToServerPoint", payload).then(function (point) {
            this.ReceivedPointProcessing(point);
          }.bind(this)).catch(function (err) {
            console.error(err.toString());
            if (revertFunction !== undefined) revertFunction();
          }.bind(this));
          break;

        case CommandKindEnum.PATH:
          console.log(InkBallPathViewModel.Format('some player', payload));
          this.m_bHandlingEvent = true;
          this.g_SignalRConnection.invoke("ClientToServerPath", payload).then(function (dto) {
            if (dto.hasOwnProperty('WinningPlayerId')) {
              var win = dto;
              this.ReceivedWinProcessing(win);
            } else if (dto.hasOwnProperty('PointsAsString')) {
              var path = dto;
              this.ReceivedPathProcessing(path);
            } else throw new Error("ClientToServerPath bad GetKind!");
          }.bind(this)).catch(function (err) {
            console.error(err.toString());
            if (revertFunction !== undefined) revertFunction();
          }.bind(this));
          break;

        case CommandKindEnum.PING:
          this.g_SignalRConnection.invoke("ClientToServerPing", payload).then(function () {
            document.querySelector(this.m_sMsgInputSel).value = '';
            document.querySelector(this.m_sMsgSendButtonSel).disabled = 'disabled';
          }.bind(this)).catch(function (err) {
            console.error(err.toString());
          });
          break;

        default:
          console.error('unknown object');
          break;
      }
    }
  }, {
    key: "ReceivedPointProcessing",
    value: function ReceivedPointProcessing(point) {
      var x = point.iX,
          y = point.iY,
          iStatus = point.Status;
      this.SetPoint(x, y, iStatus);

      if (this.g_iPlayerID !== point.iPlayerId) {
        this.m_bIsPlayerActive = true;
        this.ShowMobileStatus('Oponent has moved, your turn');
        this.m_Screen.style.cursor = "crosshair";
        this.m_DrawMode.disabled = this.m_CancelPath.disabled = '';
      } else {
        this.m_bIsPlayerActive = false;
        this.ShowMobileStatus('Waiting for oponent move');
        this.m_Screen.style.cursor = "wait";
        this.m_DrawMode.disabled = this.m_CancelPath.disabled = 'disabled';
      }

      this.m_bHandlingEvent = false;
    }
  }, {
    key: "ReceivedPathProcessing",
    value: function ReceivedPathProcessing(path) {
      if (this.g_iPlayerID !== path.iPlayerId) {
        var str_path = path.PointsAsString,
            owned = path.OwnedPointsAsString;
        this.SetPath(str_path, this.m_sDotColor === this.COLOR_RED ? true : false, false);
        var points = owned.split(" ");
        var count = points.length;
        var point_status = this.m_sDotColor === this.COLOR_RED ? StatusEnum.POINT_OWNED_BY_RED : StatusEnum.POINT_OWNED_BY_BLUE;
        var sOwnedCol = this.m_sDotColor === this.COLOR_RED ? this.COLOR_OWNED_BLUE : this.COLOR_OWNED_RED;

        for (var i = 0; i < count; ++i) {
          var p = points[i].split(",");
          var x = parseInt(p[0]),
              y = parseInt(p[1]);
          p = this.m_Points[y * this.m_iGridWidth + x];

          if (p !== undefined) {
            p.$SetStatus(point_status);
            p.$SetFillColor(sOwnedCol);
            p.$strokeColor(sOwnedCol);
          }
        }

        this.m_bIsPlayerActive = true;
        this.ShowMobileStatus('Oponent has moved, your turn');
        this.m_Screen.style.cursor = "crosshair";
        this.m_DrawMode.disabled = this.m_CancelPath.disabled = '';
      } else {
        var _points = this.m_Line.$GetPointsString();

        var _i2 = 0;
        var _x2 = _points[_i2],
            _y = _points[_i2 + 1];
        _x2 /= this.m_iGridSizeX;
        _y /= this.m_iGridSizeY;
        var p0 = this.m_Points[_y * this.m_iGridWidth + _x2];
        if (p0 !== undefined) p0.$SetStatus(StatusEnum.POINT_IN_PATH);
        this.m_Lines[this.m_Lines.length] = this.m_Line;
        this.m_iLastX = this.m_iLastY = -1;
        this.m_Line = null;
        this.m_bIsPlayerActive = false;
        this.ShowMobileStatus('Waiting for oponent move');
        this.m_Screen.style.cursor = "wait";
        this.m_DrawMode.disabled = this.m_CancelPath.disabled = 'disabled';
      }

      this.m_bHandlingEvent = false;
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
      var _this11 = this;

      var paths, points, count;

      switch (this.GameType) {
        case GameTypeEnum.FIRST_CAPTURE:
          paths = playerPaths;

          if (paths.length > 0) {
            if (this.m_bIsPlayingWithRed) return WinStatusEnum.RED_WINS;else return WinStatusEnum.GREEN_WINS;
          }

          paths = otherPlayerPaths;

          if (paths.length > 0) {
            if (this.m_bIsPlayingWithRed) return WinStatusEnum.GREEN_WINS;else return WinStatusEnum.RED_WINS;
          }

          return WinStatusEnum.NO_WIN;

        case GameTypeEnum.FIRST_5_CAPTURES:
          points = otherPlayerPoints;
          count = 0;
          points.forEach(function (p) {
            if (p.iEnclosingPathId !== null) ++count;

            if (count >= 5) {
              if (_this11.m_bIsPlayingWithRed) return WinStatusEnum.RED_WINS;else return WinStatusEnum.GREEN_WINS;
            }
          });
          points = playerPoints;
          count = 0;
          points.forEach(function (p) {
            if (p.iEnclosingPathId !== null) ++count;

            if (count >= 5) {
              if (_this11.m_bIsPlayingWithRed) return WinStatusEnum.GREEN_WINS;else return WinStatusEnum.RED_WINS;
            }
          });
          return WinStatusEnum.NO_WIN;

        case GameTypeEnum.FIRST_5_PATHS:
          paths = playerPaths;

          if (paths.length >= 5) {
            if (this.m_bIsPlayingWithRed) return WinStatusEnum.RED_WINS;else return WinStatusEnum.GREEN_WINS;
          }

          paths = otherPlayerPaths;

          if (paths.length >= 5) {
            if (this.m_bIsPlayingWithRed) return WinStatusEnum.GREEN_WINS;else return WinStatusEnum.RED_WINS;
          }

          return WinStatusEnum.NO_WIN;

        case GameTypeEnum.FIRST_5_ADVANTAGE_PATHS:
          {
            var this_player_paths = playerPaths;
            var other_player_paths = otherPlayerPaths;
            var diff = this_player_paths.length - other_player_paths.length;

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
      var _this12 = this;

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
      this.m_Screen.style.cursor = "crosshair";
      this.Debug("[".concat(x, ",").concat(y, "]"), 1);

      if (this.m_bDrawLines && this.m_bMouseDown === true) {
        if ((this.m_iLastX !== x || this.m_iLastY !== y) && Math.abs(parseInt(this.m_iLastX - x)) <= 1 && Math.abs(parseInt(this.m_iLastY - y)) <= 1 && this.m_iLastX >= 0 && this.m_iLastY >= 0) {
          if (this.m_Line !== null) {
            var p0 = this.m_Points[this.m_iLastY * this.m_iGridWidth + this.m_iLastX];
            var p1 = this.m_Points[y * this.m_iGridWidth + x];

            if (p0 !== undefined && p1 !== undefined && p1.$GetStatus() !== StatusEnum.POINT_IN_PATH && p0.$GetFillColor() === this.m_sDotColor && p1.$GetFillColor() === this.m_sDotColor) {
              this.m_Line.$AppendPoints(tox + "," + toy);
              if (p1.$GetStatus() !== StatusEnum.POINT_STARTING) p1.$SetStatus(StatusEnum.POINT_IN_PATH);else {
                var val = this.SurroundOponentPoints();

                if (val.owned.length > 0) {
                  this.Debug('Closing path', 0);
                  this.SendAsyncData(this.CreateXMLPutPathRequest(val), function () {
                    _this12.OnCancelClick();

                    val.OwnedPoints.forEach(function (p) {
                      p.$SetStatus(val.revertStatus);
                      p.$SetFillColor(val.revertFillColor);
                      p.$strokeColor(val.revertStrokeColor);
                    });
                    _this12.m_bHandlingEvent = false;
                  });
                } else this.Debug('Wrong path, cancell it or refresh page', 0);
              }
              this.m_iLastX = x;
              this.m_iLastY = y;
            }
          } else {
            var _p = this.m_Points[this.m_iLastY * this.m_iGridWidth + this.m_iLastX];
            var _p2 = this.m_Points[y * this.m_iGridWidth + x];

            if (_p !== undefined && _p2 !== undefined && _p.$GetStatus() !== StatusEnum.POINT_IN_PATH && _p2.$GetStatus() !== StatusEnum.POINT_IN_PATH && _p.$GetFillColor() === this.m_sDotColor && _p2.$GetFillColor() === this.m_sDotColor) {
              var fromx = this.m_iLastX * this.m_iGridSizeX;
              var fromy = this.m_iLastY * this.m_iGridSizeY;
              this.m_Line = $createPolyline(3, fromx + "," + fromy + " " + tox + "," + toy, this.m_sDotColor);
              if (_p.$GetStatus() !== StatusEnum.POINT_IN_PATH) _p.$SetStatus(StatusEnum.POINT_STARTING);
              if (_p2.$GetStatus() !== StatusEnum.POINT_IN_PATH) _p2.$SetStatus(StatusEnum.POINT_IN_PATH);
              this.m_iLastX = x;
              this.m_iLastY = y;
            }
          }
        }
      }
    }
  }, {
    key: "OnMouseDown",
    value: function OnMouseDown(event) {
      var _this13 = this;

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
        if (this.m_Points[loc_y * this.m_iGridWidth + loc_x] !== undefined) return;
        if (!this.IsPointOutsideAllPaths(loc_x, loc_y)) return;
        this.SendAsyncData(this.CreateXMLPutPointRequest(loc_x, loc_y), function () {
          _this13.m_bMouseDown = false;
          _this13.m_bHandlingEvent = false;
        });
      } else {
        if ((this.m_iLastX !== x || this.m_iLastY !== y) && Math.abs(parseInt(this.m_iLastX - x)) <= 1 && Math.abs(parseInt(this.m_iLastY - y)) <= 1 && this.m_iLastX >= 0 && this.m_iLastY >= 0) {
          if (this.m_Line !== null) {
            var p0 = this.m_Points[this.m_iLastY * this.m_iGridWidth + this.m_iLastX];
            var p1 = this.m_Points[y * this.m_iGridWidth + x];

            if (p0 !== undefined && p1 !== undefined && p1.$GetStatus() !== StatusEnum.POINT_IN_PATH && p0.$GetFillColor() === this.m_sDotColor && p1.$GetFillColor() === this.m_sDotColor) {
              var tox = x * this.m_iGridSizeX;
              var toy = y * this.m_iGridSizeY;
              this.m_Line.$AppendPoints(tox + "," + toy);
              if (p1.$GetStatus() !== StatusEnum.POINT_STARTING) p1.$SetStatus(StatusEnum.POINT_IN_PATH);else {
                var val = this.SurroundOponentPoints();

                if (val.owned.length > 0) {
                  this.Debug('Closing path', 0);
                  this.SendAsyncData(this.CreateXMLPutPathRequest(val), function () {
                    _this13.OnCancelClick();

                    val.OwnedPoints.forEach(function (p) {
                      p.$SetStatus(val.revertStatus);
                      p.$SetFillColor(val.revertFillColor);
                      p.$strokeColor(val.revertStrokeColor);
                    });
                    _this13.m_bMouseDown = false;
                    _this13.m_bHandlingEvent = false;
                  });
                } else this.Debug('Wrong path, cancell it or refresh page', 0);
              }
              this.m_iLastX = x;
              this.m_iLastY = y;
            }
          } else {
            var _p3 = this.m_Points[this.m_iLastY * this.m_iGridWidth + this.m_iLastX];
            var _p4 = this.m_Points[y * this.m_iGridWidth + x];

            if (_p3 !== undefined && _p4 !== undefined && _p3.$GetStatus() !== StatusEnum.POINT_IN_PATH && _p4.$GetStatus() !== StatusEnum.POINT_IN_PATH && _p3.$GetFillColor() === this.m_sDotColor && _p4.$GetFillColor() === this.m_sDotColor) {
              var fromx = this.m_iLastX * this.m_iGridSizeX;
              var fromy = this.m_iLastY * this.m_iGridSizeY;

              var _tox = x * this.m_iGridSizeX;

              var _toy = y * this.m_iGridSizeY;

              this.m_Line = $createPolyline(3, fromx + "," + fromy + " " + _tox + "," + _toy, this.m_sDotColor);
              if (_p3.$GetStatus() !== StatusEnum.POINT_IN_PATH) _p3.$SetStatus(StatusEnum.POINT_STARTING);
              if (_p4.$GetStatus() !== StatusEnum.POINT_IN_PATH) _p4.$SetStatus(StatusEnum.POINT_IN_PATH);
            }

            this.m_iLastX = x;
            this.m_iLastY = y;
          }
        } else if (this.m_iLastX < 0 || this.m_iLastY < 0) {
          var _p5 = this.m_Points[y * this.m_iGridWidth + x];

          if (_p5 !== undefined && _p5.$GetStatus() === StatusEnum.POINT_FREE && _p5.$GetFillColor() === this.m_sDotColor) {
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
    key: "OnDrawModeClick",
    value: function OnDrawModeClick(event) {
      this.m_bDrawLines = !this.m_bDrawLines;
      var btn = event.target;

      if (!this.m_bDrawLines) {
        btn.value = 'Draw lines';
      } else {
        btn.value = 'Draw dots';
      }

      this.m_iLastX = this.m_iLastY = -1;
      this.m_Line = null;
    }
  }, {
    key: "OnCancelClick",
    value: function OnCancelClick() {
      if (this.m_bDrawLines) {
        if (this.m_Line !== null) {
          var points = this.m_Line.$GetPointsArray();

          for (var i = 0; i < points.length; i++) {
            var x = points[i].x;
            var y = points[i].y;
            if (x === null || y === null) continue;
            x /= this.m_iGridSizeX;
            y /= this.m_iGridSizeY;
            var p0 = this.m_Points[y * this.m_iGridWidth + x];
            if (p0 !== undefined) p0.$SetStatus(StatusEnum.POINT_FREE);
          }

          $RemovePolyline(this.m_Line);
          this.m_Line = null;
        }

        this.m_iLastX = this.m_iLastY = -1;
      }
    }
  }, {
    key: "OnTestClick",
    value: function OnTestClick() {
      console.log(this.m_Points.flat());
    }
  }, {
    key: "PrepareDrawing",
    value: function PrepareDrawing(sScreen, sPlayer2Name, sGameStatus, sSurrenderButton, sDrawMode, sCancelPath) {
      var iTooLong2Duration = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 125;
      this.m_bIsWon = false;
      this.m_iDelayBetweenMultiCaptures = 4000;
      this.m_iTimerInterval = 2000;
      this.m_iTooLong2Duration = iTooLong2Duration;
      this.m_iTimerID = null;
      this.m_bIsTimerRunning = false;
      this.m_WaitStartTime = null;
      this.m_iSlowdownLevel = 0;
      this.m_iLastX = -1;
      this.m_iLastY = -1;
      this.m_iMouseX = 0;
      this.m_iMouseY = 0;
      this.m_iPosX = 0;
      this.m_iPosY = 0;
      this.m_Debug = null;
      this.m_bMouseDown = false;
      this.m_bHandlingEvent = false;
      this.m_bDrawLines = !true;
      this.m_sMessage = '';
      this.m_sDotColor = this.m_bIsPlayingWithRed ? this.COLOR_RED : this.COLOR_BLUE;
      this.m_Line = null;
      this.m_Lines = new Array();
      this.m_Points = new Array();
      this.m_Debug = document.getElementById('debug0');
      this.m_Player2Name = document.querySelector(sPlayer2Name);
      this.m_GameStatus = document.querySelector(sGameStatus);
      this.m_SurrenderButton = document.querySelector(sSurrenderButton);
      this.m_CancelPath = document.querySelector(sCancelPath);
      this.m_DrawMode = document.querySelector(sDrawMode);
      this.m_Screen = document.querySelector(sScreen);

      if (!this.m_Screen) {
        alert("no board");
        return;
      }

      this.m_iPosX = this.m_Screen.offsetLeft;
      this.m_iPosY = this.m_Screen.offsetTop;
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
          this.m_MouseCursorOval.$strokeColor(this.m_sDotColor);
          this.m_MouseCursorOval.$SetZIndex(-1);
          this.m_MouseCursorOval.$Hide();
        }

        this.m_Screen.onmousedown = this.OnMouseDown.bind(this);
        this.m_Screen.onmousemove = this.OnMouseMove.bind(this);
        this.m_Screen.onmouseup = this.OnMouseUp.bind(this);
        this.m_Screen.onmouseleave = this.OnMouseLeave.bind(this);
        this.m_DrawMode.onclick = this.OnDrawModeClick.bind(this);
        this.m_CancelPath.onclick = this.OnCancelClick.bind(this);
        document.querySelector('#Test').onclick = this.OnTestClick.bind(this);

        if (this.m_Player2Name.innerHTML === '???') {
          this.ShowMobileStatus('Waiting for other player to connect');
          this.m_Screen.style.cursor = "wait";
        } else {
          this.m_SurrenderButton.value = 'surrender';

          if (this.m_bIsPlayerActive) {
            this.ShowMobileStatus('Your move');
            this.m_Screen.style.cursor = "crosshair";
            this.m_DrawMode.disabled = this.m_CancelPath.disabled = '';
          } else {
            this.ShowMobileStatus('Waiting for oponent move');
            this.m_Screen.style.cursor = "wait";
            this.m_DrawMode.disabled = this.m_CancelPath.disabled = 'disabled';
          }
        }
      }
    }
  }]);

  return InkBallGame;
}();