function addToCollectionStory() {
    const buttons = document.querySelectorAll('.add-to-collection-story');
    buttons.forEach(button => {
        button.addEventListener('click', handleButtonClick);
    });   
}

function handleButtonClick(event) {
    const buttonId = event.target.id;
    // console.log('Button with ID:', buttonId, 'was clicked');
    if(buttonId === 'add-to-story-button') {
        document.getElementById('add-to-collection-container').classList.add('d-none');
        document.getElementById('add-to-story-container').classList.remove('d-none');
    }else{
        document.getElementById('add-to-collection-container').classList.remove('d-none');
        document.getElementById('add-to-story-container').classList.add('d-none');
    }
}

export { addToCollectionStory };