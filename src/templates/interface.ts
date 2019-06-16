import * as R from 'ramda'
import { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions'
import { EntitySchemaRelationOptions } from 'typeorm/entity-schema/EntitySchemaRelationOptions'
import { EntitySchemaColumnOptions } from 'typeorm/entity-schema/EntitySchemaColumnOptions'
import { typeOrmToTs } from '../consts'

export const getType = (type: string): string => typeOrmToTs[type] || ''

export const getRelationshipType = (relationship: EntitySchemaRelationOptions) => {
    return `${relationship.target}${relationship.type === 'one-to-many' || relationship.type === 'many-to-many' ? '[]' : ''}`
}

export const relationshipToTypeField = (relationship: EntitySchemaRelationOptions, name: string) => {
    return `${name}${relationship.nullable ? '?': ''}: ${getRelationshipType(relationship)}`
}

export const columnToTypeField = (column: EntitySchemaColumnOptions, name: string) => {
    return `${name}${column.nullable ?  '?': ''}: ${getType(column.type as string)};`
}

export default (entitySchema: EntitySchemaOptions<{}>) => `export interface ${entitySchema.name} {
    ${R.pipe(
        R.mapObjIndexed(columnToTypeField),
        R.values,
        R.join('\n\t')
    )(entitySchema.columns)}
    ${R.pipe(
        R.mapObjIndexed(relationshipToTypeField),
        R.values,
        R.join('\n\t')
    )(entitySchema.relations)}
}
`
