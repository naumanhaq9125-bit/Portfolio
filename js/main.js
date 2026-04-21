/* =====================================================
   MAIN.JS — All Interactions & Animations
   Portfolio: Muhammad Nauman Ul Haq
===================================================== */
'use strict';

/* =====================================================
   0. SPLASH SCREEN (Fade out on load)
===================================================== */
window.addEventListener('load', () => {
    const splash = document.getElementById('splashScreen');
    if (splash) {
        // Add a slight delay so the splash screen is visible for a moment
        setTimeout(() => {
            splash.classList.add('fade-out');
            setTimeout(() => {
                splash.remove();
            }, 800); // Matches CSS transition duration
        }, 1200);
    }
});

/* =====================================================
   1. CURSOR GLOW (follows mouse with lag)
===================================================== */
(function initCursorGlow() {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let gx = mx, gy = my;

    window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

    (function track() {
        gx += (mx - gx) * 0.07;
        gy += (my - gy) * 0.07;
        glow.style.transform = `translate(${gx - 200}px, ${gy - 200}px)`;
        requestAnimationFrame(track);
    })();
}());


/* =====================================================
   2. NAVBAR: scroll + hamburger + active links
===================================================== */
(function initNavbar() {
    const navbar    = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.getElementById('navLinks');
    const links     = document.querySelectorAll('.nav-link');

    // Scroll → add 'scrolled' class
    function onScroll() {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        setActiveLink();
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Hamburger toggle
    hamburger.addEventListener('click', () => {
        const open = !navLinks.classList.contains('open');
        navLinks.classList.toggle('open', open);
        hamburger.classList.toggle('open', open);
        hamburger.setAttribute('aria-expanded', String(open));
    });

    // Close on link click
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            hamburger.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    // Active link based on scroll position
    function setActiveLink() {
        const sections   = document.querySelectorAll('section[id]');
        const checkpoint = window.scrollY + window.innerHeight * 0.35;

        sections.forEach(sec => {
            if (checkpoint >= sec.offsetTop && checkpoint < sec.offsetTop + sec.offsetHeight) {
                links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${sec.id}`));
            }
        });
    }
}());


/* =====================================================
   3. SMOOTH SCROLL for all hash links
===================================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const id     = anchor.getAttribute('href');
        const target = document.querySelector(id);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});


/* =====================================================
   4. SCROLL REVEAL (IntersectionObserver)
===================================================== */
(function initReveal() {
    const els = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    const io  = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                io.unobserve(e.target);
            }
        });
    }, { rootMargin: '0px 0px -80px 0px', threshold: 0.08 });

    els.forEach(el => io.observe(el));
}());


/* =====================================================
   5. TYPEWRITER EFFECT
===================================================== */
(function initTyped() {
    const el = document.getElementById('typedText');
    if (!el) return;

    const phrases = [
        'MERN Stack Apps.',
        'React Frontends.',
        'Node.js APIs.',
        'Full Stack Solutions.',
        'Creative Designs.',
        'Digital Experiences.'
    ];

    let pi = 0, ci = 0, deleting = false, delay = 85;

    function tick() {
        const phrase = phrases[pi];
        if (!deleting) {
            el.textContent = phrase.slice(0, ++ci);
            delay = 75 + Math.random() * 35;
            if (ci === phrase.length) { deleting = true; delay = 1800; }
        } else {
            el.textContent = phrase.slice(0, --ci);
            delay = 38;
            if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; delay = 350; }
        }
        setTimeout(tick, delay);
    }
    setTimeout(tick, 1000);
}());


/* =====================================================
   6. COUNTER ANIMATION (number count-up)
===================================================== */
(function initCounters() {
    const counters = document.querySelectorAll('[data-target]');
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting && !e.target.dataset.counted) {
                e.target.dataset.counted = '1';
                animCount(e.target, +e.target.dataset.target);
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => io.observe(c));

    function animCount(el, target) {
        const duration = 1800;
        const start    = performance.now();
        function frame(now) {
            const p = Math.min((now - start) / duration, 1);
            const v = 1 - Math.pow(1 - p, 3); // ease-out cubic
            el.textContent = Math.round(v * target);
            if (p < 1) requestAnimationFrame(frame);
            else el.textContent = target;
        }
        requestAnimationFrame(frame);
    }
}());


/* =====================================================
   7. SKILL BARS (animate width on view)
===================================================== */
(function initSkillBars() {
    const fills = document.querySelectorAll('.skill-fill');
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const w = e.target.dataset.width || 0;
                e.target.style.width = w + '%';
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.25 });

    fills.forEach(f => { f.style.width = '0'; io.observe(f); });
}());


/* =====================================================
   8. 3D TILT ON PROJECT CARDS
===================================================== */
(function initTilt() {
    const cards = document.querySelectorAll('.tilt-card');
    const isMobile = () => window.innerWidth <= 768;

    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            if (isMobile()) return;
            const r  = card.getBoundingClientRect();
            const x  = e.clientX - r.left;
            const y  = e.clientY - r.top;
            const rx = ((y - r.height / 2) / r.height) * -10;
            const ry = ((x - r.width  / 2) / r.width)  *  10;
            card.style.transform    = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(10px)`;
            card.style.transition   = 'transform 0.08s linear';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform  = 'perspective(900px) rotateX(0) rotateY(0) translateZ(0)';
            card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
        });
    });
}());


/* =====================================================
   9. TIMELINE SPINE ANIMATION
===================================================== */
(function initTimeline() {
    const spine = document.querySelector('.timeline-spine');
    if (!spine) return;
    spine.style.transformOrigin = 'top center';
    spine.style.transform       = 'scaleY(0)';

    const io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
            spine.style.transition = 'transform 1.4s cubic-bezier(0.16,1,0.3,1)';
            spine.style.transform  = 'scaleY(1)';
            io.disconnect();
        }
    }, { threshold: 0.05 });
    io.observe(spine);
}());


/* =====================================================
   10. CONTACT FORM (simulated send with feedback)
===================================================== */
(function initContactForm() {
    const form = document.getElementById('contactForm');
    const btn  = document.getElementById('contactSubmitBtn');
    if (!form || !btn) return;

    form.addEventListener('submit', async e => {
        e.preventDefault();
        btn.disabled = true;
        btn.innerHTML = '<span>Sending…</span><i class="fas fa-circle-notch fa-spin"></i>';

        await new Promise(r => setTimeout(r, 1600));

        btn.innerHTML = '<span>Message Sent! ✓</span><i class="fas fa-check"></i>';
        btn.style.background = 'linear-gradient(135deg, #16a34a, #15803d)';
        form.reset();

        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
            btn.style.background = '';
        }, 3500);
    });

    // Floating label effect
    form.querySelectorAll('input, textarea').forEach(inp => {
        inp.addEventListener('focus', ()  => inp.closest('.form-grp').classList.add('focused'));
        inp.addEventListener('blur',  ()  => inp.closest('.form-grp').classList.remove('focused'));
    });
}());


/* =====================================================
   11. CARD SHIMMER on hover (shimmer div injection)
===================================================== */
(function initCardShimmer() {
    document.querySelectorAll('.void-card').forEach(card => {
        const sweep = document.createElement('div');
        sweep.style.cssText = `
            position:absolute; top:0; left:-100%; width:60%; height:100%;
            background:linear-gradient(105deg, transparent 30%, rgba(167,139,250,0.07) 50%, transparent 70%);
            transform:skewX(-20deg); pointer-events:none; z-index:2;
            transition:none;
        `;
        card.style.position = 'relative';
        card.appendChild(sweep);

        card.addEventListener('mouseenter', () => {
            sweep.style.transition = 'left 0.55s ease';
            sweep.style.left = '200%';
        });
        card.addEventListener('mouseleave', () => {
            sweep.style.transition = 'none';
            sweep.style.left = '-100%';
        });
    });
}());


/* =====================================================
   12. SECTION TAG counter visibility
      (ensures each section tag animates as text)
===================================================== */
// All inline — handled via CSS animations above.
// Placeholder for any future JS-driven section enhancements.
