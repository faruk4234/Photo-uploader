import {
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
  UseInterceptors,
} from '@nestjs/common';
import { PhotoService } from './photo.service';
import { ExpressRequest } from 'src/user/middlewares/auth.middleware';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadPhotoDto } from './dto/uploadPhoto.dto';
import { updatePhotoSettingsDto } from './dto/updatePhotoSettings.dto';

@Controller('photo')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  @UseInterceptors(FileInterceptor('photo'))
  @Post('upload')
  uploadPhoto(@UploadedFile() photo, @Request() req: UploadPhotoDto) {
    return this.photoService.uploadPhoto(photo, req);
  }

  //get only current user photos
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

  //get all pubic photos
  @Get('/photos')
  async getPhoto(@Response() response, @Query('search') searchTerm?: string) {
    const result = await this.photoService.getAllPhotos(searchTerm);
    return response.json(result);
  }

  //update taggs and public state
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

  //delete photo
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
