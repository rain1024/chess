/**
 * @method
 * convert c4 to Position(4, 3)
 */
var convertToPosition = function(pgnPosition){
  var rows = " 12345678"; 
  var columns = " abcdefgh";
  return new Position(
    rows.indexOf(pgnPosition[1]),
    columns.indexOf(pgnPosition[0])
  );
}

/**
 * @class Context
 *
 * @uses Square 
 */
var Context = ring.create({
  /**
   * current position
   *
   * @property {String} position
   *
   */
  position: '',

  /**
   * pieces to move  
   *
   * @property {Piece[]} pieces 
   *
   */
  pieces: [],     
  /**
   * next move 
   *
   * @property {Object} next 
   *
   */
  next: null,
  /**
   * current state of board  
   *
   * @property {Square} square 
   *
   */
  square: null,
  /**
   * @property { String } activeColor 
   */
  activeColor: null
})

/**
 * Board contains pieces and is model for drawing ui board.
 *
 * @class Board
 *
 * @uses Square 
 * @uses Context
 */
var Board = ring.create({
  /*
   * side for next move
   * either w or b
   * according to FEN notation
   */
  constructor: function(){
    this.activeColor = 'w';
    this.enPassant = '-';
    this.halfMoves = 0;
    this.fullMoves = 1;
    this.fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    this.pieces = [];
    this.game = new Game();
    this.square = new Square();
  },

  /**
   * load pices from initial fen
   *
   * @private
   */
  loadPieces : function(){
    var match = fenRegExp.exec(this.fen);
    var lines = match.lines;
    lines = lines.split("/");
    lines = _.map(lines, function(line){
      return _.map(line, function(character){
        if(parseInt(character)){
          var result = "";
          _(parseInt(character)).times(function(){ result += "1"; })
          return result;
        } else {
          return character;
        }
      }).join("");
    });
    this.pieces = _.chain(lines)
      .map(function(line, row){
        return _.map(line, function(character, column){
          if(character != "1"){
            var piece = PieceFactory.create(character);
            piece.setPosition(8 - row, column + 1);
            return piece;
          }
        })
      })
      .flatten()
      .compact()
      .value();
  },

  /**
   * @method load
   *
   * @return { void }
   */
  load : function(path){
    this.game.load(path);
    this.loadPieces();
  },

  /**
   * @method 
   */
  getCastleString : function(){
    var whiteKing = _.chain(this.pieces)
      .filter(this.isMatchColor, {color : ["w"]})
      .filter(this.isMatchPieces, {pieces: ["K"]})
      .value()[0];
    var blackKing = _.chain(this.pieces)
      .filter(this.isMatchColor, {color : ["b"]})
      .filter(this.isMatchPieces, {pieces: ["K"]})
      .value()[0];
    var whiteCastle = whiteKing.castleString;
    var blackCastle = blackKing.castleString;
    var castle = whiteCastle + blackCastle;
    return castle != '' ? castle : '-';
  },

  /*
   * @method 
   *
   * @private 
   */
  updateHalfMoves : function(pieces, move){
    var piece = pieces[0];
    if(ring.instance(piece, Paw) || move.isCapture) {
      this.halfMoves = 0;
    } else {
      this.halfMoves += 1;
    }
  },

  /*
   * @method 
   *
   * @private 
   */
  updateFullMoves : function(){
    if(this.activeColor == 'b'){ this.fullMoves += 1; }
  },

  /**
   * @method 
   *
   * next game
   *
   * @return void
   */
  next : function(){
    var moveString = this.game.turns[this.fullMoves - 1][this.activeColor];
    var move = moveRegExp.exec(moveString);
    this.updateFullMoves();
    this.move(move);
  },

  /**
   * @method
   *
   * @return {Boolean}
   *
   * @private 
   */
  isMatchPosition : function(piece){
      if(this.position){
        return piece.position.isMatch(this.position);
      } else {
        return true;
      }
  },

  /**
   * filter function 
   *
   * @method 
   *
   * @param {Piece} piece element of filter function
   *
   * @param {Context} color
   *
   * @return {Boolean}
   *
   * @private 
   *
   * Examples
   *     @example
   *     activeColor = 'w'
   *     pieces = [pawWhite, pawBlack]
   *     _.chain(pieces)
   *      .filter(isMatchColor)
   *      .value()
   *     // -> pawWhite 
   */
  isMatchColor: function(piece){
    // Note: this is point to context object 
    var current = this.color == 'w' ? WhitePiece : BlackPiece;
    return ring.instance(piece, current);
  },

  /**
   * filter function 
   *
   * @method 
   *
   * @param {Piece} piece element of filter function
   * @param {Object} context must contains `pieces` = ["r", "k"]
   *
   * @return {Boolean}
   *
   * @private 
   */
  isMatchPieces : function(piece){
    return _.contains(this.pieces, piece.fenNotation.toUpperCase());
  },

  /**
  * filter function 
  *
  * @method hasNext
  *
  * @param Piece piece element of filter function
  * @param Object context contains `square`, `next`
  *
  * @return {Boolean}
  *
  * @private 
  */
  hasNext : function(piece) {
    var nexts = _.map(
      piece.getNext(this.square),
      function(position){ 
        if(ring.instance(position, Position)){
           return position.toPGNPosition();
        } else {
          return position;
        }
      }
    );
    return _.contains(nexts, this.next);
  },

  /**
  * return pieces accociation with a current move 
  *
  * @method getContext
  *
  * @param Object move matched object of a move notation 
  *
  * @return Array pieces accociate with this move 
  *
  * @private
  */ 
  getContext : function(move){
    var piece = move.piece;
    var pieces = [];
    var next = move.next;
    if(piece == ''){ piece = 'P' }
    pieces.push(piece);
    if(move.kingCastle || move.queenCastle){
      pieces = ['K', 'R'];
      next = move[0]; // O-O or O-O-O
    }
    var context = {
      position: move.position,   // current position
      pieces: pieces,            // piece to move
      next: next,                // next move
      square: this.square,       // current state of square in board
      color: this.activeColor 
    };
    return context;
  },

  /**
  * return pieces accociation with a current move 
  *
  * @method find
  * @param Object move matched object of a move notation
  * @return Array pieces accociation with this move 
  */ 
  find : function(move){
    var context = this.getContext(move);
    return _.chain(this.pieces)
      .filter(this.isMatchColor, context)
      .filter(this.isMatchPieces, context)
      .filter(this.isMatchPosition, context)
      .filter(this.hasNext, context)
      .value();
  },


  updateEnPassant : function(pieces, move){
    var piece = pieces[0];
    this.enPassant = '-';
    if(ring.instance(piece, Paw)){
      this.enPassant = piece.getEnPassant(convertToPosition(move.next));
    }
  },

  updateActiveColor : function(){
    if(this.activeColor == 'b'){
      this.activeColor = 'w';
    } else {
      this.activeColor = 'b';
    }
  },

  /**
   * note: this method should call before pieces move
   * because it take the position of rock and king 
   * @method
   */
  updateCastle : function(pieces, move) { 
    var piece = pieces[0];
    if(ring.instance(piece, Rock)){
      var rock = piece;
      if(piece.numMoves == 0){
        var king = _.chain(this.square.pieces)
            .filter(this.isMatchColor, { color: piece.color })
            .filter(this.isMatchPieces, {pieces: ["K"]})
            .value()[0]
        king.disableCastle(rock);
      }
    }

    if(ring.instance(piece, King)){
      piece.castleString = '';
    }
  },

  /**
   * take piece from position
   *
   * @method take
   *
   * @param position 
   *
   */
  take : function(position){
   this.pieces = _.reject(this.pieces, this.isMatchPosition, {position: position});
  },

  /*
   *
   */
  move : function(move){
    var pieces = this.find(move);
    if(move.isCapture){
      this.take(move.next);
    }
    var context = this.getContext(move);
    var next = context.next;
    if(next != "O-O-O" && next != "O-O"){
      next = convertToPosition(next);
    }

    this.updateEnPassant(pieces, move);
    this.updateCastle(pieces, move);

    // move pieces 
    _.each(pieces, function(piece){
      piece.move(next);
    })
    this.updateHalfMoves(pieces, move);
    this.updateActiveColor();
    this.square.update(this.pieces);
  },

  getFen : function(){
    var lines = this.square.getFENLines();
    // generate lines
    this.fen = _.string.sprintf("%s %s %s %s %s %s",
      lines,
      this.activeColor,
      this.getCastleString(),
      this.enPassant,
      this.halfMoves,
      this.fullMoves
    );
    return this.fen;
  }
})

