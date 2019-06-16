import { EntitySchema } from 'typeorm'
import { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions'
import { createQuery } from 'graphql_typeorm/dist/query'

/** @typedef { import('../types').Author } Author */
/** @typedef { import('../types').AuthorResolver } AuthorResolver */

/** @type  { EntitySchemaOptions<Author> } */
export const Schema = {
    name: 'Author',
    columns: {
        id: {
            type: 'int',
            primary: true,
            generated: true
        },
        name: {
            type: 'varchar'
        },
        rating: {
            type: 'float',
            nullable: true
        }
    },
    relations: {
        books: {
            type: 'one-to-many',
            target: 'Book'
        }
    }
}

export const Model = new EntitySchema(Schema)

/** @type { AuthorResolver } */
export const Resolvers = {
    Query: {
        author: (parent, args, context) =>
            context.connection.getRepository(Model).findOne(args.input),

        authors: (parent, args, context) =>
            context.connection.getRepository(Model).find(createQuery(args))
    },
    Mutation: {
        createAuthor: (parent, args, context) =>
            context.connection.getRepository(Model).save(args.input),

        updateAuthor: async (parent, args, context) => {
            await context.connection.getRepository(Model).update(args.id, args.patch)
            return context.connection.getRepository(Model).findOne(args.id)
        }
    }
}
