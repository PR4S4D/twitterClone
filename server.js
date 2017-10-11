var express = require('express'); //require(): Loads an external module
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('./config');

var app = express();

app.listen(config.port, function(error) {
    if (error) {
        console.log(error);
    } else {
        console.log('Running on port '+config.port);
    }
});