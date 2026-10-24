# Samsung S90F Custom UI — Quiet Home

A simple Apple TV-inspired launcher for Samsung's Tizen TV platform. It has five large app tiles and shortcuts back to Samsung's own interface.

## Current result

- Installed on a 65-inch Samsung S90F running Tizen 9.
- The owner confirmed the launcher displays on the TV.
- Netflix, HBO Max, Prime Video, Hulu and Twitch appear in that order.
- Samsung Home was confirmed working.
- The correct Samsung Settings destination was identified by an on-TV test and installed in the launcher update.
- **The physical Home button still opens Samsung Home. Remapping remains unfinished.** No system Home or startup preference has been changed.
- Individual streaming-app launches still need physical verification.

This is an original layout inspired by Apple TV; it does not copy Apple's UI assets or change the interfaces inside streaming apps.

## Branches

- `main`: the installed launcher source and reproducible packaging instructions.
- `feature/home-button`: experimental read-only investigation of native Home assignment and recovery requirements. Not a tested Home replacement.

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

Samsung APIs used: [Application API](https://developer.samsung.com/smarttv/develop/api-references/tizen-web-device-api-references/application-api.html) and [TV device connection](https://developer.samsung.com/smarttv/develop/getting-started/using-sdk/tv-device.html).

## Private operational data

Keep signing keys, OAuth tokens, passwords, signed packages, full device dumps and per-TV recovery snapshots outside version control. The source contains service app IDs, not account credentials. The installed-app IDs and internal Samsung destinations can vary by model or firmware.

