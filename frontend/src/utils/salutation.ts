import type { User } from '../types';

export function salutation(user?: User | null): string {
  const hour = new Date().getHours();
  const baseGreeting = hour >= 18 || hour < 5 ? 'Bonsoir' : 'Bonjour';

  if (!user) return baseGreeting;

  const name = user.firstName || user.lastName || '';
  const g = (user as unknown as { gender?: string }).gender as string | undefined;

  if (g === 'MALE') return name ? `${baseGreeting} M. ${name}` : baseGreeting;
  if (g === 'FEMALE') return name ? `${baseGreeting} Mme ${name}` : baseGreeting;
  if (g === 'OTHER') return name ? `${baseGreeting} Mx ${name}` : baseGreeting;

  return name ? `${baseGreeting} ${name}` : baseGreeting;
}

export default salutation;
