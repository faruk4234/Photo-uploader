import {Module} from '@nestjs/common';
import {UserController} from './user.controller';
import {UserService} from './user.service';
import {MongooseModule} from '@nestjs/mongoose';
import {UserEntity, UserEntitySchema} from './user.entity';
import { PhotoController } from 'src/photo/photo.controller';
import { PhotoService } from 'src/photo/photo.service';

@Module({
  imports: [MongooseModule.forFeature([{name: UserEntity.name, schema: UserEntitySchema}])],
  controllers: [UserController,],
  providers: [UserService,PhotoService],
  exports: [UserService,PhotoService],
})
export class UserModule {}
