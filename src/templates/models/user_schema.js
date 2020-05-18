const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  id: {
    type: Number,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: [true, "name field is required"],
  },
  age: {
    type: Number,
    required: [true, "age field is required"],
  },
});

module.exports = model("users", userSchema);