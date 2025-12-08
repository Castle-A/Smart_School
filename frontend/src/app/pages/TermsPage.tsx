import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft, ChevronRight } from 'lucide-react';

export default function TermsPage() {
    const [activeSection, setActiveSection] = useState('');

    useEffect(() => {
        const handleScroll = () => {
            const sections = document.querySelectorAll('[data-section]');
            let current = '';

            sections.forEach((section) => {
                const sectionTop = section.getBoundingClientRect().top;
                if (sectionTop <= 150) {
                    current = section.getAttribute('data-section') || '';
                }
            });

            setActiveSection(current);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    const sections = [
        { id: 'objet', title: '1. Objet' },
        { id: 'definitions', title: '2. Définitions' },
        { id: 'champ', title: '3. Champ d\'application géographique' },
        { id: 'services', title: '4. Services fournis' },
        { id: 'acces', title: '5. Conditions d\'accès' },
        { id: 'donnees', title: '6. Données personnelles' },
        { id: 'analytics', title: '7. Données analytiques' },
        { id: 'documents', title: '8. Documents automatiques' },
        { id: 'abonnements', title: '9. Abonnements et Paiement' },
        { id: 'responsabilites', title: '10. Responsabilités' },
        { id: 'resiliation', title: '11. Résiliation' },
        { id: 'modification', title: '12. Modification des CGU' },
        { id: 'loi', title: '13. Loi applicable' },
        { id: 'contact', title: '14. Contact' },
    ];

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
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Table of Contents - Desktop */}
                        <aside className="hidden lg:block lg:col-span-1">
                            <div className="sticky top-28">
                                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                                    <h3 className="text-lg font-semibold text-white mb-4">Table des matières</h3>
                                    <nav className="space-y-2">
                                        {sections.map((section) => (
                                            <button
                                                key={section.id}
                                                onClick={() => scrollToSection(section.id)}
                                                className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${activeSection === section.id
                                                        ? 'bg-purple-500/20 text-purple-300 font-medium'
                                                        : 'text-white/60 hover:text-white hover:bg-white/5'
                                                    }`}
                                            >
                                                {section.title}
                                            </button>
                                        ))}
                                    </nav>
                                </div>
                            </div>
                        </aside>

                        {/* Main Content */}
                        <main className="lg:col-span-3">
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12">
                                {/* Title */}
                                <div className="mb-12">
                                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                                        Conditions Générales d'Utilisation
                                    </h1>
                                    <p className="text-white/60 text-lg">SmartSchool - Plateforme SaaS de Gestion Scolaire</p>
                                </div>

                                {/* Content Sections */}
                                <div className="prose prose-invert prose-purple max-w-none space-y-8">
                                    {/* Section 1 */}
                                    <section id="objet" data-section="objet">
                                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                            <ChevronRight className="w-6 h-6 text-purple-400" />
                                            1. Objet
                                        </h2>
                                        <div className="text-white/80 leading-relaxed space-y-4">
                                            <p>
                                                Les présentes Conditions Générales d'Utilisation (« CGU ») régissent l'accès et l'usage de SmartSchool,
                                                plateforme SaaS de gestion scolaire destinée aux établissements éducatifs de tout pays.
                                            </p>
                                            <p>
                                                En utilisant SmartSchool, l'École et les Utilisateurs acceptent sans réserve les présentes CGU.
                                            </p>
                                        </div>
                                    </section>

                                    {/* Section 2 */}
                                    <section id="definitions" data-section="definitions">
                                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                            <ChevronRight className="w-6 h-6 text-purple-400" />
                                            2. Définitions
                                        </h2>
                                        <div className="text-white/80 leading-relaxed">
                                            <ul className="space-y-3 list-none pl-0">
                                                <li className="flex gap-3">
                                                    <span className="text-purple-400 font-bold">•</span>
                                                    <div>
                                                        <strong className="text-white">SmartSchool / Plateforme :</strong> Solution numérique de gestion scolaire et administrative.
                                                    </div>
                                                </li>
                                                <li className="flex gap-3">
                                                    <span className="text-purple-400 font-bold">•</span>
                                                    <div>
                                                        <strong className="text-white">École :</strong> Établissement éducatif utilisant SmartSchool.
                                                    </div>
                                                </li>
                                                <li className="flex gap-3">
                                                    <span className="text-purple-400 font-bold">•</span>
                                                    <div>
                                                        <strong className="text-white">Utilisateur :</strong> Toute personne autorisée (fondateur, directeur, enseignant, parent, élève).
                                                    </div>
                                                </li>
                                                <li className="flex gap-3">
                                                    <span className="text-purple-400 font-bold">•</span>
                                                    <div>
                                                        <strong className="text-white">Données personnelles :</strong> Information permettant d'identifier une personne physique.
                                                    </div>
                                                </li>
                                                <li className="flex gap-3">
                                                    <span className="text-purple-400 font-bold">•</span>
                                                    <div>
                                                        <strong className="text-white">Données anonymisées :</strong> Données transformées irréversiblement, sans identification possible.
                                                    </div>
                                                </li>
                                                <li className="flex gap-3">
                                                    <span className="text-purple-400 font-bold">•</span>
                                                    <div>
                                                        <strong className="text-white">Sous-traitant :</strong> Prestataire technique (hébergement, SMS, emails, stockage).
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </section>

                                    {/* Section 3 */}
                                    <section id="champ" data-section="champ">
                                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                            <ChevronRight className="w-6 h-6 text-purple-400" />
                                            3. Champ d'application géographique
                                        </h2>
                                        <div className="text-white/80 leading-relaxed space-y-4">
                                            <p>Les présentes CGU s'appliquent dans tous les pays où SmartSchool est utilisé.</p>
                                            <p>SmartSchool respecte :</p>
                                            <ul className="space-y-2 list-none pl-0">
                                                <li className="flex gap-3">
                                                    <span className="text-purple-400">✓</span>
                                                    les lois locales de protection des données (ex : Loi n°2017-20 au Bénin),
                                                </li>
                                                <li className="flex gap-3">
                                                    <span className="text-purple-400">✓</span>
                                                    les standards internationaux du SaaS,
                                                </li>
                                                <li className="flex gap-3">
                                                    <span className="text-purple-400">✓</span>
                                                    les principes fondamentaux du RGPD européen.
                                                </li>
                                            </ul>
                                        </div>
                                    </section>

                                    {/* Section 4 */}
                                    <section id="services" data-section="services">
                                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                            <ChevronRight className="w-6 h-6 text-purple-400" />
                                            4. Services fournis
                                        </h2>
                                        <div className="text-white/80 leading-relaxed space-y-6">
                                            <p>SmartSchool propose notamment :</p>

                                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                                <h3 className="text-lg font-semibold text-white mb-3">4.1 Gestion Académique</h3>
                                                <ul className="space-y-2">
                                                    <li>• inscriptions, classes, matières</li>
                                                    <li>• notes, évaluations, moyennes</li>
                                                    <li>• génération automatique des bulletins</li>
                                                </ul>
                                            </div>

                                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                                <h3 className="text-lg font-semibold text-white mb-3">4.2 Gestion Administrative</h3>
                                                <ul className="space-y-2">
                                                    <li>• présence, retards, discipline</li>
                                                    <li>• emploi du temps</li>
                                                    <li>• messagerie interne école ↔ parents</li>
                                                </ul>
                                            </div>

                                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                                <h3 className="text-lg font-semibold text-white mb-3">4.3 Gestion Financière</h3>
                                                <ul className="space-y-2">
                                                    <li>• paiements élèves</li>
                                                    <li>• impayés</li>
                                                    <li>• reçus automatiques</li>
                                                    <li>• fiches de paie</li>
                                                </ul>
                                            </div>

                                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                                <h3 className="text-lg font-semibold text-white mb-3">4.4 Documents Automatiques</h3>
                                                <ul className="space-y-2">
                                                    <li>• bulletins</li>
                                                    <li>• certificats</li>
                                                    <li>• attestations</li>
                                                    <li>• reçus</li>
                                                    <li>• paie</li>
                                                </ul>
                                            </div>

                                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                                <h3 className="text-lg font-semibold text-white mb-3">4.5 Statistiques & Analyses</h3>
                                                <ul className="space-y-2">
                                                    <li>• tableau de bord</li>
                                                    <li>• tendances pédagogiques</li>
                                                    <li>• heatmap d'utilisation (anonymisée)</li>
                                                    <li>• analytics internes</li>
                                                </ul>
                                            </div>

                                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                                <h3 className="text-lg font-semibold text-white mb-3">4.6 Modules Premium (optionnels)</h3>
                                                <ul className="space-y-2">
                                                    <li>• outils IA éducatifs</li>
                                                    <li>• prédictions scolaires</li>
                                                    <li>• rapports institutionnels</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Section 5 */}
                                    <section id="acces" data-section="acces">
                                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                            <ChevronRight className="w-6 h-6 text-purple-400" />
                                            5. Conditions d'accès
                                        </h2>
                                        <div className="text-white/80 leading-relaxed space-y-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-white mb-2">5.1 École</h3>
                                                <p>L'École doit fournir des informations exactes et maintenir un abonnement actif.</p>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-white mb-2">5.2 Utilisateurs</h3>
                                                <p>Chaque utilisateur est responsable de :</p>
                                                <ul className="mt-2 space-y-2">
                                                    <li>• son identifiant</li>
                                                    <li>• son mot de passe</li>
                                                    <li>• l'utilisation de son compte</li>
                                                </ul>
                                                <p className="mt-3">L'École est responsable de la gestion des rôles et accès.</p>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Section 6 */}
                                    <section id="donnees" data-section="donnees">
                                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                            <ChevronRight className="w-6 h-6 text-purple-400" />
                                            6. Données personnelles
                                        </h2>
                                        <div className="text-white/80 leading-relaxed space-y-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-white mb-2">6.1 Propriété</h3>
                                                <p>Les données des élèves, parents et professeurs appartiennent exclusivement à l'École.</p>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-white mb-2">6.2 Rôle de SmartSchool</h3>
                                                <p>SmartSchool agit comme sous-traitant, sauf :</p>
                                                <ul className="mt-2 space-y-2">
                                                    <li>• pour les données techniques,</li>
                                                    <li>• pour les données anonymisées (utilisées à des fins d'analyse).</li>
                                                </ul>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-white mb-2">6.3 Sécurité</h3>
                                                <p>SmartSchool applique :</p>
                                                <ul className="mt-2 space-y-2">
                                                    <li>• isolation stricte des données par École (schoolId),</li>
                                                    <li>• chiffrement,</li>
                                                    <li>• authentification sécurisée,</li>
                                                    <li>• sauvegardes régulières,</li>
                                                    <li>• supervision de sécurité.</li>
                                                </ul>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-white mb-2">6.4 Transfert international</h3>
                                                <p>Les données peuvent être hébergées dans :</p>
                                                <ul className="mt-2 space-y-2">
                                                    <li>• le pays de l'École,</li>
                                                    <li>• l'Union européenne,</li>
                                                    <li>• ou tout pays garantissant un niveau de sécurité équivalent.</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Section 7 */}
                                    <section id="analytics" data-section="analytics">
                                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                            <ChevronRight className="w-6 h-6 text-purple-400" />
                                            7. Données analytiques
                                        </h2>
                                        <div className="text-white/80 leading-relaxed space-y-4">
                                            <p>SmartSchool collecte des données anonymisées, notamment :</p>
                                            <ul className="space-y-2">
                                                <li>• clics, navigation, heatmaps,</li>
                                                <li>• pages visitées,</li>
                                                <li>• temps d'utilisation,</li>
                                                <li>• statistiques globales pédagogiques.</li>
                                            </ul>
                                            <p className="mt-4">Ces données ne permettent pas d'identifier une personne et sont utilisées pour :</p>
                                            <ul className="space-y-2">
                                                <li>• améliorer SmartSchool,</li>
                                                <li>• analyses pédagogiques globales,</li>
                                                <li>• rapports statistiques,</li>
                                                <li>• développement de nouveaux services.</li>
                                            </ul>
                                            <p className="mt-4 font-semibold text-white">
                                                SmartSchool peut exploiter et commercialiser ces données uniquement sous forme anonyme et agrégée.
                                            </p>
                                        </div>
                                    </section>

                                    {/* Section 8 */}
                                    <section id="documents" data-section="documents">
                                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                            <ChevronRight className="w-6 h-6 text-purple-400" />
                                            8. Documents automatiques
                                        </h2>
                                        <div className="text-white/80 leading-relaxed space-y-4">
                                            <p>SmartSchool génère :</p>
                                            <ul className="space-y-2">
                                                <li>• bulletins</li>
                                                <li>• certificats</li>
                                                <li>• reçus</li>
                                                <li>• fiches de paie</li>
                                            </ul>
                                            <p className="mt-4">
                                                Ces documents peuvent être consultés, exportés et stockés temporairement de manière sécurisée.
                                            </p>
                                        </div>
                                    </section>

                                    {/* Section 9 */}
                                    <section id="abonnements" data-section="abonnements">
                                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                            <ChevronRight className="w-6 h-6 text-purple-400" />
                                            9. Abonnements et Paiement
                                        </h2>
                                        <div className="text-white/80 leading-relaxed space-y-4">
                                            <p>SmartSchool offre plusieurs abonnements (Standard, Avancé, Premium).</p>
                                            <p>Les prix peuvent varier selon le pays.</p>
                                            <p className="font-semibold text-white">
                                                En cas d'impayé, l'accès peut être suspendu jusqu'à régularisation.
                                            </p>
                                        </div>
                                    </section>

                                    {/* Section 10 */}
                                    <section id="responsabilites" data-section="responsabilites">
                                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                            <ChevronRight className="w-6 h-6 text-purple-400" />
                                            10. Responsabilités
                                        </h2>
                                        <div className="text-white/80 leading-relaxed space-y-4">
                                            <p>SmartSchool n'est pas responsable :</p>
                                            <ul className="space-y-2">
                                                <li>• des erreurs saisies par l'École,</li>
                                                <li>• des problèmes liés à l'électricité ou connexion Internet locale,</li>
                                                <li>• de l'usage frauduleux d'un compte interne,</li>
                                                <li>• des interruptions dues à la maintenance.</li>
                                            </ul>
                                        </div>
                                    </section>

                                    {/* Section 11 */}
                                    <section id="resiliation" data-section="resiliation">
                                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                            <ChevronRight className="w-6 h-6 text-purple-400" />
                                            11. Résiliation
                                        </h2>
                                        <div className="text-white/80 leading-relaxed space-y-4">
                                            <p>L'École peut résilier à tout moment.</p>
                                            <p>SmartSchool fournit un export de données sur demande.</p>
                                            <p>Les données anonymisées peuvent être conservées par SmartSchool.</p>
                                        </div>
                                    </section>

                                    {/* Section 12 */}
                                    <section id="modification" data-section="modification">
                                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                            <ChevronRight className="w-6 h-6 text-purple-400" />
                                            12. Modification des CGU
                                        </h2>
                                        <div className="text-white/80 leading-relaxed space-y-4">
                                            <p>SmartSchool peut modifier les CGU à tout moment.</p>
                                            <p>Une notification sera envoyée à l'École.</p>
                                        </div>
                                    </section>

                                    {/* Section 13 */}
                                    <section id="loi" data-section="loi">
                                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                            <ChevronRight className="w-6 h-6 text-purple-400" />
                                            13. Loi applicable
                                        </h2>
                                        <div className="text-white/80 leading-relaxed space-y-4">
                                            <p>Les CGU s'adaptent automatiquement :</p>
                                            <ul className="space-y-2">
                                                <li>• aux lois du pays de l'École,</li>
                                                <li>• aux standards internationaux de protection des données.</li>
                                            </ul>
                                        </div>
                                    </section>

                                    {/* Section 14 */}
                                    <section id="contact" data-section="contact">
                                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                            <ChevronRight className="w-6 h-6 text-purple-400" />
                                            14. Contact
                                        </h2>
                                        <div className="text-white/80 leading-relaxed">
                                            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30">
                                                <p className="font-semibold text-white mb-3">SmartSchool Technologies</p>
                                                <ul className="space-y-2">
                                                    <li>📧 support@smartschool.app</li>
                                                    <li>📱 +229 ...</li>
                                                    <li>🌐 www.smartschool.app</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </section>
                                </div>

                                {/* Footer */}
                                <div className="mt-12 pt-8 border-t border-white/10 text-center text-white/60 text-sm">
                                    <p>Dernière mise à jour : 2025</p>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
}
