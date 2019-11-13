require([
    "esri/Graphic",
    "esri/tasks/RouteTask",
    "esri/tasks/support/RouteParameters",
    "esri/tasks/support/FeatureSet",
    "esri/geometry/Point"
  ], function(Graphic, Point) {
      pointIndex = 0;
      pointArray = [];

      addStop = function(mapPoint) {
        const stopPoint = new Graphic(mapPoint, pointSymbol);
        view.graphics.add(stopPoint);
        $('.map-points').css('display','flex');
        pointArray[pointIndex] = stopPoint;
        $('.map-points').append('<a id="'+pointIndex+'"><i class="fas fa-map-marker-alt"></i>'+pointIndex +'- '+mapPoint.latitude+' , '+mapPoint.longitude+' '+'<div class="control-arrows"><i onclick="moveUp('+pointIndex+')" class="pointer fas fa-arrow-up"></i><i onclick="moveDown('+pointIndex+')" class="pointer fas fa-arrow-down"></i><i onclick="deletePoint('+pointIndex+')" class="fas fa-times"></i></div></a>');
        pointIndex++;
        if (pointIndex >= 2) {
          $('#generate-route').removeClass('not-active');
        }
        if ($('#save-point').hasClass('not-active')) {
          $('#save-point').removeClass('not-active');
        }
      }

      moveUp = function(id) {
        if (id !== 0) {
          var pointAux = pointArray[id-1];
          pointArray[id-1] = pointArray[id];
          pointArray[id] = pointAux;
          $('.map-points a').remove();
          var indexP = 0;
          pointArray.map(function(mapPoint) {
            $('.map-points').append('<a id="'+indexP+'"><i class="fas fa-map-marker-alt"></i>'+indexP +'- '+mapPoint.geometry.latitude+' '+mapPoint.geometry.longitude+' '+'<div class="control-arrows"><i onclick="moveUp('+indexP+')" class="pointer fas fa-arrow-up"></i><i onclick="moveDown('+indexP+')" class="pointer fas fa-arrow-down"></i><i onclick="deletePoint('+indexP+')" class="fas fa-times"></i></div></a>');
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
            $('.map-points').append('<a id="'+indexP+'"><i class="fas fa-map-marker-alt"></i>'+indexP +'- '+mapPoint.geometry.latitude+' '+mapPoint.geometry.longitude+' '+'<div class="control-arrows"><i onclick="moveUp('+indexP+')" class="pointer fas fa-arrow-up"></i><i onclick="moveDown('+indexP+')" class="pointer fas fa-arrow-down"></i><i onclick="deletePoint('+indexP+')" class="fas fa-times"></i></div></a>');
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
          $('.map-points').append('<a id="'+indexP+'"><i class="fas fa-map-marker-alt"></i>'+indexP +'- '+mapPoint.geometry.latitude+' '+mapPoint.geometry.longitude+' '+'<div class="control-arrows"><i onclick="moveUp('+indexP+')" class="pointer fas fa-arrow-up"></i><i onclick="moveDown('+indexP+')" class="pointer fas fa-arrow-down"></i><i onclick="deletePoint('+indexP+')" class="fas fa-times"></i></div></a>');
          indexP++;
        });
        pointIndex--;
        if (pointIndex === 0) {
          $('#save-point').addClass('not-active');
          $('.map-points').css('display','none');
        }
        if (pointIndex === 1) {
          $('#generate-route').addClass('not-active');
        }
      }

      mapTap = function(event) {
        if (!disableTap) {
          event.stopPropagation();
          mapPoint = event.mapPoint;
          view.popup.open({
            title: "Posición seleccionada",
            location: mapPoint,
            content: "<div class='searchPopup'><h4>Añadir punto</h4><button type='button' value='Agregar parada' class='w3-button w3-green' onclick='addStop(mapPoint); view.popup.close()'>+</button></div>"
          });
        }
      }
      
      view.on("click", mapTap);

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
          cleanMap();
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

      $('#save-point').on('click', function() {
        var pointName = prompt("Ingrese el nombre para los puntos");
        var index = 1;
        if (pointArray != null && pointArray.length > 0) {
          pointArray.map(function(actualPoint){
            var attributes = {
              "event_type": '333',
              "description" : pointName+'-'+index
            };
            var newPoint = new Graphic(actualPoint.geometry, null, attributes);
            points.applyEdits({
              addFeatures: [newPoint]
            }).then(function (res) {
            });
            index++;
          })
        }
        cleanMap();
    })

    $('#get-saved-point').on('click', function() {
        var query = points.createQuery();
        query.outFields = [ "objectid" ];
        $('.saved-routes').css('display','flex');
        query.where = "event_type = '333'";
        points.queryFeatures(query).then(function(objectIds) {
          for (index = 0; index < objectIds.features.length; index++) {
            (function() {
              var point = objectIds.features[index].attributes.objectid;
              var queryId = points.createQuery(); 
              queryId.where = "objectid = " + point;
              points.queryFeatures(queryId).then(function(actualPoint) {
                let pointName = actualPoint.features[0].attributes.description;
                let id = actualPoint.features[0].attributes.objectid;
                $('.saved-routes').append('<a id="'+point+'" onclick="showPoint(id)"><i class="fas fa-road"></i>'+pointName+'</a>')
              })
            })();
          }
        });
    });

      showRoute = function(id) { 
        view.graphics.remove(currentRoute);
        var queryId = routes.createQuery(); 
        queryId.where = "objectid = " + id;
        routes.queryFeatures(queryId).then(function(route) {
          var shownRoute = route.features[0];
          shownRoute.symbol = routeSymbol;
          currentRoute = shownRoute;
          view.graphics.add(shownRoute);
          view.center = shownRoute.geometry.paths[0][0];  
        });
        $('#simulate').removeClass('not-active');
      };

      showPoint = function(id) { 
        var queryId = points.createQuery(); 
        queryId.where = "objectid = " + id;
        points.queryFeatures(queryId).then(function(actualPoint) {
          var shownPoint = actualPoint.features[0];
          shownPoint.symbol = pointSymbol;
          view.graphics.add(shownPoint);
        });
      };

      $('#simulate').on('click', function(){
        $('.options-box').css('display','none');
        $('.saved-routes').css('display','none');
        $('.saved-routes a').remove();
        $('.map-points').css('display', 'none');
        $('.simulation-hide').css('display','flex'); 
        $('#lessSpeed').after('<p>'+initialSpeed+'</p>');
        $('#lessRadio').after('<p>'+bufferDistance+'</p>');
        disableTap = true;
      });

      cleanMap = function() {
        $('.options-box').css('display','flex');
        $('.simulation-hide').css('display','none');
        $(".population").css('display','none');
        $('#start').removeClass('not-active');
        $('#save-route').addClass('not-active');
        $('#generate-route').addClass('not-active');
        $('#save-point').addClass('not-active');
        $('#simulate').addClass('not-active');
        $('.map-points').css('display', 'none');
        $('.map-points a').remove();
	    	$('.speedControl p').remove();
		    $('.radioControl p').remove();
        pause = true;
	    	canceled = true;
        pointIndex = 0;
        pointArray = [];
        countiesLayer.removeAll();
        view.graphics.remove(graphicBuffer);
        view.graphics.removeAll();
        disableTap = false;
      }

      $('#clean-map').on('click', cleanMap);

      closeSavedRoutes = function() {
        $('.saved-routes').css('display','none');
        $('.saved-routes a').remove();
      }
});