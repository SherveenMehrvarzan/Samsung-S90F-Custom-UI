# Verification status

> **Home/startup integration suspended — 24 October 2026.** Repeated relay clicks and changed standby behavior were reported after customization. The cause is unconfirmed. All captured original Home/startup preferences were restored and independently verified, and the owner confirmed Samsung Home returns. Quiet Home was stopped and the SDK/debug connection closed. Standby observation is pending. Do not reapply native Home/startup assignments while investigating this report.

The remaining notes record earlier development milestones and do not establish standby stability.

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
