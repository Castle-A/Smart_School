import { useState } from 'react';
import { Mail, Bell, Send, Clock, CheckCircle, CalendarDays, Plus } from 'lucide-react';
import { AppointmentInbox } from '../components/communication/AppointmentInbox';
import { CreateAppointmentModal } from '../components/communication/CreateAppointmentModal';
import { appointmentService } from '../../../api/appointment.service';
import NotificationCenter from '../components/communication/NotificationCenter';

const DirectorCommunicationSection = () => {
    const [activeTab, setActiveTab] = useState<'messaging' | 'appointments' | 'notifications'>('messaging');
    const [isApptModalOpen, setIsApptModalOpen] = useState(false);

    // Mock Messages (Existing)
    const messages = [
        { sender: "M. Koffi (Prof Math)", subject: "Absence prévue", preview: "Je ne pourrai pas assurer mon cours de demain...", time: "10:30", unread: true, avatar: "K" },
        { sender: "Mme. Diallo (Parent)", subject: "Rendez-vous", preview: "Je souhaiterais vous rencontrer concernant...", time: "Hier", unread: false, avatar: "D" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Communication</h2>
                <div className="flex gap-2">
                    {activeTab === 'appointments' && (
                        <button
                            onClick={() => setIsApptModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors shadow-lg shadow-orange-500/20"
                        >
                            <Plus size={18} />
                            Nouveau RDV
                        </button>
                    )}
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-lg shadow-indigo-500/20">
                        <Send size={18} />
                        Nouveau Message
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 border-b border-white/10">
                <button
                    onClick={() => setActiveTab('messaging')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${activeTab === 'messaging'
                        ? 'bg-indigo-600 text-white border-b-2 border-indigo-400'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <Mail size={18} />
                    Messagerie
                </button>
                <button
                    onClick={() => setActiveTab('appointments')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${activeTab === 'appointments'
                        ? 'bg-orange-600 text-white border-b-2 border-orange-400'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <CalendarDays size={18} />
                    Rendez-vous
                </button>
                <button
                    onClick={() => setActiveTab('notifications')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${activeTab === 'notifications'
                        ? 'bg-emerald-600 text-white border-b-2 border-emerald-400'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <Bell size={18} />
                    Notifications
                </button>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Area */}
                <div className="lg:col-span-2">
                    {activeTab === 'messaging' && (
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                            <div className="space-y-4">
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={`p-4 rounded-lg cursor-pointer transition-all ${msg.unread ? 'bg-indigo-500/10 border border-indigo-500/30' : 'bg-white/5 hover:bg-white/10 border border-transparent'}`}>
                                        <div className="flex gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shrink-0 ${msg.unread ? 'bg-indigo-500' : 'bg-gray-700'}`}>
                                                {msg.avatar}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className={`font-semibold ${msg.unread ? 'text-white' : 'text-gray-300'}`}>{msg.sender}</span>
                                                    <span className="text-xs text-gray-500 flex items-center gap-1"><Clock size={12} /> {msg.time}</span>
                                                </div>
                                                <h4 className={`text-sm font-medium mb-1 truncate ${msg.unread ? 'text-indigo-200' : 'text-gray-400'}`}>{msg.subject}</h4>
                                                <p className="text-xs text-gray-500 line-clamp-2">{msg.preview}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'appointments' && (
                        <div className="bg-white rounded-xl p-6 text-gray-800">
                            <div className="mb-6">
                                <h3 className="font-bold text-lg mb-2">Gestion des Rendez-vous</h3>
                                <p className="text-sm text-gray-500">Validez vos demandes et consultez votre planning.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <AppointmentInbox />
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-200 flex items-center justify-center text-center">
                                    <div>
                                        <CalendarDays className="mx-auto text-gray-300 mb-2" size={32} />
                                        <p className="text-sm text-gray-400">Sélectionnez un créneau ou créez un RDV</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <NotificationCenter />
                    )}
                </div>

                {/* Sidebar (Quick Stats / Actions) */}
                <div className="space-y-6">
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Bell className="text-amber-400" size={20} />
                            <h3 className="text-lg font-semibold text-white">Activités</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex gap-3 items-start p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/10">
                                <CheckCircle size={16} className="text-emerald-400 mt-1 shrink-0" />
                                <div>
                                    <p className="text-sm text-white font-medium">Bulletins à valider</p>
                                    <p className="text-xs text-gray-400">3 classes en attente</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <CreateAppointmentModal
                isOpen={isApptModalOpen}
                onClose={() => setIsApptModalOpen(false)}
                onSave={async (data) => {
                    await appointmentService.requestAppointment(data);
                    // Refresh?
                    window.location.reload();
                }}
            />
        </div>
    );
};

export default DirectorCommunicationSection;
