QUnit.test('Test board load', function(assert) {   
  var board = new Board();
  board.load('games/1781035.txt');
  assert.ok(true);
});

function testBoardMoves(name, assert){
  var gameFile = "games/" + name + ".txt";
  var pgnFile = "games/" + name + "_pgn.txt";
  // load game 
  var board = new Board();
  board.load(gameFile);

  // load pgn
  var pgnContent = loadfile(pgnFile);
  var fens = _.initial(pgnContent.split("\n"));
  for(var i in fens){
    board.next();
    assert.equal(board.getFen(), fens[i]);
  }
}

QUnit.test('Test board moves game 35', function(assert){
  testBoardMoves("1781035", assert);
});

// QUnit.test('Test board moves game 36', function(assert){
//   testBoardMoves("1781036", assert);
// });

// QUnit.test('Test board moves game 37', function(assert){
//   testBoardMoves("1781037", assert);
// });
//
// QUnit.test('Test board moves game 38', function(assert){
//   testBoardMoves("1781038", assert);
// });
//
// QUnit.test('Test board moves game 39', function(assert){
//   testBoardMoves("1781039", assert);
// });
//
// QUnit.test('Test board moves game 40', function(assert){
//   testBoardMoves("1781040", assert);
// });
//
// QUnit.test('Test board moves game 41', function(assert){
//   testBoardMoves("1781041", assert);
// });
//
// QUnit.test('Test board moves game 42', function(assert){
//   testBoardMoves("1781041", assert);
// });
