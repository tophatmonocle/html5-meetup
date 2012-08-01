window.WEB_SOCKET_SWF_LOCATION = "swf/WebSocketMain.swf";

var demo = {count: 0}

demo.send = function(){
	console.log('sending ping');
	demo.socket.emit('ping');
}

$(document).ready(function() {
	demo.socket = io.connect('http://127.0.0.1:8080');

	demo.socket.on('pong', function (data) {
		console.log('pong '+demo.count);
		demo.count++;
	});
	
	demo.socket.on('hello', function (data) {
		console.log('hello '+data.hello);
	});
});

