import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/user.dto';
import { User } from '../../enitites/user.entity';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService) {}

    async register(createUserDto: CreateUserDto): Promise<User> {
        return this.usersService.createUser(createUserDto);
    }
}
