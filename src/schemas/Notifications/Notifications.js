const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList } = graphql;
const resolvers = require("../../resolvers/index");

const queries = require('../../services')

const NotificationType = new GraphQLObjectType({
    name: "Notification",
    fields: () => ({
        notification_id: { type: GraphQLInt },
        notification_icon: { type: GraphQLString },
        notification_type: { type: GraphQLString },
        notification_type_id: { type: GraphQLInt },
        notification_title: { type: GraphQLString },
        notification_body: { type: GraphQLString },
        createddate: { type: GraphQLString },
        createdtime: { type: GraphQLString },
        createdby: { type: GraphQLString },
        modifieddate: { type: GraphQLString },
        modifiedtime: { type: GraphQLString },
        modifiedby: { type: GraphQLString }
    }),
});

const NotificationInput = {
    notification_id: { type: GraphQLInt },
    notification_icon: { type: GraphQLString },
    notification_type: { type: GraphQLString },
    notification_type_id: { type: GraphQLInt },
    notification_title: { type: GraphQLString },
    notification_body: { type: GraphQLString },
    createddate: { type: GraphQLString },
    createdtime: { type: GraphQLString },
    createdby: { type: GraphQLString },
    modifieddate: { type: GraphQLString },
    modifiedtime: { type: GraphQLString },
    modifiedby: { type: GraphQLString }
};


const userNotifications = {
    type: new GraphQLList(NotificationType),
    args: NotificationInput,
    async resolve(parent, args){

        let userNotifications = []

        if (args.USER_ID) {

            const allNotifications = await queries.getAll("pos.notifications");

            return allNotifications
        }

        return userNotifications;
    }
}

const notification = resolvers.getOne(NotificationType, "pos.notifications", NotificationInput, "notification_id");
const notifications = resolvers.getAll(NotificationType, "pos.notifications");
const addNotification = resolvers.addOne(NotificationType, "pos.notifications", NotificationInput);
const updateNotification = resolvers.updateOne(NotificationType, "pos.notifications", NotificationInput, "notification_id");
const deleteNotification = resolvers.deleteOne(NotificationType, "pos.notifications", NotificationInput, "notification_id");

module.exports = { NotificationType, notification, notifications, userNotifications, addNotification, updateNotification, deleteNotification };