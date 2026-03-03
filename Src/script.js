/* ===================================
   Portfolio JS — Nicko R. Dalugdugan
   =================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ========== NAVIGATION ==========
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navLinkItems = document.querySelectorAll('.nav-links a:not(.nav-cv-btn)');

    // Scroll effect
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        updateActiveNav();
    });

    // Mobile toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    // Close mobile menu on link click
    navLinkItems.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });

    // Active nav based on scroll
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 200;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-links a[href="#${id}"]`);

            if (link) {
                if (scrollPos >= top && scrollPos < top + height) {
                    navLinkItems.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    }

    // ========== TYPING ANIMATION ==========
    const typedElement = document.querySelector('.typed-text');
    const titles = ['UI/UX Designer', 'Web Designer', 'Graphic Designer', 'Creative Thinker'];
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 80;

    function typeEffect() {
        const currentTitle = titles[titleIndex];

        if (isDeleting) {
            typedElement.textContent = currentTitle.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 40;
        } else {
            typedElement.textContent = currentTitle.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 80;
        }

        if (!isDeleting && charIndex === currentTitle.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
            typeSpeed = 400;
        }

        setTimeout(typeEffect, typeSpeed);
    }

    if (typedElement) {
        typeEffect();
    }

    // ========== PROJECT TABS FILTERING ==========
    const tabBtns = document.querySelectorAll('.tab-btn');
    const projectCards = document.querySelectorAll('.project-card');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active tab
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = 'none';
                    card.offsetHeight; // Trigger reflow
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // Fade-in animation keyframes
    const style = document.createElement('style');
    style.textContent = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
    document.head.appendChild(style);

    // ========== SCROLL REVEAL ==========
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ========== SKILL BARS ANIMATION ==========
    const skillBars = document.querySelectorAll('.skill-fill');

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.getAttribute('data-width');
                entry.target.style.width = width;
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => skillObserver.observe(bar));

    // ========== SMOOTH SCROLL ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ========== CONTACT FORM HANDLER ==========
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('.form-submit .btn');
            const originalText = btn.innerHTML;

            // Step 1: Loading State
            btn.disabled = true;
            btn.innerHTML = `
                <svg class="spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                Sending...
            `;
            btn.style.background = 'linear-gradient(135deg, #6366f1, #8b5cf6)';

            try {
                const formData = new FormData(contactForm);
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();

                if (result.success) {
                    // Step 2: Success State
                    btn.innerHTML = `
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20 6L9 17l-5-5"/>
                        </svg>
                        Message Sent!
                    `;
                    btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';

                    // Reset form
                    contactForm.reset();

                    // Step 3: Redirect after a brief pause
                    setTimeout(() => {
                        const redirectUrl = contactForm.querySelector('input[name="redirect"]').value;
                        window.location.href = redirectUrl || window.location.href;
                    }, 2000);
                } else {
                    throw new Error(result.message || 'Failed to send');
                }
            } catch (error) {
                console.error('Submission error:', error);
                btn.innerHTML = '❌ Error. Try again.';
                btn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            }
        });
    }

    // Add spin animation
    if (!document.getElementById('spinAnimation')) {
        const spinStyle = document.createElement('style');
        spinStyle.id = 'spinAnimation';
        spinStyle.textContent = `
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            .spin { animation: spin 1s linear infinite; }
        `;
        document.head.appendChild(spinStyle);
    }

    // ========== THEME TOGGLE ==========
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('portfolio-theme');

    // Apply saved theme on load
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'light') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('portfolio-theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('portfolio-theme', 'light');
        }
    });

    // ========== INITIAL ACTIVE NAV ==========
    updateActiveNav();

    // ========== PARTICLE BACKGROUND ==========
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const colors = ['#1CA7EC', '#4ADEDE', '#7BD5F5', '#787FF6', '#1F2F9B'];
    const particleCount = Math.min(80, Math.floor(window.innerWidth / 18));
    const particles = [];
    const mouse = { x: null, y: null };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * 0.8;
            this.speedY = (Math.random() - 0.5) * 0.8;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.opacity = Math.random() * 0.5 + 0.15;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Mouse interaction - particles gently drift away
            if (mouse.x !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    this.x += dx / dist * 1.5;
                    this.y += dy / dist * 1.5;
                }
            }

            // Wrap around edges
            if (this.x < -10) this.x = canvas.width + 10;
            if (this.x > canvas.width + 10) this.x = -10;
            if (this.y < -10) this.y = canvas.height + 10;
            if (this.y > canvas.height + 10) this.y = -10;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function connectParticles() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = '#1CA7EC';
                    ctx.globalAlpha = 0.08 * (1 - dist / 150);
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        ctx.globalAlpha = 1;
        requestAnimationFrame(animateParticles);
    }

    animateParticles();

    // ========== CHATBOT ==========
    const chatToggle = document.getElementById('chatbotToggle');
    const chatWindow = document.getElementById('chatbotWindow');
    const chatClose = document.getElementById('chatbotClose');
    const chatInput = document.getElementById('chatbotInput');
    const chatSend = document.getElementById('chatbotSend');
    const chatMessages = document.getElementById('chatbotMessages');
    const suggestions = document.querySelectorAll('.suggestion-btn');

    // Track which topics have been asked
    const askedTopics = new Set();

    // All available suggestion topics
    const allSuggestions = [
        { key: 'about', label: 'Who is Nicko?' },
        { key: 'skills', label: 'What are his skills?' },
        { key: 'projects', label: 'Show me his projects' },
        { key: 'experience', label: 'Work experience?' },
        { key: 'contact', label: 'How to contact him?' },
        { key: 'tools', label: 'What tools does he use?' },
        { key: 'education', label: 'Education?' },
        { key: 'available', label: 'Is he available for work?' },
        { key: 'cv', label: 'Download his CV' },
        { key: 'location', label: 'Where is he located?' },
        { key: 'language', label: 'Languages spoken?' },
    ];

    chatToggle.addEventListener('click', () => {
        chatWindow.classList.toggle('open');
    });

    chatClose.addEventListener('click', () => {
        chatWindow.classList.remove('open');
    });

    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    suggestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const q = btn.getAttribute('data-q');
            addUserMsg(btn.textContent);
            removeSuggestions();
            askedTopics.add(q);
            showTyping(() => {
                addBotMsg(getResponse(q));
                showRemainingSuggestions();
            });
        });
    });

    function sendMessage() {
        const msg = chatInput.value.trim();
        if (!msg) return;
        addUserMsg(msg);
        chatInput.value = '';
        removeSuggestions();
        const key = matchIntent(msg);
        askedTopics.add(key);
        showTyping(() => {
            addBotMsg(getResponse(key));
            showRemainingSuggestions();
        });
    }

    function removeSuggestions() {
        const existing = chatMessages.querySelectorAll('.chatbot-suggestions');
        existing.forEach(el => el.remove());
    }

    function showRemainingSuggestions() {
        const remaining = allSuggestions.filter(s => !askedTopics.has(s.key));
        if (remaining.length === 0) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'chatbot-suggestions';

        remaining.forEach(s => {
            const btn = document.createElement('button');
            btn.className = 'suggestion-btn';
            btn.textContent = s.label;
            btn.addEventListener('click', () => {
                addUserMsg(s.label);
                removeSuggestions();
                askedTopics.add(s.key);
                showTyping(() => {
                    addBotMsg(getResponse(s.key));
                    showRemainingSuggestions();
                });
            });
            wrapper.appendChild(btn);
        });

        chatMessages.appendChild(wrapper);
        scrollChat();
    }

    function addUserMsg(text) {
        const div = document.createElement('div');
        div.className = 'chat-msg user';
        div.innerHTML = `<p>${text}</p>`;
        chatMessages.appendChild(div);
        scrollChat();
    }

    function addBotMsg(html) {
        const div = document.createElement('div');
        div.className = 'chat-msg bot';
        div.innerHTML = html;
        chatMessages.appendChild(div);
        scrollChat();
    }

    function showTyping(callback) {
        const typing = document.createElement('div');
        typing.className = 'chatbot-typing';
        typing.innerHTML = '<span></span><span></span><span></span>';
        chatMessages.appendChild(typing);
        scrollChat();
        setTimeout(() => {
            typing.remove();
            callback();
        }, 800 + Math.random() * 600);
    }

    function scrollChat() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function matchIntent(msg) {
        const m = msg.toLowerCase();
        if (/skill|ability|capable|magaling/i.test(m)) return 'skills';
        if (/project|work|gawa|portfolio|featured/i.test(m)) return 'projects';
        if (/experience|intern|job|trabaho|employed/i.test(m)) return 'experience';
        if (/contact|email|phone|number|reach|message|hire/i.test(m)) return 'contact';
        if (/tool|software|tech|stack|figma|canva|photoshop|program/i.test(m)) return 'tools';
        if (/education|school|study|university|college|bulsu|course/i.test(m)) return 'education';
        if (/who|about|nicko|name|sino/i.test(m)) return 'about';
        if (/location|where|address|san|nasaan|bulacan/i.test(m)) return 'location';
        if (/hi|hello|hey|kumusta|uy|sup|yo|good/i.test(m)) return 'greeting';
        if (/download|cv|resume/i.test(m)) return 'cv';
        if (/available|open|hire|freelance|full.?time|remote/i.test(m)) return 'available';
        if (/language|english|filipino|tagalog/i.test(m)) return 'language';
        if (/thank|salamat|tnx|thanks/i.test(m)) return 'thanks';
        return 'unknown';
    }

    function getResponse(key) {
        const responses = {
            greeting: `<p>Hello! 👋 Welcome to Nicko's portfolio. How can I help you? Feel free to ask about his skills, projects, or how to get in touch!</p>`,
            about: `<p>Nicko Ronquillo Dalugdugan is a <strong>UI/UX Designer</strong> and 4th-year BS Mathematics (Computer Science) student at Bulacan State University. He's passionate about creating beautiful, user-centered digital experiences.</p>`,
            skills: `<p>Here are Nicko's key skills:</p>
                <ul>
                    <li>🎨 UI/UX Design — 100%</li>
                    <li>🖥️ Website Layout & Design — 88%</li>
                    <li>🎯 Prototyping & Wireframing — 87%</li>
                    <li>🌈 Color Theory & Composition — 85%</li>
                    <li>📐 Graphic Design — 82%</li>
                    <li>💻 Front-End Development — 70%</li>
                </ul>`,
            projects: `<p>Nicko's featured projects:</p>
                <ul>
                    <li>⭐ <strong>Food Ordering App</strong> — Full UI/UX design with user-centered approach</li>
                    <li>⭐ <strong>Game UI & Visual Assets</strong> — Pixel art sprites, animations & game interface</li>
                    <li>⭐ <strong>BIMS Redesign</strong> — System redesign for Philippine Batteries Inc (implemented!)</li>
                </ul>
                <p>He also has projects in graphic design, web design, and more. <a href="#projects">View all projects →</a></p>`,
            experience: `<p>Nicko's work experience:</p>
                <ul>
                    <li>🏢 <strong>UI/UX Design Intern</strong> at Philippine Batteries Inc (June–July 2025) — Redesigned their BIMS system</li>
                    <li>🎮 <strong>Game Designer</strong> — Created visual assets & UI for a game project</li>
                    <li>🌐 <strong>Web Designer</strong> — Designed CS Wizards Publication website for BulSU</li>
                </ul>`,
            contact: `<p>You can reach Nicko through:</p>
                <ul>
                    <li>📧 Email: <a href="mailto:nickodalugdugan27@gmail.com">nickodalugdugan27@gmail.com</a></li>
                    <li>📱 Phone: +63 9951214380</li>
                    <li>💼 <a href="https://www.linkedin.com/in/dalugdugan-nicko-7b8a4a313/" target="_blank">LinkedIn</a></li>
                    <li>🎨 <a href="https://www.behance.net/nickordalugdu" target="_blank">Behance</a></li>
                    <li>🐙 <a href="https://github.com/nckdlgdgn" target="_blank">GitHub</a></li>
                </ul>
                <p>Or use the <a href="#contact">contact form</a> to send a message directly!</p>`,
            tools: `<p>Nicko's toolkit:</p>
                <ul>
                    <li>🎨 <strong>Design:</strong> Figma, Canva, Adobe Photoshop, Aseprite</li>
                    <li>💻 <strong>Development:</strong> HTML, CSS, JavaScript, VSCode</li>
                    <li>🌐 <strong>Web Builders:</strong> Wix, Elementor</li>
                    <li>📝 <strong>Other:</strong> LaTeX, MATLAB, CapCut</li>
                </ul>`,
            education: `<p>📚 <strong>BS Mathematics Major in Computer Science</strong><br>Bulacan State University (2022 – Present)<br>4th year student specializing in web design, UI/UX principles, and front-end development.</p>`,
            location: `<p>📍 Nicko is based in <strong>Santa Maria, Bulacan, Philippines</strong>. He's open to remote work!</p>`,
            cv: `<p>You can download Nicko's CV directly! 👇</p><p><a href="CV(Nicko Ronquillo Dalugdugan-Designer).pdf" download>📄 Download CV</a></p>`,
            available: `<p>Yes! ✅ Nicko is currently <strong>open to work</strong> — both full-time and remote positions. He's also available for freelance projects. <a href="#contact">Get in touch!</a></p>`,
            language: `<p>Nicko speaks:</p><ul><li>🇬🇧 English</li><li>🇵🇭 Filipino (Tagalog)</li></ul>`,
            thanks: `<p>You're welcome! 😊 Let me know if you have any other questions about Nicko's work.</p>`,
            unknown: `<p>I'm not sure about that one! 🤔 Try asking about:</p>
                <ul>
                    <li>His <strong>skills</strong> or <strong>tools</strong></li>
                    <li>His <strong>projects</strong> or <strong>experience</strong></li>
                    <li>How to <strong>contact</strong> him</li>
                    <li>His <strong>education</strong> or <strong>availability</strong></li>
                </ul>`
        };
        return responses[key] || responses.unknown;
    }
});
