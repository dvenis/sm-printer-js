//
//Sim File definitions
//

function SimFile() {
	this.title = "";
	this.subtitle = "";
	this.artist = "";
	this.credit = "";
	this.bpms = {};
	this.displayBPM = "";
	
	this.difficulties = [];
}

SimFile.prototype.addDifficulty = function(difficulty) {
	this.difficulties.push(difficulty);
};

SimFile.prototype.sortDifficulties = function() {
	if (this.difficulties) {
		this.difficulties.sort(function(a, b) {
			if (a.notesType == b.notesType) {
				return a.difficultyMeter - b.difficultyMeter;
			} else {
				var diff1 = a.notesType + a.difficultyClass;
				var diff2 = b.notesType + b.difficultyClass;
				return diff1.localeCompare(diff2);
			}

		});
	}
};

///
// Sim File difficulties definitions
//

function SimFileDifficulty() {
	this.description = "";
	this.difficultyClass = "";
	this.difficultyMeter = "";
	this.radarValues = "";
	this.notesType = "";
	
	this.measures = [];
}

SimFileDifficulty.prototype.addMeasure = function(measure) {
	this.measures.push(measure);
};


SimFileDifficulty.prototype.toString = function() {
	return this.notesType + " - " + this.difficultyClass + " (" + this.difficultyMeter + ")";
};

SimFileDifficulty.prototype.getNumberOfLines = function() {
	var count = 0;
	for (var i = 0; i < this.measures.length; i++) {
		count += this.measures[i].lines.length;
	}
	return count;
};

SimFileDifficulty.prototype.getLineAfter = function(measureIndex, lineIndex) {
	var measure = this.measures[measureIndex];
	lineIndex++;
	while (lineIndex >= measure.lines.length) {
		measureIndex++;
		if (measureIndex >= this.measures.length) {
			return null;
		}
		lineIndex = 0;
		measure = this.measures[measureIndex];
	}
	return measure.lines[lineIndex];
};

SimFileDifficulty.prototype.getHoldDuration = function(measureIndex, lineIndex, stepIndex) {
	var length = 0;
	var step = this.measures[measureIndex].lines[lineIndex].steps[stepIndex];
	
	var measure = this.measures[measureIndex];

	while (step.type == Type.HOLDING || step.type == Type.ROLLING 
			|| step.type == Type.FREEZE_START || step.type == Type.ROLL_START) {
		length += 1.0 / measure.lines.length;
		lineIndex++;
		
		//check if line goes to the next measure
		if (lineIndex >= measure.lines.length) {
			lineIndex = 0;
			measureIndex++;
			measure = this.measures[measureIndex];
		}
		//check to make sure the simfile was created properly
		if (measureIndex >= this.measures.length) {
			return length;
		}
		step = this.measures[measureIndex].lines[lineIndex].steps[stepIndex];
	}
	return length;
};

//
//Sim File measure defintions
//

function SimFileMeasure() {
	this.isEmpty = false;
	this.measureNumber = 0;
	this.lines = [];
}

SimFileMeasure.prototype.addLine = function(line) {
	this.lines.push(line);
};

SimFileMeasure.prototype.toString = function() {
	var retval = "";
	for (var i = 0; i < this.lines.length; i++) {
		retval += this.lines.toString() + "\n";
	}
	return retval;
};

//
//Sim File line definitions
//

function SimFileLine() {
	this.steps = [];
	this.timing = null;
	// number of lines in the parent measure
	this.measureTiming = null;
}

SimFileLine.prototype.toString = function() {
	return this.steps.toString();
};

//
//Step definitions
//

function SimFileStep(type, orientation, timing) {
	this.type = type;
	this.orientation = orientation;
	this.timing = timing;
}

SimFileStep.prototype.toString = function() {
	return "[Step: type:" + this.type + "]";
};

//
// Timing definitions
//

var Timing = {
	L1ST : 1,
	L4TH : 4,
	L8TH : 8,
	L12TH : 12,
	L16TH : 16,
	L24TH : 24, 
	L32ND : 32,
	L48TH : 48,
	L64TH : 64
};

//
// Orientation definitions
//

var Orientation = {
	LEFT : 0,
	RIGHT : 1,
	DOWN : 2,
	UP : 3,
	DOWN_LEFT : 4,
	UP_LEFT : 5,
	UP_RIGHT : 6,
	DOWN_RIGHT : 7,
	CENTER : 8,
	NONE : 9
};

//
// Type definitions
//

var Type = {
	NONE : 0,
	REGULAR : 1,
	FREEZE_START : 2,
	FREEZE_END : 3,
	ROLL_START : 4,
	ROLL_END : 5,
	MINE : 6,
	LIFT : 7,
	FAKE : 8,
	//custom definitions
	HOLDING : 9,
	ROLLING : 10,
	ROLL_END : 11
};