require([
	"esri/symbols/SimpleMarkerSymbol",
	"esri/symbols/SimpleLineSymbol",
	"esri/symbols/SimpleFillSymbol"
	], 

	function(SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol) {

		pointSymbol = new SimpleMarkerSymbol({
			"color": [255,255,255,64],
			"size": 12,
			"angle": -30,
			"xoffset": 0,
			"yoffset": 0,
			"outline": {
			  "color": [0,0,0,255],
			  "width": 1
			}
		})
		
		routeSymbol = new SimpleLineSymbol({
			color: [0, 0, 255, 0.5],
			width: 5
		});
		
		bufferSymbol = new SimpleFillSymbol(
			SimpleFillSymbol.STYLE_SOLID,
			new SimpleLineSymbol(
				SimpleLineSymbol.STYLE_SOLID,
				new dojo.Color([80,120,255,0.65]), 2
			),
			new dojo.Color([80,120,255,0.35])
		);

		regularCarSymbol = new SimpleMarkerSymbol({
			style: 'diamond',
			size: 20,
			color: [255, 0, 255, 0.5]
		});

		countySymbol = new SimpleFillSymbol(
			SimpleFillSymbol.STYLE_SOLID,
			new SimpleLineSymbol(
				SimpleLineSymbol.STYLE_SOLID,
				new dojo.Color([80,120,100,0.65]), 2
			),
			new dojo.Color([80,120,100,0.35])
		);
	}
)