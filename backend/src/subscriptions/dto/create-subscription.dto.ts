export class CreateSubscriptionDto {
  schoolId: string;
  planId: string;
  startDate: string; // On utilise une chaîne pour la date, ex: "2024-12-31T23:59:59.000Z"
}
