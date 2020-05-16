// Importing required modules
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
// const mongoose = require("mongoose");

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

/* Uncomment these lines once you have the CRUD template
mongoose.connect(process.env.DB_URL).catch((err) => {
  console.error("eror: " + err.stack);
  process.exit(1);
});
mongoose.connection.on("open", () => {
  console.log("connected to database");
});
mongoose.Promise = global.Promise;
*/

// Listening to port
app.listen(port);
console.log(`Listening On http://localhost:${port}/api`);

module.exports = app;
