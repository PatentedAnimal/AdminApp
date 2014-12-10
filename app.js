console.log("let's read the temperature of the CPU!")

var io = require('socket.io');
var fs = require('fs');

var finalhandler = require('finalhandler');
var http = require('http');
var serveStatic = require('serve-static');

//  Serve up the root folder
var serve = serveStatic('.', { 'index': ['index.html', 'index.htm'] });

//  Create the server
var server = http.createServer(function (req, res) {
    var done = finalhandler(req, res)
    //console.log("Requested: " + req.url)
    serve(req, res, done)
})

//  Listen
server.listen(8888)

//  Start up socket connection
var io = require('socket.io').listen(server);

//  Set up timer to push temperature to clients
setInterval(readTemperature, 2500)

//  Sensor Locations on the BeagleBone Black
var temperatureLocation = '/sys/devices/ocp.3/44e10448.bandgap/temp1_input';

//  Reads temperature
function readTemperature(){
    //console.log("Reading temperature")
    fs.readFile(temperatureLocation, function read(err, data) {
        if (err) {
            throw err;
        }
        sendTemperature(parseInt(data)/1000);
    });
}

// Prints Temperature
function sendTemperature(x) {
    console.log("Sending temperature: "+x)
    io.sockets.emit('temperature', '{"temperature":"'+x+'"}');
}