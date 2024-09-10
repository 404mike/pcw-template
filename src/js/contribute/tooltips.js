import { Modal } from 'bootstrap';

const contributeTooltipElements = document.getElementsByClassName('contribute-tooltip');

const contributeTooltips = () => {
    if (!contributeTooltipElements) return;

    Array.from(contributeTooltipElements).forEach(tooltip => {
        tooltip.addEventListener('click', (e) => {
            e.preventDefault();
            const id = tooltip.getAttribute('id');

            setModalText(id);
            triggerTooltip();
        });
    });
};

const triggerTooltip = () => {   
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
            `<p>The title of your story is the first thing people will see. Follow our advised Who, What, Where, When title format, for example “Mrs Enid Jones milking a goat, Carmarthen, 1962</p>
            <p><iframe width="100%" height="400" src="https://www.youtube.com/embed/GPQ1wt-PusY?si=nmLd-vXbHlZ62V3m" 
            title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; 
            clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></p>`;
    }
    if(id === 'contributeTooltipDescription') {
        document.getElementById('contributeModalToolipTitle').innerText = 'Description';
        document.getElementById('contributeModalToolipBody').innerHTML = 
        `<p>The description of your item is where you can add as much information as possible about. Think about how you can make this item a useful resource for other people.</p>
        <p><iframe width="100%" height="400" src="https://www.youtube.com/embed/8_UnANdDqJc?si=XNjvH8VmZ6bSRwvA" 
        title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; 
        gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></p>`;
    }
    if(id === 'contributeUploadTooltip') {
        document.getElementById('contributeModalToolipTitle').innerText = 'How to Upload';
        document.getElementById('contributeModalToolipBody').innerHTML = 
        `<p>Here are instructions about what and how to upload</p>
        <iframe width="100%" height="400vh" src="https://www.youtube.com/embed/jqgqsb-a34c?si=m6-dk_G8OghoaiPA" 
        title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; 
        gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
    }
};

export { contributeTooltips, setModalText, triggerTooltip };
