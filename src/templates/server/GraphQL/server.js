const express = require("express");
const graphQLHttp = require("express-graphql");
const schema = require("./graphql/schema");
const cors = require("cors");
const app = express();

require('dotenv').config();

app.use(cors());

app.use(
  "/graphql",
  graphQLHttp({
    schema,
    graphiql: true,
  })
);

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Listening on localhost:${PORT}/graphql`);
});
