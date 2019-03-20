import { Config } from '../config/index';
import fetch from 'node-fetch';
const Youtube = require('youtube-video-api');
const https = require('https');
const fs = require('fs');
const FormData = require('form-data');

const youtube = Youtube({
  saveTokens: false,
  video: {
    part: 'status,snippet',
  },
});

async function getAccessToken() {
  let data = new FormData();
  data.append('refresh_token', Config.YOUTUBE_API_REFRESH_TOKEN);
  data.append('client_id', Config.YOUTUBE_API_CLIENT_ID);
  data.append('client_secret', Config.YOUTUBE_API_CLIENT_SECRET);
  data.append('grant_type', 'refresh_token');
  return await fetch('https://www.googleapis.com/oauth2/v4/token', {
    method: 'POST',
    body: data,
  });
}

export function uploadVideoToYoutube(
  videoUrl: string,
  title: string,
  description: string
): Promise<string> {
  var params = {
    resource: {
      snippet: {
        title: title,
        description: description,
        categoryId: 10,
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
      response.on('end', async () => {
        const res = await getAccessToken();
        let { access_token } = await res.json();
        youtube.authenticate(
          Config.YOUTUBE_API_CLIENT_ID,
          Config.YOUTUBE_API_CLIENT_SECRET,
          {
            access_token: access_token,
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
              fs.unlinkSync(localPath);
              resolve(video.id);
              return;
            });
          }
        );
      });
    });
  });
}

export function deleteVideoFromYoutube(id: string) {
  return new Promise((resolve, reject) => {
    if (!id) {
      resolve();
      return;
    }
    youtube.delete(id, (err: any) => {
      if (err) {
        reject();
        return;
      }
      resolve();
      return;
    });
  });
}
