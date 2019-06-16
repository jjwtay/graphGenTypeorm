import { EntitySchema } from 'typeorm'
import { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions'
import { createQuery } from 'graphql_typeorm/dist/query'

/** @typedef { import('../types').Book } Book */
/** @typedef { import('../types').BookResolver } BookResolver */

/** @type  { EntitySchemaOptions<Book> } */
export const Schema = {
    name: 'Book',
    columns: {
        id: {
            type: 'int',
            primary: true,
            generated: true
        },
        title: {
            type: 'string'
        }
    },
    relations: {
        author: {
            type: 'many-to-one',
            target: 'Author'
        }
    }
}

export const Model = new EntitySchema(Schema)

/** @type { BookResolver } */
export const Resolvers = {
    Query: {
        book: (parent, args, context) =>
            context.connection.getRepository(Model).findOne(args.input),

        books: (parent, args, context) =>
            context.connection.getRepository(Model).find(createQuery(args))
    },
    Mutation: {
        createBook: (parent, args, context) =>
            context.connection.getRepository(Model).save(args.input),

        updateBook: async (parent, args, context) => {
            await context.connection.getRepository(Model).update(args.id, args.patch)
            return context.connection.getRepository(Model).findOne(args.id)
        }
    }
}
