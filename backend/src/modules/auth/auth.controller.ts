import { Body, Controller, Get, NotFoundException, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './auth.dto';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { UsersService } from '../users/users.service';
import { instanceToPlain } from 'class-transformer';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
    ) {}

    @Public()
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return await this.authService.login(loginDto);
    }

    @Public()
    @Post('register')
    async create(@Body() registerDto: RegisterDto) {
        return await this.authService.register(registerDto);
    }

    @Get('profile')
    async getProfile(@CurrentUser() sub: any) {
        console.log('Decoded token:', sub);

        const user = await this.usersService.findOneById(parseInt(sub.userId));

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return instanceToPlain(user);
    }
}
