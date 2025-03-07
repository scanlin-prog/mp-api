interface IUser {
    email: string;
    password: string;
    name: string | null;
    id: string;
    avatarUrl: string | null;
    dateOfBirht: Date | null;
    createdAt: Date;
    updatedAt: Date;
    bio: string | null;
    location: string | null;
}

interface IRequestUser {
    userId: string;
}

export {
    IUser,
    IRequestUser
}