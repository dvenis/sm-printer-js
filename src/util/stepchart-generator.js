
function StepChartGenerator(simFile, notesType) {
	this.simFile = simFile;
	this.notesType = notesType;

	this.difficultyIndex = -1;
	this.difficulty = null;
}

StepChartGenerator.prototype.createStepChart = function(difficultyIndex,
		targetTable) {
	this.difficultyIndex = difficultyIndex;
	this.difficulty = this.simFile.difficulties[difficultyIndex];

	for (var i = 0; i < this.difficulty.measures.length; i++) {
		this._addStepChartMeasure(this.difficulty.measures[i], targetTable);
	}
};

StepChartGenerator.prototype.attachStylesToTable = function(bpm, targetTable) {
	if (targetTable && targetTable.rows) {


		var tableRowCount = 0;
		for (var i = 0; i < this.difficulty.measures.length; i++) {
			var measure = this.difficulty.measures[i];
			var lineHeight = 1000 / measure.lines.length;

			 for (var j = 0; j < measure.lines.length; j++) {
				 targetTable.rows[tableRowCount].style.height = lineHeight.toString() + "px";
				 tableRowCount++;
			 }
		}
	}
};

StepChartGenerator.prototype._addStepChartMeasure = function(measure,
		targetTable) {
	for (var i = 0; i < measure.lines.length; i++) {
		this._addStepChartLine(measure.lines[i], targetTable);
	}
};

StepChartGenerator.prototype._addStepChartLine = function(line, targetTable) {
	var tr = document.createElement("tr");

	for (var i = 0; i < line.steps.length; i++) {
		this._addStepChartStep(line.steps[i], tr);
	}

	targetTable.appendChild(tr);
};

StepChartGenerator.prototype._addStepChartStep = function(step, targetRow) {

	var tdStep = document.createElement("td");
	if (step && step.type !== Type.NONE) {
		var imgStep = document.createElement("img");
		imgStep.className = this._getStepClass(step);
		imgStep.src = this._getStepImageSource(step);

		tdStep.appendChild(imgStep);
	}
	targetRow.appendChild(tdStep);
};

// static members

StepChartGenerator.prototype._getStepClass = function(step) {
	switch (step.orientation) {
	case Orientation.LEFT:
		return "l";
	case Orientation.UP:
		return "u";
	case Orientation.DOWN:
		return "d";
	case Orientation.RIGHT:
		return "r";
	}
	return "";
};

BASE_IMAGE_DIRECTORY = "assets/notes/";

StepChartGenerator.prototype._getStepImageSource = function(step) {
	var imgName = "";
	switch (step.timing) {
	case Timing.L1ST:
		// fallthrough
	case Timing.L4TH:
		imgName = "4th.png";
		break;
	case Timing.L8TH:
		imgName = "8th.png";
		break;
	case Timing.L12TH:
		imgName = "12th.png";
		break;
	case Timing.L16TH:
		imgName = "16th.png";
		break;
	case Timing.L24TH:
		imgName = "24th.png";
		break;
	case Timing.L32ND:
		imgName = "32nd.png";
		break;
	case Timing.L48TH:
		imgName = "48th.png";
		break;
	case Timing.L64TH:
		imgName = "64th.png";
		break;
	}

	return BASE_IMAGE_DIRECTORY + imgName;
};