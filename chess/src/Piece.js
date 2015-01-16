/**
 * @class PieceFactory
 *
 * create piece 
 *
 * @singleton 
 *
 */
var PieceFactory = new function (){
  this.create = function(character){
    switch(character){
      case "K" : return new KingWhite();
      case "k" : return new KingBlack();
      case "Q" : return new QueenWhite();
      case "q" : return new QueenBlack();
      case "R" : return new RockWhite();
      case "r" : return new RockBlack();
      case "B" : return new BishopWhite();
      case "b" : return new BishopBlack();
      case "N" : return new KnightWhite();
      case "n" : return new KnightBlack();
      case "P" : return new PawWhite();
      case "p" : return new PawBlack();
    }
  }
}


/**
 * Description
 *
 * @class Piece
 *
 */
var Piece = ring.create({
  position : new Position(1, 1),

  setPosition : function(row, column){
    this.position = new Position(row, column);
  },

  getNext: function(board){
    throw "`getNext` must be implemented in subclass";
  },

  /**
   * generate next moves for bishops, rocks and queens 
   *
   * @param Array steps (in this object)
   * @param Object square 
   *
   */
  generateNexts: function(square){
    var thisPiece = this;
    var nexts = _.chain(thisPiece.steps)
      .map(function(step){
        var moves = [];
        var previous = thisPiece.position;
        var next = previous.move(step);
        while(square.isValidNextPosition(thisPiece, previous, next)){
          moves.push(next);
          previous = next;
          next = previous.move(step);
        }
        return moves;
      })
      .union()
      .flatten()
      .value();
      return nexts;
  },

  /**
   * check if a fen notation has same color 
   *
   * @method isSameColor
   *
   * @param String notation // either rnbqkpRNBQKP
   *
   */
  isSameColor: function(notation){ 
    var isWhite = this.color == 'w' ? true : false
    var isUpperCase = notation.toUpperCase() == notation ? true: false
    return isWhite == isUpperCase;
  }
});

/**
 * @class WhitePiece 
 */
var WhitePiece = ring.create({ color : 'w' })

/**
 * @class BlackPiece 
 */
var BlackPiece = ring.create({ color : 'b' })

/**
 * @class King
 *
 * @extend Piece  
 *
 */
var King = ring.create([Piece], {
  steps : [
    [0, 1], [0, -1], [1, 0], [-1, 0],
    [1, 1], [1, -1], [-1, 1], [-1, -1]
  ],
  
  getNext: function(board){
    var castleMoves = ['O-O', 'O-O-O'];
    var thisPiece = this;
    var kingMoves = _.map(thisPiece.steps, function(step){
      return thisPiece.position.move(step);
    })
    var moves = _.union(castleMoves, kingMoves);
    return moves;
  },

  move: function(position){
    if(position == "O-O"){ this.kingCastle(); return true; };
    if(position == "O-O-O"){ this.queenCastle(); return true; };
    this.position = position;
  },
  
  kingCastle: function(){
    this.position.column += 2;
  },

  queenCastle: function(){
    this.position.column -= 2;
  },

  disableCastle: function(rock){
    var castleSide = '';
    if(rock.position.column == 1){ castleSide = 'Q' };
    if(rock.position.column == 8){ castleSide = 'K' };
    if(this.color == 'b'){ castleSide = castleSide.toLowerCase() };
    this.castleString = _.without(this.castleString, castleSide).join("");
  }
});

/**
 * @class KingWhite
 *
 * @mixin WhitePiece
 *
 * @extend King
 *
 */
var KingWhite = ring.create([King, WhitePiece], {
  fenNotation: 'K',
  castleString: 'KQ'
})

/**
 * @class KingBlack
 *
 * @mixin BlackPiece 
 *
 * @extend King
 */
var KingBlack = ring.create([King, BlackPiece], {
  fenNotation: 'k',
  castleString: 'kq'
})

/**
 * @class Queen
 *
 * @extend Piece  
 */
var Queen = ring.create([Piece], {

  /**
   * @method 
   */
  move: function(position){
    this.position = position;
  },

  getNext: function(square){
    var thisPiece = this;
    return _.chain(square.getPositions())
      .filter(function(position){
        return thisPiece.position.isQueenMove(position);
      })
      .value()
  }

});

/**
 * Description
 *
 * @class QueenWhite
 *
 * @extends Queen 
 */
var QueenWhite = ring.create([Queen, WhitePiece], { fenNotation: 'Q' })

/**
 * Description
 *
 * @class QueenBlack
 *
 * @extends Queen 
 */
var QueenBlack = ring.create([Queen, BlackPiece], { fenNotation: 'q' })

/**
 * Description
 *
 * @class Rock 
 *
 * @extends Piece 
 */
var Rock = ring.create([Piece], {
  /*
   * get next available positions
   */

  constructor: function() {
    this.numMoves = 0;
    this.steps = [
      [0, 1], [0, -1],
      [1, 0], [-1, 0]
    ];
  },

  getCastleString: function(){
    return this.position.column == 1 ? 'O-O-O' : 'O-O';
  },

  getNext: function(square){
    var castle = this.getCastleString();
    var moves = [castle];
    var rockMoves = this.generateNexts(square);
    moves = _.union(moves, rockMoves);
    return moves;
  },

  move: function(position){
    if(position == "O-O"){ this.kingCastle(); return true; };
    if(position == "O-O-O"){ this.queenCastle(); return true; };
    this.position = position;
    this.numMoves += 1;
  },

  kingCastle: function(){
    this.position.column -= 2;
  },

  queenCastle: function(){
    this.position.column += 3;
  }
});

/**
 * Description
 *
 * @class RockWhite 
 *
 * @extends Rock 
 */
var RockWhite = ring.create([Rock, WhitePiece], { 
  fenNotation: 'R'
})

/**
 *
 * @class RockBlack 
 *
 * @mixin BlackPiece 
 *
 * @extends Rock  
 */
var RockBlack = ring.create([Rock, BlackPiece], { 
  fenNotation: 'r'
})

/**
 *
 * @class Knight 
 *
 * @extends Piece 
 */
var Knight = ring.create([Piece], {
  move: function(position){
    this.position = position;
  },
  /*
   * get next available positions
   */
  getNext: function(square){
    var thisPiece = this;
    var moves = _.chain(square.getPositions())
      .filter(function(position){
        return thisPiece.position.isKnightMove(position);
      })
      .value()
    return moves;
  }
});

/**
 *
 * @class KnightWhite  
 *
 * @extends Knight 
 */
var KnightWhite = ring.create([Knight, WhitePiece], { fenNotation: 'N' })

/**
 *
 * @class KnightBlack  
 *
 * @extends Knight 
 */
var KnightBlack = ring.create([Knight, BlackPiece], { fenNotation: 'n' })

/**
 *
 * @class Bishop
 *
 * @extends Piece  
 */
var Bishop = ring.create([Piece], {
  move: function(position){
    this.position = position;
  },

  getNext: function(square){
    var thisPiece = this;
    return _.chain(square.getPositions())
      .filter(function(position){
        return thisPiece.position.isBishopMove(position);
      })
      .value()
  }
});

/**
 *
 * @class BishopWhite 
 *
 * @extends Bishop 
 *
 */
var BishopWhite = ring.create([Bishop, WhitePiece], { fenNotation: 'B' })

/**
 *
 * @class BishopBlack 
 *
 * @extends Bishop 
 */
var BishopBlack = ring.create([Bishop, BlackPiece], { fenNotation: 'b' })

/**
 *
 * @class Paw  
 *
 * @extends Piece  
 */
var Paw = ring.create([Piece], {
  move: function(position){
    this.position = position;
  },

  getNext: function(square){
    var moves = [];
    if(this.position.row == this.initialRow){
      moves.push(this.position.move([this.direction * 2, 0]));
    }
    moves.push(this.position.move([this.direction, 0]));
    var piece = this;
    _.chain([[piece.direction, -1], [piece.direction, 1]])
      .map(function(offset){ 
        return piece.position.move(offset)
      })
      .filter(function(position){ 
        return square.hasOpponent(piece, position)
      })
      .each(function(position) { 
        moves.push(position) 
      });
    return moves;
  },
  /*
   * this should be done before the paw' move
   */
  getEnPassant: function(next){
    var distance = next.distance(this.position);
    if(_.isEqual(distance, [2 * this.direction, 0])){
      return this.position.move([this.direction, 0]).toPGNPosition();
    } else {
      return '-';
    }
  }
});

/**
 *
 * @class PawWhite  
 *
 * @extends Paw
 */
var PawWhite = ring.create([Paw, WhitePiece], {
  direction: 1, 
  fenNotation: 'P',
  initialRow: 2
})

/**
 *
 * @class PawBlack 
 *
 * @extends Paw  
 */
var PawBlack = ring.create([Paw, BlackPiece], { 
  direction: -1,
  fenNotation: 'p',
  initialRow : 7
})
