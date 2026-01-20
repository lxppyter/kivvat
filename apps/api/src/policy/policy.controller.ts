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
  async getAssignments(@Request() req: any, @Query('userId') queryUserId?: string) {
    // SECURITY: Force current user unless Admin
    const user = req.user;
    const targetId = (user.role === 'ADMIN' || user.role === 'AUDITOR') && queryUserId 
        ? queryUserId 
        : (user.userId || user.id);
        
    return this.policyService.getAssignments(targetId);
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
  async getSignaturesStatus(@Request() req: any) {
      const user = req.user;
      const userId = user.userId || user.id;
      
      // Filter logic: 
      // ADMIN/AUDITOR -> See ALL
      // STAFF -> See themselves + Public Signers they own (ownerId = userId)

      // 1. Get Registered Users (Self or All)
      const usersWhere = (user.role === 'ADMIN' || user.role === 'AUDITOR') 
          ? {} 
          : { id: userId }; 

      const users = await this.prisma.user.findMany({
          where: usersWhere,
          include: {
              policyAssignments: {
                  include: { policy: true },
                  where: { status: 'SIGNED' }
              }
          }
      });

      // 2. Get Public Signatures (Owned by me or All)
      let publicSignaturesWhere: any = { userId: null };
      if (user.role !== 'ADMIN' && user.role !== 'AUDITOR') {
          publicSignaturesWhere['ownerId'] = userId;
      }

      const publicSignatures = await this.prisma.policyAssignment.findMany({
          where: publicSignaturesWhere,
          include: { policy: true }
      });

      // Metric: Total Active Policies
      const totalPoliciesCount = await this.prisma.policyTemplate.count();

      const userStats = users.map(u => {
          const signedAssignments = u.policyAssignments.filter(pa => pa.status === 'SIGNED');
          const lastAssignment = signedAssignments.sort((a,b) => (b.signedAt?.getTime() || 0) - (a.signedAt?.getTime() || 0))[0];

          return {
            id: u.id,
            name: u.name || u.email,
            email: u.email,
            role: u.role,
            signedCount: signedAssignments.length,
            totalPolicies: totalPoliciesCount, // Real count
            lastSigned: lastAssignment?.signedAt,
            lastIp: (lastAssignment as any)?.ipAddress,
            lastUserAgent: (lastAssignment as any)?.userAgent,
            status: signedAssignments.length >= totalPoliciesCount ? 'COMPLIANT' : 'PENDING'
          };
      });

      // Map Registered Emails to UserStats Index for merging
      const emailToUserMap = new Map<string, any>();
      userStats.forEach(u => {
          if (u.email) emailToUserMap.set(u.email, u);
      });

      // Group Public Signers by Email
      const publicSignersMap = new Map<string, { name: string, email: string, assignments: any[] }>();
      
      publicSignatures.forEach((ps: any) => {
          const email = ps.signerEmail || 'Unknown';
          
          // DEDUPLICATION: If this email belongs to a registered user, merge it!
          if (emailToUserMap.has(email)) {
             const userStat = emailToUserMap.get(email);
             
             // Check if this specific policy is already counted in signedCount? 
             // userStat.signedCount is based on INTERNAL assignments.
             // If the user signed via LINK, it's a PUBLIC assignment.
             // So we should increment the count logic carefully to avoid double counting if they somehow have both?
             // But usually they won't have both signed.
             
             // Simple approach: Treat it as an additional signature
             // However, we want unique policies.
             // Ideally we should have fetched ALL assignments (public & private) for the user in step 1, but step 1 only looks at `u.policyAssignments` (internal).
             // So, we can safely just "add" this public signature to the user's "virtual" list.
             
             userStat.signedCount += 1; // Increment count
             
             // Update Last Signed if newer
             const psDate = new Date(ps.signedAt).getTime();
             const userDate = userStat.lastSigned ? new Date(userStat.lastSigned).getTime() : 0;
             
             if (psDate > userDate) {
                 userStat.lastSigned = ps.signedAt;
                 userStat.lastIp = (ps as any).ipAddress;
                 userStat.lastUserAgent = (ps as any).userAgent;
             }
             
             // Re-evaluate status
             if (userStat.signedCount >= userStat.totalPolicies) {
                 userStat.status = 'COMPLIANT';
             }
             
             return; // Skip adding to Public/Guest list
          }

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
          const lastAssignment = singer.assignments.sort((a,b) => new Date(b.signedAt).getTime() - new Date(a.signedAt).getTime())[0];

          return {
              id: singer.email, 
              name: singer.name,
              email: singer.email,
              role: 'GUEST',
              signedCount: distinctSigned,
              totalPolicies: totalPoliciesCount, // Denominator is ALL policies
              lastSigned: lastAssignment?.signedAt,
              lastIp: (lastAssignment as any)?.ipAddress,
              lastUserAgent: (lastAssignment as any)?.userAgent,
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
  async getShares(@Request() req: any) {
      return this.policyService.getShares(req.user.userId || req.user.id);
  }

  @Delete('share/:id') 
  @UseGuards(AuthGuard('jwt'), SubscriptionGuard)
  async revokeShare(@Param('id') id: string) {
      return this.policyService.revokeShare(id);
  }

  @Post('share/all')
  @UseGuards(AuthGuard('jwt'), SubscriptionGuard)
  async createShareAllLink(@Request() req: any, @Body() body: { expiresAt?: string }) {
      return this.policyService.createShareLink(undefined, body?.expiresAt, req.user.userId || req.user.id);
  }

  @Post(':id/share')
  @UseGuards(AuthGuard('jwt'), SubscriptionGuard)
  async createShareLink(@Param('id') id: string, @Request() req: any, @Body() body: { expiresAt?: string }) {
      return this.policyService.createShareLink(id, body?.expiresAt, req.user.userId || req.user.id);
  }

  // --- PUBLIC ENDPOINTS (No Guard) ---
  
  @Get('public/:token')
  async getPublicPolicy(@Param('token') token: string) {
      return this.policyService.getPublicPolicy(token);
  }

  @Post('public/:token/sign')
  async signPublicPolicy(@Param('token') token: string, @Body() body: { name: string, email: string, policyId?: string }, @Request() req: any) {
      const ip = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'];
      return this.policyService.signPublicPolicy(token, body.name, body.email, body.policyId, ip, userAgent);
  }
}
