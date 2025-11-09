export type School = {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email: string;
};

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  role: string;
  schoolId: string;
  schoolName: string; // On garde ça pour le profil
  school?: School;      // *** AJOUTER : relation optionnelle avec l'école ***
  avatarUrl?: string;
  studentProfile?: StudentProfile;
  teacherProfile?: TeacherProfile;
  // ... autres profils
};

export type StudentProfile = {
  id: string;
  matricule: string;
  classId?: string;
};

export type TeacherProfile = {
  id: string;
  hireDate: Date;
  salary?: number;
  subjectsTaught?: Subject[];
};

export type Subject = {
  id: string;
  name: string;
  code?: string;
};