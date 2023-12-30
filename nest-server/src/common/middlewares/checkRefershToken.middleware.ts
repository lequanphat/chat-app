import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import * as cookieParser from 'cookie-parser';
import { JwtService } from '../services/jwt.service';
@Injectable()
export class CheckRefreshTokenMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}
  use(req: any, res: Response, next: NextFunction) {
    console.log('check refresh-token middleware here ...');
    cookieParser()(req, res, () => {
      const token = req.cookies?.refreshToken;
      if (!token) {
        throw new HttpException('Un-Authorized', HttpStatus.FORBIDDEN);
      }
      console.log('refreshToken', token);
      try {
        const data = this.jwtService.verifyRefreshToken(token);
        req.user = data;
        next();
      } catch (error) {
        throw new HttpException('Token has expired', HttpStatus.FORBIDDEN);
      }
    });
  }
}
