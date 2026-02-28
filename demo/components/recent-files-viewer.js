const TEMPLATE = `
<div data-overlay class="flex min-h-screen w-full items-stretch justify-center bg-black/80 dark:bg-black px-0 py-0 md:px-6 md:py-10 overflow-y-auto">
    <article class="relative flex w-full min-h-screen max-h-screen flex-col overflow-y-auto bg-white dark:bg-slate-800 p-6 text-slate-800 dark:text-slate-100 shadow-2xl shadow-black/40 md:my-4 md:max-w-4xl md:min-h-0 md:max-h-[90vh] md:rounded-xl md:overflow-y-auto">
        <button type="button" data-close class="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-amber-700/30 dark:border-amber-500/30 text-amber-800 dark:text-amber-400 transition hover:bg-amber-700 hover:text-white dark:hover:bg-amber-700/20 dark:hover:text-amber-300" aria-label="Zavřít co je nového">
            <i class="fa fa-times"></i>
        </button>
        <div class="flex flex-wrap justify-start items-center gap-4">
            <img src="../logo/logo.svg" alt="Rezaty rakety logo" class="h-8 w-auto" />
            <h1 class="text-2xl font-semibold uppercase tracking-[0.2em] text-amber-800 dark:text-amber-400">Co je nového</h1>
        </div>
        <div data-list class="mt-6 space-y-3"></div>
        <p data-empty class="mt-6 text-center text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 hidden">Žádné soubory.</p>
    </article>
</div>
`;

const ITEM_TEMPLATE = `
<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 p-4 transition hover:bg-slate-100 dark:hover:bg-slate-700">
    <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 flex-wrap">
            <span data-song-title class="font-semibold text-slate-900 dark:text-slate-100 text-sm md:text-base"></span>
            <span data-file-name class="text-[0.65rem] font-mono bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 px-2 py-1 rounded"></span>
        </div>
        <p data-date class="text-xs text-slate-500 dark:text-slate-400 mt-1"></p>
    </div>
    <div class="flex items-center gap-2 flex-shrink-0">
        <button type="button" data-play-button class="hidden items-center gap-1 rounded-full bg-brand/10 text-brand dark:bg-brand/20 dark:text-amber-400 px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition hover:bg-brand hover:text-white dark:hover:bg-brand dark:hover:text-white">
            <i class="fa fa-play text-xs"></i>
            <span>Přehrát</span>
        </button>
        <button type="button" data-lyrics-button class="hidden rounded-full bg-amber-50 dark:bg-slate-600 text-amber-700 dark:text-amber-400 px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition hover:bg-amber-100 dark:hover:bg-slate-500">
        </button>
    </div>
</div>
`;

class RecentFilesViewer extends HTMLElement {
    constructor() {
        super();
        this._initialized = false;
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
        this.emptyEl = this.querySelector('[data-empty]');

        this.overlay.addEventListener('click', (event) => {
            if (event.target === this.overlay) {
                this.close();
            }
        });
        this.closeButton.addEventListener('click', () => this.close());
    }

    open(songs = []) {
        this.songs = songs;
        this.renderRecentFiles();
        this.classList.remove('hidden');
        this.removeAttribute('hidden');
        this.setAttribute('aria-hidden', 'false');
        document.body.dataset.recentScrollLock = document.body.style.overflow || '';
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.classList.add('hidden');
        this.setAttribute('aria-hidden', 'true');
        this.listEl.innerHTML = '';
        if ('recentScrollLock' in document.body.dataset) {
            document.body.style.overflow = document.body.dataset.recentScrollLock;
            delete document.body.dataset.recentScrollLock;
        } else {
            document.body.style.overflow = '';
        }
    }

    renderRecentFiles() {
        this.listEl.innerHTML = '';

        // Build flat list of all files with song info
        const allFiles = [];
        (this.songs || []).forEach(song => {
            (song.files || []).forEach(file => {
                allFiles.push({
                    file,
                    song,
                    modifiedAtTimestamp: file.modifiedAtTimestamp || 0,
                });
            });
        });

        // Sort by modification time (newest first) and take last 20
        allFiles.sort((a, b) => b.modifiedAtTimestamp - a.modifiedAtTimestamp);
        const recentFiles = allFiles.slice(0, 20);

        if (recentFiles.length === 0) {
            this.emptyEl.classList.remove('hidden');
            return;
        }

        this.emptyEl.classList.add('hidden');

        // Group files by date
        const filesByDate = this.groupFilesByDate(recentFiles);

        // Render grouped files
        filesByDate.forEach(group => {
            // Add date header
            const header = document.createElement('div');
            header.className = 'sticky top-0 mt-4 mb-2 bg-white dark:bg-slate-800 pt-2 pb-1 text-xs font-bold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400 border-b border-amber-700/20 dark:border-amber-500/20';
            if (filesByDate.indexOf(group) === 0) {
                header.className = 'mt-0 mb-2 bg-white dark:bg-slate-800 pt-2 pb-1 text-xs font-bold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400 border-b border-amber-700/20 dark:border-amber-500/20';
            }
            header.textContent = group.dateLabel;
            this.listEl.appendChild(header);

            // Add files for this date
            group.items.forEach(item => {
                const li = this.createFileItem(item);
                this.listEl.appendChild(li);
            });
        });
    }

    groupFilesByDate(items) {
        const grouped = {};
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        items.forEach(item => {
            const date = new Date(item.file.modifiedAt);
            date.setHours(0, 0, 0, 0);
            const key = date.toISOString().split('T')[0];

            if (!grouped[key]) {
                grouped[key] = {
                    dateKey: key,
                    date: new Date(key),
                    dateLabel: this.getDateLabel(date, today),
                    items: [],
                };
            }
            grouped[key].items.push(item);
        });

        // Sort groups by date (newest first)
        return Object.values(grouped).sort((a, b) => b.date - a.date);
    }

    getDateLabel(date, today) {
        const diffTime = today - date;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return 'Dnes';
        }
        if (diffDays === 1) {
            return 'Včera';
        }
        if (diffDays < 7) {
            return `Před ${diffDays} dny`;
        }

        return date.toLocaleString('cs-CZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    createFileItem(item) {
        const { file, song } = item;
        const template = document.createElement('template');
        template.innerHTML = ITEM_TEMPLATE.trim();
        const li = template.content.firstElementChild;

        // Fill data
        li.querySelector('[data-song-title]').textContent = song.title || song.id;
        li.querySelector('[data-file-name]').textContent = `${file.filename}.${file.extension}`;

        const date = new Date(file.modifiedAt);
        const friendlyDate = date.toLocaleString('cs-CZ', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
        li.querySelector('[data-date]').textContent = friendlyDate;

        // Handle buttons
        const playButton = li.querySelector('[data-play-button]');
        const lyricsButton = li.querySelector('[data-lyrics-button]');

        if (file.type === 'audio') {
            playButton.classList.remove('hidden');
            playButton.classList.add('flex');
            playButton.addEventListener('click', () => {
                this.dispatchPlayAudio(song, file);
            });
        }

        if (file.type === 'lyrics') {
            lyricsButton.classList.remove('hidden');
            lyricsButton.textContent = '';
            const icon = document.createElement('i');
            icon.className = 'fa fa-file-text-o';
            const span = document.createElement('span');
            span.textContent = 'Otevřít';
            lyricsButton.appendChild(icon);
            lyricsButton.appendChild(span);
            lyricsButton.addEventListener('click', () => {
                this.dispatchOpenLyrics(song, file);
            });
        }

        if (file.type === 'sheet') {
            lyricsButton.classList.remove('hidden');
            lyricsButton.textContent = '';
            const icon = document.createElement('i');
            icon.className = 'fa fa-file-pdf-o';
            const span = document.createElement('span');
            span.textContent = 'Otevřít';
            lyricsButton.appendChild(icon);
            lyricsButton.appendChild(span);
            lyricsButton.addEventListener('click', () => {
                window.open(file.url, '_blank', 'noopener,noreferrer');
            });
        }

        return li;
    }

    dispatchOpenLyrics(song, file) {
        const event = new CustomEvent('lyrics-requested', {
            detail: { song, file }
        });
        document.dispatchEvent(event);
    }

    dispatchPlayAudio(song, file) {
        // Create a temporary song-like object for audio playback
        const audioSong = {
            ...song,
            audioFile: file,
        };

        const event = new CustomEvent('audio-play-requested', {
            detail: { song: audioSong, file }
        });
        document.dispatchEvent(event);
    }

    handleKeyDown(event) {
        if (event.key === 'Escape' && !this.classList.contains('hidden')) {
            event.preventDefault();
            this.close();
        }
    }
}

customElements.define('recent-files-viewer', RecentFilesViewer);
