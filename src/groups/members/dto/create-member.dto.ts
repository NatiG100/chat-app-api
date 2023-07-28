import { IsInt } from "class-validator";

export class CreateMemberDto {
    @IsInt()
    userId:number
}
