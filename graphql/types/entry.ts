import { GraphQLObjectType, GraphQLFloat, GraphQLString } from 'graphql';

import User from './user';

const Entry: GraphQLObjectType = new GraphQLObjectType({
  name: 'Entry',
  description: 'This is an Entry',
  fields: () => {
    return {
      imageUrl: {
        type: GraphQLString,
        resolve(entry: any) {
          return entry.imageUrl;
        }
      },
      videoUrl: {
        type: GraphQLString,
        resolve(entry: any) {
          return entry.videoUrl;
        }
      },
      description: {
        type: GraphQLString,
        resolve(entry: any) {
          return entry.description;
        }
      },
      title: {
        type: GraphQLString,
        resolve(entry: any) {
          return entry.title;
        }
      },
      id: {
        type: GraphQLString,
        resolve(entry: any) {
          return entry.id;
        }
      },
      viewCount: {
        type: GraphQLFloat,
        resolve(entry: any) {
          return entry.viewCount;
        }
      },
      points: {
        type: GraphQLFloat,
        resolve(entry: any) {
          return entry.points;
        }
      },
      userDisplayName: {
        type: GraphQLString,
        resolve(entry: any) {
          return entry.getUser().displayName;
        }
      },
      user: {
        type: User,
        resolve(entry: any) {
          return entry.getUser();
        }
      }
    };
  }
});

export default Entry;
