import { Controller, Post, Body, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('payment')
@UseGuards(AuthGuard('jwt'))
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('activate')
  @HttpCode(HttpStatus.OK)
  async activateLicense(@Req() req: any, @Body('licenseKey') licenseKey: string) {
    return this.paymentService.verifyAndActivate(req.user.id, licenseKey);
  }
}
