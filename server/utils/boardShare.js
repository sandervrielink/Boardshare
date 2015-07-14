var Hashids = require('hashids'),
    hashids = new Hashids('salty travers', 7);
var boardShares = require('./boardShares');

BoardShare = function(){
  this.id = hashids.encode(Math.floor(Math.random() * 1e5));
  this.peerIds = {};
  boardShares.addBoard(this);
};

BoardShare.prototype.addPeerId = function(socketId, peerId) {
  this.peerIds[socketId] = peerId;
};

BoardShare.prototype.removePeerId = function(socketId) {
  delete this.peerIds[socketId];
};

module.exports = BoardShare;
