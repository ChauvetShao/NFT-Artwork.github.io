document.addEventListener('DOMContentLoaded', function() {
    // 滑块功能
    const initSlider = () => {
        const sliderTrack = document.querySelector('.slider-track');
        const slides = document.querySelectorAll('.slider-item');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');

        if (!sliderTrack || !slides.length || !prevBtn || !nextBtn) {
            console.log('Slider elements not found:', {
                track: sliderTrack,
                slides: slides,
                prevBtn: prevBtn,
                nextBtn: nextBtn
            });
            return; // 如果元素不存在，退出初始化
        }

        let currentSlide = 0;

        // 添加更新按钮显示状态的函数
        function updateButtonVisibility() {
            // 第一张图片时隐藏左箭头
            prevBtn.style.display = currentSlide === 0 ? 'none' : 'flex';
            // 最后一张图片时隐藏右箭头
            nextBtn.style.display = currentSlide === slides.length - 1 ? 'none' : 'flex';
        }

        function updateSlider() {
            const slideWidth = slides[0].offsetWidth;
            console.log('Sliding to:', currentSlide, 'Width:', slideWidth);
            sliderTrack.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
            updateButtonVisibility(); // 每次滑动后更新按钮状态
        }

        prevBtn.addEventListener('click', () => {
            console.log('Prev clicked');
            if (currentSlide > 0) {
                currentSlide--;
                updateSlider();
            }
        });

        nextBtn.addEventListener('click', () => {
            console.log('Next clicked');
            if (currentSlide < slides.length - 1) {
                currentSlide++;
                updateSlider();
            }
        });

        window.addEventListener('resize', updateSlider);
        updateSlider(); // 初始化时调用一次以设置正确的按钮状态
        console.log('Slider initialized successfully');
    };

    // 图片滚动功能
    const initImageScroll = () => {
        const imageContainer = document.getElementById('imageContainer');
        const images = document.querySelectorAll('.scroll-image');
        
        if (imageContainer && images.length) {
            console.log('Total images:', images.length);
            // 图片滚动相关代码...
        }
    };

    // 动画效果
    const initAnimations = () => {
        const animatedElements = document.querySelectorAll('.img-with-description, h2, h3, h4, h5, h6, p:not(.hero p)');
        
        if (animatedElements.length) {
            function checkScroll() {
                animatedElements.forEach(element => {
                    const elementTop = element.getBoundingClientRect().top;
                    const windowHeight = window.innerHeight;
                    
                    if (elementTop < windowHeight * 0.8) {
                        element.style.animation = 'slideUp 0.3s forwards';
                    }
                });
            }

            window.addEventListener('scroll', checkScroll);
            checkScroll(); // 初始检查
        }
    };

    // 点赞功能
    const initHeartButtons = () => {
        const heartBtns = document.querySelectorAll('.heart-btn');
        
        if (heartBtns.length) {
            heartBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    btn.classList.toggle('active');
                    const likeCount = btn.querySelector('.like-count');
                    const currentCount = parseInt(likeCount.textContent);
                    likeCount.textContent = btn.classList.contains('active') ? currentCount + 1 : currentCount - 1;
                });
            });
        }
    };

    // 初始化所有功能
    initSlider();
    initImageScroll();
    initAnimations();
    initHeartButtons();

    const imageContainer = document.getElementById('imageContainer');
    const images = document.querySelectorAll('.scroll-image');
    let currentIndex = 0;
    let isInViewport = false;
    let totalScrolled = 0;
    const scrollThreshold = 100; // Amount of scroll needed to switch images

    // Check if element is in viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    }

    window.addEventListener('scroll', function() {
        isInViewport = isElementInViewport(imageContainer);
    });

    window.addEventListener('wheel', function(e) {
        if (!isInViewport) return;

        e.preventDefault();
        totalScrolled += e.deltaY;

        if (Math.abs(totalScrolled) >= scrollThreshold) {
            if (totalScrolled > 0) {
                // Scrolling down
                if (currentIndex < images.length - 1) {
                    images[currentIndex].classList.remove('active');
                    currentIndex++;
                    images[currentIndex].classList.add('active');
                } else {
                    // At last image, allow normal scroll
                    window.scrollBy(0, e.deltaY);
                }
            } else {
                // Scrolling up
                if (currentIndex > 0) {
                    images[currentIndex].classList.remove('active');
                    currentIndex--;
                    images[currentIndex].classList.add('active');
                } else {
                    // At first image, allow normal scroll
                    window.scrollBy(0, e.deltaY);
                }
            }
            totalScrolled = 0;
        }
    }, { passive: false });
});