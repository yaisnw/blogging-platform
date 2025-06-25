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
    email: string
}