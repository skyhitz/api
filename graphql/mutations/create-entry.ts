import { GraphQLString, GraphQLNonNull } from 'graphql';
import Database from '../../database';
import Entry from '../types/entry';
import { getAuthenticatedUser } from '../../auth/logic';
import UniqueIdGenerator from '../../auth/unique-id-generator';

const createEntry = {
  type: Entry,
  args: {
    etag: {
      type: new GraphQLNonNull(GraphQLString)
    },
    imageUrl: {
      type: new GraphQLNonNull(GraphQLString)
    },
    description: {
      type: new GraphQLNonNull(GraphQLString)
    },
    title: {
      type: new GraphQLNonNull(GraphQLString)
    },
    videoUrl: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  async resolve(_: any, args: any, ctx: any) {
    let user = await getAuthenticatedUser(ctx);
    let { etag, imageUrl, description, title, videoUrl } = args;
    let id = UniqueIdGenerator.generate();
    let entry = {
      id: id,
      etag: etag,
      imageUrl: imageUrl,
      description: description,
      title: title,
      viewCount: 0,
      videoUrl: videoUrl,
      likeCount: 0,
      points: 0
    };

    let createdEntry = await Database.models.entry.create(entry);
    createdEntry.addEntryOwner(user.id);
  }
};

export default createEntry;
