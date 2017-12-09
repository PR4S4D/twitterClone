var rootDirectory = process.env.PWD;
var User = require('../models/user');
var Tweet = require('../models/tweet');

var config = require('../../config');

var secretKey = config.secretKey;

var jsonwebtoken = require('jsonwebtoken');

function createToken(user) {
    var token = jsonwebtoken.sign({
        id: user._id,
        name: user.name,
        username: user.username
    }, secretKey, {
        expiresIn: 60 * 60 * 24
    });
    console.log('Token :' +token);
    return token;
}

module.exports = function(app, express) {

    var api = express.Router();

    api.post('/signup', function(req, res) { //post api
        console.log(req.body.name);
        var user = new User({
            name: req.body.name,
            username: req.body.username,
            password: req.body.password
        });

        var token = createToken(user);
        console.log('token '+token);

        user.save(function(error) {
            if (error) {
                console.log(error);
                res.send(error);
                return;
            }

            res.json({
                success: true,
                message: "User has been created!",
                token: token
            });
        });
    });

    api.get('/users', function(req, res) {
        User.find({}, function(error, users) {
            if (error) {
                res.send(error);
                return;
            }

            res.json(users);
        });
    });

    api.post('/login', function(req, res) {
        User.findOne({
            username: req.body.username
        }).select('name username password').exec(function(error, user) {
            if (error) {
                throw error;
            }

            if (!user) {
                res.send({
                    message: "user doesn't exist"
                });
            } else if (user) {
                var validPassword = user.comparePassword(req.body.password);
                if (!validPassword) {
                    res.send({
                        message: "Invalid password"
                    });
                } else {
                    var token = createToken(user);
                    res.json({
                        success: true,
                        message: "login Success!",
                        token: token
                    });
                }
            }
        });
    });

    //https://stackoverflow.com/questions/11321635/nodejs-express-what-is-app-use
    api.use(function(req, res, next) {
        console.log("Someone visited the website!");
        var token = req.body.token || req.params.token || req.headers['x-access-token'];
        console.log('token  '+token);
        // check if token exists
        if (token) {
            jsonwebtoken.verify(token, secretKey, function(error, decoded) {

                if (error) {
                    res.status(403).send({
                        success: false,
                        message: "Failed to authenticate user"
                    });
                } else {
                    req.decoded = decoded;
                }

                next();
            });
        } else {
            res.status(403).send({
                success: false,
                message: "No token provided!"
            });
        }
    });

    api.route('/')
        .post(function(req, res) {
            console.log('Decoded Request :' + req.decoded);
            var tweet = new Tweet({
                tweeter: req.decoded.id,
                tweet: req.body.tweet,
            });

            tweet.save(function(error) {
                if (error) {

                    res.send(error);
                    return;
                }

                res.json({
                    message: "New tweet created"
                });

            })

        })
        .get(function(req, res) {
            Tweet.find({
                tweeter: req.decoded.id
            }, function(error, tweets) {
                if (error) {
                    res.send(error);
                    return;
                }

                res.json(tweets);
            });
        });

        api.get('/me',function(req,res){
            res.json(req.decoded);
        });

    return api;
}