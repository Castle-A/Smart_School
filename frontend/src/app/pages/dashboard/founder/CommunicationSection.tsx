import { Mail, Bell, MessageCircle, Send, AlertCircle, HelpCircle, Users, Clock, CheckCircle } from 'lucide-react';

const CommunicationSection = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Communication Interne</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-lg shadow-indigo-500/20">
                    <Send size={18} />
                    Nouvelle Annonce
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Messagerie Administrative */}
                <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <Mail className="text-blue-400" size={24} />
                            <h3 className="text-xl font-semibold text-white">Messagerie Administrative</h3>
                        </div>
                        <div className="flex gap-2">
                            <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 text-xs rounded-full border border-indigo-500/30">Tout le personnel</span>
                            <span className="px-2 py-1 bg-white/10 text-slate-300 text-xs rounded-full border border-white/10">Par rôle</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {[
                            { sender: "Direction", subject: "Réunion de rentrée", preview: "La réunion de rentrée aura lieu le Lundi 15 Septembre à 08h00 dans la salle des profs...", time: "10:30", unread: true, avatar: "D" },
                            { sender: "Comptabilité", subject: "Rapport mensuel Octobre", preview: "Veuillez trouver ci-joint le rapport financier du mois d'Octobre pour validation...", time: "Hier", unread: false, avatar: "C" },
                            { sender: "Vie Scolaire", subject: "Incident 3ème B", preview: "Compte rendu de l'incident survenu lors du cours de Physique en classe de 3ème B...", time: "26 Nov", unread: false, avatar: "V" },
                        ].map((msg, idx) => (
                            <div key={idx} className={`p-4 rounded-lg cursor-pointer transition-all ${msg.unread ? 'bg-indigo-500/10 border border-indigo-500/30' : 'bg-white/5 hover:bg-white/10 border border-transparent'}`}>
                                <div className="flex gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shrink-0 ${msg.unread ? 'bg-indigo-500' : 'bg-slate-700'}`}>
                                        {msg.avatar}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className={`font-semibold ${msg.unread ? 'text-white' : 'text-slate-300'}`}>{msg.sender}</span>
                                            <span className="text-xs text-slate-400 flex items-center gap-1"><Clock size={12} /> {msg.time}</span>
                                        </div>
                                        <h4 className={`text-sm font-medium mb-1 truncate ${msg.unread ? 'text-indigo-200' : 'text-slate-400'}`}>{msg.subject}</h4>
                                        <p className="text-xs text-slate-500 line-clamp-2">{msg.preview}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-4 py-2 text-sm text-slate-400 hover:text-white border border-white/5 hover:border-white/20 rounded-lg transition-colors">
                        Voir tout l'historique
                    </button>
                </div>

                {/* Notifications & Portail */}
                <div className="space-y-6">
                    {/* Notifications Système */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Bell className="text-amber-400" size={20} />
                            <h3 className="text-lg font-semibold text-white">Notifications Système</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex gap-3 items-start p-3 bg-amber-500/10 rounded-lg border border-amber-500/10">
                                <AlertCircle size={16} className="text-amber-400 mt-1 shrink-0" />
                                <div>
                                    <p className="text-sm text-white font-medium">Maintenance Serveur</p>
                                    <p className="text-xs text-slate-400">Prévue ce soir à 22h00</p>
                                </div>
                            </div>
                            <div className="flex gap-3 items-start p-3 bg-blue-500/10 rounded-lg border border-blue-500/10">
                                <MessageCircle size={16} className="text-blue-400 mt-1 shrink-0" />
                                <div>
                                    <p className="text-sm text-white font-medium">Nouveau message parents</p>
                                    <p className="text-xs text-slate-400">5 messages non lus</p>
                                </div>
                            </div>
                            <div className="flex gap-3 items-start p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/10">
                                <CheckCircle size={16} className="text-emerald-400 mt-1 shrink-0" />
                                <div>
                                    <p className="text-sm text-white font-medium">Validation requise</p>
                                    <p className="text-xs text-slate-400">3 bulletins en attente</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Portail Parents */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Users className="text-emerald-400" size={20} />
                            <h3 className="text-lg font-semibold text-white">Portail Parents</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
                                <p className="text-2xl font-bold text-white">85%</p>
                                <p className="text-xs text-slate-400">Comptes Actifs</p>
                            </div>
                            <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
                                <p className="text-2xl font-bold text-white">124</p>
                                <p className="text-xs text-slate-400">Visites auj.</p>
                            </div>
                        </div>
                        <button className="w-full flex items-center justify-center gap-2 py-2 text-sm text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                            <HelpCircle size={16} />
                            FAQ Institutionnelle
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunicationSection;
