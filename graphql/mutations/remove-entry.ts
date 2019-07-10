import { GraphQLString, GraphQLBoolean, GraphQLNonNull } from 'graphql';
import { getAuthenticatedUser } from '../../auth/logic';
import Database from '../../database';
import { entriesIndex } from '../../algolia/algolia';
import { cloudinary } from '../../cloudinary/cloudinary';
import { deleteVideoFromYoutube } from '../../youtube/youtube-upload';
const adminId = '-LbM3m6WKdVQAsY3zrAd';

function deleteFromCloudinary(cloudinaryPublicId: string) {
  return new Promise((resolve, reject) => {
    cloudinary.v2.api.delete_resources(
      [cloudinaryPublicId],
      { resource_type: 'video' },
      (err: any, res: any) => {
        console.log('error', err);
        console.log('response', res);
        if (err) {
          reject();
          return;
        }
        resolve();
        return;
      }
    );
  });
}

async function deleteAccount(entry: any, cloudinaryPublicId: any) {
  [
    await entry.destroy(),
    await entriesIndex.deleteObject(entry.id),
    await deleteFromCloudinary(cloudinaryPublicId),
    await deleteVideoFromYoutube(entry.youtubeId),
  ];

  return true;
}

const removeEntry = {
  type: GraphQLBoolean,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    cloudinaryPublicId: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  async resolve(_: any, { id, cloudinaryPublicId }: any, ctx: any) {
    const user = await getAuthenticatedUser(ctx);
    let entry = await Database.models.entry.findOne({
      where: { id: id },
    });

    if (user.id === adminId) {
      return deleteAccount(entry, cloudinaryPublicId);
    }

    try {
      const result = await entry.getEntryOwner();
      const ownerId = result[0].id;
      if (user.id !== ownerId) {
        return false;
      }
    } catch (e) {
      return false;
    }

    return deleteAccount(entry, cloudinaryPublicId);
  },
};

export default removeEntry;
