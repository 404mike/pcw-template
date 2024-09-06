const wales = { lat: 52.41371375319883, lng: -4.084020475317442 };

const itemMap = (map, AdvancedMarkerElement) => {
    addMarker(map, AdvancedMarkerElement, wales);
};

const addMarker = (map, AdvancedMarkerElement, location) => {
    const marker = new AdvancedMarkerElement({
      map: map,
      position: location,
      title: "Item Location",
    });
};

export { itemMap };