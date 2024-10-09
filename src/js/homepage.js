
const initHomepageCarousel = () => {

    let items = document.querySelectorAll('.carousel .carousel-item');

    if(items.length === 0) return;

    items.forEach((el) => {
        const minPerSlide = 6;
        let next = el.nextElementSibling
        for (var i=1; i<minPerSlide; i++) {
            if (!next) {
                // wrap carousel by using first child
                next = items[0]
            }
            let cloneChild = next.cloneNode(true)
            el.appendChild(cloneChild.children[0])
            next = next.nextElementSibling
        }
    });
};

export { initHomepageCarousel };