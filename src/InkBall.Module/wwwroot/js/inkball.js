/*global signalR, i18next*/
"use strict";

let LocalAlert, LocalLog, LocalError, /* LocalWarning, AABB,*/ StatusEnum, hasDuplicates, pnpoly, GameStateStore, SvgVml, IsPointOutsideAllPaths, sortPointsClockwise, Sleep, RandomColor, IBversionHash, localizeSelector;

/******** funcs-n-classes ********/
/**
 * Enum for command kinds
 */
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

/**
 * Enum for status of point
 */
const GameTypeEnum = Object.freeze({
	FIRST_CAPTURE: 0,
	FIRST_5_CAPTURES: 1,
	FIRST_5_PATHS: 2,
	FIRST_5_ADVANTAGE_PATHS: 3
});

/**
 * Enum for winning status
 */
const WinStatusEnum = Object.freeze({
	RED_WINS: 0,
	GREEN_WINS: 1,
	NO_WIN: 2,
	DRAW_WIN: 3
});

class DtoMsg {
	get Kind() { throw new Error(localizeMessage('err.kind.misImpl', "missing Kind implementation!")); }
}

class InkBallPointViewModel extends DtoMsg {
	constructor(iGameId = 0, iPlayerId = 0, iX = 0, iY = 0, Status = StatusEnum.POINT_FREE, iEnclosingPathId = 0) {
		super();

		this.iGameId = iGameId;
		this.iPlayerId = iPlayerId;
		this.iX = iX;
		this.iY = iY;
		this.Status = Status;
		this.iEnclosingPathId = iEnclosingPathId;
	}

	get Kind() { return CommandKindEnum.POINT; }

	static Format(sUser, point) {
		let msg = `(${point.iX},${point.iY} - `;
		const status = point.Status !== undefined ? point.Status : point.status;

		switch (status) {
			case StatusEnum.POINT_FREE_RED:
				msg += localizeMessage('game.red', 'red');
				break;
			case StatusEnum.POINT_FREE_BLUE:
				msg += localizeMessage('game.blue', 'blue');
				break;
			case StatusEnum.POINT_FREE:
				msg += '';
				break;
			case StatusEnum.POINT_STARTING:
				msg += localizeMessage('game.starting', 'starting');
				break;
			case StatusEnum.POINT_IN_PATH:
				msg += localizeMessage('game.path', 'path');
				break;
			case StatusEnum.POINT_OWNED_BY_RED:
				msg += localizeMessage('game.ownRed', 'owned by red');
				break;
			case StatusEnum.POINT_OWNED_BY_BLUE:
				msg += localizeMessage('game.ownBlue', 'owned by blue');
				break;

			default:
				throw new Error(localizeMessage('err.badPointT', "Bad point type!"));
		}

		// return `${sUser} places ${msg}) point`;
		return localizeMessageOpts('game.usrXPoint', { sUser, msg }, `${sUser} places ${msg}) point`);
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

	get Kind() { return CommandKindEnum.PATH; }

	static Format(sUser, path) {
		let msg = `(${path.PointsAsString || path.pointsAsString}) [${path.OwnedPointsAsString || path.ownedPointsAsString}]`;

		// return `${sUser} places ${msg} path`;
		return localizeMessageOpts('game.usrXPath', { sUser, msg }, `${sUser} places ${msg} path`);
	}
}

class PlayerJoiningCommand extends DtoMsg {
	constructor(otherPlayerId, otherPlayerName, message) {
		super();

		this.OtherPlayerId = otherPlayerId;
		this.OtherPlayerName = otherPlayerName;
		this.Message = message;
	}

	get Kind() { return CommandKindEnum.PLAYER_JOINING; }

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

	get Kind() { return CommandKindEnum.PLAYER_SURRENDER; }

	static Format(surrender) {
		return surrender.Message || surrender.message;
	}
}

class PingCommand extends DtoMsg {
	constructor(message = '') {
		super();

		this.Message = message;
	}

	get Kind() { return CommandKindEnum.PING; }

	static Format(ping) {
		const txt = ping.Message || ping.message;

		return txt;
	}
}

class WinCommand extends DtoMsg {
	constructor(status = WinStatusEnum.NO_WIN, winningPlayerId = 0, message = 'null') {
		super();

		this.Status = status;
		this.WinningPlayerId = winningPlayerId;
		this.Message = message;
	}

	get Kind() { return CommandKindEnum.WIN; }

	static Format(win) {
		let msg = '';
		const status = win.Status !== undefined ? win.Status : win.status;
		switch (status) {
			case WinStatusEnum.RED_WINS:
				msg = localizeMessage('game.whoWins.red', 'red.');
				break;
			case WinStatusEnum.GREEN_WINS:
				msg = localizeMessage('game.whoWins.blue', 'blue.');
				break;
			case WinStatusEnum.NO_WIN:
				msg = localizeMessage('game.whoWins.noOne', 'no one!');
				break;
			case WinStatusEnum.DRAW_WIN:
				msg = localizeMessage('game.whoWins.draw', 'draw!');
				break;
		}

		return localizeMessageOpts('game.andWinner', { msg }, 'And the winner is... ' + msg);
	}
}

class StopAndDrawCommand extends DtoMsg {
	constructor() {
		super();
	}

	get Kind() { return CommandKindEnum.STOP_AND_DRAW; }

	static Format(otherUser) {
		// return 'User ' + otherUser + ' started to draw path';
		return localizeMessageOpts('game.usrStartedPath', { other: otherUser },
			'User ' + otherUser + ' started to draw path');
	}
}

class PlayerPointsAndPathsDTO extends DtoMsg {
	constructor(points = [], paths = []) {
		super();
		this.Points = points;
		this.Paths = paths;
	}

	get Kind() { return CommandKindEnum.POINTS_AND_PATHS; }

	static UnMinimizePoints(points, iPlayerID, iOtherPlayerId) {
		//Un-Minimize amount of data transported on the wire through SignalR or on the page: status field
		const DataUnMinimizerStatus = (status) => status - 3;

		//Un-Minimize amount of data transported on the wire through SignalR or on the page: player id field
		const DataUnMinimizerPlayerId = (playerId) => playerId === 1 ? iPlayerID : iOtherPlayerId;

		const res = points.map(([x, y, Status, iPlayerId]) => ({
			x,
			y,
			Status: DataUnMinimizerStatus(Status),
			iPlayerId: DataUnMinimizerPlayerId(iPlayerId)
		}));
		return res;
	}

	static Deserialize(ppDTO, iPlayerID, iOtherPlayerId) {
		const serialized = `{ "Points": ${ppDTO.Points || ppDTO.points}, "Paths": ${ppDTO.Paths || ppDTO.paths} }`;
		const path_and_point = JSON.parse(serialized);

		const points = PlayerPointsAndPathsDTO.UnMinimizePoints(path_and_point.Points, iPlayerID, iOtherPlayerId);

		return { Points: points, Paths: path_and_point.Paths };
	}
}

class ApplicationUserSettings extends DtoMsg {
	constructor({ DesktopNotifications = false, ShowChatNotifications = false }) {
		super();
		this.DesktopNotifications = DesktopNotifications;
		this.ShowChatNotifications = ShowChatNotifications;
	}

	get Kind() { return CommandKindEnum.USER_SETTINGS; }

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
	#countdownSeconds;
	#totalSeconds;
	#id;
	#label;
	#countdownReachedHandler;

	constructor({
		countdownSeconds = 60,
		labelSelector = null,
		initialStart = false,
		countdownReachedHandler = undefined
	} = {}) {
		this.#countdownSeconds = countdownSeconds;
		this.#totalSeconds = this.#countdownSeconds;
		this.#id = -1;
		this.#label = null;
		this.#countdownReachedHandler = countdownReachedHandler;
		if (labelSelector)
			this.#label = document.querySelector(labelSelector);

		if (initialStart)
			this.Start();
	}

	#setTimeFunc() {
		if ((--this.#totalSeconds) <= 0) {
			this.Stop();
			if (this.#countdownReachedHandler)
				this.#countdownReachedHandler(this.#label);
		}
		else if (this.#label) {
			this.#label.textContent = this.#pad(parseInt(this.#totalSeconds / 60)) +
				':' + this.#pad(this.#totalSeconds % 60);
		}
	}

	#pad(val) {
		const valString = val + "";
		if (valString.length < 2) {
			return "0" + valString;
		} else {
			return valString;
		}
	}

	Start() {
		this.Stop();
		this.#id = setInterval(this.#setTimeFunc.bind(this), 1000);
	}

	Stop() {
		if (this.#id > 0)
			clearInterval(this.#id);
		if (this.#label)
			this.#label.textContent = '';
	}

	Reset({
		countdownSeconds = 60,
		labelSelector = null,
		initialStart = false,
		countdownReachedHandler = undefined
	} = {}) {
		this.#countdownSeconds = countdownSeconds;
		this.#totalSeconds = this.#countdownSeconds;
		this.#label = null;
		this.#countdownReachedHandler = countdownReachedHandler;
		if (labelSelector)
			this.#label = document.querySelector(labelSelector);

		if (initialStart)
			this.Start();
	}
}

class MessagesRingBufferStore {
	#storeKeyName;
	#store;
	#size;
	#conversationHash;

	constructor(store) {
		this.#storeKeyName = "IB_MessagesBuffer";
		this.#store = store;
		this.#size = 16;
		this.#conversationHash = null;
	}

	#deserializeStoreToMessages() {
		const raw = this.#store.getItem(this.#storeKeyName);
		if (!raw)
			return [];
		else {
			const struct = JSON.parse(raw);
			if (!struct.conversationHash || struct.conversationHash !== this.#conversationHash)
				return [];
			return struct.msgs || [];
		}
	}

	#serializeMessagesToStore(msgArr) {
		const struct = {
			conversationHash: this.#conversationHash,
			msgs: msgArr
		};
		const raw = JSON.stringify(struct);
		this.#store.setItem(this.#storeKeyName, raw);
	}

	#createMessageEntry(control, message, isMine, bIsPlayingWithRed, elPlayer1Name, elPlayer2Name) {
		let userName, colorClass;
		const li = document.createElement("li");
		const span = document.createElement("span");
		if (isMine) {
			if (bIsPlayingWithRed) {
				userName = elPlayer1Name.textContent;
				colorClass = 'red';
			}
			else {
				userName = elPlayer2Name.textContent;
				colorClass = 'blue';
			}
			li.className = "text-end py-1";
		}
		else {
			if (bIsPlayingWithRed) {
				userName = elPlayer2Name.textContent;
				colorClass = 'blue';
			}
			else {
				userName = elPlayer1Name.textContent;
				colorClass = 'red';
			}
			li.className = "text-start py-1";
		}
		span.textContent = message;
		span.classList = `px-1 rounded ${colorClass} message`;

		const userspan = document.createElement("span");
		userspan.textContent = `${userName}:`;
		userspan.classList = 'fst-italic username';

		li.appendChild(userspan);
		li.appendChild(span);
		control.appendChild(li);
		return li;
	}

	/**
	 * Append message to ring buffer and display it regularly on list
	 * @param {string} message text of user massage to add
	 * @param {boolean} isMineMessage is message from me or opponent
	 * @param {string} sMsgListSel name of parent list element to add messages to
	 * @param {boolean} bIsPlayingWithRed playing color of player
	 * @param {Element} elPlayer1Name P1 element holding name
	 * @param {Element} elPlayer2Name P2 element holding name
	 */
	Append(message, isMineMessage, sMsgListSel, bIsPlayingWithRed, elPlayer1Name, elPlayer2Name) {
		const msgs = this.#deserializeStoreToMessages();
		msgs.push({
			msg: message, mine: isMineMessage
		});
		if (msgs.length > this.#size)
			msgs.shift();

		this.#serializeMessagesToStore(msgs);

		const control = document.querySelector(sMsgListSel);
		const last_li = this.#createMessageEntry(control, message, isMineMessage,
			bIsPlayingWithRed, elPlayer1Name, elPlayer2Name);
		last_li.scrollIntoView();
	}

	/**
	 * Restores messages from ring buffer in storage (if any) and displays it on screen
	 * @param {string} sMsgListSel name of parent list element to add messages to
	 * @param {number} iPlayerID this player id
	 * @param {number} iOtherPlayerId other player id
	 * @param {boolean} bIsPlayingWithRed playing color of player
	 * @param {Element} elPlayer1Name P1 element holding name
	 * @param {Element} elPlayer2Name P2 element holding name
	 */
	RestoreMessages(sMsgListSel, iPlayerID, iOtherPlayerId, bIsPlayingWithRed, elPlayer1Name, elPlayer2Name) {
		if (iPlayerID && iOtherPlayerId)
			this.#conversationHash = `${iPlayerID}_${iOtherPlayerId}`;
		else
			this.#conversationHash = null;

		const msgs = this.#deserializeStoreToMessages();
		const control = document.querySelector(sMsgListSel);
		if (control) {
			msgs.forEach(({ msg, mine }) =>
				this.#createMessageEntry(control, msg, mine, bIsPlayingWithRed, elPlayer1Name, elPlayer2Name)
			);
		}
	}
}

/**
 * Loads modules dynamically
 * don't break webpack logic here! https://webpack.js.org/guides/code-splitting/
 * //@param {object} gameOptions is an entry starter object defining game parameters
 */
async function importAllModulesAsync(/* gameOptions */) {
	const importMetaUrl = import.meta.url;//do not optimize, take into separate variable, miss..feature of terser-5.16.6
	const url = new URL(importMetaUrl);
	IBversionHash = url.searchParams.get('v');

	const selfFileName = url.pathname.split('/').at(-1);
	const isMinified = selfFileName.indexOf("min") !== -1;

	({
		LocalLog,
		LocalError,
		// LocalWarning,
		// AABB,
		LocalAlert,
		StatusEnum,
		hasDuplicates,
		pnpoly,
		SvgVml,
		GameStateStore,
		IsPointOutsideAllPaths,
		sortPointsClockwise,
		Sleep,
		RandomColor
	} = isMinified
			? await import(/* webpackChunkName: "shared.Min" */'./shared.min.js?v=' + IBversionHash)
			: await import(/* webpackChunkName: "shared" */'./shared.js?v=' + IBversionHash));

	// //for CPU game enable AI libs and calculations
	// if (gameOptions.iOtherPlayerID === -1) {
	// 	// AIBundle = await import(/* webpackChunkName: "AIDeps" */'./AIBundle.js');
	//
	// 	// import depthFirstSearch from "./depthFirstSearch.js";
	// 	const module = await import('./depthFirstSearch.js?v=' + IBversionHash);
	// 	depthFirstSearch = module.default;
	// }
}

/* Old code
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
*/

/**
 * local localization of leys/messages agnostic to i18n availability
 * @param {string} locKey i18n localization key
 * @param {string} locFallbackMsg fallback message if i18n is not available
 * @returns {string} message to use
 */
function localizeMessage(locKey, locFallbackMsg) {
	if (localizeSelector)
		return i18next.t('ib:' + locKey);
	else
		return locFallbackMsg;
}

/**
 * local localization of leys/messages agnostic to i18n availability
 * @param {string} locKey i18n localization key
 * @param {object} opts i18n attribute-options object
 * @param {string} locFallbackMsg fallback message if i18n is not available
 * @returns {string} message to use
 */
function localizeMessageOpts(locKey, opts, locFallbackMsg) {
	if (localizeSelector)
		return i18next.t('ib:' + locKey, opts);
	else
		return locFallbackMsg;
}

/**
 * The sanitizeUrl function ensures that a given URL is valid and safe to use. It attempts to parse the URL using the URL constructor
 * @param {string} url url for sanitization
 * @returns {string} secured url or null if not possible
 */
function sanitizeUrl(url) {
	try {
		const parsedUrl = new URL(url, window.location.origin); // Use the current origin as the base
		return parsedUrl.href; // Return the sanitized URL
	} catch {
		LocalError("Invalid URL: " + url);
		return null; // Return null or a safe fallback if the URL is invalid
	}
}

class InkBallGame {
	#SignalRConnection;
	#MessagesRingBufferStore;
	#iGameID;
	#iPlayerID;
	#iOtherPlayerId;
	// #iDelayBetweenMultiCaptures;
	// #iSlowdownLevel;
	#iGridWidth;
	#iGridHeight;
	#iGridSpacingX;
	// #iGridSpacingY;
	#iLastX;
	#iLastY;
	#iLastLastX;
	#iLastLastY;
	#iMouseX;
	#iMouseY;
	// #iPosX;
	// #iPosY;
	#bIsCPUGame;
	// #bIsWon;
	#bPointsAndPathsLoaded;
	#Timer;
	#ReconnectTimer;
	// #WaitStartTime;
	#TimerOpts;
	#LineStrokeWidth;
	#Screen;
	#spDebug;
	#Player1Name;
	#Player2Name;
	#SurrenderButton;
	#sMsgInputSel;
	#sMsgSendButtonSel;
	#sMsgListSel;
	#CancelPath;
	#StopAndDraw;
	#bMouseDown;
	#bHandlingEvent;
	#bDrawLines;
	// #sMessage;
	#bIsPlayingWithRed;
	#bIsThisPlayer1;
	#bIsPlayerActive;
	#GameStatus;
	#sDotColor;
	#Line;
	#Lines;
	#Points;
	#bViewOnly;
	#MouseCursorOval;
	#ApplicationUserSettings;
	#sLastMoveGameTimeStamp;
	#sVersion;
	#Worker;
	#rAF_StartTimeStamp;
	#rAF_FrameID;
	#workingCyclePolyLine;
	#cyclesFound;
	#AIMethod;
	#COLOR_RED;
	#COLOR_BLUE;
	#COLOR_OWNED_RED;
	#COLOR_OWNED_BLUE;
	#DRAWING_PATH_COLOR;
	#iConnErrCount;
	#iExponentialBackOffMillis;
	// #GameType;
	#CursorPos;
	#SvgVml;

	/**
	 * InkBallGame constructor
	 * @param {number} iGameID ID of a game
	 * @param {number} iPlayerID player ID
	 * @param {number} iOtherPlayerID player ID
	 * @param {string} sHubName SignalR hub name
	 * @param {object} loggingLevel log level for SignalR
	 * @param {object} hubProtocol Json or messagePack
	 * @param {object} transportType websocket, server events or long polling
	 * @param {number} serverTimeoutInMilliseconds If the server hasn't sent a message in this interval, the client considers the server disconnected
	 * @param {GameTypeEnum} gameType of game enum as string
	 * @param {boolean} bIsPlayingWithRed true - red, false - blue
	 * @param {boolean} bIsThisPlayer1 - if this player is P1 or P2
	 * @param {boolean} bIsPlayerActive is this player active now
	 * @param {boolean} bViewOnly only viewing the game no interaction
	 * @param {number} pathAfterPointDrawAllowanceSecAmount is number of seconds, a player is allowed to start drawing path after putting point
	 */
	constructor(iGameID, iPlayerID, iOtherPlayerID, sHubName, loggingLevel, hubProtocol, transportType, serverTimeoutInMilliseconds,
		gameType, bIsPlayingWithRed = true, bIsThisPlayer1 = true, bIsPlayerActive = true, bViewOnly = false,
		pathAfterPointDrawAllowanceSecAmount = 60) {
		this.#iGameID = iGameID;
		this.#iPlayerID = iPlayerID;
		this.#iOtherPlayerId = iOtherPlayerID;
		this.#bIsCPUGame = this.#iOtherPlayerId === -1;
		// this.#GameType = GameTypeEnum[gameType];
		this.#iConnErrCount = 0;
		this.#iExponentialBackOffMillis = 2000;
		this.#COLOR_RED = 'var(--redish)';
		this.#COLOR_BLUE = 'var(--bluish)';
		this.#COLOR_OWNED_RED = 'var(--owned_by_red)';
		this.#COLOR_OWNED_BLUE = 'var(--owned_by_blue)';
		this.#DRAWING_PATH_COLOR = "var(--path_draw)";
		// this.#bIsWon = false;
		this.#bPointsAndPathsLoaded = false;
		// this.#iDelayBetweenMultiCaptures = 4000;
		this.#Timer = null;
		this.#ReconnectTimer = null;
		// this.#WaitStartTime = null;
		this.#TimerOpts = {
			countdownSeconds: pathAfterPointDrawAllowanceSecAmount,
			labelSelector: "#debug2",
			initialStart: true,
			countdownReachedHandler: this.#CountDownReachedHandler.bind(this)
		};
		// this.#iSlowdownLevel = 0;
		this.#iGridWidth = 0;
		this.#iGridHeight = 0;
		this.#iGridSpacingX = 0;
		// this.#iGridSpacingY = 0;
		// this.#PointRadius = "var(--point_radius)";
		this.#LineStrokeWidth = 0;
		this.#iLastX = -1;
		this.#iLastY = -1;
		this.#iLastLastX = -1;
		this.#iLastLastY = -1;
		this.#iMouseX = 0;
		this.#iMouseY = 0;
		// this.#iPosX = 0;
		// this.#iPosY = 0;
		this.#Screen = null;
		this.#spDebug = null;
		this.#Player1Name = null;
		this.#Player2Name = null;
		this.#SurrenderButton = null;
		this.#sMsgInputSel = null;
		this.#sMsgSendButtonSel = null;
		this.#sMsgListSel = null;
		this.#CancelPath = null;
		this.#StopAndDraw = null;
		this.#bMouseDown = false;
		this.#bHandlingEvent = false;
		this.#bDrawLines = !true;
		// this.#sMessage = '';
		this.#bIsPlayingWithRed = bIsPlayingWithRed;
		this.#bIsThisPlayer1 = bIsThisPlayer1;
		this.#bIsPlayerActive = bIsPlayerActive;
		this.#sDotColor = this.#bIsPlayingWithRed ? this.#COLOR_RED : this.#COLOR_BLUE;
		this.#SvgVml = null;
		this.#Line = null;
		this.#Lines = null;
		this.#Points = null;
		this.#bViewOnly = bViewOnly;
		this.#MouseCursorOval = null;
		this.#CursorPos = { x: -1, y: -1 };
		this.#ApplicationUserSettings = null;
		this.#sLastMoveGameTimeStamp = null;
		this.#sVersion = null;
		this.#Worker = null;



		if (sHubName === null || sHubName === "") return;

		this.#SignalRConnection = new signalR.HubConnectionBuilder()
			.withUrl(sHubName, {
				transport: transportType,
				accessTokenFactory: () => `iGameID=${this.#iGameID}&iPlayerID=${this.#iPlayerID}`
			})
			.withHubProtocol(hubProtocol)
			.configureLogging(loggingLevel)
			.build();
		this.#SignalRConnection.serverTimeoutInMilliseconds = serverTimeoutInMilliseconds;


		this.#SignalRConnection.onclose(async (err) => {
			if (err !== null && err !== undefined) {
				LocalError(err);

				this.#Screen.style.cursor = "not-allowed";
				this.#iConnErrCount++;
				setTimeout(() => this.#Connect(), 4000 +
					(this.#iExponentialBackOffMillis * Math.max(this.#iConnErrCount, 5))//exponential back-off
				);
			}
		});
	}

	async #GetPlayerPointsAndPaths() {
		if (this.#bPointsAndPathsLoaded === false) {
			const ppDTO = await this.#SignalRConnection.invoke("GetPlayerPointsAndPaths", this.#bViewOnly, this.#iGameID);
			//LocalLog(ppDTO);

			const path_and_point = PlayerPointsAndPathsDTO.Deserialize(ppDTO, this.#iPlayerID, this.#iOtherPlayerId);
			if (path_and_point.Points !== undefined)
				await this.#SetAllPoints(path_and_point.Points);
			if (path_and_point.Paths !== undefined)
				await this.#SetAllPaths(path_and_point.Paths);

			this.#bPointsAndPathsLoaded = true;

			return true;
		}
		else
			return false;
	}

	async #Connect() {
		try {
			await this.#SignalRConnection.start();
			this.#iConnErrCount = 0;
			LocalLog('connected; iConnErrCount = ' + this.#iConnErrCount);

			if (this.#bViewOnly === false) {
				if (sessionStorage.getItem("ApplicationUserSettings") === null) {
					let settings = await this.#SignalRConnection.invoke("GetUserSettings");
					if (settings) {
						LocalLog(settings);
						settings = ApplicationUserSettings.Deserialize(settings);
						const to_store = ApplicationUserSettings.Serialize(settings);

						sessionStorage.setItem("ApplicationUserSettings", to_store);
					}
					this.#ApplicationUserSettings = new ApplicationUserSettings(settings);

					await this.#GetPlayerPointsAndPaths();
				}
				else {
					const json = sessionStorage.getItem("ApplicationUserSettings");
					const settings = ApplicationUserSettings.Deserialize(json);

					this.#ApplicationUserSettings = new ApplicationUserSettings(settings);
				}
			}
			if (this.#bPointsAndPathsLoaded === false) {
				await this.#GetPlayerPointsAndPaths();
			}
			if (this.#ApplicationUserSettings !== null && this.#ApplicationUserSettings.DesktopNotifications === true) {
				this.#SetupNotifications();
			}

			if (true === this.#bIsCPUGame && !this.#bIsPlayerActive)
				this.#StartCPUCalculation();
		}
		catch (err) {
			LocalError(err + '; iConnErrCount = ' + this.#iConnErrCount);

			this.#Screen.style.cursor = "not-allowed";
			this.#iConnErrCount++;
			setTimeout(() => this.#Connect(), 4000 +
				(this.#iExponentialBackOffMillis * Math.max(this.#iConnErrCount, 5))//exponential back-off
			);
		}
	}

	#SetupNotifications() {
		if (!window.Notification) {
			LocalLog(localizeMessage('game.browsNoNotif', 'Browser does not support notifications.'));
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
						LocalLog(localizeMessage('game.usrBlockNotif', 'User blocked notifications.'));
						return false;
					}
				}.bind(this)).catch(function (err) {
					LocalError(err);
					return false;
				});
			}
		}
	}

	#NotifyBrowser(
		title = localizeMessage('game.notifTitle', 'Hi there!'),
		body = localizeMessage('game.notifBody', 'How are you doing?')
	) {
		if (!document.hidden || this.#ApplicationUserSettings === null || this.#ApplicationUserSettings?.DesktopNotifications !== true)
			return false;

		if (!window.Notification) {
			LocalLog(localizeMessage('game.browsNoNotif', 'Browser does not support notifications.'));
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
						LocalLog(localizeMessage('game.usrBlockNotif', 'User blocked notifications.'));
						return false;
					}
				}.bind(this)).catch(function (err) {
					LocalError(err);
					return false;
				});
			}
		}
	}

	/**
	 * Start connection to SignalR
	 * @param {boolean} loadPointsAndPathsFromSignalR load points and path through SignalR
	 * @returns {Promise} promise resolving when connected
	 */
	async #StartSignalRConnection(loadPointsAndPathsFromSignalR) {
		if (this.#SignalRConnection === null) return Promise.reject(new Error(localizeMessage('err.signalrNull', "signalr conn is null")));
		if (false === this.#bPointsAndPathsLoaded)
			this.#bPointsAndPathsLoaded = !loadPointsAndPathsFromSignalR;

		this.#SignalRConnection.on("ServerToClientPoint", async (point) => {
			if (this.#iPlayerID !== point.iPlayerId) {
				const user = this.#bIsPlayingWithRed ? this.#Player2Name.textContent : this.#Player1Name.textContent;
				let encodedMsg = InkBallPointViewModel.Format(user, point);

				if (this.#ApplicationUserSettings !== null && this.#ApplicationUserSettings?.ShowChatNotifications === true) {
					const li = document.createElement("li");
					li.textContent = encodedMsg;
					li.style = "font-style:italic";
					document.querySelector(this.#sMsgListSel).appendChild(li);
				}

				this.#NotifyBrowser(localizeMessage('game.newPoint', 'New Point'), encodedMsg);
			}
			await this.#ReceivedPointProcessing(point);

		});

		this.#SignalRConnection.on("ServerToClientPath", async (dto) => {
			if (Object.prototype.hasOwnProperty.call(dto, 'PointsAsString') || Object.prototype.hasOwnProperty.call(dto, 'pointsAsString')) {
				let path = dto;
				if (this.#iPlayerID !== path.iPlayerId) {
					const user = this.#bIsPlayingWithRed ? this.#Player2Name.textContent : this.#Player1Name.textContent;
					const encodedMsg = InkBallPathViewModel.Format(user, path);

					if (this.#ApplicationUserSettings !== null && this.#ApplicationUserSettings?.ShowChatNotifications === true) {
						const li = document.createElement("li");
						li.textContent = encodedMsg;
						li.style = "font-style:italic";
						document.querySelector(this.#sMsgListSel).appendChild(li);
					}

					this.#NotifyBrowser(localizeMessage('game.newPath', 'New Path'), encodedMsg);
				}
				this.#ReceivedPathProcessing(path);
			}
			else if (Object.prototype.hasOwnProperty.call(dto, 'WinningPlayerId') || Object.prototype.hasOwnProperty.call(dto, 'winningPlayerId')) {
				let win = dto;
				const encodedMsg = WinCommand.Format(win);

				let li = document.createElement("li");
				li.textContent = encodedMsg;
				document.querySelector(this.#sMsgListSel).appendChild(li);

				await this.#ReceivedWinProcessing(win);
				this.#NotifyBrowser(localizeMessage('game.weHaveWinner', 'We have a winner'), encodedMsg);
			}
			else
				throw new Error(localizeMessage('err.kind.serv2Cl', "ServerToClientPath - bad Kind!"));

		});

		this.#SignalRConnection.on("ServerToClientPlayerJoin", async (join) => {
			const iOtherPlayerId = join.OtherPlayerId || join.otherPlayerId;
			this.#iOtherPlayerId = iOtherPlayerId;
			const sMsg = PlayerJoiningCommand.Format(join);

			document.querySelector('.msgchat').dataset.otherplayerid = this.#iOtherPlayerId;

			const li = document.createElement("li");
			const strong = document.createElement("strong");
			strong.classList.add('text-primary');
			// strong.textContent = sMsg;
			li.appendChild(strong);
			document.querySelector(this.#sMsgListSel).appendChild(li);

			const encodedMsg = sMsg.split(';');
			if (localizeSelector) {

				strong.dataset.i18n = 'ib:game.plXJoining';
				strong.dataset.i18nOptions = `{ "usr": "${join.OtherPlayerName || join.otherPlayerName}" }`;

				localizeSelector(this.#sMsgListSel);
			}
			else
				strong.textContent = encodedMsg;


			if (this.#SurrenderButton !== null) {
				if (join.OtherPlayerName !== '') {
					this.#Player2Name.textContent = join.OtherPlayerName || join.otherPlayerName;
					this.#SurrenderButton.value = 'surrender';

					if (localizeSelector)
						this.#SurrenderButton.dataset.i18n = 'ib:game.back2List';
					else
						this.#SurrenderButton.textContent = 'surrender';

					this.#ShowStatusI18n('game.yourMove', 'Your move');
				}
			}

			this.#MessagesRingBufferStore.RestoreMessages(this.#sMsgListSel, this.#iPlayerID, this.#iOtherPlayerId, this.#bIsPlayingWithRed, this.#Player1Name, this.#Player2Name);

			this.#NotifyBrowser(localizeMessage('game.plJoining', 'Player joining'), encodedMsg);

			this.#bHandlingEvent = false;
		});

		this.#SignalRConnection.on("ServerToClientPlayerSurrender", (surrender) => {

			let encodedMsg = PlayerSurrenderingCommand.Format(surrender);

			const li = document.createElement("li");
			const strong = document.createElement("strong");
			strong.classList.add('text-warning');
			li.appendChild(strong);
			document.querySelector(this.#sMsgListSel).appendChild(li);

			const user = this.#bIsPlayingWithRed ? this.#Player2Name.textContent : this.#Player1Name.textContent;
			let title;
			const [sMsg, i18l_key] = encodedMsg.split(';');
			if (i18l_key && localizeSelector) {
				strong.dataset.i18n = `ib:game.${i18l_key}`;
				strong.dataset.i18nOptions = `{ "usr": "${user}" }`;

				localizeSelector(this.#sMsgListSel);

				title = localizeMessage('game.gameIntrpt!', 'Game interrupted!');
				encodedMsg = encodedMsg === '' ? title : localizeMessageOpts(`game.${i18l_key}`, { "usr": user }, `Player ${user} surrenders`);
			}
			else {
				strong.textContent = sMsg;

				title = 'Game interrupted!';
				encodedMsg = sMsg === '' ? title : sMsg;
			}

			this.#bHandlingEvent = false;

			this.#NotifyBrowser(title, encodedMsg);
			LocalAlert(encodedMsg, title, () => {
				window.location.href = "GamesList";
			});
		});

		this.#SignalRConnection.on("ServerToClientPlayerWin", async (win) => {
			const encodedMsg = WinCommand.Format(win);

			const msg_lst = document.querySelector(this.#sMsgListSel);
			if (msg_lst !== null) {
				const li = document.createElement("li");
				const strong = document.createElement("strong");
				strong.classList.add('text-warning');
				strong.textContent = encodedMsg;
				li.appendChild(strong);
				msg_lst.appendChild(li);
			}

			await this.#ReceivedPathProcessing(win.Path || win.path);

			await this.#ReceivedWinProcessing(win);
			this.#NotifyBrowser(localizeMessage('game.weHaveWinner', 'We have a winner'), encodedMsg);

		});

		this.#SignalRConnection.on("ServerToClientPing", (ping) => {
			// const userName = this.#bIsPlayingWithRed ? this.#Player2Name.textContent : this.#Player1Name.textContent;
			const encodedMsg = PingCommand.Format(/* userName,  */ping);

			this.#MessagesRingBufferStore.Append(encodedMsg, false, this.#sMsgListSel, this.#bIsPlayingWithRed,
				this.#Player1Name, this.#Player2Name);

			this.#NotifyBrowser(localizeMessage('game.usrMsg', 'User Message'), encodedMsg);

		});

		this.#SignalRConnection.on("ServerToClientOtherPlayerDisconnected", (sMsg) => {
			const opts = {
				countdownSeconds: 5,
				labelSelector: null,
				initialStart: true,
				countdownReachedHandler: () => {
					let [encodedMsg, usr] = sMsg.split(';');
					const li = document.createElement("li");
					const strong = document.createElement("strong");
					strong.classList.add('text-warning');
					if (localizeSelector) {
						li.appendChild(strong);
						document.querySelector(this.#sMsgListSel).appendChild(li);
						strong.dataset.i18n = 'ib:game.othPlDisc';
						strong.dataset.i18nOptions = `{ "usr": "${usr}" }`;

						encodedMsg = localizeMessageOpts('game.othPlDisc', { "usr": usr }, 'User disconnected'),

							localizeSelector(this.#sMsgListSel);
					}
					else {
						strong.textContent = encodedMsg;
						li.appendChild(strong);
						document.querySelector(this.#sMsgListSel).appendChild(li);
					}

					this.#NotifyBrowser(localizeMessage('game.usrDisc', 'User disconnected'), encodedMsg);
					this.#ReconnectTimer = null;
				}
			};
			if (this.#ReconnectTimer)
				this.#ReconnectTimer.Reset(opts);
			else
				this.#ReconnectTimer = new CountdownTimer(opts);
		});

		this.#SignalRConnection.on("ServerToClientOtherPlayerConnected", (sMsg) => {
			if (this.#ReconnectTimer) {
				this.#ReconnectTimer.Stop();
				this.#ReconnectTimer = null;
			}
			else {
				let [encodedMsg, usr] = sMsg.split(';');
				const li = document.createElement("li");
				const strong = document.createElement("strong");
				strong.classList.add('text-primary');
				if (localizeSelector) {
					li.appendChild(strong);
					document.querySelector(this.#sMsgListSel).appendChild(li);
					strong.dataset.i18n = 'ib:game.othPlConn';
					strong.dataset.i18nOptions = `{ "usr": "${usr}" }`;

					encodedMsg = localizeMessageOpts('game.othPlConn', { "usr": usr }, 'User connected'),

						localizeSelector(this.#sMsgListSel);
				}
				else {
					strong.textContent = encodedMsg;
					li.appendChild(strong);
					document.querySelector(this.#sMsgListSel).appendChild(li);
				}

				this.#NotifyBrowser(localizeMessage('game.usrCon', 'User connected'), encodedMsg);
				this.#ReconnectTimer = null;
			}
		});

		this.#SignalRConnection.on("ServerToClientStopAndDraw", (cmd) => {
			if (!cmd) return;

			const user = this.#bIsPlayingWithRed ? this.#Player2Name.textContent : this.#Player1Name.textContent;
			const encodedMsg = StopAndDrawCommand.Format(user);

			const li = document.createElement("li");
			const strong = document.createElement("strong");
			strong.classList.add('text-info');
			strong.textContent = encodedMsg;
			li.appendChild(strong);
			document.querySelector(this.#sMsgListSel).appendChild(li);

			this.#NotifyBrowser(localizeMessageOpts('game.usrStrtDraw', { user }, `User ${user} started drawing new path`), encodedMsg);
		});

		if (false === this.#bIsCPUGame) {
			document.querySelector(this.#sMsgSendButtonSel).addEventListener("click", async (event) => {
				event.preventDefault();

				const encodedMsg = document.querySelector(this.#sMsgInputSel).value.trim();
				if (encodedMsg === '') return;

				let ping = new PingCommand(encodedMsg);

				await this.#SendData(ping);

			}, false);

			// Execute a function when the user releases a key on the keyboard
			document.querySelector(this.#sMsgInputSel).addEventListener("keyup", (event) => {
				event.preventDefault();// Cancel the default action, if needed

				if (event.keyCode === 13) {// Number 13 is the "Enter" key on the keyboard
					// Trigger the button element with a click
					document.querySelector(this.#sMsgSendButtonSel).click();
				}
			}, false);
		}

		return this.#Connect();
	}

	/**
	 * Stops SignalR connection in graceful way
	 */
	StopSignalRConnection() {
		if (this.#SignalRConnection !== null) {
			this.#SignalRConnection.stop();

			//cleanup
			if (this.#ReconnectTimer)
				this.#ReconnectTimer.Stop();
			if (this.#Timer)
				this.#Timer.Stop();

			LocalLog(localizeMessage('game.stpSignRCon', 'Stopped SignalR connection'));
		}
	}

	#ShowMouseXYPos(msg) {
		const d = document.getElementById('debug1');
		d.textContent = msg;
	}

	#Debug(...args) {
		switch (args.length) {
			case 1:
				this.#spDebug.textContent = args[0];
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

	/**
	 * Localize Debug section
	 * @param {string} msg key of message to load/localize
	 * @param {string} fallbackMsg fallback message to show instead
	 */
	#DebugI18n(msg, fallbackMsg) {
		const d = document.getElementById('debug0');
		d.dataset.i18n = (msg.indexOf('ib:') !== -1 ? msg : 'ib:' + msg);
		if (localizeSelector && msg !== '')
			localizeSelector('#debug0');
		else
			d.textContent = fallbackMsg;
	}

	async #SetPoint(iX, iY, iStatus, iPlayerId) {
		if (await this.#Points.has(iY * this.#iGridWidth + iX))
			return;

		const x = iX;
		const y = iY;

		const oval = this.#SvgVml.CreateOval(/* this.#PointRadius */);
		oval.move(x, y);

		let color;
		switch (iStatus) {
			case StatusEnum.POINT_FREE_RED:
				color = this.#COLOR_RED;
				oval.SetStatus(iStatus/*StatusEnum.POINT_FREE*/);
				break;
			case StatusEnum.POINT_FREE_BLUE:
				color = this.#COLOR_BLUE;
				oval.SetStatus(iStatus/*StatusEnum.POINT_FREE*/);
				break;
			case StatusEnum.POINT_FREE:
				color = this.#sDotColor;
				oval.SetStatus(iStatus/*StatusEnum.POINT_FREE*/);
				//console.warn('TODO: generic FREE point, really? change it!');
				break;
			case StatusEnum.POINT_STARTING:
				color = this.#sDotColor;
				oval.SetStatus(iStatus);
				break;
			case StatusEnum.POINT_IN_PATH:
				if (this.#iPlayerID === iPlayerId)//is this point mine?
					color = this.#bIsPlayingWithRed === true ? this.#COLOR_RED : this.#COLOR_BLUE;
				else
					color = this.#bIsPlayingWithRed === true ? this.#COLOR_BLUE : this.#COLOR_RED;
				// oval.SetFillColor(color);
				oval.SetStatus(iStatus);
				break;
			case StatusEnum.POINT_OWNED_BY_RED:
				color = this.#COLOR_OWNED_RED;
				oval.SetStatus(iStatus);
				break;
			case StatusEnum.POINT_OWNED_BY_BLUE:
				color = this.#COLOR_OWNED_BLUE;
				oval.SetStatus(iStatus);
				break;
			default:
				LocalAlert(localizeMessage('game.badPoint', 'bad point'), localizeMessage('err.err!', 'Error!'));
				// alert('bad point');
				break;
		}

		oval.SetFillColor(color);
		// oval.SetStrokeColor(color);

		await this.#Points.set(iY * this.#iGridWidth + iX, oval);
	}

	#GetGameStateForIndexedDb() {
		return {
			iGameID: this.#iGameID,
			iPlayerID: this.#iPlayerID,
			iOtherPlayerId: this.#iOtherPlayerId,
			sLastMoveGameTimeStamp: this.#sLastMoveGameTimeStamp,
			bPointsAndPathsLoaded: this.#bPointsAndPathsLoaded,
			iGridWidth: this.#iGridWidth,
			iGridHeight: this.#iGridHeight
		};
	}

	/**
	 * Callback method invoked by IndexedDb abstraction store
	 * @param {number} iX point x taken from IndexedDb
	 * @param {number} iY point y taken from IndexedDb
	 * @param {number} iStatus status taken from IndexedDb
	 * @param {string} sColor color taken from IndexedDb
	 * @returns {object} created oval/circle
	 */
	#CreateScreenPointFromIndexedDb(iX, iY, iStatus, sColor) {
		const x = iX;
		const y = iY;

		const oval = this.#SvgVml.CreateOval(/* this.#PointRadius */);
		oval.move(x, y);

		let color;
		switch (iStatus) {
			case StatusEnum.POINT_FREE_RED:
				color = this.#COLOR_RED;
				oval.SetStatus(iStatus/*StatusEnum.POINT_FREE*/);
				break;
			case StatusEnum.POINT_FREE_BLUE:
				color = this.#COLOR_BLUE;
				oval.SetStatus(iStatus/*StatusEnum.POINT_FREE*/);
				break;
			case StatusEnum.POINT_FREE:
				color = this.#sDotColor;
				oval.SetStatus(iStatus/*StatusEnum.POINT_FREE*/);
				//console.warn('TODO: generic FREE point, really? change it!');
				break;
			case StatusEnum.POINT_STARTING:
				color = this.#sDotColor;
				oval.SetStatus(iStatus);
				break;
			case StatusEnum.POINT_IN_PATH:
				color = sColor;
				oval.SetStatus(iStatus);
				break;
			case StatusEnum.POINT_OWNED_BY_RED:
				color = this.#COLOR_OWNED_RED;
				oval.SetStatus(iStatus);
				break;
			case StatusEnum.POINT_OWNED_BY_BLUE:
				color = this.#COLOR_OWNED_BLUE;
				oval.SetStatus(iStatus);
				break;
			default:
				LocalAlert(localizeMessage('err.badPoint', 'bad point'), localizeMessage('err.err!', 'Error!'));
				// alert('bad point');
				break;
		}

		oval.SetFillColor(color);
		// oval.SetStrokeColor(color);

		return oval;
	}

	async #SetAllPoints(points) {

		try {
			await this.#Points.BeginBulkStorage();

			for (const { x, y, Status, iPlayerId } of points) {
				await this.#SetPoint(x, y, Status, iPlayerId);
			}
		}
		finally {
			await this.#Points.EndBulkStorage();
		}
	}

	async #SetPath(packed, bIsRed, bBelong2ThisPlayer, iPathId = 0) {
		const sPoints = packed.split(" ");
		let sDelimiter = "", sPathPoints = "", p = null, x, y,
			status = StatusEnum.POINT_STARTING;
		for (const pair of sPoints) {
			[x, y] = pair.split(",");
			x = parseInt(x); y = parseInt(y);

			p = this.#Points.get(y * this.#iGridWidth + x);
			if (p !== null && p !== undefined) {
				p.SetStatus(status);
				status = StatusEnum.POINT_IN_PATH;
			}

			sPathPoints += `${sDelimiter}${x},${y}`;
			sDelimiter = " ";
		}
		[x, y] = sPoints[0].split(",");
		x = parseInt(x); y = parseInt(y);

		p = this.#Points.get(y * this.#iGridWidth + x);
		if (p !== null && p !== undefined) {
			p.SetStatus(status);
		}

		if (sPoints[0] !== sPoints.at(-1)) {
			sPathPoints += `${sDelimiter}${x},${y}`;
		}

		const line = this.#SvgVml.CreatePolyline(sPathPoints,
			(bBelong2ThisPlayer ? this.#sDotColor : (bIsRed ? this.#COLOR_BLUE : this.#COLOR_RED)));
		line.SetID(iPathId);
		await this.#Lines.push(line);
	}

	async #CreateScreenPathFromIndexedDb(packed, sColor, iPathId) {
		const sPoints = packed.split(" ");
		let sDelimiter = "", sPathPoints = "", p = null, x, y,
			status = StatusEnum.POINT_STARTING;
		for (const pair of sPoints) {
			[x, y] = pair.split(",");
			x = parseInt(x); y = parseInt(y);

			p = this.#Points.get(y * this.#iGridWidth + x);
			if (p !== null && p !== undefined) {
				p.SetStatus(status);
				status = StatusEnum.POINT_IN_PATH;
			}

			sPathPoints += `${sDelimiter}${x},${y}`;
			sDelimiter = " ";
		}
		[x, y] = sPoints[0].split(",");
		x = parseInt(x); y = parseInt(y);

		p = this.#Points.get(y * this.#iGridWidth + x);
		if (p !== null && p !== undefined) {
			p.SetStatus(status);
		}

		if (sPoints[0] !== sPoints.at(-1)) {
			sPathPoints += `${sDelimiter}${x},${y}`;
		}

		const line = this.#SvgVml.CreatePolyline(sPathPoints, sColor);
		line.SetID(iPathId);

		return line;
	}

	async #SetAllPaths(packedPaths) {
		try {
			await this.#Lines.BeginBulkStorage();

			for (const unpacked of packedPaths) {
				//const unpacked = JSON.parse(packed.Serialized);
				//if (unpacked.iGameId !== this.#iGameID)
				//	throw new Error("Bad game from path!");

				await this.#SetPath(unpacked.PointsAsString/*points*/, this.#bIsPlayingWithRed,
					unpacked.iPlayerId === this.#iPlayerID/*isMainPlayerPoints*/, unpacked.iId/*real DB id*/);
			}
		}
		finally {
			await this.#Lines.EndBulkStorage();
		}
	}

	// eslint-disable-next-line no-unused-private-class-members
	#IsPointBelongingToLine(sPoints, iX, iY) {
		for (const packed of sPoints) {
			const [x, y] = packed.split(",");
			if (x === iX && y === iY)
				return true;
		}
		return false;
	}

	async #SurroundOpponentPoints() {
		const points = this.#Line.GetPointsArray();

		//unique point path test (no duplicates except starting-ending point)
		const pts_not_unique = hasDuplicates(points.slice(0, -1).map(pt => pt.x + '_' + pt.y));

		if (pts_not_unique ||
			!(points[0].x === points.at(-1).x && points[0].y === points.at(-1).y)) {
			return {
				OwnedPoints: undefined,
				owned: "",
				path: "",
				errorDesc: {
					key: 'err.ptsNotUniq',
					fallbackMsg: "Points not unique, cancel it or refresh page"
				}
			};
		}
		let sColor, owned_by, sOwnedCol;
		//pick right color, status and owned by status
		if (this.#sDotColor === this.#COLOR_RED) {
			sColor = this.#COLOR_BLUE;
			owned_by = StatusEnum.POINT_OWNED_BY_RED;
			sOwnedCol = this.#COLOR_OWNED_RED;
		}
		else {
			sColor = this.#COLOR_RED;
			owned_by = StatusEnum.POINT_OWNED_BY_BLUE;
			sOwnedCol = this.#COLOR_OWNED_BLUE;
		}
		let sPathPoints = "", sOwnedPoints = "", sDelimiter = "", ownedPoints = [];

		//make the test!
		for (const pt of await this.#Points.values()) {
			if (pt !== undefined && pt.GetFillColor() === sColor &&
				([StatusEnum.POINT_FREE_BLUE, StatusEnum.POINT_FREE_RED].includes(pt.GetStatus()))) {
				const { x, y } = pt.GetPosition();
				if (false !== pnpoly(points, x, y)) {
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
			// sPathPoints = points.map(({ x, y }) => {
			// 	if (x === null || y === null) return '';
			// 	return `${x},${y}`;
			// }).join(' ');

			sPathPoints = points.reduce((acc, { x, y }) => {
				if (x === null || y === null) return '';
				return acc + `${x},${y} `;
			}, '').trimEnd();
		}

		return {
			OwnedPoints: ownedPoints,
			owned: sOwnedPoints,
			PathPoints: [],
			path: sPathPoints,
			errorDesc: {
				key: 'err.noSurrPts',
				fallbackMsg: "No surrounded points, cancel it or refresh page"
			}
		};
	}

	#CreatePutPointRequest(iX, iY) {
		const cmd = new InkBallPointViewModel(this.#iGameID, this.#iPlayerID, iX, iY,
			this.#bIsPlayingWithRed ? StatusEnum.POINT_FREE_RED : StatusEnum.POINT_FREE_BLUE,
			0);
		return cmd;
	}

	/**
	 * Create transferable object holding path points creating it as well as owned points by it
	 * @param {object} dto with path, owned
	 * @returns {object} command
	 */
	#CreatePutPathRequest(dto) {
		const cmd = new InkBallPathViewModel(0, this.#iGameID, this.#iPlayerID, dto.path, dto.owned
			/*, this.#Timer !== null*/);
		return cmd;
	}

	/**
	 * Send data through signalR
	 * @param {object} payload transferrableObject (DTO)
	 * @param {() => void} revertFunction on-error revert/rollback function
	 */
	async #SendData(payload, revertFunction = undefined) {

		switch (payload.Kind) {
			case CommandKindEnum.POINT:
				LocalLog(InkBallPointViewModel.Format(localizeMessage('game.somePlayer', 'some player'), payload));
				this.#bHandlingEvent = true;

				try {
					const timestamp = await this.#SignalRConnection.invoke("ClientToServerPoint", payload);
					payload.TimeStamp = typeof timestamp === 'string' ?
						new Date(timestamp) : timestamp;
					await this.#ReceivedPointProcessing(payload);
				} catch (err) {
					LocalError(err.toString());
					if (revertFunction !== undefined)
						revertFunction();
				}
				break;

			case CommandKindEnum.PATH:
				LocalLog(InkBallPathViewModel.Format(localizeMessage('game.somePlayer', 'some player'), payload));
				this.#bHandlingEvent = true;

				try {
					const dto = await this.#SignalRConnection.invoke("ClientToServerPath", payload);

					if (Object.prototype.hasOwnProperty.call(dto, 'WinningPlayerId') || Object.prototype.hasOwnProperty.call(dto, 'winningPlayerId')) {
						let win = dto;
						await this.#ReceivedWinProcessing(win);
					}
					else if (Object.prototype.hasOwnProperty.call(dto, 'PointsAsString') || Object.prototype.hasOwnProperty.call(dto, 'pointsAsString')) {
						let path = dto;
						await this.#ReceivedPathProcessing(path);
					}
					else
						throw new Error(localizeMessage('err.kind.cl2Srv', "ClientToServerPath - bad Kind!"));
				} catch (err) {
					LocalError(err.toString());
					if (revertFunction !== undefined)
						revertFunction();
				}
				break;

			case CommandKindEnum.PING:
				try {
					await this.#SignalRConnection.invoke("ClientToServerPing", payload);
					document.querySelector(this.#sMsgInputSel).value = '';
					document.querySelector(this.#sMsgSendButtonSel).disabled = 'disabled';

					const msg = payload.Message;
					this.#MessagesRingBufferStore.Append(msg, true, this.#sMsgListSel, this.#bIsPlayingWithRed,
						this.#Player1Name, this.#Player2Name);

					// this.#NotifyBrowser('User Message', encodedMsg);
				} catch (err) {
					LocalError(err.toString());
				}
				break;

			case CommandKindEnum.STOP_AND_DRAW:
				try {
					await this.#SignalRConnection.invoke("ClientToServerStopAndDraw", payload);
					this.#bDrawLines = true;
					this.#iLastX = this.#iLastY = -1;
					this.#Line = null;
					this.#bIsPlayerActive = true;
					this.#StopAndDraw.disabled = 'disabled';

				} catch (err) {
					LocalError(err.toString());
				}
				break;

			default:
				LocalError(localizeMessage('err.unkwnObj', 'unknown object'));
				break;
		}
	}

	/**
	 * Callback handler for time to execute when reaching zero
	 * @param {HTMLElement} label element showing timer text
	 */
	#CountDownReachedHandler(label) {
		if (label)
			label.textContent = '';
		//this.#NotifyBrowser('Time is running out', 'make a move');
		this.#StopAndDraw.disabled = this.#CancelPath.disabled = 'disabled';
		this.#Timer = null;
		this.#bIsPlayerActive = false;
	}

	async #ReceivedPointProcessing(point) {
		const x = point.iX, y = point.iY, iStatus = point.Status !== undefined ? point.Status : point.status;

		this.#sLastMoveGameTimeStamp = (point.TimeStamp !== undefined ?
			point.TimeStamp : new Date(point.timeStamp)
		).toISOString();

		await this.#SetPoint(x, y, iStatus, point.iPlayerId);

		if (this.#iPlayerID !== point.iPlayerId) {
			this.#bIsPlayerActive = true;
			this.#ShowStatusI18n('game.oppMovedYou', 'Opponent has moved, your turn');
			this.#Screen.style.cursor = "crosshair";

			if (this.#Line !== null)
				await this.#OnCancelClick();
			this.#StopAndDraw.disabled = '';
			if (!this.#bDrawLines) {
				// this.#StopAndDraw.value = 'Draw line';
				this.#StopAndDraw.dataset.i18n = 'ib:game.drawLine';
			}
			else {
				// this.#StopAndDraw.value = 'Draw dot';
				this.#StopAndDraw.dataset.i18n = 'ib:game.drawDot';
			}

			if (this.#Timer) {
				this.#Timer.Stop();
				this.#Timer = null;
			}
		}
		else {
			this.#bIsPlayerActive = false;
			this.#ShowStatusI18n('game.waitingForOppo', 'Waiting for opponent move');
			this.#Screen.style.cursor = "wait";
			this.#MouseCursorOval.Hide();
			this.#CancelPath.disabled = 'disabled';
			this.#StopAndDraw.disabled = '';
			// this.#StopAndDraw.value = 'Stop and Draw';
			this.#StopAndDraw.dataset.i18n = 'ib:game.stopAndDraw';

			if (this.#Timer)
				this.#Timer.Reset(this.#TimerOpts);
			else
				this.#Timer = new CountdownTimer(this.#TimerOpts);

			if (true === this.#bIsCPUGame && !this.#bIsPlayerActive)
				this.#StartCPUCalculation();
		}
		this.#bHandlingEvent = false;
	}

	async #ReceivedPathProcessing(path) {

		this.#sLastMoveGameTimeStamp = (path.TimeStamp !== undefined ?
			path.TimeStamp : new Date(path.timeStamp)
		).toISOString();

		if (this.#iPlayerID !== path.iPlayerId) {

			const str_path = path.PointsAsString || path.pointsAsString, owned = path.OwnedPointsAsString || path.ownedPointsAsString;

			await this.#SetPath(str_path,
				(this.#sDotColor === this.#COLOR_RED ? true : false), false, path.iId/*real DB id*/);

			const points = owned.split(" ");
			const point_status = (this.#sDotColor === this.#COLOR_RED ? StatusEnum.POINT_OWNED_BY_RED : StatusEnum.POINT_OWNED_BY_BLUE);
			const sOwnedCol = (this.#sDotColor === this.#COLOR_RED ? this.#COLOR_OWNED_RED : this.#COLOR_OWNED_BLUE);
			for (const packed of points) {
				let [x, y] = packed.split(",");
				x = parseInt(x), y = parseInt(y);
				const p = this.#Points.get(y * this.#iGridWidth + x);
				if (p !== undefined) {
					p.SetStatus(point_status);
					p.SetFillColor(sOwnedCol);
					// p.SetStrokeColor(sOwnedCol);
					await this.#Points.set(y * this.#iGridWidth + x, p);//update the point with new state,col etc.
				}
			}


			this.#bIsPlayerActive = true;
			this.#ShowStatusI18n('game.oppMovedYou', 'Opponent has moved, your turn');
			this.#Screen.style.cursor = "crosshair";
			this.#MouseCursorOval.Hide();

			if (this.#Line !== null)
				await this.#OnCancelClick();
			this.#StopAndDraw.disabled = '';
		}
		else {
			//set starting point to POINT_IN_PATH to block further path closing with it
			let points = this.#Line.GetPointsArray();
			let x = points[0].x, y = points[0].y;
			const p0 = this.#Points.get(y * this.#iGridWidth + x);
			if (p0 !== undefined)
				p0.SetStatus(StatusEnum.POINT_IN_PATH);

			this.#Line.SetWidthAndColor(this.#LineStrokeWidth, this.#sDotColor);
			this.#Line.SetID(path.iId);
			await this.#Lines.push(this.#Line);
			this.#iLastX = this.#iLastY = -1;
			this.#Line = null;

			const owned = path.OwnedPointsAsString || path.ownedPointsAsString;
			points = owned.split(" ");
			const point_status = (this.#sDotColor === this.#COLOR_RED ? StatusEnum.POINT_OWNED_BY_RED : StatusEnum.POINT_OWNED_BY_BLUE);
			const sOwnedCol = (this.#sDotColor === this.#COLOR_RED ? this.#COLOR_OWNED_RED : this.#COLOR_OWNED_BLUE);
			for (const packed of points) {
				let [x, y] = packed.split(",");
				x = parseInt(x), y = parseInt(y);
				const p = this.#Points.get(y * this.#iGridWidth + x);
				if (p !== undefined) {
					p.SetStatus(point_status);
					p.SetFillColor(sOwnedCol);
					// p.SetStrokeColor(sOwnedCol);
					await this.#Points.set(y * this.#iGridWidth + x, p);//update the point with new state,col etc.
				}
			}


			this.#bIsPlayerActive = false;
			this.#ShowStatusI18n('game.waitingForOppo', 'Waiting for opponent move');
			this.#Screen.style.cursor = "wait";
			this.#MouseCursorOval.Hide();

			this.#StopAndDraw.disabled = this.#CancelPath.disabled = 'disabled';

			if (true === this.#bIsCPUGame && !this.#bIsPlayerActive)
				this.#StartCPUCalculation();
		}
		if (!this.#bDrawLines) {
			// this.#StopAndDraw.value = 'Draw line';
			this.#StopAndDraw.dataset.i18n = 'ib:game.drawLine';
		}
		else {
			// this.#StopAndDraw.value = 'Draw dot';
			this.#StopAndDraw.dataset.i18n = 'ib:game.drawDot';
		}
		this.#bHandlingEvent = false;

		if (this.#Timer) {
			this.#Timer.Stop();
			this.#Timer = null;
		}
	}

	async #ReceivedWinProcessing(win) {
		this.#ShowStatusI18n('game.winSituation', 'Victory!');
		this.#bHandlingEvent = false;

		const encodedMsg = WinCommand.Format(win);
		const status = win.Status !== undefined ? win.Status : win.status;
		// const winningPlayerId = win.WinningPlayerId || win.winningPlayerId;

		if (((status === WinStatusEnum.RED_WINS || status === WinStatusEnum.GREEN_WINS) /* && winningPlayerId > 0 */) ||
			status === WinStatusEnum.DRAW_WIN) {

			LocalAlert(encodedMsg === '' ? localizeMessage('err.gameWon!', 'Game won!') : encodedMsg, localizeMessage('game.winSituation', 'Victory!'), () => {
				window.location.href = "GamesList";
			});
		}
	}

	/*
	#Check4Win(playerPaths, otherPlayerPaths, playerPoints, otherPlayerPoints) {
		let owned_status, count;
		switch (this.#GameType) {
			case GameTypeEnum.FIRST_CAPTURE:
				if (playerPaths.length > 0) {
					if (this.#bIsPlayingWithRed)
						return WinStatusEnum.RED_WINS;
					else
						return WinStatusEnum.GREEN_WINS;
				}
				if (otherPlayerPaths.length > 0) {
					if (this.#bIsPlayingWithRed)
						return WinStatusEnum.GREEN_WINS;
					else
						return WinStatusEnum.RED_WINS;
				}
				return WinStatusEnum.NO_WIN;//continue game

			case GameTypeEnum.FIRST_5_CAPTURES:
				owned_status = this.#bIsPlayingWithRed ? StatusEnum.POINT_OWNED_BY_BLUE : StatusEnum.POINT_OWNED_BY_RED;
				count = otherPlayerPoints.filter(function (p) {
					return p.iEnclosingPathId !== null && p.GetStatus() === owned_status;
				}).length;
				if (count >= 5) {
					if (this.#bIsPlayingWithRed)
						return WinStatusEnum.GREEN_WINS;
					else
						return WinStatusEnum.RED_WINS;
				}
				owned_status = this.#bIsPlayingWithRed ? StatusEnum.POINT_OWNED_BY_RED : StatusEnum.POINT_OWNED_BY_BLUE;
				count = playerPoints.filter(function (p) {
					return p.iEnclosingPathId !== null && p.GetStatus() === owned_status;
				}).length;
				if (count >= 5) {
					if (this.#bIsPlayingWithRed)
						return WinStatusEnum.RED_WINS;
					else
						return WinStatusEnum.GREEN_WINS;
				}
				return WinStatusEnum.NO_WIN;//continue game

			case GameTypeEnum.FIRST_5_PATHS:
				if (otherPlayerPaths.length >= 5) {
					if (this.#bIsPlayingWithRed)
						return WinStatusEnum.GREEN_WINS;
					else
						return WinStatusEnum.RED_WINS;
				}
				if (playerPaths.length >= 5) {
					if (this.#bIsPlayingWithRed)
						return WinStatusEnum.RED_WINS;
					else
						return WinStatusEnum.GREEN_WINS;
				}
				return WinStatusEnum.NO_WIN;//continue game

			case GameTypeEnum.FIRST_5_ADVANTAGE_PATHS:
				{
					const diff = playerPaths.length - otherPlayerPaths.length;
					if (diff >= 5) {
						if (this.#bIsPlayingWithRed)
							return WinStatusEnum.RED_WINS;
						else
							return WinStatusEnum.GREEN_WINS;
					}
					else if (diff <= -5) {
						if (this.#bIsPlayingWithRed)
							return WinStatusEnum.GREEN_WINS;
						else
							return WinStatusEnum.RED_WINS;
					}
				}
				return WinStatusEnum.NO_WIN;//continue game

			default:
				throw new Error(localizeMessage('err.wrongGameType', "Wrong game type"));
		}
	}
	*/

	/* #ShowStatus(sMessage = '') {
		if (this.#Player2Name.textContent === '???') {
			if (this.#bIsPlayerActive)
				this.#GameStatus.style.color = this.#COLOR_RED;
			else
				this.#GameStatus.style.color = this.#COLOR_BLUE;
		}
		else if (this.#bIsPlayerActive) {
			if (this.#bIsPlayingWithRed)
				this.#GameStatus.style.color = this.#COLOR_RED;
			else
				this.#GameStatus.style.color = this.#COLOR_BLUE;
		}
		else {
			if (this.#bIsPlayingWithRed)
				this.#GameStatus.style.color = this.#COLOR_BLUE;
			else
				this.#GameStatus.style.color = this.#COLOR_RED;
		}
		if (sMessage !== null && sMessage !== '')
			this.#Debug(sMessage);
		else
			this.#Debug('');
	} */

	#ShowStatusI18n(msgKey, fallbackMsg) {
		if (this.#Player2Name.textContent === '???') {
			if (this.#bIsPlayerActive)
				this.#GameStatus.style.color = this.#COLOR_RED;
			else
				this.#GameStatus.style.color = this.#COLOR_BLUE;
		}
		else if (this.#bIsPlayerActive) {
			if (this.#bIsPlayingWithRed)
				this.#GameStatus.style.color = this.#COLOR_RED;
			else
				this.#GameStatus.style.color = this.#COLOR_BLUE;
		}
		else {
			if (this.#bIsPlayingWithRed)
				this.#GameStatus.style.color = this.#COLOR_BLUE;
			else
				this.#GameStatus.style.color = this.#COLOR_RED;
		}
		if (msgKey !== null && msgKey !== '')
			this.#DebugI18n(msgKey, fallbackMsg);
		else if (fallbackMsg !== null && fallbackMsg !== '')
			this.#DebugI18n(msgKey, fallbackMsg);
		else
			this.#Debug('');
	}

	async #OnMouseMove(event) {
		if (!this.#bIsPlayerActive || this.#Player2Name.textContent === '???' || this.#bHandlingEvent === true
			|| this.#iConnErrCount > 0) {

			if (this.#iConnErrCount <= 0 && !this.#bIsPlayerActive) {
				this.#Screen.style.cursor = "wait";
			}
			return;
		}

		const cursor = this.#SvgVml.ToCursorPoint(event.clientX, event.clientY);
		let x = cursor.x + 0.5;
		let y = cursor.y + 0.5;

		x = parseInt(x);
		y = parseInt(y);

		//out of bounds point - not allowed
		if (x >= this.#iGridWidth || y >= this.#iGridHeight) {
			return;
		}

		let tox = x;
		let toy = y;

		if (this.#CursorPos.x !== tox || this.#CursorPos.y !== toy) {
			this.#MouseCursorOval.move(tox, toy);
			this.#MouseCursorOval.Show();
			this.#ShowMouseXYPos(`[${x},${y}]`);
			this.#CursorPos.x = tox; this.#CursorPos.y = toy;
		}


		if (this.#bDrawLines) {
			if (this.#Line !== null)
				this.#Screen.style.cursor = "move";
			else
				this.#Screen.style.cursor = "crosshair";

			if (this.#bMouseDown === true) {
				//lines
				if ((this.#iLastX !== x || this.#iLastY !== y) &&
					(Math.abs(parseInt(this.#iLastX - x)) <= 1 && Math.abs(parseInt(this.#iLastY - y)) <= 1) &&
					this.#iLastX >= 0 && this.#iLastY >= 0) {
					if (this.#Line !== null) {
						let p0 = this.#Points.get(this.#iLastY * this.#iGridWidth + this.#iLastX);
						let p1 = this.#Points.get(y * this.#iGridWidth + x);
						this.#CancelPath.disabled = this.#Line.GetLength() >= 2 ? '' : 'disabled';

						if (p0 !== undefined && p1 !== undefined &&
							p0.GetFillColor() === this.#sDotColor && p1.GetFillColor() === this.#sDotColor) {
							const line_contains_point = this.#Line.ContainsPoint(tox, toy);
							if (line_contains_point < 1 && p1.GetStatus() !== StatusEnum.POINT_STARTING &&
								true === this.#Line.AppendPoints(tox, toy)) {
								p1.SetStatus(StatusEnum.POINT_IN_PATH, true);
								this.#iLastX = x;
								this.#iLastY = y;
							}
							else if (line_contains_point === 1 && p1.GetStatus() === StatusEnum.POINT_STARTING &&
								true === this.#Line.AppendPoints(tox, toy)) {
								const val = await this.#SurroundOpponentPoints();
								if (val.owned.length > 0) {
									this.#DebugI18n('game.closingPat', 'Closing path');

									this.#rAF_FrameID = null;
									await this.#SendData(this.#CreatePutPathRequest(val), async () => {
										await this.#OnCancelClick();
										val.OwnedPoints.forEach(revData => {
											const p = revData.point;
											p.RevertOldStatus();
											p.SetFillColor(revData.revertFillColor);
											// p.SetStrokeColor(revData.revertStrokeColor);
										});
										this.#bHandlingEvent = false;
									});
								}
								else {
									// this.#Debug(`${val.errorDesc ? val.errorDesc : 'Wrong path'}, cancel it or refresh page`, 0);
									// const msg = i18next.t('ib:err.pathDrawErrorDesc', { errDesc: val.errorDesc });
									this.#DebugI18n(val.errorDesc.key, val.errorDesc.fallbackMsg);
								}
								this.#iLastX = x;
								this.#iLastY = y;
							}
							else if (line_contains_point >= 1 && p0.GetStatus() === StatusEnum.POINT_IN_PATH &&
								this.#Line.GetPointsString().endsWith(`${this.#iLastX},${this.#iLastY}`)) {

								if (this.#Line.GetLength() > 2) {
									p0.RevertOldStatus();
									this.#Line.RemoveLastPoint();
									this.#iLastX = x;
									this.#iLastY = y;
								}
								else
									await this.#OnCancelClick();
							}
						}
					}
					else {
						let p0 = this.#Points.get(this.#iLastY * this.#iGridWidth + this.#iLastX);
						let p1 = this.#Points.get(y * this.#iGridWidth + x);

						if (p0 !== undefined && p1 !== undefined &&
							p0.GetFillColor() === this.#sDotColor && p1.GetFillColor() === this.#sDotColor) {
							const fromx = this.#iLastX;
							const fromy = this.#iLastY;
							this.#Line = this.#SvgVml.CreatePolyline(`${fromx},${fromy} ${tox},${toy}`, this.#DRAWING_PATH_COLOR);
							this.#CancelPath.disabled = '';
							p0.SetStatus(StatusEnum.POINT_STARTING, true);
							p1.SetStatus(StatusEnum.POINT_IN_PATH, true);

							this.#iLastX = x;
							this.#iLastY = y;
						}
					}
				}
			}
		}
		else {
			this.#Screen.style.cursor = "crosshair";
		}
	}

	async #OnMouseDown(event) {
		if (!this.#bIsPlayerActive || this.#Player2Name.textContent === '???' || this.#bHandlingEvent === true
			|| this.#iConnErrCount > 0)
			return;

		const cursor = this.#SvgVml.ToCursorPoint(event.clientX, event.clientY);
		let x = cursor.x + 0.5;
		let y = cursor.y + 0.5;

		x = this.#iMouseX = parseInt(x);
		y = this.#iMouseY = parseInt(y);

		//out of bounds point - not allowed
		if (x >= this.#iGridWidth || y >= this.#iGridHeight) {
			this.#DebugI18n('err.badPointCoord', 'Bad point coord');
			return;
		}

		this.#iLastLastX = this.#iLastX;
		this.#iLastLastY = this.#iLastY;

		this.#bMouseDown = true;
		if (!this.#bDrawLines) {
			//points
			this.#iLastX = x;
			this.#iLastY = y;

			const loc_x = x;
			const loc_y = y;

			if (await this.#Points.has(loc_y * this.#iGridWidth + loc_x)) {
				this.#DebugI18n('err.ptAlreadExist', 'Wrong point - already existing');
				return;
			}
			if (!IsPointOutsideAllPaths(loc_x, loc_y, await this.#Lines.all())) {
				this.#DebugI18n('err.pointNotOutside', 'Wrong point, Point is not outside all paths');
				return;
			}

			this.#rAF_FrameID = null;
			await this.#SendData(this.#CreatePutPointRequest(loc_x, loc_y), () => {
				this.#bMouseDown = false;
				this.#bHandlingEvent = false;
			});
		}
		else {
			//lines
			//this.#Debug('m_iMouseX = '+this.#iMouseX+' m_iMouseY = '+this.#iMouseY, 1);
			if ( /*this.#bMouseDown === true && */(this.#iLastX !== x || this.#iLastY !== y) &&
				(Math.abs(parseInt(this.#iLastX - x)) <= 1 && Math.abs(parseInt(this.#iLastY - y)) <= 1) &&
				this.#iLastX >= 0 && this.#iLastY >= 0) {
				if (this.#Line !== null) {
					let p0 = this.#Points.get(this.#iLastY * this.#iGridWidth + this.#iLastX);
					let p1 = this.#Points.get(y * this.#iGridWidth + x);
					this.#CancelPath.disabled = this.#Line.GetLength() >= 2 ? '' : 'disabled';

					if (p0 !== undefined && p1 !== undefined &&
						p0.GetFillColor() === this.#sDotColor && p1.GetFillColor() === this.#sDotColor) {
						const tox = x;
						const toy = y;
						const line_contains_point = this.#Line.ContainsPoint(tox, toy);
						if (line_contains_point < 1 && p1.GetStatus() !== StatusEnum.POINT_STARTING &&
							true === this.#Line.AppendPoints(tox, toy)) {
							p1.SetStatus(StatusEnum.POINT_IN_PATH, true);
							this.#iLastX = x;
							this.#iLastY = y;
						}
						else if (line_contains_point === 1 && p1.GetStatus() === StatusEnum.POINT_STARTING &&
							true === this.#Line.AppendPoints(tox, toy)) {
							const val = await this.#SurroundOpponentPoints();
							if (val.owned.length > 0) {
								this.#DebugI18n('game.closingPat', 'Closing path');
								this.#rAF_FrameID = null;
								await this.#SendData(this.#CreatePutPathRequest(val), async () => {
									await this.#OnCancelClick();
									val.OwnedPoints.forEach(revData => {
										const p = revData.point;
										p.RevertOldStatus();
										p.SetFillColor(revData.revertFillColor);
										// p.SetStrokeColor(revData.revertStrokeColor);
									});
									this.#bMouseDown = false;
									this.#bHandlingEvent = false;
								});
							}
							else {
								// const msg = i18next.t('ib:err.pathDrawErrorDesc', {
								// 	errDesc: val.errorDesc ? val.errorDesc : i18next.t('ib:err.wrongPath'/* 'Wrong path' */)
								// });
								this.#DebugI18n(val.errorDesc.key, val.errorDesc.fallbackMsg);
							}
							this.#iLastX = x;
							this.#iLastY = y;
						}
						else if (line_contains_point >= 1 && p0.GetStatus() === StatusEnum.POINT_IN_PATH &&
							this.#Line.GetPointsString().endsWith(`${this.#iLastX},${this.#iLastY}`)) {

							if (this.#Line.GetLength() > 2) {
								p0.RevertOldStatus();
								this.#Line.RemoveLastPoint();
								this.#iLastX = x;
								this.#iLastY = y;
							}
							else
								await this.#OnCancelClick();
						}
					}
				}
				else {
					let p0 = this.#Points.get(this.#iLastY * this.#iGridWidth + this.#iLastX);
					let p1 = this.#Points.get(y * this.#iGridWidth + x);

					if (p0 !== undefined && p1 !== undefined &&
						p0.GetFillColor() === this.#sDotColor && p1.GetFillColor() === this.#sDotColor) {
						const fromx = this.#iLastX;
						const fromy = this.#iLastY;
						const tox = x;
						const toy = y;
						this.#Line = this.#SvgVml.CreatePolyline(`${fromx},${fromy} ${tox},${toy}`, this.#DRAWING_PATH_COLOR);
						this.#CancelPath.disabled = '';
						p0.SetStatus(StatusEnum.POINT_STARTING, true);
						p1.SetStatus(StatusEnum.POINT_IN_PATH, true);
					}
					this.#iLastX = x;
					this.#iLastY = y;
				}
			}
			else if (this.#iLastX < 0 || this.#iLastY < 0) {
				let p1 = this.#Points.get(y * this.#iGridWidth + x);
				if (p1 !== undefined && p1.GetFillColor() === this.#sDotColor) {
					this.#iLastX = x;
					this.#iLastY = y;
				}
			}
		}
	}

	async #OnMouseMoveServiceMode(event) {
		if (!this.#bIsPlayerActive || this.#Player2Name.textContent === '???' || this.#bHandlingEvent === true
			|| this.#iConnErrCount > 0) {

			if (this.#iConnErrCount <= 0 && !this.#bIsPlayerActive) {
				this.#Screen.style.cursor = "wait";
			}
			return;
		}

		const cursor = this.#SvgVml.ToCursorPoint(event.clientX, event.clientY);
		let x = cursor.x + 0.5;
		let y = cursor.y + 0.5;

		x = parseInt(x);
		y = parseInt(y);

		//out of bounds point - not allowed
		if (x >= this.#iGridWidth || y >= this.#iGridHeight) {
			return;
		}

		let tox = x;
		let toy = y;

		if (this.#CursorPos.x !== tox || this.#CursorPos.y !== toy) {
			this.#MouseCursorOval.move(tox, toy);
			this.#MouseCursorOval.Show();
			this.#ShowMouseXYPos(`[${x},${y}]`);
			this.#CursorPos.x = tox; this.#CursorPos.y = toy;
		}


		// if (this.#bDrawLines) {
		if (this.#Line !== null)
			this.#Screen.style.cursor = "move";
		else
			this.#Screen.style.cursor = "crosshair";

		if (this.#bMouseDown === true) {
			if (await this.#Points.has(y * this.#iGridWidth + x) === false) {
				let color, status;
				if (document.getElementById("cbSrvMnuBlue").checked === true) {
					status = StatusEnum.POINT_FREE_BLUE;
					color = this.#COLOR_BLUE;
				}
				else {
					status = StatusEnum.POINT_FREE_RED;
					color = this.#COLOR_RED;
				}
				const oval = this.#SvgVml.CreateOval();
				oval.move(x, y);
				oval.SetStrokeColor(color);
				oval.StrokeWeight(0.2);
				oval.SetFillColor(color);
				oval.SetStatus(status);

				await this.#Points.set(y * this.#iGridWidth + x, oval);
			}
		}
	}

	async #OnMouseDownServiceMode(event) {
		if (!this.#bIsPlayerActive || this.#Player2Name.textContent === '???' || this.#bHandlingEvent === true
			|| this.#iConnErrCount > 0)
			return;

		const cursor = this.#SvgVml.ToCursorPoint(event.clientX, event.clientY);
		let x = cursor.x + 0.5;
		let y = cursor.y + 0.5;

		//out of bounds point - not allowed
		if (x >= this.#iGridWidth || y >= this.#iGridHeight) {
			this.#DebugI18n('err.badPointCoord', 'Bad point coord');
			return;
		}

		x = this.#iMouseX = parseInt(x);
		y = this.#iMouseY = parseInt(y);
		this.#iLastLastX = this.#iLastX;
		this.#iLastLastY = this.#iLastY;
		this.#bMouseDown = true;

		if (await this.#Points.has(y * this.#iGridWidth + x) === false) {
			let color, status;
			if (document.getElementById("cbSrvMnuBlue").checked === true) {
				status = StatusEnum.POINT_FREE_BLUE;
				color = this.#COLOR_BLUE;
			}
			else {
				status = StatusEnum.POINT_FREE_RED;
				color = this.#COLOR_RED;
			}
			const oval = this.#SvgVml.CreateOval();
			oval.move(x, y);
			oval.SetStrokeColor(color);
			oval.StrokeWeight(0.2);
			oval.SetFillColor(color);
			oval.SetStatus(status);

			await this.#Points.set(y * this.#iGridWidth + x, oval);
		}

	}

	#OnMouseUp() {
		this.#bMouseDown = false;
	}

	#OnMouseLeave() {
		this.#MouseCursorOval.Hide();
	}

	async #OnStopAndDraw(event) {
		if (!this.#Timer) {
			if (this.#Line !== null)
				await this.#OnCancelClick();
			this.#bDrawLines = !this.#bDrawLines;
			const btn = event.target;

			if (localizeSelector) {
				if (!this.#bDrawLines)
					btn.dataset.i18n = 'ib:game.drawLine';
				else
					btn.dataset.i18n = 'ib:game.drawDot';

				localizeSelector('#StopAndDraw');
			} else {
				if (!this.#bDrawLines)
					btn.textContent = 'Draw line';
				else
					btn.textContent = 'Draw dot';
			}

			this.#iLastX = this.#iLastY = -1;
			this.#Line = null;
		} else if (this.#Line === null) {
			//send On-Stop-And-Draw notification
			await this.#SendData(new StopAndDrawCommand());
		}
	}

	async #OnCancelClick() {
		if (this.#bDrawLines) {
			if (this.#Line !== null) {
				const points = this.#Line.GetPointsArray();
				this.#CancelPath.disabled = 'disabled';
				for (const point of points) {
					const { x, y } = point;
					if (x === null || y === null) continue;
					const p0 = this.#Points.get(y * this.#iGridWidth + x);
					if (p0 !== undefined) {
						p0.RevertOldStatus();
					}
				}
				this.#SvgVml.RemovePolyline(this.#Line);
				this.#Line = null;
			}
			this.#iLastX = this.#iLastY = -1;

			if (this.#Timer)
				this.#StopAndDraw.disabled = 'disabled';

			this.#Debug('');
		}
	}

	/**
	 * Debug function
	 * @param {string} sSelector2Set selector where to display output
	 */
	async #CountPointsDebug(sSelector2Set) {
		if (localizeSelector) {
			const tags = [
				{
					query: "circle:not([z-index])",
					cnt: 0
				},
				{
					query: "polyline",
					cnt: 0
				},
				{
					query: "circle[data-status='POINT_OWNED_BY_RED']",
					cnt: 0
				},
				{
					query: "circle[data-status='POINT_OWNED_BY_BLUE']",
					cnt: 0
				}
			];
			tags.forEach(tag => {
				tag.cnt = document.querySelectorAll(tag.query).length;
			});

			const el = document.querySelector(sSelector2Set);
			el.dataset.i18n = 'ib:game.stat.all';
			el.dataset.i18nOptions = `{ "pts": ${tags[0].cnt}, "lin": ${tags[1].cnt}, "intP1": ${tags[2].cnt}, "intP2": ${tags[3].cnt} }`;

			localizeSelector(sSelector2Set);
		}
		else {
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
	}

	/**
	 * Checks if point is outside all created lines, returning failing path and status
	 * @param {number} x point coordinate
	 * @param {number} y point coordinate
	 * @param {Array} allLines array
	 * @returns {{outside: boolean, offenderPoints: Array<{x, y}>|null}} - object with isOutside boolean and offenderPath object or null
	 */
	#IsPointOutsideAllPathsEx(x, y, allLines) {
		for (const line of allLines) {
			const points = line.GetPointsArray();

			if (false !== pnpoly(points, x, y))
				return { outside: false, offenderPoints: points };
		}

		return { outside: true, offenderPoints: [] };
	}

	#LoadAIParamsFromStore(store) {
		const fromStore = JSON.parse(store.getItem("AIOpts")) || {};
		const obj2Return = {};

		if (fromStore?.concavity !== undefined) {
			let concavity = parseFloat(fromStore.concavity);
			concavity = (isNaN(concavity) || concavity <= 0) ? 1.0 : concavity;
			obj2Return.concavity = concavity;
		}
		else
			obj2Return.concavity = 1.0;

		if (fromStore?.lengthThreshold !== undefined) {
			let lengthThreshold = parseFloat(fromStore.lengthThreshold);
			lengthThreshold = (isNaN(lengthThreshold) || lengthThreshold <= 0) ? 0.0 : lengthThreshold;
			obj2Return.lengthThreshold = lengthThreshold;
		}
		else
			obj2Return.lengthThreshold = 0.0;

		if (fromStore?.lastClickedX !== undefined && this.#iLastX < 0) {
			let lastClickedX = parseInt(fromStore.lastClickedX);
			lastClickedX = (isNaN(lastClickedX) || lastClickedX <= 0) ? this.#iLastX : lastClickedX;
			obj2Return.lastClickedX = lastClickedX;
		}
		else
			obj2Return.lastClickedX = this.#iLastX;

		if (fromStore?.lastClickedY !== undefined && this.#iLastY < 0) {
			let lastClickedY = parseInt(fromStore.lastClickedY);
			lastClickedY = (isNaN(lastClickedY) || lastClickedY <= 0) ? this.#iLastY : lastClickedY;
			obj2Return.lastClickedY = lastClickedY;
		}
		else
			obj2Return.lastClickedY = this.#iLastY;

		if (fromStore?.numberOfClusters !== undefined) {
			let numberOfClusters = parseInt(fromStore.numberOfClusters);
			numberOfClusters = (isNaN(numberOfClusters) || numberOfClusters <= 0) ? 5 : numberOfClusters;
			obj2Return.numberOfClusters = numberOfClusters;
		}
		else
			obj2Return.numberOfClusters = 5;

		if (fromStore?.neighborhoodRadius !== undefined) {
			let neighborhoodRadius = parseInt(fromStore.neighborhoodRadius);
			neighborhoodRadius = (isNaN(neighborhoodRadius) || neighborhoodRadius <= 0) ? 2 : neighborhoodRadius;
			obj2Return.neighborhoodRadius = neighborhoodRadius;
		}
		else
			obj2Return.neighborhoodRadius = 2;

		if (fromStore?.minPointsPerCluster !== undefined) {
			let minPointsPerCluster = parseInt(fromStore.minPointsPerCluster);
			minPointsPerCluster = (isNaN(minPointsPerCluster) || minPointsPerCluster <= 0) ? 2 : minPointsPerCluster;
			obj2Return.minPointsPerCluster = minPointsPerCluster;
		}
		else
			obj2Return.minPointsPerCluster = 2;

		if (fromStore?.clusteringMethod !== undefined && ["KMEANS", "OPTICS", "DBSCAN"].includes(fromStore.clusteringMethod.toUpperCase())) {
			obj2Return.clusteringMethod = fromStore.clusteringMethod.toUpperCase();
		}
		else
			obj2Return.clusteringMethod = "DBSCAN";

		if (fromStore?.visuals !== undefined) {
			let visuals = fromStore.visuals.trim().toLowerCase();
			visuals = ["true", "1", "yes", "on", "ok"].includes(visuals);
			obj2Return.visuals = visuals;
		}
		else
			obj2Return.visuals = true;

		return obj2Return;
	}

	#SaveAIParamsToStore(params, store) {
		const toStore = JSON.parse(store.getItem("AIOpts")) || {};
		let persist = false;
		if (params.lastClickedX !== toStore?.lastClickedX) {
			toStore.lastClickedX = params.lastClickedX;
			persist = true;
		}
		if (params.lastClickedY !== toStore?.lastClickedY) {
			toStore.lastClickedY = params.lastClickedY;
			persist = true;
		}
		if (params.concavity !== toStore?.concavity) {
			toStore.concavity = params.concavity;
			persist = true;
		}
		if (params.lengthThreshold !== toStore?.lengthThreshold) {
			toStore.lengthThreshold = params.lengthThreshold;
			persist = true;
		}
		if (params.numberOfClusters !== toStore?.numberOfClusters) {
			toStore.numberOfClusters = params.numberOfClusters;
			persist = true;
		}
		if (params.neighborhoodRadius !== toStore?.neighborhoodRadius) {
			toStore.neighborhoodRadius = params.neighborhoodRadius;
			persist = true;
		}
		if (params.minPointsPerCluster !== toStore?.minPointsPerCluster) {
			toStore.minPointsPerCluster = params.minPointsPerCluster;
			persist = true;
		}
		if (params.clusteringMethod !== toStore?.clusteringMethod) {
			toStore.clusteringMethod = params.clusteringMethod.toUpperCase();
			persist = true;
		}
		if (params.visuals !== toStore?.visuals) {
			toStore.visuals = params.visuals.toString().toLowerCase();
			persist = true;
		}

		if (persist === true)
			store.setItem("AIOpts", JSON.stringify(toStore));
	}

	/**
	 * Worker entry point - async version
	 * @param {(worker: Worker) => void} setupFunction - init params callback to be given a worker as 1st param
	 * @returns {Promise<object>} - promise with data from worker
	 */
	async #RunAIWorker(setupFunction) {
		return new Promise((resolve, reject) => {
			this.#Worker = this.#Worker ?? new Worker('../js/AIWorker.Bundle.js?v=' + IBversionHash
				, { type: 'module' }
			);

			this.#Worker.onerror = function (e) {
				this.#Worker.terminate();
				this.#Worker = null;
				reject(new Error(e || localizeMessage('err.noData', 'no data')));
			};

			this.#Worker.onmessage = function (e) {
				const data = e.data;
				// switch (data.operation) {
				// case "BUILD_GRAPH":
				// case "CONCAVEMAN":
				// case "MARK_ALL_CYCLES":
				// case "FIND_SURROUNDABLE_POINTS":
				// case "ASTAR":
				// case "CLUSTERING":
				// //worker.terminate();
				resolve(data);
				// break;
				// default:
				// 	LocalError(`unknown params.operation = ${data.operation}`);
				// 	//worker.terminate();
				// 	reject(new Error(`unknown params.operation = ${data.operation}`));
				// 	break;
				// }
			};

			if (setupFunction)
				setupFunction(this.#Worker);
		});//promise end
	}

	async #OnTestBuildCurrentGraph(event) {
		event.preventDefault();
		//// Main thread UI implementation
		// LocalLog(await this.#BuildGraph());

		// Web worker background implementation
		const data = await this.#RunAIWorker((worker) => {
			const serialized_points = Array.from(this.#Points.store.entries()).map(([key, value]) => ({ key, value: value.Serialize() }));
			const serialized_paths = this.#Lines.store.map(pa => pa.Serialize());

			worker.postMessage({
				operation: "BUILD_GRAPH",
				boardSize: { iGridWidth: this.#iGridWidth, iGridHeight: this.#iGridHeight },
				points: serialized_points,
				paths: serialized_paths
			});
		});
		LocalLog('Message received from worker:');
		LocalLog(data);
	}

	async #OnTestConcaveman(event) {
		event.preventDefault();

		let clicked_point_status;
		const runParams = this.#LoadAIParamsFromStore(window.localStorage);
		if (!(runParams.lastClickedY >= 0 && runParams.lastClickedX >= 0) ||
			(clicked_point_status = (this.#Points.get(runParams.lastClickedY * this.#iGridWidth + runParams.lastClickedX))?.GetStatus()) === undefined
		) {
			LocalLog(localizeMessage('game.AI.clustFirstClick', "!!!First you need to click some point with mouse to pick the color!!!"));
			return;
		}

		const data = await this.#RunAIWorker((worker) => {
			const serialized_points = this.#cyclesFound?.length > 0 ?
				this.#cyclesFound.map(pt => {
					const ser = pt.Serialize();
					return { key: ser.y * this.#iGridWidth + ser.x, value: ser };
				})
				:
				[...this.#Points.store.entries()].map(([key, value]) => ({ key, value: value.Serialize() }));
			//const serialized_paths = this.#Lines.store.map(pa => pa.Serialize());

			worker.postMessage({
				operation: "CONCAVEMAN",
				subOperation: "BY_POINTS",
				boardSize: { iGridWidth: this.#iGridWidth, iGridHeight: this.#iGridHeight },
				points: serialized_points,
				clickedPointStatus: clicked_point_status,
				concavity: runParams.concavity,
				lengthThreshold: runParams.lengthThreshold
			});
		});
		this.#SaveAIParamsToStore(runParams, window.localStorage);

		if (data.convex_hull && data.convex_hull.length > 0) {
			const convex_hull = data.convex_hull;

			const line = this.#SvgVml.CreatePolyline(
				convex_hull.reduce((acc, [x, y]) => acc + `${parseInt(x)},${parseInt(y)} `, '').trimEnd(),
				'green');
			line.SetID(-1);

			LocalLog(`convex_hull = ${convex_hull}`);

			const cw_sorted_verts = data.cw_sorted_verts;

			const rand_color = RandomColor();
			for (const vert of cw_sorted_verts) {
				const { x, y } = vert;
				const pt = this.#Points.get(y * this.#iGridWidth + x);
				if (pt) {
					pt.SetStrokeColor(rand_color);
					pt.SetFillColor(rand_color);
					pt.SetZIndex(100);
					pt.setAttribute("r", 6 / this.#iGridSpacingX);
				}
				await Sleep(50);
			}
		}
	}

	async #OnTestMarkAllCycles(event) {
		event.preventDefault();
		// const data = await this.#RunAIWorker((worker) => {
		// 	const serialized_points = Array.from(this.#Points.store.entries()).map(([key, value]) => ({ key, value: value.Serialize() }));
		// 	const serialized_paths = this.#Lines.store.map(pa => pa.Serialize());

		// 	worker.postMessage({
		// 		operation: "BUILD_GRAPH",
		// 		boardSize: { iGridWidth: this.#iGridWidth, iGridHeight: this.#iGridHeight },
		// 		state: this.#GetGameStateForIndexedDb(),
		// 		points: serialized_points,
		// 		paths: serialized_paths
		// 	});
		// });

		LocalLog(await this.#MarkAllCycles(await this.#BuildGraph(), this.#COLOR_RED));

		// const data = await this.#RunAIWorker((worker) => {
		// 	const serialized_points = Array.from(this.#Points.store.entries()).map(([key, value]) =>
		// 		({ key, value: value.Serialize() }));
		// 	const serialized_paths = this.#Lines.store.map(pa => pa.Serialize());

		// 	worker.postMessage({
		// 		operation: "MARK_ALL_CYCLES",
		// 		boardSize: { iGridWidth: this.#iGridWidth, iGridHeight: this.#iGridHeight },
		// 		state: this.#GetGameStateForIndexedDb(),
		// 		points: serialized_points,
		// 		paths: serialized_paths,
		// 		colorRed: this.#COLOR_RED,
		// 	});
		// });

		// if (data.cycles && data.free_human_player_points && data.free_human_player_points.length > 0) {
		// 	//gather free human player points that could be intercepted.
		// 	const free_human_player_points = [];
		// 	//const sHumanColor = this.#COLOR_RED;
		// 	for (const pt of data.free_human_player_points) {
		// 		//if (pt !== undefined && pt.GetFillColor() === sHumanColor && StatusEnum.POINT_FREE_RED === pt.GetStatus()) {
		// 		const { x, y } = pt;
		// 		//	if (false === IsPointOutsideAllPaths(x, y, await this.#Lines.all()))
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
		// 					pt.setAttribute("r", 6 / this.#iGridSpacingX);
		// 				}
		// 				await Sleep(50);
		// 			}

		// 			//find for all free_human_player_points which cycle might intercept it (surrounds)
		// 			//only convex, NOT concave :-(
		// 			let tmp = '', comma = '';
		// 			for (const possible_intercept of free_human_player_points) {
		// 				if (false !== pnpoly(cw_sorted_verts, possible_intercept.x, possible_intercept.y)) {
		// 					tmp += `${comma}(${possible_intercept.x},${possible_intercept.y})`;

		// 					const pt1 = document.querySelector(`svg > circle[cx="${possible_intercept.x}"][cy="${possible_intercept.y}"]`);
		// 					if (pt1) {
		// 						pt1.SetStrokeColor('var(--bs-yellow)');
		// 						pt1.SetFillColor('var(--bs-yellow)');
		// 						pt1.setAttribute("r", 6 / this.#iGridSpacingX);
		// 					}
		// 					comma = ',';
		// 				}
		// 			}
		// 			//gathering of some data and console printing
		// 			trailing_points.unshift(str);
		// 			tab.push(trailing_points);
		// 			//log...
		// 			LocalLog(str + (tmp !== '' ? ` possible intercepts: ${tmp}` : ''));
		// 			//...and clear
		// 			const pts2reset = Array.from(document.querySelectorAll(`svg > circle[fill="${rand_color}"][r="${this.#LineStrokeWidth * 2}"]`));
		// 			pts2reset.forEach(pt => {
		// 				pt.SetStrokeColor(this.#COLOR_BLUE);
		// 				pt.SetFillColor(this.#COLOR_BLUE);
		// 				pt.setAttribute("r", 6 / this.#iGridSpacingX);
		// 			});
		// 		}
		// 	}
		// }
	}

	async #OnTestGroupPoints(event) {
		event.preventDefault();
		//LocalLog('OnTestGroupPoints');
		const starting_point = this.#Points.get(this.#iMouseY * this.#iGridWidth + this.#iMouseX);
		if (starting_point === undefined) {
			LocalLog(localizeMessage('game.AI.groupPtsFirst', "!!!First you need to click 'blue' starting point with mouse!!!"));
			return;
		}

		await this.#GroupPointsRecurse([], starting_point);

		if (this.#workingCyclePolyLine !== null) {
			this.#SvgVml.RemovePolyline(this.#workingCyclePolyLine);
			this.#workingCyclePolyLine = null;
		}
		this.#cyclesFound.forEach(cycle => {
			const line = this.#SvgVml.CreatePolyline(cycle.map((pt) => {
				const { x, y } = pt.GetPosition();
				return `${x},${y}`;
			}).join(' '), RandomColor());
			line.SetID(-1);
		});
		LocalLog('game.#cyclesFound = ');
		LocalLog(this.#cyclesFound);
		this.#cyclesFound = [];
	}

	async #OnTestFindSurroundablePoints(event) {
		event.preventDefault();

		/*
		const sHumanColor = this.#COLOR_RED, sCPUColor = this.#COLOR_BLUE;
		let working_points;
		const pt = this.#Points.get(this.#iMouseY * this.#iGridWidth + this.#iMouseX);
		const all_points = [...await this.#Points.values()];
		if (pt !== undefined)
			working_points = [pt];
		else
			working_points = all_points;

		//loading all line up front and pass into below "looped" function calls
		const allLines = await this.#Lines.all();//TODO: async for
		for (const pt of working_points) {
			if (pt !== undefined && pt.GetFillColor() === sHumanColor
				&& [StatusEnum.POINT_FREE_RED, StatusEnum.POINT_IN_PATH].includes(pt.GetStatus())) {
				const { x, y } = pt.GetPosition();
				if (false === IsPointOutsideAllPaths(x, y, allLines)) {
					LocalLog("!!!Point inside path!!!");
					continue;
				}
				for (let radius = 1; radius <= 4; radius++) {
					const rand_color = RandomColor();
					const possible = [];

					//pt,x,y is good "surroundable point"
					//let's find closes CPU points to it lying on circle
					for (const cpu_pt of all_points) {
						if (cpu_pt !== undefined && cpu_pt.GetFillColor() === sCPUColor
							&& [StatusEnum.POINT_FREE_BLUE, StatusEnum.POINT_IN_PATH].includes(cpu_pt.GetStatus())) {
							const { x: cpu_x, y: cpu_y } = cpu_pt.GetPosition();
							if (false === IsPointOutsideAllPaths(cpu_x, cpu_y, allLines))
								continue;

							if (0 <= this.#SvgVml.IsPointInCircle({ x: cpu_x, y: cpu_y }, { x, y }, radius)) {
								cpu_pt.x = cpu_x;
								cpu_pt.y = cpu_y;
								possible.push(cpu_pt);
							}
						}
					}
					if (possible.length > 2) {
						let cw_sorted_verts = sortPointsClockwise(possible);
						//check if points are aligned one-by-one next to each other no more than 1 point apart
						for (let i = cw_sorted_verts.length - 2, last = cw_sorted_verts.at(-1); i > 0; i--) {
							const it = cw_sorted_verts[i];
							if (!(Math.abs(last.x - it.x) <= 1 && Math.abs(last.y - it.y) <= 1)) {
								cw_sorted_verts = null;
								break;
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
							false === pnpoly(cw_sorted_verts, x, y)
						) {
							continue;
						}

						const enclosing_circle = this.#SvgVml.CreateOval(radius);
						enclosing_circle.move(x, y);
						enclosing_circle.SetStrokeColor(rand_color);
						enclosing_circle.StrokeWeight(0.1);
						enclosing_circle.SetFillColor('transparent');

						if (working_points.length <= 1) {
							for (const cpu_pt of cw_sorted_verts) {
								const pt1 = document.querySelector(`svg > circle[cx="${cpu_pt.x}"][cy="${cpu_pt.y}"]`);
								if (pt1) {
									pt1.SetStrokeColor(rand_color);
									pt1.StrokeWeight('0.020em');
									pt1.SetFillColor(rand_color);
									pt1.setAttribute("r", 6 / this.#iGridSpacingX);
								}
							}
							await this.#DisplayPointsProgressWithDelay(cw_sorted_verts, 250);
						}

						LocalLog(`circle sorted possible path points for ${radius} radius: `);
						LocalLog(cw_sorted_verts);
					}
				}
			}
		}

		*/

		const sHumanColor = this.#COLOR_RED, sCPUColor = this.#COLOR_BLUE;
		const all_points = [...await this.#Points.values()].map(value => value.Serialize());
		const allLines = this.#Lines.store.map(value => value.Serialize());

		const pt = this.#Points.get(this.#iMouseY * this.#iGridWidth + this.#iMouseX);
		const working_points = pt !== undefined ? [pt.Serialize()] : all_points;

		const data = await this.#RunAIWorker((worker) => {
			worker.postMessage({
				operation: "FIND_SURROUNDABLE_POINTS",
				boardSize: { iGridWidth: this.#iGridWidth, iGridHeight: this.#iGridHeight },
				sHumanColor: sHumanColor,
				sCPUColor: sCPUColor,
				allPoints: all_points,
				workingPoints: working_points,
				allLines: allLines
			});
		});

		if (data?.results?.length > 0) {
			data.results.forEach(async (gr) => {

				const rand_color = RandomColor();
				const enclosing_circle = this.#SvgVml.CreateOval(gr.radius);
				enclosing_circle.move(gr.x, gr.y);
				enclosing_circle.SetStrokeColor(rand_color);
				enclosing_circle.StrokeWeight(0.1);
				enclosing_circle.SetFillColor('transparent');

				const matched_pts = [];
				for (const cpu_pt of gr.cw_sorted_verts) {
					const pt1 = document.querySelector(`svg > circle[cx="${cpu_pt.x}"][cy="${cpu_pt.y}"]`);
					if (pt1) {
						pt1.SetStrokeColor(rand_color);
						pt1.StrokeWeight('0.020em');
						pt1.SetFillColor(rand_color);
						pt1.setAttribute("r", 6 / this.#iGridSpacingX);
						matched_pts.push(pt1);
					}
				}
				await this.#DisplayPointsProgressWithDelay(matched_pts, 250);
			});
		}
	}

	async #OnTestDFS2(event) {
		event.preventDefault();
		if (!(this.#iLastY >= 0 && this.#iLastX >= 0)) {
			LocalLog(localizeMessage('game.AI.dfs2First', "!!!First you need to click starting point with mouse!!!"));
			return;
		}

		const clicked = this.#Points.get(this.#iLastY * this.#iGridWidth + this.#iLastX);
		const start_color = clicked.GetFillColor(), start_status = clicked.GetStatus();

		await this.#DFS2(await this.#BuildGraph({
			freePointStatus: (start_status === StatusEnum.POINT_FREE_BLUE ? StatusEnum.POINT_FREE_BLUE : StatusEnum.POINT_FREE_RED),
			cpuFillColor: (start_color === this.#COLOR_BLUE ? this.#COLOR_BLUE : this.#COLOR_RED)
		}), clicked);
	}

	async #OnTestFloodFill(event) {
		event.preventDefault();

		const sHumanColor = this.#COLOR_RED, sCPUColor = this.#COLOR_BLUE;
		const pt = this.#Points.get(this.#iMouseY * this.#iGridWidth + this.#iMouseX);
		if (!pt) {
			LocalLog(localizeMessage('game.AI.dfs2First', "!!!First you need to click starting point with mouse!!!"));
			return;
		}
		const { x, y } = pt.GetPosition();
		const start_color = pt.GetFillColor();

		LocalLog(`FloodFill start point (${x},${y}), color = '${start_color === sHumanColor ? 'HUMAN' : 'CPU'}'`);

		await this.#FloodFill(pt, start_color === sHumanColor ? sHumanColor : sCPUColor, 'green');
	}

	async #OnTestAStar(event) {
		event.preventDefault();
		//checks for valid points, color, states
		if (!(this.#iLastY >= 0 && this.#iLastX >= 0 && this.#iLastLastY >= 0 && this.#iLastLastX >= 0 &&
			(this.#iLastX !== this.#iLastLastX || this.#iLastY !== this.#iLastLastY))
		) {
			LocalLog("!!!First you need to click two (starting and ending) points with mouse!!!");
			return;
		}
		const point_color = (this.#Points.get(this.#iLastY * this.#iGridWidth + this.#iLastX))?.GetFillColor();
		if (point_color !== (this.#Points.get(this.#iLastLastY * this.#iGridWidth + this.#iLastLastX))?.GetFillColor()) {
			LocalLog("!!!Clicked starting and ending point must be same color and not owned!!!");
			return;
		}
		const point_status = point_color === this.#COLOR_RED ? StatusEnum.POINT_FREE_RED : StatusEnum.POINT_FREE_BLUE;

		//helper func
		const displayPointsHelper = async (pointsArr, sleepMillisecs = 25) => {
			//
			//serialize points as string: "x0,y0 x1,y1 x2,y2"
			//
			// const pts = pointsArr.map((pt) => `${pt.x},${pt.y}`).join(' ');
			const pts = pointsArr.reduce((acc, { x, y }) => acc + `${x},${y} `, '').trimEnd();

			//if not existing, create new...
			if (this.#workingCyclePolyLine === null) {
				this.#workingCyclePolyLine = this.#SvgVml.CreatePolyline(pts, 'black');
				this.#workingCyclePolyLine.SetID(-1);
			}
			else//...else replace last create path
				this.#workingCyclePolyLine.SetPoints(pts);

			if (sleepMillisecs > 0)
				await Sleep(sleepMillisecs);
		};

		const arr = new Array(this.#iGridHeight);
		for (let y = 0; y < this.#iGridHeight; y++) {
			arr[y] = new Array(this.#iGridWidth);

			for (let x = 0; x < this.#iGridWidth; x++) {

				const pt = this.#Points.get(y * this.#iGridWidth + x);
				if (pt !== undefined && pt.GetFillColor() === point_color && pt.GetStatus() === point_status)
					arr[y][x] = 1;//inverted coords, y,x in array
				else
					arr[y][x] = 0;
			}
		}

		//Web Worker calc
		const data = await this.#RunAIWorker((worker) => {
			worker.postMessage({
				operation: "ASTAR",
				arr,
				start: { y: this.#iLastY, x: this.#iLastX },
				end: { y: this.#iLastLastY, x: this.#iLastLastX }
			});
		});

		if (data.resultWithDiagonals.length > 0)
			await displayPointsHelper(data.resultWithDiagonals, 0);
	}

	/**
	 * Detects clusters of points with same color and status.
	 * Returns array of clusters surrounding those points
	 * @param {string} humanPointColor - color of points to find
	 * @param {object} aiParams - AI parameters for clustering
	 * @param {boolean} [visuals] - if true, will create visual representation of clusters, defaults to false
	 * @returns {Promise<Array>} - array of clusters found, each cluster is an object with points and convex hull
	 */
	async #GetSurroundingPoints(humanPointColor, aiParams, visuals = false) {
		const humanPointStatuses = humanPointColor === this.#COLOR_RED
			?
			[StatusEnum.POINT_FREE_RED
				// ,StatusEnum.POINT_STARTING
				// ,StatusEnum.POINT_IN_PATH
				// ,StatusEnum.POINT_OWNED_BY_RED
			]
			:
			[StatusEnum.POINT_FREE_BLUE
				// ,StatusEnum.POINT_STARTING
				// ,StatusEnum.POINT_IN_PATH
				// ,StatusEnum.POINT_OWNED_BY_BLUE
			];

		const all_points_serialized = [...this.#Points.store.entries()].map(([key, value]) => ({ key, value: value.Serialize() }));

		//Web Worker calculation of density clustering
		const { results } = await this.#RunAIWorker(worker => {
			worker.postMessage({
				operation: "CLUSTERING_AND_CONCAVEMAN",
				method: aiParams.clusteringMethod,
				//take params saved in local_storage
				numberOfClusters: aiParams.numberOfClusters,
				neighborhoodRadius: aiParams.neighborhoodRadius,
				minPointsPerCluster: aiParams.minPointsPerCluster,

				allPoints: all_points_serialized,
				humanPointStatuses,
				humanPointColor,
				COLOR_OWNED_RED: this.#COLOR_OWNED_RED,
				COLOR_OWNED_BLUE: this.#COLOR_OWNED_BLUE,

				concavity: aiParams.concavity,
				lengthThreshold: aiParams.lengthThreshold,
				boardSize: { iGridWidth: this.#iGridWidth, iGridHeight: this.#iGridHeight },
				visuals
			});
		});

		let rand_color, fragment, createRectForVisualsFunction = () => { /* dummy filler func*/ },
			createPolylineForVisualsFunction = () => { /* dummy filler func*/ },
			pointMarkerForVisualsFunction = () => { /* dummy filler func*/ };
		if (visuals) {
			fragment = this.#SvgVml.BeginBatchFragment();
			createRectForVisualsFunction = (i, j, width, height) => {
				return fragment ?
					fragment.CreateRect(i, j, width, height, rand_color) :
					this.#SvgVml.CreateRect(i, j, width, height, rand_color);
			};
			createPolylineForVisualsFunction = (pointsStr, color) => {
				const poly_line = fragment ?
					fragment.CreatePolyline(pointsStr, color) :
					this.#SvgVml.CreatePolyline(pointsStr, color);

				poly_line.SetID(-1);

				return poly_line;
			};
			pointMarkerForVisualsFunction = (point, randColor) => {
				point.SetStrokeColor(randColor); //set color to some random color and visually "pop"
				point.StrokeWeight(0.45); //
				point.SetZIndex(100);
				point.setAttribute("r", 2 / this.#iGridSpacingX);
			};
		}

		//for each cluster, process it's point group
		//and create a convex hull around it, then display it
		if (results?.length > 0) {
			//loading all human lines up front and pass into below "looped" function calls
			const allLines = (await this.#Lines.all())/* .filter(line => line.GetFillColor() === humanPointColor) */;

			//Print results to console in visually nice form
			LocalLog({
				clusteringMethod: aiParams.clusteringMethod,
				numberOfClusters: aiParams.numberOfClusters,
				neighborhoodRadius: aiParams.neighborhoodRadius,
				minPointsPerCluster: aiParams.minPointsPerCluster,

				CLUSTERING_AND_CONCAVEMAN: results.map(found => {
					rand_color = found.randomColor; //random color for each points

					return {
						clustered_point_coords: found.clustered_point_coords.map(({ x, y }) => {
							const pt = this.#Points.get(y * this.#iGridWidth + x); //get point from points store
							if (pt) {
								pointMarkerForVisualsFunction(pt, rand_color);
								return pt;
							}
							else return null;
						}),
						convex_hull: found.convex_hull.map(({ x, y }) => {
							return this.#Points.get(y * this.#iGridWidth + x);
						}),
						interceptedPoints: found?.interceptedPoints?.map(({ x, y }) => {
							return this.#Points.get(y * this.#iGridWidth + x);
						}) || [],
						surrounding_path: found.surrounding_path.map(([x, y]) => {
							return this.#Points.get(y * this.#iGridWidth + x);
						}),
						rects2Draw: found.rects2Draw.map(({ i, j, width, height }) => {
							return createRectForVisualsFunction(i, j, width, height);
						}),
						poly_line: createPolylineForVisualsFunction(
							found.convex_hull.reduce((acc, { x, y }) => acc + `${x},${y} `, '').trimEnd(),
							found.randomColor),

						plan: (`Planned path points(#${found.convex_hull?.length}) around bounding box points(${found.surrounding_path.length}): ${found.surrounding_path.reduce((acc, [x, y]) => acc + `${x},${y} `, '').trimEnd()}`),

						randomColor: found.randomColor
					};
				})
			});

			if (visuals)
				fragment?.EndBatchFragment();

			resultLoop:
			for (const { convex_hull, interceptedPoints/*, surrounding_path, rects2Draw */, randomColor } of results) {
				//take ALL x,y pairs from convex hull and check if they are not already placed on the board
				//and if it is outside all paths
				//if point is already placed on the board, check its color if not, prepare for placing it
				for (const { x, y } of convex_hull) {
					if (!(x >= 0 && x < this.#iGridWidth && y >= 0 && y < this.#iGridHeight)) {
						LocalLog(`Convex hull point (${x},${y}) %cout of bounds;`, `color: ${randomColor};font-weight: bold`, 'will not try to surround.');
						continue resultLoop;
					}

					const point = this.#Points.get(y * this.#iGridWidth + x);
					if (point !== undefined) {
						//take point from convex hull and check if it is not already placed on the board as human point
						//and if it is outside all paths - if so, return it as next AI move coz path is still not closed
						if (point.GetFillColor() !== humanPointColor) {
							const checkResult = this.#IsPointOutsideAllPathsEx(x, y, allLines);
							if (checkResult.outside === true) {
								//point ok! outside all paths, not human, placed on the board
							} else if (checkResult.offenderPoints.some(op => op.x === x && op.y === y) === true) {
								//allow for points that lay on edge of path, not inside
								//point ok! outside all paths, not human, placed on the board
								LocalLog(`Point %c(${x},${y}) %cis on the edge of a path, allowed!`, `color: ${randomColor};font-weight: bold`, "color: green;font-weight: bold");
							} else {
								LocalLog(`Point %c(${x},${y}) %cis not outside all paths!`, `color: ${randomColor};font-weight: bold`, "color: red;font-weight: bold");
								continue resultLoop; //bad point found
							}
							//point ok! outside all paths, not human, placed on the board
						} else {
							LocalLog(`Point %c(${x},${y}) %cis breaking the predicted path, bad color!`, `color: ${randomColor};font-weight: bold`, "color: red;font-weight: bold");
							continue resultLoop; //bad point found
						}
					}
					else if (IsPointOutsideAllPaths(x, y, allLines)) {
						//point ok! outside all paths, not human, placed on the board
					} else {
						LocalLog(`Point %c(${x},${y}) %cis not outside all paths!`, `color: ${randomColor};font-weight: bold`, "color: red;font-weight: bold");
						continue resultLoop; //bad point found
					}

					//else point is not placed on the board, so it is ok for placing it
				}
				// if (!interceptedPoints || interceptedPoints?.length === 0) {
				// 	continue resultLoop; //it seems, there is not enough points surrounded 
				// }

				for (const { x, y } of convex_hull) {
					const point = this.#Points.get(y * this.#iGridWidth + x);

					//take point from convex hull and check if it is not already placed on the board
					//and if it is outside all paths - if so, return it as next AI move because the path is still not closed
					if (point === undefined) {
						const return_point = new InkBallPointViewModel(this.#iGameID, -1/*player*/, x, y, StatusEnum.POINT_FREE_BLUE, 0);
						LocalLog(`Returning point (${x},${y}) as %cAI generated next point`, `color: ${randomColor};font-weight: bold`);

						return return_point; //return point as next AI move
					}
				}
				//if all points from convex hull are already placed on the board, return path as next AI move
				const path = convex_hull.reduce((acc, { x, y }) => acc + `${x},${y} `, '').trimEnd();
				const return_path = new InkBallPathViewModel(0, this.#iGameID, -1/*player*/,
					path, interceptedPoints
						// .filter(({ point }) => point.GetStatus() === StatusEnum.POINT_FREE_RED)
						.reduce((acc, { x, y }) => (acc + `${x},${y} `), '').trimEnd()
				);
				LocalLog(`Planned as AI generated next, %cpossible path: (${path})`, `color: ${randomColor};font-weight: bold`);

				return return_path; //return path as next AI move
			}

			return null; //no point from "clusters concave-ing" found, fail
		}//end if clusters found
		else
			return null; //no clusters found
	}

	async #OnTestClustering(event) {
		event.preventDefault();

		//checks for valid points, color, states get options from local_storage
		let point_color;
		const aiParams = this.#LoadAIParamsFromStore(window.localStorage);

		if (!(aiParams.lastClickedY >= 0 && aiParams.lastClickedX >= 0) ||
			//check if point exists, if so get color and status
			(point_color = (this.#Points.get(aiParams.lastClickedY * this.#iGridWidth + aiParams.lastClickedX))?.GetFillColor()) === undefined
		) {
			LocalLog(localizeMessage('game.AI.clustFirstClick', "!!!First you need to click some point with mouse to pick the color!!!"));
			return;
		}
		this.#SaveAIParamsToStore(aiParams, window.localStorage);//save params to local_storage


		//filter same color and status of last clicked point
		//we are going to operate on those points only
		// eslint-disable-next-line no-unused-vars
		const point = await this.#GetSurroundingPoints(point_color, aiParams, true/*visuals*/);
	}

	async #OnTestServiceModeClick(event) {
		// event.preventDefault();

		if (event.target.id === "cbSrvMnuRed") {
			//red service mode clicked
			if (document.getElementById("cbSrvMnuRed").checked === true) {
				this.#Screen.onmousedown = this.#OnMouseDownServiceMode.bind(this);
				this.#Screen.onmousemove = this.#OnMouseMoveServiceMode.bind(this);

				LocalLog('red');
			}
			else {
				this.#Screen.onmousedown = this.#OnMouseDown.bind(this);
				this.#Screen.onmousemove = this.#OnMouseMove.bind(this);

				LocalLog('red-off');
			}

			document.getElementById("cbSrvMnuBlue").checked = false;
		}
		else if (event.target.id === "cbSrvMnuBlue") {
			//blue service mode clicked
			if (document.getElementById("cbSrvMnuBlue").checked === true) {
				this.#Screen.onmousedown = this.#OnMouseDownServiceMode.bind(this);
				this.#Screen.onmousemove = this.#OnMouseMoveServiceMode.bind(this);

				LocalLog('blue');
			} else {
				this.#Screen.onmousedown = this.#OnMouseDown.bind(this);
				this.#Screen.onmousemove = this.#OnMouseMove.bind(this);

				LocalLog('blue-off');
			}

			document.getElementById("cbSrvMnuRed").checked = false;
		}
	}

	/**
	 * Start drawing routines
	 * @param {HTMLElement} sScreen screen container selector
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
	 * @param {Array<string>} arrServiceModeControls controls of service menu or null
	 * @param {Array<string>} arrDifficultySelectors controls of AI difficulty selectors or null
	 */
	async #PrepareDrawing(sScreen, sPlayer1Name, sPlayer2Name, sGameStatus, sSurrenderButton, sCancelPath, sPause, sStopAndDraw, sMsgInputSel, sMsgListSel, sMsgSendButtonSel, sLastMoveGameTimeStamp, useIndexedDbStore, version, ddlTestActions, arrServiceModeControls, arrDifficultySelectors) {
		// this.#bIsWon = false;
		// this.#iDelayBetweenMultiCaptures = 4000;
		this.#Timer = null;
		// this.#WaitStartTime = null;
		// this.#iSlowdownLevel = 0;
		this.#iLastX = -1;
		this.#iLastY = -1;
		this.#iMouseX = 0;
		this.#iMouseY = 0;
		// this.#iPosX = 0;
		// this.#iPosY = 0;
		this.#bMouseDown = false;
		this.#bHandlingEvent = false;
		this.#bDrawLines = !true;
		// this.#sMessage = '';
		this.#sDotColor = this.#bIsPlayingWithRed ? this.#COLOR_RED : this.#COLOR_BLUE;
		this.#Line = null;
		this.#spDebug = document.getElementById('debug0');
		this.#Player1Name = document.querySelector(sPlayer1Name);
		this.#Player2Name = document.querySelector(sPlayer2Name);
		this.#GameStatus = document.querySelector(sGameStatus);
		this.#SurrenderButton = document.querySelector(sSurrenderButton);
		this.#CancelPath = document.querySelector(sCancelPath);
		this.#StopAndDraw = document.querySelector(sStopAndDraw);
		this.#sMsgInputSel = sMsgInputSel;
		this.#sMsgListSel = sMsgListSel;
		this.#sMsgSendButtonSel = sMsgSendButtonSel;
		this.#Screen = document.querySelector(sScreen);
		if (!this.#Screen) {
			if (localizeSelector)
				LocalAlert(localizeMessage('err.noBoard', 'no board'), localizeMessage('err.err!', 'Error!'));
			else
				LocalAlert("no board", "Error!");
			return;
		}
		// this.#iPosX = this.#Screen.offsetLeft;
		// this.#iPosY = this.#Screen.offsetTop;

		let [iGridWidth, iGridHeight] = [...this.#Screen.classList].find(x => x.startsWith('boardsize')).split('-')[1].split('x');
		this.#iGridWidth = parseInt(iGridWidth);
		this.#iGridHeight = parseInt(iGridHeight);
		let iClientWidth = this.#Screen.clientWidth;
		let iClientHeight = this.#Screen.clientHeight;
		let svg_width_x_height = null;
		if (iClientHeight <= 0) { //no styles loaded case, emulating calculation with 16px font size
			iClientHeight = 16 * this.#iGridHeight;
			this.#Screen.style.height = iClientHeight + 'px';
			svg_width_x_height = "100%";
		}
		this.#iGridSpacingX = Math.ceil(iClientWidth / this.#iGridWidth);
		// this.#iGridSpacingY = Math.ceil(iClientHeight / this.#iGridHeight);
		//this.#PointRadius = (4 / this.#iGridSpacingX);
		this.#LineStrokeWidth = (3 / this.#iGridSpacingX);

		this.#sLastMoveGameTimeStamp = sLastMoveGameTimeStamp;
		this.#sVersion = version;
		///////CpuGame variables start//////
		this.#rAF_StartTimeStamp = null;
		this.#rAF_FrameID = null;
		this.#workingCyclePolyLine = null;
		this.#cyclesFound = [];
		///////CpuGame variables end//////

		this.#SvgVml = new SvgVml();
		if (!this.#SvgVml.Init(this.#Screen, svg_width_x_height, svg_width_x_height,
			{ iGridWidth: this.#iGridWidth, iGridHeight: this.#iGridHeight })) {
			if (localizeSelector)
				LocalAlert(localizeMessage('err.noSVG', 'SVG is not supported! 😢'), localizeMessage('err.err!', 'Error!'));
			else
				LocalAlert("SVG is not supported!", "Error!");
		}

		const stateStore = new GameStateStore(useIndexedDbStore,
			this.#CreateScreenPointFromIndexedDb.bind(this),
			this.#CreateScreenPathFromIndexedDb.bind(this),
			this.#GetGameStateForIndexedDb.bind(this),
			this.#sVersion);
		this.#Lines = stateStore.GetPathStore();
		this.#Points = stateStore.GetPointStore();
		this.#bPointsAndPathsLoaded = await stateStore.PrepareStore();

		if (this.#bViewOnly === false) {

			if (this.#MouseCursorOval === null) {
				this.#MouseCursorOval = this.#SvgVml.CreateOval(/* this.#PointRadius */);
				this.#MouseCursorOval.SetFillColor(this.#sDotColor);
				// this.#MouseCursorOval.SetStrokeColor(this.#sDotColor);
				this.#MouseCursorOval.SetZIndex(-1);
				this.#MouseCursorOval.Hide();
				this.#MouseCursorOval.setAttribute("data-status", "MOUSE_POINTER");
			}

			this.#Screen.onmousedown = this.#OnMouseDown.bind(this);
			this.#Screen.onmousemove = this.#OnMouseMove.bind(this);
			this.#Screen.onmouseup = this.#OnMouseUp.bind(this);
			this.#Screen.onmouseleave = this.#OnMouseLeave.bind(this);

			this.#CancelPath.onclick = this.#OnCancelClick.bind(this);
			this.#StopAndDraw.onclick = this.#OnStopAndDraw.bind(this);
			if (false === this.#bIsCPUGame) {
				//Human game, not AI
				document.querySelector(this.#sMsgInputSel).disabled = '';

				this.#MessagesRingBufferStore = new MessagesRingBufferStore(window.localStorage, this);
				this.#MessagesRingBufferStore.RestoreMessages(this.#sMsgListSel, this.#iPlayerID, this.#iOtherPlayerId, this.#bIsPlayingWithRed, this.#Player1Name, this.#Player2Name);
			}
			else {
				//AI game or CPU game

				//Service Menu
				if (document.querySelector(arrServiceModeControls[0]) !== null) {
					// document.getElementById('testArea').classList.remove("d-none");
					let i = 0;
					if (ddlTestActions.length > i)
						document.querySelector(ddlTestActions[i++]).onclick = this.#OnTestBuildCurrentGraph.bind(this);
					if (ddlTestActions.length > i)
						document.querySelector(ddlTestActions[i++]).onclick = this.#OnTestConcaveman.bind(this);
					if (ddlTestActions.length > i)
						document.querySelector(ddlTestActions[i++]).onclick = this.#OnTestMarkAllCycles.bind(this);
					if (ddlTestActions.length > i)
						document.querySelector(ddlTestActions[i++]).onclick = this.#OnTestGroupPoints.bind(this);
					if (ddlTestActions.length > i)
						document.querySelector(ddlTestActions[i++]).onclick = this.#OnTestFindSurroundablePoints.bind(this);
					if (ddlTestActions.length > i)
						document.querySelector(ddlTestActions[i++]).onclick = this.#OnTestDFS2.bind(this);
					if (ddlTestActions.length > i)
						document.querySelector(ddlTestActions[i++]).onclick = this.#OnTestFloodFill.bind(this);
					if (ddlTestActions.length > i)
						document.querySelector(ddlTestActions[i++]).onclick = this.#OnTestAStar.bind(this);
					if (ddlTestActions.length > i)
						document.querySelector(ddlTestActions[i++]).onclick = this.#OnTestClustering.bind(this);

					document.querySelector(arrServiceModeControls[1]).onclick = this.#OnTestServiceModeClick.bind(this);
					document.querySelector(arrServiceModeControls[2]).onclick = this.#OnTestServiceModeClick.bind(this);
				}

				//Difficulty level selectors
				if (arrDifficultySelectors && arrDifficultySelectors.length === 3) {
					//get all 3 selectors from #id: easy, medium, hard
					const easy = document.querySelector(arrDifficultySelectors[0]),
						medium = document.querySelector(arrDifficultySelectors[1]),
						hard = document.querySelector(arrDifficultySelectors[2]);

					//load AI params from local_storage
					let aiParams = this.#LoadAIParamsFromStore(window.localStorage);

					//implement on change on all of those selectors
					const onChangeDifficulty = (event) => {
						if (event.target === easy && easy.checked === true) {
							//easy selected
							medium.checked = hard.checked = false;
							aiParams = this.#LoadAIParamsFromStore(window.localStorage);
							aiParams = { ...aiParams, minPointsPerCluster: 3 };
							this.#SaveAIParamsToStore(aiParams, window.localStorage);//save params to local_storage
						}
						else if (event.target === medium && medium.checked === true) {
							//medium selected
							easy.checked = hard.checked = false;
							aiParams = this.#LoadAIParamsFromStore(window.localStorage);
							aiParams = { ...aiParams, minPointsPerCluster: 2 };
							this.#SaveAIParamsToStore(aiParams, window.localStorage);//save params to local_storage
						}
						else if (event.target === hard && hard.checked === true) {
							//hard selected
							easy.checked = medium.checked = false;
							aiParams = this.#LoadAIParamsFromStore(window.localStorage);
							aiParams = { ...aiParams, minPointsPerCluster: 1 };
							this.#SaveAIParamsToStore(aiParams, window.localStorage);//save params to local_storage
						}
					};
					easy.onchange = medium.onchange = hard.onchange = onChangeDifficulty;


					//set initial state from local_storage
					const savedDifficulty = (aiParams.minPointsPerCluster || 2);
					if (savedDifficulty === 3) {
						medium.checked = hard.checked = false;
						easy.checked = true;
					}
					else if (savedDifficulty === 2) {
						easy.checked = hard.checked = false;
						medium.checked = true;
					}
					else if (savedDifficulty === 1) {
						easy.checked = medium.checked = false;
						hard.checked = true;
					}
					else {
						//default to medium
						easy.checked = hard.checked = false;
						medium.checked = true;
					}
				}


				document.querySelector(this.#sMsgInputSel).disabled = 'disabled';
				//chat functionality is not needed in CPU game, so we can

				//disable or even delete chat functionality, coz we're not going to chat with CPU bot
				//const chatSection = document.querySelector(this.#sMsgListSel).parentElement;
				//chatSection.parentElement.removeChild(chatSection);

				//if (!this.#bIsPlayerActive)
				//	this.#StartCPUCalculation();
				this.#AIMethod = window.localStorage.getItem('AIMethod');
				if (!this.#AIMethod) {
					this.#AIMethod = 'surrounding';
					window.localStorage.setItem('AIMethod', this.#AIMethod);
				}
			}

			this.#SurrenderButton.disabled = '';

			if (localizeSelector) {
				if (this.#Player2Name.textContent === '???') {
					this.#ShowStatusI18n('game.waitingForOther', 'Waiting for other player to connect');
					this.#Screen.style.cursor = "wait";
				}
				else {
					this.#SurrenderButton.dataset.i18n = 'ib:game.surrender';
					this.#SurrenderButton.value = 'surrender';

					if (this.#bIsPlayerActive) {
						this.#ShowStatusI18n('game.yourMove', 'Your move');
						this.#Screen.style.cursor = "crosshair";
						this.#StopAndDraw.disabled = '';
					}
					else {
						this.#ShowStatusI18n('game.waitingForOppo', 'Waiting for opponent move');
						this.#Screen.style.cursor = "wait";
					}
					if (!this.#bDrawLines) {
						this.#StopAndDraw.dataset.i18n = 'ib:game.drawLine';
					}
					else {
						this.#StopAndDraw.dataset.i18n = 'ib:game.drawDot';
					}
				}
			}
			else {
				if (this.#Player2Name.textContent === '???') {
					this.#ShowStatusI18n('game.waitingForOther', 'Waiting for other player to connect');
					this.#Screen.style.cursor = "wait";
				}
				else {
					this.#SurrenderButton.value = 'surrender';
					this.#SurrenderButton.textContent = 'surrender';

					if (this.#bIsPlayerActive) {
						this.#ShowStatusI18n('game.yourMove', 'Your move');
						this.#Screen.style.cursor = "crosshair";
						this.#StopAndDraw.disabled = '';
					}
					else {
						this.#ShowStatusI18n('game.waitingForOppo', 'Waiting for opponent move');
						this.#Screen.style.cursor = "wait";
					}
					if (!this.#bDrawLines)
						this.#StopAndDraw.textContent = 'Draw line';
					else
						this.#StopAndDraw.textContent = 'Draw dot';
				}
			}
		}
		else {
			if (localizeSelector)
				document.querySelector(sPause).dataset.i18n = 'ib:game.back2List';
			else
				document.querySelector(sPause).textContent = 'back to Game List';
		}

		//set status info for player, color, "who is who" stuff.
		const whichColor = document.getElementById('whichColor');
		const whichPlayer = document.getElementById('whichPlayer');
		whichColor.style.color = this.#sDotColor;
		if (this.#bIsPlayingWithRed) {
			whichColor.dataset.i18n = 'ib:game.withRed'/* "red" */;
			if (this.#bIsThisPlayer1) {
				this.#Player1Name.style.color = this.#COLOR_RED;
				this.#Player2Name.style.color = this.#COLOR_BLUE;
				whichPlayer.dataset.i18n = 'ib:game.player1'/* "Player 1" */;
			}
			else {
				this.#Player1Name.style.color = this.#COLOR_BLUE;
				this.#Player2Name.style.color = this.#COLOR_RED;
				whichPlayer.dataset.i18n = 'ib:game.player2'/* "Player 2" */;
			}
		} else {
			whichColor.dataset.i18n = 'ib:game.withBlue'/* "blue" */;
			if (this.#bIsThisPlayer1) {
				this.#Player1Name.style.color = this.#COLOR_BLUE;
				this.#Player2Name.style.color = this.#COLOR_RED;
				whichPlayer.dataset.i18n = 'ib:game.player1'/* "Player 1" */;
			}
			else {
				this.#Player1Name.style.color = this.#COLOR_RED;
				this.#Player2Name.style.color = this.#COLOR_BLUE;
				whichPlayer.dataset.i18n = 'ib:game.player2'/* "Player 2" */;
			}
		}

		if (localizeSelector)
			localizeSelector('p.inkgame,div.container.inkgame');
	}

	/**
	 * DOMContentLoaded page event
	 */
	static OnGameDOMContentLoaded() {
		//tries to register localization function; it will return callback that we store for later use when localizing individual selector elements
		if (!window.localize && window.registerLocalizationOnReady && Array.isArray(window.registerLocalizationOnReady)) {
			window.registerLocalizationOnReady.push(localize => {
				localizeSelector = typeof localize === "function" ? localize : undefined;
			});
		}
		else
			localizeSelector = window.localize;
	}

	/**
	 * On load handler of maine game page
	 * @param {object} gameOptions options object passed from page with various settings and configs
	 */
	static async OnGameLoad(gameOptions) {
		const isMsgpackDefined = window.msgpack5 !== undefined;
		// const gameOptions = window.gameOptions;

		const inkBallHubName = gameOptions.inkBallHubName;
		const iGameID = gameOptions.iGameID;
		document.getElementById('gameID').textContent = iGameID;
		document.querySelector(".container.inkgame form > input[type='hidden'][name='GameID']").value = iGameID;
		const iPlayerID = gameOptions.iPlayerID;
		const iOtherPlayerID = parseInt(document.querySelector('.msgchat').dataset.otherplayerid) || null;
		gameOptions.iOtherPlayerID = iOtherPlayerID;
		document.getElementById('playerID').textContent = iPlayerID;
		const bPlayingWithRed = gameOptions.bPlayingWithRed;
		const bIsThisPlayer1 = gameOptions.bIsThisPlayer1;
		const bPlayerActive = gameOptions.bPlayerActive;
		const gameType = gameOptions.gameType;
		const protocol = isMsgpackDefined && gameOptions.isMessagePackProtocol === true ? new signalR.protocols.msgpack.MessagePackHubProtocol() : new signalR.JsonHubProtocol();
		const servTimeoutMillis = gameOptions.servTimeoutMillis;
		const isReadonly = gameOptions.isReadonly;
		const pathAfterPointDrawAllowanceSecAmount = gameOptions.pathAfterPointDrawAllowanceSecAmount;
		const sLastMoveTimeStampUtcIso = new Date(gameOptions.sLastMoveGameTimeStamp).toISOString();
		const version = gameOptions.version;

		await importAllModulesAsync(/* gameOptions */);

		const game = new InkBallGame(iGameID, iPlayerID, iOtherPlayerID, inkBallHubName, signalR.LogLevel.Warning, protocol,
			signalR.HttpTransportType.None, servTimeoutMillis,
			gameType, bPlayingWithRed, bIsThisPlayer1, bPlayerActive, isReadonly, pathAfterPointDrawAllowanceSecAmount
		);
		await game.#PrepareDrawing('#screen', '#Player1Name', '#Player2Name', '#gameStatus', '#SurrenderButton',
			'#CancelPath', '#Pause', '#StopAndDraw', '#messageInput', '#messagesList', '#sendButton',
			sLastMoveTimeStampUtcIso, gameOptions.PointsAsJavaScriptArray === null, version,
			['#TestBuildGraph', '#TestConcaveman', '#TestMarkAllCycles', '#TestGroupPoints', '#TestFindSurroundablePoints', '#TestDFS2', '#FloodFill', '#AStar', '#AISurrPredict'],
			['#serviceMenu', '#cbSrvMnuRed', '#cbSrvMnuBlue'], ['#radEasy', '#radMedium', '#radHard']);

		if (gameOptions.PointsAsJavaScriptArray !== null) {
			await game.#StartSignalRConnection(false);
			await game.#SetAllPoints(PlayerPointsAndPathsDTO.UnMinimizePoints(gameOptions.PointsAsJavaScriptArray, iPlayerID, iOtherPlayerID));
			await game.#SetAllPaths(gameOptions.PathsAsJavaScriptArray);
		}
		else {
			await game.#StartSignalRConnection(true);
		}
		//alert('a QQ');
		await game.#CountPointsDebug("#debug2");

		//delete window.gameOptions;
		window.game = game;
	}

	/**
	 * Before unload page handler
	 */
	static OnBeforeUnload() {
		if (window.game)
			window.game.StopSignalRConnection();
	}




	///////CpuGame variables methods start//////
	/**
	 * Gets random number in range: min(inclusive) - max (exclusive)
	 * @param {number} min - from(inclusive)
	 * @param {number} max - to (exclusive)
	 * @returns {number} random number
	 */
	#GetRandomInt(min, max) {
		min = Math.max(0, Math.min(min, this.#iGridWidth));
		max = Math.max(0, Math.min(max, this.#iGridWidth));
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
	}

	async #FindRandomCPUPoint() {
		let max_random_pick_amount = 100, x, y;
		//loading all line up front and pass into below "looped" function calls
		const allLines = await this.#Lines.all();//TODO: async for
		while (--max_random_pick_amount > 0) {
			x = this.#GetRandomInt(0, this.#iGridWidth);
			y = this.#GetRandomInt(0, this.#iGridHeight);

			if (!(await this.#Points.has(y * this.#iGridWidth + x)) && IsPointOutsideAllPaths(x, y, allLines)) {
				break;
			}
		}

		const cmd = new InkBallPointViewModel(this.#iGameID, -1/*player*/, x, y, StatusEnum.POINT_FREE_BLUE, 0);
		return cmd;
	}

	async #CalculateCPUCentroid() {
		let centroidX = 0, centroidY = 0, count = 0, x, y;
		const sHumanColor = this.#COLOR_RED;

		for (const pt of await this.#Points.values()) {
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
		const allLines = await this.#Lines.all();//TODO: async for
		while (++random_pick_amount_cnter <= 50) {
			random_picked_points.add(`${x}_${y}`);
			if (false === (await this.#Points.has(y * this.#iGridWidth + x)) &&
				true === IsPointOutsideAllPaths(x, y, allLines)) {
				log_str += (`checking centroid coords ${x}_${y} succeed\n`);
				break;
			}
			log_str += (`checking coords ${x}_${y} failed #${random_pick_amount_cnter}\n`);
			if (random_pick_amount_cnter >= 25)
				spread *= 2;

			let spread_cnter = 50;
			do {
				x = this.#GetRandomInt(centroidX - spread, centroidX + spread + 1);
				y = this.#GetRandomInt(centroidY - spread, centroidY + spread + 1);
			} while (--spread_cnter > 0 && random_picked_points.has(`${x}_${y}`));
		}
		if (random_pick_amount_cnter >= 50) {
			log_str += ('finding centroid failed\n');
			LocalLog(log_str);
			return null;
		}
		else
			LocalLog(log_str);

		const pt = new InkBallPointViewModel(this.#iGameID, -1/*player*/, x, y, StatusEnum.POINT_FREE_BLUE, 0);
		return pt;
	}

	async #FindNearestCPUPoint() {
		if (this.#iLastX >= 0 && this.#iLastY >= 0) {
			let x = this.#iLastX, y = this.#iLastY;
			let log_str = "";
			const random_picked_points = new Set();

			let random_pick_amount_cnter = 0, spread = 1;
			//loading all line up front and pass into below "looped" function calls
			const allLines = await this.#Lines.all();//TODO: async for
			while (++random_pick_amount_cnter <= 50) {
				random_picked_points.add(`${x}_${y}`);
				if (false === (await this.#Points.has(y * this.#iGridWidth + x)) &&
					true === IsPointOutsideAllPaths(x, y, allLines)) {
					log_str += (`checking nearest coords ${x}_${y} succeed\n`);
					break;
				}
				log_str += (`checking coords ${x}_${y} failed #${random_pick_amount_cnter}\n`);
				// if (random_pick_amount_cnter >= 25)
				// 	spread *= 2;

				let spread_cnter = 20;
				do {
					x = this.#GetRandomInt(this.#iLastX - spread, this.#iLastX + spread + 1);
					y = this.#GetRandomInt(this.#iLastY - spread, this.#iLastY + spread + 1);
				} while (--spread_cnter > 0 && random_picked_points.has(`${x}_${y}`));
			}
			if (random_pick_amount_cnter >= 50) {
				log_str += ('finding nearest failed\n');
				LocalLog(log_str);
				return null;
			}
			else
				LocalLog(log_str);

			const pt = new InkBallPointViewModel(this.#iGameID, -1/*player*/, x, y, StatusEnum.POINT_FREE_BLUE, 0);
			return pt;
		}

		return null;
	}

	// Returns true if the graph contains a cycle, else false. 
	// eslint-disable-next-line no-unused-private-class-members
	#IsGraphCyclic(graph) {
		const vertices = graph.vertices;

		const isCyclicUtil = (v, parent) => {
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
		};

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
	 * @param {object} [param0] is a optional object comprised of:
	 *	@param {number} param0.freePointStatus - status of free point
	 *	@param {string} param0.cpuFillColor - CPU point color
	 * @returns {object} graph object with vertices and edges
	 */
	async #BuildGraph({
		freePointStatus = StatusEnum.POINT_FREE_BLUE,
		cpuFillColor = this.#COLOR_BLUE
		//, visuals: presentVisually = false
	} = {}) {
		const graph_points = new Map(), graph_edges = new Map();

		const isPointOKForPath = function (allowedPoints, pt) {
			const status = pt.GetStatus();

			if (allowedPoints.includes(status) && pt.GetFillColor() === cpuFillColor)
				return true;
			return false;
		};

		const freePointStatusArr = [freePointStatus];
		const addPointsAndEdgesToGraph = (point, to_x, to_y, x, y) => {
			if (to_x >= 0 && to_x < this.#iGridWidth && to_y >= 0 && to_y < this.#iGridHeight) {
				const next = this.#Points.get(to_y * this.#iGridWidth + to_x);
				if (next && isPointOKForPath(freePointStatusArr, next) === true) {

					const point_hash = `${x},${y}`;
					const next_hash = `${to_x},${to_y}`;
					if (graph_edges.has(`${point_hash}_${next_hash}`) === false && graph_edges.has(`${next_hash}_${point_hash}`) === false) {
						//if (presentVisually === true) {
						//	const line = CreateLine(3, 'rgba(0, 255, 0, 0.3)');
						//	line.move(x, y, next_pos.x, next_pos.y);
						//	edge.line = line;
						//}
						graph_edges.set(`${point_hash}_${next_hash}`, { from: point, to: next });


						if (!graph_points.has(point_hash)) {
							point.adjacents = [next];
							graph_points.set(point_hash, point);
						} else {
							const pt = graph_points.get(point_hash);
							pt.adjacents.push(next);
						}
						if (!graph_points.has(next_hash)) {
							next.adjacents = [point];
							graph_points.set(next_hash, next);
						} else {
							const pt = graph_points.get(next_hash);
							pt.adjacents.push(point);
						}
					}
				}
			}
		};

		const all_points = await this.#Points.values();
		const good_point_status_arr = [freePointStatus, this.POINT_STARTING, this.POINT_IN_PATH];
		for (const point of all_points) {
			if (point && isPointOKForPath(good_point_status_arr, point) === true) {
				const { x, y } = point.GetPosition();
				//TODO: await all below promises
				//east
				addPointsAndEdgesToGraph(point, x + 1, y, x, y);
				//west
				addPointsAndEdgesToGraph(point, x - 1, y, x, y);
				//north
				addPointsAndEdgesToGraph(point, x, (y - 1), x, y);
				//south
				addPointsAndEdgesToGraph(point, x, (y + 1), x, y);
				//north_west
				addPointsAndEdgesToGraph(point, x - 1, (y - 1), x, y);
				//north_east
				addPointsAndEdgesToGraph(point, x + 1, (y - 1), x, y);
				//south_west
				addPointsAndEdgesToGraph(point, x - 1, (y + 1), x, y);
				//south_east
				addPointsAndEdgesToGraph(point, x + 1, (y + 1), x, y);
			}
		}
		//return graph
		return {
			vertices: Array.from(graph_points.values()),
			edges: Array.from(graph_edges.values()),
			getNeighbors: function (vert) {
				const found = this.vertices.find(v => v === vert);
				if (found)
					return found.adjacents;
				return [];
			}
		};
	}

	/**
	 * Based on https://www.geeksforgeeks.org/print-all-the-cycles-in-an-undirected-graph/
	 * @param {object} graph constructed earlier with BuildGraph
	 * @param {string} sHumanColor - human red playing color
	 * @returns {Array} of cycles
	 */
	async #MarkAllCycles(graph, sHumanColor) {
		const vertices = graph.vertices;
		const N = vertices.length, PARTIALLY_VISITED = 1, COMPLETELY_VISITED = 2;
		let cycles = new Array(N);
		// mark with unique numbers
		const mark = new Array(N);
		// arrays required to color the 
		// graph, store the parent of node 
		const color = new Array(N), par = new Array(N);

		for (let i = 0; i < N; i++) {
			mark[i] = []; cycles[i] = [];
		}

		const vertexImmediatePresenterFn = async (vertex, color = 'black', sleepTimeMs = 25) => {
			const { x, y } = vertex.GetPosition();
			const visible_vertex = this.#Points.get(y * this.#iGridWidth + x);

			visible_vertex.SetStrokeColor(color);
			visible_vertex.SetFillColor(color);
			visible_vertex.StrokeWeight(0.2);
			visible_vertex.setAttribute("r", 6 / this.#iGridSpacingX);

			await Sleep(sleepTimeMs);
		};

		const dfs_cycle = async (u, p) => {
			// already (completely) visited vertex. 
			if (color[u] === COMPLETELY_VISITED)
				return;

			// seen vertex, but was not completely visited -> cycle detected. 
			// backtrack based on parents to find the complete cycle. 
			if (color[u] === PARTIALLY_VISITED) {
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
			color[u] = PARTIALLY_VISITED;
			const vertex = vertices[u];
			if (vertex) {

				await vertexImmediatePresenterFn(vertex);

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
			color[u] = COMPLETELY_VISITED;
		};

		const printCycles = async (edgesCount, mark) => {
			// push the edges that into the 
			// cycle adjacency list 
			for (let e = 0; e < edgesCount; e++) {
				const mark_e = mark[e];
				if (mark_e !== undefined && mark_e.length > 0) {
					for (let m = 0; m < mark_e.length; m++) {
						const found_c = cycles[mark_e[m]];
						if (found_c)
							found_c.push(e);
					}
				}
			}

			//sort by point length(only cycles >= 4): first longest cycles, most points
			cycles = cycles.filter(c => c.length >= 4).sort((b, a) => a.length - b.length);

			//gather free human player points that could be intercepted.
			const free_human_player_points = [];
			//loading all line up front and pass into below "looped" function calls
			const allLines = await this.#Lines.all();//TODO: async for
			for (const pt of await this.#Points.values()) {
				if (pt !== undefined && pt.GetFillColor() === sHumanColor && StatusEnum.POINT_FREE_RED === pt.GetStatus()) {
					const { x, y } = pt.GetPosition();
					if (false === IsPointOutsideAllPaths(x, y, allLines))
						continue;

					//check if really exists
					const pt1 = this.#Points.get(y * this.#iGridWidth + x);
					if (pt1)
						free_human_player_points.push({ x, y });
				}
			}


			const tab = [];
			// traverse through all the vertices with same cycle
			for (let i = 0; i <= cyclenumber; i++) {
				const cycl = cycles[i];//get cycle
				if (cycl && cycl.length > 0) {	//some checks
					// Print the i-th cycle
					let str = (`Cycle Number ${i}: `), trailing_points = [];
					const rand_color = 'var(--bs-teal)';

					//convert to logical space
					const mapped_verts = cycl.map(c => vertices[c].GetPosition());
					//sort clockwise (https://stackoverflow.com/questions/45660743/sort-points-in-counter-clockwise-in-javascript)
					const cw_sorted_verts = sortPointsClockwise(mapped_verts);

					//display which cycle we are dealing with
					for (const vert of cw_sorted_verts) {
						const { x, y } = vert;
						const pt = this.#Points.get(y * this.#iGridWidth + x);
						if (pt) {//again some basic checks
							str += (`(${x},${y})`);

							pt.SetStrokeColor(rand_color);
							pt.SetFillColor(rand_color);
							pt.StrokeWeight(0.2);
							pt.setAttribute("r", 6 / this.#iGridSpacingX);
						}
						await Sleep(50);
					}

					//find for all free_human_player_points which cycle might intercept it (surrounds)
					//only convex, NOT concave :-(
					let tmp = '', comma = '';
					for (const possible_intercept of free_human_player_points) {
						if (false !== pnpoly(cw_sorted_verts, possible_intercept.x, possible_intercept.y)) {
							tmp += `${comma}(${possible_intercept.x},${possible_intercept.y})`;

							const pt1 = this.#Points.get(possible_intercept.y * this.#iGridWidth + possible_intercept.x);
							if (pt1) {
								const col = 'var(--bs-yellow)';
								pt1.SetStrokeColor(col);
								pt1.StrokeWeight(0.2);
								pt1.SetFillColor(col);
								pt1.setAttribute("r", 6 / this.#iGridSpacingX);
							}
							comma = ',';
						}
					}
					//gathering of some data and console printing
					trailing_points.unshift(str);
					tab.push(trailing_points);
					//log...
					LocalLog(str + (tmp !== '' ? ` possible intercepts: ${tmp}` : ''));
					//...and clear
					const pts2reset = Array.from(document.querySelectorAll(`svg > circle[fill="${rand_color}"][r="${6 / this.#iGridSpacingX}"]`));
					pts2reset.forEach(pt => {
						pt.SetStrokeColor(this.#COLOR_BLUE);
						pt.StrokeWeight(0.2);
						pt.SetFillColor(this.#COLOR_BLUE);
						pt.setAttribute("r", 6 / this.#iGridSpacingX);
					});
				}
			}
			return tab;
		};

		// store the numbers of cycle
		let cyclenumber = 0;

		// call DFS to mark the cycles
		for (let vind = 0; vind < N; vind++) {
			await dfs_cycle(vind + 1, vind);
		}

		// function to print the cycles
		return await printCycles(N, mark);
	}

	async #DFS2(graph, clickedPoint) {
		const module = await import('./depthFirstSearch.js?v=' + IBversionHash);
		const depthFirstSearch = module.default;


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

			await this.#DisplayPointsProgressWithDelay(cw_sorted_verts, 250);
		};

		await depthFirstSearch(graph, clickedPoint, { enterVertex, leaveVertex, showCycle });
	}

	/**
	 * Display path line for diagnostics
	 * @param {Array<InkBallPointViewModel>} pointsArr array of points
	 * @param {number} sleepMillisecs millisecs to delay
	 */
	async #DisplayPointsProgressWithDelay(pointsArr, sleepMillisecs = 25) {
		//
		//serialize points as string: "x0,y0 x1,y1 x2,y2"
		//
		// const pts = pointsArr.map(pt => {
		// 	const { x, y } = typeof pt.GetPosition === "function" ? pt.GetPosition() : pt;
		// 	return `${x},${y}`;
		// }).join(' ');
		const pts = pointsArr.reduce((acc, pt) => {
			const { x, y } = typeof pt.GetPosition === "function" ? pt.GetPosition() : pt;
			return acc + `${x},${y} `;
		}, '').trimEnd();

		//if not existing, create new...
		if (this.#workingCyclePolyLine === null) {
			this.#workingCyclePolyLine = this.#SvgVml.CreatePolyline(pts, 'black');
			this.#workingCyclePolyLine.SetID(-1);
		}
		else//...else replace last create path
			this.#workingCyclePolyLine.SetPoints(pts);

		if (sleepMillisecs > 0)
			await Sleep(sleepMillisecs);
	}

	/**
	 * Floyd's tortoise and hare
	 * https://en.wikipedia.org/wiki/Cycle_detection
	 * @param {(element: number) => boolean} getNextFunc function where getNextFunc(x0) is the element/node next to x0
	 * @param {number} head index of element
	 * @returns {object} length of the shortest cycle and starting point
	 */
	#floyd(getNextFunc, head) {
		// Main phase of algorithm: finding a repetition x_i = x_2i.
		// The hare moves twice as quickly as the tortoise and
		// the distance between them increases by 1 at each step.
		// Eventually they will both be inside the cycle and then,
		// at some point, the distance between them will be
		// divisible by the period λ.

		// let tortoise = getNextFunc(head); // getNextFunc(x0) is the element/node next to x0.
		// let hare = getNextFunc(getNextFunc(head));
		// while (tortoise !== hare) {
		// 	tortoise = getNextFunc(tortoise);
		// 	hare = getNextFunc(getNextFunc(hare));
		// }

		let tortoise = getNextFunc(head); // getNextFunc(x0) is the element/node next to x0.
		let hare = getNextFunc(getNextFunc(head));
		while (tortoise !== undefined && hare !== undefined && tortoise !== hare) {
			tortoise = getNextFunc(tortoise);
			hare = getNextFunc(getNextFunc(hare));
		}

		// if there is no loop exit now
		if (tortoise !== hare)
			return false;

		return true;

		// At this point the tortoise position, ν, which is also equal
		// to the distance between hare and tortoise, is divisible by
		// the period λ. So hare moving in circle one step at a time, 
		// and tortoise (reset to x0) moving towards the circle, will 
		// intersect at the beginning of the circle. Because the 
		// distance between them is constant at 2ν, a multiple of λ,
		// they will agree as soon as the tortoise reaches index μ.

		// Find the position μ of first repetition.    
		/*
		let mu = 0;
		tortoise = head;
		while (tortoise !== hare) {
			tortoise = getNextFunc(tortoise);
			hare = getNextFunc(hare);   // Hare and tortoise move at same speed
			mu += 1;
		}
	
		// Find the length of the shortest cycle starting from x_μ
		// The hare moves one step at a time while tortoise is still.
		// lam is incremented until λ is found.
		let lam = 1;
		hare = getNextFunc(tortoise);
		while (tortoise !== hare) {
			hare = getNextFunc(hare);
			lam += 1;
		}
	
		return { lam, mu };
		*/
	}

	/**
	 * Find cycles in connected points
	 * @param {Array<InkBallPointViewModel>} currPointsArr is array of points
	 * @param {InkBallPointViewModel} point to test
	 * @returns {Promise<Array>} of found candidates
	 */
	async #GroupPointsRecurse(currPointsArr, point) {
		//stop conditions. simple
		if (point === undefined || currPointsArr.includes(point)
			/* || currPointsArr.length > 60  */ || this.#cyclesFound.length > 3
		) {
			return currPointsArr;
		}
		//only opponent points, starting and not in path are allowed to be traversed
		if ([StatusEnum.POINT_FREE_BLUE, StatusEnum.POINT_STARTING, StatusEnum.POINT_IN_PATH].includes(point.GetStatus()) === false ||
			point.GetFillColor() !== this.#COLOR_BLUE) {
			return currPointsArr;
		}

		const { x, y } = point.GetPosition();
		if (currPointsArr.length > 0) {
			const last = currPointsArr.at(-1);
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

		if (currPointsArr.length >= 4) {
			//draw currently constructed cycle path
			await this.#DisplayPointsProgressWithDelay(currPointsArr);

			const first_pos = currPointsArr[0].GetPosition();
			const last_pos = currPointsArr.at(-1).GetPosition();

			//check if first point is within 1 jump away from last point - indicating of cycle found
			if (Math.abs(last_pos.x - first_pos.x) <= 1 && Math.abs(last_pos.y - first_pos.y) <= 1) {
				const points = currPointsArr.slice(); //copy array in current state
				points.push(currPointsArr[0]);//adding current checking point, 'coz it is forming a cycle

				const floyd_result = this.#floyd(ind_or_obj => {
					if (ind_or_obj === undefined)
						return undefined;

					let ind;
					if (Number.isInteger(ind_or_obj)) {
						//ind_or_obj is integer so index array
						ind = ind_or_obj;
						if (ind >= points.length)
							return undefined;
					}
					else {
						//ind_or_obj is object so get index out of array
						ind = points.indexOf(ind_or_obj) + 1;
						if (ind >= points.length)
							return undefined;
					}

					return points[ind];
				}, 0);
				if (floyd_result === true)
					this.#cyclesFound.push(points);
			}
		}

		const [east, west, north, south, north_west, north_east, south_west, south_east] = await Promise.all([
			this.#Points.get(y * this.#iGridWidth + x + 1),
			this.#Points.get(y * this.#iGridWidth + x - 1),
			this.#Points.get((y - 1) * this.#iGridWidth + x),
			this.#Points.get((y + 1) * this.#iGridWidth + x),
			this.#Points.get((y - 1) * this.#iGridWidth + x - 1),
			this.#Points.get((y - 1) * this.#iGridWidth + x + 1),
			this.#Points.get((y + 1) * this.#iGridWidth + x - 1),
			this.#Points.get((y + 1) * this.#iGridWidth + x + 1)
		]);

		await this.#GroupPointsRecurse(currPointsArr, east);
		await this.#GroupPointsRecurse(currPointsArr, west);
		await this.#GroupPointsRecurse(currPointsArr, north);
		await this.#GroupPointsRecurse(currPointsArr, south);
		await this.#GroupPointsRecurse(currPointsArr, north_west);
		await this.#GroupPointsRecurse(currPointsArr, north_east);
		await this.#GroupPointsRecurse(currPointsArr, south_west);
		await this.#GroupPointsRecurse(currPointsArr, south_east);

		const index_of_last = currPointsArr.lastIndexOf(point);
		if (index_of_last !== -1) {
			currPointsArr.splice(index_of_last/* + 1*/);

			if (currPointsArr.length >= 2) {
				//draw currently constructed cycle path
				await this.#DisplayPointsProgressWithDelay(currPointsArr);
			}
		}
		//all is lost. nothing found. record this path and make sure
		//no other traversal ever repeat those blind traversals again
		return currPointsArr;
	}

	/**
	 * Calling iterative method
	 * @param {InkBallPointViewModel} startingPoint  point to start from
	 * @param {string} clickedColor color value to search for
	 * @param {string} replacementColor replacement color
	 */
	async #FloodFill(startingPoint, clickedColor, replacementColor) {
		const queue = [startingPoint.GetPosition()];
		const blanks_changed = new Set();
		const edge_points = new Map();

		while (queue.length > 0) {
			const { x, y } = queue.shift();
			const directions = [
				// { x: x, y: y },
				{ x: x - 1, y: y },
				{ x: x + 1, y: y },
				{ x: x, y: y - 1 },
				{ x: x, y: y + 1 }
				// ,{ x: x - 1, y: y + 1 },
				// { x: x + 1, y: y - 1 },
				// { x: x + 1, y: y + 1 },
				// { x: x - 1, y: y - 1 }
			];

			for (const newPos of directions) {
				if (false === (newPos.x < 0 || newPos.y < 0 || newPos.x >= this.#iGridWidth || newPos.y >= this.#iGridHeight)) {
					const point_position_hashed = newPos.y * this.#iGridWidth + newPos.x;

					if (false === blanks_changed.has(point_position_hashed)) {
						const point = this.#Points.get(point_position_hashed);

						if (point !== undefined) {
							const color = point.GetFillColor();

							if (color === clickedColor) {
								point.SetFillColor(replacementColor); point.SetStrokeColor(replacementColor); point.StrokeWeight(0.3);

								queue.push(newPos);
							}
							else if (color !== replacementColor && !edge_points.has(point_position_hashed)) {
								edge_points.set(point_position_hashed, { point, x: newPos.x, y: newPos.y });
							}
						}
						else {
							blanks_changed.add(point_position_hashed);

							queue.push(newPos);
						}
					}
				}
			}
		}
		LocalLog('edge_points: ');
		LocalLog([...edge_points.values().map(({ point }) => point)]);


		if (edge_points.size > 3) {
			//verification and constructing of surrounding path from edge_points
			const verts = [...edge_points.values()];//convert map values to array
			const gathered = verts.splice(-1, 1);//drop last vert from verts and create new array out of it

			let last = gathered[0];//take single vert as starting last value
			// let direction = null;
			// eslint-disable-next-line no-unused-vars
			const continuousTestFun = (v, index, arr) => {
				const res = Math.abs(v.x - last.x) <= 1 && Math.abs(v.y - last.y) <= 1;
				// if (res === true /* && direction !== null */) {
				// 	// const dir = { x: (last.x - v.x), y: (last.y - v.y) };
				// 	// v.direction = dir;
				// }
				return res;
			};
			/*
			// eslint-disable-next-line no-unused-vars
			const continuousSortFun = (left, right) => {
				if (!left.direction && !right.direction)
					return 0;
				if ((left.direction.x === direction.x && left.direction.y === direction.y) ||
					(right.direction.x === direction.x && right.direction.y === direction.y))
					return 0;
				const square_dist = ((left.direction.x - direction.x) + (left.direction.y - direction.y) +
					(right.direction.x - direction.x) + (right.direction.y - direction.y)) / 4;
				return square_dist;
			};
			*/
			for (let counter = verts.length; counter > 0; counter--) {//go in reverse order over every vertices
				let stop_counter = 0;
				const filtered_objs = verts.filter(continuousTestFun)/* .sort(continuousSortFun) */;
				do {
					const obj = filtered_objs.at(stop_counter);
					if (obj !== undefined) {
						const ind_or_negative_one = verts.indexOf(obj);
						if (ind_or_negative_one !== -1) {//new neighboring vertex found
							//move found vertex from verts into gathered array...
							//...and set new last from this moved vert
							const candidate = verts.splice(ind_or_negative_one, 1)[0];
							//direction = { x: (last.x - candidate.x), y: (last.y - candidate.y) };
							last = candidate;
							gathered.push(last);//add to found path points
							// LocalLog(`found direction: ${direction.x},${direction.y}, filtered_objs.cnt: ${filtered_objs.length}`);
							break;
						}
						//else {
						//	//neighboring vertex not found, break, we fail
						//	// break;
						//	// gathered.pop();
						//	// LocalLog(`missed direction: ${direction.x},${direction.y}, filtered_objs.cnt: ${filtered_objs.length}`);
						//}
					}
				}
				while (++stop_counter < 4);
			}
			//verification
			const { x, y } = startingPoint.GetPosition();
			if (
				//check if above loop exited with not consecutive points
				gathered.length <= 3 ||

				//check last and first path points that they close up nicely
				!(Math.abs(gathered.at(-1).x - gathered[0].x) <= 1 &&
					Math.abs(gathered.at(-1).y - gathered[0].y) <= 1
				) ||

				//check if "points-created-path" actually contains selected single point inside its boundaries
				false === pnpoly(gathered, x, y)
			) {
				await this.#DisplayPointsProgressWithDelay(gathered.map(({ point }) => point), 0);
				return;
			}

			LocalLog(gathered);
			await this.#DisplayPointsProgressWithDelay(gathered.map(({ point }) => point), 0);
		}
	}

	/**
	 * Calculate wrapping path around given points using divided bounding boxes method
	 * @param {Array<{x: number, y: number}>} pointCoords array of points to wrap around
	 * @param {(worker: Worker) => void} createRectForVisualsFunc optional function to create rectangle around points for visualization
	 * @param {Array<string>} humanPointColors colors of human points to skip
	 * @returns {Array<[number,number]>} array of points forming surrounding path
	 */
	/* 
		#CalculateWrappingPathFromDividedBoundingBoxes(pointCoords, createRectForVisualsFunc, humanPointColors) {
	
			//0. create bounding box around points wrapping all points in cluster
			const wrapping_bbox = AABB.fromPoints(pointCoords);
			wrapping_bbox.expand(1, 0, 0, this.#iGridHeight - 1, this.#iGridWidth - 1);//expand it a bit by 1 unit in all directions -> enlarge it
	
			// //draw bounding box for visualization
			// LocalLog(`wrapping_bbox: ${JSON.stringify(wrapping_bbox)}`);
	
			// createRectForVisualsFunc(wrapping_bbox.minX, wrapping_bbox.minY,
			// 	wrapping_bbox.maxX - wrapping_bbox.minX, wrapping_bbox.maxY - wrapping_bbox.minY);
	
	
	
			//1. Convert candidate_path to a Map to ensure uniqueness by x,y and to avoid duplicates
			//this hold points of prepared surrounding path
			const candidate_path = new Map();
			//2. devide wrapping_bbox into 1x1 unit bbox and gather matching points
			for (let j = wrapping_bbox.minY; j < wrapping_bbox.maxY; j++) {
				for (let i = wrapping_bbox.minX; i < wrapping_bbox.maxX; i++) {
	
					const current_unit_bbox = [
						// { x: i, y: j, ind: 0 },
						{ x: i + 1, y: j, ind: 1 },
						{ x: i, y: j + 1, ind: 2 },
						{ x: i + 1, y: j + 1, ind: 3 }
					];
	
					//3. check if any created bbox point contains any of the points in point_coords (cluster points)
					const contains_oponent_cluster_point = current_unit_bbox.filter(({ x, y }) => {
						// if (!(x >= 0 && x < this.#iGridWidth && y >= 0 && y < this.#iGridHeight)) {
						// 	// LocalLog(`Out-of-bounds point (${x},${y}) 1`);
						// 	return false;
						// } else
						return pointCoords.some(pt => pt.x === x && pt.y === y);
					});
					if (contains_oponent_cluster_point.length > 0) {
						//4. if so, create a rectangle around it 1x1 unit fir visualization
						createRectForVisualsFunc(i, j, 1, 1);
						//5. i,j and i+1, j+1 are dimensions of the bounding box
						// 	 find which points of it are NOT included in point_coords
						// 	 3 points of the rectangle
						for (const { x, y, ind } of current_unit_bbox) {
							// if (!(x >= 0 && x < this.#iGridWidth && y >= 0 && y < this.#iGridHeight)) {
							// 	// LocalLog(`Out-of-bounds point (${x},${y}) 2`);
							// 	continue;
							// }
	
							//6. not included in point_coords (not from cluster points), so they should be around
							// 	 cluster points, or inside
							const point = this.#Points.get(y * this.#iGridWidth + x);
							if (point !== undefined && humanPointColors.includes(point.GetFillColor()))
								continue; //skip human points
	
							if (!contains_oponent_cluster_point.some(q => q.ind !== ind && q.x === x && q.y === y)
								//no duplicates from already added points
								&& !candidate_path.has(`${x},${y}`)) {
								//7. add point to candidate path map
								candidate_path.set(`${x},${y}`, [x, y]);
							}
						}
					}
				}
			}
	
			//8. convert candidate_path_map to array of points
			const surrounding_path = [...candidate_path.values()];
			return surrounding_path;
		}
	*/
	async #rAFCallBack(timeStamp) {
		if (this.#rAF_StartTimeStamp === null) this.#rAF_StartTimeStamp = timeStamp;
		const elapsed = timeStamp - this.#rAF_StartTimeStamp;


		let point = null;
		switch (this.#AIMethod) {
			case 'centroid':
				{
					point = await this.#CalculateCPUCentroid();
					if (point === null)
						point = await this.#FindRandomCPUPoint();
				}
				break;
			case 'nearest':
				{
					point = await this.#FindNearestCPUPoint();
					if (point === null)
						point = await this.#FindRandomCPUPoint();
				}
				break;
			case 'surrounding':
				{
					const aiParams = this.#LoadAIParamsFromStore(window.localStorage);
					point = await this.#GetSurroundingPoints(this.#COLOR_RED, aiParams, false/*visuals*/);
					if (point === null)
						point = await this.#FindRandomCPUPoint();
				}
				break;
		}

		if (point === null) {
			if (elapsed < 2000)
				this.#rAF_FrameID = window.requestAnimationFrame(this.#rAFCallBack.bind(this));
		}
		else {
			//if (this.rAF_FrameID !== null) {
			//	window.cancelAnimationFrame(this.rAF_FrameID);
			//this.rAF_FrameID = null;
			//}

			await this.#SendData(point, () => {
				this.#bMouseDown = false;
				this.#bHandlingEvent = false;
			});
		}
	}

	#StartCPUCalculation() {
		if (this.#rAF_FrameID === null)
			this.#rAF_FrameID = window.requestAnimationFrame(this.#rAFCallBack.bind(this));
	}
	///////CpuGame variables methods end//////
}
/******** /funcs-n-classes ********/

/**
 * Home page OnLoad event
 * @param {string} modelMessage alert message
 * @param {boolean} bIsCurrentGameOk game status flag
 * @param {string} logoutPath logout url path
 * @param {string} loginPath login url path
 * @param {string} registerPath registerPath url path
 */
function HomeOnLoad(modelMessage, bIsCurrentGameOk, logoutPath, loginPath, registerPath) {

	const alert_msg = document.querySelector(".alert.alert-dismissible.inkhome");
	if (modelMessage !== "") {
		const [msg, i18l_err_key] = modelMessage.split(';');
		let addendum;
		if (msg.toLowerCase().indexOf('exception') !== -1 || msg.toLowerCase().indexOf('error') !== -1)
			addendum = 'danger';
		else if (msg.toLowerCase().indexOf('warning') !== -1)
			addendum = 'warning';
		else
			addendum = 'success';

		const statusMessageClass = 'alert-' + addendum;
		alert_msg.classList.add(statusMessageClass);
		const span = alert_msg.querySelector("span");
		span.textContent = msg;
		if (i18l_err_key)
			span.dataset.i18n = `ib:err.${i18l_err_key}`;
	}
	else
		alert_msg.parentNode.removeChild(alert_msg);


	const userName = document.querySelector("p.inkhome span:nth-child(2)").textContent;
	const bIsLoggedIn = userName !== '' ? true : false;

	const form = document.querySelector(".inkhome form");
	let innerForm = '';
	if (bIsLoggedIn) {
		if (bIsCurrentGameOk) {
			//continue
			innerForm += "<a href='Game' class='btn btn-primary btn-lg rounded-top' data-i18n='ib:home.continue'>Continue</a>";
		}
		else {
			//new game
			innerForm +=
				`<button type='submit' name='action' value='New game' class='btn btn-primary btn-lg rounded-top' data-i18n='ib:home.newGame'>New game</button>
<div class='w-100'><select name='GameType' id='GameType' class='form-select' required>
<option value='' selected='selected' data-i18n='ib:home.chooseGameType'>Choose game type</option>
<optgroup label='Game types' data-i18n='[label]ib:home.gameTypes.name'>
<option value='0' data-i18n='ib:home.gameTypes.firstCapture'>First capture wins</option>
<option value='1' data-i18n='ib:home.gameTypes.first5Captures'>First 5 captures wins</option>
<option value='2' data-i18n='ib:home.gameTypes.first5Paths'>First 5 paths wins</option>
<option value='3' data-i18n='ib:home.gameTypes.advantageOf5'>Advantage of 5 paths wins</option>
</optgroup>
</select>
<div class='invalid-feedback' data-i18n='ib:home.chooseGameType'>Invalid game type</div></div>

<div class='w-100'><select name='BoardSize' id='BoardSize' class='form-select' required>
<option value='' selected='selected' data-i18n='ib:home.boardSize.chooseBoardSize'>Choose board size</option>
<optgroup label='Board sizes' data-i18n='[label]ib:home.boardSize.boardSizes'>
<option value='20'>20 x 26</option>
<option value='40'>40 x 52</option>
<option value='64'>64 x 64</option>
</optgroup>
</select>
<div class='invalid-feedback' data-i18n='ib:home.boardSize.chooseBoardSize'>Invalid board size</div></div>

<div class='form-check form-switch w-100'>
<input type='checkbox' class='form-check-input form-control-input' name='CpuOponent' id='CpuOponent' />
<label class='form-check-label' for='CpuOponent' data-i18n='ib:home.playAgainstCPU'>Play against CPU</label>
</div>`;
		}

		innerForm +=
			`<a href='GamesList' class='btn btn-primary' data-i18n='ib:home.gamesList'>Games list</a>
<a href='Highscores' class='btn btn-primary' data-i18n='ib:home.best'>Best</a>
<a href='Rules' class='btn btn-primary' data-i18n='ib:home.gameRules'>Game rules</a>
${(logoutPath ? "<button type='submit' name='action' value='Logout' class='btn btn-warning rounded-bottom' formnovalidate='formnovalidate' data-i18n='ib:home.logout'>Logout</button>" : "")}`;
	}
	else {
		//not logged or bad

		const inkhome = document.querySelector("p.inkhome");
		inkhome.textContent = 'You are not logged in ... or allowed 😅';
		inkhome.dataset.i18n = 'ib:home.notLoggedIn';

		innerForm +=
			"<a href='Rules' class='btn btn-primary rounded-top' data-i18n='ib:home.gameRules'>Game rules</a>" +
			(loginPath ? `<a href='${sanitizeUrl(loginPath)}' class='btn btn-primary' data-i18n='ib:home.login'>Login</a>` : "") +
			(registerPath ? `<a href='${sanitizeUrl(registerPath)}' class='btn btn-primary rounded-bottom' data-i18n='ib:home.register'>Register</a>` : "");
	}
	form.innerHTML += innerForm;
}

/**
 * Processes on load event for games list page
 * @param {string} modelMessage alert message
 */
function ListOnLoad(modelMessage) {
	const alert_msg = document.querySelector(".alert.inkgames");
	// let msg = document.querySelector(".alert.inkgames > span").textContent;
	if (modelMessage !== "") {
		const [msg, i18l_err_key] = modelMessage.split(';');
		let addendum;
		if (msg.toLowerCase().indexOf('exception') !== -1 || msg.toLowerCase().indexOf('error') !== -1)
			addendum = 'danger';
		else if (msg.toLowerCase().indexOf('warning') !== -1)
			addendum = 'warning';
		else
			addendum = 'success';

		alert_msg.classList.add('alert-' + addendum);
		alert_msg.classList.remove('d-none');

		const span = alert_msg.querySelector("span");
		span.textContent = msg;
		if (i18l_err_key)
			span.dataset.i18n = `ib:err.${i18l_err_key}`;
	}
	else
		alert_msg.parentNode.removeChild(alert_msg);
}



/******** exports of methods and objects used publicly on pages  ********/
export { InkBallGame, HomeOnLoad, ListOnLoad };
