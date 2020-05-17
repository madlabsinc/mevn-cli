const { GraphQLSchema, GraphQLObjectType, GraphQLString } = require("graphql");

// GraphQL schema
const graphqlSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
      message: {
        type: GraphQLString,
        resolve() {
          return "Root resolver";
        },
      },
    },
  }),
});

module.exports = graphqlSchema;
