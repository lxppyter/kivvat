import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { AuthGuard } from '@nestjs/passport';
import { SubscriptionGuard } from '../common/guards/subscription.guard';
import { ProGuard } from '../common/guards/pro.guard';

@Controller('vendors')
@UseGuards(AuthGuard('jwt'), SubscriptionGuard, ProGuard)
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Post()
  create(@Request() req: any, @Body() createVendorDto: CreateVendorDto) {
    if (req.user.plan === 'CORE' || req.user.plan === 'FREE') {
        throw new ForbiddenException('Tedarikçi Yönetimi sadece PRO ve ENTERPRISE paketlerde mevcuttur.');
    }
    return this.vendorService.create(req.user.id, createVendorDto);
  }

  @Get()
  findAll(@Request() req: any) {
    return this.vendorService.findAll(req.user.id);
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.vendorService.remove(id, req.user.id);
  }
}
