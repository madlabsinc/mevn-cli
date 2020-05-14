// Importing required modules
const cors = require('cors');
const express = require('express');
const path = require('path');

// Configuring port
const port = process.env.PORT || 9000;

const app = express();

// Configure middlewares
app.use(cors());

app.set('view engine', 'html');

// Static folder
app.use(express.static(__dirname + '/views/'));

// Defining the Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Listening to port
app.listen(port);
console.log(`Listening On http://localhost:${port}`);

module.exports = app;
