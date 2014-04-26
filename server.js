/* Starts server on 8080, opens socket and waits for 'left' event. On 'left'
 * writes audio data to console. Dependencies : socket.io */

var http = require('http');
var io = require('socket.io');
var fs = require('fs');
var url = require('url');
var fs = require('fs');

var server = http.createServer(function(req,rep){
  console.log('connection');
  var path = url.parse(req.url).pathname;
  console.log(path);
  switch(path) {
    case '/':
      fs.readFile(__dirname+"/index.html", function(error,data){
        if (error) {
          console.log('error');
        }
        rep.writeHead(200, {'Content-Type':'text/html'});
        rep.write(data, 'utf8');
        rep.end();
      });
      break;
    case '/audio.html':
      fs.readFile(__dirname+"/audio.html", function(error,data){
        if (error) {
          console.log('error');
        }
        rep.writeHead(200, {'Content-Type':'text/html'});
        rep.write(data, 'utf8');
        rep.end();
      });
      break;
    case '/audio_sample.html':
      fs.readFile(__dirname+"/audio_sample.html", function(error,data){
        if (error) {
          console.log('error');
        }
        rep.writeHead(200, {'Content-Type':'text/html'});
        rep.write(data, 'utf8');
        rep.end();
      });
      break;
    case '/video.html':
      fs.readFile(__dirname+"/video.html", function(error,data){
        if (error) {
          console.log('error');
        }
        rep.writeHead(200, {'Content-Type':'text/html'});
        rep.write(data, 'utf8');
        rep.end();
      });
      break;
    case '/recorder.js':
      fs.readFile(__dirname+"/recorder.js", function(error,data){
        if (error) {
          console.log('error');
        }
        rep.writeHead(200, {'Content-Type':'text/javascript'});
        rep.write(data, 'utf8');
        rep.end();
      });
      break;
    case '/recorderWorker.js':
      fs.readFile(__dirname+"/recorderWorker.js", function(error,data){
        if (error) {
          console.log('error');
        }
        rep.writeHead(200, {'Content-Type':'text/javascript'});
        rep.write(data, 'utf8');
        rep.end();
      });
      break;
    default:
      console.log("default path");
      rep.writeHead(404);
      rep.write("opps this doesn't exist - 404");
      break;
  }
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

