const TEMPLATE = `
<div data-overlay class="flex min-h-screen w-full items-stretch justify-center bg-black/80 px-0 py-0 md:px-6 md:py-10 overflow-y-auto">
    <article class="relative flex w-full min-h-screen max-h-screen flex-col overflow-y-auto bg-white p-6 text-slate-800 shadow-2xl shadow-black/40 md:my-4 md:max-w-4xl md:min-h-0 md:max-h-[90vh] md:rounded-xl md:overflow-y-auto">
        <button type="button" data-close class="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-brand/30 text-brand transition hover:bg-brand hover:text-white" aria-label="Zavřít playlist">
            <i class="fa fa-times"></i>
        </button>
        <div class="flex flex-wrap justify-start items-center gap-4">
            <h1 class="text-2xl font-semibold uppercase tracking-[0.2em] text-brand">Playlist</h1>
            <label class=" inline-flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-slate-500">
                <input type="checkbox" data-include-nonready class="h-4 w-4 rounded border-brand text-brand focus:ring-brand" />
                <span>Zahrnout NOVINKA / ROZPRAC.</span>
            </label>
        </div>
        <ol data-list class="mt-6 space-y-3"></ol>
        <p data-empty class="mt-6 text-center text-xs uppercase tracking-[0.3em] text-slate-400 hidden">Žádné skladby se statusem READY.</p>
        <div class="flex border-t border-dashed border-black items-center justify-between bg-brand/5 px-4 py-3  ">
                <p data-count class="text-sm font-semibold"></p>
                <p data-duration class="text-xs uppercase text-slate-400"></p>
            </div>
    </article>
</div>
`;

class PlaylistViewer extends HTMLElement {
    constructor() {
        super();
        this._initialized = false;
        this.includeNew = false;
        this.includeProgress = false;
        this.includeNonReadyToggle = null;
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    connectedCallback() {
        if (this._initialized) {
            return;
        }
        this._initialized = true;
        this.renderBase();
        document.addEventListener('keydown', this.handleKeyDown);
    }

    disconnectedCallback() {
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    renderBase() {
        this.classList.add('fixed', 'inset-0', 'z-40', 'hidden');
        this.setAttribute('aria-hidden', 'true');
        this.innerHTML = TEMPLATE;
        this.overlay = this.querySelector('[data-overlay]');
        this.closeButton = this.querySelector('[data-close]');
        this.listEl = this.querySelector('[data-list]');
        this.countEl = this.querySelector('[data-count]');
        this.durationEl = this.querySelector('[data-duration]');
        this.emptyEl = this.querySelector('[data-empty]');
        this.includeNonReadyToggle = this.querySelector('[data-include-nonready]');

        this.overlay.addEventListener('click', (event) => {
            if (event.target === this.overlay) {
                this.close();
            }
        });
        this.closeButton.addEventListener('click', () => this.close());
        this.includeNonReadyToggle.addEventListener('change', (event) => {
            const checked = event.target.checked;
            this.includeNew = checked;
            this.includeProgress = checked;
            this.renderPlaylist();
        });
    }

    open(songs = []) {
        this.songs = songs;
        this.renderPlaylist();
        this.classList.remove('hidden');
        this.removeAttribute('hidden');
        this.setAttribute('aria-hidden', 'false');
        document.body.dataset.playlistScrollLock = document.body.style.overflow || '';
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.classList.add('hidden');
        this.setAttribute('aria-hidden', 'true');
        this.listEl.innerHTML = '';
        this.countEl.textContent = '';
        this.durationEl.textContent = '';
        this.includeNew = false;
        this.includeProgress = false;
        if (this.includeNonReadyToggle) {
            this.includeNonReadyToggle.checked = false;
        }
        if ('playlistScrollLock' in document.body.dataset) {
            document.body.style.overflow = document.body.dataset.playlistScrollLock;
            delete document.body.dataset.playlistScrollLock;
        } else {
            document.body.style.overflow = '';
        }
    }

    renderPlaylist(songs = this.songs || []) {
        const playlist = this.buildPlaylist(songs);
        if (!playlist.length) {
            this.listEl.innerHTML = '';
            this.emptyEl.classList.remove('hidden');
            this.countEl.textContent = '0 skladeb';
            this.durationEl.textContent = '--:--';
            return;
        }
        this.emptyEl.classList.add('hidden');
        this.listEl.innerHTML = '';
        playlist.forEach((entry, index) => {
            const item = document.createElement('li');
            item.className = 'flex items-center justify-between rounded-xl bg-brand/5 px-4 py-3';
            const titleWrapper = document.createElement('div');
            titleWrapper.className = 'flex gap-1 text-brand dark:text-white';
            const title = document.createElement('div');
            title.className = 'text-sm font-semibold uppercase tracking-[0.2em]';
            title.textContent = `${index + 1}. ${entry.title}`;
            titleWrapper.appendChild(title);
            const badges = this.buildStatusBadges(entry.song);
            if (badges.length) {
                const badgeRow = document.createElement('div');
                badgeRow.className = 'flex flex-wrap gap-2 text-[0.55rem]';
                badges.forEach((badge) => badgeRow.appendChild(badge));
                titleWrapper.appendChild(badgeRow);
            }
            const duration = document.createElement('span');
            duration.className = 'text-xs text-slate-500';
            duration.textContent = entry.duration ?? '--:--';
            item.append(titleWrapper, duration);
            this.listEl.appendChild(item);
        });
        const totalSeconds = playlist.reduce((sum, entry) => sum + (entry.durationSeconds || 0), 0);
        this.countEl.textContent = `${playlist.length} skladeb`;
        this.durationEl.textContent = this.formatTotalDuration(totalSeconds);
    }

    buildPlaylist(songs) {
        const filteredSongs = (songs || []).filter((song) => this.isReady(song)
            || (this.includeNew && this.isNew(song))
            || (this.includeProgress && this.isProgress(song)));
        return filteredSongs
            .map((song, index) => {
                const weight = this.resolveWeight(song);
                return {
                    title: song.title ?? song.id,
                    duration: song.duration ?? null,
                    durationSeconds: this.parseDuration(song.duration),
                    weight,
                    bucket: this.resolveBucket(weight),
                    index,
                    song,
                };
            })
            .sort((a, b) => {
                const bucketDiff = a.bucket - b.bucket;
                if (bucketDiff !== 0) {
                    return bucketDiff;
                }
                if (a.bucket === 0 || a.bucket === 2) {
                    return a.weight - b.weight;
                }
                return a.index - b.index;
            });
    }

    isReady(song) {
        return Boolean(song?.status?.ready || song?.status?.value === 'ready' || song?.meta?.manifest?.status === 'ready');
    }

    isNew(song) {
        return Boolean(song?.status?.new || song?.status?.value === 'new' || song?.meta?.manifest?.status === 'new');
    }

    isProgress(song) {
        return Boolean(song?.status?.progress || song?.status?.value === 'progress' || song?.meta?.manifest?.status === 'progress');
    }

    buildStatusBadges(song) {
        const badges = [];
        if (this.isNew(song)) {
            badges.push(this.createBadge('Novinka', 'bg-emerald-600 text-white px-2 py-0.5 rounded tracking-[0.2em]'));
        }
        if (this.isProgress(song)) {
            badges.push(this.createBadge('Rozpracováno', 'bg-amber-300 text-slate-900 px-2 py-0.5 rounded tracking-[0.2em]'));
        }
        return badges;
    }

    createBadge(label, classes) {
        const badge = document.createElement('span');
        badge.className = `text-[0.55rem] font-semibold uppercase ${classes}`;
        badge.textContent = label;
        return badge;
    }

    resolveWeight(song) {
        const raw = song.meta?.manifest?.weight;
        const value = typeof raw === 'number' ? raw : parseFloat(raw);
        if (Number.isFinite(value)) {
            return value;
        }
        return 50;
    }

    resolveBucket(weight) {
        if (weight < 50) {
            return 0;
        }
        if (weight > 50) {
            return 2;
        }
        return 1;
    }

    parseDuration(duration) {
        if (!duration || typeof duration !== 'string') {
            return 0;
        }
        const parts = duration.split(':').map((part) => parseInt(part, 10));
        if (parts.some((value) => Number.isNaN(value))) {
            return 0;
        }
        if (parts.length === 2) {
            return parts[0] * 60 + parts[1];
        }
        if (parts.length === 3) {
            return parts[0] * 3600 + parts[1] * 60 + parts[2];
        }
        return 0;
    }

    formatTotalDuration(seconds) {
        if (!seconds) {
            return '--:--';
        }
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes
                .toString()
                .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    handleKeyDown(event) {
        if (event.key === 'Escape' && !this.classList.contains('hidden')) {
            this.close();
        }
    }
}

customElements.define('playlist-viewer', PlaylistViewer);
