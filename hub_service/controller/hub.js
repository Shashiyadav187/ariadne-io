
const WebSocket = require('ws');
const mongo = require("../model/mongo.js");
const url = require('url');
const net = require("net");

//const automation = require("./automation");
const gps = require("./gps");
const motor = require("./motor");

var ws;
var sensor = {};
const realTimeInterval = 3000;


var connect = function () {

  ws = new WebSocket('ws://www.rednightsky.com:8080');

  ws.on('open', function open() {
    console.log('Websocket connection open.');
  });

  ws.on('message', function incoming(data) {
    console.log(data);
  });

  ws.on('error', function(err) {
    console.log('error at web socket.');
    setTimeout(connect, 3000);
  });

  ws.on('close', () => {
    console.log('Websocket disconnected.');
  });

  ws.onclose = function() {
    console.log('Connection to external server closed.');
    setTimeout(connect, 3000);
  };
}

connect();

    setInterval(function() {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send( JSON.stringify( gps ) );
        ws.send( JSON.stringify( motor ) );
        console.log(gps);
        console.log(motor);
      };
    }, 1000);


    const sensorServer = net.createServer(function(socket) {
      socket.on("data", function(data) {

        try {
          sensor = JSON.parse(data);

          console.log(sensor);

          if (ws.readyState === WebSocket.OPEN) {
            ws.send( JSON.stringify( sensor ) );
          };

        } catch(err) {}

      })
    });

    sensorServer.listen(3215, '192.168.10.1');
