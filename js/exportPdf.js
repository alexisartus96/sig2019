require([
	"esri/tasks/PrintTask",
	"esri/tasks/support/PrintTemplate",
	"esri/tasks/support/PrintParameters"
	], 

	function(PrintTask, PrintTemplate, PrintParameters) {

        $('#export-pdf').on('click', function() {
            var printTask = new PrintTask({
                url: "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
               });
    
            var pdf_template = new PrintTemplate({
                format: "pdf",
                exportOptions: {
                    dpi: 250
                },
                layout: "a4-landscape",
           });
    
           var params = new PrintParameters({
                view: view,
                template: pdf_template
            });

			printTask.execute(params).then(printMap, printError);
		});

		function printMap(response) {
			window.open(response.url);
		};

		function printError() {
			console.log('Error al exportar PDF');
		}
	}
)