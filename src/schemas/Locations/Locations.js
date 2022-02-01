const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLInt } = graphql;
const resolvers = require("../../resolvers/index");

const LocationType = new GraphQLObjectType({
    name: "Location",
    fields: () => ({
        location_id: { type: GraphQLInt },
        location_name: { type: GraphQLString },
        createddate: { type: GraphQLString },
        createdtime: { type: GraphQLString },
        createdby: { type: GraphQLString },
        modifieddate: { type: GraphQLString },
        modifiedtime: { type: GraphQLString },
        modifiedby: { type: GraphQLString }
    }),
});

const LocationInput = {
    location_id: { type: GraphQLInt },
    location_name: { type: GraphQLString },
    createddate: { type: GraphQLString },
    createdtime: { type: GraphQLString },
    createdby: { type: GraphQLString },
    modifieddate: { type: GraphQLString },
    modifiedtime: { type: GraphQLString },
    modifiedby: { type: GraphQLString }
};


const location = resolvers.getOne(LocationType, "pos.locations", LocationInput, "location_id");
const locations = resolvers.getAll(LocationType, "pos.locations");
const addLocation = resolvers.addOne(LocationType, "pos.locations", LocationInput);
const updateLocation = resolvers.updateOne(LocationType, "pos.locations", LocationInput, "location_id");
const deleteLocation = resolvers.deleteOne(LocationType, "pos.locations", LocationInput, "location_id");

module.exports = { LocationType, location, locations, addLocation, updateLocation, deleteLocation };