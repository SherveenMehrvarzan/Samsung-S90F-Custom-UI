# Samsung S90F Custom UI — Quiet Home

**Native Home/startup integration remains disabled.** After a standby/relay report, the original captured settings were restored and independently verified. The owner subsequently reported that behavior appeared normal and requested UI-only work to resume. Cause remains unconfirmed. Version 0.8 does not reassign Home, enable custom startup, send power commands or change TV picture brightness.

Version 0.7 adds recognizable vector service logos, 12 darker background palettes, four background styles (Landscape, Gradient, Aurora and Solid), brightness down to 5%, and original navigation/selection sounds with mute and volume controls. Appearance and sound settings are stored locally. Audio resources close after 800 ms idle and immediately when the page is hidden. The UI clock also stops while hidden.

**Resolution:** the TV reports a 1920×1080 surface at device pixel ratio 1. Samsung documents 1080p application UI even on UHD TVs. Native 4K is not achieved by this release; vector artwork and responsive layout do not change the TV compositor resolution.

Version 0.8 adds a date and Santa Clara weather header, Spotify in place of Hulu on Home, eight additional vector app marks, matched tile backgrounds and focus animation that keeps foreground artwork unscaled. See [clarity and native 4K investigation](docs/clarity-weather-v8.md).

## Current result

- Installed on a 65-inch Samsung S90F running Tizen 9.
- The owner confirmed the launcher displays on the TV.
- Netflix, HBO Max, Prime Video, Spotify and Twitch appear in that order.
- Samsung Apps is the sixth favorite, opening Samsung's official store for search and installation.
- Apps lists consumer applications while filtering internal Samsung services and duplicate placeholders.
- Search filters installed apps; downloading additional apps takes place in Samsung Apps, with Samsung's own account and installation flow.
- Inputs reads connected and disconnected sources from the TV. HDMI 1–4 and Live TV were returned on the S90F.
- Samsung Home was confirmed working.
- The correct Samsung Settings destination was identified by an on-TV test and installed in the launcher update.
- The owner confirmed remote Search works.
- The Appearance tile opens Quiet Home settings: six background colors, Landscape/Gradient styles, hue and brightness sliders. Appearance saves in local storage.
- A purpose-made house icon replaces the generic app icon.
- Home previously opened Quiet Home; the original Samsung Home assignment has since been restored. Background customization works.
- Same-value restoration, assignment, restoration from the assigned state and reapplication passed native readback.
- Custom startup was subsequently reverted. Independent native verification after the version 0.8 update matched every captured original Home/startup value.
- Individual streaming-app launches and a different-port HDMI switch still need physical verification.

This is an original layout inspired by Apple TV; it does not copy Apple's UI assets or change the interfaces inside streaming apps.

## Branches

- `main`: the installed launcher source and reproducible packaging instructions.
- `feature/home-button`: firmware-guarded Home control and recovery tooling; owner-specific backups remain local.
- `feature/apple-tv-ui`: version 0.7 interface, appearance, app search, Samsung Apps access, icon and inputs.

## Preview and build

Open `app/index.html` in a desktop browser. Arrow keys move focus; Enter opens a preview message. The actual Tizen application API is used only on the TV.

Build an unsigned package with Python 3:

```sh
python tools/build_package.py
```

The result is `dist/QuietHome-unsigned.wgt`. It must be signed with your own Samsung TV certificate before installation. Signing credentials and device identifiers are deliberately absent from this repository.

See [deployment](docs/deployment.md) and [verification status](docs/verification.md).

## Verification

Browser checks cover remote navigation, preview behavior, mocked TV launches, Prime Video duplicate-app resolution, Back exit, and missing-app handling. These checks do not establish device compatibility or replace physical tests.

```sh
npm install
npx playwright install chromium
npm test
```

On Windows with Edge already installed, set `BROWSER_CHANNEL=msedge` to run the checks using Edge. Browser screenshots are saved under the ignored `work/` folder.

See [Home grid and motion](docs/design-v5.md), [Apple TV design study](docs/design-v4.md) and [integration notes](docs/design-v2.md) for the Apple references and Samsung API behavior.

Samsung APIs used: [Application API](https://developer.samsung.com/smarttv/develop/api-references/tizen-web-device-api-references/application-api.html) and [TV device connection](https://developer.samsung.com/smarttv/develop/getting-started/using-sdk/tv-device.html).

## Private operational data

Keep signing keys, OAuth tokens, passwords, signed packages, full device dumps and per-TV recovery snapshots outside version control. The source contains service app IDs, not account credentials. The installed-app IDs and internal Samsung destinations can vary by model or firmware.

