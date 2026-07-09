/* =========================================================
   LOGIC.JS — Premium portfolio transitions
   Clip reveal · Char-by-char text · Parallax · Cursor
========================================================= */

// ══════════════════════════════════════════════════════════
// 1. CUSTOM MAGNETIC CURSOR
// ══════════════════════════════════════════════════════════
const cursorDot  = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
});

// Smooth ring follows with lag
function animateCursor() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateCursor);
}
animateCursor();

// Cursor scale on hover of interactive elements
document.querySelectorAll('a, button, .project-card, .about-card, .skill-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('expanded'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('expanded'));
});


// ══════════════════════════════════════════════════════════
// 2. CHARACTER-BY-CHARACTER TEXT REVEAL
// ══════════════════════════════════════════════════════════
function splitChars(el) {
    const text = el.textContent.trim();
    el.textContent = '';
    el.setAttribute('aria-label', text);
    [...text].forEach((char, i) => {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.transitionDelay = `${i * 35}ms`;
        el.appendChild(span);
    });
}

// Apply to all section headings
document.querySelectorAll('.section-header h2').forEach(h => splitChars(h));


// ══════════════════════════════════════════════════════════
// 3. CLIP REVEAL — IntersectionObserver
// ══════════════════════════════════════════════════════════
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            staggerChildren(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));


// ══════════════════════════════════════════════════════════
// 4. STAGGERED CHILDREN
// ══════════════════════════════════════════════════════════
function staggerChildren(section) {
    const items = section.querySelectorAll(
        '.about-card, .skill-card, .project-card, .soc-link'
    );
    items.forEach((el, i) => {
        el.style.transitionDelay = `${i * 110}ms`;
        el.classList.add('child-reveal');
        setTimeout(() => el.classList.add('child-visible'), i * 110 + 50);
    });
}


// ══════════════════════════════════════════════════════════
// 5. PARALLAX BACKGROUND TEXT
// ══════════════════════════════════════════════════════════
function updateParallax() {
    const scrollY = window.scrollY;
    document.querySelectorAll('.parallax-bg-text').forEach(el => {
        const speed  = parseFloat(el.dataset.speed) || 0.3;
        const offset = el.closest('section').offsetTop;
        const rel    = scrollY - offset;
        el.style.transform = `translateY(${rel * speed}px)`;
    });
}

window.addEventListener('scroll', () => {
    updateParallax();
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    triggerSkillBars();
}, { passive: true });


// ══════════════════════════════════════════════════════════
// 6. NAVBAR
// ══════════════════════════════════════════════════════════
const navbar = document.getElementById('navbar');


// ══════════════════════════════════════════════════════════
// 7. SKILL BAR ANIMATION
// ══════════════════════════════════════════════════════════
let skillsTriggered = false;

function triggerSkillBars() {
    if (skillsTriggered) return;
    const section = document.getElementById('skills');
    if (!section) return;
    if (section.getBoundingClientRect().top < window.innerHeight - 80) {
        document.querySelectorAll('.skill-fill').forEach(bar => {
            const target = bar.style.getPropertyValue('--w');
            bar.style.width = '0';
            requestAnimationFrame(() => setTimeout(() => { bar.style.width = target; }, 100));
        });
        skillsTriggered = true;
    }
}
triggerSkillBars();


// ══════════════════════════════════════════════════════════
// 8. PROJECT CARDS — 3D TILT
// ══════════════════════════════════════════════════════════
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width  - 0.5) * 8;
        const y = ((e.clientY - r.top)  / r.height - 0.5) * 8;
        card.style.transform = `perspective(700px) rotateX(${-y}deg) rotateY(${x}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    
    // Open modal on click
    card.addEventListener('click', () => {
        openProjectModal(card);
    });
});

// ══════════════════════════════════════════════════════════
// 8b. PROJECT DETAIL MODAL LOGIC
// ══════════════════════════════════════════════════════════
const projectModal    = document.getElementById('project-modal');
const modalCloseBtn   = document.getElementById('modalCloseBtn');
const modalProjNum    = document.getElementById('modalProjNum');
const modalProjTitle  = document.getElementById('modalProjTitle');
const modalProjDesc   = document.getElementById('modalProjDesc');
const modalProjDetail = document.getElementById('modalProjDetail');
const modalProjTags   = document.getElementById('modalProjTags');
const modalGithubLink = document.getElementById('modalGithubLink');

function openProjectModal(card) {
    if (!projectModal) return;
    
    const num    = card.getAttribute('data-num');
    const title  = card.getAttribute('data-title');
    const desc   = card.getAttribute('data-desc');
    const detail = card.getAttribute('data-detail');
    const tags   = card.getAttribute('data-tags') ? card.getAttribute('data-tags').split(',') : [];
    const github = card.getAttribute('data-github');
    
    if (modalProjNum) modalProjNum.textContent = num;
    if (modalProjTitle) modalProjTitle.textContent = title;
    if (modalProjDesc) modalProjDesc.textContent = desc;
    if (modalProjDetail) modalProjDetail.textContent = detail;
    
    if (modalProjTags) {
        modalProjTags.innerHTML = '';
        tags.forEach(tag => {
            const span = document.createElement('span');
            span.textContent = tag.trim();
            modalProjTags.appendChild(span);
        });
    }
    
    if (modalGithubLink) {
        modalGithubLink.setAttribute('href', github || '#');
    }
    
    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    if (!projectModal) return;
    projectModal.classList.remove('active');
    document.body.style.overflow = '';
}

if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal);
}

if (projectModal) {
    // Close modal on background click
    projectModal.addEventListener('click', (e) => {
        if (e.target === projectModal) {
            closeProjectModal();
        }
    });
}

// Close modal on Escape press
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeProjectModal();
    }
});


// ══════════════════════════════════════════════════════════
// 9. ABOUT CARDS — Sequential 5s Spotlight
// ══════════════════════════════════════════════════════════
const aboutCards = document.querySelectorAll('.about-card');
let aboutTimer = null;

function playAboutCards() {
    clearAllAboutTimers();
    function activateCard(i) {
        if (i >= aboutCards.length) return;
        aboutCards.forEach(c => {
            c.classList.remove('playing');
            const b = c.querySelector('.card-timer');
            if (b) { b.style.transition = 'none'; b.style.width = '0%'; }
        });
        const card = aboutCards[i];
        card.classList.add('playing');
        const bar = card.querySelector('.card-timer');
        if (bar) {
            bar.getBoundingClientRect();
            bar.style.transition = 'width 5s linear';
            bar.style.width = '100%';
        }
        aboutTimer = setTimeout(() => activateCard(i + 1), 5000);
    }
    activateCard(0);
}

function clearAllAboutTimers() {
    clearTimeout(aboutTimer);
    aboutCards.forEach(c => {
        c.classList.remove('playing');
        const b = c.querySelector('.card-timer');
        if (b) { b.style.transition = 'none'; b.style.width = '0%'; }
    });
}

document.querySelectorAll('a[href="#about"]').forEach(link => {
    link.addEventListener('click', () => setTimeout(playAboutCards, 700));
});


// ══════════════════════════════════════════════════════════
// 10. CONTACT FORM
// ══════════════════════════════════════════════════════════
const form    = document.getElementById('contactForm');
const sendBtn = document.getElementById('sendBtn');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        sendBtn.innerHTML = 'Sent! <i class="fas fa-check"></i>';
        sendBtn.style.background = '#fff';
        sendBtn.style.color = '#22c55e';
        sendBtn.disabled = true;
        setTimeout(() => {
            sendBtn.innerHTML = 'Send Message <i class="fas fa-arrow-right"></i>';
            sendBtn.style.background = '';
            sendBtn.style.color = '';
            sendBtn.disabled = false;
            form.reset();
        }, 3000);
    });
}


// ══════════════════════════════════════════════════════════
// 11. HERO ENTRANCE — page load stagger
// ══════════════════════════════════════════════════════════
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});