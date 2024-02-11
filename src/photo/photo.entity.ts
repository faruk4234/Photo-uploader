import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";

@Schema()
export class PhotosEntity {
  
  _id:string

  @Prop()
  tags: Array<string>

  @Prop()
  photo_url:string

  @Prop()
  photo_name:string

  @Prop()
  is_public:boolean=true

  @Prop({ type: Date, default: Date.now })
  upload_date: Date;

  @Prop({ type: String, required: true })
  user_id: string;

}

export const PhotosEntitySchema = SchemaFactory.createForClass(PhotosEntity)



