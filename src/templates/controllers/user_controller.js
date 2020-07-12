'use strict';

const User = require('../models/user_schema');

const createData = (req, res) => {
  User.create(req.body)
    .then((data) => {
      console.log('New User Created!', data);
      res.status(201).json(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        console.error('Error Validating!', err);
        res.status(422).json(err);
      } else {
        console.error(err);
        res.status(500).json(err);
      }
    });
};

const readData = (req, res) => {
  User.find()
    .then((data) => {
      console.log('Data found: ', data);
      res.status(200).json(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        console.error('Error Validating!', err);
        res.status(422).json(err);
      } else {
        console.error(err);
        res.status(500).json(err);
      }
    });
};

const updateData = (req, res) => {
  User.updateOne(req.body)
    .then((data) => {
      console.log('User updated!', data);
      res.status(201).json(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        console.error('Error Validating!', err);
        res.status(422).json(err);
      } else {
        console.error(err);
        res.status(500).json(err);
      }
    });
};

const deleteData = (req, res) => {
  User.findById(req.params.id)
    .then((data) => {
      if (!data) {
        throw new Error('User not available');
      } else {
        console.log('User removed!', data);
        res.status(200).json(data);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
};

module.exports = {
  createData,
  readData,
  updateData,
  deleteData,
};
