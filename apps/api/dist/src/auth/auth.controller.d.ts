import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    getProfile(req: any): Promise<{
        subscription: {
            id: string;
            plan: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            status: string;
            startDate: Date;
            endDate: Date | null;
        } | null;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        id: string;
        licenseKey: string | null;
        name: string | null;
        companyName: string | null;
        plan: import("@prisma/client").$Enums.Plan;
        licenseExpiresAt: Date | null;
        subscriptionStatus: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(req: any, dto: UpdateProfileDto): Promise<{
        email: string;
        role: import("@prisma/client").$Enums.Role;
        id: string;
        licenseKey: string | null;
        name: string | null;
        companyName: string | null;
        plan: import("@prisma/client").$Enums.Plan;
        licenseExpiresAt: Date | null;
        subscriptionStatus: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    logout(req: any): Promise<void>;
    refreshTokens(req: any): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
}
