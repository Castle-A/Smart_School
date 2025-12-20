import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { StorageModule } from '../src/infrastructure/storage/storage.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '../src/infrastructure/prisma/prisma.service';

// Mock PrismaService
const mockPrismaService = {
  storedFile: {
    create: jest.fn().mockImplementation((args) =>
      Promise.resolve({
        id: 'test-file-id',
        ...args.data,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ),
    findUnique: jest.fn().mockImplementation((args) => {
      if (args.where.id === 'test-file-id') {
        return Promise.resolve({
          id: 'test-file-id',
          objectKey: 'test-key',
          bucket: 'test-bucket',
          schoolId: 'test-school-id',
        });
      }
      return null;
    }),
    delete: jest.fn().mockResolvedValue(true),
  },
};

// Mock S3 Client (R2)
jest.mock('@aws-sdk/client-s3', () => {
  return {
    S3Client: jest.fn().mockImplementation(() => {
      return {
        send: jest.fn().mockImplementation((command) => {
          if (command.constructor.name === 'PutObjectCommand') {
            return Promise.resolve({ ETag: '"test-etag"' });
          }
          if (command.constructor.name === 'DeleteObjectCommand') {
            return Promise.resolve({});
          }
          if (command.constructor.name === 'GetObjectCommand') {
            return Promise.resolve({});
          }
          return Promise.resolve({});
        }),
      };
    }),
    PutObjectCommand: jest.fn(),
    DeleteObjectCommand: jest.fn(),
    GetObjectCommand: jest.fn(),
  };
});

jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: jest.fn().mockResolvedValue('https://mock-signed-url'),
}));

describe('StorageController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true }), StorageModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/files/upload-test (POST)', () => {
    return request(app.getHttpServer())
      .post('/files/upload-test')
      .field('schoolId', 'test-school-id')
      .field('type', 'generic')
      .attach('file', Buffer.from('test content'), 'test.txt')
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body.schoolId).toBe('test-school-id');
      });
  });

  it('/files/:id/download (GET)', () => {
    return request(app.getHttpServer())
      .get('/files/test-file-id/download?schoolId=test-school-id')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('url', 'https://mock-signed-url');
      });
  });
});
