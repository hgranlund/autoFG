// variabler:
var album = 'digfe'
var page = 1;
var image_number = 1;



var sys = require('sys');
var exec = require('child_process').exec;
var child;
var express = require("express");
var nodemailer = require("nodemailer");
var TwoStep = require('twostep');
var app = express();
var socket = require('socket.io');

var transport = nodemailer.createTransport("SMTP", {
	service: "Gmail",
	auth: {
		user: "samfundet.fotostand@gmail.com",
		pass: "Nikond100"
	}
});

app.configure(function() {
	app.use(express.static(__dirname + '/'));
});
var server = app.listen(3000);
console.log('Listening on port 3000');
var io = socket.listen(server);


io.sockets.on('connection', function(socket) {
	var mail;
	var imgPath;
	console.log('connected to client');
	var recordImg = function(path_from_img, path, name) {
			var command = "gphoto2 --capture-image-and-download && mv " + path_from_img +" "+ path+name + " && convert " + path + name + " -geometry 1000x " + path + "scaled/" + name;
			console.log(command);
			return exec(command, function(error, stdout, stderr) {
				sys.print('stdout ' + stdout);
				sys.print('stderr: ' + stderr);
				return function() {
					var mailOptions = {
						from: "Fotogjengen ved Studentersamfundet i Trondhjem",
						to: mail,
						subject: "Her er bildet ditt fra Fotogjengen ved Studentersamfundet i Trondhjems fotostand!",
						body: " Vil du ha en papirkopi.... bla bla",
						attachments: [{
							'filePath': imgPath
						}]
					};
					transport.sendMail(mailOptions);
					console.log("mail sent to " + mail);
					socket.emit('image_taken',{'imgPath': imgPath});
				}();
			});
		};


	var get_image_name = function() {
			var imgName = album;
			image_number++;

			if(image_number >= 99) {
				page++;
				image_number = 1;
			}
			if(page > 9) {
				imgName += page;
			} else {
				imgName += '0' + page;
			}
			if(image_number > 9) {
				imgName += image_number;
			} else {
				imgName += '0' + image_number;
			}

			return imgName + '.jpg';
		};

	var is_mail = function(mail) {
			//TODO impl
			return true;
		};

	socket.on('ping', function(data) {
		console.log(data);
		var img_name = get_image_name();
		if(is_mail(data)) {
			mail = data;
			var path = "image/";
			imgPath = path + "scaled/" + img_name;
			recordImg("capt0000.jpg", path, img_name);
		}

	});
});