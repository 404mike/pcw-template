function initFacets() {
    document.addEventListener('DOMContentLoaded', function () {
        // Select all buttons that control the collapsible elements
        let buttons = document.querySelectorAll('.discover-filter__heading');

        buttons.forEach(function (button) {
            // Get the target ID from the data-bs-target attribute
            let targetID = button.getAttribute('data-bs-target');
            let targetElement = document.querySelector(targetID);
            let arrowIcon = button.querySelector('.arrow-icon');

            // Check if the target element and arrow icon exist
            if (targetElement && arrowIcon) {
                targetElement.addEventListener('show.bs.collapse', function () {                
                    arrowIcon.classList.add('arrow-icon-rotate');
                });

                targetElement.addEventListener('hide.bs.collapse', function () {
                    arrowIcon.classList.remove('arrow-icon-rotate');
                });
            }
        });
    });
}

export { initFacets };
