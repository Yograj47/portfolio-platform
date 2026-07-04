import { NestFactory } from '@nestjs/core';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../src/app.module'; // Adjust this path to your main AppModule
import { PrismaService } from '@/database/prisma/prisma.service';

async function main() {
    console.log('🌱 Starting database seeding via NestJS Context...');

    // 1. Bootstrap the NestJS application context (without starting the HTTP server)
    const app = await NestFactory.createApplicationContext(AppModule);

    // 2. Retrieve your configured PrismaService instance
    const prisma = app.get(PrismaService);

    // 3. Read variables from the environment (loaded automatically by NestJS Config or dotenv)
    const adminName = process.env.ADMIN_NAME;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminName || !adminEmail || !adminPassword) {
        console.error(
            '❌ Missing required environment variables: ADMIN_NAME, ADMIN_EMAIL, or ADMIN_PASSWORD.'
        );
        await app.close();
        process.exit(1);
    }

    // 4. Hash the admin password securely
    console.log('🔐 Hashing admin password...');
    const saltRounds = 10;
    const hashedAdminPassword = await bcrypt.hash(adminPassword, saltRounds);

    // 5. Run the idempotent upsert via your Service layer
    console.log(`👤 Upserting admin user: ${adminEmail}...`);
    const adminUser = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {
            name: adminName,
            passwordHash: hashedAdminPassword,
        },
        create: {
            name: adminName,
            email: adminEmail,
            passwordHash: hashedAdminPassword,
        },
    });

    console.log(`✅ Admin user successfully processed (ID: ${adminUser.id})`);
    console.log('✨ Seeding completed successfully!');

    // 6. Gracefully tear down the NestJS application context
    await app.close();
}

main()
    .catch((e) => {
        console.error('❌ Seeding error:', e);
        process.exit(1);
    });