'use strict';

const User = require('../models/user_schema');

const createData = (req, res, next) => {
  User.create(req.body).then((err) => {
    if (err) {
      return next(err);
    }
    res.send('Entry created successfully!');
  });
};

const readData = (req, res, next) => {
  User.find({}, (err, user) => {
    if (err) {
      return next(err);
    }
    res.send(user);
  });
};

const updateData = (req, res, next) => {
  User.updateOne({ id: req.params.id }, { $set: req.body }, (err, user) => {
    if (err) {
      return next(err);
    }
    res.send(user);
  });
};

const deleteData = (req, res, next) => {
  User.deleteOne({ id: req.params.id }, (err, result) => {
    if (err) {
      return next(err);
    }
    res.send(result);
  });
};

module.exports = {
  createData,
  readData,
  updateData,
  deleteData,
};
