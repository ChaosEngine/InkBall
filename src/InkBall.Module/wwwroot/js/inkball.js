"use strict";

/******** funcs-n-classes ********/
const StatusEnum = Object.freeze({
	"POINT_FREE": -1,
	"POINT_STARTING": 0,
	"POINT_IN_PATH": 1,
	"POINT_OWNED_BY_RED": 2,
	"POINT_OWNED_BY_BLU": 3
});

class InkBallPointViewModel {

	constructor(iId = 0, iGameId = 0, iPlayerId = 0, iX = 0, iY = 0, Status = StatusEnum.POINT_FREE, iEnclosingPathId = 0, sMessage = '') {
		this.iId = iId;
		this.iGameId = iGameId;
		this.iPlayerId = iPlayerId;
		this.iX = iX;
		this.iY = iY;
		this.Status = Status;
		this.iEnclosingPathId = iEnclosingPathId;
		this.Message = sMessage;
	}

	static Format(sUser, point) {
		let msg = /*htmlEncode*/(point.Message);

		return sUser + " says " + msg;
	}
}

function htmlEncode(html) {
	//return html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
	return document.createElement('a').appendChild(
		document.createTextNode(html)).parentNode.innerHTML;
}
/******** /funcs-n-classes ********/

var g_SignalRConnection = null, g_iGameID = null, g_iPlayerID = null;

function BuildSignalR(hubName, loggingLevel, hubProtocol, transportType, tokenFactory) {
	if (hubName === null || hubName === "") return;

	g_SignalRConnection = new signalR.HubConnectionBuilder()
		.withUrl(hubName, {
			transport: transportType,
			accessTokenFactory: tokenFactory
		})
		.withHubProtocol(hubProtocol)
		.configureLogging(loggingLevel)
		.build();
}

function StartSignalRConnection(iGameID, iPlayerID) {
	if (g_SignalRConnection === null) return;
	g_iGameID = iGameID;
	g_iPlayerID = iPlayerID;

	g_SignalRConnection.on("ReceiveMessage", function (point, user) {
		let encodedMsg = InkBallPointViewModel.Format(user, point);

		let li = document.createElement("li");
		li.textContent = encodedMsg;
		document.getElementById("messagesList").appendChild(li);
	});

	document.getElementById("sendButton").addEventListener("click", function (event) {
		let message = document.getElementById("messageInput").value;

		let fake_point = new InkBallPointViewModel(0, g_iGameID, g_iPlayerID, 1, 2,
			StatusEnum.POINT_IN_PATH, 0, message);

		g_SignalRConnection.invoke("SendMessage", fake_point).catch(function (err) {
			return console.error(err.toString());
		});
		event.preventDefault();
	});
	// Execute a function when the user releases a key on the keyboard
	document.getElementById("messageInput").addEventListener("keyup", function (event) {
		event.preventDefault();// Cancel the default action, if needed

		if (event.keyCode === 13) {// Number 13 is the "Enter" key on the keyboard
			// Trigger the button element with a click
			document.getElementById("sendButton").click();
		}
	});

	g_SignalRConnection.onclose(async (err) => {
		if (err !== null) {
			console.log(err);
			setTimeout(() => start(), 5000);
		}
		else
			await start();
	});

	async function start() {
		try {
			await g_SignalRConnection.start();
			console.log('connected');
		}
		catch (err) {
			console.log(err);
			setTimeout(() => start(), 5000);
		}
	}
	start();
}
