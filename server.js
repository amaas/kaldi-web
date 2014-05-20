/* Starts server on 8080, opens socket and waits for 'left' event. On 'left'
 * writes audio data to console. Dependencies : socket.io */

var http = require('http');
var io = require('socket.io');
var fs = require('fs');
var url = require('url');
var fs = require('fs');

var exec = require('child_process').exec;
var spawn = require('child_process').spawn;

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
    case '/new_index.html':
      fs.readFile(__dirname+"/new_index.html", function(error,data){
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
    case '/resampler.js':
      fs.readFile(__dirname+"/resampler.js", function(error,data){
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
    // sample invocations of command line process (wc)
    // http://stackoverflow.com/questions/20643470/execute-a-command-line-binary-in-node-js
    // execute_all: fetches complete output
    // execute_online: receives output as streams
    case '/execute_all':
      exec('wc recorder.js',
        function (error, stdout, stderr) {
          console.log('stdout: ' + stdout);
          if (error !== null) {
            console.log('exec error: ' + error);
          }
      });
      rep.writeHead(200, {'Content-Type':'text/html'});
      rep.write("<html><body>Executing command ... fetch complete output</body></html>");
      rep.end();
      break;
    case '/execute_online':
      // command and its list of args
      var child = spawn('wc', ['recorderWorker.js', '-l']);
      child.stdout.on('data', function(chunk) {
        var returnedText = chunk.toString();
        // need to parse buffer data bytes into ascii
        console.log(returnedText);
      });
      rep.writeHead(200, {'Content-Type':'text/html'});
      rep.write("<html><body>Executing command ... fetch in chunks</body></html>");
      rep.end();
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

