import { IsEmail, IsNotEmpty } from "class-validator";
import { Model } from "mongoose";
import { UserEntity } from "src/user/user.entity";

export class UploadPhotoDto {

  @IsNotEmpty()
  readonly tags: Array<string>;

  readonly name:string

  readonly path:string

  readonly is_public?:boolean=true

  readonly user:UserEntity

}