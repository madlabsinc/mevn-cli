'use strict';
const path = require('path');
const hapi = require('@hapi/hapi');

// parse env variables
require('dotenv').config();

// Configuring port
const port = process.env.PORT || 9000;

const init = async () => {
  const server = hapi.server({
    port,
    host: 'localhost',
    routes: {
      cors: true,
    },
  });

  await server.register(require('@hapi/inert'));
  await server.register(require('./routes/api'), {
    routes: { prefix: '/api' },
  });

  // route to serve files from a assets directory
  server.route({
    method: 'GET',
    path: '/assets/{file*}',
    handler: {
      directory: {
        path: path.join(__dirname, '/views/assets'),
      },
    },
  });

  await server.start();
  console.log(`Listening On http://localhost:${port}/api`);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
