import type { User } from '../types';

export function salutation(user?: User | null): string {
  if (!user) return 'Bonjour';
  const name = user.firstName || user.lastName || '';
  const g = (user as any).gender as string | undefined;
  if (g === 'MALE') return name ? `M. ${name}` : 'Bonjour';
  if (g === 'FEMALE') return name ? `Mme ${name}` : 'Bonjour';
  if (g === 'OTHER') return name ? `Mx ${name}` : 'Bonjour';
  return name ? `Bonjour ${name}` : 'Bonjour';
}

export default salutation;
