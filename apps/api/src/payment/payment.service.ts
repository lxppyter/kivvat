import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PaymentService {
  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
  ) {}

  async verifyAndActivate(userId: string, licenseKey: string) {
    if (!licenseKey) {
      throw new BadRequestException('Lisans anahtarı boş olamaz.');
    }

    // MOCK VERIFICATION for specific key "PRO-DEMO-KEY"
    // In production, this would make a request to https://api.gumroad.com/v2/licenses/verify
    let isValid = false;
    let targetPlan: 'FREE' | 'CORE' | 'PRO' | 'ENTERPRISE' = 'PRO';

    if (licenseKey === 'PRO-DEMO-KEY') {
      isValid = true;
      targetPlan = 'PRO';
    } else if (licenseKey === 'CORE-DEMO-KEY') {
      isValid = true;
      targetPlan = 'CORE';
    } else if (licenseKey === 'ENT-DEMO-KEY') {
      isValid = true;
      targetPlan = 'ENTERPRISE';
    } else {
        // Uncomment this for real Gumroad verification later
        /*
        try {
            const response = await firstValueFrom(
                this.httpService.post('https://api.gumroad.com/v2/licenses/verify', {
                    product_permalink: process.env.GUMROAD_PRODUCT_PERMALINK,
                    license_key: licenseKey
                })
            );
            isValid = response.data.success && !response.data.purchase.refunded && !response.data.purchase.chargebacked;
            // Map Gumroad Product ID to Plan here if needed
            targetPlan = 'PRO'; 
        } catch (e) {
            isValid = false;
        }
        */
    }

    if (!isValid) {
      throw new BadRequestException('Geçersiz veya süresi dolmuş lisans anahtarı.');
    }

    // CHECK IF ALREADY ACTIVE
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    
    if (!user) {
        throw new BadRequestException('Kullanıcı bulunamadı.');
    }

    if (user.licenseExpiresAt && user.licenseExpiresAt > new Date()) {
        throw new BadRequestException('Mevcut lisansınız devam ediyor. Süreniz dolmadan yeni bir anahtar giremezsiniz.');
    }

    // Activate Plan
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days validation

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        plan: targetPlan,
        licenseKey: licenseKey,
        licenseExpiresAt: expiresAt,
        subscriptionStatus: 'active',
      },
    });

    return { 
        success: true, 
        message: `Hesap 30 günlüğüne ${targetPlan} plana yükseltildi.`,
        expiresAt: expiresAt 
    };
  }
}
