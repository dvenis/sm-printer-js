//
//sim-file.js
//

(function(undefined) {
	var simFile = parser.parseSimFileContents(TG.basicExampleSimFile);
	
	QUnit.module("sim-file.js", {});
	
	QUnit.test("calculates lines in difficulty correctly", function(assert) {
		assert.equal(simFile.difficulties[0].getNumberOfLines(), 8,
				"first difficulty has correct number of lines");
		assert.equal(simFile.difficulties[1].getNumberOfLines(), 4,
				"second difficulty has correct number of lines");
	});
	
	QUnit.test("gets the correct next line", function(assert) {
		assert.equal(simFile.difficulties[0].getLineAfter(0, 0), simFile.difficulties[0].measures[0].lines[1],
				"find next line correctly");
		assert.equal(simFile.difficulties[0].getLineAfter(0, 3), simFile.difficulties[0].measures[1].lines[0],
				"passes over measures correctly");
		assert.equal(simFile.difficulties[0].getLineAfter(1, 3), null,
				"returns null when not found");
	});
	
	QUnit.test("calculates the total hold duration correctly",  function(assert) {
		assert.equal(simFile.difficulties[0].getHoldDuration(0, 1, 0), 1.0/4.0, 
				"duration correct");
		assert.equal(simFile.difficulties[0].getHoldDuration(0, 1, 2), 4.0/4.0,
				"duration correct over multiple measures");
	});
})();