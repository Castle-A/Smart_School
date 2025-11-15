export class CreatePlanDto {
  name: string;
  price: number;
  durationInMonths: number;
  features: object; // On utilise 'object' pour un champ JSON
}
