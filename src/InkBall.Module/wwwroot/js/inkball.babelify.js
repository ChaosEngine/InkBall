"use strict";
/******** funcs-n-classes ********/

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var StatusEnum = Object.freeze({
  "POINT_FREE": -1,
  "POINT_STARTING": 0,
  "POINT_IN_PATH": 1,
  "POINT_OWNED_BY_RED": 2,
  "POINT_OWNED_BY_BLU": 3
});

var InkBallPointViewModel =
/*#__PURE__*/
function () {
  function InkBallPointViewModel() {
    var iId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var iGameId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var iPlayerId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var iX = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var iY = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
    var Status = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : StatusEnum.POINT_FREE;
    var iEnclosingPathId = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
    var sMessage = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : '';

    _classCallCheck(this, InkBallPointViewModel);

    this.iId = iId;
    this.iGameId = iGameId;
    this.iPlayerId = iPlayerId;
    this.iX = iX;
    this.iY = iY;
    this.Status = Status;
    this.iEnclosingPathId = iEnclosingPathId;
    this.Message = sMessage;
  }

  _createClass(InkBallPointViewModel, null, [{
    key: "Format",
    value: function Format(sUser, point) {
      var msg =
      /*htmlEncode*/
      point.Message;
      return sUser + " says " + msg;
    }
  }]);

  return InkBallPointViewModel;
}();

function htmlEncode(html) {
  //return html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return document.createElement('a').appendChild(document.createTextNode(html)).parentNode.innerHTML;
}
/******** /funcs-n-classes ********/


var g_SignalRConnection = null,
    g_iGameID = null,
    g_iPlayerID = null;

function BuildSignalR(hubName, loggingLevel, hubProtocol, transportType, tokenFactory) {
  if (hubName === null || hubName === "") return;
  g_SignalRConnection = new signalR.HubConnectionBuilder().withUrl(hubName, {
    transport: transportType,
    accessTokenFactory: tokenFactory
  }).withHubProtocol(hubProtocol).configureLogging(loggingLevel).build();
}

function StartSignalRConnection(iGameID, iPlayerID) {
  if (g_SignalRConnection === null) return;
  g_iGameID = iGameID;
  g_iPlayerID = iPlayerID;
  g_SignalRConnection.on("ReceiveMessage", function (point, user) {
    var encodedMsg = InkBallPointViewModel.Format(user, point);
    var li = document.createElement("li");
    li.textContent = encodedMsg;
    document.getElementById("messagesList").appendChild(li);
  });
  document.getElementById("sendButton").addEventListener("click", function (event) {
    var message = document.getElementById("messageInput").value;
    var fake_point = new InkBallPointViewModel(0, g_iGameID, g_iPlayerID, 1, 2, StatusEnum.POINT_IN_PATH, 0, message);
    g_SignalRConnection.invoke("SendMessage", fake_point).catch(function (err) {
      return console.error(err.toString());
    });
    event.preventDefault();
  });
  g_SignalRConnection.onclose(
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(err) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(err != null)) {
                _context.next = 5;
                break;
              }

              console.log(err);
              setTimeout(function () {
                return start();
              }, 5000);
              _context.next = 7;
              break;

            case 5:
              _context.next = 7;
              return start();

            case 7:
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

  function start() {
    return _start.apply(this, arguments);
  }

  function _start() {
    _start = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2() {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return g_SignalRConnection.start();

            case 3:
              console.log('connected');
              _context2.next = 10;
              break;

            case 6:
              _context2.prev = 6;
              _context2.t0 = _context2["catch"](0);
              console.log(_context2.t0);
              setTimeout(function () {
                return start();
              }, 5000);

            case 10:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this, [[0, 6]]);
    }));
    return _start.apply(this, arguments);
  }

  start();
}