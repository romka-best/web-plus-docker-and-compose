import * as path from 'path';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export default () => ({
  port: process.env.PORT || 3000,
  secretKey:
    process.env.JWT_SECRET,
  saltRound: process.env.SALT_ROUND || 10,
  database: {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    port: 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    entities: [path.resolve(`${__dirname}/../**/*.entity{.ts,.js}`)],
    synchronize: true,
  } as PostgresConnectionOptions,
});
