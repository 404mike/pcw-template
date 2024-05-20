import { Loader } from "@googlemaps/js-api-loader";
import mapStyles from './gmaps-style.json';

let map;
const additionalOptions = {};
const loader = new Loader({
  apiKey: "AIzaSyD2IjeESJzSXKrTzkHZVsxtkVTgXBSMW8M",
  version: "weekly",
  ...additionalOptions,
});

const wales = {lat: 52.41371375319883, lng: -4.084020475317442};

function initMap(){
    console.log('initMap');

    loader.load().then(async () => {
        const { Map } = await google.maps.importLibrary("maps");
      
        map = new Map(document.getElementById("map"), {
          center: wales,
          zoom: 11,
          styles: mapStyles,
        });
      });
}

export { initMap };