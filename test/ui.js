//
// stepchart-generator.js
//

QUnit.module("stepchart-generator.js", {
		setup: function() {
		},
		teardown: function() {
		}
});
QUnit.test("generator should add correct sim file line", function(assert) {	
	var line = new SimFileLine();
	line.steps[0] = new SimFileStep(Type.REGULAR, Orientation.LEFT, Timing.L4TH);
	line.steps[3] = new SimFileStep(Type.REGULAR, Orientation.RIGHT, Timing.L4TH);
	
	var table = document.createElement("table");
	var generator = new StepChartGenerator(null, "");
	generator._addStepChartLine(line, table);
	
	assert.equal(table.childNodes.length, 1,
			"adds one row to the table");
	assert.equal(table.childNodes[0].childNodes.length, 4,
			"the row has 4 steps");
	assert.equal(table.childNodes[0].childNodes[0].childNodes.length, 1,
			"the first step is defined");
	assert.equal(table.childNodes[0].childNodes[1].childNodes.length, 0,
			"the second step is not defined");
	assert.equal(table.childNodes[0].childNodes[2].childNodes.length, 0,
			"the first step is not defined");
	assert.equal(table.childNodes[0].childNodes[3].childNodes.length, 1,
			"the first step is defined");
	
});