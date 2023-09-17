import { Module } from '@nestjs/common';
import {
  DatabaseModule,
  TypeORMDatabaseModule,
} from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { OfferModule } from './offer/offer.module';
import { OfferService } from './offer/offer.service';
import { ProfileModule } from './profile/profile.module';
import { RequestModule } from './request/request.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { VehicleService } from './vehicle/vehicle.service';
import { ReviewController } from './review/review.controller';
import { ReviewService } from './review/review.service';
import { ReviewModule } from './review/review.module';
@Module({
  imports: [
    OfferModule,
    VehicleModule,
    AuthModule,
    DatabaseModule,
    UserModule,
    TypeORMDatabaseModule,
    ProfileModule,
    RequestModule,
    ReviewModule,
  ],
  exports: [AuthModule, DatabaseModule, UserModule],
  providers: [OfferService, VehicleService, ReviewService],
  controllers: [ReviewController],
})
export class AppModule {}
