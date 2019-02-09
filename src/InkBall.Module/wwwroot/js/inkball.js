/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "InkBallGame|CountPointsDebug" }]*/
/*global signalR $createOval $createPolyline $RemovePolyline $createSVGVML g_XmlHttp*/
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
	PLAYER_SURRENDER: 4,
	WIN: 5
});

const GameTypeEnum = Object.freeze({
	FIRST_CAPTURE: 0,
	FIRST_5_CAPTURES: 1,
	FIRST_5_PATHS: 2,
	FIRST_5_ADVANTAGE_PATHS: 3
});

const WinStatusEnum = Object.freeze({
	RED_WINS: 0,
	GREEN_WINS: 1,
	NO_WIN: 2,
	DRAW_WIN: 3
});

class DtoMsg {
	GetKind() { throw new Error("missing GetKind implementation!"); }
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

	GetKind() { return CommandKindEnum.POINT; }

	static Format(sUser, point) {
		let msg = point.iX + ' ' + point.iY + ' ' + point.Status;

		return sUser + " places [" + msg + "] point";
	}
}

class InkBallPathViewModel extends DtoMsg {
	constructor(iId = 0, iGameId = 0, iPlayerId = 0, PointsAsString = '', OwnedPointsAsString = '') {
		super();

		this.iId = iId;
		this.iGameId = iGameId;
		this.iPlayerId = iPlayerId;
		this.PointsAsString = PointsAsString;
		this.OwnedPointsAsString = OwnedPointsAsString;
	}

	GetKind() { return CommandKindEnum.PATH; }

	static Format(sUser, path) {
		let msg = path.iPlayerId + " " + path.PointsAsString + " " + path.OwnedPointsAsString;

		return sUser + " places [" + msg + "] path";
	}
}

/*class WaitForPlayerCommand extends DtoMsg {
	constructor(showP2Name = false) {
		super();

		this.ShowP2Name = showP2Name;
	}

	//GetDtoType() { return "WaitForPlayerCommand"; }
}*/

class PlayerJoiningCommand extends DtoMsg {
	constructor(otherPlayerId, otherPlayerName, message) {
		super();

		this.OtherPlayerId = otherPlayerId;
		this.OtherPlayerName = otherPlayerName;
		this.Message = message;
	}

	GetKind() { return CommandKindEnum.PLAYER_JOINING; }

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

	GetKind() { return CommandKindEnum.PLAYER_SURRENDER; }

	static Format(surrender) {
		return surrender.Message;
	}
}

class PingCommand extends DtoMsg {
	constructor(message = '') {
		super();

		this.Message = message;
	}

	GetKind() { return CommandKindEnum.PING; }

	static Format(sUser, ping) {
		let txt = ping.Message;

		return sUser + " says " + txt;
	}
}

class WinCommand extends DtoMsg {
	constructor(status = WinStatusEnum.NO_WIN, winningPlayerId = 0, message = 'null') {
		super();

		this.Status = status;
		this.WinningPlayerId = winningPlayerId;
		this.Message = message;
	}

	GetKind() { return CommandKindEnum.WIN; }

	static Format(win) {
		let msg = '';
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
}

//Debug function
function CountPointsDebug(sSelector2Set, sSvgSelector = 'svg') {
	let svgs = document.getElementsByTagName(sSvgSelector), totalChildren = 0, childCounts = [];

	for (let i = 0; i < svgs.length; i++) {
		let svg = svgs[i];
		totalChildren += svg.childElementCount;
		childCounts.push(svg.childElementCount);
	}

	let tags = ["circle", "polyline"], tagMessage = "";
	tags.forEach(tagName => {
		tagMessage += (tagName + ": " + document.getElementsByTagName(tagName).length + " ");
	});

	document.querySelector(sSelector2Set).innerHTML = `SVG: ${totalChildren} by tag: ${tagMessage}`;
}

class InkBallGame {

	/**
	 * InkBallGame contructor
	 * @param {string} sHubName SignalR hub name
	 * @param {enum} loggingLevel log level for SignalR
	 * @param {enum} hubProtocol Json or messagePack
	 * @param {enum} transportType websocket, server events or long polling
	 * @param {number} serverTimeoutInMilliseconds If the server hasn't sent a message in this interval, the client considers the server disconnected
	 * @param {function} tokenFactory auth token factory
	 * @param {enum} gameType of game enum
	 * @param {bool} bIsPlayingWithRed true - red, false - blue
	 * @param {bool} bIsPlayerActive is this player acive now
	 * @param {number} iGridSize grid size (number of rows and cols equal)
	 * @param {number} iTooLong2Duration too long wait duration
	 * @param {bool} bViewOnly only viewing the game no interaction
	 */
	constructor(sHubName, loggingLevel, hubProtocol, transportType, serverTimeoutInMilliseconds, tokenFactory, gameType,
		bIsPlayingWithRed = true, bIsPlayerActive = true, iGridSize = 15, iTooLong2Duration = 125, bViewOnly = false) {

		this.g_iGameID = null;
		this.g_iPlayerID = null;
		this.GameType = gameType;
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

		this.g_SignalRConnection = new signalR.HubConnectionBuilder()
			.withUrl(sHubName, {
				transport: transportType,
				accessTokenFactory: tokenFactory
			})
			.withHubProtocol(hubProtocol)
			.configureLogging(loggingLevel)
			.build();
		this.g_SignalRConnection.serverTimeoutInMilliseconds = serverTimeoutInMilliseconds;
		

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
		this.m_sMsgInputSel = sMsgInputSel;
		this.m_sMsgSendButtonSel = sMsgSendButtonSel;

		this.g_SignalRConnection.on("ServerToClientPoint", function (point, user) {

			let encodedMsg = InkBallPointViewModel.Format(user, point);

			let li = document.createElement("li");
			li.textContent = encodedMsg;
			document.querySelector(sMsgListSel).appendChild(li);

			this.ReceivedPointProcessing(point);

		}.bind(this));

		this.g_SignalRConnection.on("ServerToClientPath", function (dto, user) {
			if (dto.hasOwnProperty('PointsAsString')) {
				let path = dto;

				let encodedMsg = InkBallPathViewModel.Format(user, path);

				let li = document.createElement("li");
				li.textContent = encodedMsg;
				document.querySelector(sMsgListSel).appendChild(li);

				this.ReceivedPathProcessing(path);
			}
			else if (dto.hasOwnProperty('WinningPlayerId')) {
				let win = dto;
				let encodedMsg = WinCommand.Format(win);

				let li = document.createElement("li");
				li.textContent = encodedMsg;
				document.querySelector(sMsgListSel).appendChild(li);

				this.ReceivedWinProcessing(win);
			}
			else
				throw new Error("ServerToClientPath bad GetKind!");

		}.bind(this));

		this.g_SignalRConnection.on("ServerToClientPlayerJoin", function (join) {

			let encodedMsg = PlayerJoiningCommand.Format(join);

			let li = document.createElement("li");
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

			let encodedMsg = PlayerSurrenderingCommand.Format(surrender);

			let li = document.createElement("li");
			li.textContent = encodedMsg;
			document.querySelector(sMsgListSel).appendChild(li);


			this.m_bHandlingEvent = false;
			alert(encodedMsg === '' ? 'Game interrupted!' : encodedMsg);
			window.location.href = "Games";
		}.bind(this));

		this.g_SignalRConnection.on("ServerToClientPlayerWin", function (win) {
			let encodedMsg = WinCommand.Format(win);

			let li = document.createElement("li");
			li.textContent = encodedMsg;
			document.querySelector(sMsgListSel).appendChild(li);

			this.ReceivedWinProcessing(win);

		}.bind(this));

		this.g_SignalRConnection.on("ServerToClientPing", function (ping, user) {

			let encodedMsg = PingCommand.Format(user, ping);

			let li = document.createElement("li");
			li.textContent = encodedMsg;
			document.querySelector(sMsgListSel).appendChild(li);
		}.bind(this));

		document.querySelector(this.m_sMsgSendButtonSel).addEventListener("click", function (event) {
			event.preventDefault();

			let encodedMsg = document.querySelector(this.m_sMsgInputSel).value.trim();
			if (encodedMsg === '') return;

			let ping = new PingCommand(encodedMsg);

			this.SendAsyncData(ping);

		}.bind(this), false);

		// Execute a function when the user releases a key on the keyboard
		document.querySelector(this.m_sMsgInputSel).addEventListener("keyup", function (event) {
			event.preventDefault();// Cancel the default action, if needed

			if (event.keyCode === 13) {// Number 13 is the "Enter" key on the keyboard
				// Trigger the button element with a click
				document.querySelector(this.m_sMsgSendButtonSel).click();
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
				{
					let d = document.getElementById('debug' + args[1]);
					d.innerHTML = args[0];
					break;
				}
			default:
				break;
		}
	}

	SetTimer(bStartTimer) {
		if (bStartTimer === false) {
			if (this.m_bIsTimerRunning === true)
				clearInterval(this.m_iTimerID);
			this.m_bIsTimerRunning = false;
		}
		else {
			if (this.m_bIsTimerRunning === true)
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
		if (typeof Target.onselectstart !== undefined)//IE route
			Target.onselectstart = function () { return false; };
		else if (typeof Target.style.MozUserSelect !== undefined)//Firefox route
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
			if (p[3] === this.g_iPlayerID) {//iPlayerID
			}
			else {
				switch (p[2]) {//Status
					case StatusEnum.POINT_FREE:
					case StatusEnum.POINT_FREE_RED:
					case StatusEnum.POINT_FREE_BLUE:
					case StatusEnum.POINT_STARTING:
					case StatusEnum.POINT_OWNED_BY_RED:
					case StatusEnum.POINT_OWNED_BY_BLUE:
						break;
					case StatusEnum.POINT_IN_PATH:
						if (this.m_bIsPlayingWithRed === true) {//bPlayingWithRed
							p[2] = StatusEnum.POINT_FREE_BLUE;
						}
						else {
							p[2] = StatusEnum.POINT_FREE_RED;
						}
						break;
				}
			}

			this.SetPoint(p[0]/*x*/, p[1]/*y*/, p[2]/*Status*/);
		});
	}

	SetPath(packed, bIsRed, bBelong2ThisPlayer) {
		let sPoints = packed.split(" ");
		let count = sPoints.length, sDelimiter = "", sPathPoints = "", p = null, x, y;
		for (let i = 0; i < count; ++i) {
			p = sPoints[i].split(",");
			x = parseInt(p[0]); y = parseInt(p[1]);
			x *= this.m_iGridSize; y *= this.m_iGridSize;
			sPathPoints = sPathPoints + sDelimiter + x + "," + y;
			sDelimiter = " ";

			p = this.m_Points[y * this.m_iGridWidth + x];
			if (p !== null && p !== undefined) p.$SetStatus(this.POINT_IN_PATH);
		}
		p = sPoints[0].split(",");
		x = parseInt(p[0]); y = parseInt(p[1]);
		x *= this.m_iGridSize; y *= this.m_iGridSize;
		sPathPoints = sPathPoints + sDelimiter + x + "," + y;
		p = this.m_Points[y * this.m_iGridWidth + x];
		if (p !== null && p !== undefined) p.$SetStatus(this.POINT_IN_PATH/*this.POINT_STARTING*/);

		let line = $createPolyline(3, sPathPoints,
			(bBelong2ThisPlayer ? this.m_sDotColor : (bIsRed ? this.COLOR_BLUE : this.COLOR_RED)));
		this.m_Lines[this.m_Lines.length] = line;
	}

	SetAllPaths(paths) {
		paths.forEach(p => {
			this.SetPath(p[0]/*points*/, this.m_bIsPlayingWithRed, p[1] === this.g_iPlayerID/*isMainPlayerPoints*/);
		});
	}

	IsPointBelongingToLine(sPoints, iX, iY) {
		let count = sPoints.length, x, y, pnt;
		for (let i = 0; i < count; ++i) {
			pnt = sPoints[i].split(",");
			x = pnt[0]; y = pnt[1];
			if (x === iX && y === iY)
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
		let i, j, c = false;
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
			if (x === null || y === null) continue;
			x /= this.m_iGridSize; y /= this.m_iGridSize;
			xs[k] = x; ys[k] = y;

			sPathPoints = sPathPoints + sDelimiter + x + "," + y;
			sDelimiter = " ";
			++k;
		}
		//alert(sPathPoints);
		if (!(xs[0] === xs[xs.length - 1] && ys[0] === ys[ys.length - 1]))
			return { owned: "", path: "" };

		//make the test!
		let count1 = this.m_Points.length;
		let sColor = (this.m_sDotColor === this.COLOR_RED ? this.COLOR_BLUE : this.COLOR_RED);
		let owned_by = (this.m_sDotColor === this.COLOR_RED ? this.POINT_OWNED_BY_RED : this.POINT_OWNED_BY_BLUE);
		let sOwnedCol = (this.m_sDotColor === this.COLOR_RED ? this.COLOR_OWNED_RED : this.COLOR_OWNED_BLUE);
		let sOwnedPoints = "";
		sDelimiter = "";
		for (let i = 0; i < count1; ++i) {
			let p0 = this.m_Points[i];
			if (p0 !== undefined && p0.$GetStatus() === this.POINT_FREE && p0.$GetFillColor() === sColor) {
				let pos = p0.$GetPosition();
				x = pos.x; y = pos.y;
				x /= this.m_iGridSize; y /= this.m_iGridSize;

				if (false !== this.pnpoly(count, xs, ys, x, y)) {
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
				if (x === null || y === null) continue;
				x /= this.m_iGridSize; y /= this.m_iGridSize;
				xs[k] = x; ys[k] = y;
				++k;
			}

			if (false !== this.pnpoly(count, xs, ys, iX, iY))
				return false;
		}

		return true;
	}

	CreateXMLWaitForPlayerRequest(/*...args*/) {
		//let cmd = new WaitForPlayerCommand((args.length > 0 && args[0] === true) ? true : false);
		//return cmd;
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

		switch (payload.GetKind()) {

			case CommandKindEnum.POINT:
				console.log(InkBallPointViewModel.Format('some player', payload));
				this.m_bHandlingEvent = true;

				this.g_SignalRConnection.invoke("ClientToServerPoint", payload).then(function (point) {
					this.ReceivedPointProcessing(point);
				}.bind(this)).catch(function (err) {
					return console.error(err.toString());
				});
				break;

			case CommandKindEnum.PATH:
				console.log(InkBallPathViewModel.Format('some player', payload));
				this.m_bHandlingEvent = true;

				this.g_SignalRConnection.invoke("ClientToServerPath", payload).then(function (dto) {

					if (dto.hasOwnProperty('WinningPlayerId')) {
						let win = dto;
						this.ReceivedWinProcessing(win);
					}
					else if (dto.hasOwnProperty('PointsAsString')) {
						let path = dto;
						this.ReceivedPathProcessing(path);
					}
					else
						throw new Error("ClientToServerPath bad GetKind!");

				}.bind(this)).catch(function (err) {
					return console.error(err.toString());
				});
				break;

			case CommandKindEnum.PING:
				this.g_SignalRConnection.invoke("ClientToServerPing", payload).then(function () {
					document.querySelector(this.m_sMsgInputSel).value = '';
					document.querySelector(this.m_sMsgSendButtonSel).disabled = 'disabled';
				}.bind(this)).catch(function (err) {
					return console.error(err.toString());
				});
				break;

			default:
				console.log('unknown object');
				break;
		}
	}

	AjaxResponseCallBack() {
		if ((g_XmlHttp.readyState === 4 || g_XmlHttp.readyState === "complete") && g_XmlHttp.status === 200) {
			let xml = g_XmlHttp.responseXML;
			let response = xml.firstChild;
			if (response.nodeType !== 1) response = response.nextSibling;
			let resp_type = response.nodeName;

			switch (resp_type) {
				case 'WaitForPlayer':
					{
						let sP2Name = response.getElementsByTagName('P2Name').length > 0 ?
							response.getElementsByTagName('P2Name')[0].firstChild.data : '';
						let bActive = response.getElementsByTagName('Active')[0].firstChild.data === 'true'
							? true : false;
						if (bActive) {
							if (sP2Name !== '') {
								this.m_Player2Name.innerHTML = sP2Name;
								this.m_SurrenderButton.value = 'surrender';
							}
							if (this.m_SurrenderButton.value === 'win')
								this.m_SurrenderButton.value = 'surrender';
							/////////////TODO: process last action///////////////

							let last_move = response.getElementsByTagName('LastMove')[0];
							last_move = last_move.firstChild;
							switch (last_move.nodeName) {
								case 'Point':
									{
										let x = parseInt(last_move.getAttribute('x'));
										let y = parseInt(last_move.getAttribute('y'));
										let iStatus = parseInt(last_move.getAttribute('status'));
										this.SetPoint(x, y, iStatus);

										this.m_bIsPlayerActive = true;
										this.SetTimer(false);
										this.ShowMobileStatus('Oponent has moved, your turn');
									}
									break;

								case 'Path':
									{
										let path = last_move.firstChild.data;
										let owned = response.getElementsByTagName('Owned')[0].firstChild.data;

										this.SetPath(path,
											(this.m_sDotColor === this.COLOR_RED ? true : false), false);

										let Points = owned.split(" ");
										let x, y, count = Points.length, p = null;
										let point_status = (this.m_sDotColor === this.COLOR_RED ?
											this.POINT_OWNED_BY_RED : this.POINT_OWNED_BY_BLUE);
										let sOwnedCol = (this.m_sDotColor === this.COLOR_RED ? this.COLOR_OWNED_BLUE : this.COLOR_OWNED_RED);
										for (let i = 0; i < count; ++i) {
											p = Points[i].split(",");
											x = parseInt(p[0]); y = parseInt(p[1]);
											p = this.m_Points[y * this.m_iGridWidth + x];
											if (p !== undefined) {
												p.$SetStatus(point_status);
												p.$SetFillColor(sOwnedCol);
												p.$strokeColor(sOwnedCol);
											}
										}

										this.m_bIsPlayerActive = true;
										this.SetTimer(false);
										this.ShowMobileStatus('Oponent has moved, your turn');
									}
									break;

								default:
									break;
							}
						}
						else {
							this.m_sMessage = 'Waiting for oponent move';
							if (sP2Name !== '') {
								this.m_Player2Name.innerHTML = sP2Name;
								this.m_SurrenderButton.value = 'surrender';
								this.ShowMobileStatus();
							}
						}
					}
					break;

				case 'PutPoint':
					this.m_bIsPlayerActive = false;
					this.m_iSlowdownLevel = 0;
					this.SetTimer(true);
					break;

				case 'PutPath':
					{
						//set starting point to POINT_IN_PATH to block further path closing with it
						let i = 0, points = this.m_Line.$GetPoints();
						//var y = points[0].split(",");
						//var x = y[0];	y = y[1];
						let x = points[i];
						let y = points[i + 1];
						x /= this.m_iGridSize; y /= this.m_iGridSize;
						let p0 = this.m_Points[y * this.m_iGridWidth + x];
						if (p0 !== undefined)
							p0.$SetStatus(this.POINT_IN_PATH);

						this.m_Lines[this.m_Lines.length] = this.m_Line;
						this.m_iLastX = this.m_iLastY = -1;
						this.m_Line = null;

						this.m_bIsPlayerActive = false;
						this.m_iSlowdownLevel = 0;
						this.SetTimer(true);
					}
					break;

				case 'InterruptGame':
					{
						//TODO: break this infinite loop after some 1 minute or so - bandwith prevention
						//or maybe also make GameLoop run @ longer interval
						this.SetTimer(false);
						let msg = response.getElementsByTagName('msg').length > 0 ?
							response.getElementsByTagName('msg')[0].firstChild.data : '';
						if (msg === '')
							alert('Game interrupted!');
						else
							alert(msg);
						window.location.href = "Games";
					}
					break;

				case 'WaitingForSecondPlayer':
					//TODO: break this infinite loop after some 1 minute or so - bandwith prevention
					//or maybe also make GameLoop run @ longer interval
					//this.Debug('Oczekiwanie na podłączenie drugiego gracza', 1);
					this.m_sMessage = 'Waiting for other player to connect';
					break;

				case 'Err':
					{
						let msg = response.getElementsByTagName('msg').length > 0 ?
							response.getElementsByTagName('msg')[0].firstChild.data : 'unknown error';
						alert(msg);
						this.OnCancelClick();
					}
					break;

				default:
					break;
			}
		}
	}

	ReceivedPointProcessing(point) {
		let x = point.iX, y = point.iY, iStatus = point.Status;

		this.SetPoint(x, y, iStatus);
		if (this.g_iPlayerID !== point.iPlayerId) {
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
		if (this.g_iPlayerID !== path.iPlayerId) {

			let str_path = path.PointsAsString, owned = path.OwnedPointsAsString;

			this.SetPath(str_path,
				(this.m_sDotColor === this.COLOR_RED ? true : false), false);

			let points = owned.split(" ");
			let count = points.length;
			let point_status = (this.m_sDotColor === this.COLOR_RED ? this.POINT_OWNED_BY_RED : this.POINT_OWNED_BY_BLUE);
			let sOwnedCol = (this.m_sDotColor === this.COLOR_RED ? this.COLOR_OWNED_BLUE : this.COLOR_OWNED_RED);
			for (let i = 0; i < count; ++i) {
				let p = points[i].split(",");
				let x = parseInt(p[0]), y = parseInt(p[1]);
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
			if (p0 !== undefined)
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

	ReceivedWinProcessing(win) {
		this.ShowMobileStatus('Win situation');
		this.m_bHandlingEvent = false;

		let encodedMsg = WinCommand.Format(win);

		if (((win.Status === WinStatusEnum.RED_WINS || win.Status === WinStatusEnum.GREEN_WINS) && win.WinningPlayerId > 0) ||
			win.Status === WinStatusEnum.DRAW_WIN) {

			alert(encodedMsg === '' ? 'Game won!' : encodedMsg);
			window.location.href = "Games";
			
		}
	}

	Check4Win(playerPaths, otherPlayerPaths, playerPoints, otherPlayerPoints) {
		let paths, points, count;
		switch (this.GameType) {
			case GameTypeEnum.FIRST_CAPTURE:
				paths = playerPaths;
				if (paths.length > 0) {
					if (this.m_bIsPlayingWithRed)
						return WinStatusEnum.RED_WINS;
					else
						return WinStatusEnum.GREEN_WINS;
				}
				paths = otherPlayerPaths;
				if (paths.length > 0) {
					if (this.m_bIsPlayingWithRed)
						return WinStatusEnum.GREEN_WINS;
					else
						return WinStatusEnum.RED_WINS;
				}
				return WinStatusEnum.NO_WIN;//continue game

			case GameTypeEnum.FIRST_5_CAPTURES:
				points = otherPlayerPoints;
				count = 0;
				points.forEach(p => {
					if (p.iEnclosingPathId !== null)//TODO: count closed paths owning points
						++count;
					if (count >= 5) {
						if (this.m_bIsPlayingWithRed)
							return WinStatusEnum.RED_WINS;
						else
							return WinStatusEnum.GREEN_WINS;
					}
				});
				points = playerPoints;
				count = 0;
				points.forEach(p => {
					if (p.iEnclosingPathId !== null)
						++count;
					if (count >= 5) {
						if (this.m_bIsPlayingWithRed)
							return WinStatusEnum.GREEN_WINS;
						else
							return WinStatusEnum.RED_WINS;
					}
				});
				return WinStatusEnum.NO_WIN;//continue game

			case GameTypeEnum.FIRST_5_PATHS:
				paths = playerPaths;
				if (paths.length >= 5) {
					if (this.m_bIsPlayingWithRed)
						return WinStatusEnum.RED_WINS;
					else
						return WinStatusEnum.GREEN_WINS;
				}
				paths = otherPlayerPaths;
				if (paths.length >= 5) {
					if (this.m_bIsPlayingWithRed)
						return WinStatusEnum.GREEN_WINS;
					else
						return WinStatusEnum.RED_WINS;
				}
				return WinStatusEnum.NO_WIN;//continue game

			case GameTypeEnum.FIRST_5_ADVANTAGE_PATHS:
				{
					let this_player_paths = playerPaths;
					let other_player_paths = otherPlayerPaths;
					let diff = this_player_paths.length - other_player_paths.length;
					if (diff >= 5) {
						if (this.m_bIsPlayingWithRed)
							return WinStatusEnum.RED_WINS;
						else
							return WinStatusEnum.GREEN_WINS;
					}
					else if (diff <= -5) {
						if (this.m_bIsPlayingWithRed)
							return WinStatusEnum.GREEN_WINS;
						else
							return WinStatusEnum.RED_WINS;
					}
				}
				return WinStatusEnum.NO_WIN;//continue game

			default:
				throw new Error("Wrong game type");
		}
	}

	GameLoop() {
		/*act = 'action=WaitForPlayer';
		if(this.m_Player2Name.innerHTML === '???')	act = act + '&ShowP2Name=true';*/
		let bP2NameUnknown = this.m_Player2Name.innerHTML === '???' ? true : false;

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
				if (confirm('Second player is still not connecting. Continue waiting?') === true)
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

	ShowMobileStatus(sMessage = '') {
		if (this.m_Player2Name.innerHTML === '???') {
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
		if (sMessage !== null && sMessage !== '')
			this.Debug(sMessage, 0);
		else
			this.Debug('', 0);
	}

	OnMouseMove(event) {
		if (!this.m_bIsPlayerActive || this.m_Player2Name.innerHTML === '???' || this.m_bHandlingEvent === true
			|| this.iConnErrCount > 0)
			return;


		let x = (event ? event.clientX : window.event.clientX) - this.m_Screen.offsetLeft + this.f_scrollLeft() + 0.5 * this.m_iGridSize;
		let y = (event ? event.clientY : window.event.clientY) - this.m_Screen.offsetTop + this.f_scrollTop() + 0.5 * this.m_iGridSize;

		x = parseInt(x / this.m_iGridSize);
		y = parseInt(y / this.m_iGridSize);
		let tox = x * this.m_iGridSize;
		let toy = y * this.m_iGridSize;

		this.m_MouseCursorOval.$move(tox, toy, this.m_PointRadius);
		this.m_MouseCursorOval.$Show();
		this.m_Screen.style.cursor = "crosshair";
		this.Debug(`[${x},${y}]`, 1);


		if (this.m_bDrawLines) {
			//lines
			if (this.m_bMouseDown === true && (this.m_iLastX !== x || this.m_iLastY !== y) &&
				(Math.abs(parseInt(this.m_iLastX - x)) <= 1 && Math.abs(parseInt(this.m_iLastY - y)) <= 1) &&
				this.m_iLastX >= 0 && this.m_iLastY >= 0) {
				if (this.m_Line !== null) {
					let p0 = this.m_Points[this.m_iLastY * this.m_iGridWidth + this.m_iLastX];
					let p1 = this.m_Points[y * this.m_iGridWidth + x];

					if (p0 !== undefined && p1 !== undefined && (p1.$GetStatus() !== this.POINT_IN_PATH) &&
						p0.$GetFillColor() === this.m_sDotColor && p1.$GetFillColor() === this.m_sDotColor) {
						this.m_Line.$AppendPoints(tox + "," + toy);
						if (p1.$GetStatus() !== this.POINT_STARTING)
							p1.$SetStatus(this.POINT_IN_PATH);
						else {
							let val = this.SurroundOponentPoints();
							if (val.owned.length > 0) {
								//this.m_Line.$SetIsClosed(true);
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

					if (p0 !== undefined && p1 !== undefined &&
						(p0.$GetStatus() !== this.POINT_IN_PATH && p1.$GetStatus() !== this.POINT_IN_PATH) &&
						p0.$GetFillColor() === this.m_sDotColor && p1.$GetFillColor() === this.m_sDotColor) {
						let fromx = this.m_iLastX * this.m_iGridSize;
						let fromy = this.m_iLastY * this.m_iGridSize;
						this.m_Line = $createPolyline(3, fromx + "," + fromy + " " + tox + "," + toy, this.m_sDotColor);
						if (p0.$GetStatus() !== this.POINT_IN_PATH)
							p0.$SetStatus(this.POINT_STARTING);
						if (p1.$GetStatus() !== this.POINT_IN_PATH)
							p1.$SetStatus(this.POINT_STARTING);

						this.m_iLastX = x;
						this.m_iLastY = y;
					}
				}
			}
		}
	}

	OnMouseDown(event) {
		if (!this.m_bIsPlayerActive || this.m_Player2Name.innerHTML === '???' || this.m_bHandlingEvent === true
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

			if (this.m_Points[loc_y * this.m_iGridWidth + loc_x] !== undefined) return;
			if (!this.IsPointOutsideAllPaths(loc_x, loc_y)) return;

			this.SendAsyncData(this.CreateXMLPutPointRequest(loc_x, loc_y));
		}
		else {
			//lines
			//this.Debug('m_iMouseX = '+this.m_iMouseX+' m_iMouseY = '+this.m_iMouseY, 1);
			if ( /*this.m_bMouseDown === true && */(this.m_iLastX !== x || this.m_iLastY !== y) &&
				(Math.abs(parseInt(this.m_iLastX - x)) <= 1 && Math.abs(parseInt(this.m_iLastY - y)) <= 1) &&
				this.m_iLastX >= 0 && this.m_iLastY >= 0) {
				if (this.m_Line !== null) {
					let p0 = this.m_Points[this.m_iLastY * this.m_iGridWidth + this.m_iLastX];
					let p1 = this.m_Points[y * this.m_iGridWidth + x];

					if (p0 !== undefined && p1 !== undefined && (p1.$GetStatus() !== this.POINT_IN_PATH) &&
						p0.$GetFillColor() === this.m_sDotColor && p1.$GetFillColor() === this.m_sDotColor) {
						let tox = x * this.m_iGridSize;
						let toy = y * this.m_iGridSize;
						this.m_Line.$AppendPoints(tox + "," + toy);
						if (p1.$GetStatus() !== this.POINT_STARTING)
							p1.$SetStatus(this.POINT_IN_PATH);
						else {
							let val = this.SurroundOponentPoints();
							if (val.owned.length > 0) {
								//this.m_Line.$SetIsClosed(true);
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

					if (p0 !== undefined && p1 !== undefined && (p0.$GetStatus() !== this.POINT_IN_PATH &&
						p1.$GetStatus() !== this.POINT_IN_PATH) &&
						p0.$GetFillColor() === this.m_sDotColor && p1.$GetFillColor() === this.m_sDotColor) {
						let fromx = this.m_iLastX * this.m_iGridSize;
						let fromy = this.m_iLastY * this.m_iGridSize;
						let tox = x * this.m_iGridSize;
						let toy = y * this.m_iGridSize;
						this.m_Line = $createPolyline(3, fromx + "," + fromy + " " + tox + "," + toy, this.m_sDotColor);
						if (p0.$GetStatus() !== this.POINT_IN_PATH) p0.$SetStatus(this.POINT_STARTING);
						if (p1.$GetStatus() !== this.POINT_IN_PATH) p1.$SetStatus(this.POINT_STARTING);
					}
					this.m_iLastX = x;
					this.m_iLastY = y;
				}
			}
			else if (this.m_iLastX < 0 || this.m_iLastY < 0) {
				let p1 = this.m_Points[y * this.m_iGridWidth + x];
				if (p1 !== undefined && p1.$GetStatus() === this.POINT_FREE && p1.$GetFillColor() === this.m_sDotColor) {
					this.m_iLastX = x;
					this.m_iLastY = y;
					//this.Debug('first point registered m_iLastX = '+this.m_iLastX+' m_iLastY = '+this.m_iLastY, 1);
				}
			}
		}
	}

	OnMouseUp() {
		this.m_bMouseDown = false;
	}

	OnMouseLeave() {
		this.m_MouseCursorOval.$Hide();
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
			if (this.m_Line !== null) {
				let points = this.m_Line.$GetPoints();
				for (let i = 0; i < points.length; i += 2) {
					//var y = points[i].split(",");
					//var x = y[0];	y = y[1];
					let x = points[i];
					let y = points[i + 1];
					if (x === null || y === null) continue;
					x /= this.m_iGridSize; y /= this.m_iGridSize;
					let p0 = this.m_Points[y * this.m_iGridWidth + x];
					if (p0 !== undefined)
						p0.$SetStatus(this.POINT_FREE);
				}
				$RemovePolyline(this.m_Line);
				this.m_Line = null;
			}
			this.m_iLastX = this.m_iLastY = -1;
		}
	}

	OnTestClick() {
		console.log(this.m_Points.flat());
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
