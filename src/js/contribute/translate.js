const contributeTranslate = () => {

    // Example usage:
    let text = translateText('Hello, how are you?', 'en', 'cy').then(translation => console.log(translation));
    return text;
};

async function translateText(text, sourceLanguage, targetLanguage) {    
    // make post request to https://peoplescollection.wales/embed/sites/translate.php
    // with text and targetLanguage as parameters
    // return the translated text

    const response = await fetch('https://peoplescollection.wales/embed/sites/translate.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({text, sourceLanguage, targetLanguage})
    });

    const data = await response.json
    return data.translatedText;
}

export {contributeTranslate};