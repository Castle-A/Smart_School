import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { FinanceService } from '../../../../api/finance.service';
import type { GlobalStats, FinancialReport } from '../../../../api/finance.service';
import StatsCard from '../../../../../shared/components/ui/StatsCard';
import { DollarSign, TrendingDown, Wallet } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const FinancialOverview = () => {
    const [stats, setStats] = useState<GlobalStats | null>(null);
    const [report, setReport] = useState<FinancialReport | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsData, reportData] = await Promise.all([
                    FinanceService.getGlobalStats(),
                    FinanceService.getReport()
                ]);
                setStats(statsData);
                setReport(reportData);
            } catch (error) {
                console.error("Failed to fetch financial data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="text-white">Chargement des données financières...</div>;

    const chartData = {
        labels: report?.labels || [],
        datasets: [
            {
                label: 'Revenus',
                data: report?.income || [],
                borderColor: '#10b981', // green-500
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                tension: 0.4
            },
            {
                label: 'Dépenses',
                data: report?.expense || [],
                borderColor: '#ef4444', // red-500
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                fill: true,
                tension: 0.4
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: { color: '#9ca3af' }
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                ticks: { color: '#9ca3af' }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#9ca3af' }
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    title="Chiffre d'Affaires (Annuel)"
                    value={`${stats?.totalIncome.toLocaleString()} FCFA`}
                    icon={DollarSign}
                    color="green"
                />
                <StatsCard
                    title="Dépenses Totales"
                    value={`${stats?.totalExpense.toLocaleString()} FCFA`}
                    icon={TrendingDown}
                    color="red"
                />
                <StatsCard
                    title="Résultat Net"
                    value={`${stats?.balance.toLocaleString()} FCFA`}
                    icon={Wallet}
                    color={stats?.balance && stats.balance >= 0 ? 'indigo' : 'orange'}
                />
            </div>

            {/* Main Chart */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4">Flux Financiers (Revenus vs Dépenses)</h3>
                <div className="h-[400px]">
                    <Line data={chartData} options={options} />
                </div>
            </div>
        </div>
    );
};

export default FinancialOverview;
