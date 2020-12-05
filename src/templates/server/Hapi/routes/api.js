'use strict';

const home = {
  name: 'home',
  version: '1.0.0',
  register: async function (server) {
    server.route({
      method: 'GET',
      path: '/',
      handler: function (request, h) {
        return h.file('./views/index.html');
      },
    });
  },
};

exports.plugin = home;
