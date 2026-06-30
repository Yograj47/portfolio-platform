import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { configuration, envValidationSchema } from "./config";
import { APP_FILTER, APP_INTERCEPTOR, Reflector } from "@nestjs/core";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
            expandVariables: true,
            envFilePath: ".env",
            load: configuration,
            validationSchema: envValidationSchema
        })
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

