import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

const UsernameAndEmail: GraphQLObjectType = new GraphQLObjectType({
  name: 'UsernameAndEmail',
  description: 'This represents a username and email',
  fields: () => {
    return {
      email: {
        type: GraphQLString,
        resolve(user: any) {
          return user.email;
        }
      },
      username: {
        type: GraphQLString,
        resolve(user: any) {
          return user.username;
        }
      },
    };
  }
});

export default UsernameAndEmail;
