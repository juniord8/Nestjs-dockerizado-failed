import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';  // Importa o ConfigModule e o ConfigService
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentsModule } from './modules/students/students.module';
import { DisciplinesModule } from './modules/disciplines/disciplines.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { ContentsModule } from './modules/contents/contents.module';

@Module({
  imports: [
    // Carrega as variáveis de ambiente do arquivo .env
    ConfigModule.forRoot({
      isGlobal: true, // Torna as variáveis de ambiente globais no projeto
      envFilePath: '.env', // Caminho do arquivo .env
    }),

    // Configuração do TypeORM
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',  // Tipo de banco de dados
        host: configService.get('TYPEORM_HOST'),  // Carrega a variável do .env
        port: configService.get<number>('TYPEORM_PORT'),
        username: configService.get('TYPEORM_USERNAME'),
        password: configService.get('TYPEORM_PASSWORD'),
        database: configService.get('TYPEORM_DATABASE'),
        synchronize: configService.get<boolean>('TYPEORM_SYNCHRONIZE'),
        logging: configService.get<boolean>('TYPEORM_LOGGING'),
        entities: [join(__dirname, '**/entities/*.js'), join(__dirname, 'modules/**/entities/*.js')],
      }),
      inject: [ConfigService],  // Injeta o ConfigService para acessar as variáveis de ambiente
    }),

    // Modulos da aplicação
    GraphQLModule.forRoot({
      debug: false,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    StudentsModule,
    DisciplinesModule,
    LessonsModule,
    ContentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
