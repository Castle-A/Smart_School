import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
// import { PdfService } from '../../finance/pdf.service'; // We might need to move this or import it
// import { ISmsProvider } from '../../../infrastructure/sms/interfaces/sms-provider.interface';
// import { IEmailProvider } from '../../communication/interfaces/email-provider.interface';

export interface SubjectData {
  subject: string;
  coefficient: number;
  mtd: number | null;
  grades: number[];
}

@Injectable()
export class BulletinService {
  constructor(
    private prisma: PrismaService,
    // private pdfService: PdfService,
    // @Inject('SMS_PROVIDER') private smsProvider: ISmsProvider,
    // @Inject('EMAIL_PROVIDER') private emailProvider: IEmailProvider
  ) {}

  async generateBulletinData(studentId: string, term: string) {
    // 1. Fetch Student, Class, and Subjects
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      include: {
        class: {
          include: {
            classSubjects: {
              include: { subject: true },
            },
          },
        },
      },
    });

    if (!student || !student.class)
      throw new Error('Student or Class not found');

    // 2. Fetch Grades for the Term
    const grades = await this.prisma.grade.findMany({
      where: {
        studentId,
        term,
      },
      include: { subject: true },
    });

    // 3. Group Grades by Subject
    const subjectGrades = new Map<string, { subject: any; grades: any[] }>();
    student.class.classSubjects.forEach((cs) => {
      subjectGrades.set(cs.subjectId, {
        subject: { ...cs.subject, coefficient: cs.coefficient }, // Use ClassSubject coefficient priority
        grades: [],
      });
    });

    grades.forEach((g) => {
      if (subjectGrades.has(g.subjectId)) {
        subjectGrades.get(g.subjectId)!.grades.push(g);
      }
    });

    // 4. Calculate Averages (MTD) per Subject
    const subjectsData: SubjectData[] = [];
    let totalWeightedMtd = 0;
    let totalCoefficients = 0;

    for (const [subjectId, data] of subjectGrades.entries()) {
      const { subject, grades } = data;
      const mtd = this.calculateSubjectAverage(grades);

      if (mtd !== null) {
        subjectsData.push({
          subject: subject.name,
          coefficient: subject.coefficient,
          mtd: parseFloat(mtd.toFixed(2)),
          grades: grades.map((g) => g.value), // Just for debug/display
        });

        totalWeightedMtd += mtd * subject.coefficient;
        totalCoefficients += subject.coefficient;
      } else {
        subjectsData.push({
          subject: subject.name,
          coefficient: subject.coefficient,
          mtd: null,
          grades: [],
        });
      }
    }

    // 5. Calculate General Average (MGT)
    const mgt =
      totalCoefficients > 0 ? totalWeightedMtd / totalCoefficients : null;

    return {
      student: {
        firstName: student.firstName,
        lastName: student.lastName,
        matricule: student.matricule,
        class: student.class.name,
      },
      term,
      subjects: subjectsData,
      mgt: mgt ? parseFloat(mgt.toFixed(2)) : null,
    };
  }

  /**
   * Calculates Moyenne Trimestrielle par Discipline (MTD) based on Arreté 089.
   * MTD = (MEPE + Sum(Devoirs)) / (1 + Count(Devoirs))
   * MEPE = Average of Interrogations
   */
  private calculateSubjectAverage(grades: any[]): number | null {
    const interrogations = grades.filter((g) => g.type === 'INTERROGATION');
    const devoirs = grades.filter((g) => g.type === 'DEVOIR');

    if (interrogations.length === 0 && devoirs.length === 0) return null;

    // 1. Calculate MEPE (Moyenne des Evaluations Ponctuelles d'Etape)
    let mepe: number | null = null;
    if (interrogations.length > 0) {
      const sumInterros = interrogations.reduce((sum, g) => sum + g.value, 0);
      mepe = sumInterros / interrogations.length;
    }

    // 2. Calculate MTD
    // Formula: (MEPE + Devoir1 + Devoir2 + ...) / (1 + Rate of Devoirs)
    // MEPE counts as ONE grade.

    let sumNumerators = 0;
    let denominator = 0;

    if (mepe !== null) {
      sumNumerators += mepe;
      denominator += 1;
    }

    const sumDevoirs = devoirs.reduce((sum, g) => sum + g.value, 0);
    sumNumerators += sumDevoirs;
    denominator += devoirs.length;

    if (denominator === 0) return null;

    return sumNumerators / denominator;
  }
}
