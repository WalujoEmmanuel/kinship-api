const graphql = require('graphql');
const queries = require('../../services');
const resolvers = require('../../resolvers/index');
// const { UserTypes } = require('../UserTypes/UserTypes');

const { GraphQLObjectType, GraphQLList, GraphQLString, GraphQLInt } = graphql;

const UsersType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        user_id: { type: GraphQLInt },
        user_name: { type: GraphQLString },
        passwd: { type: GraphQLString },
        email: { type: GraphQLString },
        phone_number: { type: GraphQLString },
        fullname: { type: GraphQLString },
        // user_type: {
        //     type: GraphQLList(UserTypes),
        //     resolve(parent, args, context) {
        //         return queries.getMany('pos.user_types', 'user_type_id', parent.user_type_id);
        //     }
        // },
        createddate: { type: GraphQLString },
        createdtime: { type: GraphQLString },
        createdby: { type: GraphQLString },
        modifieddate: { type: GraphQLString },
        modifiedtime: { type: GraphQLString },
        modifiedby: { type: GraphQLString },
    })
});

const UsersInput = {
    user_id: { type: GraphQLInt },
    user_name: { type: GraphQLString },
    passwd: { type: GraphQLString },
    email: { type: GraphQLString },
    phone_number: { type: GraphQLString },
    fullname: { type: GraphQLString },
    createddate: { type: GraphQLString },
    createdtime: { type: GraphQLString },
    createdby: { type: GraphQLString },
    modifieddate: { type: GraphQLString },
    modifiedtime: { type: GraphQLString },
    modifiedby: { type: GraphQLString },
}

const userExists = {
    type: UsersType,
    args: UsersInput,
    async resolve(parent, args){
        let whereUsername = {};
        let whereEmail = {};

        if (args['user_name'] !== '') {
            whereUsername = await queries.getOne('pos.users', 'user_name', args['user_name'])
        }

        if (args['email'] !== '') {
            whereEmail = await queries.getOne('pos.users', 'email', args['email'])
        }

        if (whereUsername && whereEmail && whereUsername.user_id === whereEmail.user_id) {
            return whereUsername
        } else if (whereUsername && whereEmail && whereUsername.user_id !== whereEmail.user_id) {
            return null; 
        }else {
            return {
                ...whereUsername,
                ...whereEmail
            }
        }
    }
}

const user = resolvers.getOne(UsersType, 'pos.users', UsersInput, 'user_id');
const users = resolvers.getAll(UsersType, 'pos.users');
const addUser = resolvers.addOne(UsersType, 'pos.users', UsersInput);
const updateUser = resolvers.updateOne(UsersType, 'pos.users', UsersInput, 'user_id');
const deleteUser = resolvers.deleteOne(UsersType, 'pos.users', UsersInput, 'user_id');

module.exports = { UsersType, user, users, userExists, addUser, updateUser, deleteUser }
