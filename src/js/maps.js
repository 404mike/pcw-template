// // AIzaSyD2IjeESJzSXKrTzkHZVsxtkVTgXBSMW8M
// import { Loader } from "@googlemaps/js-api-loader"


// // function initMap() {
// //     // Load the JSON style from a local file
// //     fetch('gmap-style.json')
// //     .then(function(response) { return response.json(); })
// //     .then(function(styles) {
// //         // Create a map object centered on Wales
// //         const wales = {lat: 52.1307, lng: -3.7837};  // Central coordinates for Wales
// //         const mapOptions = {
// //             zoom: 8,
// //             center: wales,
// //             styles: styles
// //         };

// //         // Instantiate the map
// //         const map = new google.maps.Map(document.getElementById('map'), mapOptions);
// //     })
// //     .catch(error => console.error('Error loading the style: ', error));
// // }


import { Loader } from "@googlemaps/js-api-loader";
let map;
const additionalOptions = {};
// [START maps_programmatic_load_promise]
const loader = new Loader({
  apiKey: "AIzaSyD2IjeESJzSXKrTzkHZVsxtkVTgXBSMW8M",
  version: "weekly",
  ...additionalOptions,
});

const wales = {lat: 52.1307, lng: -3.7837};

function initMap(){
    console.log('initMap');
    loader.load().then(async () => {
        const { Map } = await google.maps.importLibrary("maps");
      
        map = new Map(document.getElementById("map"), {
          center: wales,
          zoom: 8,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        });
      });
}

export { initMap };