import { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions'
import { EntitySchemaColumnOptions } from 'typeorm/entity-schema/EntitySchemaColumnOptions'
import * as R from 'ramda'
import { isGenerated, isNullable } from '../column'

export const getGraphQLType = (type: string) => {
    const types: { [key: string]: string } = {
        string: 'String',
        int: 'Int',
        float: 'Float',
        varchar: 'String'
    }
    return types[type] || types['string']
}

export const toGraphQLUpdate = <T>(entitySchema: EntitySchemaOptions<T>) => `
input ${entitySchema.name}Update {
    ${R.pipe<
        typeof entitySchema.columns,
        typeof entitySchema.columns,
        { [key: string]: string },
        string[],
        string
    > (
        R.pickBy((entitySchema: EntitySchemaColumnOptions, name) => !isGenerated(entitySchema)),
        R.mapObjIndexed((column: EntitySchemaColumnOptions, name) => `${name}: ${getGraphQLType(column.type.toString())}`),
        R.values,
        R.join('\n\t')        
    )(entitySchema.columns)}
}
`

export const toGraphQLCreate = <T>(entitySchema: EntitySchemaOptions<T>) => `
input ${entitySchema.name}Create {
    ${R.pipe<
        typeof entitySchema.columns,
        typeof entitySchema.columns,
        { [key: string]: string },
        string[],
        string
    >(
        R.pickBy((entitySchema: EntitySchemaColumnOptions, name) => !isGenerated(entitySchema)),
        R.mapObjIndexed((column: EntitySchemaColumnOptions, name) => `${name}: ${getGraphQLType(column.type.toString())}${!isNullable(column) ? '!' : ''}`),
        R.values,
        R.join('\n\t')
    )(entitySchema.columns)}
}
`

export const toGraphQLMutations = <T>(entitySchema: EntitySchemaOptions<T>) =>
    [
        `create${entitySchema.name}(data: ${entitySchema.name}Create): ${entitySchema.name}`,
        `update${entitySchema.name}(data: ${entitySchema.name}Update): ${entitySchema.name}`,
        `delete${entitySchema.name}(data: ID): ID`
    ].join('\n\t')

export const toGraphQL = (types: { [key: string]: EntitySchemaOptions<{}>}) => `
${R.pipe<
    typeof types,
    { [key: string]: [string, string]},
    { [key: string]: string },
    string[],
    string
    > (
    R.mapObjIndexed((entitySchema: EntitySchemaOptions<{}>, name) => [
        toGraphQLCreate(entitySchema),
        toGraphQLUpdate(entitySchema),
        //toGraphQLDelete(entitySchema)
    ]),
    R.mapObjIndexed((inputTypes: [string, string]) => inputTypes.join('\n\t')),
    R.values,
    R.join('\n')
)(types)}

type Mutation {
    ${R.pipe<typeof types, { [key: string]: string }, string[], string> (
        R.mapObjIndexed((entitySchema: EntitySchemaOptions<{}>, name) => 
            toGraphQLMutations(entitySchema)
        ),
        R.values,
        R.join('\n\n\t')
    )(types)}
}
`