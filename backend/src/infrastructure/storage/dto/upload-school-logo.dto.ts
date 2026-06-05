import { IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO pour l'upload du logo de l'école
 */
export class UploadSchoolLogoDto {
  @IsNotEmpty()
  @IsString()
  schoolId: string;
}
