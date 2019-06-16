import { EntitySchema } from 'typeorm'
import { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions'
import { createQuery } from 'graphql_typeorm/dist/query'

/** @typedef { import('../types').User } User */
/** @typedef { import('../types').UserResolver } UserResolver */

/** @type  { EntitySchemaOptions<User> } */
export const Schema = {
    name: 'User',
    columns: {
        first: {
            type: 'varchar',
            primary: true
        },
        last: {
            type: 'varchar',
            primary: true
        },
        createdAt: {
            type: 'timestamp with time zone',
            createDate: true
        },
        updatedAt: {
            type: 'timestamp',
            updateDate: true
        }
    },
    relations: {}
}

export const Model = new EntitySchema(Schema)

/** @type { UserResolver } */
export const Resolvers = {
    Query: {
        user: (parent, args, context) =>
            context.connection.getRepository(Model).findOne(args.input),

        users: (parent, args, context) =>
            context.connection.getRepository(Model).find(createQuery(args))
    },
    Mutation: {
        createUser: (parent, args, context) =>
            context.connection.getRepository(Model).save(args.input),

        updateUser: async (parent, args, context) => {
            await context.connection.getRepository(Model).update(args.id, args.patch)
            return context.connection.getRepository(Model).findOne(args.id)
        }
    }
}
