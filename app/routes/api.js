var rootDirectory = process.env.PWD;
var User = require( '../models/user');

var config = require('../../config');

var secretKey = config.secretKey;

var jsonwebtoken = require('jsonwebtoken');

function createToken(user) {
    var token = jsonwebtoken.sign({
        _id: user._id,
        name: user.name,
        username: user.username
    }, secretKey, {
        expiresIn: 60 * 60 * 24
    });

    return token;
}

module.exports = function(app,express) {
	
	var api = express.Router();

	api.post('/signup', function(req,res){ //post api
		console.log(req.body.name);
		var user = new User({
			name : req.body.name,
			username : req.body.username,
			password : req.body.password
		});

		user.save(function(error){
			if(error){
				console.log(error);	
				res.send(error);
				return;
			}

			res.json({message : "User has been created!"});
		});
	});

	api.get('/users', function(req,res){
		User.find({},function(error,users) {
			if(error){
				res.send(error);
				return;
			}

			res.json(users);
		});
	});

    api.post('/login', function(req, res) {
        User.findOne({
            username: req.body.username
        }).select('password').exec(function(error, user) {
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

	return api;

}