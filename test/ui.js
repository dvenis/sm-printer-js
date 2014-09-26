//
// metadata-manager.js
//

(function(undefined) {
	var simFile = parser.parseSimFileContents(TG.basicExampleSimFile);
	
	QUnit.module("metadata-manager.js", {});
	
	QUnit.test("song metadata should be correct", function(assert) {
		var songMetadataDiv = document.createElement("div");
		var createPWithId = function(id) {
			var p = document.createElement("p");
			p.id = id;
			return p;
		};
		
		var titleElement = createPWithId("md_title");
		songMetadataDiv.appendChild(titleElement);
		
		var subtitleElement = createPWithId("md_subtitle");
		songMetadataDiv.appendChild(subtitleElement);
		
		var artistElement = createPWithId("md_artist");
		songMetadataDiv.appendChild(artistElement);
		
		document.body.appendChild(songMetadataDiv);
		metadataManager.populateSongMetadataSection(simFile, songMetadataDiv);
		document.body.removeChild(songMetadataDiv);

		assert.equal(titleElement.innerHTML, simFile.title,
				"title is correct");
		assert.equal(subtitleElement.innerHTML, simFile.subtitle,
				"subtitle is correct");
		assert.equal(artistElement.innerHTML, SMP.asHTML(simFile.artist),
				"artist is correct");
	});
})();

//
// stepchart-generator.js
//

(function(undefined) {
	var simFile = parser.parseSimFileContents(TG.basicExampleSimFile);
	var table = stepChartGenerator.getStepChartTable(simFile, 0, "test_table");
	var style = stepChartGenerator.getStepChartStyleSheet(simFile, 60, table);
	
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
	
	QUnit.test("stepchart styles should be made correctly", function(assert) {
		assert.equal(style.id, table.id + "_style",
				"style sheet has correct id");
		assert.equal(SMP.numberOccurencesOfSubstring(style.childNodes[0].nodeValue, "table"), 10,
				"correct number of selectors");
	});
	
})();