import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"


//Las entidades hacen relacion con las "tablas" de las bases de datos.
//Cada instancia de esta clase, seria un registro en esa tabla de bbdd.
//En este caso, como la base es una MongoDB, cada instancia de esta clase seria un documento de mi coleccion en esa bbdd.

@Schema()
export class Pokemon extends Document {
    // id: string Mongo ya me lo genera automaticamente.

    @Prop({
        unique: true,
        index: true,
    })
    name: string

    @Prop({
        unique: true,
        index: true,
    })
    no:  number

}

// aqui definimos cual sera el schema que le servimos al modulo de pokemon que usara para interactuar con la base. Como vemos esta creado a partir de la entity "Pokemon" que a su vez extiende de Documents de Mongoose.
export const PokemonSchema = SchemaFactory.createForClass( Pokemon )