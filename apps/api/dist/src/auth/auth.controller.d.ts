import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
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
            createdAt: Date;
            updatedAt: Date;
            status: string;
            userId: string;
            plan: string;
            startDate: Date;
            endDate: Date | null;
        } | null;
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        companyName: string | null;
        role: string;
    }>;
    logout(req: any): Promise<void>;
    refreshTokens(req: any): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
}
