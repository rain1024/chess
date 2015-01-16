/**
 *
 * @class Position
 */
var Position = ring.create({
  constructor: function(r, c){
    this.row = r;
    this.column = c;
  },

  /**
   * @method move
   *
   * @param Array offset [r, c]
   * @return Position
   *
   * @private 
   */
  move: function(offset){
    var r = offset[0];
    var c = offset[1];
    return new Position(this.row + r, this.column + c);
  },

  /**
  * @method isMatch
  * 
  * @param String pgnPosition either "c", "3" or "c3"
  *
  */ 
  isMatch : function(pgnPosition){
    var rows = " 12345678";
    var columns = " abcdefgh";
    var r = rows[this.row];
    var c = columns[this.column];
    if(pgnPosition.length == 2){
      return c == pgnPosition[0] && r == pgnPosition[1];
    } else {
      return c == pgnPosition || r == pgnPosition;
    }
  },

  /*
   * distance from dest point to this point
   * point = Point(1, 5)
   * point.distance(new Point(2, 4)) = [-1, 1]
   */
  distance: function(point){
    return [this.row - point.row, this.column - point.column];
  },

  toPGNPosition: function(){
    var rows = "12345678";
    var columns = "abcdefgh";
    return columns[this.column - 1] + rows[this.row - 1]; 
  },

  isEqual : function(position){
    return _.isEqual(this.row, position.row) && _.isEqual(this.column, position.column);
  },

  isSameRow: function(point){
    return this.distance(point)[0] == 0;
  },

  isSameColumn: function(point){
    return this.distance(point)[1] == 0;
  },

  isSameDiagonal: function(point){
    var distance = this.distance(point);
    var dRow = Math.abs(distance[0]);
    var dColumn = Math.abs(distance[1]);
    return dRow == dColumn;
  },

  isKnightMove: function(point){
    var distance = this.distance(point);
    var dRow = Math.abs(distance[0]);
    var dColumn = Math.abs(distance[1]);
    return (dRow == 1 && dColumn == 2) || (dRow == 2 && dColumn == 1);
  },

  isRockMove: function(point) {
    return this.isSameRow(point) || this.isSameColumn(point);
  },

  isBishopMove: function(point){
    return this.isSameDiagonal(point);
  },

  isQueenMove: function(point) {
    return this.isRockMove(point) || this.isBishopMove(point);
  }
})
