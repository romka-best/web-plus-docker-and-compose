import * as path from 'path';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export default () => ({
  port: process.env.PORT || 4000,
  secretKey:
    process.env.JWT_SECRET ||
    '8f1baf87897472917b20057f7ea78c3a0120ad974977e7533e2c575d02311f99',
  saltRound: process.env.SALT_ROUND || 10,
  database: {
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    database: process.env.POSTGRES_DB || 'kupipodariday',
    port: 5432,
    username: process.env.POSTGRES_USER || 'student',
    password: process.env.POSTGRES_PASSWORD || 'student',
    entities: [path.resolve(`${__dirname}/../**/*.entity{.ts,.js}`)],
    synchronize: true,
  } as PostgresConnectionOptions,
});
