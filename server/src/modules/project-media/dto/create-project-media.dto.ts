import { IsBoolean, IsInt, IsString, Min } from 'class-validator';

export class CreateProjectMediaDto {
    @IsString()
    projectId!: string;

    @IsString()
    mediaId!: string;

    @IsInt()
    @Min(0)
    displayOrder?: number;

    @IsBoolean()
    isCover?: boolean;
}