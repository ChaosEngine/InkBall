/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "InkBallGame" }]*/
/*global signalR, gameOptions*/
"use strict";

let SVG, AIBundle;

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
	WIN: 5,
	POINTS_AND_PATHS: 6,
	USER_SETTINGS: 7,
	STOP_AND_DRAW: 8
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
		let msg = '(' + point.iX + ',' + point.iY + ' - ';
		const status = point.Status !== undefined ? point.Status : point.status;

		switch (status) {
			case StatusEnum.POINT_FREE_RED:
				msg += 'red';
				break;
			case StatusEnum.POINT_FREE_BLUE:
				msg += 'blue';
				break;
			case StatusEnum.POINT_FREE:
				msg += '';
				break;
			case StatusEnum.POINT_STARTING:
				msg += 'starting';
				break;
			case StatusEnum.POINT_IN_PATH:
				msg += 'path';
				break;
			case StatusEnum.POINT_OWNED_BY_RED:
				msg += 'owned by red';
				break;
			case StatusEnum.POINT_OWNED_BY_BLUE:
				msg += 'owned by blue';
				break;

			default:
				throw new Error("Bad point type!");
		}

		return sUser + ' places ' + msg + ')' + ' point';
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
		let msg = `(${path.PointsAsString || path.pointsAsString}) [${path.OwnedPointsAsString || path.ownedPointsAsString}]`;

		return `${sUser} places ${msg} path`;
	}
}

class PlayerJoiningCommand extends DtoMsg {
	constructor(otherPlayerId, otherPlayerName, message) {
		super();

		this.OtherPlayerId = otherPlayerId;
		this.OtherPlayerName = otherPlayerName;
		this.Message = message;
	}

	GetKind() { return CommandKindEnum.PLAYER_JOINING; }

	static Format(join) {
		return join.Message || join.message;
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
		return surrender.Message || surrender.message;
	}
}

class PingCommand extends DtoMsg {
	constructor(message = '') {
		super();

		this.Message = message;
	}

	GetKind() { return CommandKindEnum.PING; }

	static Format(sUser, ping) {
		let txt = ping.Message || ping.message;

		return sUser + " says '" + txt + "'";
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
		const status = win.Status !== undefined ? win.Status : win.status;
		switch (status) {
			case WinStatusEnum.RED_WINS:
				msg = 'red.';
				break;
			case WinStatusEnum.GREEN_WINS:
				msg = 'blue.';
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

class StopAndDrawCommand extends DtoMsg {
	constructor() {
		super();
	}

	GetKind() { return CommandKindEnum.STOP_AND_DRAW; }

	static Format(otherUser) {
		return 'User ' + otherUser + ' started to draw path';
	}
}

class PlayerPointsAndPathsDTO extends DtoMsg {
	constructor(points = [], paths = []) {
		super();
		this.Points = points;
		this.Paths = paths;
	}

	GetKind() { return CommandKindEnum.POINTS_AND_PATHS; }

	static Deserialize(ppDTO) {
		const serialized = `{ "Points": ${ppDTO.Points || ppDTO.points}, "Paths": ${ppDTO.Paths || ppDTO.paths} }`;
		const path_and_point = JSON.parse(serialized);
		return path_and_point;
	}
}

class ApplicationUserSettings extends DtoMsg {
	constructor(desktopNotifications = false) {
		super();
		this.DesktopNotifications = desktopNotifications;
	}

	GetKind() { return CommandKindEnum.USER_SETTINGS; }

	static Serialize(settings) {
		const jsonStr = JSON.stringify(settings);
		return jsonStr;
	}

	static Deserialize(jsonStr) {
		const settings = JSON.parse(jsonStr);
		return settings;
	}
}

class CountdownTimer {
	constructor({
		countdownSeconds = 60,
		labelSelector = null,
		initialStart = false,
		countdownReachedHandler = undefined
	} = {}) {
		this.countdownSeconds = countdownSeconds;
		this.totalSeconds = this.countdownSeconds;
		this.timerID = -1;
		this.label = null;
		this.countdownReachedHandler = countdownReachedHandler;
		if (labelSelector)
			this.label = document.querySelector(labelSelector);

		if (initialStart)
			this.Start();
	}

	setTimeFunc() {
		if ((--this.totalSeconds) <= 0) {
			this.Stop();
			if (this.countdownReachedHandler)
				this.countdownReachedHandler(this.label);
		}
		else if (this.label) {
			this.label.innerHTML = this.pad(parseInt(this.totalSeconds / 60)) +
				':' + this.pad(this.totalSeconds % 60);
		}
	}

	pad(val) {
		const valString = val + "";
		if (valString.length < 2) {
			return "0" + valString;
		} else {
			return valString;
		}
	}

	Start() {
		this.Stop();
		this.timerID = setInterval(this.setTimeFunc.bind(this), 1000);
	}

	Stop() {
		if (this.timerID > 0)
			clearInterval(this.timerID);
		if (this.label)
			this.label.innerHTML = '';
	}

	Reset({
		countdownSeconds = 60,
		labelSelector = null,
		initialStart = false,
		countdownReachedHandler = undefined
	} = {}) {
		this.countdownSeconds = countdownSeconds;
		this.totalSeconds = this.countdownSeconds;
		this.label = null;
		this.countdownReachedHandler = countdownReachedHandler;
		if (labelSelector)
			this.label = document.querySelector(labelSelector);

		if (initialStart)
			this.Start();
	}
}

/**
 * Loads modules dynamically
 * don't break webpack logic here! https://webpack.js.org/guides/code-splitting/
 * @param {object} gameOptions is an entry starter object definint game parameters
 */
async function importAllModulesAsync(gameOptions) {
	/*const IE11 = navigator.userAgent.indexOf('Trident') >= 0;
	if (IE11) {
		await import('@babel/polyfill');
		//await import('core-js');
		//await import('regenerator-runtime/runtime');
	}*/

	const selfFileName = Array.prototype.slice.call(document.getElementsByTagName('script'))
		.map(x => x.src).find(s => s.indexOf('inkball') !== -1).split('/').pop();
	const isMinified = selfFileName.indexOf("min") !== -1;

	if (isMinified)
		SVG = await import(/* webpackChunkName: "svgvmlMin" */'./svgvml.min.js');
	else
		SVG = await import(/* webpackChunkName: "svgvml" */'./svgvml.js');

	if (gameOptions.iOtherPlayerID === -1) {
		//AIBundle = await import(/* webpackChunkName: "AIDeps" */'./AIBundle.js');
	}
}

function LocalLog(msg) {
	// eslint-disable-next-line no-console
	console.log(msg);
}

function LocalError(...args) {
	let msg = '';
	for (let i = 0; i < args.length; i++) {
		const str = args[i];
		if (str)
			msg += str;
	}
	// eslint-disable-next-line no-console
	console.error(msg);
}

function RandomColor() {
	return 'var(--orange)';
	//return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

async function Sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

Function.prototype.callAsWorker = function (context, args) {
	return new Promise((resolve, reject) => {
		const code = `
${context ? [...context].reduce((acc, cur) => acc + cur.toString() + '\n') : ''}

self.onmessage = async function (e) { 
	const result = await ( ${this.toString()}.call(null, e.data) );

	self.postMessage( result ); 
}`,
			blob = new Blob([code], { type: "text/javascript" }),
			worker = new Worker(window.URL.createObjectURL(blob));
		worker.onmessage = e => (resolve(e.data), worker.terminate(), window.URL.revokeObjectURL(blob));
		worker.onerror = e => (reject(e.message), worker.terminate(), window.URL.revokeObjectURL(blob));
		worker.postMessage(args);
	});
};

class InkBallGame {

	/**
	 * InkBallGame contructor
	 * @param {number} iGameID ID of a game
	 * @param {number} iPlayerID player ID
	 * @param {number} iOtherPlayerID player ID
	 * @param {string} sHubName SignalR hub name
	 * @param {enum} loggingLevel log level for SignalR
	 * @param {enum} hubProtocol Json or messagePack
	 * @param {enum} transportType websocket, server events or long polling
	 * @param {number} serverTimeoutInMilliseconds If the server hasn't sent a message in this interval, the client considers the server disconnected
	 * @param {enum} gameType of game enum as string
	 * @param {boolean} bIsPlayingWithRed true - red, false - blue
	 * @param {boolean} bIsPlayerActive is this player acive now
	 * @param {boolean} bViewOnly only viewing the game no interaction
	 * @param {number} pathAfterPointDrawAllowanceSecAmount is number of seconds, a player is allowed to start drawing path after putting point
	 * @param {number} iTooLong2Duration too long wait duration
	 */
	constructor(iGameID, iPlayerID, iOtherPlayerID, sHubName, loggingLevel, hubProtocol, transportType, serverTimeoutInMilliseconds, gameType,
		bIsPlayingWithRed = true, bIsPlayerActive = true, bViewOnly = false, pathAfterPointDrawAllowanceSecAmount = 60, iTooLong2Duration = 125) {
		this.g_iGameID = iGameID;
		this.g_iPlayerID = iPlayerID;
		this.m_iOtherPlayerId = iOtherPlayerID;
		this.m_bIsCPUGame = this.m_iOtherPlayerId === -1;
		this.GameType = GameTypeEnum[gameType];
		this.iConnErrCount = 0;
		this.iExponentialBackOffMillis = 2000;
		this.COLOR_RED = 'red';
		this.COLOR_BLUE = 'blue';
		this.COLOR_OWNED_RED = '#DC143C';
		this.COLOR_OWNED_BLUE = '#8A2BE2';
		this.DRAWING_PATH_COLOR = "black";
		this.m_bIsWon = false;
		this.m_bPointsAndPathsLoaded = false;
		this.m_iDelayBetweenMultiCaptures = 4000;
		this.m_iTooLong2Duration = iTooLong2Duration/*125*/;
		this.m_Timer = null;
		this.m_ReconnectTimer = null;
		this.m_WaitStartTime = null;
		this.m_TimerOpts = {
			countdownSeconds: pathAfterPointDrawAllowanceSecAmount,
			labelSelector: "#debug2",
			initialStart: true,
			countdownReachedHandler: this.CountDownReachedHandler.bind(this)
		};
		this.m_iSlowdownLevel = 0;
		this.m_iGridSizeX = 0;
		this.m_iGridSizeY = 0;
		this.m_iGridWidth = 0;
		this.m_iGridHeight = 0;
		this.m_BoardSize = null;
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
		this.m_sMsgListSel = null;
		this.m_CancelPath = null;
		this.m_StopAndDraw = null;
		this.m_bMouseDown = false;
		this.m_bHandlingEvent = false;
		this.m_bDrawLines = !true;
		this.m_sMessage = '';
		this.m_bIsPlayingWithRed = bIsPlayingWithRed;
		this.m_bIsPlayerActive = bIsPlayerActive;
		this.m_sDotColor = this.m_bIsPlayingWithRed ? this.COLOR_RED : this.COLOR_BLUE;
		this.m_PointRadius = 4;
		this.SvgVml = null;
		this.m_Line = null;
		this.m_Lines = null;
		this.m_Points = null;
		this.m_bViewOnly = bViewOnly;
		this.m_MouseCursorOval = null;
		this.CursorPos = { x: -1, y: -1 };
		this.m_ApplicationUserSettings = null;
		this.m_sLastMoveGameTimeStamp = null;

		if (sHubName === null || sHubName === "") return;

		this.g_SignalRConnection = new signalR.HubConnectionBuilder()
			.withUrl(sHubName, {
				transport: transportType,
				accessTokenFactory: function () {
					return `iGameID=${this.g_iGameID}&iPlayerID=${this.g_iPlayerID}`;
				}.bind(this)
			})
			.withHubProtocol(hubProtocol)
			.configureLogging(loggingLevel)
			.build();
		this.g_SignalRConnection.serverTimeoutInMilliseconds = serverTimeoutInMilliseconds;


		this.g_SignalRConnection.onclose(async (err) => {
			if (err !== null && err !== undefined) {
				LocalError(err);

				this.m_Screen.style.cursor = "not-allowed";
				this.iConnErrCount++;
				setTimeout(() => this.Connect(), 4000 +
					(this.iExponentialBackOffMillis * Math.max(this.iConnErrCount, 5))//exponential back-off
				);
			}
		});
	}

	async GetPlayerPointsAndPaths() {
		if (this.m_bPointsAndPathsLoaded === false) {
			const ppDTO = await this.g_SignalRConnection.invoke("GetPlayerPointsAndPaths", this.m_bViewOnly, this.g_iGameID);
			//LocalLog(ppDTO);

			const path_and_point = PlayerPointsAndPathsDTO.Deserialize(ppDTO);
			if (path_and_point.Points !== undefined)
				await this.SetAllPoints(path_and_point.Points);
			if (path_and_point.Paths !== undefined)
				await this.SetAllPaths(path_and_point.Paths);

			this.m_bPointsAndPathsLoaded = true;

			return true;
		}
		else
			return false;
	}

	async Connect() {
		try {
			await this.g_SignalRConnection.start();
			this.iConnErrCount = 0;
			LocalLog('connected; iConnErrCount = ' + this.iConnErrCount);

			if (this.m_bViewOnly === false) {
				if (sessionStorage.getItem("ApplicationUserSettings") === null) {
					let settings = await this.g_SignalRConnection.invoke("GetUserSettings");
					if (settings) {
						LocalLog(settings);
						settings = ApplicationUserSettings.Deserialize(settings);
						const to_store = ApplicationUserSettings.Serialize(settings);

						sessionStorage.setItem("ApplicationUserSettings", to_store);
					}
					this.m_ApplicationUserSettings = new ApplicationUserSettings(settings.DesktopNotifications);

					await this.GetPlayerPointsAndPaths();
				}
				else {
					const json = sessionStorage.getItem("ApplicationUserSettings");
					const settings = ApplicationUserSettings.Deserialize(json);

					this.m_ApplicationUserSettings = new ApplicationUserSettings(settings.DesktopNotifications);
				}
			}
			if (this.m_bPointsAndPathsLoaded === false) {
				await this.GetPlayerPointsAndPaths();
			}
			if (this.m_ApplicationUserSettings !== null && this.m_ApplicationUserSettings.DesktopNotifications === true) {
				this.SetupNotifications();
			}

			if (true === this.m_bIsCPUGame && !this.m_bIsPlayerActive)
				this.StartCPUCalculation();
		}
		catch (err) {
			LocalError(err + '; iConnErrCount = ' + this.iConnErrCount);

			this.m_Screen.style.cursor = "not-allowed";
			this.iConnErrCount++;
			setTimeout(() => this.Connect(), 4000 +
				(this.iExponentialBackOffMillis * Math.max(this.iConnErrCount, 5))//exponential back-off
			);
		}
	}

	SetupNotifications() {
		if (!window.Notification) {
			LocalLog('Browser does not support notifications.');
			return false;
		}
		else {
			// check if permission is already granted
			if (Notification.permission === 'granted') {
				return true;
			}
			else {
				// request permission from user
				Notification.requestPermission().then(function (p) {
					if (p === 'granted') {
						return true;
					}
					else {
						LocalLog('User blocked notifications.');
						return false;
					}
				}).catch(function (err) {
					LocalError(err);
					return false;
				});
			}
		}
	}

	NotifyBrowser(title = 'Hi there!', body = 'How are you doing?') {
		if (!document.hidden)
			return false;

		if (!window.Notification) {
			LocalLog('Browser does not support notifications.');
			return false;
		}
		else {
			// check if permission is already granted
			if (Notification.permission === 'granted') {
				// show notification here
				new Notification(title, {
					body: body,
					icon: '../img/homescreen.webp'
				});
				return true;
			}
			else {
				// request permission from user
				Notification.requestPermission().then(function (p) {
					if (p === 'granted') {
						// show notification here
						new Notification(title, {
							body: body,
							icon: '../img/homescreen.webp'
						});
						return true;
					}
					else {
						LocalLog('User blocked notifications.');
						return false;
					}
				}).catch(function (err) {
					LocalError(err);
					return false;
				});
			}
		}
	}

	/**
	 * Start connection to SignalR
	 * @param {boolean} loadPointsAndPathsFromSignalR load points and path thriugh SignalR
	 */
	async StartSignalRConnection(loadPointsAndPathsFromSignalR) {
		if (this.g_SignalRConnection === null) return Promise.reject(new Error("signalr conn is null"));
		//this.m_bIsCPUGame = this.m_iOtherPlayerId === -1;
		if (false === this.m_bPointsAndPathsLoaded)
			this.m_bPointsAndPathsLoaded = !loadPointsAndPathsFromSignalR;

		this.g_SignalRConnection.on("ServerToClientPoint", async function (point) {
			if (this.g_iPlayerID !== point.iPlayerId) {
				const user = this.m_Player2Name.innerHTML;
				let encodedMsg = InkBallPointViewModel.Format(user, point);

				const li = document.createElement("li");
				li.textContent = encodedMsg;
				document.querySelector(this.m_sMsgListSel).appendChild(li);

				this.NotifyBrowser('New Point', encodedMsg);
			}
			await this.ReceivedPointProcessing(point);

		}.bind(this));

		this.g_SignalRConnection.on("ServerToClientPath", function (dto) {
			if (Object.prototype.hasOwnProperty.call(dto, 'PointsAsString') || Object.prototype.hasOwnProperty.call(dto, 'pointsAsString')) {
				let path = dto;
				if (this.g_iPlayerID !== path.iPlayerId) {
					const user = this.m_Player2Name.innerHTML;
					let encodedMsg = InkBallPathViewModel.Format(user, path);

					const li = document.createElement("li");
					li.textContent = encodedMsg;
					document.querySelector(this.m_sMsgListSel).appendChild(li);

					this.NotifyBrowser('New Path', encodedMsg);
				}
				this.ReceivedPathProcessing(path);
			}
			else if (Object.prototype.hasOwnProperty.call(dto, 'WinningPlayerId') || Object.prototype.hasOwnProperty.call(dto, 'winningPlayerId')) {
				let win = dto;
				let encodedMsg = WinCommand.Format(win);

				let li = document.createElement("li");
				li.textContent = encodedMsg;
				document.querySelector(this.m_sMsgListSel).appendChild(li);

				this.ReceivedWinProcessing(win);
				this.NotifyBrowser('We have a winner', encodedMsg);
			}
			else
				throw new Error("ServerToClientPath bad GetKind!");

		}.bind(this));

		this.g_SignalRConnection.on("ServerToClientPlayerJoin", function (join) {
			const iOtherPlayerId = join.OtherPlayerId || join.otherPlayerId;
			this.m_iOtherPlayerId = iOtherPlayerId;
			const encodedMsg = PlayerJoiningCommand.Format(join);

			let li = document.createElement("li");
			li.innerHTML = `<strong class="text-primary">${encodedMsg}</strong>`;
			document.querySelector(this.m_sMsgListSel).appendChild(li);

			if (this.m_SurrenderButton !== null) {
				if (join.OtherPlayerName !== '') {
					this.m_Player2Name.innerHTML = join.OtherPlayerName || join.otherPlayerName;
					this.m_SurrenderButton.value = 'surrender';
					this.ShowMobileStatus('Your move');
				}
			}

			this.NotifyBrowser('Player joininig', encodedMsg);

			this.m_bHandlingEvent = false;
		}.bind(this));

		this.g_SignalRConnection.on("ServerToClientPlayerSurrender", function (surrender) {

			let encodedMsg = PlayerSurrenderingCommand.Format(surrender);

			let li = document.createElement("li");
			li.innerHTML = `<strong class="text-warning">${encodedMsg}</strong>`;
			document.querySelector(this.m_sMsgListSel).appendChild(li);


			this.m_bHandlingEvent = false;
			encodedMsg = encodedMsg === '' ? 'Game interrupted!' : encodedMsg;
			this.NotifyBrowser('Game interruption', encodedMsg);
			alert(encodedMsg);
			window.location.href = "GamesList";
		}.bind(this));

		this.g_SignalRConnection.on("ServerToClientPlayerWin", function (win) {
			let encodedMsg = WinCommand.Format(win);

			let li = document.createElement("li");
			li.innerHTML = `<strong class="text-warning">${encodedMsg}</strong>`;
			document.querySelector(this.m_sMsgListSel).appendChild(li);

			this.ReceivedWinProcessing(win);
			this.NotifyBrowser('We have a winner', encodedMsg);

		}.bind(this));

		this.g_SignalRConnection.on("ServerToClientPing", function (ping) {

			const user = this.m_Player2Name.innerHTML;
			let encodedMsg = PingCommand.Format(user, ping);

			let li = document.createElement("li");
			li.textContent = encodedMsg;
			document.querySelector(this.m_sMsgListSel).appendChild(li);
			this.NotifyBrowser('User Message', encodedMsg);

		}.bind(this));

		this.g_SignalRConnection.on("ServerToClientOtherPlayerDisconnected", function (sMsg) {
			const opts = {
				countdownSeconds: 5,
				//labelSelector: "#debug2",
				initialStart: true,
				countdownReachedHandler: function () {
					let encodedMsg = sMsg;
					let li = document.createElement("li");
					li.innerHTML = `<strong class="text-warning">${encodedMsg}</strong>`;
					document.querySelector(this.m_sMsgListSel).appendChild(li);

					this.NotifyBrowser('User disconnected', encodedMsg);
					this.m_ReconnectTimer = null;
				}.bind(this)
			};
			if (this.m_ReconnectTimer)
				this.m_ReconnectTimer.Reset(opts);
			else
				this.m_ReconnectTimer = new CountdownTimer(opts);
		}.bind(this));

		this.g_SignalRConnection.on("ServerToClientOtherPlayerConnected", function (sMsg) {
			if (this.m_ReconnectTimer) {
				this.m_ReconnectTimer.Stop();
				this.m_ReconnectTimer = null;
			}
			else {
				let encodedMsg = sMsg;
				let li = document.createElement("li");
				li.innerHTML = `<strong class="text-primary">${encodedMsg}</strong>`;
				document.querySelector(this.m_sMsgListSel).appendChild(li);

				this.NotifyBrowser('User disconnected', encodedMsg);
				this.m_ReconnectTimer = null;
			}
		}.bind(this));

		this.g_SignalRConnection.on("ServerToClientStopAndDraw", function (cmd) {
			if (!cmd) return;

			const user = this.m_Player2Name.innerHTML;
			let encodedMsg = StopAndDrawCommand.Format(user);

			let li = document.createElement("li");
			li.innerHTML = `<strong class="text-info">${encodedMsg}</strong>`;
			document.querySelector(this.m_sMsgListSel).appendChild(li);

			this.NotifyBrowser('User ' + user + ' started drawing new path', encodedMsg);
		}.bind(this));

		if (false === this.m_bIsCPUGame) {
			document.querySelector(this.m_sMsgSendButtonSel).addEventListener("click", async function (event) {
				event.preventDefault();

				let encodedMsg = document.querySelector(this.m_sMsgInputSel).value.trim();
				if (encodedMsg === '') return;

				let ping = new PingCommand(encodedMsg);

				await this.SendAsyncData(ping);

			}.bind(this), false);

			// Execute a function when the user releases a key on the keyboard
			document.querySelector(this.m_sMsgInputSel).addEventListener("keyup", function (event) {
				event.preventDefault();// Cancel the default action, if needed

				if (event.keyCode === 13) {// Number 13 is the "Enter" key on the keyboard
					// Trigger the button element with a click
					document.querySelector(this.m_sMsgSendButtonSel).click();
				}
			}.bind(this), false);
		}

		return this.Connect();
	}

	StopSignalRConnection() {
		if (this.g_SignalRConnection !== null) {
			this.g_SignalRConnection.stop();

			//cleanup
			if (this.m_ReconnectTimer)
				this.m_ReconnectTimer.Stop();
			if (this.m_Timer)
				this.m_Timer.Stop();

			LocalLog('Stopped SignalR connection');
		}
	}

	Debug(...args) {
		switch (args.length) {
			case 1:
				this.m_Debug.innerHTML = args[0];
				break;
			case 2:
				{
					const d = document.getElementById('debug' + args[1]);
					d.innerHTML = args[0];
				}
				break;
			default:
				for (let i = 0; i < args.length; i++) {
					const msg = args[i];
					if (msg) {
						const d = document.getElementById('debug' + i);
						if (d)
							d.innerHTML = msg;
					}
				}
				break;
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

	async SetPoint(iX, iY, iStatus, iPlayerId) {
		if (await this.m_Points.has(iY * this.m_iGridWidth + iX))
			return;

		const x = iX * this.m_iGridSizeX;
		const y = iY * this.m_iGridSizeY;

		const oval = this.SvgVml.CreateOval(this.m_PointRadius);
		oval.move(x, y, this.m_PointRadius);

		let color;
		switch (iStatus) {
			case StatusEnum.POINT_FREE_RED:
				color = this.COLOR_RED;
				oval.SetStatus(iStatus/*StatusEnum.POINT_FREE*/);
				break;
			case StatusEnum.POINT_FREE_BLUE:
				color = this.COLOR_BLUE;
				oval.SetStatus(iStatus/*StatusEnum.POINT_FREE*/);
				break;
			case StatusEnum.POINT_FREE:
				color = this.m_sDotColor;
				oval.SetStatus(iStatus/*StatusEnum.POINT_FREE*/);
				//console.warn('TODO: generic FREE point, really? change it!');
				break;
			case StatusEnum.POINT_STARTING:
				color = this.m_sDotColor;
				oval.SetStatus(iStatus);
				break;
			case StatusEnum.POINT_IN_PATH:
				if (this.g_iPlayerID === iPlayerId)//bPlayingWithRed
					color = this.m_bIsPlayingWithRed === true ? this.COLOR_RED : this.COLOR_BLUE;
				else
					color = this.m_bIsPlayingWithRed === true ? this.COLOR_BLUE : this.COLOR_RED;
				oval.SetStatus(iStatus);
				break;
			case StatusEnum.POINT_OWNED_BY_RED:
				color = this.COLOR_OWNED_RED;
				oval.SetStatus(iStatus);
				break;
			case StatusEnum.POINT_OWNED_BY_BLUE:
				color = this.COLOR_OWNED_BLUE;
				oval.SetStatus(iStatus);
				break;
			default:
				alert('bad point');
				break;
		}

		oval.SetFillColor(color);
		oval.SetStrokeColor(color);

		await this.m_Points.set(iY * this.m_iGridWidth + iX, oval);
	}

	GetGameStateForIndexedDb() {
		return {
			iGameID: this.g_iGameID,
			iPlayerID: this.g_iPlayerID,
			iOtherPlayerId: this.m_iOtherPlayerId,
			sLastMoveGameTimeStamp: this.m_sLastMoveGameTimeStamp,
			bPointsAndPathsLoaded: this.m_bPointsAndPathsLoaded,
			iGridWidth: this.m_iGridWidth,
			iGridHeight: this.m_iGridHeight,
			iGridSizeX: this.m_iGridSizeX,
			iGridSizeY: this.m_iGridSizeY
		};
	}

	/**
	 * Callback method invoked by IndexedDb abstraction store
	 * @param {any} iX point x taken from IndexedDb
	 * @param {any} iY point y taken from IndexedDb
	 * @param {any} iStatus status taken from IndexedDb
	 * @param {any} sColor color taken from IndexedDb
	 * @returns {object} created oval/cirle
	 */
	CreateScreenPointFromIndexedDb(iX, iY, iStatus, sColor) {
		const x = iX * this.m_iGridSizeX;
		const y = iY * this.m_iGridSizeY;

		const oval = this.SvgVml.CreateOval(this.m_PointRadius);
		oval.move(x, y, this.m_PointRadius);

		let color;
		switch (iStatus) {
			case StatusEnum.POINT_FREE_RED:
				color = this.COLOR_RED;
				oval.SetStatus(iStatus/*StatusEnum.POINT_FREE*/);
				break;
			case StatusEnum.POINT_FREE_BLUE:
				color = this.COLOR_BLUE;
				oval.SetStatus(iStatus/*StatusEnum.POINT_FREE*/);
				break;
			case StatusEnum.POINT_FREE:
				color = this.m_sDotColor;
				oval.SetStatus(iStatus/*StatusEnum.POINT_FREE*/);
				//console.warn('TODO: generic FREE point, really? change it!');
				break;
			case StatusEnum.POINT_STARTING:
				color = this.m_sDotColor;
				oval.SetStatus(iStatus);
				break;
			case StatusEnum.POINT_IN_PATH:
				//if (this.g_iPlayerID === iPlayerId)//bPlayingWithRed
				//	color = this.m_bIsPlayingWithRed === true ? this.COLOR_RED : this.COLOR_BLUE;
				//else
				//	color = this.m_bIsPlayingWithRed === true ? this.COLOR_BLUE : this.COLOR_RED;
				color = sColor;
				oval.SetStatus(iStatus);
				break;
			case StatusEnum.POINT_OWNED_BY_RED:
				color = this.COLOR_OWNED_RED;
				oval.SetStatus(iStatus);
				break;
			case StatusEnum.POINT_OWNED_BY_BLUE:
				color = this.COLOR_OWNED_BLUE;
				oval.SetStatus(iStatus);
				break;
			default:
				alert('bad point');
				break;
		}

		oval.SetFillColor(color);
		oval.SetStrokeColor(color);

		return oval;
	}

	async SetAllPoints(points) {
		//Un-Minimize amount of data transported on the wire through SignalR or on the page: status field
		function DataUnMinimizerStatus(status) { return status - 3; }

		//Un-Minimize amount of data transported on the wire through SignalR or on the page: player id field
		function DataUnMinimizerPlayerId(playerId) { return playerId - 1; }

		try {
			await this.m_Points.BeginBulkStorage();

			for (const p of points) {
				await this.SetPoint(p[0]/*x*/, p[1]/*y*/, DataUnMinimizerStatus(p[2]/*Status*/), DataUnMinimizerPlayerId(p[3]/*iPlayerId*/));
			}
		}
		finally {
			await this.m_Points.EndBulkStorage();
		}
	}

	async SetPath(packed, bIsRed, bBelong2ThisPlayer, iPathId = 0) {
		const sPoints = packed.split(" ");
		let sDelimiter = "", sPathPoints = "", p = null, x, y,
			status = StatusEnum.POINT_STARTING;
		for (const pair of sPoints) {
			p = pair.split(",");
			x = parseInt(p[0]); y = parseInt(p[1]);

			p = await this.m_Points.get(y * this.m_iGridWidth + x);
			if (p !== null && p !== undefined) {
				p.SetStatus(status);
				status = StatusEnum.POINT_IN_PATH;
			}
			else {
				//debugger;
			}

			x *= this.m_iGridSizeX; y *= this.m_iGridSizeY;
			sPathPoints += `${sDelimiter}${x},${y}`;
			sDelimiter = " ";
		}
		p = sPoints[0].split(",");
		x = parseInt(p[0]); y = parseInt(p[1]);

		p = await this.m_Points.get(y * this.m_iGridWidth + x);
		if (p !== null && p !== undefined) {
			p.SetStatus(status);
		}
		else {
			//debugger;
		}

		x *= this.m_iGridSizeX; y *= this.m_iGridSizeY;
		sPathPoints += `${sDelimiter}${x},${y}`;

		const line = this.SvgVml.CreatePolyline(3, sPathPoints,
			(bBelong2ThisPlayer ? this.m_sDotColor : (bIsRed ? this.COLOR_BLUE : this.COLOR_RED)));
		line.SetID(iPathId);
		await this.m_Lines.push(line);
	}

	async CreateScreenPathFromIndexedDb(packed, sColor, iPathId) {
		const sPoints = packed.split(" ");
		let sDelimiter = "", sPathPoints = "", p = null, x, y,
			status = StatusEnum.POINT_STARTING;
		for (const pair of sPoints) {
			p = pair.split(",");
			x = parseInt(p[0]); y = parseInt(p[1]);

			p = await this.m_Points.get(y * this.m_iGridWidth + x);
			if (p !== null && p !== undefined) {
				p.SetStatus(status);
				status = StatusEnum.POINT_IN_PATH;
			}
			else {
				//debugger;
			}

			x *= this.m_iGridSizeX; y *= this.m_iGridSizeY;
			sPathPoints += `${sDelimiter}${x},${y}`;
			sDelimiter = " ";
		}
		p = sPoints[0].split(",");
		x = parseInt(p[0]); y = parseInt(p[1]);

		p = await this.m_Points.get(y * this.m_iGridWidth + x);
		if (p !== null && p !== undefined) {
			p.SetStatus(status);
		}
		else {
			//debugger;
		}

		x *= this.m_iGridSizeX; y *= this.m_iGridSizeY;
		sPathPoints += `${sDelimiter}${x},${y}`;

		const line = this.SvgVml.CreatePolyline(3, sPathPoints, sColor);
		line.SetID(iPathId);

		return line;
	}

	async SetAllPaths(packedPaths) {
		try {
			await this.m_Lines.BeginBulkStorage();

			for (const unpacked of packedPaths) {
				//const unpacked = JSON.parse(packed.Serialized);
				if (unpacked.iGameId !== this.g_iGameID)
					throw new Error("Bad game from path!");

				await this.SetPath(unpacked.PointsAsString/*points*/, this.m_bIsPlayingWithRed,
					unpacked.iPlayerId === this.g_iPlayerID/*isMainPlayerPoints*/, unpacked.iId/*real DB id*/);
			}
		}
		finally {
			await this.m_Lines.EndBulkStorage();
		}
	}

	IsPointBelongingToLine(sPoints, iX, iY) {
		for (const packed of sPoints) {
			const pnt = packed.split(",");
			const x = pnt[0], y = pnt[1];
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

	pnpoly2(pathPoints, x, y) {
		const npol = pathPoints.length;
		let i, j, c = false;

		for (i = 0, j = npol - 1; i < npol; j = i++) {
			const pi = pathPoints[i], pj = pathPoints[j];

			if ((((pi.y <= y) && (y < pj.y)) ||
				((pj.y <= y) && (y < pi.y))) &&
				(x < (pj.x - pi.x) * (y - pi.y) / (pj.y - pi.y) + pi.x))

				c = !c;
		}
		return c;
	}

	async SurroundOponentPoints() {
		const points = this.m_Line.GetPointsArray();

		//uniqe point path test (no duplicates except starting-ending point)
		const pts_not_unique = SVG.hasDuplicates(points.slice(0, -1).map(pt => pt.x + '_' + pt.y));

		if (pts_not_unique ||
			!(points[0].x === points[points.length - 1].x && points[0].y === points[points.length - 1].y)) {
			return {
				OwnedPoints: undefined,
				owned: "",
				path: "",
				errorDesc: "Points not unique"
			};
		}
		let sColor, owned_by, sOwnedCol;
		//pick right color, status and owned by status
		if (this.m_sDotColor === this.COLOR_RED) {
			sColor = this.COLOR_BLUE;
			owned_by = StatusEnum.POINT_OWNED_BY_RED;
			sOwnedCol = this.COLOR_OWNED_RED;
		}
		else {
			sColor = this.COLOR_RED;
			owned_by = StatusEnum.POINT_OWNED_BY_BLUE;
			sOwnedCol = this.COLOR_OWNED_BLUE;
		}
		let sPathPoints = "", sOwnedPoints = "", sDelimiter = "", ownedPoints = [];

		//make the test!
		for (const pt of await this.m_Points.values()) {
			if (pt !== undefined && pt.GetFillColor() === sColor &&
				([StatusEnum.POINT_FREE_BLUE, StatusEnum.POINT_FREE_RED].includes(pt.GetStatus()))) {
				let { x, y } = pt.GetPosition();
				if (false !== this.pnpoly2(points, x, y)) {
					x /= this.m_iGridSizeX; y /= this.m_iGridSizeY;
					sOwnedPoints += `${sDelimiter}${x},${y}`;
					sDelimiter = " ";
					ownedPoints.push({
						point: pt,
						revertStatus: pt.GetStatus(),
						revertFillColor: pt.GetFillColor(),
						revertStrokeColor: pt.GetStrokeColor()
					});

					pt.SetStatus(owned_by, true);
					pt.SetFillColor(sOwnedCol);
					pt.SetStrokeColor(sOwnedCol);
				}
			}
		}

		if (sOwnedPoints !== "") {
			sPathPoints = points.map(function (pt) {
				let x = pt.x, y = pt.y;
				if (x === null || y === null) return '';
				x /= this.m_iGridSizeX; y /= this.m_iGridSizeY;

				return `${x},${y}`;
			}.bind(this)).join(' ');
		}

		return {
			OwnedPoints: ownedPoints,
			owned: sOwnedPoints,
			PathPoints: [],
			path: sPathPoints,
			errorDesc: "No surrounded points"
		};
	}

	async IsPointOutsideAllPaths(x, y) {
		const xmul = x * this.m_iGridSizeX, ymul = y * this.m_iGridSizeY;

		const lines = await this.m_Lines.all();//TODO: async for
		for (const line of lines) {
			const points = line.GetPointsArray();

			if (false !== this.pnpoly2(points, xmul, ymul))
				return false;
		}

		return true;
	}

	CreateXMLWaitForPlayerRequest(/*...args*/) {
		//let cmd = new WaitForPlayerCommand((args.length > 0 && args[0] === true) ? true : false);
		//return cmd;
	}

	CreateXMLPutPointRequest(iX, iY) {
		const cmd = new InkBallPointViewModel(0, this.g_iGameID, this.g_iPlayerID, iX, iY,
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
		const cmd = new InkBallPathViewModel(0, this.g_iGameID, this.g_iPlayerID, dto.path, dto.owned
			/*, this.m_Timer !== null*/);
		return cmd;
	}

	/**
	 * Send data through signalR
	 * @param {object} payload transferrableObject (DTO)
	 * @param {function} revertFunction on-error revert/rollback function
	 */
	async SendAsyncData(payload, revertFunction = undefined) {

		switch (payload.GetKind()) {
			case CommandKindEnum.POINT:
				LocalLog(InkBallPointViewModel.Format('some player', payload));
				this.m_bHandlingEvent = true;

				try {
					const point = await this.g_SignalRConnection.invoke("ClientToServerPoint", payload);
					await this.ReceivedPointProcessing(point);
				} catch (err) {
					LocalError(err.toString());
					if (revertFunction !== undefined)
						revertFunction();
				}
				break;

			case CommandKindEnum.PATH:
				LocalLog(InkBallPathViewModel.Format('some player', payload));
				this.m_bHandlingEvent = true;

				try {
					const dto = await this.g_SignalRConnection.invoke("ClientToServerPath", payload);

					if (Object.prototype.hasOwnProperty.call(dto, 'WinningPlayerId') || Object.prototype.hasOwnProperty.call(dto, 'winningPlayerId')) {
						let win = dto;
						this.ReceivedWinProcessing(win);
					}
					else if (Object.prototype.hasOwnProperty.call(dto, 'PointsAsString') || Object.prototype.hasOwnProperty.call(dto, 'pointsAsString')) {
						let path = dto;
						await this.ReceivedPathProcessing(path);
					}
					else
						throw new Error("ClientToServerPath bad GetKind!");
				} catch (err) {
					LocalError(err.toString());
					if (revertFunction !== undefined)
						revertFunction();
				}
				break;

			case CommandKindEnum.PING:
				try {
					await this.g_SignalRConnection.invoke("ClientToServerPing", payload);
					document.querySelector(this.m_sMsgInputSel).value = '';
					document.querySelector(this.m_sMsgSendButtonSel).disabled = 'disabled';
				} catch (err) {
					LocalError(err.toString());
				}
				break;

			case CommandKindEnum.STOP_AND_DRAW:
				try {
					await this.g_SignalRConnection.invoke("ClientToServerStopAndDraw", payload);
					this.m_bDrawLines = true;
					this.m_iLastX = this.m_iLastY = -1;
					this.m_Line = null;
					this.m_bIsPlayerActive = true;
					this.m_StopAndDraw.disabled = 'disabled';

				} catch (err) {
					LocalError(err.toString());
				}
				break;

			default:
				LocalError('unknown object');
				break;
		}
	}

	CountDownReachedHandler(label) {
		if (label)
			label.innerHTML = '';
		//this.NotifyBrowser('Time is running out', 'make a move');
		this.m_StopAndDraw.disabled = this.m_CancelPath.disabled = 'disabled';
		this.m_Timer = null;
		this.m_bIsPlayerActive = false;
	}

	async ReceivedPointProcessing(point) {
		const x = point.iX, y = point.iY, iStatus = point.Status !== undefined ? point.Status : point.status;

		this.m_sLastMoveGameTimeStamp = (point.TimeStamp !== undefined ?
			point.TimeStamp : new Date(point.timeStamp)
		).toISOString();

		await this.SetPoint(x, y, iStatus, point.iPlayerId);

		if (this.g_iPlayerID !== point.iPlayerId) {
			this.m_bIsPlayerActive = true;
			this.ShowMobileStatus('Oponent has moved, your turn');
			this.m_Screen.style.cursor = "crosshair";

			if (this.m_Line !== null)
				await this.OnCancelClick();
			this.m_StopAndDraw.disabled = '';
			if (!this.m_bDrawLines)
				this.m_StopAndDraw.value = 'Draw line';
			else
				this.m_StopAndDraw.value = 'Draw dot';

			if (this.m_Timer) {
				this.m_Timer.Stop();
				this.m_Timer = null;
			}
		}
		else {
			this.m_bIsPlayerActive = false;
			this.ShowMobileStatus('Waiting for oponent move');
			this.m_Screen.style.cursor = "wait";
			this.m_CancelPath.disabled = 'disabled';
			this.m_StopAndDraw.disabled = '';
			this.m_StopAndDraw.value = 'Stop and Draw';

			if (this.m_Timer)
				this.m_Timer.Reset(this.m_TimerOpts);
			else
				this.m_Timer = new CountdownTimer(this.m_TimerOpts);

			if (true === this.m_bIsCPUGame && !this.m_bIsPlayerActive)
				this.StartCPUCalculation();
		}
		this.m_bHandlingEvent = false;
	}

	async ReceivedPathProcessing(path) {

		this.m_sLastMoveGameTimeStamp = (path.TimeStamp !== undefined ?
			path.TimeStamp : new Date(path.timeStamp)
		).toISOString();

		if (this.g_iPlayerID !== path.iPlayerId) {

			const str_path = path.PointsAsString || path.pointsAsString, owned = path.OwnedPointsAsString || path.ownedPointsAsString;

			await this.SetPath(str_path,
				(this.m_sDotColor === this.COLOR_RED ? true : false), false, path.iId/*real DB id*/);

			const points = owned.split(" ");
			const point_status = (this.m_sDotColor === this.COLOR_RED ? StatusEnum.POINT_OWNED_BY_RED : StatusEnum.POINT_OWNED_BY_BLUE);
			const sOwnedCol = (this.m_sDotColor === this.COLOR_RED ? this.COLOR_OWNED_RED : this.COLOR_OWNED_BLUE);
			for (const packed of points) {
				let p = packed.split(",");
				const x = parseInt(p[0]), y = parseInt(p[1]);
				p = await this.m_Points.get(y * this.m_iGridWidth + x);
				if (p !== undefined) {
					p.SetStatus(point_status);
					p.SetFillColor(sOwnedCol);
					p.SetStrokeColor(sOwnedCol);
				}
				else {
					//debugger;
				}
			}


			this.m_bIsPlayerActive = true;
			this.ShowMobileStatus('Oponent has moved, your turn');
			this.m_Screen.style.cursor = "crosshair";

			if (this.m_Line !== null)
				await this.OnCancelClick();
			this.m_StopAndDraw.disabled = '';
		}
		else {
			//set starting point to POINT_IN_PATH to block further path closing with it
			const points = this.m_Line.GetPointsArray();
			let x = points[0].x, y = points[0].y;
			x /= this.m_iGridSizeX; y /= this.m_iGridSizeY;
			const p0 = await this.m_Points.get(y * this.m_iGridWidth + x);
			if (p0 !== undefined)
				p0.SetStatus(StatusEnum.POINT_IN_PATH);
			else {
				//debugger;
			}

			this.m_Line.SetWidthAndColor(3, this.m_sDotColor);
			this.m_Line.SetID(path.iId);
			await this.m_Lines.push(this.m_Line);
			this.m_iLastX = this.m_iLastY = -1;
			this.m_Line = null;


			this.m_bIsPlayerActive = false;
			this.ShowMobileStatus('Waiting for oponent move');
			this.m_Screen.style.cursor = "wait";

			this.m_StopAndDraw.disabled = this.m_CancelPath.disabled = 'disabled';

			if (true === this.m_bIsCPUGame && !this.m_bIsPlayerActive)
				this.StartCPUCalculation();
		}
		if (!this.m_bDrawLines)
			this.m_StopAndDraw.value = 'Draw line';
		else
			this.m_StopAndDraw.value = 'Draw dot';
		this.m_bHandlingEvent = false;

		if (this.m_Timer) {
			this.m_Timer.Stop();
			this.m_Timer = null;
		}
	}

	ReceivedWinProcessing(win) {
		this.ShowMobileStatus('Win situation');
		this.m_bHandlingEvent = false;

		let encodedMsg = WinCommand.Format(win);
		const status = win.Status !== undefined ? win.Status : win.status;
		const winningPlayerId = win.WinningPlayerId || win.winningPlayerId;

		if (((status === WinStatusEnum.RED_WINS || status === WinStatusEnum.GREEN_WINS) && winningPlayerId > 0) ||
			status === WinStatusEnum.DRAW_WIN) {

			alert(encodedMsg === '' ? 'Game won!' : encodedMsg);
			window.location.href = "GamesList";
		}
	}

	Check4Win(playerPaths, otherPlayerPaths, playerPoints, otherPlayerPoints) {
		let owned_status, count;
		switch (this.GameType) {
			case GameTypeEnum.FIRST_CAPTURE:
				if (playerPaths.length > 0) {
					if (this.m_bIsPlayingWithRed)
						return WinStatusEnum.RED_WINS;
					else
						return WinStatusEnum.GREEN_WINS;
				}
				if (otherPlayerPaths.length > 0) {
					if (this.m_bIsPlayingWithRed)
						return WinStatusEnum.GREEN_WINS;
					else
						return WinStatusEnum.RED_WINS;
				}
				return WinStatusEnum.NO_WIN;//continue game

			case GameTypeEnum.FIRST_5_CAPTURES:
				owned_status = this.m_bIsPlayingWithRed ? StatusEnum.POINT_OWNED_BY_BLUE : StatusEnum.POINT_OWNED_BY_RED;
				count = otherPlayerPoints.filter(function (p) {
					return p.iEnclosingPathId !== null && p.GetStatus() === owned_status;
				}).length;
				if (count >= 5) {
					if (this.m_bIsPlayingWithRed)
						return WinStatusEnum.GREEN_WINS;
					else
						return WinStatusEnum.RED_WINS;
				}
				owned_status = this.m_bIsPlayingWithRed ? StatusEnum.POINT_OWNED_BY_RED : StatusEnum.POINT_OWNED_BY_BLUE;
				count = playerPoints.filter(function (p) {
					return p.iEnclosingPathId !== null && p.GetStatus() === owned_status;
				}).length;
				if (count >= 5) {
					if (this.m_bIsPlayingWithRed)
						return WinStatusEnum.RED_WINS;
					else
						return WinStatusEnum.GREEN_WINS;
				}
				return WinStatusEnum.NO_WIN;//continue game

			case GameTypeEnum.FIRST_5_PATHS:
				if (otherPlayerPaths.length >= 5) {
					if (this.m_bIsPlayingWithRed)
						return WinStatusEnum.GREEN_WINS;
					else
						return WinStatusEnum.RED_WINS;
				}
				if (playerPaths.length >= 5) {
					if (this.m_bIsPlayingWithRed)
						return WinStatusEnum.RED_WINS;
					else
						return WinStatusEnum.GREEN_WINS;
				}
				return WinStatusEnum.NO_WIN;//continue game

			case GameTypeEnum.FIRST_5_ADVANTAGE_PATHS:
				{
					const diff = playerPaths.length - otherPlayerPaths.length;
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

	async OnMouseMove(event) {
		if (!this.m_bIsPlayerActive || this.m_Player2Name.innerHTML === '???' || this.m_bHandlingEvent === true
			|| this.iConnErrCount > 0) {

			if (this.iConnErrCount <= 0 && !this.m_bIsPlayerActive) {
				this.m_Screen.style.cursor = "wait";
			}
			return;
		}


		let x = (event ? event.clientX : window.event.clientX) - this.m_Screen.offsetLeft + this.f_scrollLeft() + 0.5 * this.m_iGridSizeX;
		let y = (event ? event.clientY : window.event.clientY) - this.m_Screen.offsetTop + this.f_scrollTop() + 0.5 * this.m_iGridSizeY;

		x = parseInt(x / this.m_iGridSizeX);
		y = parseInt(y / this.m_iGridSizeY);
		let tox = x * this.m_iGridSizeX;
		let toy = y * this.m_iGridSizeY;

		if (this.CursorPos.x !== tox || this.CursorPos.y !== toy) {
			this.m_MouseCursorOval.move(tox, toy, this.m_PointRadius);
			this.m_MouseCursorOval.Show();
			this.Debug(`[${x},${y}]`, 1);
			this.CursorPos.x = tox; this.CursorPos.y = toy;
		}


		if (this.m_bDrawLines) {
			if (this.m_Line !== null)
				this.m_Screen.style.cursor = "move";
			else
				this.m_Screen.style.cursor = "crosshair";

			if (this.m_bMouseDown === true) {
				//lines
				if ((this.m_iLastX !== x || this.m_iLastY !== y) &&
					(Math.abs(parseInt(this.m_iLastX - x)) <= 1 && Math.abs(parseInt(this.m_iLastY - y)) <= 1) &&
					this.m_iLastX >= 0 && this.m_iLastY >= 0) {
					if (this.m_Line !== null) {
						let p0 = await this.m_Points.get(this.m_iLastY * this.m_iGridWidth + this.m_iLastX);
						let p1 = await this.m_Points.get(y * this.m_iGridWidth + x);
						this.m_CancelPath.disabled = this.m_Line.GetLength() >= 2 ? '' : 'disabled';

						if (p0 !== undefined && p1 !== undefined &&
							p0.GetFillColor() === this.m_sDotColor && p1.GetFillColor() === this.m_sDotColor) {
							const line_contains_point = this.m_Line.ContainsPoint(tox, toy);
							if (line_contains_point < 1 && p1.GetStatus() !== StatusEnum.POINT_STARTING &&
								true === this.m_Line.AppendPoints(tox, toy, this.m_iGridSizeX, this.m_iGridSizeY)) {
								p1.SetStatus(StatusEnum.POINT_IN_PATH, true);
								this.m_iLastX = x;
								this.m_iLastY = y;
							}
							else if (line_contains_point === 1 && p1.GetStatus() === StatusEnum.POINT_STARTING &&
								true === this.m_Line.AppendPoints(tox, toy, this.m_iGridSizeX, this.m_iGridSizeY)) {
								const val = await this.SurroundOponentPoints();
								if (val.owned.length > 0) {
									this.Debug('Closing path', 0);
									this.rAF_FrameID = null;
									await this.SendAsyncData(this.CreateXMLPutPathRequest(val), async () => {
										await this.OnCancelClick();
										val.OwnedPoints.forEach(revData => {
											const p = revData.point;
											const revertFillColor = revData.revertFillColor;
											const revertStrokeColor = revData.revertStrokeColor;
											p.RevertOldStatus();
											p.SetFillColor(revertFillColor);
											p.SetStrokeColor(revertStrokeColor);
										});
										this.m_bHandlingEvent = false;
									});
								}
								else
									this.Debug(`${val.errorDesc ? val.errorDesc : 'Wrong path'}, cancell it or refresh page`, 0);
								this.m_iLastX = x;
								this.m_iLastY = y;
							}
							else if (line_contains_point >= 1 && p0.GetStatus() === StatusEnum.POINT_IN_PATH &&
								this.m_Line.GetPointsString().endsWith(`${this.m_iLastX * this.m_iGridSizeX},${this.m_iLastY * this.m_iGridSizeY}`)) {

								if (this.m_Line.GetLength() > 2) {
									p0.RevertOldStatus();
									this.m_Line.RemoveLastPoint();
									this.m_iLastX = x;
									this.m_iLastY = y;
								}
								else
									await this.OnCancelClick();
							}
						}
					}
					else {
						let p0 = await this.m_Points.get(this.m_iLastY * this.m_iGridWidth + this.m_iLastX);
						let p1 = await this.m_Points.get(y * this.m_iGridWidth + x);

						if (p0 !== undefined && p1 !== undefined &&
							p0.GetFillColor() === this.m_sDotColor && p1.GetFillColor() === this.m_sDotColor) {
							const fromx = this.m_iLastX * this.m_iGridSizeX;
							const fromy = this.m_iLastY * this.m_iGridSizeY;
							this.m_Line = this.SvgVml.CreatePolyline(6, fromx + "," + fromy + " " + tox + "," + toy, this.DRAWING_PATH_COLOR);
							this.m_CancelPath.disabled = '';
							p0.SetStatus(StatusEnum.POINT_STARTING, true);
							p1.SetStatus(StatusEnum.POINT_IN_PATH, true);

							this.m_iLastX = x;
							this.m_iLastY = y;
						}
					}
				}
			}
		}
		else {
			this.m_Screen.style.cursor = "crosshair";
		}
	}

	async OnMouseDown(event) {
		if (!this.m_bIsPlayerActive || this.m_Player2Name.innerHTML === '???' || this.m_bHandlingEvent === true
			|| this.iConnErrCount > 0)
			return;

		let x = (event ? event.clientX : window.event.clientX) - this.m_Screen.offsetLeft + this.f_scrollLeft() + 0.5 * this.m_iGridSizeX;
		let y = (event ? event.clientY : window.event.clientY) - this.m_Screen.offsetTop + this.f_scrollTop() + 0.5 * this.m_iGridSizeY;
		x = this.m_iMouseX = parseInt(x / this.m_iGridSizeX);
		y = this.m_iMouseY = parseInt(y / this.m_iGridSizeY);

		this.m_bMouseDown = true;
		if (!this.m_bDrawLines) {
			//points
			this.m_iLastX = x;
			this.m_iLastY = y;

			const loc_x = x;
			const loc_y = y;
			x = loc_x * this.m_iGridSizeX;
			y = loc_y * this.m_iGridSizeY;

			if (await this.m_Points.get(loc_y * this.m_iGridWidth + loc_x) !== undefined) {
				this.Debug('Wrong point - already existing', 0);
				return;
			}
			if (!(await this.IsPointOutsideAllPaths(loc_x, loc_y))) {
				this.Debug('Wrong point, Point is not outside all paths', 0);
				return;
			}

			this.rAF_FrameID = null;
			await this.SendAsyncData(this.CreateXMLPutPointRequest(loc_x, loc_y), () => {
				this.m_bMouseDown = false;
				this.m_bHandlingEvent = false;
			});
		}
		else {
			//lines
			//this.Debug('m_iMouseX = '+this.m_iMouseX+' m_iMouseY = '+this.m_iMouseY, 1);
			if ( /*this.m_bMouseDown === true && */(this.m_iLastX !== x || this.m_iLastY !== y) &&
				(Math.abs(parseInt(this.m_iLastX - x)) <= 1 && Math.abs(parseInt(this.m_iLastY - y)) <= 1) &&
				this.m_iLastX >= 0 && this.m_iLastY >= 0) {
				if (this.m_Line !== null) {
					let p0 = await this.m_Points.get(this.m_iLastY * this.m_iGridWidth + this.m_iLastX);
					let p1 = await this.m_Points.get(y * this.m_iGridWidth + x);
					this.m_CancelPath.disabled = this.m_Line.GetLength() >= 2 ? '' : 'disabled';

					if (p0 !== undefined && p1 !== undefined &&
						p0.GetFillColor() === this.m_sDotColor && p1.GetFillColor() === this.m_sDotColor) {
						const tox = x * this.m_iGridSizeX;
						const toy = y * this.m_iGridSizeY;
						const line_contains_point = this.m_Line.ContainsPoint(tox, toy);
						if (line_contains_point < 1 && p1.GetStatus() !== StatusEnum.POINT_STARTING &&
							true === this.m_Line.AppendPoints(tox, toy, this.m_iGridSizeX, this.m_iGridSizeY)) {
							p1.SetStatus(StatusEnum.POINT_IN_PATH, true);
							this.m_iLastX = x;
							this.m_iLastY = y;
						}
						else if (line_contains_point === 1 && p1.GetStatus() === StatusEnum.POINT_STARTING &&
							true === this.m_Line.AppendPoints(tox, toy, this.m_iGridSizeX, this.m_iGridSizeY)) {
							const val = await this.SurroundOponentPoints();
							if (val.owned.length > 0) {
								this.Debug('Closing path', 0);
								this.rAF_FrameID = null;
								await this.SendAsyncData(this.CreateXMLPutPathRequest(val), async () => {
									await this.OnCancelClick();
									val.OwnedPoints.forEach(revData => {
										const p = revData.point;
										const revertFillColor = revData.revertFillColor;
										const revertStrokeColor = revData.revertStrokeColor;
										p.RevertOldStatus();
										p.SetFillColor(revertFillColor);
										p.SetStrokeColor(revertStrokeColor);
									});
									this.m_bMouseDown = false;
									this.m_bHandlingEvent = false;
								});
							}
							else
								this.Debug(`${val.errorDesc ? val.errorDesc : 'Wrong path'}, cancell it or refresh page`, 0);
							this.m_iLastX = x;
							this.m_iLastY = y;
						}
						else if (line_contains_point >= 1 && p0.GetStatus() === StatusEnum.POINT_IN_PATH &&
							this.m_Line.GetPointsString().endsWith(`${this.m_iLastX * this.m_iGridSizeX},${this.m_iLastY * this.m_iGridSizeY}`)) {

							if (this.m_Line.GetLength() > 2) {
								p0.RevertOldStatus();
								this.m_Line.RemoveLastPoint();
								this.m_iLastX = x;
								this.m_iLastY = y;
							}
							else
								await this.OnCancelClick();
						}
					}
				}
				else {
					let p0 = await this.m_Points.get(this.m_iLastY * this.m_iGridWidth + this.m_iLastX);
					let p1 = await this.m_Points.get(y * this.m_iGridWidth + x);

					if (p0 !== undefined && p1 !== undefined &&
						p0.GetFillColor() === this.m_sDotColor && p1.GetFillColor() === this.m_sDotColor) {
						const fromx = this.m_iLastX * this.m_iGridSizeX;
						const fromy = this.m_iLastY * this.m_iGridSizeY;
						const tox = x * this.m_iGridSizeX;
						const toy = y * this.m_iGridSizeY;
						this.m_Line = this.SvgVml.CreatePolyline(6, fromx + "," + fromy + " " + tox + "," + toy, this.DRAWING_PATH_COLOR);
						this.m_CancelPath.disabled = '';
						p0.SetStatus(StatusEnum.POINT_STARTING, true);
						p1.SetStatus(StatusEnum.POINT_IN_PATH, true);
					}
					this.m_iLastX = x;
					this.m_iLastY = y;
				}
			}
			else if (this.m_iLastX < 0 || this.m_iLastY < 0) {
				let p1 = await this.m_Points.get(y * this.m_iGridWidth + x);
				if (p1 !== undefined && p1.GetFillColor() === this.m_sDotColor) {
					this.m_iLastX = x;
					this.m_iLastY = y;
				}
			}
		}
	}

	OnMouseUp() {
		this.m_bMouseDown = false;
	}

	OnMouseLeave() {
		this.m_MouseCursorOval.Hide();
	}

	async OnStopAndDraw(event) {
		if (!this.m_Timer) {
			if (this.m_Line !== null)
				await this.OnCancelClick();
			this.m_bDrawLines = !this.m_bDrawLines;
			const btn = event.target;
			if (!this.m_bDrawLines)
				btn.value = 'Draw line';
			else
				btn.value = 'Draw dot';
			this.m_iLastX = this.m_iLastY = -1;
			this.m_Line = null;
		} else if (this.m_Line === null) {
			//send On-Stop-And-Draw notification
			await this.SendAsyncData(new StopAndDrawCommand());
		}
	}

	async OnCancelClick() {
		if (this.m_bDrawLines) {
			if (this.m_Line !== null) {
				const points = this.m_Line.GetPointsArray();
				this.m_CancelPath.disabled = 'disabled';
				for (const point of points) {
					let x = point.x, y = point.y;
					if (x === null || y === null) continue;
					x /= this.m_iGridSizeX; y /= this.m_iGridSizeY;
					const p0 = await this.m_Points.get(y * this.m_iGridWidth + x);
					if (p0 !== undefined) {
						p0.RevertOldStatus();
					}
					else {
						//debugger;
					}
				}
				this.SvgVml.RemovePolyline(this.m_Line);
				this.m_Line = null;
			}
			this.m_iLastX = this.m_iLastY = -1;

			if (this.m_Timer)
				this.m_StopAndDraw.disabled = 'disabled';

			this.Debug('', 0);
		}
	}

	/**
	 * Debug function
	 * @param {string} sSelector2Set selector where to display output
	 */
	CountPointsDebug(sSelector2Set) {
		//document.querySelector("div.user-panel.main input[z-index='-1']");
		const tags = [
			{
				query: "circle:not([z-index])",
				display: "circles: %s, "
			},
			{
				query: "polyline",
				display: "lines: %s, "
			},
			{
				query: "circle[data-status='2']",
				display: "intercepted(P1:%s, "
			},
			{
				query: "circle[data-status='3']",
				display: "P2:%s)"
			}
		];
		let aggregated = "";
		tags.forEach(function (tag) {
			const cnt = document.querySelectorAll(tag.query);
			aggregated += tag.display.replace('%s', cnt.length);
		});
		document.querySelector(sSelector2Set).innerHTML = 'SVGs by tags: ' + aggregated;
	}

	async OnTestBuildCurrentGraph(event) {
		event.preventDefault();
		LocalLog(await this.BuildGraph());
	}

	async OnTestConcaveman(event) {
		event.preventDefault();
		//LocalLog('OnTestConcaveman');

		const vertices = (await this.BuildGraph()).vertices.map(function (pt) {
			const pos = pt.GetPosition(); return [pos.x / this.m_iGridSizeX, pos.y / this.m_iGridSizeX];
		}.bind(this));

		//if (vertices && vertices.length > 0) {
		//	const convex_hull = AIBundle.concaveman(vertices, 2.0, 0.0);
		//	this.SvgVml.CreatePolyline(6, convex_hull.map(function (fnd) {
		//		return parseInt(fnd[0]) * this.m_iGridSizeX + ',' + parseInt(fnd[1]) * this.m_iGridSizeY;
		//	}.bind(this)).join(' '), 'green');
		//	LocalLog(`convex_hull = ${convex_hull}`);


		//	const mapped_verts = convex_hull.map(function (pt) {
		//		return { x: pt[0], y: pt[1] };
		//	}.bind(this));
		//	const cw_sorted_verts = SVG.sortPointsClockwise(mapped_verts);

		//	const rand_color = RandomColor();
		//	for (const vert of cw_sorted_verts) {
		//		//const { x: view_x, y: view_y } = vertices[vert].GetPosition();
		//		const { x: x, y: y } = vert;
		//		const view_x = x * this.m_iGridSizeX, view_y = y * this.m_iGridSizeY;


		//		//const line_pts = Array.from(document.querySelectorAll(`svg > line[x1="${view_x}"][y1="${view_y}"]`))
		//		//	.concat(Array.from(document.querySelectorAll(`svg > line[x2="${view_x}"][y2="${view_y}"]`)));
		//		//line_pts.forEach(line => {
		//		//	line.SetColor(rand_color);
		//		//});
		//		const pt = document.querySelector(`svg > circle[cx="${view_x}"][cy="${view_y}"]`);
		//		if (pt) {
		//			pt.SetStrokeColor(rand_color);
		//			pt.SetFillColor(rand_color);
		//			pt.SetZIndex(100);
		//			pt.setAttribute('r', "6");
		//		}
		//		await Sleep(50);
		//	}


		//}
	}

	async OnTestMarkAllCycles(event) {
		event.preventDefault();
		//LocalLog('OnTestMarkAllCycles');
		LocalLog(await this.MarkAllCycles(await this.BuildGraph({ visuals: true })));
	}

	async OnTestGroupPoints(event) {
		event.preventDefault();
		//LocalLog('OnTestGroupPoints');
		this.SvgVml.CreatePolyline(6, (await this.GroupPointsRecurse([], await this.m_Points.get(9 * this.m_iGridWidth + 26))).map(function (fnd) {
			const pt = fnd.GetPosition();
			return pt.x + ',' + pt.y;
		}).join(' '), 'green');
		LocalLog(`game.lastCycle = ${this.lastCycle}`);
	}

	async OnTestFindFullSurroundedPoints(event) {
		event.preventDefault();

		const sHumanColor = this.COLOR_RED/*, sCPUColor = this.COLOR_BLUE*/;
		const rand_color = RandomColor();
		for (const pt of await this.m_Points.values()) {
			if (pt !== undefined && pt.GetFillColor() === sHumanColor && StatusEnum.POINT_FREE_RED === pt.GetStatus()) {
				const { x: view_x, y: view_y } = pt.GetPosition();
				const x = view_x / this.m_iGridSizeX, y = view_y / this.m_iGridSizeY;
				if (false === await this.IsPointOutsideAllPaths(x, y))
					continue;


				//const east = this.m_Points.get(y * this.m_iGridWidth + x + 1);
				//const west = this.m_Points.get(y * this.m_iGridWidth + x - 1);
				//const north = this.m_Points.get((y - 1) * this.m_iGridWidth + x);
				//const south = this.m_Points.get((y + 1) * this.m_iGridWidth + x);
				//const north_west = this.m_Points.get((y - 1) * this.m_iGridWidth + x - 1);
				//const north_east = this.m_Points.get((y - 1) * this.m_iGridWidth + x + 1);
				//const south_west = this.m_Points.get((y + 1) * this.m_iGridWidth + x - 1);
				//const south_east = this.m_Points.get((y + 1) * this.m_iGridWidth + x + 1);

				//if (east !== undefined && west !== undefined && north !== undefined && south !== undefined
				//	//&& east.GetFillColor() === sCPUColor &&
				//	//west.GetFillColor() === sCPUColor &&
				//	//north.GetFillColor() === sCPUColor &&
				//	//south.GetFillColor() === sCPUColor
				//) {
				//visualise
				const pt1 = document.querySelector(`svg > circle[cx="${view_x}"][cy="${view_y}"]`);
				if (pt1) {
					pt1.SetStrokeColor(rand_color);
					pt1.SetFillColor(rand_color);
					pt1.setAttribute("r", "6");
				}
				//}
			}
		}
	}

	async OnTestWorkerify(event) {
		event.preventDefault();

		const addNums = async function (params) {
			params.state.bPointsAndPathsLoaded = false;

			// eslint-disable-next-line no-undef
			const svgVml = new SvgVml();
			svgVml.CreateSVGVML(null, null, null, true);

			let lines, points;
			// eslint-disable-next-line no-undef
			const stateStore = new GameStateStore(true,
				function CreateScreenPointFromIndexedDb(iX, iY, iStatus, sColor) {
					const x = iX * params.state.iGridSizeX;
					const y = iY * params.state.iGridSizeY;

					const oval = svgVml.CreateOval(3);
					oval.move(x, y, 3);

					let color;
					switch (iStatus) {
						case StatusEnum.POINT_FREE_RED:
							color = 'red';
							oval.SetStatus(iStatus/*StatusEnum.POINT_FREE*/);
							break;
						case StatusEnum.POINT_FREE_BLUE:
							color = 'blue';
							oval.SetStatus(iStatus/*StatusEnum.POINT_FREE*/);
							break;
						case StatusEnum.POINT_FREE:
							color = 'red';
							oval.SetStatus(iStatus/*StatusEnum.POINT_FREE*/);
							//console.warn('TODO: generic FREE point, really? change it!');
							break;
						case StatusEnum.POINT_STARTING:
							color = 'red';
							oval.SetStatus(iStatus);
							break;
						case StatusEnum.POINT_IN_PATH:
							//if (this.g_iPlayerID === iPlayerId)//bPlayingWithRed
							//	color = this.m_bIsPlayingWithRed === true ? this.COLOR_RED : this.COLOR_BLUE;
							//else
							//	color = this.m_bIsPlayingWithRed === true ? this.COLOR_BLUE : this.COLOR_RED;
							color = sColor;
							oval.SetStatus(iStatus);
							break;
						case StatusEnum.POINT_OWNED_BY_RED:
							color = '#DC143C';
							oval.SetStatus(iStatus);
							break;
						case StatusEnum.POINT_OWNED_BY_BLUE:
							color = '#8A2BE2';
							oval.SetStatus(iStatus);
							break;
						default:
							alert('bad point');
							break;
					}

					oval.SetFillColor(color);
					oval.SetStrokeColor(color);

					return oval;
				},
				async function CreateScreenPathFromIndexedDb(packed, sColor, iPathId) {
					const sPoints = packed.split(" ");
					let sDelimiter = "", sPathPoints = "", p = null, x, y,
						status = StatusEnum.POINT_STARTING;
					for (const pair of sPoints) {
						p = pair.split(",");
						x = parseInt(p[0]); y = parseInt(p[1]);

						p = await points.get(y * params.state.iGridWidth + x);
						if (p !== null && p !== undefined) {
							p.SetStatus(status);
							status = StatusEnum.POINT_IN_PATH;
						}

						x *= params.state.m_iGridSizeX; y *= params.state.m_iGridSizeY;
						sPathPoints += `${sDelimiter}${x},${y}`;
						sDelimiter = " ";
					}
					p = sPoints[0].split(",");
					x = parseInt(p[0]); y = parseInt(p[1]);

					p = await points.get(y * params.state.iGridWidth + x);
					if (p !== null && p !== undefined) {
						p.SetStatus(status);
					}

					x *= params.state.m_iGridSizeX; y *= params.state.m_iGridSizeY;
					sPathPoints += `${sDelimiter}${x},${y}`;

					const line = svgVml.CreatePolyline(3, sPathPoints, sColor);
					line.SetID(iPathId);

					return line;
				},
				function GetGameStateForIndexedDb() {
					return params.state;
				},
				LocalLog, LocalError
			);
			lines = stateStore.GetPathStore();
			points = stateStore.GetPointStore();
			await stateStore.PrepareStore();
			LocalLog(`lines.count = ${await lines.count()}, points.count = ${await points.count()}`);
			debugger;
			// eslint-disable-next-line no-undef
			const ai = new h(params.state.iGridWidth, params.state.iGridHeight, params.state.iGridSizeX, params.state.iGridSizeY,
				points, StatusEnum.POINT_STARTING, StatusEnum.POINT_IN_PATH);
			const graph = await ai.BuildGraph({ freePointStatus: StatusEnum.POINT_FREE_BLUE, fillCol: 'blue', visuals: false });
			LocalLog(graph);

			return "blah";
		};
		// Let the worker execute the above function, with the specified arguments and context
		/*const result = await addNums.callAsWorker(
			//context
			[LocalLog, LocalError, `const StatusEnum = Object.freeze({
	POINT_FREE_RED: -3,
	POINT_FREE_BLUE: -2,
	POINT_FREE: -1,
	POINT_STARTING: 0,
	POINT_IN_PATH: 1,
	POINT_OWNED_BY_RED: 2,
	POINT_OWNED_BY_BLUE: 3
});`,
				//SVG.CreateOval, SVG.CreatePolyline, SVG.RemovePolyline, SVG.CreateSVGVML, SVG.CreateLine, SVG.hasDuplicates, SVG.sortPointsClockwise,
				SVG.SvgVml, SVG.GameStateStore,
				AIBundle.GraphAI
			],
			//parameters
			{
				state: this.GetGameStateForIndexedDb()
			}
		);
		LocalLog('result: ' + result);*/

		if (!this.wrk)
			this.wrk = new Worker('../js/AIWorkerBundle.js'
				//, { type: 'module' }
			);
		this.wrk.onmessage = function (e) {
			const data = e.data;
			LocalLog('Message received from worker ' + data);
			//this.wrk.terminate();
		};
		this.wrk.postMessage({
			state: this.GetGameStateForIndexedDb()
		});


	}

	/**
	 * Start drawing routines
	 * @param {HTMLElement} sScreen screen dontainer selector
	 * @param {HTMLElement} sPlayer2Name displaying element selector
	 * @param {HTMLElement} sGameStatus game stat element selector
	 * @param {HTMLElement} sSurrenderButton surrender button element selector
	 * @param {HTMLElement} sCancelPath cancel path button element selector
	 * @param {HTMLElement} sPause pause button element selector
	 * @param {HTMLElement} sStopAndDraw stop-and-draw action button element selector
	 * @param {string} sMsgInputSel input textbox html element selector
	 * @param {string} sMsgListSel ul html element selector
	 * @param {string} sMsgSendButtonSel input button html element selector
	 * @param {string} sLastMoveGameTimeStamp is last game move timestamp date (in UTC and ISO-8601 format)
	 * @param {boolean} useIndexedDbStore indicates whether to use IndexedDb point and path Store
	 * @param {string} version is semVer string of main module (for IndexedDb DB version)
	 * @param {Array} ddlTestActions array of test actions button ids
	 * @param {number} iTooLong2Duration how long waiting is too long
	 */
	async PrepareDrawing(sScreen, sPlayer2Name, sGameStatus, sSurrenderButton, sCancelPath, sPause, sStopAndDraw, sMsgInputSel,
		sMsgListSel, sMsgSendButtonSel, sLastMoveGameTimeStamp, useIndexedDbStore, version, ddlTestActions, iTooLong2Duration = 125) {
		this.m_bIsWon = false;
		this.m_iDelayBetweenMultiCaptures = 4000;
		this.m_iTooLong2Duration = iTooLong2Duration/*125*/;
		this.m_Timer = null;
		this.m_WaitStartTime = null;
		this.m_iSlowdownLevel = 0;
		this.m_iLastX = -1;
		this.m_iLastY = -1;
		this.m_iMouseX = 0;
		this.m_iMouseY = 0;
		this.m_iPosX = 0;
		this.m_iPosY = 0;
		this.m_bMouseDown = false;
		this.m_bHandlingEvent = false;
		this.m_bDrawLines = !true;
		this.m_sMessage = '';
		this.m_sDotColor = this.m_bIsPlayingWithRed ? this.COLOR_RED : this.COLOR_BLUE;
		this.m_Line = null;
		this.m_Debug = document.getElementById('debug0');
		this.m_Player2Name = document.querySelector(sPlayer2Name);
		this.m_GameStatus = document.querySelector(sGameStatus);
		this.m_SurrenderButton = document.querySelector(sSurrenderButton);
		this.m_CancelPath = document.querySelector(sCancelPath);
		this.m_StopAndDraw = document.querySelector(sStopAndDraw);
		this.m_sMsgInputSel = sMsgInputSel;
		this.m_sMsgListSel = sMsgListSel;
		this.m_sMsgSendButtonSel = sMsgSendButtonSel;
		this.m_Screen = document.querySelector(sScreen);
		if (!this.m_Screen) {
			alert("no board");
			return;
		}
		this.m_iPosX = this.m_Screen.offsetLeft;
		this.m_iPosY = this.m_Screen.offsetTop;

		const boardsize = Array.from(this.m_Screen.classList).find(x => x.startsWith('boardsize')).split('-')[1].split('x');
		this.m_BoardSize = { width: parseInt(boardsize[0]), height: parseInt(boardsize[1]) };

		let iClientWidth = this.m_Screen.clientWidth;
		let iClientHeight = this.m_Screen.clientHeight;
		let svg_width_x_height = null;
		if (iClientHeight <= 0) { //no styles loaded case, emulating calculation with 16px font size
			iClientHeight = 16 * this.m_BoardSize.height;
			this.m_Screen.style.height = iClientHeight + 'px';
			svg_width_x_height = "100%";
		}
		this.m_iGridSizeX = parseInt(Math.ceil(iClientWidth / this.m_BoardSize.width));
		this.m_iGridSizeY = parseInt(Math.ceil(iClientHeight / this.m_BoardSize.height));
		this.m_iGridWidth = parseInt(Math.ceil(iClientWidth / this.m_iGridSizeX));
		this.m_iGridHeight = parseInt(Math.ceil(iClientHeight / this.m_iGridSizeY));
		this.m_sLastMoveGameTimeStamp = sLastMoveGameTimeStamp;
		///////CpuGame variables start//////
		this.rAF_StartTimestamp = null;
		this.rAF_FrameID = null;
		this.lastCycle = [];
		///////CpuGame variables end//////

		this.SvgVml = new SVG.SvgVml();
		if (this.SvgVml.CreateSVGVML(this.m_Screen, svg_width_x_height, svg_width_x_height, true) === null)
			alert('SVG is not supported!');

		this.DisableSelection(this.m_Screen);

		const stateStore = new SVG.GameStateStore(useIndexedDbStore,
			this.CreateScreenPointFromIndexedDb.bind(this),
			this.CreateScreenPathFromIndexedDb.bind(this),
			this.GetGameStateForIndexedDb.bind(this),
			LocalLog, LocalError,
			version);
		this.m_Lines = stateStore.GetPathStore();
		this.m_Points = stateStore.GetPointStore();
		this.m_bPointsAndPathsLoaded = await stateStore.PrepareStore();

		if (this.m_bViewOnly === false) {

			if (this.m_MouseCursorOval === null) {
				this.m_MouseCursorOval = this.SvgVml.CreateOval(this.m_PointRadius);
				this.m_MouseCursorOval.SetFillColor(this.m_sDotColor);
				this.m_MouseCursorOval.SetStrokeColor(this.m_sDotColor);
				this.m_MouseCursorOval.SetZIndex(-1);
				this.m_MouseCursorOval.Hide();
			}

			this.m_Screen.onmousedown = this.OnMouseDown.bind(this);
			this.m_Screen.onmousemove = this.OnMouseMove.bind(this);
			this.m_Screen.onmouseup = this.OnMouseUp.bind(this);
			this.m_Screen.onmouseleave = this.OnMouseLeave.bind(this);

			this.m_CancelPath.onclick = this.OnCancelClick.bind(this);
			this.m_StopAndDraw.onclick = this.OnStopAndDraw.bind(this);
			if (false === this.m_bIsCPUGame) {
				document.querySelector(this.m_sMsgInputSel).disabled = '';
				document.getElementById('testArea').textContent = '';
			}
			else {
				let i = 0;
				if (ddlTestActions.length > i)
					document.querySelector(ddlTestActions[i++]).onclick = this.OnTestBuildCurrentGraph.bind(this);
				if (ddlTestActions.length > i)
					document.querySelector(ddlTestActions[i++]).onclick = this.OnTestConcaveman.bind(this);
				if (ddlTestActions.length > i)
					document.querySelector(ddlTestActions[i++]).onclick = this.OnTestMarkAllCycles.bind(this);
				if (ddlTestActions.length > i)
					document.querySelector(ddlTestActions[i++]).onclick = this.OnTestGroupPoints.bind(this);
				if (ddlTestActions.length > i)
					document.querySelector(ddlTestActions[i++]).onclick = this.OnTestFindFullSurroundedPoints.bind(this);
				if (ddlTestActions.length > i)
					document.querySelector(ddlTestActions[i++]).onclick = this.OnTestWorkerify.bind(this);

				//disable or even delete chat functionality, coz we're not going to chat with CPU bot
				const chatSection = document.getElementById('chatSection');
				while (chatSection.lastElementChild)
					chatSection.removeChild(chatSection.lastElementChild);

				//if (!this.m_bIsPlayerActive)
				//	this.StartCPUCalculation();
			}

			this.m_SurrenderButton.disabled = '';

			if (this.m_Player2Name.innerHTML === '???') {
				this.ShowMobileStatus('Waiting for other player to connect');
				this.m_Screen.style.cursor = "wait";
			}
			else {
				this.m_SurrenderButton.value = 'surrender';

				if (this.m_bIsPlayerActive) {
					this.ShowMobileStatus('Your move');
					this.m_Screen.style.cursor = "crosshair";
					this.m_StopAndDraw.disabled = '';
				}
				else {
					this.ShowMobileStatus('Waiting for oponent move');
					this.m_Screen.style.cursor = "wait";
				}
				if (!this.m_bDrawLines)
					this.m_StopAndDraw.value = 'Draw line';
				else
					this.m_StopAndDraw.value = 'Draw dot';
			}
		}
		else {
			document.querySelector(sPause).innerHTML = 'back to Game List';
		}
	}





	///////CpuGame variables methods start//////
	/**
	 * Gets random number in range: min(inclusive) - max (exclusive)
	 * @param {any} min - from(inclusive)
	 * @param {any} max - to (exclusive)
	 * @returns {integer} random numba
	 */
	GetRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
	}

	async FindRandomCPUPoint() {
		let max_random_pick_amount = 100, x, y;
		while (--max_random_pick_amount > 0) {
			x = this.GetRandomInt(0, this.m_iGridWidth);
			y = this.GetRandomInt(0, this.m_iGridHeight);

			if (!(await this.m_Points.has(y * this.m_iGridWidth + x)) && await this.IsPointOutsideAllPaths(x, y)) {
				break;
			}
		}

		const cmd = new InkBallPointViewModel(0, this.g_iGameID, -1/*player*/, x, y, StatusEnum.POINT_FREE_BLUE, 0);
		return cmd;
	}

	async CalculateCPUCentroid() {
		let centroidX = 0, centroidY = 0, count = 0, x, y;
		const sHumanColor = this.COLOR_RED;

		for (const pt of await this.m_Points.values()) {
			if (pt !== undefined && pt.GetFillColor() === sHumanColor && pt.GetStatus() === StatusEnum.POINT_FREE_RED) {
				const pos = pt.GetPosition();
				x = pos.x; y = pos.y;
				x /= this.m_iGridSizeX; y /= this.m_iGridSizeY;

				centroidX += x; centroidY += y;
				count++;
			}
		}
		if (count <= 0)
			return null;

		x = centroidX / count;
		y = centroidY / count;
		x = x * this.m_iGridSizeX;
		y = y * this.m_iGridSizeY;
		const tox = parseInt(x / this.m_iGridSizeX);
		const toy = parseInt(y / this.m_iGridSizeY);
		x = tox; y = toy;

		let max_random_pick_amount = 20;
		while (--max_random_pick_amount > 0) {
			if (!this.m_Points.has(y * this.m_iGridWidth + x) && await this.IsPointOutsideAllPaths(x, y)) {
				break;
			}

			x = this.GetRandomInt(tox - 2, tox + 3);
			y = this.GetRandomInt(toy - 2, toy + 3);
		}
		if (max_random_pick_amount <= 0)
			return null;

		const pt = new InkBallPointViewModel(0, this.g_iGameID, -1/*player*/, x, y, StatusEnum.POINT_FREE_BLUE, 0);
		return pt;
	}

	async BuildGraph({
		freeStat: freePointStatus = StatusEnum.POINT_FREE_BLUE,
		fillCol: fillColor = this.COLOR_BLUE,
		visuals: presentVisually = true
	} = {}) {
		const graph_points = [], graph_edges = new Map();

		const isPointOKForPath = function (freePointStatusArr, pt) {
			const status = pt.GetStatus();

			if (freePointStatusArr.includes(status) && pt.GetFillColor() === fillColor)
				return true;
			return false;
		};

		const addPointsAndEdgestoGraph = async function (point, to_x, to_y, view_x, view_y, x, y) {
			if (to_x >= 0 && to_x < this.m_iGridWidth && to_y >= 0 && to_y < this.m_iGridHeight) {
				const next = await this.m_Points.get(to_y * this.m_iGridWidth + to_x);
				if (next && isPointOKForPath([freePointStatus], next) === true) {
					const next_pos = next.GetPosition();

					//const to_x = next_pos.x / this.m_iGridSizeX, to_y = next_pos.y / this.m_iGridSizeY;
					if (graph_edges.has(`${x},${y}_${to_x},${to_y}`) === false && graph_edges.has(`${to_x},${to_y}_${x},${y}`) === false) {

						const edge = {
							from: point,
							to: next
						};
						if (presentVisually === true) {
							const line = this.SvgVml.CreateLine(3, 'rgba(0, 255, 0, 0.3)');
							line.move(view_x, view_y, next_pos.x, next_pos.y);
							edge.line = line;
						}
						graph_edges.set(`${x},${y}_${to_x},${to_y}`, edge);


						if (graph_points.includes(point) === false) {
							point.adjacents = [next];
							graph_points.push(point);
						} else {
							const pt = graph_points.find(x => x === point);
							pt.adjacents.push(next);
						}
						if (graph_points.includes(next) === false) {
							next.adjacents = [point];
							graph_points.push(next);
						} else {
							const pt = graph_points.find(x => x === next);
							pt.adjacents.push(point);
						}
					}
				}
			}
		}.bind(this);

		for (const point of await this.m_Points.values()) {
			if (point && isPointOKForPath([freePointStatus, StatusEnum.POINT_STARTING, StatusEnum.POINT_IN_PATH], point) === true) {
				const { x: view_x, y: view_y } = point.GetPosition();
				const x = view_x / this.m_iGridSizeX, y = view_y / this.m_iGridSizeY;

				//TODO: await all below promises
				//east
				await addPointsAndEdgestoGraph(point, x + 1, y, view_x, view_y, x, y);
				//west
				await addPointsAndEdgestoGraph(point, x - 1, y, view_x, view_y, x, y);
				//north
				await addPointsAndEdgestoGraph(point, x, (y - 1), view_x, view_y, x, y);
				//south
				await addPointsAndEdgestoGraph(point, x, (y + 1), view_x, view_y, x, y);
				//north_west
				await addPointsAndEdgestoGraph(point, x - 1, (y - 1), view_x, view_y, x, y);
				//north_east
				await addPointsAndEdgestoGraph(point, x + 1, (y - 1), view_x, view_y, x, y);
				//south_west
				await addPointsAndEdgestoGraph(point, x - 1, (y + 1), view_x, view_y, x, y);
				//south_east
				await addPointsAndEdgestoGraph(point, x + 1, (y + 1), view_x, view_y, x, y);
			}
		}
		//return graph
		return { vertices: graph_points, edges: Array.from(graph_edges.values()) };
	}

	// Returns true if the graph contains a cycle, else false. 
	IsGraphCyclic(graph) {
		const vertices = graph.vertices;

		const isCyclicUtil = function (v, parent) {
			// Mark the current node as visited 
			v.visited = true;

			// Recur for all the vertices  
			// adjacent to this vertex
			for (let i of v.adjacents) {
				// If an adjacent is not visited,  
				// then recur for that adjacent 
				if (!i.visited) {
					if (isCyclicUtil(i, v))
						return true;
				}

				// If an adjacent is visited and  
				// not parent of current vertex, 
				// then there is a cycle. 
				else if (i !== parent) {
					const { x: view_x, y: view_y } = i.GetPosition();
					const x = view_x / this.m_iGridSizeX, y = view_y / this.m_iGridSizeY;

					LocalLog(`cycle found at ${x},${y}`);
					return true;
				}
			}
			return false;
		}.bind(this);

		// Mark all the vertices as not visited  
		// and not part of recursion stack 
		for (let i = 0; i < vertices.length; i++) {
			vertices[i].visited = false;
		}

		// Call the recursive helper function  
		// to detect cycle in different DFS trees 
		for (let u = 0; u < vertices.length; u++) {
			// Don't recur for u if already visited 
			if (!vertices[u].visited)
				if (isCyclicUtil(vertices[u], -1))
					return true;
		}

		return false;
	}

	/**
	 * Based on https://www.geeksforgeeks.org/print-all-the-cycles-in-an-undirected-graph/
	 * @param {any} graph constructed earlier with BuildGraph
	 * @returns {array} of cycles
	 */
	async MarkAllCycles(graph) {
		const vertices = graph.vertices;
		const N = vertices.length;
		let cycles = new Array(N);
		// mark with unique numbers
		const mark = new Array(N);
		// arrays required to color the 
		// graph, store the parent of node 
		const color = new Array(N), par = new Array(N);

		for (let i = 0; i < N; i++) {
			mark[i] = []; cycles[i] = [];
		}

		const dfs_cycle = async function (u, p) {
			// already (completely) visited vertex. 
			if (color[u] === 2)
				return;

			// seen vertex, but was not completely visited -> cycle detected. 
			// backtrack based on parents to find the complete cycle. 
			if (color[u] === 1) {
				cyclenumber++;
				let cur = p;
				mark[cur].push(cyclenumber);

				// backtrack the vertex which are
				// in the current cycle thats found
				while (cur !== u) {
					cur = par[cur];
					mark[cur].push(cyclenumber);
				}
				return;
			}
			par[u] = p;

			// partially visited.
			color[u] = 1;
			const vertex = vertices[u];
			if (vertex) {


				vertex.SetStrokeColor('black');
				vertex.SetFillColor('black');
				//vertex.setAttribute("r", "6");
				await Sleep(10);


				// simple dfs on graph
				for (const adj of vertex.adjacents) {
					const v = vertices.indexOf(adj);
					// if it has not been visited previously
					if (v === par[u])
						continue;

					await dfs_cycle(v, u);
				}
			}

			// completely visited. 
			color[u] = 2;
		};

		const printCycles = async function (edges, mark) {
			// push the edges that into the 
			// cycle adjacency list 
			for (let e = 0; e < edges; e++) {
				const mark_e = mark[e];
				if (mark_e !== undefined && mark_e.length > 0) {
					for (let m = 0; m < mark_e.length; m++) {
						const found_c = cycles[mark_e[m]];
						if (found_c !== undefined)
							found_c.push(e);
					}
				}
			}

			//sort by point length(only cycles >= 4): first longest cycles, most points
			cycles = cycles.filter(c => c.length >= 4).sort((b, a) => a.length - b.length);

			//gather free human player points that could be intercepted.
			const free_human_player_points = [];
			const sHumanColor = this.COLOR_RED;
			for (const pt of await this.m_Points.values()) {
				if (pt !== undefined && pt.GetFillColor() === sHumanColor && StatusEnum.POINT_FREE_RED === pt.GetStatus()) {
					const { x: view_x, y: view_y } = pt.GetPosition();
					const x = view_x / this.m_iGridSizeX, y = view_y / this.m_iGridSizeY;
					if (false === await this.IsPointOutsideAllPaths(x, y))
						continue;

					//check if really exists
					const pt1 = document.querySelector(`svg > circle[cx="${view_x}"][cy="${view_y}"]`);
					if (pt1)
						free_human_player_points.push({ x, y });
				}
			}


			const tab = [];
			// traverse through all the vertices with same cycle
			for (let i = 0; i <= cyclenumber; i++) {
				const cycl = cycles[i];//get cycle
				if (cycl && cycl.length > 0) {	//somr checks
					// Print the i-th cycle
					let str = (`Cycle Number ${i}: `), trailing_points = [];
					const rand_color = 'var(--indigo)';

					//convert to logical space
					const mapped_verts = cycl.map(function (c) {
						const pt = vertices[c].GetPosition();
						return { x: pt.x / this.m_iGridSizeX, y: pt.y / this.m_iGridSizeY };
					}.bind(this));
					//sort clockwise (https://stackoverflow.com/questions/45660743/sort-points-in-counter-clockwise-in-javascript)
					const cw_sorted_verts = SVG.sortPointsClockwise(mapped_verts);

					//display which cycle we are dealing with
					for (const vert of cw_sorted_verts) {
						const { x, y } = vert;
						const pt = document.querySelector(`svg > circle[cx="${x * this.m_iGridSizeX}"][cy="${y * this.m_iGridSizeY}"]`);
						if (pt) {//again some basic checks
							str += (`(${x},${y})`);

							pt.SetStrokeColor(rand_color);
							pt.SetFillColor(rand_color);
							pt.setAttribute("r", "6");
						}
						await Sleep(50);
					}

					//find for all free_human_player_points which cycle might interepct it (surrounds)
					//only convex, NOT concave :-(
					let tmp = '', comma = '';
					for (const possible_intercept of free_human_player_points) {
						if (false !== this.pnpoly2(cw_sorted_verts, possible_intercept.x, possible_intercept.y)) {
							tmp += `${comma}(${possible_intercept.x},${possible_intercept.y})`;

							const pt1 = document.querySelector(`svg > circle[cx="${possible_intercept.x * this.m_iGridSizeX}"][cy="${possible_intercept.y * this.m_iGridSizeY}"]`);
							if (pt1) {
								pt1.SetStrokeColor('var(--yellow)');
								pt1.SetFillColor('var(--yellow)');
								pt1.setAttribute("r", "6");
							}
							comma = ',';
						}
					}
					//gaterhing of some data and console printing
					trailing_points.unshift(str);
					tab.push(trailing_points);
					//log...
					LocalLog(str + (tmp !== '' ? ` possible intercepts: ${tmp}` : ''));
					//...and clear
					const pts2reset = Array.from(document.querySelectorAll(`svg > circle[fill="${rand_color}"][r="6"]`));
					pts2reset.forEach(pt => {
						pt.SetStrokeColor(this.COLOR_BLUE);
						pt.SetFillColor(this.COLOR_BLUE);
						pt.setAttribute("r", "4");
					});
				}
			}
			//console.log(str);
			return tab;
		}.bind(this);

		// store the numbers of cycle 
		let cyclenumber = 0, edges = N;

		// call DFS to mark the cycles 
		for (let vind = 0; vind < N; vind++) {
			await dfs_cycle(vind + 1, vind/*, color, mark, par*/);
		}

		// function to print the cycles 
		return await printCycles(edges, mark);
	}

	async GroupPointsRecurse(currPointsArr, point) {
		if (point === undefined || currPointsArr.includes(point)) {
			return currPointsArr;
		}
		if ([StatusEnum.POINT_FREE_BLUE, StatusEnum.POINT_STARTING, StatusEnum.POINT_IN_PATH].includes(point.GetStatus()) === false ||
			point.GetFillColor() !== this.COLOR_BLUE) {
			return currPointsArr;
		}

		let { x: x, y: y } = point.GetPosition();
		x /= this.m_iGridSizeX; y /= this.m_iGridSizeY;
		let last = null, last_x, last_y;
		if (currPointsArr.length > 0) {
			last = currPointsArr[currPointsArr.length - 1];
			const last_pos = last.GetPosition();
			last_x = last_pos.x, last_y = last_pos.y;
			last_x /= this.m_iGridSizeX; last_y /= this.m_iGridSizeY;
			if (Math.abs(parseInt(last_x - x)) <= 1 && Math.abs(parseInt(last_y - y)) <= 1) {
				currPointsArr.push(point);//nearby point 1 jump away
			}
			else
				return currPointsArr;//not nearby point
		}
		else
			currPointsArr.push(point);//1st starting point

		if (currPointsArr.length > 2 && last !== null) {
			const first = currPointsArr[0];
			const first_pos = first.GetPosition();
			first_pos.x /= this.m_iGridSizeX; first_pos.y /= this.m_iGridSizeY;
			last = currPointsArr[currPointsArr.length - 1];
			const last_pos = last.GetPosition();
			last_x = last_pos.x, last_y = last_pos.y;
			last_x /= this.m_iGridSizeX; last_y /= this.m_iGridSizeY;

			if (Math.abs(parseInt(last_x - first_pos.x)) <= 1 && Math.abs(parseInt(last_y - first_pos.y)) <= 1) {
				const tmp = [];
				currPointsArr.forEach((value) => tmp.push(value));
				this.lastCycle.push(tmp);
			}
		}

		//TODO: awawit all together promises
		const east = await this.m_Points.get(y * this.m_iGridWidth + x + 1);
		const west = await this.m_Points.get(y * this.m_iGridWidth + x - 1);
		const north = await this.m_Points.get((y - 1) * this.m_iGridWidth + x);
		const south = await this.m_Points.get((y + 1) * this.m_iGridWidth + x);
		const north_west = await this.m_Points.get((y - 1) * this.m_iGridWidth + x - 1);
		const north_east = await this.m_Points.get((y - 1) * this.m_iGridWidth + x + 1);
		const south_west = await this.m_Points.get((y + 1) * this.m_iGridWidth + x - 1);
		const south_east = await this.m_Points.get((y + 1) * this.m_iGridWidth + x + 1);

		if (east)
			await this.GroupPointsRecurse(currPointsArr, east);
		if (west)
			await this.GroupPointsRecurse(currPointsArr, west);
		if (north)
			await this.GroupPointsRecurse(currPointsArr, north);
		if (south)
			await this.GroupPointsRecurse(currPointsArr, south);
		if (north_west)
			await this.GroupPointsRecurse(currPointsArr, north_west);
		if (north_east)
			await this.GroupPointsRecurse(currPointsArr, north_east);
		if (south_west)
			await this.GroupPointsRecurse(currPointsArr, south_west);
		if (south_east)
			await this.GroupPointsRecurse(currPointsArr, south_east);

		return currPointsArr;
	}

	async GroupPointsIterative({
		g: graph = null
	} = {}) {
		if (!graph) return;
		const vertices = graph.vertices, cycles = [];
		let point;

		for (const start of vertices) {
			point = start;
			const currPointsArr = [];

			const traversed_path = await this.GroupPointsRecurse(currPointsArr, point);
			if (traversed_path.length > 0 && this.lastCycle.length > 0) {
				cycles.push(this.lastCycle);
				this.lastCycle = [];
			}
		}

		return cycles;
	}

	async rAFCallBack(timeStamp) {
		if (this.rAF_StartTimestamp === null) this.rAF_StartTimestamp = timeStamp;
		const progress = timeStamp - this.rAF_StartTimestamp;


		let point = null;
		const centroid = await this.CalculateCPUCentroid();
		if (centroid !== null)
			point = centroid;
		else
			point = await this.FindRandomCPUPoint();

		if (point === null) {
			if (progress < 2000)
				this.rAF_FrameID = window.requestAnimationFrame(this.rAFCallBack.bind(this));
		}
		else {
			//if (this.rAF_FrameID !== null) {
			//	window.cancelAnimationFrame(this.rAF_FrameID);
			//this.rAF_FrameID = null;
			//}

			await this.SendAsyncData(point, () => {
				this.m_bMouseDown = false;
				this.m_bHandlingEvent = false;
			});
		}
	}

	StartCPUCalculation() {
		if (this.rAF_FrameID === null)
			this.rAF_FrameID = window.requestAnimationFrame(this.rAFCallBack.bind(this));
	}
	///////CpuGame variables methods end//////
}
/******** /funcs-n-classes ********/




/******** run code and events ********/
window.addEventListener('load', async function () {
	//const gameOptions = this.window.gameOptions;

	const inkBallHubName = gameOptions.inkBallHubName;
	const iGameID = gameOptions.iGameID;
	document.getElementById('gameID').innerHTML = iGameID;
	document.querySelector(".container.inkgame form > input[type='hidden'][name='GameID']").value = iGameID;
	const iPlayerID = gameOptions.iPlayerID;
	const iOtherPlayerID = gameOptions.iOtherPlayerID;
	document.getElementById('playerID').innerHTML = iPlayerID;
	const bPlayingWithRed = gameOptions.bPlayingWithRed;
	const bPlayerActive = gameOptions.bPlayerActive;
	const gameType = gameOptions.gameType;
	const protocol = gameOptions.protocol;
	const servTimeoutMillis = gameOptions.servTimeoutMillis;
	const isReadonly = gameOptions.isReadonly;
	const pathAfterPointDrawAllowanceSecAmount = gameOptions.pathAfterPointDrawAllowanceSecAmount;
	const sLastMoveTimeStampUtcIso = new Date(gameOptions.sLastMoveGameTimeStamp).toISOString();
	const version = gameOptions.version;

	await importAllModulesAsync(gameOptions);

	const game = new InkBallGame(iGameID, iPlayerID, iOtherPlayerID, inkBallHubName, signalR.LogLevel.Warning, protocol,
		signalR.HttpTransportType.None, servTimeoutMillis,
		gameType, bPlayingWithRed, bPlayerActive, isReadonly, pathAfterPointDrawAllowanceSecAmount
	);
	await game.PrepareDrawing('#screen', '#Player2Name', '#gameStatus', '#SurrenderButton', '#CancelPath', '#Pause', '#StopAndDraw',
		'#messageInput', '#messagesList', '#sendButton', sLastMoveTimeStampUtcIso, gameOptions.PointsAsJavaScriptArray === null, version,
		['#TestBuildGraph', '#TestConcaveman', '#TestMarkAllCycles', '#TestGroupPoints', '#TestFindFullSurroundedPoints', '#TestWorkerify']);

	if (gameOptions.PointsAsJavaScriptArray !== null) {
		await game.StartSignalRConnection(false);
		await game.SetAllPoints(gameOptions.PointsAsJavaScriptArray);
		await game.SetAllPaths(gameOptions.PathsAsJavaScriptArray);
	}
	else {
		await game.StartSignalRConnection(true);
	}
	//alert('a QQ');
	document.getElementsByClassName('whichColor')[0].style.color = bPlayingWithRed ? "red" : "blue";
	game.CountPointsDebug("#debug2");

	delete window.gameOptions;
	window.game = game;
});

window.addEventListener('beforeunload', function () {
	if (window.game)
		window.game.StopSignalRConnection();
});
/******** /run code and events ********/

//export { InkBallGame };
