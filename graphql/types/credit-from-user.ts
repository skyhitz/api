import { GraphQLObjectType, GraphQLInt } from 'graphql';

const CreditFromUser: GraphQLObjectType = new GraphQLObjectType({
  name: 'CreditFromUser',
  description: 'Entry Credit',
  fields: () => ({
    credits: {
      type: GraphQLInt,
      description: 'Count of entry credits'
    }
  })
});

export default CreditFromUser;
