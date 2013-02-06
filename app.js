var sys = require('sys')
var exec = require('child_process').exec;
var child;
var express = require("express");
var app = express();
var socket = require('socket.io');

app.configure(function() {
	app.use(express.static(__dirname + '/'));
});
var server = app.listen(3000);
console.log('Listening on port 3000');
var io = socket.listen(server);

io.sockets.on('connection', function(socket) {
	console.log("connnect");
	socket.on('disconnect', function(socket) {
		console.log("disconnect");
	});
	socket.emit("pong", {
		txt: "Connected to server"
	});
	socket.on('ping', function(data) {
		console.log(data.txt);
		var child = exec("gphoto2 --capture-image-and-download", function(error, stdout, stderr) {
			sys.print('stdout ' + stdout);
			sys.print('stderr: ' + stderr);
			if(error != null) {
				console.log('exec error:' + error);
				return false;
			}
			return true;
		});
		socket.emit("pong", {

			txt: "Tar bilde"

		});
	});
});