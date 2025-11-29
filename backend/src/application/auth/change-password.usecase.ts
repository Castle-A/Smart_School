import type { IAuthRepository } from '../../domain/auth/user.entity';
import { User } from '../../domain/auth/user.entity';

export class ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}

export async function changePassword(
    userId: string,
    dto: ChangePasswordDto,
    authRepository: IAuthRepository,
    bcrypt: any
): Promise<void> {
    const user = await authRepository.findById(userId);

    if (!user || !user.password) {
        throw new Error('User not found');
    }

    // Vérifier l'ancien mot de passe
    const isValid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isValid) {
        throw new Error('Current password is incorrect');
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    // Mettre à jour l'utilisateur
    await authRepository.update(userId, {
        password: hashedPassword,
        mustChangePassword: false,
    });
}
