import { Config } from '../config/index';
var Youtube = require('youtube-video-api');

export function uploadVideoToYoutube(videoUrl: string) {
  var youtube = Youtube({
    video: {
      part: 'status,snippet',
    },
  });

  var params = {
    resource: {
      snippet: {
        title: 'test video',
        description: 'This is a test video uploaded via the YouTube API',
      },
      status: {
        privacyStatus: 'public',
      },
    },
  };

  return new Promise((resolve, reject) => {
    youtube.authenticate(
      Config.YOUTUBE_API_CLIENT_ID,
      Config.YOUTUBE_API_CLIENT_SECRET,
      {
        access_token: Config.YOUTUBE_API_ACCESS_TOKEN,
        refresh_token: Config.YOUTUBE_API_REFRESH_TOKEN,
      },
      (err: any, tokens: any) => {
        if (err) {
          console.error('Cannot authenticate:', err);
          reject();
          return;
        }

        youtube.upload(videoUrl, params, (err: any, video: any) => {
          if (err) {
            console.error('Cannot upload video:', err);
            reject();
            return;
          }

          console.log('Video was uploaded with ID:', video.id);
          resolve(video);
          return;
        });
      }
    );
  });
}
