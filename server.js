/* Starts server on 8080, opens socket and waits for 'left' event. On 'left'
 * writes audio data to console. Dependencies : socket.io */

var http = require('http');
var io = require('socket.io');
var fs = require('fs');

var server = http.createServer(function(req,rep){
  console.log('connection');
  fs.readFile(__dirname+"/index.html", function(error,data){
    if (error) {
      console.log('error');
    }
    rep.writeHead(200, {'Content-Type':'text/html'});
    rep.write(data, 'utf8');
    rep.end();
  });
});

server.listen(8080);

io = io.listen(server);

// Turn debug logging off
io.set('log level', 1);

io.sockets.on('connection',function (socket) {
  socket.on('left', function (data) {
    console.log(data.left)
  });
});

