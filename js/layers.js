require([
	"esri/layers/FeatureLayer",
	], 

	function(FeatureLayer) {
		routes = new FeatureLayer("http://sampleserver5.arcgisonline.com/arcgis/rest/services/LocalGovernment/Recreation/FeatureServer/1", {
			mode: FeatureLayer.MODE_ONDEMAND,
			outFields: ["*"]
		})
	}
)
