import { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions'
import { EntitySchemaColumnOptions } from 'typeorm/entity-schema/EntitySchemaColumnOptions'
import { lowerFirst } from './resolvers'
import * as R from 'ramda'

export const getColumnType = (column: EntitySchemaColumnOptions) => {
    const types: { [key: string]: string } = {
        string: 'FieldQueryString',
        int: 'FieldQueryNumber'
    }
    return types[column.type.toString()] || types.string
}

export const columnToGraphQL = (column: EntitySchemaColumnOptions, name: string) =>
    `${name}: ${getColumnType(column)}`

export const toGraphQLWhere = <T>(entitySchema: EntitySchemaOptions<T>) => `
type ${entitySchema.name}Where {
    ${R.pipe<typeof entitySchema.columns, { [key: string]: string }, string[], string> (
        R.mapObjIndexed((column: EntitySchemaColumnOptions, name) => columnToGraphQL(column, name)),
        R.values,
        R.join('\n\t')
    )(entitySchema.columns || {})}
}
`

export const toGraphQLOrder = <T>(entitySchema: EntitySchemaOptions<T>) => `
type Order {
    name: String!
    id: String!
}`

export const toGraphQLQuery = <T>(entitySchema: EntitySchemaOptions<T>) => `
input ${entitySchema.name}Query {
    where: ${entitySchema.name}Where
    take: number
    skip: number
    order: Order
}
`

export const toGraphQLQueries = <T>(entitySchema: EntitySchemaOptions<T>) =>
    [
        `${lowerFirst(entitySchema.name)}(id: Int): ${entitySchema.name}`,
        `${lowerFirst(entitySchema.name)}s(data: ${entitySchema.name}Query): [${entitySchema.name}]`
    ].join('\n\t')

export const toGraphQL = (types: { [key: string]: EntitySchemaOptions<{}>}) => `
type Order {
    name: String!
    id: String!
}

${R.pipe<
    typeof types,
    { [key: string]: [string, string]},
    { [key: string]: string },
    string[],
    string
    > (
    R.mapObjIndexed((entitySchema: EntitySchemaOptions<{}>, name) => [
        toGraphQLWhere(entitySchema),
        toGraphQLQuery(entitySchema),
    ]),
    R.mapObjIndexed((inputTypes: [string, string]) => inputTypes.join('\n\t')),
    R.values,
    R.join('\n')
)(types)}

type Query {
    ${R.pipe<typeof types, { [key: string]: string }, string[], string> (
        R.mapObjIndexed((entitySchema: EntitySchemaOptions<{}>, name) => 
            toGraphQLQueries(entitySchema)
        ),
        R.values,
        R.join('\n\n\t')
    )(types)}
}
`