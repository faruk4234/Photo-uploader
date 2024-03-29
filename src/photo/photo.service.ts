import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UploadPhotoDto } from './dto/uploadPhoto.dto';
import { PhotosEntity } from './photo.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs';
import { updatePhotoSettingsDto } from './dto/updatePhotoSettings.dto';
import { photeResponseType } from './types/photoResponse.type';

@Injectable()
export class PhotoService {
  constructor(
    @InjectModel(PhotosEntity.name) private photoModel: Model<PhotosEntity>,
  ) {}

  async uploadPhoto(
    file,
    uploadPhotoDto: UploadPhotoDto,
  ): Promise<photeResponseType> {
    const createdPhoto = new this.photoModel({
      photo_name: uploadPhotoDto.name,
      photo_url: file.transforms[0].location,
      is_public: uploadPhotoDto.body.is_public || true,
      user_id: uploadPhotoDto.user.id,
      tags: uploadPhotoDto.body.tags,
    });

    createdPhoto.save();

    return this.buildPhotoResponse(createdPhoto);
  }

  async getUserAllPhotos(
    user_id: string,
    searchTerm?: string,
  ): Promise<photeResponseType[]> {
    let photos: PhotosEntity[];
    if (searchTerm) {
      photos = await this.photoModel
        .find({ user_id, tags: { $in: [new RegExp(searchTerm, 'i')] } })
        .exec();
    } else {
      photos = await this.photoModel.find({ user_id }).exec();
    }
    return photos.map((photo) => this.buildPhotoResponse(photo));
  }

  async getAllPhotos(searchTerm?: string): Promise<photeResponseType[]> {
    let photos: PhotosEntity[];
    if (searchTerm) {
      photos = await this.photoModel
        .find({ is_public: true, tags: { $in: [new RegExp(searchTerm, 'i')] } })
        .exec();
    } else {
      photos = await this.photoModel.find({ is_public: true }).exec();
    }
    return photos.map((photo) => this.buildPhotoResponse(photo));
  }

  async updateUserPhotoSettings(
    user_id: string,
    photo_id: string,
    updateDto: updatePhotoSettingsDto,
  ): Promise<photeResponseType> {
    const photo = await this.getUserPhoto(photo_id, user_id);
    const updatedPhoto = await this.photoModel.findByIdAndUpdate(
      photo._id,
      {
        $set: { ...updateDto },
      },
      {
        new: true,
      },
    );
    return this.buildPhotoResponse(updatedPhoto);
  }

  async deleteUserPhoto(photo_id: string, user_id: string): Promise<boolean> {
    const photo = await this.getUserPhoto(photo_id, user_id);
    if (fs.existsSync(photo.photo_url)) {
      fs.unlinkSync(photo.photo_url);
    }
    await this.photoModel.deleteOne({ _id: photo._id });
    return true;
  }

  //authanticate user for update or deleting
  async getUserPhoto(photo_id: string, user_id: string): Promise<PhotosEntity> {
    const photo = await this.photoModel.findOne({ _id: photo_id });
    if (!photo)
      throw new HttpException('photo not found', HttpStatus.NOT_FOUND);
    else {
      if (photo.user_id === user_id) return photo;
      else
        throw new HttpException(
          'You are not authanticate',
          HttpStatus.FORBIDDEN,
        );
    }
  }

  buildPhotoResponse(photoEntity: PhotosEntity): photeResponseType {
    return {
      id: photoEntity._id,
      user_id: photoEntity.user_id,
      tags: photoEntity.tags,
      is_public: photoEntity.is_public,
      photo_url: photoEntity.photo_url,
      filename: photoEntity.photo_name,
      upload_date: photoEntity.upload_date,
    };
  }
}
