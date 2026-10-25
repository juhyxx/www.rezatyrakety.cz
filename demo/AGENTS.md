# Song catalogue PWA for displaying and managing songs

## BE
- Sources live under `data/<song>` and contain `manifest.json`, audio (mp3), lyrics (md/html), charts (pdf), Guitar Pro tabs (gp/gpx/gp5/gp4/gp3) etc.
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
- Guitar Pro files (`api.php` type `tabs`) show on the song card as a yellow "Player" tile (not the file name) and open in `gp-viewer` (`components/gp-viewer.js` + `styles/gp-viewer.css`), a full-screen player built on alphaTab, which is lazy-loaded from jsDelivr on first open. It renders notation/tab, plays the song with a MIDI soundfont, and has per-track show/mute/solo/volume, speed 25–150 %, loop (drag across bars), metronome and count-in. The default view ("Noty + taby") adds tab to guitar and bass staves even when the file saved them as notation only. View settings and the instruments a person last looked at are remembered in `localStorage` (`gpViewer.*`).
- The header "Player" button opens `gp-viewer` without a song chosen: it starts on the last song played there (`gpViewer.lastSong`), else the first song with tabs. `app.js` hands the viewer the song list (`viewer.songs = …`), and a song picker replaces the title so you can switch songs inside the player (archived songs sit in an "Archiv" group).
- Calendar banner at the top calls Google Calendar directly from the browser to show the next rehearsal/event (API key required in `.js`).

## Notes
- Legacy `text.html` page has been removed; all lyrics handling is in the SPA.
- alphaTab is pinned to `1.9.0-alpha.1963` in `gp-viewer.js`: 1.8.x freezes the page on songs that combine D.S. al Coda with repeats and alternate endings (e.g. `data/mesic`). Move to 1.9.0 once it's released as stable.
- When adding new songs, set the `status` string in `manifest.json` to one of `archive`, `new`, `progress`, or `ready` so badges render correctly.
- Optional numeric `weight` value in the manifest drives playlist ordering (values < 50 float to the start, > 50 to the end; omit to keep neutral).
- Optional numeric `tempo` value (BPM) in the manifest is shown on the song card next to the duration. Extracted from the tempo marking (`♩ = NNN`) at the top of the chord chart PDF via `pdftotext -layout`, picking the guitar/bass/drums PDF in that priority order.
- `data/tempo-reference.json` is a flat lookup table of well-known songs (80-150 BPM, mostly Black Sabbath/Queen/Nirvana/Foo Fighters/The Clash) with `artist`/`title`/`bpm`. It's a plain file, not a song folder, so `api.php` skips it when scanning `data/`. For each song with a `tempo`, `api.php` finds up to 3 closest reference entries within 10 BPM and exposes them as `tempoReferences`; `song-card.js` renders them as "tempo similar as ARTIST – TITLE, ARTIST – TITLE, …" under the title.
