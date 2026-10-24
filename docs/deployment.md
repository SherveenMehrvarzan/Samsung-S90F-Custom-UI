# Install as a separate test app

1. Enable Developer Mode on the TV and enter the deploying computer's local IP.
2. Restart as Samsung prompts. Use Samsung's official SDB tool to verify the device capability output.
3. Build the unsigned WGT and sign it using a Samsung TV certificate that covers your TV. Keep the same author certificate for updates.
4. Push the signed WGT to the SDK staging directory using a new remote filename for each build. Some TVs reject overwriting an existing upload.
5. Run the native TV install command and require `install completed` in the output. An exit code alone is insufficient.
6. Launch `QuietHome1.Launcher`, check the physical display and test each shortcut.

Example commands, with placeholders to replace locally:

```text
sdb connect <TV_IP>:26101
sdb -s <TV_IP>:26101 capability
sdb -s <TV_IP>:26101 push <SIGNED_WGT> /home/owner/share/tmp/sdk_tools/QuietHome-build001.wgt
sdb -s <TV_IP>:26101 shell 0 vd_appinstall QuietHome1 /home/owner/share/tmp/sdk_tools/QuietHome-build001.wgt
sdb -s <TV_IP>:26101 shell 0 execute QuietHome1.Launcher
```

Installation does not assign Home or change startup behavior. Do not uninstall a launcher that has been assigned as Home until a tested restore procedure has restored Samsung's assignment.

## Internal destinations observed on the S90F

| Shortcut | Application ID |
| --- | --- |
| Netflix | `org.tizen.netflix-app` |
| HBO Max | `5b8c3eb16b.BeamCTVDev` |
| Prime Video | `org.tizen.primevideo` |
| Hulu | `LBUAQX1exg.Hulu` |
| Twitch | `Jz7aUrV2Q4.Twitch` |
| Samsung Settings | `org.tizen.menu` |
| Samsung Home | `com.samsung.tv.csfs` |

`com.samsung.tv.coba.setting` accepted launch calls but did not visibly open the settings menu. `org.tizen.menu` visibly opened Settings in the owner's test. Prime Video also has a dummy entry; the launcher prefers the actual installed app ID.

