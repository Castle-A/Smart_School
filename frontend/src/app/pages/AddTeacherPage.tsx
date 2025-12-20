import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Upload, Camera, User, Briefcase, CheckCircle, Loader2, Clock } from 'lucide-react';
import api from '../../shared/api/api';
import Avatar from '../../shared/components/Avatar';
import PhoneInput from '../../shared/components/PhoneInput';
import { useAuth } from '../../shared/contexts/AuthContext';
import { toastEvents } from '../../shared/utils/toast-events';

interface TeacherFormData {
    // Ã‰tape 1 - Personnel
    firstName: string;
    lastName: string;
    gender: 'HOMME' | 'FEMME' | 'DIVERS' | '';
    title: 'MAITRE' | 'MAITRESSE' | 'PROFESSEUR' | 'EDUCATEUR' | '';
    photo?: File;
    photoPreview?: string;
    phone: string;
    email: string;

    // Ã‰tape 2 - Professionnel
    diploma: 'CEAP' | 'CAP' | 'BAPES' | 'CAPES' | 'LICENCE' | 'MASTER' | 'DOCTORAT' | 'AUTRE' | '';
    contractType: 'CDI' | 'CDD' | 'TEMPS_PARTIEL' | 'VACATAIRE' | 'STAGIAIRE' | '';
    hireDate: string;
    matricule: string;
    subjects: string[];
    specialty: string;
    cycle: 'MATERNELLE_PRIMAIRE' | 'COLLEGE' | '';
}



export default function AddTeacherPage() {
    const navigate = useNavigate();
    const { id } = useParams(); // Get ID for edit mode
    const isEditMode = !!id;
    const { user } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false); // New loading state
    const [formData, setFormData] = useState<TeacherFormData>({
        firstName: '',
        lastName: '',
        gender: '',
        title: '',
        phone: '',
        email: '',
        diploma: '',
        contractType: '',
        hireDate: '',
        matricule: '',
        subjects: [],
        specialty: '',
        cycle: '',
    });

    useEffect(() => {
        if (id) {
            fetchTeacher(id);
        }
    }, [id]);

    const fetchTeacher = async (teacherId: string) => {
        try {
            setIsLoading(true);
            const res = await api.get(`/teachers/${teacherId}`);
            const teacher = res.data;

            // Determine cycle from existing title if not explicitly stored (or derived)
            let detectedCycle: 'MATERNELLE_PRIMAIRE' | 'COLLEGE' | '' = '';
            if (teacher.title === 'PROFESSEUR') detectedCycle = 'COLLEGE';
            else if (['MAITRE', 'MAITRESSE', 'EDUCATEUR'].includes(teacher.title)) detectedCycle = 'MATERNELLE_PRIMAIRE';

            setFormData({
                firstName: teacher.firstName,
                lastName: teacher.lastName,
                gender: teacher.gender,
                title: teacher.title,
                phone: teacher.phone,
                email: teacher.email || '',
                diploma: teacher.diploma || '',
                contractType: teacher.contractType,
                hireDate: teacher.hireDate ? new Date(teacher.hireDate).toISOString().split('T')[0] : '', // Format for input date
                matricule: teacher.matricule || '',
                subjects: teacher.subjects || [],
                specialty: teacher.specialty || '',
                cycle: detectedCycle,
                photoPreview: teacher.profilePicture ? teacher.profilePicture : undefined // Assuming profilePicture URL comes from backend
            });
        } catch (err) {
            console.error("Failed to fetch teacher", err);
            toastEvents.error("Impossible de charger les données de l'enseignant.");
            navigate('/app/dashboard');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Skip auto-setting in edit mode or if fetched data is present
        if (isEditMode) return;

        if (user?.directorType === 'PRIMARY_PRESCHOOL') {
            setFormData(prev => {
                if (prev.title === 'EDUCATEUR') {
                    return { ...prev, cycle: 'MATERNELLE_PRIMAIRE' };
                }
                return {
                    ...prev,
                    title: prev.gender === 'FEMME' ? 'MAITRESSE' : 'MAITRE',
                    cycle: 'MATERNELLE_PRIMAIRE'
                };
            });
        } else if (user?.directorType === 'COLLEGE') {
            setFormData(prev => ({
                ...prev,
                title: 'PROFESSEUR',
                cycle: 'COLLEGE'
            }));
        }
    }, [user, formData.gender, isEditMode]); // Added gender dependency to auto-switch MAITRE/MAITRESSE

    const [errors, setErrors] = useState<Partial<Record<keyof TeacherFormData, string>>>({});

    // Validation en temps rÃ©el
    const validateField = (name: keyof TeacherFormData, value: any): string => {
        switch (name) {
            case 'cycle':
                if (user?.directorType === 'BOTH' && !value) return 'Cycle requis';
                return '';

            case 'email':
                if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email invalide';
                return '';
            case 'phone':
                if (!value) return 'TÃ©lÃ©phone requis';
                if (!/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/.test(value)) return 'TÃ©lÃ©phone invalide';
                return '';
            case 'firstName':
            case 'lastName':
                if (!value || value.trim() === '') return 'Champ requis';
                return '';
            case 'gender':
                if (!value) return 'Sexe requis';
                return '';
            case 'title':
                if (!value) return 'Titre requis';
                return '';
            case 'contractType':
                if (!value) return 'Type de contrat requis';
                return '';
            case 'diploma':
                // Optional but good to have
                return '';
            case 'hireDate':
                if (!value) return 'Date d\'embauche requise';
                return '';
            case 'matricule':
                if (value && value.length < 3) return 'Matricule trop court (min 3 caractÃ¨res)';
                return '';
            case 'subjects':
                // Only required for PROFESSEUR
                const isProfessor = formData.title === 'PROFESSEUR';
                if (isProfessor && (!value || value.length === 0)) return 'Au moins une matiÃ¨re requise';
                return '';
            default:
                return '';
        }
    };

    const [availableSubjects, setAvailableSubjects] = useState<any[]>([]);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const res = await api.get('/subjects');
                // Store full subjects to allow filtering by cycle
                setAvailableSubjects(res.data);
            } catch (err) {
                console.error("Failed to fetch subjects", err);
            }
        };
        fetchSubjects();
    }, []);

    const handleChange = (name: keyof TeacherFormData, value: any) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, photo: 'Fichier trop volumineux (max 5MB)' }));
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    photo: file,
                    photoPreview: reader.result as string
                }));
                setErrors(prev => ({ ...prev, photo: '' }));
            };
            reader.readAsDataURL(file);
        }
    };

    const toggleSubject = (subject: string) => {
        setFormData(prev => ({
            ...prev,
            subjects: prev.subjects.includes(subject)
                ? prev.subjects.filter(s => s !== subject)
                : [...prev.subjects, subject]
        }));
        const newSubjects = formData.subjects.includes(subject)
            ? formData.subjects.filter(s => s !== subject)
            : [...formData.subjects, subject];
        const error = validateField('subjects', newSubjects);
        setErrors(prev => ({ ...prev, subjects: error }));
    };

    const canProceedToStep2 = () => {
        const requiredFields: (keyof TeacherFormData)[] = ['firstName', 'lastName', 'gender', 'phone'];
        return requiredFields.every(field => {
            const value = formData[field];
            return value && validateField(field, value) === '';
        });
    };

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleModalClose = () => {
        setShowSuccessModal(false);
        navigate('/app/dashboard', {
            state: {
                section: 'administration',
                view: 'teachers',
            }
        });
    };

    const handleSubmit = async () => {
        console.log('ðŸ”µ Starting submission...', formData);
        setIsSubmitting(true);
        try {
            // Filter out fields not in DTO (cycle, photoPreview)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { cycle, photoPreview, ...rawData } = formData;

            // Clean payload: remove empty strings to prevent validation/DB errors
            const payload: any = { ...rawData };
            Object.keys(payload).forEach(key => {
                const k = key as keyof typeof payload;
                if (payload[k] === '') {
                    payload[k] = undefined;
                }
            });

            let response;
            if (isEditMode && id) {
                response = await api.patch(`/teachers/${id}`, payload);
                console.log('ðŸŸ¢ Teacher updated:', response.data);
            } else {
                response = await api.post('/teachers', payload);
                console.log('ðŸŸ¢ Teacher created:', response.data);
            }

            if (response.data.status === 'PENDING_APPROVAL') {
                setShowSuccessModal(true);
                return;
            }

            // Retour au dashboard section Administration
            navigate('/app/dashboard', {
                state: {
                    section: 'administration',
                    view: 'teachers',
                    updatedTeacher: isEditMode ? { ...response.data } : undefined, // Useful for refreshing list if needed
                    newTeacher: !isEditMode ? { ...response.data, classes: 0 } : undefined
                }
            });
        } catch (error: any) {
            console.error('ðŸ”´ Error saving teacher:', error);
            toastEvents.error(`Erreur lors de la sauvegarde: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const canProceedToStep3 = () => {
        // Matricule removed from required fields
        const requiredFields: (keyof TeacherFormData)[] = ['contractType', 'hireDate', 'subjects'];

        // Remove 'subjects' if not college
        const isCollege = formData.cycle === 'COLLEGE' || (!formData.cycle && formData.title === 'PROFESSEUR');
        const effectiveRequiredFields = isCollege ? requiredFields : requiredFields.filter(f => f !== 'subjects');

        return effectiveRequiredFields.every(field => {
            const value = formData[field];
            return value && validateField(field, value) === '';
        });
    };

    const renderStep1 = () => (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-500/20 rounded-full mb-4">
                    <User className="w-8 h-8 text-indigo-400" />
                </div >
                <h3 className="text-2xl font-bold text-white mb-2">Informations Personnelles</h3>
                <p className="text-gray-400">Renseignez les informations personnelles du professeur</p>
            </div >

            {/* Photo */}
            <div className="flex flex-col items-center mb-6">
                <div className="mb-4">
                    {formData.photoPreview ? (
                        <img src={formData.photoPreview} alt="Preview" className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500/30" />
                    ) : (
                        <div className="w-32 h-32 rounded-full bg-white/10 border-4 border-dashed border-white/20 flex items-center justify-center">
                            <Camera className="w-12 h-12 text-gray-400" />
                        </div>
                    )}
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                />
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/10"
                >
                    <Upload size={16} />
                    Choisir une photo
                </button>
                {errors.photo && <p className="text-red-400 text-sm mt-2">{errors.photo}</p>}
                <p className="text-xs text-gray-500 mt-2">Optionnel - Max 5MB (JPG, PNG, WEBP)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* PrÃ©nom */}
                <div>
                    <label className="block text-white/90 mb-2 text-sm font-medium">
                        PrÃ©nom <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleChange('firstName', e.target.value)}
                        className={`w-full px-4 py-3 bg-white/10 border ${errors.firstName ? 'border-red-500' : 'border-white/10'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition-colors`}
                        placeholder="Jean"
                    />
                    {errors.firstName && <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>}
                </div>

                {/* Nom */}
                <div>
                    <label className="block text-white/90 mb-2 text-sm font-medium">
                        Nom <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleChange('lastName', e.target.value)}
                        className={`w-full px-4 py-3 bg-white/10 border ${errors.lastName ? 'border-red-500' : 'border-white/10'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition-colors`}
                        placeholder="Koffi"
                    />
                    {errors.lastName && <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>}
                </div>
            </div>

            {/* Titre & Genre */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Titre */}
                <div>
                    <label className="block text-white/90 mb-2 text-sm font-medium">
                        Titre <span className="text-red-400">*</span>
                    </label>
                    <select
                        value={formData.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        disabled={user?.directorType === 'COLLEGE'} // Lock for College Director
                        className={`w-full px-4 py-3 bg-white/10 border ${errors.title ? 'border-red-500' : 'border-white/10'} rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors appearance-none ${user?.directorType === 'COLLEGE' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <option value="" className="bg-slate-800 text-gray-400">SÃ©lectionner un titre</option>

                        {/* Options valid for Primary/Maternelle */}
                        {['MATERNELLE_PRIMAIRE', 'BOTH', undefined, ''].includes(user?.directorType) && formData.cycle !== 'COLLEGE' && (
                            <>
                                <option value="MAITRE" className="bg-slate-800">MaÃ®tre (Primaire)</option>
                                <option value="MAITRESSE" className="bg-slate-800">MaÃ®tresse (Maternelle/Primaire)</option>
                                <option value="EDUCATEUR" className="bg-slate-800">Ã‰ducateur / Aide-Maternelle</option>
                            </>
                        )}

                        {/* Options valid for College/Secondary */}
                        {(['COLLEGE', 'BOTH'].includes(user?.directorType || '') || formData.cycle === 'COLLEGE') && (
                            <option value="PROFESSEUR" className="bg-slate-800">Professeur (Secondaire)</option>
                        )}
                    </select>
                    {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
                </div>

                {/* Genre */}
                <div>
                    <label className="block text-white/90 mb-2 text-sm font-medium">
                        Genre <span className="text-red-400">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { value: 'HOMME', label: 'Homme' },
                            { value: 'FEMME', label: 'Femme' },
                            { value: 'DIVERS', label: 'Autre' }
                        ].map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => handleChange('gender', option.value)}
                                className={`px-2 py-3 rounded-lg border transition-colors text-sm ${formData.gender === option.value
                                    ? 'bg-indigo-600 border-indigo-500 text-white'
                                    : 'bg-white/10 border-white/10 text-gray-300 hover:bg-white/20'
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>



            {/* TÃ©lÃ©phone */}
            <div>
                <label className="block text-white/90 mb-2 text-sm font-medium">
                    TÃ©lÃ©phone Personnel <span className="text-red-400">*</span>
                </label>
                <PhoneInput
                    value={formData.phone}
                    onChange={(value) => handleChange('phone', value)}
                    required
                />
                {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
            </div>

            {/* Email */}
            <div>
                <label className="block text-white/90 mb-2 text-sm font-medium">
                    Email Personnel
                </label>
                <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={`w-full px-4 py-3 bg-white/10 border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition-colors`}
                    placeholder="jean.koffi@email.com"
                />
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/20 rounded-full mb-4">
                    <Briefcase className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Informations Professionnelles</h3>
                <p className="text-gray-400">DÃ©tails du contrat et affectation</p>
            </div>

            {/* Choix du Cycle (Uniquement si type de direction 'BOTH') */}
            {user?.directorType === 'BOTH' && (
                <div>
                    <label className="block text-white/90 mb-2 text-sm font-medium">
                        Cycle d'enseignement <span className="text-red-400">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { value: 'MATERNELLE_PRIMAIRE', label: 'Maternelle / Primaire' },
                            { value: 'COLLEGE', label: 'CollÃ¨ge / LycÃ©e' }
                        ].map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    handleChange('cycle', option.value);
                                    // Auto-update title and subjects based on cycle
                                    if (option.value === 'MATERNELLE_PRIMAIRE') {
                                        const newTitle = formData.gender === 'FEMME' ? 'MAITRESSE' : 'MAITRE';
                                        handleChange('title', newTitle);
                                        handleChange('subjects', []); // Reset subjects
                                    } else {
                                        handleChange('title', 'PROFESSEUR');
                                    }
                                }}
                                className={`px-4 py-3 rounded-lg border transition-colors ${formData.cycle === option.value
                                    ? 'bg-emerald-600 border-emerald-500 text-white'
                                    : 'bg-white/10 border-white/10 text-gray-300 hover:bg-white/20'
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Title Display (Read-only) */}
            <div>
                <label className="block text-white/90 mb-2 text-sm font-medium">
                    Titre & Fonction
                </label>
                <div className="px-4 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 font-medium flex justify-between items-center">
                    <span>
                        {formData.title === 'MAITRE' && 'MaÃ®tre (Enseignement Primaire)'}
                        {formData.title === 'MAITRESSE' && 'MaÃ®tresse (Enseignement Primaire)'}
                        {formData.title === 'PROFESSEUR' && 'Professeur (Enseignement Secondaire)'}
                        {formData.title === 'EDUCATEUR' && 'Ã‰ducateur (Vie Scolaire)'}
                    </span>
                    <span className="text-xs bg-emerald-500/20 px-2 py-1 rounded">
                        {formData.cycle === 'MATERNELLE_PRIMAIRE' ? 'Cycle Primaire' : formData.cycle === 'COLLEGE' ? 'Secondaire' : 'Non dÃ©fini'}
                    </span>
                </div>
            </div>

            {/* DiplÃ´me & SpÃ©cialitÃ© */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* DiplÃ´me */}
                <div>
                    <label className="block text-white/90 mb-2 text-sm font-medium">
                        DiplÃ´me / Certification
                    </label>
                    <select
                        value={formData.diploma}
                        onChange={(e) => handleChange('diploma', e.target.value)}
                        className={`w-full px-4 py-3 bg-white/10 border ${errors.diploma ? 'border-red-500' : 'border-white/10'} rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none`}
                    >
                        <option value="" className="bg-slate-800 text-gray-400">SÃ©lectionner un diplÃ´me</option>
                        {/* Primary Diplomas - Only for Primary */}
                        {['MATERNELLE_PRIMAIRE', ''].includes(formData.cycle || '') && formData.title !== 'PROFESSEUR' && (
                            <>
                                <option value="CEAP" className="bg-slate-800">CEAP (Primaire)</option>
                                <option value="CAP" className="bg-slate-800">CAP (Primaire)</option>
                            </>
                        )}
                        {/* College/Lycee Diplomas - Shared or College specific */}
                        <option value="LICENCE" className="bg-slate-800">Licence (AcadÃ©mique/AME)</option>
                        <option value="MASTER" className="bg-slate-800">Master (AcadÃ©mique/AME)</option>

                        {(formData.cycle === 'COLLEGE' || formData.title === 'PROFESSEUR') && (
                            <>
                                <option value="BAPES" className="bg-slate-800">BAPES (CollÃ¨ge)</option>
                                <option value="CAPES" className="bg-slate-800">CAPES (LycÃ©e)</option>
                            </>
                        )}

                        <option value="DOCTORAT" className="bg-slate-800">Doctorat</option>
                        <option value="AUTRE" className="bg-slate-800">Autre</option>
                    </select>
                </div>

                {/* SpÃ©cialitÃ© (Optionnel ou pour Profs) */}
                <div>
                    <label className="block text-white/90 mb-2 text-sm font-medium">
                        SpÃ©cialitÃ© (Optionnel)
                    </label>
                    <input
                        type="text"
                        value={formData.specialty}
                        onChange={(e) => handleChange('specialty', e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-colors"
                        placeholder="Ex: Lettres Modernes, Maths..."
                    />
                </div>
            </div>

            {/* Type de Contrat */}
            <div>
                <label className="block text-white/90 mb-2 text-sm font-medium">
                    Type de Contrat <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                        { value: 'CDI', label: 'CDI' },
                        { value: 'CDD', label: 'CDD' },
                        { value: 'TEMPS_PARTIEL', label: 'Temps Partiel' },
                        { value: 'VACATAIRE', label: 'Vacataire / AME' },
                        { value: 'STAGIAIRE', label: 'Stagiaire' }
                    ].map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => handleChange('contractType', option.value)}
                            className={`px-4 py-3 rounded-lg border transition-colors text-sm ${formData.contractType === option.value
                                ? 'bg-emerald-600 border-emerald-500 text-white'
                                : 'bg-white/10 border-white/10 text-gray-300 hover:bg-white/20'
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
                {errors.contractType && <p className="text-red-400 text-sm mt-1">{errors.contractType}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Date d'embauche */}
                <div>
                    <label className="block text-white/90 mb-2 text-sm font-medium">
                        Date d'Embauche <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="date"
                        lang="fr"
                        value={formData.hireDate}
                        onChange={(e) => handleChange('hireDate', e.target.value)}
                        className={`w-full px-4 py-3 bg-white/10 border ${errors.hireDate ? 'border-red-500' : 'border-white/10'} rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors`}
                    />
                    {errors.hireDate && <p className="text-red-400 text-sm mt-1">{errors.hireDate}</p>}
                </div>

                {/* Matricule */}
                <div>
                    <label className="block text-white/90 mb-2 text-sm font-medium">
                        NumÃ©ro de Matricule
                    </label>
                    <input
                        type="text"
                        value={formData.matricule}
                        onChange={(e) => handleChange('matricule', e.target.value.toUpperCase())}
                        className={`w-full px-4 py-3 bg-white/10 border ${errors.matricule ? 'border-red-500' : 'border-white/10'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-colors uppercase`}
                        placeholder="Optionnel"
                    />
                    {errors.matricule && <p className="text-red-400 text-sm mt-1">{errors.matricule}</p>}
                </div>
            </div>

            {/* MatiÃ¨res (Only for PROFESSEUR) */}
            {(formData.title === 'PROFESSEUR') && (
                <div>
                    <label className="block text-white/90 mb-2 text-sm font-medium">
                        MatiÃ¨re(s) Principale(s) <span className="text-red-400">*</span>
                    </label>

                    {(() => {
                        // Filter subjects based on the current form cycle
                        const filteredSubjects = availableSubjects.filter((s: any) => {
                            // If exact match (e.g. PRIMARY vs PRIMARY)
                            if (s.cycle === formData.cycle) return true;

                            // College Logic
                            if (formData.cycle === 'COLLEGE') {
                                return ['COLLEGE', 'LYCEE', 'COLLEGE_LYCEE', 'LYCEE_TECHNIQUE'].includes(s.cycle);
                            }

                            // Primary Logic (though Managers don't usually select subjects)
                            if (formData.cycle === 'MATERNELLE_PRIMAIRE') {
                                return ['MATERNELLE', 'PRIMAIRE'].includes(s.cycle);
                            }

                            return false;
                        });

                        // Deduplicate names just in case
                        const uniqueSubjects = Array.from(new Set(filteredSubjects.map((s: any) => s.name))).sort();

                        return (
                            <>
                                <p className="text-xs text-gray-400 mb-3">SÃ©lectionnez les matiÃ¨res enseignÃ©es ({uniqueSubjects.length} disponibles pour ce cycle)</p>
                                {uniqueSubjects.length === 0 ? (
                                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-500 text-sm text-center">
                                        {formData.cycle === 'COLLEGE'
                                            ? "Aucune matiÃ¨re secondaire trouvÃ©e. Demandez au Censeur d'en ajouter."
                                            : "Aucune matiÃ¨re trouvÃ©e pour ce cycle."
                                        }
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-64 overflow-y-auto p-2 bg-white/5 rounded-lg border border-white/10">
                                        {uniqueSubjects.map((subject) => (
                                            <button
                                                key={subject}
                                                type="button"
                                                onClick={() => toggleSubject(subject)}
                                                className={`px-3 py-2 rounded-lg border transition-colors text-sm ${formData.subjects.includes(subject)
                                                    ? 'bg-emerald-600 border-emerald-500 text-white'
                                                    : 'bg-white/10 border-white/10 text-gray-300 hover:bg-white/20'
                                                    }`}
                                            >
                                                {subject}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        );
                    })()}

                    {formData.subjects.length > 0 && (
                        <p className="text-sm text-emerald-400 mt-2">{formData.subjects.length} matiÃ¨re(s) sÃ©lectionnÃ©e(s)</p>
                    )}
                    {errors.subjects && <p className="text-red-400 text-sm mt-1">{errors.subjects}</p>}
                </div>
            )}
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full mb-4">
                    <CheckCircle className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">RÃ©capitulatif</h3>
                <p className="text-gray-400">VÃ©rifiez les informations avant de valider</p>
            </div>

            {/* RÃ©capitulatif */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-6">
                {/* Photo et IdentitÃ© */}
                <div className="flex items-center gap-4 pb-6 border-b border-white/10">
                    {formData.photoPreview ? (
                        <img src={formData.photoPreview} alt="Preview" className="w-20 h-20 rounded-full object-cover" />
                    ) : (
                        <Avatar firstName={formData.firstName} lastName={formData.lastName} size="xl" />
                    )}
                    <div>
                        <h4 className="text-xl font-bold text-white">{formData.firstName} {formData.lastName}</h4>
                        <p className="text-gray-400">{formData.gender === 'HOMME' ? 'Masculin' : formData.gender === 'FEMME' ? 'FÃ©minin' : 'Divers'}</p>
                    </div>
                </div>

                {/* Informations Personnelles */}
                <div>
                    <h5 className="text-sm font-semibold text-white/70 uppercase mb-3">Informations Personnelles</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                            <span className="text-gray-400">TÃ©lÃ©phone:</span>
                            <span className="text-white ml-2">{formData.phone}</span>
                        </div>
                        <div>
                            <span className="text-gray-400">Email:</span>
                            <span className="text-white ml-2">{formData.email}</span>
                        </div>
                    </div>
                </div>

                {/* Informations Professionnelles */}
                <div>
                    <h5 className="text-sm font-semibold text-white/70 uppercase mb-3">Informations Professionnelles</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="md:col-span-2 pb-2 mb-2 border-b border-white/5">
                            <span className="text-gray-400">Titre:</span>
                            <span className="text-white ml-2 font-medium">{formData.title}</span>
                            {formData.specialty && <span className="text-gray-400 text-xs ml-2">({formData.specialty})</span>}
                        </div>
                        <div>
                            <span className="text-gray-400">DiplÃ´me:</span>
                            <span className="text-white ml-2">{formData.diploma || '-'}</span>
                        </div>
                        <div>
                            <span className="text-gray-400">Type de Contrat:</span>
                            <span className="text-white ml-2">{formData.contractType?.replace('_', ' ')}</span>
                        </div>
                        <div>
                            <span className="text-gray-400">Date d'Embauche:</span>
                            <span className="text-white ml-2">{new Date(formData.hireDate).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div>
                            <span className="text-gray-400">Matricule:</span>
                            <span className="text-white ml-2">{formData.matricule || '-'}</span>
                        </div>
                    </div>
                </div>

                {/* MatiÃ¨res */}
                {formData.subjects.length > 0 && (
                    <div>
                        <h5 className="text-sm font-semibold text-white/70 uppercase mb-3">MatiÃ¨res ({formData.subjects.length})</h5>
                        <div className="flex flex-wrap gap-2">
                            {formData.subjects.map((subject) => (
                                <span key={subject} className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-sm">
                                    {subject}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                    <p className="text-white text-lg font-medium">Chargement du profil...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] p-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => navigate('/app/dashboard')}
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/10"
                    >
                        <ArrowLeft size={18} />
                        Retour
                    </button>
                    <h1 className="text-2xl font-bold text-white">{isEditMode ? 'Modifier le Professeur' : 'Ajouter un Professeur'}</h1>
                    <div className="w-24"></div> {/* Spacer for centering */}
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-8">
                    {[1, 2, 3].map((step) => (
                        <div key={step} className="flex items-center">
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${currentStep >= step
                                ? 'bg-indigo-600 border-indigo-500 text-white'
                                : 'bg-white/10 border-white/20 text-gray-400'
                                }`}>
                                {currentStep > step ? <Check size={20} /> : step}
                            </div>
                            {step < 3 && (
                                <div className={`w-16 h-0.5 mx-2 transition-colors ${currentStep > step ? 'bg-indigo-500' : 'bg-white/20'
                                    }`}></div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Form Content */}
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
                    <form onSubmit={(e) => e.preventDefault()}>
                        {currentStep === 1 && renderStep1()}
                        {currentStep === 2 && renderStep2()}
                        {currentStep === 3 && renderStep3()}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
                            {currentStep > 1 && (
                                <button
                                    type="button"
                                    onClick={() => setCurrentStep(prev => prev - 1)}
                                    className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/10"
                                >
                                    <ArrowLeft size={18} />
                                    PrÃ©cÃ©dent
                                </button>
                            )}
                            {currentStep < 3 ? (
                                <button
                                    type="button"
                                    onClick={() => setCurrentStep(prev => prev + 1)}
                                    disabled={currentStep === 1 ? !canProceedToStep2() : !canProceedToStep3()}
                                    className={`ml-auto flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${(currentStep === 1 && canProceedToStep2()) || (currentStep === 2 && canProceedToStep3())
                                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20'
                                        : 'bg-white/10 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    Suivant
                                    <ArrowRight size={18} />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className={`ml-auto flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-lg shadow-emerald-500/20 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {isSubmitting ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <Check size={18} />
                                    )}
                                    {isSubmitting ? 'Chargement...' : (isEditMode ? 'Enregistrer les modifications' : 'Valider et CrÃ©er')}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#1e293b] border border-white/10 rounded-2xl w-full max-w-sm p-6 shadow-2xl relative text-center">
                        <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Clock className="w-8 h-8 text-amber-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Demande EnvoyÃ©e</h3>
                        <p className="text-gray-400 mb-6">
                            Votre demande de modification a Ã©tÃ© soumise au directeur pour validation.
                        </p>
                        <button
                            onClick={handleModalClose}
                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-indigo-500/20"
                        >
                            Compris
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
