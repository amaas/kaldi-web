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
    case '/offline.html':
      fs.readFile(__dirname+"/offline.html", function(error,data){
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
      var child = spawn('bash',['../example.sh'] );
      child.stdout.on('data', function(chunk) {
        var returnedText = chunk.toString();
        // need to parse buffer data bytes into ascii
        console.log(returnedText);
	console.log(chunk.length());
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
    var child1 = spawn('sox',['-r', '44100', '-t', 'raw','-e','unsigned-integer','-b', '16','-','-r', '16k','-t', 'raw','-e', 'unsigned-integer','-b','16','-']);
    var child2 = spawn('bash', ['../scripts/example2.sh']);
    // Error handling for process termination
    child1.on('close', function (code) {
        if (code !== 0) {
            console.log('child1 process exited with code ' + code);
        }
        child2.stdin.end();
    });
    child2.on('close', function (code) {
        if (code !== 0) {
            console.log('child2 process exited with code ' + code);
        }
    });
    
    child1.stderr.on('data', function (data) {
        console.log(' stderr: ' + data);
    });
    child2.stderr.on('data', function (data) {
	console.log(' stderr2: ' + data);
    });
    // Here comes the pipeline from index.html
    // Get the sound as floats between -1 and 1, scale to 16 bits unsigned i.e. 0 ... 65535
    // build a buffer of bytes, i.e. high end byte, low end byte
    // turn it into a string using code cribbed from the web and pass it to sox
    socket.on('data', function (data) {
        console.log(data.rate);
        console.log("passing to sox");
        console.log(data.audio);
        // take the sound data
        var sendthis = data.audio;
        var packedform = [];
        for (x in sendthis) {
            var byte = 32767 * sendthis[x] + 32768;
            var hi = (byte & 0xff00) >> 8;
            var lo = byte & 0xff;
            packedform.push(hi);
            packedform.push(lo);
        }
        child1.stdin.write(String.fromCharCode.apply(null, packedform));
    });

    child1.stdout.on('data', function (data){
        child2.stdin.write(data);
    });
    child2.stdout.on('data', function(chunk) {
          // need to parse buffer data bytes into ascii                                                                                              
          var returnedText = chunk.toString();
          console.log(returnedText);
          // send back to html file to display for user                                                                                              
          socket.emit("decode_online", {'result': returnedText});
    });
    
    //used in offline.html
    socket.on('wav', function (data) {
	fs.writeFile('speech.wav', data.str, 'binary');
	// run the kaldi decode script
	// using the king solomon models
	var child = spawn('bash', ['../scripts/offline_king_sol.sh']);
	child.stdout.on('data', function(chunk) {
	    // need to parse buffer data bytes into ascii
	    var returnedText = chunk.toString();
	    console.log(returnedText);
	    // send back to html file to display for user
	    socket.emit("decode", {'result': returnedText});
	});
    });
});

