#!/usr/bin/env node

var http = require('http'),
  express = require('express'),
  less = require('less-middleware'),
  path = require('path'),
  AWS = require('aws-sdk');

AWS.config.loadFromPath('config/aws.json');

var routes = require('./routes'),
  story = require('./routes/story');

var app = module.exports.app = express();
var bootstrapPath = path.join(__dirname, 'node_modules', 'bootstrap');

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(express.favicon());
app.use('/img', express.static(path.join(bootstrapPath, 'img')));
app.use(less({
    src    : path.join(__dirname, 'assets', 'less'),
    paths  : [path.join(bootstrapPath, 'less')],
    dest   : path.join(__dirname, 'public', 'stylesheets'),
    prefix : '/stylesheets'
  }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.logger());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/s', story.featured);
app.get('/s/:id', story.show);

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
