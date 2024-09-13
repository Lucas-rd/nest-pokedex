import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  constructor(
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>,

    //patron adaptardor para eliminar la inyeccion y dependencia de Axios en nuestro proyecto
    private readonly http: AxiosAdapter,
  ){}

  async executeSeed() {

    await this.pokemonModel.deleteMany({})

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650')

    let pokemonToInsertArray: { name: string, no: number }[] = []

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/')
      const no = +segments[segments.length - 2]

      pokemonToInsertArray.push({ name, no })
    })

    await this.pokemonModel.insertMany(pokemonToInsertArray)
    
    
    return { result: 'Pokemon seed Inserted', Pokemons_Inserted: pokemonToInsertArray }
  }

}
