//
// stepchart-generator.js
//

(function(undefined) {
	var simFile = parser.parseSimFileContents(TG.basicExampleSimFile);
	var table = document.createElement("table");
	stepChartGenerator.attachStepChartToTable(simFile, 0, table);
	
	QUnit.module("stepchart-generator.js", {});
	
	QUnit.test("stepchart should be correctly attached to the table", function(assert) {
		assert.equal(table.rows.length, 8,
				"table has the correct number of rows");
		assert.equal(table.rows[0].cells.length, 4,
				"table has correct number of steps per line");
		assert.equal(table.rows[0].cells[0].childNodes.length, 1,
				"first step is defined");
		assert.equal(table.rows[0].cells[3].childNodes.length, 0,
				"fourth step is not defined");
	});
	
	
})();