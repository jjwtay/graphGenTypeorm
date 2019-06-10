import { toJS as toTypesJS, toTS as toTypesTS } from './types'
import { toJS as toResolversJS, toTS as toResolversTS } from './resolvers'
import { EntitySchemaRelationOptions } from 'typeorm'
import { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions'
import * as R from 'ramda'

export const toImports: (schema: EntitySchemaOptions<{}>) => string =  R.pipe(
    R.propOr({}, 'relations'),
    R.map((relationship: EntitySchemaRelationOptions) => `import { ${relationship.target} } from './${relationship.target}'`),
    R.values,
    R.join('\n')
)

export const toJS = <T>(entitySchema: EntitySchemaOptions<T>) => `
import { EntitySchema } from 'typeorm'
import { createQuery } from 'graphql_typeorm/dist/query'

${toTypesJS(entitySchema)}

/** @type { EntitySchema<${entitySchema.name}> } */
export const Model = new EntitySchema(${JSON.stringify(entitySchema, null, 4)})

${toResolversJS(entitySchema)}
`

export const toTS = <T>(entitySchema: EntitySchemaOptions<T>) => `
import { EntitySchema }  from 'typeorm'
import { Context } from '../context'
import { QueryArgs, createQuery } from 'graphql_typeorm/dist/query'
${toImports(entitySchema)}

${toTypesTS(entitySchema)}

export const Model = new EntitySchema<${entitySchema.name}>(${JSON.stringify(entitySchema, null, 4)})

${toResolversTS(entitySchema)}
`