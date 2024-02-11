import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Jimp from 'jimp';
import { UploadPhotoDto } from './dto/uploadPhoto.dto';
import { PhotosEntity } from './photo.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as sharp from 'sharp';
import * as fs from 'fs';
import { updatePhotoSettingsDto } from './dto/updatePhotoSettings.dto';

@Injectable()
export class PhotoService {
    constructor(@InjectModel(PhotosEntity.name) private photoModel: Model<PhotosEntity>) {}

    async uploadPhoto(uploadPhotoDto: UploadPhotoDto): Promise<PhotosEntity> {
      await sharp(`uploads/photos/${uploadPhotoDto.path}`)
      .resize({
         width: Number(uploadPhotoDto.body.width||400),
         height:Number(uploadPhotoDto.body.height||700)
       })
      .toFile(`uploads/photos/1${uploadPhotoDto.path}`);

        const createdPhoto = new this.photoModel({
        photo_name:uploadPhotoDto.name,
        photo_url:`/uploads/photos/1`+uploadPhotoDto.path,
        is_public:uploadPhotoDto.body.is_public||true,
        user_id: uploadPhotoDto.user.id,
        tags:uploadPhotoDto.body.tags
      });

      fs.unlinkSync('uploads/photos/'+ uploadPhotoDto.path)

      return createdPhoto.save();
    }

    async getUserAllPhotos(user_id:string,searchTerm?:string): Promise<PhotosEntity[]> {
      let photos: PhotosEntity[];
      if (searchTerm) {
        photos = await this.photoModel.find({ user_id, tags: { $in: [new RegExp(searchTerm, 'i')] } }).exec();
      } else {
        photos = await this.photoModel.find({ user_id }).exec();
      }
      return photos;
    }

    async getAllPhotos(searchTerm?:string): Promise<PhotosEntity[]> {
      let photos: PhotosEntity[];
      if (searchTerm) {
        photos = await this.photoModel.find({ is_public:true, tags: { $in: [new RegExp(searchTerm, 'i')] } }).exec();
      } else {
        photos = await this.photoModel.find({ is_public:true }).exec();
      }
      return photos;
    }

    async updateUserPhotoSettings(user_id:string,photo_id:string,updateDto:updatePhotoSettingsDto): Promise<PhotosEntity> {
      const photo = await this.getUserPhoto(photo_id,user_id)
      const updatedPhoto=await this.photoModel.findByIdAndUpdate(photo._id, {
        $set: { ...updateDto} },
      {
        new: true,
      })
      console.log(updatedPhoto)
      return updatedPhoto
    }

    async deleteUserPhoto(photo_id:string,user_id:string,): Promise<boolean> {
      const photo = await this.getUserPhoto(photo_id,user_id)
      if (fs.existsSync(photo.photo_url)) {
        fs.unlinkSync(photo.photo_url);
       }
       await this.photoModel.deleteOne({_id:photo._id})
       return true
    }

    async getUserPhoto(photo_id:string,user_id:string): Promise<PhotosEntity> {
      const photo = await this.photoModel.findOne({_id:photo_id});
      if(!photo){
        throw new HttpException('photo not found', HttpStatus.NOT_FOUND);
      }
      else {
        if(photo.user_id===user_id)
        {
          return photo;
        }
        else {
          throw new HttpException('You are not authanticate', HttpStatus.FORBIDDEN);
        }
      }
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
