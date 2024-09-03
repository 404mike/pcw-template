import accessibleAutocomplete from 'accessible-autocomplete'

let numTags = 0;

const countries = [
    'Cymru',
    'France',
    'Germany',
    'United Kingdom',
    'Afghanistan',
    'Australia',
    'Austria',
    'Belgium',
    'Brazil',
    'Canada',
    'China',
    'Denmark',
    'Egypt',
    'Finland',
    'Greece',
    'Hungary',
    'India',
    'Indonesia',
    'Ireland',
    'Israel',
    'Italy',
    'Japan',
    'Kenya',
    'Luxembourg',
    'Malaysia',
    'Mexico',
    'Nepal',
    'Netherlands',
    'New Zealand',
    'Nigeria',
    'Norway',
    'Pakistan',
    'Peru',
    'Philippines',
    'Poland',
    'Portugal',
    'Qatar',
    'Romania',
    'Russia',
    'Saudi Arabia',
    'Singapore',
    'South Africa',
    'South Korea',
    'Spain',
    'Sri Lanka',
    'Sweden',
    'Switzerland',
    'Taiwan',
    'Thailand',
    'Turkey',
    'United Arab Emirates',
    'United States',
    'Venezuela',
    'Vietnam',
    'Zimbabwe'
];

const initTagsAutoComplete = () => {
    const tagInput = document.querySelector('#my-autocomplete-container');
    const elementId = 'my-autocomplete';
    // https://github.com/alphagov/accessible-autocomplete-multiselect?tab=readme-ov-file
    accessibleAutocomplete({
        element: tagInput,
        id: elementId,
        source: countries,
        onConfirm: (val) => {
            if(val === null || val === undefined) return;
            setTimeout(() => {
                document.getElementById(elementId).value = '';
            },200);
            addNewTag(val);           
        }
    })
}

const addNewTag = (tag) => {
    numTags++;

    if (numTags >= 7) {
        document.getElementById('my-autocomplete-container').style.display = 'none';
    }

    const tagList = document.getElementById('contribute-tags-list');
    // add new bootstrap button to the list
    const newTag = document.createElement('button');
    newTag.classList.add('btn', 'btn-primary', 'btn-sm', 'm-1');
    newTag.innerHTML = tag;
    tagList.appendChild(newTag);
    // add event listener to remove tag when clicked
    newTag.addEventListener('click', (e) => {
        numTags--;
        if (numTags < 7) {
            document.getElementById('my-autocomplete-container').style.display = 'block';
        }
        tagList.removeChild(newTag);
    });

};

export { initTagsAutoComplete }