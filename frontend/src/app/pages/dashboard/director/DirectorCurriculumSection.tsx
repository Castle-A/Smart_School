import YearEndClosure from '../components/YearEndClosure';
import { Shield, Calendar, Users, ArrowRightCircle } from 'lucide-react';
import { useState } from 'react';
import { SmartCalendar } from '../components/calendar/SmartCalendar';
import { AddEventModal } from '../components/calendar/AddEventModal';
import { calendarService } from '../../../api/calendar.service';
import ClassCouncil from './components/ClassCouncil';
import PromotionWizard from './components/PromotionWizard';

const DirectorCurriculumSection = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'calendar' | 'council' | 'promo' | 'closure'>('calendar');

    // ... fetchEvents ...

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Programme Scolaire & Transition</h2>
                    <p className="text-gray-400 text-sm">Gestion du calendrier et des conseils de classe de fin d'année</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 border-b border-white/10">
                <button
                    onClick={() => setActiveTab('calendar')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${activeTab === 'calendar'
                        ? 'bg-indigo-600 text-white border-b-2 border-indigo-400'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <Calendar size={18} />
                    Calendrier Scolaire
                </button>
                <button
                    onClick={() => setActiveTab('council')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${activeTab === 'council'
                        ? 'bg-indigo-600 text-white border-b-2 border-indigo-400'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <Users size={18} />
                    Conseil de Classe
                </button>
                <button
                    onClick={() => setActiveTab('promo')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${activeTab === 'promo'
                        ? 'bg-indigo-600 text-white border-b-2 border-indigo-400'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <ArrowRightCircle size={18} />
                    Assistant Promotion
                </button>
                <button
                    onClick={() => setActiveTab('closure')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${activeTab === 'closure'
                        ? 'bg-red-600 text-white border-b-2 border-red-400'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <Shield size={18} />
                    Clôture Annuelle
                </button>
            </div>

            {/* Content */}
            <div className="min-h-[600px] bg-white rounded-xl text-gray-800">
                {activeTab === 'calendar' && (
                    <>
                        <SmartCalendar
                            canCreate={true}
                            onCreateClick={() => setIsModalOpen(true)}
                        />

                        <AddEventModal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            onSave={async (data) => {
                                await calendarService.createEvent(data);
                                // SmartCalendar auto-refreshes or we force it? 
                                // Ideally SmartCalendar listens to an update, but for now specific reload might be needed.
                                // Let's keep it simple: Changing state or forcing reload logic inside SmartCalendar would be best.
                                // For MVP: We will update SmartCalendar to expose a refresh method or just reload window (brute force) or trigger a re-fetch.
                                // Actually, SmartCalendar fetches on mount. 
                                // Let's add a key to force re-mount or simple reload.
                                window.location.reload();
                            }}
                        />
                    </>
                )}

                {activeTab === 'council' && <ClassCouncil />}
                {activeTab === 'promo' && <PromotionWizard />}
                {activeTab === 'closure' && <YearEndClosure />}
            </div>
        </div>
    );
};

export default DirectorCurriculumSection;
