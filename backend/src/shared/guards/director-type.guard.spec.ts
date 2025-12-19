import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DirectorTypeGuard } from './director-type.guard';

describe('DirectorTypeGuard', () => {
    let guard: DirectorTypeGuard;
    let reflector: Reflector;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DirectorTypeGuard,
                {
                    provide: Reflector,
                    useValue: {
                        get: jest.fn(),
                    },
                },
            ],
        }).compile();

        guard = module.get<DirectorTypeGuard>(DirectorTypeGuard);
        reflector = module.get<Reflector>(Reflector);
    });

    const createMockContext = (user: any): ExecutionContext => ({
        switchToHttp: () => ({
            getRequest: () => ({ user }),
        }),
        getHandler: () => ({}),
    } as ExecutionContext);

    describe('No required director type', () => {
        it('should allow access when no type is required', () => {
            // Arrange
            jest.spyOn(reflector, 'get').mockReturnValue(undefined);
            const context = createMockContext({ role: 'DIRECTOR' });

            // Act
            const result = guard.canActivate(context);

            // Assert
            expect(result).toBe(true);
        });
    });

    describe('FOUNDER bypass', () => {
        it('should allow FOUNDER to access any certification endpoint', () => {
            // Arrange
            jest.spyOn(reflector, 'get').mockReturnValue('MATERNELLE_PRIMAIRE');
            const context = createMockContext({
                role: 'FOUNDER',
                directorType: null,
            });

            // Act
            const result = guard.canActivate(context);

            // Assert
            expect(result).toBe(true);
        });
    });

    describe('Director type validation', () => {
        it('should allow DIRECTOR with matching type', () => {
            // Arrange
            jest.spyOn(reflector, 'get').mockReturnValue('MATERNELLE_PRIMAIRE');
            const context = createMockContext({
                role: 'DIRECTOR',
                directorType: 'MATERNELLE_PRIMAIRE',
            });

            // Act
            const result = guard.canActivate(context);

            // Assert
            expect(result).toBe(true);
        });

        it('should block DIRECTOR with mismatched type', () => {
            // Arrange
            jest.spyOn(reflector, 'get').mockReturnValue('COLLEGE_LYCEE');
            const context = createMockContext({
                role: 'DIRECTOR',
                directorType: 'MATERNELLE_PRIMAIRE',
            });

            // Act & Assert
            expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
            expect(() => guard.canActivate(context)).toThrow(
                /Collège\/Lycée/,
            );
        });

        it('should block DIRECTOR with null directorType', () => {
            // Arrange
            jest.spyOn(reflector, 'get').mockReturnValue('MATERNELLE_PRIMAIRE');
            const context = createMockContext({
                role: 'DIRECTOR',
                directorType: null,
            });

            // Act & Assert
            expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
        });
    });

    describe('Non-director roles', () => {
        it('should block SECRETARY from certification', () => {
            // Arrange
            jest.spyOn(reflector, 'get').mockReturnValue('MATERNELLE_PRIMAIRE');
            const context = createMockContext({
                role: 'SECRETARY',
                directorType: null,
            });

            // Act & Assert
            expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
            expect(() => guard.canActivate(context)).toThrow(
                /Seuls les directeurs/,
            );
        });

        it('should block ACCOUNTANT from director certification', () => {
            // Arrange
            jest.spyOn(reflector, 'get').mockReturnValue('MATERNELLE_PRIMAIRE');
            const context = createMockContext({
                role: 'ACCOUNTANT',
                directorType: null,
            });

            // Act & Assert
            expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
        });
    });

    describe('Edge cases', () => {
        it('should throw when user is missing', () => {
            // Arrange
            jest.spyOn(reflector, 'get').mockReturnValue('MATERNELLE_PRIMAIRE');
            const context = createMockContext(undefined);

            // Act & Assert
            expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
            expect(() => guard.canActivate(context)).toThrow(
                /non authentifié/,
            );
        });
    });
});
