/* Dependencies : socket.io */

var http = require('http');
var io = require('socket.io');
var fs = require('fs');
var url = require('url');

var exec = require('child_process').exec;
var spawn = require('child_process').spawn;

var server = http.createServer(function(req,rep){
  console.log('connection');
  var path = url.parse(req.url).pathname;
  console.log(path);
  switch(path) {
    // Capture audio from mic and send it back to server
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
    // Working version where audio is captured, downsampled, and sent to server via socket
    // Kaldi decodes and server sends result back to the html
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
    // Javascript files used with new_index.html
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

    // END OF ACTIVE CODE
    // START DEMO ROUTES

    // sample invocations of command line process
    // http://stackoverflow.com/questions/20643470/execute-a-command-line-binary-in-node-js
    // execute_all: fetches complete output
    // execute_online: receives output as streams
    case '/execute_all':
      exec('bash ../example.sh',
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
      var child = spawn('bash', ['../example.sh']);
      child.stdout.on('data', function(chunk) {
        var returnedText = chunk.toString();
        // need to parse buffer data bytes into ascii
        console.log(returnedText);
      });
      rep.writeHead(200, {'Content-Type':'text/html'});
      rep.write("<html><body>Executing command ... fetch in chunks</body></html>");
      rep.end();
      break;
    // example of writing to a file using fs
    case '/write':
      fs.writeFile("./test.txt", "Hey there!", function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("The file was saved!");
        }
      });
      rep.writeHead(200, {'Content-Type':'text/html'});
      rep.write("<html><body>Writng</body></html>");
      rep.end();
      break;

    // This file was part of the starter code but abandoned in favor of
    // new_index.html
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
    // An visual example of using user media with video 
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
    // END DEMO ROUTES
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
  // used in index.html
  socket.on('data', function (data) {
    //console.log(data.audio);
    console.log(data.rate);
    // take the sound data
    // call command line process for sox to downsample it to 16KHz
    // take output and run a .sh script to call the appropriate kaldi methods
    
  });
  //used in new_index.html
  socket.on('wav', function (data) {
    fs.writeFile('test.wav', data.str, 'binary');
    // run the kaldi decode script
    var child = spawn('bash', ['../example.sh']);
    child.stdout.on('data', function(chunk) {
      // need to parse buffer data bytes into ascii
      var returnedText = chunk.toString();
      console.log(returnedText);
      // send back to html file to display for user
      socket.emit("decode", {'result': returnedText});
    });
  });
});

