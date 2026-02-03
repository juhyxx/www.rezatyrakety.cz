/**
 * VenueCard WebComponent
 * Displays a single venue with interactive features
 */
class VenueCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.setupListeners();
    }

    static get observedAttributes() {
        return ['data-venue'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'data-venue' && oldValue !== newValue) {
            this.render();
        }
    }

    getVenue() {
        try {
            return JSON.parse(this.getAttribute('data-venue'));
        } catch (e) {
            return null;
        }
    }

    getStatusClass() {
        const venue = this.getVenue();
        if (!venue) return '';
        return venue.status === 'WAITING' ? 'status-badge-waiting' : 'status-badge-contact';
    }

    getStatusColor() {
        const venue = this.getVenue();
        if (!venue) return 'bg-gray-500';

        const colors = {
            'WAITING': 'bg-blue-500',
            'CONTACT': 'bg-orange-500',
            'CANCELED': 'bg-gray-400'
        };
        return colors[venue.status] || 'bg-gray-500';
    }

    escapeHtml(unsafe = '') {
        return (unsafe || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/'/g, '&#39;')
            .replace(/"/g, '&quot;');
    }

    render() {
        const venue = this.getVenue();
        if (!venue) {
            this.shadowRoot.innerHTML = '';
            return;
        }

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: block;
            }

            .venue-card {
                background: white;
                border: 1px solid #e5e7eb;
                border-radius: 0.5rem;
                padding: 1rem;
                margin-bottom: 0.75rem;
                cursor: pointer;
                transition: all 0.2s ease;
                border-left: 4px solid #d97706;
            }

            :host-context(.dark) .venue-card {
                background: #1f2937;
                border-color: #4b5563;
            }

            .venue-card:hover {
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                transform: translateY(-2px);
                border-left-color: #f59e0b;
            }

            :host-context(.dark) .venue-card:hover {
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
            }

            .venue-card-header {
                display: flex;
                justify-content: space-between;
                align-items: start;
                margin-bottom: 0.75rem;
            }

            .venue-card-title {
                font-weight: 600;
                font-size: 0.875rem;
                color: #111827;
                flex: 1;
            }

            :host-context(.dark) .venue-card-title {
                color: #f3f4f6;
            }

            .status-badge {
                display: inline-block;
                font-size: 0.625rem;
                font-weight: 700;
                padding: 0.25rem 0.5rem;
                border-radius: 0.25rem;
                margin-left: 0.5rem;
                white-space: nowrap;
            }

            .status-badge-waiting {
                background: #dbeafe;
                color: #1e40af;
            }

            :host-context(.dark) .status-badge-waiting {
                background: #1e3a8a;
                color: #93c5fd;
            }

            .status-badge-contact {
                background: #fed7aa;
                color: #92400e;
            }

            :host-context(.dark) .status-badge-contact {
                background: #7c2d12;
                color: #fed7aa;
            }

            .venue-card-meta {
                font-size: 0.75rem;
                color: #6b7280;
                line-height: 1.5;
            }

            :host-context(.dark) .venue-card-meta {
                color: #d1d5db;
            }

            .meta-item {
                margin-bottom: 0.25rem;
            }

            .meta-label {
                font-weight: 600;
                color: #374151;
            }

            :host-context(.dark) .meta-label {
                color: #e5e7eb;
            }

            a {
                color: #2563eb;
                text-decoration: none;
            }

            :host-context(.dark) a {
                color: #60a5fa;
            }

            a:hover {
                text-decoration: underline;
            }

            .concert-count {
                display: inline-block;
                background: #f3f4f6;
                padding: 0.25rem 0.5rem;
                border-radius: 0.25rem;
                margin-top: 0.5rem;
            }

            :host-context(.dark) .concert-count {
                background: #374151;
                color: #f3f4f6;
            }
        `;

        const container = document.createElement('div');
        container.className = 'venue-card';
        container.innerHTML = `
            <div class="venue-card-header">
                <div class="venue-card-title">${this.escapeHtml(venue.nazev)}</div>
                <span class="status-badge ${this.getStatusClass()}">${venue.status}</span>
            </div>
            <div class="venue-card-meta">
                <div class="meta-item"><span class="meta-label">Město:</span> ${this.escapeHtml(venue.adresaMesto)} ${venue.adresaUlice ? this.escapeHtml(venue.adresaUlice) : ''}</div>
                ${venue.WWW ? `<div class="meta-item"><span class="meta-label">Web:</span> <a href="${this.escapeHtml(venue.WWW)}" target="_blank" rel="noopener">${this.escapeHtml(venue.WWW)}</a></div>` : ''}
                <div class="concert-count">🎵 Koncertů: ${venue.count || 0}</div>
            </div>
        `;

        this.shadowRoot.innerHTML = '';
        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(container);
    }

    setupListeners() {
        const venue = this.getVenue();
        if (!venue) return;

        this.shadowRoot.querySelector('.venue-card').addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('venue-selected', {
                detail: venue,
                bubbles: true,
                composed: true
            }));
        });
    }
}

customElements.define('venue-card', VenueCard);
