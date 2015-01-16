/**
 * Game contains moves 
 * @constructor
 * @class Game
 * @method Game
 * @return 
 */

var Game = ring.create({
  metas : {},
  turns : [],

  /**
   * load game from png file
   *  
   * @method load
   * @param String path
   * @return void
   */
  load : function(path){
    var game = this;
    var data = loadfile(path);
    data = removeNewLines(data); 
    var exec = gameRegExp.exec(data);
    XRegExp.forEach(exec.metas, metaRegExp, function(match, i){
      game.metas[match.meta] = match.content;
    }, []);
    var turns = turnsRegExp.exec(exec.turns);
    var normals = turns.normals;
    var last = turns.last;
    XRegExp.forEach(normals, normalTurnRegExp, function(match, i){
      game.turns.push({
        'w' : match.white,
        'b' : match.black
      });
    }, []);
    var match = lastTurnRegExp.exec(last);
    game.turns.push({
      'w' : match.white,
      'b' : match.black
    })
  }
})

