require([
    "esri/Graphic",
    "esri/tasks/RouteTask",
    "esri/tasks/support/RouteParameters",
    "esri/tasks/support/FeatureSet"
  ], function(Graphic) {

      addStop = function(mapPoint) {
        const stopPoint = new Graphic(mapPoint, pointSymbol);
        view.graphics.add(stopPoint);
      }

      view.on("click", function(event) {
        event.stopPropagation();
        mapPoint = event.mapPoint;
        view.popup.open({
          title: "Posición seleccionada",
          location: mapPoint,
          content: "<div class='searchPopup'><h4>Añadir punto</h4><button type='button' value='Agregar parada' class='w3-button w3-xlarge w3-circle w3-red w3-card-4' onclick='addStop(mapPoint); view.popup.close()'>+</button></div>"
        });
      });
});