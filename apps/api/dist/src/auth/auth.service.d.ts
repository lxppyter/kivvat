import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    register(dto: RegisterDto): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    logout(userId: string): Promise<void>;
    refreshTokens(userId: string, refreshToken: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    updateRefreshToken(userId: string, refreshToken: string): Promise<void>;
    getTokens(userId: string, email: string, role: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    getProfile(userId: string): Promise<{
        subscription: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            status: string;
            plan: string;
            startDate: Date;
            endDate: Date | null;
        } | null;
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        licenseKey: string | null;
        companyName: string | null;
        role: import("@prisma/client").$Enums.Role;
        plan: import("@prisma/client").$Enums.Plan;
        licenseExpiresAt: Date | null;
        subscriptionStatus: string | null;
    }>;
    updateProfile(userId: string, dto: {
        name?: string;
        password?: string;
    }): Promise<{
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        licenseKey: string | null;
        companyName: string | null;
        role: import("@prisma/client").$Enums.Role;
        plan: import("@prisma/client").$Enums.Plan;
        licenseExpiresAt: Date | null;
        subscriptionStatus: string | null;
    }>;
}
