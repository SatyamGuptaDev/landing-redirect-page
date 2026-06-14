document.addEventListener('DOMContentLoaded', () => {

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
    const tiltCards = document.querySelectorAll('.tilt-card');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate rotation (max 10 degrees)
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });

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
