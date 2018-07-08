# graphGenTypeorm
Generate TypeORM Entities and Query/Mutation/Field Resolvers for use with graphql.

# Important
Library requires:
+ [TypeORM](https://github.com/typeorm/typeorm)
+ [GraphQL Tools](https://github.com/apollographql/graphql-tools)
+ [GraphSchemaToJSON](https://github.com/jjwtay/graphSchemaToJson)
+ [GraphQL Import](https://github.com/prismagraphql/graphql-import) Optional



*Example graphql file usage*

    # import Entity, PrimaryGeneratedColumn, ManyToMany, ManyToOne, OneToMany, EntityEnum, Column from 'graphgentypeorm/src/typeorm.graphql'
    # optional graphql-import of all typeorm directives
    # alternatively you can just combine the files and not use graphql-import

    type Author @Entity {
        id: Int! @PrimaryGeneratedColumn
        name: String! @Column({type: "varchar"})
        books: [Book] @ManyToMany(inverseSide: "authors") @JoinColumn
    }

    type Book @Entity {
        id: Int! @PrimaryGeneratedColumn
        title: String! @Column({type: "varchar"})
        description: String @Column({type: "varchar"})
        authors: [Author] @ManyToMany(inverseSide: "books")
        publisher: Publisher @ManyToOne(inverseSide: "books")
    }

    type Publisher @Entity {
        id: Int! @PrimaryGeneratedColumn
        name: String! @Column({type: "varchar"})
        books: @OneToMany(inverseSide: "publisher")
    }

*Create graphql Query and Mutation graphql files*

    import { schemaToJS } from 'graphschematojson'
    import { queryTemplate, mutationTemplate } from 'graphgentypeorm'
    import { importSchema } from 'graphql-import'
    import { makeExecutableSchema } from 'graphql-tools'
    import { mkdirSync, writeFileSync } from 'fs'

    const typeDefs = importSchema('./path/to/schema.graphql')
    const schema = makeExecutableSchema({typeDefs, resolvers: {}})
    const jsSchema = schemaToJS(schema)

    if (!existsSync('./generated')) {
        mkdirSync('./generated')
    }
    writeFileSync(`./generated/query.graphql`, queryTemplate(jsSchema))
    writeFileSync(`./generated/mutation.graphql`, mutationTemplate(jsSchema))

*Create TypeORM instance with generated Entities. Example using graphql-yoga*

    import { createConnection, EntitySchema } from 'typeorm
    import { getQueryResolvers, getMutationResolvers, getRepositories,  getEntitySchemas } from 'graphgentypeorm'


    /** Assuming You have jsSchema already created from above */
    const connection = createConnection({
        type: {YOUR_TYPE},
        host: {YOUR_HOST}",
        port: {YOUR_PORT},
        username: {YOUR_USERNAME},
        password: {YOUR_PASSWORD},
        database: {YOUR_DATABASE},
        entities: getEntitySchemas(jsSchema).map(schema => new EntitySchema(schema)),
        synchronize: true
    }).then(connection => {
        const server = new GraphQLServer({
            typeDefs: [
                importSchema('./path/to/schema.graphql'),
                readFileSync('./generated/mutation.graphql').toString(),
                readFileSync('./generated/query.graphql').toString()
            ],
            resolvers: {...getQueryResolvers(jsSchema), ...getMutationResolvers(jsSchema)},
            /** Must add repositories and connection to context */
            context: {
                repositories: getRepositories({schema: jsSchema, connection}),
                connection
            },
            /** Must add if using relationships in schema.graphql.
            schemaDirectives: {
                OneToOne,
                OneToMany,
                ManyToOne,
                ManyToMany,
            }

        })
        server.start(() => console.log('Server is running on localhost:4000'))
    })
