# APP for displaying songs

## BE
- Sources live under `data/<song>` and contain `manifest.json`, audio (mp3), lyrics (md/html), charts (pdf) etc.
- `manifest.json` now stores a single `status` string (`archive`, `new`, `progress`, or `ready`). Legacy flags/values (`old`, `done`, etc.) are still parsed on the backend for compatibility.
- PHP endpoint `demo/api.php` scans this tree, enriches each song with status flags/value, file metadata, demo duration, and emits JSON for the FE. Results are sorted so non-archive songs appear first.

## FE
- Built with vanilla JS + Web Components (`song-book`, `song-card`, `lyrics-viewer`).
- Styling handled by Tailwind (CDN) plus Font Awesome icons.
- `song-book` fetches the API JSON, renders `song-card` entries, and supports `?select=1,2` URL param to auto-expand items.
- `song-card` mirrors the legacy appearance, now with inline audio playback, explicit collapse control, and badge colors for `new`, `progress`, `ready`, `archive` states (archive cards are visually toned down).
- `song-book` inserts a spacer before the archived section so historic material is visually separated.
- `playlist-viewer` overlay (opened via the “Generovat playlist” button) lists READY songs ordered by the optional `weight` manifest attribute, shows per-song durations, count, and total runtime, and offers a single checkbox to also include NEW/PROGRESS items (with inline badges so you can spot them quickly).
- Lyrics links open an in-app modal (`lyrics-viewer`) that fetches markdown via `fetch`, renders with `marked`, and optionally plays the demo audio.
- Calendar banner at the top calls Google Calendar directly from the browser to show the next rehearsal/event (API key required in `.js`).

## Notes
- Legacy `text.html` page has been removed; all lyrics handling is in the SPA.
- When adding new songs, set the `status` string in `manifest.json` to one of `archive`, `new`, `progress`, or `ready` so badges render correctly.
- Optional numeric `weight` value in the manifest drives playlist ordering (values < 50 float to the start, > 50 to the end; omit to keep neutral).