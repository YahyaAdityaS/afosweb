export interface IMenu {
    id: number,
    uuid: string,
    name: string,
    price: number,
    picture: string,
    description: string,
    category: string,
    createdAt: string,
    updatedAt: string,
    massager: string
}

export interface IUser {
    id: Number,
    uuid: string,
    name: string,
    email: string,
    password: string,
    profile_picture: string,
    role: string,
    createdAt: string,
    updateAt: string,
}