// Importing required modules
const cors = require("cors");
const express = require("express");

// Configuring port
const port = process.env.PORT || 9000;

const app = express();

// Configure middlewares
app.use(cors());

app.set("view engine", "html");

// Static folder
app.use(express.static(__dirname + "/views/"));

// Listening to port
app.listen(port);
console.log(`Listening On http://localhost:${port}/api`);

module.exports = app;
