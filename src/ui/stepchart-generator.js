
(function(stepChartGenerator, SMP, undefined) {
	
	//private:
	var LENGTH_PER_MEASURE = 500;
	var BASE_IMAGE_DIRECTORY = "assets/notes/";
	
	var simFile = null;
	var difficultyIndex = 0;
	var difficulty = null;
	var targetTable = null;
	
	function createStepChart() {
		difficulty = simFile.difficulties[difficultyIndex];

		for (var i = 0; i < difficulty.measures.length; i++) {
			addStepChartMeasure(difficulty.measures[i], targetTable);
		}
	};
	
	function addStepChartMeasure(measure, targetTable) {
		for (var i = 0; i < measure.lines.length; i++) {
			addStepChartLine(measure.lines[i], measure.lines.length, targetTable);
		}
	};
	
	function addStepChartLine(line, numberOfLinesInMeasure, targetTable) {
		var tr = document.createElement("tr");
		tr.className = "L" + numberOfLinesInMeasure;

		for (var i = 0; i < line.steps.length; i++) {
			addStepChartStep(line.steps[i], tr);
		}

		targetTable.appendChild(tr);
	};
	
	function addStepChartStep(step, targetRow) {

		var tdStep = document.createElement("td");
		if (step) {
			if (step.type == Type.FREEZE_START || step.type == Type.ROLL_START) { 
				var backImage = document.createElement("img");
				//using back image to not worry about z-indexing and for tiling
				backImage.style.backgroundImage = "url('" + getStepBackgroundImageSource(step) + "')";
				backImage.className = "bg";
				tdStep.appendChild(backImage);
			}
			if (step.type == Type.REGULAR || step.type == Type.FREEZE_START || step.type == Type.ROLL_START) {
				var imgStep = document.createElement("img");
				imgStep.className = getStepClass(step);
				imgStep.src = getStepImageSource(step);
				tdStep.appendChild(imgStep);
			}
		}
		targetRow.appendChild(tdStep);
	};
	
	function getStepClass(step) {
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
	
	function getStepImageSource(step) {
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
	
	function getStepBackgroundImageSource(step) {
		var imgName = "";
		switch(step.type) {
		case Type.FREEZE_START:
		case Type.HOLDING:
			imgName = "hold.png";
			break;
		case Type.FREEZE_END:
			imgName = "hold_cap_bottom.png";
			break;
		case Type.ROLL_START:
		case Type.ROLLING:
			imgName = "roll.png";
			break;
		case Type.ROLL_END:
			imgName = "roll_cap_bottom.png";
		}
		
		return BASE_IMAGE_DIRECTORY + imgName;
	};
	
	function makeStepRowStyle(bpm, stepLineLengthFactor, lengthClassSelector, tableId) {
		var lineHeight = LENGTH_PER_MEASURE / 60 * bpm * stepLineLengthFactor;
		return "#" + tableId + " ." + lengthClassSelector + " { height:" + lineHeight + "px; } ";
	}
	
	//public:
	
	stepChartGenerator.attachStepChartToTable = function(_simFile, _difficultyIndex, _targetTable) {
		simFile = _simFile;
		difficultyIndex = _difficultyIndex;
		targetTable = _targetTable;
		
		createStepChart(difficultyIndex, targetTable);
	};
	
	stepChartGenerator.getStepChartStyleSheet = function(simFile, bpm, targetTableId) {
		var style = document.createElement("style");
		style.type = "text/css";
		var css = "";
		
		css += makeStepRowStyle(bpm, 1.0/4.0, "L4", targetTableId);
		css += makeStepRowStyle(bpm, 1.0/8.0, "L8", targetTableId);
		css += makeStepRowStyle(bpm, 1.0/12.0, "L12", targetTableId);
		css += makeStepRowStyle(bpm, 1.0/16.0, "L16", targetTableId);
		css += makeStepRowStyle(bpm, 1.0/24.0, "L24", targetTableId);
		css += makeStepRowStyle(bpm, 1.0/32.0, "L32", targetTableId);
		css += makeStepRowStyle(bpm, 1.0/48.0, "L48", targetTableId);
		css += makeStepRowStyle(bpm, 1.0/64.0, "L64", targetTableId);
		
		style.appendChild(document.createTextNode(css));
		
		return style;
	};
	
} (window.stepChartGenerator = window.stepChartGenerator || {}, SMP));
