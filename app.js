var sys = require('sys')
var exec = require('child_process').exec;
var child;
 
var express = require('express');
var app = express();
 
app.listen(3000);
console.log('Listening on port 3000');
 
app.get('/', function(req, res){
    res.send('Hello World');
 
    child = exec("gphoto2 --capture-image", function(error, stdout, stderr){
        sys.print('stdout ' + stdout);
        sys.print('stderr: ' + stderr);
        if(error != null){
                console.log('exec error:' +error);
        }
    });
});