require([
    "esri/Graphic",
    "esri/tasks/RouteTask",
    "esri/tasks/support/RouteParameters",
    "esri/tasks/support/FeatureSet"
  ], function(Graphic) {

      addStop = function(mapPoint) {
        const stopPoint = new Graphic(mapPoint, pointSymbol);
        view.graphics.add(stopPoint);
      }

      view.on("click", function(event) {
        event.stopPropagation();
        mapPoint = event.mapPoint;
        view.popup.open({
          title: "Posición seleccionada",
          location: mapPoint,
          content: "<div class='searchPopup'><h4>Añadir punto</h4><button type='button' value='Agregar parada' class='w3-button w3-xlarge w3-circle w3-red w3-card-4' onclick='addStop(mapPoint); view.popup.close()'>+</button></div>"
        });
      });

      $('#save-route').on('click', function() {
          var routeName = prompt("Ingrese el nombre de la ruta");
          if (routeName != null && routeName != "") {
            currentRoute.attributes = {
              "notes" : 'sig2019-gr05' + routeName
            };
            routes.applyEdits({
              addFeatures: [currentRoute]
            }).then(function (res) {
              currentRoute.symbol = routeSymbol;
            });
          }
          view.graphics.removeAll();
      })

      $('#get-saved-route').on('click', function() {
          var queryRoutes = routes.createQuery();
          queryRoutes.where = "notes LIKE 'sig2019-gr05%'";
          queryRoutes.outFields = [ "objectid" ];
          $('.saved-routes').css('display','flex');
          routes.queryFeatures(queryRoutes).then(function(objectIds) {
            for (index = 0; index < objectIds.features.length; index++) {
              (function() {
                var routy = objectIds.features[index].attributes.objectid;
                var queryId = routes.createQuery();
                queryId.where = "objectid = " + routy.toString();
                routes.queryFeatures(queryId).then(function(route) {
                  var shownRoute = route.features[0];
                  shownRoute.symbol = routeSymbol;
                  let routeName = route.features[0].attributes.notes;
                  let id = route.features[0].attributes.objectid;
                  $('.saved-routes').append('<a id="'+id+'" onclick="showRoute()">'+routeName+'</a>')
                })
              })();
            }
          });
      });

      showRoute = function() {  
        routes.queryFeatures($(this).attr("id")).then(function(route) {
          var shownRoute = route.features[0];
          shownRoute.symbol = routeSymbol;
          view.graphics.add(shownRoute);
        })
      };
});