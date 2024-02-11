import {Body, Controller, Get, HttpException, HttpStatus, Post, Request} from '@nestjs/common';
import {UserService} from './user.service';
import {CreateUserDto} from './dto/createUser.dto';
import {UserLoginResponse, UserRegisterResponseType, UserResponseType} from './types/userResponse.type';
import {LoginDto} from './dto/login.dto';
import {ExpressRequest} from './middlewares/auth.middleware';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  async createUser(
    @Body() createUserDto: CreateUserDto
  ): Promise<UserRegisterResponseType> {
    const user = await this.userService.createUser(createUserDto)
    return this.userService.buildRegisterResponse(user)
  }

  @Post('/login')
  async login(
    @Body() loginDto: LoginDto
  ): Promise<UserLoginResponse> {
    const user = await this.userService.loginUser(loginDto)
    return this.userService.buildLoginResponse(user)
  }

  @Get()
  async currentUser(@Request() request: ExpressRequest): Promise<UserRegisterResponseType> {

    if (!request.user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED)
    }
    return this.userService.buildRegisterResponse(request.user)
  }
}
