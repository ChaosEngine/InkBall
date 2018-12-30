"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

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
  PLAYER_SURRENDER: 4
});

var InkBallPointViewModel = function () {
  function InkBallPointViewModel() {
    var iId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var iGameId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var iPlayerId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var iX = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var iY = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
    var Status = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : StatusEnum.POINT_FREE;
    var iEnclosingPathId = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;

    _classCallCheck(this, InkBallPointViewModel);

    this.iId = iId;
    this.iGameId = iGameId;
    this.iPlayerId = iPlayerId;
    this.iX = iX;
    this.iY = iY;
    this.Status = Status;
    this.iEnclosingPathId = iEnclosingPathId;
  }

  _createClass(InkBallPointViewModel, null, [{
    key: "Format",
    value: function Format(sUser, point) {
      var msg = point.iX + ' ' + point.iY + ' ' + point.Status;
      return sUser + " places [" + msg + "] point";
    }
  }]);

  return InkBallPointViewModel;
}();

var InkBallPathViewModel = function () {
  function InkBallPathViewModel() {
    var iId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var iGameId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var iPlayerId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var sPointsAsString = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
    var sOwnedPointsAsString = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';

    _classCallCheck(this, InkBallPathViewModel);

    this.iId = iId;
    this.iGameId = iGameId;
    this.iPlayerId = iPlayerId;
    this.sPointsAsString = sPointsAsString;
    this.sOwnedPointsAsString = sOwnedPointsAsString;
  }

  _createClass(InkBallPathViewModel, null, [{
    key: "Format",
    value: function Format(sUser, path) {
      var msg = path.iPlayerID + "    " + path.sPointsAsString + "     " + path.sOwnedPointsAsString;
      return sUser + " places [" + msg + "] path";
    }
  }]);

  return InkBallPathViewModel;
}();

var WaitForPlayerCommand = function () {
  _createClass(WaitForPlayerCommand, [{
    key: "ShowP2Name",
    get: function get() {
      return this.showP2Name;
    },
    set: function set(value) {
      this.showP2Name = value;
    }
  }]);

  function WaitForPlayerCommand() {
    var showP2Name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    _classCallCheck(this, WaitForPlayerCommand);

    this.ShowP2Name = showP2Name;
  }

  return WaitForPlayerCommand;
}();

var PingCommand = function () {
  _createClass(PingCommand, [{
    key: "Message",
    get: function get() {
      return this.message;
    },
    set: function set(value) {
      this.message = value;
    }
  }]);

  function PingCommand() {
    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    _classCallCheck(this, PingCommand);

    this.Message = message;
  }

  _createClass(PingCommand, null, [{
    key: "Format",
    value: function Format(sUser, ping) {
      var msg = ping.Message;
      return sUser + " says " + msg;
    }
  }]);

  return PingCommand;
}();

function htmlEncode(html) {
  return document.createElement('a').appendChild(document.createTextNode(html)).parentNode.innerHTML;
}

function CountPointsDebug() {
  var svgs = $("svg"),
      totalChildren = 0,
      childCounts = [];

  for (var _i = 0; _i < svgs.length; _i++) {
    var svg = svgs[_i];
    totalChildren += svg.childElementCount;
    childCounts.push(svg.childElementCount);
  }

  var tags = ["circle", "path"],
      tagMessage = "";
  tags.forEach(function (tagName) {
    tagMessage += tagName + ": " + $(tagName).length + " ";
  });
  $("#debug2").text('SVG elements - totalChildren:' + totalChildren + ' SVG childElements:' + childCounts + ' by tag:' + tagMessage);
}

var InkBallGame = function () {
  function InkBallGame(sHubName, loggingLevel, hubProtocol, transportType, tokenFactory) {
    var _this = this;

    var bIsPlayingWithRed = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;
    var bIsPlayerActive = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : true;
    var iGridSize = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 15;
    var iTooLong2Duration = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : 125;
    var bIsMobile = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : true;
    var bViewOnly = arguments.length > 10 && arguments[10] !== undefined ? arguments[10] : false;

    _classCallCheck(this, InkBallGame);

    this.g_iGameID = null;
    this.g_iPlayerID = null;
    this.iConnErrCount = 0;
    this.iExponentialBackOffMillis = 2000;
    this.COLOR_RED = 'red';
    this.COLOR_BLUE = 'blue';
    this.COLOR_OWNED_RED = 'pink';
    this.COLOR_OWNED_BLUE = '#8A2BE2';
    this.POINT_FREE_RED = -3;
    this.POINT_FREE_BLUE = -2;
    this.POINT_FREE = -1;
    this.POINT_STARTING = 0;
    this.POINT_IN_PATH = 1;
    this.POINT_OWNED_BY_RED = 2;
    this.POINT_OWNED_BY_BLUE = 3;
    this.m_bIsWon = false;
    this.m_iDelayBetweenMultiCaptures = 4000;
    this.m_iTimerInterval = 2000;
    this.m_iTooLong2Duration = iTooLong2Duration;
    this.m_iTimerID = null;
    this.m_bIsTimerRunning = false;
    this.m_WaitStartTime = null;
    this.m_iSlowdownLevel = 0;
    this.m_iGridSize = iGridSize;
    this.m_iGridWidth = 0;
    this.m_iGridHeight = 0;
    this.m_iLastX = -1;
    this.m_iLastY = -1;
    this.m_iMouseX = 0;
    this.m_iMouseY = 0;
    this.m_iPosX = 0;
    this.m_iPosY = 0;
    this.m_iScrollX = 0;
    this.m_iScrollY = 0;
    this.m_iClientWidth = 0;
    this.m_iClientHeight = 0;
    this.m_Screen = null;
    this.m_Debug = null;
    this.m_Player2Name = null;
    this.m_SurrenderButton = null;
    this.m_bMouseDown = false;
    this.m_bDrawLines = !true;
    this.m_bIsMobile = bIsMobile;
    this.m_sMessage = '';
    this.m_bIsPlayingWithRed = bIsPlayingWithRed;
    this.m_bIsPlayerActive = bIsPlayerActive;
    this.m_sDotColor = this.m_bIsPlayingWithRed ? this.COLOR_RED : this.COLOR_BLUE;
    this.m_Line = null;
    this.m_Lines = new Array();
    this.m_Points = new Array();
    this.m_bViewOnly = bViewOnly;
    if (sHubName === null || sHubName === "") return;
    this.g_SignalRConnection = new signalR.HubConnectionBuilder().withUrl(sHubName, {
      transport: transportType,
      accessTokenFactory: tokenFactory
    }).withHubProtocol(hubProtocol).configureLogging(loggingLevel).build();
    this.g_SignalRConnection.onclose(function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(err) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(err !== null)) {
                  _context.next = 6;
                  break;
                }

                console.log(err);
                if (_this.iConnErrCount < 5) _this.iConnErrCount++;
                setTimeout(function () {
                  return _this.start();
                }, 4000 + _this.iExponentialBackOffMillis * _this.iConnErrCount);
                _context.next = 8;
                break;

              case 6:
                _context.next = 8;
                return _this.start();

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
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
        var _this2 = this;

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
                _context2.next = 12;
                break;

              case 7:
                _context2.prev = 7;
                _context2.t0 = _context2["catch"](0);
                console.log(_context2.t0 + '; iConnErrCount = ' + this.iConnErrCount);
                if (this.iConnErrCount < 5) this.iConnErrCount++;
                setTimeout(function () {
                  return _this2.start();
                }, 4000 + this.iExponentialBackOffMillis * this.iConnErrCount);

              case 12:
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
    value: function StartSignalRConnection(iGameID, iPlayerID, sMessageListSel, sSendButtonSel, sMessageInputSel) {
      if (this.g_SignalRConnection === null) return;
      this.g_iGameID = iGameID;
      this.g_iPlayerID = iPlayerID;
      this.g_SignalRConnection.on("ServerToClientPoint", function (point, user) {
        var encodedMsg = null;
        encodedMsg = InkBallPointViewModel.Format(user, point);
        var li = document.createElement("li");
        li.textContent = encodedMsg;
        document.querySelector(sMessageListSel).appendChild(li);
      });
      this.g_SignalRConnection.on("ServerToClientPing", function (ping, user) {
        var encodedMsg = null;
        encodedMsg = PingCommand.Format(user, ping);
        var li = document.createElement("li");
        li.textContent = encodedMsg;
        document.querySelector(sMessageListSel).appendChild(li);
      });
      document.querySelector(sSendButtonSel).addEventListener("click", function (event) {
        var message = document.querySelector(sMessageInputSel).value;
        var ping = new PingCommand(message);
        this.g_SignalRConnection.invoke("ClientToServerPing", ping).catch(function (err) {
          return console.error(err.toString());
        });
        event.preventDefault();
      }.bind(this), false);
      document.querySelector(sMessageInputSel).addEventListener("keyup", function (event) {
        event.preventDefault();

        if (event.keyCode === 13) {
          document.querySelector(sSendButtonSel).click();
        }
      }.bind(this), false);
      this.start();
    }
  }, {
    key: "Debug",
    value: function Debug() {
      switch (arguments.length) {
        case 1:
          this.m_Debug.innerHTML = arguments.length <= 0 ? undefined : arguments[0];
          break;

        case 2:
          var d = document.getElementById('debug' + (arguments.length <= 1 ? undefined : arguments[1]));
          d.innerHTML = arguments.length <= 0 ? undefined : arguments[0];
          break;

        default:
          break;
      }
    }
  }, {
    key: "SetTimer",
    value: function SetTimer(bStartTimer) {
      if (bStartTimer == false) {
        if (this.m_bIsTimerRunning == true) clearInterval(this.m_iTimerID);
        this.m_bIsTimerRunning = false;
      } else {
        if (this.m_bIsTimerRunning == true) clearInterval(this.m_iTimerID);else this.m_WaitStartTime = new Date();
        var interval = this.m_iTimerInterval * (1 + this.m_iSlowdownLevel * 0.5);
        this.m_iTimerID = setInterval(this.GameLoop, interval);
        this.m_bIsTimerRunning = true;
      }
    }
  }, {
    key: "DisableSelection",
    value: function DisableSelection(Target) {
      if (typeof Target.onselectstart != "undefined") Target.onselectstart = function () {
          return false;
        };else if (typeof Target.style.MozUserSelect != "undefined") Target.style.MozUserSelect = "none";else Target.onmousedown = function () {
          return false;
        };
      Target.style.cursor = "default";
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
      var x = iX * this.m_iGridSize;
      var y = iY * this.m_iGridSize;
      var radius = 4;
      var oval = $createOval(radius, 'true');
      oval.$move(x, y, radius);
      var color;

      switch (iStatus) {
        case this.POINT_FREE_RED:
        case StatusEnum.POINT_FREE_RED:
          color = this.COLOR_RED;
          oval.$SetStatus(this.POINT_FREE);
          break;

        case this.POINT_FREE_BLUE:
        case StatusEnum.POINT_FREE_BLUE:
          color = this.COLOR_BLUE;
          oval.$SetStatus(this.POINT_FREE);
          break;

        case this.POINT_FREE:
        case StatusEnum.POINT_FREE:
          color = this.m_sDotColor;
          oval.$SetStatus(this.POINT_FREE);
          break;

        case this.POINT_STARTING:
        case StatusEnum.POINT_STARTING:
          color = this.m_sDotColor;
          oval.$SetStatus(this.POINT_IN_PATH);
          break;

        case this.POINT_IN_PATH:
        case StatusEnum.POINT_IN_PATH:
          color = this.m_sDotColor;
          oval.$SetStatus(iStatus);
          break;

        case this.POINT_OWNED_BY_RED:
        case StatusEnum.POINT_OWNED_BY_RED:
          color = this.COLOR_OWNED_RED;
          oval.$SetStatus(iStatus);
          break;

        case this.POINT_OWNED_BY_BLUE:
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
    key: "SetPath",
    value: function SetPath(Points, bIsRed, bBelong2ThisPlayer) {
      Points = Points.split(" ");
      var count = Points.length,
          sDelimiter = "",
          p = null,
          sPathPoints = "";

      for (var _i2 = 0; _i2 < count; ++_i2) {
        p = Points[_i2].split(",");
        x = parseInt(p[0]);
        y = parseInt(p[1]);
        x *= this.m_iGridSize;
        y *= this.m_iGridSize;
        sPathPoints = sPathPoints + sDelimiter + x + "," + y;
        sDelimiter = " ";
        p = this.m_Points[y * this.m_iGridWidth + x];
        if (p != null) p.$SetStatus(this.POINT_IN_PATH);
      }

      p = Points[0].split(",");
      x = parseInt(p[0]);
      y = parseInt(p[1]);
      x *= this.m_iGridSize;
      y *= this.m_iGridSize;
      sPathPoints = sPathPoints + sDelimiter + x + "," + y;
      p = this.m_Points[y * this.m_iGridWidth + x];
      if (p != null) p.$SetStatus(this.POINT_IN_PATH);
      var line = $createPolyline(3, sPathPoints, bBelong2ThisPlayer ? this.m_sDotColor : bIsRed ? this.COLOR_BLUE : this.COLOR_RED);
      this.m_Lines[this.m_Lines.length] = line;
    }
  }, {
    key: "IsPointBelongingToLine",
    value: function IsPointBelongingToLine(sPoints, iX, iY) {
      var count = sPoints.length,
          x,
          y,
          pnt;

      for (var _i3 = 0; _i3 < count; ++_i3) {
        pnt = sPoints[_i3].split(",");
        x = pnt[0];
        y = pnt[1];
        if (x == iX && y == iY) return true;
      }

      return false;
    }
  }, {
    key: "pnpoly",
    value: function pnpoly(npol, xp, yp, x, y) {
      var i,
          j,
          c = 0;

      for (i = 0, j = npol - 1; i < npol; j = i++) {
        if ((yp[i] <= y && y < yp[j] || yp[j] <= y && y < yp[i]) && x < (xp[j] - xp[i]) * (y - yp[i]) / (yp[j] - yp[i]) + xp[i]) c = !c;
      }

      return c;
    }
  }, {
    key: "SurroundOponentPoints",
    value: function SurroundOponentPoints() {
      var count,
          points = this.m_Line.$GetPoints();
      count = points.length;
      var xs = Array(),
          ys = Array(),
          x,
          y,
          sPathPoints = "",
          sDelimiter = "",
          k = 0;

      for (var _i4 = 0; _i4 < count; _i4 += 2) {
        x = points[_i4];
        y = points[_i4 + 1];
        if (x == null || y == null) continue;
        x /= this.m_iGridSize;
        y /= this.m_iGridSize;
        xs[k] = x;
        ys[k] = y;
        sPathPoints = sPathPoints + sDelimiter + x + "," + y;
        sDelimiter = " ";
        ++k;
      }

      if (!(xs[0] == xs[xs.length - 1] && ys[0] == ys[ys.length - 1])) return {
        owned: "",
        path: ""
      };
      var count1 = this.m_Points.length;
      var sColor = this.m_sDotColor == this.COLOR_RED ? this.COLOR_BLUE : this.COLOR_RED;
      var owned_by = this.m_sDotColor == this.COLOR_RED ? this.POINT_OWNED_BY_RED : this.POINT_OWNED_BY_BLUE;
      var sOwnedCol = this.m_sDotColor == this.COLOR_RED ? this.COLOR_OWNED_RED : this.COLOR_OWNED_BLUE;
      var sOwnedPoints = "";
      sDelimiter = "";

      for (var _i5 = 0; _i5 < count1; ++_i5) {
        var p0 = this.m_Points[_i5];

        if (p0 != null && p0.$GetStatus() == this.POINT_FREE && p0.$GetFillColor() == sColor) {
          var pos = p0.$GetPosition();
          x = pos.x;
          y = pos.y;
          x /= this.m_iGridSize;
          y /= this.m_iGridSize;

          if (0 != this.pnpoly(count, xs, ys, x, y)) {
            p0.$SetStatus(owned_by);
            p0.$SetFillColor(sOwnedCol);
            p0.$strokeColor(sOwnedCol);
            sOwnedPoints = sOwnedPoints + sDelimiter + x + "," + y;
            sDelimiter = " ";
          }
        }
      }

      return {
        owned: sOwnedPoints,
        path: sPathPoints
      };
    }
  }, {
    key: "IsPointOutsideAllPaths",
    value: function IsPointOutsideAllPaths(iX, iY) {
      var count1 = this.m_Lines.length;

      for (var j = 0; j < count1; ++j) {
        var count = void 0,
            points = this.m_Lines[j].$GetPoints();
        count = points.length;

        var xs = Array(),
            ys = Array(),
            _x2 = void 0,
            _y = void 0,
            k = 0;

        for (var _i6 = 0; _i6 < count; _i6 += 2) {
          _x2 = points[_i6];
          _y = points[_i6 + 1];
          if (_x2 == null || _y == null) continue;
          _x2 /= this.m_iGridSize;
          _y /= this.m_iGridSize;
          xs[k] = _x2;
          ys[k] = _y;
          ++k;
        }

        if (0 != this.pnpoly(count, xs, ys, iX, iY)) return false;
      }

      return true;
    }
  }, {
    key: "CreateXMLWaitForPlayerRequest",
    value: function CreateXMLWaitForPlayerRequest() {
      var cmd = new WaitForPlayerCommand(arguments.length > 0 && (arguments.length <= 0 ? undefined : arguments[0]) == true ? true : false);
      return cmd;
    }
  }, {
    key: "CreateXMLPutPointRequest",
    value: function CreateXMLPutPointRequest(iX, iY) {
      var cmd = new InkBallPointViewModel(0, this.g_iGameID, this.g_iPlayerID, iX, iY, StatusEnum.POINT_FREE, 0);
      return cmd;
    }
  }, {
    key: "CreateXMLPutPathRequest",
    value: function CreateXMLPutPathRequest(sPathPoints, sOwnedPoints) {
      var cmd = new InkBallPathViewModel(0, this.g_iGameID, this.g_iPlayerID, sPathPoints, sOwnedPoints);
      return cmd;
    }
  }, {
    key: "SendAsyncData",
    value: function SendAsyncData(payload) {
      switch (payload.constructor.name) {
        case "InkBallPointViewModel":
          console.log(InkBallPointViewModel.Format('some player', payload));
          this.g_SignalRConnection.invoke("ClientToServerPoint", payload).catch(function (err) {
            return console.error(err.toString());
          });
          break;

        default:
          break;
      }
    }
  }, {
    key: "AjaxResponseCallBack",
    value: function AjaxResponseCallBack() {
      if (g_XmlHttp != null && (g_XmlHttp.readyState == 4 || g_XmlHttp.readyState == "complete") && g_XmlHttp.status == 200) {
        var xml = g_XmlHttp.responseXML;
        var response = xml.firstChild;
        if (response.nodeType != 1) response = response.nextSibling;
        var resp_type = response.nodeName;

        switch (resp_type) {
          case 'WaitForPlayer':
            var sP2Name = response.getElementsByTagName('P2Name').length > 0 ? response.getElementsByTagName('P2Name')[0].firstChild.data : '';
            var bActive = response.getElementsByTagName('Active')[0].firstChild.data == 'true' ? true : false;

            if (bActive) {
              if (sP2Name != '') {
                this.m_Player2Name.innerHTML = sP2Name;
                this.m_SurrenderButton.value = 'surrender';
              }

              if (this.m_SurrenderButton.value == 'win') this.m_SurrenderButton.value = 'surrender';
              var last_move = response.getElementsByTagName('LastMove')[0];
              last_move = last_move.firstChild;

              switch (last_move.nodeName) {
                case 'Point':
                  var _x4 = parseInt(last_move.getAttribute('x'));

                  var _y3 = parseInt(last_move.getAttribute('y'));

                  var iStatus = parseInt(last_move.getAttribute('status'));
                  this.SetPoint(_x4, _y3, iStatus);
                  this.m_bIsPlayerActive = true;
                  this.SetTimer(false);
                  if (!this.m_bIsMobile) this.Debug('Oponent has moved, your turn');else this.ShowMobileStatus();
                  break;

                case 'Path':
                  var path = last_move.firstChild.data;
                  var owned = response.getElementsByTagName('Owned')[0].firstChild.data;
                  this.SetPath(path, this.m_sDotColor == this.COLOR_RED ? true : false, false);
                  var Points = owned.split(" ");
                  var count = Points.length,
                      p = null;
                  var point_status = this.m_sDotColor == this.COLOR_RED ? this.POINT_OWNED_BY_RED : this.POINT_OWNED_BY_BLUE;
                  var sOwnedCol = this.m_sDotColor == this.COLOR_RED ? this.COLOR_OWNED_BLUE : this.COLOR_OWNED_RED;

                  for (var _i7 = 0; _i7 < count; ++_i7) {
                    p = Points[_i7].split(",");
                    _x4 = parseInt(p[0]);
                    _y3 = parseInt(p[1]);
                    p = this.m_Points[_y3 * this.m_iGridWidth + _x4];

                    if (p != null) {
                      p.$SetStatus(point_status);
                      p.$SetFillColor(sOwnedCol);
                      p.$strokeColor(sOwnedCol);
                    }
                  }

                  this.m_bIsPlayerActive = true;
                  this.SetTimer(false);
                  if (!this.m_bIsMobile) this.Debug('Oponent has moved, your turn');else this.ShowMobileStatus();
                  break;

                default:
                  break;
              }
            } else {
              this.m_sMessage = 'Waiting for oponent move';

              if (sP2Name != '') {
                this.m_Player2Name.innerHTML = sP2Name;
                this.m_SurrenderButton.value = 'surrender';
                if (this.m_bIsMobile) this.ShowMobileStatus();
              }
            }

            break;

          case 'PutPoint':
            this.m_bIsPlayerActive = false;
            this.m_iSlowdownLevel = 0;
            this.SetTimer(true);
            break;

          case 'PutPath':
            var points = this.m_Line.$GetPoints();
            var _x3 = points[i];
            var _y2 = points[i + 1];
            _x3 /= this.m_iGridSize;
            _y2 /= this.m_iGridSize;
            var p0 = this.m_Points[_y2 * this.m_iGridWidth + _x3];
            if (p0 != null) p0.$SetStatus(this.POINT_IN_PATH);
            this.m_Lines[this.m_Lines.length] = this.m_Line;
            this.m_iLastX = this.m_iLastY = -1;
            this.m_Line = null;
            this.m_bIsPlayerActive = false;
            this.m_iSlowdownLevel = 0;
            this.SetTimer(true);
            break;

          case 'InterruptGame':
            this.SetTimer(false);
            var msg = response.getElementsByTagName('msg').length > 0 ? response.getElementsByTagName('msg')[0].firstChild.data : '';
            if (msg == '') alert('Game interrupted!');else alert(msg);
            window.location.href = "Games";
            break;

          case 'WaitingForSecondPlayer':
            this.m_sMessage = 'Waiting for other player to connect';
            break;

          case 'Err':
            msg = response.getElementsByTagName('msg').length > 0 ? response.getElementsByTagName('msg')[0].firstChild.data : 'unknown error';
            alert(msg);
            this.OnCancelClick();
            break;

          default:
            break;
        }
      }
    }
  }, {
    key: "GameLoop",
    value: function GameLoop() {
      var bP2NameUnknown = this.m_Player2Name.innerHTML == '???' ? true : false;
      this.SendAsyncData(this.CreateXMLWaitForPlayerRequest(bP2NameUnknown));
      var d = parseInt((new Date() - this.m_WaitStartTime) / 1000);

      if (this.m_iSlowdownLevel <= 0 && d >= this.m_iTooLong2Duration * 0.25) {
        this.m_iSlowdownLevel = 1;
        this.SetTimer(true);
      } else if (this.m_iSlowdownLevel <= 1 && d >= this.m_iTooLong2Duration * 0.5) {
        this.m_iSlowdownLevel = 2;
        this.SetTimer(true);
      } else if (this.m_iSlowdownLevel <= 2 && d >= this.m_iTooLong2Duration * 0.75) {
        this.m_iSlowdownLevel = 4;
        this.SetTimer(true);
      } else if (d >= this.m_iTooLong2Duration) {
        if (bP2NameUnknown) {
          this.SetTimer(false);
          if (confirm('Second player is still not connecting. Continue waiting?') == true) this.SetTimer(true);else {
            window.location.href = "Games";
            return;
          }
        } else {
          this.SetTimer(false);
          this.m_SurrenderButton.value = 'win';
          alert('Second player is not responding for quiet long. To walkover win click win - or continue to wait for oponent move');
          this.SetTimer(true);
        }
      }

      if (!this.m_bIsMobile) {
        if (this.m_sMessage != '') this.Debug(this.m_sMessage + '(' + d + ')');
      } else {
        this.ShowMobileStatus(d);
      }
    }
  }, {
    key: "ShowMobileStatus",
    value: function ShowMobileStatus(iWaitTime) {
      var gameStatus = document.getElementById('GameStatus');

      if (this.m_Player2Name.innerHTML == '???') {
        if (gameStatus.style.backgroundImage.indexOf('pjonbgcurrent.gif') != -1) gameStatus.style.backgroundImage = 'url(img/pjonbgcurrent2.gif)';else gameStatus.style.backgroundImage = 'url(img/pjonbgcurrent.gif)';
      } else if (this.m_bIsPlayerActive) {
        if (this.m_bIsPlayingWithRed) gameStatus.style.backgroundImage = 'url(img/pjonbgcurrent.gif)';else gameStatus.style.backgroundImage = 'url(img/pjonbgcurrent2.gif)';
        this.Debug('', 0);
      } else {
        if (this.m_bIsPlayingWithRed) gameStatus.style.backgroundImage = 'url(img/pjonbgcurrent2.gif)';else gameStatus.style.backgroundImage = 'url(img/pjonbgcurrent.gif)';
        if (iWaitTime != 'undefined' && iWaitTime != null) this.Debug(iWaitTime);
      }
    }
  }, {
    key: "OnMouseMove",
    value: function OnMouseMove(event) {
      if (!this.m_bIsPlayerActive) return;
      var x = (event ? event.clientX : window.event.clientX) - this.m_Screen.offsetLeft + this.f_scrollLeft() + 0.5 * this.m_iGridSize;
      var y = (event ? event.clientY : window.event.clientY) - this.m_Screen.offsetTop + this.f_scrollTop() + 0.5 * this.m_iGridSize;
      x = parseInt(x / this.m_iGridSize);
      y = parseInt(y / this.m_iGridSize);

      if (this.m_bDrawLines) {
        if (this.m_bMouseDown == true && (this.m_iLastX != x || this.m_iLastY != y) && Math.abs(parseInt(this.m_iLastX - x)) <= 1 && Math.abs(parseInt(this.m_iLastY - y)) <= 1 && this.m_iLastX >= 0 && this.m_iLastY >= 0) {
          if (this.m_Line != null) {
            var p0 = this.m_Points[this.m_iLastY * this.m_iGridWidth + this.m_iLastX];
            var p1 = this.m_Points[y * this.m_iGridWidth + x];

            if (p0 != null && p1 != null && p1.$GetStatus() != this.POINT_IN_PATH && p0.$GetFillColor() == this.m_sDotColor && p1.$GetFillColor() == this.m_sDotColor) {
              var tox = x * this.m_iGridSize;
              var toy = y * this.m_iGridSize;
              this.m_Line.$AppendPoints(tox + "," + toy);
              if (p1.$GetStatus() != this.POINT_STARTING) p1.$SetStatus(this.POINT_IN_PATH);else {
                var val = this.SurroundOponentPoints();

                if (val.owned.length > 0) {
                  this.m_Line.$SetIsClosed(true);
                  this.Debug('Closing path', 0);
                  this.SendAsyncData(this.CreateXMLPutPathRequest(val.path, val.owned));
                } else this.Debug('Wrong path, cancell it or refresh page', 0);
              }
              this.m_iLastX = x;
              this.m_iLastY = y;
            }
          } else {
            var _p = this.m_Points[this.m_iLastY * this.m_iGridWidth + this.m_iLastX];
            var _p2 = this.m_Points[y * this.m_iGridWidth + x];

            if (_p != null && _p2 != null && _p.$GetStatus() != this.POINT_IN_PATH && _p2.$GetStatus() != this.POINT_IN_PATH && _p.$GetFillColor() == this.m_sDotColor && _p2.$GetFillColor() == this.m_sDotColor) {
              var fromx = this.m_iLastX * this.m_iGridSize;
              var fromy = this.m_iLastY * this.m_iGridSize;

              var _tox = x * this.m_iGridSize;

              var _toy = y * this.m_iGridSize;

              this.m_Line = $createPolyline(3, fromx + "," + fromy + " " + _tox + "," + _toy, this.m_sDotColor);
              if (_p.$GetStatus() != this.POINT_IN_PATH) _p.$SetStatus(this.POINT_STARTING);
              if (_p2.$GetStatus() != this.POINT_IN_PATH) _p2.$SetStatus(this.POINT_STARTING);
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
      if (!this.m_bIsPlayerActive) return;
      var x = (event ? event.clientX : window.event.clientX) - this.m_Screen.offsetLeft + this.f_scrollLeft() + 0.5 * this.m_iGridSize;
      var y = (event ? event.clientY : window.event.clientY) - this.m_Screen.offsetTop + this.f_scrollTop() + 0.5 * this.m_iGridSize;
      x = this.m_iMouseX = parseInt(x / this.m_iGridSize);
      y = this.m_iMouseY = parseInt(y / this.m_iGridSize);
      this.m_bMouseDown = true;

      if (!this.m_bDrawLines) {
        this.m_iLastX = x;
        this.m_iLastY = y;
        var loc_x = x;
        var loc_y = y;
        x = loc_x * this.m_iGridSize;
        y = loc_y * this.m_iGridSize;
        if (this.m_Points[loc_y * this.m_iGridWidth + loc_x] != null) return;
        if (!this.IsPointOutsideAllPaths(loc_x, loc_y)) return;
        var radius = 4;
        var oval = $createOval(radius, 'true');
        oval.$SetFillColor(this.m_sDotColor);
        oval.$strokeColor(this.m_sDotColor);
        oval.$move(x, y, radius);
        this.m_Points[loc_y * this.m_iGridWidth + loc_x] = oval;
        this.SendAsyncData(this.CreateXMLPutPointRequest(loc_x, loc_y));
      } else {
        if ((this.m_iLastX != x || this.m_iLastY != y) && Math.abs(parseInt(this.m_iLastX - x)) <= 1 && Math.abs(parseInt(this.m_iLastY - y)) <= 1 && this.m_iLastX >= 0 && this.m_iLastY >= 0) {
          if (this.m_Line != null) {
            var p0 = this.m_Points[this.m_iLastY * this.m_iGridWidth + this.m_iLastX];
            var p1 = this.m_Points[y * this.m_iGridWidth + x];

            if (p0 != null && p1 != null && p1.$GetStatus() != this.POINT_IN_PATH && p0.$GetFillColor() == this.m_sDotColor && p1.$GetFillColor() == this.m_sDotColor) {
              var tox = x * this.m_iGridSize;
              var toy = y * this.m_iGridSize;
              this.m_Line.$AppendPoints(tox + "," + toy);
              if (p1.$GetStatus() != this.POINT_STARTING) p1.$SetStatus(this.POINT_IN_PATH);else {
                var val = this.SurroundOponentPoints();

                if (val.owned.length > 0) {
                  this.m_Line.$SetIsClosed(true);
                  this.Debug('Closing path', 0);
                  this.SendAsyncData(this.CreateXMLPutPathRequest(val.path, val.owned));
                } else this.Debug('Wrong path, cancell it or refresh page', 0);
              }
              this.m_iLastX = x;
              this.m_iLastY = y;
            }
          } else {
            var _p3 = this.m_Points[this.m_iLastY * this.m_iGridWidth + this.m_iLastX];
            var _p4 = this.m_Points[y * this.m_iGridWidth + x];

            if (_p3 != null && _p4 != null && _p3.$GetStatus() != this.POINT_IN_PATH && _p4.$GetStatus() != this.POINT_IN_PATH && _p3.$GetFillColor() == this.m_sDotColor && _p4.$GetFillColor() == this.m_sDotColor) {
              var fromx = this.m_iLastX * this.m_iGridSize;
              var fromy = this.m_iLastY * this.m_iGridSize;

              var _tox2 = x * this.m_iGridSize;

              var _toy2 = y * this.m_iGridSize;

              this.m_Line = $createPolyline(3, fromx + "," + fromy + " " + _tox2 + "," + _toy2, this.m_sDotColor);
              if (_p3.$GetStatus() != this.POINT_IN_PATH) _p3.$SetStatus(this.POINT_STARTING);
              if (_p4.$GetStatus() != this.POINT_IN_PATH) _p4.$SetStatus(this.POINT_STARTING);
            }

            this.m_iLastX = x;
            this.m_iLastY = y;
          }
        } else if (this.m_iLastX < 0 || this.m_iLastY < 0) {
          var _p5 = this.m_Points[y * this.m_iGridWidth + x];

          if (_p5 != null && _p5.$GetStatus() == this.POINT_FREE && _p5.$GetFillColor() == this.m_sDotColor) {
            this.m_iLastX = x;
            this.m_iLastY = y;
          }
        }
      }
    }
  }, {
    key: "OnMouseUp",
    value: function OnMouseUp(event) {
      this.m_bMouseDown = false;
    }
  }, {
    key: "OnScroll",
    value: function OnScroll() {
      this.m_iScrollX = this.f_scrollLeft();
      this.m_iScrollY = this.f_scrollTop();
    }
  }, {
    key: "OnDrawModeClick",
    value: function OnDrawModeClick() {
      this.m_bDrawLines = !this.m_bDrawLines;
      var draw_mode = document.getElementById('DrawMode');

      if (!this.m_bDrawLines) {
        draw_mode.value = 'Draw lines';
      } else {
        draw_mode.value = 'Draw dots';
      }

      this.m_iLastX = this.m_iLastY = -1;
      this.m_Line = null;
    }
  }, {
    key: "OnCancelClick",
    value: function OnCancelClick() {
      if (this.m_bDrawLines) {
        if (this.m_Line != null) {
          var points = this.m_Line.$GetPoints();

          for (var _i8 = 0; _i8 < points.length; _i8 += 2) {
            var _x5 = points[_i8];
            var _y4 = points[_i8 + 1];
            if (_x5 == null || _y4 == null) continue;
            _x5 /= this.m_iGridSize;
            _y4 /= this.m_iGridSize;
            var p0 = this.m_Points[_y4 * this.m_iGridWidth + _x5];
            if (p0 != null) p0.$SetStatus(this.POINT_FREE);
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
      if (this.m_bDrawLines) {
        if (this.m_Line != null) {
          var val = this.SurroundOponentPoints();

          if (val.owned.length > 0) {
            this.m_iLastX = this.m_iLastY = -1;
            this.m_Line = null;
          }
        }
      } else {
        var p0 = this.m_Points[this.m_iLastY * this.m_iGridWidth + this.m_iLastX];
        var pos = p0.$GetPosition();
        this.Debug("".concat(p0.$GetFillColor(), " posX = ").concat(pos.x, " posY = ").concat(pos.y), 1);
      }
    }
  }, {
    key: "PrepareDrawing",
    value: function PrepareDrawing(sScreen, sPlayer2Name) {
      var iTooLong2Duration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 125;
      this.m_bIsWon = false;
      this.m_iDelayBetweenMultiCaptures = 4000;
      this.m_iTimerInterval = 2000;
      this.m_iTooLong2Duration = iTooLong2Duration;
      this.m_iTimerID = null;
      this.m_bIsTimerRunning = false;
      this.m_WaitStartTime = null;
      this.m_iSlowdownLevel = 0;
      this.m_iGridWidth = 0;
      this.m_iGridHeight = 0;
      this.m_iLastX = -1;
      this.m_iLastY = -1;
      this.m_iMouseX = 0;
      this.m_iMouseY = 0;
      this.m_iPosX = 0;
      this.m_iPosY = 0;
      this.m_iScrollX = 0;
      this.m_iScrollY = 0;
      this.m_iClientWidth = 0;
      this.m_iClientHeight = 0;
      this.m_Debug = null;
      this.m_SurrenderButton = null;
      this.m_bMouseDown = false;
      this.m_bDrawLines = !true;
      this.m_sMessage = '';
      this.m_sDotColor = this.m_bIsPlayingWithRed ? this.COLOR_RED : this.COLOR_BLUE;
      this.m_Line = null;
      this.m_Lines = new Array();
      this.m_Points = new Array();
      this.m_Debug = document.getElementById('debug0');
      this.m_Player2Name = document.querySelector(sPlayer2Name);
      this.m_SurrenderButton = document.getElementById('SurrenderButton');
      this.m_Screen = document.querySelector(sScreen);

      if (!this.m_Screen) {
        alert("no board");
        return;
      }

      this.m_iPosX = this.m_Screen.offsetLeft;
      this.m_iPosY = this.m_Screen.offsetTop;
      this.m_iClientWidth = this.m_Screen.clientWidth;
      this.m_iClientHeight = this.m_Screen.clientHeight;
      this.m_iGridWidth = parseInt(this.m_iClientWidth / this.m_iGridSize);
      this.m_iGridHeight = parseInt(this.m_iClientHeight / this.m_iGridSize);
      this.m_iScrollX = this.f_scrollLeft();
      this.m_iScrollY = this.f_scrollTop();
      $createSVGVML(this.m_Screen, this.m_Screen.style.width, this.m_Screen.style.height, true);
      this.DisableSelection(this.m_Screen);

      if (!this.m_bViewOnly) {
        this.m_Screen.onmousedown = this.OnMouseDown.bind(this);
        this.m_Screen.onmousemove = this.OnMouseMove.bind(this);
        this.m_Screen.onmouseup = this.OnMouseUp.bind(this);
        window.onscroll = this.OnScroll.bind(this);
        var button = document.getElementById('DrawMode');
        button.onclick = this.OnDrawModeClick.bind(this);
        button = document.getElementById('Cancel');
        button.onclick = this.OnCancelClick.bind(this);
      }
    }
  }]);

  return InkBallGame;
}();