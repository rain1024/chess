QUnit.test("Test moveRegex", function(assert){
  var move, match;

  // test 
  assert.ok(moveRegExp.test('a1'), "Passed!");

  // test
  move = 'O-O-O';
  match =  XRegExp.exec(move, moveRegExp);
  assert.ok(moveRegExp.test(move), "Passed!");
  assert.equal(match.queenCastle, "O-O-O");

  // test 
  move = 'O-O';
  match =  XRegExp.exec(move, moveRegExp);
  assert.ok(moveRegExp.test(move), "Passed!");
  assert.equal(match.kingCastle, "O-O");

  // test
  assert.ok(moveRegExp.test('Nxc6+'), "Passed!");
  assert.ok(moveRegExp.test('R1d2'), "Passed!");
});

QUnit.test("Test a normalTurnRegExp", function(assert){
  var turn = '';
  var match;
  // test 
  turn = '1. a1 O-O-O ';
  match = XRegExp.exec(turn, normalTurnRegExp);
  assert.equal(match.white, 'a1');
  assert.equal(match.black, 'O-O-O');
  assert.equal(match.queenCastle, 'O-O-O');

  // test 
  turn = '17. O-O-O a1 ';
  match = XRegExp.exec(turn, normalTurnRegExp);
  assert.equal(match.white, 'O-O-O');
  assert.equal(match.black, 'a1');

  // test 
  turn = '90.Qh5+ g6 ';
  assert.equal(XRegExp.exec(turn, normalTurnRegExp).white, 'Qh5+');
  assert.equal(XRegExp.exec(turn, normalTurnRegExp).black, 'g6');
});

QUnit.test("Test a lastTurnRegExp", function(assert){
  var last = "";
  last = '31. a1 O-O-O 1-0';
  assert.equal(XRegExp.exec(last, lastTurnRegExp).score, '1-0');
  last = '31. Bf4+ 0-1';
  assert.equal(XRegExp.exec(last, lastTurnRegExp).score, '0-1');
  last = '12.Nxc6+ 1/2-1/2';
  assert.equal(XRegExp.exec(last, lastTurnRegExp).score, '1/2-1/2');
});

QUnit.test("Test turnsRegExp", function(assert){
  var turns = "";

  // turn 37
  turns = loadfile("games/1781037_turns.txt");
  turns = removeNewLines(turns);
  var exec = XRegExp.exec(turns, turnsRegExp, 0);
  var normalTurns = XRegExp.forEach(exec.normals, normalTurnRegExp, function(match, i){
    this.push(+match[0]);
  }, []);
  assert.equal(normalTurns.length, 71);
  assert.equal(exec.last, "72. Kxg4 1/2-1/2");

  // turn 38
  turns = loadfile("games/1781038_turns.txt");
  turns = removeNewLines(turns);
  var exec = XRegExp.exec(turns, turnsRegExp, 0);
  var normalTurns = XRegExp.forEach(exec.normals, normalTurnRegExp, function(match, i){
    this.push(+match[0]);
  }, []);
  assert.equal(normalTurns.length, 91);
  assert.equal(exec.last, "92. Kb2 1-0");

  // turn 39
  turns = loadfile("games/1781039_turns.txt");
  turns = removeNewLines(turns);
  var exec = XRegExp.exec(turns, turnsRegExp, 0);
  var normalTurns = XRegExp.forEach(exec.normals, normalTurnRegExp, function(match, i){
    this.push(+match[0]);
  }, []);
  assert.equal(normalTurns.length, 38);
  assert.equal(exec.last, "39. Nd6 1-0");

  // turn 40
  turns = loadfile("games/1781040_turns.txt");
  turns = removeNewLines(turns);
  var exec = XRegExp.exec(turns, turnsRegExp, 0);
  var normalTurns = XRegExp.forEach(exec.normals, normalTurnRegExp, function(match, i){
    this.push(+match[0]);
  }, []);
  assert.equal(normalTurns.length, 47);
  assert.equal(exec.last, "48. Kg7 Bc8 1/2-1/2");
});

QUnit.test("Test metaRegExp", function(assert){
  var exec = null;
  exec = metaRegExp.exec('[Event "Nutcracker Match of the Generations"] ');
  assert.equal(exec.meta, "Event");
  assert.equal(exec.content, "Nutcracker Match of the Generations")

  exec = metaRegExp.exec('[Site "Moscow RUS"] ')
  assert.equal(exec.meta, "Site"); 
  exec = metaRegExp.exec('[Date "2014.12.20"] ')
  assert.equal(exec.meta, "Date");

  exec = metaRegExp.exec('[EventDate "2014.12.20"] ')
  assert.equal(exec.meta, "EventDate")

  exec = metaRegExp.exec('[Round "1.1"] ')
  assert.equal(exec.meta, "Round")

  exec = metaRegExp.exec('[Result "1-0"] ')
  assert.equal(exec.meta, "Result")

  exec = metaRegExp.exec('[White "Alexey Shirov"] ')
  assert.equal(exec.meta, "White")

  exec = metaRegExp.exec('[Black "Daniil Dubov"] ')
  assert.equal(exec.meta, "Black")

  exec = metaRegExp.exec('[ECO "A56"] ')
  assert.equal(exec.meta, "ECO")

  exec = metaRegExp.exec('[WhiteElo "2675"] ')
  assert.equal(exec.meta, "WhiteElo")

  exec = metaRegExp.exec('[BlackElo "2629"] ')
  assert.equal(exec.meta, "BlackElo")

  exec = metaRegExp.exec('[PlyCount "87"] ')
  assert.equal(exec.meta, "PlyCount")
});

QUnit.test("Test gameRegExp", function(assert){
  var game = "";

  game = loadfile("games/1781035.txt");
  game = removeNewLines(game);
  assert.ok(gameRegExp.test(game));
  
  game = loadfile("games/1781036.txt");
  game = removeNewLines(game);
  assert.ok(gameRegExp.test(game));

  game = loadfile("games/1781037.txt");
  game = removeNewLines(game);
  assert.ok(gameRegExp.test(game));

  game = loadfile("games/1781038.txt");
  game = removeNewLines(game);
  assert.ok(gameRegExp.test(game));

  game = loadfile("games/1781039.txt");
  game = removeNewLines(game);
  assert.ok(gameRegExp.test(game));

  game = loadfile("games/1781040.txt");
  game = removeNewLines(game);
  assert.ok(gameRegExp.test(game));
});

QUnit.test("Test parse game", function(assert){
  var game = new Game();
  game.load("games/1781035.txt");
  assert.equal(game.metas.Event, "Nutcracker Match of the Generations");
  assert.equal(game.metas.Site, "Moscow RUS");
  assert.equal(game.metas.Date, "2014.12.20");
  assert.equal(game.metas.EventDate, "2014.12.20");
  assert.equal(game.metas.Round, "1.1");
  assert.equal(game.metas.Result, "1-0");
  assert.equal(game.metas.White, "Alexey Shirov");
  assert.equal(game.metas.Black, "Daniil Dubov");
  assert.equal(game.metas.ECO, "A56");
  assert.equal(game.metas.WhiteElo, "2675");
  assert.equal(game.metas.BlackElo, "2629");
  assert.equal(game.metas.PlyCount, "87");
  assert.equal(game.turns.length, 44);
  assert.equal(game.turns[0].w, 'd4');
});

QUnit.test('test parse move', function(assert){
  var game = new Game();
  game.load("games/1781035.txt");
  var turn1 = game.turns[0];
  assert.equal(1, 1);
});
