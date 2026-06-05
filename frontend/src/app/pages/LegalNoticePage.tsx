import { Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft, Building2, Mail, Phone, Globe } from 'lucide-react';

export default function LegalNoticePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Header */}
            <header className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-3 group">
                            <ArrowLeft className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                    <GraduationCap className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold text-white">SmartSchool</span>
                            </div>
                        </Link>
                        <span className="text-white/60 text-sm">Dernière mise à jour : 2025</span>
                    </div>
                </div>
            </header>

            <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12">
                        {/* Title */}
                        <div className="mb-12">
                            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                                Mentions Légales
                            </h1>
                            <p className="text-white/60 text-lg">SmartSchool Technologies</p>
                        </div>

                        {/* Content */}
                        <div className="space-y-8 text-white/80">
                            {/* Section 1 */}
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                    <Building2 className="w-6 h-6 text-purple-400" />
                                    1. Éditeur du site
                                </h2>
                                <div className="bg-white/5 rounded-xl p-6 border border-white/10 space-y-3">
                                    <p><strong className="text-white">Raison sociale :</strong> SmartSchool Technologies</p>
                                    <p><strong className="text-white">Adresse :</strong> [à compléter]</p>
                                    <p><strong className="text-white">Téléphone :</strong> +229 ...</p>
                                    <p><strong className="text-white">Email :</strong> support@smartschool.app</p>
                                    <p><strong className="text-white">Site web :</strong> https://www.smartschool.app</p>
                                    <p className="pt-3 border-t border-white/10">
                                        <strong className="text-white">RC / RCCM / RCB :</strong> [à compléter]
                                    </p>
                                    <p><strong className="text-white">IFU :</strong> [à compléter]</p>
                                </div>
                            </section>

                            {/* Section 2 */}
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">
                                    2. Directeur de publication
                                </h2>
                                <div className="bg-white/5 rounded-xl p-6 border border-white/10 space-y-3">
                                    <p><strong className="text-white">Nom :</strong> [Nom]</p>
                                    <p><strong className="text-white">Fonction :</strong> Fondateur – SmartSchool Technologies</p>
                                    <p><strong className="text-white">Email :</strong> support@smartschool.app</p>
                                </div>
                            </section>

                            {/* Section 3 */}
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                    <Globe className="w-6 h-6 text-purple-400" />
                                    3. Hébergement
                                </h2>
                                <div className="bg-white/5 rounded-xl p-6 border border-white/10 space-y-3">
                                    <p>SmartSchool est hébergé chez :</p>
                                    <p><strong className="text-white">Hébergeur :</strong> [Nom de l'hébergeur – ex : OVH, Hetzner, Render]</p>
                                    <p><strong className="text-white">Adresse :</strong> [adresse de l'hébergeur]</p>
                                    <p><strong className="text-white">Site web :</strong> https://www.[hébergeur].com</p>
                                </div>
                            </section>

                            {/* Section 4 */}
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">
                                    4. Propriété intellectuelle
                                </h2>
                                <div className="leading-relaxed space-y-4">
                                    <p>
                                        Le contenu du site SmartSchool (code, design, logo, textes, interface) est protégé par les lois
                                        sur la propriété intellectuelle.
                                    </p>
                                    <p className="font-semibold text-white">
                                        Toute reproduction, copie ou exploitation sans autorisation est strictement interdite.
                                    </p>
                                </div>
                            </section>

                            {/* Section 5 */}
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">
                                    5. Données personnelles
                                </h2>
                                <div className="leading-relaxed space-y-4">
                                    <p>Les données collectées via SmartSchool sont traitées conformément à :</p>
                                    <ul className="space-y-2 list-none">
                                        <li className="flex gap-3">
                                            <span className="text-purple-400">•</span>
                                            la <Link to="/privacy" className="text-purple-400 hover:text-purple-300 underline">Politique de Confidentialité SmartSchool</Link>,
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-purple-400">•</span>
                                            les lois locales applicables,
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-purple-400">•</span>
                                            les standards internationaux du SaaS.
                                        </li>
                                    </ul>
                                    <p className="mt-4 font-semibold text-white">
                                        L'École demeure propriétaire des données qu'elle saisit.
                                    </p>
                                </div>
                            </section>

                            {/* Section 6 */}
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">
                                    6. Responsabilité
                                </h2>
                                <div className="leading-relaxed space-y-4">
                                    <p>SmartSchool décline toute responsabilité en cas :</p>
                                    <ul className="space-y-2">
                                        <li>• d'utilisation incorrecte du service,</li>
                                        <li>• d'interruptions dues à la maintenance,</li>
                                        <li>• de problèmes Internet ou électriques locaux,</li>
                                        <li>• de modifications effectuées par l'École,</li>
                                        <li>• de perte de données causée par une mauvaise manipulation de l'École.</li>
                                    </ul>
                                </div>
                            </section>

                            {/* Section 7 */}
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">
                                    7. Cookies
                                </h2>
                                <div className="leading-relaxed space-y-4">
                                    <p>Le site peut installer des cookies techniques :</p>
                                    <ul className="space-y-2">
                                        <li>• cookies de session</li>
                                        <li>• cookies de préférences</li>
                                        <li>• cookies analytiques anonymisés</li>
                                    </ul>
                                    <p className="mt-4 font-semibold text-white">
                                        Aucun cookie publicitaire n'est utilisé.
                                    </p>
                                </div>
                            </section>

                            {/* Section 8 - Contact */}
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                    <Mail className="w-6 h-6 text-purple-400" />
                                    8. Contact
                                </h2>
                                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30">
                                    <p className="font-semibold text-white mb-4">SmartSchool Technologies</p>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <Mail className="w-5 h-5 text-purple-400" />
                                            <a href="mailto:support@smartschool.app" className="hover:text-white transition-colors">
                                                support@smartschool.app
                                            </a>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Phone className="w-5 h-5 text-purple-400" />
                                            <span>+229 ...</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Globe className="w-5 h-5 text-purple-400" />
                                            <a href="https://www.smartschool.app" className="hover:text-white transition-colors">
                                                www.smartschool.app
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Footer */}
                        <div className="mt-12 pt-8 border-t border-white/10 text-center text-white/60 text-sm">
                            <p>Dernière mise à jour : 2025</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
