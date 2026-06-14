document.addEventListener('DOMContentLoaded', () => {
    // ---- Prevent search indexing on zivoxtv.live ----
    if (window.location.hostname === 'zivoxtv.live' || window.location.hostname === 'www.zivoxtv.live') {
        const robotsMeta = document.querySelector('meta[name="robots"]');
        if (robotsMeta) {
            robotsMeta.setAttribute('content', 'noindex, nofollow');
        } else {
            const meta = document.createElement('meta');
            meta.name = 'robots';
            meta.content = 'noindex, nofollow';
            document.head.appendChild(meta);
        }
    }

    // ---- Theme Toggle Logic ----
    const themeToggle = document.getElementById('themeToggle');
    const iconSun = document.querySelector('.icon-sun');
    const iconMoon = document.querySelector('.icon-moon');
    
    // Check local storage or system preference
    let savedTheme = localStorage.getItem('zivox-theme');
    
    // Default to dark if no saved theme
    if (!savedTheme) {
        savedTheme = 'dark';
        localStorage.setItem('zivox-theme', 'dark');
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
        { title: 'Dune: Part Two', poster_path: '/1pdfLvkbY9ohJlCjQH2JGqqUT1e.jpg', vote_average: 8.3, release_date: '2024-02-27' },
        { title: 'Deadpool & Wolverine', poster_path: '/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg', vote_average: 7.9, release_date: '2024-07-24' },
        { title: 'Oppenheimer', poster_path: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', vote_average: 8.1, release_date: '2023-07-19' },
        { title: 'The Dark Knight', poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg', vote_average: 8.5, release_date: '2008-07-16' },
        { title: 'Inception', poster_path: '/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg', vote_average: 8.4, release_date: '2010-07-15' },
        { title: 'Interstellar', poster_path: '/gEU2QlsUUHXjNpeX40VNDbZ0rB8.jpg', vote_average: 8.4, release_date: '2014-11-05' },
        { title: 'Spider-Man: Across the Spider-Verse', poster_path: '/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg', vote_average: 8.3, release_date: '2023-05-31' },
        { title: 'Avatar: The Way of Water', poster_path: '/t6HIqrHezINNdIyFSmYaG01xTay.jpg', vote_average: 7.6, release_date: '2022-12-14' }
    ];

    const fallbackTVShows = [
        { name: 'Breaking Bad', poster_path: '/ggFHVNu6YYI5L9pCfOacjizRGt.jpg', vote_average: 8.9, first_air_date: '2008-01-20' },
        { name: 'Stranger Things', poster_path: '/49WJfeN0moxb9IPfGn8m1MgzOzm.jpg', vote_average: 8.6, first_air_date: '2016-07-15' },
        { name: 'Game of Thrones', poster_path: '/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg', vote_average: 8.4, first_air_date: '2011-04-17' },
        { name: 'The Boys', poster_path: '/dzOXllMX3R7iX9O9kUjRk5P2X5J.jpg', vote_average: 8.5, first_air_date: '2019-07-25' },
        { name: 'House of the Dragon', poster_path: '/1X4h40fcBaqcg9cgEVLe3NMTuX.jpg', vote_average: 8.4, first_air_date: '2022-08-21' },
        { name: 'The Last of Us', poster_path: '/uKvVjHNqB5pSqWaWBsP5Q82PZ2o.jpg', vote_average: 8.6, first_air_date: '2023-01-15' },
        { name: 'Severance', poster_path: '/zEqyD0SBt6HL7W9JQoWwtd5Do1T.jpg', vote_average: 8.4, first_air_date: '2022-02-17' },
        { name: 'The Bear', poster_path: '/6gIjuH0Lz32u8bQO8KTwHya0q1m.jpg', vote_average: 8.3, first_air_date: '2022-06-23' }
    ];

    const fallbackHindi = [
        { title: 'Jawan', poster_path: '/1H8y4a57fU4nBY6v5u6tEqRrKPP.jpg', vote_average: 7.2, release_date: '2023-09-07' },
        { title: 'Pathaan', poster_path: '/m1ByFn571SS4jSC562qf0S5Xm90.jpg', vote_average: 6.8, release_date: '2023-01-25' },
        { title: 'RRR', poster_path: '/kdZ79gtElcnUBcr786eAju4Nn6Q.jpg', vote_average: 7.8, release_date: '2022-03-24' },
        { title: '3 Idiots', poster_path: '/6HN78tP1Vw8E18W93b6YEq28O5m.jpg', vote_average: 8.0, release_date: '2009-12-23' },
        { title: 'Dangal', poster_path: '/7m3X59rYp9e5bS1rS0Y3R54N96B.jpg', vote_average: 8.0, release_date: '2016-12-21' },
        { title: 'Sholay', poster_path: '/215h7H403J3aL72n3W65C3q3D5S.jpg', vote_average: 8.2, release_date: '1975-08-15' },
        { title: 'Sacred Games', name: 'Sacred Games', poster_path: '/i72Xn6w5bS3jNlWkY8a6C3q2D5S.jpg', vote_average: 7.6, first_air_date: '2018-07-06' },
        { title: 'Mirzapur', name: 'Mirzapur', poster_path: '/7cX4gW5bSm98jO9wY6a7C3q3D5S.jpg', vote_average: 7.9, first_air_date: '2018-11-16' }
    ];

    const fallbackClassics = [
        { title: 'The Godfather', poster_path: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', vote_average: 8.7, release_date: '1972-03-14' },
        { title: 'The Shawshank Redemption', poster_path: '/9cqNxxWXNDOBPZXeAcTlsCv02Y4.jpg', vote_average: 8.7, release_date: '1994-09-23' },
        { title: 'Pulp Fiction', poster_path: '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', vote_average: 8.5, release_date: '1994-09-10' },
        { title: 'Forrest Gump', poster_path: '/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg', vote_average: 8.5, release_date: '1994-06-23' },
        { title: 'Fight Club', poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', vote_average: 8.4, release_date: '1999-10-15' },
        { title: 'Goodfellas', poster_path: '/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg', vote_average: 8.5, release_date: '1990-09-12' },
        { title: 'The Matrix', poster_path: '/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', vote_average: 8.2, release_date: '1999-03-30' },
        { title: 'City of God', poster_path: '/k7eYdWvhYQyRQoU233Aqlqf8qT.jpg', vote_average: 8.4, release_date: '2002-08-30' }
    ];

    const fallbackKorean = [
        { name: 'Squid Game', poster_path: '/dDlEmu3EZ0Pgg93K2SVNlcjCsJI.jpg', vote_average: 7.8, first_air_date: '2021-09-17' },
        { name: 'All of Us Are Dead', poster_path: '/pTEFqAjLd5YTsMD6NSUxV5D2TXz.jpg', vote_average: 8.3, first_air_date: '2022-01-28' },
        { name: 'Crash Landing on You', poster_path: '/vHqAenL9vM1L8lH9r1P2aMv2Wc0.jpg', vote_average: 8.7, first_air_date: '2019-12-14' },
        { title: 'Parasite', poster_path: '/7IiVWcChQWqWGPqC1yUr298E2k4.jpg', vote_average: 8.5, release_date: '2019-05-30' },
        { title: 'Train to Busan', poster_path: '/1aomvKOLXkIB1X5Bw0jU4155a5b.jpg', vote_average: 7.8, release_date: '2016-07-20' }
    ];

    const fallbackAnime = [
        { name: 'Attack on Titan', poster_path: '/hTP1DtLWHlNIGhXQ06XJb419Hdb.jpg', vote_average: 8.6, first_air_date: '2013-04-07' },
        { name: 'Demon Slayer', poster_path: '/xUfRZu2mi8jH6SnDTRVDpWtzIic.jpg', vote_average: 8.4, first_air_date: '2019-04-06' },
        { name: 'Jujutsu Kaisen', poster_path: '/hK0sB5pM9g4I0eK1LwKk8KjLgN.jpg', vote_average: 8.5, first_air_date: '2020-10-03' },
        { name: 'Naruto Shippuden', poster_path: '/zAYRe2bJxpWTVrwwmBc00VFkAf4.jpg', vote_average: 8.6, first_air_date: '2007-02-15' },
        { name: 'One Piece', poster_path: '/e3NBGiAifW9ScO8D7C8I6q1I5n3.jpg', vote_average: 8.7, first_air_date: '1999-10-20' }
    ];

    const fallbackSpanish = [
        { name: 'Money Heist', poster_path: '/reEMJA1uzscCbkpeRJeTMCi2B5Z.jpg', vote_average: 8.2, first_air_date: '2017-05-02' },
        { name: 'Elite', poster_path: '/3NTAbAiaoCEJUeqzpeVN8DIFD1N.jpg', vote_average: 8.1, first_air_date: '2018-10-05' },
        { title: 'Society of the Snow', poster_path: '/9b2p0S0h0BqZ1wX7Q4D4cO1J9dZ.jpg', vote_average: 8.0, release_date: '2023-12-14' },
        { title: 'The Platform', poster_path: '/8ZX18BEEpA93XGjJbY2C1a9TpJ.jpg', vote_average: 7.0, release_date: '2019-11-08' },
        { title: 'Pan\'s Labyrinth', poster_path: '/AXXiT0R4gE7vB7tWj6f9B2QpE5V.jpg', vote_average: 7.8, release_date: '2006-10-11' }
    ];

    const renderCards = (container, items, fallbackText) => {
        container.innerHTML = '';
        items.slice(0, 15).forEach(item => {
            const title = item.title || item.name || fallbackText;
            const posterPath = item.poster_path;
            const rating = item.vote_average ? item.vote_average.toFixed(1) : '8.0';
            const rawDate = item.release_date || item.first_air_date || '';
            const year = rawDate ? rawDate.split('-')[0] : '2024';
            
            const card = document.createElement('div');
            card.className = 'poster-card interactable tilt-card';
            card.title = title;
            
            let imageHTML = '';
            if (posterPath) {
                imageHTML = `<img src="https://image.tmdb.org/t/p/w500${posterPath}" alt="${title}" onerror="this.style.display='none';">`;
            } else {
                imageHTML = `<div class="poster-fallback-img">${title}</div>`;
            }

            card.innerHTML = `
                ${imageHTML}
                <div class="play-btn-overlay">▶</div>
                <div class="poster-info-overlay">
                    <div class="poster-text-content">
                        <h3 class="poster-title">${title}</h3>
                        <div class="poster-meta">
                            <span class="rating">⭐ ${rating}</span>
                            <span class="dot">•</span>
                            <span class="year">${year}</span>
                        </div>
                    </div>
                </div>
            `;
            
            card.addEventListener('click', () => handleRedirect(card));
            container.appendChild(card);
            applyTilt(card);
        });
    };

    const populateCarousel = async (url, containerId, fallbackText, fallbackData) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Check localStorage Cache (cache for 1 hour = 3600000 ms)
        const cacheKey = `zivox_cache_${containerId}`;
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            try {
                const parsed = JSON.parse(cached);
                const isFresh = (Date.now() - parsed.timestamp) < 3600000;
                if (isFresh && parsed.data && parsed.data.length > 0) {
                    renderCards(container, parsed.data, fallbackText);
                    return;
                }
            } catch (e) {
                localStorage.removeItem(cacheKey);
            }
        }

        // Set a timeout to abort fetch if it takes too long
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        try {
            const res = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);
            const data = await res.json();
            
            if (data && data.results && data.results.length > 0) {
                renderCards(container, data.results, fallbackText);
                // Save to cache
                localStorage.setItem(cacheKey, JSON.stringify({
                    timestamp: Date.now(),
                    data: data.results
                }));
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
    populateCarousel('https://db.videasy.to/3/discover/movie?with_original_language=hi&sort_by=popularity.desc', 'hindiCarousel', 'Hindi Hit', fallbackHindi);
    populateCarousel('https://db.videasy.to/3/movie/top_rated', 'classicsCarousel', 'Classic', fallbackClassics);
    populateCarousel('https://db.videasy.to/3/discover/tv?with_original_language=ko&sort_by=popularity.desc', 'koreanCarousel', 'Korean Hit', fallbackKorean);
    populateCarousel('https://db.videasy.to/3/discover/tv?with_original_language=ja&with_genres=16&sort_by=popularity.desc', 'animeCarousel', 'Anime', fallbackAnime);
    populateCarousel('https://db.videasy.to/3/discover/movie?with_original_language=es&sort_by=popularity.desc', 'spanishCarousel', 'Spanish Hit', fallbackSpanish);

    // ---- Live Counter Logic (Database-less synchronization) ----
    const userCountEl = document.getElementById('userCount');
    if (userCountEl) {
        const updateCounter = () => {
            const now = Date.now();
            const timeInterval = Math.floor(now / 5000); // changes every 5s
            
            // Generate a realistic daily curve based on UTC hour.
            // Peak traffic around UTC 20:00 (evening for many).
            const dailyWave = Math.cos((now - 20 * 3600000) / 86400000 * Math.PI * 2) * 2000 + 4500; // Fluctuate smoothly between 2500 and 6500
            
            // Add short-term deterministic pseudo-random noise to make it look "live"
            const noise1 = Math.sin(timeInterval * 12.34) * 350;
            const noise2 = Math.cos(timeInterval * 7.89) * 120;
            const noise3 = Math.sin(timeInterval * 4.56) * 45;
            
            // Total calculation keeps it tightly within the 2k - 7k realistic range
            const currentCount = Math.floor(dailyWave + noise1 + noise2 + noise3);
            userCountEl.textContent = currentCount.toLocaleString();
        };
        
        updateCounter();
        // Update every 5 seconds to match the interval
        setInterval(updateCounter, 5000);
    }

});
