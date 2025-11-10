export function salutation(user) {
    if (!user)
        return 'Bonjour';
    const name = user.firstName || user.lastName || '';
    const g = user.gender;
    if (g === 'MALE')
        return name ? `M. ${name}` : 'Bonjour';
    if (g === 'FEMALE')
        return name ? `Mme ${name}` : 'Bonjour';
    if (g === 'OTHER')
        return name ? `Mx ${name}` : 'Bonjour';
    return name ? `Bonjour ${name}` : 'Bonjour';
}
export default salutation;
