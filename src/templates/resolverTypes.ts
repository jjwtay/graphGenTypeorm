import { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions'
import { lowerFirst } from './resolvers'

export default (name: string) =>

`export type ${name}Resolver = {
    Query: {
        ${lowerFirst(name)}: ResolverFunction<any, {input: FindOne${name}}, Context, Promise<${name}>>,
        ${lowerFirst(name)}s: ResolverFunction<any, QueryArgs<${name}>, Context, Promise<${name}[]>>
    },
    Mutation: {
        create${name}: ResolverFunction<any, {input: CreateUpdate${name}}, Context, Promise<${name}>>,
        update${name}: ResolverFunction<any, {id: FindOne${name}, patch: CreateUpdateAuthor}, Context, Promise<${name}>>
    }
}
`