import { IsEmail, IsNotEmpty } from "class-validator";
import { Model } from "mongoose";
import { UserEntity } from "src/user/user.entity";

export class updatePhotoSettingsDto {

  @IsNotEmpty()
  readonly is_public?:boolean

  readonly tags?:Array<string>

}