import { Module } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { PhotoController } from './photo.controller';
import { MulterModule } from '@nestjs/platform-express';
import { MongooseModule } from '@nestjs/mongoose';
import { PhotosEntity, PhotosEntitySchema } from './photo.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as aws from 'aws-sdk';
import * as multerS3 from 'multer-s3-transform';
import * as sharp from 'sharp';
import { v4 } from 'uuid';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const s3 = new aws.S3({
          params: { Bucket: 'faruk-photo-upload' },
          region: 'eu-central-1',
          accessKeyId: configService.get('AWS_ACCESS_KEY'),
          secretAccessKey: configService.get('AWS_SECRET_KEY'),
          s3BucketEndpoint: false,
          endpoint: 'https://s3.amazonaws.com',
        });

        return {
          storage: multerS3({
            s3,
            bucket: 'faruk-photo-upload',
            acl: 'public-read',
            contentType: multerS3.AUTO_CONTENT_TYPE,
            metadata(req, file, cb) {
              cb(null, { fieldName: file.fieldname });
            },
            shouldTransform: true,
            transforms: [
              {
                id: 'original',
                key(req, file, cb) {
                  cb(null, `${v4()}.jpeg`);
                },
                transform(req, file, cb) {
                  cb(null, sharp().jpeg());
                },
              },
            ],
          }),
          limits: {
            fileSize: 1024 * 1024 * 50, // 50MB
          },
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: PhotosEntity.name, schema: PhotosEntitySchema },
    ]),
  ],
  providers: [PhotoService],
  controllers: [PhotoController],

  exports: [PhotoService],
})
export class PhotoModule {}
