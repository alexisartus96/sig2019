require([
    "esri/tasks/RouteTask",
    "esri/tasks/support/FeatureSet",
	"esri/tasks/support/RouteParameters"
	], 

	function(RouteTask, FeatureSet, RouteParameters) {

		routeTask = new RouteTask("https://utility.arcgis.com/usrsvcs/appservices/Hr0YwNsk3KRTTywS/rest/services/World/Route/NAServer/Route_World/solve");

        $('#generate-route').on('click', function (event) {
            event.stopPropagation();
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
              currentRoute = data.routeResults[0].route;
              currentRoute.symbol = routeSymbol;
              view.graphics.add(currentRoute);
            });
          });
       
        
	}
)
