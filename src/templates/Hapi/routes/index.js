'use strict';
const {
  createData,
  readData,
  updateData,
  deleteData,
} = require('../controllers/user_controller');

const user = {
  name: 'user',
  version: '1.0.0',
  register: async function (server) {
    server.route({
      method: 'POST',
      path: '/',
      handler: createData,
    });

    server.route({
      method: 'GET',
      path: '/',
      handler: readData,
    });

    server.route({
      method: 'PUT',
      path: '/{id}',
      handler: updateData,
    });

    server.route({
      method: 'DELETE',
      path: '/{id}',
      handler: deleteData,
    });
  },
};

exports.plugin = user;
