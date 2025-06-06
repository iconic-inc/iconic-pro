const env = process.env;

interface MongodbConfig {
  connectionStr?: string;
  dbName: string;
}

const mongodbConfigEnv: Record<'development' | 'production', MongodbConfig> = {
  development: {
    connectionStr: env.DEV_DB_CONNECTION_STRING,
    dbName: env.DEV_DB_NAME || 'dev_db',
  },
  production: {
    connectionStr: env.PRO_DB_CONNECTION_STRING,
    dbName: env.PRO_DB_NAME || 'prod_db',
  },
};

export const mongodbConfig: MongodbConfig =
  mongodbConfigEnv[env.NODE_ENV as 'development' | 'production'] ||
  mongodbConfigEnv.development;
