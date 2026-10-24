# Samsung S90F Custom UI — Quiet Home

A clean Apple TV-inspired launcher for Samsung's Tizen TV platform. Version 0.2 adds a six-column app grid, translucent navigation, an original landscape background, installed-app search, Samsung Apps download access, and TV input cards.

## Current result

- Installed on a 65-inch Samsung S90F running Tizen 9.
- The owner confirmed the launcher displays on the TV.
- Netflix, HBO Max, Prime Video, Hulu and Twitch appear in that order.
- Samsung Apps is the sixth favorite, opening Samsung's official store for search and installation.
- Apps lists consumer applications while filtering internal Samsung services and duplicate placeholders.
- Search filters installed apps; downloading additional apps takes place in Samsung Apps, with Samsung's own account and installation flow.
- Inputs reads connected and disconnected sources from the TV. HDMI 1–4 and Live TV were returned on the S90F.
- Samsung Home was confirmed working.
- The correct Samsung Settings destination was identified by an on-TV test and installed in the launcher update.
- **The physical Home button still opens Samsung Home. Remapping remains unfinished.** No system Home or startup preference has been changed.
- Browser tests and on-TV inspection passed. Remote text entry, individual streaming-app launches and a different-port HDMI switch still need physical verification.

This is an original layout inspired by Apple TV; it does not copy Apple's UI assets or change the interfaces inside streaming apps.

## Branches

- `main`: the installed launcher source and reproducible packaging instructions.
- `feature/home-button`: experimental read-only investigation of native Home assignment and recovery requirements. Not a tested Home replacement.
- `feature/apple-tv-ui`: version 0.2 interface, app search, Samsung Apps access, and inputs.

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

See [design research and integration notes](docs/design-v2.md) for the Apple references and Samsung API behavior.

Samsung APIs used: [Application API](https://developer.samsung.com/smarttv/develop/api-references/tizen-web-device-api-references/application-api.html) and [TV device connection](https://developer.samsung.com/smarttv/develop/getting-started/using-sdk/tv-device.html).

## Private operational data

Keep signing keys, OAuth tokens, passwords, signed packages, full device dumps and per-TV recovery snapshots outside version control. The source contains service app IDs, not account credentials. The installed-app IDs and internal Samsung destinations can vary by model or firmware.

