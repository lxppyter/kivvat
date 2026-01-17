import { Controller, Get, Post, Body, Patch, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { AssetService } from './asset.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('assets')
@UseGuards(AuthGuard('jwt'))
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Get()
  findAll(@Request() req: any) {
    return this.assetService.findAll(req.user.userId);
  }

  @Post()
  async create(@Request() req: any, @Body() body: any) {
    const { userId, ...data } = body;
    // Force use of authenticated user ID
    return this.assetService.create(req.user.userId, data);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.assetService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.assetService.remove(id);
  }

  @Post('bulk')
  async createBulk(@Request() req: any, @Body() body: { items: any[] }) {
    return this.assetService.createMany(req.user.userId, body.items);
  }
}
