//
// parser.js
//

(function(undefined) {
	var simFile = parser.parseSimFileContents(TG.basicExampleSimFile);
	
	QUnit.module("parser.js", {});
                                      
	QUnit.test("parser should parse metadata correctly", function(assert) {
	assert.equal(simFile.title, "Feels Just Like That Night",
			"title correct");
	assert.equal(simFile.subtitle, "subtitle test", 
			"subtitle correct");
	assert.equal(simFile.artist, "Eskimo & Icebird", 
			"artist correct");
	assert.equal(simFile.credit, "",
			"credit correct");
	});
	
	QUnit.test("parser should parse bpms correctly", function(assert) {
	assert.equal(Object.keys(simFile.bpms).length, 1,
			"correct number of bpm sections");
	assert.equal(simFile.bpms["0.000"], "135.010", 
			"bpms correct");
	});
	
	QUnit.test("parser should parse difficulties correctly", function(assert) {
	assert.equal(simFile.difficulties.length, 2,
			"has correct number of difficulties");
	assert.equal(simFile.difficulties[0].measures.length, 2,
			"first difficulty has correct number measures");
	assert.equal(simFile.difficulties[0].measures[0].lines.length, 4,
			"first difficulty has correct number of lines in the first measures");
	assert.equal(simFile.difficulties[0].measures[0].lines[0].steps.length, 4,
			"first difficulty has correct number of steps in the first line");
	
	assert.equal(simFile.difficulties[1].measures.length, 1,
			"second difficulty has correct number of measures");
	});
	
	QUnit.test("parser should parse note data correctly", function(assert) {
	assert.equal(simFile.difficulties[0].measures[0].lines[1].steps[0].type, Type.FREEZE_START,
			"read correct type for step");
	assert.equal(simFile.difficulties[0].measures[1].lines[0].steps[2].type, Type.HOLDING,
			"read correct type for step");
	assert.equal(simFile.difficulties[0].measures[0].lines[0].steps[3].type, Type.NONE,
			"empty steps are defined as empty");
	assert.equal(simFile.difficulties[0].measures[0].lines[0].steps[3].type, Type.NONE,
			"empty steps are defined as empty");
	
	assert.equal(simFile.difficulties[1].measures[0].lines[3].steps[3].type, Type.MINE,
			"mine steps are recognized");
	});
		
		
})();

