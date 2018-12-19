"use strict";

/******** funcs-n-classes ********/
const StatusEnum = Object.freeze({
	"POINT_FREE": -1,
	"POINT_STARTING": 0,
	"POINT_IN_PATH": 1,
	"POINT_OWNED_BY_RED": 2,
	"POINT_OWNED_BY_BLU": 3
});

const CommandKindEnum = Object.freeze({
	"UNKNOWN": -1,
	"PING": 0,
	"POINT": 1,
	"PATH": 2,
	"PLAYER_JOINING": 3,
	"PLAYER_SURRENDE": 4
});

class InkBallPointViewModel {
	constructor(iId = 0, iGameId = 0, iPlayerId = 0, iX = 0, iY = 0, Status = StatusEnum.POINT_FREE, iEnclosingPathId = 0) {

		this.iId = iId;
		this.iGameId = iGameId;
		this.iPlayerId = iPlayerId;
		this.iX = iX;
		this.iY = iY;
		this.Status = Status;
		this.iEnclosingPathId = iEnclosingPathId;
	}

	static Format(sUser, point) {
		let msg = point.iX + ' ' + point.iY + ' ' + point.Status;

		return sUser + " places " + msg + " point";
	}
}

class PingCommand {
	get Message() { return this.message; }
	set Message(value) { this.message = value; }

	constructor(message = '') {
		this.Message = message;
	}

	static Format(sUser, ping) {
		let msg = ping.Message;

		return sUser + " says " + msg;
	}
}

function htmlEncode(html) {
	//return html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
	return document.createElement('a').appendChild(
		document.createTextNode(html)).parentNode.innerHTML;
}
/******** /funcs-n-classes ********/

class InkBallGame {

	/**
	 * InkBallGame contructor
	 * @param {string} hubName SignalR hub name
	 * @param {enum} loggingLevel log level for SignalR
	 * @param {enum} hubProtocol Json or messagePack
	 * @param {enum} transportType websocket, server events or long polling
	 * @param {function} tokenFactory auth token factory
	 * @param {bool} bIsPlayingWithRed true - red, false - blue
	 * @param {bool} bIsPlayerActive is this player acive now
	 * @param {number} iTooLong2Duration too long wait duration
	 * @param {bool} bIsMobile always true?, legacy stuff
	 * @param {bool} bViewOnly only viewing the game no interaction
	 */
	constructor(hubName, loggingLevel, hubProtocol, transportType, tokenFactory,
		bIsPlayingWithRed = true, bIsPlayerActive = true, iTooLong2Duration = 125, bIsMobile = true, bViewOnly = false) {
		self = this;
		this.g_iGameID = null;
		this.g_iPlayerID = null;
		this.iConnErrCount = 0;
		this.iExponentialBackOffMillis = 2000;




		/**
		 * [Old-legacy code]
		 */
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
		this.m_iTooLong2Duration = iTooLong2Duration/*125*/;
		this.m_iTimerID = null;
		this.m_bIsTimerRunning = false;
		this.m_WaitStartTime = null;
		this.m_iSlowdownLevel = 0;
		this.m_iGridSize = 15;
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
		/**
		 * [/Old-legacy code]
		 */








		if (hubName === null || hubName === "") return;

		this.g_SignalRConnection = new signalR.HubConnectionBuilder()
			.withUrl(hubName, {
				transport: transportType,
				accessTokenFactory: tokenFactory
			})
			.withHubProtocol(hubProtocol)
			.configureLogging(loggingLevel)
			.build();

		this.g_SignalRConnection.onclose(async (err) => {
			if (err !== null) {
				console.log(err);

				if (self.iConnErrCount < 5)
					self.iConnErrCount++;
				setTimeout(() => self.start(), 4000 + (self.iExponentialBackOffMillis * self.iConnErrCount));
			}
			else
				await self.start();
		});
	}

	async start() {
		try {
			await self.g_SignalRConnection.start();
			self.iConnErrCount = 0;
			console.log('connected; iConnErrCount = ' + self.iConnErrCount);
		}
		catch (err) {
			console.log(err + '; iConnErrCount = ' + self.iConnErrCount);

			if (self.iConnErrCount < 5)
				self.iConnErrCount++;
			setTimeout(() => self.start(), 4000 + (self.iExponentialBackOffMillis * self.iConnErrCount));
		}
	}

	StartSignalRConnection(iGameID, iPlayerID, ulMessagesList, inpSendButton, inpMessageInput) {
		if (self.g_SignalRConnection === null) return;
		self.g_iGameID = iGameID;
		self.g_iPlayerID = iPlayerID;

		self.g_SignalRConnection.on("ServerToClientPoint", function (point, user) {

			let encodedMsg = null;
			encodedMsg = InkBallPointViewModel.Format(user, point);

			let li = document.createElement("li");
			li.textContent = encodedMsg;
			document.getElementById(ulMessagesList).appendChild(li);
			//TODO: addd drawing point on SVG board
		});
		self.g_SignalRConnection.on("ServerToClientPing", function (ping, user) {

			let encodedMsg = null;
			encodedMsg = PingCommand.Format(user, ping);

			let li = document.createElement("li");
			li.textContent = encodedMsg;
			document.getElementById(ulMessagesList).appendChild(li);
		});


		document.getElementById(inpSendButton).addEventListener("click", function (event) {
			let message = document.getElementById(inpMessageInput).value;

			let ping = new PingCommand(message);
			//TODO: capture click/draw event and send it to server as point
			self.g_SignalRConnection.invoke("ClientToServerPing", ping).catch(function (err) {
				return console.error(err.toString());
			});
			event.preventDefault();
		});
		// Execute a function when the user releases a key on the keyboard
		document.getElementById(inpMessageInput).addEventListener("keyup", function (event) {
			event.preventDefault();// Cancel the default action, if needed

			if (event.keyCode === 13) {// Number 13 is the "Enter" key on the keyboard
				// Trigger the button element with a click
				document.getElementById(inpSendButton).click();
			}
		});

		self.start();
	}








	/**
	 * [Old-legacy code]
	 */
	Debug() {
		switch (self.Debug.arguments.length) {
			case 1:
				self.m_Debug.innerHTML = self.Debug.arguments[0];
				break;
			case 2:
				var d = document.getElementById('debug' + self.Debug.arguments[1]);
				d.innerHTML = self.Debug.arguments[0];
				break;
			default:
				break;
		}
	}

	SetTimer(bStartTimer) {
		if (bStartTimer == false) {
			if (self.m_bIsTimerRunning == true)
				clearInterval(self.m_iTimerID);
			self.m_bIsTimerRunning = false;
		}
		else {
			if (self.m_bIsTimerRunning == true)
				clearInterval(self.m_iTimerID);
			else
				self.m_WaitStartTime = new Date();
			var interval = self.m_iTimerInterval * (1 + self.m_iSlowdownLevel * 0.5);
			self.m_iTimerID = setInterval(self.GameLoop, interval);
			self.m_bIsTimerRunning = true;
		}
	}

	/**
	 * Disable Text Selection script- © Dynamic Drive DHTML code library (www.dynamicdrive.com)
	 * This notice MUST stay intact for legal use
	 * Visit Dynamic Drive at http://www.dynamicdrive.com/ for full source code
	 * 
	 * @param {element} Target is the element with disabled selection of text
	 */
	DisableSelection(Target) {
		if (typeof Target.onselectstart != "undefined")//IE route
			Target.onselectstart = function () { return false; }
		else if (typeof Target.style.MozUserSelect != "undefined")//Firefox route
			Target.style.MozUserSelect = "none";
		else//All other route (ie: Opera)
			Target.onmousedown = function () { return false; }
		Target.style.cursor = "default";
	}

	f_clientWidth() {
		return self.f_filterResults(
			window.innerWidth ? window.innerWidth : 0,
			document.documentElement ? document.documentElement.clientWidth : 0,
			document.body ? document.body.clientWidth : 0
		);
	}

	f_clientHeight() {
		return self.f_filterResults(
			window.innerHeight ? window.innerHeight : 0,
			document.documentElement ? document.documentElement.clientHeight : 0,
			document.body ? document.body.clientHeight : 0
		);
	}

	f_scrollLeft() {
		return self.f_filterResults(
			window.pageXOffset ? window.pageXOffset : 0,
			document.documentElement ? document.documentElement.scrollLeft : 0,
			document.body ? document.body.scrollLeft : 0
		);
	}

	f_scrollTop() {
		return self.f_filterResults(
			window.pageYOffset ? window.pageYOffset : 0,
			document.documentElement ? document.documentElement.scrollTop : 0,
			document.body ? document.body.scrollTop : 0
		);
	}

	f_filterResults(n_win, n_docel, n_body) {
		var n_result = n_win ? n_win : 0;
		if (n_docel && (!n_result || (n_result > n_docel)))
			n_result = n_docel;
		return n_body && (!n_result || (n_result > n_body)) ? n_body : n_result;
	}

	SetPoint(iX, iY, iStatus) {
		var x = iX * self.m_iGridSize;
		var y = iY * self.m_iGridSize;

		var radius = 4;
		var oval = $createOval(radius, 'true');
		oval.$move(x, y, radius);

		var color;
		switch (iStatus) {
			case self.POINT_FREE_RED:
				color = self.COLOR_RED;
				oval.$SetStatus(self.POINT_FREE);
				break;
			case self.POINT_FREE_BLUE:
				color = self.COLOR_BLUE;
				oval.$SetStatus(self.POINT_FREE);
				break;
			case self.POINT_FREE:
				color = self.m_sDotColor;
				oval.$SetStatus(self.POINT_FREE);
				break;
			case self.POINT_STARTING:
				color = self.m_sDotColor;
				oval.$SetStatus(/*iStatus*/self.POINT_IN_PATH);
				break;
			case self.POINT_IN_PATH:
				color = self.m_sDotColor;
				oval.$SetStatus(iStatus);
				break;
			case self.POINT_OWNED_BY_RED:
				color = self.COLOR_OWNED_RED;
				oval.$SetStatus(iStatus);
				break;
			case self.POINT_OWNED_BY_BLUE:
				color = self.COLOR_OWNED_BLUE;
				oval.$SetStatus(iStatus);
				break;
			default:
				alert('bad point');
				break;
		}

		oval.$SetFillColor(color);
		oval.$strokeColor(color);

		self.m_Points[iY * self.m_iGridWidth + iX] = oval;
	}

	SetPath(Points, bIsRed, bBelong2ThisPlayer) {
		Points = Points.split(" ");
		var count = Points.length, sDelimiter = "", p = null, sPathPoints = "";
		for (var i = 0; i < count; ++i) {
			p = Points[i].split(",");
			x = parseInt(p[0]); y = parseInt(p[1]);
			x *= self.m_iGridSize; y *= self.m_iGridSize;
			sPathPoints = sPathPoints + sDelimiter + x + "," + y;
			sDelimiter = " ";

			p = self.m_Points[y * self.m_iGridWidth + x];
			if (p != null) p.$SetStatus(self.POINT_IN_PATH);
		}
		p = Points[0].split(",");
		x = parseInt(p[0]); y = parseInt(p[1]);
		x *= self.m_iGridSize; y *= self.m_iGridSize;
		sPathPoints = sPathPoints + sDelimiter + x + "," + y;
		p = self.m_Points[y * self.m_iGridWidth + x];
		if (p != null) p.$SetStatus(self.POINT_IN_PATH/*self.POINT_STARTING*/);

		var line = $createPolyline(3, sPathPoints,
			(bBelong2ThisPlayer ? self.m_sDotColor : (bIsRed ? self.COLOR_BLUE : self.COLOR_RED)));
		self.m_Lines[self.m_Lines.length] = line;
	}

	IsPointBelongingToLine(sPoints, iX, iY) {
		var count = sPoints.length, x, y, pnt;
		for (var i = 0; i < count; ++i) {
			pnt = sPoints[i].split(",");
			x = pnt[0]; y = pnt[1];
			if (x == iX && y == iY)
				return true;
		}
		return false;
	}

	/**
	 * Based on http://www.faqs.org/faqs/graphics/algorithms-faq/
	 * but mainly on http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
	 * returns != 0 if point is inside path
	 * @param {points} npol 
	 * @param {number} xp 
	 * @param {number} yp 
	 * @param {number} x 
	 * @param {number} y 
	 */
	pnpoly(npol, xp, yp, x, y) {
		var i, j, c = 0;
		for (i = 0, j = npol - 1; i < npol; j = i++) {
			if ((((yp[i] <= y) && (y < yp[j])) ||
				((yp[j] <= y) && (y < yp[i]))) &&
				(x < (xp[j] - xp[i]) * (y - yp[i]) / (yp[j] - yp[i]) + xp[i]))

				c = !c;
		}
		return c;
	}

	SurroundOponentPoints() {
		//if(!self.m_Line.$GetIsClosed())	return;
		var count, points = self.m_Line.$GetPoints();

		//convert to x's and y's arrays
		count = points.length;
		//alert('s' + points + 'e' + ' count = ' + count);
		var xs = Array(), ys = Array(), x, y, sPathPoints = "", sDelimiter = "", k = 0;
		for (var i = 0; i < count; i += 2) {
			//y = points[i].split(",");
			//x = y[0];	y = y[1];
			x = points[i];
			y = points[i + 1];
			//alert('x = ' + x + ' y = ' + y);
			if (x == null || y == null) continue;
			x /= self.m_iGridSize; y /= self.m_iGridSize;
			xs[k] = x; ys[k] = y;
			sPathPoints = sPathPoints + sDelimiter + x + "," + y;
			sDelimiter = " ";
			++k;
		}
		//alert(sPathPoints);
		if (!(xs[0] == xs[xs.length - 1] && ys[0] == ys[ys.length - 1]))
			return { owned: "", path: "" };

		//make the test!
		var count1 = self.m_Points.length;
		var sColor = (self.m_sDotColor == self.COLOR_RED ? self.COLOR_BLUE : self.COLOR_RED);
		var owned_by = (self.m_sDotColor == self.COLOR_RED ? self.POINT_OWNED_BY_RED : self.POINT_OWNED_BY_BLUE);
		var sOwnedCol = (self.m_sDotColor == self.COLOR_RED ? self.COLOR_OWNED_RED : self.COLOR_OWNED_BLUE);
		var sOwnedPoints = "";
		sDelimiter = "";
		for (var i = 0; i < count1; ++i) {
			var p0 = self.m_Points[i];
			if (p0 != null && p0.$GetStatus() == self.POINT_FREE && p0.$GetFillColor() == sColor) {
				var pos = p0.$GetPosition();
				x = pos.x; y = pos.y;
				x /= self.m_iGridSize; y /= self.m_iGridSize;
				if (0 != self.pnpoly(count, xs, ys, x, y)) {
					p0.$SetStatus(owned_by);
					p0.$SetFillColor(sOwnedCol);
					p0.$strokeColor(sOwnedCol);
					sOwnedPoints = sOwnedPoints + sDelimiter + x + "," + y;
					sDelimiter = " ";
				}
			}
		}
		return { owned: sOwnedPoints, path: sPathPoints };
	}

	IsPointOutsideAllPaths(iX, iY) {
		var count1 = self.m_Lines.length;
		for (var j = 0; j < count1; ++j) {
			var count, points = self.m_Lines[j].$GetPoints();
			//convert to x's and y's arrays
			count = points.length;
			var xs = Array(), ys = Array(), x, y, k = 0;
			for (var i = 0; i < count; i += 2) {
				//y = points[i].split(",");
				//x = y[0];	y = y[1];
				x = points[i];
				y = points[i + 1];
				if (x == null || y == null) continue;
				x /= self.m_iGridSize; y /= self.m_iGridSize;
				xs[k] = x; ys[k] = y;
				++k;
			}

			if (0 != self.pnpoly(count, xs, ys, iX, iY))
				return false;
		}

		return true;
	}

	CreateXMLWaitForPlayerRequest(/*bShowP2Name = false*/) {
		var sRet = "<WaitForPlayer>" +
			((self.CreateXMLWaitForPlayerRequest.arguments.length > 0 &&
				self.CreateXMLWaitForPlayerRequest.arguments[0] == true) ? "<ShowP2Name />" : "") +
			"</WaitForPlayer>";
		return sRet;
	}

	CreateXMLPutPointRequest(iX, iY) {
		var sRet = "<PutPoint>" +
			"<Point x='" + iX + "' y='" + iY + "' />" +
			"</PutPoint>";
		return sRet;
	}

	CreateXMLPutPathRequest(sPathPoints, sOwnedPoints) {
		var sRet = "<PutPath><Path>" + sPathPoints + "</Path>" +
			"<Owned>" + sOwnedPoints + "</Owned>" +
			"</PutPath>";
		return sRet;
	}

	SendAsyncData(sData) {
		if (sData.length == 0) return;
		// if(g_XmlHttp == null)
		// {
		// 	g_XmlHttp = GetXmlHttpObject();
		// }
		// if(g_XmlHttp == null)
		// {
		// 	alert('Browser does not support AJAX');
		// 	return;
		// }
		// var url = "index.php";
		// g_XmlHttp.open("POST", url, !false);
		// g_XmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		// g_XmlHttp.onreadystatechange = self.AjaxResponseCallBack;
		// g_XmlHttp.send("action=<?php echo("<?xml version='1.0' encoding='utf-8'?>"); ?>" + sData);
	}

	AjaxResponseCallBack() {
		if (g_XmlHttp != null && (g_XmlHttp.readyState == 4 || g_XmlHttp.readyState == "complete") &&
			g_XmlHttp.status == 200) {
			var xml = g_XmlHttp.responseXML;
			var response = xml.firstChild;
			if (response.nodeType != 1) response = response.nextSibling;
			var resp_type = response.nodeName;

			switch (resp_type) {
				case 'WaitForPlayer':
					var sP2Name = response.getElementsByTagName('P2Name').length > 0 ?
						response.getElementsByTagName('P2Name')[0].firstChild.data : '';
					var bActive = response.getElementsByTagName('Active')[0].firstChild.data == 'true'
						? true : false;
					if (bActive) {
						if (sP2Name != '') {
							self.m_Player2Name.innerHTML = sP2Name;
							self.m_SurrenderButton.value = 'surrender';
						}
						if (self.m_SurrenderButton.value == 'win')
							self.m_SurrenderButton.value = 'surrender';
						/////////////TODO: process last action///////////////

						var last_move = response.getElementsByTagName('LastMove')[0];
						last_move = last_move.firstChild;
						switch (last_move.nodeName) {
							case 'Point':
								var x = parseInt(last_move.getAttribute('x'));
								var y = parseInt(last_move.getAttribute('y'));
								var iStatus = parseInt(last_move.getAttribute('status'));
								self.SetPoint(x, y, iStatus);

								self.m_bIsPlayerActive = true;
								self.SetTimer(false);
								if (!self.m_bIsMobile) self.Debug('Oponent has moved, your turn');
								else self.ShowMobileStatus();
								break;

							case 'Path':
								var path = last_move.firstChild.data;
								var owned = response.getElementsByTagName('Owned')[0].firstChild.data;

								self.SetPath(path,
									(self.m_sDotColor == self.COLOR_RED ? true : false), false);

								var Points = owned.split(" ");
								var count = Points.length, p = null;
								var point_status = (self.m_sDotColor == self.COLOR_RED ?
									self.POINT_OWNED_BY_RED : self.POINT_OWNED_BY_BLUE);
								var sOwnedCol = (self.m_sDotColor == self.COLOR_RED ? self.COLOR_OWNED_BLUE : self.COLOR_OWNED_RED);
								for (var i = 0; i < count; ++i) {
									p = Points[i].split(",");
									x = parseInt(p[0]); y = parseInt(p[1]);
									p = self.m_Points[y * self.m_iGridWidth + x];
									if (p != null) {
										p.$SetStatus(point_status);
										p.$SetFillColor(sOwnedCol);
										p.$strokeColor(sOwnedCol);
									}
								}

								self.m_bIsPlayerActive = true;
								self.SetTimer(false);
								if (!self.m_bIsMobile) self.Debug('Oponent has moved, your turn');
								else self.ShowMobileStatus();
								break;

							default:
								break;
						}
					}
					else {
						self.m_sMessage = 'Waiting for oponent move';
						if (sP2Name != '') {
							self.m_Player2Name.innerHTML = sP2Name;
							self.m_SurrenderButton.value = 'surrender';
							if (self.m_bIsMobile) self.ShowMobileStatus();
						}
					}
					break;

				case 'PutPoint':
					self.m_bIsPlayerActive = false;
					self.m_iSlowdownLevel = 0;
					self.SetTimer(true);
					break;

				case 'PutPath':
					//set starting point to POINT_IN_PATH to block further path closing with it
					var points = self.m_Line.$GetPoints();
					//var y = points[0].split(",");
					//var x = y[0];	y = y[1];
					var x = points[i];
					var y = points[i + 1];
					x /= self.m_iGridSize; y /= self.m_iGridSize;
					var p0 = self.m_Points[y * self.m_iGridWidth + x];
					if (p0 != null)
						p0.$SetStatus(self.POINT_IN_PATH);

					self.m_Lines[self.m_Lines.length] = self.m_Line;
					self.m_iLastX = self.m_iLastY = -1;
					self.m_Line = null;

					self.m_bIsPlayerActive = false;
					self.m_iSlowdownLevel = 0;
					self.SetTimer(true);
					break;

				case 'InterruptGame':
					//TODO: break this infinite loop after some 1 minute or so - bandwith prevention
					//or maybe also make GameLoop run @ longer interval
					self.SetTimer(false);
					var msg = response.getElementsByTagName('msg').length > 0 ?
						response.getElementsByTagName('msg')[0].firstChild.data : '';
					if (msg == '')
						alert('Game interrupted!');
					else
						alert(msg);
					window.location.href = "games.php" + (self.m_bIsMobile ? "?IsMobile=true" : "");
					break;

				case 'WaitingForSecondPlayer':
					//TODO: break this infinite loop after some 1 minute or so - bandwith prevention
					//or maybe also make GameLoop run @ longer interval
					//self.Debug('Oczekiwanie na podłączenie drugiego gracza', 1);
					self.m_sMessage = 'Waiting for other player to connect';
					break;

				case 'Err':
					var msg = response.getElementsByTagName('msg').length > 0 ?
						response.getElementsByTagName('msg')[0].firstChild.data : 'unknown error';
					alert(msg);
					self.OnCancelClick();
					break;

				default:
					break;
			}
		}
	}

	GameLoop() {
		/*act = 'action=WaitForPlayer';
		if(self.m_Player2Name.innerHTML == '???')	act = act + '&ShowP2Name=true';*/
		var bP2NameUnknown = self.m_Player2Name.innerHTML == '???' ? true : false;

		self.SendAsyncData(self.CreateXMLWaitForPlayerRequest(bP2NameUnknown));
		var d = parseInt(((new Date()) - self.m_WaitStartTime) / 1000);
		if (self.m_iSlowdownLevel <= 0 && d >= (self.m_iTooLong2Duration * 0.25)) {
			//alert('1/4');
			self.m_iSlowdownLevel = 1;
			self.SetTimer(true);
		}
		else if (self.m_iSlowdownLevel <= 1 && d >= (self.m_iTooLong2Duration * 0.5)) {
			//alert('1/2');
			self.m_iSlowdownLevel = 2;
			self.SetTimer(true);
		}
		else if (self.m_iSlowdownLevel <= 2 && d >= (self.m_iTooLong2Duration * 0.75)) {
			//alert('3/4');
			self.m_iSlowdownLevel = 4;
			self.SetTimer(true);
		}
		else if (d >= self.m_iTooLong2Duration) {
			if (bP2NameUnknown) {
				self.SetTimer(false);
				if (confirm('Second player is still not connecting. Continue waiting?') == true)
					self.SetTimer(true);
				else {
					window.location.href = "Games";
					return;
				}
			}
			else {
				self.SetTimer(false);
				self.m_SurrenderButton.value = 'win';
				alert('Second player is not responding for quiet long. To walkover win click win - or continue to wait for oponent move');
				self.SetTimer(true);
			}
		}
		if (!self.m_bIsMobile) {
			if (self.m_sMessage != '')
				self.Debug(self.m_sMessage + '(' + d + ')');
		}
		else {
			self.ShowMobileStatus(d);
		}
	}

	ShowMobileStatus(iWaitTime) {
		///TODO: uncomment this if mobile version will be true
		var GameStatus = document.getElementById('GameStatus');
		if (self.m_Player2Name.innerHTML == '???') {
			if (GameStatus.style.backgroundImage.indexOf('pjonbgcurrent.gif') != -1)
				GameStatus.style.backgroundImage = 'url(img/pjonbgcurrent2.gif)';
			else
				GameStatus.style.backgroundImage = 'url(img/pjonbgcurrent.gif)';
		}
		else if (self.m_bIsPlayerActive) {
			if (self.m_bIsPlayingWithRed)
				GameStatus.style.backgroundImage = 'url(img/pjonbgcurrent.gif)';
			else
				GameStatus.style.backgroundImage = 'url(img/pjonbgcurrent2.gif)';
			self.Debug('', 0);
		}
		else {
			if (self.m_bIsPlayingWithRed)
				GameStatus.style.backgroundImage = 'url(img/pjonbgcurrent2.gif)';
			else
				GameStatus.style.backgroundImage = 'url(img/pjonbgcurrent.gif)';
			if (iWaitTime != 'undefined' && iWaitTime != null) self.Debug(iWaitTime);
		}
	}

	OnMouseMove(Event) {
		if (!self.m_bIsPlayerActive) return;

		var x = (Event ? Event.clientX : window.event.clientX) - self.m_iPosX + self.m_iScrollX + 0.5 * self.m_iGridSize;
		var y = (Event ? Event.clientY : window.event.clientY) - self.m_iPosY + self.m_iScrollY + 0.5 * self.m_iGridSize;
		x = parseInt(x / self.m_iGridSize);
		y = parseInt(y / self.m_iGridSize);

		if (self.m_bDrawLines) {
			//lines
			if (self.m_bMouseDown == true && (self.m_iLastX != x || self.m_iLastY != y) &&
				(Math.abs(parseInt(self.m_iLastX - x)) <= 1 &&
					Math.abs(parseInt(self.m_iLastY - y)) <= 1) &&
				self.m_iLastX >= 0 && self.m_iLastY >= 0) {
				if (self.m_Line != null) {
					var p0 = self.m_Points[self.m_iLastY * self.m_iGridWidth + self.m_iLastX];
					var p1 = self.m_Points[y * self.m_iGridWidth + x];

					if (p0 != null && p1 != null && (p1.$GetStatus() != self.POINT_IN_PATH) &&
						p0.$GetFillColor() == self.m_sDotColor &&
						p1.$GetFillColor() == self.m_sDotColor) {
						var tox = x * self.m_iGridSize;
						var toy = y * self.m_iGridSize;
						self.m_Line.$AppendPoints(tox + "," + toy);
						if (p1.$GetStatus() != self.POINT_STARTING)
							p1.$SetStatus(self.POINT_IN_PATH);
						else {
							var val = self.SurroundOponentPoints();
							if (val.owned.length > 0) {
								self.m_Line.$SetIsClosed(true);
								self.Debug('Closing path', 0);
								self.SendAsyncData(self.CreateXMLPutPathRequest(val.path, val.owned));
							}
							else
								self.Debug('Wrong path, cancell it or refresh page', 0);
						}

						self.m_iLastX = x;
						self.m_iLastY = y;
					}
				}
				else {
					var p0 = self.m_Points[self.m_iLastY * self.m_iGridWidth + self.m_iLastX];
					var p1 = self.m_Points[y * self.m_iGridWidth + x];

					if (p0 != null && p1 != null && (p0.$GetStatus() != self.POINT_IN_PATH &&
						p1.$GetStatus() != self.POINT_IN_PATH) &&
						p0.$GetFillColor() == self.m_sDotColor &&
						p1.$GetFillColor() == self.m_sDotColor) {
						var fromx = self.m_iLastX * self.m_iGridSize;
						var fromy = self.m_iLastY * self.m_iGridSize;
						var tox = x * self.m_iGridSize;
						var toy = y * self.m_iGridSize;
						self.m_Line = $createPolyline(3, fromx + "," + fromy + " " + tox + "," + toy, self.m_sDotColor);
						if (p0.$GetStatus() != self.POINT_IN_PATH)
							p0.$SetStatus(self.POINT_STARTING);
						if (p1.$GetStatus() != self.POINT_IN_PATH)
							p1.$SetStatus(self.POINT_STARTING);

						self.m_iLastX = x;
						self.m_iLastY = y;
					}
				}
			}
		}
	}

	OnMouseDown(Event) {
		if (!self.m_bIsPlayerActive) return;

		var x = (Event ? Event.clientX : window.event.clientX) - self.m_iPosX + self.m_iScrollX + 0.5 * self.m_iGridSize;
		var y = (Event ? Event.clientY : window.event.clientY) - self.m_iPosY + self.m_iScrollY + 0.5 * self.m_iGridSize;
		x = self.m_iMouseX = parseInt(x / self.m_iGridSize);
		y = self.m_iMouseY = parseInt(y / self.m_iGridSize);

		self.m_bMouseDown = true;
		if (!self.m_bDrawLines) {
			//points
			self.m_iLastX = x;
			self.m_iLastY = y;

			var loc_x = x;
			var loc_y = y;
			x = loc_x * self.m_iGridSize;
			y = loc_y * self.m_iGridSize;

			if (self.m_Points[loc_y * self.m_iGridWidth + loc_x] != null) return;
			if (!self.IsPointOutsideAllPaths(loc_x, loc_y)) return;

			var radius = 4;
			var oval = $createOval(radius, 'true');
			oval.$SetFillColor(self.m_sDotColor);
			oval.$strokeColor(self.m_sDotColor);
			oval.$move(x, y, radius);

			self.m_Points[loc_y * self.m_iGridWidth + loc_x] = oval;
			//self.Debug('created p0int loc_x = '+loc_x+' loc_y = '+loc_y+' addr = '+(loc_y * self.m_iGridWidth + loc_x)+' length = '+self.m_Points.length, 1);

			self.SendAsyncData(self.CreateXMLPutPointRequest(loc_x, loc_y));
		}
		else {
			//lines
			//self.Debug('m_iMouseX = '+self.m_iMouseX+' m_iMouseY = '+self.m_iMouseY, 1);
			if ( /*self.m_bMouseDown == true && */(self.m_iLastX != x || self.m_iLastY != y) &&
				(Math.abs(parseInt(self.m_iLastX - x)) <= 1 &&
					Math.abs(parseInt(self.m_iLastY - y)) <= 1) &&
				self.m_iLastX >= 0 && self.m_iLastY >= 0) {
				if (self.m_Line != null) {
					var p0 = self.m_Points[self.m_iLastY * self.m_iGridWidth + self.m_iLastX];
					var p1 = self.m_Points[y * self.m_iGridWidth + x];

					if (p0 != null && p1 != null && (p1.$GetStatus() != self.POINT_IN_PATH) &&
						p0.$GetFillColor() == self.m_sDotColor &&
						p1.$GetFillColor() == self.m_sDotColor) {
						var tox = x * self.m_iGridSize;
						var toy = y * self.m_iGridSize;
						self.m_Line.$AppendPoints(tox + "," + toy);
						if (p1.$GetStatus() != self.POINT_STARTING)
							p1.$SetStatus(self.POINT_IN_PATH);
						else {
							var val = self.SurroundOponentPoints();
							if (val.owned.length > 0) {
								self.m_Line.$SetIsClosed(true);
								self.Debug('Closing path', 0);
								self.SendAsyncData(self.CreateXMLPutPathRequest(val.path, val.owned));
							}
							else
								self.Debug('Wrong path, cancell it or refresh page', 0);
						}

						self.m_iLastX = x;
						self.m_iLastY = y;
					}
				}
				else {
					var p0 = self.m_Points[self.m_iLastY * self.m_iGridWidth + self.m_iLastX];
					var p1 = self.m_Points[y * self.m_iGridWidth + x];

					if (p0 != null && p1 != null && (p0.$GetStatus() != self.POINT_IN_PATH &&
						p1.$GetStatus() != self.POINT_IN_PATH) &&
						p0.$GetFillColor() == self.m_sDotColor &&
						p1.$GetFillColor() == self.m_sDotColor) {
						var fromx = self.m_iLastX * self.m_iGridSize;
						var fromy = self.m_iLastY * self.m_iGridSize;
						var tox = x * self.m_iGridSize;
						var toy = y * self.m_iGridSize;
						self.m_Line = $createPolyline(3, fromx + "," + fromy + " " + tox + "," + toy, self.m_sDotColor);
						if (p0.$GetStatus() != self.POINT_IN_PATH) p0.$SetStatus(self.POINT_STARTING);
						if (p1.$GetStatus() != self.POINT_IN_PATH) p1.$SetStatus(self.POINT_STARTING);
					}
					self.m_iLastX = x;
					self.m_iLastY = y;
				}
			}
			else if (self.m_iLastX < 0 || self.m_iLastY < 0) {
				var p1 = self.m_Points[y * self.m_iGridWidth + x];
				if (p1 != null && p1.$GetStatus() == self.POINT_FREE && p1.$GetFillColor() == self.m_sDotColor) {
					self.m_iLastX = x;
					self.m_iLastY = y;
					//self.Debug('first point registered m_iLastX = '+self.m_iLastX+' m_iLastY = '+self.m_iLastY, 1);
				}
			}
		}
	}

	OnMouseUp(Event) {
		self.m_bMouseDown = false;
	}

	OnScroll() {
		self.m_iScrollX = self.f_scrollLeft();
		self.m_iScrollY = self.f_scrollTop();
	}

	OnDrawModeClick() {
		self.m_bDrawLines = !self.m_bDrawLines;
		var draw_mode = document.getElementById('DrawMode');
		if (!self.m_bDrawLines) {
			draw_mode.value = 'Draw lines';
		}
		else {
			draw_mode.value = 'Draw dots';
		}
		self.m_iLastX = self.m_iLastY = -1;
		self.m_Line = null;
	}

	OnCancelClick() {
		//alert('cancel clicked');
		if (self.m_bDrawLines) {
			if (self.m_Line != null) {
				var points = self.m_Line.$GetPoints();
				for (var i = 0; i < points.length; i += 2) {
					//var y = points[i].split(",");
					//var x = y[0];	y = y[1];
					var x = points[i];
					var y = points[i + 1];
					if (x == null || y == null) continue;
					x /= self.m_iGridSize; y /= self.m_iGridSize;
					var p0 = self.m_Points[y * self.m_iGridWidth + x];
					if (p0 != null)
						p0.$SetStatus(self.POINT_FREE);
				}
				$RemovePolyline(self.m_Line);
				self.m_Line = null;
			}
			self.m_iLastX = self.m_iLastY = -1;
		}
	}

	OnTestClick() {
		if (self.m_bDrawLines) {
			if (self.m_Line != null) {
				var val = self.SurroundOponentPoints();
				if (val.owned.length > 0) {
					self.m_iLastX = self.m_iLastY = -1;
					self.m_Line = null;
				}
			}
		}
		else {
			var p0 = self.m_Points[self.m_iLastY * self.m_iGridWidth + self.m_iLastX]
			var pos = p0.$GetPosition();
			self.Debug(p0.$GetFillColor() + ' posX = ' + pos.x + ' posY = ' + pos.y, 1);
		}
	}
	/**
	 * [/Old-legacy code]
	 */




	PrepareDrawing(divScreen, iGridSize = 15, bIsPlayingWithRed = false, bIsPlayerActive = true, iTooLong2Duration = 125, bIsMobile = true, bViewOnly = false) {
		self.COLOR_RED = 'red';
		self.COLOR_BLUE = 'blue';
		self.COLOR_OWNED_RED = 'pink';
		self.COLOR_OWNED_BLUE = '#8A2BE2';
		self.POINT_FREE_RED = -3;
		self.POINT_FREE_BLUE = -2;
		self.POINT_FREE = -1;
		self.POINT_STARTING = 0;
		self.POINT_IN_PATH = 1;
		self.POINT_OWNED_BY_RED = 2;
		self.POINT_OWNED_BY_BLUE = 3;
		self.m_bIsWon = false;
		self.m_iDelayBetweenMultiCaptures = 4000;
		self.m_iTimerInterval = 2000;
		self.m_iTooLong2Duration = iTooLong2Duration/*125*/;
		self.m_iTimerID = null;
		self.m_bIsTimerRunning = false;
		self.m_WaitStartTime = null;
		self.m_iSlowdownLevel = 0;
		self.m_iGridSize = iGridSize;
		self.m_iGridWidth = 0;
		self.m_iGridHeight = 0;
		self.m_iLastX = -1;
		self.m_iLastY = -1;
		self.m_iMouseX = 0;
		self.m_iMouseY = 0;
		self.m_iPosX = 0;
		self.m_iPosY = 0;
		self.m_iScrollX = 0;
		self.m_iScrollY = 0;
		self.m_iClientWidth = 0;
		self.m_iClientHeight = 0;
		self.m_Debug = null;
		self.m_Player2Name = null;
		self.m_SurrenderButton = null;
		self.m_bMouseDown = false;
		self.m_bDrawLines = !true;
		self.m_bIsMobile = bIsMobile;
		self.m_sMessage = '';
		self.m_bIsPlayingWithRed = bIsPlayingWithRed;
		self.m_bIsPlayerActive = bIsPlayerActive;
		self.m_sDotColor = self.m_bIsPlayingWithRed ? self.COLOR_RED : self.COLOR_BLUE;
		self.m_Line = null;
		self.m_Lines = new Array();
		self.m_Points = new Array();






		self.m_Debug = document.getElementById('debug0');
		self.m_Player2Name = document.getElementById('Player2Name');
		self.m_SurrenderButton = document.getElementById('SurrenderButton');
		var screen = document.getElementById(divScreen);
		if (!screen) {
			alert("no board");
			return;
		}
		self.m_iPosX = screen.offsetLeft;
		self.m_iPosY = screen.offsetTop;
		self.m_iClientWidth = screen.clientWidth;
		self.m_iClientHeight = screen.clientHeight;
		self.m_iGridWidth = parseInt(self.m_iClientWidth / self.m_iGridSize);
		self.m_iGridHeight = parseInt(self.m_iClientHeight / self.m_iGridSize);
		self.m_iScrollX = self.f_scrollLeft();
		self.m_iScrollY = self.f_scrollTop();

		cont = $createSVGVML(screen, screen.style.width, screen.style.height, false);

		self.DisableSelection(screen);
		if (!self.m_bViewOnly) {
			screen.onmousedown = self.OnMouseDown;
			screen.onmousemove = self.OnMouseMove;
			screen.onmouseup = self.OnMouseUp;
			window.onscroll = self.OnScroll;
			let button = document.getElementById('DrawMode');
			button.onclick = self.OnDrawModeClick;
			button = document.getElementById('Cancel');
			button.onclick = self.OnCancelClick;

	/**
	 * [Old-legacy code]
	 * TODO: commented; reanable in some sort
	 */
			/*if(!self.m_bIsPlayerActive)
			{
				self.SetTimer(true);
			}
			else
			{
				if(!self.m_bIsMobile)	self.Debug('Your move', 0);
				else					self.ShowMobileStatus();
			}*/
	
	/**
	 * [/Old-legacy code]
	 */
		}
	}
}
