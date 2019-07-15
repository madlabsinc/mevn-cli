const express = require('express');
const graphQLHttp = require('express-graphql');
const schema = require('./schema');
const cors = require('cors');
const app = express();

app.use(cors());

// Root resolver
let root = {
  message: () => 'Root resolver'
};

app.use('/graphql', graphQLHttp({
    schema,
    rootValue: root,
    graphiql: true
}));

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    console.log(`Listening on localhost:${PORT}/graphql`);
});
