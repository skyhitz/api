import { GraphQLString, GraphQLBoolean } from 'graphql';
import { getAuthenticatedUser } from '../../auth/logic';
import { uploadVideoToYoutube } from '../../youtube/youtube-upload';

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
  },
  async resolve(_: any, { videoUrl, title, description }: any, ctx: any) {
    await getAuthenticatedUser(ctx);
    console.log('video uploaded to cloudinary', videoUrl);
    await uploadVideoToYoutube(videoUrl, title, description);
    return true;
  },
};

export default youtubeUpload;
