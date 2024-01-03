import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/users.chema';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
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
  providers: [UsersService, JwtService],
  controllers: [UsersController],
})
export class UsersModule {}