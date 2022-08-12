/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "InkBallGame" }]*/
/*global signalR*/
"use strict";

let SHRD, LocalLog, LocalError, StatusEnum, hasDuplicates, pnpoly2, sortPointsClockwise, Sleep, depthFirstSearch;

/******** funcs-n-classes ********/
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
			this.label.textContent = this.pad(parseInt(this.totalSeconds / 60)) +
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
			this.label.textContent = '';
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
	const selfFileName = Array.prototype.slice.call(document.getElementsByTagName('script'))
		.map(x => x.src).find(s => s.indexOf('inkball') !== -1).split('/').pop();
	const isMinified = selfFileName.indexOf("min") !== -1;

	if (isMinified)
		SHRD = await import(/* webpackChunkName: "shared.Min" */'./shared.min.js');
	else
		SHRD = await import(/* webpackChunkName: "shared" */'./shared.js');
	LocalLog = SHRD.LocalLog, LocalError = SHRD.LocalError, StatusEnum = SHRD.StatusEnum,
		hasDuplicates = SHRD.hasDuplicates, pnpoly2 = SHRD.pnpoly2, sortPointsClockwise = SHRD.sortPointsClockwise,
		Sleep = SHRD.Sleep;

	//for CPU game enable AI libs and calculations
	if (gameOptions.iOtherPlayerID === -1) {
		// AIBundle = await import(/* webpackChunkName: "AIDeps" */'./AIBundle.js');

		// import depthFirstSearch from "./depthFirstSearch.js";
		const module = await import("./depthFirstSearch.js");
		depthFirstSearch = module.default;
	}
}

function RandomColor() {
	//return 'var(--bs-orange)';
	return '#' + Math.floor(Math.random() * 16777215).toString(16);
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
		this.COLOR_RED = 'var(--redish)';
		this.COLOR_BLUE = 'var(--bluish)';
		this.COLOR_OWNED_RED = 'var(--owned_by_red)';
		this.COLOR_OWNED_BLUE = 'var(--owned_by_blue)';
		this.DRAWING_PATH_COLOR = "var(--path_draw)";
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
		this.m_iGridWidth = 0;
		this.m_iGridHeight = 0;
		this.m_iGridSpacingX = 0;
		this.m_iGridSpacingY = 0;
		// this.m_PointRadius = "var(--point_radius)";
		this.m_LineStrokeWidth = 0;
		this.m_iLastX = -1;
		this.m_iLastY = -1;
		this.m_iMouseX = 0;
		this.m_iMouseY = 0;
		this.m_iPosX = 0;
		this.m_iPosY = 0;
		this.m_Screen = null;
		this.m_Debug = null;
		this.m_Player1Name = null;
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
		this.SvgVml = null;
		this.m_Line = null;
		this.m_Lines = null;
		this.m_Points = null;
		this.m_bViewOnly = bViewOnly;
		this.m_MouseCursorOval = null;
		this.CursorPos = { x: -1, y: -1 };
		this.m_ApplicationUserSettings = null;
		this.m_sLastMoveGameTimeStamp = null;
		this.m_sVersion = null;
		this.m_Worker = null;

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
		if (!document.hidden || this?.m_ApplicationUserSettings?.DesktopNotifications !== true)
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
				const user = this.m_bIsPlayingWithRed ? this.m_Player2Name.textContent : this.m_Player1Name.textContent;
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
					const user = this.m_bIsPlayingWithRed ? this.m_Player2Name.textContent : this.m_Player1Name.textContent;
					const encodedMsg = InkBallPathViewModel.Format(user, path);

					const li = document.createElement("li");
					li.textContent = encodedMsg;
					document.querySelector(this.m_sMsgListSel).appendChild(li);

					this.NotifyBrowser('New Path', encodedMsg);
				}
				this.ReceivedPathProcessing(path);
			}
			else if (Object.prototype.hasOwnProperty.call(dto, 'WinningPlayerId') || Object.prototype.hasOwnProperty.call(dto, 'winningPlayerId')) {
				let win = dto;
				const encodedMsg = WinCommand.Format(win);

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

			document.querySelector('.msgchat').dataset.otherplayerid = iOtherPlayerId;

			const li = document.createElement("li");
			const strong = document.createElement("strong");
			strong.classList.add('text-primary');
			strong.textContent = encodedMsg;
			li.appendChild(strong);
			document.querySelector(this.m_sMsgListSel).appendChild(li);

			if (this.m_SurrenderButton !== null) {
				if (join.OtherPlayerName !== '') {
					this.m_Player2Name.textContent = join.OtherPlayerName || join.otherPlayerName;
					this.m_SurrenderButton.value = 'surrender';
					this.ShowStatus('Your move');
				}
			}

			this.NotifyBrowser('Player joininig', encodedMsg);

			this.m_bHandlingEvent = false;
		}.bind(this));

		this.g_SignalRConnection.on("ServerToClientPlayerSurrender", function (surrender) {

			let encodedMsg = PlayerSurrenderingCommand.Format(surrender);

			const li = document.createElement("li");
			const strong = document.createElement("strong");
			strong.classList.add('text-warning');
			strong.textContent = encodedMsg;
			li.appendChild(strong);
			document.querySelector(this.m_sMsgListSel).appendChild(li);


			this.m_bHandlingEvent = false;
			encodedMsg = encodedMsg === '' ? 'Game interrupted!' : encodedMsg;
			this.NotifyBrowser('Game interruption', encodedMsg);
			SHRD.LocalAlert(encodedMsg, 'Game interruption', () => {
				window.location.href = "GamesList";
			});
		}.bind(this));

		this.g_SignalRConnection.on("ServerToClientPlayerWin", function (win) {
			const encodedMsg = WinCommand.Format(win);

			const msg_lst = document.querySelector(this.m_sMsgListSel);
			if (msg_lst !== null) {
				const li = document.createElement("li");
				const strong = document.createElement("strong");
				strong.classList.add('text-warning');
				strong.textContent = encodedMsg;
				li.appendChild(strong);
				msg_lst.appendChild(li);
			}

			this.ReceivedWinProcessing(win);
			this.NotifyBrowser('We have a winner', encodedMsg);

		}.bind(this));

		this.g_SignalRConnection.on("ServerToClientPing", function (ping) {
			const user = this.m_bIsPlayingWithRed ? this.m_Player2Name.textContent : this.m_Player1Name.textContent;
			const encodedMsg = PingCommand.Format(user, ping);

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
					const encodedMsg = sMsg;
					const li = document.createElement("li");
					const strong = document.createElement("strong");
					strong.classList.add('text-warning');
					strong.textContent = encodedMsg;
					li.appendChild(strong);
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
				const encodedMsg = sMsg;
				const li = document.createElement("li");
				const strong = document.createElement("strong");
				strong.classList.add('text-primary');
				strong.textContent = encodedMsg;
				li.appendChild(strong);
				document.querySelector(this.m_sMsgListSel).appendChild(li);

				this.NotifyBrowser('User connected', encodedMsg);
				this.m_ReconnectTimer = null;
			}
		}.bind(this));

		this.g_SignalRConnection.on("ServerToClientStopAndDraw", function (cmd) {
			if (!cmd) return;

			const user = this.m_bIsPlayingWithRed ? this.m_Player2Name.textContent : this.m_Player1Name.textContent;
			const encodedMsg = StopAndDrawCommand.Format(user);

			const li = document.createElement("li");
			const strong = document.createElement("strong");
			strong.classList.add('text-info');
			strong.textContent = encodedMsg;
			li.appendChild(strong);
			document.querySelector(this.m_sMsgListSel).appendChild(li);

			this.NotifyBrowser('User ' + user + ' started drawing new path', encodedMsg);
		}.bind(this));

		if (false === this.m_bIsCPUGame) {
			document.querySelector(this.m_sMsgSendButtonSel).addEventListener("click", async function (event) {
				event.preventDefault();

				const encodedMsg = document.querySelector(this.m_sMsgInputSel).value.trim();
				if (encodedMsg === '') return;

				let ping = new PingCommand(encodedMsg);

				await this.SendData(ping);

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
				this.m_Debug.textContent = args[0];
				break;
			case 2:
				{
					const d = document.getElementById('debug' + args[1]);
					d.textContent = args[0];
				}
				break;
			default:
				for (let i = 0; i < args.length; i++) {
					const msg = args[i];
					if (msg) {
						const d = document.getElementById('debug' + i);
						if (d)
							d.textContent = msg;
					}
				}
				break;
		}
	}

	async SetPoint(iX, iY, iStatus, iPlayerId) {
		if (await this.m_Points.has(iY * this.m_iGridWidth + iX))
			return;

		const x = iX;
		const y = iY;

		const oval = this.SvgVml.CreateOval(/* this.m_PointRadius */);
		oval.move(x, y);

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
				if (this.g_iPlayerID === iPlayerId)//is this point mine?
					color = this.m_bIsPlayingWithRed === true ? this.COLOR_RED : this.COLOR_BLUE;
				else
					color = this.m_bIsPlayingWithRed === true ? this.COLOR_BLUE : this.COLOR_RED;
				// oval.SetFillColor(color);
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
		// oval.SetStrokeColor(color);

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
			iGridHeight: this.m_iGridHeight
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
		const x = iX;
		const y = iY;

		const oval = this.SvgVml.CreateOval(/* this.m_PointRadius */);
		oval.move(x, y);

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
		// oval.SetStrokeColor(color);

		return oval;
	}

	async SetAllPoints(points) {
		//Un-Minimize amount of data transported on the wire through SignalR or on the page: status field
		function DataUnMinimizerStatus(status) { return status - 3; }

		//Un-Minimize amount of data transported on the wire through SignalR or on the page: player id field
		function DataUnMinimizerPlayerId(playerId) { return playerId - 1; }

		try {
			await this.m_Points.BeginBulkStorage();

			for (const [x, y, Status, iPlayerId] of points) {
				await this.SetPoint(x, y, DataUnMinimizerStatus(Status), DataUnMinimizerPlayerId(iPlayerId));
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

			sPathPoints += `${sDelimiter}${x},${y}`;
			sDelimiter = " ";
		}
		p = sPoints[0].split(",");
		x = parseInt(p[0]); y = parseInt(p[1]);

		p = await this.m_Points.get(y * this.m_iGridWidth + x);
		if (p !== null && p !== undefined) {
			p.SetStatus(status);
		}

		if (sPoints[0] !== sPoints.at(-1)) {
			sPathPoints += `${sDelimiter}${x},${y}`;
		}

		const line = this.SvgVml.CreatePolyline(sPathPoints,
			(bBelong2ThisPlayer ? this.m_sDotColor : (bIsRed ? this.COLOR_BLUE : this.COLOR_RED))
			/* ,this.m_LineStrokeWidth */);
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

			sPathPoints += `${sDelimiter}${x},${y}`;
			sDelimiter = " ";
		}
		p = sPoints[0].split(",");
		x = parseInt(p[0]); y = parseInt(p[1]);

		p = await this.m_Points.get(y * this.m_iGridWidth + x);
		if (p !== null && p !== undefined) {
			p.SetStatus(status);
		}

		if (sPoints[0] !== sPoints.at(-1)) {
			sPathPoints += `${sDelimiter}${x},${y}`;
		}

		const line = this.SvgVml.CreatePolyline(sPathPoints, sColor/* , this.m_LineStrokeWidth */);
		line.SetID(iPathId);

		return line;
	}

	async SetAllPaths(packedPaths) {
		try {
			await this.m_Lines.BeginBulkStorage();

			for (const unpacked of packedPaths) {
				//const unpacked = JSON.parse(packed.Serialized);
				//if (unpacked.iGameId !== this.g_iGameID)
				//	throw new Error("Bad game from path!");

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
			const [x, y] = packed.split(",");
			if (x === iX && y === iY)
				return true;
		}
		return false;
	}

	async SurroundOponentPoints() {
		const points = this.m_Line.GetPointsArray();

		//uniqe point path test (no duplicates except starting-ending point)
		const pts_not_unique = hasDuplicates(points.slice(0, -1).map(pt => pt.x + '_' + pt.y));

		if (pts_not_unique ||
			!(points[0].x === points.at(-1).x && points[0].y === points.at(-1).y)) {
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
				const { x, y } = pt.GetPosition();
				if (false !== pnpoly2(points, x, y)) {
					sOwnedPoints += `${sDelimiter}${x},${y}`;
					sDelimiter = " ";
					ownedPoints.push({
						point: pt,
						revertStatus: pt.GetStatus(),
						revertFillColor: pt.GetFillColor()
						//, revertStrokeColor: pt.GetStrokeColor()
					});

					pt.SetStatus(owned_by, true);
					pt.SetFillColor(sOwnedCol);
					// pt.SetStrokeColor(sOwnedCol);
				}
			}
		}

		if (sOwnedPoints !== "") {
			sPathPoints = points.map(function (pt) {
				const x = pt.x, y = pt.y;
				if (x === null || y === null) return '';

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

	async IsPointOutsideAllPaths(x, y, allLines = undefined) {
		if (allLines === undefined)
			allLines = await this.m_Lines.all();//TODO: async for
		for (const line of allLines) {
			const points = line.GetPointsArray();

			if (false !== pnpoly2(points, x, y))
				return false;
		}

		return true;
	}

	CreateWaitForPlayerRequest(/*...args*/) {
		//let cmd = new WaitForPlayerCommand((args.length > 0 && args[0] === true) ? true : false);
		//return cmd;
	}

	CreatePutPointRequest(iX, iY) {
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
	CreatePutPathRequest(dto) {
		const cmd = new InkBallPathViewModel(0, this.g_iGameID, this.g_iPlayerID, dto.path, dto.owned
			/*, this.m_Timer !== null*/);
		return cmd;
	}

	/**
	 * Send data through signalR
	 * @param {object} payload transferrableObject (DTO)
	 * @param {function} revertFunction on-error revert/rollback function
	 */
	async SendData(payload, revertFunction = undefined) {

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
			label.textContent = '';
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
			this.ShowStatus('Oponent has moved, your turn');
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
			this.ShowStatus('Waiting for oponent move');
			this.m_Screen.style.cursor = "wait";
			this.m_MouseCursorOval.Hide();
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
				let [x, y] = packed.split(",");
				x = parseInt(x), y = parseInt(y);
				const p = await this.m_Points.get(y * this.m_iGridWidth + x);
				if (p !== undefined) {
					p.SetStatus(point_status);
					p.SetFillColor(sOwnedCol);
					// p.SetStrokeColor(sOwnedCol);
					await this.m_Points.set(y * this.m_iGridWidth + x, p);//update the point with new state,col etc.
				}
			}


			this.m_bIsPlayerActive = true;
			this.ShowStatus('Oponent has moved, your turn');
			this.m_Screen.style.cursor = "crosshair";
			this.m_MouseCursorOval.Hide();

			if (this.m_Line !== null)
				await this.OnCancelClick();
			this.m_StopAndDraw.disabled = '';
		}
		else {
			//set starting point to POINT_IN_PATH to block further path closing with it
			let points = this.m_Line.GetPointsArray();
			let x = points[0].x, y = points[0].y;
			const p0 = await this.m_Points.get(y * this.m_iGridWidth + x);
			if (p0 !== undefined)
				p0.SetStatus(StatusEnum.POINT_IN_PATH);

			this.m_Line.SetWidthAndColor(this.m_LineStrokeWidth, this.m_sDotColor);
			this.m_Line.SetID(path.iId);
			await this.m_Lines.push(this.m_Line);
			this.m_iLastX = this.m_iLastY = -1;
			this.m_Line = null;

			const owned = path.OwnedPointsAsString || path.ownedPointsAsString;
			points = owned.split(" ");
			const point_status = (this.m_sDotColor === this.COLOR_RED ? StatusEnum.POINT_OWNED_BY_RED : StatusEnum.POINT_OWNED_BY_BLUE);
			const sOwnedCol = (this.m_sDotColor === this.COLOR_RED ? this.COLOR_OWNED_RED : this.COLOR_OWNED_BLUE);
			for (const packed of points) {
				let [x, y] = packed.split(",");
				x = parseInt(x), y = parseInt(y);
				const p = await this.m_Points.get(y * this.m_iGridWidth + x);
				if (p !== undefined) {
					p.SetStatus(point_status);
					p.SetFillColor(sOwnedCol);
					// p.SetStrokeColor(sOwnedCol);
					await this.m_Points.set(y * this.m_iGridWidth + x, p);//update the point with new state,col etc.
				}
			}


			this.m_bIsPlayerActive = false;
			this.ShowStatus('Waiting for oponent move');
			this.m_Screen.style.cursor = "wait";
			this.m_MouseCursorOval.Hide();

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
		this.ShowStatus('Win situation');
		this.m_bHandlingEvent = false;

		const encodedMsg = WinCommand.Format(win);
		const status = win.Status !== undefined ? win.Status : win.status;
		const winningPlayerId = win.WinningPlayerId || win.winningPlayerId;

		if (((status === WinStatusEnum.RED_WINS || status === WinStatusEnum.GREEN_WINS) && winningPlayerId > 0) ||
			status === WinStatusEnum.DRAW_WIN) {

			SHRD.LocalAlert(encodedMsg === '' ? 'Game won!' : encodedMsg, 'Win situation', () => {
				window.location.href = "GamesList";
			});
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

	ShowStatus(sMessage = '') {
		if (this.m_Player2Name.textContent === '???') {
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
		if (!this.m_bIsPlayerActive || this.m_Player2Name.textContent === '???' || this.m_bHandlingEvent === true
			|| this.iConnErrCount > 0) {

			if (this.iConnErrCount <= 0 && !this.m_bIsPlayerActive) {
				this.m_Screen.style.cursor = "wait";
			}
			return;
		}

		const cursor = this.SvgVml.ToCursorPoint(event.clientX, event.clientY);
		let x = cursor.x + 0.5;
		let y = cursor.y + 0.5;

		x = parseInt(x);
		y = parseInt(y);

		let tox = x;
		let toy = y;

		if (this.CursorPos.x !== tox || this.CursorPos.y !== toy) {
			this.m_MouseCursorOval.move(tox, toy);
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
								true === this.m_Line.AppendPoints(tox, toy)) {
								p1.SetStatus(StatusEnum.POINT_IN_PATH, true);
								this.m_iLastX = x;
								this.m_iLastY = y;
							}
							else if (line_contains_point === 1 && p1.GetStatus() === StatusEnum.POINT_STARTING &&
								true === this.m_Line.AppendPoints(tox, toy)) {
								const val = await this.SurroundOponentPoints();
								if (val.owned.length > 0) {
									this.Debug('Closing path', 0);
									this.rAF_FrameID = null;
									await this.SendData(this.CreatePutPathRequest(val), async () => {
										await this.OnCancelClick();
										val.OwnedPoints.forEach(revData => {
											const p = revData.point;
											p.RevertOldStatus();
											p.SetFillColor(revData.revertFillColor);
											// p.SetStrokeColor(revData.revertStrokeColor);
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
								this.m_Line.GetPointsString().endsWith(`${this.m_iLastX},${this.m_iLastY}`)) {

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
							const fromx = this.m_iLastX;
							const fromy = this.m_iLastY;
							this.m_Line = this.SvgVml.CreatePolyline(`${fromx},${fromy} ${tox},${toy}`, this.DRAWING_PATH_COLOR
								/* , this.m_LineStrokeWidth * 2 */);
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
		if (!this.m_bIsPlayerActive || this.m_Player2Name.textContent === '???' || this.m_bHandlingEvent === true
			|| this.iConnErrCount > 0)
			return;

		const cursor = this.SvgVml.ToCursorPoint(event.clientX, event.clientY);
		let x = cursor.x + 0.5;
		let y = cursor.y + 0.5;

		x = this.m_iMouseX = parseInt(x);
		y = this.m_iMouseY = parseInt(y);

		this.m_bMouseDown = true;
		if (!this.m_bDrawLines) {
			//points
			this.m_iLastX = x;
			this.m_iLastY = y;

			const loc_x = x;
			const loc_y = y;

			if (await this.m_Points.get(loc_y * this.m_iGridWidth + loc_x) !== undefined) {
				this.Debug('Wrong point - already existing', 0);
				return;
			}
			if (!(await this.IsPointOutsideAllPaths(loc_x, loc_y))) {
				this.Debug('Wrong point, Point is not outside all paths', 0);
				return;
			}

			this.rAF_FrameID = null;
			await this.SendData(this.CreatePutPointRequest(loc_x, loc_y), () => {
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
						const tox = x;
						const toy = y;
						const line_contains_point = this.m_Line.ContainsPoint(tox, toy);
						if (line_contains_point < 1 && p1.GetStatus() !== StatusEnum.POINT_STARTING &&
							true === this.m_Line.AppendPoints(tox, toy)) {
							p1.SetStatus(StatusEnum.POINT_IN_PATH, true);
							this.m_iLastX = x;
							this.m_iLastY = y;
						}
						else if (line_contains_point === 1 && p1.GetStatus() === StatusEnum.POINT_STARTING &&
							true === this.m_Line.AppendPoints(tox, toy)) {
							const val = await this.SurroundOponentPoints();
							if (val.owned.length > 0) {
								this.Debug('Closing path', 0);
								this.rAF_FrameID = null;
								await this.SendData(this.CreatePutPathRequest(val), async () => {
									await this.OnCancelClick();
									val.OwnedPoints.forEach(revData => {
										const p = revData.point;
										p.RevertOldStatus();
										p.SetFillColor(revData.revertFillColor);
										// p.SetStrokeColor(revData.revertStrokeColor);
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
							this.m_Line.GetPointsString().endsWith(`${this.m_iLastX},${this.m_iLastY}`)) {

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
						const fromx = this.m_iLastX;
						const fromy = this.m_iLastY;
						const tox = x;
						const toy = y;
						this.m_Line = this.SvgVml.CreatePolyline(`${fromx},${fromy} ${tox},${toy}`, this.DRAWING_PATH_COLOR
							/* , this.m_LineStrokeWidth * 2 */);
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
			await this.SendData(new StopAndDrawCommand());
		}
	}

	async OnCancelClick() {
		if (this.m_bDrawLines) {
			if (this.m_Line !== null) {
				const points = this.m_Line.GetPointsArray();
				this.m_CancelPath.disabled = 'disabled';
				for (const point of points) {
					const { x, y } = point;
					if (x === null || y === null) continue;
					const p0 = await this.m_Points.get(y * this.m_iGridWidth + x);
					if (p0 !== undefined) {
						p0.RevertOldStatus();
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
				query: "circle[data-status='POINT_OWNED_BY_RED']",
				display: "intercepted(P1:%s, "
			},
			{
				query: "circle[data-status='POINT_OWNED_BY_BLUE']",
				display: "P2:%s)"
			}
		];
		let aggregated = "";
		tags.forEach(function (tag) {
			const cnt = document.querySelectorAll(tag.query);
			aggregated += tag.display.replace('%s', cnt.length);
		});
		document.querySelector(sSelector2Set).textContent = 'SVGs by tags: ' + aggregated;
	}

	/**
	 * Worker entry point - asynced version
	 * @param {any} setupFunction - init params callback to be given a worker as 1st param
	 */
	async RunAIWorker(setupFunction) {
		return new Promise((resolve, reject) => {
			this.m_Worker = this.m_Worker ?? new Worker('../js/AIWorker.Bundle.js'
				//, { type: 'module' }
			);

			this.m_Worker.onerror = function () {
				this.m_Worker.terminate();
				this.m_Worker = null;
				reject(new Error('no data'));
			};

			this.m_Worker.onmessage = function (e) {
				const data = e.data;
				switch (data.operation) {
					case "BUILD_GRAPH":
					case "CONCAVEMAN":
					case "MARK_ALL_CYCLES":
						//worker.terminate();
						resolve(data);
						break;
					default:
						LocalError(`unknown params.operation = ${data.operation}`);
						//worker.terminate();
						reject(new Error(`unknown params.operation = ${data.operation}`));
						break;
				}
			};

			if (setupFunction)
				setupFunction(this.m_Worker);
		});//primise end
	}

	async OnTestBuildCurrentGraph(event) {
		event.preventDefault();
		//LocalLog(await this.BuildGraph());
		const data = await this.RunAIWorker((worker) => {
			const serialized_points = Array.from(this.m_Points.store.entries()).map(([key, value]) => ({ key, value: value.Serialize() }));
			const serialized_paths = this.m_Lines.store.map(pa => pa.Serialize());

			worker.postMessage({
				operation: "BUILD_GRAPH",
				boardSize: { iGridWidth: this.m_iGridWidth, iGridHeight: this.m_iGridHeight },
				state: this.GetGameStateForIndexedDb(),
				points: serialized_points,
				paths: serialized_paths
			});
		});
		LocalLog('Message received from worker:');
		LocalLog(data);
	}

	async OnTestConcaveman(event) {
		event.preventDefault();

		const data = await this.RunAIWorker((worker) => {
			const serialized_points = Array.from(this.m_Points.store.entries()).map(([key, value]) => ({ key, value: value.Serialize() }));
			//const serialized_paths = this.m_Lines.store.map(pa => pa.Serialize());

			worker.postMessage({
				operation: "CONCAVEMAN",
				boardSize: { iGridWidth: this.m_iGridWidth, iGridHeight: this.m_iGridHeight },
				state: this.GetGameStateForIndexedDb(),
				points: serialized_points
			});
		});
		if (data.convex_hull && data.convex_hull.length > 0) {
			const convex_hull = data.convex_hull;
			this.SvgVml.CreatePolyline(convex_hull.map(([x, y]) =>
				parseInt(x) + ',' + parseInt(y))
				.join(' '), 'green'/* , this.m_LineStrokeWidth * 2 */);
			LocalLog(`convex_hull = ${convex_hull}`);

			const cw_sorted_verts = data.cw_sorted_verts;

			const rand_color = RandomColor();
			for (const vert of cw_sorted_verts) {
				const { x, y } = vert;
				const pt = document.querySelector(`svg > circle[cx="${x}"][cy="${y}"]`);
				if (pt) {
					pt.SetStrokeColor(rand_color);
					pt.SetFillColor(rand_color);
					pt.SetZIndex(100);
					pt.setAttribute("r", 6 / this.m_iGridSpacingX);
				}
				await Sleep(50);
			}
		}
	}

	async OnTestMarkAllCycles(event) {
		event.preventDefault();
		// const data = await this.RunAIWorker((worker) => {
		// 	const serialized_points = Array.from(this.m_Points.store.entries()).map(([key, value]) => ({ key, value: value.Serialize() }));
		// 	const serialized_paths = this.m_Lines.store.map(pa => pa.Serialize());

		// 	worker.postMessage({
		// 		operation: "BUILD_GRAPH",
		// 		boardSize: { iGridWidth: this.m_iGridWidth, iGridHeight: this.m_iGridHeight },
		// 		state: this.GetGameStateForIndexedDb(),
		// 		points: serialized_points,
		// 		paths: serialized_paths
		// 	});
		// });

		LocalLog(await this.MarkAllCycles(await this.BuildGraph(), this.COLOR_RED));

		// const data = await this.RunAIWorker((worker) => {
		// 	const serialized_points = Array.from(this.m_Points.store.entries()).map(([key, value]) =>
		// 		({ key, value: value.Serialize() }));
		// 	const serialized_paths = this.m_Lines.store.map(pa => pa.Serialize());

		// 	worker.postMessage({
		// 		operation: "MARK_ALL_CYCLES",
		// 		boardSize: { iGridWidth: this.m_iGridWidth, iGridHeight: this.m_iGridHeight },
		// 		state: this.GetGameStateForIndexedDb(),
		// 		points: serialized_points,
		// 		paths: serialized_paths,
		// 		colorRed: this.COLOR_RED,
		// 		colorBlue: this.COLOR_BLUE
		// 	});
		// });

		// if (data.cycles && data.free_human_player_points && data.free_human_player_points.length > 0) {
		// 	//gather free human player points that could be intercepted.
		// 	const free_human_player_points = [];
		// 	//const sHumanColor = this.COLOR_RED;
		// 	for (const pt of data.free_human_player_points) {
		// 		//if (pt !== undefined && pt.GetFillColor() === sHumanColor && StatusEnum.POINT_FREE_RED === pt.GetStatus()) {
		// 		const { x, y } = pt;
		// 		//	if (false === await this.IsPointOutsideAllPaths(x, y))
		// 		//		continue;

		// 		//check if really exists
		// 		const pt1 = document.querySelector(`svg > circle[cx="${x}"][cy="${y}"]`);
		// 		if (pt1)
		// 			free_human_player_points.push({ x, y });
		// 		//}
		// 	}


		// 	const tab = [];
		// 	// traverse through all the vertices with same cycle
		// 	for (let i = 0; i <= data.cyclenumber; i++) {
		// 		const new_cycl = data.cycles[i];//get cycle
		// 		if (new_cycl && new_cycl.cycl && new_cycl.cycl.length > 0 && new_cycl.cw_sorted_verts) {	//some checks
		// 			// Print the i-th cycle
		// 			let str = (`Cycle Number ${i}: `), trailing_points = [];
		// 			const rand_color = 'var(--bs-teal)';

		// 			const cw_sorted_verts = new_cycl.cw_sorted_verts;

		// 			//display which cycle we are dealing with
		// 			for (const vert of cw_sorted_verts) {
		// 				const { x, y } = vert;
		// 				const pt = document.querySelector(`svg > circle[cx="${x}"][cy="${y}"]`);
		// 				if (pt) {//again some basic checks
		// 					str += (`(${x},${y})`);

		// 					pt.SetStrokeColor(rand_color);
		// 					pt.SetFillColor(rand_color);
		// 					pt.setAttribute("r", 6 / this.m_iGridSpacingX);
		// 				}
		// 				await Sleep(50);
		// 			}

		// 			//find for all free_human_player_points which cycle might interepct it (surrounds)
		// 			//only convex, NOT concave :-(
		// 			let tmp = '', comma = '';
		// 			for (const possible_intercept of free_human_player_points) {
		// 				if (false !== pnpoly2(cw_sorted_verts, possible_intercept.x, possible_intercept.y)) {
		// 					tmp += `${comma}(${possible_intercept.x},${possible_intercept.y})`;

		// 					const pt1 = document.querySelector(`svg > circle[cx="${possible_intercept.x}"][cy="${possible_intercept.y}"]`);
		// 					if (pt1) {
		// 						pt1.SetStrokeColor('var(--bs-yellow)');
		// 						pt1.SetFillColor('var(--bs-yellow)');
		// 						pt1.setAttribute("r", 6 / this.m_iGridSpacingX);
		// 					}
		// 					comma = ',';
		// 				}
		// 			}
		// 			//gaterhing of some data and console printing
		// 			trailing_points.unshift(str);
		// 			tab.push(trailing_points);
		// 			//log...
		// 			LocalLog(str + (tmp !== '' ? ` possible intercepts: ${tmp}` : ''));
		// 			//...and clear
		// 			const pts2reset = Array.from(document.querySelectorAll(`svg > circle[fill="${rand_color}"][r="${this.m_LineStrokeWidth * 2}"]`));
		// 			pts2reset.forEach(pt => {
		// 				pt.SetStrokeColor(this.COLOR_BLUE);
		// 				pt.SetFillColor(this.COLOR_BLUE);
		// 				pt.setAttribute("r", 6 / this.m_iGridSpacingX);
		// 			});
		// 		}
		// 	}
		// }
	}

	async OnTestGroupPoints(event) {
		event.preventDefault();
		//LocalLog('OnTestGroupPoints');
		const starting_point = await this.m_Points.get(this.m_iMouseY * this.m_iGridWidth + this.m_iMouseX);
		if (starting_point === undefined) {
			LocalLog("!!!You need to click first 'blue' starting point with mouse!!!");
			return;
		}
		await this.GroupPointsRecurse([], starting_point);
		if (this.workingCyclePolyLine) {
			this.SvgVml.RemovePolyline(this.workingCyclePolyLine);
			this.workingCyclePolyLine = null;
		}
		this.lastCycle.forEach(cycle => {
			this.SvgVml.CreatePolyline(cycle.map(function (fnd) {
				const pt = fnd.GetPosition();
				return `${pt.x},${pt.y}`;
			}).join(' '), RandomColor()/* , this.m_LineStrokeWidth * 2 */);
		});
		LocalLog('game.lastCycle = ');
		LocalLog(this.lastCycle);
		this.lastCycle = [];
	}

	async OnTestFindSurroundablePoints(event) {
		event.preventDefault();

		const sHumanColor = this.COLOR_RED, sCPUColor = this.COLOR_BLUE;
		let working_points;
		const pt = await this.m_Points.get(this.m_iMouseY * this.m_iGridWidth + this.m_iMouseX);
		const all_points = [...await this.m_Points.values()];
		if (pt !== undefined)
			working_points = [pt];
		else
			working_points = all_points;

		//loading all line up front and pass into below "looped" function calls
		const allLines = await this.m_Lines.all();//TODO: async for
		for (const pt of working_points) {
			if (pt !== undefined && pt.GetFillColor() === sHumanColor
				&& [StatusEnum.POINT_FREE_RED, StatusEnum.POINT_IN_PATH].includes(pt.GetStatus())) {
				const { x, y } = pt.GetPosition();
				if (false === await this.IsPointOutsideAllPaths(x, y, allLines)) {
					LocalLog("!!!Point inside path!!!");
					continue;
				}
				const rand_color = RandomColor();
				const r = 2;

				const enclosing_circle = this.SvgVml.CreateOval(r);
				enclosing_circle.move(x, y);
				enclosing_circle.SetStrokeColor(rand_color);
				enclosing_circle.StrokeWeight(0.1);
				enclosing_circle.SetFillColor('transparent');

				//pt,x,y is good "surroundable point"
				//let's find closes CPU points to it lying on circle
				const possible = [];
				for (const cpu_pt of all_points) {
					if (cpu_pt !== undefined && cpu_pt.GetFillColor() === sCPUColor
						&& [StatusEnum.POINT_FREE_BLUE, StatusEnum.POINT_IN_PATH].includes(cpu_pt.GetStatus())) {
						const { x: cpu_x, y: cpu_y } = cpu_pt.GetPosition();
						if (false === await this.IsPointOutsideAllPaths(cpu_x, cpu_y, allLines))
							continue;

						if (0 <= this.SvgVml.IsPointInCircle({ x: cpu_x, y: cpu_y }, { x, y }, r)) {
							cpu_pt.x = cpu_x;
							cpu_pt.y = cpu_y;
							possible.push(cpu_pt);
						}
					}
				}
				if (possible.length > 2) {
					let cw_sorted_verts = sortPointsClockwise(possible);
					let last = undefined;
					//check if points are aligne  one-by-one next to each other no more than 1 point apart
					for (const it of cw_sorted_verts) {
						if (last !== undefined) {
							if (!(Math.abs(last.x - it.x) <= 1 && Math.abs(last.y - it.y) <= 1)) {
								cw_sorted_verts = null;
								break;
							}
						}
						last = it;
					}

					if (
						//check if above loop exited with not consecutive points
						cw_sorted_verts === null ||

						//check last and first path points that they close up nicely
						!(Math.abs(cw_sorted_verts.at(-1).x - cw_sorted_verts[0].x) <= 1 &&
							Math.abs(cw_sorted_verts.at(-1).y - cw_sorted_verts[0].y) <= 1
						) ||

						//check if "points-created-path" actually contains selected single point inside its boundaries
						false === pnpoly2(cw_sorted_verts, x, y)
					) {
						continue;
					}

					if (working_points.length <= 1) {
						for (const cpu_pt of cw_sorted_verts) {
							const pt1 = document.querySelector(`svg > circle[cx="${cpu_pt.x}"][cy="${cpu_pt.y}"]`);
							if (pt1) {
								pt1.SetStrokeColor(rand_color);
								pt1.StrokeWeight('0.020em');
								pt1.SetFillColor(rand_color);
								pt1.setAttribute("r", 6 / this.m_iGridSpacingX);
							}
						}
						await this.DisplayPointsProgressWithDelay(cw_sorted_verts, 250);
					}

					LocalLog('circle sorted possible path points: ');
					LocalLog(cw_sorted_verts);

				}
			}
		}
	}

	async OnTestDFS2(event) {
		event.preventDefault();
		await this.DFS2(await this.BuildGraph(), this.COLOR_RED);
	}

	/**
	 * Start drawing routines
	 * @param {HTMLElement} sScreen screen dontainer selector
	 * @param {HTMLElement} sPlayer1Name displaying element selector
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
	async PrepareDrawing(sScreen, sPlayer1Name, sPlayer2Name, sGameStatus, sSurrenderButton, sCancelPath, sPause, sStopAndDraw,
		sMsgInputSel, sMsgListSel, sMsgSendButtonSel, sLastMoveGameTimeStamp, useIndexedDbStore, version, ddlTestActions,
		iTooLong2Duration = 125) {
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
		this.m_Player1Name = document.querySelector(sPlayer1Name);
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

		let [iGridWidth, iGridHeight] = [...this.m_Screen.classList].find(x => x.startsWith('boardsize')).split('-')[1].split('x');
		this.m_iGridWidth = parseInt(iGridWidth);
		this.m_iGridHeight = parseInt(iGridHeight);
		let iClientWidth = this.m_Screen.clientWidth;
		let iClientHeight = this.m_Screen.clientHeight;
		let svg_width_x_height = null;
		if (iClientHeight <= 0) { //no styles loaded case, emulating calculation with 16px font size
			iClientHeight = 16 * this.m_iGridHeight;
			this.m_Screen.style.height = iClientHeight + 'px';
			svg_width_x_height = "100%";
		}
		this.m_iGridSpacingX = Math.ceil(iClientWidth / this.m_iGridWidth);
		this.m_iGridSpacingY = Math.ceil(iClientHeight / this.m_iGridHeight);
		//this.m_PointRadius = (4 / this.m_iGridSpacingX);
		this.m_LineStrokeWidth = (3 / this.m_iGridSpacingX);

		this.m_sLastMoveGameTimeStamp = sLastMoveGameTimeStamp;
		this.m_sVersion = version;
		///////CpuGame variables start//////
		this.rAF_StartTimeStamp = null;
		this.rAF_FrameID = null;
		this.workingCyclePolyLine = null;
		this.lastCycle = [];
		this.m_AIMethod = null;
		///////CpuGame variables end//////

		this.SvgVml = new SHRD.SvgVml();
		if (this.SvgVml.CreateSVGVML(this.m_Screen, svg_width_x_height, svg_width_x_height,
			{ iGridWidth: this.m_iGridWidth, iGridHeight: this.m_iGridHeight }) === null)
			alert('SVG is not supported!');

		const stateStore = new SHRD.GameStateStore(useIndexedDbStore,
			this.CreateScreenPointFromIndexedDb.bind(this),
			this.CreateScreenPathFromIndexedDb.bind(this),
			this.GetGameStateForIndexedDb.bind(this),
			this.m_sVersion);
		this.m_Lines = stateStore.GetPathStore();
		this.m_Points = stateStore.GetPointStore();
		this.m_bPointsAndPathsLoaded = await stateStore.PrepareStore();

		if (this.m_bViewOnly === false) {

			if (this.m_MouseCursorOval === null) {
				this.m_MouseCursorOval = this.SvgVml.CreateOval(/* this.m_PointRadius */);
				this.m_MouseCursorOval.SetFillColor(this.m_sDotColor);
				// this.m_MouseCursorOval.SetStrokeColor(this.m_sDotColor);
				this.m_MouseCursorOval.SetZIndex(-1);
				this.m_MouseCursorOval.Hide();
				this.m_MouseCursorOval.setAttribute("data-status", "MOUSE_POINTER");
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
					document.querySelector(ddlTestActions[i++]).onclick = this.OnTestFindSurroundablePoints.bind(this);
				if (ddlTestActions.length > i)
					document.querySelector(ddlTestActions[i++]).onclick = this.OnTestDFS2.bind(this);

				//disable or even delete chat functionality, coz we're not going to chat with CPU bot
				//const chatSection = document.querySelector(this.m_sMsgListSel).parentElement;
				//chatSection.parentElement.removeChild(chatSection);

				//if (!this.m_bIsPlayerActive)
				//	this.StartCPUCalculation();
				this.m_AIMethod = localStorage.getItem('AIMethod');
				if (!this.m_AIMethod) {
					this.m_AIMethod = 'centroid';
					localStorage.setItem('AIMethod', this.m_AIMethod);
				}
			}

			this.m_SurrenderButton.disabled = '';

			if (this.m_Player2Name.textContent === '???') {
				this.ShowStatus('Waiting for other player to connect');
				this.m_Screen.style.cursor = "wait";
			}
			else {
				this.m_SurrenderButton.value = 'surrender';

				if (this.m_bIsPlayerActive) {
					this.ShowStatus('Your move');
					this.m_Screen.style.cursor = "crosshair";
					this.m_StopAndDraw.disabled = '';
				}
				else {
					this.ShowStatus('Waiting for oponent move');
					this.m_Screen.style.cursor = "wait";
				}
				if (!this.m_bDrawLines)
					this.m_StopAndDraw.value = 'Draw line';
				else
					this.m_StopAndDraw.value = 'Draw dot';
			}
		}
		else {
			document.querySelector(sPause).textContent = 'back to Game List';
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
		min = Math.max(0, Math.min(min, this.m_iGridWidth));
		max = Math.max(0, Math.min(max, this.m_iGridWidth));
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
	}

	async FindRandomCPUPoint() {
		let max_random_pick_amount = 100, x, y;
		//loading all line up front and pass into below "looped" function calls
		const allLines = await this.m_Lines.all();//TODO: async for
		while (--max_random_pick_amount > 0) {
			x = this.GetRandomInt(0, this.m_iGridWidth);
			y = this.GetRandomInt(0, this.m_iGridHeight);

			if (!(await this.m_Points.has(y * this.m_iGridWidth + x)) && await this.IsPointOutsideAllPaths(x, y, allLines)) {
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
				const { x, y } = pt.GetPosition();

				centroidX += x; centroidY += y;
				count++;
			}
		}
		if (count <= 0)
			return null;

		centroidX = parseInt(centroidX / count);
		centroidY = parseInt(centroidY / count);
		x = centroidX; y = centroidY;
		let log_str = "";
		const random_picked_points = new Set();

		let random_pick_amount_cnter = 0, spread = 2;
		//loading all line up front and pass into below "looped" function calls
		const allLines = await this.m_Lines.all();//TODO: async for
		while (++random_pick_amount_cnter <= 50) {
			random_picked_points.add(`${x}_${y}`);
			if (false === (await this.m_Points.has(y * this.m_iGridWidth + x)) &&
				true === (await this.IsPointOutsideAllPaths(x, y, allLines))) {
				log_str += (`checking centroid coords ${x}_${y} succeed\n`);
				break;
			}
			log_str += (`checking coords ${x}_${y} failed #${random_pick_amount_cnter}\n`);
			if (random_pick_amount_cnter >= 25)
				spread *= 2;

			let spread_cnter = 50;
			do {
				x = this.GetRandomInt(centroidX - spread, centroidX + spread + 1);
				y = this.GetRandomInt(centroidY - spread, centroidY + spread + 1);
			} while (--spread_cnter > 0 && random_picked_points.has(`${x}_${y}`));
		}
		if (random_pick_amount_cnter >= 50) {
			log_str += ('finding centroid failed\n');
			LocalLog(log_str);
			return null;
		}
		else
			LocalLog(log_str);

		const pt = new InkBallPointViewModel(0, this.g_iGameID, -1/*player*/, x, y, StatusEnum.POINT_FREE_BLUE, 0);
		return pt;
	}

	async FindNearestCPUPoint() {
		if (this.m_iLastX >= 0 && this.m_iLastY >= 0) {
			let x = this.m_iLastX, y = this.m_iLastY;
			let log_str = "";
			const random_picked_points = new Set();

			let random_pick_amount_cnter = 0, spread = 1;
			//loading all line up front and pass into below "looped" function calls
			const allLines = await this.m_Lines.all();//TODO: async for
			while (++random_pick_amount_cnter <= 50) {
				random_picked_points.add(`${x}_${y}`);
				if (false === (await this.m_Points.has(y * this.m_iGridWidth + x)) &&
					true === (await this.IsPointOutsideAllPaths(x, y, allLines))) {
					log_str += (`checking nearest coords ${x}_${y} succeed\n`);
					break;
				}
				log_str += (`checking coords ${x}_${y} failed #${random_pick_amount_cnter}\n`);
				// if (random_pick_amount_cnter >= 25)
				// 	spread *= 2;

				let spread_cnter = 20;
				do {
					x = this.GetRandomInt(this.m_iLastX - spread, this.m_iLastX + spread + 1);
					y = this.GetRandomInt(this.m_iLastY - spread, this.m_iLastY + spread + 1);
				} while (--spread_cnter > 0 && random_picked_points.has(`${x}_${y}`));
			}
			if (random_pick_amount_cnter >= 50) {
				log_str += ('finding nearest failed\n');
				LocalLog(log_str);
				return null;
			}
			else
				LocalLog(log_str);

			const pt = new InkBallPointViewModel(0, this.g_iGameID, -1/*player*/, x, y, StatusEnum.POINT_FREE_BLUE, 0);
			return pt;
		}

		return null;
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
					const { x, y } = i.GetPosition();

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
	 * Building graph of connected vertices and edges
	 * @param {any} param0 is a optional object comprised of:
	 *	freePointStatus - status of free point
	 *	cpuFillColor - CPU point color
	 */
	async BuildGraph({
		freePointStatus = StatusEnum.POINT_FREE_BLUE,
		cpufillCol: cpuFillColor = this.COLOR_BLUE
		//, visuals: presentVisually = false
	} = {}) {
		const graph_points = [], graph_edges = new Map();

		const isPointOKForPath = function (freePointStatusArr, pt) {
			const status = pt.GetStatus();

			if (freePointStatusArr.includes(status) && pt.GetFillColor() === cpuFillColor)
				return true;
			return false;
		};

		const addPointsAndEdgesToGraph = async function (point, to_x, to_y, x, y) {
			if (to_x >= 0 && to_x < this.m_iGridWidth && to_y >= 0 && to_y < this.m_iGridHeight) {
				const next = await this.m_Points.get(to_y * this.m_iGridWidth + to_x);
				if (next && isPointOKForPath([freePointStatus], next) === true) {

					if (graph_edges.has(`${x},${y}_${to_x},${to_y}`) === false && graph_edges.has(`${to_x},${to_y}_${x},${y}`) === false) {

						const edge = {
							from: point,
							to: next
						};
						//if (presentVisually === true) {
						//	const line = CreateLine(3, 'rgba(0, 255, 0, 0.3)');
						//	line.move(x, y, next_pos.x, next_pos.y);
						//	edge.line = line;
						//}
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
			if (point && isPointOKForPath([freePointStatus, this.POINT_STARTING, this.POINT_IN_PATH], point) === true) {
				const { x, y } = point.GetPosition();
				//TODO: await all below promises
				//east
				await addPointsAndEdgesToGraph(point, x + 1, y, x, y);
				//west
				await addPointsAndEdgesToGraph(point, x - 1, y, x, y);
				//north
				await addPointsAndEdgesToGraph(point, x, (y - 1), x, y);
				//south
				await addPointsAndEdgesToGraph(point, x, (y + 1), x, y);
				//north_west
				await addPointsAndEdgesToGraph(point, x - 1, (y - 1), x, y);
				//north_east
				await addPointsAndEdgesToGraph(point, x + 1, (y - 1), x, y);
				//south_west
				await addPointsAndEdgesToGraph(point, x - 1, (y + 1), x, y);
				//south_east
				await addPointsAndEdgesToGraph(point, x + 1, (y + 1), x, y);
			}
		}
		//return graph
		return {
			vertices: graph_points,
			edges: Array.from(graph_edges.values()),
			getNeighbors: function (vert) {
				const found = this.vertices.find(v => v === vert);
				if (found)
					return found.adjacents;
				return null;
			}
		};
	}

	/**
	 * Based on https://www.geeksforgeeks.org/print-all-the-cycles-in-an-undirected-graph/
	 * @param {any} graph constructed earlier with BuildGraph
	 * @param {string} sHumanColor - human red playing color
	 * @returns {array} of cycles
	 */
	async MarkAllCycles(graph, sHumanColor) {
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


				const { x, y } = vertex.GetPosition();
				const vis_v = await this.m_Points.get(y * this.m_iGridWidth + x);
				vis_v.SetStrokeColor('black');
				vis_v.SetFillColor('black');
				vis_v.StrokeWeight(0.2);
				vis_v.setAttribute("r", 6 / 16);
				await Sleep(25);


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
		}.bind(this);

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
			//loading all line up front and pass into below "looped" function calls
			const allLines = await this.m_Lines.all();//TODO: async for
			for (const pt of await this.m_Points.values()) {
				if (pt !== undefined && pt.GetFillColor() === sHumanColor && StatusEnum.POINT_FREE_RED === pt.GetStatus()) {
					const { x, y } = pt.GetPosition();
					if (false === await this.IsPointOutsideAllPaths(x, y, allLines))
						continue;

					//check if really exists
					const pt1 = await this.m_Points.get(y * this.m_iGridWidth + x);
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
					const rand_color = 'var(--bs-teal)';

					//convert to logical space
					const mapped_verts = cycl.map(function (c) {
						return vertices[c].GetPosition();
					}.bind(this));
					//sort clockwise (https://stackoverflow.com/questions/45660743/sort-points-in-counter-clockwise-in-javascript)
					const cw_sorted_verts = sortPointsClockwise(mapped_verts);

					//display which cycle we are dealing with
					for (const vert of cw_sorted_verts) {
						const { x, y } = vert;
						const pt = await this.m_Points.get(y * this.m_iGridWidth + x);
						if (pt) {//again some basic checks
							str += (`(${x},${y})`);

							pt.SetStrokeColor(rand_color);
							pt.SetFillColor(rand_color);
							pt.StrokeWeight(0.2);
							pt.setAttribute("r", 6 / this.m_iGridSpacingX);
						}
						await Sleep(50);
					}

					//find for all free_human_player_points which cycle might interepct it (surrounds)
					//only convex, NOT concave :-(
					let tmp = '', comma = '';
					for (const possible_intercept of free_human_player_points) {
						if (false !== pnpoly2(cw_sorted_verts, possible_intercept.x, possible_intercept.y)) {
							tmp += `${comma}(${possible_intercept.x},${possible_intercept.y})`;

							const pt1 = await this.m_Points.get(possible_intercept.y * this.m_iGridWidth + possible_intercept.x);
							if (pt1) {
								pt1.SetStrokeColor('var(--bs-yellow)');
								pt1.StrokeWeight(0.2);
								pt1.SetFillColor('var(--bs-yellow)');
								pt1.setAttribute("r", 6 / this.m_iGridSpacingX);
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
					const pts2reset = Array.from(document.querySelectorAll(`svg > circle[fill="${rand_color}"][r="${6 / this.m_iGridSpacingX}"]`));
					pts2reset.forEach(pt => {
						pt.SetStrokeColor(this.COLOR_BLUE);
						pt.StrokeWeight(0.2);
						pt.SetFillColor(this.COLOR_BLUE);
						pt.setAttribute("r", 6 / this.m_iGridSpacingX);
					});
				}
			}
			return tab;
		}.bind(this);

		// store the numbers of cycle
		let cyclenumber = 0, edges = N;

		// call DFS to mark the cycles
		for (let vind = 0; vind < N; vind++) {
			await dfs_cycle(vind + 1, vind);//, color, mark, par);
		}

		// function to print the cycles
		return await printCycles(edges, mark);
	}

	// eslint-disable-next-line no-unused-vars
	async DFS2(graph, sHumanColor) {
		const enterVertex = () => {
		};
		const leaveVertex = () => {
		};
		// eslint-disable-next-line no-unused-vars
		const showCycle = async (lastSeen, nextVertex) => {
			lastSeen = Object.values(lastSeen);
			lastSeen.forEach(p => {
				const { x, y } = p.GetPosition();
				p.x = x; p.y = y;
			});
			const cw_sorted_verts = sortPointsClockwise(lastSeen);

			await this.DisplayPointsProgressWithDelay(cw_sorted_verts, 250);
		};

		await depthFirstSearch(graph, graph.vertices[0], { enterVertex, leaveVertex, showCycle });
	}

	async DisplayPointsProgressWithDelay(ptsArr, sleepMillisecs = 25) {
		const pts = ptsArr.map((fnd) => {
			const pt = fnd.GetPosition();
			return `${pt.x},${pt.y}`;
		}).join(' ');
		if (!this.workingCyclePolyLine)
			this.workingCyclePolyLine = this.SvgVml.CreatePolyline(pts, 'black'/* , this.m_LineStrokeWidth */);
		else
			this.workingCyclePolyLine.SetPoints(pts);

		await Sleep(sleepMillisecs);
	}

	async GroupPointsRecurse(currPointsArr, point) {
		if (point === undefined || currPointsArr.includes(point)
			|| currPointsArr.length > 60 || this.lastCycle.length > 3
		) {
			return currPointsArr;
		}
		if ([StatusEnum.POINT_FREE_BLUE, StatusEnum.POINT_STARTING, StatusEnum.POINT_IN_PATH].includes(point.GetStatus()) === false ||
			point.GetFillColor() !== this.COLOR_BLUE) {
			return currPointsArr;
		}

		const { x, y } = point.GetPosition();
		let last = null;
		if (currPointsArr.length > 0) {
			last = currPointsArr.at(-1);
			const { x: last_x, y: last_y } = last.GetPosition();
			if (Math.abs(last_x - x) <= 1 && Math.abs(last_y - y) <= 1) {
				currPointsArr.push(point);//nearby point 1 jump away
			}
			else {
				//const ind = currPointsArr.lastIndexOf(point);
				return currPointsArr;//not nearby point
			}
		}
		else
			currPointsArr.push(point);//1st starting point

		if (currPointsArr.length > 2) {
			//draw currently constructed cycle path
			await this.DisplayPointsProgressWithDelay(currPointsArr);

			if (currPointsArr.length >= 4) {
				const first_pos = currPointsArr[0].GetPosition();
				last = currPointsArr.at(-1);
				const { x: last_x, y: last_y } = last.GetPosition();

				if (Math.abs(last_x - first_pos.x) <= 1 && Math.abs(last_y - first_pos.y) <= 1) {
					const tmp = currPointsArr.slice(); //copy array in current state
					tmp.push(currPointsArr[0]);
					this.lastCycle.push(tmp);
				}
			}
		}

		const [east, west, north, south, north_west, north_east, south_west, south_east] = await Promise.all([
			this.m_Points.get(y * this.m_iGridWidth + x + 1),
			this.m_Points.get(y * this.m_iGridWidth + x - 1),
			this.m_Points.get((y - 1) * this.m_iGridWidth + x),
			this.m_Points.get((y + 1) * this.m_iGridWidth + x),
			this.m_Points.get((y - 1) * this.m_iGridWidth + x - 1),
			this.m_Points.get((y - 1) * this.m_iGridWidth + x + 1),
			this.m_Points.get((y + 1) * this.m_iGridWidth + x - 1),
			this.m_Points.get((y + 1) * this.m_iGridWidth + x + 1)
		]);

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

		const ind = currPointsArr.lastIndexOf(point);
		if (ind !== -1) {
			currPointsArr.splice(ind/* + 1*/);

			if (currPointsArr.length >= 2) {
				//draw currently constructed cycle path
				await this.DisplayPointsProgressWithDelay(currPointsArr);
			}
		}
		//all is lost. nothing found. record this path and make sure
		//no other traversal nver repeat those blind travers again
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
		if (this.rAF_StartTimeStamp === null) this.rAF_StartTimeStamp = timeStamp;
		const elapsed = timeStamp - this.rAF_StartTimeStamp;


		let point = null;
		switch (this.m_AIMethod) {
			case 'centroid':
				{
					point = await this.CalculateCPUCentroid();
					if (point === null)
						point = await this.FindRandomCPUPoint();
				}
				break;
			case 'nearest':
				{
					point = await this.FindNearestCPUPoint();
					if (point === null)
						point = await this.FindRandomCPUPoint();
				}
				break;
		}

		if (point === null) {
			if (elapsed < 2000)
				this.rAF_FrameID = window.requestAnimationFrame(this.rAFCallBack.bind(this));
		}
		else {
			//if (this.rAF_FrameID !== null) {
			//	window.cancelAnimationFrame(this.rAF_FrameID);
			//this.rAF_FrameID = null;
			//}

			await this.SendData(point, () => {
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
	const isMsgpackDefined = window.msgpack5 !== undefined;
	const gameOptions = window.gameOptions;

	const inkBallHubName = gameOptions.inkBallHubName;
	const iGameID = gameOptions.iGameID;
	document.getElementById('gameID').textContent = iGameID;
	document.querySelector(".container.inkgame form > input[type='hidden'][name='GameID']").value = iGameID;
	const iPlayerID = gameOptions.iPlayerID;
	const iOtherPlayerID = parseInt(document.querySelector('.msgchat').dataset.otherplayerid) || null;
	gameOptions.iOtherPlayerID = iOtherPlayerID;
	document.getElementById('playerID').textContent = iPlayerID;
	const bPlayingWithRed = gameOptions.bPlayingWithRed;
	const bPlayerActive = gameOptions.bPlayerActive;
	const gameType = gameOptions.gameType;
	const protocol = isMsgpackDefined && gameOptions.isMessagePackProtocol === true ? new signalR.protocols.msgpack.MessagePackHubProtocol() : new signalR.JsonHubProtocol();
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
	await game.PrepareDrawing('#screen', '#Player1Name', '#Player2Name', '#gameStatus', '#SurrenderButton', '#CancelPath', '#Pause', '#StopAndDraw',
		'#messageInput', '#messagesList', '#sendButton', sLastMoveTimeStampUtcIso, gameOptions.PointsAsJavaScriptArray === null, version,
		['#TestBuildGraph', '#TestConcaveman', '#TestMarkAllCycles', '#TestGroupPoints', '#TestFindSurroundablePoints', '#TestDFS2']);

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

export { InkBallGame };
