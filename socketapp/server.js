var http = require('http')
  , express = require('express') 
  , io = require('socket.io');

//setup http server
//express 2.0.0
var app = express.createServer();
var server = app;
//express 3.0.0
//var app = express();
//var server = http.createServer(app);

app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.static(__dirname + '/public'));
});

app.get('/', function(req,res){
//express 3.0.0
//	res.render('index', {title: 'websockets demo'});
//experss 2.0.0
	res.send("<!DOCTYPE html><html lang='en'><head><title>websockets demo</title><script src='https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js'></script><script src='js/socket.io.js'></script><script src='js/magic.js'></script></head><body><h1>websockets demo</h1><button type='button' onclick='demo.send()'>Send</button></body></html>");
});

server.listen(8080)

//setup websocket server
ss = io.listen(server);

ss.set('transports', ['websocket','flashsocket','htmlfile','xhr-polling','jsonp-polling']);

ss.sockets.on("connection", function(socket){
	socket.emit('hello', { hello: 'world' });
	socket.on('ping', function(){
		socket.emit('pong');
	});
	console.log('socket connection!');
});


