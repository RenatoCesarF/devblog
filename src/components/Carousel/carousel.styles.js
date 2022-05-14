import css from 'styled-jsx/css'

export default css.global`

/* Make the images wide and responsive. */
#myCarousel img {
    height: auto;
    max-width: 100%;
    width: 100%;
}

/* Change the order of the indicators. 
     Return them to the center of the slide. */
.carousel-indicators {
    width: auto;
    margin-left: 0;
    transform: translateX(-50%);
}

.carousel-indicators li {
    float: right;
    margin: 1px 4px;
}

.carousel-indicators .active {
    margin: 0 3px;
}

/* Change the direction of the transition. */
@media all and (transform-3d),
(-webkit-transform-3d) {

    .carousel-inner>.item.next,
    .carousel-inner>.item.active.right {
        left: 0;
        -webkit-transform: translate3d(-100%, 0, 0);
        transform: translate3d(-100%, 0, 0);
    }

    .carousel-inner>.item.prev,
    .carousel-inner>.item.active.left {
        left: 0;
        -webkit-transform: translate3d(100%, 0, 0);
        transform: translate3d(100%, 0, 0);
    }
}

`