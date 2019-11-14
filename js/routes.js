require([
    "esri/Graphic",
    "esri/tasks/RouteTask",
    "esri/tasks/support/FeatureSet",
    "esri/tasks/support/RouteParameters",
    "esri/geometry/support/webMercatorUtils"
	], 

	function(Graphic, RouteTask, FeatureSet, RouteParameters, webMercatorUtils) {

		routeTask = new RouteTask("https://utility.arcgis.com/usrsvcs/appservices/Hr0YwNsk3KRTTywS/rest/services/World/Route/NAServer/Route_World/solve");

        $('#generate-route').on('click', function (event) {
            event.stopPropagation();
            // Setup the route parameters
            view.graphics.remove(currentRoute);

            var features = [];

            pointArray.forEach(element => {
              g = element.geometry;
              if(!element.geometry.spatialReference.isWGS84){
                g = webMercatorUtils.webMercatorToGeographic(element.geometry);
              }
              features.push({"geometry": g})
            });

            var routeParams = new RouteParameters({
              stops: new FeatureSet({
                features: features // Pass the array of graphics
              }),
              returnDirections: true
            });
            // Get the route
            routeTask.solve(routeParams).then(function(data) {
              // Display the route
              currentRoute = data.routeResults[0].route;
              currentRoute.symbol = routeSymbol;
              view.graphics.add(currentRoute);
            });
            $('#simulate').removeClass('not-active');
            $('#save-route').removeClass('not-active');
          });
       
        
	}
)
