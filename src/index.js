import './assets/scss/main.scss'
window.$ = require('jquery');
require('slick-carousel');

$('[data-slider="slick"]').slick({
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    arrows: false,
    dots: true,
    autoplay: true,
    autoplaySpeed: 3500,
});
