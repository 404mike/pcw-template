// Import our custom CSS
import '../scss/styles.scss'
import { initFacets } from '../js/leftsidebar/facets.js';
import { initMap } from '../js/map/maps.js';
import { addToCollectionStory } from '../js/add-to-collection-story.js';
import { initContribute } from '../js/contribute.js';

initFacets();
initMap();
addToCollectionStory();
initContribute();