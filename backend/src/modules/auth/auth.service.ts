import { ConflictException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/user.dto';
import { User } from '../../enitites/user.entity';
import { LoginDto, RegisterDto } from './auth.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    private BCRYPT_SALT_ROUNDS: number;
    private readonly logger = new Logger('AuthService');

    constructor(
        private readonly usersService: UsersService,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) {
        this.BCRYPT_SALT_ROUNDS = this.configService.get<number>('BCRYPT_SALT_ROUNDS') ?? 10;
        console.log(this.BCRYPT_SALT_ROUNDS)
    }

    private async hashPassword(password: string): Promise<string> {
        this.logger.debug(`hash password: ${password}, ${this.BCRYPT_SALT_ROUNDS}`);
        return bcrypt.hash(password, Number(this.BCRYPT_SALT_ROUNDS));
    }

    private generateAccessToken(user: User): string {
        const payload = { sub: user.id, email: user.email };
        return this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
            expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES') || '10m',
        });
    }

    private generateRefreshToken(user: User): string {
        const payload = { sub: user.id };
        return this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES') || '7d',
        });
    }

    async register(registerDto: RegisterDto) {
        const existingUser = await this.usersService.findByEmail(registerDto.email);

        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        const userDto = new CreateUserDto();

        userDto.email = registerDto.email;
        userDto.passwordHash = await this.hashPassword(registerDto.password);

        const user = await this.usersService.createUser(userDto);
        this.logger.log(`New user registered: ${registerDto.email}`);

        return {
            user,
            accessToken: this.generateAccessToken(user),
            refreshToken: this.generateRefreshToken(user),
        };
    }

    async login(loginDto: LoginDto) {
        const user = await this.usersService.findByEmail(loginDto.email);

        if (!user) {
            throw new NotFoundException('User with this email not found');
        }

        const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        this.logger.log(`New user login: ${loginDto.email}`);

        return {
            user,
            accessToken: this.generateAccessToken(user),
            refreshToken: this.generateRefreshToken(user),
        };
    }
}
