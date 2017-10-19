var rootDirectory = process.env.PWD;
var User = require( '../models/user');

var config = require('../../config');

var secretKey = config.secretKey;

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

	return api;

}