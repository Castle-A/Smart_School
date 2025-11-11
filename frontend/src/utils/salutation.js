export function salutation(user) {
    const hour = new Date().getHours();
    const baseGreeting = hour >= 18 || hour < 5 ? 'Bonsoir' : 'Bonjour';
    if (!user)
        return baseGreeting;
    const name = user.firstName || user.lastName || '';
    const g = user.gender;
    if (g === 'MALE')
        return name ? `${baseGreeting} M. ${name}` : baseGreeting;
    if (g === 'FEMALE')
        return name ? `${baseGreeting} Mme ${name}` : baseGreeting;
    if (g === 'OTHER')
        return name ? `${baseGreeting} Mx ${name}` : baseGreeting;
    return name ? `${baseGreeting} ${name}` : baseGreeting;
}
export default salutation;
