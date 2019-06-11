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
| @Entity                 | [EntitySchemaOptions](https://github.com/typeorm/typeorm/blob/master/src/entity-schema/EntitySchemaOptions.ts)| Determines what GraphQL Types get converted to TypeORM EntitySchema Models.|
| @Column                 | [EntitySchemaColumnOptions](https://github.com/typeorm/typeorm/blob/master/src/entity-schema/EntitySchemaColumnOptions.ts)| Determines what model fields are stored in database.|
| @Relationship           | [EntitySchemaRelationshipOptions](https://github.com/typeorm/typeorm/blob/master/src/entity-schema/EntitySchemaRelationOptions.ts)| Determines that a relationship field should be created.|
| @PrimaryGeneratedColumn | [EntitySchemaColumnOptions](https://github.com/typeorm/typeorm/blob/master/src/entity-schema/EntitySchemaColumnOptions.ts)| Shortcut for Column type with primary = true and generated = true| 

# Example usage CLI
    npx graphql_typeorm dir=./schemas outDir=./generated

# CLI Options (either file or dir must be included)
| Option | Default | Description |
|--------|---------|-------------|
| file   |         | .graphql schema file to generate from |
| dir    |         | Directory to find .graphql files to generate from |
| outDir | ./generated | Directory to write generated files to |
| format |   ts    | Output format. Valid options = ts/js

# Example usage code
See src/cli.ts

# Example output
Run this command and check newly generated ./generated directory.

    npx graphql_typeorm dir=./node_modules/graphql_typeorm/examples outDir=./generated