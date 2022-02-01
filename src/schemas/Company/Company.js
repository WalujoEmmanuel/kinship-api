
const graphql = require('graphql');
const resolvers = require('../../resolvers/index');

const { GraphQLObjectType, GraphQLID, GraphQLString } = graphql;

const CompanyType = new GraphQLObjectType({
	name: 'Company',
	fields: () => ({
		id: { type: GraphQLID },
        name: { type: GraphQLString },
        location: { type: GraphQLString },
        address: { type: GraphQLString },
        tin: { type: GraphQLString },
        telephone: { type: GraphQLString },
        email: { type: GraphQLString },
        createddate: { type: GraphQLString },
        createdtime: { type: GraphQLString },
        createdby: { type: GraphQLString },
        modifieddate: { type: GraphQLString },
        modifiedtime: { type: GraphQLString },
        modifiedby: { type: GraphQLString }
	})
});

const CompanyInput = {
	id: { type: GraphQLID },
	name: { type: GraphQLString },
	location: { type: GraphQLString },
    address: { type: GraphQLString },
    tin: { type: GraphQLString },
	telephone: { type: GraphQLString },
	email: { type: GraphQLString },
    createddate: { type: GraphQLString },
    createdtime: { type: GraphQLString },
    createdby: { type: GraphQLString },
    modifieddate: { type: GraphQLString },
    modifiedtime: { type: GraphQLString },
    modifiedby: { type: GraphQLString }
}



const company = resolvers.getOne(CompanyType, 'pos.company', CompanyInput, 'id');

const companies = resolvers.getAll(CompanyType, 'pos.company');

const addCompany = resolvers.addOne(CompanyType, 'pos.company', CompanyInput);

const updateCompany = resolvers.updateOne(CompanyType, 'pos.company', CompanyInput, 'id');

const deleteCompany = resolvers.deleteOne(CompanyType, 'pos.company', CompanyInput, 'id');


module.exports = { CompanyType, company, companies, addCompany, updateCompany, deleteCompany };