import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateUserDto} from './dto/createUser.dto';
import {InjectModel} from '@nestjs/mongoose';
import {UserEntity} from './user.entity';
import {Model} from 'mongoose';
import {UserLoginResponse, UserRegisterResponseType, UserResponseType} from './types/userResponse.type';
import {LoginDto} from './dto/login.dto';
import {compare} from 'bcrypt';
import {sign} from 'jsonwebtoken';

@Injectable()
export class UserService {
  constructor(@InjectModel(UserEntity.name) private userModel: Model<UserEntity>) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = await this.userModel.findOne({email: createUserDto.email})

    if (user) {
      throw new HttpException('Email is already taken', HttpStatus.UNPROCESSABLE_ENTITY)
    }

    const createdUser = new this.userModel(createUserDto)
      createdUser.save()
      return createdUser
  }

  async loginUser(loginDto: LoginDto): Promise<UserEntity> {
    const user = await this.userModel.findOne({email: loginDto.email}).select('+password')

    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNPROCESSABLE_ENTITY)
    }

    const isPasswordCorrect = await compare(loginDto.password, user.password)

    if (!isPasswordCorrect) {
      throw new HttpException('Incorrect password', HttpStatus.UNPROCESSABLE_ENTITY)
    }

    return user
  }

  buildUserResponse(userEntity: UserEntity): UserResponseType {
    return {
      id:userEntity.id,
      _id:userEntity._id,
      username: userEntity.username,
      email: userEntity.email,
      token: this.generateJwt(userEntity)
    }
  }

  buildRegisterResponse(userEntity: UserEntity): UserRegisterResponseType {
    return {
      name: userEntity.username,
      email: userEntity.email
    }
  }

  buildLoginResponse(userEntity: UserEntity): UserLoginResponse {
    return {
      token: this.generateJwt(userEntity)
    }
  }

  generateJwt(userEntity: UserEntity): string {
    return sign({email: userEntity.email}, process.env.JWT_SECRET)
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return this.userModel.findOne({email})
  }
}
