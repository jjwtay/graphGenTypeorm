import { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions'
import  * as R from 'ramda'
import { EntitySchemaColumnOptions } from 'typeorm'
import { typeOrmToTs } from '../consts'

export const lowerFirst = (str: string) => str.charAt(0).toLowerCase() + str.slice(1)

export const getFindOneType = R.pipe<
    EntitySchemaOptions<{}>,
    Record<string, EntitySchemaColumnOptions>,
    Record<string, EntitySchemaColumnOptions>,
    [string, EntitySchemaColumnOptions][],
    string[],
    string,
    string,
    string
> (
    R.propOr({}, 'columns'),
    R.pickBy(R.whereEq({ primary: true })),
    R.toPairs,
    R.map(([name, column]) => `${column.name || name }: ${typeOrmToTs[column.type as string]}`),
    R.join(', '),
    R.concat('{ '),
    (str: string) => `${str} }`
)

export const toTS = <T>(entitySchema: EntitySchemaOptions<T>) => `
export const Resolvers = {
    Query: {
        ${lowerFirst(entitySchema.name)}: async (parent: any, args: ${getFindOneType(entitySchema)}, context: Context) =>
            await context.connection.getRepository(Model).findOne(args),

        ${lowerFirst(entitySchema.name + 's')}: async (parent: any, args: QueryArgs<${entitySchema.name}>, context: Context) =>
            await context.connection.getRepository(Model).find(createQuery(args))
    },
    Mutation: {
        create${entitySchema.name}: async (parent: any, args: { data: Partial<${entitySchema.name}> }, context: Context) =>
            await context.connection.getRepository(Model).create(args.data),
        
        update${entitySchema.name}: async (parent: any, args: { data: Partial<${entitySchema.name}> }, context: Context) => {
            const result = await context.connection.getRepository(Model).update(args.data.id, args.data) as Partial<${entitySchema.name}>
            return await context.connection.getRepository(Model).findOne(result.id)
        }
    }
}`

export const toJS = <T>(entitySchema: EntitySchemaOptions<T>) => `
/** @typedef { import('./graphql_typeorm/query').QueryArgs } QueryArgs */
/** @typedef { import ('../context').Context } Context */

export const Resolvers = {
    Query:  {
        /** @type { (parent: any, args: ${getFindOneType(entitySchema)}, context: Context) => Promise<${entitySchema.name}> } */
        ${lowerFirst(entitySchema.name)}: async (parent, args, context) =>
            await context.connection.getRepository(Model).findOne(args),

        /** @type { (parent: any, args: { data: QueryArgs<${entitySchema.name}> }, context: Context) => Promise<${entitySchema.name}[]> } */
        ${lowerFirst(entitySchema.name + 's')}: async (parent, args, context) =>
            await context.connection.getRepository(Model).find(createQuery(args))
    },
    Mutation: {
        /** @type { (parent: any, args: { data: Partial<${entitySchema.name}> }, context: Context) => Promise<${entitySchema.name}> } */
        create${entitySchema.name}: async (parent, args, context) =>
            await context.connection.getRepository(Model).create(args.data),
        
        /** @type { (parent: any, args: { data: Partial<${entitySchema.name}> }, context: Context) => Promise<${entitySchema.name}> } */
        update${entitySchema.name}: async (parent, args, context) => {
            const result = await context.connection.getRepository(Model).update(args.data.id, args.data)
            return context.connection.getRepository(Model).findOne(result.id)
        }
    }
}`