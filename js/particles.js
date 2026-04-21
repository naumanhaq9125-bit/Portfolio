/* =====================================================
   PARTICLES.JS — Canvas Particle System
   Portfolio: Muhammad Nauman Ul Haq
===================================================== */
(function () {
    'use strict';

    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W = window.innerWidth;
    let H = window.innerHeight;
    let mouse = { x: W / 2, y: H / 2 };

    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();

    /* ---- Config ---- */
    const MAX_PARTICLES = Math.min(Math.floor((W * H) / 14000), 85);
    const MAX_DIST      = 140;
    const SPEED         = 0.35;
    const MOUSE_RADIUS  = 130;

    // Violet / purple palette
    const PALETTE = [
        [124, 58,  237],   // violet-600
        [139, 92,  246],   // violet-500
        [167, 139, 250],   // violet-400
        [157, 0,   255],   // neon
        [196, 181, 253],   // violet-300
        [91,  33,  182],   // violet-700
    ];

    /* ---- Particle class ---- */
    class Particle {
        constructor(initial = false) {
            this.init(initial);
        }
        init(initial = false) {
            this.x  = initial ? Math.random() * W : (Math.random() < 0.5 ? -5 : W + 5);
            this.y  = Math.random() * H;
            this.vx = (Math.random() - 0.5) * SPEED;
            this.vy = (Math.random() - 0.5) * SPEED;
            this.r  = Math.random() * 1.8 + 0.4;

            const c = PALETTE[Math.floor(Math.random() * PALETTE.length)];
            this.color = c;

            this.opacity    = Math.random() * 0.55 + 0.15;
            this.opacityDir = (Math.random() < 0.5 ? 1 : -1) * 0.0025;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Pulsate opacity
            this.opacity += this.opacityDir;
            if (this.opacity > 0.75 || this.opacity < 0.1) this.opacityDir *= -1;

            // Mouse repulsion
            const dx   = this.x - mouse.x;
            const dy   = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < MOUSE_RADIUS && dist > 0) {
                const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
                this.x += (dx / dist) * force * 2.2;
                this.y += (dy / dist) * force * 2.2;
            }

            // Out of bounds → re-init
            if (this.x < -15 || this.x > W + 15 || this.y < -15 || this.y > H + 15) {
                this.init(false);
            }
        }
        draw() {
            const [r, g, b] = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r},${g},${b},${this.opacity})`;
            ctx.fill();
        }
    }

    /* ---- Init particles ---- */
    let particles = Array.from({ length: MAX_PARTICLES }, () => new Particle(true));

    /* ---- Draw connecting lines ---- */
    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx   = particles[i].x - particles[j].x;
                const dy   = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MAX_DIST) {
                    const alpha = (1 - dist / MAX_DIST) * 0.25;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(124,58,237,${alpha})`;
                    ctx.lineWidth   = 0.6;
                    ctx.stroke();
                }
            }
        }
    }

    /* ---- Animation loop ---- */
    function loop() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => { p.update(); p.draw(); });
        drawLines();
        requestAnimationFrame(loop);
    }
    loop();

    /* ---- Events ---- */
    window.addEventListener('resize', () => {
        resize();
        const target = Math.min(Math.floor((W * H) / 14000), 85);
        while (particles.length < target) particles.push(new Particle(true));
        if (particles.length > target) particles.length = target;
    }, { passive: true });

    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    }, { passive: true });

    window.addEventListener('touchmove', e => {
        if (e.touches.length) {
            mouse.x = e.touches[0].clientX;
            mouse.y = e.touches[0].clientY;
        }
    }, { passive: true });
}());
