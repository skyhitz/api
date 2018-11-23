import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList
} from 'graphql';

import Entry from './entry';

const PublicUser: GraphQLObjectType = new GraphQLObjectType({
  name: 'PublicUser',
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
      userType: {
        type: GraphQLInt,
        resolve(user: any) {
          return user.userType;
        }
      },
      description: {
        type: GraphQLString,
        resolve(user: any) {
          return user.description;
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

export default PublicUser;
