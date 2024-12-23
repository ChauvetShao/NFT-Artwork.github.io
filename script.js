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
        const images = Array.from(document.querySelectorAll('.scroll-image'));
        let currentImageIndex = 0;
        let isTransitioning = false;
        const topThreshold = 300;
        let hasReachedEnd = false;

        function switchImage(direction) {
            if (isTransitioning) return;
            
            isTransitioning = true;
            images[currentImageIndex].classList.remove('active');
            
            if (direction === 'next' && currentImageIndex < images.length - 1) {
                currentImageIndex++;
            } else if (direction === 'prev' && currentImageIndex > 0) {
                currentImageIndex--;
            }

            images[currentImageIndex].classList.add('active');
            
            // 检查是否到达最后一张
            hasReachedEnd = currentImageIndex === images.length - 1;

            setTimeout(() => {
                isTransitioning = false;
            }, 500);
        }

        function handleWheel(e) {
            const containerRect = imageContainer.getBoundingClientRect();
            
            // 如果已经滚动过最后一张图片，允许正常滚动
            if (hasReachedEnd && e.deltaY > 0) {
                return;
            }

            // 如果在阈值范围内
            if (containerRect.top <= topThreshold) {
                if (e.deltaY > 0 && currentImageIndex < images.length - 1) {
                    e.preventDefault();
                    switchImage('next');
                } else if (e.deltaY < 0 && currentImageIndex > 0) {
                    e.preventDefault();
                    switchImage('prev');
                }
            }
        }

        // 初始化第一张图片
        images[0].classList.add('active');

        // 添加事件监听
        window.addEventListener('wheel', handleWheel, { passive: false });
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

    // 图片滚动相关变量和功能
    const scrollState = {
        currentIndex: 0,
        isTransitioning: false,
        hasCompletedCarousel: false,
        scrollThreshold: 50,
        accumulatedDelta: 0,
        transitionDuration: 500,
        isAtBottom: false // 新增：标记是否到达底部
    };

    function checkPosition(container) {
        const rect = container.getBoundingClientRect();
        const containerBottom = rect.bottom;
        const viewportBottom = window.innerHeight;
        
        // 检查容器底部是否接近视口底部（允许5px误差）
        return Math.abs(containerBottom - viewportBottom) < 5;
    }

    // 步骤滑块相关变量和函数
    const stepsSlider = {
        track: document.querySelector('.steps-track'),
        items: document.querySelectorAll('.step-item'),
        currentIndex: 0,
        isAnimating: false
    };

    function updateStepsSlider() {
        if (!stepsSlider.track || !stepsSlider.items.length) return;

        // Remove active class from all items
        stepsSlider.items.forEach(item => item.classList.remove('active'));
        
        // Add active class to current item
        stepsSlider.items[stepsSlider.currentIndex].classList.add('active');
        
        // Calculate translation
        const itemWidth = stepsSlider.items[0].offsetWidth;
        const translation = -(stepsSlider.currentIndex * itemWidth);
        stepsSlider.track.style.transform = `translateX(${translation}px)`;
    }

    // Add click handlers for step items
    if (stepsSlider.track && stepsSlider.items.length) {
        stepsSlider.items.forEach((item, index) => {
            item.addEventListener('click', () => {
                if (stepsSlider.isAnimating || index === stepsSlider.currentIndex) return;
                
                stepsSlider.isAnimating = true;
                stepsSlider.currentIndex = index;
                updateStepsSlider();
                
                setTimeout(() => {
                    stepsSlider.isAnimating = false;
                }, 500); // Match transition duration
            });
        });

        // Set initial active state
        updateStepsSlider();

        // Update on window resize
        window.addEventListener('resize', updateStepsSlider);
    }
});