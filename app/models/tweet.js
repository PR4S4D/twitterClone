var mongoose = require("mongoose");

var schema = mongoose.schema;

var TweetSchema = new Schema({

	tweeter : { type : Schema.Types.ObjectId, ref : 'User'},
	tweet : String,
	created : {type :Date, default : Date.now}

});

module.exports = mongoose.model('Tweet', TweetSchema);