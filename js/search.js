require([
    "esri/Map",
    "esri/views/MapView",
    "esri/widgets/Search"
  ], function(Map, MapView, Search) {
      // Search widget
      var search = new Search({
        view: view
      });

      view.ui.add(search, "top-right");
    
})