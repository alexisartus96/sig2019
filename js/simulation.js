require([
	"esri/geometry/Point",
	"esri/Graphic",
	"esri/tasks/support/BufferParameters",
	"esri/tasks/GeometryService",
  	"esri/geometry/Circle",
    	"esri/tasks/support/AreasAndLengthsParameters"], 
   function(Point, Graphic, BufferParameters, GeometryService, Circle, AreasAndLengthsParameters) {
	   

	$('#start').on('click',  simulate = async function() {
		$('#start').unbind('click');
		pause = false;
		canceled = false;
		var index = 0;
		var indexPath = 0;
		var endRoute = false;
		carSymbol = regularCarSymbol;
		speed = initialSpeed;
		while (!endRoute && !canceled) {
			if (!pause) {
				car = new Point(currentRoute.geometry.paths[indexPath][index][0], currentRoute.geometry.paths[indexPath][index][1]);
				
				bufferParams = new BufferParameters();
				bufferParams.geometries = [car];
				bufferParams.distances = [ 50 ];
				bufferParams.unit = GeometryService.UNIT_KILOMETER;
				bufferParams.outSpatialReference = view.spatialReference;
				geometryService.buffer(bufferParams).then(showBuffer);
				carGraphic = new Graphic(car, carSymbol);
				view.graphics.add(carGraphic)
				await sleep(sleepTime);
				view.graphics.remove(carGraphic);
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
		$('.options-box').css('display','flex');
		$('.simulation-hide').css('display','none');
		await sleep(sleepTime);
		view.popup.close();
		view.graphics.remove(graphicBuffer);
		view.graphics.removeAll();
    	});
 
	circle = new Circle();
	circle.spatialReference = map.spatialReference;

    	geometryService = new GeometryService("https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
      
	showBuffer = function (geometries) {
		getCounties();
	
		view.graphics.remove(graphicBuffer);
		graphicBuffer = new Graphic(geometries[0],bufferSymbol);
		view.graphics.add(graphicBuffer);
	
		view.graphics.remove(carGraphic);
		carGraphic = new Graphic(car, carSymbol);
		view.graphics.add(carGraphic);
		
		circle = geometries[0];
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
          var circleArea;
          var countiesGeometry = [];
          countiesLayer.removeAll();
          for (var i = 0; i < feat.length; i++) {
            countiesGeometry.push(feat[i].geometry);
            inBuffer.push(feat[i].attributes.OBJECTID);
            
            graphicCounties = new Graphic(feat[i].geometry,countySymbol);
            countiesLayer.add(graphicCounties);					
          }
          var areasAndLengthParamsCircle = new AreasAndLengthsParameters({
            areaUnit: "square-kilometers",
            lengthUnit: "kilometers",
            polygons: [circle]
          });
          geometryService.areasAndLengths(areasAndLengthParamsCircle).then(function(results) {
            circleArea = results.areas[0];
          });
          geometryService.intersect(countiesGeometry,circle).then(function(intersectionGeometry) {
            var areasAndLengthParams = new AreasAndLengthsParameters({
              areaUnit: "square-kilometers",
              lengthUnit: "kilometers",
              polygons: intersectionGeometry
            });
            geometryService.areasAndLengths(areasAndLengthParams).then(function(results) {
              areas=results.areas;
              var populationValue = calculatePopulation(feat,circleArea,areas);
              view.popup.close();
                view.popup.open({
                  location: car,
                  title: "VALOR DE POBLACIÓN PONDERADO",
                  alignment: "top-center",
                  content: "<b>Total de población en el buffer:</b> " + populationValue.toLocaleString() + " habitantes"
                });
            });
          });
        });
      }

      calculatePopulation = function(features,circleArea,areas) {
	var popTotal = 0;
	for (var x = 0; x < features.length; x++) {
		mult = areas[x] * 100;
		percentage = mult / circleArea;
		fraction = areas[x] / circleArea;
		popCounty = features[x].attributes["TOTPOP_CY"] * fraction;
		popTotal = popTotal + popCounty;
	}
	popTotal = Math.trunc(popTotal);
	return popTotal;
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
	});
/*
		play = function() {
			pause = false;
			document.getElementById("pause").disabled = false;
			document.getElementById("play").disabled = true;
			updateCarSymbol();
		}

		increaseSpeed = function() {
			if (speed < maxSpeed) {
				++speed;
				console.log('subo speed: ',speed);
				document.getElementById("speed-minus").disabled = false;
				updateCarSymbol();
			}
		}

		decreaseSpeed = function() {
			if (speed > minSpeed){
				--speed;
				console.log('bajo speed: ',speed);
				document.getElementById("speed-plus").disabled = false;
				updateCarSymbol();
			}
		}

		cancelSimulation = function() {
			canceled = true;
			document.getElementById("simulation").hidden = true;
		}

		updateCarSymbol = function() {
			if (pause) {
				console.log('paso a stopped');
				carSymbol = stoppedCarSymbol;
			} else{
				green = minSpeed + 2;
				console.log('green ',green);
				red = maxSpeed - 3;
				console.log('red ',red);
				if (speed == maxSpeed) {
					console.log('paso a max');
					document.getElementById("speed-plus").disabled = true;
					carSymbol = fastestCarSymbol;
				} else if (speed == minSpeed) {
					console.log('paso a min');
					document.getElementById("speed-minus").disabled = true;
					carSymbol = slowestCarSymbol;
				} else if (speed <= green) {
					console.log('paso a slow');
					carSymbol = slowCarSymbol;
				} else if (speed >= red) {
					console.log('paso a fast');
					carSymbol = fastCarSymbol;
				} else{
					console.log('paso a regular');
					carSymbol = regularCarSymbol;
				}
			}
		}

		modifyBuffer = function() {
	        bufferDistance = bufferValue.value;
        }*/
                
        $('#stop').on('click', function() {
             $('.options-box').css('display','flex');
		});
		
		sleep = function(ms) {
			return new Promise(resolve => setTimeout(resolve, ms));
		}
	}
) 