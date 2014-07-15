QUnit.test( "hello test", function( assert ) {
  assert.ok( 1 == "1", "Passed!" );
});

QUnit.test("creating models works", function(assert) {
	var simFile = new SimFile();
	assert.ok(simFile.difficulties.length == 0, "was able to create sim file");
});