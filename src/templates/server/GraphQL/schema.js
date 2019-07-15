const { buildSchema } = require('graphql');

// GraphQL schema
let graphqlSchema = buildSchema(`
    type Query {
        message: String
    }
`);

module.exports = graphqlSchema;