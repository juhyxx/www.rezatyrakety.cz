const DEFAULT_API = './api.php';

class SongBook extends HTMLElement {
    constructor() {
        super();
        this._initialized = false;
        this.source = this.dataset.source || DEFAULT_API;
    }

    connectedCallback() {
        if (this._initialized) {
            return;
        }
        this._initialized = true;
        this.source = this.dataset.source || DEFAULT_API;
        this.setState('Načítám skladby...');
        this.loadSongs();
        this.addEventListener('song-card-expand', (event) => {
            const cards = Array.from(this.querySelectorAll('song-card'));
            cards.forEach(card => {
                if (card !== event.target && card.expanded && typeof card.toggle === 'function') {
                    card.expanded = false;
                    card.updateCollapsedState();
                }
            });
        });
    }

    async loadSongs() {
        try {
            const response = await fetch(this.source, { cache: 'no-store' });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const payload = await response.json();
            const songs = Array.isArray(payload.songs) ? payload.songs : [];
            if (!songs.length) {
                this.setState('Nenalezeny žádné složky se skladbami.');
                return;
            }
            this.renderSongs(songs);
        } catch (error) {
            console.error('Chyba při načítání skladeb:', error);
            this.setState('Nepodařilo se načíst seznam skladeb. Zkuste obnovit stránku.');
        }
    }

    setState(message) {
        this.innerHTML = '';
        const paragraph = document.createElement('p');
        paragraph.className = 'text-center text-white/80 text-xs tracking-[0.3em] uppercase py-12';
        paragraph.textContent = message;
        this.appendChild(paragraph);
    }

    renderSongs(songs) {
        this.innerHTML = '';
        const fragment = document.createDocumentFragment();
        let archiveSpacerInserted = false;
        songs.forEach((song) => {
            const card = document.createElement('song-card');
            card.data = song;
            if (song.status?.archive && !archiveSpacerInserted) {
                archiveSpacerInserted = true;
                const spacer = document.createElement('div');
                spacer.className = 'w-full h-16 md:h-10';
                spacer.setAttribute('aria-hidden', 'true');
                fragment.appendChild(spacer);

                // Add archive title
                const archiveTitle = document.createElement('div');
                archiveTitle.className = 'w-full text-center text-xs uppercase tracking-[0.3em] text-slate-400 mb-2';
                archiveTitle.textContent = 'Archiv';
                fragment.appendChild(archiveTitle);
            }
            fragment.appendChild(card);
        });
        this.appendChild(fragment);
        this.dispatchEvent(new CustomEvent('songs-loaded', {
            detail: { songs },
            bubbles: true,
            composed: true,
        }));
        this.applySelectionFromQuery();
    }

    applySelectionFromQuery() {
        const params = new URLSearchParams(window.location.search);
        const selection = params.get('select');
        if (!selection) {
            return;
        }
        const indexes = selection.split(',').map((value) => parseInt(value, 10) - 1);
        const cards = Array.from(this.querySelectorAll('song-card'));
        indexes.forEach((index) => {
            if (Number.isNaN(index) || index < 0) {
                return;
            }
            const card = cards[index];
            if (card && typeof card.expand === 'function') {
                card.expand();
            }
        });
    }
}

customElements.define('song-book', SongBook);
