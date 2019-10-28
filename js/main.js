require([
    "esri/PopupTemplate",
    "esri/tasks/RouteTask",
    "esri/tasks/support/RouteParameters",
    "esri/tasks/support/FeatureSet",
    "esri/Graphic"
  ], function() {
    /*var routeTask = new RouteTask({
      url: "https://utility.arcgis.com/usrsvcs/appservices/Hr0YwNsk3KRTTywS/rest/services/World/Route/NAServer/Route_World/solve"
   });

    view.on("click", function(event){
     addGraphic("start", event.mapPoint);
      if (view.graphics.length === 5) {
      getRoute();
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
  }*/
});