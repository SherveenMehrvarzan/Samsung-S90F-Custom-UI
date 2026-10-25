# Verification status

> **Home/startup customization suspended — 24 October 2026.** Relay clicks and changed standby behavior were reported; cause remains unconfirmed. All captured original Home/startup values were restored and independently verified. The owner confirmed Samsung Home returns. Quiet Home was stopped and the SDK/debug connection closed. Await standby observation before further TV changes. Earlier milestones below do not establish standby stability.

## Confirmed

- Tizen 9.0, 32-bit ARM reported through official SDB capability output.
- Signed package installed with `install completed`.
- Launcher identity listed as `QuietHome1.Launcher`.
- Owner saw the custom launcher on the TV.
- Owner confirmed the Samsung Home shortcut works.
- Owner confirmed Samsung Settings was visible after launching `org.tizen.menu`; that ID is now in the installed launcher.
- Browser navigation and mocked app-launch behavior passed.
- Version 0.2 was installed and inspected through the live TV debugger.
- Consumer-app indexing found 31 apps after internal components, dummy packages and duplicate names were filtered.
- Owner confirmed the Samsung Apps destination opens the store.
- Real source enumeration returned HDMI 1–4 and Live TV.
- The TV's source API accepted setting its already-current TV input with a native source handle.
- Owner confirmed remote Search works.
- Version 0.3 adds the original house icon and appearance preferences; it installed successfully.
- Browser checks passed color selection, remote slider adjustment, storage across reload and reset.
- A complete native Home baseline was read on firmware 1301.0, SDK UID 901, ARM32, .NET 6.0.9.
- The guarded controller verified the baseline, tested restoration, assigned Quiet Home, restored Samsung Home from that assignment, and reapplied Quiet Home. All native readbacks matched.
- Home-only assignment preserves original startup preferences, including automatic derived startup fields that this firmware changes when Home is assigned.
- Owner then confirmed the physical Home button and background controls both work.
- Owner subsequently requested automatic startup. The controller set startup_appid and booting_appid_backup to QuietHome1.Launcher and verified autostart 1. The owner confirmed normal remote off/on opens Quiet Home automatically.

## Pending

- Physical test of each of the five streaming services from the launcher.
- Physical confirmation of the updated app-list icon.
- Switching to a different physical HDMI input with a connected device.
- Physical retest of the updated Settings tile.
- Full unplugged cold-boot behavior.

## Engineering notes

The community installer had intermittent device-ID failures. Official Samsung SDB could read applications, install and launch successfully. Its normal TLS and persisted Windows key handling also failed in the initial environment. Certificate creation succeeded with verified HTTPS; signing succeeded with the same TizenSdb signing library using in-memory keys.

The original baseline and a device-guarded local recovery kit are preserved outside Git. Home, home_appid, startup_appid and booting_appid_backup now target QuietHome1.Launcher. Native restoration and physical Home-key behavior are verified; normal remote off/on startup is also owner-confirmed. Early failed probes are documented as investigation history, not as the successful recovery path.

## Version 0.4

Installed with install completed. Live TV inspection confirmed version 0.4.0, Inter loaded, 23.04px app labels at 1920×1080, 31 consumer apps, HDMI 1–4 plus Live TV, and a Home screen fitting without scrolling. A native read-only query after this update confirmed the Home and startup assignments still point to QuietHome1.Launcher with autostart 1. Browser checks also passed font loading, grid boundaries, restored focus, reduced-motion behavior and layout at 1080p and 720p. The owner has not yet physically assessed this visual revision.

## Version 0.5

Installed with install completed and inspected on the live TV. Greeting, 12-tile Home grid, 31 consumer apps, HDMI 1–4 plus Live TV, font loading and saved Slate/Gradient appearance were verified. Focus lift/layer transforms and press/release behavior passed the on-TV timing check; see design-v5.md. Full browser regression checks cover grid navigation, search/store/settings integrations, appearance persistence, input handling and failure recovery. Physical owner assessment of this new grid and motion remains pending.

## Version 0.7 UI-only update

The owner reported standby appeared normal after rollback and requested UI work to resume. Version 0.7 was installed with install completed. The TV loaded all five replacement logo assets and reported 12 palettes, four modes, a 5% brightness minimum, working audio creation on focus movement and audio-context closure after idle. Native verify independently matched the original baseline: Samsung Home and startup remain restored. No native assignment was reapplied. Actual UI output remains 1920×1080 at pixel ratio 1.

## Version 0.8

Browser checks pass Spotify placement, date/weather display, unit and enable controls, stopped weather timers and unscaled foreground artwork. Native read-only display queries reported only a 1920×1080 route, not a verified native 4K surface. See clarity-weather-v8.md. Version 0.7 sounds and logos were physically confirmed by the owner. Home/startup integration remains disabled.

### v0.8 TV verification — 2026-10-24
Installed 0.8.0 successfully. TV inspector confirmed Spotify fourth on Home; Santa Clara live weather loaded (60°F, Clear), date beneath clock; viewport 1920×1080 at devicePixelRatio 1. Original Samsung Home/startup verified against saved baseline. Debug app stopped and SDK disconnected after inspection. All five browser suites passed.

