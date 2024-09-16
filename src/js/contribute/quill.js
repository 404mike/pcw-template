import "quill/dist/quill.snow.css";
import Quill from "quill";
import { Modal } from 'bootstrap';

const BlockEmbed = Quill.import('blots/block/embed');

class CustomMediaBlot extends BlockEmbed {
    static blotName = 'custom-media'; // Unique name to prevent conflicts
    static tagName = 'div';
    static className = 'custom-media';

    static create(value) {
        const node = super.create();

        // Set data attributes
        node.setAttribute('data-nid', value.nid);
        node.setAttribute('data-nid-index', value.nidIndex);
        node.setAttribute('data-position', value.position || 'center');
        node.setAttribute('contenteditable', 'false'); // Make the container non-editable

        // Create the thumbnail image
        const img = document.createElement('img');
        img.setAttribute('src', value.thumbnailUrl);
        img.setAttribute('alt', 'Media Thumbnail');
        img.classList.add('media-thumbnail');
        img.setAttribute('contenteditable', 'false'); // Make the image non-editable
        node.appendChild(img);

        // Create the edit button
        const button = document.createElement('button');
        button.type = 'button';
        button.classList.add('edit-media-button', 'btn', 'btn-sm', 'btn-primary');
        button.setAttribute('aria-label', 'Edit Media');
        button.innerHTML = '<i class="fa fa-edit"></i>'; // Using Font Awesome icon
        node.appendChild(button);

        return node;
    }

    static value(node) {
        const img = node.querySelector('img');
        return {
            nid: node.getAttribute('data-nid'),
            nidIndex: node.getAttribute('data-nid-index'),
            thumbnailUrl: img ? img.getAttribute('src') : '',
            position: node.getAttribute('data-position') || 'center'
        };
    }

    // Optional: Override deleteAt if needed
    deleteAt(index, length) {
        if (index === 0 && length >= this.length()) {
            this.remove();
        }
    }
}

Quill.register(CustomMediaBlot);

const runQuill = () => {
    // Initialize Quill with the custom toolbar and history
    const quill = new Quill('#editor', {
        modules: {
            toolbar: '#toolbar-container', // Reference to the custom toolbar container
            history: {
                delay: 1000,
                maxStack: 100,
                userOnly: true
            }
        },
        placeholder: 'Tell a story ...',
        theme: 'snow'
    });

    // Predefined Media Data
    const predefinedMedia = [{
            nid: '1',
            nidIndex: '0',
            thumbnailUrl: 'https://via.placeholder.com/150',
            position: 'center'
        },
        {
            nid: '2',
            nidIndex: '1',
            thumbnailUrl: 'https://via.placeholder.com/150/0000FF',
            position: 'center'
        },
        {
            nid: '3',
            nidIndex: '2',
            thumbnailUrl: 'https://via.placeholder.com/150/FF0000',
            position: 'center'
        },
        // Add more predefined media objects here
    ];

    // Render Predefined Media
    function renderPredefinedMedia() {
        const mediaList = document.getElementById('predefined-media-list');
        mediaList.innerHTML = '';
        predefinedMedia.forEach(media => {
            const mediaCard = document.createElement('div');
            mediaCard.classList.add('col-md-3');

            mediaCard.innerHTML = `
          <div class="card mb-3">
            <img src="${media.thumbnailUrl}" class="card-img-top" alt="Media">
            <div class="card-body text-center">
              <button class="btn btn-success select-media-button" data-nid="${media.nid}" data-nid-index="${media.nidIndex}" data-thumbnail-url="${media.thumbnailUrl}" data-position="${media.position}">
                <i class="fa fa-check"></i> Select
              </button>
            </div>
          </div>
        `;
            mediaList.appendChild(mediaCard);
        });
    }

    // Initial Rendering of Predefined Media
    renderPredefinedMedia();

    // Add Media Button Click
    document.getElementById('add-media-button').addEventListener('click', () => {
        const addMediaModal = new Modal(document.getElementById('addMediaModal'));
        addMediaModal.show();
    });

    // Handle Media Selection
    document.getElementById('predefined-media-list').addEventListener('click', function(event) {
        event.preventDefault();
        if (event.target.closest('.select-media-button')) {
            const button = event.target.closest('.select-media-button');
            const nid = button.getAttribute('data-nid');
            const nidIndex = button.getAttribute('data-nid-index');
            const thumbnailUrl = button.getAttribute('data-thumbnail-url');
            const position = button.getAttribute('data-position');

            insertMediaIntoEditor({
                nid,
                nidIndex,
                thumbnailUrl,
                position
            });

            // Close the modal
            const addMediaModalEl = document.getElementById('addMediaModal');
            const addMediaModal = Modal.getInstance(addMediaModalEl);
            addMediaModal.hide();
        }
    });

    // Function to Insert Media into Editor
    function insertMediaIntoEditor(media) {
        if (!media || !media.nid || !media.thumbnailUrl) {
            console.error('Invalid media data:', media);
            return;
        }
        const range = quill.getSelection(true);
        quill.insertEmbed(range.index, 'custom-media', media, Quill.sources.USER);
        quill.setSelection(range.index + 1, Quill.sources.SILENT);
    }

    // Handle Edit Media Button Click within Editor
    quill.root.addEventListener('click', function(event) {
        if (event.target.closest('.edit-media-button')) {
            // Get the parent blot's data
            const blotNode = event.target.closest('.custom-media');
            if (!blotNode) return;

            const blot = Quill.find(blotNode);
            if (!blot) return;

            const data = blot.value();

            // Fetch metadata (replace with your API)
            fetch(`/api/media/${data.nid}`) // Example API endpoint
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(metadata => {
                    populateEditMediaModal(metadata);
                    const editMediaModal = new Modal(document.getElementById('editMediaModal'));
                    editMediaModal.show();

                    // Store reference to the current blot
                    document.getElementById('editMediaModal').dataset.currentBlotNid = data.nid;
                    document.getElementById('editMediaModal').dataset.currentBlotIndex = data.nidIndex;
                })
                .catch(error => {
                    console.error('Error fetching media metadata:', error);
                    alert('Failed to fetch media metadata.');
                });
        }
    });

    // Function to Populate Edit Media Modal
    function populateEditMediaModal(metadata) {
        const metadataContainer = document.getElementById('media-metadata');
        const mediaOptions = document.getElementById('media-options');

        // Display current metadata
        metadataContainer.innerHTML = `
        <h5>Metadata for Item ID: ${metadata.nid}</h5>
        <p>${metadata.description || 'No description available.'}</p>
        <div class="mb-3">
          <label for="alternative-thumbnail" class="form-label">Select Thumbnail</label>
          <select id="alternative-thumbnail" class="form-select">
            ${metadata.thumbnails.map((thumb, index) => `
              <option value="${thumb.url}" ${thumb.url === metadata.thumbnailUrl ? 'selected' : ''}>Thumbnail ${index + 1}</option>
            `).join('')}
          </select>
        </div>
        <div class="mb-3">
          <label for="thumbnail-position" class="form-label">Position</label>
          <select id="thumbnail-position" class="form-select">
            <option value="left" ${metadata.position === 'left' ? 'selected' : ''}>Left</option>
            <option value="center" ${metadata.position === 'center' ? 'selected' : ''}>Center</option>
            <option value="right" ${metadata.position === 'right' ? 'selected' : ''}>Right</option>
          </select>
        </div>
      `;
    }

    // Handle Save Changes in Edit Media Modal
    document.getElementById('save-media-changes').addEventListener('click', () => {
        const editMediaModalEl = document.getElementById('editMediaModal');
        const nid = editMediaModalEl.dataset.currentBlotNid;
        const nidIndex = editMediaModalEl.dataset.currentBlotIndex;

        const selectedThumbnail = document.getElementById('alternative-thumbnail').value;
        const selectedPosition = document.getElementById('thumbnail-position').value;

        // Find and update the blot
        let blotFound = false;
        const editor = quill;
        editor.scroll.descendant(CustomMediaBlot, 0).forEach(([blot, index]) => {
            const blotValue = blot.value();
            if (blotValue.nid === nid && blotValue.nidIndex === nidIndex) {
                quill.deleteText(index, 1, Quill.sources.USER);
                quill.insertEmbed(index, 'custom-media', {
                    nid,
                    nidIndex,
                    thumbnailUrl: selectedThumbnail,
                    position: selectedPosition
                }, Quill.sources.USER);
                blotFound = true;
            }
        });

        if (!blotFound) {
            console.warn('Blot not found for update:', nid, nidIndex);
        }

        // Close the modal
        const editMediaModal = Modal.getInstance(editMediaModalEl);
        editMediaModal.hide();
    });

    // Handle Deletion of Media
    quill.on('text-change', function(delta, oldDelta, source) {
        if (source === 'user') {
            // Scan for any media blots that have been deleted
            const mediaElements = quill.root.querySelectorAll('.custom-media');
            mediaElements.forEach(el => {
                const blot = Quill.find(el);
                if (!blot) {
                    el.remove();
                }
            });
        }
    });

    // Fix Undo/Redo Bug
    quill.on('text-change', function(delta, oldDelta, source) {
        if (source === 'user') {
            // Ensure media blots are correctly serialized
            delta.ops.forEach((op) => {
                if (op.insert && typeof op.insert === 'object' && op.insert['custom-media']) {
                    const media = op.insert['custom-media'];
                    if (!media.nid || !media.thumbnailUrl) {
                        console.error('Invalid media data detected:', media);
                        // Optionally remove or correct invalid media blots
                        const index = quill.getSelection().index;
                        quill.deleteText(index - 1, 1, 'user');
                    }
                }
            });
        }
    });

    // Prevent cursor from being placed inside media blot
    quill.root.addEventListener('click', function(event) {
        const mediaBlot = event.target.closest('.custom-media');
        if (mediaBlot) {
            const blot = Quill.find(mediaBlot);
            const index = quill.getIndex(blot);
            quill.setSelection(index + 1, Quill.sources.SILENT);
        }
    });
};

export { runQuill };