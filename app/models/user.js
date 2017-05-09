var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({

    account            : {
        email        : String,
        password     : String,
        facebook_id  : String,
        facebook_token: String,
        name         : String,
        twitter_id   : String,
        twitter_username: String,
        twitter_token:  String,
        google_id    : String,
        google_token: String
    },
   files: [
      {
         file_id: mongoose.Schema.Types.ObjectId,
         name: String,
      }
   ]
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.account.password);
};

module.exports = mongoose.model('User', userSchema);
