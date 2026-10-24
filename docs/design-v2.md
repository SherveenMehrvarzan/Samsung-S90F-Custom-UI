# Version 0.2 — historical design and integration

Status below records the version 0.2 milestone. See verification.md and design-v4.md for the current Home/startup and UI result.

## Research translated into the interface

Apple's Apple TV navigation guidance uses a Home Screen app grid, a clearly emphasized focused item and directional remote navigation. Its newer design uses translucent controls, depth, rounded shapes and layered lighting. Quiet Home adopts those broad interaction and visual ideas in original HTML, CSS and SVG artwork. It does not copy Apple's screen assets or claim to run tvOS.

- [Apple TV navigation](https://support.apple.com/en-euro/guide/tv/atvbe55a4b4e/tvos)
- [Apple's software design announcement](https://www.apple.com/newsroom/2025/06/apple-introduces-a-delightful-and-elegant-new-software-design/)

The home screen has six large tiles, including the five requested services and Samsung Apps. The top navigation separates Home, Apps, Inputs and Search. Settings stays one button away; Samsung Home remains visible in the footer.

## App library and downloads

Samsung's `getAppsInfo()` reported internal system components with `show=true`, so that flag alone is insufficient on this firmware. The consumer-app index includes standard ten-character-package web apps and an explicit set of observed native consumer apps. It excludes known dummy packages, promotional packages and duplicate names. Unrecognized native consumer apps may need to be added to the native-app list.

Search is case-insensitive and applies to this installed-app index. The store call-to-action opens `com.samsung.tv.store`, which the owner physically confirmed opens Samsung Apps. It does not pretend to search an unavailable remote catalog, silently install apps, or bypass Samsung's account and compatibility requirements.

- [Samsung installation instructions](https://www.samsung.com/ca/support/tv-audio-video/install-an-app-on-your-samsung-tv/)
- [Samsung Application API](https://developer.samsung.com/smarttv/develop/api-references/tizen-web-device-api-references/application-api.html)

## Inputs

The app reads `VIDEOSOURCE.connected` and `VIDEOSOURCE.disconnected`, and gets the current source through `tizen.tvwindow.getSource()`. It requests the public `tv.window` privilege. Cards distinguish current, connected and disconnected sources without inventing a connected device or a device name.

On this S90F the APIs returned HDMI 1–4 and TV source 1. All four HDMI sources were disconnected at the time of verification. The native input API accepted setting the already-current TV source. Playback from another physical HDMI port still needs to be checked with a connected device.

`setSource()` requires an actual native `SystemInfoVideoSourceInfo` object, not a new JavaScript object containing the same fields. The app therefore retains the source handles returned by the platform. A successful input switch exits the launcher to hand display back to the TV. Failure leaves the launcher available with a Samsung sources fallback.

- [TVWindow API](https://developer.samsung.com/smarttv/develop/api-references/tizen-web-device-api-references/tvwindow-api.html)
- [SystemInfo video-source API](https://developer.samsung.com/smarttv/develop/api-references/tizen-web-device-api-references/systeminfo-api.html)

## Validation

Browser checks cover directional focus, search and empty results, correct public-app launches, internal-app filtering, duplicate-app filtering, input enumeration, native source-object identity, failed input switches, missing apps and source-list failure. The package was signed, installed and inspected on the TV. Native inspection confirmed version 0.2, 31 indexed consumer apps and all five source cards. A screenshot of the actual running TV application was captured for visual QA.

Physical remote text entry, the updated Settings tile, individual streaming-app launches and a different-port input switch remain user checks. The physical Home key still opens Samsung's interface; native Home reassignment is a separate unfinished investigation.
