const englishTitle = document.getElementById('contribute-english-title');
const welshTitle = document.getElementById('contribute-welsh-title');
const englishDescription = document.getElementById('contribute-english-description');
const welshDescription = document.getElementById('contribute-welsh-description');

let errorCount = 0;
let errorMessages = {};

const metadataQualityChecker = () => {
    englishTitle.addEventListener('blur', () => validateField(englishTitle, 'contributeTitleContainer', 'englishTitleHelp', validateEnglishTitle));
    welshTitle.addEventListener('blur', () => validateField(welshTitle, 'contributeTitleContainer', 'welshTitleHelp', validateWelshTitle));
    englishDescription.addEventListener('blur', () => validateField(englishDescription, 'contributeDescriptionContainer', 'englishDescriptionHelp', validateEnglishDescription));
    welshDescription.addEventListener('blur', () => validateField(welshDescription, 'contributeDescriptionContainer', 'welshDescriptionHelp', validateWelshDescription));
};

const validateField = (field, containerId, helpId, validationFunctions) => {
    let errors = validationFunctions(field.value);
    updateErrors(field, containerId, helpId, errors);
};

const validateEnglishTitle = (value) => {
    let errors = [];
    if (value.trim() === '') {
        errors.push('English Title cannot be empty');
        return errors;
    }
    if (value.trim().split(' ').length < 3) errors.push('Title requires at least 3 words');
    if (value.trim().split(' ').length > 10) errors.push('Title should not exceed 10 words');

    let duplicateCheck = checkForDuplicateMetadata();
    if(duplicateCheck.length > 0) {
        errors.push(duplicateCheck[0]);
    }
    return errors;
};

const validateWelshTitle = (value) => {
    let errors = [];
    if (value.trim() === '') errors.push('Welsh Title cannot be empty');
    return errors;
};

const validateEnglishDescription = (value) => {
    let errors = [];
    if (value.trim() === '') {
        errors.push('English description cannot be empty');
        return errors;
    }
    let duplicateCheck = checkForDuplicateMetadata();
    if(duplicateCheck.length > 0) {
        errors.push(duplicateCheck[0]);
    }
    return errors;
};

const validateWelshDescription = (value) => {
    let errors = [];
    if (value.trim() === '') errors.push('Welsh description cannot be empty');
    return errors;
};

const checkForDuplicateMetadata = () => {   
    if(englishTitle.value.trim() === englishDescription.value.trim()) {
        return ['English Title and Description should not be the same'];
    }
    return [];
} 

const updateErrors = (field, containerId, helpId, newErrors) => {
    const container = document.getElementById(containerId);
    const helpElement = document.getElementById(helpId);
    const fieldId = field.getAttribute('id');

    const previousErrors = errorMessages[fieldId] || [];

    // Update error messages and counts
    if (newErrors.length > 0) {
        container.classList.add('contribute-issue');
        helpElement.innerHTML = newErrors.join('<br>');
        errorMessages[fieldId] = newErrors;

        // Update global error count
        errorCount += newErrors.length - previousErrors.length;
    } else {
        container.classList.remove('contribute-issue');
        helpElement.innerHTML = '';

        // Update global error count
        errorCount -= previousErrors.length;
        delete errorMessages[fieldId];
    }

    // Log current errors for debugging
    console.log(`Current Error Count: ${errorCount}`, JSON.stringify(errorMessages));
};

const getMetaDataIssues = () => {
    return {
        'count': errorCount,
        'messages': errorMessages
    };
}

export { metadataQualityChecker, getMetaDataIssues };
