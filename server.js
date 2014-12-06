const docker     = require('docker-browser-console')
const wreq       = require('watchify-request')
const websocket  = require('websocket-stream')
const browserify = require('browserify')
const watchify   = require('watchify')
const course     = require('course')
const http       = require('http')
const path       = require('path')
const fs         = require('fs')
const ws         = require('ws')

const PORT = process.env.PORT || null

const wsServer = new ws.Server({ port: 10000 })
const server   = http.createServer()
const router   = course()
const bundle   = wreq(watchify(browserify({
    entries: [path.join(process.cwd(), 'index.js')]
  , fullPaths: true
  , packageCache: {}
  , cache: {}
})))

router.get('/', send('index.html'))
router.get('/bundle.js', bundle)

server.on('request', function(req, res) {
  router(req, res, function(err) {
    if (err) return res.end([err.message, err.stack].join('\n'))
    res.end('404: ' + req.url)
  })
})

server.listen(PORT, function() {
  var addr = server.address()
  console.log('http://' + addr.address + ':' + addr.port)
})

wsServer.on('connection', function(socket) {
  (socket = websocket(socket))
    .pipe(docker('nodesource/node'))
    .pipe(socket)
})

function send(file) {
  return function(req, res, next) {
    return fs
      .createReadStream(file)
      .pipe(res)
  }
}
