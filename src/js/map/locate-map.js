import { MarkerClusterer } from "@googlemaps/markerclusterer";

const sidebarItemsButton = document.getElementById('mapLocateSidebarItems');
const sidebarSearchButton = document.getElementById('mapLocateSidebarSearch');
const sidebarCloseButton = document.getElementById('mapLocateSidebarClose');
const locateBackToItemsButton = document.getElementById('locateBackToItemsButton');

const locateSidebarSearch = document.getElementById('locateSidebarSearchContainer');
const locateSidebarItems = document.getElementById('locateSidebarItemsContainer');
const locateSidebarPagination = document.getElementById('locateSidebarPagination');
const locateSidebarItemPreview = document.getElementById('locateSidebarItemPreview');

let mapObj;
let AdvancedMarkerElementObj;
let markers = [];

let mapPosition;

let geoJsonData;

const locateMap = (map, AdvancedMarkerElement) => {
    console.log("map 1", map);
    mapObj = map;
    AdvancedMarkerElementObj = AdvancedMarkerElement;

    getGeoJson();
    setEventListeners();
};

const setEventListeners = () => {
    sidebarItemsButton.addEventListener('click', (e) => {
        e.preventDefault();
        sidebarItemsButtonClicked();
    });

    sidebarSearchButton.addEventListener('click', (e) => {
        e.preventDefault();
        sidebarSearchButtonClicked();
    });

    sidebarCloseButton.addEventListener('click', (e) => {
        e.preventDefault();
        sidebarCloseButtonClicked();
    });

    // loop class locate-sidebar-img and add event listener
    const locateSidebarImg = document.querySelectorAll('.locate-sidebar-img');
    locateSidebarImg.forEach((img) => {
        img.addEventListener('click', (e) => {
            e.preventDefault();
            const id = img.id;
            const imgSrc = img.src;
            locateSidebarImgClicked(id, imgSrc);
        });
    });

    locateBackToItemsButton.addEventListener('click', (e) => {
        e.preventDefault();
        locateBackToItemsButtonClicked();
    });

    // listen to map move event
    mapObj.addListener('bounds_changed', () => {
        updateMapPosition();
    });
};

const sidebarItemsButtonClicked = () => {  
    sidebarItemsButton.classList.add('locate-sidebar-nav-active');
    sidebarSearchButton.classList.remove('locate-sidebar-nav-active');

    locateSidebarSearch.style.display = 'none';
    locateSidebarItemPreview.style.display = 'none';
    locateSidebarItems.style.display = 'block';
    locateSidebarPagination.style.display = 'block';
};

const sidebarSearchButtonClicked = () => {
    sidebarItemsButton.classList.remove('locate-sidebar-nav-active');
    sidebarSearchButton.classList.add('locate-sidebar-nav-active');

    locateSidebarSearch.style.display = 'block';
    locateSidebarItems.style.display = 'none';
    locateSidebarPagination.style.display = 'none';
    locateSidebarItemPreview.style.display = 'none';
};

const locateSidebarImgClicked = (id, src) => {
    sidebarItemsButton.classList.remove('locate-sidebar-nav-active');

    locateSidebarItemPreview.style.display = 'block';
    locateSidebarItems.style.display = 'none';
    locateSidebarPagination.style.display = 'none';

    const previewImg = document.getElementById('locateSideNodeImagePreview');
    previewImg.src = src;

    clearAllMarkers();

    addItemMarker({ lat: 51.481583, lng: -3.179090 });
};

const locateBackToItemsButtonClicked = () => {
    sidebarItemsButton.classList.add('locate-sidebar-nav-active');
    locateSidebarItemPreview.style.display = 'none';
    locateSidebarItems.style.display = 'block';
    locateSidebarPagination.style.display = 'block';

    clearAllMarkers();
    setNewMapPosition();
    getGeoJsonFeatures();
};

const sidebarCloseButtonClicked = () => {};

const getGeoJson = async () => {
    try {
        const response = await fetch('/pages/data/geoJson.json');
        const data = await response.json();
        geoJsonData = data;
        getGeoJsonFeatures();
    } catch (error) {
        console.error('Failed to load GeoJSON data', error);
    }
};

const getGeoJsonFeatures = () => {
    // Clear previous data
    mapObj.data.forEach((feature) => {
        mapObj.data.remove(feature);
    });

    mapObj.data.addGeoJson(geoJsonData);
    setupClusterer();
};

const setupClusterer = () => {
    // Assuming mapObj.data contains the GeoJSON features
    mapObj.data.forEach((feature) => {
        const position = feature.getGeometry().get(); // Get the coordinates from the feature
        const marker = new AdvancedMarkerElementObj({
            map: mapObj,
            position: position,
            title: feature.getProperty('name') // Assuming 'name' is a property of the GeoJSON features
        });

        markers.push(marker);
    });

    // Reinitialize the clusterer with the new markers
    // if (window.markerClusterer) {
    //     window.markerClusterer.clearMarkers(); // Clear previous clusterer markers if any
    // }

    // Create a new MarkerClusterer instance with the updated markers array
    window.markerClusterer = new MarkerClusterer({ map: mapObj, markers: markers });
};

const addItemMarker = (location) => {
    const marker = new AdvancedMarkerElementObj({
      map: mapObj,
      position: location,
      title: "Item Location",
    });

    markers.push(marker);
    mapObj.setCenter(location);
};

const clearAllMarkers = () => {
    console.log("Clearing all markers. Initial count:", markers.length);

    markers.forEach(marker => marker.setMap(null)); // Remove each marker from the map
    markers = []; // Reset the markers array

    if (window.markerClusterer) {
        window.markerClusterer.clearMarkers(); // Clear markers from the clusterer
    }

    clearGeoJsonFeatures(); // Clear GeoJSON features from the data layer

    console.log("Markers and GeoJSON features cleared.");
};

const clearGeoJsonFeatures = () => {
    mapObj.data.forEach((feature) => {
        mapObj.data.remove(feature);
    });
    console.log("All GeoJSON features have been removed from the map.");
};


const updateMapPosition = () => {
    if (locateSidebarItemPreview.style.display === 'block') {
        return;
    }

    const center = mapObj.getCenter();
    const zoom = mapObj.getZoom();
    const bounds = mapObj.getBounds();

    mapPosition = {
        lat: center.lat(),
        lng: center.lng(),
        zoom: zoom,
        bounds: {
            north: bounds.getNorthEast().lat(),
            south: bounds.getSouthWest().lat(),
            east: bounds.getNorthEast().lng(),
            west: bounds.getSouthWest().lng()
        }
    };
};

// get values from mapPosition and set map position
const setNewMapPosition = () => {
    const { lat, lng, zoom } = mapPosition;
    mapObj.setCenter({ lat: lat, lng: lng });
    mapObj.setZoom(zoom);
};

export { locateMap };