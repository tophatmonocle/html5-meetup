window.WEB_SOCKET_SWF_LOCATION = "swf/WebSocketMain.swf";


var settings = {
    size: 10,
    spacing: 2,
    width: 50,  // those could be received from the serverside too...
    height: 50  //
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

function getColour(player) {  
    return 'red'
}

function renderGame(paper,data) {      
    paper.clearX();
    var size = settings.size
    var spacing = settings.spacing

    _.map(data, function (point) { 
        console.log(point)
        paper.rect(
            (size + spacing) * point[1][0],  // x
            (size + spacing) * point[1][1],  // y
            size, size, 2) // width, height, corner roundness
            
            .attr({fill: getColour(point[0]), stroke: "none"}) // colour
    })
}


$(document).ready(function() {
	
    var paper = initializePaper()

    renderGame(paper,[
        [1, [3,3],1],
        [1, [3,4],1],
        [1, [3,5],1],
        [1, [2,5],1],
        [1, [1,5],1]
    ])


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



