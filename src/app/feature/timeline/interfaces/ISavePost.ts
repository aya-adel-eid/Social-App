export interface ISavePost {
  success: boolean;
  message: string;
  data: Data;
}

export interface Data {
  bookmarked: boolean;
  bookmarksCount: number;
}
