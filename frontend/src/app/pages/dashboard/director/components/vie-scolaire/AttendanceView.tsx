import { DailyStats } from './attendance/DailyStats';
import { RecentAbsences } from './attendance/RecentAbsences';

export const AttendanceView = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            <DailyStats />
            <div className="bg-[#1a1f37] border border-white/5 rounded-2xl p-6 min-h-[400px]">
                <h3 className="text-xl font-bold text-white mb-6">Suivi des Absences & Retards</h3>
                <RecentAbsences />
            </div>
        </div>
    );
};
