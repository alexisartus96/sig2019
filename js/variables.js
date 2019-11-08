// Map
var map, view, searchPopup;

// Symbols 
var pointSymbol, routeSymbol, bufferSymbol, regularCarSymbol;

// Routes
var pointIndex, pointArray, routes, currentRoute;

// Speed
const initialSpeed = 100;
const sleepTime =  1000;
var speed = initialSpeed;

// Counties
var counties, countiesLayer;

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