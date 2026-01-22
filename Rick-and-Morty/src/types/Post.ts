export interface Post {
  id: number;
  title: string;
  body: string;
  url: string;
  rate: number;
  createdAt: string;
}

export interface CreatePostRequest {
  title: string;
  body: string;
  url: string;
  rate: number;
}