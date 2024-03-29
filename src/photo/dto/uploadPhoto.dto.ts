import { IsEmail, IsNotEmpty } from "class-validator";
import { Model } from "mongoose";
import { UserEntity } from "src/user/user.entity";

export class UploadPhotoDto {

  @IsNotEmpty()
  readonly name:string

  readonly path:string

  readonly body:{
    tags: Array<string>;
    is_public:boolean;
    height?:number;
    width?:number
  }

  readonly user:UserEntity

}