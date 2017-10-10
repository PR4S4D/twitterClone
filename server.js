var express = require('express'); //require(): Loads an external module
var bodyParser = require('body-parser');
var morgan = require('morgan');

var app = express();

app.listen(9090, function(error) {
        if (error) {
        console.log(error);
    } else {
        console.log('Running on port 9090');
    }
});