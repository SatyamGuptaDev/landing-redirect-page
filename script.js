document.addEventListener('DOMContentLoaded', () => {
    // ---- Theme Toggle Logic ----
    const themeToggle = document.getElementById('themeToggle');
    const iconSun = document.querySelector('.icon-sun');
    const iconMoon = document.querySelector('.icon-moon');
    
    // Check local storage or system preference
    let savedTheme = localStorage.getItem('zivox-theme');
    
    // Default to light if no saved theme
    if (!savedTheme) {
        savedTheme = 'light';
        localStorage.setItem('zivox-theme', 'light');
    }
    
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        iconSun.classList.add('hidden');
        iconMoon.classList.remove('hidden');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        iconMoon.classList.add('hidden');
        iconSun.classList.remove('hidden');
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('zivox-theme', newTheme);
        
        // Rotate animation on SVG for a cool effect
        themeToggle.querySelector('svg:not(.hidden)').style.transform = 'rotate(180deg)';
        
        setTimeout(() => {
            if (newTheme === 'light') {
                iconSun.classList.add('hidden');
                iconMoon.classList.remove('hidden');
            } else {
                iconMoon.classList.add('hidden');
                iconSun.classList.remove('hidden');
            }
            themeToggle.querySelectorAll('svg').forEach(svg => svg.style.transform = 'rotate(0deg)');
        }, 150);
    });

    // ---- Smooth Interactive Mouse Logic ----
    const cursorDot = document.getElementById('cursor-dot');
    const cursorBlob = document.getElementById('cursor-blob');
    
    // Position targets and currents
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    
    let dotX = mouseX;
    let dotY = mouseY;
    
    let blobX = mouseX;
    let blobY = mouseY;

    // Only activate on devices with fine pointer (mouse)
    if (window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Add hover effect to interactable elements
        const interactables = document.querySelectorAll('.interactable, button');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => cursorDot.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursorDot.classList.remove('hover'));
        });

        // Animation loop for buttery smooth interpolation (lerp)
        const animate = () => {
            // Lerp for the dot (fast)
            dotX += (mouseX - dotX) * 0.3;
            dotY += (mouseY - dotY) * 0.3;
            
            // Lerp for the blob (slow, trailing effect)
            blobX += (mouseX - blobX) * 0.05;
            blobY += (mouseY - blobY) * 0.05;
            
            cursorDot.style.transform = `translate(calc(-50% + ${dotX}px), calc(-50% + ${dotY}px))`;
            cursorBlob.style.transform = `translate(calc(-50% + ${blobX}px), calc(-50% + ${blobY}px))`;
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }

    // ---- Redirect & Copy Logic ----
    const copyBtn = document.getElementById('copyBtn');
    const copyText = document.getElementById('copyText');
    const copyIcon = document.querySelector('.copy-icon');
    const checkIcon = document.querySelector('.check-icon');

    const p1 = 'https://';
    const p2 = 'zivoxtv';
    const p3 = '.live';
    const finalUrl = p1 + p2 + p3;

    copyBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(p2 + p3);
            
            copyIcon.classList.add('hidden');
            checkIcon.classList.remove('hidden');
            copyText.textContent = 'Copied!';
            
            setTimeout(() => {
                checkIcon.classList.add('hidden');
                copyIcon.classList.remove('hidden');
                copyText.textContent = 'Copy';
            }, 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    });

    const redirectBtn = document.getElementById('redirectBtn');
    const redirectBtnBottom = document.getElementById('redirectBtnBottom');
    
    const handleRedirect = (btn) => {
        if (!btn) return;
        btn.style.transform = 'scale(0.96)';
        btn.style.opacity = '0.8';
        
        setTimeout(() => {
            window.location.href = finalUrl;
        }, 150);
    };

    redirectBtn.addEventListener('click', () => handleRedirect(redirectBtn));
    if (redirectBtnBottom) {
        redirectBtnBottom.addEventListener('click', () => handleRedirect(redirectBtnBottom));
    }

    // ---- 3D Tilt Effect ----
    const applyTilt = (card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    };

    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(applyTilt);

    // ---- Dynamic TMDB API Fetch with Premium Fallback Cache ----
    const fallbackMovies = [
        { title: 'Dune: Part Two', poster_path: '/1pdfLvkbY9ohJlCjQH2JGqqUT1e.jpg' },
        { title: 'Deadpool & Wolverine', poster_path: '/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg' },
        { title: 'Oppenheimer', poster_path: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg' },
        { title: 'The Dark Knight', poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg' },
        { title: 'Inception', poster_path: '/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg' },
        { title: 'Interstellar', poster_path: '/gEU2QlsUUHXjNpeX40VNDbZ0rB8.jpg' },
        { title: 'Spider-Man: Across the Spider-Verse', poster_path: '/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg' },
        { title: 'Avatar: The Way of Water', poster_path: '/t6HIqrHezINNdIyFSmYaG01xTay.jpg' }
    ];

    const fallbackTVShows = [
        { name: 'Breaking Bad', poster_path: '/ggFHVNu6YYI5L9pCfOacjizRGt.jpg' },
        { name: 'Stranger Things', poster_path: '/49WJfeN0moxb9IPfGn8m1MgzOzm.jpg' },
        { name: 'Game of Thrones', poster_path: '/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg' },
        { name: 'The Boys', poster_path: '/dzOXllMX3R7iX9O9kUjRk5P2X5J.jpg' },
        { name: 'House of the Dragon', poster_path: '/1X4h40fcBaqcg9cgEVLe3NMTuX.jpg' },
        { name: 'The Last of Us', poster_path: '/uKvVjHNqB5pSqWaWBsP5Q82PZ2o.jpg' },
        { name: 'Severance', poster_path: '/zEqyD0SBt6HL7W9JQoWwtd5Do1T.jpg' },
        { name: 'The Bear', poster_path: '/6gIjuH0Lz32u8bQO8KTwHya0q1m.jpg' }
    ];

    const renderCards = (container, items, fallbackText) => {
        container.innerHTML = '';
        items.slice(0, 15).forEach(item => {
            const title = item.title || item.name || fallbackText;
            const posterPath = item.poster_path;
            
            const card = document.createElement('div');
            card.className = 'poster-card interactable tilt-card';
            card.title = title;
            
            if (posterPath) {
                card.innerHTML = `
                    <img src="https://image.tmdb.org/t/p/w500${posterPath}" alt="${title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <div class="poster-fallback" style="display:none;">${title}</div>
                    <div class="poster-overlay"><div class="play-btn-small">▶</div></div>
                `;
            } else {
                card.innerHTML = `
                    <div class="poster-fallback">${title}</div>
                    <div class="poster-overlay"><div class="play-btn-small">▶</div></div>
                `;
            }
            
            card.addEventListener('click', () => handleRedirect(card));
            container.appendChild(card);
            applyTilt(card);
        });
    };

    const populateCarousel = async (url, containerId, fallbackText, fallbackData) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Set a timeout to abort fetch if it takes too long
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        try {
            const res = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);
            const data = await res.json();
            
            if (data && data.results && data.results.length > 0) {
                renderCards(container, data.results, fallbackText);
            } else {
                renderCards(container, fallbackData, fallbackText);
            }
        } catch (error) {
            console.warn(`API unavailable for ${fallbackText}. Falling back to cached premium assets.`);
            renderCards(container, fallbackData, fallbackText);
        }
    };

    populateCarousel('https://db.videasy.to/3/trending/movie/day', 'moviesCarousel', 'Movie', fallbackMovies);
    populateCarousel('https://db.videasy.to/3/trending/tv/day', 'tvCarousel', 'TV Show', fallbackTVShows);

    // ---- Live Counter Logic (Database-less synchronization) ----
    const userCountEl = document.getElementById('userCount');
    if (userCountEl) {
        const updateCounter = () => {
            const now = Date.now();
            const baseCount = 14204;
            
            // Generate continuous synchronized waves based on universal time
            // Slow wave: peaks every hour
            const slowWave = Math.sin(now / (3600000 / (2 * Math.PI))) * 800;
            // Medium wave: peaks every 5 minutes
            const mediumWave = Math.sin(now / (300000 / (2 * Math.PI))) * 150;
            // Fast wave: peaks every 15 seconds
            const fastWave = Math.sin(now / (15000 / (2 * Math.PI))) * 25;
            
            const currentCount = Math.floor(baseCount + slowWave + mediumWave + fastWave);
            userCountEl.textContent = currentCount.toLocaleString();
        };
        
        updateCounter();
        // Update every 3 seconds
        setInterval(updateCounter, 3000);
    }

    // ---- Email Capture Logic ----
    const emailForm = document.getElementById('emailForm');
    if (emailForm) {
        emailForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = emailForm.querySelector('.email-submit');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Securing...';
            submitBtn.style.opacity = '0.7';
            
            setTimeout(() => {
                submitBtn.textContent = 'Access Secured!';
                submitBtn.style.background = '#10B981';
                submitBtn.style.color = '#fff';
                submitBtn.style.opacity = '1';
                
                // Then redirect anyway to capture the traffic
                setTimeout(() => {
                    window.location.href = finalUrl;
                }, 1000);
            }, 1500);
        });
    }
});
