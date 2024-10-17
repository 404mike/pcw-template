import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { get } from "sortablejs";

const sidebarItemsButtonTab = document.getElementById('mapLocateSidebarItems');
const sidebarSearchButtonTab = document.getElementById('mapLocateSidebarSearch');
const sidebarCloseButton = document.getElementById('mapLocateSidebarClose');
const sidebarOpenButton = document.getElementById('mapSidebarOpenButton');
const locateBackToItemsButton = document.getElementById('locateBackToItemsButton');

const locateSidebarSearch = document.getElementById('locateSidebarSearchContainer');
const locateSidebarItems = document.getElementById('locateSidebarItemsContainer');
const locateSidebarItemsPreview = document.getElementById('locateSidebarItemsPreview');
const locateSidebarPagination = document.getElementById('locateSidebarPagination');
const locateSidebarItemPreview = document.getElementById('locateSidebarItemPreview');
const locateNumberResults = document.getElementById('locateNumberResults');

let mapObj;
let AdvancedMarkerElementObj;
let markers = [];
let clusterer;
let mapPosition;
let geoJsonData;
let geojsonDataFormatted;
let mapViewState = '';
let num_results = 200;
let debounceTimer;

const locateMap = (map, AdvancedMarkerElement) => {
    mapObj = map;
    AdvancedMarkerElementObj = AdvancedMarkerElement;
    setEventListeners();
};

const setEventListeners = () => {
    sidebarItemsButtonTab.addEventListener('click', (e) => {
        e.preventDefault();
        sidebarItemsButtonClicked();
    });

    sidebarSearchButtonTab.addEventListener('click', (e) => {
        e.preventDefault();
        sidebarSearchButtonClicked();
    });

    sidebarCloseButton.addEventListener('click', (e) => {
        e.preventDefault();
        sidebarCloseButtonClicked();
    });

    sidebarOpenButton.addEventListener('click', (e) => {
        e.preventDefault();
        sidebarOpenButtonClicked();
    });

    locateBackToItemsButton.addEventListener('click', (e) => {
        e.preventDefault();
        locateBackToItemsButtonClicked();
    });

    locateNumberResults.addEventListener('change', (e) => {
        e.preventDefault();
        updateNumberOfResults();
    });

    // listen to map move event
    mapObj.addListener('bounds_changed', () => {
        if (mapViewState === 'preview') return;
    
        // Clear the existing timer if it exists
        clearTimeout(debounceTimer);
    
        // Set a new timer
        // This will prevent the function from running until the user has stopped moving the map
        debounceTimer = setTimeout(() => {
            updateMapPosition();
        }, 500);
    });
};

const updateNumberOfResults = () => {
    num_results = locateNumberResults.value;
    getGeoJson();
};

const sidebarItemsButtonClicked = () => {
    sidebarItemsButtonTab.classList.add('locate-sidebar-nav-active');
    sidebarSearchButtonTab.classList.remove('locate-sidebar-nav-active');

    locateSidebarSearch.style.display = 'none';
    locateSidebarItemPreview.style.display = 'none';
    locateSidebarItems.style.display = 'block';
    locateSidebarPagination.style.display = 'block';

    resetImagePreview();
};

const sidebarSearchButtonClicked = () => {
    sidebarItemsButtonTab.classList.remove('locate-sidebar-nav-active');
    sidebarSearchButtonTab.classList.add('locate-sidebar-nav-active');

    locateSidebarSearch.style.display = 'block';
    locateSidebarItems.style.display = 'none';
    locateSidebarPagination.style.display = 'none';
    locateSidebarItemPreview.style.display = 'none';

    resetImagePreview();
};

const setSidebarItemPreviewEventListeners = () => {
    // loop class locate-sidebar-img and add event listener
    const locateSidebarImg = document.querySelectorAll('.locate-sidebar-img');
    locateSidebarImg.forEach((img) => {
        img.addEventListener('click', (e) => {
            e.preventDefault();
            let id = img.id.replace('locateNode', '');
            const imgSrc = img.src;
            locateSidebarImgClicked(id, imgSrc);
        });
    });
};

const locateSidebarImgClicked = (id, src) => {
    mapViewState = 'preview'; // Set this before any map changes

    sidebarItemsButtonTab.classList.remove('locate-sidebar-nav-active');

    locateSidebarItemPreview.style.display = 'block';
    locateSidebarItems.style.display = 'none';
    locateSidebarPagination.style.display = 'none';

    const previewImg = document.getElementById('locateSideNodeImagePreview');
    previewImg.src = src;

    clearAllMarkers();

    addItemMarker({
        lat: geojsonDataFormatted[id].coordinates[1],
        lng: geojsonDataFormatted[id].coordinates[0]
    });

    // Ensure mapViewState remains 'preview' until after the zoom
    google.maps.event.addListenerOnce(mapObj, 'idle', () => {
        // Optionally reset mapViewState here if needed
    });
};

const locateBackToItemsButtonClicked = () => {
    sidebarItemsButtonTab.classList.add('locate-sidebar-nav-active');
    locateSidebarItemPreview.style.display = 'none';
    locateSidebarItems.style.display = 'block';
    locateSidebarPagination.style.display = 'block';

    mapViewState = '';

    resetImagePreview();
};

const resetImagePreview = () => {
    clearAllMarkers();
    getGeoJsonFeatures(); 

    let mapHasMoved = hasMapMoved();
    if(mapHasMoved) {
        setNewMapPosition();
    }
};

const sidebarCloseButtonClicked = () => {
    document.getElementById('mapSidebar').style.display = 'none';
    document.getElementById('mapSidebarOpenButton').style.display = 'flex';
};

const sidebarOpenButtonClicked = () => {
    document.getElementById('mapSidebar').style.display = 'flex';
    document.getElementById('mapSidebarOpenButton').style.display = 'none';
};

const getGeoJson = async () => {
    const pcwdomain = `https://www.peoplescollection.wales/locate/geojson`;
    let zoom = mapObj.getZoom();
    let bbox = getBoundingBox();
    let west = bbox.west;
    let north = bbox.north;
    let east = bbox.east;
    let south = bbox.south;
    let locateurl = '';

    if(window.location.hostname === 'localhost') {
        const pcwlocate = `${pcwdomain}?zoom=${zoom}&bbox=${west},${north},${east},${south}&num_results=${num_results}`;
        locateurl = `http://localhost:8944/dist/proxy.php?url=` + encodeURIComponent(pcwlocate);
    }else{
        locateurl = `${pcwdomain}?zoom=${zoom}&bbox=${west},${north},${east},${south}&num_results=${num_results}`;
    }

    try {
        const response = await fetch(locateurl);
        const data = await response.json();
        geoJsonData = data;
        getGeoJsonFormatted(data);
        getGeoJsonFeatures();
    } catch (error) {
        console.error('Failed to load GeoJSON data', error);
    }
};

const getGeoJsonFormatted = (data) => {
    let items = {};
    for (let i = 0; i < data.features.length; i++) {
        let nid = data.features[i].properties.nid;
        items[nid] = {
            'title': data.features[i].properties.title,
            'thumbnail': data.features[i].properties.thumbnail,
            'coordinates': data.features[i].geometry.coordinates,
            'description': data.features[i].properties.description,
        };
    }

    geojsonDataFormatted = items;
};

const getBoundingBox = () => {
    const bounds = mapObj.getBounds();
    const northEast = bounds.getNorthEast();
    const southWest = bounds.getSouthWest();

    return {
        north: northEast.lat(),
        south: southWest.lat(),
        east: northEast.lng(),
        west: southWest.lng()
    };
}

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

        // Add event listener to the marker
        marker.addListener('click', function() {
            console.log('Marker was clicked',  feature['properties']['nid']);
            // Add your callback logic here
        });

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
};

const addItemMarker = (location) => {
    const targetZoom = 15;

    // Set center and zoom
    mapObj.setCenter(location);
    mapObj.setZoom(targetZoom);

    // Add the marker
    const marker = new AdvancedMarkerElementObj({
        map: mapObj,
        position: location,
        title: "Item Location",
    });
    markers.push(marker);
};


const clearAllMarkers = () => {
    console.log('clearAllMarkers');
    markers.forEach(marker => marker.setMap(null)); // Remove each marker from the map
    markers = []; // Reset the markers array

    if (clusterer) {
        clusterer.clearMarkers(); // Use the correct variable
    }

    clearGeoJsonFeatures(); // Clear GeoJSON features from the data layer

    // Clear sidebar
    locateSidebarItemsPreview.innerHTML = '';
};

const clearGeoJsonFeatures = () => {
    mapObj.data.forEach((feature) => {
        mapObj.data.remove(feature);
    });
};

const updateMapPosition = () => {
    if (mapViewState === 'preview') return;

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

    // Only reset mapViewState if it's not 'preview'
    if (mapViewState !== 'preview') {
        // Add a one-time listener for the 'idle' event
        google.maps.event.addListenerOnce(mapObj, 'idle', () => {
            mapViewState = '';
        });
    }
};

const addItemPreviewToSidebar = (item) => {
    const id = item.nid;
    const imageSrc = item.thumbnail;
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

const hasMapMoved = () => {
    const center = mapObj.getCenter();
    const zoom = mapObj.getZoom();
    const bounds = mapObj.getBounds();
  
    const currentMapPosition = {
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
  
    return (currentMapPosition.lat !== mapPosition.lat ||
            currentMapPosition.lng !== mapPosition.lng ||
            currentMapPosition.zoom !== mapPosition.zoom ||
            currentMapPosition.bounds.north !== mapPosition.bounds.north ||
            currentMapPosition.bounds.south !== mapPosition.bounds.south ||
            currentMapPosition.bounds.east !== mapPosition.bounds.east ||
            currentMapPosition.bounds.west !== mapPosition.bounds.west);
  };

export { locateMap };