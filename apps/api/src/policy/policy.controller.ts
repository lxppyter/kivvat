import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request, Inject, Query } from '@nestjs/common';
import { PolicyService } from './policy.service';
import { AuthGuard } from '@nestjs/passport'; // Use standard guard
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionGuard } from '../common/guards/subscription.guard';

@Controller('policies')
export class PolicyController {
  constructor(
      private readonly policyService: PolicyService,
      private readonly prisma: PrismaService
  ) {}

  @Get('templates')
  @UseGuards(AuthGuard('jwt'), SubscriptionGuard)
  async getTemplates() {
    return this.policyService.getTemplates();
  }

  @Get('assignments')
  @UseGuards(AuthGuard('jwt'), SubscriptionGuard)
  async getAssignments(@Query('userId') userId?: string) {
    return this.policyService.getAssignments(userId);
  }
  
  @Get('download/:id')
  @UseGuards(AuthGuard('jwt'), SubscriptionGuard)
  async downloadTemplate(@Param('id') id: string, @Query('companyName') companyName: string) {
    return this.policyService.downloadTemplate(id, companyName || 'ACME Corp');
  }

  @Post('sign/:id')
  @UseGuards(AuthGuard('jwt'), SubscriptionGuard)
  async signPolicy(@Param('id') id: string) {
    return this.policyService.signPolicy(id);
  }

  @Get('signatures')
  @UseGuards(AuthGuard('jwt'), SubscriptionGuard)
  async getSignaturesStatus() {
      // Logic: Get all users and their policy assignments
      const users = await this.prisma.user.findMany({
          include: {
              policyAssignments: {
                  include: { policy: true }
              }
          }
      });

      // Transform for UI
      // TODO: Include public signers in this list too?
      // For now, let's append public signers separately or mix them.
      
      const publicSignatures = await this.prisma.policyAssignment.findMany({
          where: { userId: null } as any,
          include: { policy: true }
      });

      // Metric: Total Active Policies
      const totalPoliciesCount = await this.prisma.policyTemplate.count();

      const userStats = users.map(u => ({
          id: u.id,
          name: u.name || u.email,
          email: u.email,
          role: u.role,
          signedCount: u.policyAssignments.filter(pa => pa.status === 'SIGNED').length,
          totalPolicies: totalPoliciesCount, // Real count
          lastSigned: u.policyAssignments.length > 0 ? u.policyAssignments[0].signedAt : null,
          status: u.policyAssignments.filter(pa => pa.status === 'SIGNED').length >= totalPoliciesCount ? 'COMPLIANT' : 'PENDING'
      }));

      // Group Public Signers by Email
      const publicSignersMap = new Map<string, { name: string, email: string, assignments: any[] }>();
      
      publicSignatures.forEach((ps: any) => {
          const email = ps.signerEmail || 'Unknown';
          if (!publicSignersMap.has(email)) {
              publicSignersMap.set(email, {
                  name: ps.signerName || 'Guest',
                  email: email,
                  assignments: []
              });
          }
          publicSignersMap.get(email)!.assignments.push(ps);
      });

      const publicStats = Array.from(publicSignersMap.values()).map(singer => {
          // Count distinct policies signed
          const distinctSigned = new Set(singer.assignments.map(a => a.policyId)).size;
          
          return {
              id: singer.email, 
              name: singer.name,
              email: singer.email,
              role: 'GUEST',
              signedCount: distinctSigned,
              totalPolicies: totalPoliciesCount, // Denominator is ALL policies
              lastSigned: singer.assignments.sort((a,b) => b.signedAt.getTime() - a.signedAt.getTime())[0]?.signedAt,
              status: distinctSigned >= totalPoliciesCount ? 'COMPLIANT' : 'PENDING'
          };
      });

      return [...userStats, ...publicStats];
  }

  @Post(':id') 
  @UseGuards(AuthGuard('jwt'), SubscriptionGuard)
  async updatePolicy(@Param('id') id: string, @Body('content') content: string) {
    return this.policyService.updatePolicy(id, content);
  }

  @Get(':id/history')
  @UseGuards(AuthGuard('jwt'), SubscriptionGuard)
  async getHistory(@Param('id') id: string) {
    return this.policyService.getHistory(id);
  }
  
  // --- SHARE ENDPOINTS (Protected) ---
  @Get('shares')
  @UseGuards(AuthGuard('jwt'), SubscriptionGuard)
  async getShares() {
      return this.policyService.getShares();
  }

  @Delete('share/:id') 
  @UseGuards(AuthGuard('jwt'), SubscriptionGuard)
  async revokeShare(@Param('id') id: string) {
      return this.policyService.revokeShare(id);
  }

  @Post('share/all')
  @UseGuards(AuthGuard('jwt'), SubscriptionGuard)
  async createShareAllLink(@Body() body: { expiresAt?: string }) {
      return this.policyService.createShareLink(undefined, body?.expiresAt);
  }

  @Post(':id/share')
  @UseGuards(AuthGuard('jwt'), SubscriptionGuard)
  async createShareLink(@Param('id') id: string, @Body() body: { expiresAt?: string }) {
      return this.policyService.createShareLink(id, body?.expiresAt);
  }

  // --- PUBLIC ENDPOINTS (No Guard) ---
  
  @Get('public/:token')
  async getPublicPolicy(@Param('token') token: string) {
      return this.policyService.getPublicPolicy(token);
  }

  @Post('public/:token/sign')
  async signPublicPolicy(@Param('token') token: string, @Body() body: { name: string, email: string, policyId?: string }) {
      return this.policyService.signPublicPolicy(token, body.name, body.email, body.policyId);
  }
}
