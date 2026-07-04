import { IsNumber, IsString } from "class-validator";

export class CreateSkillDto {
    @IsString()
    name!: string

    @IsString()
    icon?: string

    @IsString()
    color?: string

    @IsNumber()
    level!: number

    @IsNumber()
    displayOrder!: number
}
