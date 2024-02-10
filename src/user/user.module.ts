import {Module} from '@nestjs/common';
import {UserController} from './user.controller';
import {UserService} from './user.service';
import {MongooseModule} from '@nestjs/mongoose';
import {UserEntity, UserEntitySchema} from './user.entity';
import { PhotoController } from 'src/photo/photo.controller';
import { PhotoService } from 'src/photo/photo.service';
import { PhotoModule } from 'src/photo/photo.module';
import { PhotosEntity, PhotosEntitySchema } from 'src/photo/photo.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{name: PhotosEntity.name, schema: PhotosEntitySchema}]),
    MongooseModule.forFeature([{name: UserEntity.name, schema: UserEntitySchema}]),
    PhotoModule],
  controllers: [UserController,],
  providers: [UserService,PhotoService],
  exports: [UserService,PhotoService],
})
export class UserModule {}
