var http = require('http'),
  express = require('express'),
  jade = require('jade');

var routes = require('./routes');

var app = module.exports.app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(express.favicon());
app.use(express.logger());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

app.get('/', routes.index)

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
