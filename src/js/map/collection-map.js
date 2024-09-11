const items = [
    {
        id: 1,
        name: 'item 1',
        location: {
            'lat': 52.3800615066451,
            'lng': -4.071716911632866
        }
    },
    {
        id: 2,
        name: 'item 2',
        location: {
            'lat' :52.360018502737624,
            'lng': -3.978870650984919
        }
    },
    {
        id: 3,
        name: 'item 3',
        location:  {
            'lat': 52.45746704195877,
            'lng': -3.9424178113956887
        }
    }
];

const collectionMap = (map, AdvancedMarkerElement) => {
    items.forEach(item => {
        addMarker(map, AdvancedMarkerElement, item.location);
    });
};

const addMarker = (map, AdvancedMarkerElement, location) => {
    const marker = new AdvancedMarkerElement({
      map: map,
      position: location,
      title: "Item Location",
    });
};

export { collectionMap };