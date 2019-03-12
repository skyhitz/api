import { GraphQLString, GraphQLBoolean } from 'graphql';
import { getAuthenticatedUser } from '../../auth/logic';
import { uploadVideoToYoutube } from '../../youtube/youtube-upload';

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
    await uploadVideoToYoutube(videoUrl);
    return true;
  },
};

export default youtubeUpload;
