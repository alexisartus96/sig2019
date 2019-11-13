require([
	"esri/symbols/SimpleMarkerSymbol",
	"esri/symbols/SimpleLineSymbol",
	"esri/symbols/SimpleFillSymbol",
	"esri/symbols/PictureMarkerSymbol"
	], 

	function(SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, PictureMarkerSymbol) {

		pointSymbol = new PictureMarkerSymbol("http://static.arcgis.com/images/Symbols/Basic/GreenShinyPin.png", 30, 30);
		
		routeSymbol = new SimpleLineSymbol({
			color: [35,127,212, 0.7],
			width: 5
		});
		
		slowRouteSymbol = new SimpleLineSymbol({
			color: [36,156,32, 0.8],
			width: 5
		});
		
		regularRouteSymbol = new SimpleLineSymbol({
			color: [240,255,7, 0.8],
			width: 5
		});

		fastRouteSymbol = new SimpleLineSymbol({
			color: [229,6,6, 0.8],
			width: 5
		});

		bufferSymbol = new SimpleFillSymbol(
			SimpleFillSymbol.STYLE_SOLID,
			new SimpleLineSymbol(
				SimpleLineSymbol.STYLE_SOLID,
				new dojo.Color([36,156,32,0.35]), 2
			),
			new dojo.Color([36,156,32,0.35])
		);

		slowCarSymbol = new PictureMarkerSymbol("https://img.icons8.com/office/80/000000/snail.png", 30, 30);
		regularCarSymbol = new PictureMarkerSymbol("https://img.icons8.com/officel/80/000000/walking.png", 30, 30);
		fastCarSymbol = new PictureMarkerSymbol("https://img.icons8.com/color/96/000000/running-rabbit.png", 30, 30);


		countySymbol = new SimpleFillSymbol(
			SimpleFillSymbol.STYLE_SOLID,
			new SimpleLineSymbol(
				SimpleLineSymbol.STYLE_SOLID,
				new dojo.Color([234,54,44,0.65]), 2
			),
			new dojo.Color([234,54,44,0.35])
		);

		changeState = new PictureMarkerSymbol("https://img.icons8.com/officel/80/000000/pin.png", 30, 30);
	}
)