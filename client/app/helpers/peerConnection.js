var helpers = require('./peerHelpers');
var remotePeers = require('./remotePeers');
var RemotePeer = require('./remotePeer');
var _ = require('lodash');
var socket = io();
var callHandler = require('../video/video').callHandler;

var rtc;


socket.on('env', function(env, port){
  if (env === 'production'){
    exports.rtc = new Peer({ host:'/', secure:true, port:443, path: '/api' });
    rtc = exports.rtc;
  } else {
    exports.rtc = new Peer({ host: '/', port: port, path: '/api' });
    rtc = exports.rtc;
  }
  rtc.on('open', function(id){
    console.log('peer id is: ', id);
    console.log(window.location.href.slice(-7));
    socket.emit('rtcReady', id, window.location.href.slice(-7));
    helpers.stayAlive(rtc);
  });
  rtc.on('connection', function(dataConnection){
    var remotePeer = new RemotePeer(dataConnection.peer, dataConnection);
  });
  rtc.on('disconnection', function(id){
    console.log('disconnected from peer server', id);
    setTimeout(function(){
      rtc.reconnect();
    }, 300);
  });
  rtc.on('call', function(call){
    var stream = require('../video/video').videoStream;
    if(stream){
      call.answer(stream);
      callHandler(call);
      remotePeers.getPeer(call.peer).mediaConnection = call;
    }
  });
});
socket.on('peerIds', function(ids){
  _.forEach(ids, function(id){
    if (! remotePeers.alreadyExists(id)) {
      var remotePeer = new RemotePeer(id, rtc.connect(id));
    }
  });
});
