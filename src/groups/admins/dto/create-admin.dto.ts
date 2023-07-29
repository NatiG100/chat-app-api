import { IsInt } from "class-validator";

export class CreateAdminDto {
    @IsInt()
    userId:number
}
