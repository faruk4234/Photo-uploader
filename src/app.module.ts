import {MiddlewareConsumer, Module, RequestMethod} from '@nestjs/common';
import {UserModule} from './user/user.module';
import {MongooseModule} from '@nestjs/mongoose';
import {AuthMiddleware} from './user/middlewares/auth.middleware';

@Module({
  imports: [
    UserModule, 
    MongooseModule.forRoot('mongodb+srv://bonican90:bonbon42@faruk.8x8t5js.mongodb.net/?retryWrites=true'),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL
    })
  }
}
