var http = require('http')
, express = require('express') 
, io = require('socket.io')
, _ = require('underscore')

// game_state {
//   map: [] //array of points {session: session_id, coord: [x,y], generation: age]
//   players: [{ session: session_id, current: [], vector: [], age_cutoff: [] },]
// }
// player_move_queue = [{session: session_id, move: 'left'},]
// generation is a counter for the number of state upates so far
var game_state = []
var player_move_queue = [];
var generation = 0;

var game_state = []
var players = {}

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

server.listen(80,'0.0.0.0')


//setup websocket server
ss = io.listen(server);
ss.set('log level',0)

ss.set('transports', ['websocket','flashsocket','htmlfile','xhr-polling','jsonp-polling']);

ss.sockets.on("connection", function(socket){
	//dummy hello world stuff
	socket.emit('hello', { hello: 'world' });
	socket.on('ping', function(){
		socket.emit('pong');
	});

    // decide where to put the player
    var rndcoords = [ Math.round(Math.random() * 50) + 25,  Math.round(Math.random() * 50) + 25 ]
    
    
    var player = { current: rndcoords, vector: [0,1], age_cutoff: [10], id: _.keys(players).length}
    console.log("player", player.id, "connected")

    players[socket.id] = player
	
	//setup key events
	socket.on('keypress', function(data){
		//add player move to queue
		console.log('keypress '+data.direction);
		var vector = []
		if( data.direction == 'up' ){ vector = [0,-1]; }
		else if( data.direction == 'down' ){ vector = [0,1] }
		else if( data.direction == 'left' ){ vector = [-1,0] }
		else if( data.direction == 'right' ){ vector = [1,0] }
		player.vector = vector
	});
    
    socket.on('disconnect',function () { 
        console.log("player", player.id, "disconnected")
        delete players[socket.id]
    })

});

ss.of('/ch1').on('connection', function(socket){
	socket.emit('hello', {hello:'channel 1'});
});

//setup state update and broadcase
var update_state = function(){
	generation++;
	console.log('generation: '+generation);

	_.map(players,function (player) { 
		var current = player.current; 
		var vector = player.vector;
		var new_coord = [current[0]+vector[0], current[1]+vector[1]];
		player.current = new_coord;
		game_state.push({ id: player.id, coord: new_coord, generation: 0 });
    })
}

var broadcast_state = function(){
	//for each active session, send the updated state event
	var clients = ss.sockets.clients(); 
	for( client in clients ) {
		clients[client].emit('update_state', game_state);
	}
}

setInterval(function(){
	update_state();
	broadcast_state();
}, 300);




