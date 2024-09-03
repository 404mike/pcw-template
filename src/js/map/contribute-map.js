const dropPinButton = document.getElementById('contributeMapDropPin');
const removePinButton = document.getElementById('contributeRemoveMarker');

const contributeMap = (map,AdvancedMarkerElement) => {
    addMarker(map,AdvancedMarkerElement);
    removeMarker();
};

let markers = []; // Store all markers in an array to manage their state

const addMarker = (map,AdvancedMarkerElement) => {
    dropPinButton.addEventListener('click', () => {
        // Initialize a new AdvancedMarkerElement
        const marker = new AdvancedMarkerElement({
            map: map,
            position: map.getCenter(),
            title: "Item Location",
            gmpDraggable: true, // Assuming AdvancedMarkerElement supports the draggable property
        });

        markers.push(marker); // Add the new marker to the array

        let markerPosition = marker.position;
        let lat = markerPosition.lat;
        let lng = markerPosition.lng;
        setMarkerLocation(lat, lng);

        // Add event listener for when the marker's drag ends
        marker.addListener('dragend', (e) => {
            let markerPosition = marker.position;
            let lat = markerPosition.lat;
            let lng = markerPosition.lng;
            setMarkerLocation(lat, lng);
        });

        toggleButtons(); // Toggle the visibility of buttons
    });
};

const removeMarker = () => {
    removePinButton.addEventListener('click', () => {
        markers.forEach(marker => marker.setMap(null));
        markers = []; // Clear the array of markers
        toggleButtons(); // Toggle the visibility of buttons
        document.getElementById('itemLocation').value = ''; // Clear the input field
    });
};

const setMarkerLocation = (lat, lng) => {
    console.log(lat, lng);
    // Set the input field value to the marker's latitude and longitude
    document.getElementById('itemLocation').value = `${lat},${lng}`;
};

const toggleButtons = () => {
    // Toggle button visibility based on the marker state
    dropPinButton.classList.toggle('d-none');
    dropPinButton.classList.toggle('d-block');
    removePinButton.classList.toggle('d-none');
    removePinButton.classList.toggle('d-block');
};

export { contributeMap };
