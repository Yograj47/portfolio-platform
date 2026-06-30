import { PrismaService } from '@/database/prisma/prisma.service';
import { Body, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { RefreshTokenDto } from '../auth/dto/refresh-token.dto';

@Injectable()
export class UsersService {

    constructor(private readonly prisma: PrismaService) { }

    create(dto: CreateUserDto) { }
    findById(id: string) { }
    findByEmail(email: string) { }
    update(id: string, dto: UpdateProfileDto) { }
    updateRefreshToken(userId: string, hash: RefreshTokenDto) { }
    removeRefreshToken(userId: string) { }

}
