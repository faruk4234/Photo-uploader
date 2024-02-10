import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";

@Schema()
export class PhotosEntity {
  
  @Prop()
  tags: Array<string>

  @Prop()
  photo_url:string

  @Prop()
  photo_name:string

  @Prop({ type: String, required: true })
  user_id: string;

}

export const PhotosEntitySchema = SchemaFactory.createForClass(PhotosEntity)



