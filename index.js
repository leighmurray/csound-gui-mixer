var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var handlebars = require('express-handlebars');

app.set('view engine', 'handlebars');

//Sets handlebars configurations (we will go through them later on)
app.engine('handlebars', handlebars({
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials/',
  defaultLayout: 'base',
}));

app.use('/js/', express.static('node_modules/paper/dist'));
app.use('/js/', express.static('node_modules/handlebars/dist'));

app.get('/', (req, res) => {
  //Serves the body of the page aka "main.handlebars" to the container //aka "index.handlebars"
  res.render('effects', {instruments: [1, 2, 3, 4, 5]});
});

app.use(express.static('public/'));

io.on('connection', (socket) => {

});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
