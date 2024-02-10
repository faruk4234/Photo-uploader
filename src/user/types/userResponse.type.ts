import {UserEntity} from "../user.entity";

export type UserResponseType = Omit<UserEntity, 'password'> & {token: string}

export type UserLoginResponse = { token: string };

export type UserRegisterResponseType={name:string, email:string }