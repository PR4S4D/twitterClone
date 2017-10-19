var express = require('express'); //require(): Loads an external module
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('./config');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

mongoose.connect(config.database, function(error) {
    if (error) {
        console.log(error);
    } else {
        console.log('Connected to the database');
    }
})

var app = express();

app.use(bodyParser.urlencoded({
    extended: true
})); // false will parse only string
app.use(bodyParser.json());
app.use(morgan('dev'));

var api = require('./app/routes/api')(app,express);
app.use('/api',api);


app.get('*', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.listen(config.port, function(error) {
    if (error) {
        console.log(error);
    } else {
        console.log('Running on port ' + config.port);
    }
});