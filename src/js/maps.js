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

// function initMap() {
//     const loader = new Loader({
//         apiKey: "AIzaSyD2IjeESJzSXKrTzkHZVsxtkVTgXBSMW8M",
//         version: "weekly",
//       });
      
//       loader.importLibrary().then(async () => {
//         const { Map } = await google.maps.importLibrary("maps");
//         console.log("Map");
      
//         map = new Map(document.getElementById("map"), {
//           center: { lat: -34.397, lng: 150.644 },
//           zoom: 8,
//         });
//       });

//       console.log('initMap');
// }




import { Loader } from "@googlemaps/js-api-loader";
let map;
const additionalOptions = {};
// [START maps_programmatic_load_promise]
const loader = new Loader({
  apiKey: "AIzaSyD2IjeESJzSXKrTzkHZVsxtkVTgXBSMW8M",
  version: "weekly",
  ...additionalOptions,
});

function initMap(){
    loader.load().then(async () => {
        const { Map } = await google.maps.importLibrary("maps");
      
        map = new Map(document.getElementById("map"), {
          center: { lat: -34.397, lng: 150.644 },
          zoom: 8,
        });
      });
}

export { initMap };