export const COLUMN = 'Column'
export const CREATE_DATE_COLUMN = 'CreateDateColumn'
export const ENTITY = 'Entity'
export const PRIMARY_COLUMN = 'PrimaryColumn'
export const PRIMARY_GENERATED_COLUMN = 'PrimaryGeneratedColumn'
export const RELATIONSHIP = 'Relationship'
export const UPDATE_DATE_COLUMN = 'UpdateDateColumn'

export const typeOrmToTs: Record<string, string> = {
    int: 'number',
    string: 'string',
    float: 'number',
    varchar: 'string',
    'timestamp with time zone': 'Date',
    timestamp: 'Date'
}