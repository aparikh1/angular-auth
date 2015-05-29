var mongoose = require('mongoose');
var crypto = require('crypto')
mongoose.connect('mongodb://localhost/auth');
mongoose.connection.on('error', console.error.bind(console, 'database connection error:'));

var saltBuffer = crypto.randomBytes(16),
    salt = saltBuffer.toString('base64');

var userSchema = mongoose.Schema({
	username: String,
	hashedPassword: String,
	role: String,
	salt: { type: String, default: function () { return salt }}
});

userSchema
    .virtual('password')
    .set(function (plaintext) {
        this.hashedPassword = crypto.pbkdf2Sync(plaintext, this.salt, 0, 64).toString('base64');
    });


module.exports = mongoose.model('User', userSchema);