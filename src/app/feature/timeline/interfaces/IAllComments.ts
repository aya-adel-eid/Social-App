export interface CommentCreator {
  _id: string;
  name: string;
  photo: string;
}

export interface Comment {
  _id: string;
  content: string;
  commentCreator: CommentCreator;
  post: string;
  createdAt: string;
  id: string;
}

export interface IAllComments {
  message: string;
  comments: Comment[];
  total?: number;
}
