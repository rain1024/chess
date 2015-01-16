/*!
 * Chess v1.0.0
 * (c) 2014 Brother Rain <http://github.com/rain1024/>
 * MIT License
 */

/**
 * Chess provides engine for making javascript chess game. Enjoy the game.
 *
 * @requires N/A
 */

var moveRegExp = XRegExp('(?<normal>(?<piece> [K|Q|R|N|B]?)' + 
                         '(?<position>[a-h1-8]?)' + 
                         '(?<isCapture>x?)' + 
                         '(?<next>[a-h][1-8])' + 
                         '(?<isCheck>\\+?))' + 
                         '|' + 
                         '(?<queenCastle>O-O-O)' +
                         '|' + 
                         '(?<kingCastle>O-O)'
                         , 'x');

var normalTurnRegExp = XRegExp.build('\\d+\\.\ ?({{white}}) ({{black}}) ', {
  white: moveRegExp,
  black: moveRegExp
});

var lastTurnRegExp = XRegExp.build('\\d+\\.\ ?(?<white>{{move}})? ?(?<black>{{move}})? (?<score>((1\\-0)|(0\\-1)|(1\\/2\\-1\\/2)))', {
  move: moveRegExp
});

var turnsRegExp = XRegExp.build('(?<normals>{{normal}}+)({{last}})', {
  normal: normalTurnRegExp,
  last: lastTurnRegExp
});

var metaRegExp = XRegExp.build('\\[({{meta}}) "({{content}})"\\] ', {
  meta: /\w+/,
  content: /.+?/
});

var gameRegExp = XRegExp.build('(?<metas>({{meta}}+))\ +({{turns}})', {
  meta: metaRegExp,
  turns: turnsRegExp
});

// var fenRegExp = XRegExp.build("(({{line}})\/){7}({{line}}) [bw] [KQ-]*[kq-]* (\-|[a-h][1-8]) \d+ \d+", {
var fenRegExp = XRegExp.build("(?<lines>(({{line}})\/){7}({{line}})) ({{activeColor}}) ({{whiteCastle}})({{blackCastle}}) ({{enPassant}}) ({{halfMoves}}) ({{fullMoves}})", {
  line : /[rnbqkpRNBQKP1-8]+/,
  activeColor: /[bw]/,
  whiteCastle: /[KQ-]*/,
  blackCastle: /[kq-]*/,
  enPassant : /(-|[a-h][1-8])/,
  halfMoves : /\d+/,
  fullMoves : /\d+/
});

/**
 * Description
 *
 * @method loadfile
 * @param String url
 * @return String content
 */
function loadfile(url){
  var content = "";
  $.ajax({
    url: url,
    success: function(data){
      content = data;
    },
    async: false
  })
  return content;
}

/**
 * Description
 *
 * @method removeNewLines
 * @param Object content
 * @return void 
 */
function removeNewLines(content){
  return content.replace(/(\r\n|\r|\n)/gm, " ")
}
