var map, view, searchPopup;


require([
    "esri/Map",
    "esri/views/MapView",
    "esri/PopupTemplate",
  ], function(Map, MapView, PopupTemplate) {
        map = new Map({
            basemap: "streets-navigation-vector"
        });
    
        view = new MapView({
        container: "viewDiv",
        map: map,
        center: [-94.62681999999995, 39.11352000000004], // longitude, latitude
        zoom: 4
        });

        searchPopup = new PopupTemplate();
  });