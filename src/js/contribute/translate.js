const contributeTranslate = () => {

    // loop through all elements with the class 'translate-buttons' and add an event listener to each
    document.querySelectorAll('.translate-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.id;
            
            switch(id) {
                case 'translate-title-welsh':
                    translateEngishTitleToWelsh();
                    break;
                case 'translate-title-english':
                    translateWelshTitleToEnglish(); 
                    break;
                case 'translate-description-welsh':
                    translateEnglishDescriptionToWelsh();
                    break;
                case 'translate-description-english':
                    translateWelshDescriptionToEnglish();
                    break;
                default:
                    console.log('No translation available');
                    break;
            }
        });
    });
};

async function translateText(text, source, targetLanguage) {
    const apiKey = 'AIzaSyD2IjeESJzSXKrTzkHZVsxtkVTgXBSMW8M'; // Use your actual API key
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                q: [text],
                source: source,
                target: targetLanguage,
                format: 'text'
            })
        });

        const data = await response.json();
        if (response.ok) {
            return data.data.translations[0].translatedText;
        } else {
            console.error('API Error:', JSON.stringify(data, null, 2));
            throw new Error(data.error.message);
        }
    } catch (error) {
        console.error('Network or other error:', error.message);
        return 'Translation failed or invalid API response.';
    }
}

const translateEngishTitleToWelsh = async (title) => {
    const englishTitle = document.getElementById('contribute-english-title').value;
    if(englishTitle === '') {
        return;
    }
    const welshTitle = await translateText(englishTitle, 'en', 'cy');
    document.getElementById('contribute-welsh-title').value = welshTitle;
};
const translateWelshTitleToEnglish = async (title) => {
    const welshTitle = document.getElementById('contribute-welsh-title').value;
    if(welshTitle === '') {
        return;
    }
    const englishTitle = await translateText(welshTitle, 'cy', 'en');
    document.getElementById('contribute-english-title').value = englishTitle;
};
const translateEnglishDescriptionToWelsh = async (description) => {
    const englishDescription = document.getElementById('contribute-english-description').value;
    if(englishDescription === '') {
        return;
    }
    const welshDescription = await translateText(englishDescription, 'en', 'cy');
    console.log(welshDescription);
    document.getElementById('contribute-welsh-description').value = welshDescription;
};
const translateWelshDescriptionToEnglish = async (description) => {
    const welshDescription = document.getElementById('contribute-welsh-description').value;
    if(welshDescription === '') {
        return;
    }
    const englishDescription = await translateText(welshDescription, 'cy', 'en');
    document.getElementById('contribute-english-description').value = englishDescription;
};

export {contributeTranslate};