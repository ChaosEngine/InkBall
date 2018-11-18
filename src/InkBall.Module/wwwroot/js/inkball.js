"use strict";

var g_SignalRConnection = null;

function buildSignalR(hubName)
{
	if(hubName == null || hubName == "")	return;

	g_SignalRConnection = new signalR.HubConnectionBuilder()
		.withUrl(hubName
			//, { transport: signalR.HttpTransportType.WebSockets }
		)
		.configureLogging(signalR.LogLevel.Information)
		.build();
}

function startSignalRConnection()
{
	if(g_SignalRConnection == null)	return;

	g_SignalRConnection.on("ReceiveMessage", function (user, message) {
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
		var user = document.getElementById("userInput").value;
		var message = document.getElementById("messageInput").value;
		g_SignalRConnection.invoke("SendMessage", user, message).catch(function (err) {
			return console.error(err.toString());
		});
		event.preventDefault();
	});
}
