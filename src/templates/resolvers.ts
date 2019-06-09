import { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions'

export const lowerFirst = (str: string) => str.charAt(0).toLowerCase() + str.slice(1)

export const toTS = <T>(entitySchema: EntitySchemaOptions<T>) => `
export const Resolvers = {
    Query: {
        ${lowerFirst(entitySchema.name)}: async (parent: any, args: { id:  string | number }, context: any) => 
            await context.repositories.${entitySchema.name}.findOne(args.id),

        ${lowerFirst(entitySchema.name + 's')}: async (parent: any, args: QueryArgs<${entitySchema.name}>, context: any) =>
            await context.repositories.${entitySchema.name}.find(createQuery(args))
    },
    Mutation: {
        create${entitySchema.name}: async (parent: any, args: { data: Partial<${entitySchema.name}> }, context: any) =>
            await context.repositories.${entitySchema.name}.create(args.data),
        
        update${entitySchema.name}: async (parent: any, args: { data: Partial<${entitySchema.name}> }, context: any) => {
            const result = await context.repositories.${entitySchema.name}.update(args.data.id, args.data) as Partial<${entitySchema.name}>
            return await context.repositories.${entitySchema.name}.findOne(result.id)
        }
    }
}`

export const toJS = <T>(entitySchema: EntitySchemaOptions<T>) => `
/** @typedef { import('./graphql_typeorm/query').QueryArgs } QueryArgs */

export const Resolvers = {
    Query:  {
        /** @type { (parent: any, args: { id: string | number }, context: any) => Promise<${entitySchema.name}> } */
        ${lowerFirst(entitySchema.name)}: async (parent, args, context) => 
            await context.repositories.${entitySchema.name}.findOne(args.id),

        /** @type { (parent: any, args: { data: QueryArgs<${entitySchema.name}> }, context: any) => Promise<${entitySchema.name}[]> } */
        ${lowerFirst(entitySchema.name + 's')}: async (parent, args, context) =>
            await context.repositories.${entitySchema.name}.find(createQuery(args))       
    },
    Mutation: {
        /** @type { (parent: any, args: { data: Partial<${entitySchema.name}> }, context: any) => Promise<${entitySchema.name}> } */
        create${entitySchema.name}: async (parent, args, context) =>
            await context.repositories.${entitySchema.name}.create(args.data),
        
        /** @type { (parent: any, args: { data: Partial<${entitySchema.name}> }, context: any) => Promise<${entitySchema.name}> } */
        update${entitySchema.name}: async (parent, args, context) => {
            const result = await context.repositories.${entitySchema.name}.update(args.data.id, args.data)
            return context.repositories.${entitySchema.name}.findOne(result.id)
        }
    }
}`