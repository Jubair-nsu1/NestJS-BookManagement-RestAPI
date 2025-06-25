import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authors e2e', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  let createdAuthorId: string;

  it('POST /authors — should create a new author', async () => {
    const payload = { firstName: 'Alice', lastName: 'Johnson' };
    const res = await request(app.getHttpServer()).post('/authors').send(payload).expect(201);
    createdAuthorId = res.body._id;
    expect(res.body.firstName).toBe(payload.firstName);
  });

  it('GET /authors/:id — should return created author', async () => {
    const res = await request(app.getHttpServer()).get(`/authors/${createdAuthorId}`).expect(200);
    expect(res.body._id).toBe(createdAuthorId);
    expect(res.body.firstName).toBe('Alice');
  });
});
