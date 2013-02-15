var sys = require('sys');
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
	console.log('connected to client');
	var recordImg = function(path_from_img, path_to_img, path, name) {
			var command = "gphoto2 --capture-image-and-download && mv "+ path_from_img+" "+ path_to_img+" && convert " + path + name + " -geometry 1000x " + path + "scaled/" + name;
			console.log(command);

			var child = exec(command, function(error, stdout, stderr) {
				sys.print('stdout ' + stdout);
				sys.print('stderr: ' + stderr);
				if(error != null) {
					console.log('exec error:' + error);
					return false;
				}
				return true;
			});
		};

	var get_image_name= function(){
		// TODO : impl
		return "tempName.jpg";
	};

	socket.on('ping', function(data) {
		console.log(data.txt);
		var img_name=get_image_name();
		recordImg("capt0000.jpg", "image/"+img_name, "image/", img_name);
	});
});

// var transport = nodemailer.createTransport("SMTP", {
// 	service: "Gmail",
// 	auth: {
// 		user: "samfundet.fotostand@gmail.com",
// 		pass: "Nikond100"
// 	}
// });

// var mailOptions = {
// 	from: "Fotogjengen ved Studentersamfundet i Trondhjem",
// 	to: "str3sses@gmail.com",
// 	subject: "Her er bildet ditt fra Fotogjengen ved Studentersamfundet i Trondhjems fotostand!",
// 	body: " Vil du ha en papirkopi.... bla bla",
// 	attachments: [{'filePath' : 'img/capt0001.jpg'}]
// };

// transport.sendMail(mailOptions);