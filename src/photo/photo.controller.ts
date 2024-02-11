import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  Response,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PhotoService } from './photo.service';
import {
  AuthMiddleware,
  ExpressRequest,
} from 'src/user/middlewares/auth.middleware';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UploadPhotoDto } from './dto/uploadPhoto.dto';
import * as sharp from 'sharp';
import * as fs from 'fs';
import { updatePhotoSettingsDto } from './dto/updatePhotoSettings.dto';

@Controller('photo')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  @UseInterceptors(FileInterceptor('photos'))
  @Post('upload')
  uploadPhoto(@UploadedFile() photos) {
    return this.photoService.uploadPhoto(photos);
  }

  @Get('/my-photos')
  async getMyPhotos(
    @Request() request: ExpressRequest,
    @Response() response,
    @Query('search') searchTerm?: string,
  ) {
    try {
      const result = await this.photoService.getUserAllPhotos(
        request.user.id,
        searchTerm,
      );
      return response.json(result);
    } catch (error) {
      return response.status(500).json({ message: 'Internal server error' });
    }
  }

  @Get('/photos')
  async getPhoto(@Response() response, @Query('search') searchTerm?: string) {
    const result = await this.photoService.getAllPhotos(searchTerm);
    return response.json(result);
  }

  @Put()
  async updatePhoto(
    @Request() { user }: ExpressRequest,
    @Body() updateSettings: updatePhotoSettingsDto,
    @Response() response,
    @Query('id') photo_id?: string,
  ) {
    const result = await this.photoService.updateUserPhotoSettings(
      user.id,
      photo_id,
      updateSettings,
    );
    return response.json(result);
  }

  @Delete('/:id')
  async deleteMyPhoto(
    @Request() { user }: ExpressRequest,
    @Response() response,
    @Param('id') photo_id?: string,
  ) {
    const result = await this.photoService.deleteUserPhoto(photo_id, user.id);
    return response.json(result);
  }
}
