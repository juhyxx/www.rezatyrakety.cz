import { createFileList } from './helpers.js';

const CARD_TEMPLATE = document.getElementById('song-card-template');

const STATUS_STYLES = {
    new: { label: 'NOVINKA', classes: 'bg-emerald-600 text-white' },
    progress: { label: 'ROZPRACOVÁNO', classes: 'bg-amber-400 text-slate-900' },
    ready: { label: 'PŘIPRAVENO', classes: 'bg-sky-500/30 text-white' },
    archive: { label: 'ARCHIV', classes: 'bg-slate-700 text-white' },
};

class SongCard extends HTMLElement {
    constructor() {
        super();
        this.expanded = false;
        this.audio = null;
        this.audioFile = null;
        this.handleExternalPlay = this.handleExternalPlay.bind(this);
        this.handleAudioPlay = this.handleAudioPlay.bind(this);
        this.handleAudioPause = this.handleAudioPause.bind(this);
        this.handleAudioEnded = this.handleAudioEnded.bind(this);
        this._listenersAttached = false;
    }

    connectedCallback() {
        if (!this._listenersAttached) {
            window.addEventListener('song-card-play', this.handleExternalPlay);
            this._listenersAttached = true;
        }
    }

    disconnectedCallback() {
        if (this._listenersAttached) {
            window.removeEventListener('song-card-play', this.handleExternalPlay);
            this._listenersAttached = false;
        }
        this.destroyAudio();
    }

    set data(value) {
        this._data = value;
        this.render();
    }

    render() {
        if (!this._data || !CARD_TEMPLATE) {
            return;
        }

        this.destroyAudio();
        this.innerHTML = '';
        this.expanded = false;
        const clone = CARD_TEMPLATE.content.cloneNode(true);
        const article = clone.querySelector('.song-card');
        const title = clone.querySelector('.title');
        const durationEl = clone.querySelector('.duration');
        const fileList = clone.querySelector('[data-files]');
        const badgeRow = clone.querySelector('.badge-row');
        const toggleButton = clone.querySelector('[data-toggle]');
        const toggleIcon = toggleButton?.querySelector('.fa');
        const audioButton = clone.querySelector('[data-audio-toggle]');
        const audioIcon = audioButton?.querySelector('.fa');

        if (!article || !title || !fileList || !badgeRow || !toggleButton || !audioButton) {
            return;
        }

        this.dataset.songId = this._data.id;
        title.textContent = this._data.title ?? this._data.id;
        durationEl.textContent = this._data.duration ?? '';
        const listId = this.buildFileListId();
        fileList.id = listId;
        // aria-controls removed

        fileList.innerHTML = '';
        fileList.appendChild(createFileList(this._data, this._data.files));
        this.renderBadges(badgeRow);
        fileList.addEventListener('click', (event) => {
            const link = event.target.closest('a[data-file-index]');
            if (!link) {
                return;
            }
            const index = Number(link.dataset.fileIndex);
            const file = this._data.files?.[index];
            if (link.dataset.lyrics === 'true' && file) {
                event.preventDefault();
                this.dispatchEvent(new CustomEvent('lyrics-requested', {
                    detail: {
                        song: this._data,
                        file,
                    },
                    bubbles: true,
                }));
            }
        });

        article.addEventListener('click', (event) => {
            if (event.target.closest('a') || event.target.closest('[data-toggle]')) {
                return;
            }
            this.toggle();
        });
        toggleButton.addEventListener('click', (event) => {
            event.stopPropagation();
            this.toggle();
        });

        this.audioButton = audioButton;
        this.audioIcon = audioIcon;
        this.audioFile = this.findPrimaryAudioFile();
        if (this.audioFile) {
            this.ensureAudio();
            audioButton.addEventListener('click', (event) => {
                event.stopPropagation();
                this.toggleAudio();
            });
            audioButton.disabled = false;
            audioButton.classList.remove('opacity-40', 'cursor-not-allowed');
        } else {
            audioButton.disabled = true;
            audioButton.classList.add('opacity-40', 'cursor-not-allowed');
        }

        this.article = article;
        this.fileList = fileList;
        this.toggleButton = toggleButton;
        this.toggleIcon = toggleIcon;
        // Apply appropriate background color for dark/light mode
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            article.style.backgroundColor = '#1e293b'; // Tailwind slate-800
        } else {
            article.style.backgroundColor = '';
        }
        this.updateCollapsedState(true);
        this.appendChild(clone);
    }

    renderBadges(container) {
        container.innerHTML = '';
        const statuses = this._data?.status || {};
        Object.entries(STATUS_STYLES).forEach(([key, meta]) => {
            if (!statuses[key]) {
                return;
            }
            const badge = document.createElement('span');
            badge.className = `px-2 py-0.5 rounded text-[0.55rem] tracking-[0.2em] ${meta.classes}`;
            badge.textContent = meta.label;
            container.appendChild(badge);
        });
        // Add lyrics state badge if present
        const lyricsState = this._data?.lyricsState || this._data?.lyrics;
        if (lyricsState === 'progress' || lyricsState === 'ready') {
            const badge = document.createElement('span');
            badge.className =
                'ml-2 px-2 py-0.5 rounded text-[0.55rem] tracking-[0.2em]  font-semibold ' +
                (lyricsState === 'progress'
                    ? 'border-yellow-400 text-yellow-700'
                    : 'border-green-500 text-green-700');
            badge.textContent = lyricsState === 'progress' ? 'TEXT: ROZPRACOVÁNO' : 'TEXT: NAUČENO';
            container.appendChild(badge);
        }
    }

    toggle() {
        if (!this.expanded) {
            this.dispatchEvent(new CustomEvent('song-card-expand', { bubbles: true, composed: true }));
        }
        this.expanded = !this.expanded;
        this.updateCollapsedState();
    }

    expand() {
        if (!this.expanded) {
            this.dispatchEvent(new CustomEvent('song-card-expand', { bubbles: true, composed: true }));
        }
        this.expanded = true;
        this.updateCollapsedState();
    }

    updateCollapsedState(initial = false) {
        if (!this.article || !this.fileList) {
            return;
        }
        const isCollapsed = !this.expanded;
        this.article.dataset.collapsed = String(isCollapsed);
        // aria-hidden removed

        if (isCollapsed) {
            this.fileList.style.maxHeight = '0px';
            this.fileList.classList.add('opacity-0', 'pointer-events-none');
        } else {
            const contentHeight = this.fileList.scrollHeight;
            this.fileList.style.maxHeight = `${contentHeight}px`;
            this.fileList.classList.remove('opacity-0', 'pointer-events-none');
        }

        if (initial) {
            const prevTransition = this.fileList.style.transition;
            this.fileList.style.transition = 'none';
            requestAnimationFrame(() => {
                this.fileList.style.transition = prevTransition;
            });
        }
        if (this.toggleButton) {
            // aria-expanded removed
            this.toggleButton.setAttribute('title', this.expanded ? 'Skrýt soubory' : 'Zobrazit soubory');
        }
        if (this.toggleIcon) {
            this.toggleIcon.className = this.expanded ? 'fa fa-minus' : 'fa fa-plus';
        }
        this.article.classList.toggle('ring-2', this.expanded);
        this.article.classList.toggle('ring-brand/40', this.expanded);
        this.article.classList.toggle('shadow-xl', this.expanded);
        const isArchive = Boolean(this._data?.status?.archive);
        this.article.classList.toggle('opacity-60', isArchive);
        this.article.classList.toggle('backdrop-blur', isArchive);
    }

    buildFileListId() {
        const base = (this._data?.id || 'song').toString().toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const unique = Math.random().toString(36).slice(2, 7);
        return `files-${base}-${unique}`;
    }

    findPrimaryAudioFile() {
        const files = this._data?.files || [];
        return files.find((file) => file.type === 'audio' && file.filename === 'demo')
            || files.find((file) => file.type === 'audio');
    }

    ensureAudio() {
        if (this.audio && this.audio.src === this.audioFile.url) {
            return;
        }
        this.destroyAudio();
        this.audio = new Audio(this.audioFile.url);
        this.audio.preload = 'none';
        this.audio.addEventListener('play', this.handleAudioPlay);
        this.audio.addEventListener('pause', this.handleAudioPause);
        this.audio.addEventListener('ended', this.handleAudioEnded);
    }

    toggleAudio() {
        if (!this.audio) {
            return;
        }
        if (this.audio.paused) {
            window.dispatchEvent(new CustomEvent('song-card-play', { detail: { id: this.dataset.songId } }));
            this.audio.play();
        } else {
            this.stopAudio();
        }
    }

    stopAudio() {
        if (this.audio && !this.audio.paused) {
            this.audio.pause();
            this.audio.currentTime = 0;
        }
    }

    destroyAudio() {
        if (!this.audio) {
            return;
        }
        this.audio.removeEventListener('play', this.handleAudioPlay);
        this.audio.removeEventListener('pause', this.handleAudioPause);
        this.audio.removeEventListener('ended', this.handleAudioEnded);
        this.audio.pause();
        this.audio = null;
        // aria-pressed removed
        if (this.audioIcon) {
            this.audioIcon.className = 'fa fa-play';
        }
    }

    handleExternalPlay(event) {
        if (!event.detail || event.detail.id === this.dataset.songId) {
            return;
        }
        this.stopAudio();
    }

    handleAudioPlay() {
        // aria-pressed removed
        if (this.audioIcon) {
            this.audioIcon.className = 'fa fa-stop';
        }
    }

    handleAudioPause() {
        // aria-pressed removed
        if (this.audioIcon) {
            this.audioIcon.className = 'fa fa-play';
        }
    }

    handleAudioEnded() {
        if (this.audio) {
            this.audio.currentTime = 0;
        }
        this.handleAudioPause();
    }
}

customElements.define('song-card', SongCard);
