import { Controller, Get, Post ,Put,Request, Response, UploadedFile, UseGuards, UseInterceptors} from '@nestjs/common';
import { PhotoService } from './photo.service';
import { AuthMiddleware, ExpressRequest } from 'src/user/middlewares/auth.middleware';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UploadPhotoDto } from './dto/uploadPhoto.dto';

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
            return cb(null, `${randomName}${extname(file.originalname)}`);
          },
        }),
      }),
    )
    public async uploadFile(@UploadedFile() photos,@Request() req) {

        const uploadPhotoDto:UploadPhotoDto={
            name:photos.name,
            path:photos.path,
            tags:req.body.tags,
            user:req.user
        }
        return await this.photoService.uploadPhoto(uploadPhotoDto)
      }

    @Post('/photos')
    async getPhotos(@Request() request:ExpressRequest, @Response() response) {
        try {
            return response.json(request.user);
        } catch (error) {
            return response.status(500).json({ message: 'Internal server error' });
        }
    }

    @Get('/my-photos')
    async getMyPhotos(@Request() request:ExpressRequest, @Response() response) {
        try {
            const result = await this.photoService.getUserAllPhotos(request.user._id);
            return response.json(result)
        } catch (error) {
            return response.status(500).json({ message: 'Internal server error' });
        }
    }

    @Get('/photo')
    async getPhoto(@Request() request:ExpressRequest, @Response() response) {
        try {
            return response.json(request.user);
        } catch (error) {
            return response.status(500).json({ message: 'Internal server error' });
        }
    }

    @Put('/photo')
    async updateMyPhoto(@Request() request:ExpressRequest, @Response() response) {
        try {
            return response.json();
        } catch (error) {
            return response.status(500).json({ message: 'Internal server error' });
        }
    }
    
}

