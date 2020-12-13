const express = require('express')
const path = require('path')
const app = express()
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const { spawn } = require('child_process');

const port = 3000

app.use(express.static(path.resolve('public')));

io.on('connection', (socket) => {
  const ffmpeg = spawn('ffmpeg -re -i pipe:0 -acodec aac -strict -2 -f flv rtmp://localhost/show/stream', {shell: true});
  console.log('connected');
  socket.on('stream-video-chunk', function(chunk) {
    ffmpeg.stdin.write(chunk);
  })

  socket.on('disconnect', () => {
    ffmpeg.stdin.end();
    ffmpeg.stdout.destroy();
    ffmpeg.stderr.destroy();
  });
});

http.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})