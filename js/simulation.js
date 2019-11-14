require([
	"esri/geometry/Point",
	"esri/Graphic",
	"esri/tasks/support/BufferParameters",
	"esri/tasks/GeometryService",
  	"esri/geometry/Circle",
	"esri/tasks/support/AreasAndLengthsParameters",
	"esri/symbols/SimpleFillSymbol"], 
   function(Point, Graphic, BufferParameters, GeometryService, Circle, AreasAndLengthsParameters, SimpleFillSymbol) {
	   

	$('#start').on('click',  simulate = async function() {
		$('#start').addClass('not-active');
		$(".population").css('display','flex');
		pause = false;
		canceled = false;
		var index = 0;
		var indexPath = 0;
		var endRoute = false;
		carSymbol = slowCarSymbol;
		speed = initialSpeed;
		while (!endRoute && !canceled) {
			if (!pause) {
				view.graphics.remove(carGraphic);
				car = new Point(currentRoute.geometry.paths[indexPath][index][0], currentRoute.geometry.paths[indexPath][index][1]);
				
				checkState(indexPath, index);

				bufferParams = new BufferParameters();
				bufferParams.geometries = [car];
				bufferParams.distances = [ bufferDistance ];
				bufferParams.unit = GeometryService.UNIT_KILOMETER;
				bufferParams.outSpatialReference = view.spatialReference;
				geometryService.buffer(bufferParams).then(showBuffer);

				carGraphic = new Graphic(car, carSymbol);
				view.graphics.add(carGraphic);
				
				await sleep(sleepTime);
				addSpeedLine(indexPath, index);
				index = index + speed;
				if(index >= currentRoute.geometry.paths[indexPath].length) {
					indexPath++;
					index = 0;
					if (indexPath >= currentRoute.geometry.paths.length)
						endRoute = true;
				}
			} else {
				await sleep(sleepTime);
			}
		}
    	});
 
	circle = new Circle();
	circle.spatialReference = map.spatialReference;

    geometryService = new GeometryService("https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
      
	showBuffer = function (geometries) {
		view.graphics.remove(graphicBuffer);
		graphicBuffer = new Graphic(geometries[0],bufferSymbol);
		view.graphics.add(graphicBuffer);
		
		circle = geometries[0];
		getCounties();
    }
  
    getCounties = function() {
        var query = counties.createQuery();
        query.geometry = circle;
        query.returnGeometry = true;
        query.outfields = ["*"];
  
        counties.queryFeatures(query).then(function(featureSet) {
          var inBuffer = [];
          var areas = [];
          var feat = featureSet.features;
          var countiesAreas;
		  var countiesGeometry = [];	
          countiesLayer.removeAll();
          for (var i = 0; i < feat.length; i++) {
            countiesGeometry.push(feat[i].geometry);
            inBuffer.push(feat[i].attributes.OBJECTID);
            
            graphicCounties = new Graphic(feat[i].geometry,countySymbol);
            countiesLayer.add(graphicCounties);					
          }
          var areasAndLengthParamsCounties = new AreasAndLengthsParameters({
            areaUnit: "square-kilometers",
            lengthUnit: "kilometers",
            polygons: countiesGeometry
          });
          geometryService.areasAndLengths(areasAndLengthParamsCounties).then(function(results) {
            countiesAreas = results.areas;
          });
          geometryService.intersect(countiesGeometry,circle).then(function(intersectionGeometry) {
            var areasAndLengthParams = new AreasAndLengthsParameters({
              areaUnit: "square-kilometers",
              lengthUnit: "kilometers",
              polygons: intersectionGeometry
            });
            geometryService.areasAndLengths(areasAndLengthParams).then(function(results) {
              areas=results.areas;
			  var populationValue = calculatePopulation(feat,countiesAreas,areas);
			  $(".population h6").remove();
			  $(".population").append("<h6>Total de población: "+populationValue.toLocaleString()+" habitantes");
            });
          });
        });
    }

    calculatePopulation = function(features,countieAreas,areas) {
		var popTotal = 0;
		var porcent
		for (var x = 0; x < features.length; x++) {
			popCounty = (areas[x] * features[x].attributes["TOTPOP_CY"]) / countieAreas[x];
			popTotal = popTotal + popCounty;
		}
		popTotal = Math.trunc(popTotal);
		return popTotal;
	}

	checkState = function(indexPath, index) {
		var query = counties.createQuery();
        query.geometry = car;
        query.returnGeometry = true;
		query.outfields = ["*"];
		counties.queryFeatures(query).then(function(featureSet) {
			if (actualState === '') actualState = featureSet.features[0].attributes.ST_ABBREV;
			if(actualState != featureSet.features[0].attributes.ST_ABBREV) {
				actualState = featureSet.features[0].attributes.ST_ABBREV;
				var stateGraphic = new Graphic(car, changeState);
				view.graphics.add(stateGraphic);
			}			
		});
	}

	$('#pause').on('click', function() {
		pause = true;
	});

	$('#play').on('click', function() {
		pause = false;
	});

	$('#stop').on('click', function() {
		pause = true;
		canceled = true;
		$('.options-box').css('display','flex');
		$('.simulation-hide').css('display','none');
		$(".population").css('display','none');
		$('#start').removeClass('not-active');
		$('#save-route').addClass('not-active');
		$('#generate-route').addClass('not-active');
		$('#save-point').addClass('not-active');
		$('#simulate').addClass('not-active');
		countiesLayer.removeAll();
		view.graphics.remove(graphicBuffer);
		view.graphics.removeAll();
		disableTap = false;
		$('.speedControl p').remove();
		$('.radioControl p').remove();
		$('.map-points').css('display', 'none');
        $('.map-points a').remove();
		pointIndex = 0;
        pointArray = [];
	});

	$('#moreSpeed').on('click', function() {
		if (speed < 50) {
			speed += 10;
		}
		if (speed === 10) {
			carSymbol = slowCarSymbol
		} else if (speed === 30) {
			carSymbol = regularCarSymbol
		} else {
			if (speed === 50) {
				carSymbol = fastCarSymbol;
			}
		}
		$('.speedControl p').remove();
		$('#lessSpeed').after('<p>'+speed+'</p>');
	});

	$('#lessSpeed').on('click', function() {
		if (speed > 10) {
			speed -= 10;
		}
		if (speed === 10) {
			carSymbol = slowCarSymbol
		} else if (speed === 30) {
			carSymbol = regularCarSymbol
		} else {
			if (speed === 50) {
				carSymbol = fastCarSymbol;
			}
		}
		$('.speedControl p').remove();
		$('#lessSpeed').after('<p>'+speed+'</p>');
	});

	$('#moreRadio').on('click', function() {
		if (bufferDistance < 50) {
			bufferDistance += 10;
		}
		$('.radioControl p').remove();
		$('#lessRadio').after('<p>'+bufferDistance+'</p>');
	});

	$('#lessRadio').on('click', function() {
		if (bufferDistance > 10) {
			bufferDistance -= 10;
		}
		$('.radioControl p').remove();
		$('#lessRadio').after('<p>'+bufferDistance+'</p>');
	});

		
	sleep = function(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	addSpeedLine = function(indexPath, index) {
		var pointLine = currentRoute.geometry.paths[indexPath].slice(index, index + speed + 1);
		var polyline = {
			type: "polyline",
			paths: pointLine
		};
		var polylineGraphic = new Graphic({
			geometry: polyline
		});
		if (speed < 30) {
			polylineGraphic.symbol = slowRouteSymbol;
		}
		if (speed === 30) {
			polylineGraphic.symbol = regularRouteSymbol;
		}
		if (speed > 30) {
			polylineGraphic.symbol = fastRouteSymbol;
		}
		
		view.graphics.add(polylineGraphic);
	}
}) 