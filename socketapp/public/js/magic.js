window.WEB_SOCKET_SWF_LOCATION = "swf/WebSocketMain.swf";


var settings = {
    size: 5,
    spacing: 1,
    width: 100,  // those could be received from the serverside too...
    height: 100  //
}


var demo = {count: 0}

demo.send = function(){
	console.log('sending ping');
	demo.socket.emit('ping');
}

function initializePaper() {  
    var paper = Raphael("canvas", settings.width * (settings.size + settings.spacing), settings.height * (settings.size + settings.spacing))
    paper.clearX = function () { 
        paper.clear()
        paper.rect(0,0,paper.width,paper.height).attr({fill: '#eeeeee'})
    }
    console.log(paper)
    return paper
}

function getColour(playerid) { 
    if (playerid == -1) { return 'black' }
    var colours = [ 'red','green','blue','orange','yellow' ]
    return colours[playerid % colours.length]
}

function renderGame(paper,data) {      
    paper.clearX();
    var size = settings.size
    var spacing = settings.spacing

    _.map(data, function (point) { 
        paper.rect(
            (size + spacing) * point.coord[0],  // x
            (size + spacing) * point.coord[1],  // y
            size, size, 2) // width, height, corner roundness            
            .attr({fill: getColour(point.id), stroke: "none"}) // colour
    })
}


$(document).ready(function() {
	
    var paper = initializePaper()

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
		renderGame(paper,data);
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



