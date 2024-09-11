import { Loader } from "@googlemaps/js-api-loader";
import { contributeMap } from "./contribute-map.js";
import { collectionMap } from "./collection-map.js";
import { locateMap } from "./locate-map.js";
import { itemMap } from "./item-map.js";

let map;
const wales = { lat: 52.41371375319883, lng: -4.084020475317442 };
const walesBounds = {
    north: 53.431,
    south: 51.357,
    west: -5.508,
    east: -2.679
};

const additionalOptions = {};
const loader = new Loader({
  apiKey: "AIzaSyD2IjeESJzSXKrTzkHZVsxtkVTgXBSMW8M",
  version: "weekly",
  ...additionalOptions,
});

function initMap() {

  if (!document.getElementById("map")) return;

  const mapType = document.getElementById("map").dataset.mapType;

  loader.load().then(async () => {
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    map = new Map(document.getElementById("map"), {
      center: wales,
      zoom: 11,
      mapId: "6a2c815609bc8f90",
      gestureHandling: "greedy",
      streetViewControl: false,
    });

    map.addListener('bounds_changed', () => {
        const inView = isWalesInView(map);
        if(!inView) {
            setLayer('google')
            historicalLayerButtons(true);
        } else {
            historicalLayerButtons(false);
        }
    });

    if (mapType === "contribute") {
      contributeMap(map, AdvancedMarkerElement);
    }
    if (mapType === "item") {
      itemMap(map, AdvancedMarkerElement);
    }
    if (mapType === "collection") {
      collectionMap(map, AdvancedMarkerElement);
    }
    if (mapType === "locate") {
      locateMap(map, AdvancedMarkerElement);
    }

    mapLayerEventListeners();
  });
}

const mapLayerEventListeners = () => {
  const mapLayerButtons = document.querySelectorAll('.historical-map-layer');
  mapLayerButtons.forEach((button) => {

    button.addEventListener('click', (e) => {
      let target = e.target;
      if (target.tagName === 'P') {
        target = target.parentElement;
      }

      let layer = target.id;
      layer = layer.replace('map-layer-', '');
      setLayer(layer);
    });
  });
}

const setLayer = (layerId) => {
    const layers = {
      'google': 'roadmap',
      '1staddition': { id: '1staddition', url: 'https://api.maptiler.com/tiles/004511f7-2020-4596-9223-fa674e0a4c97/{z}/{x}/{y}.png?key=1CYucAPOyljr43DBNflu' },
      '2ndaddition': { id: '2ndaddition', url: 'https://api.maptiler.com/tiles/e0355e0d-6f76-4eef-903f-d4557c351379/{z}/{x}/{y}.png?key=1CYucAPOyljr43DBNflu' },
      '3rdaddition': { id: '3rdaddition', url: 'https://api.maptiler.com/tiles/975ee73d-5cb6-4249-b7d2-5e813b68742e/{z}/{x}/{y}.png?key=1CYucAPOyljr43DBNflu' },
      '4thaddition': { id: '4thaddition', url: 'https://api.maptiler.com/tiles/fac1ce11-ff10-48b3-b67f-863e552b08b4/{z}/{x}/{y}.png?key=1CYucAPOyljr43DBNflu' },
      'tithe': { id: 'tithe', url: 'https://api.maptiler.com/tiles/ee8ebe51-0b4e-4a32-b444-ae919ed160ad/{z}/{x}/{y}?key=78ieVgsnZ53wgUTt8E8j' }
    };
  
    if (layerId === 'google') {
      map.setMapTypeId(google.maps.MapTypeId.ROADMAP); // Switch back to the default Google Maps layer
    } else {
      const { id, url } = layers[layerId];
  
      const layer = new google.maps.ImageMapType({
        name: id,
        getTileUrl: (coord, zoom) => url
          .replace('{x}', coord.x)
          .replace('{y}', coord.y)
          .replace('{z}', zoom),
        tileSize: new google.maps.Size(256, 256),
        minZoom: 1,
        maxZoom: 20
      });
  
      map.mapTypes.set(id, layer);
      map.setMapTypeId(id);
    }

    const mapLayerButtons = document.querySelectorAll('.historical-map-layer');
    mapLayerButtons.forEach((button) => {
        button.classList.remove('layer-button-active');
    });

    const selectedLayerButton = document.getElementById(`map-layer-${layerId}`);
    selectedLayerButton.classList.add('layer-button-active');
  }

  const isWalesInView = (map) => {
    const bounds = map.getBounds();
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
  
    const mapBounds = {
      north: ne.lat(),
      south: sw.lat(),
      west: sw.lng(),
      east: ne.lng()
    };
  
    // Check if map bounds intersect with Wales bounds
    const inView = mapBounds.north >= walesBounds.south &&
                   mapBounds.south <= walesBounds.north &&
                   mapBounds.east >= walesBounds.west &&
                   mapBounds.west <= walesBounds.east;
  
    return inView;
  }
  
const historicalLayerButtons = (disable) => {
    let historicalLayerButtons = document.querySelectorAll('.historical-map-layer');
    if (disable) {
        historicalLayerButtons.forEach((button) => {
            button.classList.add('disabled');
        });
    } else {
        historicalLayerButtons.forEach((button) => {
            button.classList.remove('disabled');
        });
    }
}

export { initMap };