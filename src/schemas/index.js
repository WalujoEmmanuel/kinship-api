const graphql = require('graphql');
const { GraphQLSchema, GraphQLObjectType, GraphQLString } = graphql;

// ADMINISTRATION AND SECURITY
const { user, users, userExists, addUser, updateUser, deleteUser } = require('./Users/Users');
const { userLogin, userRecoverPassword, userResetPassword, refreshToken, blacklistToken } = require('./Auth/Auth');
const { notification, notifications, userNotifications, addNotification, updateNotification, deleteNotification } = require('./Notifications/Notifications');
const { company, companies, addCompany, updateCompany, deleteCompany } = require('./Company/Company');

// MASTERS
const {  location, locations, addLocation, updateLocation, deleteLocation } = require('./Locations/Locations');

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        
        // API VERSION
        welcomeMessage: {
            type: GraphQLString,
            resolve() {
                return 'Welcome to Kinship API Version 1.0';
            },
        },

        // ADMINISTRATION AND SECURITY QUERIES        
        user, users, userExists,
        notification, notifications,
        company, companies,

        // MASTERS QUERIES
        location, locations,
        
    }
});

const RootMutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {

        // ADMINISTRATION AND SECURITY MUTATIONS
        userLogin, userRecoverPassword, userResetPassword,
        refreshToken, blacklistToken,
        addUser, updateUser, deleteUser,
        userNotifications, addNotification, updateNotification, deleteNotification,
        addCompany, updateCompany, deleteCompany,

        // MASTERS MUTATIONS
        addLocation, updateLocation, deleteLocation,      

    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation
})