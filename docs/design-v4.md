# Apple TV study — 24 October 2026

Started 21:26:16 UTC. This study combines official screen examples, Apple Human Interface Guidelines and the transcript of WWDC19 session 211. Actual video playback is pending browser-origin access; do not describe transcript review as watching the video.

## Observed principles and proposed translation

- Home is an app launcher. Directional focus is the primary navigation model; selection is a separate OK press. A focused tile rises, grows and gains illumination. Leave enough space that enlargement does not crowd its neighbors.
- Current official Home navigation artwork shows wide rounded app tiles in a translucent shelf, with a deeper shadow and brighter surface on the focused tile. Use original CSS surfaces, not Apple's artwork.
- Apple's tvOS typography guidance recommends 29 pt default and 23 pt minimum custom text. These are Apple layout units, not automatically Samsung CSS pixels. Use a 1920-wide design and inspect actual TV rendering. Current 19 px labels are too small.
- SF Pro is the Apple system typeface. Apple's font guidance says not to bundle Apple system fonts. Bundle Inter with its OFL license, use consistent weights and optical sizing, and verify it loads on Tizen.
- Apple gives 90-point horizontal and 60-point vertical safe areas at a 1920×1080 layout in the WWDC19 Top Shelf session. Maintain generous outer margins.
- Focus should remain on an app when app information refreshes. Grid left/right should stay in its row. Returning to a view should restore the last focused item. Back from a secondary screen should return to Home.
- Liquid Glass is a control treatment, not a reason to blur every content surface. Keep app brand colors intact; use translucent material for navigation and inputs, stronger focus lighting and depth.
- The WWDC session emphasizes fewer steps, clear hierarchy, responsive pacing and avoiding noisy fonts, animation and forced sound. No fake recommendations or trailers will be invented for services that expose no content feed.

## Sources

- https://developer.apple.com/videos/play/wwdc2019/211/
- https://developer.apple.com/design/human-interface-guidelines/designing-for-tvos/
- https://developer.apple.com/design/human-interface-guidelines/focus-and-selection/
- https://developer.apple.com/design/human-interface-guidelines/accessibility/
- https://developer.apple.com/documentation/technologyoverviews/fonts
- https://support.apple.com/en-euro/guide/tv/atvbe55a4b4e/tvos
- https://www.apple.com/ca/newsroom/2025/06/apple-tv-brings-a-beautiful-redesign-and-enhanced-home-entertainment-experience/
- https://rsms.me/inter/
