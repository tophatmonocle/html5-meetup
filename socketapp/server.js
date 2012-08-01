var http = require('http')
  , express = require('express') 
  , io = require('socket.io');

// game_state {
//   map: [] //array of points [player, [x,y], age]
//   players: [{ session: session_id, current: [], vector: [], age_cutoff: [] },]
// }
// player_move_queue = [{session: session_id, move: 'left'},]
// generation is a counter for the number of state upates so far
var game_state = {map: [], players: []};
var player_move_queue = [];
var generation = 0;

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

ss.set('transports', ['websocket','flashsocket','htmlfile','xhr-polling','jsonp-polling']);

ss.sockets.on("connection", function(socket){
	//dummy hello world stuff
	socket.emit('hello', { hello: 'world' });
	socket.on('ping', function(){
		socket.emit('pong');
	});
	console.log('socket connection!');

	//setup player
	//   players: [{ session: session_id, current: [], vector: [], age_cutoff: [] },]
	game_state.players.push( {session: socket.id, current:[100,100], vector: [0,1], age_cutoff: [10]} )
	game_state.map.push( {session: socket.id, coord: [100,100], generation:i 0} )
	
	//setup key events
	socket.on('keypress', function(data){
		//add player move to queue
		console.log('keypress '+data.direction);
		player_move_queue.push([socket.id, data.direction]);
	});	
});

ss.of('/ch1').on('connection', function(socket){
	socket.emit('hello', {hello:'channel 1'});
});

//setup state update and broadcase
var update_state = function(){
	generation++;
	console.log('generation: '+generation);
	
	//process player moves
	for( idx in player_mode_queue ){
		//find player
		
		//rotate player vector
	}

	//clear move queue
	player_move_queue = [];

	//update game state
	for( idx in game_state.players ){
	}

	//kill off snake sections that are past their generation
	for( idx in game_state.map ){
		//update generation
		//if too old, kill it
	}
}

var broadcast_state = function(){
	//for each active session, send the updated state
	var clients = ss.sockets.clients(); 
	for( client in clients ) {
		clients[client].emit('update_state', game_state);
	}
}

setInterval(function(){
	update_state();
	broadcast_state();
}, 3000);




