import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UserRegiserDTO } from '../types/register-user.dto';
import { plainToClass } from 'class-transformer';
import { SerializeUser, VerifyParam } from '../types';
import { CookieService } from 'src/common/services/cookie.service';
import { Response } from 'express';
import { JwtService } from 'src/common/services/jwt.service';
import { UserLoginDTO } from '../types/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authSevice: AuthService,
    private readonly cookieService: CookieService,
    private readonly jwtService: JwtService,
  ) {}
  @Post('register')
  register(@Body() data: UserRegiserDTO) {
    const userRegister = plainToClass(UserRegiserDTO, data, {
      excludeExtraneousValues: true,
    });
    return this.authSevice.register(userRegister);
  }
  @Get('verify-account/:id/:code')
  async verifyAccount(@Param() param: VerifyParam, @Res() res: Response) {
    const { user } = await this.authSevice.verifyAccount(param);
    console.log('controller user', user);

    const accessToken = this.jwtService.signAccessToken({ id: user._id });
    const refreshToken = this.jwtService.signRefreshToken({ id: user._id });
    this.cookieService.saveCookie(res, 'accessToken', accessToken);
    this.cookieService.saveCookie(res, 'refreshToken', refreshToken);
    console.log('redirect');
    res.redirect(`http://localhost:9999/auth/verify-account`);
  }
  @Post('login')
  async login(@Body() data: UserLoginDTO, @Res() res: Response) {
    const loginData = plainToClass(UserLoginDTO, data, { excludeExtraneousValues: true });
    const { user } = await this.authSevice.login(loginData);
    // generate token
    const accessToken = this.jwtService.signAccessToken({ id: user._id });
    const refreshToken = this.jwtService.signRefreshToken({ id: user._id });
    this.cookieService.saveCookie(res, 'accessToken', accessToken);
    this.cookieService.saveCookie(res, 'refreshToken', refreshToken);

    // serialize data
    const serializeUser = plainToClass(SerializeUser, user, { excludeExtraneousValues: true });
    return res.status(200).json({ user: serializeUser });
  }
  @Get('logout')
  async logout(@Req() req: any, @Res() res: Response) {
    const id: string = req.user.id;
    await this.authSevice.logout(id);
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.status(200).json({ msg: 'logout successfully' });
  }
  @Get('refresh-token')
  async refreshToken(@Req() req: any, @Res() res: Response) {
    const id = req.user.id;
    const accessToken = this.jwtService.signAccessToken({ id });
    const refreshToken = this.jwtService.signRefreshToken({ id });
    this.cookieService.saveCookie(res, 'accessToken', accessToken);
    this.cookieService.saveCookie(res, 'refreshToken', refreshToken);
    return res.status(200).json({ msg: 'refresh-token successfully' });
  }
}
