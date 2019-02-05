import { AlgoliaEntry, AlgoliaUser } from '../models/algolia-entry';

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

export function usersToAlgoliaUsers(users: any[]): AlgoliaUser[] {
  return users.map(user => {
    let algoliaUsers: AlgoliaUser = {
      avatarUrl: user.avatarUrl,
      displayName: user.displayName,
      description: user.description,
      reputation: user.reputation,
      username: user.username,
      id: user.id,
      userType: user.userType,
      publishedAt: user.publishedAt,
      publishedAtTimestamp: user.publishedAtTimestamp,
      objectID: user.id,
      testing: user.testing
    };
    return algoliaUsers;
  });
}
