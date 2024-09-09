import {
    MarkerClusterer
} from "@googlemaps/markerclusterer";

const sidebarItemsButton = document.getElementById('mapLocateSidebarItems');
const sidebarSearchButton = document.getElementById('mapLocateSidebarSearch');
const sidebarCloseButton = document.getElementById('mapLocateSidebarClose');
const locateBackToItemsButton = document.getElementById('locateBackToItemsButton');

const locateSidebarSearch = document.getElementById('locateSidebarSearchContainer');
const locateSidebarItems = document.getElementById('locateSidebarItemsContainer');
const locateSidebarItemsPreview = document.getElementById('locateSidebarItemsPreview');
const locateSidebarPagination = document.getElementById('locateSidebarPagination');
const locateSidebarItemPreview = document.getElementById('locateSidebarItemPreview');

let mapObj;
let AdvancedMarkerElementObj;
let markers = [];
let clusterer;
let mapPosition;
let geoJsonData;
let mapViewState = '';

const locateMap = (map, AdvancedMarkerElement) => {
    mapObj = map;
    AdvancedMarkerElementObj = AdvancedMarkerElement;
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

const setSidebarItemPreviewEventListeners = () => {
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
};

const locateSidebarImgClicked = (id, src) => {
    sidebarItemsButton.classList.remove('locate-sidebar-nav-active');

    locateSidebarItemPreview.style.display = 'block';
    locateSidebarItems.style.display = 'none';
    locateSidebarPagination.style.display = 'none';

    const previewImg = document.getElementById('locateSideNodeImagePreview');
    previewImg.src = src;

    clearAllMarkers();

    addItemMarker({
        lat: 51.481583,
        lng: -3.179090
    });

    mapViewState = 'preview';
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

    // random number between 0 and 16
    // let randomNumber = Math.floor(Math.random() * 17);
    let randomNumber = 5;

    try {
        const response = await fetch(`data/geoJson${randomNumber}.json`);
        const data = await response.json();
        geoJsonData = data;
        getGeoJsonFeatures();
    } catch (error) {
        console.error('Failed to load GeoJSON data', error);
    }
};

const getGeoJsonFeatures = () => {
    clearAllMarkers();

    // Create markers from GeoJSON features
    markers = []; // Reset markers array
    geoJsonData.features.forEach((feature) => {
        let lat = feature.geometry.coordinates[1];
        let lng = feature.geometry.coordinates[0];
        const marker = new AdvancedMarkerElementObj({
          map: mapObj,
          position: {lat: lat, lng: lng},
          title: feature['properties']['title'], // Assuming 'name' is a property
        });
        markers.push(marker);

        addItemPreviewToSidebar(feature.properties);
    });

    // Update the clusterer with the new markers
    if (clusterer) {
        clusterer.clearMarkers(); // Clear existing markers
        clusterer.addMarkers(markers); // Add new markers to clusterer
    } else {
        // Create a new clusterer instance if it doesn't exist
        clusterer = new MarkerClusterer({
            map: mapObj,
            markers
        });
    }

    setSidebarItemPreviewEventListeners();
    mapViewState = '';
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
    markers.forEach(marker => marker.setMap(null)); // Remove each marker from the map
    markers = []; // Reset the markers array

    if (window.markerClusterer) {
        window.markerClusterer.clearMarkers(); // Clear markers from the clusterer
    }

    clearGeoJsonFeatures(); // Clear GeoJSON features from the data layer

    // clear sidebar
    locateSidebarItemsPreview.innerHTML = '';
};

const clearGeoJsonFeatures = () => {
    mapObj.data.forEach((feature) => {
        mapObj.data.remove(feature);
    });
};

const updateMapPosition = () => {
    // if (locateSidebarItemPreview.style.display === 'block') {
    //     return;
    // }
    console.log("mapViewState", mapViewState);

    if (mapViewState === 'preview') return;

    console.log('updateMapPosition');

    clearAllMarkers();
    getGeoJson();

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
    mapObj.setCenter({
        lat: lat,
        lng: lng
    });
    mapObj.setZoom(zoom);
};

const addItemPreviewToSidebar = (item) => {
    const id = item.id;
    const imageSrc = item.image;
    const title = item.title;

    const template = `                   
        <div class="col d-flex align-items-stretch m-0 p-1">
            <div class="card text-center w-100 discover-result-node">
                <a href="#">
                    <img id="locateNode${ id }" src="${ imageSrc }"
                    class="card-img-top locate-sidebar-img mx-auto" alt="${ title }">
                </a>
            </div>
        </div>`;
    
    // append template to #locateSidebarItemsPreview
    locateSidebarItemsPreview.insertAdjacentHTML('beforeend', template);
};

export { locateMap };