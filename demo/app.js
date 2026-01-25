import './components/song-card.js';
import './components/song-book.js';
import './components/lyrics-viewer.js';
import './components/playlist-viewer.js';

const CALENDAR_ID = '48jdqagdt2v2uhhd8afgcn2fc8@group.calendar.google.com';
const CALENDAR_KEY = 'AIzaSyBxSP7qbnpzphJzT3yeRoc0XmreUx9DM2I';
const CALENDAR_URL = `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${CALENDAR_KEY}&timeMin=${new Date().toISOString()}&maxResults=1&singleEvents=true&orderBy=startTime`;
let cachedSongs = [];

document.addEventListener('DOMContentLoaded', () => {
    loadCalendarEvent();
    const playlistButton = document.getElementById('playlist-button');
    if (playlistButton) {
        playlistButton.disabled = true;
        playlistButton.addEventListener('click', () => openPlaylist());
    }
});

document.addEventListener('lyrics-requested', (event) => {
    const viewer = document.querySelector('lyrics-viewer');
    if (!viewer || typeof viewer.open !== 'function') {
        return;
    }
    viewer.open(event.detail.song, event.detail.file);
});

document.addEventListener('songs-loaded', (event) => {
    cachedSongs = event.detail?.songs ?? [];
    const playlistButton = document.getElementById('playlist-button');
    if (playlistButton) {
        playlistButton.disabled = !hasReadySongs(cachedSongs);
    }
});

function openPlaylist() {
    const viewer = document.querySelector('playlist-viewer');
    if (!viewer || typeof viewer.open !== 'function') {
        return;
    }
    viewer.open(cachedSongs);
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
