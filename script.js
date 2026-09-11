document.addEventListener('DOMContentLoaded', () => {
    const koncertList = document.querySelector('#koncert-list');
    const koncertOldList = document.querySelector('#koncert-old-list');
    const countEl = document.querySelector('#count');

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

(function initHeroCollage() {
    const intro = document.querySelector('#intro');
    const collage = document.querySelector('.hero-collage');
    if (!intro || !collage) return;
    const items = Array.from(collage.querySelectorAll('.hero-photo, .hero-logo'));

    let ticking = false;

    function update() {
        ticking = false;
        const rect = intro.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const p = total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;
        const size = collage.getBoundingClientRect().width;

        items.forEach(el => {
            const x0 = parseFloat(el.dataset.x0) || 0;
            const y0 = parseFloat(el.dataset.y0) || 0;
            const rot0 = parseFloat(el.dataset.rot0) || 0;
            const x1 = parseFloat(el.dataset.x1) || 0;
            const y1 = parseFloat(el.dataset.y1) || 0;
            const rot1 = parseFloat(el.dataset.rot1) || 0;
            const dx = x0 + (x1 - x0) * p;
            const dy = y0 + (y1 - y0) * p;
            const rot = rot0 + (rot1 - rot0) * p;
            const tx = (dx / 100) * size;
            const ty = (dy / 100) * size;
            const scale = 0.82 + 0.18 * p;
            el.style.transform = `translate(-50%, -50%) translate(${tx}px, ${ty}px) rotate(${rot}deg) scale(${scale})`;
        });
    }

    function onScroll() {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(update);
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
})();

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

