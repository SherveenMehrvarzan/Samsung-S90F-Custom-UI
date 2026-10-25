# Clarity and glanceable information — version 0.8

Spotify replaces Hulu in the fourth Home slot. Hulu remains in the installed-app library. The header stacks Pacific local time, date, and Santa Clara, California weather. Weather uses Open-Meteo at city-center coordinates 37.35411, -121.95524; no device location is requested. The app offers Fahrenheit/Celsius and weather On/Off controls. Weather requests use HTTPS with an eight-second timeout, refresh every 15 minutes while visible, and are aborted/cancelled on hiding or page exit. A recent cached result survives temporary network outages; unavailable or overly old data is not presented as current.

Focus enlargement is moved to the tile backing and border. Logos and text remain unscaled, moving by an integer four pixels, to reduce compositor resampling. Page animation transforms are removed on completion. Additional local vector marks cover Apple TV, YouTube, YouTube TV, YouTube Kids, Spotify, SmartThings, Tubi and Perplexity. For other native app icons, a small on-device canvas sample selects a matching backing color to reduce square-icon letterboxing. Icons preserve their shape rather than being stretched. Some vendor icons are only 115–180 px and do not contain native 4K detail.

The source artwork remains bundled locally. The additional vector marks come from [Simple Icons](https://github.com/simple-icons/simple-icons), with its license included. Weather attribution and controls appear in the app's Weather & location page.

## Native 4K investigation

The web app reports 1920×1080 with device pixel ratio 1. A separate read-only Ecore/Wayland client also returned 1920×1080. A raw Wayland registry/output query advertised one current/preferred 1920×1080 mode; no 3840×2160 mode was advertised. The reported scale value was 0, so it was not interpreted as valid evidence of a 2× HiDPI path. These tests created no window and changed no settings. Temporary helper files were removed.

Tizen's general platform release notes describe multi-resolution/4K native window support, but this is not proof that the S90F exposes such a surface to this application. No supported, verified native 4K output path was found. The release remains 1080p on this TV. The owner requires the app to run entirely on the TV, so HDMI/PC rendering was not pursued. Private Samsung applications may use different paths; this investigation does not prove that every app's menu is 1080p.

Sources: [Samsung application/video resolutions](https://developer.samsung.com/smarttv/develop/specifications/general-specifications.html), [Tizen multi-resolution window notes](https://samsungtizenos.com/release-notes/tizen-5-5-public-m1/), [Ecore display getter](https://www.enlightenment.org/_legacy_embed/group__Ecore__Wl2__Display__Group.html), [Open-Meteo forecast API](https://open-meteo.com/en/docs).
