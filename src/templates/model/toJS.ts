import { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions'
import { resolvers } from '../resolvers'

export const model = <T>(entitySchema: EntitySchemaOptions<T>, contextPath = '../context') => `
import { EntitySchema }  from 'typeorm'
import { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions'
import { createQuery } from 'graphql_typeorm/dist/query'

/** @typedef { import('../types').${entitySchema.name} } ${entitySchema.name} */
/** @typedef { import('../types').${entitySchema.name}Resolver } ${entitySchema.name}Resolver */

/** @type  { EntitySchemaOptions<${entitySchema.name}> } */
export const Schema = ${JSON.stringify(entitySchema, null, 4)}

export const Model = new EntitySchema(Schema)

/** @type { ${entitySchema.name}Resolver } */
export const Resolvers = ${resolvers(entitySchema)}
`