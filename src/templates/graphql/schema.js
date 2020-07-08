const {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = require('graphql');

const UserSchema = require('../models/user_schema');

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
  }),
});

const UserInputType = new GraphQLInputObjectType({
  name: 'UserInput',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
  }),
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      users: {
        type: new GraphQLList(UserType),
        resolve() {
          return UserSchema.find({});
        },
      },
      user: {
        type: UserType,
        args: {
          id: {
            type: GraphQLID,
          },
        },
        resolve(parent, args) {
          return UserSchema.findOne({ id: args.id });
        },
      },
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'RootMutationType',
    fields: {
      addUser: {
        type: UserType,
        args: {
          input: {
            type: new GraphQLNonNull(UserInputType),
          },
        },
        resolve(parent, { input }) {
          return UserSchema.create(input);
        },
      },
      updateUser: {
        type: UserType,
        args: {
          input: {
            type: new GraphQLNonNull(UserInputType),
          },
        },
        resolve(parent, { input }) {
          return UserSchema.updateOne({ id: input.id }, { $set: input });
        },
      },
      deleteUser: {
        type: UserType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve(parent, { id }) {
          return UserSchema.deleteOne({ id });
        },
      },
    },
  }),
});

module.exports = schema;
