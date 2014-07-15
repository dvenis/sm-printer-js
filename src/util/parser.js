/**
 * 
 */

parseSimFileContents = function(fileContents) {
	var parser = new Parser(fileContents);
	return parser.generateSimFile();
};


function Parser(fileContents) {
	this.fileContents = fileContents;
}

var META_DATA_REGEX = /#[\s\S]+?;/g; //regex for individual metadata parts
var STEP_LINE_REGEX = /[0-9MLF]{4,10}"/; //regex for each valid step line

Parser.prototype.generateSimFile = function() {
	var simFile = new SimFile();
	parts = this.fileContents.match(META_DATA_REGEX);
	
	for (var i = 0; i < parts.length; i++) {
		Parser.setDataBasedOnTag(parts[i], simFile);
	}
	
	return simFile;
};

//static members

Parser.setDataBasedOnTag = function(part, simFile) {
	var data = Parser.stripTagFromPart(part);
	switch(Parser.getTagFromPart(part)) {
		case "TITLE":
			simFile.title = data;
			DBG.log(data);
			break;
		case "SUBTITLE":
			simFile.subtitle = data;
			break;
		case "ARTIST":
			simFile.artist = data;
			break;
		case "CREDIT":
			simFile.credit = data;
			break;
		case "BPMS":
			simFile.bpms = data;
			break;
		case "DISPLAYBPM":
			simFile.displayBPM = data;
			break;
		case "NOTES":
			generateStepData(part, accumulator);
			break;
	}
};

Parser.generateStepData = function(notesString, simFile) {
	var difficultyParts = notesString.split(":");
	if (difficultyParts.length != 6) {
		//DBG.error("there was an error reading the difficulty: expected 6, got " + difficultyParts.length);
		return;
	}
	
	var difficulty = new SimFileDifficulty();
	difficulty.notesType = difficultyParts[0].trim();
	difficulty.description = difficultyParts[1].trim();
	difficulty.difficultyClass = difficultyParts[2].trim();
	difficulty.difficultyMeter = difficultyParts[3].trim();
	difficulty.radarValues = difficultyParts[4].trim();
	
	var measureData = difficultyParts[5].split(",");
	for (var i = 0; i < measureData.length; i++) {
		
	}
	
	simFile.addDifficulty(difficulty);
};

Parser.getTagFromPart = function(part) {
	var indexOfColon = part.indexOf(":");
	if (indexOfColon == -1) {
		return "";
	}
	return part.substring(1, indexOfColon);
};

Parser.stripTagFromPart = function(part) {
	var indexOfColon = part.indexOf(":");
	if (indexOfColon == -1) {
		return "";
	}
	return part.substring(indexOfColon+1, part.length-1).trim();
};