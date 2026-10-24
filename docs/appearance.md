# Appearance and app icon

Use the gear button in the top-right corner to open Quiet Home settings. Samsung's own picture, sound and network settings remain available through Open Samsung Settings on that page.

The Background panel provides Midnight, Ocean, Amethyst, Forest, Slate and Sunset presets, Landscape and Gradient styles, a fine-tune hue slider and a background-only brightness slider. Left/Right on a focused slider adjusts its value. App tiles keep their service colors. Reset appearance restores the original defaults.

Preferences are saved under `quiet-home.appearance.v1` in the app's local storage. Malformed or out-of-range saved values are ignored. No account, network request or cloud storage is involved. Browser tests verified color selection, remote slider keys, persistence across reload and reset.

`app/icon.svg` is original vector artwork: a clean house silhouette on a rounded blue glass background with a violet door accent. `app/icon.png` is its 117×117 transparent PNG rendition, referenced by the Tizen widget manifest. Both files are packaged, so Samsung's app list can display the icon and the launcher can use the vector in its header.
