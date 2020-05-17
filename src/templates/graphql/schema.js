const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull,
} = require("graphql");

const UserSchema = require("../models/user_schema");

const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
    }),
});

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "RootQueryType",
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
        name: "RootMutationType",
        fields: {
            addUser: {
                type: UserType,
                args: {
                    id: { type: new GraphQLNonNull(GraphQLID) },
                    name: { type: new GraphQLNonNull(GraphQLString) },
                    age: { type: new GraphQLNonNull(GraphQLInt) },
                },
                resolve(parent, args) {
                    return UserSchema.create(args);
                },
            },
            updateUser: {
                type: UserType,
                args: {
                    id: { type: new GraphQLNonNull(GraphQLID) },
                    name: { type: new GraphQLNonNull(GraphQLString) },
                    age: { type: new GraphQLNonNull(GraphQLInt) },
                },
                resolve(parent, args) {
                    return UserSchema.updateOne({ id: args.id }, { $set: args });
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
