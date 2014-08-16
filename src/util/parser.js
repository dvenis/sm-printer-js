/**
 * 
 */

(function(parser, SMP, undefined) {
	//private:
	
	var META_DATA_REGEX = /#[\s\S]+?;/g; //regex for individual metadata parts
	var STEP_LINE_REGEX = /[0-9MLF]{4,10}/g; //regex for each valid step line
	
	var previouslyAddedLine = null;
	
	function setDataBasedOnTag(part, simFile) {
		var data = stripTagFromPart(part);
		switch(getTagFromPart(part)) {
			case "TITLE":
				simFile.title = data;
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
				simFile.bpms = getBpmsFromString(data);
				break;
			case "DISPLAYBPM":
				simFile.displayBPM = data;
				break;
			case "NOTES":
				generateStepData(data, simFile);
				break;
		}
	};
	
	
	function generateSimFile(fileContents) {
		var simFile = new SimFile();
		parts = fileContents.match(META_DATA_REGEX);

		for (var i = 0; i < parts.length; i++) {
			setDataBasedOnTag(parts[i], simFile);
		}
		
		return simFile;
	};
	
	
	function generateStepData(notesString, simFile) {
		var difficultyParts = notesString.split(":");
		if (difficultyParts.length != 6) {
			console.error("there was an error reading the difficulty: expected 6, got " + difficultyParts.length);
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
			difficulty.addMeasure(parseMeasure(measureData[i], i, difficulty.notesType));
		}
		simFile.addDifficulty(difficulty);
	};
	
	function parseMeasure(measureString, measureNumber, notesType) {
		var measure = new SimFileMeasure();
		var rawLines = measureString.match(STEP_LINE_REGEX);
		var linesInMeasure = rawLines.length;
		
		for (var i = 0; i < rawLines.length; i++) {
			var rawLineTrimmed = rawLines[i].trim();
			previouslyAddedLine = generateStepLine(rawLineTrimmed, previouslyAddedLine, notesType, i, linesInMeasure);
			measure.addLine(previouslyAddedLine);
		}
		
		return measure;
	};
	
	
	function generateStepLine(rawData, previousLine, notesType, lineIndex, numberLinesInMeasure) {
		var simFileLine = new SimFileLine();
		var timing = getTimingFromIndexAndMeasureSize(lineIndex, numberLinesInMeasure);
		
		if (previousLine && previousLine.steps) {
			for (var i = 0; i < rawData.length; i++) {
				simFileLine.steps[i] = generateStep(rawData[i], i, notesType, previousLine.steps[i], timing);
			}
		} else {
			for (var i = 0; i < rawData.length; i++) {
				simFileLine.steps[i] = generateStep(rawData[i], i, notesType, null, timing);
			}
		}
		
		return simFileLine;
	};
	
	function generateStep(rawCharacter, stepIndex, notesType, previousStep, timing) {
		var type = getTypeFromCharacterAndPreviousStep(rawCharacter, previousStep);
		var orientation = getOrientationFromNotesTypeAndStepIndex(notesType, stepIndex);
		return new SimFileStep(type, orientation, timing);
	};
	
	function getTypeFromCharacterAndPreviousStep(character, previousStep) {
		switch (character) {
		case '1': return Type.REGULAR;
		case '2': return Type.FREEZE_START;
		case '3':
			if (previousStep != null && previousStep.type == Type.HOLDING || previousStep.type == Type.FREEZE_START) {
				return Type.FREEZE_END;
			}
			return Type.ROLL_END;
		case '4':
			return Type.ROLL_START;
		case 'M':
			return Type.MINE;
		case 'L':
			return Type.LIFT;
		case 'F':
			return Type.FAKE;
		//nothing ('0')
		default:
			if (previousStep) {
				//check previous line to make know if user is holding or not
				switch (previousStep.type) {
				case Type.FREEZE_START:
					//fallthrough
				case Type.HOLDING:
					return Type.HOLDING;
				case Type.ROLL_START:
					//fallthrough
				case Type.ROLLING:
					return Type.ROLLING;
				default:
					return Type.NONE;
				}			
			} else {
				return Type.NONE;
			}
		}
	};
	
	function getTimingFromIndexAndMeasureSize(lineIndex, numberLinesInMeasure) {
		var length;
		if (lineIndex != 0) {
			var gcd = getGCD(numberLinesInMeasure, lineIndex);
			length = numberLinesInMeasure / gcd;
			if (length == 2) {
				return Timing.L4TH;
			}
			return length;
		} else {
			return Timing.L1ST;
		}
	};
	
	 function getOrientationFromNotesTypeAndStepIndex(notesType, stepIndex) {
		//TODO: add notes-type special parsing
		//assume dance-single for now
		switch(stepIndex) {
		case 0: return Orientation.LEFT;
		case 1: return Orientation.DOWN;
		case 2: return Orientation.UP;
		case 3: return Orientation.RIGHT;
		default: return Orientation.NONE;
		}
	};
	
	function getBpmsFromString(bpmString) {
		var bpmDict = {};
		var bpmParts = bpmString.split(",");
		for (var i = 0; i < bpmParts.length; i++) {
			var bpmPart = bpmParts[i];
			var pair = bpmPart.split("=");
			if (pair.length != 2) {
				console.log("WARNING: bpm read incorrectly");
				continue;
			}
			var key = pair[0];
			var value = pair[1];
			bpmDict[key] = value;
		}
		
		return bpmDict;
	};
	
	function getTagFromPart(part) {
		var indexOfColon = part.indexOf(":");
		if (indexOfColon == -1) {
			return "";
		}
		return part.substring(1, indexOfColon);
	};
	
	function stripTagFromPart(part) {
		var indexOfColon = part.indexOf(":");
		if (indexOfColon == -1) {
			return "";
		}
		return part.substring(indexOfColon+1, part.length-1).trim();
	};
	
	function getGCD(a, b) {
		while (b != 0) {
			var temp = b;
			b = a % b;
			a = temp;
		}
		return a;
	};
	
	//public:
	
	parser.parseSimFileContents = function(fileContents) {
//		var parser = new Parser(fileContents);
		var simFile = generateSimFile(fileContents);
		simFile.sortDifficulties();
		return simFile;
	};
	
}(window.parser = window.parser || {}, SMP));

