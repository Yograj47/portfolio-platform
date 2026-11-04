if (!process.env.TEST_DATABASE_URL)
  throw new Error('TEST_DATABASE_URL must point to an isolated test database');
const url = new URL(process.env.TEST_DATABASE_URL);
if (
  !['127.0.0.1', 'localhost'].includes(url.hostname) ||
  url.pathname !== '/portfolio_test' ||
  url.port !== '55439'
)
  throw new Error('Refusing non-isolated database');
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
process.env.NODE_ENV = 'test';
process.env.CLIENT_URL = 'http://localhost:3000';
process.env.JWT_ACCESS_SECRET = 'test-access-secret-'.repeat(4);
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-'.repeat(4);
process.env.IMAGEKIT_PRIVATE_KEY = 'test-key-not-used';
process.env.CV_ALLOWED_HOSTS = 'assets.example.com';
