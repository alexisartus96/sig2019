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
        )
	}
)
