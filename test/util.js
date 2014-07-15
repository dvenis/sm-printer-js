//
// parser.js
//

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
	"0000"+
	"0000"+
	"0000"+
	"0000"+
	","+
	"0000"+
	"0000"+
	"0000"+
	"0000";
                                          
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
});