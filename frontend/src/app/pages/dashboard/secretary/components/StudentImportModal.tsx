import React, { useState } from 'react';
import { Upload, X, Check, AlertTriangle, Download, RefreshCw } from 'lucide-react';
import api from '../../../../../shared/api/api';

interface StudentImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const CSV_TEMPLATE = `Nom,Prénoms,Matricule,Date Naissance,Genre,Classe,Nom Parent,Téléphone Parent,Adresse,École Provenance
DOSSOU,Jean,M2023001,2010-05-20,HOMME,6ème A,M. DOSSOU Paul,0197000000,Cotonou,
AKPO,Marie,M2023002,2011-02-15,FEMME,5ème B,Mme AKPO Pierre,0196000000,Calavi,Complexe Scolaire X`;

const StudentImportModal: React.FC<StudentImportModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [step, setStep] = useState<'UPLOAD' | 'PREVIEW' | 'IMPORTING' | 'RESULT'>('UPLOAD');
    const [parsedData, setParsedData] = useState<any[]>([]);
    const [errors, setErrors] = useState<string[]>([]);
    const [importResult, setImportResult] = useState<any>(null);

    if (!isOpen) return null;

    const handleDownloadTemplate = () => {
        const blob = new Blob([CSV_TEMPLATE], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'modele_import_eleves.csv';
        link.click();
    };

    const parseCSV = (text: string) => {
        const lines = text.split(/\r\n|\n/).filter(line => line.trim() !== '');
        if (lines.length < 2) return [];

        const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
        const result = [];

        for (let i = 1; i < lines.length; i++) {
            const currentline = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, '')); // Simple split, assumes no commas in values
            if (currentline.length === headers.length) {
                const obj: any = {};
                headers.forEach((header, j) => {
                    obj[header] = currentline[j];
                });
                result.push(obj);
            }
        }
        return result;
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = e.target.files?.[0];
        if (!uploadedFile) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            const data = parseCSV(text);

            // Map to Backend DTO
            const mappedData = data.map((row: any) => ({
                lastName: row['Nom'],
                firstName: row['Prénoms'],
                matricule: row['Matricule'],
                dob: row['Date Naissance'],
                gender: row['Genre']?.toUpperCase() === 'F' ? 'FEMME' : (row['Genre']?.toUpperCase() === 'M' ? 'HOMME' : row['Genre']),
                // Optional
                parentName: row['Nom Parent'] || '',
                parentPhone: row['Téléphone Parent'] || '',
                address: row['Adresse'] || '',
                previousSchool: row['École Provenance'] || null, // If empty, backend treats as internal/none
                className: row['Classe'] // We need to resolve Class ID? 
                // Ah, backend import service expects classId? 
                // The current service logic I wrote: "classId: s.classId". 
                // Ideally, backend should resolve class Name to ID, or frontend does it. 
                // Let's assume for now user puts Class Name, and we might need to match it to an ID on frontend if we have the list, 
                // or backend handles name lookup.
                // Given I didn't write Name lookup in backend, let's try to match on frontend if possible, or send as is and update backend to lookup.
                // Update: I will check if I can fetch classes here to map.
            }));

            setParsedData(mappedData);
            setStep('PREVIEW');
        };
        reader.readAsText(uploadedFile);
    };

    const handleImport = async () => {
        setStep('IMPORTING');
        try {
            // Fetch classes to map names to IDs
            // This is "best effort" mapping
            let classesMap: { [key: string]: string } = {};
            try {
                const res = await api.get('/classes');
                if (Array.isArray(res.data)) {
                    res.data.forEach((c: any) => classesMap[c.name.trim().toUpperCase()] = c.id);
                }
            } catch (e) {
                console.warn("Could not fetch classes for mapping");
            }

            const finalData = parsedData.map(s => ({
                ...s,
                classId: s.className ? classesMap[s.className.trim().toUpperCase()] : undefined
            }));

            const response = await api.post('/students/import', { students: finalData });
            setImportResult(response.data);
            setStep('RESULT');
            if (response.data.imported > 0) {
                onSuccess(); // Trigger refresh on parent
            }
        } catch (err: any) {
            setErrors([err.message || 'Erreur lors de l\'importation']);
            setStep('RESULT');
        }
    };

    const reset = () => {
        setParsedData([]);
        setErrors([]);
        setImportResult(null);
        setStep('UPLOAD');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#1e293b] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
                <div className="bg-[#0f172a] p-6 border-b border-white/10 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Upload size={24} className="text-indigo-400" />
                        Importation des Élèves
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={24} /></button>
                </div>

                <div className="p-6">
                    {step === 'UPLOAD' && (
                        <div className="space-y-6">
                            <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                                <h3 className="text-indigo-300 font-medium mb-2 flex items-center gap-2">
                                    <Download size={18} />
                                    1. Télécharger le modèle
                                </h3>
                                <p className="text-sm text-gray-400 mb-3">Utilisez ce fichier CSV comme base. Ne modifiez pas l'ordre des colonnes.</p>
                                <button onClick={handleDownloadTemplate} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors">
                                    Télécharger le modèle CSV
                                </button>
                            </div>

                            <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:bg-white/5 transition-colors relative">
                                <input
                                    type="file"
                                    accept=".csv"
                                    onChange={handleFileUpload}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <Upload size={48} className="mx-auto text-gray-500 mb-4" />
                                <p className="text-gray-300 font-medium">Cliquez ou glissez un fichier CSV ici</p>
                                <p className="text-sm text-gray-500 mt-2">Format supporté: .csv (séparateur virgule)</p>
                            </div>
                        </div>
                    )}

                    {step === 'PREVIEW' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-white font-medium">Aperçu ({parsedData.length} élèves)</h3>
                                <button onClick={reset} className="text-sm text-red-400 hover:underline">Changer de fichier</button>
                            </div>

                            <div className="max-h-60 overflow-y-auto custom-scrollbar border border-white/10 rounded-lg">
                                <table className="w-full text-sm text-left text-gray-400">
                                    <thead className="bg-black/20 text-gray-200 sticky top-0">
                                        <tr>
                                            <th className="px-4 py-2">Matricule</th>
                                            <th className="px-4 py-2">Nom</th>
                                            <th className="px-4 py-2">Prénoms</th>
                                            <th className="px-4 py-2">Classe</th>
                                            <th className="px-4 py-2">Prov.</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {parsedData.slice(0, 10).map((row, i) => (
                                            <tr key={i} className="border-b border-white/5">
                                                <td className="px-4 py-2 font-mono text-xs text-white">{row.matricule}</td>
                                                <td className="px-4 py-2">{row.lastName}</td>
                                                <td className="px-4 py-2">{row.firstName}</td>
                                                <td className="px-4 py-2">{row.className || '-'}</td>
                                                <td className="px-4 py-2">{row.previousSchool || <span className="text-gray-600 italic">Interne</span>}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {parsedData.length > 10 && (
                                    <p className="text-center text-xs text-gray-500 py-2">... et {parsedData.length - 10} autres lignes</p>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button onClick={reset} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg">Annuler</button>
                                <button onClick={handleImport} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2">
                                    <Check size={18} /> Confirmer l'Import
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'IMPORTING' && (
                        <div className="text-center py-12">
                            <RefreshCw size={48} className="mx-auto text-indigo-500 animate-spin mb-4" />
                            <p className="text-white font-medium">Importation en cours...</p>
                            <p className="text-sm text-gray-400">Veuillez patienter pendant le traitement des données.</p>
                        </div>
                    )}

                    {step === 'RESULT' && (
                        <div className="space-y-6">
                            {importResult?.imported > 0 && (
                                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-3">
                                    <Check size={24} className="text-green-400 mt-1" />
                                    <div>
                                        <h4 className="text-green-400 font-bold">Importation Réussie !</h4>
                                        <p className="text-green-300/80 text-sm mt-1">{importResult.imported} élèves ont été ajoutés ou mis à jour.</p>
                                    </div>
                                </div>
                            )}

                            {(importResult?.errors?.length > 0 || errors.length > 0) && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                                    <h4 className="text-red-400 font-bold flex items-center gap-2 mb-2">
                                        <AlertTriangle size={18} />
                                        Erreurs rencontrées
                                    </h4>
                                    <ul className="text-sm text-red-300 space-y-1 list-disc pl-5 max-h-40 overflow-y-auto">
                                        {errors.map((e, i) => <li key={`g-${i}`}>{e}</li>)}
                                        {importResult?.errors?.map((e: string, i: number) => <li key={`api-${i}`}>{e}</li>)}
                                    </ul>
                                </div>
                            )}

                            <div className="flex justify-end pt-4">
                                <button onClick={onClose} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">Fermer</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentImportModal;
