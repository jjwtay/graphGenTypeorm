# graphGenTypeORM
Automatically create TypeORM EntitySchema's, GraphQL resolvers, GraphQL Mutation, Query, and Input schemas from TypeORM annotated(directive) types.

# Install
    npm i graphql_typeorm

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