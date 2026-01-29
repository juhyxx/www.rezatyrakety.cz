import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';
const TEMPLATE = `
<div data-overlay class="flex min-h-screen w-full items-stretch justify-center bg-black/80 px-0 py-0 md:px-6 md:py-10 overflow-y-auto">
    <article class="relative flex  w-full min-h-screen max-h-screen flex-col overflow-y-auto bg-white p-6  md:my-4 md:max-w-4xl md:min-h-0 md:max-h-[90vh] md:rounded-xl md:overflow-y-auto">
        <button type="button" data-close class="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border  transition  hover:text-white" aria-label="Zavřít texty">
            <i class="fa fa-times"></i>
        </button>
        <h2 class="text-2xl font-semibold uppercase tracking-[0.2em] mb-4">Rozpracované texty</h2>
        <ul data-list ></ul>
        <p data-empty>Žádné rozpracované texty.</p>
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

            // If song is a string, just display it
            if (typeof song === 'string') {
                li.textContent = song;
                this.listEl.appendChild(li);
                continue;
            }

            // Title
            const titleEl = document.createElement('div');

            li.appendChild(titleEl);
            // Lyrics (if available)
            if (song.lyrics) {
                // Use <div> for HTML lyrics rendering
                const lyricsEl = document.createElement('div');
                lyricsEl.className = ' text-sm  lyrics-content pb-12';
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
