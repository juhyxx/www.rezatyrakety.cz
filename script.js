document.addEventListener('DOMContentLoaded', () => {
    const intro = document.querySelector('#intro');
    const koncertList = document.querySelector('#koncert-list');
    const koncertOldList = document.querySelector('#koncert-old-list');
    const countEl = document.querySelector('#count');

    if (intro) {
        ['mousedown', 'mouseup', 'touchstart', 'touchend'].forEach(evt => intro.addEventListener(evt, toggle));
    }

    fetch('https://www.rezatyrakety.cz/be/be.php')
        .then(response => {
            if (!response.ok) throw new Error(response.statusText || 'Network response was not ok');
            return response.json();
        })
        .then(data => {
            const result = data && data.result ? data.result : {};
            renderUpcoming(result.koncerts || [], koncertList);
            renderPast(result['oldkoncerts'] || [], result['oldkoncerts-count'] || 0, koncertOldList, countEl);
            // start countdown for the first upcoming concert
            const upcoming = (result.koncerts && result.koncerts.length) ? result.koncerts[0] : null;
            if (upcoming) startNextShowCountdown(upcoming.date, `${upcoming.jmeno || ''} ${upcoming.adresaMesto || ''}`);
        })
        .catch(err => {
            console.error('Failed to load concerts:', err);
            if (koncertList) koncertList.innerHTML = 'Nepodařilo se načíst data';
        });
});

function toggle() {
    const el = document.querySelector('#intro');
    if (el) el.classList.toggle('active');
}

const months = [
    'leden', 'únor', 'březen', 'duben', 'květen', 'červen', 'červenec', 'srpen', 'září', 'říjen', 'listopad', 'prosinec'
];

const days = ['neděle', 'pondělí', 'úterý', 'středa', 'čtvrtek', 'pátek', 'sobota'];

const pad = n => ("0" + n).slice(-2);

function formatUpcomingDate(tsSeconds) {
    const d = new Date(tsSeconds * 1000);
    const hours = pad(d.getHours());
    const mins = pad(d.getMinutes());
    return `<i>${days[d.getDay()]}</i> ${d.getDate()}. ${months[d.getMonth()]} ${d.getFullYear()} <i>${hours}:${mins}</i>`;
}

function renderUpcoming(data, container) {
    if (!container) return;
    if (!Array.isArray(data) || data.length === 0) {
        container.innerHTML = 'Momentálně nic neplánujeme';
        return;
    }
    const tmpl = document.getElementById('tmpl-upcoming');
    if (tmpl && tmpl.content) {
        const ul = document.createElement('ul');
        ul.id = 'koncerty-list';
        data.forEach(item => {
            const node = tmpl.content.firstElementChild.cloneNode(true);
            const dateEl = node.querySelector('.date');
            if (dateEl) dateEl.innerHTML = formatUpcomingDate(item.date);
            const jmenoEl = node.querySelector('.jmeno'); if (jmenoEl) jmenoEl.textContent = item.jmeno || '';
            const uliceEl = node.querySelector('.adresaUlice'); if (uliceEl) uliceEl.textContent = item.adresaUlice || '';
            const mestoEl = node.querySelector('.adresaMesto'); if (mestoEl) mestoEl.textContent = item.adresaMesto || '';
            const pozEl = node.querySelector('.poznamka'); if (pozEl) pozEl.textContent = item.poznamka || '';
            ul.appendChild(node);
        });
        container.innerHTML = '';
        container.appendChild(ul);
        return;
    }
    container.innerHTML = '';
}

function renderPast(data, count, container, countEl) {
    if (countEl) countEl.textContent = count;
    if (!container || !Array.isArray(data) || data.length === 0) return;
    const tmpl = document.getElementById('tmpl-past');
    const slice = data.slice(0, 100);
    if (tmpl && tmpl.content) {
        const ul = document.createElement('ul');
        ul.id = 'koncerty-list';
        slice.forEach(element => {
            const node = tmpl.content.firstElementChild.cloneNode(true);
            const d = new Date(element.date * 1000);
            const datumParsed = `${pad(d.getDate())}. ${pad(d.getMonth() + 1)} ${d.getFullYear()}`;
            const dateEl = node.querySelector('.date-old'); if (dateEl) dateEl.textContent = datumParsed;
            const mestoEl = node.querySelector('.adresaMesto'); if (mestoEl) mestoEl.textContent = element.adresaMesto || '';
            const jmenoEl = node.querySelector('.jmeno'); if (jmenoEl) jmenoEl.textContent = element.jmeno || '';
            ul.appendChild(node);
        });
        container.innerHTML = '';
        container.appendChild(ul);
        return;
    }

    container.innerHTML = '';
}

// Countdown logic for next show
let _nextCountdownId = null;

function _setFlipCard(cardEl, value) {
    if (!cardEl) return;
    const top = cardEl.querySelector('.top');
    const bottom = cardEl.querySelector('.bottom');
    const flipTop = cardEl.querySelector('.flip-top');
    const flipBottom = cardEl.querySelector('.flip-bottom');
    const current = cardEl.getAttribute('data-value') || (top && top.textContent) || '00';
    if (current === value) return;

    if (flipTop) flipTop.textContent = current;
    if (top) top.textContent = current - 1 >= 0 ? String(current - 1).padStart(2, '0') : '00';


    // trigger animation
    cardEl.classList.remove('flip');
    void cardEl.offsetWidth;
    cardEl.classList.add('flip');

    setTimeout(() => {
        if (top) top.textContent = value;
        if (bottom) bottom.textContent = value;
        cardEl.setAttribute('data-value', value);
        cardEl.classList.remove('flip');
        if (flipTop) flipTop.textContent = '';
        if (flipBottom) flipBottom.textContent = '';
    }, 700);
}

function startNextShowCountdown(tsSeconds, title) {
    const wrap = document.getElementById('next-show-countdown');
    const titleEl = document.getElementById('next-show-title');
    if (!wrap) return;

    wrap.classList.remove('hidden');
    if (_nextCountdownId) { clearInterval(_nextCountdownId); _nextCountdownId = null; }

    const units = {
        days: wrap.querySelector('.flip-unit[data-unit="days"] .flip-card'),
        hours: wrap.querySelector('.flip-unit[data-unit="hours"] .flip-card'),
        minutes: wrap.querySelector('.flip-unit[data-unit="minutes"] .flip-card'),
        seconds: wrap.querySelector('.flip-unit[data-unit="seconds"] .flip-card'),
    };

    function update() {
        const now = Date.now();
        const target = tsSeconds * 1000;
        let delta = Math.max(0, target - now);

        const days = Math.floor(delta / (24 * 3600 * 1000));
        delta -= days * 24 * 3600 * 1000;
        const hours = Math.floor(delta / (3600 * 1000));
        delta -= hours * 3600 * 1000;
        const mins = Math.floor(delta / (60 * 1000));
        delta -= mins * 60 * 1000;
        const secs = Math.floor(delta / 1000);

        const sDays = String(days).padStart(2, '0');
        const sHours = String(hours).padStart(2, '0');
        const sMins = String(mins).padStart(2, '0');
        const sSecs = String(secs).padStart(2, '0');

        if (units.days) {
            if (days > 0) {
                units.days.parentElement.style.display = '';
                _setFlipCard(units.days, sDays);
            } else {
                units.days.parentElement.style.display = 'none';
            }
        }

        if (units.hours) _setFlipCard(units.hours, sHours);
        if (units.minutes) _setFlipCard(units.minutes, sMins);
        if (units.seconds) _setFlipCard(units.seconds, sSecs);
    }

    // initialize with zeros then update
    ['days', 'hours', 'minutes', 'seconds'].forEach(u => {
        const c = wrap.querySelector(`.flip-unit[data-unit="${u}"] .flip-card`);
        if (c) {
            c.setAttribute('data-value', c.getAttribute('data-value') || '00');
            const top = c.querySelector('.top'); if (top) top.textContent = c.getAttribute('data-value');
            const bottom = c.querySelector('.bottom'); if (bottom) bottom.textContent = c.getAttribute('data-value');
        }
    });

    update();
    _nextCountdownId = setInterval(update, 1000);
}