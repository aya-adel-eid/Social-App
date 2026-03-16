// export interface CommentCreator {
//   _id: string;
//   name: string;
//   photo: string;
// }

// export interface Comment {
//   _id: string;
//   content: string;
//   commentCreator: CommentCreator;
//   post: string;
//   createdAt: string;
//   id: string;
// }

// export interface IAllComments {
//   message: string;
//   comments: Comment[];
//   total?: number;
// }
export interface IAllComments {
  success: boolean;
  message: string;
  data: Comments;
  meta: Meta;
}

export interface Meta {
  pagination: Pagination;
}

export interface Pagination {
  currentPage: number;
  limit: number;
  total: number;
  numberOfPages: number;
}

export interface Comments {
  comments: Comment[];
}

export interface Comment {
  _id: string;
  content: string;
  commentCreator: CommentCreator;
  post: string;
  parentComment: null;
  likes: string[];
  createdAt: string;
  repliesCount: number;
}

export interface CommentCreator {
  _id: string;
  name: string;
  username: string;
  photo: string;
}
