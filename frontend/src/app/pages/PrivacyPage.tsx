import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft, ChevronRight } from 'lucide-react';

export default function PrivacyPage() {
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
        { id: 'objet', title: '1. Objet de la Politique' },
        { id: 'responsable', title: '2. Responsable du traitement' },
        { id: 'collecte', title: '3. Données collectées' },
        { id: 'finalite', title: '4. Finalité de la collecte' },
        { id: 'base', title: '5. Base légale du traitement' },
        { id: 'conservation', title: '6. Conservation des données' },
        { id: 'partage', title: '7. Partage des données' },
        { id: 'transfert', title: '8. Transfert international' },
        { id: 'securite', title: '9. Sécurité des données' },
        { id: 'droits', title: '10. Droits des utilisateurs' },
        { id: 'anonymisees', title: '11. Données anonymisées' },
        { id: 'cookies', title: '12. Cookies' },
        { id: 'modification', title: '13. Modification de la politique' },
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
                                        Politique de Confidentialité
                                    </h1>
                                    <p className="text-white/60 text-lg">SmartSchool - Protection de vos données</p>
                                </div>

                                {/* Content Sections */}
                                <div className="prose prose-invert prose-purple max-w-none space-y-8">
                                    {/* Section 1 */}
                                    <section id="objet" data-section="objet">
                                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                            <ChevronRight className="w-6 h-6 text-purple-400" />
                                            1. Objet de la Politique
                                        </h2>
                                        <div className="text-white/80 leading-relaxed space-y-4">
                                            <p>
                                                La présente Politique de Confidentialité décrit comment SmartSchool collecte, utilise, stocke et protège
                                                les données personnelles des utilisateurs dans le cadre de son service de gestion scolaire.
                                            </p>
                                            <p>Elle s'applique à tous les pays où SmartSchool est utilisé.</p>
                                            <p>SmartSchool respecte :</p>
                                            <ul className="space-y-2">
                                                <li>• les lois locales de protection des données (ex. Loi n°2017-20 au Bénin),</li>
                                                <li>• les normes internationales du SaaS,</li>
                                                <li>• les principes du RGPD européen.</li>
                                            </ul>
                                        </div>
                                    </section>

                                    {/* Section 2 */}
                                    <section id="responsable" data-section="responsable">
                                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                            <ChevronRight className="w-6 h-6 text-purple-400" />
                                            2. Responsable du traitement
                                        </h2>
                                        <div className="text-white/80 leading-relaxed space-y-4">
                                            <p>Les données des élèves, enseignants et parents sont propriété exclusive de l'École.</p>
                                            <p>SmartSchool agit en qualité de sous-traitant technique, sauf pour :</p>
                                            <ul className="space-y-2">
                                                <li>• les données techniques,</li>
                                                <li>• les données anonymisées,</li>
                                                <li>• les statistiques agrégées.</li>
                                            </ul>
                                        </div>
                                    </section>

                                    {/* Section 3 */}
                                    <section id="collecte" data-section="collecte">
                                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                            <ChevronRight className="w-6 h-6 text-purple-400" />
                                            3. Données collectées
                                        </h2>
                                        <div className="text-white/80 leading-relaxed space-y-6">
                                            <p>SmartSchool peut collecter les types de données suivants :</p>

                                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                                <h3 className="text-lg font-semibold text-white mb-3">3.1 Données fournies par l'École</h3>
                                                <ul className="space-y-2">
                                                    <li>• Informations sur les élèves, parents/tuteurs, enseignants</li>
                                                    <li>• Inscriptions, notes, évaluations, bulletins</li>
                                                    <li>• Présences, retards, discipline</li>
                                                    <li>• Paiements, reçus, impayés, fiches de paie</li>
                                                </ul>
                                            </div>

                                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                                <h3 className="text-lg font-semibold text-white mb-3">3.2 Données techniques</h3>
                                                <ul className="space-y-2">
                                                    <li>• Adresse IP, type de navigateur/appareil</li>
                                                    <li>• Informations de session, journaux d'erreurs</li>
                                                    <li>• Temps de chargement</li>
                                                </ul>
                                            </div>

                                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                                <h3 className="text-lg font-semibold text-white mb-3">3.3 Données d'utilisation (anonymisées)</h3>
                                                <ul className="space-y-2">
                                                    <li>• Clics, heatmaps, navigation entre pages</li>
                                                    <li>• Temps passé, performance des modules</li>
                                                    <li>• Statistiques pédagogiques</li>
                                                </ul>
                                            </div>

                                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                                <h3 className="text-lg font-semibold text-white mb-3">3.4 Données de communication</h3>
                                                <ul className="space-y-2">
                                                    <li>• Messages internes, emails automatiques</li>
                                                    <li>• Historiques de notifications</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Sections 4-14 - Simplified for brevity */}
                                    <section id="finalite" data-section="finalite">
                                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                            <ChevronRight className="w-6 h-6 text-purple-400" />
                                            4. Finalité de la collecte
                                        </h2>
                                        <div className="text-white/80 leading-relaxed space-y-4">
                                            <p>Les données sont utilisées pour :</p>
                                            <ul className="space-y-2">
                                                <li>• fonctionnement de SmartSchool</li>
                                                <li>• gestion scolaire quotidienne</li>
                                                <li>• communication École ↔ Parents / Enseignants</li>
                                                <li>• gestion financière interne</li>
                                                <li>• génération de documents (bulletins, certificats, paie)</li>
                                                <li>• analyses statistiques anonymisées</li>
                                                <li>• amélioration du service</li>
                                                <li>• sécurité et prévention des abus</li>
                                            </ul>
                                            <p className="font-semibold text-white mt-4">
                                                Les données ne sont jamais revendues à des tiers.
                                            </p>
                                        </div>
                                    </section>

                                    <section id="base" data-section="base">
                                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                            <ChevronRight className="w-6 h-6 text-purple-400" />
                                            5. Base légale du traitement
                                        </h2>
                                        <div className="text-white/80 leading-relaxed">
                                            <p>SmartSchool traite les données sur les bases légales suivantes :</p>
                                            <ul className="space-y-2 mt-4">
                                                <li>• Exécution du contrat entre l'École et SmartSchool</li>
                                                <li>• Intérêt légitime (sécurité, amélioration du service)</li>
                                                <li>• Obligations légales (facturation, archives)</li>
                                                <li>• Consentement lorsque requis (ex : notifications)</li>
                                            </ul>
                                        </div>
                                    </section>

                                    <section id="conservation" data-section="conservation">
                                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                            <ChevronRight className="w-6 h-6 text-purple-400" />
                                            6. Conservation des données
                                        </h2>
                                        <div className="text-white/80 leading-relaxed">
                                            <p>SmartSchool conserve les données :</p>
                                            <ul className="space-y-2 mt-4">
                                                <li>• Données scolaires : pendant la durée du contrat</li>
                                                <li>• Données financières : 5 ans (exigences comptables)</li>
                                                <li>• Logs techniques : 12 mois</li>
                                                <li>• Données anonymisées : durée illimitée</li>
                                            </ul>
                                            <p className="mt-4">
                                                À la fin du contrat, l'École peut demander un export complet de ses données.
                                            </p>
                                        </div>
                                    </section>

                                    <section id="partage" data-section="partage">
                                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                            <ChevronRight className="w-6 h-6 text-purple-400" />
                                            7. Partage des données
                                        </h2>
                                        <div className="text-white/80 leading-relaxed space-y-4">
                                            <p>SmartSchool peut utiliser des sous-traitants pour :</p>
                                            <ul className="space-y-2">
                                                <li>• l'hébergement cloud</li>
                                                <li>• l'envoi d'emails et de SMS</li>
                                                <li>• le stockage de documents</li>
                                            </ul>
                                            <p className="font-semibold text-white">
                                                Tous les sous-traitants respectent la confidentialité et la sécurité des données.
                                            </p>
                                            <p className="font-semibold text-white">
                                                Aucun tiers commercial n'a accès aux données.
                                            </p>
                                        </div>
                                    </section>

                                    <section id="transfert" data-section="transfert">
                                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                            <ChevronRight className="w-6 h-6 text-purple-400" />
                                            8. Transfert international
                                        </h2>
                                        <div className="text-white/80 leading-relaxed space-y-4">
                                            <p>Les données peuvent être transférées :</p>
                                            <ul className="space-y-2">
                                                <li>• dans le pays de l'École</li>
                                                <li>• dans l'Union européenne</li>
                                                <li>• ou dans d'autres pays disposant d'un niveau de protection adéquat</li>
                                            </ul>
                                            <p className="font-semibold text-white">
                                                SmartSchool garantit un niveau de sécurité équivalent quel que soit le lieu.
                                            </p>
                                        </div>
                                    </section>

                                    <section id="securite" data-section="securite">
                                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                            <ChevronRight className="w-6 h-6 text-purple-400" />
                                            9. Sécurité des données
                                        </h2>
                                        <div className="text-white/80 leading-relaxed">
                                            <p>SmartSchool applique :</p>
                                            <ul className="space-y-2 mt-4">
                                                <li>• isolation stricte par École (schoolId)</li>
                                                <li>• chiffrement des mots de passe</li>
                                                <li>• authentification sécurisée (JWT)</li>
                                                <li>• sauvegardes régulières</li>
                                                <li>• supervision continue</li>
                                                <li>• protection contre l'accès non autorisé</li>
                                            </ul>
                                        </div>
                                    </section>

                                    <section id="droits" data-section="droits">
                                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                            <ChevronRight className="w-6 h-6 text-purple-400" />
                                            10. Droits des utilisateurs
                                        </h2>
                                        <div className="text-white/80 leading-relaxed space-y-4">
                                            <p>Selon la législation applicable, les personnes concernées peuvent demander :</p>
                                            <ul className="space-y-2">
                                                <li>• accès</li>
                                                <li>• rectification</li>
                                                <li>• suppression</li>
                                                <li>• limitation</li>
                                                <li>• portabilité</li>
                                            </ul>
                                            <p className="mt-4">
                                                Ces demandes sont transmises par l'École (propriétaire des données) à SmartSchool.
                                            </p>
                                        </div>
                                    </section>

                                    <section id="anonymisees" data-section="anonymisees">
                                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                            <ChevronRight className="w-6 h-6 text-purple-400" />
                                            11. Données anonymisées
                                        </h2>
                                        <div className="text-white/80 leading-relaxed space-y-4">
                                            <p>SmartSchool peut collecter, analyser et exploiter des données entièrement anonymisées, telles que :</p>
                                            <ul className="space-y-2">
                                                <li>• statistiques d'utilisation</li>
                                                <li>• performances pédagogiques globales</li>
                                                <li>• heatmaps, tendances</li>
                                                <li>• indicateurs régionaux</li>
                                            </ul>
                                            <p className="font-semibold text-white">
                                                Ces données ne permettent jamais d'identifier une personne.
                                            </p>
                                        </div>
                                    </section>

                                    <section id="cookies" data-section="cookies">
                                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                            <ChevronRight className="w-6 h-6 text-purple-400" />
                                            12. Cookies
                                        </h2>
                                        <div className="text-white/80 leading-relaxed space-y-4">
                                            <p>SmartSchool utilise uniquement des cookies nécessaires :</p>
                                            <ul className="space-y-2">
                                                <li>• session utilisateur</li>
                                                <li>• préférences</li>
                                                <li>• analytics anonymisés</li>
                                            </ul>
                                            <p className="font-semibold text-white">
                                                Aucun cookie publicitaire n'est utilisé.
                                            </p>
                                        </div>
                                    </section>

                                    <section id="modification" data-section="modification">
                                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                            <ChevronRight className="w-6 h-6 text-purple-400" />
                                            13. Modification de la politique
                                        </h2>
                                        <div className="text-white/80 leading-relaxed space-y-4">
                                            <p>SmartSchool peut modifier cette politique.</p>
                                            <p>Les Écoles seront notifiées par email ou via l'interface.</p>
                                        </div>
                                    </section>

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
