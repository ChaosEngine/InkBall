# InkBall Game Module

[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE.md)

A real-time multiplayer drawing game built as a modular component for the .NET Playground. Players compete to surround points with paths for intercepting.

## Overview

InkBall is a SignalR-powered WebSocket game that integrates seamlessly into ASP.NET Core applications. It showcases:

- **Real-Time Multiplayer** — SignalR hubs for low-latency game state synchronization
- **Client-Side Rendering** — HTML5 Canvas with WebGL acceleration (where available)
- **AI game** — Playing with AI instead other human
- **Web Workers** — Offloaded AI and heavy computations to background threads
- **Responsive Design** — Mobile and desktop support with touch/keyboard controls
- **Multi-Language Support** — i18next-based localization (Polish, English, etc.)

## Integration with .NET Playground

InkBall is included as a Git submodule and integrated into the main application via:

```csharp
// In Startup.cs
services.AddInkBallCommonUI<GamesContext, ApplicationUser>(options => {
    options.AppRootPath = Configuration["AppRootPath"];  // "/dotnet/"
    options.UseMessagePackBinaryTransport = true;        // Binary protocol for perf
});

endpoints.PrepareSignalRForInkBall("/");  // SignalR hubs at /dotnet/hubs
```

## Database

Game state (scores, game history, player stats) is persisted in `GamesContext`, which mirrors the primary database provider selected in the main app's `DBKind` configuration.

Migrations are auto-applied at DEBUG startup alongside the blogging context.

## Build & Assets

### JavaScript Bundling
The module includes:
- `inkball.js` — Main game engine
- `AIWorker.js` — AI logic in Web Worker (with optional polyfill for older browsers)
- `shared.js` — Shared utilities

Assets are bundled via the root `gulpfile.mjs`:

```bash
cd .. && bun gulpfile.mjs  # Rebuilds inkball.min.js and inkball.min.css
```

### CSS/SCSS
Styles are compiled from `src/InkBall.Module/wwwroot/css/inkball.scss` with cleanup and minification.

### Translations
JSON translation files in `src/InkBall.Module/wwwroot/locales/` are minified during build.

## API Endpoints

- `GET /dotnet/InkBall/Home` — Home page (public)
- `GET /dotnet/InkBall/Game` — Game board (requires authentication)
- `GET /dotnet/InkBall/GamesList` — Active games list (requires authentication)
- `GET /dotnet/InkBall/Highscores` — Global leaderboard (requires authentication)
- `WSS /dotnet/hubs/game` — SignalR game hub

## Development

### File Structure
```
src/InkBall.Module/
├── wwwroot/
│   ├── js/
│   │   ├── inkball.js
│   │   ├── AIWorker.js
│   │   └── shared.js
│   ├── css/
│   │   └── inkball.scss
│   └── locales/
│       ├── en/translation.json
│       └── pl/translation.json
├── Controllers/
├── Views/
├── Models/
├── InkBall.Module.csproj
└── ...
```

### Running Tests
InkBall includes integration tests that verify game logic and SignalR interactions. Run from the root:

```bash
dotnet test
```

### E2E Testing
Playwright tests for InkBall (game creation, scoring, etc.) are in `/e2e`. Pre-configured users and storage states enable authenticated game play.

```bash
cd e2e && npx playwright test TwoUsers.spec.js
```

## Performance Notes

- **MessagePack Protocol** — Binary serialization reduces bandwidth vs. JSON (enabled by default)
- **Web Workers** — CPU-intensive AI runs off the main thread
- **Incremental Rendering** — Canvas updates are batched and throttled to 60fps
- **Lazy Loading** — Game assets load on-demand

## License

MIT — See [LICENSE.md](LICENSE.md)
