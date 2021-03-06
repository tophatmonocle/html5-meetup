var http = require('http')
, express = require('express') 
, io = require('socket.io')
, _ = require('underscore')
, colors = require('colors')
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
var playercounter = 0

//setup http server
var app = express();
var server = http.createServer(app);

function playerObject(data) { _.extend(this,data) }

playerObject.prototype.die = function () { 
    var self = this
    var id = this.id
    delete players[id]

    _.map(game_state,function (point) {  
        // mark cells as dead
        if (point.id == id) { point.id = -1 }
    })

    
}

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

    
    var player = new playerObject({ current: rndcoords, vector: [0,1], age_cutoff: [10], socket: socket, id: playercounter++})
    console.log(("player " + player.id + " connected").green)

    players[player.id] = player
	
	//setup key events
	socket.on('keypress', function(data){
		//add player move to queue
		console.log('player', player.id, 'keypress',data.direction);
		var vector = []
		if( data.direction == 'up' ){ vector = [0,-1]; }
		else if( data.direction == 'down' ){ vector = [0,1] }
		else if( data.direction == 'left' ){ vector = [-1,0] }
		else if( data.direction == 'right' ){ vector = [1,0] }
		player.vector = vector
	});
    
    socket.on('disconnect',function () { 
        console.log(("player " + player.id+ " disconnected").red)
        player.die()
    })

});

ss.of('/ch1').on('connection', function(socket){
	socket.emit('hello', {hello:'channel 1'});
});

//setup state update and broadcase
var update_state = function(){
	generation++;
//	console.log('generation: '+generation);

	_.map(players,function (player) { 
		var current = player.current; 
		var vector = player.vector;
		var new_coord = [current[0]+vector[0], current[1]+vector[1]];
        
        if (stupidCollision(new_coord)) { 
            console.log(('player ' + player.id + ' died').red)
            player.die() 
        } else {
		    player.current = new_coord;
		    game_state.push({ id: player.id, coord: new_coord, generation: 0 });
        }
    })
}

function sameCoords(c1,c2) { 
    if ((c1[0] == c2[0]) && (c1[1] == c2[1])) { return true } else { return false }
}

function stupidCollision(coord) {  
    return _.find(game_state,function (point) { 
        return sameCoords(point.coord, coord)
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




