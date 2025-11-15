import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import Toast from '../../components/Toast';
import PasswordField from '../../components/PasswordField';

const schema = yup.object().shape({
  newPassword: yup.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères').required('Mot de passe requis'),
  confirmPassword: yup.string().oneOf([yup.ref('newPassword')], 'Les mots de passe doivent correspondre'),
});

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const { setMustChangePassword } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      await authService.changePassword(data.newPassword);
      // clear flag in context and localStorage
      setMustChangePassword(false);
      localStorage.setItem('must_change_password', 'false');
      // Show an inline success popup and redirect shortly after
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/dashboard');
      }, 1300);
    } catch (err: unknown) {
      const message = typeof err === 'object' && err !== null && 'message' in err ? String((err as any).message) : 'Erreur';
      alert('Erreur: ' + message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Toast message="Mot de passe mis à jour avec succès. Redirection…" type="success" visible={showSuccess} onClose={() => setShowSuccess(false)} />
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold">Veuillez changer votre mot de passe</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Nouveau mot de passe</label>
            <PasswordField {...register('newPassword')} className="mt-1 block w-full px-3 py-2 border rounded" />
            {errors.newPassword && <p className="text-sm text-red-600">{errors.newPassword.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Confirmer le mot de passe</label>
            <PasswordField {...register('confirmPassword')} className="mt-1 block w-full px-3 py-2 border rounded" />
            {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>}
          </div>
          <div>
            <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded">Changer le mot de passe</button>
          </div>
        </form>
      </div>
    </div>
  );
}
