function compareFenMatch(assert, fen, object){
  var match = fenRegExp.exec(fen);
  assert.equal(match.lines, object.lines);
  assert.equal(match.activeColor, object.activeColor);
  assert.equal(match.whiteCastle, object.whiteCastle);
  assert.equal(match.blackCastle, object.blackCastle);
  assert.equal(match.enPassant, object.enPassant);
  assert.equal(match.halfMoves, object.halfMoves);
  assert.equal(match.fullMoves, object.fullMoves);
}

QUnit.test('test fen RegExp', function(assert){
  var fen = '';
  var correct = '';

  // test fen 1
  fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  correct = {
    lines: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
    activeColor: "w",
    whiteCastle: "KQ",
    blackCastle: "kq",
    enPassant: "-",
    halfMoves: 0,
    fullMoves: 1
  }
  compareFenMatch(assert, fen, correct);

  // test fen 2
  fen = "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1";
  correct = {
    lines: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR",
    activeColor: "b",
    whiteCastle: "KQ",
    blackCastle: "kq",
    enPassant: "e3",
    halfMoves: 0,
    fullMoves: 1
  }
  compareFenMatch(assert, fen, correct);

  // test fen 3
  fen = "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2";
  correct = {
    lines: "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR",
    activeColor: "w",
    whiteCastle: "KQ",
    blackCastle: "kq",
    enPassant: "c6",
    halfMoves: 0,
    fullMoves: 2
  }
  compareFenMatch(assert, fen, correct);

  // test fen 4
  fen = "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2";
  correct = {
    lines: "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R",
    activeColor: "b",
    whiteCastle: "KQ",
    blackCastle: "kq",
    enPassant: "-",
    halfMoves: 1,
    fullMoves: 2
  }
  compareFenMatch(assert, fen, correct);

  // test fen 5
  fen = "4k3/8/8/8/8/8/4P3/4K3 w - - 5 39";
  correct = {
    lines: "4k3/8/8/8/8/8/4P3/4K3",
    activeColor: "w",
    whiteCastle: "-",
    blackCastle: "",
    enPassant: "-",
    halfMoves: 5,
    fullMoves: 39
  }
  compareFenMatch(assert, fen, correct);

  // test fen 6
  fen = "7k/8/8/8/8/8/8/2B1KB2 w - - 0 1";
  correct = {
    lines: "7k/8/8/8/8/8/8/2B1KB2",
    activeColor: "w",
    whiteCastle: "-",
    blackCastle: "",
    enPassant: "-",
    halfMoves: 0,
    fullMoves: 1
  }
  compareFenMatch(assert, fen, correct);

  // test fen 7
  fen = "8/8/8/4k3/8/8/8/R3K2R w KQ - 0 1";
  correct = {
    lines: "8/8/8/4k3/8/8/8/R3K2R",
    activeColor: "w",
    whiteCastle: "KQ",
    blackCastle: "",
    enPassant: "-",
    halfMoves: 0,
    fullMoves: 1
  }
  compareFenMatch(assert, fen, correct);

  // test fen 8
  fen = "8/8/8/8/4k3/8/3KP3/8 w - - 0 1";
  correct = {
    lines: "8/8/8/8/4k3/8/3KP3/8",
    activeColor: "w",
    whiteCastle: "-",
    blackCastle: "",
    enPassant: "-",
    halfMoves: 0,
    fullMoves: 1
  }
  compareFenMatch(assert, fen, correct);

  // test fen 9
  fen = "8/8/5k2/8/5K2/8/4P3/8 w - - 0 1";
  correct = {
    lines: "8/8/5k2/8/5K2/8/4P3/8",
    activeColor: "w",
    whiteCastle: "-",
    blackCastle: "",
    enPassant: "-",
    halfMoves: 0,
    fullMoves: 1
  }
  compareFenMatch(assert, fen, correct);

  // test fen 10
  fen = "r4rk1/1b2bppp/ppq1p3/2pp3n/5P2/1P1BP3/PBPPQ1PP/R4RK1 w - - 0 1";
  correct = {
    lines: "r4rk1/1b2bppp/ppq1p3/2pp3n/5P2/1P1BP3/PBPPQ1PP/R4RK1",
    activeColor: "w",
    whiteCastle: "-",
    blackCastle: "",
    enPassant: "-",
    halfMoves: 0,
    fullMoves: 1
  }
  compareFenMatch(assert, fen, correct);

  // test fen 11
  fen = "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2";
  correct = {
    lines: "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR",
    activeColor: "w",
    whiteCastle: "KQ",
    blackCastle: "kq",
    enPassant: "c6",
    halfMoves: 0,
    fullMoves: 2
  }
  compareFenMatch(assert, fen, correct);

  // test fen 12
  fen = "3r1rk1/p3qppp/2bb4/2p5/3p4/1P2P3/PBQN1PPP/2R2RK1 w - - 0 1";
  correct = {
    lines: "3r1rk1/p3qppp/2bb4/2p5/3p4/1P2P3/PBQN1PPP/2R2RK1",
    activeColor: "w",
    whiteCastle: "-",
    blackCastle: "",
    enPassant: "-",
    halfMoves: 0,
    fullMoves: 1
  }
  compareFenMatch(assert, fen, correct);

  // test fen 13
  fen = "4r1k1/1b3p1p/ppq3p1/2p5/8/1P3R1Q/PBP3PP/7K w - - 0 1";
  correct = {
    lines: "4r1k1/1b3p1p/ppq3p1/2p5/8/1P3R1Q/PBP3PP/7K",
    activeColor: "w",
    whiteCastle: "-",
    blackCastle: "",
    enPassant: "-",
    halfMoves: 0,
    fullMoves: 1
  }
  compareFenMatch(assert, fen, correct);
});
