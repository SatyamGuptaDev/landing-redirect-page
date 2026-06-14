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
    redirectBtn.addEventListener('click', () => {
        redirectBtn.style.transform = 'scale(0.96)';
        redirectBtn.style.opacity = '0.8';
        
        setTimeout(() => {
            window.location.href = finalUrl;
        }, 150);
    });
});
