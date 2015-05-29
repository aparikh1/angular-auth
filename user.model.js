var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/auth');
mongoose.connection.on('error', console.error.bind(console, 'database connection error:'));

var userSchema = mongoose.Schema({
	username: String,
	password: String
});

module.exports = mongoose.model('User', userSchema);