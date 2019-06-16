import { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions'
import { resolvers } from '../resolvers'

export const model = <T>(entitySchema: EntitySchemaOptions<T>, contextPath = '../context') => `
import { EntitySchema }  from 'typeorm'
import { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions'
import { createQuery } from 'graphql_typeorm/dist/query'
import { ${entitySchema.name}, ${entitySchema.name}Resolver } from '../types'

export const Schema: EntitySchemaOptions<${entitySchema.name}> = ${JSON.stringify(entitySchema, null, 4)}

export const Model = new EntitySchema(Schema)

export const Resolvers: ${entitySchema.name}Resolver = ${resolvers(entitySchema)}
`