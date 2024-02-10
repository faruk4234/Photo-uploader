import { Controller, Get, Post ,Put,Request, Response, UseGuards} from '@nestjs/common';
import { PhotoService } from './photo.service';
import { AuthMiddleware, ExpressRequest } from 'src/user/middlewares/auth.middleware';

@Controller('photo')
export class PhotoController {
    constructor(private readonly photoService: PhotoService) {}
    @Post('/upload')
    async uploadPhoto(@Request() request:ExpressRequest, @Response() response) {
        try {
            return response.json('am');
        } catch (error) {
            return response.status(500).json({ message: 'Internal server error' });
        }
    }

    @Post('/photos')
    async getPhotos(@Request() request:ExpressRequest, @Response() response) {
        try {
            return response.json(request.user);
        } catch (error) {
            return response.status(500).json({ message: 'Internal server error' });
        }
    }

    @Post('/my-photos')
    async getMyPhotos(@Request() request:ExpressRequest, @Response() response) {
        try {
            return response.json(request.user);
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
