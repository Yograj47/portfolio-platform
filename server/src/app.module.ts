import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { configuration, envValidationSchema } from "./config";
import { APP_FILTER, APP_INTERCEPTOR, Reflector } from "@nestjs/core";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { PrismaModule } from "./database/prisma/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { CategoryModule } from './modules/category/category.module';
import { SkillModule } from './modules/skill/skill.module';
import { TimelineModule } from './modules/timeline/timeline.module';
import { ProjectModule } from './modules/project/project.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
            expandVariables: true,
            envFilePath: ".env",
            load: configuration,
            validationSchema: envValidationSchema
        }),
        PrismaModule,
        AuthModule,
        UsersModule,
        CategoryModule,
        SkillModule,
        TimelineModule,
        ProjectModule
    ],

    providers: [
        {
            provide: APP_INTERCEPTOR,
            useFactory: (reflector: Reflector) => new ResponseInterceptor(reflector),
            inject: [Reflector]
        },
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        }
    ]
})
export class AppModule { }

