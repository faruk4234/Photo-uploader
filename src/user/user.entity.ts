import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {hash} from "bcrypt";
import { IsNotEmpty } from "class-validator";

@Schema()
export class UserEntity {

  _id: string;

  id: string

  @Prop()
  email: string

  @Prop()
  username: string


  @Prop({select: false,min:6,max:12})
  password: string
}

export const UserEntitySchema = SchemaFactory.createForClass(UserEntity)

UserEntitySchema.pre<UserEntity>('save', async function (next: Function) {
  this.password = await hash(this.password, 10)
  next()
})
