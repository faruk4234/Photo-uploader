import {HttpException, HttpStatus, Injectable, NestMiddleware} from "@nestjs/common";
import {NextFunction, Request, Response} from "express";
import {UserEntity} from "../user.entity";
import {verify} from "jsonwebtoken";
import {UserService} from "../user.service";

export interface ExpressRequest extends Request {
  user?: UserEntity
}

const  excludedRoutes = [
  '/user/register',
  '/user/login',
]; 

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private userService: UserService) {}

  async use(req: ExpressRequest, res: Response, next: NextFunction) {

    //if you have not token and not register or login then exception will work
    if (!req.headers['authorization']) {
      req.user = null
      if(!excludedRoutes.includes(req.url)){
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
      next()
      return
    }
    
    
    const token = req.headers['authorization'].split(' ')[1]
    //token verify 
    try {
      const decode = verify(token, process.env.JWT_SECRET) as {email: string}
      const user = await this.userService.findByEmail(decode.email)
      req.user = user
      next()
    } catch (err) {
      if(!excludedRoutes.includes(req.url)&&!req.user){
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
      req.user = null
      next()
    }
  }
}
