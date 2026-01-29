export interface signUpUser {
    username: string,
    email: string,
    password: string
}
export interface logInUser {
    email: string,
    password: string
}
export interface responseUser {
    id: number,
    username: string,
    password?: string,
    email: string,
    avatar_url: string,
    createdAt?: string
}
export interface blogPost {
    id: number,
    authorId: number,
    title: string,
    content: string,
    status: 'draft' | 'published',
    User: {
        id: number,
        username: string,
        avatar_url: string
    }
    likeCount: number,
    hasLiked: boolean,
    createdAt: string,
    updatedAt: string,
}
export interface comment {
    id: number,
    authorId?: number,
    postId: number,
    content: string,
    User?: {
        username: string,
        avatar_url: string
    },
    Post?: {
        title: string,
    },
    createdAt: string,
    updatedAt?: string
}
export type PostDetailsResponse = {
    post: blogPost;
    comments: comment[]; 
    likeCount: number;
    hasLiked: boolean;
};