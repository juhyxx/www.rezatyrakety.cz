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
        })
        .catch(err => {
            console.error('Failed to load concerts:', err);
            if (koncertList) koncertList.innerHTML = 'Nepodařilo se načíst data';
        });
});

(function initRocketCursor() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (prefersReducedMotion || !hasFinePointer) return;

    const rocket = document.getElementById('rocket-cursor');
    if (!rocket) return;
    const rocketSvg = rocket.querySelector('svg');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let x = mouseX;
    let y = mouseY;
    let angle = -90;
    let targetAngle = -90;
    let revealed = false;

    const MAX_SCALE = 1.2;
    const MIN_SCALE = 0.3;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!revealed) {
            x = mouseX;
            y = mouseY;
            revealed = true;
            rocket.style.opacity = '1';
        }
    }, { passive: true });

    document.addEventListener('mouseleave', () => { rocket.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { if (revealed) rocket.style.opacity = '1'; });

    function animate() {
        const dx = mouseX - x;
        const dy = mouseY - y;
        x += dx * 0.06;
        y += dy * 0.06;

        const dist = Math.hypot(dx, dy);
        if (dist > 1.5) {
            targetAngle = Math.atan2(dy, dx) * 180 / Math.PI;
        }
        let diff = ((targetAngle - angle + 540) % 360) - 180;
        angle += diff * 0.12;

        // The rocket orbits an invisible cylinder standing through the middle
        // of the screen: the closer it gets to that center line, the more it
        // faces the viewer (full size); the further out, the more it's
        // wrapping around the curve, so it foreshortens toward vanishing.
        const cylinderRadius = Math.min(window.innerWidth, 1280) / 2;
        const orbit = Math.min(Math.abs(x - window.innerWidth / 2) / cylinderRadius, 1);
        const scale = MIN_SCALE + (MAX_SCALE - MIN_SCALE) * Math.cos(orbit * Math.PI / 2);

        rocket.style.transform = `translate(${x - 20}px, ${y - 31}px) scale(${scale.toFixed(3)})`;
        rocketSvg.style.transform = `rotate(${angle + 90}deg)`;
        rocket.classList.toggle('thrust', dist > 5);

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
})();

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

