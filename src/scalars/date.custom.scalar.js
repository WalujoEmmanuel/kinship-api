
const { GraphQLScalarType } =require('graphql');

const parse = (value) => {
  if ((value)) {
    return new Date(value);
  }
  throw new Error('DateTime cannot represent an invalid ISO-8601 Date string');
};

const serialize = (value) => {
  if ((value)) {
    return new Date(value);
  }
  throw new Error('DateTime cannot represent an invalid ISO-8601 Date string');
};

const parseLiteral = (ast) => {
  if ((ast.value)) {
    return new Date(ast.value);
  }
  throw new Error('DateTime cannot represent an invalid ISO-8601 Date string');
};

const DateScalar = new GraphQLScalarType({
  name: 'DateScalar',
  description: 'An ISO-8601 encoded UTC date string.',
  serialize: serialize,
  parseValue: parse,
  parseLiteral: parseLiteral,
});

module.exports={DateScalar}