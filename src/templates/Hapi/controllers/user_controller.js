'use strict';
const User = require('../models/user_schema');

const createData = async (request, reply) => {
  try {
    const user = await User.create(request.payload);
    return reply.response(user).code(201);
  } catch (err) {
    return reply.response(err.message).code(500);
  }
};

const readData = async (request, reply) => {
  try {
    const users = await User.find();
    return reply.response(users).code(200);
  } catch (err) {
    return reply.response(err.message).code(500);
  }
};

const updateData = async (request, reply) => {
  try {
    const user = await User.findByIdAndUpdate(
      request.params.id,
      request.payload,
      {
        useFindAndModify: false,
        new: true,
      },
    );
    return reply.response(user).code(201);
  } catch (err) {
    return reply.response(err.message).code(500);
  }
};

const deleteData = async (request, reply) => {
  try {
    const user = await User.findById(request.params.id);

    if (!user) {
      return reply.response('User not available').code(400);
    } else {
      await user.remove();
      return reply.response(user).code(200);
    }
  } catch (err) {
    return reply.response(err.message).code(500);
  }
};

module.exports = {
  createData,
  readData,
  updateData,
  deleteData,
};
