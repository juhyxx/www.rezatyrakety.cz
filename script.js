const months = [
    'leden', 'únor', 'březen', 'duben', 'květen', 'červen', 'červenec', 'srpen', 'září', 'říjen', 'listopad', 'prosinec'
];
// 2. pád pro datum („26. března“)
const monthsGen = [
    'ledna', 'února', 'března', 'dubna', 'května', 'června', 'července', 'srpna', 'září', 'října', 'listopadu', 'prosince'
];
const days = ['neděle', 'pondělí', 'úterý', 'středa', 'čtvrtek', 'pátek', 'sobota'];

const pad = n => ('0' + n).slice(-2);

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
            if (koncertList) koncertList.innerHTML = '<p>Nepodařilo se načíst data.</p>';
            if (koncertOldList) koncertOldList.innerHTML = '';
        });

    initMenu();
    initActiveNav();
    initSlogans();
    initContact();

    const printBtn = document.getElementById('print-rider');
    if (printBtn) printBtn.addEventListener('click', () => window.print());

    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
});

/* ---------- Koncerty ---------- */

function renderUpcoming(data, container) {
    if (!container) return;
    if (!Array.isArray(data) || data.length === 0) {
        container.innerHTML = '<p>Momentálně nic neplánujeme.</p>';
        return;
    }
    const tmpl = document.getElementById('tmpl-upcoming');
    if (!tmpl || !tmpl.content) return;

    const ul = document.createElement('ul');
    data.forEach(item => {
        const node = tmpl.content.firstElementChild.cloneNode(true);
        const d = new Date(item.date * 1000);

        node.querySelector('.gig-day').textContent = d.getDate() + '.';
        node.querySelector('.gig-month').textContent = monthsGen[d.getMonth()];
        node.querySelector('.gig-year').textContent = d.getFullYear();
        node.querySelector('.gig-when').textContent = `${days[d.getDay()]} · ${pad(d.getHours())}:${pad(d.getMinutes())}`;
        node.querySelector('.gig-name').textContent = item.jmeno || '';

        const place = node.querySelector('.gig-place');
        if (item.adresaUlice) place.append(item.adresaUlice);
        if (item.adresaUlice && item.adresaMesto) place.append(', ');
        if (item.adresaMesto) {
            const city = document.createElement('b');
            city.textContent = item.adresaMesto;
            place.append(city);
        }

        node.querySelector('.gig-note').textContent = item.poznamka || '';
        ul.appendChild(node);
    });
    container.replaceChildren(ul);
}

function renderPast(data, count, container, countEl) {
    if (countEl) countEl.textContent = count;
    if (!container) return;
    if (!Array.isArray(data) || data.length === 0) {
        container.innerHTML = '';
        return;
    }
    const tmpl = document.getElementById('tmpl-past');
    if (!tmpl || !tmpl.content) return;

    const ul = document.createElement('ul');
    data.forEach(element => {
        const node = tmpl.content.firstElementChild.cloneNode(true);
        const d = new Date(element.date * 1000);
        node.querySelector('.date-old').textContent = `${pad(d.getDate())}. ${pad(d.getMonth() + 1)}. ${d.getFullYear()}`;
        node.querySelector('.adresaMesto').textContent = element.adresaMesto || '';
        node.querySelector('.jmeno').textContent = element.jmeno || '';
        ul.appendChild(node);
    });
    container.replaceChildren(ul);

    const toggle = document.getElementById('past-toggle');
    if (!toggle) return;
    // Tlačítko jen tehdy, když je seznam opravdu oříznutý
    requestAnimationFrame(() => {
        if (container.scrollHeight <= container.clientHeight + 4) return;
        const label = `Zobrazit všech ${data.length}`;
        toggle.textContent = label;
        toggle.hidden = false;
        toggle.addEventListener('click', () => {
            const open = container.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', String(open));
            toggle.textContent = open ? 'Sbalit' : label;
            if (!open) container.closest('.past').scrollIntoView({ block: 'start' });
        });
    });
}

/* ---------- Navigace ---------- */

function initMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.getElementById('site-nav');
    if (!toggle || !nav) return;

    const setOpen = open => {
        nav.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
    };

    toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
    nav.addEventListener('click', e => {
        if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && nav.classList.contains('is-open')) {
            setOpen(false);
            toggle.focus();
        }
    });
}

function initActiveNav() {
    const links = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
    if (!links.length || !('IntersectionObserver' in window)) return;

    const byId = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const link = byId.get(entry.target.id);
            if (!link) return;
            if (entry.isIntersecting) {
                links.forEach(a => a.removeAttribute('aria-current'));
                link.setAttribute('aria-current', 'true');
            } else if (link.hasAttribute('aria-current')) {
                link.removeAttribute('aria-current');
            }
        });
    }, { rootMargin: '-45% 0px -50% 0px' });

    byId.forEach((_, id) => {
        const section = document.getElementById(id);
        if (section) observer.observe(section);
    });
}

/* ---------- Pás s plackami (nekonečný pás) ---------- */

function initSlogans() {
    const track = document.querySelector('.slogans-track');
    const set = track && track.querySelector('.slogans-set');
    if (!set) return;
    const clone = set.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.querySelectorAll('img').forEach(img => { img.alt = ''; });
    track.appendChild(clone);
}

/* ---------- Kontakt (e-mail skládaný až v prohlížeči) ---------- */

function initContact() {
    const li = document.getElementById('contact-email');
    if (!li) return;
    const _e = 'juhy', _d = 'rezatyrakety.cz', _a = _e + '@' + _d;
    const a = document.createElement('a');
    a.className = 'email';
    a.href = 'mailto:' + _a;
    a.textContent = _a;
    li.querySelector('span').replaceWith(a);
}

/* ---------- Raketový kurzor ---------- */

(function initRocketCursor() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (prefersReducedMotion || !hasFinePointer) return;

    const rocket = document.getElementById('rocket-cursor');
    if (!rocket) return;
    const rocketSvg = rocket.querySelector('svg');

    const smokeCanvas = document.getElementById('rocket-smoke');
    const smokeCtx = smokeCanvas ? smokeCanvas.getContext('2d') : null;

    function resizeSmokeCanvas() {
        if (!smokeCanvas) return;
        const dpr = window.devicePixelRatio || 1;
        smokeCanvas.width = window.innerWidth * dpr;
        smokeCanvas.height = window.innerHeight * dpr;
        smokeCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resizeSmokeCanvas();
    window.addEventListener('resize', resizeSmokeCanvas);

    const smokeParticles = [];

    function spawnSmoke(px, py, dirAngle) {
        const spread = (Math.random() - 0.5) * 1.5;
        const speed = 15 + Math.random() * 25;
        const a = dirAngle + spread;
        smokeParticles.push({
            x: px + (Math.random() - 0.5) * 4,
            y: py + (Math.random() - 0.5) * 4,
            vx: Math.cos(a) * speed,
            vy: Math.sin(a) * speed,
            size: 2 + Math.random() * 2,
            maxSize: 12 + Math.random() * 10,
            life: 0,
            maxLife: 0.6 + Math.random() * 0.5,
        });
    }

    function updateSmoke(dt) {
        if (!smokeCtx) return;
        smokeCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        for (let i = smokeParticles.length - 1; i >= 0; i--) {
            const p = smokeParticles[i];
            p.life += dt;
            if (p.life >= p.maxLife) {
                smokeParticles.splice(i, 1);
                continue;
            }
            p.vy -= 16 * dt;
            const drag = Math.max(0, 1 - 1.1 * dt);
            p.vx *= drag;
            p.vy *= drag;
            p.x += p.vx * dt;
            p.y += p.vy * dt;

            const t = p.life / p.maxLife;
            const size = p.size + (p.maxSize - p.size) * t;
            const alpha = (1 - t) * 0.32;

            // krémová z manuálu (#DCCDBB)
            const gradient = smokeCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size);
            gradient.addColorStop(0, `rgba(220, 205, 187, ${alpha})`);
            gradient.addColorStop(1, 'rgba(220, 205, 187, 0)');
            smokeCtx.fillStyle = gradient;
            smokeCtx.beginPath();
            smokeCtx.arc(p.x, p.y, size, 0, Math.PI * 2);
            smokeCtx.fill();
        }
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let x = mouseX;
    let y = mouseY;
    let angle = -90;
    let targetAngle = -90;
    let revealed = false;
    let lastFrameTime = performance.now();

    const scale = 0.8; // velikost rakety
    const GAP = 45;    // jak daleko od kurzoru raketa zastaví (px, měřeno od středu rakety)

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!revealed) {
            // objeví se kousek pod kurzorem, nosem nahoru
            x = mouseX;
            y = mouseY + GAP;
            revealed = true;
            rocket.style.opacity = '1';
        }
    }, { passive: true });

    document.addEventListener('mouseleave', () => { rocket.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { if (revealed) rocket.style.opacity = '1'; });

    function animate() {
        const now = performance.now();
        const dt = Math.min((now - lastFrameTime) / 1000, 0.05);
        lastFrameTime = now;

        // Raketa letí ke kurzoru, ale zastaví se GAP px před ním a míří na něj nosem.
        // Když se kurzor přiblíží víc, raketa trochu couvne – nikdy nevjede pod kurzor.
        const dx = mouseX - x;
        const dy = mouseY - y;
        const dist = Math.hypot(dx, dy);
        const travel = dist - GAP;
        if (dist > 0.5) {
            x += (dx / dist) * travel * 0.06;
            y += (dy / dist) * travel * 0.06;
            targetAngle = Math.atan2(dy, dx) * 180 / Math.PI;
        }
        let diff = ((targetAngle - angle + 540) % 360) - 180;
        angle += diff * 0.12;

        rocket.style.transform = `translate(${x - 20}px, ${y - 31}px) scale(${scale})`;
        rocketSvg.style.transform = `rotate(${angle + 90}deg)`;
        const thrusting = travel > 5;
        rocket.classList.toggle('thrust', thrusting);

        if (thrusting) {
            const angleRad = angle * Math.PI / 180;
            const tailX = x - Math.cos(angleRad) * 21 * scale;
            const tailY = y - Math.sin(angleRad) * 21 * scale;
            spawnSmoke(tailX, tailY, angleRad + Math.PI);
        }
        updateSmoke(dt);

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
})();

/* ---------- Hero koláž (rozjíždí se při scrollu) ---------- */

(function initHeroCollage() {
    const intro = document.querySelector('#intro');
    const collage = document.querySelector('.hero-collage');
    if (!intro || !collage) return;
    const items = Array.from(collage.querySelectorAll('.hero-photo, .hero-logo, .hero-placka'));
    const foot = intro.querySelector('.hero-foot');

    let ticking = false;

    function update() {
        ticking = false;
        const rect = intro.getBoundingClientRect();
        const pin = intro.querySelector('.hero-pin');
        const total = rect.height - (pin ? pin.offsetHeight : window.innerHeight);
        const p = total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;
        const size = collage.getBoundingClientRect().width;

        // slogan pod koláží zmizí dřív, než na něj sjede logo
        if (foot) {
            const fade = Math.max(0, 1 - p * 4);
            foot.style.opacity = fade.toFixed(3);
            foot.style.visibility = fade === 0 ? 'hidden' : '';
        }

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
