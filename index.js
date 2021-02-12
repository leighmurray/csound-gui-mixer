var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);


app.use('/js/', express.static('node_modules/paper/dist'));
app.use(express.static('public/'));

io.on('connection', (socket) => {

});

http.listen(3000, () => {
  console.log('listening on *:3000');
});