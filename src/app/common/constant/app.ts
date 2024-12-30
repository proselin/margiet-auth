export const defaultVariables = {
  app: {
    port: 3000,
    host: '0.0.0.0',
    apiPrefix: 'api',
    appId: '000000-00000-0000000-000000',
  },

  redis: {
    host: '127.0.0.1',
    port: 6379,
  },

  database: {
    name: 'mariget-auth',
    uri: 'postgres://127.0.0.1:5432',
  },

  cache: {
    ttl: 60 * 100, //60s
    max: 1000, //default max
    refreshThreshold: 50 * 100, // 50s
  },

  swagger: {
    enable: true,
    path: '/swagger',
  },
};
