import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication system', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a sign up request', () => {
    const email = 'justin4@gmail.com';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: email, password: 'password' })
      .expect(201)
      .then((res) => {
        const { id, email } = res?.body;
        expect(email).toEqual(email);
        expect(id).toBeDefined();
      });
  });

  it('sign up as a new user and then get the currently login user', async () => {
    const email = 'asdf@asdf.com';
    //this does not handle cookie, because it is a super agent
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'asdf' })
      .expect(201);

    const cookie = res.get('Set-Cookie');
    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(email);
  });
});

//END TO END TEST
