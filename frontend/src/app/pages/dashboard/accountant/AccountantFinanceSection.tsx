import { useState } from 'react';
import { DollarSign, CreditCard, PieChart, History as HistoryIcon, Shield, LayoutDashboard } from 'lucide-react';
import TuitionManager from './components/TuitionManager';
import ExpensesManager from './components/ExpensesManager';
import PayrollManager from './components/PayrollManager';
import AccountantHistorySection from './AccountantHistorySection';
import YearEndClosure from '../components/YearEndClosure';
import FinancialOverview from './components/FinancialOverview';

const AccountantFinanceSection = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'scolarites' | 'depenses' | 'salaires' | 'historique' | 'audit'>('overview');

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Comptabilité Générale</h2>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 border-b border-white/10 mb-6 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-4 py-2 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === 'overview' ? 'text-indigo-400' : 'text-gray-400 hover:text-white'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <LayoutDashboard size={16} />
                        Vue d'ensemble
                    </div>
                    {activeTab === 'overview' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-t-full" />
                    )}
                </button>

                <button
                    onClick={() => setActiveTab('scolarites')}
                    className={`px-4 py-2 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === 'scolarites' ? 'text-indigo-400' : 'text-gray-400 hover:text-white'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <CreditCard size={16} />
                        Scolarités (Recettes)
                    </div>
                    {activeTab === 'scolarites' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-t-full" />
                    )}
                </button>

                <button
                    onClick={() => setActiveTab('depenses')}
                    className={`px-4 py-2 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === 'depenses' ? 'text-indigo-400' : 'text-gray-400 hover:text-white'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <PieChart size={16} />
                        Dépenses (Charges)
                    </div>
                    {activeTab === 'depenses' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-t-full" />
                    )}
                </button>

                <button
                    onClick={() => setActiveTab('salaires')}
                    className={`px-4 py-2 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === 'salaires' ? 'text-indigo-400' : 'text-gray-400 hover:text-white'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <DollarSign size={16} />
                        Salaires (Paie)
                    </div>
                    {activeTab === 'salaires' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-t-full" />
                    )}
                </button>

                <button
                    onClick={() => setActiveTab('audit')}
                    className={`px-4 py-2 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === 'audit' ? 'text-red-400' : 'text-gray-400 hover:text-white'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <Shield size={16} />
                        Audit de Clôture
                    </div>
                    {activeTab === 'audit' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500 rounded-t-full" />
                    )}
                </button>

                <button
                    onClick={() => setActiveTab('historique')}
                    className={`px-4 py-2 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === 'historique' ? 'text-indigo-400' : 'text-gray-400 hover:text-white'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <HistoryIcon size={16} />
                        Historique & Archives
                    </div>
                    {activeTab === 'historique' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-t-full" />
                    )}
                </button>
            </div>

            {/* Content Area */}
            <div className="min-h-[400px]">
                {activeTab === 'overview' && <FinancialOverview />}
                {activeTab === 'scolarites' && <TuitionManager />}
                {activeTab === 'depenses' && <ExpensesManager />}
                {activeTab === 'salaires' && <PayrollManager />}
                {activeTab === 'audit' && <YearEndClosure />}
                {activeTab === 'historique' && <AccountantHistorySection />}
            </div>
        </div>
    );
};

export default AccountantFinanceSection;
