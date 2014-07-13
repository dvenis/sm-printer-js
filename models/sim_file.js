function SimFile() {
	this.title = "";
	this.subtitle = "";
	this.artist = "";
	this.credit = "";
	this.displayBPM = "";
	
	this.difficulties = [];
}

SimFile.prototype.addDifficulty = function(difficulty) {
	this.difficulties += difficulty;
}