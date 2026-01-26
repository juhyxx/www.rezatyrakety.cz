import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';

const LEGACY_STYLE_ID = 'lyrics-viewer-legacy-styles';
const LEGACY_STYLES = `

.lyrics-content h1,
.lyrics-content h2,
.lyrics-content h3 {
    display: none;
}

.lyrics-content p {
    border-bottom: 1px dotted rgba(0, 0, 0, 0.15);
}
.lyrics-content ul,
.lyrics-content ol {
    margin: 0.35rem 0 0.35rem 1.5rem;
    padding-left: 0.5rem;
}
.lyrics-content li::marker {
    color: #9b1915;
    font-weight: 600;
}
.lyrics-content em {
    color: #777;
}
.lyrics-content blockquote {
    border-left: 3px solid #9b1915;
    padding-left: 1rem;
    color: #555;
    margin: 0.75rem 0;
}
@media (prefers-color-scheme: dark) {
    [data-overlay] {
        background: #000 !important;
    }
    .lyrics-content,
    article {
        color: #e0e0e0;
        background: #000 !important;
    }
    .lyrics-content strong,
    .lyrics-content li::marker {
        color: #ff6f61;
    }
    .lyrics-content p {
        border-bottom-color: rgba(255, 255, 255, 0.2);
    }
    .lyrics-content h1,
    .lyrics-content h2,
    .lyrics-content h3 {
        background-color: #222;
    }
    .lyrics-content em {
        color: #bbb;
    }
    .lyrics-content blockquote {
        border-left-color: #ff6f61;
        color: #ccc;
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
    color: #9b1915;
    font-weight: 600;
}
`;

const TEMPLATE = `
<div data-overlay class="flex min-h-screen w-full items-stretch justify-center bg-black/80 dark:bg-black px-0 py-0 md:px-6 md:py-10 overflow-y-auto">
    <article class="relative flex w-full min-h-screen max-h-screen flex-col overflow-y-auto bg-white dark:bg-slate-900 p-6 text-slate-800 dark:text-slate-100 shadow-2xl shadow-black/40 md:my-4 md:max-w-4xl md:min-h-0 md:max-h-[90vh] md:rounded-xl">
        <button type="button" data-close class="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-brand/30 text-brand dark:text-slate-100 transition hover:bg-brand hover:text-white dark:hover:bg-slate-700 dark:hover:text-brand" aria-label="Zavřít text">
            <i class="fa fa-times"></i>
        </button>
        <p data-meta class="text-xs font-semibold uppercase tracking-[0.3em] text-brand/60 dark:text-slate-300">Text skladby</p>
        <div class="flex items-center justify-between gap-4">
            <h1 data-title class="mt-1 text-2xl font-semibold uppercase tracking-[0.2em] text-brand dark:text-slate-100"></h1>
            <div data-audio-wrapper class="hidden items-center gap-3 rounded-xl  bg-brand/5 px-4 py-3">
                <button type="button" data-audio-toggle class="inline-flex items-center gap-2 rounded bg-brand dark:bg-slate-700 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em]  shadow text-brand dark:text-brand">
                    <i class="fa fa-play"></i>
                      Demo
                </button>
                <audio data-audio-player class="hidden">
                    <source type="audio/mpeg" />
                  
                </audio>
            </div>
        </div>
        <p data-subtitle class="text-[0.65rem] uppercase tracking-[0.4em] text-slate-400 dark:text-slate-300"></p>
        <div data-status class="mt-6 text-center text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-300"></div>
        <div data-body class="lyrics-body lyrics-content  flex-1 min-h-0 overflow-y-auto pr-1 text-base leading-relaxed text-slate-800 dark:text-slate-100"></div>
    </article>
</div>
`;

class LyricsViewer extends HTMLElement {
    constructor() {
        super();
        this._initialized = false;
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleAudioPlay = this.handleAudioPlay.bind(this);
        this.handleAudioPause = this.handleAudioPause.bind(this);
        this.handleAudioEnded = this.handleAudioEnded.bind(this);
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
        this.classList.add('fixed', 'inset-0', 'z-50', 'hidden');
        this.setAttribute('aria-hidden', 'true');
        this.innerHTML = TEMPLATE;
        this.ensureLegacyStyles();
        this.overlay = this.querySelector('[data-overlay]');
        this.titleEl = this.querySelector('[data-title]');
        this.metaEl = this.querySelector('[data-meta]');
        this.subtitleEl = this.querySelector('[data-subtitle]');
        this.bodyEl = this.querySelector('[data-body]');
        this.statusEl = this.querySelector('[data-status]');
        this.audioWrapper = this.querySelector('[data-audio-wrapper]');
        this.audioToggle = this.querySelector('[data-audio-toggle]');
        this.audioEl = this.querySelector('[data-audio-player]');
        this.closeButton = this.querySelector('[data-close]');

        this.overlay.addEventListener('click', (event) => {
            if (event.target === this.overlay) {
                this.close();
            }
        });
        this.closeButton.addEventListener('click', () => this.close());
        this.audioToggle.addEventListener('click', () => this.toggleAudio());
        this.audioEl.addEventListener('play', this.handleAudioPlay);
        this.audioEl.addEventListener('pause', this.handleAudioPause);
        this.audioEl.addEventListener('ended', this.handleAudioEnded);
    }

    ensureLegacyStyles() {
        if (document.getElementById(LEGACY_STYLE_ID)) {
            return;
        }
        const style = document.createElement('style');
        style.id = LEGACY_STYLE_ID;
        style.textContent = LEGACY_STYLES;
        document.head.appendChild(style);
    }

    open(song, file) {
        if (!song || !file) {
            return;
        }
        this.song = song;
        this.file = file;
        this.titleEl.textContent = song.title ?? song.id;
        this.subtitleEl.textContent = song.meta?.manifest?.author || '';
        this.metaEl.textContent = '';
        this.bodyEl.innerHTML = '';
        this.setStatus('Načítám text...');
        this.setupAudio();
        this.classList.remove('hidden');
        this.removeAttribute('hidden');
        this.setAttribute('aria-hidden', 'false');
        if (document.body.dataset.scrollLock === undefined) {
            document.body.dataset.scrollLock = document.body.style.overflow || '';
        }
        document.body.style.overflow = 'hidden';
        this.loadToken = (this.loadToken || 0) + 1;
        this.loadLyrics(this.loadToken);
    }

    close() {
        this.classList.add('hidden');
        this.setAttribute('aria-hidden', 'true');
        this.bodyEl.innerHTML = '';
        this.setStatus('');
        this.stopAudio();
        if (document.body.dataset.scrollLock !== undefined) {
            document.body.style.overflow = document.body.dataset.scrollLock;
            delete document.body.dataset.scrollLock;
        } else {
            document.body.style.overflow = '';
        }
    }

    async loadLyrics(token) {
        try {
            const response = await fetch(this.file.url, { cache: 'no-store' });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const raw = await response.text();
            const ext = (this.file.extension || this.file.format || '').toLowerCase();
            const html = ext === 'md' || ext === 'markdown' ? marked.parse(raw) : raw;
            if (token === this.loadToken) {
                this.bodyEl.innerHTML = html;
                this.setStatus('');
            }
        } catch (error) {
            console.error('Nepodařilo se načíst text skladby:', error);
            if (token === this.loadToken) {
                this.setStatus('Text není dostupný.');
            }
        }
    }

    setStatus(message) {
        this.statusEl.textContent = message;
    }

    setupAudio() {
        const audioFile = (this.song.files || []).find((entry) => entry.type === 'audio' && entry.filename === 'demo')
            || (this.song.files || []).find((entry) => entry.type === 'audio');
        if (!audioFile) {
            this.audioWrapper.classList.add('hidden');
            this.audioEl.removeAttribute('src');
            return;
        }
        this.audioWrapper.classList.remove('hidden');
        const source = this.audioEl.querySelector('source');
        source.src = audioFile.url;
        this.audioEl.load();
        this.audioPlaying = false;
        this.updateAudioButton();
    }

    toggleAudio() {
        if (this.audioWrapper.classList.contains('hidden')) {
            return;
        }
        if (!this.audioPlaying) {
            this.audioEl.play();
        } else {
            this.stopAudio();
        }
    }

    stopAudio() {
        if (!this.audioEl.paused) {
            this.audioEl.pause();
            this.audioEl.currentTime = 0;
        }
        this.audioPlaying = false;
        this.updateAudioButton();
    }

    updateAudioButton() {
        const icon = this.audioToggle.querySelector('.fa');
        if (!icon) {
            return;
        }
        if (this.audioPlaying) {
            icon.className = 'fa fa-stop';
            this.audioToggle.setAttribute('aria-pressed', 'true');
        } else {
            icon.className = 'fa fa-play';
            this.audioToggle.setAttribute('aria-pressed', 'false');
        }
    }

    handleAudioPlay() {
        this.audioPlaying = true;
        this.updateAudioButton();
    }

    handleAudioPause() {
        this.audioPlaying = false;
        this.updateAudioButton();
    }

    handleAudioEnded() {
        this.audioPlaying = false;
        this.audioEl.currentTime = 0;
        this.updateAudioButton();
    }

    handleKeyDown(event) {
        if (event.key === 'Escape' && !this.classList.contains('hidden')) {
            this.close();
        }
    }
}

customElements.define('lyrics-viewer', LyricsViewer);
