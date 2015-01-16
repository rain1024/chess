/**
 * BoardController listen user event 
 * @class BoardController
 * @constructor
 */
function BoardController (){
  this.board = new Board();
  this.board.load(path); 
  console.log(this.game);
}

BoardController.prototype.draw = function(){
  console.log(this.board.fen);
};

BoardController.prototype.next = function(){
  this.board.next();
  this.draw(); 
};

BoardController.prototype.previous = function(){
  this.board.previous();
  this.draw(); 
};
