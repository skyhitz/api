const algoliasearch = require('algoliasearch');
import { Config } from '../config/index';
const client = algoliasearch(
  Config.ALGOLIA_APP_ID,
  Config.ALGOLIA_ADMIN_API_KEY
);
export const entriesIndex = client.initIndex('entries');
entriesIndex.setSettings({
  searchableAttributes: [
    'title,artist',
    'description',
    'userUsername,userDisplayName',
  ],
});
export const usersIndex = client.initIndex('users');

// Always pass objectID
export async function partialUpdateObject(obj: any) {
  return new Promise((resolve, reject) => {
    entriesIndex.partialUpdateObject(obj, (err: any, content: any) => {
      if (err) {
        return reject(err);
      }

      resolve(content);
    });
  });
}
