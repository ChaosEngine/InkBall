"use strict";

/******** funcs-n-classes ********/
const StatusEnum = Object.freeze({
	POINT_FREE_RED: -3,
	POINT_FREE_BLUE: -2,
	POINT_FREE: -1,
	POINT_STARTING: 0,
	POINT_IN_PATH: 1,
	POINT_OWNED_BY_RED: 2,
	POINT_OWNED_BY_BLUE: 3
});

const CommandKindEnum = Object.freeze({
	UNKNOWN: -1,
	PING: 0,
	POINT: 1,
	PATH: 2,
	PLAYER_JOINING: 3,
	PLAYER_SURRENDER: 4
});

class DtoMsg {
	GetType() { throw new Error("missing GetType implementation!"); }
}

class InkBallPointViewModel extends DtoMsg {
	constructor(iId = 0, iGameId = 0, iPlayerId = 0, iX = 0, iY = 0, Status = StatusEnum.POINT_FREE, iEnclosingPathId = 0) {
		super();

		this.iId = iId;
		this.iGameId = iGameId;
		this.iPlayerId = iPlayerId;
		this.iX = iX;
		this.iY = iY;
		this.Status = Status;
		this.iEnclosingPathId = iEnclosingPathId;
	}

	GetType() { return "InkBallPointViewModel"; }

	static Format(sUser, point) {
		let msg = point.iX + ' ' + point.iY + ' ' + point.Status;

		return sUser + " places [" + msg + "] point";
	}
}

class InkBallPathViewModel extends DtoMsg {
	constructor(iId = 0, iGameId = 0, iPlayerId = 0, sPointsAsString = '', sOwnedPointsAsString = '') {
		super();

		this.iId = iId;
		this.iGameId = iGameId;
		this.iPlayerId = iPlayerId;
		this.sPointsAsString = sPointsAsString;
		this.sOwnedPointsAsString = sOwnedPointsAsString;
	}

	GetType() { return "InkBallPathViewModel"; }

	static Format(sUser, path) {
		let msg = path.iPlayerId + " " + path.sPointsAsString + " " + path.sOwnedPointsAsString;

		return sUser + " places [" + msg + "] path";
	}
}

class WaitForPlayerCommand extends DtoMsg {
	constructor(showP2Name = false) {
		super();

		this.ShowP2Name = showP2Name;
	}

	GetType() { return "WaitForPlayerCommand"; }
}

class PlayerJoiningCommand extends DtoMsg {
	constructor(otherPlayerId, otherPlayerName, message) {
		super();

		this.OtherPlayerId = otherPlayerId;
		this.OtherPlayerName = otherPlayerName;
		this.Message = message;
	}

	GetType() { return "PlayerJoiningCommand"; }

	static Format(join) {
		return join.Message;
	}
}

class PlayerSurrenderingCommand extends DtoMsg {
	constructor(otherPlayerId, thisOrOtherPlayerSurrenders, message) {
		super();

		this.OtherPlayerId = otherPlayerId;
		this.thisOrOtherPlayerSurrenders = thisOrOtherPlayerSurrenders;
		this.Message = message;
	}

	GetType() { return "PlayerSurrenderingCommand"; }

	static Format(surrender) {
		return surrender.Message;
	}
}

class PingCommand extends DtoMsg {
	constructor(message = '') {
		super();

		this.Message = message;
	}

	GetType() { return "PingCommand"; }

	static Format(sUser, ping) {
		let txt = ping.Message;

		return sUser + " says " + txt;
	}
}

function htmlEncode(html) {
	//return html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
	return document.createElement('a').appendChild(
		document.createTextNode(html)).parentNode.innerHTML;
}

//Debug function
function CountPointsDebug(sSelector2Set, sSvgSelector = 'svg') {
	let svgs = $(sSvgSelector), totalChildren = 0, childCounts = [];

	for (let i = 0; i < svgs.length; i++) {
		let svg = svgs[i];
		totalChildren += svg.childElementCount;
		childCounts.push(svg.childElementCount);
	}

	let tags = ["circle", "path"], tagMessage = "";
	tags.forEach(tagName => {
		tagMessage += (tagName + ": " + $(tagName).length + " ");
	});

	$(sSelector2Set).text('SVG elements - totalChildren:' + totalChildren + ' SVG childElements:' + childCounts + ' by tag:' + tagMessage);
}

class InkBallGame {

	/**
	 * InkBallGame contructor
	 * @param {string} sHubName SignalR hub name
	 * @param {enum} loggingLevel log level for SignalR
	 * @param {enum} hubProtocol Json or messagePack
	 * @param {enum} transportType websocket, server events or long polling
	 * @param {function} tokenFactory auth token factory
	 * @param {bool} bIsPlayingWithRed true - red, false - blue
	 * @param {bool} bIsPlayerActive is this player acive now
	 * @param {number} iGridSize grid size (number of rows and cols equal)
	 * @param {number} iTooLong2Duration too long wait duration
	 * @param {bool} bViewOnly only viewing the game no interaction
	 */
	constructor(sHubName, loggingLevel, hubProtocol, transportType, tokenFactory,
		bIsPlayingWithRed = true, bIsPlayerActive = true, iGridSize = 15, iTooLong2Duration = 125, bViewOnly = false) {

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
		this.m_iTooLong2Duration = iTooLong2Duration/*125*/;
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
		this.m_iClientWidth = 0;
		this.m_iClientHeight = 0;
		this.m_Screen = null;
		this.m_Debug = null;
		this.m_Player2Name = null;
		this.m_SurrenderButton = null;
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

		this.g_SignalRConnection = new signalR.HubConnectionBuilder()
			.withUrl(sHubName, {
				transport: transportType,
				accessTokenFactory: tokenFactory
			})
			.withHubProtocol(hubProtocol)
			.configureLogging(loggingLevel)
			.build();

		this.g_SignalRConnection.onclose(async (err) => {
			if (err !== null && err !== undefined) {
				console.log(err);

				this.m_Screen.style.cursor = "not-allowed";
				if (this.iConnErrCount < 5)//exponential back-off
					this.iConnErrCount++;
				setTimeout(() => this.start(), 4000 + (this.iExponentialBackOffMillis * this.iConnErrCount));
			}
		});
	}

	async start() {
		try {
			await this.g_SignalRConnection.start();
			this.iConnErrCount = 0;
			console.log('connected; iConnErrCount = ' + this.iConnErrCount);
		}
		catch (err) {
			console.log(err + '; iConnErrCount = ' + this.iConnErrCount);

			this.m_Screen.style.cursor = "not-allowed";
			if (this.iConnErrCount < 5)//exponential back-off
				this.iConnErrCount++;
			setTimeout(() => this.start(), 4000 + (this.iExponentialBackOffMillis * this.iConnErrCount));
		}
	}

	/**
	 * Start connection to SignalR
	 * @param {number} iGameID ID of a game
	 * @param {number} iPlayerID player ID
	 * @param {string} sMsgListSel ul html element selector
	 * @param {string} sMsgSendButtonSel input button html element selector
	 * @param {string} sMsgInputSel input textbox html element selector
	 */
	StartSignalRConnection(iGameID, iPlayerID, sMsgListSel, sMsgSendButtonSel, sMsgInputSel) {
		if (this.g_SignalRConnection === null) return;
		this.g_iGameID = iGameID;
		this.g_iPlayerID = iPlayerID;

		this.g_SignalRConnection.on("ServerToClientPoint", function (point, user) {

			let encodedMsg = InkBallPointViewModel.Format(user, point);

			let li = document.createElement("li");
			li.textContent = encodedMsg;
			document.querySelector(sMsgListSel).appendChild(li);

			this.ReceivedPointProcessing(point);

		}.bind(this));

		this.g_SignalRConnection.on("ServerToClientPath", function (path, user) {

			let encodedMsg = InkBallPathViewModel.Format(user, path);

			let li = document.createElement("li");
			li.textContent = encodedMsg;
			document.querySelector(sMsgListSel).appendChild(li);

			this.ReceivedPathProcessing(path);

		}.bind(this));

		this.g_SignalRConnection.on("ServerToClientPlayerJoin", function (join) {

			let encodedMsg = PlayerJoiningCommand.Format(join);

			let li = document.createElement("li");
			li.textContent = encodedMsg;
			document.querySelector(sMsgListSel).appendChild(li);

			if (this.m_SurrenderButton !== null) {
				if (join.OtherPlayerName != '') {
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

			let encodedMsg = PlayerSurrenderingCommand.Format(surrender);

			let li = document.createElement("li");
			li.textContent = encodedMsg;
			document.querySelector(sMsgListSel).appendChild(li);


			this.m_bHandlingEvent = false;
			alert(encodedMsg == '' ? 'Game interrupted!' : encodedMsg);
			window.location.href = "Games";
		}.bind(this));

		this.g_SignalRConnection.on("ServerToClientPing", function (ping, user) {

			let encodedMsg = PingCommand.Format(user, ping);

			let li = document.createElement("li");
			li.textContent = encodedMsg;
			document.querySelector(sMsgListSel).appendChild(li);
		}.bind(this));

		document.querySelector(sMsgSendButtonSel).addEventListener("click", function (event) {
			event.preventDefault();

			let encodedMsg = document.querySelector(sMsgInputSel).value.trim();
			if (encodedMsg == '') return;

			let ping = new PingCommand(encodedMsg);

			this.SendAsyncData(ping);

		}.bind(this), false);

		// Execute a function when the user releases a key on the keyboard
		document.querySelector(sMsgInputSel).addEventListener("keyup", function (event) {
			event.preventDefault();// Cancel the default action, if needed

			if (event.keyCode === 13) {// Number 13 is the "Enter" key on the keyboard
				// Trigger the button element with a click
				document.querySelector(sMsgSendButtonSel).click();
			}
		}.bind(this), false);

		this.start();
	}

	StopSignalRConnection() {
		if (this.g_SignalRConnection !== null) {
			this.g_SignalRConnection.stop();
			console.log('Stopped SignalR connection');
		}
	}

	Debug(...args) {
		switch (args.length) {
			case 1:
				this.m_Debug.innerHTML = args[0];
				break;
			case 2:
				let d = document.getElementById('debug' + args[1]);
				d.innerHTML = args[0];
				break;
			default:
				break;
		}
	}

	SetTimer(bStartTimer) {
		if (bStartTimer == false) {
			if (this.m_bIsTimerRunning == true)
				clearInterval(this.m_iTimerID);
			this.m_bIsTimerRunning = false;
		}
		else {
			if (this.m_bIsTimerRunning == true)
				clearInterval(this.m_iTimerID);
			else
				this.m_WaitStartTime = new Date();
			let interval = this.m_iTimerInterval * (1 + this.m_iSlowdownLevel * 0.5);
			this.m_iTimerID = setInterval(this.GameLoop, interval);
			this.m_bIsTimerRunning = true;
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
			Target.onselectstart = function () { return false; };
		else if (typeof Target.style.MozUserSelect != "undefined")//Firefox route
			Target.style.MozUserSelect = "none";
		else//All other route (ie: Opera)
			Target.onmousedown = function () { return false; };
		//Target.style.cursor = "default";
	}

	f_clientWidth() {
		return this.f_filterResults(
			window.innerWidth ? window.innerWidth : 0,
			document.documentElement ? document.documentElement.clientWidth : 0,
			document.body ? document.body.clientWidth : 0
		);
	}

	f_clientHeight() {
		return this.f_filterResults(
			window.innerHeight ? window.innerHeight : 0,
			document.documentElement ? document.documentElement.clientHeight : 0,
			document.body ? document.body.clientHeight : 0
		);
	}

	f_scrollLeft() {
		return this.f_filterResults(
			window.pageXOffset ? window.pageXOffset : 0,
			document.documentElement ? document.documentElement.scrollLeft : 0,
			document.body ? document.body.scrollLeft : 0
		);
	}

	f_scrollTop() {
		return this.f_filterResults(
			window.pageYOffset ? window.pageYOffset : 0,
			document.documentElement ? document.documentElement.scrollTop : 0,
			document.body ? document.body.scrollTop : 0
		);
	}

	f_filterResults(n_win, n_docel, n_body) {
		let n_result = n_win ? n_win : 0;
		if (n_docel && (!n_result || (n_result > n_docel)))
			n_result = n_docel;
		return n_body && (!n_result || (n_result > n_body)) ? n_body : n_result;
	}

	SetPoint(iX, iY, iStatus) {
		let x = iX * this.m_iGridSize;
		let y = iY * this.m_iGridSize;

		let oval = $createOval(this.m_PointRadius, 'true');
		oval.$move(x, y, this.m_PointRadius);

		let color;
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
				oval.$SetStatus(/*iStatus*/this.POINT_IN_PATH);
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

	SetAllPoints(points) {
		points.forEach(p => {
			this.SetPoint(p[0], p[1], p[2]);
		});
	}

	SetPath(sPoints, bIsRed, bBelong2ThisPlayer) {
		sPoints = sPoints.split(" ");
		let count = sPoints.length, sDelimiter = "", sPathPoints = "", p = null, x, y;
		for (let i = 0; i < count; ++i) {
			p = sPoints[i].split(",");
			x = parseInt(p[0]); y = parseInt(p[1]);
			x *= this.m_iGridSize; y *= this.m_iGridSize;
			sPathPoints = sPathPoints + sDelimiter + x + "," + y;
			sDelimiter = " ";

			p = this.m_Points[y * this.m_iGridWidth + x];
			if (p != null) p.$SetStatus(this.POINT_IN_PATH);
		}
		p = sPoints[0].split(",");
		x = parseInt(p[0]); y = parseInt(p[1]);
		x *= this.m_iGridSize; y *= this.m_iGridSize;
		sPathPoints = sPathPoints + sDelimiter + x + "," + y;
		p = this.m_Points[y * this.m_iGridWidth + x];
		if (p != null) p.$SetStatus(this.POINT_IN_PATH/*this.POINT_STARTING*/);

		let line = $createPolyline(3, sPathPoints,
			(bBelong2ThisPlayer ? this.m_sDotColor : (bIsRed ? this.COLOR_BLUE : this.COLOR_RED)));
		this.m_Lines[this.m_Lines.length] = line;
	}

	SetAllPaths(paths) {
		paths.forEach(p => {
			this.SetPath(p[0], p[1], p[2]);
		});
	}

	IsPointBelongingToLine(sPoints, iX, iY) {
		let count = sPoints.length, x, y, pnt;
		for (let i = 0; i < count; ++i) {
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
	 * @param {number} npol points count
	 * @param {number} xp x point coordinates
	 * @param {number} yp y point coordinates
	 * @param {number} x point to check x coordinate
	 * @param {number} y point to check y coordinate
	 * @returns {boolean} if point lies inside the polygon
	 */
	pnpoly(npol, xp, yp, x, y) {
		let i, j, c = 0;
		for (i = 0, j = npol - 1; i < npol; j = i++) {
			if ((((yp[i] <= y) && (y < yp[j])) ||
				((yp[j] <= y) && (y < yp[i]))) &&
				(x < (xp[j] - xp[i]) * (y - yp[i]) / (yp[j] - yp[i]) + xp[i]))

				c = !c;
		}
		return c;
	}

	SurroundOponentPoints() {
		//if(!this.m_Line.$GetIsClosed())	return;
		let count, points = this.m_Line.$GetPoints();

		//convert to x's and y's arrays
		count = points.length;
		//alert('s' + points + 'e' + ' count = ' + count);
		let xs = Array(), ys = Array(), x, y, sPathPoints = "", sDelimiter = "", k = 0;
		for (let i = 0; i < count; i += 2) {
			x = points[i];
			y = points[i + 1];
			if (x == null || y == null) continue;
			x /= this.m_iGridSize; y /= this.m_iGridSize;
			xs[k] = x; ys[k] = y;

			sPathPoints = sPathPoints + sDelimiter + x + "," + y;
			sDelimiter = " ";
			++k;
		}
		//alert(sPathPoints);
		if (!(xs[0] == xs[xs.length - 1] && ys[0] == ys[ys.length - 1]))
			return { owned: "", path: "" };

		//make the test!
		let count1 = this.m_Points.length;
		let sColor = (this.m_sDotColor == this.COLOR_RED ? this.COLOR_BLUE : this.COLOR_RED);
		let owned_by = (this.m_sDotColor == this.COLOR_RED ? this.POINT_OWNED_BY_RED : this.POINT_OWNED_BY_BLUE);
		let sOwnedCol = (this.m_sDotColor == this.COLOR_RED ? this.COLOR_OWNED_RED : this.COLOR_OWNED_BLUE);
		let sOwnedPoints = "";
		sDelimiter = "";
		for (let i = 0; i < count1; ++i) {
			let p0 = this.m_Points[i];
			if (p0 != null && p0.$GetStatus() == this.POINT_FREE && p0.$GetFillColor() == sColor) {
				let pos = p0.$GetPosition();
				x = pos.x; y = pos.y;
				x /= this.m_iGridSize; y /= this.m_iGridSize;
				if (0 != this.pnpoly(count, xs, ys, x, y)) {
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
		let count1 = this.m_Lines.length;
		for (let j = 0; j < count1; ++j) {
			let count, points = this.m_Lines[j].$GetPoints();
			//convert to x's and y's arrays
			count = points.length;
			let xs = Array(), ys = Array(), x, y, k = 0;
			for (let i = 0; i < count; i += 2) {
				//y = points[i].split(",");
				//x = y[0];	y = y[1];
				x = points[i];
				y = points[i + 1];
				if (x == null || y == null) continue;
				x /= this.m_iGridSize; y /= this.m_iGridSize;
				xs[k] = x; ys[k] = y;
				++k;
			}

			if (0 != this.pnpoly(count, xs, ys, iX, iY))
				return false;
		}

		return true;
	}

	CreateXMLWaitForPlayerRequest(...args) {
		let cmd = new WaitForPlayerCommand((args.length > 0 && args[0] == true) ? true : false);
		return cmd;
	}

	CreateXMLPutPointRequest(iX, iY) {
		let cmd = new InkBallPointViewModel(0, this.g_iGameID, this.g_iPlayerID, iX, iY,
			this.m_bIsPlayingWithRed ? StatusEnum.POINT_FREE_RED : StatusEnum.POINT_FREE_BLUE,
			0);
		return cmd;
	}

	/**
	 * Create transferable object holding path points creating it as well as owned points by it
	 * @param {object} dto with path, owned
	 * @returns {object} command
	 */
	CreateXMLPutPathRequest(dto) {
		let cmd = new InkBallPathViewModel(0, this.g_iGameID, this.g_iPlayerID, dto.path, dto.owned);
		return cmd;
	}

	/**
	 * Send data through signalR
	 * @param {object} payload transferrableObject (DTO)
	 */
	SendAsyncData(payload) {

		switch (payload.GetType()) {

			case "InkBallPointViewModel":
				console.log(InkBallPointViewModel.Format('some player', payload));
				this.m_bHandlingEvent = true;

				this.g_SignalRConnection.invoke("ClientToServerPoint", payload).then(function (point) {
					this.ReceivedPointProcessing(point);
				}.bind(this)).catch(function (err) {
					return console.error(err.toString());
				});
				break;

			case "InkBallPathViewModel":
				console.log(InkBallPathViewModel.Format('some player', payload));
				this.m_bHandlingEvent = true;

				this.g_SignalRConnection.invoke("ClientToServerPath", payload).then(function (path) {
					this.ReceivedPathProcessing(path);
				}.bind(this)).catch(function (err) {
					return console.error(err.toString());
				});
				break;

			case "PingCommand":
				this.g_SignalRConnection.invoke("ClientToServerPing", payload).catch(function (err) {
					return console.error(err.toString());
				});
				break;

			default:
				console.log('unknown object');
				break;
		}
	}

	AjaxResponseCallBack() {
		if (g_XmlHttp != null && (g_XmlHttp.readyState == 4 || g_XmlHttp.readyState == "complete") &&
			g_XmlHttp.status == 200) {
			let xml = g_XmlHttp.responseXML;
			let response = xml.firstChild;
			if (response.nodeType != 1) response = response.nextSibling;
			let resp_type = response.nodeName;

			switch (resp_type) {
				case 'WaitForPlayer':
					let sP2Name = response.getElementsByTagName('P2Name').length > 0 ?
						response.getElementsByTagName('P2Name')[0].firstChild.data : '';
					let bActive = response.getElementsByTagName('Active')[0].firstChild.data == 'true'
						? true : false;
					if (bActive) {
						if (sP2Name != '') {
							this.m_Player2Name.innerHTML = sP2Name;
							this.m_SurrenderButton.value = 'surrender';
						}
						if (this.m_SurrenderButton.value == 'win')
							this.m_SurrenderButton.value = 'surrender';
						/////////////TODO: process last action///////////////

						let last_move = response.getElementsByTagName('LastMove')[0];
						last_move = last_move.firstChild;
						switch (last_move.nodeName) {
							case 'Point':
								let x = parseInt(last_move.getAttribute('x'));
								let y = parseInt(last_move.getAttribute('y'));
								let iStatus = parseInt(last_move.getAttribute('status'));
								this.SetPoint(x, y, iStatus);

								this.m_bIsPlayerActive = true;
								this.SetTimer(false);
								this.ShowMobileStatus('Oponent has moved, your turn');
								break;

							case 'Path':
								let path = last_move.firstChild.data;
								let owned = response.getElementsByTagName('Owned')[0].firstChild.data;

								this.SetPath(path,
									(this.m_sDotColor == this.COLOR_RED ? true : false), false);

								let Points = owned.split(" ");
								let count = Points.length, p = null;
								let point_status = (this.m_sDotColor == this.COLOR_RED ?
									this.POINT_OWNED_BY_RED : this.POINT_OWNED_BY_BLUE);
								let sOwnedCol = (this.m_sDotColor == this.COLOR_RED ? this.COLOR_OWNED_BLUE : this.COLOR_OWNED_RED);
								for (let i = 0; i < count; ++i) {
									p = Points[i].split(",");
									x = parseInt(p[0]); y = parseInt(p[1]);
									p = this.m_Points[y * this.m_iGridWidth + x];
									if (p != null) {
										p.$SetStatus(point_status);
										p.$SetFillColor(sOwnedCol);
										p.$strokeColor(sOwnedCol);
									}
								}

								this.m_bIsPlayerActive = true;
								this.SetTimer(false);
								this.ShowMobileStatus('Oponent has moved, your turn');
								break;

							default:
								break;
						}
					}
					else {
						this.m_sMessage = 'Waiting for oponent move';
						if (sP2Name != '') {
							this.m_Player2Name.innerHTML = sP2Name;
							this.m_SurrenderButton.value = 'surrender';
							this.ShowMobileStatus();
						}
					}
					break;

				case 'PutPoint':
					this.m_bIsPlayerActive = false;
					this.m_iSlowdownLevel = 0;
					this.SetTimer(true);
					break;

				case 'PutPath':
					//set starting point to POINT_IN_PATH to block further path closing with it
					let points = this.m_Line.$GetPoints();
					//var y = points[0].split(",");
					//var x = y[0];	y = y[1];
					let x = points[i];
					let y = points[i + 1];
					x /= this.m_iGridSize; y /= this.m_iGridSize;
					let p0 = this.m_Points[y * this.m_iGridWidth + x];
					if (p0 != null)
						p0.$SetStatus(this.POINT_IN_PATH);

					this.m_Lines[this.m_Lines.length] = this.m_Line;
					this.m_iLastX = this.m_iLastY = -1;
					this.m_Line = null;

					this.m_bIsPlayerActive = false;
					this.m_iSlowdownLevel = 0;
					this.SetTimer(true);
					break;

				case 'InterruptGame':
					//TODO: break this infinite loop after some 1 minute or so - bandwith prevention
					//or maybe also make GameLoop run @ longer interval
					this.SetTimer(false);
					let msg = response.getElementsByTagName('msg').length > 0 ?
						response.getElementsByTagName('msg')[0].firstChild.data : '';
					if (msg == '')
						alert('Game interrupted!');
					else
						alert(msg);
					window.location.href = "Games";
					break;

				case 'WaitingForSecondPlayer':
					//TODO: break this infinite loop after some 1 minute or so - bandwith prevention
					//or maybe also make GameLoop run @ longer interval
					//this.Debug('Oczekiwanie na podłączenie drugiego gracza', 1);
					this.m_sMessage = 'Waiting for other player to connect';
					break;

				case 'Err':
					msg = response.getElementsByTagName('msg').length > 0 ?
						response.getElementsByTagName('msg')[0].firstChild.data : 'unknown error';
					alert(msg);
					this.OnCancelClick();
					break;

				default:
					break;
			}
		}
	}

	ReceivedPointProcessing(point) {
		let x = point.iX, y = point.iY, iStatus = point.Status;

		this.SetPoint(x, y, iStatus);
		if (this.g_iPlayerID != point.iPlayerId) {
			this.m_bIsPlayerActive = true;
			this.ShowMobileStatus('Oponent has moved, your turn');
			this.m_Screen.style.cursor = "crosshair";
			this.m_DrawMode.disabled = this.m_CancelPath.disabled = '';
		}
		else {
			this.m_bIsPlayerActive = false;
			this.ShowMobileStatus('Waiting for oponent move');
			this.m_Screen.style.cursor = "wait";
			this.m_DrawMode.disabled = this.m_CancelPath.disabled = 'disabled';
		}
		this.m_bHandlingEvent = false;
	}

	ReceivedPathProcessing(path) {
		if (this.g_iPlayerID != path.iPlayerId) {

			let str_path = path.sPointsAsString, owned = path.sOwnedPointsAsString;

			this.SetPath(str_path,
				(this.m_sDotColor == this.COLOR_RED ? true : false), false);

			let points = owned.split(" ");
			let count = points.length;
			let point_status = (this.m_sDotColor == this.COLOR_RED ? this.POINT_OWNED_BY_RED : this.POINT_OWNED_BY_BLUE);
			let sOwnedCol = (this.m_sDotColor == this.COLOR_RED ? this.COLOR_OWNED_BLUE : this.COLOR_OWNED_RED);
			for (let i = 0; i < count; ++i) {
				let p = points[i].split(",");
				let x = parseInt(p[0]), y = parseInt(p[1]);
				p = this.m_Points[y * this.m_iGridWidth + x];
				if (p != null) {
					p.$SetStatus(point_status);
					p.$SetFillColor(sOwnedCol);
					p.$strokeColor(sOwnedCol);
				}
			}


			this.m_bIsPlayerActive = true;
			this.ShowMobileStatus('Oponent has moved, your turn');
			this.m_Screen.style.cursor = "crosshair";
			this.m_DrawMode.disabled = this.m_CancelPath.disabled = '';
		}
		else {

			//set starting point to POINT_IN_PATH to block further path closing with it
			let points = this.m_Line.$GetPoints();
			//var y = points[0].split(",");
			//var x = y[0];	y = y[1];
			let i = 0;
			let x = points[i], y = points[i + 1];
			x /= this.m_iGridSize; y /= this.m_iGridSize;
			let p0 = this.m_Points[y * this.m_iGridWidth + x];
			if (p0 != null)
				p0.$SetStatus(this.POINT_IN_PATH);

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

	GameLoop() {
		/*act = 'action=WaitForPlayer';
		if(this.m_Player2Name.innerHTML == '???')	act = act + '&ShowP2Name=true';*/
		let bP2NameUnknown = this.m_Player2Name.innerHTML == '???' ? true : false;

		this.SendAsyncData(this.CreateXMLWaitForPlayerRequest(bP2NameUnknown));
		let d = parseInt(((new Date()) - this.m_WaitStartTime) / 1000);
		if (this.m_iSlowdownLevel <= 0 && d >= (this.m_iTooLong2Duration * 0.25)) {
			this.m_iSlowdownLevel = 1;
			this.SetTimer(true);
		}
		else if (this.m_iSlowdownLevel <= 1 && d >= (this.m_iTooLong2Duration * 0.5)) {
			this.m_iSlowdownLevel = 2;
			this.SetTimer(true);
		}
		else if (this.m_iSlowdownLevel <= 2 && d >= (this.m_iTooLong2Duration * 0.75)) {
			this.m_iSlowdownLevel = 4;
			this.SetTimer(true);
		}
		else if (d >= this.m_iTooLong2Duration) {
			if (bP2NameUnknown) {
				this.SetTimer(false);
				if (confirm('Second player is still not connecting. Continue waiting?') == true)
					this.SetTimer(true);
				else {
					window.location.href = "Games";
					return;
				}
			}
			else {
				this.SetTimer(false);
				this.m_SurrenderButton.value = 'win';
				alert('Second player is not responding for quiet long. To walkover win click win - or continue to wait for oponent move');
				this.SetTimer(true);
			}
		}

		this.ShowMobileStatus(this.m_sMessage);
	}

	ShowMobileStatus(sMessage) {
		if (this.m_Player2Name.innerHTML == '???') {
			if (this.m_bIsPlayerActive)
				this.m_GameStatus.style.color = this.COLOR_RED;
			else
				this.m_GameStatus.style.color = this.COLOR_BLUE;
		}
		else if (this.m_bIsPlayerActive) {
			if (this.m_bIsPlayingWithRed)
				this.m_GameStatus.style.color = this.COLOR_RED;
			else
				this.m_GameStatus.style.color = this.COLOR_BLUE;
		}
		else {
			if (this.m_bIsPlayingWithRed)
				this.m_GameStatus.style.color = this.COLOR_BLUE;
			else
				this.m_GameStatus.style.color = this.COLOR_RED;
		}
		if (sMessage != null)
			this.Debug(sMessage, 0);
		else
			this.Debug('', 0);
	}

	OnMouseMove(event) {
		if (!this.m_bIsPlayerActive || this.m_Player2Name.innerHTML == '???' || this.m_bHandlingEvent == true
			|| this.iConnErrCount > 0)
			return;


		let x = (event ? event.clientX : window.event.clientX) - this.m_Screen.offsetLeft + this.f_scrollLeft() + 0.5 * this.m_iGridSize;
		let y = (event ? event.clientY : window.event.clientY) - this.m_Screen.offsetTop + this.f_scrollTop() + 0.5 * this.m_iGridSize;

		if (this.m_MouseCursorOval == null) {
			this.m_MouseCursorOval = $createOval(this.m_PointRadius, 'true');
			this.m_MouseCursorOval.$SetFillColor(this.m_sDotColor);
			this.m_MouseCursorOval.$strokeColor(this.m_sDotColor);
			this.m_MouseCursorOval.$SetZIndex(-1);
		}
		x = parseInt(x / this.m_iGridSize);
		y = parseInt(y / this.m_iGridSize);
		let tox = x * this.m_iGridSize;
		let toy = y * this.m_iGridSize;

		this.m_MouseCursorOval.$move(tox, toy, this.m_PointRadius);
		this.m_Screen.style.cursor = "crosshair";

		if (this.m_bDrawLines) {
			//lines
			if (this.m_bMouseDown == true && (this.m_iLastX != x || this.m_iLastY != y) &&
				(Math.abs(parseInt(this.m_iLastX - x)) <= 1 && Math.abs(parseInt(this.m_iLastY - y)) <= 1) &&
				this.m_iLastX >= 0 && this.m_iLastY >= 0) {
				if (this.m_Line != null) {
					let p0 = this.m_Points[this.m_iLastY * this.m_iGridWidth + this.m_iLastX];
					let p1 = this.m_Points[y * this.m_iGridWidth + x];

					if (p0 != null && p1 != null && (p1.$GetStatus() != this.POINT_IN_PATH) &&
						p0.$GetFillColor() == this.m_sDotColor && p1.$GetFillColor() == this.m_sDotColor) {
						this.m_Line.$AppendPoints(tox + "," + toy);
						if (p1.$GetStatus() != this.POINT_STARTING)
							p1.$SetStatus(this.POINT_IN_PATH);
						else {
							let val = this.SurroundOponentPoints();
							if (val.owned.length > 0) {
								this.m_Line.$SetIsClosed(true);
								this.Debug('Closing path', 0);
								this.SendAsyncData(this.CreateXMLPutPathRequest(val));
							}
							else
								this.Debug('Wrong path, cancell it or refresh page', 0);
						}

						this.m_iLastX = x;
						this.m_iLastY = y;
					}
				}
				else {
					let p0 = this.m_Points[this.m_iLastY * this.m_iGridWidth + this.m_iLastX];
					let p1 = this.m_Points[y * this.m_iGridWidth + x];

					if (p0 != null && p1 != null &&
						(p0.$GetStatus() != this.POINT_IN_PATH && p1.$GetStatus() != this.POINT_IN_PATH) &&
						p0.$GetFillColor() == this.m_sDotColor && p1.$GetFillColor() == this.m_sDotColor) {
						let fromx = this.m_iLastX * this.m_iGridSize;
						let fromy = this.m_iLastY * this.m_iGridSize;
						this.m_Line = $createPolyline(3, fromx + "," + fromy + " " + tox + "," + toy, this.m_sDotColor);
						if (p0.$GetStatus() != this.POINT_IN_PATH)
							p0.$SetStatus(this.POINT_STARTING);
						if (p1.$GetStatus() != this.POINT_IN_PATH)
							p1.$SetStatus(this.POINT_STARTING);

						this.m_iLastX = x;
						this.m_iLastY = y;
					}
				}
			}
		}
	}

	OnMouseDown(event) {
		if (!this.m_bIsPlayerActive || this.m_Player2Name.innerHTML == '???' || this.m_bHandlingEvent == true
			|| this.iConnErrCount > 0)
			return;

		let x = (event ? event.clientX : window.event.clientX) - this.m_Screen.offsetLeft + this.f_scrollLeft() + 0.5 * this.m_iGridSize;
		let y = (event ? event.clientY : window.event.clientY) - this.m_Screen.offsetTop + this.f_scrollTop() + 0.5 * this.m_iGridSize;
		x = this.m_iMouseX = parseInt(x / this.m_iGridSize);
		y = this.m_iMouseY = parseInt(y / this.m_iGridSize);

		this.m_bMouseDown = true;
		if (!this.m_bDrawLines) {
			//points
			this.m_iLastX = x;
			this.m_iLastY = y;

			let loc_x = x;
			let loc_y = y;
			x = loc_x * this.m_iGridSize;
			y = loc_y * this.m_iGridSize;

			if (this.m_Points[loc_y * this.m_iGridWidth + loc_x] != null) return;
			if (!this.IsPointOutsideAllPaths(loc_x, loc_y)) return;

			this.SendAsyncData(this.CreateXMLPutPointRequest(loc_x, loc_y));
		}
		else {
			//lines
			//this.Debug('m_iMouseX = '+this.m_iMouseX+' m_iMouseY = '+this.m_iMouseY, 1);
			if ( /*this.m_bMouseDown == true && */(this.m_iLastX != x || this.m_iLastY != y) &&
				(Math.abs(parseInt(this.m_iLastX - x)) <= 1 && Math.abs(parseInt(this.m_iLastY - y)) <= 1) &&
				this.m_iLastX >= 0 && this.m_iLastY >= 0) {
				if (this.m_Line != null) {
					let p0 = this.m_Points[this.m_iLastY * this.m_iGridWidth + this.m_iLastX];
					let p1 = this.m_Points[y * this.m_iGridWidth + x];

					if (p0 != null && p1 != null && (p1.$GetStatus() != this.POINT_IN_PATH) &&
						p0.$GetFillColor() == this.m_sDotColor && p1.$GetFillColor() == this.m_sDotColor) {
						let tox = x * this.m_iGridSize;
						let toy = y * this.m_iGridSize;
						this.m_Line.$AppendPoints(tox + "," + toy);
						if (p1.$GetStatus() != this.POINT_STARTING)
							p1.$SetStatus(this.POINT_IN_PATH);
						else {
							let val = this.SurroundOponentPoints();
							if (val.owned.length > 0) {
								this.m_Line.$SetIsClosed(true);
								this.Debug('Closing path', 0);
								this.SendAsyncData(this.CreateXMLPutPathRequest(val));
							}
							else
								this.Debug('Wrong path, cancell it or refresh page', 0);
						}

						this.m_iLastX = x;
						this.m_iLastY = y;
					}
				}
				else {
					let p0 = this.m_Points[this.m_iLastY * this.m_iGridWidth + this.m_iLastX];
					let p1 = this.m_Points[y * this.m_iGridWidth + x];

					if (p0 != null && p1 != null && (p0.$GetStatus() != this.POINT_IN_PATH &&
						p1.$GetStatus() != this.POINT_IN_PATH) &&
						p0.$GetFillColor() == this.m_sDotColor && p1.$GetFillColor() == this.m_sDotColor) {
						let fromx = this.m_iLastX * this.m_iGridSize;
						let fromy = this.m_iLastY * this.m_iGridSize;
						let tox = x * this.m_iGridSize;
						let toy = y * this.m_iGridSize;
						this.m_Line = $createPolyline(3, fromx + "," + fromy + " " + tox + "," + toy, this.m_sDotColor);
						if (p0.$GetStatus() != this.POINT_IN_PATH) p0.$SetStatus(this.POINT_STARTING);
						if (p1.$GetStatus() != this.POINT_IN_PATH) p1.$SetStatus(this.POINT_STARTING);
					}
					this.m_iLastX = x;
					this.m_iLastY = y;
				}
			}
			else if (this.m_iLastX < 0 || this.m_iLastY < 0) {
				let p1 = this.m_Points[y * this.m_iGridWidth + x];
				if (p1 != null && p1.$GetStatus() == this.POINT_FREE && p1.$GetFillColor() == this.m_sDotColor) {
					this.m_iLastX = x;
					this.m_iLastY = y;
					//this.Debug('first point registered m_iLastX = '+this.m_iLastX+' m_iLastY = '+this.m_iLastY, 1);
				}
			}
		}
	}

	OnMouseUp(event) {
		this.m_bMouseDown = false;
	}

	OnDrawModeClick(event) {
		this.m_bDrawLines = !this.m_bDrawLines;
		let btn = event.target;
		if (!this.m_bDrawLines) {
			btn.value = 'Draw lines';
		}
		else {
			btn.value = 'Draw dots';
		}
		this.m_iLastX = this.m_iLastY = -1;
		this.m_Line = null;
	}

	OnCancelClick() {
		if (this.m_bDrawLines) {
			if (this.m_Line != null) {
				let points = this.m_Line.$GetPoints();
				for (let i = 0; i < points.length; i += 2) {
					//var y = points[i].split(",");
					//var x = y[0];	y = y[1];
					let x = points[i];
					let y = points[i + 1];
					if (x == null || y == null) continue;
					x /= this.m_iGridSize; y /= this.m_iGridSize;
					let p0 = this.m_Points[y * this.m_iGridWidth + x];
					if (p0 != null)
						p0.$SetStatus(this.POINT_FREE);
				}
				$RemovePolyline(this.m_Line);
				this.m_Line = null;
			}
			this.m_iLastX = this.m_iLastY = -1;
		}
	}

	OnTestClick() {
		if (this.m_bDrawLines) {
			if (this.m_Line != null) {
				let val = this.SurroundOponentPoints();
				if (val.owned.length > 0) {
					this.m_iLastX = this.m_iLastY = -1;
					this.m_Line = null;
				}
			}
		}
		else {
			let p0 = this.m_Points[this.m_iLastY * this.m_iGridWidth + this.m_iLastX];
			let pos = p0.$GetPosition();
			this.Debug(`${p0.$GetFillColor()} posX = ${pos.x} posY = ${pos.y}`, 1);
		}
	}

	/**
	 * Start drawing routines
	 * @param {HTMLElement} sScreen screen dontainer selector
	 * @param {HTMLElement} sPlayer2Name displaying element selector
	 * @param {HTMLElement} sGameStatus game stat element selector
	 * @param {HTMLElement} sSurrenderButton surrender button element selector
	 * @param {HTMLElement} sDrawMode draw mode button element selector
	 * @param {HTMLElement} sCancelPath cancel path button element selector
	 * @param {number} iTooLong2Duration how long waiting is too long
	 */
	PrepareDrawing(sScreen, sPlayer2Name, sGameStatus, sSurrenderButton, sDrawMode, sCancelPath, iTooLong2Duration = 125) {
		this.m_bIsWon = false;
		this.m_iDelayBetweenMultiCaptures = 4000;
		this.m_iTimerInterval = 2000;
		this.m_iTooLong2Duration = iTooLong2Duration/*125*/;
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
		this.m_iClientWidth = 0;
		this.m_iClientHeight = 0;
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
		this.m_iClientWidth = this.m_Screen.clientWidth;
		this.m_iClientHeight = this.m_Screen.clientHeight;
		this.m_iGridWidth = parseInt(this.m_iClientWidth / this.m_iGridSize);
		this.m_iGridHeight = parseInt(this.m_iClientHeight / this.m_iGridSize);

		$createSVGVML(this.m_Screen, this.m_Screen.style.width, this.m_Screen.style.height, true);

		this.DisableSelection(this.m_Screen);
		if (!this.m_bViewOnly) {
			this.m_Screen.onmousedown = this.OnMouseDown.bind(this);
			this.m_Screen.onmousemove = this.OnMouseMove.bind(this);
			this.m_Screen.onmouseup = this.OnMouseUp.bind(this);

			this.m_DrawMode.onclick = this.OnDrawModeClick.bind(this);
			this.m_CancelPath.onclick = this.OnCancelClick.bind(this);

			if (this.m_Player2Name.innerHTML == '???') {
				this.ShowMobileStatus('Waiting for other player to connect');
				this.m_Screen.style.cursor = "wait";
			}
			else {
				this.m_SurrenderButton.value = 'surrender';

				if (this.m_bIsPlayerActive) {
					this.ShowMobileStatus('Your move');
					this.m_Screen.style.cursor = "crosshair";
					this.m_DrawMode.disabled = this.m_CancelPath.disabled = '';
				}
				else {
					this.ShowMobileStatus('Waiting for oponent move');
					this.m_Screen.style.cursor = "wait";
					this.m_DrawMode.disabled = this.m_CancelPath.disabled = 'disabled';
				}
			}
		}
	}
}
/******** /funcs-n-classes ********/
