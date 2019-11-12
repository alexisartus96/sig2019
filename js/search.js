require([
    "esri/tasks/Locator",
    "esri/widgets/Search"
    ], 
    function(Locator, Search) {
      searchPopup.content = "<div class='searchPopup'><h4>Añadir punto</h4><button type='button' value='Agregar parada' class='w3-button w3-xlarge w3-circle w3-red w3-card-4' onclick='addStop(mapPoint); view.popup.close()'>+</button></div>"

      var search = new Search({
        sources: [{
          locator: new Locator({ url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"}),
          countryCode:"US",
          placeholder: "Search USA",
          suggestionsEnabled: true,
          minSuggestCharacters: 0
      }],
        container: "search",
        popupEnabled: true,
        view: view,
        resultGraphicEnabled: true,
        includeDefaultSources: false
      }, "search");

      search.popupTemplate = searchPopup;

      search.on("select-result", function(event) {
        resultName = event.result.name;
        mapPoint = event.result.feature.geometry;
      })
})