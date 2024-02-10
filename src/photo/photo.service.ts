import { Injectable } from '@nestjs/common';
import Jimp from 'jimp';
import { UploadPhotoDto } from './dto/uploadPhoto.dto';
import { PhotosEntity } from './photo.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PhotoService {
    constructor(@InjectModel(PhotosEntity.name) private photoModel: Model<PhotosEntity>) {}

    async uploadPhoto(uploadPhotoDto: UploadPhotoDto): Promise<PhotosEntity> {

        const createdPhoto = new this.photoModel({
        photo_name:uploadPhotoDto.name,
        photo_url:uploadPhotoDto.path,
        user_id: uploadPhotoDto.user._id,
      });
  
      return createdPhoto.save();
    }

    async getUserAllPhotos(user_id:string): Promise<PhotosEntity[]> {

     const photos= await this.photoModel.find({user_id})

    return photos
  }
  


    async addWatermark(inputImagePath: string, outputImagePath: string, watermarkImagePath: string) {
        const [inputImage, watermarkImage] = await Promise.all([
          Jimp.read(inputImagePath),
          Jimp.read(watermarkImagePath),
        ]);
    
        inputImage.composite(watermarkImage, 10, 10, {
            mode: Jimp.BLEND_SOURCE_OVER,
            opacitySource: 0.5,
            opacityDest: 0
        });
    
        await inputImage.writeAsync(outputImagePath);
      }
}
