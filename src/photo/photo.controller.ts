import { BadRequestException, Body, Controller, Delete, Get, Param, Post ,Put,Query,Request, Response, UploadedFile, UploadedFiles, UseGuards, UseInterceptors} from '@nestjs/common';
import { PhotoService } from './photo.service';
import { AuthMiddleware, ExpressRequest } from 'src/user/middlewares/auth.middleware';
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

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('photos', {
      storage: diskStorage({
        destination: './uploads/photos',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');

            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                return cb(new BadRequestException('Only image files are allowed!'), false);
              }
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  public async uploadFile(
    @UploadedFile() photos, 
    @Request() req: UploadPhotoDto,
    ) {
    const uploadedFile = await this.photoService.uploadPhoto(
        {...req, name: photos.name,path:photos.filename});

    return uploadedFile;
  }

    @Post('/photos')
    async getPhotos(
        @Request() request:ExpressRequest,
        @Response() response,
        ) {
        try {
            return response.json(request.user);
        } catch (error) {
            return response.status(500).json({ message: 'Internal server error' });
        }
    }

    @Get('/my-photos')
    async getMyPhotos(
        @Request() request:ExpressRequest,
        @Response() response,
        @Query('search') searchTerm?: string
        ) {
        try {
            const result = await this.photoService.getUserAllPhotos(request.user.id,searchTerm);
            return response.json(result)
        } catch (error) {
            return response.status(500).json({ message: 'Internal server error' });
        }
    }

    @Get('/photos')
    async getPhoto(
        @Response() response,
        @Query('search') searchTerm?: string) {        
        const result = await this.photoService.getAllPhotos(searchTerm)
        return response.json(result)
    }

    @Put()
    async updatePhoto(
        @Request() {user}:ExpressRequest, 
        @Body() updateSettings: updatePhotoSettingsDto,
        @Response() response,
        @Query('id') photo_id?: string) {
            const result =await this.photoService.updateUserPhotoSettings(user.id,photo_id,updateSettings)
            return response.json(result)
    }   

    @Delete('/:id')
    async deleteMyPhoto(
        @Request() {user}:ExpressRequest, 
        @Response() response,
        @Param('id') photo_id?: string) {
            const result =await this.photoService.deleteUserPhoto(photo_id,user.id)
            return response.json(result)
    }
    
}

