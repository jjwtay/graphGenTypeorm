import { JSSchema } from "graphschematojson"
import { Repository } from 'typeorm'
import { Connection } from 'typeorm'
import { EntitySchemaOptions } from "typeorm/entity-schema/EntitySchemaOptions";


type Resolver = (root: any, args: any, context: any, info: any) => any

type QueryResolvers = {
    Query: {
        [key: string]: Resolver
    }
}

type MutationResolvers = {
    Mutation: {
        [key: string]: Resolver
    }
}

type GetRepositoriesObj = {
    schema: JSSchema,
    connection: Connection
}

declare function queryTemplate(schema: JSSchema) : string

declare function mutationTemplate(schema: JSSchema) : string

declare function getQueryResolvers(schema: JSSchema) : QueryResolvers

declare function getMutationResolvers(schema: JSSchema) : MutationResolvers

declare function getRepositories(arg: GetRepositoriesObj) : {
    [key: string]: Repository<any>
}

declare function getEntitySchemas(schema: JSSchema) : EntitySchemaOptions<any>[]