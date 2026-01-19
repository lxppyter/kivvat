import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Req, Get, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthGuard } from '@nestjs/passport';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ default: { limit: 3, ttl: 600000 } }) // 3 attempts per 10 minutes
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 3, ttl: 600000 } }) // 3 attempts per 10 minutes
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getProfile(@Req() req: any) {
    const user = req.user;
    return this.authService.getProfile(user['userId']);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('me')
  updateProfile(@Req() req: any, @Body() dto: UpdateProfileDto) {
    const user = req.user;
    return this.authService.updateProfile(user['userId'], dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Req() req: any) {
    const user = req.user;
    return this.authService.logout(user['userId']);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(@Req() req: any) {
    const user = req.user;
    return this.authService.refreshTokens(user['sub'], user['refreshToken']);
  }
}
