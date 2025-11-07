import { Link } from 'react-router-dom';

const RegisterPage = () => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Créer votre compte</h2>
          <p className="mt-2 text-sm text-gray-600">
            Ou{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              connectez-vous à votre compte existant
            </Link>
          </p>
        </div>
        {/* Le formulaire d'inscription viendra ici */}
        <p className="text-center text-gray-500">Formulaire d'inscription à venir...</p>
      </div>
    </div>
  );
};

export default RegisterPage;