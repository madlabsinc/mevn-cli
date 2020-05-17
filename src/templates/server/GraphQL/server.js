const express = require("express");
const graphQLHttp = require("express-graphql");
const schema = require("./graphql/schema");
const cors = require("cors");
const app = express();
// const mongoose = require("mongoose");

app.use(cors());

app.use(
  "/graphql",
  graphQLHttp({
    schema,
    graphiql: true,
  })
);

/*
mongoose.connect(process.env.DB_URL).catch((err) => {
  console.error("eror: " + err.stack);
  process.exit(1);
});
mongoose.connection.on("open", () => {
  console.log("connected to database");
});
mongoose.Promise = global.Promise;
*/

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Listening on localhost:${PORT}/graphql`);
});
