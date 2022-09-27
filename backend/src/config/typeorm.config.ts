import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmAsyncModuleOptions = {
  useFactory: async (): Promise<TypeOrmModuleOptions> => ({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: 3306,
    username: 'root',
    password: process.env.DB_PASS,
    database: 'preonboard',
    entities: [__dirname + '/apis/**/*.entity.*'],
    synchronize: process.env.MODE == 'dev',
    logging: true,
    charset: 'utf8mb4',
    timezone: 'Asia/Seoul',
  }),
};
