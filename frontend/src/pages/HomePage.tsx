import { Link } from 'react-router-dom';

const HomePage = () => (
  <div>
    <h1 className="text-2xl font-bold">Accueil</h1>
    <p>Bienvenue sur Smart School.</p>
    <Link to="/dashboard" className="text-blue-500">Aller au tableau de bord</Link>
  </div>
);

export default HomePage;
