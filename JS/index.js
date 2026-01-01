// 轮播图功能 - 实时更新小圆点
document.addEventListener('DOMContentLoaded', function () {
    // 获取元素
    const slider = document.querySelector('.slick-slider');
    const track = document.querySelector('.slick-track');
    const slides = document.querySelectorAll('.slick-slide');
    const dots = document.querySelectorAll('.slick-dots li');
    const prevBtn = document.querySelector('.slick-prev');
    const nextBtn = document.querySelector('.slick-next');

    // 当前轮播图索引（从1开始，因为0是克隆的最后一张）
    let currentIndex = 1;
    // 真实轮播图数量（不包括克隆的）
    const realSlidesCount = slides.length - 2; // 5张真实图片
    // 自动轮播计时器
    let autoSlideTimer;
    // 轮播间隔时间（毫秒）
    const slideInterval = 2000; // 2秒
    // 是否正在过渡动画中
    let isTransitioning = false;

    // 初始化轮播图
    function initCarousel() {
        // 设置轨道宽度（包括克隆的图片）
        track.style.width = `${slides.length * 100}%`;

        // 设置每张轮播图的宽度
        slides.forEach(slide => {
            slide.style.width = `${100 / slides.length}%`;
        });

        // 禁用过渡效果，设置初始位置（显示真正的第一张，不是克隆的）
        track.style.transition = 'none'; // 先禁用过渡效果
        // 设置初始位置（显示真正的第一张，不是克隆的）
        track.style.transform = `translateX(-${currentIndex * 100 / slides.length}%)`;
        // 强制重绘，确保样式生效
        track.offsetHeight;

        // 现在启用过渡效果，用于后续的轮播动画
        track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

        // 为真正的第一张轮播图添加活动状态
        slides[1].classList.add('active');

        // 更新小圆点状态
        updateDots();

        // 开始自动轮播
        startAutoSlide();

        // 添加事件监听器
        addEventListeners();

        // 监听过渡结束事件
        track.addEventListener('transitionend', function () {
            if (!isTransitioning) return;

            isTransitioning = false;

            // 如果滑动到了克隆的最后一张（索引0）
            if (currentIndex === 0) {
                // 禁用过渡效果
                track.style.transition = 'none';
                // 跳转到真正的最后一张（索引realSlidesCount）
                currentIndex = realSlidesCount;
                track.style.transform = `translateX(-${currentIndex * 100 / slides.length}%)`;
                // 强制重绘
                track.offsetHeight;
                // 重新启用过渡效果
                track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            }
            // 如果滑动到了克隆的第一张（索引slides.length-1）
            else if (currentIndex === slides.length - 1) {
                // 禁用过渡效果
                track.style.transition = 'none';
                // 跳转到真正的第一张（索引1）
                currentIndex = 1;
                track.style.transform = `translateX(-${currentIndex * 100 / slides.length}%)`;
                // 强制重绘
                track.offsetHeight;
                // 重新启用过渡效果
                track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            }
        });
    }

    // 开始自动轮播
    function startAutoSlide() {
        // 清除现有计时器
        stopAutoSlide();

        // 创建新的计时器
        autoSlideTimer = setInterval(() => {
            goToNext();
        }, slideInterval);
    }

    // 停止自动轮播
    function stopAutoSlide() {
        if (autoSlideTimer) {
            clearInterval(autoSlideTimer);
        }
    }

    // 跳转到指定轮播图
    function goToSlide(index) {
        if (isTransitioning) return;
        isTransitioning = true;

        // 移除所有轮播图的激活状态
        slides.forEach(slide => {
            slide.classList.remove('active');
        });

        // 更新当前索引
        currentIndex = index;

        // 向左滑动效果
        track.style.transform = `translateX(-${currentIndex * 100 / slides.length}%)`;

        // 更新小圆点
        updateDots();

        // 重置倒计时（重新开始自动轮播）
        startAutoSlide();
    }

    // 更新小圆点状态
    function updateDots() {
        // 将虚拟索引转换为真实索引
        let realIndex = currentIndex - 1; // 减去开头克隆的那张

        // 如果是克隆的最后一张（索引0），对应真正的最后一张
        if (currentIndex === 0) {
            realIndex = realSlidesCount - 1; // 最后一张的索引
        }
        // 如果是克隆的第一张（索引slides.length-1），对应真正的第一张
        else if (currentIndex === slides.length - 1) {
            realIndex = 0; // 第一张的索引
        }

        // 确保索引在有效范围内
        if (realIndex < 0) realIndex = 0;
        if (realIndex >= realSlidesCount) realIndex = realSlidesCount - 1;

        dots.forEach((dot, index) => {
            if (index === realIndex) {
                dot.classList.add('slick-active');
            } else {
                dot.classList.remove('slick-active');
            }
        });
    }

    // 上一张（向右滑动）
    function goToPrev() {
        stopAutoSlide();
        goToSlide(currentIndex - 1);
    }

    // 下一张（向左滑动）
    function goToNext() {
        stopAutoSlide();
        goToSlide(currentIndex + 1);
    }

    // 跳转到指定索引（通过小圆点）
    function goToDot(index) {
        stopAutoSlide();
        // 小圆点索引0对应真正的第一张，所以加1
        goToSlide(index + 1);
    }

    // 添加事件监听器
    function addEventListeners() {
        // 左右按钮点击事件
        if (prevBtn) {
            prevBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                goToPrev();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                goToNext();
            });
        }

        // 小圆点点击事件
        dots.forEach((dot, index) => {
            dot.addEventListener('click', function () {
                goToDot(index);
            });
        });

        // 鼠标悬停时暂停自动轮播
        slider.addEventListener('mouseenter', function () {
            stopAutoSlide();
        });

        // 鼠标离开时恢复自动轮播
        slider.addEventListener('mouseleave', function () {
            startAutoSlide();
        });

        // 添加触摸滑动支持
        let startX = 0;
        let endX = 0;

        slider.addEventListener('touchstart', function (e) {
            startX = e.touches[0].clientX;
            stopAutoSlide();
        });

        slider.addEventListener('touchmove', function (e) {
            endX = e.touches[0].clientX;
        });

        slider.addEventListener('touchend', function () {
            const threshold = 50; // 滑动阈值

            if (startX - endX > threshold) {
                // 向左滑动，下一张
                goToNext();
            } else if (endX - startX > threshold) {
                // 向右滑动，上一张
                goToPrev();
            } else {
                // 重新开始自动轮播
                startAutoSlide();
            }
        });
    }

    // 初始化轮播图
    initCarousel();
});