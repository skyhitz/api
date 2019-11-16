export interface AlgoliaEntry {
  id: string;
  etag: string;
  imageUrl: string;
  description: string;
  title: string;
  videoUrl: string;
  publishedAt: string;
  publishedAtTimestamp: number;
  userDisplayName: string;
  userUsername: string;
  objectID: string;
  testing: boolean;
  price: number;
  forSale: boolean;
}

export interface AlgoliaUser {
  avatarUrl: string;
  displayName: string;
  description: string;
  reputation: number;
  username: string;
  id: string;
  userType: number;
  publishedAt: string;
  publishedAtTimestamp: number;
  objectID: string;
  testing: boolean;
}
