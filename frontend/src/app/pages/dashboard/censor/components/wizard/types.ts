export interface WizardData {
    identity: {
        cycle: string;
        level: string;
        series?: string;
        name: string;
        room: string;
    };
    subjects: {
        id: string; // standard subject ID
        name: string;
        coefficient: number;
        // hours removed
        isEnabled: boolean;
        teacherId?: string; // assigned teacher
    }[];
    mainTeacherId: string | null;
    classId?: string; // For existing class assembly
    // Original count for subjects validation if needed
}
