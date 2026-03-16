export interface IAllPosts {
  success: boolean;
  message: string;
  data: Data;
  meta: Meta;
}

export interface Meta {
  pagination: Pagination;
}

export interface Pagination {
  currentPage: number;
  numberOfPages: number;
  limit: number;
  nextPage: number;
  total: number;
}

export interface Data {
  posts: Post[];
}
export interface User {
  _id: string;
  name: string;
  username?: string;
  photo: string;
}

export interface Post {
  _id: string;
  body?: string;
  privacy: string;
  user: User;
  sharedPost: SharedPost | null;
  likes: string[];
  createdAt: string;
  commentsCount: number;
  topComment: TopComment | null;
  sharesCount: number;
  likesCount: number;
  isShare: boolean;
  id: string;
  bookmarked: boolean;
  image?: string;
}
export interface SharedPost {
  _id: string;
  body?: string;
  image: string;
  privacy: string;
  user: User;
  sharedPost: null;
  likes: string[];
  createdAt: string;
  commentsCount: number;
  topComment: TopComment;
  sharesCount: number;
  likesCount: number;
  isShare: boolean;
  id: string;
}
export interface TopComment {
  _id: string;
  content: string;
  commentCreator: User;
  post: string;
  parentComment: null;
  likes: string[];
  createdAt: string;
  repliesCount?: number;
}
