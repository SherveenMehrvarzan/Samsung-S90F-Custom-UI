# Home and startup control — one verified firmware

> **Current device status — 24 October 2026:** At the owner's request, Quiet Home was reassigned to Home, tested separately in standby, and then enabled for automatic startup. Both operations passed independent readback. The owner confirmed automatic startup works and reported no recurring clicking during the latest observation. The earlier standby issue's cause remains unconfirmed; extended stability and unplugged cold boot are not established. Restore Samsung Home before uninstalling Quiet Home. The SDK connection is closed; the app runs on the TV without the computer.

This controller is specifically guarded for QN65S90FAFXZA firmware T-RSMFAKUC-0090-1301.0, ARM32, SDK UID 901. It is not a portable Samsung Home replacement API. The owner confirmed Home-button behavior and normal remote off/on startup. An unplugged cold boot has not been tested.

Build the .NET 6 executable with dotnet build QuietHomeControl.csproj. Run native/home-control.cjs using Node.js, Samsung's official SDB tool, the resulting DLL, and a locally captured original baseline and device identity configuration. No account credentials are required. Owner-specific configuration, baselines, binaries and signing keys are excluded from Git.

Modes: query reads current state; verify requires the original baseline; apply assigns Home while preserving original startup preferences; startup requires the custom Home assignment and enables its startup preferences; restore restores and reads back all original captured preferences. Writes check firmware, SDK context, device identity and baseline/controller hashes. Unknown preference drift is rejected. Apply/startup failures attempt rollback and report a separate urgent failure if rollback fails.

The SDK transport uses a bounded one-shot callback restricted to the expected TV address and random nonce. It stages uniquely named helper files and removes those exact files afterward. The native methods are internal firmware interfaces and may change after a TV update.

A device-specific local recovery kit is maintained separately. Restore Samsung Home before uninstalling an assigned launcher.

