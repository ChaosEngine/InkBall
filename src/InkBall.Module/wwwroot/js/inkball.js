"use strict";

const StatusEnum = Object.freeze({
	"POINT_FREE": -1,
	"POINT_STARTING": 0,
	"POINT_IN_PATH": 1,
	"POINT_OWNED_BY_RED": 2,
	"POINT_OWNED_BY_BLU": 3
});

function InkBallPointViewModel(iId, iGameId, iPlayerId, iX, iY, Status, iEnclosingPathId, sMessage) {
	var This = this;

	this.iId = iId;
	this.iGameId = iGameId;
	this.iPlayerId = iPlayerId;
	this.iX = iX;
	this.iY = iY;
	this.Status = Status;
	this.iEnclosingPathId = iEnclosingPathId;
	this.Message = sMessage;
}

//static methods
InkBallPointViewModel.Format = function (sUser, point) {
	let msg = point.Message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

	return sUser + " says " + msg;
};

var g_SignalRConnection = null, g_iGameID = null, g_iPlayerID = null;

function BuildSignalR(hubName, loggingLevel, hubProtocol, transportType) {
	if (hubName === null || hubName === "") return;

	g_SignalRConnection = new signalR.HubConnectionBuilder()
		.withUrl(hubName, { transport: transportType })
		.withHubProtocol(hubProtocol)
		.configureLogging(loggingLevel)
		.build();
}

function StartSignalRConnection(iGameID, iPlayerID) {
	if (g_SignalRConnection === null) return;
	g_iGameID = iGameID;
	g_iPlayerID = iPlayerID;


	g_SignalRConnection.on("ReceiveMessage", function (point, user/*, message*/) {
		let encodedMsg = InkBallPointViewModel.Format(user, point);

		let li = document.createElement("li");
		li.textContent = encodedMsg;
		document.getElementById("messagesList").appendChild(li);
	});

	g_SignalRConnection.start().catch(function (err) {
		return console.error(err.toString());
	});

	document.getElementById("sendButton").addEventListener("click", function (event) {
		let message = document.getElementById("messageInput").value;
		//let user = document.getElementById("userInput").value;

		let point = new InkBallPointViewModel(0, g_iGameID, g_iPlayerID, 1, 2,
			StatusEnum.POINT_IN_PATH, 0, message);

		g_SignalRConnection.invoke("SendMessage", point/*, user, message*/).catch(function (err) {
			return console.error(err.toString());
		});
		event.preventDefault();
	});
}
