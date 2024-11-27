import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'phurich5',
    database: 'multilingual_product',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true, 
}
