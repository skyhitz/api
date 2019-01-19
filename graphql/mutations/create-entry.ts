import { GraphQLString, GraphQLNonNull } from 'graphql';
import Database from '../../database';
import Entry from '../types/entry';
import { getAuthenticatedUser } from '../../auth/logic';
import UniqueIdGenerator from '../../auth/unique-id-generator';
import { entriesIndex } from '../../algolia/algolia';

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
      videoUrl: videoUrl,
      publishedAt: new Date().toISOString(),
      publishedAtTimestamp: Math.floor(new Date().getTime() / 1000)
    };

    let createdEntry = await Database.models.entry.create(entry);
    let entryIndex: any = entry;
    entryIndex.userDisplayName = user.displayName;
    entryIndex.objectID = id;
    [
      await createdEntry.addEntryOwner(user.id),
      await entriesIndex.addObject(entry)
    ];
  }
};

export default createEntry;
