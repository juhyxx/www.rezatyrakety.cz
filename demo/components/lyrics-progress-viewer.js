import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';
const TEMPLATE = `
<div data-overlay class="flex min-h-screen w-full items-stretch justify-center bg-black/80 px-0 py-0 md:px-6 md:py-10 overflow-y-auto">
    <article class="relative flex w-full min-h-screen max-h-screen flex-col overflow-y-auto bg-white p-6 text-slate-800 shadow-2xl shadow-black/40 md:my-4 md:max-w-4xl md:min-h-0 md:max-h-[90vh] md:rounded-xl md:overflow-y-auto">
        <button type="button" data-close class="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border  transition  hover:text-white" aria-label="Zavřít texty">
            <i class="fa fa-times"></i>
        </button>
        <h2 class="text-2xl font-semibold uppercase tracking-[0.2em] mb-4">Rozpracované texty</h2>
        <ul data-list class="mt-2 space-y-2"></ul>
        <p data-empty>Žádné rozpracované texty.</p>
    </article>
</div>
`;

const LEGACY_STYLES = `
.lyrics-content {
    font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
    font-size: 1.05rem;
    line-height: 1.7;
    color: #7c4700;
    background: #fffbe6;
    border-radius: 0.5rem;
    padding: 1.2rem 1.5rem;
    margin: 0.5rem 0;
    box-shadow: 0 2px 8px 0 rgba(124,71,0,0.04);
}
.lyrics-content p {
    margin: 0.5em 0;
    border-bottom: 1px dotted #ffe0a3;
    padding-bottom: 0.2em;
}
.lyrics-content ul,
.lyrics-content ol {
    margin: 0.5em 0 0.5em 1.5em;
    padding-left: 0.5em;
}
.lyrics-content li::marker {
    color: #eab308;
    font-weight: 600;
}
.lyrics-content em {
    color: #bfa76a;
}
.lyrics-content blockquote {
    border-left: 3px solid #eab308;
    padding-left: 1rem;
    color: #bfa76a;
    margin: 0.75rem 0;
    background: #fff8d6;
    border-radius: 0.25rem;
}
.lyrics-content strong {
    color: #b45309;
}
@media (prefers-color-scheme: dark) {
    .lyrics-content {
        color: #ffe0a3;
        background: #1a1400;
        box-shadow: 0 2px 8px 0 rgba(234,179,8,0.08);
    }
    .lyrics-content strong,
    .lyrics-content li::marker {
        color: #ffe066;
    }
    .lyrics-content p {
        border-bottom-color: #bfa76a;
    }
    .lyrics-content em {
        color: #ffe0a3;
    }
    .lyrics-content blockquote {
        border-left-color: #ffe066;
        color: #ffe0a3;
        background: #2a2100;
    }
}
/* Numbered verses for lyrics lists */
.lyrics-content ol {
    counter-reset: verse;
    list-style: none;
    padding-left: 1.5em;
}
.lyrics-content ol > li {
    counter-increment: verse;
    position: relative;
    margin-bottom: 0.5em;
}
.lyrics-content ol > li::before {
    content: counter(verse) ". ";
    position: absolute;
    left: -1.5em;
    color: #eab308;
    font-weight: 600;
}
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
            li.className = 'text-base rounded px-3 py-2';
            // If song is a string, just display it
            if (typeof song === 'string') {
                li.textContent = song;
                this.listEl.appendChild(li);
                continue;
            }

            // Title
            const titleEl = document.createElement('div');
            titleEl.className = 'font-semibold text-2xl';
            titleEl.textContent = song.title || song.id || '';
            li.appendChild(titleEl);
            // Lyrics (if available)
            if (song.lyrics) {
                // Use <div> for HTML lyrics rendering
                const lyricsEl = document.createElement('div');
                lyricsEl.className = ' whitespace-pre-wrap text-sm border-b-4 border-slate-300  lyrics-content';
                lyricsEl.textContent = LEGACY_STYLES;
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
