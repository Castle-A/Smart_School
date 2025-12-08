export interface ISubjectsRepository {
    create(data: any): Promise<any>;
    findAllBySchoolId(schoolId: string): Promise<any[]>;
    findById(id: string): Promise<any | null>;
    update(id: string, data: any): Promise<any>;
    delete(id: string): Promise<void>;
}
