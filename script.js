// ===== VIPB Website Scripts — Light Theme =====

document.addEventListener('DOMContentLoaded', () => {
    initSnowfall();
    initNavbar();
    initScrollAnimations();
    initFAQ();
    initCounterAnimation();
    initSmoothScroll();
});

// ===== Enhanced Snowfall / Particles =====
function initSnowfall() {
    const mainCanvas = document.getElementById('snowfall');
    const sectionCanvases = document.querySelectorAll('.section-snow');

    if (mainCanvas) setupSnowCanvas(mainCanvas, 100);

    sectionCanvases.forEach(canvas => {
        setupSnowCanvas(canvas, 45); // Fewer particles for localized snow
        setTimeout(() => canvas.classList.add('loaded'), 100);
    });
}

function setupSnowCanvas(canvas, count) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = count;

    function resize() {
        if (canvas.id === 'snowfall') {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        } else {
            const parent = canvas.parentElement;
            canvas.width = parent.offsetWidth;
            canvas.height = parent.offsetHeight;
        }
    }

    resize();
    window.addEventListener('resize', resize);

    const shapes = ['snowflake', 'snowflake', 'dot', 'cross', 'diamond', 'ring'];

    class Particle {
        constructor() {
            this.reset();
            this.y = Math.random() * canvas.height;
            this.x = Math.random() * canvas.width;
        }

        reset() {
            if (Math.random() > 0.5) {
                this.x = -10;
                this.y = Math.random() * canvas.height * 0.6;
            } else {
                this.x = Math.random() * canvas.width;
                this.y = -10;
            }

            this.size = Math.random() * 6 + 2;
            this.speedX = Math.random() * 0.4 + 0.1;
            this.speedY = Math.random() * 0.8 + 0.3;
            this.opacity = Math.random() * 0.22 + 0.05;
            this.shape = shapes[Math.floor(Math.random() * shapes.length)];
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.015;

            this.swayAmplitude = Math.random() * 1.2 + 0.3;
            this.swaySpeed = Math.random() * 0.015 + 0.005;
            this.swayOffset = Math.random() * Math.PI * 2;
            this.age = 0;

            const roll = Math.random();
            if (roll > 0.7) {
                this.color = `rgba(22, 163, 74, ${this.opacity})`;
            } else if (roll > 0.4) {
                this.color = `rgba(200, 210, 220, ${this.opacity * 1.5})`;
            } else {
                this.color = `rgba(156, 163, 175, ${this.opacity})`;
            }
        }

        update() {
            this.age++;
            this.x += this.speedX + Math.sin(this.age * this.swaySpeed + this.swayOffset) * this.swayAmplitude * 0.3;
            this.y += this.speedY;
            this.rotation += this.rotationSpeed;

            if (this.x > canvas.width + 20 || this.y > canvas.height + 20) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.fillStyle = this.color;
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 1;

            switch (this.shape) {
                case 'snowflake':
                    const arms = 6;
                    const r = this.size / 2;
                    ctx.lineWidth = 0.8;
                    for (let i = 0; i < arms; i++) {
                        const angle = (i * Math.PI * 2) / arms;
                        ctx.beginPath();
                        ctx.moveTo(0, 0);
                        ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
                        ctx.stroke();
                        const bx = Math.cos(angle) * r * 0.55;
                        const by = Math.sin(angle) * r * 0.55;
                        const perpAngle = angle + Math.PI / 4;
                        ctx.beginPath();
                        ctx.moveTo(bx, by);
                        ctx.lineTo(bx + Math.cos(perpAngle) * r * 0.3, by + Math.sin(perpAngle) * r * 0.3);
                        ctx.stroke();
                    }
                    break;
                case 'dot':
                    ctx.beginPath(); ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2); ctx.fill();
                    break;
                case 'cross':
                    ctx.beginPath(); ctx.moveTo(-this.size / 2, 0); ctx.lineTo(this.size / 2, 0); ctx.moveTo(0, -this.size / 2); ctx.lineTo(0, this.size / 2); ctx.stroke();
                    break;
                case 'diamond':
                    ctx.beginPath(); ctx.moveTo(0, -this.size / 2); ctx.lineTo(this.size / 2, 0); ctx.lineTo(0, this.size / 2); ctx.lineTo(-this.size / 2, 0); ctx.closePath(); ctx.fill();
                    break;
                case 'ring':
                    ctx.beginPath(); ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2); ctx.stroke();
                    break;
            }
            ctx.restore();
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

// ===== Navbar Scroll Effect =====
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
}

// ===== Scroll Animations =====
function initScrollAnimations() {
    const elements = document.querySelectorAll('[data-animate]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('in-view');
                }, parseInt(delay));
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => observer.observe(el));
}

// ===== FAQ Accordion =====
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            faqItems.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            if (!isActive) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });
}

// ===== Counter Animation =====
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number[data-count]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-count'));
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    let current = 0;
    const duration = 2000;
    const startTime = Date.now();

    function update() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        current = Math.round(eased * target);
        element.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// ===== Smooth Scroll =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const pos = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: pos, behavior: 'smooth' });
            }
        });
    });
}
