# graphGenTypeORM
Automatically create TypeORM EntitySchema's, GraphQL resolvers, GraphQL Mutation, Query, and Input schemas from TypeORM annotated(directive) types.

# Install
    npm i graphql_typeorm

# Example Schemas decorated.

    type Author @Entity {
        id: Int! @PrimaryGeneratedColumn
        name: String! @Column
        rating: Float @Column(type: "float")
        books: [Book] @Relationship(type: "one-to-many", target: "Book")
    }

    type Book @Entity {
        id: Int! @Column(type: "int", primary: true, generated: true)
        title: String! @Column(type: "string")
        author: [Author]! @Relationship(type: "many-to-one", target: "Author")
    }
    
# Directives
| Name                    | Options | Description |
|-------------------------|---------|-------------|
| @Entity                 | [EntitySchemaOptions](https://github.com/jjwtay/graphGenTypeorm/blob/master/schemas/entity.graphql)| Determines what GraphQL Types get converted to TypeORM EntitySchema Models.|
| @Column                 | [EntitySchemaColumnOptions](https://github.com/jjwtay/graphGenTypeorm/blob/master/schemas/column.graphql)| Determines what model fields are stored in database.|
| @Relationship           | [EntitySchemaRelationshipOptions](https://github.com/typeorm/typeorm/blob/master/src/entity-schema/EntitySchemaRelationOptions.ts)| Determines that a relationship field should be created.|
| @PrimaryColumn | [EntitySchemaColumnOptions](https://github.com/jjwtay/graphGenTypeorm/blob/master/schemas/column.graphql)| Shortcut for Column type with primary = true |
| @PrimaryGeneratedColumn | [EntitySchemaColumnOptions](https://github.com/jjwtay/graphGenTypeorm/blob/master/schemas/column.graphql)| Shortcut for Column type with primary = true and generated = true| 
| @CreateDateColumn | [EntitySchemaColumnOptions](https://github.com/jjwtay/graphGenTypeorm/blob/master/schemas/column.graphql)| Shortcut for Column type with type = 'timestamp with time zone' and createDate = true |
| @UpdateDateColumn | [EntitySchemaColumnOptions](https://github.com/jjwtay/graphGenTypeorm/blob/master/schemas/column.graphql) | Shortcut for Column type with type = 'timestamp with time zone' and updateDate = true |

# Example usage CLI
    npx graphql_typeorm dir=./schemas outDir=./generated

# CLI Options (either file or dir must be included)
| Option | Default | Description |
|--------|---------|-------------|
| file   |         | .graphql schema file to generate from |
| dir    |         | Directory to find .graphql files to generate from |
| outDir | ./generated | Directory to write generated files to |
| format |   ts    | Output format. Valid options = ts/js |
| contextPath | ../context | Override with custom context type. Currently must include field connection: Connection.  Note:  path must be relative to generated root directory. |

# Example usage code
See src/cli.ts

# Example outputs
Located within folders generatedTS and generatedJS.

# TODO
- Handle resolvers as normal vs connections. (Naming convention? New directive? Either?)
- Finish adding/handling EntitySchemaOptions (indices, etc...)