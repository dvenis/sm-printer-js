//
//Sim File definitions
//

function SimFile() {
	this.title = "";
	this.subtitle = "";
	this.artist = "";
	this.credit = "";
	this.bpms = "";
	this.displayBPM = "";
	
	this.difficulties = [];
}

SimFile.prototype.addDifficulty = function(difficulty) {
	this.difficulties.push(difficulty);
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
//Sim File line defintions
//

function SimFileLine() {
	this.steps = [];
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