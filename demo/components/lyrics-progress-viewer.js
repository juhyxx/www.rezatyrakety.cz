import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';

const TEMPLATE = `
<div data-overlay class="flex min-h-screen w-full items-stretch justify-center bg-black/80 dark:bg-black px-0 py-0 md:px-6 md:py-10 overflow-y-auto">
    <article class=\"relative flex w-full min-h-screen max-h-screen flex-col overflow-y-auto bg-white dark:bg-slate-800 p-1 text-slate-800 dark:text-slate-100 shadow-2xl shadow-black/40 md:my-4 md:max-w-4xl md:min-h-0 md:max-h-[90vh] md:rounded-xl\">
        <button type="button" data-close class="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-amber-700/30 dark:border-amber-500/30 text-amber-800 dark:text-amber-400 transition hover:bg-amber-700 hover:text-white dark:hover:bg-amber-700/20 dark:hover:text-amber-300" aria-label="Zavřít texty">
            <i class="fa fa-times"></i>
        </button>
        <p class="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700 dark:text-amber-400 mb-2">Rozpracované texty</p>
        <h2 class="text-2xl font-semibold uppercase tracking-[0.2em] mb-6 text-amber-800 dark:text-amber-400 hidden">Rozpracované texty</h2>
        <ul data-list class="flex-1 overflow-y-auto pr-2"></ul>
        <p data-empty class="text-center py-8 text-slate-500 dark:text-slate-400">Žádné rozpracované texty.</p>
    </article>
</div>
`;


class LyricsProgressViewer extends HTMLElement {
    constructor() {
        super();
        this._initialized = false;
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    connectedCallback() {
        if (this._initialized) return;
        this._initialized = true;
        this.renderBase();
        document.addEventListener('keydown', this.handleKeyDown);
    }

    disconnectedCallback() {
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    renderBase() {
        this.classList.add('fixed', 'inset-0', 'z-50', 'hidden');
        this.setAttribute('aria-hidden', 'true');
        this.innerHTML = TEMPLATE;
        this.ensureLegacyStyles();
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

    ensureLegacyStyles() {
        const LEGACY_STYLE_ID = 'lyrics-shared-styles';
        if (document.getElementById(LEGACY_STYLE_ID)) {
            return;
        }
        // Load shared styles from CSS file
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = './styles/lyrics-shared.css';
        link.id = LEGACY_STYLE_ID;
        document.head.appendChild(link);
    }

    open(songs = []) {
        this.renderListAsync(songs);
        this.classList.remove('hidden');
        this.removeAttribute('hidden');
        this.setAttribute('aria-hidden', 'false');
        document.body.dataset.lyricsProgressScrollLock = document.body.style.overflow || '';
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.classList.add('hidden');
        this.setAttribute('aria-hidden', 'true');
        this.listEl.innerHTML = '';
        if ('lyricsProgressScrollLock' in document.body.dataset) {
            document.body.style.overflow = document.body.dataset.lyricsProgressScrollLock;
            delete document.body.dataset.lyricsProgressScrollLock;
        } else {
            document.body.style.overflow = '';
        }
    }

    async renderListAsync(songs) {
        this.listEl.innerHTML = '';
        if (!songs.length) {
            this.emptyEl.classList.remove('hidden');
            return;
        }
        this.emptyEl.classList.add('hidden');
        for (const song of songs) {
            const li = document.createElement('li');
            li.className = 'lyrics-progress-item';

            // If song is a string, just display it
            if (typeof song === 'string') {
                li.textContent = song;
                this.listEl.appendChild(li);
                continue;
            }

            // Title with play button
            const titleEl = document.createElement('div');
            titleEl.className = 'lyrics-progress-item-title';

            // Add play button if song has audio files
            const audioFile = (song.files || []).find((entry) => entry.type === 'audio' && entry.filename === 'demo')
                || (song.files || []).find((entry) => entry.type === 'audio');

            if (audioFile) {
                const playBtn = document.createElement('button');
                playBtn.type = 'button';
                playBtn.className = 'lyrics-progress-item-play-btn';
                playBtn.innerHTML = '<i class="fa fa-play"></i>';
                playBtn.setAttribute('aria-label', `Přehrát audio pro ${song.title || song.id}`);

                const audio = new Audio(audioFile.url);
                playBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (audio.paused) {
                        audio.play();
                        playBtn.innerHTML = '<i class="fa fa-pause"></i>';
                    } else {
                        audio.pause();
                        playBtn.innerHTML = '<i class="fa fa-play"></i>';
                    }
                });

                audio.addEventListener('ended', () => {
                    playBtn.innerHTML = '<i class="fa fa-play"></i>';
                });

                titleEl.appendChild(playBtn);
            }

            const titleText = document.createElement('span');
            titleText.textContent = song.title || song.id;
            titleEl.appendChild(titleText);

            li.appendChild(titleEl);

            // Lyrics (if available)
            if (song.lyrics) {
                // Use <div> for HTML lyrics rendering
                const lyricsEl = document.createElement('div');
                lyricsEl.className = 'text-sm lyrics-content pb-12 mt-3';
                // Helper to render markdown using imported marked
                const renderMarkdown = (markdownText) => {
                    if (typeof marked === 'function') {
                        lyricsEl.innerHTML = marked.parse(markdownText);
                    } else {
                        lyricsEl.textContent = markdownText;
                    }
                };
                // If lyrics is an object with a url, fetch the lyrics
                if (typeof song.lyrics === 'object' && song.lyrics.url) {
                    lyricsEl.textContent = 'Načítám text...';
                    try {
                        const response = await fetch(song.lyrics.url);
                        if (response.ok) {
                            const text = await response.text();
                            renderMarkdown(text);
                        } else {
                            lyricsEl.textContent = 'Nepodařilo se načíst text.';
                        }
                    } catch {
                        lyricsEl.textContent = 'Nepodařilo se načíst text.';
                    }
                } else if (typeof song.lyrics === 'object') {
                    const text = Array.isArray(song.lyrics) ? song.lyrics.join('\n') : JSON.stringify(song.lyrics);
                    renderMarkdown(text);
                } else {
                    renderMarkdown(song.lyrics);
                }
                li.appendChild(lyricsEl);
            }
            this.listEl.appendChild(li);
        }
    }

    handleKeyDown(event) {
        if (event.key === 'Escape' && !this.classList.contains('hidden')) {
            this.close();
        }
    }
}

customElements.define('lyrics-progress-viewer', LyricsProgressViewer);
