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

    // GUMROAD VERIFICATION
    let targetPlan: 'FREE' | 'CORE' | 'PRO' | 'ENTERPRISE' = 'FREE';
    let isValid = false;

    // 1. Check Mock Keys (for dev/demo only)
    if (licenseKey === 'PRO-DEMO-KEY') {
      isValid = true; targetPlan = 'PRO';
    } else if (licenseKey === 'CORE-DEMO-KEY') {
      isValid = true; targetPlan = 'CORE';
    } else if (licenseKey === 'ENT-DEMO-KEY') {
      isValid = true; targetPlan = 'ENTERPRISE';
    } else {
        // 2. Real Gumroad API Call
        try {
            const productId = 'dV72n1PSrXX6iAIeWSTIbw=='; // Provided by User
            console.log(`[Gumroad] Verifying Key: ${licenseKey} against Product ID: ${productId}`);
            
            const response = await firstValueFrom(
                this.httpService.post('https://api.gumroad.com/v2/licenses/verify', {
                    product_id: productId,
                    license_key: licenseKey
                })
            );

            const data = response.data;
            
            // Check if success and not refunded/chargebacked
            if (data.success && !data.purchase.refunded && !data.purchase.chargebacked) {
                isValid = true;
                
                // 3. Variant Check (Which plan is it?)
                // Gumroad variants format: "Tier: Trust Architect (Monthly)"
                const variants = data.purchase.variants || '';
                const variantString = JSON.stringify(variants).toLowerCase();

                // Explicit Mapping based on User's Gumroad naming
                if (variantString.includes('total authority')) {
                    targetPlan = 'ENTERPRISE';
                } else if (variantString.includes('trust architect')) {
                    targetPlan = 'PRO';
                } else if (variantString.includes('compliance core')) {
                    targetPlan = 'CORE';
                } else {
                    // Fallback logic if names slightly mismatch, trying to catch partials
                    if (variantString.includes('architect')) targetPlan = 'PRO';
                    else if (variantString.includes('authority')) targetPlan = 'ENTERPRISE';
                    else targetPlan = 'CORE'; // Safe default for entry level
                }
            }
        } catch (e) {
            const gumroadError = e.response?.data?.message || e.message;
            console.error('Gumroad Verification Failed:', gumroadError);
            throw new BadRequestException(`Gumroad Hatası: ${gumroadError}`);
        }
    }

    if (!isValid) {
      throw new BadRequestException('Geçersiz, iade edilmiş veya süresi dolmuş lisans anahtarı.');
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
        subscription: {
          update: {
            plan: targetPlan,
            status: 'ACTIVE'
          }
        }
      },
    });

    return { 
        success: true, 
        message: `Lisans başarıyla doğrulandı! Hesap ${targetPlan} paketine yükseltildi.`,
        plan: targetPlan,
        expiresAt: expiresAt 
    };
  }
}
