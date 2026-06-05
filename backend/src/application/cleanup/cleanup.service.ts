import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async handleCron() {
    this.logger.log('Starting daily cleanup of soft-deleted records...');

    const retentionDate = new Date();
    retentionDate.setMonth(retentionDate.getMonth() - 3); // 3 months retention

    try {
      // Cleanup Subjects
      const deletedSubjects = await this.prisma.subject.deleteMany({
        where: {
          deletedAt: {
            lt: retentionDate,
          },
        } as any,
      });
      if (deletedSubjects.count > 0) {
        this.logger.log(`Cleaned up ${deletedSubjects.count} old subjects.`);
      }

      // Cleanup Classes (if applicable, ensuring consistency)
      const deletedClasses = await this.prisma.class.deleteMany({
        where: {
          deletedAt: {
            lt: retentionDate,
          },
        },
      });
      if (deletedClasses.count > 0) {
        this.logger.log(`Cleaned up ${deletedClasses.count} old classes.`);
      }

      this.logger.log('Cleanup finished successfully.');
    } catch (error) {
      this.logger.error('Error during cleanup:', error);
    }
  }
}
