var http = require('http')
  , express = require('express') 
  , io = require('socket.io');

//setup http server
var app = express();
var server = http.createServer(app);

app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.static(__dirname + '/public'));
});

app.get('/', function(req,res){
	res.render('index', {title: 'websockets demo'});
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


