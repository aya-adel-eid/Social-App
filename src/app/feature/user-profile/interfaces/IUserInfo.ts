export interface IUserInfo {
  success: boolean;
  message: string;
  data: Data;
}

export interface Data {
  isFollowing: boolean;
  user: User;
}

export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  photo: string;
  cover: string;
  followers: Follower[];
  following: Follower[];
  createdAt: string;
  followersCount: number;
  followingCount: number;
  bookmarksCount: number;
  id: string;
}

export interface Follower {
  _id: string;
  name: string;
  photo: string;
  followersCount: number;
  followingCount: number;
  bookmarksCount: number;
  id: string;
}
//follow
export interface IFollow {
  success: boolean;
  message: string;
  data: DataUser;
}

export interface DataUser {
  following: boolean;
  followersCount: number;
}
