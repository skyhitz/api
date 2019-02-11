import { GraphQLObjectType, GraphQLBoolean, GraphQLInt } from 'graphql';

export const PaymentsInfoObject: GraphQLObjectType = new GraphQLObjectType({
  name: 'PaymentsInfoObject',
  description: 'Payments info object',
  fields: () => {
    return {
      subscribed: {
        type: GraphQLBoolean,
        resolve(paymentsInfo: any) {
          return paymentsInfo.subscribed;
        }
      },
      credits: {
        type: GraphQLInt,
        resolve(paymentsInfo: any) {
          return paymentsInfo.credits;
        }
      }
    };
  }
});
