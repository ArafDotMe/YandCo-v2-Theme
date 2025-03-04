const shopCollection = new Swiper(".shop-collection .swiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    navigation: {
        nextEl: ".shop-collection .button-next",
        prevEl: ".shop-collection .button-prev",
    },
    breakpoints: {
        0: {
            slidesPerView: 2,
            spaceBetween: 30,
        },
        576: {
            slidesPerView: 2,
            spaceBetween: 30,
        },
        768: {
            slidesPerView: 3,
            spaceBetween: 30,
        },
        1024: {
            slidesPerView: 4,
            spaceBetween: 30,
        },
    },
});