import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/users.chema';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { OtpService } from '../common/services/otp.service';
import { EmailService } from 'src/common/services/mail.service';
import { CookieService } from 'src/common/services/cookie.service';
import { JwtService } from 'src/common/services/jwt.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [AuthService, OtpService, EmailService, CookieService, JwtService],
  controllers: [AuthController],
})
export class AuthModule {}
