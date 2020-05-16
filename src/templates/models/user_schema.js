const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  id: {
    type: Number,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  age: {
    type: String,
    required: [true, "Name is required"],
  },
});

module.exports = model("users", userSchema);