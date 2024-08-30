import { Modal } from 'bootstrap';

const contributeTooltipElements = document.getElementsByClassName('contribute-tooltip');

const contributeTooltips = () => {
    if (!contributeTooltipElements) return;

    Array.from(contributeTooltipElements).forEach(tooltip => {
        tooltip.addEventListener('click', (e) => {
            e.preventDefault();
            const id = tooltip.getAttribute('id');
            triggerTooltip(id);
        });
    });
};

const triggerTooltip = (id) => {
    setModalText(id);
    
    const myModalElement = document.getElementById('contributeModalToolip');
    const myModal = new Modal(myModalElement, {
        keyboard: true  // Allows closing the modal with the keyboard
    });

    myModalElement.addEventListener('hidden.bs.modal', event => {
        document.getElementById('contributeModalToolipTitle').innerText = '';
        document.getElementById('contributeModalToolipBody').innerHTML = '';
    });

    myModal.show();
};

const setModalText = (id) => {
    if(id === 'contributeTooltipTitle') {
        document.getElementById('contributeModalToolipTitle').innerText = 'Title';
        document.getElementById('contributeModalToolipBody').innerHTML = 
            `<p>The title of your story is the first thing people will see. Make it catchy and descriptive!</p>
            <p><iframe width="100%" height="400" src="https://www.youtube.com/embed/GPQ1wt-PusY?si=nmLd-vXbHlZ62V3m" 
            title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; 
            clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></p>`;
    }
    if(id === 'contributeTooltipDescription') {
        document.getElementById('contributeModalToolipTitle').innerText = 'Description';
        document.getElementById('contributeModalToolipBody').innerHTML = 
        `<p>The description of your story is where you can provide more context and details about the story</p>
        <p><iframe width="100%" height="400" src="https://www.youtube.com/embed/8_UnANdDqJc?si=XNjvH8VmZ6bSRwvA" 
        title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; 
        gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></p>`;
    }
};

export { contributeTooltips };
