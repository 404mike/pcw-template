// Import our custom CSS
import '../scss/styles.scss'

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'
import { initFacets } from '../js/leftsidebar/facets.js';
import { initMap } from '../js/maps.js';
import { addToCollectionStory } from '../js/add-to-collection-story.js';


initFacets();
initMap();

addToCollectionStory();