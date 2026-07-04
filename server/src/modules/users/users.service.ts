import { PrismaService } from '@/database/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
// import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {

    constructor(private readonly prisma: PrismaService) { }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email }
        })
    }

    async findById(id: string) {

        const user = await this.prisma.user.findUnique({
            where: { id }
        })

        if (!user) {
            throw new NotFoundException("User not found")
        }

        return user;
    }

    // create(data: CreateUserDto) {
    //     return this.prisma.user.create({
    //         data
    //     })
    // }

    async update(id: string, data: UpdateProfileDto) {
        return this.prisma.user.update({
            where: { id },
            data
        })
    }

    async updateRefreshToken(id: string, refreshTokenHash: string | null) {
        return this.prisma.user.update({
            where: { id },
            data: {
                refreshTokenHash
            }
        })
    }
}
