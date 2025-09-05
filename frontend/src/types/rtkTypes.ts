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
    email: string
    username: string,
}
export interface blogPost {
    id: number,
    authorId: number,
    title: string,
    content: string,
    status: 'draft' | 'published',
    likes: number,
    User: {
        username: string
    }
    createdAt: string,
    updatedAt: string;
}
export interface comment {
    id: number;
    authorId: number;
    postId: number;
    content: string;
    createdAt: Date;

}