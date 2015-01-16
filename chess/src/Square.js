/**
 * @class Square
 */
function Square(){

  this.lines = []; 

  /**
   * @property {Piece[]} pieces 
   *
   * pieces of this square 
   */
  this.pieces = [];

  this.positions = [];

  this.isInBoard = function(position){
    var range = _.range(1, 9);
    return _.contains(range, position.row) && _.contains(range, position.column);
  }

  /**
   * get piece by position
   *
   * @method getPiece
   *
   * @param Position postion
   *
   */
  this.getPiece = function(position){
    return _.filter(this.pieces, function(piece){
      return piece.position.isEqual(position);
    })
  }

  /**
   * return status of a square 
   *
   * @method getStatus
   *
   * @param {Piece} piece
   * @param { Position } position
   *
   * @return {Number} status // 1, 0, -1
   *
   */
  this.getStatus = function(piece, position){
    var target = this.getPiece(position);
    if(target .length > 0){
      var target = target[0];
      if(piece.color == target.color){
        return 1;
      } else {
        return -1;
      }
    } {
      return 0;
    }
  }

  /**
   * return true if there are a opponent with a piece in `position`
   *
   * @method hasOpponent
   *
   * @param { Piece } piece
   * @param { Position } position
   *
   * @return { Boolean }
   *
   */
  this.hasOpponent = function(piece, position){
    return this.getStatus(piece,position) == -1;
  }

  this.hasComrade = function(piece, position){
    return this.getStatus(piece,position) == 1;
  }

  this.isValidNextPosition = function(piece, previous, next){
    return this.isInBoard(next) && 
     !this.hasComrade(piece, next) &&
     !this.hasOpponent(piece, previous);
  }

  /**
   * generate fen string base on pieces  
   *
   * @method getFENLines 
   * @param { Piece[] } pieces
   * @return { String }
   *
   * Examples: 
   *
   *     @example
   *     getFENLines(r11b111R) // r2b3R
   *
   */
  this.getFENLines = function(){
    return _.map(this.lines, function(line){
      return _.reduce(line, function(head, character){
        var last = _.last(head);
        var lastPosition = head.length - 1;
        var tail = parseInt(last) + parseInt(character);
        if(tail){
          return _.string.splice(head, lastPosition, 1, tail);
        } else {
          return head + character;
        }
      })
    }).join("/");
  } 
  /**
   * @method update
   *
   * @return { void } 
   */
  this.update = function(pieces){
    this.pieces = pieces;
    // generate initial lines
    var lines = _.chain(8)
      .range()
      .map(function(line){ return _.string.repeat("1", 8) })
      .value();
    // fill pieces to lines array
    _.each(pieces, function(piece){
      var row = 8 - piece.position.row;
      var column = piece.position.column - 1;
      lines[row] = _.string.splice(lines[row], column, 1, piece.fenNotation);
    })
    this.lines = lines;
  }

  /**
   * return position [Point(1,1), Point(1,2)..., Point(8,8)] 
   *
   * @method getPositions
   *
   * @return Array position 
   */
  this.getPositions = function(){
    if(this.positions.length == 0){
      var i, j;
      for(i=1; i<=8; i++){
        for(j=1; j<=8; j++){
          this.positions.push(new Position(i, j));
        }
      }
    }
    return this.positions;
  }
}
