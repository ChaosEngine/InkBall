/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "InkBallGame|CountPointsDebug" }]*/
/*global signalR $createOval $createPolyline $RemovePolyline $createSVGVML $createLine hasDuplicates*/
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

//Debug function
function CountPointsDebug(sSelector2Set) {
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








	/*//TODO: test code; to be disabled
	const screen = document.querySelector('#screen');
	screen.innerHTML += "<div id='divTooltip' " +
		"style='position:absolute; top:0; right:0; z-index:33; background-color:#8886; display:none' " +
		"data-toggle='tooltip' data-html='true'>XXXXXXXXXX</div>";
	const tooltip = $('#divTooltip').tooltip('hide');
	$('polyline').hover(function (event) {
		const t = event.offsetY, l = event.offsetX;

		tooltip.text(this.getAttribute("points").split(" ").map(function (pt) {
			const tab = pt.split(',');
			return (parseInt(tab[0]) >> 4) + "," + (parseInt(tab[1]) >> 4);
		}).join(' 	'));
		
		tooltip.css({ "top": t + "px", "left": l + "px" }).show();
	}, function () {
		tooltip.hide();
	});*/




}

function LocalLog(msg) {
	// eslint-disable-next-line no-console
	console.log(msg);
}

function LocalError(msg) {
	// eslint-disable-next-line no-console
	console.error(msg);
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
	 * @param {enum} gameType of game enum as string
	 * @param {bool} bIsPlayingWithRed true - red, false - blue
	 * @param {bool} bIsPlayerActive is this player acive now
	 * @param {object} BoardSize defines logical width and height of grid size
	 * @param {bool} bViewOnly only viewing the game no interaction
	 * @param {number} pathAfterPointDrawAllowanceSecAmount is number of seconds, a player is allowed to start drawing path after putting point
	 * @param {number} iTooLong2Duration too long wait duration
	 */
	constructor(sHubName, loggingLevel, hubProtocol, transportType, serverTimeoutInMilliseconds, tokenFactory, gameType,
		bIsPlayingWithRed = true, bIsPlayerActive = true, BoardSize = { width: 32, height: 32 }, bViewOnly = false,
		pathAfterPointDrawAllowanceSecAmount = 60, iTooLong2Duration = 125) {

		this.g_iGameID = null;
		this.g_iPlayerID = null;
		this.m_iOtherPlayerId = null;
		this.m_bIsCPUGame = false;
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
		this.m_BoardSize = BoardSize;
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
		this.m_Line = null;
		this.m_Lines = [];
		this.m_Points = new Map();
		this.m_bViewOnly = bViewOnly;
		this.m_MouseCursorOval = null;
		this.m_ApplicationUserSettings = null;

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
		if (!this.m_bPointsAndPathsLoaded) {
			await this.g_SignalRConnection.invoke("GetPlayerPointsAndPaths", this.m_bViewOnly, this.g_iGameID).then(function (ppDTO) {
				//LocalLog(ppDTO);

				const path_and_point = PlayerPointsAndPathsDTO.Deserialize(ppDTO);
				if (path_and_point.Points !== undefined)
					this.SetAllPoints(path_and_point.Points);
				if (path_and_point.Paths !== undefined)
					this.SetAllPaths(path_and_point.Paths);

				this.m_bPointsAndPathsLoaded = true;

				return true;
			}.bind(this));
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
					await this.g_SignalRConnection.invoke("GetUserSettings").then(function (settings) {
						if (settings) {
							LocalLog(settings);
							settings = ApplicationUserSettings.Deserialize(settings);
							const to_store = ApplicationUserSettings.Serialize(settings);

							sessionStorage.setItem("ApplicationUserSettings", to_store);
						}
						return settings;
					}.bind(this)).then(async function (settings) {
						this.m_ApplicationUserSettings = new ApplicationUserSettings(settings.DesktopNotifications);

						return await this.GetPlayerPointsAndPaths();
					}.bind(this)).then(async function () {
					});
				}
				else {
					const json = sessionStorage.getItem("ApplicationUserSettings");
					const settings = ApplicationUserSettings.Deserialize(json);

					this.m_ApplicationUserSettings = new ApplicationUserSettings(settings.DesktopNotifications);
				}
			}
			if (!this.m_bPointsAndPathsLoaded) {
				await this.GetPlayerPointsAndPaths();
			}
			if (this.m_ApplicationUserSettings !== null && this.m_ApplicationUserSettings.DesktopNotifications === true) {
				this.SetupNotifications();
			}
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
	 * @param {number} iGameID ID of a game
	 * @param {number} iPlayerID player ID
	 * @param {number} iOtherPlayerID player ID
	 * @param {boolean} loadPointsAndPathsFromSignalR load points and path thriugh SignalR
	 * @param {string} sMsgListSel ul html element selector
	 * @param {string} sMsgSendButtonSel input button html element selector
	 * @param {string} sMsgInputSel input textbox html element selector
	 * @param {function} afterConnectionCallback after connected callback
	 */
	StartSignalRConnection(iGameID, iPlayerID, iOtherPlayerID, loadPointsAndPathsFromSignalR, sMsgListSel, sMsgSendButtonSel, sMsgInputSel,
		afterConnectionCallback) {
		if (this.g_SignalRConnection === null) return;
		this.g_iGameID = iGameID;
		this.g_iPlayerID = iPlayerID;
		this.m_iOtherPlayerId = iOtherPlayerID;
		this.m_bIsCPUGame = this.m_iOtherPlayerId === -1;
		this.m_sMsgInputSel = sMsgInputSel;
		this.m_sMsgSendButtonSel = sMsgSendButtonSel;
		this.m_bPointsAndPathsLoaded = !loadPointsAndPathsFromSignalR;

		this.g_SignalRConnection.on("ServerToClientPoint", function (point) {
			if (this.g_iPlayerID !== point.iPlayerId) {
				const user = this.m_Player2Name.innerHTML;
				let encodedMsg = InkBallPointViewModel.Format(user, point);

				const li = document.createElement("li");
				li.textContent = encodedMsg;
				document.querySelector(sMsgListSel).appendChild(li);

				this.NotifyBrowser('New Point', encodedMsg);
			}
			this.ReceivedPointProcessing(point);

		}.bind(this));

		this.g_SignalRConnection.on("ServerToClientPath", function (dto) {
			if (Object.prototype.hasOwnProperty.call(dto, 'PointsAsString') || Object.prototype.hasOwnProperty.call(dto, 'pointsAsString')) {
				let path = dto;
				if (this.g_iPlayerID !== path.iPlayerId) {
					const user = this.m_Player2Name.innerHTML;
					let encodedMsg = InkBallPathViewModel.Format(user, path);

					const li = document.createElement("li");
					li.textContent = encodedMsg;
					document.querySelector(sMsgListSel).appendChild(li);

					this.NotifyBrowser('New Path', encodedMsg);
				}
				this.ReceivedPathProcessing(path);
			}
			else if (Object.prototype.hasOwnProperty.call(dto, 'WinningPlayerId') || Object.prototype.hasOwnProperty.call(dto, 'winningPlayerId')) {
				let win = dto;
				let encodedMsg = WinCommand.Format(win);

				let li = document.createElement("li");
				li.textContent = encodedMsg;
				document.querySelector(sMsgListSel).appendChild(li);

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
			document.querySelector(sMsgListSel).appendChild(li);

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
			document.querySelector(sMsgListSel).appendChild(li);


			this.m_bHandlingEvent = false;
			encodedMsg = encodedMsg === '' ? 'Game interrupted!' : encodedMsg;
			this.NotifyBrowser('Game interruption', encodedMsg);
			alert(encodedMsg);
			window.location.href = "Games";
		}.bind(this));

		this.g_SignalRConnection.on("ServerToClientPlayerWin", function (win) {
			let encodedMsg = WinCommand.Format(win);

			let li = document.createElement("li");
			li.innerHTML = `<strong class="text-warning">${encodedMsg}</strong>`;
			document.querySelector(sMsgListSel).appendChild(li);

			this.ReceivedWinProcessing(win);
			this.NotifyBrowser('We have a winner', encodedMsg);

		}.bind(this));

		this.g_SignalRConnection.on("ServerToClientPing", function (ping) {

			const user = this.m_Player2Name.innerHTML;
			let encodedMsg = PingCommand.Format(user, ping);

			let li = document.createElement("li");
			li.textContent = encodedMsg;
			document.querySelector(sMsgListSel).appendChild(li);
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
					document.querySelector(sMsgListSel).appendChild(li);

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
				document.querySelector(sMsgListSel).appendChild(li);

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
			document.querySelector(sMsgListSel).appendChild(li);

			this.NotifyBrowser('User ' + user + ' started drawing new path', encodedMsg);
		}.bind(this));

		if (false === this.m_bIsCPUGame) {
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
		}

		this.Connect().then(afterConnectionCallback);
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

	SetPoint(iX, iY, iStatus, iPlayerId) {
		if (this.m_Points.has(iY * this.m_iGridWidth + iX))
			return;

		const x = iX * this.m_iGridSizeX;
		const y = iY * this.m_iGridSizeY;

		const oval = $createOval(this.m_PointRadius, 'true');
		oval.$move(x, y, this.m_PointRadius);

		let color;
		switch (iStatus) {
			case StatusEnum.POINT_FREE_RED:
				color = this.COLOR_RED;
				oval.$SetStatus(iStatus/*StatusEnum.POINT_FREE*/);
				break;
			case StatusEnum.POINT_FREE_BLUE:
				color = this.COLOR_BLUE;
				oval.$SetStatus(iStatus/*StatusEnum.POINT_FREE*/);
				break;
			case StatusEnum.POINT_FREE:
				color = this.m_sDotColor;
				oval.$SetStatus(iStatus/*StatusEnum.POINT_FREE*/);
				console.warn('TODO: generic FREE point, really? change it!');
				break;
			case StatusEnum.POINT_STARTING:
				color = this.m_sDotColor;
				oval.$SetStatus(iStatus);
				break;
			case StatusEnum.POINT_IN_PATH:
				if (this.g_iPlayerID === iPlayerId)//bPlayingWithRed
					color = this.m_bIsPlayingWithRed === true ? this.COLOR_RED : this.COLOR_BLUE;
				else
					color = this.m_bIsPlayingWithRed === true ? this.COLOR_BLUE : this.COLOR_RED;
				oval.$SetStatus(iStatus);
				break;
			case StatusEnum.POINT_OWNED_BY_RED:
				color = this.COLOR_OWNED_RED;
				oval.$SetStatus(iStatus);
				break;
			case StatusEnum.POINT_OWNED_BY_BLUE:
				color = this.COLOR_OWNED_BLUE;
				oval.$SetStatus(iStatus);
				break;
			default:
				alert('bad point');
				break;
		}

		oval.$SetFillColor(color);
		oval.$SetStrokeColor(color);

		this.m_Points.set(iY * this.m_iGridWidth + iX, oval);
	}

	SetAllPoints(points) {
		points.forEach(p => {
			this.SetPoint(p[0]/*x*/, p[1]/*y*/, p[2]/*Status*/, p[3]/*iPlayerId*/);
		});
	}

	SetPath(packed, bIsRed, bBelong2ThisPlayer, iPathId = 0) {
		const sPoints = packed.split(" ");
		let sDelimiter = "", sPathPoints = "", p = null, x, y,
			status = StatusEnum.POINT_STARTING;
		for (const packed of sPoints) {
			p = packed.split(",");
			x = parseInt(p[0]); y = parseInt(p[1]);

			p = this.m_Points.get(y * this.m_iGridWidth + x);
			if (p !== null && p !== undefined) {
				p.$SetStatus(status);
				status = StatusEnum.POINT_IN_PATH;
			}
			else {
				debugger;
			}

			x *= this.m_iGridSizeX; y *= this.m_iGridSizeY;
			sPathPoints += `${sDelimiter}${x},${y}`;
			sDelimiter = " ";
		}
		p = sPoints[0].split(",");
		x = parseInt(p[0]); y = parseInt(p[1]);

		p = this.m_Points.get(y * this.m_iGridWidth + x);
		if (p !== null && p !== undefined) {
			p.$SetStatus(status);
		}
		else {
			debugger;
		}

		x *= this.m_iGridSizeX; y *= this.m_iGridSizeY;
		sPathPoints += `${sDelimiter}${x},${y}`;

		const line = $createPolyline(3, sPathPoints,
			(bBelong2ThisPlayer ? this.m_sDotColor : (bIsRed ? this.COLOR_BLUE : this.COLOR_RED)));
		line.$SetID(iPathId);
		this.m_Lines.push(line);
	}

	SetAllPaths(packedPaths) {
		packedPaths.forEach(unpacked => {
			//const unpacked = JSON.parse(packed.Serialized);
			if (unpacked.iGameId !== this.g_iGameID)
				throw new Error("Bad game from path!");

			this.SetPath(unpacked.PointsAsString/*points*/, this.m_bIsPlayingWithRed,
				unpacked.iPlayerId === this.g_iPlayerID/*isMainPlayerPoints*/, unpacked.iId/*real DB id*/);
		});
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

	SurroundOponentPoints() {
		const points = this.m_Line.$GetPointsArray();

		//uniqe point path test (no duplicates except starting-ending point)
		const pts_not_unique = hasDuplicates(points.slice(0, -1).map(pt => pt.x + '_' + pt.y));

		if (pts_not_unique ||
			!(points[0].x === points[points.length - 1].x && points[0].y === points[points.length - 1].y)) {
			return {
				OwnedPoints: undefined,
				owned: "",
				path: "",
				errorDesc: "Points not unique"
			};
		}
		//make the test!
		const sColor = (this.m_sDotColor === this.COLOR_RED ? this.COLOR_BLUE : this.COLOR_RED);
		const owned_by = (this.m_sDotColor === this.COLOR_RED ? StatusEnum.POINT_OWNED_BY_RED : StatusEnum.POINT_OWNED_BY_BLUE);
		const sOwnedCol = (this.m_sDotColor === this.COLOR_RED ? this.COLOR_OWNED_RED : this.COLOR_OWNED_BLUE);
		let x, y, sPathPoints = "", sOwnedPoints = "", sDelimiter = "", ownedPoints = [], pathPoints = [];

		for (const pt of this.m_Points.values()) {
			if (pt !== undefined && pt.$GetFillColor() === sColor &&
				(pt.$GetStatus() === StatusEnum.POINT_FREE_BLUE || pt.$GetStatus() === StatusEnum.POINT_FREE_RED)) {
				const pos = pt.$GetPosition();
				x = pos.x; y = pos.y;
				if (false !== this.pnpoly2(points, x, y)) {
					x /= this.m_iGridSizeX; y /= this.m_iGridSizeY;
					sOwnedPoints += `${sDelimiter}${x},${y}`;
					sDelimiter = " ";
					ownedPoints.push({
						point: pt,
						revertStatus: pt.$GetStatus(),
						revertFillColor: pt.$GetFillColor(),
						revertStrokeColor: pt.$GetStrokeColor()
					});

					pt.$SetStatus(owned_by, true);
					pt.$SetFillColor(sOwnedCol);
					pt.$SetStrokeColor(sOwnedCol);
				}
			}
		}
		if (sOwnedPoints !== "") {
			sPathPoints = points.map(function (pt) {
				x = pt.x;
				y = pt.y;
				if (x === null || y === null) return '';
				x /= this.m_iGridSizeX; y /= this.m_iGridSizeY;

				return `${x},${y}`;
			}.bind(this)).join(' ');
		}
		return {
			OwnedPoints: ownedPoints,
			owned: sOwnedPoints,
			PathPoints: pathPoints,
			path: sPathPoints,
			errorDesc: "No surrounded points"
		};
	}

	IsPointOutsideAllPaths(x, y) {
		const xmul = x * this.m_iGridSizeX, ymul = y * this.m_iGridSizeY;

		for (const line of this.m_Lines) {
			const points = line.$GetPointsArray();

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
	SendAsyncData(payload, revertFunction = undefined) {

		switch (payload.GetKind()) {

			case CommandKindEnum.POINT:
				LocalLog(InkBallPointViewModel.Format('some player', payload));
				this.m_bHandlingEvent = true;

				this.g_SignalRConnection.invoke("ClientToServerPoint", payload).then(function (point) {
					this.ReceivedPointProcessing(point);
				}.bind(this)).catch(function (err) {
					LocalError(err.toString());
					if (revertFunction !== undefined)
						revertFunction();
				}.bind(this));
				break;

			case CommandKindEnum.PATH:
				LocalLog(InkBallPathViewModel.Format('some player', payload));
				this.m_bHandlingEvent = true;

				this.g_SignalRConnection.invoke("ClientToServerPath", payload).then(function (dto) {

					if (Object.prototype.hasOwnProperty.call(dto, 'WinningPlayerId') || Object.prototype.hasOwnProperty.call(dto, 'winningPlayerId')) {
						let win = dto;
						this.ReceivedWinProcessing(win);
					}
					else if (Object.prototype.hasOwnProperty.call(dto, 'PointsAsString') || Object.prototype.hasOwnProperty.call(dto, 'pointsAsString')) {
						let path = dto;
						this.ReceivedPathProcessing(path);
					}
					else
						throw new Error("ClientToServerPath bad GetKind!");

				}.bind(this)).catch(function (err) {
					LocalError(err.toString());
					if (revertFunction !== undefined)
						revertFunction();
				}.bind(this));
				break;

			case CommandKindEnum.PING:
				this.g_SignalRConnection.invoke("ClientToServerPing", payload).then(function () {
					document.querySelector(this.m_sMsgInputSel).value = '';
					document.querySelector(this.m_sMsgSendButtonSel).disabled = 'disabled';
				}.bind(this)).catch(function (err) {
					LocalError(err.toString());
				});
				break;

			case CommandKindEnum.STOP_AND_DRAW:
				this.g_SignalRConnection.invoke("ClientToServerStopAndDraw", payload).then(function () {
					this.m_bDrawLines = true;
					this.m_iLastX = this.m_iLastY = -1;
					this.m_Line = null;
					this.m_bIsPlayerActive = true;
					this.m_StopAndDraw.disabled = 'disabled';

				}.bind(this)).catch(function (err) {
					LocalError(err.toString());
				});
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

	ReceivedPointProcessing(point) {
		const x = point.iX, y = point.iY, iStatus = point.Status !== undefined ? point.Status : point.status;

		this.SetPoint(x, y, iStatus, point.iPlayerId);

		if (this.g_iPlayerID !== point.iPlayerId) {
			this.m_bIsPlayerActive = true;
			this.ShowMobileStatus('Oponent has moved, your turn');
			this.m_Screen.style.cursor = "crosshair";

			if (this.m_Line !== null)
				this.OnCancelClick();
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

	ReceivedPathProcessing(path) {
		if (this.g_iPlayerID !== path.iPlayerId) {

			const str_path = path.PointsAsString || path.pointsAsString, owned = path.OwnedPointsAsString || path.ownedPointsAsString;

			this.SetPath(str_path,
				(this.m_sDotColor === this.COLOR_RED ? true : false), false, path.iId/*real DB id*/);

			const points = owned.split(" ");
			const point_status = (this.m_sDotColor === this.COLOR_RED ? StatusEnum.POINT_OWNED_BY_RED : StatusEnum.POINT_OWNED_BY_BLUE);
			const sOwnedCol = (this.m_sDotColor === this.COLOR_RED ? this.COLOR_OWNED_RED : this.COLOR_OWNED_BLUE);
			for (const packed of points) {
				let p = packed.split(",");
				const x = parseInt(p[0]), y = parseInt(p[1]);
				p = this.m_Points.get(y * this.m_iGridWidth + x);
				if (p !== undefined) {
					p.$SetStatus(point_status);
					p.$SetFillColor(sOwnedCol);
					p.$SetStrokeColor(sOwnedCol);
				}
				else {
					debugger;
				}
			}


			this.m_bIsPlayerActive = true;
			this.ShowMobileStatus('Oponent has moved, your turn');
			this.m_Screen.style.cursor = "crosshair";

			if (this.m_Line !== null)
				this.OnCancelClick();
			this.m_StopAndDraw.disabled = '';
		}
		else {
			//set starting point to POINT_IN_PATH to block further path closing with it
			const points = this.m_Line.$GetPointsArray();
			let x = points[0].x, y = points[0].y;
			x /= this.m_iGridSizeX; y /= this.m_iGridSizeY;
			const p0 = this.m_Points.get(y * this.m_iGridWidth + x);
			if (p0 !== undefined)
				p0.$SetStatus(StatusEnum.POINT_IN_PATH);
			else {
				debugger;
			}

			this.m_Line.$SetWidthAndColor(3, this.m_sDotColor);
			this.m_Line.$SetID(path.iId);
			this.m_Lines.push(this.m_Line);
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
			window.location.href = "Games";
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
					return p.iEnclosingPathId !== null && p.$GetStatus() === owned_status;
				}).length;
				if (count >= 5) {
					if (this.m_bIsPlayingWithRed)
						return WinStatusEnum.GREEN_WINS;
					else
						return WinStatusEnum.RED_WINS;
				}
				owned_status = this.m_bIsPlayingWithRed ? StatusEnum.POINT_OWNED_BY_RED : StatusEnum.POINT_OWNED_BY_BLUE;
				count = playerPoints.filter(function (p) {
					return p.iEnclosingPathId !== null && p.$GetStatus() === owned_status;
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

	OnMouseMove(event) {
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

		this.m_MouseCursorOval.$move(tox, toy, this.m_PointRadius);
		this.m_MouseCursorOval.$Show();
		this.Debug(`[${x},${y}]`, 1);


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
						let p0 = this.m_Points.get(this.m_iLastY * this.m_iGridWidth + this.m_iLastX);
						let p1 = this.m_Points.get(y * this.m_iGridWidth + x);
						this.m_CancelPath.disabled = this.m_Line.$GetLength() >= 2 ? '' : 'disabled';

						if (p0 !== undefined && p1 !== undefined &&
							p0.$GetFillColor() === this.m_sDotColor && p1.$GetFillColor() === this.m_sDotColor) {
							const line_contains_point = this.m_Line.$ContainsPoint(tox, toy);
							if (line_contains_point < 1 && p1.$GetStatus() !== StatusEnum.POINT_STARTING &&
								true === this.m_Line.$AppendPoints(tox, toy, this.m_iGridSizeX)) {
								p1.$SetStatus(StatusEnum.POINT_IN_PATH, true);
								this.m_iLastX = x;
								this.m_iLastY = y;
							}
							else if (line_contains_point === 1 && p1.$GetStatus() === StatusEnum.POINT_STARTING &&
								true === this.m_Line.$AppendPoints(tox, toy, this.m_iGridSizeX)) {
								const val = this.SurroundOponentPoints();
								if (val.owned.length > 0) {
									this.Debug('Closing path', 0);
									this.rAF_FrameID = null;
									this.SendAsyncData(this.CreateXMLPutPathRequest(val), () => {
										this.OnCancelClick();
										val.OwnedPoints.forEach(revData => {
											const p = revData.point;
											const revertFillColor = revData.revertFillColor;
											const revertStrokeColor = revData.revertStrokeColor;
											p.$RevertOldStatus();
											p.$SetFillColor(revertFillColor);
											p.$SetStrokeColor(revertStrokeColor);
										});
										this.m_bHandlingEvent = false;
									});
								}
								else
									this.Debug(`${val.errorDesc ? val.errorDesc : 'Wrong path'}, cancell it or refresh page`, 0);
								this.m_iLastX = x;
								this.m_iLastY = y;
							}
							else if (line_contains_point >= 1 && p0.$GetStatus() === StatusEnum.POINT_IN_PATH &&
								this.m_Line.$GetPointsString().endsWith(`${this.m_iLastX * this.m_iGridSizeX},${this.m_iLastY * this.m_iGridSizeY}`)) {

								if (this.m_Line.$GetLength() > 2) {
									p0.$RevertOldStatus();
									this.m_Line.$RemoveLastPoint();
									this.m_iLastX = x;
									this.m_iLastY = y;
								}
								else
									this.OnCancelClick();
							}
						}
					}
					else {
						let p0 = this.m_Points.get(this.m_iLastY * this.m_iGridWidth + this.m_iLastX);
						let p1 = this.m_Points.get(y * this.m_iGridWidth + x);

						if (p0 !== undefined && p1 !== undefined &&
							p0.$GetFillColor() === this.m_sDotColor && p1.$GetFillColor() === this.m_sDotColor) {
							const fromx = this.m_iLastX * this.m_iGridSizeX;
							const fromy = this.m_iLastY * this.m_iGridSizeY;
							this.m_Line = $createPolyline(6, fromx + "," + fromy + " " + tox + "," + toy, this.DRAWING_PATH_COLOR);
							this.m_CancelPath.disabled = '';
							p0.$SetStatus(StatusEnum.POINT_STARTING, true);
							p1.$SetStatus(StatusEnum.POINT_IN_PATH, true);

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

	OnMouseDown(event) {
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

			if (this.m_Points.get(loc_y * this.m_iGridWidth + loc_x) !== undefined) {
				this.Debug('Wrong point - already existing', 0);
				return;
			}
			if (!this.IsPointOutsideAllPaths(loc_x, loc_y)) {
				this.Debug('Wrong point, Point is not outside all paths', 0);
				return;
			}

			this.rAF_FrameID = null;
			this.SendAsyncData(this.CreateXMLPutPointRequest(loc_x, loc_y), () => {
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
					let p0 = this.m_Points.get(this.m_iLastY * this.m_iGridWidth + this.m_iLastX);
					let p1 = this.m_Points.get(y * this.m_iGridWidth + x);
					this.m_CancelPath.disabled = this.m_Line.$GetLength() >= 2 ? '' : 'disabled';

					if (p0 !== undefined && p1 !== undefined &&
						p0.$GetFillColor() === this.m_sDotColor && p1.$GetFillColor() === this.m_sDotColor) {
						const tox = x * this.m_iGridSizeX;
						const toy = y * this.m_iGridSizeY;
						const line_contains_point = this.m_Line.$ContainsPoint(tox, toy);
						if (line_contains_point < 1 && p1.$GetStatus() !== StatusEnum.POINT_STARTING &&
							true === this.m_Line.$AppendPoints(tox, toy, this.m_iGridSizeX)) {
							p1.$SetStatus(StatusEnum.POINT_IN_PATH, true);
							this.m_iLastX = x;
							this.m_iLastY = y;
						}
						else if (line_contains_point === 1 && p1.$GetStatus() === StatusEnum.POINT_STARTING &&
							true === this.m_Line.$AppendPoints(tox, toy, this.m_iGridSizeX)) {
							const val = this.SurroundOponentPoints();
							if (val.owned.length > 0) {
								this.Debug('Closing path', 0);
								this.rAF_FrameID = null;
								this.SendAsyncData(this.CreateXMLPutPathRequest(val), () => {
									this.OnCancelClick();
									val.OwnedPoints.forEach(revData => {
										const p = revData.point;
										const revertFillColor = revData.revertFillColor;
										const revertStrokeColor = revData.revertStrokeColor;
										p.$RevertOldStatus();
										p.$SetFillColor(revertFillColor);
										p.$SetStrokeColor(revertStrokeColor);
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
						else if (line_contains_point >= 1 && p0.$GetStatus() === StatusEnum.POINT_IN_PATH &&
							this.m_Line.$GetPointsString().endsWith(`${this.m_iLastX * this.m_iGridSizeX},${this.m_iLastY * this.m_iGridSizeY}`)) {

							if (this.m_Line.$GetLength() > 2) {
								p0.$RevertOldStatus();
								this.m_Line.$RemoveLastPoint();
								this.m_iLastX = x;
								this.m_iLastY = y;
							}
							else
								this.OnCancelClick();
						}
					}
				}
				else {
					let p0 = this.m_Points.get(this.m_iLastY * this.m_iGridWidth + this.m_iLastX);
					let p1 = this.m_Points.get(y * this.m_iGridWidth + x);

					if (p0 !== undefined && p1 !== undefined &&
						p0.$GetFillColor() === this.m_sDotColor && p1.$GetFillColor() === this.m_sDotColor) {
						const fromx = this.m_iLastX * this.m_iGridSizeX;
						const fromy = this.m_iLastY * this.m_iGridSizeY;
						const tox = x * this.m_iGridSizeX;
						const toy = y * this.m_iGridSizeY;
						this.m_Line = $createPolyline(6, fromx + "," + fromy + " " + tox + "," + toy, this.DRAWING_PATH_COLOR);
						this.m_CancelPath.disabled = '';
						p0.$SetStatus(StatusEnum.POINT_STARTING, true);
						p1.$SetStatus(StatusEnum.POINT_IN_PATH, true);
					}
					this.m_iLastX = x;
					this.m_iLastY = y;
				}
			}
			else if (this.m_iLastX < 0 || this.m_iLastY < 0) {
				let p1 = this.m_Points.get(y * this.m_iGridWidth + x);
				if (p1 !== undefined && p1.$GetFillColor() === this.m_sDotColor) {
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
		this.m_MouseCursorOval.$Hide();
	}

	OnStopAndDraw(event) {
		if (!this.m_Timer) {
			if (this.m_Line !== null)
				this.OnCancelClick();
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
			this.SendAsyncData(new StopAndDrawCommand());
		}
	}

	OnCancelClick() {
		if (this.m_bDrawLines) {
			if (this.m_Line !== null) {
				const points = this.m_Line.$GetPointsArray();
				this.m_CancelPath.disabled = 'disabled';
				for (const point of points) {
					let x = point.x, y = point.y;
					if (x === null || y === null) continue;
					x /= this.m_iGridSizeX; y /= this.m_iGridSizeY;
					const p0 = this.m_Points.get(y * this.m_iGridWidth + x);
					if (p0 !== undefined) {
						p0.$RevertOldStatus();
					}
					else {
						debugger;
					}
				}
				$RemovePolyline(this.m_Line);
				this.m_Line = null;
			}
			this.m_iLastX = this.m_iLastY = -1;

			if (this.m_Timer)
				this.m_StopAndDraw.disabled = 'disabled';

			this.Debug('', 0);
		}
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
	 * @param {number} iTooLong2Duration how long waiting is too long
	 */
	PrepareDrawing(sScreen, sPlayer2Name, sGameStatus, sSurrenderButton, sCancelPath, sPause, sStopAndDraw,
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
		this.m_Lines = [];
		this.m_Points = new Map();

		this.m_Debug = document.getElementById('debug0');
		this.m_Player2Name = document.querySelector(sPlayer2Name);
		this.m_GameStatus = document.querySelector(sGameStatus);
		this.m_SurrenderButton = document.querySelector(sSurrenderButton);
		this.m_CancelPath = document.querySelector(sCancelPath);
		this.m_StopAndDraw = document.querySelector(sStopAndDraw);
		this.m_Screen = document.querySelector(sScreen);
		if (!this.m_Screen) {
			alert("no board");
			return;
		}
		this.m_iPosX = this.m_Screen.offsetLeft;
		this.m_iPosY = this.m_Screen.offsetTop;
		this.m_Screen.style.width = `calc(1em * ${this.m_BoardSize.width})`;
		this.m_Screen.style.height = `calc(1em * ${this.m_BoardSize.height})`;
		let iClientWidth = this.m_Screen.clientWidth;
		let iClientHeight = this.m_Screen.clientHeight;
		this.m_iGridSizeX = parseInt(Math.ceil(iClientWidth / this.m_BoardSize.width));
		this.m_iGridSizeY = parseInt(Math.ceil(iClientHeight / this.m_BoardSize.height));
		this.m_iGridWidth = parseInt(Math.ceil(iClientWidth / this.m_iGridSizeX));
		this.m_iGridHeight = parseInt(Math.ceil(iClientHeight / this.m_iGridSizeY));
		///////CpuGame variables start//////
		this.rAF_StartTimestamp = null;
		this.rAF_FrameID = null;
		this.lastCycle = [];
		///////CpuGame variables end//////

		$createSVGVML(this.m_Screen, this.m_Screen.style.width, this.m_Screen.style.height, true);

		this.DisableSelection(this.m_Screen);
		if (!this.m_bViewOnly) {

			if (this.m_MouseCursorOval === null) {
				this.m_MouseCursorOval = $createOval(this.m_PointRadius, 'true');
				this.m_MouseCursorOval.$SetFillColor(this.m_sDotColor);
				this.m_MouseCursorOval.$SetStrokeColor(this.m_sDotColor);
				this.m_MouseCursorOval.$SetZIndex(-1);
				this.m_MouseCursorOval.$Hide();
			}

			this.m_Screen.onmousedown = this.OnMouseDown.bind(this);
			this.m_Screen.onmousemove = this.OnMouseMove.bind(this);
			this.m_Screen.onmouseup = this.OnMouseUp.bind(this);
			this.m_Screen.onmouseleave = this.OnMouseLeave.bind(this);

			this.m_CancelPath.onclick = this.OnCancelClick.bind(this);
			this.m_StopAndDraw.onclick = this.OnStopAndDraw.bind(this);
			if (false === this.m_bIsCPUGame)
				document.querySelector(this.m_sMsgInputSel).disabled = '';
			else if (!this.m_bIsPlayerActive)
				this.StartCPUCalculation();

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
	GetRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
	}

	FindRandomCPUPoint() {
		let max_random_pick_amount = 100, x, y;
		while (--max_random_pick_amount > 0) {
			x = this.GetRandomInt(0, this.m_iGridWidth);
			y = this.GetRandomInt(0, this.m_iGridHeight);

			if (!this.m_Points.has(y * this.m_iGridWidth + x) && this.IsPointOutsideAllPaths(x, y)) {
				break;
			}
		}

		const cmd = new InkBallPointViewModel(0, this.g_iGameID, -1/*player*/, x, y, StatusEnum.POINT_FREE_BLUE, 0);
		return cmd;
	}

	CalculateCPUCentroid() {
		let centroidX = 0, centroidY = 0, count = 0, x, y;
		const sHumanColor = this.COLOR_RED;

		for (const pt of this.m_Points.values()) {
			if (pt !== undefined && pt.$GetFillColor() === sHumanColor && pt.$GetStatus() === StatusEnum.POINT_FREE_RED) {
				const pos = pt.$GetPosition();
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
			if (!this.m_Points.has(y * this.m_iGridWidth + x) && this.IsPointOutsideAllPaths(x, y)) {
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

	IsPathPossible({
		freeStat: freePointStatus = StatusEnum.POINT_FREE_RED,
		fillCol: fillColor = this.COLOR_RED,
		visuals: presentVisually = true
	} = {}) {
		const graph_points = [], graph_edges = new Map();

		const isPointOKForPath = function (freePointStatusArr, pt) {
			const status = pt.$GetStatus();

			if (freePointStatusArr.includes(status) &&
				(/*(status === StatusEnum.POINT_STARTING || status === StatusEnum.POINT_IN_PATH) && */pt.$GetFillColor() === fillColor)
				//&& graph_points.includes(pt) === false
			) {
				return true;
			}
			return false;
		};

		const addPointsAndEdgestoGraph = function (point, next, view_x, view_y, x, y) {
			if (next && isPointOKForPath([freePointStatus], next) === true) {
				const next_pos = next.$GetPosition();

				const to_x = next_pos.x / this.m_iGridSizeX, to_y = next_pos.y / this.m_iGridSizeY;
				if (graph_edges.has(`${x},${y}_${to_x},${to_y}`) === false && graph_edges.has(`${to_x},${to_y}_${x},${y}`) === false) {

					const edge = {
						from: point,
						to: next,
						//from_x: x,
						//from_y: y,
						//to_x: to_x,
						//to_y: to_y
					};
					if (presentVisually === true) {
						const line = $createLine(3, 'green');
						line.$move(view_x, view_y, next_pos.x, next_pos.y);
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
		}.bind(this);

		for (const point of this.m_Points.values()) {
			if (point && isPointOKForPath([freePointStatus, StatusEnum.POINT_STARTING, StatusEnum.POINT_IN_PATH], point) === true) {
				const { x: view_x, y: view_y } = point.$GetPosition();
				const x = view_x / this.m_iGridSizeX, y = view_y / this.m_iGridSizeY;
				let next;

				//east
				next = this.m_Points.get(y * this.m_iGridWidth + x + 1);
				addPointsAndEdgestoGraph(point, next, view_x, view_y, x, y);
				//west
				next = this.m_Points.get(y * this.m_iGridWidth + x - 1);
				addPointsAndEdgestoGraph(point, next, view_x, view_y, x, y);
				//north
				next = this.m_Points.get((y - 1) * this.m_iGridWidth + x);
				addPointsAndEdgestoGraph(point, next, view_x, view_y, x, y);
				//south
				next = this.m_Points.get((y + 1) * this.m_iGridWidth + x);
				addPointsAndEdgestoGraph(point, next, view_x, view_y, x, y);
				//north_west
				next = this.m_Points.get((y - 1) * this.m_iGridWidth + x - 1);
				addPointsAndEdgestoGraph(point, next, view_x, view_y, x, y);
				//north_east
				next = this.m_Points.get((y - 1) * this.m_iGridWidth + x + 1);
				addPointsAndEdgestoGraph(point, next, view_x, view_y, x, y);
				//south_west
				next = this.m_Points.get((y + 1) * this.m_iGridWidth + x - 1);
				addPointsAndEdgestoGraph(point, next, view_x, view_y, x, y);
				//south_east
				next = this.m_Points.get((y + 1) * this.m_iGridWidth + x + 1);
				addPointsAndEdgestoGraph(point, next, view_x, view_y, x, y);
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
					const { x: view_x, y: view_y } = i.$GetPosition();
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

	MarkAllCycles(graph) {
		const vertices = graph.vertices;
		const N = vertices.length;
		const cycles = new Array(N);
		// mark with unique numbers
		const mark = new Array(N);

		for (let i = 0; i < N; i++) {
			mark[i] = [];
			cycles[i] = [];
		}

		const dfs_cycle = function (u, p, color, mark, par) {
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
			// simple dfs on graph
			for (const adj of vertex.adjacents) {
				const v = vertices.indexOf(adj);
				// if it has not been visited previously
				if (v === par[u])
					continue;

				dfs_cycle(v, u, color, mark, par);
			}

			// completely visited. 
			color[u] = 2;
		};

		const printCycles = function (edges, mark) {
			// push the edges that into the 
			// cycle adjacency list 
			for (let e = 0; e < edges; e++) {
				if (mark[e] !== undefined && mark[e].length > 0) {
					for (let m = 0; m < mark[e].length; m++) {
						cycles[mark[e][m]].push(e);
					}
				}
			}

			const tab = [];
			// print all the vertex with same cycle 
			for (let i = 1; i <= cyclenumber; i++) {
				if (cycles[i].length > 0) {
					// Print the i-th cycle 
					let str = (`Cycle Number ${i}: `), trailing_points = [];
					for (const vert of cycles[i]) {
						const { x: view_x, y: view_y } = vertices[vert].$GetPosition();
						const x = view_x / this.m_iGridSizeX, y = view_y / this.m_iGridSizeY;

						str += (`${vert}(${x},${y}) `);
						trailing_points.push(vertices[vert]);
					}
					trailing_points.unshift(str);
					tab.push(trailing_points);
				}
			}
			//console.log(str);
			return tab;
		}.bind(this);

		// arrays required to color the 
		// graph, store the parent of node 
		const color = new Array(N), par = new Array(N);
		// store the numbers of cycle 
		let cyclenumber = 0, edges = N;

		// call DFS to mark the cycles 
		dfs_cycle(1, 0, color, mark, par);

		// function to print the cycles 
		return printCycles(edges, mark);
	}

	GroupPointsRecurse(currPointsArr, point) {
		if (point === undefined || currPointsArr.includes(point)) {
			//if (currPointsArr.lenth > 2 && currPointsArr[currPointsArr.length - 1] === currPointsArr[0]) {
			//	const tmp = [];
			//	currPointsArr.forEach((value) => {
			//		tmp.push(value);
			//	});
			//	tmp.push(point);
			//	this.lastCycle.push(tmp);
			//}
			return currPointsArr;
		}

		if ([StatusEnum.POINT_FREE_BLUE, StatusEnum.POINT_STARTING, StatusEnum.POINT_IN_PATH].includes(point.$GetStatus()) === false ||
			point.$GetFillColor() !== this.COLOR_BLUE) {
			return currPointsArr;
		}

		let { x: x, y: y } = point.$GetPosition();
		x /= this.m_iGridSizeX; y /= this.m_iGridSizeY;

		currPointsArr.push(point);
		this.lastCycle.push(point);

		const east = this.m_Points.get(y * this.m_iGridWidth + x + 1);
		const west = this.m_Points.get(y * this.m_iGridWidth + x - 1);
		const north = this.m_Points.get((y - 1) * this.m_iGridWidth + x);
		const south = this.m_Points.get((y + 1) * this.m_iGridWidth + x);
		const north_west = this.m_Points.get((y - 1) * this.m_iGridWidth + x - 1);
		const north_east = this.m_Points.get((y - 1) * this.m_iGridWidth + x + 1);
		const south_west = this.m_Points.get((y + 1) * this.m_iGridWidth + x - 1);
		const south_east = this.m_Points.get((y + 1) * this.m_iGridWidth + x + 1);

		if (east)
			this.GroupPointsRecurse(currPointsArr, east);
		if (west)
			this.GroupPointsRecurse(currPointsArr, west);
		if (north)
			this.GroupPointsRecurse(currPointsArr, north);
		if (south)
			this.GroupPointsRecurse(currPointsArr, south);
		if (north_west)
			this.GroupPointsRecurse(currPointsArr, north_west);
		if (north_east)
			this.GroupPointsRecurse(currPointsArr, north_east);
		if (south_west)
			this.GroupPointsRecurse(currPointsArr, south_west);
		if (south_east)
			this.GroupPointsRecurse(currPointsArr, south_east);

		//if (currPointsArr.length > 2) {
		//	//const last = currPointsArr[currPointsArr.length - 1];
		//	//let { x: last_pos_x, y: last_pos_y } = last.$GetPosition();
		//	//last_pos_x /= this.m_iGridSizeX; last_pos_y /= this.m_iGridSizeY;
		//	//if (Math.abs(parseInt(last_pos_x - x)) <= 1 && Math.abs(parseInt(last_pos_y - y)) <= 1) {
		//	//	//currPointsArr.splice(-1, 1);
		//	this.lastCycle.push(point);
		//	//}
		//}

		return currPointsArr;
	}

	rAFCallBack(timeStamp) {
		if (this.rAF_StartTimestamp === null) this.rAF_StartTimestamp = timeStamp;
		const progress = timeStamp - this.rAF_StartTimestamp;


		let point = null;
		const centroid = this.CalculateCPUCentroid();
		if (centroid !== null)
			point = centroid;
		else
			point = this.FindRandomCPUPoint();

		if (point === null) {
			if (progress < 2000)
				this.rAF_FrameID = window.requestAnimationFrame(this.rAFCallBack.bind(this));
		}
		else {
			//if (this.rAF_FrameID !== null) {
			//	window.cancelAnimationFrame(this.rAF_FrameID);
			//this.rAF_FrameID = null;
			//}

			this.SendAsyncData(point, () => {
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
