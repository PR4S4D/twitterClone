var express = require('express'); //require(): Loads an external module
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('./config');

var app = express();

app.use(bodyParser.urlencoded({
    extended: true
})); // false will parse only string
app.use(bodyParser.json());
app.use(morgan('dev'));


app.get('/hello', function(req, res) {
    console.log(__dirname);
    res.sendFile(__dirname + '/index.html');
});

app.listen(config.port, function(error) {
    if (error) {
        console.log(error);
    } else {
        console.log('Running on port ' + config.port);
    }
});