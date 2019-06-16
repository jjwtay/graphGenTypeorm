import * as R from 'ramda'
import interfaceType from './interface'
import findOneInput from './findOneType'
import createUpdateInput from './createUpdateType'
import resolver from './resolverTypes'
import  { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions'
import { Config } from '../cli'

export default <T>(types: Record<string, EntitySchemaOptions<T>>, contextPath = './context') => R.pipe<
    Record<string, EntitySchemaOptions<T>>,
    Record<string, string[]>,
    Record<string, string>,
    string[],
    string,
    string,
    string,
    string
> (
    R.mapObjIndexed((entity: EntitySchemaOptions<{}>, name) => [
        interfaceType(entity),
        findOneInput(entity),
        createUpdateInput(entity),
        resolver(entity.name),
    ]),
    R.mapObjIndexed(R.join('\n\n')),
    R.values,
    R.join('\n'),
    R.concat('export type ResolverFunction<S,T,U,V> = (parent: S, args: T, context: U) => V\n\n'),
    R.concat(`import { Context } from '${contextPath}'\n\n`),
    R.concat(`import { QueryArgs } from 'graphql_typeorm/dist/query'\n`)
    )(types)