// AIzaSyD2IjeESJzSXKrTzkHZVsxtkVTgXBSMW8M


function initMap() {
    // Load the JSON style from a local file
    fetch('gmap-style.json')
    .then(function(response) { return response.json(); })
    .then(function(styles) {
        // Create a map object centered on Wales
        const wales = {lat: 52.1307, lng: -3.7837};  // Central coordinates for Wales
        const mapOptions = {
            zoom: 8,
            center: wales,
            styles: styles
        };

        // Instantiate the map
        const map = new google.maps.Map(document.getElementById('map'), mapOptions);
    })
    .catch(error => console.error('Error loading the style: ', error));
}

export { initMap };