import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Pokemon } from './entities/pokemon.entity';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

@Injectable()
export class PokemonService {

  //Inyecto la dependencia en el constructor del service de la conexion a la base de datos con el Model de mongoose, basicamente aca hago la conec con la bbdd usando la configuracion de Mongoose:
  constructor(
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>
  ){}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase()

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto)
      return pokemon;
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {
    let pokemon: Pokemon

    //busqueda por "no"
    if ( !isNaN( +term ) ) {
      pokemon = await this.pokemonModel.findOne({ no: term })
    }

    //busqueda por "mongo_id"
    if ( !pokemon && isValidObjectId( term ) ) { 
      pokemon = await this.pokemonModel.findById( term )
    }

    //busqueda por "name"
    if ( !pokemon ) {
      pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase().trim() })
    }

    if ( !pokemon ) 
      throw new NotFoundException (`Pokemon with No, Name, or ID '${term}' not found`)

    return pokemon
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne( term )
    if ( updatePokemonDto.name )
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase()
    
    try {
      await pokemon.updateOne( updatePokemonDto, { new: true } )
      return { ...pokemon.toJSON(), ...updatePokemonDto }
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async remove(id: string) {
    // const pokemon = await this.findOne( id )
    // await pokemon.deleteOne()
    // return { id }

    // const result = await this.pokemonModel.findByIdAndDelete( id )
    
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id })
    if ( deletedCount === 0 )
      throw new BadRequestException(`Pokemon with ID: "${ id } not exist in DB`)
    return
  }

  private handleExceptions (error: any) {
    if ( error.code = 11000 ) {
      throw new BadRequestException(`Pokemon already exist in db ${JSON.stringify( error.keyValue )}`)
    }
    console.log(error)
    throw new InternalServerErrorException(`Can't create Pokemon - Check server log`)
  }
}
