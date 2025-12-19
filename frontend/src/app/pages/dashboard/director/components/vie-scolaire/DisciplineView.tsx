import { useState } from 'react';
import { AlertTriangle, Trophy } from 'lucide-react';
import { SanctionsList } from './discipline/SanctionsList';
import { RewardsList } from './discipline/RewardsList';

export const DisciplineView = () => {
    const [activeTab, setActiveTab] = useState<'sanctions' | 'rewards'>('sanctions');

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex gap-4">
                <button
                    onClick={() => setActiveTab('sanctions')}
                    className={`flex-1 p-4 rounded-xl border transition-all flex flex-col items-center gap-2
                        ${activeTab === 'sanctions'
                            ? 'bg-red-500/10 border-red-500/50 text-red-400'
                            : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                >
                    <AlertTriangle size={24} />
                    <span className="font-bold">Sanctions</span>
                </button>
                <button
                    onClick={() => setActiveTab('rewards')}
                    className={`flex-1 p-4 rounded-xl border transition-all flex flex-col items-center gap-2
                        ${activeTab === 'rewards'
                            ? 'bg-amber-500/10 border-amber-500/50 text-amber-400'
                            : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                >
                    <Trophy size={24} />
                    <span className="font-bold">Gratifications</span>
                </button>
            </div>

            <div className="bg-[#1a1f37] border border-white/5 rounded-2xl p-6 min-h-[400px]">
                {activeTab === 'sanctions' ? <SanctionsList /> : <RewardsList />}
            </div>
        </div>
    );
};
