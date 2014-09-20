
(function(stepChartGenerator, SMP, undefined) {
	
	//private:
	var LENGTH_PER_MEASURE = 500;
	var BASE_IMAGE_DIRECTORY = "assets/notes/";
	
	function createStepChart(difficulty, targetTable) {

		for (var i = 0; i < difficulty.measures.length; i++) {
			addStepChartMeasure(difficulty, i, targetTable);
		}
	};
	
	function addStepChartMeasure(difficulty, measureIndex, targetTable) {
		var measure = difficulty.measures[measureIndex];
		for (var i = 0; i < measure.lines.length; i++) {
			addStepChartLine(difficulty, measureIndex, i, targetTable);
		}
	};
	
	function addStepChartLine(difficulty, measureIndex, lineIndex, targetTable) {
		var line = difficulty.measures[measureIndex].lines[lineIndex];
		var tr = document.createElement("tr");
		//set the length of each of the step lines based on number of lines in measure
		tr.className = "L" + difficulty.measures[measureIndex].lines.length;

		for (var i = 0; i < line.steps.length; i++) {
			addStepChartStep(difficulty, measureIndex, lineIndex, i, tr);
		}

		targetTable.appendChild(tr);
	};
	
	function addStepChartStep(difficulty, measureIndex, lineIndex, stepIndex, targetRow) {
		var step = difficulty.measures[measureIndex].lines[lineIndex].steps[stepIndex];
		var tdStep = document.createElement("td");
		if (step) {
			if (step.type == Type.REGULAR || step.type == Type.FREEZE_START || step.type == Type.ROLL_START) {
				var imgStep = document.createElement("img");
				imgStep.className = getStepClass(step);
				imgStep.src = getStepImageSource(step);
				tdStep.appendChild(imgStep);
			}
			if (step.type == Type.FREEZE_START || step.type == Type.ROLL_START) { 
				var backImage = document.createElement("img");
				//using back image for tiling
				backImage.style.backgroundImage = "url('" + getStepBackgroundImageSource(step) + "')";
				backImage.className = "bg hold";
				var holdDuration = difficulty.getHoldDuration(measureIndex, lineIndex, stepIndex);
				backImage.setAttribute("m_length", holdDuration);
				tdStep.appendChild(backImage);
				

			} else if (step.type == Type.FREEZE_END || step.type == Type.ROLL_END) {
				var backImage = document.createElement("img");
				backImage.style.backgroundImage = "url('" + getStepBackgroundImageSource(step) + "')";
				backImage.className = "bg hold_end";
				tdStep.appendChild(backImage);
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
	
	stepChartGenerator.getStepChartTable = function(simFile, difficultyIndex, id) {
		var targetTable = document.createElement("table");
		targetTable.className = "stepchart";
		targetTable.id = id;
		
		var difficulty = simFile.difficulties[difficultyIndex];
		if (difficulty) {
			createStepChart(difficulty, targetTable);
		}
		
		return targetTable;
	};
	
	stepChartGenerator.getStepChartStyleSheet = function(simFile, bpm, targetTable) {
		targetTableId = targetTable.id;
		
		var style = document.createElement("style");
		style.id = targetTable.id + "_style";
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
		
		//JQUERY: possible replacement
		var f = targetTable.querySelectorAll(".bg");
		for (var i = 0; i < f.length; i++) {
			var e= f[i];
			//check to see if it's full hold, or an end
			if (e.getAttribute("m_length")) {
				e.style.height = (e.getAttribute("m_length") * LENGTH_PER_MEASURE / 60 * bpm - 48) + "px";
			}
		}
		
		return style;
	};
	
	stepChartGenerator.attachStepChartAndStyleToDocument = function(targetDiv, tableId, simFile, difficultyIndex) {
		var targetTable = stepChartGenerator.getStepChartTable(simFile, difficultyIndex, tableId);
		var style = stepChartGenerator.getStepChartStyleSheet(simFile, 60, targetTable);
		
		targetDiv.appendChild(targetTable);
		document.head.appendChild(style);
	};
	
} (window.stepChartGenerator = window.stepChartGenerator || {}, SMP));
