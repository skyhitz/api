import { GraphQLString, GraphQLBoolean } from 'graphql';
import { getAuthenticatedUser } from '../../auth/logic';

const youtubeUpload = {
  type: GraphQLBoolean,
  args: {
    videoUrl: {
      type: GraphQLString,
    },
  },
  async resolve(_: any, { videoUrl }: any, ctx: any) {
    await getAuthenticatedUser(ctx);
    console.log('video uploaded to cloudinary', videoUrl);
    return true;
  },
};

export default youtubeUpload;
