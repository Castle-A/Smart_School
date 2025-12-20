export class CreateAttendanceDto {
  studentId: string;
  date: string; // ISO Date
  status: 'ABSENCE' | 'RETARD' | 'PRESENT';
  reason?: string;
  isJustified?: boolean;
  justification?: string;
}
