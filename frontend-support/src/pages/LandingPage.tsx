import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';


export default function LandingPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await login(identifier, password);
            navigate('/inbox');
        } catch (err) {
            setError('Identifiants invalides ou accès non autorisé.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-full bg-slate-950 flex overflow-hidden font-sans text-slate-100">
            {/* Left Side - Hero / Visuals */}
            <div className="hidden lg:flex w-1/2 relative flex-col justify-center items-center p-12 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute top-0 left-0 w-full h-full bg-slate-950 z-0" />
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full z-0 animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-600/10 blur-[100px] rounded-full z-0" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 text-center space-y-6 max-w-lg"
                >
                    <div className="inline-flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl mb-8 shadow-2xl">
                        <ShieldCheck className="w-16 h-16 text-blue-500" />
                    </div>
                    <h1 className="text-5xl font-black tracking-tight bg-gradient-to-br from-white to-slate-500 bg-clip-text text-transparent">
                        SmartSchool Support
                    </h1>
                    <p className="text-lg text-slate-400 leading-relaxed font-medium">
                        Plateforme dédiée à l'assistance technique et à la gestion des incidents pour l'écosystème SmartSchool.
                    </p>
                </motion.div>

                {/* Grid Pattern Overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0 pointer-events-none mix-blend-overlay"></div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-slate-950/50 backdrop-blur-sm relative border-l border-slate-900/50">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full max-w-md space-y-8"
                >
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold tracking-tight">Connexion</h2>
                        <p className="mt-2 text-slate-400">Accédez à votre espace support</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 ml-1">Identifiant</label>
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl opacity-0 group-hover:opacity-30 transition duration-500 blur"></div>
                                    <div className="relative flex items-center bg-slate-900 border border-slate-800 rounded-xl px-4 py-3.5 focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 transition-all">
                                        <Mail className="w-5 h-5 text-slate-500 mr-3" />
                                        <input
                                            type="text"
                                            placeholder="Email ou Téléphone"
                                            value={identifier}
                                            onChange={(e) => setIdentifier(e.target.value)}
                                            className="bg-transparent border-none w-full text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-0 text-sm font-medium"
                                            required
                                            autoComplete="username"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 ml-1">Mot de passe</label>
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl opacity-0 group-hover:opacity-30 transition duration-500 blur"></div>
                                    <div className="relative flex items-center bg-slate-900 border border-slate-800 rounded-xl px-4 py-3.5 focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 transition-all">
                                        <Lock className="w-5 h-5 text-slate-500 mr-3" />
                                        <input
                                            type="password"
                                            placeholder="••••••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="bg-transparent border-none w-full text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-0 text-sm font-medium"
                                            required
                                            autoComplete="current-password"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
                            >
                                {error}
                            </motion.div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Se connecter <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </Button>
                    </form>
                </motion.div>

                {/* Footer */}
                <div className="absolute bottom-6 text-center text-xs text-slate-600">
                    &copy; 2026 SmartSchool Systems. Tous droits réservés.
                </div>
            </div>
        </div>
    );
}
