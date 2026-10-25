# Appearance, artwork and feedback — version 0.7

Twelve dark palettes include the six original names plus Obsidian, Graphite, Ink, Burgundy, Teal and Copper. Four background modes are available. The background-only brightness range is 5–100%; text and app identities remain legible. The existing local-storage key and saved preferences are retained. New installations default to Obsidian/Aurora at 70%; this owner's selected Slate style was retained and background brightness set to 55% as requested.

Original synthesized tones accompany real directional focus changes, selection and Back. Sound is enabled at a low 25% by default, with On/Off, 0–100% volume and a preview button. No Apple sound recording is used. Sounds begin from user interaction, are rate limited, and are not played during initial focus or refresh. Each oscillator stops within 80 ms; its nodes disconnect, and the audio context closes after 800 ms idle, on page hiding and on page exit. The clock interval is cleared while hidden.

The TV confirmed five loaded logo assets, all 12 presets, four modes, 5% minimum brightness, available audio, a sound triggered by a focus change and a closed audio context after idle. Physical audibility remains an owner check. The original native Home/startup baseline was independently verified after installation. Custom Home/startup integration remains disabled.

## Resolution

Live TV inspection reports viewport and display 1920×1080 with devicePixelRatio 1. Samsung lists application UI at 1920×1080 and distinguishes it from UHD video. This release does not provide native 4K output on the installed TV. See [Samsung specifications](https://developer.samsung.com/smarttv/develop/specifications/general-specifications.html) and [screen resolution](https://developer.samsung.com/smarttv/develop/guides/fundamentals/managing-screen-resolution.html).

## Artwork sources

Service marks identify installed applications; rights remain with their respective owners. Hulu and Twitch use the brands' distributed vector artwork. Netflix uses Simple Icons' Netflix vector. HBO Max uses the HBO and Max vector shapes from Simple Icons in a stacked lockup. Prime Video uses its publisher-supplied App Store artwork. These replace the former text approximations. No affiliation is implied.

- [Hulu official brand kit](https://www.thisishulu.com/)
- [Twitch official brand kit](https://brand.twitch.com/)
- [Simple Icons source artwork](https://github.com/simple-icons/simple-icons)
- [Prime Video publisher listing](https://apps.apple.com/us/app/amazon-prime-video/id545519333)

All artwork is bundled locally; opening the launcher does not contact a logo service.
