import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean
} from 'graphql';

import Entry from './entry';

const User: GraphQLObjectType = new GraphQLObjectType({
  name: 'User',
  description: 'This represents a User',
  fields: () => {
    return {
      avatarUrl: {
        type: GraphQLString,
        resolve(user: any) {
          return user.avatarUrl;
        }
      },
      bannerUrl: {
        type: GraphQLString,
        resolve(user: any) {
          return user.bannerUrl;
        }
      },
      displayName: {
        type: GraphQLString,
        resolve(user: any) {
          return user.displayName;
        }
      },
      email: {
        type: GraphQLString,
        resolve(user: any) {
          return user.email;
        }
      },
      reputation: {
        type: GraphQLInt,
        resolve(user: any) {
          return user.reputation;
        }
      },
      username: {
        type: GraphQLString,
        resolve(user: any) {
          return user.username;
        }
      },
      id: {
        type: GraphQLString,
        resolve(user: any) {
          return user.id;
        }
      },
      publishedAt: {
        type: GraphQLString,
        resolve(user: any) {
          return user.publishedAt;
        }
      },
      version: {
        type: GraphQLInt,
        resolve(user: any) {
          return user.version;
        }
      },
      userType: {
        type: GraphQLInt,
        resolve(user: any) {
          return user.userType;
        }
      },
      jwt: {
        type: GraphQLString,
        resolve(user: any) {
          return user.jwt;
        }
      },
      description: {
        type: GraphQLString,
        resolve(user: any) {
          return user.description;
        }
      },
      phone: {
        type: GraphQLString,
        resolve(user: any) {
          return user.phone;
        }
      },
      testing: {
        type: GraphQLBoolean,
        resolve(user: any) {
          return user.testing;
        }
      },
      entries: {
        type: new GraphQLList(Entry),
        resolve(user: any) {
          return user.getEntries();
        }
      }
    };
  }
});

export default User;
