import { ConnectionOptions } from 'typeorm';

import config from '@src/config';
import { RUN_MODE } from '@src/config/constants';

let entitiesPath: string,
  migrationsPath: string,
  subscribersPath: string,
  entitiesDir: string,
  migrationsDir: string,
  subscribersDir: string;

switch (process.env.NODE_ENV) {
  case RUN_MODE.prod:
    entitiesPath = 'build/src/entities/*.js';
    migrationsPath = 'build/src/migrations/*.js';
    subscribersPath = 'build/src/subscriber/*.js';
    entitiesDir = 'build/src/entity';
    migrationsDir = 'build/src/migrations';
    subscribersDir = 'build/src/subscriber';
    break;
  case RUN_MODE.dev:
    entitiesPath = 'src/entities/*.ts';
    migrationsPath = 'src/migrations/*.ts';
    subscribersPath = 'src/subscriber/*.ts';
    entitiesDir = 'src/entity';
    migrationsDir = 'src/migrations';
    subscribersDir = 'src/subscriber';
    break;
  default:
    entitiesPath = 'src/entities/*.ts';
    migrationsPath = 'src/migrations/*.ts';
    subscribersPath = 'src/subscriber/*.ts';
    entitiesDir = 'src/entity';
    migrationsDir = 'src/migrations';
    subscribersDir = 'src/subscriber';
}

const conectionOptions: ConnectionOptions[] = [
  {
    name: 'default',
    type: 'mysql',
    host: config.orm.host,
    port: config.orm.port,
    username: config.orm.username,
    password: config.orm.password,
    database: config.orm.database,
    synchronize: false,
    logging: false,
    entities: [entitiesPath],
    migrations: [migrationsPath],
    subscribers: [subscribersPath],
    cli: {
      entitiesDir,
      migrationsDir,
      subscribersDir,
    },
  },
  {
    name: 'test',
    type: 'mysql',
    host: config.orm.host,
    port: config.orm.port,
    username: config.orm.username,
    password: config.orm.password,
    database: config.orm.testDatabase,
    synchronize: true,
    dropSchema: true,
    logging: false,
    entities: [entitiesPath],
    migrations: [migrationsPath],
    subscribers: [subscribersPath],
    cli: {
      entitiesDir,
      migrationsDir,
      subscribersDir,
    },
  },
];

export const getConnectionOptionByName = (name: string): ConnectionOptions =>
  conectionOptions.find(_connectionOption => _connectionOption.name === name);

export default conectionOptions;
