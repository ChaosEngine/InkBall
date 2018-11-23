"use strict";

const StatusEnum = Object.freeze(
	{
		"POINT_FREE": -1,
		"POINT_STARTING": 0,
		"POINT_IN_PATH": 1,
		"POINT_OWNED_BY_RED": 2,
		"POINT_OWNED_BY_BLU": 3
	});

class InkBallPointViewModel {

	constructor(iId = 0, iGameId = 0, iPlayerId = 0, iX = 0, iY = 0,
		Status = StatusEnum.POINT_FREE, iEnclosingPathId = 0, sMessage = "") {
		this.iId = iId;
		this.iGameId = iGameId;
		this.iPlayerId = iPlayerId;
		this.iX = iX;
		this.iY = iY;
		this.Status = Status;
		this.iEnclosingPathId = iEnclosingPathId;
		this.Message = sMessage;
	}
}

var g_SignalRConnection = null;

function buildSignalR(hubName, loggingLevel, hubProtocol, transportType) {
	if (hubName == null || hubName == "") return;

	g_SignalRConnection = new signalR.HubConnectionBuilder()
		.withUrl(hubName, { transport: transportType })
		.withHubProtocol(hubProtocol)
		.configureLogging(loggingLevel)
		.build();
}

function startSignalRConnection() {
	if (g_SignalRConnection == null) return;

	g_SignalRConnection.on("ReceiveMessage", function (point, user, message) {
		var message = point.Message;

		var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
		var encodedMsg = user + " says " + msg;
		var li = document.createElement("li");
		li.textContent = encodedMsg;
		document.getElementById("messagesList").appendChild(li);
	});

	g_SignalRConnection.start().catch(function (err) {
		return console.error(err.toString());
	});

	document.getElementById("sendButton").addEventListener("click", function (event) {
		var message = document.getElementById("messageInput").value;
		var user = document.getElementById("userInput").value;

		var point = new InkBallPointViewModel(0, 0, 0, 1, 2,
			StatusEnum.POINT_IN_PATH, 0, message);

		g_SignalRConnection.invoke("SendMessage", point, user, message).catch(function (err) {
			return console.error(err.toString());
		});
		event.preventDefault();
	});
}
