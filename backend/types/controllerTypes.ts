export interface userRequestBody {
    username: string,
    password: string
}

export interface postRequestBody {
    title: string,
    content: string,
    status: string
}

export interface commentRequestBody {
    content: string,
    postId: number,
    authorId: number
}
