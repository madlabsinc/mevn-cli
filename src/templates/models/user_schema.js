import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const Schema = mongoose.Schema;

let userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
});

let userAuth = new mongoose.Schema({
  email: String,
  username: String,
  password: String,
  oauthID: Number,
});

userAuth.plugin(passportLocalMongoose);

let User = mongoose.model('userModel', userSchema);
let UserAuth = mongoose.model('userAuthModel', userAuth);

Object.assign(exports, {
  User,
  UserAuth,
});
