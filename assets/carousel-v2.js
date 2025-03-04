const banner = new Swiper(".banner-active .swiper", {
    loop: true,
    navigation: {
        nextEl: ".banner-active .button-next",
        prevEl: ".banner-active .button-prev",
    },
    autoplay: {
        delay: 5000,
        pauseOnMouseEnter: true,
    },
    cssMode: true,
    pagination: {
        el: ".banner-active .pagination",
        clickable: true,
    },
});