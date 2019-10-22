require([
    "esri/Map",
    "esri/views/MapView",
    "esri/widgets/BasemapToggle",
    "esri/widgets/BasemapGallery",
    "esri/widgets/Search",
    "esri/layers/FeatureLayer",
    "esri/tasks/RouteTask",
    "esri/tasks/support/RouteParameters",
    "esri/tasks/support/FeatureSet",
    "esri/Graphic"
  ], function(Map, MapView, Search, BasemapToggle, BasemapGallery, FeatureLayer, RouteTask, RouteParameters, FeatureSet, Graphic) {

    var map = new Map({
        basemap: "streets-navigation-vector"
      });
  
      var view = new MapView({
        container: "viewDiv",
        map: map,
        center: [-118.80500, 34.02700], // longitude, latitude
        zoom: 13
      });

  var basemapToggle = new BasemapToggle({
    view: view,
    nextBasemap: "satellite"
  });

  //view.ui.add(basemapToggle, "bottom-right");

  var basemapGallery = new BasemapGallery({
    view: view,
    container: document.createElement("div"),
    source: {
      portal: {
        url: "https://www.arcgis.com",
        useVectorBasemaps: false  // Load vector tile basemaps
      }
    }
  });

 // view.ui.add(basemapGallery, "top-right");

  var search = new Search({
    view: view
  });

  view.ui.add(search, "top-right");



  var routeTask = new RouteTask({
    url: "https://utility.arcgis.com/usrsvcs/appservices/Hr0YwNsk3KRTTywS/rest/services/World/Route/NAServer/Route_World/solve"
 });

  view.on("click", function(event){
    if (view.graphics.length === 0) {
      addGraphic("start", event.mapPoint);
    } else if (view.graphics.length === 1) {
      addGraphic("finish", event.mapPoint);
      getRoute();
    } else {
      view.graphics.removeAll();
      addGraphic("start",event.mapPoint);
    }
  });

  function addGraphic(type, point) {
    var graphic = new Graphic({
      symbol: {
        type: "simple-marker",
        color: (type === "start") ? "white" : "black",
        size: "8px"
      },
      geometry: point
    });
    view.graphics.add(graphic);
  }

  function getRoute() {
    // Setup the route parameters
    var routeParams = new RouteParameters({
      stops: new FeatureSet({
        features: view.graphics.toArray() // Pass the array of graphics
      }),
      returnDirections: true
    });
    // Get the route
    routeTask.solve(routeParams).then(function(data) {
      // Display the route
      data.routeResults.forEach(function(result) {
        result.route.symbol = {
          type: "simple-line",
          color: [5, 150, 255],
          width: 3
        };
        view.graphics.add(result.route);
      });
    });
  }

});