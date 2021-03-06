
(function(stepChartGenerator, SMP, undefined) {
	
	//private:
	var MEASURE_LENGTH_PER_BPM = 10;
	var BASE_IMAGE_DIRECTORY = "assets/notes/";
	
	function createStepChartBackground(difficulty, tableBody) {
		for (var i = 0; i < difficulty.measures.length * 4; i++) {
			var row = document.createElement("tr");
			row.className = "m_sep";
			
			if (i%4 == 0) {
				//thick line
				row.className += " t";
				
				//create measure number
				var cell = document.createElement("td");
				cell.className = "m_num";
				cell.id = "m_" + (i/4 + 1);
				
				var span = document.createElement("span");
				span.innerHTML = (i/4 + 1);
				
				cell.appendChild(span);
				row.appendChild(cell);
			}
			
			tableBody.appendChild(row);
		}
	}
	
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
		var lineHeight = MEASURE_LENGTH_PER_BPM * bpm * stepLineLengthFactor;
		return "table ." + lengthClassSelector + "{height:" + lineHeight + "px;}";
	}
	
	function getHoldPixelLength(holdElement, bpm) {
		if (holdElement.getAttribute("m_length")) {
			return (holdElement.getAttribute("m_length") * MEASURE_LENGTH_PER_BPM * bpm - 48) + "px";
		}
		return null;
	}
	
	//public:
	
	stepChartGenerator.getStepChartBackgroundTable = function(simFile, difficultyIndex, targetTable) {
		var backgroundTable = document.createElement("table");
		backgroundTable.className = "stepchart_background";
		backgroundTable.id = targetTable.id + "_background";
		var tableBody = document.createElement("tbody");
		backgroundTable.appendChild(tableBody);
		
		var difficulty = simFile.difficulties[difficultyIndex];
		if (difficulty) {
			createStepChartBackground(difficulty, tableBody);
		}
		
		return backgroundTable;
	};
	
	// Creates a table element that contains all the step chart info using the difficulty specified by
	// the difficultyIndex and simFile. The id of the table is set to the passed in id. 
	stepChartGenerator.getStepChartTable = function(simFile, difficultyIndex, id) {
		var targetTable = document.createElement("table");
		targetTable.className = "stepchart";
		targetTable.id = id;
		var tableBody = document.createElement("tbody");
		targetTable.appendChild(tableBody);
		
		var difficulty = simFile.difficulties[difficultyIndex];
		if (difficulty) {
			createStepChart(difficulty, tableBody);
		}
		
		return targetTable;
	};
	
	// Creates a style sheet that sets the heights on all rows on the chart. The height of each row
	// is proportional to the bpm specified. The id of the stylesheet is <targetTable.id + "_style">.
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
		
		var separatorHeight = MEASURE_LENGTH_PER_BPM * bpm / 4.0;
		css += "table .m_sep.t {height:" + (separatorHeight-2) + "px;}";
		css += "table .m_sep {height:" + (separatorHeight-1) + "px;}";
		css += ".stepchart_background {top:" + (separatorHeight / 2 - 8) + "px;}";
		
		style.appendChild(document.createTextNode(css));
		
		return style;
	};
	
	// Adds individual styles to all the holds within a step chart table. The height of each hold is
	// proportional to the bpm specified. Call this method using the same bpm as the getStepChartStyleSheet
	// method.
	stepChartGenerator.setHoldStyles = function(simFile, bpm, targetTable) {
		//JQUERY: possible replacement
		var f = targetTable.querySelectorAll(".bg");
		for (var i = 0; i < f.length; i++) {
			var heightString = getHoldPixelLength(f[i], bpm);
			if (heightString) {
				f[i].style.height = heightString;
			}
		}
	};
	
	// Creates a step chart table as a child of the targetDiv, and sets the table id to tableId. The difficulty
	// used is specified by the simFile and the difficultyIndex. Also generates styles for the rows, and 
	// attaches the style sheet to the document head.
	stepChartGenerator.attachStepChartAndStyleToDocument = function(targetDiv, tableId, simFile, difficultyIndex) {
		var targetTable = stepChartGenerator.getStepChartTable(simFile, difficultyIndex, tableId);
		var backgroundTable = stepChartGenerator.getStepChartBackgroundTable(simFile, difficultyIndex, targetTable);
		var style = stepChartGenerator.getStepChartStyleSheet(simFile, 60, targetTable);
		stepChartGenerator.setHoldStyles(simFile, 60, targetTable);
		
		targetDiv.appendChild(backgroundTable);
		targetDiv.appendChild(targetTable);
		document.head.appendChild(style);
	};
	
} (window.stepChartGenerator = window.stepChartGenerator || {}, SMP));
