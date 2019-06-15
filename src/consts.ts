export const COLUMN = 'Column'
export const ENTITY = 'Entity'
export const PRIMARY_COLUMN = 'PrimaryColumn'
export const PRIMARY_GENERATED_COLUMN = 'PrimaryGeneratedColumn'
export const RELATIONSHIP = 'Relationship'

export const typeOrmToTs: Record<string, string> = {
    int: 'number',
    string: 'string',
    float: 'number',
    varchar: 'string'
}