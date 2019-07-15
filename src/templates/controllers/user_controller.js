'use strict';

import User from '../models/user_schema';

let createData = (req, res, next) => {
  User.create(req.body).then(err => {
    if (err) {
      return next(err);
    }
    res.send('Entry created successfully!');
  });
};

let readData = (req, res, next) => {
  User.find({}, '', (err, user) => {
    if (err) {
      return next(err);
    }
    res.send(user);
  });
};

let updateData = (req, res, next) => {
  User.findByIdAndUpdate(req.params.id, { $set: req.body }, (err, user) => {
    if (err) {
      return next(err);
    }
    res.send(user);
  });
};

let deleteData = (req, res, next) => {
  User.findByIdAndRemove(req.params.id, err => {
    if (err) {
      return next(err);
    }
    res.send('Entry deleted successfully!');
  });
};

module.exports = {
  createData,
  readData,
  updateData,
  deleteData,
};
