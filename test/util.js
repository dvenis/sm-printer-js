//
// parser.js
//

QUnit.test("parser should generate timings correctly", function(assert) {
	assert.equal(Parser.getTimingFromIndexAndMeasureSize(0, 5), 1,
			"timing 1st correct");
	assert.equal(Parser.getTimingFromIndexAndMeasureSize(3, 8), 8,
			"timing 8th correct");
	assert.equal(Parser.getTimingFromIndexAndMeasureSize(12, 16), 4,
			"timing reduces to longest timing");
});

QUnit.test("parser should recognize tags within parts correctly", function(assert) {
	var part = "#NOTES:some notes here";
	assert.equal(Parser.getTagFromPart(part), "NOTES", 
			"strips the basic tags correctly");
	
	part = "#NOTES\nand stuff :this should never happen though";
	assert.equal(Parser.getTagFromPart(part), "NOTES\nand stuff ",
			"parses odd input correctly");
	
	part = "#some other text without a proper ending";
	assert.equal(Parser.getTagFromPart(part), "", 
			"returns empty for invalid parts");
});

QUnit.test("parser should strip tags from parts correctly", function(assert) {
	var part = "#empty data set:;";
	assert.equal(Parser.stripTagFromPart(part), "",
			"returns empty when there is empty data");
	
	part = "#NOTES: \nand here is the real data from the part\n\n;";
	assert.equal(Parser.stripTagFromPart(part), "and here is the real data from the part", 
			"removes whitespace from the data properly");
	
	part = "this is invalid data with no colon separater;";
	assert.equal(Parser.stripTagFromPart(part), "",
			"returns empty for invalid parts");
});

var basicExampleSimFile = 
	"#TITLE:Feels Just Like That Night;"+
	"#SUBTITLE:subtitle test;                 "+
	"#ARTIST:Eskimo & Icebird;                                   "+
	"#CREDIT:credit person;       "+
	"#BPMS:0.000=135.010;"+
	""+
	"//---------------dance-single - J. Frederick----------------"+
	"#NOTES:"+
	"     dance-single:"+
	"     J. Frederick:"+
	"     Beginner:"+
	"     1:"+
	"     0.082,0.000,0.057,0.000,0.000:"+
	"     "+
	"1MM0\n"+
	"2120\n"+
	"3000\n"+
	"0000\n"+
	","+
	"1004\n"+
	"1030\n"+
	"1003\n"+
	"0000\n;";
                                          
QUnit.test("parser should parse metadata correctly", function(assert){
	var simFile = parseSimFileContents(basicExampleSimFile);
	
	assert.equal(simFile.title, "Feels Just Like That Night",
			"title correct");
	assert.equal(simFile.subtitle, "subtitle test", 
			"subtitle correct");
	assert.equal(simFile.artist, "Eskimo & Icebird", 
			"artist correct");
	assert.equal(simFile.credit, "credit person",
			"credit correct");
	assert.equal(simFile.bpms, "0.000=135.010", 
			"bpms correct");
	
	assert.equal(simFile.difficulties.length, 1,
			"has 1 difficulty");
	assert.equal(simFile.difficulties[0].measures.length, 2,
			"has 2 measures");
	assert.equal(simFile.difficulties[0].measures[0].lines.length, 4,
			"has 4 lines in the first measures");
	assert.equal(simFile.difficulties[0].measures[0].lines[0].steps.length, 4,
			"has 4 steps in the first line");
	
	assert.equal(simFile.difficulties[0].measures[0].lines[1].steps[0].type, Type.FREEZE_START,
			"read correct type for step");
	assert.equal(simFile.difficulties[0].measures[1].lines[0].steps[2].type, Type.HOLDING,
			"read correct type for step");
});