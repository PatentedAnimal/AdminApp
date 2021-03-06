console.log("let's read the temperature of the CPU!")

var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);// we'll listen on the app's port
var fs = require('fs');

app.listen(8888);

var htmlPage = 'client.html';
function handler (req, res) {
  fs.readFile(htmlPage,
    function (err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading file: ' + htmlPage);
      }
      res.writeHead(200);
      res.end(data);
    });
} 

setInterval(readTemperature,2500)   

//Sensor Locations on the BeagleBone Black
var temperatureLocation = '/sys/devices/ocp.3/44e10448.bandgap/temp1_input';

// Reads temperature
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