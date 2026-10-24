# Experimental Home-button investigation

**Read-only source. Not a working Home replacement or tested recovery procedure.**

The launcher is installed as a separate Tizen web application. Reassigning the physical Home button requires undocumented native behavior. No system preference changes have been applied to the owner's TV.

`QuietHomeProbe.cs` contains no preference setters. It checks for a 32-bit SDK UID 901 process, attempts to read the current main-operation default, four vconf strings, the autostart integer and the launcher's boot-eligibility result. It also reports firmware text and .NET runtime version for compatibility assessment.

The helper serves one nonce-protected HTTP response on the TV's loopback port 4796, with a 30-second timeout. It requires exactly one 32-character nonce argument. It does not start a persistent service. A local SDB tunnel is required to reach the response; the port is not bound to the TV's LAN interface.

## Observed results so far

- Source compiled against .NET 6 reference assemblies.
- A short SDK command-execution timing probe showed a delay, suggesting the package-name command mechanism may be available.
- A callback-based platform probe did not return output. The PC rejected a temporary scoped firewall-rule attempt; no firewall rule was created.
- A staged native query over an SDB tunnel did not return a validated result. Runtime execution, transport and native API compatibility are still unresolved.
- **No complete baseline exists. Do not treat a timeout, successful upload, compile, or SDB exit code as a baseline.**

## Requirements before an apply tool can be implemented

1. Confirm exact firmware, runtime, architecture and execution identity through a successful query.
2. Save a complete per-device baseline outside Git, including native Home operation and exact types/values for every affected preference.
3. Build firmware-guarded query, verify, apply and restore operations with immediate readback.
4. Test a same-value restore and a return to Samsung Home from the launcher.
5. Apply only the Home assignment first, preserving startup behavior.
6. Test the physical Home button from another app, restore the original assignment, verify it physically, and reapply if appropriate.

Startup is a separate change and must be tested separately. Do not repurpose another TV's baseline or remove firmware guards merely to make code run.

References reviewed:

- [Native Home backup/control specification](https://github.com/rad10wave/tizen-custom-launcher-guide/blob/main/docs/NATIVE-HOME.md)
- [Arn0 native query and setup](https://github.com/NelsonEU/arn0-tv/tree/main/native)
- [SDK execution transport reference](https://github.com/levkropp/samsung-tv-root-untethered/blob/master/src/samsung_tv_root/sdb.py)

These projects document different devices; their successful results do not establish compatibility with an S90F.
