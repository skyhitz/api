const algoliasearch = require('algoliasearch');
import { Config } from '../config/index';
const client = algoliasearch(
  Config.ALGOLIA_APP_ID,
  Config.ALGOLIA_ADMIN_API_KEY
);
export const entriesIndex = client.initIndex('entries');
entriesIndex.setSettings({
  searchableAttributes: ['title,userDisplayName', 'description', 'userUsername']
});
export const usersIndex = client.initIndex('users');
