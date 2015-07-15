var path = require('path');
var BoardShare = require('../utils/boardShare');
var boardShares = require('../utils/boardShares');

module.exports = function(app){
  app.get('/start', function(req, res){
    var board = new BoardShare();
    var id = encodeURIComponent(board.id);
    res.redirect('/' + id);
  });
  app.get('/:id', function(req, res){
    var id = req.params.id;
    if (boardShares.boardExists(id)) {
      console.log('joining board: ', id);
      res.sendFile(path.join(__dirname, '../../client/app/board.html'));
    } else {
      res.sendStatus(404);
    }
  });
};
