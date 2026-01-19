import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { IncidentService } from './incident.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { AuthGuard } from '@nestjs/passport';
import { SubscriptionGuard } from '../common/guards/subscription.guard';
import { ProGuard } from '../common/guards/pro.guard';

@Controller('incidents')
@UseGuards(AuthGuard('jwt'), SubscriptionGuard, ProGuard)
export class IncidentController {
  constructor(private readonly incidentService: IncidentService) {}

  @Post()
  create(@Request() req: any, @Body() createIncidentDto: CreateIncidentDto) {
    if (req.user.plan === 'CORE' || req.user.plan === 'FREE') {
        throw new ForbiddenException('Olay Yönetimi (Incidents) sadece PRO ve ENTERPRISE paketlerde mevcuttur.');
    }
    return this.incidentService.create(req.user.id, createIncidentDto);
  }

  @Get()
  findAll(@Request() req: any) {
    return this.incidentService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.incidentService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(@Request() req: any, @Param('id') id: string, @Body() updateIncidentDto: UpdateIncidentDto) {
    return this.incidentService.update(id, req.user.id, updateIncidentDto);
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.incidentService.remove(id, req.user.id);
  }
}
