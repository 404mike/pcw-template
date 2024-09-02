import {contributeTooltips} from './contribute/tooltips.js';
import {contributeTranslate} from './contribute/translate.js';
import {metadataQualityChecker} from './contribute/metadata-quality.js';

const contributePage = document.getElementById('contribute-form');
const advancedToggle = document.getElementById('contribute-switch-advanced');
const advancedFormElements = document.getElementsByClassName('contribute-advanced');

const initContribute = () => {
    if (!contributePage) return;  // Checks if the form is present on the page

    addEventListenerToAdvancedToggle();
    contributeTooltips();
    contributeTranslate();
    metadataQualityChecker();
    toggleTranslateForms();
};

const addEventListenerToAdvancedToggle = () => {
    advancedToggle.addEventListener('click', (e) => {
        // Loop through all elements and toggle visibility based on the checkbox
        Array.from(advancedFormElements).forEach(element => {
            if (advancedToggle.checked) {
                element.classList.add('d-block');    // Show element
                element.classList.remove('d-none');  // Ensure it's not hidden
            } else {
                element.classList.add('d-none');     // Hide element
                element.classList.remove('d-block'); // Ensure it's not shown
            }
        });
    });
};

const toggleTranslateForms = () => {
    document.querySelectorAll('.translate-buttons').forEach(button => {
        button.addEventListener('click', (e) => {
            const suffix = e.target.id.split('-').pop(); // 'english' or 'welsh'
            const type = e.target.id.replace(`-${suffix}`, ''); // e.g., 'contribute-description'
            const toggleSuffix = suffix === 'english' ? 'welsh' : 'english';
            const toggleId = `${type}-${toggleSuffix}`;
            const elementToToggle = document.getElementById(toggleId);
    
            if (elementToToggle) {
                elementToToggle.classList.toggle('d-none');
                elementToToggle.classList.toggle('d-block');
            }
        });
    });
};

export { initContribute };
