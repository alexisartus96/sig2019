require([
    "esri/Graphic",
    "esri/tasks/RouteTask",
    "esri/tasks/support/RouteParameters",
    "esri/tasks/support/FeatureSet"
  ], function(Graphic) {
      pointIndex = 0;
      pointArray = [];

      addStop = function(mapPoint) {
        const stopPoint = new Graphic(mapPoint, pointSymbol);
        view.graphics.add(stopPoint);
        $('.map-points').css('display','flex');
        pointArray[pointIndex] = stopPoint;
        $('.map-points').append('<a id="'+pointIndex+'"><i class="fas fa-map-marker-alt"></i>'+mapPoint.latitude+' , '+mapPoint.longitude+' '+'<i onclick="moveUp('+pointIndex+')" class="pointer fas fa-arrow-up"></i><i onclick="moveDown('+pointIndex+')" class="pointer fas fa-arrow-down"></i><i onclick="deletePoint('+pointIndex+')" class="fas fa-times"></i></a>');
        pointIndex++;
      }

      moveUp = function(id) {
        if (id !== 0) {
          var pointAux = pointArray[id-1];
          pointArray[id-1] = pointArray[id];
          pointArray[id] = pointAux;
          $('.map-points a').remove();
          var indexP = 0;
          pointArray.map(function(mapPoint) {
            $('.map-points').append('<a id="'+indexP+'"><i class="fas fa-map-marker-alt"></i>'+mapPoint.geometry.latitude+' '+mapPoint.geometry.longitude+' '+'<i onclick="moveUp('+indexP+')" class="pointer fas fa-arrow-up"></i><i onclick="moveDown('+indexP+')" class="pointer fas fa-arrow-down"></i><i onclick="deletePoint('+indexP+')" class="fas fa-times"></i></a>');
            indexP++;
          });
        }
      }

      moveDown = function(id) {
        if (id !== (pointArray.length - 1)) {
          var pointAux = pointArray[id+1];
          pointArray[id+1] = pointArray[id];
          pointArray[id] = pointAux;
          $('.map-points a').remove();
          var indexP = 0;
          pointArray.map(function(mapPoint) {
            $('.map-points').append('<a id="'+indexP+'"><i class="fas fa-map-marker-alt"></i>'+mapPoint.geometry.latitude+' '+mapPoint.geometry.longitude+' '+'<i onclick="moveUp('+indexP+')" class="pointer fas fa-arrow-up"></i><i onclick="moveDown('+indexP+')" class="pointer fas fa-arrow-down"></i><i onclick="deletePoint('+indexP+')" class="fas fa-times"></i></a>');
            indexP++;
          });
        }
      }

      deletePoint = function(id) {
        view.graphics.remove(pointArray[id]);
        pointArray.splice(id,1);
        $('.map-points a').remove();
        var indexP = 0;
        pointArray.map(function(mapPoint) {
          $('.map-points').append('<a id="'+indexP+'"><i class="fas fa-map-marker-alt"></i>'+mapPoint.geometry.latitude+' '+mapPoint.geometry.longitude+' '+'<i onclick="moveUp('+indexP+')" class="pointer fas fa-arrow-up"></i><i onclick="moveDown('+indexP+')" class="pointer fas fa-arrow-down"></i><i onclick="deletePoint('+indexP+')" class="fas fa-times"></i></a>');
          indexP++;
        });
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
                  let routeName = route.features[0].attributes.notes;
                  let id = route.features[0].attributes.objectid;
                  $('.saved-routes').append('<a id="'+id+'" onclick="showRoute(id)"><i class="fas fa-road"></i>'+routeName+'</a>')
                })
              })();
            }
          });
      });

      showRoute = function(id) { 
        var queryId = routes.createQuery(); 
        queryId.where = "objectid = " + id;
        routes.queryFeatures(queryId).then(function(route) {
          var shownRoute = route.features[0];
          shownRoute.symbol = routeSymbol;
          currentRoute = shownRoute;
          view.graphics.add(shownRoute);
        });
        $('.options-box').css('display','none');
        $('.saved-routes').css('display','none');
        $('.saved-routes a').remove();
        $('.simulation-hide').css('display','flex');
      };
});