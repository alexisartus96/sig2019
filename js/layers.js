require([
	"esri/layers/FeatureLayer",
	], 

	function(FeatureLayer) {
		routes = new FeatureLayer("http://sampleserver5.arcgisonline.com/arcgis/rest/services/LocalGovernment/Recreation/FeatureServer/1", {
			mode: FeatureLayer.MODE_ONDEMAND,
			outFields: ["*"]
		})

		counties = new FeatureLayer("http://services.arcgisonline.com/arcgis/rest/services/Demographics/USA_1990-2000_Population_Change/MapServer/3", {
			mode: FeatureLayer.MODE_ONDEMAND,
			outFields: ["*"],
			opacity: 0.7,
		});
		
		points = new FeatureLayer("http://sampleserver5.arcgisonline.com/arcgis/rest/services/LocalGovernment/Events/FeatureServer/0", {
			mode: FeatureLayer.MODE_ONDEMAND,
			outFields: ["*"]
		})
	}	
)
