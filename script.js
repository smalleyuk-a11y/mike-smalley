document.addEventListener('DOMContentLoaded', () => {
    
    // Define mobile as any screen width under 768px
    const IS_MOBILE = window.innerWidth < 768; 

    function splitWords(element) {
        const content = element.innerHTML.trim();
        // Replacing multiple spaces with one, and <br> with a token
        const cleanedContent = content.replace(/\s+/g, ' ').replace(/(<br\s*\/?>)/gi, ' [BR] ');
        const wordsAndBreaks = cleanedContent.split(' ').filter(part => part.length > 0);

        const newHtml = wordsAndBreaks.map(part => {
            if (part === '[BR]') {
                return '<br>';
            } else {
                return `<span class="word-span">${part}</span>&nbsp;`;
            }
        }).join(''); 
        
        element.innerHTML = newHtml.trim().replace(/&nbsp;$/, ''); 
        return element.querySelectorAll('.word-span');
    }

    let lenis;
    if (!IS_MOBILE) {
        // Initialize Lenis smooth scrolling only on non-mobile
        lenis = new Lenis({
            duration: 2.1,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            touchMultiplier: 2,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        
        // Start the animation loop for Lenis
        requestAnimationFrame(raf);
    }
    
    // --- 2. SELECT & PREPARE ELEMENTS ---
    
    // Select all animated elements, including the new case study image
    const animatedElements = document.querySelectorAll('.project-image, .fade-element, .case-study-main-image'); 
    
    const heroH1 = document.querySelector('.hero .split-text');
    let heroWords = [];
    if (heroH1) {
        heroWords = splitWords(heroH1);
    }
    
    
    // --- 3. SCROLL EFFECT LOGIC (Handles ALL project sections) ---

    const handleScrollEffects = () => {
        const viewportHeight = window.innerHeight;

        // =============================================================
        // A. ALL PROJECT ELEMENTS (Scale In, but stay visible)
        // =============================================================
        animatedElements.forEach(element => {
            
            // Determine the container section based on the element's class
            let section;
            if (element.classList.contains('project-image') || element.classList.contains('fade-element')) {
                 // For homepage elements, use the containing section
                section = element.closest('.project-section'); 
            } else if (element.classList.contains('case-study-main-image')) {
                // For the case study image, use its container section 
                section = element.closest('.case-study-image-section'); 
            }
            
            if (!section) return;

            // Stop animations on mobile: set final state immediately
            if (IS_MOBILE) {
                if (element.classList.contains('fade-element')) {
                    element.style.opacity = 1; 
                }
                if (element.classList.contains('project-image') || element.classList.contains('case-study-main-image')) {
                    element.style.transform = `scale(1.0)`;
                }
                return; // Skip further calculations for mobile
            }

            // Non-mobile animation logic:
            const rect = section.getBoundingClientRect();
            
            const sectionCenterY = rect.top + (rect.height / 2);
            
            // Calculate scroll progress (0 when out of view (below), 1 when centered/above)
            const scrollProgress = Math.min(1, Math.max(0, (viewportHeight - sectionCenterY) / (viewportHeight / 2.5)));
            
            const progress = scrollProgress;
            
            // Apply opacity to fade-elements on homepage (text)
            if (element.classList.contains('fade-element')) {
                const currentOpacity = progress; 
                element.style.opacity = currentOpacity.toFixed(4); 
            }

            // Apply Scale ONLY to the images
            if (element.classList.contains('project-image') || element.classList.contains('case-study-main-image')) {
                let minScale = 0.85; // Default for homepage project images
                
                if (element.classList.contains('case-study-main-image')) {
                    // Initial scale adjusted to approx. 0.71 for ~1000px initial width on large screens
                    minScale = 0.71; 
                }

                const maxScale = 1.0;
                // Scale: minScale (below) to 1.0 (centered/above)
                const currentScale = minScale + (maxScale - minScale) * progress;
                element.style.transform = `scale(${currentScale.toFixed(4)})`;
            }
        });
    };

    // --- 4. Hero Title Fade-In Animation (Intersection Observer) ---
    
    if (!IS_MOBILE) {
        // Only run the hero animation logic if not on mobile
        const heroObserverOptions = {
            root: null,
            threshold: 0.5, 
            rootMargin: '0px'
        };

        const heroObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && heroWords.length > 0) {
                    heroWords.forEach((word, index) => {
                        setTimeout(() => {
                            word.classList.add('is-loaded');
                        }, index * 80); 
                    });
                    
                    observer.unobserve(entry.target);
                }
            });
        }, heroObserverOptions);

        const heroH1Check = document.querySelector('.hero .split-text');
        if (heroH1Check) {
            heroObserver.observe(heroH1Check);
        }
    } else {
        // On mobile, apply the final loaded state immediately to show the text
        if (heroWords.length > 0) {
            heroWords.forEach(word => {
                word.classList.add('is-loaded');
            });
        }
    }

    // --- 5. INITIAL RUN & SCROLL LISTENERS

    // Run once on load to set initial states for scroll elements (including final state for mobile)
    handleScrollEffects(); 
    
    // Attach scroll listener only if not mobile
    if (!IS_MOBILE && lenis) {
        lenis.on('scroll', handleScrollEffects); 
    }
    // Resize listener is always active to ensure correct layout and mobile detection logic (if needed)
    window.addEventListener('resize', handleScrollEffects);
});


// =============================================================
// NEW: jQuery Tilt Effect Implementation (Disabled on mobile)
// =============================================================

// This IIFE runs once the script loads, after jQuery is available
( function( $ ) {

	"use strict";

    // Re-declare IS_MOBILE within the scope, or use screen width check directly
    const IS_MOBILE = window.innerWidth < 768; 
    
    if (!IS_MOBILE) {
        // Include the image containers for tilt effect
		  $(".image-container").tilt({
            maxTilt: 5,
            perspective: 2500,
            easing: "cubic-bezier(.03,.98,.52,.99)",
            speed: 1200,
            glare: true,
            maxGlare: 0.2,
            scale: 1.04
        });
		
    }
      
}( jQuery ) );




