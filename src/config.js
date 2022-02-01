module.exports = {
  app: {
    port: process.env.API_PORT,
    environment: process.env.API_ENVIRONMENT,
  },
  development: {
    client: 'pg',
    connection: process.env.DEV_DATABASE_URL
  },
  testing: {
    client: 'pg',
    connection: process.env.TEST_DATABASE_URL
  },
  production: {
    client: 'pg',
    connection: process.env.PROD_DATABASE_URL
  },
  jwtconf: {
    saltRounds: process.env.JWT_SALT_ROUNDS,
    jwtSecret: process.env.JWT_SECRET,
    accessTokenExpireTime: process.env.JWT_ACCESS_TOKEN_EXP,
    refreshTokenExpireTime: process.env.JWT_REFRESH_TOKEN_EXP
  },
  mailer: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASSWORD,
  }
};