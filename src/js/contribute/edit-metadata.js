import { contributeTooltips } from '../contribute/tooltips.js';
import { contributeTranslate } from '../contribute/translate.js';
import { metadataQualityChecker, getMetaDataIssues, onFormSubmitMetadataCheck } from '../contribute/metadata-quality.js';
import { initTagsAutoComplete } from '../../js/contribute/tags.js';
import { initSortable } from '../contribute/manage-images.js';
import { runContributeTour } from '../contribute/contribute-product-tour.js';
import { Modal } from 'bootstrap';

const contributePage = document.getElementById('contribute-form');
const advancedToggle = document.getElementById('contribute-switch-advanced');
const advancedFormElements = document.getElementsByClassName('contribute-advanced');

const initContributeEdit = () => {
    if (!contributePage) return;  // Checks if the form is present on the page
    addEventListenerToAdvancedToggle();
    contributeTooltips();
    contributeTranslate();
    metadataQualityChecker();
    toggleAlternativeLanguage();
    initTagsAutoComplete();
    initSortable();
    validateSubmission();
    contributeTourClick();
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

const toggleAlternativeLanguage = () => {
    document.querySelectorAll('.alternative-language').forEach(button => {
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

const validateSubmission = () => {
    const submitButton = document.getElementById('contributeItemSubmit');
    submitButton.addEventListener('click', (e) => {
        e.preventDefault();
        onFormSubmitMetadataCheck();
        const { count, messages } = getMetaDataIssues();
        if (count > 0) {
            // alert('Please fix the errors before submitting the form');

            // Set the title
            document.getElementById('contributeModalToolipTitle').innerText = 'Consider Improving Your Metadata';
            
            // Create the initial HTML content
            let htmlContent = `<p>You have ${count} issue(s) with your metadata. Please review the following:</p>`;
            
            // Create the list
            htmlContent += '<ul class="list-group list-group-flush">';
            Object.keys(messages).forEach(key => {
                htmlContent += `<li class="list-group-item">${messages[key].join(', ')}</li>`;
            });
            htmlContent += '</ul>';
            
            htmlContent += `<p>Watch the video below to learn more about metadata quality:</p>`;

            // Add the iframe
            htmlContent += `<iframe width="100%" height="315" src="https://www.youtube.com/embed/MPY_EuvimH0?si=9SAMucQNfy-dN3wH&amp;start=30" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
            
            // Set the innerHTML of the target element
            document.getElementById('contributeModalToolipBody').innerHTML = htmlContent;
            const myModalElement = document.getElementById('contributeModalToolip');
            const myModal = new Modal(myModalElement, {
                keyboard: true  // Allows closing the modal with the keyboard
            });
        
            myModalElement.addEventListener('hidden.bs.modal', event => {
                document.getElementById('contributeModalToolipTitle').innerText = '';
                document.getElementById('contributeModalToolipBody').innerHTML = '';
            });
        
            myModal.show();

            return;
        }
        alert('Form submitted successfully');
    });
};

const contributeTourClick = () => {
    const contributeTourButton = document.getElementById('contributeTour');
    contributeTourButton.addEventListener('click', (e) => {
        e.preventDefault();
        runContributeTour();
    });
};

export { initContributeEdit };
