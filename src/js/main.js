// Import our custom CSS
import '../scss/styles.scss'

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'
import { initFacets } from '../js/leftsidebar/facets.js';
import { initMap } from '../js/maps.js';


initFacets();
initMap();

// map = new Map(document.getElementById('map'), {
//     center: {lat: -34.397, lng: 150.644},
//     zoom: 8
//   });

//   function initMap() {
//     console.log('initMap');
//     }