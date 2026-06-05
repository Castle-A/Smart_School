import { useEffect, useState } from 'react';
import { Search, Check } from 'lucide-react';
import api from '../../../../../../shared/api/api';
import type { WizardData } from './types';

interface StepProps {
    data: WizardData;
    updateData: React.Dispatch<React.SetStateAction<WizardData>>;
}

export const Step2Subjects = ({ data, updateData }: StepProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [availableSubjects, setAvailableSubjects] = useState<any[]>([]);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const res = await api.get('/subjects');
                setAvailableSubjects(res.data);

                // If wizard data has no subjects initialized, populate from all available (disabled by default)
                if (data.subjects.length === 0) {
                    const initialSubjects = res.data.map((s: any) => ({
                        id: s.id,
                        name: s.name,
                        coefficient: s.defaultCoefficient || 2, // Use backend default or 2
                        isEnabled: false
                    }));
                    updateData(prev => ({ ...prev, subjects: initialSubjects }));
                }
            } catch (err) {
                console.error('Failed to fetch subjects', err);
            }
        };

        if (availableSubjects.length === 0) {
            fetchSubjects();
        }
    }, []);

    const toggleSubject = (id: string) => {
        updateData(prev => ({
            ...prev,
            subjects: prev.subjects.map(s => s.id === id ? { ...s, isEnabled: !s.isEnabled } : s)
        }));
    };

    const updateSubject = (id: string, field: 'coefficient', value: number) => {
        updateData(prev => ({
            ...prev,
            subjects: prev.subjects.map(s => s.id === id ? { ...s, [field]: value } : s)
        }));
    };

    const filteredSubjects = data.subjects.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Sélection des Matières</h3>
                <p className="text-gray-400">Activez les matières enseignées et définissez leurs coefficients.</p>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                    type="text"
                    placeholder="Rechercher une matière..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
            </div>

            <div className="bg-[#1a1f37] border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-black/20 text-white">
                        <tr>
                            <th className="px-6 py-4 text-left w-16">
                                <div className="w-4 h-4" />
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Matière</th>
                            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-400 w-32">Coefficient</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredSubjects.map(subject => (
                            <tr key={subject.id} className={`transition-colors ${subject.isEnabled ? 'bg-indigo-500/5 hover:bg-indigo-500/10' : 'hover:bg-white/5'}`}>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => toggleSubject(subject.id)}
                                        className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${subject.isEnabled ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-gray-600 bg-transparent text-transparent hover:border-gray-500'}`}
                                    >
                                        <Check size={14} />
                                    </button>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`font-medium ${subject.isEnabled ? 'text-white' : 'text-gray-500'}`}>{subject.name}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-center">
                                        <input
                                            type="number"
                                            min="0.5"
                                            step="0.5"
                                            value={subject.coefficient}
                                            disabled={!subject.isEnabled}
                                            onChange={(e) => updateSubject(subject.id, 'coefficient', parseFloat(e.target.value))}
                                            className={`w-20 bg-black/20 border rounded-lg px-2 py-1 text-center focus:outline-none focus:border-indigo-500 transition-colors ${subject.isEnabled ? 'text-white border-white/10' : 'text-gray-600 border-transparent cursor-not-allowed'}`}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-end text-sm text-gray-400 px-4">
                Total Coefficients: <span className="text-white font-bold ml-2">{data.subjects.filter(s => s.isEnabled).reduce((acc, curr) => acc + curr.coefficient, 0)}</span>
            </div>
        </div>
    );
};
