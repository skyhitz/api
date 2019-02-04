import { AlgoliaEntry } from '../models/algolia-entry';

export function entriesToAlgoliaEntries(
  entries: any[],
  user: any
): AlgoliaEntry[] {
  return entries.map(entry => {
    let algoliaEntry: AlgoliaEntry = {
      id: entry.id,
      etag: entry.etag,
      imageUrl: entry.imageUrl,
      description: entry.description,
      title: entry.title,
      videoUrl: entry.videoUrl,
      objectID: entry.id,
      publishedAt: entry.publishedAt,
      publishedAtTimestamp: entry.publishedAtTimestamp,
      userDisplayName: user.displayName,
      userUsername: user.username,
      testing: user.testing
    };
    return algoliaEntry;
  });
}
