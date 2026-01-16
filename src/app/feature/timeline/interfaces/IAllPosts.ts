export interface IAllPosts {
  message: string;
  paginationInfo: PaginationInfo;
  posts: Posts[];
}

export interface Posts {
  _id: string;
  body?: string;
  image?: string;
  user: User;
  createdAt: string;
  comments: Comments2[];
  id: string;
}

export interface Comments2 {
  _id: string;
  content: string;
  commentCreator: User;
  post: string;
  createdAt: string;
}

// export interface Comment {
//   _id: string;
//   content?: string;
//   commentCreator: User;
//   post: string;
//   createdAt: string;
// }

export interface User {
  _id: string;
  name: string;
  photo: string;
}

export interface PaginationInfo {
  currentPage: number;
  numberOfPages: number;
  limit: number;
  nextPage: number;
  total: number;
}
