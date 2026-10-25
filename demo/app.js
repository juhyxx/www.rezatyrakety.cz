import './components/song-card.js';
import './components/song-book.js';
import './components/lyrics-viewer.js';
import './components/playlist-viewer.js';
import './components/lyrics-progress-viewer.js';
import './components/recent-files-viewer.js';
import './components/gp-viewer.js';

const CALENDAR_ID = '48jdqagdt2v2uhhd8afgcn2fc8@group.calendar.google.com';
const CALENDAR_KEY = 'AIzaSyBxSP7qbnpzphJzT3yeRoc0XmreUx9DM2I';
const CALENDAR_URL = `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${CALENDAR_KEY}&timeMin=${new Date().toISOString()}&maxResults=1&singleEvents=true&orderBy=startTime`;
let cachedSongs = [];

document.addEventListener('DOMContentLoaded', () => {
    loadCalendarEvent();
    initRouting();
    const playlistButton = document.getElementById('playlist-button');
    if (playlistButton) {
        playlistButton.disabled = true;
        playlistButton.addEventListener('click', () => navigate({ view: 'playlist' }));
    }
    const lyricsProgressButton = document.getElementById('lyrics-progress-button');
    if (lyricsProgressButton) {
        lyricsProgressButton.addEventListener('click', () => navigate({ view: 'progress' }));
    };
    const recentButton = document.getElementById('recent-button');
    if (recentButton) {
        recentButton.addEventListener('click', () => navigate({ view: 'recent' }));
    }
    const playerButton = document.getElementById('player-button');
    if (playerButton) {
        playerButton.disabled = true;
        playerButton.addEventListener('click', () => {
            const song = document.querySelector('gp-viewer')?.defaultSong;
            if (song) navigate({ view: 'player', song: song.id });
        });
    }
    document.addEventListener('lyrics-requested', (event) => {
        const { song, file } = event.detail;
        navigate({ view: 'lyrics', song: song.id, file: `${file.filename}.${file.extension}` });
    });
    document.addEventListener('tabs-requested', (event) => {
        navigate({ view: 'player', song: event.detail.song.id });
    });
    document.addEventListener('viewer-closed', handleViewerClosed);
    window.addEventListener('popstate', () => {
        adoptUntrackedEntry();
        applyRoute();
    });
});

function progressSongs() {
    return (cachedSongs || []).filter((song) => {
        const lyricsState = song?.lyricsState || song?.lyrics;
        return lyricsState === 'progress' || lyricsState === 'ready';
    });
}

document.addEventListener('songs-loaded', (event) => {
    cachedSongs = event.detail?.songs ?? [];
    const playlistButton = document.getElementById('playlist-button');
    if (playlistButton) {
        playlistButton.disabled = !hasReadySongs(cachedSongs);
    }
    const gpViewer = document.querySelector('gp-viewer');
    if (gpViewer) {
        gpViewer.songs = cachedSongs;
    }
    const playerButton = document.getElementById('player-button');
    if (playerButton) {
        playerButton.disabled = !gpViewer?.songs.length;
    }
    applyRoute(); // a link like #/player/kabaty waits for the songs before it can open
});

// ---------- routing ----------
// Every overlay has an address (#/player/kabaty, #/lyrics/kabaty, #/playlist, #/progress, #/recent), so the
// browser's back/forward buttons and the phone's back gesture step through them. Each history entry stores
// the stack of open overlays, and each overlay remembers the depth of the entry that opened it (`at`):
// closing it with its own button goes back past that entry instead of piling up new ones.

const VIEWERS = {
    player: 'gp-viewer',
    lyrics: 'lyrics-viewer',
    playlist: 'playlist-viewer',
    progress: 'lyrics-progress-viewer',
    recent: 'recent-files-viewer',
};
const BASE_URL = location.pathname + location.search;
let applyingRoute = false;
let closeTarget = null;

function routeHash(item) {
    return item.song ? `#/${item.view}/${encodeURIComponent(item.song)}` : `#/${item.view}`;
}

function parseHash(hash) {
    try {
        const [view, song] = hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent);
        return VIEWERS[view] ? { view, song: song || undefined } : null;
    } catch {
        return null;
    }
}

function routeState() {
    return history.state?.stack ? history.state : { depth: 0, stack: [] };
}

function initRouting() {
    if (history.state?.stack) {
        return; // a reload keeps the entries made earlier
    }
    const item = parseHash(location.hash);
    if (!item) {
        history.replaceState({ depth: 0, stack: [] }, '', location.href);
        return;
    }
    // Opened straight from a link: put the song list underneath, so Back and close stay in the app.
    history.replaceState({ depth: 0, stack: [] }, '', BASE_URL);
    history.pushState({ depth: 1, stack: [{ ...item, at: 1 }] }, '', routeHash(item));
}

// A hash typed into the address bar makes an entry without our state.
function adoptUntrackedEntry() {
    if (history.state?.stack) return;
    const item = parseHash(location.hash);
    history.replaceState(item ? { depth: 1, stack: [{ ...item, at: 1 }] } : { depth: 0, stack: [] }, '');
}

function navigate(item) {
    const { depth, stack } = routeState();
    const top = stack[stack.length - 1];
    if (top && routeHash(top) === routeHash(item) && top.file === item.file) {
        return;
    }
    // Another song in the overlay that is already on top (e.g. the player's song picker) keeps its `at`,
    // so Back steps to the previous song but closing still leaves the overlay in one go.
    const next = top?.view === item.view
        ? [...stack.slice(0, -1), { ...item, at: top.at }]
        : [...stack.filter((s) => s.view !== item.view), { ...item, at: depth + 1 }];
    history.pushState({ depth: depth + 1, stack: next }, '', routeHash(item));
    applyRoute();
}

function applyRoute() {
    if (!cachedSongs.length) {
        return;
    }
    const { stack } = routeState();
    applyingRoute = true;
    try {
        for (const [view, tag] of Object.entries(VIEWERS)) {
            const viewer = document.querySelector(tag);
            if (!viewer) continue;
            const item = stack.findLast((s) => s.view === view);
            const isOpen = !viewer.classList.contains('hidden');
            if (item) {
                openViewer(view, viewer, item, isOpen);
            } else if (isOpen) {
                viewer.close();
            }
        }
    } finally {
        applyingRoute = false;
    }
}

function openViewer(view, viewer, item, isOpen) {
    const song = item.song && cachedSongs.find((s) => s.id === item.song);
    if (view === 'player') {
        const file = song?.files?.find((f) => f.type === 'tabs');
        if (file && !(isOpen && viewer.song?.id === song.id)) viewer.open(song, file);
    } else if (view === 'lyrics') {
        const files = (song?.files || []).filter((f) => f.type === 'lyrics');
        const file = files.find((f) => `${f.filename}.${f.extension}` === item.file) || files[0];
        if (file && !(isOpen && viewer.file === file)) viewer.open(song, file);
    } else if (!isOpen) {
        viewer.open(view === 'progress' ? progressSongs() : cachedSongs);
    }
}

// An overlay closed itself (its X, Escape, backdrop): step back to the entry before it was opened.
// Collected over one task, because Escape can close two overlays at once.
function handleViewerClosed(event) {
    if (applyingRoute) return;
    const view = Object.keys(VIEWERS).find((v) => VIEWERS[v] === event.target.localName);
    const item = routeState().stack.find((s) => s.view === view);
    if (!item) return;
    if (closeTarget === null) {
        setTimeout(() => {
            const steps = closeTarget - routeState().depth;
            closeTarget = null;
            if (steps < 0) history.go(steps);
        });
    }
    closeTarget = Math.min(closeTarget ?? Infinity, item.at - 1);
}

function hasReadySongs(songs) {
    return (songs || []).some((song) => song?.status?.ready || song?.status?.value === 'ready');
}

async function loadCalendarEvent() {
    const eventEl = document.getElementById('event');
    if (!eventEl) {
        return;
    }

    try {
        const response = await fetch(CALENDAR_URL);
        if (!response.ok) {
            throw new Error('Kalendář není dostupný');
        }
        const payload = await response.json();
        const event = payload.items?.[0];
        if (!event) {
            eventEl.textContent = 'Žádné nadcházející události.';
            return;
        }
        const when = event.start.dateTime || event.start.date;
        const start = new Date(when);
        const friendlyDate = start.toLocaleString('cs-CZ', { dateStyle: 'full', timeStyle: 'short' });
        eventEl.innerHTML = `
            <span class="flex items-center gap-2 text-brand">
                <i class="fa fa-calendar text-lg"></i>
                <span class="uppercase tracking-[0.3em] text-xs">${event.summary}</span>
            </span>
            <span class="block text-[0.65rem] text-slate-500 mt-1">${friendlyDate}</span>
            <a class="inline-flex items-center gap-1 text-[0.65rem] uppercase tracking-[0.3em] text-brand mt-2" href="https://calendar.google.com/calendar/u/0/embed?src=${CALENDAR_ID}&ctz=Europe/Prague" target="_blank" rel="noopener noreferrer">
                Otevřít kalendář <i class="fa fa-external-link"></i>
            </a>`;
    } catch (error) {
        console.error('Kalendář selhal:', error);
        eventEl.textContent = 'Chyba při načítání kalendáře.';
    }
}
