const contributeTranslate = () => {

    // Example usage:
    translateText('Hello, how are you?').then(translation => console.log(translation));
};


async function translateText(text) {
    const apiKey = 'AIzaSyD2IjeESJzSXKrTzkHZVsxtkVTgXBSMW8M';  // Replace YOUR_API_KEY with your actual Google Cloud API key
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                q: text,
                source: 'en',
                target: 'cy',  // ISO 639-1 code for Welsh
                format: 'text'
            })
        });

        const data = await response.json();
        if (response.ok) {
            console.log('Translation:', data.data.translations[0].translatedText);
            return data.data.translations[0].translatedText;
        } else {
            console.error('Translation API Error:', data.error.message);
            throw new Error(data.error.message);
        }
    } catch (error) {
        console.error('Fetch Error:', error);
        throw error;
    }
}

export {contributeTranslate};