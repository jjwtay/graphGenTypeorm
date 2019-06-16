import { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions'
import  * as R from 'ramda'
import { EntitySchemaColumnOptions } from 'typeorm'
import { typeOrmToTs } from '../consts'
import resolverType from './resolverTypes'
import findOneType from './findOneType'
import createUpdateType from './createUpdateType'

export const lowerFirst = (str: string) => str.charAt(0).toLowerCase() + str.slice(1)
/*
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
)*/

export const resolvers = <T>(entitySchema: EntitySchemaOptions<T>) =>
`{
    Query: {
        ${lowerFirst(entitySchema.name)}: (parent, args, context) =>
            context.connection.getRepository(Model).findOne(args.input),

        ${lowerFirst(entitySchema.name + 's')}: (parent, args, context) =>
            context.connection.getRepository(Model).find(createQuery(args))
    },
    Mutation: {
        create${entitySchema.name}: (parent, args, context) =>
            context.connection.getRepository(Model).save(args.input),
        
        update${entitySchema.name}: async (parent, args, context) => {
            await context.connection.getRepository(Model).update(args.id, args.patch)
            return context.connection.getRepository(Model).findOne(args.id)
        }
    }
}`