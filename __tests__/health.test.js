const request = require('supertest');

process.env.NODE_ENV = 'test';
process.env.SESSION_SECRET = 'test_session_secret';

const app = require('../src/index');

describe('health endpoint', () => {
    test('returns ok status', async () => {
        const res = await request(app).get('/health').expect(200);

        expect(res.body).toEqual({ status: 'ok' });
    });
});
