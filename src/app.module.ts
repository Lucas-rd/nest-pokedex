import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PokemonModule } from './pokemon/pokemon.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { EnvConfiguration } from './config/env.config';
import { JoiValidationsSchema } from './config/joi.validation';

@Module({
  imports: [

    ConfigModule.forRoot({
      load: [EnvConfiguration],
      validationSchema: JoiValidationsSchema,

    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..','public'),
    }),

    // con esto establecemos la conexion a nuestra base de datos mongoose
    MongooseModule.forRoot(process.env.MONGODB, {
      dbName: 'pokemonsdb'
    }),

    PokemonModule,

    CommonModule,

    SeedModule
  ],
})
export class AppModule {}
