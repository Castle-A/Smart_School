import * as bcrypt from 'bcrypt';

/**
 * Utilitaire centralisé pour la gestion sécurisée des mots de passe.
 * Gère le hachage, la vérification et la génération de mots de passe temporaires.
 */
export class PasswordUtil {
    private static readonly SALT_ROUNDS = 10;

    /**
     * Hache un mot de passe de manière sécurisée.
     * @param password Le mot de passe en clair.
     * @returns Le hachage du mot de passe.
     */
    static async hash(password: string): Promise<string> {
        return bcrypt.hash(password, this.SALT_ROUNDS);
    }

    /**
     * Vérifie si un mot de passe en clair correspond à un hachage.
     * @param password Le mot de passe en clair.
     * @param hash Le hachage stocké.
     * @returns Vrai si le mot de passe correspond, sinon faux.
     */
    static async compare(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    /**
     * Génère un mot de passe temporaire aléatoire.
     * @params length La longueur du mot de passe (défaut: 8).
     * @returns Un mot de passe aléatoire.
     */
    static generateTemporary(length: number = 8): string {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'; // Exclut les caractères confus (I, l, 1, O, 0)
        let password = '';
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }
}
