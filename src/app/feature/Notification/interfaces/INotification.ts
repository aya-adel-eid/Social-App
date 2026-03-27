export interface INotifications {
  success: boolean;
  message: string;
  data: Data;
  meta: Meta;
}

export interface Meta {
  feedMode: string;
  pagination: Pagination;
}

export interface Pagination {
  currentPage: number;
  limit: number;
  total: number;
  numberOfPages: number;
  nextPage: number;
}

export interface Data {
  notifications: Notification[];
}

export interface Notification {
  _id: string;
  recipient: Recipient;
  actor: Recipient;
  type: string;
  entityType: string;
  entityId: string;
  isRead: boolean;
  createdAt: string;
  entity: Entity;
}

export interface Entity {
  _id: string;
  name?: string;
  username?: string;
  photo?: string;
  followersCount?: number;
  followingCount?: number;
  bookmarksCount?: number;
  id: string;
  body?: string;
  image?: string;
  user?: string;
  commentsCount?: number;
  topComment?: TopComment | null;
  sharesCount?: number;
  likesCount?: number;
  isShare?: boolean;
}

export interface TopComment {
  _id: string;
  content: string;
  commentCreator: CommentCreator;
  post: string;
  parentComment: null;
  likes: any[];
  createdAt: string;
}

export interface CommentCreator {
  _id: string;
  name: string;
  username: string;
  photo: string;
}

export interface Recipient {
  _id: string;
  name: string;
  photo: string;
}
