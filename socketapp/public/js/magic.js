window.WEB_SOCKET_SWF_LOCATION = "swf/WebSocketMain.swf";

var demo = {count: 0}

demo.send = function(){
	console.log('sending ping');
	demo.socket.emit('ping');
}

$(document).ready(function() {
	
	//setup game
	var canvas = oCanvas.create({canvas: "#canvas", background: "#222"});
	
	var render_game = function( data ){
		for( idx in data.map ){
		}
	}

	//setup sockets
	demo.socket = io.connect('http://0.0.0.0:80');
	demo.socket_ch1 = io.connect('http://0.0.0.0:80/ch1');

	demo.socket.on('pong', function (data) {
		console.log('pong '+demo.count);
		demo.count++;
	});
	
	demo.socket.on('hello', function (data) {
		console.log('hello '+data.hello);
	});

	demo.socket_ch1.on('hello', function(data){
		console.log('hello '+data.hello);
	});

	//player state update
	demo.socket.on('update_state',function(data){
		render_game( data );
		console.log('state updated');
	});

	//key bindings
	$(document).keydown(function(e){
		if(e.keyCode == 37) { //left
			demo.socket.emit('keypress', {direction:'left'});
			console.log('left')
		} else if(e.keyCode == 39) { //right
			demo.socket.emit('keypress', {direction:'right'});
			console.log('right');
		} else if(e.keyCode == 38) { //up
			demo.socket.emit('keypress', {direction:'up'});
			console.log('up');
		} else if(e.keyCode == 40) { //down
			demo.socket.emit('keypress', {direction:'down'});
			console.log('down');
		}
	});
});



