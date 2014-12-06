var docker = require('docker-browser-console')
var websocket = require('websocket-stream')

var terminal = docker()

terminal
  .pipe(websocket('ws://'+window.location.hostname+':10000'))
  .pipe(terminal)
  .appendTo('#terminal')
