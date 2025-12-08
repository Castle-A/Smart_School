export interface ITeachersRepository {
    create(data: any): Promise<any>;
    findAllBySchoolId(schoolId: string): Promise<any[]>;
    findById(id: string): Promise<any | null>;
    update(id: string, data: any): Promise<any>;
    softDelete(id: string): Promise<void>;
    delete(id: string): Promise<void>;
}
