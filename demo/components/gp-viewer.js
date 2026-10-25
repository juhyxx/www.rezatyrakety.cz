import { wakeLockManager } from './wake-lock.js';

// 1.9.0-alpha is the first build that plays songs combining D.S. al Coda with repeats and
// alternate endings (e.g. "Měsíc"); 1.8.x freezes the page on them. Switch to 1.9.0 once it is stable.
const ALPHATAB_VERSION = '1.9.0-alpha.1963';
const ALPHATAB_CDN = `https://cdn.jsdelivr.net/npm/@coderline/alphatab@${ALPHATAB_VERSION}/dist/`;
const ALPHATAB_SCRIPT = `${ALPHATAB_CDN}alphaTab.min.js`;
const STYLE_ID = 'gp-viewer-styles';
const PREFS_PREFIX = 'gpViewer.';
const PLAYING = 1; // alphaTab PlayerState.Playing

const CATEGORY_LABELS = { guitar: 'KYT', bass: 'BASA', drums: 'BICÍ', keys: 'KLÁV', vocals: 'ZPĚV', other: 'JINÉ' };
// 'auto' = staves as saved in the file, plus tab for every stringed instrument.
const VIEW_PROFILES = { auto: 'Default', file: 'Default', tab: 'Tab', score: 'Score' };

const TEMPLATE = `
<div class="gpv flex h-full w-full flex-col bg-slate-200 text-slate-900 dark:bg-black dark:text-slate-100">
    <header class="flex flex-wrap items-center gap-2 border-b border-slate-300 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-900">
        <div class="min-w-0 flex-1">
            <p data-subtitle class="truncate text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-amber-700/70 dark:text-amber-400/70">Tabulatura</p>
            <h1 data-title class="truncate text-lg font-semibold uppercase tracking-[0.15em] text-amber-800 dark:text-amber-400"></h1>
            <label data-song-picker class="gpv-song-picker text-amber-800 dark:text-amber-400" hidden>
                <select data-song class="truncate text-lg font-semibold uppercase tracking-[0.15em]" aria-label="Skladba"></select>
                <i class="fa fa-caret-down" aria-hidden="true"></i>
            </label>
        </div>
        <div class="gpv-view-options flex items-center gap-2">
            <select data-view class="gpv-select" aria-label="Zobrazení">
                <option value="auto">Noty + taby</option>
                <option value="tab">Jen taby</option>
                <option value="score">Jen noty</option>
                <option value="file">Jako v souboru</option>
            </select>
            <select data-layout class="gpv-select" aria-label="Rozvržení">
                <option value="Page">Stránka</option>
                <option value="Horizontal">Jeden řádek</option>
            </select>
            <select data-zoom class="gpv-select" aria-label="Zvětšení">
                <option value="0.6">60 %</option>
                <option value="0.75">75 %</option>
                <option value="0.9">90 %</option>
                <option value="1">100 %</option>
                <option value="1.2">120 %</option>
                <option value="1.5">150 %</option>
            </select>
        </div>
        <div class="flex items-center gap-2">
            <a data-download class="gpv-icon-btn" title="Stáhnout soubor"><i class="fa fa-download"></i></a>
            <button type="button" data-print class="gpv-icon-btn gpv-hide-narrow" title="Tisk"><i class="fa fa-print"></i></button>
            <button type="button" data-tracks-toggle class="gpv-icon-btn gpv-tracks-toggle" title="Stopy" aria-label="Stopy"><i class="fa fa-sliders"></i></button>
            <button type="button" data-close class="gpv-icon-btn" title="Zavřít" aria-label="Zavřít"><i class="fa fa-times"></i></button>
        </div>
    </header>

    <div class="gpv-body">
        <div data-viewport class="gpv-viewport"><div data-score class="gpv-paper"></div></div>
        <aside data-tracks class="gpv-tracks bg-white dark:bg-slate-900">
            <div class="flex items-center justify-between px-3 pt-3">
                <h2 class="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Stopy</h2>
                <button type="button" data-reset class="text-xs font-semibold text-amber-800 hover:underline dark:text-amber-400" title="Zrušit ztlumení a sóla">Obnovit</button>
            </div>
            <p class="border-b border-slate-200 px-3 pb-2 pt-1 text-[0.7rem] text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <i class="fa fa-eye"></i> zobrazí stopu v notách, <b>M</b> ztlumí, <b>S</b> hraje jen ji. Klik na název ukáže jen tu stopu.
            </p>
            <div data-track-list class="px-2 py-2"></div>
        </aside>
        <div data-status class="gpv-status">
            <div class="gpv-status-card bg-white dark:bg-slate-900">
                <div data-spinner class="gpv-spinner"></div>
                <p data-status-title class="font-semibold"></p>
                <p data-status-text class="mt-1 text-sm text-slate-500 dark:text-slate-400"></p>
            </div>
        </div>
        <div data-scrim class="gpv-scrim"></div>
    </div>

    <footer class="gpv-transport border-t border-slate-300 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div class="gpv-transport-main">
            <button type="button" data-play class="gpv-play" title="Přehrát / pauza (mezerník)" aria-label="Přehrát" disabled><i class="fa fa-play"></i></button>
            <button type="button" data-stop class="gpv-icon-btn" title="Na začátek" aria-label="Na začátek" disabled><i class="fa fa-stop"></i></button>
            <span data-time-current class="gpv-time">0:00</span>
            <input data-seek type="range" min="0" max="1000" value="0" step="1" aria-label="Pozice" disabled>
            <span data-time-total class="gpv-time">0:00</span>
        </div>
        <div class="gpv-transport-tools">
            <div class="flex items-center gap-1" title="Rychlost přehrávání">
                <button type="button" data-tempo-down class="gpv-icon-btn gpv-small" aria-label="Pomaleji"><i class="fa fa-minus"></i></button>
                <input data-tempo type="range" min="25" max="150" step="5" value="100" aria-label="Rychlost" class="gpv-tempo-range">
                <button type="button" data-tempo-up class="gpv-icon-btn gpv-small" aria-label="Rychleji"><i class="fa fa-plus"></i></button>
                <button type="button" data-tempo-reset class="gpv-tempo-readout" title="Zpět na 100 %"><b data-tempo-percent>100 %</b><span data-tempo-bpm></span></button>
            </div>
            <div class="flex flex-wrap items-center gap-1">
                <button type="button" data-loop class="gpv-toggle" aria-pressed="false" title="Smyčka. Tažením přes takty v notách vyberete úsek."><i class="fa fa-repeat"></i><span>Smyčka</span></button>
                <button type="button" data-clear-range class="gpv-toggle" title="Zrušit vybraný úsek" hidden><i class="fa fa-times"></i><span>Výběr</span></button>
                <button type="button" data-metronome class="gpv-toggle" aria-pressed="false" title="Metronom"><i class="fa fa-clock-o"></i><span>Metronom</span></button>
                <button type="button" data-countin class="gpv-toggle" aria-pressed="false" title="Předtakt před přehráním"><i class="fa fa-hourglass-start"></i><span>Předtakt</span></button>
            </div>
        </div>
        <div data-sound-status class="gpv-sound-status bg-white dark:bg-slate-900" hidden></div>
    </footer>
</div>
`;

let alphaTabLoading = null;

function loadAlphaTab() {
    if (window.alphaTab) {
        return Promise.resolve(window.alphaTab);
    }
    if (!alphaTabLoading) {
        alphaTabLoading = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = ALPHATAB_SCRIPT;
            script.onload = () => resolve(window.alphaTab);
            script.onerror = () => {
                alphaTabLoading = null;
                reject(new Error('Knihovnu alphaTab se nepodařilo stáhnout.'));
            };
            document.head.appendChild(script);
        });
    }
    return alphaTabLoading;
}

// Per-viewer conveniences only; the viewer works the same when storage is blocked.
const prefs = {
    get(key, fallback) {
        try {
            const value = localStorage.getItem(PREFS_PREFIX + key);
            return value === null ? fallback : JSON.parse(value);
        } catch {
            return fallback;
        }
    },
    set(key, value) {
        try {
            localStorage.setItem(PREFS_PREFIX + key, JSON.stringify(value));
        } catch {
            // storage unavailable: nothing to remember
        }
    },
};

const fold = (text) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const tabsFile = (song) => song?.files?.find((file) => file.type === 'tabs');

function formatTime(ms) {
    const total = Math.max(0, Math.round(ms / 1000));
    return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

function category(track) {
    const name = fold(track.name || '');
    const program = track.playbackInfo.program;
    if (track.staves.some((staff) => staff.isPercussion)) return 'drums';
    if (/voc|vox|sing|zpev|spev|choir|sbor|harmony/.test(name)) return 'vocals';
    if (program >= 24 && program <= 31) return 'guitar';
    if (program >= 32 && program <= 39) return 'bass';
    if (program <= 23 || (program >= 80 && program <= 103)) return 'keys';
    if (program >= 52 && program <= 54) return 'vocals';
    if (/bas/.test(name)) return 'bass';
    if (/git|kyt|gtr|guit/.test(name)) return 'guitar';
    return 'other';
}

class GpViewer extends HTMLElement {
    constructor() {
        super();
        this._initialized = false;
        this.api = null;
        this.score = null;
        this.songList = [];
        this.mix = [];
        this.shown = new Set();
        this.playing = false;
        this.speed = 1;
        this.baseTempo = 0;
        this.seeking = false;
        this.loadToken = 0;
        this.view = {
            profile: prefs.get('profile', 'auto'),
            layout: prefs.get('layout', 'Page'),
            zoom: prefs.get('zoom', window.innerWidth < 700 ? 0.75 : 1),
        };
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    connectedCallback() {
        if (this._initialized) {
            return;
        }
        this._initialized = true;
        this.renderBase();
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyDown);
    }

    disconnectedCallback() {
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyDown);
    }

    renderBase() {
        this.classList.add('fixed', 'inset-0', 'z-50', 'hidden');
        this.setAttribute('aria-hidden', 'true');
        this.innerHTML = TEMPLATE;
        this.ensureStyles();

        const $ = (selector) => this.querySelector(selector);
        this.el = {
            title: $('[data-title]'),
            subtitle: $('[data-subtitle]'),
            songPicker: $('[data-song-picker]'),
            song: $('[data-song]'),
            view: $('[data-view]'),
            layout: $('[data-layout]'),
            zoom: $('[data-zoom]'),
            download: $('[data-download]'),
            print: $('[data-print]'),
            viewport: $('[data-viewport]'),
            score: $('[data-score]'),
            trackList: $('[data-track-list]'),
            status: $('[data-status]'),
            spinner: $('[data-spinner]'),
            statusTitle: $('[data-status-title]'),
            statusText: $('[data-status-text]'),
            play: $('[data-play]'),
            stop: $('[data-stop]'),
            seek: $('[data-seek]'),
            timeCurrent: $('[data-time-current]'),
            timeTotal: $('[data-time-total]'),
            tempo: $('[data-tempo]'),
            tempoPercent: $('[data-tempo-percent]'),
            tempoBpm: $('[data-tempo-bpm]'),
            tempoReset: $('[data-tempo-reset]'),
            loop: $('[data-loop]'),
            clearRange: $('[data-clear-range]'),
            metronome: $('[data-metronome]'),
            countIn: $('[data-countin]'),
            soundStatus: $('[data-sound-status]'),
        };

        $('[data-close]').addEventListener('click', () => this.close());
        $('[data-tracks-toggle]').addEventListener('click', () => this.classList.toggle('gpv-tracks-open'));
        $('[data-scrim]').addEventListener('click', () => this.classList.remove('gpv-tracks-open'));
        $('[data-reset]').addEventListener('click', () => {
            this.mix.forEach((m) => Object.assign(m, { mute: false, solo: false, volume: 1 }));
            this.applyMix();
            this.renderTrackList();
        });
        this.el.print.addEventListener('click', () => this.api?.print());
        this.el.song.addEventListener('change', () => {
            const song = this.songList.find((s) => s.id === this.el.song.value);
            this.el.song.blur(); // so Space goes back to play/pause
            if (song) this.open(song, tabsFile(song));
        });

        this.el.play.addEventListener('click', () => this.api?.playPause());
        this.el.stop.addEventListener('click', () => this.api?.stop());
        this.el.seek.addEventListener('input', () => {
            this.seeking = true;
            this.el.timeCurrent.textContent = formatTime(+this.el.seek.value);
        });
        this.el.seek.addEventListener('change', () => {
            if (this.api) this.api.timePosition = +this.el.seek.value;
            this.seeking = false;
        });

        this.el.tempo.addEventListener('input', () => this.setSpeed(this.el.tempo.value / 100));
        $('[data-tempo-down]').addEventListener('click', () => this.setSpeed(this.speed - 0.05));
        $('[data-tempo-up]').addEventListener('click', () => this.setSpeed(this.speed + 0.05));
        this.el.tempoReset.addEventListener('click', () => this.setSpeed(1));

        this.el.loop.addEventListener('click', () => {
            if (!this.api) return;
            this.api.isLooping = !this.api.isLooping;
            this.el.loop.setAttribute('aria-pressed', String(this.api.isLooping));
        });
        this.el.clearRange.addEventListener('click', () => {
            if (!this.api) return;
            this.api.playbackRange = null;
            this.api.clearPlaybackRangeHighlight();
            this.el.clearRange.hidden = true;
        });
        this.bindToggle(this.el.metronome, 'metronome', (on) => { this.api.metronomeVolume = on ? 1 : 0; });
        this.bindToggle(this.el.countIn, 'countIn', (on) => { this.api.countInVolume = on ? 1 : 0; });

        this.bindView(this.el.view, 'profile');
        this.bindView(this.el.layout, 'layout');
        this.bindView(this.el.zoom, 'zoom');
        this.updateTempoReadout();
    }

    ensureStyles() {
        if (document.getElementById(STYLE_ID)) {
            return;
        }
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = './styles/gp-viewer.css';
        link.id = STYLE_ID;
        document.head.appendChild(link);
    }

    // ---------- song list ----------

    // Every song that has a Guitar Pro file; fills the song picker that replaces the title.
    set songs(list) {
        this.songList = (list || []).filter((song) => tabsFile(song));
        this.renderSongPicker();
    }

    get songs() {
        return this.songList;
    }

    renderSongPicker() {
        if (!this.el) return;
        const select = this.el.song;
        select.replaceChildren();
        const archive = document.createElement('optgroup');
        archive.label = 'Archiv';
        for (const song of this.songList) {
            const option = new Option(song.title ?? song.id, song.id);
            (song.status?.archive ? archive : select).appendChild(option);
        }
        if (archive.children.length) select.appendChild(archive);
        this.syncSongPicker();
    }

    syncSongPicker() {
        const listed = this.songList.some((s) => s.id === this.song?.id);
        this.el.songPicker.hidden = !listed || this.songList.length < 2;
        this.el.title.hidden = !this.el.songPicker.hidden;
        if (listed) this.el.song.value = this.song.id;
    }

    // ---------- open / close ----------

    // Header "Player" button: no song chosen, so start from the one played here last.
    openPlayer() {
        const lastId = prefs.get('lastSong', null);
        const song = this.songList.find((s) => s.id === lastId) || this.songList[0];
        if (song) this.open(song, tabsFile(song));
    }

    async open(song, file) {
        if (!song || !file) {
            return;
        }
        if (this.playing) {
            this.api.pause();
        }
        this.song = song;
        this.file = file;
        prefs.set('lastSong', song.id);
        this.el.title.textContent = song.title ?? song.id;
        this.syncSongPicker();
        this.el.subtitle.textContent = `Tabulatura · ${file.filename}.${file.extension}`;
        this.el.download.href = file.url;
        this.el.download.setAttribute('download', `${file.filename}.${file.extension}`);

        const wasOpen = this.isOpen;
        this.classList.remove('hidden', 'gpv-tracks-open');
        this.removeAttribute('hidden');
        this.setAttribute('aria-hidden', 'false');
        if (document.body.dataset.scrollLock === undefined) {
            document.body.dataset.scrollLock = document.body.style.overflow || '';
        }
        document.body.style.overflow = 'hidden';
        if (!wasOpen) {
            wakeLockManager.requestWakeLock('gp-viewer');
        }

        const token = ++this.loadToken;
        this.setStatus('loading', 'Načítám tabulaturu…', file.filename);
        try {
            await this.ensureApi();
            const response = await fetch(file.url);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const bytes = new Uint8Array(await response.arrayBuffer());
            if (token === this.loadToken) {
                this.openScore(bytes);
            }
        } catch (error) {
            console.error('Nepodařilo se načíst tabulaturu:', error);
            if (token === this.loadToken) {
                this.setStatus('error', 'Tabulaturu se nepodařilo načíst.', error.message);
            }
        }
    }

    close() {
        if (this.playing) {
            this.api.pause();
        }
        this.loadToken++;
        this.classList.add('hidden');
        this.setAttribute('aria-hidden', 'true');
        if (document.body.dataset.scrollLock !== undefined) {
            document.body.style.overflow = document.body.dataset.scrollLock;
            delete document.body.dataset.scrollLock;
        } else {
            document.body.style.overflow = '';
        }
        wakeLockManager.releaseWakeLock('gp-viewer');
    }

    get isOpen() {
        return !this.classList.contains('hidden');
    }

    setStatus(kind, title, text = '') {
        this.el.status.hidden = !kind;
        this.el.status.classList.toggle('gpv-error', kind === 'error');
        this.el.spinner.hidden = kind !== 'loading';
        this.el.statusTitle.textContent = title || '';
        this.el.statusText.textContent = text;
    }

    // ---------- alphaTab ----------

    async ensureApi() {
        if (this.api) {
            return this.api;
        }
        const alphaTab = await loadAlphaTab();
        const api = new alphaTab.AlphaTabApi(this.el.score, {
            core: { scriptFile: ALPHATAB_SCRIPT, fontDirectory: `${ALPHATAB_CDN}font/` },
            display: {
                staveProfile: alphaTab.StaveProfile[VIEW_PROFILES[this.view.profile] || 'Default'],
                layoutMode: alphaTab.LayoutMode[this.view.layout],
                scale: this.view.zoom,
            },
            player: {
                playerMode: alphaTab.PlayerMode.EnabledSynthesizer,
                soundFont: `${ALPHATAB_CDN}soundfont/sonivox.sf2`,
                scrollElement: this.el.viewport,
                scrollOffsetY: -24,
            },
        });
        this.api = api;

        api.soundFontLoad.on((e) => {
            if (e.total) {
                this.el.soundStatus.hidden = false;
                this.el.soundStatus.textContent = `Načítám zvuky… ${Math.round((e.loaded / e.total) * 100)} %`;
            }
        });
        api.soundFontLoaded.on(() => {
            this.el.soundStatus.hidden = true;
        });
        // Fires again for every song once its MIDI is loaded, so the mixer is re-applied per song.
        api.playerReady.on(() => {
            this.el.play.disabled = false;
            this.el.stop.disabled = false;
            this.el.seek.disabled = false;
            this.applyMix();
            this.syncToggles();
            api.playbackSpeed = this.speed;
        });
        api.playerStateChanged.on((e) => {
            this.playing = e.state === PLAYING;
            this.el.play.querySelector('.fa').className = this.playing ? 'fa fa-pause' : 'fa fa-play';
            this.el.play.setAttribute('aria-label', this.playing ? 'Pauza' : 'Přehrát');
        });
        api.playerPositionChanged.on((e) => {
            if (e.originalTempo && Math.round(e.originalTempo) !== Math.round(this.baseTempo)) {
                this.baseTempo = e.originalTempo;
                this.updateTempoReadout();
            }
            this.el.seek.max = Math.max(1, Math.round(e.endTime));
            this.el.timeTotal.textContent = formatTime(e.endTime);
            if (!this.seeking) {
                this.el.seek.value = Math.round(e.currentTime);
                this.el.timeCurrent.textContent = formatTime(e.currentTime);
            }
        });
        api.playbackRangeChanged.on((e) => {
            this.el.clearRange.hidden = !e.playbackRange;
        });
        api.renderFinished.on(() => this.setStatus(null));
        api.error.on((error) => {
            console.error('alphaTab:', error);
            this.setStatus('error', 'Něco se pokazilo.', error?.message || String(error));
        });
        this.syncToggles();
        return api;
    }

    openScore(bytes) {
        let score;
        try {
            score = window.alphaTab.importer.ScoreLoader.loadScoreFromBytes(bytes, this.api.settings);
        } catch (error) {
            console.error(error);
            this.setStatus('error', 'Tento soubor se nedá přečíst.', 'Podporované jsou soubory Guitar Pro 3–8 (.gp, .gpx, .gp5, .gp4, .gp3).');
            return;
        }

        if (this.playing) {
            this.api.pause();
        }
        this.score = score;
        this.mix = score.tracks.map((t) => ({ mute: t.playbackInfo.isMute, solo: t.playbackInfo.isSolo, volume: 1 }));
        this.shown = new Set(this.pickTracks(score.tracks));
        this.baseTempo = score.masterBars[0]?.tempoAutomations?.[0]?.value || 0;
        // Remember how each staff was saved, so the "as in file" view can restore it.
        for (const track of score.tracks) {
            for (const staff of track.staves) {
                staff.gpvSaved = { tab: staff.showTablature, notation: staff.showStandardNotation };
            }
        }
        this.applyStaffVisibility();
        this.renderTrackList();
        this.updateTempoReadout();
        this.el.clearRange.hidden = true;
        this.setStatus('loading', 'Kreslím noty…', this.song?.title ?? '');
        this.api.renderScore(score, this.sortedShown());
    }

    applyStaffVisibility() {
        if (!this.score) return;
        for (const track of this.score.tracks) {
            for (const staff of track.staves) {
                staff.showTablature = staff.gpvSaved.tab;
                staff.showStandardNotation = staff.gpvSaved.notation;
                if (this.view.profile === 'auto' && staff.isStringed && ['guitar', 'bass'].includes(category(track))) {
                    staff.showTablature = true;
                }
            }
        }
    }

    pickTracks(tracks) {
        // Reopen songs on the same kind of parts this person looked at last time (e.g. bass + drums).
        const wanted = prefs.get('shownCategories', []);
        const picked = [];
        for (const cat of wanted) {
            const track = tracks.find((t) => category(t) === cat && !picked.includes(t.index));
            if (track) picked.push(track.index);
        }
        return picked.length ? picked : [0];
    }

    sortedShown() {
        return [...this.shown].sort((a, b) => a - b);
    }

    setShown(indexes) {
        this.shown = new Set(indexes);
        const ordered = this.sortedShown();
        prefs.set('shownCategories', ordered.map((i) => category(this.score.tracks[i])));
        this.renderTrackList();
        this.api.renderTracks(ordered.map((i) => this.score.tracks[i]));
    }

    // ---------- tracks & mixer ----------

    isSilent(index) {
        const anySolo = this.mix.some((m) => m.solo);
        return this.mix[index].mute || (anySolo && !this.mix[index].solo);
    }

    applyMix() {
        if (!this.score || !this.api) return;
        this.score.tracks.forEach((track, i) => {
            this.api.changeTrackMute([track], this.mix[i].mute);
            this.api.changeTrackSolo([track], this.mix[i].solo);
            this.api.changeTrackVolume([track], this.mix[i].volume);
        });
    }

    renderTrackList() {
        const list = this.el.trackList;
        list.replaceChildren();
        if (!this.score) return;

        this.score.tracks.forEach((track, i) => {
            const cat = category(track);
            const name = track.name || `Stopa ${i + 1}`;
            const row = document.createElement('div');
            row.className = 'gpv-track';
            row.classList.toggle('gpv-shown', this.shown.has(i));
            row.classList.toggle('gpv-silent', this.isSilent(i));
            row.innerHTML = `
                <span class="gpv-chip gpv-${cat}">${CATEGORY_LABELS[cat]}</span>
                <button type="button" class="gpv-track-name" title="Zobrazit jen tuto stopu"></button>
                <div class="gpv-track-buttons">
                    <button type="button" class="gpv-show" title="Zobrazit v notách"><i class="fa fa-eye"></i></button>
                    <button type="button" class="gpv-mute" title="Ztlumit">M</button>
                    <button type="button" class="gpv-solo" title="Sólo: hrají jen stopy se S">S</button>
                </div>
                <label class="gpv-volume">
                    <input type="range" min="0" max="150" step="5">
                    <span></span>
                </label>`;

            const nameButton = row.querySelector('.gpv-track-name');
            nameButton.textContent = name;
            nameButton.addEventListener('click', () => this.setShown([i]));

            const showButton = row.querySelector('.gpv-show');
            showButton.classList.toggle('gpv-on', this.shown.has(i));
            showButton.setAttribute('aria-pressed', String(this.shown.has(i)));
            showButton.setAttribute('aria-label', `Zobrazit ${name} v notách`);
            showButton.addEventListener('click', () => {
                const next = new Set(this.shown);
                if (next.has(i)) next.delete(i);
                else next.add(i);
                if (next.size) this.setShown([...next]);
            });

            for (const [cls, key, label] of [['gpv-mute', 'mute', 'Ztlumit'], ['gpv-solo', 'solo', 'Sólo']]) {
                const button = row.querySelector(`.${cls}`);
                button.classList.toggle('gpv-on', this.mix[i][key]);
                button.setAttribute('aria-pressed', String(this.mix[i][key]));
                button.setAttribute('aria-label', `${label}: ${name}`);
                button.addEventListener('click', () => {
                    this.mix[i][key] = !this.mix[i][key];
                    if (key === 'mute') this.api.changeTrackMute([track], this.mix[i].mute);
                    else this.api.changeTrackSolo([track], this.mix[i].solo);
                    this.renderTrackList();
                });
            }

            const volume = row.querySelector('.gpv-volume input');
            const volumeText = row.querySelector('.gpv-volume span');
            volume.value = Math.round(this.mix[i].volume * 100);
            volume.setAttribute('aria-label', `Hlasitost: ${name}`);
            volumeText.textContent = `${volume.value} %`;
            volume.addEventListener('input', () => {
                this.mix[i].volume = volume.value / 100;
                volumeText.textContent = `${volume.value} %`;
                this.api.changeTrackVolume([track], this.mix[i].volume);
            });

            list.appendChild(row);
        });
    }

    // ---------- transport ----------

    setSpeed(value) {
        this.speed = Math.min(1.5, Math.max(0.25, Math.round(value * 100) / 100));
        if (this.api) this.api.playbackSpeed = this.speed;
        this.el.tempo.value = Math.round(this.speed * 100);
        this.updateTempoReadout();
    }

    updateTempoReadout() {
        this.el.tempoPercent.textContent = `${Math.round(this.speed * 100)} %`;
        this.el.tempoBpm.textContent = this.baseTempo ? `♩ = ${Math.round(this.baseTempo * this.speed)}` : '';
        this.el.tempoReset.title = this.baseTempo
            ? `Původní tempo ♩ = ${Math.round(this.baseTempo)}. Klikem zpět na 100 %.`
            : 'Zpět na 100 %';
        this.el.tempoReset.classList.toggle('gpv-slowed', this.speed !== 1);
    }

    bindToggle(button, key, apply) {
        button.addEventListener('click', () => {
            prefs.set(key, !prefs.get(key, false));
            this.syncToggles();
        });
        (this.toggles ||= []).push({ button, key, apply });
    }

    syncToggles() {
        for (const { button, key, apply } of this.toggles || []) {
            const on = prefs.get(key, false);
            button.setAttribute('aria-pressed', String(on));
            if (this.api) apply(on);
        }
    }

    bindView(select, key) {
        select.value = String(this.view[key]);
        select.addEventListener('change', () => {
            this.view[key] = key === 'zoom' ? +select.value : select.value;
            prefs.set(key, this.view[key]);
            if (!this.api) return;
            const display = this.api.settings.display;
            const alphaTab = window.alphaTab;
            if (key === 'profile') {
                display.staveProfile = alphaTab.StaveProfile[VIEW_PROFILES[this.view.profile]];
                this.applyStaffVisibility();
            } else if (key === 'layout') {
                display.layoutMode = alphaTab.LayoutMode[this.view.layout];
            } else {
                display.scale = this.view.zoom;
            }
            this.api.updateSettings();
            if (this.score) this.api.render();
        });
    }

    handleKeyDown(event) {
        if (!this.isOpen) {
            return;
        }
        if (event.type === 'keydown' && event.key === 'Escape') {
            this.close();
            return;
        }
        const typing = event.target.matches?.('input, select, textarea') && event.target.type !== 'range';
        if (event.code === 'Space' && !typing && !event.metaKey && !event.ctrlKey) {
            // Also swallowed on keyup, so a focused button isn't "clicked" by the same press.
            event.preventDefault();
            if (event.type === 'keydown' && !event.repeat && !this.el.play.disabled) {
                this.api.playPause();
            }
        }
    }
}

customElements.define('gp-viewer', GpViewer);
