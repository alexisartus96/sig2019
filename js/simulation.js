require([
	"esri/geometry/Point",
	"esri/Graphic"], 
   function(Point, Graphic) {
	   
    $('#start').on('click', async function() {
		$('#start').unbind("click");
		var index = 0;
		var indexPath = 0;
		var endRoute = false;
		carSymbol = regularCarSymbol;
		speed = initialSpeed;
		while (!endRoute) {
			car = new Point(currentRoute.geometry.paths[indexPath][index][0], currentRoute.geometry.paths[indexPath][index][1]);
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
		}
	})

		/*pauseSimulation = function() {
			pause = true;
			document.getElementById("pause").disabled = true;
			document.getElementById("play").disabled = false;
			updateCarSymbol();
		}

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