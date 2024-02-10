import { Module } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { PhotoController } from './photo.controller';
import { MulterModule } from '@nestjs/platform-express';
import { MongooseModule } from '@nestjs/mongoose';
import { PhotosEntity, PhotosEntitySchema } from './photo.entity';

@Module({
  imports:[MulterModule.register({
    dest:'.uploads/photos',
  }),
  MongooseModule.forFeature([{name: PhotosEntity.name, schema: PhotosEntitySchema}]),
],
  providers: [PhotoService],
  controllers: [PhotoController],

  exports: [PhotoService],
  
})
export class PhotoModule {}