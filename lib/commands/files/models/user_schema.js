import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let userSchema = new Schema({ 
   
  name: { 
    type: String,
    required: [true, 'Name is required']  
  }
  
});

let User = mongoose.model('userModel' , userSchema);
module.exports = User;