import { GraphQLString, GraphQLBoolean } from 'graphql';
import { getAuthenticatedUser } from '../../auth/logic';
import { uploadVideoToYoutube } from '../../youtube/youtube-upload';
import Database from '../../database';

const youtubeUpload = {
  type: GraphQLBoolean,
  args: {
    videoUrl: {
      type: GraphQLString,
    },
    title: {
      type: GraphQLString,
    },
    description: {
      type: GraphQLString,
    },
    id: {
      type: GraphQLString,
    },
  },
  async resolve(_: any, { videoUrl, title, description, id }: any, ctx: any) {
    await getAuthenticatedUser(ctx);
    const youtubeId = await uploadVideoToYoutube(videoUrl, title, description);
    const entry = await Database.models.entry.findOne({
      where: { id: id },
    });
    entry.youtubeId = youtubeId;
    await entry.save();
    return true;
  },
};

export default youtubeUpload;
