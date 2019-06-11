import * as R from 'ramda'
import { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions'
import { EntitySchemaRelationOptions } from 'typeorm/entity-schema/EntitySchemaRelationOptions'
import { EntitySchemaColumnOptions } from 'typeorm/entity-schema/EntitySchemaColumnOptions'

export const getType = (type: string): string => {
    const map: { [key: string]: string } = {
        int: 'number',
        string: 'string',
        float: 'number',
        varchar: 'string'
    }

    return map[type] || ''
}

export const getRelationshipType = (relationship: EntitySchemaRelationOptions) => {
    return `${relationship.target}${relationship.type === 'one-to-many' || relationship.type === 'many-to-many' ? '[]' : ''}`
}

export const relationshipToTypeField = (relationship: EntitySchemaRelationOptions, name: string) => {
    return `${name}: ${getRelationshipType(relationship)}`
}

export const columnToTypeField = (column: EntitySchemaColumnOptions, name: string) => {
    return `${name}: ${getType(column.type as string)};`
}

export const toTS = (entitySchema: EntitySchemaOptions<{}>) => `export interface ${entitySchema.name} {
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

export const toJS = (entitySchema: EntitySchemaOptions<{}>) => `/** @typedef { import('./types').${entitySchema.name} } ${entitySchema.name}`
/*
export const toJS = R.pipe(
    R.propOr({}, 'relations'),
    R.mapObjIndexed((value, name) => `/** @typedef {import('./types').${(value as any).target}} ${name}`),
    R.values,
    R.join('\n')
)
*/