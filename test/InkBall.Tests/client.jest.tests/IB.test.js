/* eslint-disable no-console */
/*global describe,test,expect*/

//import { jest } from '@jest/globals';
import { InkBallGame } from "../../../src/InkBall.Module/IBwwwroot/js/inkball";

describe('InkBallGame tests', () => {

    beforeAll(() => {
        window.signalR = {
            HubConnectionBuilder: function () {
                this.withUrl = function (param0, param1) {
                    return this;
                };
                this.withHubProtocol = function (param0, param1) {
                    return this;
                };
                this.configureLogging = function (param) {
                    return this;
                };
                this.build = function (param) {
                    return this;
                };
                this.onclose = function (param) {
                    return this;
                };
                this.on = function (param0) {
                };
                this.start = function (param0) {
                };
                this.invoke = function (action) {
                    switch (action) {
                        case "GetUserSettings":
                            return '{"DesktopNotifications":false}';

                        case "GetPlayerPointsAndPaths":
                            return {
                                Paths: "[]",
                                Points: "[[21,11,0,5],[22,10,1,0],[23,11,0,5],[22,12,1,0],[21,12,0,5],[21,13,1,0],[22,11,0,5],[23,10,1,0],[22,13,0,5],[23,13,1,0],[23,12,0,5],[24,11,1,0],[24,12,0,5],[25,13,1,0],[22,14,0,5],[23,14,1,0],[21,14,0,5],[20,13,1,0],[20,12,0,5],[20,11,1,0],[12,12,0,5],[11,11,1,0],[12,11,0,5],[11,12,1,0],[25,11,0,5],[26,11,1,0],[25,10,0,5],[24,9,1,0],[25,9,0,5],[26,8,1,0],[24,8,0,5],[23,9,1,0],[22,9,0,5],[23,8,1,0],[21,10,0,5],[20,10,1,0],[22,8,0,5],[23,7,1,0],[21,9,0,5],[21,8,1,0],[20,9,0,5],[19,9,1,0],[19,11,0,5],[19,12,1,0],[19,10,0,5],[18,9,1,0],[18,10,0,5],[17,9,1,0],[16,10,0,5],[15,10,1,0],[17,10,0,5],[18,11,1,0],[16,9,0,5],[15,9,1,0],[17,8,0,5],[17,7,1,0],[18,8,0,5],[18,7,1,0],[19,8,0,5],[20,7,1,0],[20,8,0,5],[21,7,1,0],[22,7,0,5],[22,6,1,0],[25,8,0,5],[26,7,1,0],[24,7,0,5],[23,6,1,0],[25,7,0,5],[24,6,1,0],[24,10,0,5],[20,3,1,0],[18,12,0,5],[17,12,1,0],[19,13,0,5],[20,14,1,0],[17,11,0,5],[16,11,1,0],[24,13,0,5],[24,14,1,0],[25,12,0,5],[26,13,1,0],[25,6,0,5],[24,5,1,0],[23,5,0,5],[24,4,1,0],[25,5,0,5],[26,4,1,0],[20,6,0,5],[20,5,1,0],[21,6,0,5],[21,5,1,0],[19,7,0,5],[19,6,1,0],[16,8,0,5],[15,7,1,0],[22,5,0,5],[21,4,1,0],[11,10,0,5],[10,9,1,0],[10,11,0,5],[9,11,1,0]]"
                            };

                        default:
                            break;
                    }
                };
            },
            protocols: {
                msgpack: {
                    MessagePackHubProtocol: function (param0) {
                        return this;
                    }
                }
            },
            JsonHubProtocol: function (param0) {
            },
            LogLevel: {
                Warning: "Warning"
            },
            HttpTransportType: {
                None: "None"
            }
        };
        Object.defineProperty(global.SVGSVGElement.prototype, 'createSVGPoint', {
            writable: true,
            value: jest.fn().mockImplementation(() => ({
                x: 0,
                y: 0,
                matrixTransform: jest.fn().mockImplementation(() => ({
                    x: 0,
                    y: 0,
                })),
            })),
        });
        Object.defineProperty(global.SVGElement.prototype, 'SetFillColor', {
            writable: true,
            value: jest.fn().mockImplementation(() => ({})),
        });
        Object.defineProperty(global.SVGElement.prototype, 'SetZIndex', {
            writable: true,
            value: jest.fn().mockImplementation(() => ({
            })),
        });
        Object.defineProperty(global.SVGElement.prototype, 'Hide', {
            writable: true,
            value: jest.fn().mockImplementation(() => ({
            })),
        });
        Object.defineProperty(global.SVGElement.prototype, 'move', {
            writable: true,
            value: jest.fn().mockImplementation((x, y) => ({
            })),
        });
        Object.defineProperty(global.SVGElement.prototype, 'SetStatus', {
            writable: true,
            value: jest.fn().mockImplementation((s) => ({
            })),
        });
        window.SVGCircleElement = function () {
            this.setAttribute = (key, x) => { };
            this.SetFillColor = function () { return {}; };
        };
        window.SVGLineElement = function () {
            this.setAttribute = function (key, x) {
            };
            this.move = function (x1, y1, x2, y2) {
            };
        };
        window.SVGPolylineElement = function () {
            this.AppendPoints = function () {
            };
        };
    });

    test('inkball constructable', async () => {
        expect(InkBallGame).toBeTruthy();

        // const game = new InkBallGame();
        // console.log(game);

        // expect(game).toBeTruthy();

        document.body.innerHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <meta name="Description" content="Dotnet core examples, tests and experiments pages" />
    <link rel="manifest" href="/dotnet/manifest.json" />
    <link rel="icon" type="image/x-icon" href="/dotnet/images/favicon.png" />
    <link rel="apple-touch-icon" href="/dotnet/images/favicon.png" />
    <title>Game - Dotnet Core Playground</title>
    
        <meta name="theme-color" content="darkslateblue" />
        <link rel="stylesheet" href="/dotnet/lib/bootstrap/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/dotnet/css/site.css" />
    
    
    <link rel='stylesheet' href='/dotnet/css/inkball.css' media="print" onload="media='all'" />
</head>
<body>
    <header class="container">
        <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-my-theme">
            <div class="container">
                <span id="offlineIndicator"></span>
                <a href="/dotnet/" class="navbar-brand" role="button" title="sqlite">APAULI-PL</a>
                <button class="navbar-toggler" type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarCollapse"
                        aria-controls="navbarCollapse"
                        aria-expanded="false"
                        aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarCollapse">
                    <ul class="navbar-nav me-auto">
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Main</a>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" href="/dotnet/">Home</a>
                                <a class="dropdown-item" href="/dotnet/Home/UnintentionalErr/">Unintentional Error</a>
                                
                                <a class="dropdown-item" href="/dotnet/ViewCodeGenerator">View Code Generator</a>
                                
                                <a class="dropdown-item" href="/dotnet/Home/About">About</a>
                                <a class="dropdown-item" href="/dotnet/Home/Contact">Contact</a>
                            </div>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Blogs</a>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" href="/dotnet/Blogs">List</a>
                                <a class="dropdown-item" href="/dotnet/Blogs/Create">Create</a>
                            </div>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">My Rainbow</a>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" href="/dotnet/Hashes/">Hashes</a>
                                <a class="dropdown-item" href="/dotnet/BruteForce/">Brute Force</a>
                                <a class="dropdown-item" href="/dotnet/VirtualScroll/">Virtual Scroll</a>
                            </div>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="/dotnet/WebCamGallery" role="button" aria-haspopup="true" aria-expanded="false">WebCam</a>
                            <div class="dropdown-menu">
                                
                                    <a class="dropdown-item" href="/dotnet/WebCamGallery">Live</a>
                                    <a class="dropdown-item" href="/dotnet/WebCamGallery#video-tab">Daily video</a>
                                    <a class="dropdown-item" href="/dotnet/WebCamGallery#youtube-tab">Youtube videos</a>
                                    <a class="dropdown-item" href="/dotnet/WebCamGallery#gallery-tab">Gallery</a>
                                
                            </div>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">InkBall</a>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" href="/dotnet/InkBall/Home">Home</a>
                                <a class="dropdown-item" href="/dotnet/InkBall/GamesList" id="aInkList">Game list</a>
                                <a class="dropdown-item" href="/dotnet/InkBall/Game" id="aInkGame">Game</a>
                                <a class="dropdown-item" href="/dotnet/InkBall/Highscores" id="aInkGameHigh">Highscores</a>
                                <a class="dropdown-item" href="/dotnet/Identity/Account/Register" id="aInkRegister">Register</a>
                                <a class="dropdown-item" href="/dotnet/InkBall/Rules">Rules</a>
                            </div>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" title="Work in progress" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">WIP...</a>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" href="/dotnet/PuzzleGenerator">Puzzle Generator</a>
                                <a class="dropdown-item" href="/dotnet/BeepExperiment">Beep Experiment</a>
                            </div>
                        </li>
                    </ul>
                    

<ul class="navbar-nav ms-auto">
    <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Hello Dupa Krzak!</a>
            <div class="dropdown-menu">
                <a class="dropdown-item" href="/dotnet/Identity/Account/Manage/Index" title="Manage">Manage profile</a>
                <form action="/dotnet/Identity/Account/Logout" method="post" id="logoutForm">
                    <button type="submit" class="btn btn-link dropdown-item text-warning">Logout</button>
                <input name="__RequestVerificationToken" type="hidden" value="CfDJ8PYsXTTS0ZJIoK0UvH_mvb0SlECI4U47WYbVkS37LCteD-4UUwyI8hsGpyZj2YDRBCS6sCAP8ETv_flPT3P3bjkJUpCVEc09I8XMhpKTeAhGX3Jtn_FhFG7P0176fptIDdoFrM05Tw2vTj49ytfZVHLerlIMqJqTuUyiS9qyv7dcR-rwoXJleOhAUjByN0Mp0Q" /></form>
            </div>
    </li>
</ul>

                </div>
            </div>
        </nav>
    </header>
    <main class="container body-content">
        <h3 class="inkgame">
    This is Inball Game page
</h3>
<p class="inkgame">
    <!-- Debug State -->
    iGameID=<span id="gameID"></span>
    iPlayerID=<span id="playerID"></span>
    Player=P1
    <span class="whichColor">Play color</span>
</p>
<p class="inkgame">
    Dupa Krzak vs <span id='Player2Name'>Multi CPU Oponent UserPlayer</span>
</p>
<div class="container inkgame">
    <form action="GamesList" method="post" class="row">
        <input type='hidden' name='GameID' />
        <div class="col-xs-6 col-sm-auto ps-0">
            <a id='Pause' href='GamesList' class="btn btn-outline-primary">pause</a>
            <input id='SurrenderButton' type='submit' name='action' value="win" class='btn btn-outline-primary' disabled />
        </div>
        <div class="col-xs-6 col-sm-auto ps-0">
            <input id="StopAndDraw" type="button" value="Stop and Draw" class='btn btn-warning' disabled />
            <input id="CancelPath" type="button" value="Cancel path" class='btn btn-primary' disabled />
        </div>
        <div id="testArea" class="col-xs-6 col-sm-auto ps-0 dropdown dropend">
            <button class="btn btn-secondary dropdown-toggle" type="button" id="ddlTest" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Test
            </button>
            <div class="dropdown-menu" aria-labelledby="ddlTest">
                <a class="dropdown-item" href="#" id="TestBuildGraph">Build current graph</a>
                <a class="dropdown-item" href="#" id="TestConcaveman">Concaveman</a>
                <a class="dropdown-item" href="#" id="TestMarkAllCycles">Mark all cycles</a>
                <a class="dropdown-item" href="#" id="TestGroupPoints">Group points recurse</a>
                <a class="dropdown-item" href="#" id="TestFindSurroundablePoints">Find surroundable points</a>
                <a class="dropdown-item" href="#" id="TestDFS2">DFS 2</a>
            </div>
        </div>
    <input name="__RequestVerificationToken" type="hidden" value="CfDJ8PYsXTTS0ZJIoK0UvH_mvb0SlECI4U47WYbVkS37LCteD-4UUwyI8hsGpyZj2YDRBCS6sCAP8ETv_flPT3P3bjkJUpCVEc09I8XMhpKTeAhGX3Jtn_FhFG7P0176fptIDdoFrM05Tw2vTj49ytfZVHLerlIMqJqTuUyiS9qyv7dcR-rwoXJleOhAUjByN0Mp0Q" /></form>
    <div id="status" class="row">
        <div class="col-auto px-0">
            <span id="gameStatus">•</span>&nbsp;
            <span id="debug0"></span>&nbsp;
            <span id="debug1"></span>&nbsp;
            <span id="debug2"></span>
        </div>
    </div>
    <div class="row mx-auto">
        <svg id="screen" class="col-auto p-0 mb-3 mx-auto boardsize-40x52">
        </svg>
        <div class="col msgchat" data-otherplayerid="-1">
            <div class="input-group">
                <input id="messageInput" type="text" class="form-control" placeholder="Message..." aria-label="Message to send" aria-describedby="sendButton"
                       onkeyup="document.querySelector('#sendButton').disabled = this.value == ''" disabled />
                <div class="input-group-append">
                    <input id="sendButton" type="button" value="Send Message" class="btn btn-secondary" disabled />
                </div>
            </div>
            <ul id="messagesList" class="list-group list-group-flush"></ul>
        </div>
    </div>
</div>
    <script defer src='/dotnet/lib/signalr/browser/signalr.min.js'></script>
        <script type='module' src='/dotnet/lib/msgpack5/msgpack5.min.js'></script>
        <script type='module' src='/dotnet/lib/signalr-protocol-msgpack/browser/signalr-protocol-msgpack.min.js'></script>

<!--
<script type='module'>
    import { InkBallGame } from "/dotnet/js/inkball.js";

    window.addEventListener('load', async () => {
        const gameOptions = {
            inkBallHubName: '/dotnet/gameHub',
            iGameID: 221,
            iPlayerID: 4,
            bPlayingWithRed: JSON.parse('True'.toLowerCase()),
            bPlayerActive: JSON.parse('True'.toLowerCase()),
            gameType: 'FIRST_5_ADVANTAGE_PATHS',
            isMessagePackProtocol: JSON.parse('True'.toLowerCase()),
            servTimeoutMillis: 60000,
            isReadonly: JSON.parse('False'.toLowerCase()),
            pathAfterPointDrawAllowanceSecAmount: 120,
            sLastMoveGameTimeStamp: '2022-08-05T23:18:54.0000000',
            version: '1.0.1.19',

                PointsAsJavaScriptArray: null,
                PathsAsJavaScriptArray: null
        };

        await InkBallGame.OnLoad(gameOptions);
    });

    window.addEventListener('beforeunload', InkBallGame.OnBeforeUnload);
</script>
-->
        <hr />
    </main>
    <footer class="container">
        <noscript>Your browser does not support JavaScript! REALLY?!</noscript>
        <p id="spVersion">&copy; 2022 - Dotnet Core Playground</p>
    </footer>
    <!--
        <script src="/dotnet/lib/jquery/jquery.min.js"></script>
        <script src="/dotnet/lib/bootstrap/js/bootstrap.bundle.min.js"></script>
        <script src="/dotnet/js/site.js"></script>
        <script src="/_framework/aspnetcore-browser-refresh.js"></script>
    -->
</body>
</html>
`;

        const gameOptions = {
            inkBallHubName: '/dotnet/gameHub',
            iGameID: 221,
            iPlayerID: 4,
            bPlayingWithRed: JSON.parse('True'.toLowerCase()),
            bPlayerActive: JSON.parse('True'.toLowerCase()),
            gameType: 'FIRST_5_ADVANTAGE_PATHS',
            isMessagePackProtocol: JSON.parse('True'.toLowerCase()),
            servTimeoutMillis: 60000,
            isReadonly: JSON.parse('False'.toLowerCase()),
            pathAfterPointDrawAllowanceSecAmount: 120,
            sLastMoveGameTimeStamp: '2022-08-05T23:18:54.0000000',
            version: '1.0.1.19',

            PointsAsJavaScriptArray: null,
            PathsAsJavaScriptArray: null
        };

        await InkBallGame.OnLoad(gameOptions);

        expect(window.game).toBeTruthy();
    });
});