import { Module } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { PhotoController } from './photo.controller';

@Module({
  providers: [PhotoService],
  controllers: [PhotoController],
  exports: [PhotoService],
  
})
export class PhotoModule {}