"use strict";

/*--
    How to Order
-----------------------------------*/
const howToOrder = new Swiper(".how-to-order-active .swiper", {
    pagination: {
        el: ".how-to-order-active .pagination-count",
        clickable: true,
        renderBullet: function (index, className) {
            return (
                '<span class="' +
                className +
                '">' +
                (index < 9 ? "0" : "") +
                (index + 1) +
                "</span>"
            );
        },
    },
});