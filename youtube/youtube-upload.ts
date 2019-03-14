import { Config } from '../config/index';
const Youtube = require('youtube-video-api');
const https = require('https');
const fs = require('fs');

export function uploadVideoToYoutube(videoUrl: string) {
  var youtube = Youtube({
    saveTokens: false,
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
    const fileExtension = videoUrl.split('.').pop();
    const localPath = `/tmp/video.${fileExtension}`;
    const file = fs.createWriteStream(localPath);
    https.get(videoUrl, (response: any) => {
      response.pipe(file);
      response.on('end', () => {
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

            youtube.upload(localPath, params, (err: any, video: any) => {
              if (err) {
                console.error('Cannot upload video:', err);
                reject();
                return;
              }

              console.log('Video was uploaded with ID:', video.id);
              fs.close(file.fd);
              fs.unlinkSync(localPath);
              resolve(video);
              return;
            });
          }
        );
      });
    });
  });
}
