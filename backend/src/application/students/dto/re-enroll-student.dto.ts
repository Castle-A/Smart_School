import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class ReEnrollStudentDto {
  @IsString()
  @IsNotEmpty()
  classId: string; // Nouvelle classe

  @IsString()
  @IsNotEmpty()
  categoryId: string; // Profil tarifaire (ex: "Anciens Élèves")

  @IsOptional()
  payment?: {
    registrationAmount: number;
    tuitionAmount: number;
    method: string; // CASH, MOMO, ORANGE, CARD
  };
}
