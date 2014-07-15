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
	this.difficulties += difficulty;
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
	this.measures += measure;
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
	this.lines += line;
};

//
//Sim File line defintions
//

function SimFileLine() {
	this.timing = 0;
	this.steps = [];
}

//
//Step definitions
//

function Step(type, orientation, timing) {
	this.type = type;
	this.orientation = orientation;
	this.timing = timing;
}