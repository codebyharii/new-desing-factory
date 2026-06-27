document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    AOS.init({
        duration: 800,
        once: true,
        offset: 100,
    });

    // Sticky Header Logic
    const header = document.querySelector('.header-glass');
    
    window.addEventListener('scroll', () => {
        if (header) {
            if (window.scrollY > 150) {
                header.style.position = 'fixed';
                header.style.top = '0';
                header.style.background = 'rgba(0,0,0,0.8)';
            } else {
                header.style.position = 'fixed';
                header.style.top = '0';
                header.style.background = 'transparent';
            }
        }
    });

    // Mock Countdown Timer (Target: 11th Aug)
    const updateCountdown = () => {
        let secsEl = document.getElementById('secs');
        if(!secsEl) return;
        
        let secs = parseInt(secsEl.innerText);
        let mins = parseInt(document.getElementById('mins').innerText);
        let hours = parseInt(document.getElementById('hours').innerText);
        
        secs--;
        if (secs < 0) {
            secs = 59;
            mins--;
            if (mins < 0) {
                mins = 59;
                hours--;
            }
        }

        document.getElementById('secs').innerText = secs < 10 ? '0' + secs : secs;
        document.getElementById('mins').innerText = mins < 10 ? '0' + mins : mins;
        document.getElementById('hours').innerText = hours < 10 ? '0' + hours : hours;
    };
    
    setInterval(updateCountdown, 1000);

    /* =======================================
       AWWWARDS HERO SECTION LOGIC
       ======================================= */
    const products = [
        {
            title: "Gift Tags<br>Without trying",
            desc: "It's not just about styling gifts. It's about stepping outside and instantly feeling confident, comfortable, and completely yourself. Designed to elevate even the simplest gifts, this tag wraps you in lightweight warmth.",
            img: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
            priceCurrent: "RS. 350",
            priceOld: "RS. 499",
            quote: "Confidence,<br>wrapped in warmth",
            color: "#d36a30" // Warm orange
        },
        {
            title: "Envelopes<br>Seal with love",
            desc: "Our premium envelopes are crafted to leave a lasting impression. Whether it's an invitation, a letter, or a simple note, these envelopes add a touch of elegance and sophistication to your message.",
            img: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80",
            priceCurrent: "RS. 250",
            priceOld: "RS. 350",
            quote: "Elegance,<br>delivered safely",
            color: "#4a7b59" // Elegant green
        },
        {
            title: "Sipper Bottles<br>Stay Hydrated",
            desc: "Take your hydration game to the next level. Our sipper bottles are not just functional but a statement piece. Perfect for the gym, office, or your daily commute.",
            img: "https://images.unsplash.com/photo-1628157588553-5eeea00af15c?auto=format&fit=crop&w=800&q=80",
            priceCurrent: "RS. 899",
            priceOld: "RS. 1299",
            quote: "Hydration,<br>on the go",
            color: "#3b5998" // Deep blue
        }
    ];

    let currentIndex = 0;
    let isAnimating = false;

    // DOM Elements
    const heroBgColor = document.getElementById('heroBgColor');
    const heroTitle = document.getElementById('heroTitle');
    const heroDesc = document.getElementById('heroDesc');
    const activeImg = document.getElementById('activeImg');
    const centerQuote = document.getElementById('centerQuote');
    const priceCurrent = document.getElementById('priceCurrent');
    const priceOld = document.getElementById('priceOld');
    const previewImg = document.getElementById('previewImg');
    const activeImgContainer = document.getElementById('activeImgContainer');
    const previewContainer = document.getElementById('previewContainer');

    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');

    gsap.registerPlugin(ScrollTrigger);

    function changeSlide(direction) {
        if (isAnimating) return;
        isAnimating = true;

        const nextIndex = (currentIndex + direction + products.length) % products.length;
        const nextData = products[nextIndex];
        const previewNextIndex = (nextIndex + 1) % products.length;

        // Get the current DOM elements for the images
        const currentActiveImg = activeImgContainer.querySelector('img');
        const currentPreviewImg = previewContainer.querySelector('img');

        const tl = gsap.timeline({
            onComplete: () => {
                if (currentActiveImg) currentActiveImg.remove();
                currentIndex = nextIndex;
                isAnimating = false;
            }
        });

        // 1. Text Exit Animations (Slide out window)
        tl.to([heroTitle, heroDesc, centerQuote, priceCurrent, priceOld], {
            y: "-100%",
            opacity: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.in"
        }, 0);

        // 2. Active Image Exit (Shrink, move down-right, fade out)
        if (currentActiveImg) {
            tl.to(currentActiveImg, {
                scale: 0.5,
                x: 150,
                y: 100,
                opacity: 0,
                duration: 0.8,
                ease: "power3.inOut"
            }, 0);
        }

        // 3. Background Color Morph
        tl.to(heroBgColor, {
            backgroundColor: nextData.color,
            duration: 0.8,
            ease: "power3.inOut"
        }, 0);

        // 4. FLIP Animation: Preview -> Active
        if (currentPreviewImg) {
            // Record state
            const state = Flip.getState(currentPreviewImg);
            
            // Move to new parent and update class
            activeImgContainer.appendChild(currentPreviewImg);
            currentPreviewImg.className = 'active-product-img';
            currentPreviewImg.id = 'activeImg'; // keep id consistent
            
            // Let FLIP handle the movement
            tl.add(Flip.from(state, {
                duration: 0.8,
                ease: "power3.inOut",
                absolute: true,
                props: "borderRadius",
                zIndex: 10
            }), 0);
        }

        // 5. Prepare New Preview Image
        const newPreviewImg = document.createElement('img');
        newPreviewImg.src = products[previewNextIndex].img;
        newPreviewImg.className = 'preview-img';
        newPreviewImg.id = 'previewImg';
        newPreviewImg.alt = "Preview";
        previewContainer.appendChild(newPreviewImg);
        
        // Set initial state for new preview (hidden, pushed down and scaled down)
        gsap.set(newPreviewImg, { y: 50, opacity: 0, scale: 0.8 });

        // Midpoint Text Swap
        tl.call(() => {
            heroTitle.innerHTML = nextData.title;
            heroDesc.innerHTML = nextData.desc;
            centerQuote.innerHTML = nextData.quote;
            priceCurrent.innerHTML = nextData.priceCurrent;
            priceOld.innerHTML = nextData.priceOld;
            
            // Reset text positions for entrance (bottom window)
            gsap.set([heroTitle, heroDesc, centerQuote, priceCurrent, priceOld], { y: "100%" });
        }, null, 0.4);

        // 6. Text Entrance Animations
        tl.to([heroTitle, heroDesc, centerQuote, priceCurrent, priceOld], {
            y: "0%",
            opacity: 1,
            duration: 0.5,
            stagger: 0.05,
            ease: "power2.out"
        }, 0.4);

        // 7. New Preview Entrance
        tl.to(newPreviewImg, {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: "power3.out"
        }, 0.5);
    }

    let autoplayInterval;

    function startAutoplay() {
        stopAutoplay(); // Clear existing interval just in case
        autoplayInterval = setInterval(() => {
            changeSlide(1);
        }, 3000);
    }

    function stopAutoplay() {
        if(autoplayInterval) clearInterval(autoplayInterval);
    }

    if(nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            changeSlide(1);
            startAutoplay(); // Reset timer on manual click
        });
        prevBtn.addEventListener('click', () => {
            changeSlide(-1);
            startAutoplay(); // Reset timer on manual click
        });
    }

    // Start autoplay initially
    startAutoplay();


    /* =======================================
       OTHER GSAP ANIMATIONS
       ======================================= */
    gsap.from(".bestseller-card", {
        scrollTrigger: {
            trigger: ".dynamic-products",
            start: "top 80%"
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out"
    });

    gsap.from(".feature-item", {
        scrollTrigger: {
            trigger: ".footer-features",
            start: "top 90%"
        },
        scale: 0.8,
        opacity: 0,
        duration: 0.5,
        stagger: 0.15,
        ease: "back.out(1.7)"
    });

    /* =======================================
       NAVBAR ACTIVE CLASS LOGIC
       ======================================= */
    const navLinks = document.querySelectorAll('.nav-links-pill a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remove active class from all links
            navLinks.forEach(nav => nav.classList.remove('active-pill'));
            // Add active class to the clicked link
            this.classList.add('active-pill');
        });
    });

    /* =======================================
       VISION BOARD CAROUSEL LOGIC
       ======================================= */
    const carouselTrack = document.getElementById('carouselTrack');
    const carNextBtn = document.getElementById('carNext');
    const carPrevBtn = document.getElementById('carPrev');
    
    if (carouselTrack && carNextBtn && carPrevBtn) {
        let currentCarIndex = 0;
        const cards = document.querySelectorAll('.carousel-card');
        const cardWidth = 360; // 320px width + 40px gap

        carNextBtn.addEventListener('click', () => {
            if (currentCarIndex < cards.length - 1) { 
                currentCarIndex++;
                gsap.to(carouselTrack, {
                    x: -(currentCarIndex * cardWidth),
                    duration: 0.8,
                    ease: "power3.inOut"
                });
            }
        });

        carPrevBtn.addEventListener('click', () => {
            if (currentCarIndex > 0) {
                currentCarIndex--;
                gsap.to(carouselTrack, {
                    x: -(currentCarIndex * cardWidth),
                    duration: 0.8,
                    ease: "power3.inOut"
                });
            }
        });
        
        // Initial intro animation for the carousel
        gsap.from(".vision-carousel-section", {
            scrollTrigger: {
                trigger: ".vision-carousel-section",
                start: "top 75%"
            },
            y: 100,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
        
        gsap.from(".carousel-card", {
            scrollTrigger: {
                trigger: ".vision-carousel-section",
                start: "top 60%"
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "back.out(1.5)"
        });

        /* Detail View Animation Logic */
        gsap.registerPlugin(Flip);

        const readMoreBtns = document.querySelectorAll('.read-more');
        const detailContainer = document.getElementById('detailViewContainer');
        const detailBg = document.getElementById('detailBg');
        const detailImgBox = document.getElementById('detailImgBox');
        const detailImg = document.getElementById('detailImg');
        const detailTitle = document.getElementById('detailTitle');
        const detailSubtitle = document.getElementById('detailSubtitle');
        const detailDesc = document.getElementById('detailDesc');
        const closeDetail = document.getElementById('closeDetail');
        const carouselWrapper = document.querySelector('.carousel-wrapper');
        const carouselFooter = document.querySelector('.carousel-footer');
        const detailTextBox = document.querySelector('.detail-text-box');

        let activeCard = null;
        let activeCardImg = null;

        readMoreBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                activeCard = e.target.closest('.carousel-card');
                activeCardImg = activeCard.querySelector('.card-img-wrapper');
                
                // Extract Data
                const bgColors = activeCard.dataset.bgColor;
                const imgSrc = activeCard.dataset.img;
                const title = activeCard.dataset.title;
                const subtitle = activeCard.dataset.subtitle;
                const desc = activeCard.dataset.desc;

                // Set Detail Data
                detailBg.style.background = bgColors;
                detailImg.src = imgSrc;
                detailTitle.innerHTML = title;
                detailSubtitle.innerHTML = subtitle;
                detailDesc.innerHTML = desc;

                // Hide Carousel Elements
                gsap.to([carouselWrapper, carouselFooter], { opacity: 0, duration: 0.3, onComplete: () => {
                    carouselWrapper.style.visibility = 'hidden';
                    carouselFooter.style.visibility = 'hidden';
                }});

                // Get initial state for FLIP
                const stateBg = Flip.getState(activeCard);
                const stateImg = Flip.getState(activeCardImg);

                // Prepare Detail View
                detailContainer.classList.add('active');
                
                // We fake the FLIP by animating from the card's bounding box
                const cardRect = activeCard.getBoundingClientRect();
                const imgRect = activeCardImg.getBoundingClientRect();
                
                // Hide actual detail bg and img initially
                gsap.set(detailBg, { 
                    width: cardRect.width, 
                    height: cardRect.height, 
                    top: cardRect.top, 
                    left: cardRect.left, 
                    position: 'fixed',
                    borderRadius: '40px'
                });
                
                gsap.set(detailImg, {
                    width: imgRect.width,
                    height: imgRect.height,
                    top: imgRect.top,
                    left: imgRect.left,
                    position: 'fixed',
                    x: 0,
                    transform: 'none',
                    borderRadius: '20px'
                });
                
                gsap.set(detailTextBox, { opacity: 0, x: 50 });
                gsap.set(closeDetail, { opacity: 0 });

                // Animate to full size
                const tl = gsap.timeline();
                
                tl.to(detailBg, {
                    width: '90%',
                    height: '80%',
                    top: 'auto',
                    bottom: '0',
                    left: '5%',
                    position: 'absolute',
                    duration: 0.8,
                    ease: "power3.inOut"
                }, 0);

                tl.to(detailImg, {
                    width: '80%',
                    height: '120%',
                    top: 'auto',
                    bottom: '0',
                    left: '50%',
                    x: '-50%',
                    position: 'absolute',
                    borderRadius: '30px',
                    duration: 0.8,
                    ease: "power3.inOut"
                }, 0);

                tl.to(detailTextBox, {
                    opacity: 1,
                    x: 0,
                    duration: 0.5,
                    ease: "power2.out"
                }, 0.5);

                tl.to(closeDetail, {
                    opacity: 1,
                    duration: 0.3
                }, 0.6);
            });
        });

        closeDetail.addEventListener('click', () => {
            if (!activeCard) return;

            const cardRect = activeCard.getBoundingClientRect();
            const imgRect = activeCardImg.getBoundingClientRect();

            const tl = gsap.timeline({
                onComplete: () => {
                    detailContainer.classList.remove('active');
                    carouselWrapper.style.visibility = 'visible';
                    carouselFooter.style.visibility = 'visible';
                    gsap.to([carouselWrapper, carouselFooter], { opacity: 1, duration: 0.3 });
                }
            });

            tl.to(closeDetail, { opacity: 0, duration: 0.2 }, 0);
            tl.to(detailTextBox, { opacity: 0, x: 50, duration: 0.3 }, 0);

            tl.to(detailBg, {
                width: cardRect.width,
                height: cardRect.height,
                top: cardRect.top,
                left: cardRect.left,
                bottom: 'auto',
                position: 'fixed',
                duration: 0.6,
                ease: "power3.inOut"
            }, 0.2);

            tl.to(detailImg, {
                width: imgRect.width,
                height: imgRect.height,
                top: imgRect.top,
                left: imgRect.left,
                bottom: 'auto',
                x: 0,
                position: 'fixed',
                borderRadius: '20px',
                duration: 0.6,
                ease: "power3.inOut"
            }, 0.2);
        });
    }

    /* =======================================
       BENTO BOX ABOUT SECTION ANIMATION
       ======================================= */
    gsap.from(".bento-box", {
        scrollTrigger: {
            trigger: ".about-bento-section",
            start: "top 75%"
        },
        y: 80,
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.2)"
    });
});
