/**
 * VenuesList WebComponent
 * Displays and manages a list of venues with filtering
 */
class VenuesList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.venues = [];
    }

    connectedCallback() {
        this.setupStyles();
        this.render();
        this.setupEventDelegation();
    }

    setupStyles() {
        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: block;
                height: 100%;
                overflow-y: auto;
                padding: 1rem;
            }

            .venues-container {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }

            .empty-state {
                padding: 2rem 1rem;
                text-align: center;
                color: #9ca3af;
            }

            :host-context(.dark) .empty-state {
                color: #9ca3af;
            }

            .empty-state-icon {
                font-size: 2rem;
                margin-bottom: 0.5rem;
            }

            .empty-state-text {
                font-size: 0.875rem;
            }
        `;
        this.shadowRoot.appendChild(style);
    }

    setVenues(venues) {
        this.venues = venues;
        this.render();
    }

    render() {
        const container = this.shadowRoot.querySelector('.venues-container');
        if (!container) {
            const mainContainer = document.createElement('div');
            mainContainer.className = 'venues-container';
            this.shadowRoot.appendChild(mainContainer);
        }

        const listContainer = this.shadowRoot.querySelector('.venues-container');
        listContainer.innerHTML = '';

        if (!this.venues || this.venues.length === 0) {
            listContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📍</div>
                    <div class="empty-state-text">Žádná místa k zobrazení</div>
                </div>
            `;
            return;
        }

        this.venues.forEach(venue => {
            const venueCard = document.createElement('venue-card');
            venueCard.setAttribute('data-venue', JSON.stringify(venue));
            listContainer.appendChild(venueCard);
        });
    }

    setupEventDelegation() {
        this.addEventListener('venue-selected', (event) => {
            event.stopPropagation();
            this.dispatchEvent(new CustomEvent('venue-selected', {
                detail: event.detail,
                bubbles: true,
                composed: true
            }));
        });
    }
}

customElements.define('venues-list', VenuesList);
