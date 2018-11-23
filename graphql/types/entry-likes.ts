import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLList,
} from 'graphql';

import PublicUser from './public-user';

const EntryLikes: GraphQLObjectType = new GraphQLObjectType({
  name: 'EntryLikes',
  description: 'Entry Likes',
  fields: () => ({
    count: {
      type: GraphQLInt,
      description: 'Count of entry likes',
    },
    users: {
      type: new GraphQLList(PublicUser),
      description: 'List of users that liked the entry',
    }
  })
});

export default EntryLikes;

