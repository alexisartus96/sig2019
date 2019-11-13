// Map
var map, view, searchPopup;

// Symbols 
var pointSymbol, routeSymbol, bufferSymbol, regularCarSymbol, countySymbol, slowRouteSymbol, regularRouteSymbol, fastRouteSymbol, changeState;

// Routes
var pointIndex, pointArray, routes, currentRoute;

// Speed
const initialSpeed = 10;
const sleepTime =  3000;
var speed = initialSpeed;

// Simulation
var pause, canceled;
var bufferDistance = 10;

// Counties
var counties, countiesLayer, circle;
var actualState = ''

var graphicBuffer, carGraphic, bufferParams;

var mapTap, disableTap;

require([
    "esri/Map",
    "esri/views/MapView",
    "esri/PopupTemplate",
    "esri/layers/TileLayer",
    "esri/layers/GraphicsLayer"
  ], function(Map, MapView, PopupTemplate, TileLayer, GraphicsLayer) {
        map = new Map({
        });
        
        const tiled = new TileLayer("http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer");
        map.add(tiled);
        
        countiesLayer = new GraphicsLayer();
		map.add(countiesLayer);
    
        view = new MapView({
        container: "viewDiv",
        map: map,
        center: [-94.62681999999995, 39.11352000000004], // longitude, latitude
        zoom: 9
        });

        searchPopup = new PopupTemplate();
  });