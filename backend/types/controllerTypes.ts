export type userRequestBody = {
  username: string;
  email?: string;
  password: string;
}


export interface postRequestBody {
    title: string,
    content: string,
    status: string,
    likes: number
}

export interface commentRequestBody {
    content: string,
    postId: number,
    authorId: number
}

export interface pictureRequestBody {
    postId: string | number,
}

export interface PictureAttributes {
  id: number;
  imageUrl: string;
  postId: number;
}