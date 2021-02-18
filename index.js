var express = require('express');
var app = express();
var http = require('http').createServer(app);

var handlebars = require('express-handlebars');

app.set('view engine', 'handlebars');

//Sets handlebars configurations (we will go through them later on)
app.engine('handlebars', handlebars({
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials/',
  defaultLayout: 'base',
  helpers: {
      // 👇 Importantly, define the helper as a regular `function`, _not_ an arrow-function.
      section(name, options) {
          if (!this._sections) {
              this._sections = {};
          }
          this._sections[name] = options.fn(this);
          return null;
      },
  },
}));

app.use('/js/', express.static('node_modules/paper/dist'));
app.use('/js/', express.static('node_modules/handlebars/dist'));

app.get('/controls', (req, res) => {
  //Serves the body of the page aka "main.handlebars" to the container //aka "index.handlebars"
  res.render('effects', {instruments: [1, 2, 3, 4, 5]});
});

app.use(express.static('public/'));

http.listen(3000, () => {
  console.log('listening on *:3000');
});
