// Importing required modules
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");

// parse env variables
require("dotenv").config();

// Configuring port
const port = process.env.PORT || 9000;

const app = express();

// Configure middlewares
app.use(bodyParser.json());
app.use(cors());

app.set("view engine", "html");

// Static folder
app.use(express.static(__dirname + "/views/"));

// Defining route middleware
app.use('/api', require('./routes/api'));

// Listening to port
app.listen(port);
console.log(`Listening On http://localhost:${port}/api`);

module.exports = app;
